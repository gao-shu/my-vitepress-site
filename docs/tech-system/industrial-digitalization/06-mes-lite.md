# 06-轻量MES能力实现

> **前置知识**: [05-业务抽象设计](./05-business-abstract.md)

## 🎯 学习目标

将业务模型落地为可运行的 MES 功能模块：
- ✅ 生产计划与排产
- ✅ 工艺路线管理
- ✅ 质量检验流程
- ✅ 物料追溯实现
- ✅ RuoYi-Pro 集成实战

---

## 🏗️ 模块划分

```
MES Lite
├─ 生产管理
│  ├─ 工单管理 (WorkOrderController)
│  ├─ 生产计划 (ProductionPlanController)
│  └─ 工艺路线 (ProcessRouteController)
├─ 质量管理
│  ├─ 检验标准 (InspectionStandardController)
│  ├─ 检验记录 (InspectionRecordController)
│  └─ 不良品分析 (DefectAnalysisController)
├─ 物料管理
│  ├─ 物料批次 (MaterialBatchController)
│  ├─ 领料退料 (MaterialIssueController)
│  └─ 库存查询 (InventoryController)
└─ 追溯管理
   ├─ 正向追溯 (ForwardTraceController)
   └─ 反向追溯 (BackwardTraceController)
```

---

## 📋 生产管理模块

### 1. 工单管理

#### 1.1 Controller 层

```java
@RestController
@RequestMapping("/mes/work-order")
public class WorkOrderController {
    
    @Autowired
    private IWorkOrderService workOrderService;
    
    /**
     * 分页查询工单列表
     */
    @GetMapping("/list")
    public TableDataInfo list(WorkOrderQuery query) {
        startPage();
        List<WorkOrderVO> list = workOrderService.queryList(query);
        return getDataTable(list);
    }
    
    /**
     * 创建工单
     */
    @PostMapping
    public AjaxResult add(@Validated @RequestBody WorkOrderCreateDTO dto) {
        workOrderService.createWorkOrder(dto);
        return success();
    }
    
    /**
     * 审核工单
     */
    @PutMapping("/{id}/approve")
    public AjaxResult approve(@PathVariable String id, 
                              @RequestParam Boolean approved,
                              @RequestParam(required = false) String remark) {
        workOrderService.approve(id, approved, remark);
        return success();
    }
    
    /**
     * 下发工单
     */
    @PutMapping("/{id}/release")
    public AjaxResult release(@PathVariable String id) {
        workOrderService.release(id);
        return success();
    }
    
    /**
     * 开始执行
     */
    @PutMapping("/{id}/start")
    public AjaxResult start(@PathVariable String id) {
        workOrderService.startExecution(id);
        return success();
    }
    
    /**
     * 完成工单
     */
    @PutMapping("/{id}/complete")
    public AjaxResult complete(@PathVariable String id,
                               @RequestParam Integer completedQuantity,
                               @RequestParam Integer defectiveQuantity) {
        workOrderService.complete(id, completedQuantity, defectiveQuantity);
        return success();
    }
    
    /**
     * 查询工单详情（含工序进度）
     */
    @GetMapping("/{id}")
    public AjaxResult getInfo(@PathVariable String id) {
        WorkOrderDetailVO detail = workOrderService.getDetail(id);
        return success(detail);
    }
    
    /**
     * 导出工单
     */
    @PostMapping("/export")
    public void export(HttpServletResponse response, WorkOrderQuery query) {
        List<WorkOrderExportVO> list = workOrderService.exportList(query);
        ExcelUtil<WorkOrderExportVO> util = new ExcelUtil<>(WorkOrderExportVO.class);
        util.exportExcel(response, list, "工单数据");
    }
}
```

#### 1.2 Service 层

```java
@Service
public class WorkOrderServiceImpl implements IWorkOrderService {
    
    @Autowired
    private WorkOrderMapper workOrderMapper;
    
    @Autowired
    private WorkOrderProcessMapper processMapper;
    
    @Autowired
    private WorkOrderStateMachine stateMachine;
    
    @Autowired
    private ProcessRouteService processRouteService;
    
    @Override
    @Transactional
    public void createWorkOrder(WorkOrderCreateDTO dto) {
        // 1. 生成工单号
        String orderNo = generateOrderNo();
        
        // 2. 创建工单
        WorkOrder workOrder = new WorkOrder();
        BeanUtils.copyProperties(dto, workOrder);
        workOrder.setOrderNo(orderNo);
        workOrder.setStatus("DRAFT");
        workOrder.setCompletedQuantity(0);
        workOrder.setDefectiveQuantity(0);
        workOrder.setCreatorId(SecurityUtils.getUserId().toString());
        
        workOrderMapper.insert(workOrder);
        
        // 3. 根据工艺路线生成工序
        if (dto.getProcessRouteId() != null) {
            generateProcesses(workOrder.getId(), dto.getProcessRouteId());
        }
        
        log.info("创建工单成功: {}", orderNo);
    }
    
    @Override
    @Transactional
    public void approve(String id, Boolean approved, String remark) {
        if (approved) {
            stateMachine.transition(id, "APPROVED", 
                SecurityUtils.getUserId().toString(), remark);
        } else {
            stateMachine.transition(id, "REJECTED", 
                SecurityUtils.getUserId().toString(), remark);
        }
    }
    
    @Override
    @Transactional
    public void release(String id) {
        stateMachine.transition(id, "RELEASED", 
            SecurityUtils.getUserId().toString(), "工单下发");
    }
    
    @Override
    @Transactional
    public void startExecution(String id) {
        stateMachine.transition(id, "IN_PROGRESS", 
            SecurityUtils.getUserId().toString(), "开始执行");
    }
    
    @Override
    @Transactional
    public void complete(String id, Integer completedQuantity, Integer defectiveQuantity) {
        WorkOrder workOrder = workOrderMapper.selectById(id);
        
        workOrder.setCompletedQuantity(completedQuantity);
        workOrder.setDefectiveQuantity(defectiveQuantity);
        
        stateMachine.transition(id, "COMPLETED", 
            SecurityUtils.getUserId().toString(), 
            String.format("完成：合格%d件，不良%d件", completedQuantity, defectiveQuantity));
    }
    
    @Override
    public WorkOrderDetailVO getDetail(String id) {
        WorkOrder workOrder = workOrderMapper.selectById(id);
        
        if (workOrder == null) {
            throw new BusinessException("工单不存在");
        }
        
        WorkOrderDetailVO vo = new WorkOrderDetailVO();
        BeanUtils.copyProperties(workOrder, vo);
        
        // 查询工序列表
        List<WorkOrderProcess> processes = processMapper.selectByWorkOrderId(id);
        vo.setProcesses(processes.stream()
            .map(this::convertToProcessVO)
            .collect(Collectors.toList()));
        
        // 计算进度
        long completedCount = processes.stream()
            .filter(p -> "COMPLETED".equals(p.getStatus()))
            .count();
        
        vo.setProgress(processes.isEmpty() ? 0 : 
            (int) (completedCount * 100 / processes.size()));
        
        return vo;
    }
    
    private void generateProcesses(String workOrderId, String processRouteId) {
        List<ProcessRouteStep> steps = processRouteService.getSteps(processRouteId);
        
        for (int i = 0; i < steps.size(); i++) {
            ProcessRouteStep step = steps.get(i);
            
            WorkOrderProcess process = new WorkOrderProcess();
            process.setWorkOrderId(workOrderId);
            process.setProcessId(step.getProcessId());
            process.setProcessName(step.getProcessName());
            process.setSequence(i + 1);
            process.setWorkstationId(step.getWorkstationId());
            process.setStandardTime(step.getStandardTime());
            process.setStatus("PENDING");
            
            processMapper.insert(process);
        }
    }
    
    private String generateOrderNo() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String sequence = String.format("%03d", getNextSequence(date));
        return "WO" + date + sequence;
    }
    
    private int getNextSequence(String date) {
        // 从 Redis 获取自增序列
        String key = "work_order:seq:" + date;
        return redisTemplate.opsForValue().increment(key).intValue();
    }
}
```

---

### 2. 工艺路线管理

#### 2.1 工艺路线设计器（前端）

```vue
<!-- ProcessRouteDesigner.vue -->
<template>
  <div class="route-designer">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>工艺路线设计</span>
          <el-button type="primary" @click="saveRoute">保存</el-button>
        </div>
      </template>
      
      <!-- 左侧：工序库 -->
      <el-aside width="250px" class="process-library">
        <h4>工序库</h4>
        <el-tree
          :data="processLibrary"
          :props="{ label: 'name', children: 'children' }"
          draggable
          @node-drag-start="handleDragStart"
        />
      </el-aside>
      
      <!-- 中间：画布 -->
      <el-main class="canvas-area">
        <div ref="graphContainer" class="graph-container"></div>
      </el-main>
      
      <!-- 右侧：属性面板 -->
      <el-aside width="300px" class="property-panel">
        <h4>属性配置</h4>
        <el-form v-if="selectedNode" :model="selectedNode" label-width="100px">
          <el-form-item label="工序名称">
            <el-input v-model="selectedNode.name" />
          </el-form-item>
          
          <el-form-item label="标准工时">
            <el-input-number
              v-model="selectedNode.standardTime"
              :min="1"
              :step="10"
            />
            <span>秒</span>
          </el-form-item>
          
          <el-form-item label="工位">
            <el-select v-model="selectedNode.workstationId">
              <el-option
                v-for="ws in workstations"
                :key="ws.id"
                :label="ws.name"
                :value="ws.id"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="设备要求">
            <el-select v-model="selectedNode.deviceType" multiple>
              <el-option label="CNC" value="CNC" />
              <el-option label="Robot" value="ROBOT" />
              <el-option label="Manual" value="MANUAL" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-aside>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Graph } from '@antv/x6';

const graphContainer = ref(null);
let graph = null;

const processLibrary = ref([
  {
    id: 'group_1',
    name: '机加工',
    children: [
      { id: 'proc_1', name: '车削', standardTime: 120 },
      { id: 'proc_2', name: '铣削', standardTime: 180 },
      { id: 'proc_3', name: '钻孔', standardTime: 60 }
    ]
  },
  {
    id: 'group_2',
    name: '装配',
    children: [
      { id: 'proc_4', name: '组件装配', standardTime: 300 },
      { id: 'proc_5', name: '总装', standardTime: 600 }
    ]
  },
  {
    id: 'group_3',
    name: '质检',
    children: [
      { id: 'proc_6', name: '尺寸检测', standardTime: 90 },
      { id: 'proc_7', name: '功能测试', standardTime: 150 }
    ]
  }
]);

const workstations = ref([]);
const selectedNode = ref(null);

onMounted(() => {
  initGraph();
  loadWorkstations();
});

const initGraph = () => {
  graph = new Graph({
    container: graphContainer.value,
    width: 800,
    height: 600,
    grid: {
      size: 10,
      visible: true
    },
    connecting: {
      router: 'manhattan',
      connector: {
        name: 'rounded',
        args: {
          radius: 8
        }
      },
      anchor: 'center',
      connectionPoint: 'boundary',
      allowBlank: false,
      snap: {
        radius: 20
      },
      createEdge() {
        return graph.createEdge({
          shape: 'edge',
          attrs: {
            line: {
              stroke: '#5F95FF',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8
              }
            }
          }
        });
      }
    }
  });
  
  // 监听节点选择
  graph.on('cell:click', ({ cell }) => {
    if (cell.isNode()) {
      selectedNode.value = cell.getData();
    }
  });
  
  // 添加示例节点
  addNode('开始', 100, 100);
  addNode('车削', 300, 100);
  addNode('质检', 500, 100);
  addNode('结束', 700, 100);
  
  // 添加连线
  graph.addEdge({ source: 'node1', target: 'node2' });
  graph.addEdge({ source: 'node2', target: 'node3' });
  graph.addEdge({ source: 'node3', target: 'node4' });
};

const addNode = (label, x, y) => {
  const node = graph.addNode({
    x,
    y,
    width: 100,
    height: 40,
    label,
    attrs: {
      body: {
        fill: '#EFF4FF',
        stroke: '#5F95FF',
        strokeWidth: 2,
        rx: 6,
        ry: 6
      },
      label: {
        fill: '#262626',
        fontSize: 14
      }
    },
    data: {
      name: label,
      standardTime: 60,
      workstationId: null,
      deviceType: []
    }
  });
  
  node.id = `node${graph.getNodes().length}`;
};

const handleDragStart = (node) => {
  // 拖拽工序到画布
  console.log('Drag started:', node);
};

const saveRoute = async () => {
  const nodes = graph.getNodes().map(node => ({
    id: node.id,
    ...node.getData(),
    position: node.getPosition()
  }));
  
  const edges = graph.getEdges().map(edge => ({
    source: edge.getSourceCellId(),
    target: edge.getTargetCellId()
  }));
  
  try {
    await fetch('/mes/process-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '新工艺路线',
        nodes,
        edges
      })
    });
    
    ElMessage.success('保存成功');
  } catch (error) {
    ElMessage.error('保存失败');
  }
};

const loadWorkstations = async () => {
  const response = await fetch('/mes/workstation/list');
  const data = await response.json();
  workstations.value = data.rows;
};
</script>

<style scoped>
.route-designer {
  display: flex;
  height: calc(100vh - 100px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.process-library, .property-panel {
  padding: 10px;
  overflow-y: auto;
}

.canvas-area {
  padding: 0;
}

.graph-container {
  width: 100%;
  height: 100%;
  border: 1px solid #DCDFE6;
}
</style>
```

---

## 🔍 质量管理模块

### 1. 检验流程

```
来料检验(IQC) → 入库 → 领料 → 过程检验(IPQC) → 成品检验(FQC) → 出库
```

### 2. 检验记录

```java
@RestController
@RequestMapping("/mes/inspection")
public class InspectionController {
    
    @Autowired
    private IInspectionService inspectionService;
    
    /**
     * 提交检验记录
     */
    @PostMapping
    public AjaxResult submit(@Validated @RequestBody InspectionSubmitDTO dto) {
        inspectionService.submitInspection(dto);
        return success();
    }
    
    /**
     * 查询检验报告
     */
    @GetMapping("/report/{reportNo}")
    public AjaxResult getReport(@PathVariable String reportNo) {
        InspectionReportVO report = inspectionService.getReport(reportNo);
        return success(report);
    }
    
    /**
     * 不良品统计
     */
    @GetMapping("/defect/statistics")
    public AjaxResult defectStatistics(
        @RequestParam LocalDate startDate,
        @RequestParam LocalDate endDate
    ) {
        DefectStatisticsVO stats = inspectionService.getDefectStatistics(
            startDate, endDate
        );
        return success(stats);
    }
}

@Service
public class InspectionServiceImpl implements IInspectionService {
    
    @Override
    @Transactional
    public void submitInspection(InspectionSubmitDTO dto) {
        // 1. 创建检验报告
        InspectionReport report = new InspectionReport();
        report.setReportNo(generateReportNo());
        report.setType(dto.getType());
        report.setProductId(dto.getProductId());
        report.setBatchNo(dto.getBatchNo());
        report.setInspectionItems(JSON.toJSONString(dto.getItems()));
        report.setConclusion(calculateConclusion(dto.getItems()));
        report.setInspectorId(SecurityUtils.getUserId().toString());
        report.setInspectTime(LocalDateTime.now());
        
        inspectionReportMapper.insert(report);
        
        // 2. 如果不合格，创建不合格品记录
        if ("FAIL".equals(report.getConclusion())) {
            createDefectRecord(dto, report.getId());
        }
        
        // 3. 更新生产追溯记录
        if (dto.getProductSerialNo() != null) {
            updateTraceabilityInspectionResult(
                dto.getProductSerialNo(), 
                report.getId(),
                report.getConclusion()
            );
        }
    }
    
    private String calculateConclusion(List<InspectionItem> items) {
        boolean allPass = items.stream()
            .allMatch(item -> "PASS".equals(item.getResult()));
        
        return allPass ? "PASS" : "FAIL";
    }
    
    private void createDefectRecord(InspectionSubmitDTO dto, String reportId) {
        DefectRecord defect = new DefectRecord();
        defect.setReportId(reportId);
        defect.setProductId(dto.getProductId());
        defect.setBatchNo(dto.getBatchNo());
        defect.setDefectType(dto.getDefectType());
        defect.setDefectDescription(dto.getDefectDescription());
        defect.setQuantity(dto.getDefectiveQuantity());
        defect.setHandlerId(SecurityUtils.getUserId().toString());
        defect.setStatus("PENDING");
        
        defectRecordMapper.insert(defect);
    }
}
```

---

## 📦 物料追溯模块

### 1. 领料单

```java
@RestController
@RequestMapping("/mes/material")
public class MaterialIssueController {
    
    @Autowired
    private IMaterialIssueService materialIssueService;
    
    /**
     * 创建领料单
     */
    @PostMapping("/issue")
    public AjaxResult issue(@Validated @RequestBody MaterialIssueDTO dto) {
        materialIssueService.issueMaterial(dto);
        return success();
    }
    
    /**
     * 退料
     */
    @PostMapping("/return")
    public AjaxResult returnMaterial(@Validated @RequestBody MaterialReturnDTO dto) {
        materialIssueService.returnMaterial(dto);
        return success();
    }
    
    /**
     * 查询物料使用记录
     */
    @GetMapping("/usage/{batchNo}")
    public AjaxResult getUsage(@PathVariable String batchNo) {
        List<MaterialUsageVO> usage = materialIssueService.getUsageByBatch(batchNo);
        return success(usage);
    }
}

@Service
public class MaterialIssueServiceImpl implements IMaterialIssueService {
    
    @Override
    @Transactional
    public void issueMaterial(MaterialIssueDTO dto) {
        // 1. 创建领料单
        MaterialIssue issue = new MaterialIssue();
        issue.setIssueNo(generateIssueNo());
        issue.setWorkOrderId(dto.getWorkOrderId());
        issue.setMaterialCode(dto.getMaterialCode());
        issue.setBatchNo(dto.getBatchNo());
        issue.setQuantity(dto.getQuantity());
        issue.setIssuerId(SecurityUtils.getUserId().toString());
        issue.setIssueTime(LocalDateTime.now());
        issue.setStatus("ISSUED");
        
        materialIssueMapper.insert(issue);
        
        // 2. 扣减库存
        inventoryService.deductStock(dto.getMaterialCode(), dto.getBatchNo(), dto.getQuantity());
        
        // 3. 记录到生产追溯
        recordMaterialUsage(dto.getWorkOrderId(), dto.getBatchNo());
    }
    
    private void recordMaterialUsage(String workOrderId, String batchNo) {
        ProductionTraceability trace = traceabilityMapper.selectByWorkOrder(workOrderId);
        
        if (trace != null) {
            // 追加物料批次
            List<String> batchIds = JSON.parseArray(
                trace.getMaterialBatchIds() != null ? 
                trace.getMaterialBatchIds() : "[]", 
                String.class
            );
            
            batchIds.add(batchNo);
            trace.setMaterialBatchIds(JSON.toJSONString(batchIds));
            
            traceabilityMapper.updateById(trace);
        }
    }
}
```

---

## 🔗 追溯查询接口

```java
@RestController
@RequestMapping("/mes/traceability")
public class TraceabilityController {
    
    @Autowired
    private ITraceabilityService traceabilityService;
    
    /**
     * 正向追溯：物料 → 成品
     */
    @GetMapping("/forward")
    public AjaxResult forwardTrace(@RequestParam String batchNo) {
        ForwardTraceResult result = traceabilityService.forwardTrace(batchNo);
        return success(result);
    }
    
    /**
     * 反向追溯：成品 → 物料
     */
    @GetMapping("/backward")
    public AjaxResult backwardTrace(@RequestParam String serialNo) {
        BackwardTraceResult result = traceabilityService.backwardTrace(serialNo);
        return success(result);
    }
    
    /**
     * 全链路追溯图
     */
    @GetMapping("/full-chain/{serialNo}")
    public AjaxResult fullChainTrace(@PathVariable String serialNo) {
        FullChainTraceVO chain = traceabilityService.getFullChainTrace(serialNo);
        return success(chain);
    }
}
```

---

## 🚀 RuoYi-Pro 集成要点

### 1. 菜单配置

```sql
-- 插入 MES 菜单
INSERT INTO sys_menu VALUES (2000, 'MES管理', 0, 1, 'mes', NULL, '', 1, 0, 'M', '0', '0', '', 'guide', 1, 103, 1, SYSDATE(), NULL, NULL, 'MES管理目录');

INSERT INTO sys_menu VALUES (2001, '工单管理', 2000, 1, 'work-order', 'mes/work-order/index', '', 1, 0, 'C', '0', '0', 'mes:work-order:list', 'form', 1, 103, 1, SYSDATE(), NULL, NULL, '工单管理菜单');

INSERT INTO sys_menu VALUES (2002, '工艺路线', 2000, 2, 'process-route', 'mes/process-route/index', '', 1, 0, 'C', '0', '0', 'mes:process-route:list', 'tree-table', 1, 103, 1, SYSDATE(), NULL, NULL, '工艺路线菜单');

INSERT INTO sys_menu VALUES (2003, '质量管理', 2000, 3, 'quality', 'mes/quality/index', '', 1, 0, 'C', '0', '0', 'mes:quality:list', 'skill', 1, 103, 1, SYSDATE(), NULL, NULL, '质量管理菜单');

INSERT INTO sys_menu VALUES (2004, '追溯查询', 2000, 4, 'traceability', 'mes/traceability/index', '', 1, 0, 'C', '0', '0', 'mes:traceability:list', 'search', 1, 103, 1, SYSDATE(), NULL, NULL, '追溯查询菜单');
```

### 2. 权限配置

```java
// Controller 方法上添加权限注解
@PreAuthorize("@ss.hasPermi('mes:work-order:add')")
@PostMapping
public AjaxResult add(@RequestBody WorkOrderCreateDTO dto) {
    // ...
}

@PreAuthorize("@ss.hasPermi('mes:work-order:edit')")
@PutMapping
public AjaxResult edit(@RequestBody WorkOrderUpdateDTO dto) {
    // ...
}

@PreAuthorize("@ss.hasPermi('mes:work-order:remove')")
@DeleteMapping("/{ids}")
public AjaxResult remove(@PathVariable String[] ids) {
    // ...
}
```

### 3. 字典配置

```sql
-- 工单状态字典
INSERT INTO sys_dict_type VALUES (100, '工单状态', 'work_order_status', 0, 1, 1, SYSDATE(), NULL, NULL, '工单状态列表');

INSERT INTO sys_dict_data VALUES (1001, 1, '草稿', 'DRAFT', 'work_order_status', '', 'info', 'N', 0, 1, SYSDATE(), NULL, NULL, '草稿状态');
INSERT INTO sys_dict_data VALUES (1002, 2, '已审核', 'APPROVED', 'work_order_status', '', 'success', 'N', 0, 1, SYSDATE(), NULL, NULL, '已审核状态');
INSERT INTO sys_dict_data VALUES (1003, 3, '已下发', 'RELEASED', 'work_order_status', '', 'primary', 'N', 0, 1, SYSDATE(), NULL, NULL, '已下发状态');
INSERT INTO sys_dict_data VALUES (1004, 4, '执行中', 'IN_PROGRESS', 'work_order_status', '', 'warning', 'N', 0, 1, SYSDATE(), NULL, NULL, '执行中状态');
INSERT INTO sys_dict_data VALUES (1005, 5, '已完成', 'COMPLETED', 'work_order_status', '', 'success', 'N', 0, 1, SYSDATE(), NULL, NULL, '已完成状态');

-- 设备类型字典
INSERT INTO sys_dict_type VALUES (101, '设备类型', 'device_type', 0, 1, 1, SYSDATE(), NULL, NULL, '设备类型列表');

INSERT INTO sys_dict_data VALUES (1011, 1, 'CNC机床', 'CNC', 'device_type', '', '', 'N', 0, 1, SYSDATE(), NULL, NULL, 'CNC机床');
INSERT INTO sys_dict_data VALUES (1012, 2, '工业机器人', 'ROBOT', 'device_type', '', '', 'N', 0, 1, SYSDATE(), NULL, NULL, '工业机器人');
INSERT INTO sys_dict_data VALUES (1013, 3, '传感器', 'SENSOR', 'device_type', '', '', 'N', 0, 1, SYSDATE(), NULL, NULL, '传感器');
```

---

## 💡 最佳实践

### 1. 工单编号规则

```java
/**
 * 工单号规则：WO + 日期(yyyyMMdd) + 流水号(3位)
 * 示例：WO20240101001
 */
private String generateOrderNo() {
    String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    String key = "work_order:no:" + date;
    
    Long seq = redisTemplate.opsForValue().increment(key);
    
    // 设置过期时间为第二天凌晨
    redisTemplate.expireAt(key, LocalDate.now().plusDays(1).atStartOfDay());
    
    return "WO" + date + String.format("%03d", seq);
}
```

### 2. 并发控制

```java
/**
 * 防止同一工单被多人同时操作
 */
@RedisLock(key = "'work_order:lock:' + #id", expire = 10)
@Transactional
public void complete(String id, Integer completedQuantity, Integer defectiveQuantity) {
    // 业务逻辑
}
```

### 3. 数据权限

```java
/**
 * 数据权限：操作工只能看到自己的工单
 */
@DataScope(deptAlias = "d", userAlias = "u")
public List<WorkOrderVO> queryList(WorkOrderQuery query) {
    return workOrderMapper.selectList(query);
}
```

---

## 🔗 相关资源

- [RuoYi-Pro 官方文档](https://plus-doc.dromara.org/)
- [AntV X6 流程图](https://x6.antv.vision/)

---

**下一步**: 学习 [07-完整系统设计与实现](./07-full-system.md)，了解整体部署架构与性能优化。
