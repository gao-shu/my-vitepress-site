# 05-业务抽象设计（核心🔥）

> **前置知识**: [04-工业可视化（SCADA）](./04-scada-visualization.md)

## 🎯 学习目标

掌握工业数字化系统的**核心业务建模**能力：
- ✅ 设备模型抽象与层级关系
- ✅ 工单流程设计与状态机
- ✅ 生产节拍计算与瓶颈分析
- ✅ OEE（设备综合效率）深度解析
- ✅ 质量追溯体系设计

> 💡 **本章是整个系列的灵魂**，理解了业务抽象，才能设计出真正可用的系统。

---

## 🏭 业务场景梳理

在开始编码前，先明确我们要解决的业务问题：

### 典型中小企业制造场景

```
某机械加工厂有 3 条产线，每条产线包含：
- 5 台 CNC 机床
- 2 台工业机器人
- 1 台质检设备

管理层关心的问题：
1. 哪些设备在运行？哪些停机了？为什么停机？
2. 今天的产量达标了吗？哪条产线效率最高？
3. 设备 OEE 是多少？如何提升？
4. 出现不良品时，能追溯到哪个批次、哪台设备、哪个操作工吗？
5. 下个月的产能规划怎么做？
```

**我们的任务**: 将这些业务问题转化为数据模型和算法。

---

## 📦 核心领域模型

### 1. 设备模型设计

#### 1.1 设备层级关系

```
工厂 (Factory)
  └─ 车间 (Workshop)
      └─ 产线 (ProductionLine)
          └─ 工位 (Workstation)
              └─ 设备 (Device)
                  └─ 测点 (DataPoint)
```

#### 1.2 数据库表设计

```sql
-- 工厂表
CREATE TABLE factory (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address VARCHAR(200),
    manager VARCHAR(50),
    phone VARCHAR(20),
    status TINYINT DEFAULT 1, -- 1:启用 0:停用
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 车间表
CREATE TABLE workshop (
    id VARCHAR(32) PRIMARY KEY,
    factory_id VARCHAR(32) NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    manager VARCHAR(50),
    sort_order INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    FOREIGN KEY (factory_id) REFERENCES factory(id)
);

-- 产线表
CREATE TABLE production_line (
    id VARCHAR(32) PRIMARY KEY,
    workshop_id VARCHAR(32) NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    planned_capacity INT, -- 计划产能（件/小时）
    cycle_time INT, -- 标准节拍（秒）
    status TINYINT DEFAULT 1,
    FOREIGN KEY (workshop_id) REFERENCES workshop(id)
);

-- 工位表
CREATE TABLE workstation (
    id VARCHAR(32) PRIMARY KEY,
    production_line_id VARCHAR(32) NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    sequence INT, -- 工序顺序
    standard_time INT, -- 标准工时（秒）
    FOREIGN KEY (production_line_id) REFERENCES production_line(id)
);

-- 设备表（核心）
CREATE TABLE device (
    id VARCHAR(32) PRIMARY KEY,
    workstation_id VARCHAR(32),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50), -- 设备类型：CNC、Robot、Sensor
    brand VARCHAR(50), -- 品牌
    model VARCHAR(50), -- 型号
    purchase_date DATE, -- 采购日期
    install_location VARCHAR(100), -- 安装位置
    
    -- 通信配置
    protocol_type VARCHAR(20), -- MODBUS_TCP, S7, OPC_UA, MQTT
    ip_address VARCHAR(50),
    port INT,
    slave_id INT,
    
    -- 状态管理
    status TINYINT DEFAULT 1, -- 1:在线 0:离线 2:维护 3:报废
    run_status TINYINT DEFAULT 0, -- 0:停机 1:运行 2:待机 3:告警
    
    -- 责任人
    operator_id VARCHAR(32), -- 当前操作工
    maintainer_id VARCHAR(32), -- 维护负责人
    
    -- 统计字段（冗余，提高查询性能）
    total_running_hours DECIMAL(10, 2) DEFAULT 0, -- 累计运行时长
    last_maintenance_date DATE, -- 上次维护日期
    next_maintenance_date DATE, -- 下次维护日期
    
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (workstation_id) REFERENCES workstation(id)
);

-- 设备测点表
CREATE TABLE device_data_point (
    id VARCHAR(32) PRIMARY KEY,
    device_id VARCHAR(32) NOT NULL,
    point_name VARCHAR(50) NOT NULL, -- 测点名称：temperature, pressure
    point_code VARCHAR(50) NOT NULL, -- 测点编码：T001, P001
    data_type VARCHAR(20), -- INTEGER, FLOAT, BOOLEAN, STRING
    unit VARCHAR(20), -- 单位：°C, MPa, A
    min_value FLOAT, -- 最小值
    max_value FLOAT, -- 最大值
    alarm_threshold_high FLOAT, -- 高报警阈值
    alarm_threshold_low FLOAT, -- 低报警阈值
    sampling_interval INT DEFAULT 1, -- 采集间隔（秒）
    enabled TINYINT DEFAULT 1,
    
    UNIQUE KEY uk_device_point (device_id, point_code),
    FOREIGN KEY (device_id) REFERENCES device(id)
);
```

#### 1.3 Java 实体类

```java
@Data
@TableName("device")
public class Device {
    
    @TableId(type = IdType.ASSIGN_ID)
    private String id;
    
    private String workstationId;
    private String name;
    private String code;
    private String type;
    private String brand;
    private String model;
    
    // 通信配置
    private ProtocolType protocolType;
    private String ipAddress;
    private Integer port;
    private Integer slaveId;
    
    // 状态
    private DeviceStatus status;
    private RunStatus runStatus;
    
    // 责任人
    private String operatorId;
    private String maintainerId;
    
    // 统计
    private BigDecimal totalRunningHours;
    private LocalDate lastMaintenanceDate;
    private LocalDate nextMaintenanceDate;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    /**
     * 判断设备是否可用
     */
    public boolean isAvailable() {
        return this.status == DeviceStatus.ONLINE 
            && this.runStatus != RunStatus.MAINTENANCE;
    }
    
    /**
     * 获取设备完整路径
     */
    public String getFullPath() {
        // 通过关联查询获取：工厂 > 车间 > 产线 > 工位 > 设备
        return "Factory-A > Workshop-1 > Line-01 > WS-01 > " + this.name;
    }
}

public enum DeviceStatus {
    ONLINE("在线"),
    OFFLINE("离线"),
    MAINTENANCE("维护中"),
    SCRAPPED("已报废");
    
    private final String description;
    
    DeviceStatus(String description) {
        this.description = description;
    }
}

public enum RunStatus {
    STOPPED("停机"),
    RUNNING("运行中"),
    IDLE("待机"),
    ALARM("告警");
    
    private final String description;
    
    RunStatus(String description) {
        this.description = description;
    }
}
```

---

### 2. 工单管理系统

#### 2.1 工单生命周期

```
创建 → 审核 → 下发 → 执行中 → 完成 → 验收
         ↓                    ↓
       驳回                 不合格返工
```

#### 2.2 工单表设计

```sql
-- 工单表
CREATE TABLE work_order (
    id VARCHAR(32) PRIMARY KEY,
    order_no VARCHAR(50) UNIQUE NOT NULL, -- 工单号：WO20240101001
    product_id VARCHAR(32) NOT NULL, -- 产品 ID
    product_name VARCHAR(100), -- 产品名称（冗余）
    quantity INT NOT NULL, -- 计划数量
    completed_quantity INT DEFAULT 0, -- 已完成数量
    defective_quantity INT DEFAULT 0, -- 不良品数量
    
    -- 工艺路线
    process_route_id VARCHAR(32), -- 工艺路线 ID
    current_process_id VARCHAR(32), -- 当前工序
    
    -- 排产信息
    production_line_id VARCHAR(32), -- 指定产线
    planned_start_time DATETIME, -- 计划开始时间
    planned_end_time DATETIME, -- 计划结束时间
    actual_start_time DATETIME, -- 实际开始时间
    actual_end_time DATETIME, -- 实际结束时间
    
    -- 状态
    status VARCHAR(20) DEFAULT 'DRAFT', -- DRAFT, APPROVED, RELEASED, IN_PROGRESS, COMPLETED, ACCEPTED, REJECTED
    priority TINYINT DEFAULT 2, -- 1:紧急 2:普通 3:低
    
    -- 责任人
    creator_id VARCHAR(32), -- 创建人
    approver_id VARCHAR(32), -- 审核人
    operator_id VARCHAR(32), -- 执行人
    
    -- 备注
    remark TEXT,
    
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_production_line (production_line_id),
    INDEX idx_planned_time (planned_start_time, planned_end_time)
);

-- 工单工序记录表
CREATE TABLE work_order_process (
    id VARCHAR(32) PRIMARY KEY,
    work_order_id VARCHAR(32) NOT NULL,
    process_id VARCHAR(32) NOT NULL, -- 工序 ID
    process_name VARCHAR(100), -- 工序名称
    sequence INT, -- 工序顺序
    workstation_id VARCHAR(32), -- 工位 ID
    device_id VARCHAR(32), -- 设备 ID
    
    -- 时间记录
    start_time DATETIME, -- 开始时间
    end_time DATETIME, -- 结束时间
    duration INT, -- 实际耗时（秒）
    standard_time INT, -- 标准工时（秒）
    
    -- 产出
    output_quantity INT DEFAULT 0, -- 产出数量
    defective_quantity INT DEFAULT 0, -- 不良品数量
    
    -- 状态
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, SKIPPED
    
    -- 操作工
    operator_id VARCHAR(32),
    
    FOREIGN KEY (work_order_id) REFERENCES work_order(id),
    INDEX idx_work_order (work_order_id)
);

-- 工单状态流转日志
CREATE TABLE work_order_status_log (
    id VARCHAR(32) PRIMARY KEY,
    work_order_id VARCHAR(32) NOT NULL,
    from_status VARCHAR(20), -- 原状态
    to_status VARCHAR(20), -- 新状态
    operator_id VARCHAR(32), -- 操作人
    remark VARCHAR(500), -- 备注
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (work_order_id) REFERENCES work_order(id),
    INDEX idx_work_order (work_order_id)
);
```

#### 2.3 工单状态机

```java
@Component
@Slf4j
public class WorkOrderStateMachine {
    
    /**
     * 状态转换规则
     */
    private static final Map<String, Set<String>> TRANSITION_RULES = new HashMap<>();
    
    static {
        // DRAFT -> APPROVED, REJECTED
        TRANSITION_RULES.put("DRAFT", Set.of("APPROVED", "REJECTED"));
        
        // APPROVED -> RELEASED
        TRANSITION_RULES.put("APPROVED", Set.of("RELEASED"));
        
        // RELEASED -> IN_PROGRESS
        TRANSITION_RULES.put("RELEASED", Set.of("IN_PROGRESS"));
        
        // IN_PROGRESS -> COMPLETED, REJECTED
        TRANSITION_RULES.put("IN_PROGRESS", Set.of("COMPLETED", "REJECTED"));
        
        // COMPLETED -> ACCEPTED, REJECTED
        TRANSITION_RULES.put("COMPLETED", Set.of("ACCEPTED", "REJECTED"));
    }
    
    /**
     * 执行状态转换
     */
    @Transactional
    public void transition(String workOrderId, String targetStatus, String operatorId, String remark) {
        WorkOrder workOrder = workOrderMapper.selectById(workOrderId);
        
        if (workOrder == null) {
            throw new BusinessException("工单不存在");
        }
        
        String currentStatus = workOrder.getStatus();
        
        // 验证状态转换是否合法
        if (!canTransition(currentStatus, targetStatus)) {
            throw new BusinessException(
                String.format("不允许从 %s 转换到 %s", currentStatus, targetStatus)
            );
        }
        
        // 更新工单状态
        workOrder.setStatus(targetStatus);
        
        // 特殊逻辑处理
        handleStatusChange(workOrder, currentStatus, targetStatus);
        
        workOrderMapper.updateById(workOrder);
        
        // 记录状态日志
        saveStatusLog(workOrderId, currentStatus, targetStatus, operatorId, remark);
        
        log.info("工单 {} 状态变更: {} -> {}", workOrderId, currentStatus, targetStatus);
    }
    
    private boolean canTransition(String fromStatus, String toStatus) {
        Set<String> allowedTargets = TRANSITION_RULES.get(fromStatus);
        return allowedTargets != null && allowedTargets.contains(toStatus);
    }
    
    private void handleStatusChange(WorkOrder workOrder, String fromStatus, String toStatus) {
        switch (toStatus) {
            case "RELEASED":
                // 下发工单：分配产线和操作工
                assignResources(workOrder);
                break;
                
            case "IN_PROGRESS":
                // 开始执行：记录实际开始时间
                workOrder.setActualStartTime(LocalDateTime.now());
                break;
                
            case "COMPLETED":
                // 完成：记录实际结束时间，计算合格率
                workOrder.setActualEndTime(LocalDateTime.now());
                calculateQualityRate(workOrder);
                break;
                
            case "ACCEPTED":
                // 验收合格：更新库存
                updateInventory(workOrder);
                break;
        }
    }
    
    private void assignResources(WorkOrder workOrder) {
        // 根据工艺路线自动分配产线和工位
        ProcessRoute route = processRouteMapper.selectById(workOrder.getProcessRouteId());
        
        if (route != null) {
            workOrder.setProductionLineId(route.getDefaultProductionLineId());
        }
    }
    
    private void calculateQualityRate(WorkOrder workOrder) {
        int totalQuantity = workOrder.getCompletedQuantity();
        int defectiveQuantity = workOrder.getDefectiveQuantity();
        
        if (totalQuantity > 0) {
            double qualityRate = (double) (totalQuantity - defectiveQuantity) / totalQuantity * 100;
            log.info("工单 {} 合格率: {}%", workOrder.getId(), String.format("%.2f", qualityRate));
        }
    }
    
    private void updateInventory(WorkOrder workOrder) {
        // 调用库存服务，增加成品库存
        inventoryService.addFinishedGoods(
            workOrder.getProductId(),
            workOrder.getCompletedQuantity() - workOrder.getDefectiveQuantity()
        );
    }
    
    private void saveStatusLog(String workOrderId, String fromStatus, 
                               String toStatus, String operatorId, String remark) {
        WorkOrderStatusLog log = new WorkOrderStatusLog();
        log.setWorkOrderId(workOrderId);
        log.setFromStatus(fromStatus);
        log.setToStatus(toStatus);
        log.setOperatorId(operatorId);
        log.setRemark(remark);
        
        statusLogMapper.insert(log);
    }
}
```

---

### 3. OEE（设备综合效率）计算 🔥

#### 3.1 OEE 定义

**OEE = 可用率 × 性能率 × 合格率**

| 指标 | 公式 | 说明 | 世界级水平 |
|------|------|------|-----------|
| **可用率 (Availability)** | 运行时间 / 计划生产时间 | 衡量停机损失 | ≥ 90% |
| **性能率 (Performance)** | (理论周期 × 总产量) / 运行时间 | 衡量速度损失 | ≥ 95% |
| **合格率 (Quality)** | 合格品数量 / 总产量 | 衡量质量损失 | ≥ 99% |
| **OEE** | 可用率 × 性能率 × 合格率 | 综合效率 | ≥ 85% |

#### 3.2 六大损失

```
设备时间损失
├─ 计划停机（休息、会议）→ 不计入 OEE
└─ 非计划停机
   ├─ 故障停机 → 影响可用率
   ├─ 换模调机 → 影响可用率
   ├─ 空转短停 → 影响性能率
   ├─ 降速运行 → 影响性能率
   ├─ 启动废品 → 影响合格率
   └─ 生产废品 → 影响合格率
```

#### 3.3 数据模型

```sql
-- 设备运行记录表
CREATE TABLE device_run_record (
    id VARCHAR(32) PRIMARY KEY,
    device_id VARCHAR(32) NOT NULL,
    work_order_id VARCHAR(32), -- 关联工单
    
    -- 时间段
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    duration INT NOT NULL, -- 时长（秒）
    
    -- 状态
    run_type VARCHAR(20), -- RUNNING:运行, IDLE:待机, DOWN:停机
    down_reason VARCHAR(50), -- 停机原因：FAULT, CHANGE_OVER, NO_MATERIAL
    
    -- 产量
    produced_quantity INT DEFAULT 0, -- 生产数量
    defective_quantity INT DEFAULT 0, -- 不良品数量
    
    -- 理论参数
    theoretical_cycle_time INT, -- 理论节拍（秒/件）
    
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_device_time (device_id, start_time, end_time),
    FOREIGN KEY (device_id) REFERENCES device(id)
);

-- OEE 日报表（预计算，提高查询性能）
CREATE TABLE device_oee_daily (
    id VARCHAR(32) PRIMARY KEY,
    device_id VARCHAR(32) NOT NULL,
    stat_date DATE NOT NULL,
    
    -- 时间统计（秒）
    planned_production_time INT, -- 计划生产时间
    running_time INT, -- 运行时间
    idle_time INT, -- 待机时间
    down_time INT, -- 停机时间
    
    -- 产量统计
    total_quantity INT, -- 总产量
    good_quantity INT, -- 合格品数量
    defective_quantity INT, -- 不良品数量
    
    -- OEE 指标
    availability DECIMAL(5, 4), -- 可用率
    performance DECIMAL(5, 4), -- 性能率
    quality DECIMAL(5, 4), -- 合格率
    oee DECIMAL(5, 4), -- OEE
    
    -- 停机原因统计（JSON）
    down_reasons JSON,
    
    UNIQUE KEY uk_device_date (device_id, stat_date),
    FOREIGN KEY (device_id) REFERENCES device(id)
);
```

#### 3.4 OEE 计算引擎

```java
@Service
@Slf4j
public class OEECalculator {
    
    @Autowired
    private DeviceRunRecordMapper runRecordMapper;
    
    @Autowired
    private DeviceOEEDailyMapper oeeDailyMapper;
    
    /**
     * 计算设备单日 OEE
     */
    @Transactional
    public OEEResult calculateDailyOEE(String deviceId, LocalDate date) {
        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();
        
        // 1. 查询当天的运行记录
        List<DeviceRunRecord> records = runRecordMapper.selectList(
            new LambdaQueryWrapper<DeviceRunRecord>()
                .eq(DeviceRunRecord::getDeviceId, deviceId)
                .ge(DeviceRunRecord::getStartTime, dayStart)
                .lt(DeviceRunRecord::getEndTime, dayEnd)
        );
        
        if (records.isEmpty()) {
            return OEEResult.zero();
        }
        
        // 2. 计算各项时间
        TimeStatistics timeStats = calculateTimeStatistics(records);
        
        // 3. 计算产量统计
        ProductionStatistics prodStats = calculateProductionStatistics(records);
        
        // 4. 计算 OEE 三个指标
        double availability = calculateAvailability(timeStats);
        double performance = calculatePerformance(timeStats, prodStats);
        double quality = calculateQuality(prodStats);
        double oee = availability * performance * quality;
        
        // 5. 保存结果
        DeviceOEEDaily oeeDaily = new DeviceOEEDaily();
        oeeDaily.setDeviceId(deviceId);
        oeeDaily.setStatDate(date);
        oeeDaily.setPlannedProductionTime(timeStats.getPlannedTime());
        oeeDaily.setRunningTime(timeStats.getRunningTime());
        oeeDaily.setIdleTime(timeStats.getIdleTime());
        oeeDaily.setDownTime(timeStats.getDownTime());
        oeeDaily.setTotalQuantity(prodStats.getTotalQuantity());
        oeeDaily.setGoodQuantity(prodStats.getGoodQuantity());
        oeeDaily.setDefectiveQuantity(prodStats.getDefectiveQuantity());
        oeeDaily.setAvailability(BigDecimal.valueOf(availability));
        oeeDaily.setPerformance(BigDecimal.valueOf(performance));
        oeeDaily.setQuality(BigDecimal.valueOf(quality));
        oeeDaily.setOee(BigDecimal.valueOf(oee));
        oeeDaily.setDownReasons(JSON.toJSONString(timeStats.getDownReasonStats()));
        
        oeeDailyMapper.insertOrUpdate(oeeDaily);
        
        log.info("设备 {} 日期 {} OEE: {}% (A:{}% P:{}% Q:{}%)",
            deviceId, date, 
            String.format("%.2f", oee * 100),
            String.format("%.2f", availability * 100),
            String.format("%.2f", performance * 100),
            String.format("%.2f", quality * 100)
        );
        
        return new OEEResult(availability, performance, quality, oee);
    }
    
    /**
     * 计算时间统计
     */
    private TimeStatistics calculateTimeStatistics(List<DeviceRunRecord> records) {
        int runningTime = 0;
        int idleTime = 0;
        int downTime = 0;
        
        Map<String, Integer> downReasonStats = new HashMap<>();
        
        for (DeviceRunRecord record : records) {
            int duration = record.getDuration();
            
            switch (record.getRunType()) {
                case "RUNNING":
                    runningTime += duration;
                    break;
                    
                case "IDLE":
                    idleTime += duration;
                    break;
                    
                case "DOWN":
                    downTime += duration;
                    
                    // 统计停机原因
                    String reason = record.getDownReason() != null ? 
                        record.getDownReason() : "UNKNOWN";
                    downReasonStats.merge(reason, duration, Integer::sum);
                    break;
            }
        }
        
        int plannedTime = runningTime + idleTime + downTime;
        
        return new TimeStatistics(plannedTime, runningTime, idleTime, downTime, downReasonStats);
    }
    
    /**
     * 计算产量统计
     */
    private ProductionStatistics calculateProductionStatistics(List<DeviceRunRecord> records) {
        int totalQuantity = records.stream()
            .mapToInt(DeviceRunRecord::getProducedQuantity)
            .sum();
        
        int defectiveQuantity = records.stream()
            .mapToInt(DeviceRunRecord::getDefectiveQuantity)
            .sum();
        
        int goodQuantity = totalQuantity - defectiveQuantity;
        
        return new ProductionStatistics(totalQuantity, goodQuantity, defectiveQuantity);
    }
    
    /**
     * 计算可用率
     */
    private double calculateAvailability(TimeStatistics timeStats) {
        if (timeStats.getPlannedTime() == 0) {
            return 0;
        }
        
        return (double) timeStats.getRunningTime() / timeStats.getPlannedTime();
    }
    
    /**
     * 计算性能率
     */
    private double calculatePerformance(TimeStatistics timeStats, ProductionStatistics prodStats) {
        if (timeStats.getRunningTime() == 0 || prodStats.getTotalQuantity() == 0) {
            return 0;
        }
        
        // 获取理论节拍（从设备配置或工艺路线）
        int theoreticalCycleTime = getTheoreticalCycleTime();
        
        // 性能率 = (理论周期 × 总产量) / 运行时间
        double idealTime = theoreticalCycleTime * prodStats.getTotalQuantity();
        return idealTime / timeStats.getRunningTime();
    }
    
    /**
     * 计算合格率
     */
    private double calculateQuality(ProductionStatistics prodStats) {
        if (prodStats.getTotalQuantity() == 0) {
            return 0;
        }
        
        return (double) prodStats.getGoodQuantity() / prodStats.getTotalQuantity();
    }
    
    private int getTheoreticalCycleTime() {
        // 从设备或工艺路线获取理论节拍
        // 这里简化处理，实际应从数据库查询
        return 30; // 30 秒/件
    }
}

@Data
@AllArgsConstructor
class TimeStatistics {
    private int plannedTime;
    private int runningTime;
    private int idleTime;
    private int downTime;
    private Map<String, Integer> downReasonStats;
}

@Data
@AllArgsConstructor
class ProductionStatistics {
    private int totalQuantity;
    private int goodQuantity;
    private int defectiveQuantity;
}

@Data
@AllArgsConstructor
class OEEResult {
    private double availability;
    private double performance;
    private double quality;
    private double oee;
    
    public static OEEResult zero() {
        return new OEEResult(0, 0, 0, 0);
    }
}
```

---

### 4. 生产节拍分析

#### 4.1 节拍定义

- **理论节拍**: 工艺设计的标准时间（如 30 秒/件）
- **实际节拍**: 实际生产的平均时间
- **节拍偏差**: 实际节拍 - 理论节拍

#### 4.2 瓶颈工位识别

```java
@Service
public class BottleneckAnalyzer {
    
    /**
     * 分析产线瓶颈工位
     */
    public BottleneckResult analyzeBottleneck(String productionLineId, LocalDate date) {
        // 1. 获取产线所有工位的实际节拍
        List<WorkstationCycleTime> cycleTimes = queryWorkstationCycleTimes(
            productionLineId, date
        );
        
        // 2. 找出最慢的工位（瓶颈）
        WorkstationCycleTime bottleneck = cycleTimes.stream()
            .max(Comparator.comparingDouble(WorkstationCycleTime::getActualCycleTime))
            .orElse(null);
        
        // 3. 计算平衡率
        double balanceRate = calculateBalanceRate(cycleTimes);
        
        return new BottleneckResult(bottleneck, cycleTimes, balanceRate);
    }
    
    /**
     * 计算产线平衡率
     * 平衡率 = 各工位工时总和 / (瓶颈工位工时 × 工位数)
     */
    private double calculateBalanceRate(List<WorkstationCycleTime> cycleTimes) {
        if (cycleTimes.isEmpty()) {
            return 0;
        }
        
        double totalTime = cycleTimes.stream()
            .mapToDouble(WorkstationCycleTime::getActualCycleTime)
            .sum();
        
        double bottleneckTime = cycleTimes.stream()
            .mapToDouble(WorkstationCycleTime::getActualCycleTime)
            .max()
            .orElse(0);
        
        int workstationCount = cycleTimes.size();
        
        return totalTime / (bottleneckTime * workstationCount);
    }
}

@Data
class WorkstationCycleTime {
    private String workstationId;
    private String workstationName;
    private int standardTime; // 标准工时
    private double actualCycleTime; // 实际节拍
    private int outputQuantity; // 产出数量
}

@Data
class BottleneckResult {
    private WorkstationCycleTime bottleneck;
    private List<WorkstationCycleTime> allWorkstations;
    private double balanceRate;
}
```

---

### 5. 质量追溯体系

#### 5.1 追溯链设计

```
原材料批次 → 入库检验 → 领料 → 生产过程 → 成品检验 → 出库
                ↑                              ↑
            检验报告                       检验报告
                ↑                              ↑
            供应商信息                     客户信息
```

#### 5.2 追溯表设计

```sql
-- 物料批次表
CREATE TABLE material_batch (
    id VARCHAR(32) PRIMARY KEY,
    material_code VARCHAR(50) NOT NULL, -- 物料编码
    batch_no VARCHAR(50) NOT NULL, -- 批次号
    supplier_id VARCHAR(32), -- 供应商
    quantity DECIMAL(10, 2), -- 数量
    inbound_date DATE, -- 入库日期
    expiry_date DATE, -- 有效期
    inspection_report_id VARCHAR(32), -- 检验报告
    UNIQUE KEY uk_material_batch (material_code, batch_no)
);

-- 生产追溯记录表
CREATE TABLE production_traceability (
    id VARCHAR(32) PRIMARY KEY,
    work_order_id VARCHAR(32) NOT NULL,
    product_serial_no VARCHAR(50) NOT NULL, -- 产品序列号
    
    -- 物料使用
    material_batch_ids JSON, -- 使用的物料批次 ID 列表
    
    -- 生产过程
    production_line_id VARCHAR(32),
    device_id VARCHAR(32),
    operator_id VARCHAR(32),
    
    -- 时间
    produce_time DATETIME,
    
    -- 工艺参数（JSON，记录关键参数）
    process_parameters JSON,
    
    -- 质检
    inspection_result VARCHAR(20), -- PASS, FAIL
    inspection_report_id VARCHAR(32),
    
    UNIQUE KEY uk_product_serial (product_serial_no),
    INDEX idx_work_order (work_order_id),
    INDEX idx_material_batch ((CAST(material_batch_ids AS CHAR(500))))
);

-- 质检报告表
CREATE TABLE inspection_report (
    id VARCHAR(32) PRIMARY KEY,
    report_no VARCHAR(50) UNIQUE NOT NULL, -- 报告编号
    type VARCHAR(20), -- IQC:来料检验, IPQC:过程检验, FQC:最终检验
    product_id VARCHAR(32),
    batch_no VARCHAR(50), -- 批次号或序列号
    
    -- 检验项目
    inspection_items JSON, -- [{item: "尺寸", standard: "10±0.1", actual: "10.05", result: "PASS"}]
    
    -- 结论
    conclusion VARCHAR(20), -- PASS, FAIL, CONcession
    defect_description TEXT, -- 不良描述
    
    -- 检验人
    inspector_id VARCHAR(32),
    inspect_time DATETIME,
    
    -- 附件（照片、文档）
    attachments JSON,
    
    INDEX idx_product (product_id),
    INDEX idx_batch (batch_no)
);
```

#### 5.3 追溯查询服务

```java
@Service
public class TraceabilityService {
    
    /**
     * 正向追溯：从原材料到成品
     */
    public ForwardTraceResult forwardTrace(String materialBatchNo) {
        // 1. 查询使用该批次物料的生產记录
        List<ProductionTraceability> traces = traceabilityMapper.selectByMaterialBatch(materialBatchNo);
        
        // 2. 关联工单和产品信息
        List<ProductInfo> products = traces.stream()
            .map(trace -> {
                WorkOrder workOrder = workOrderMapper.selectById(trace.getWorkOrderId());
                Product product = productMapper.selectById(workOrder.getProductId());
                
                return new ProductInfo(
                    trace.getProductSerialNo(),
                    product.getName(),
                    trace.getProduceTime(),
                    trace.getInspectionResult()
                );
            })
            .collect(Collectors.toList());
        
        return new ForwardTraceResult(materialBatchNo, products);
    }
    
    /**
     * 反向追溯：从成品到原材料
     */
    public BackwardTraceResult backwardTrace(String productSerialNo) {
        // 1. 查询产品生产记录
        ProductionTraceability trace = traceabilityMapper.selectBySerialNo(productSerialNo);
        
        if (trace == null) {
            throw new BusinessException("未找到产品追溯记录");
        }
        
        // 2. 查询使用的物料批次
        List<String> materialBatchIds = JSON.parseArray(
            trace.getMaterialBatchIds(), String.class
        );
        
        List<MaterialBatch> materials = materialBatchMapper.selectBatchIds(materialBatchIds);
        
        // 3. 查询供应商信息
        List<SupplierInfo> suppliers = materials.stream()
            .map(batch -> {
                Supplier supplier = supplierMapper.selectById(batch.getSupplierId());
                return new SupplierInfo(
                    batch.getBatchNo(),
                    batch.getMaterialCode(),
                    supplier.getName(),
                    batch.getInboundDate()
                );
            })
            .collect(Collectors.toList());
        
        return new BackwardTraceResult(productSerialNo, suppliers);
    }
}
```

---

## 📊 业务报表设计

### 1. 生产日报

```sql
-- 生产日报视图
CREATE VIEW daily_production_report AS
SELECT
    DATE(wr.start_time) as stat_date,
    pl.name as production_line_name,
    COUNT(DISTINCT wr.work_order_id) as order_count,
    SUM(wr.produced_quantity) as total_output,
    SUM(wr.defective_quantity) as total_defective,
    ROUND(SUM(wr.produced_quantity - wr.defective_quantity) * 100.0 / 
          NULLIF(SUM(wr.produced_quantity), 0), 2) as quality_rate,
    ROUND(AVG(wr.duration), 2) as avg_cycle_time
FROM device_run_record wr
JOIN device d ON wr.device_id = d.id
JOIN workstation ws ON d.workstation_id = ws.id
JOIN production_line pl ON ws.production_line_id = pl.id
WHERE wr.run_type = 'RUNNING'
GROUP BY DATE(wr.start_time), pl.name;
```

### 2. 设备利用率报表

```java
@Service
public class DeviceUtilizationReport {
    
    /**
     * 生成设备利用率月报
     */
    public List<DeviceUtilizationDTO> generateMonthlyReport(String factoryId, YearMonth month) {
        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();
        
        // 查询所有设备
        List<Device> devices = deviceMapper.selectByFactory(factoryId);
        
        return devices.stream().map(device -> {
            DeviceUtilizationDTO dto = new DeviceUtilizationDTO();
            dto.setDeviceId(device.getId());
            dto.setDeviceName(device.getName());
            
            // 查询 OEE 数据
            List<DeviceOEEDaily> oeeRecords = oeeDailyMapper.selectList(
                new LambdaQueryWrapper<DeviceOEEDaily>()
                    .eq(DeviceOEEDaily::getDeviceId, device.getId())
                    .ge(DeviceOEEDaily::getStatDate, startDate)
                    .le(DeviceOEEDaily::getStatDate, endDate)
            );
            
            // 计算平均值
            if (!oeeRecords.isEmpty()) {
                double avgOEE = oeeRecords.stream()
                    .mapToDouble(r -> r.getOee().doubleValue())
                    .average()
                    .orElse(0);
                
                double avgAvailability = oeeRecords.stream()
                    .mapToDouble(r -> r.getAvailability().doubleValue())
                    .average()
                    .orElse(0);
                
                dto.setAvgOEE(avgOEE);
                dto.setAvgAvailability(avgAvailability);
                dto.setTotalRunningHours(oeeRecords.stream()
                    .mapToInt(DeviceOEEDaily::getRunningTime)
                    .sum() / 3600.0);
            }
            
            return dto;
        }).collect(Collectors.toList());
    }
}
```

---

## 💡 最佳实践

### 1. 数据冗余 vs 实时计算

```java
/**
 * 策略：高频查询字段冗余，低频查询实时计算
 */

// ✅ 冗余：设备当前状态（频繁查询）
UPDATE device SET run_status = 1 WHERE id = 'xxx';

// ✅ 实时计算：历史 OEE 趋势（低频查询）
SELECT AVG(oee) FROM device_oee_daily 
WHERE device_id = 'xxx' 
  AND stat_date >= DATE_SUB(NOW(), INTERVAL 30 DAY);
```

### 2. 状态机防并发

```java
@Transactional
public void transition(String workOrderId, String targetStatus) {
    // 使用乐观锁防止并发修改
    WorkOrder workOrder = workOrderMapper.selectById(workOrderId);
    
    int rows = workOrderMapper.update(null,
        new LambdaUpdateWrapper<WorkOrder>()
            .eq(WorkOrder::getId, workOrderId)
            .eq(WorkOrder::getStatus, workOrder.getStatus()) // 乐观锁
            .set(WorkOrder::getStatus, targetStatus)
    );
    
    if (rows == 0) {
        throw new BusinessException("状态已被其他用户修改，请刷新后重试");
    }
}
```

### 3. OEE 定时计算任务

```java
@Component
public class OEECalculationTask {
    
    /**
     * 每天凌晨 1 点计算前一天的 OEE
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void calculateYesterdayOEE() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        
        // 获取所有设备
        List<Device> devices = deviceMapper.selectAll();
        
        for (Device device : devices) {
            try {
                oeeCalculator.calculateDailyOEE(device.getId(), yesterday);
            } catch (Exception e) {
                log.error("计算设备 {} OEE 失败", device.getId(), e);
            }
        }
    }
}
```

---

## 🔗 相关资源

- [OEE 维基百科](https://en.wikipedia.org/wiki/Overall_equipment_effectiveness)
- [精益生产六大损失](https://www.lean.org/lexicon-terms/six-big-losses/)
- [状态机设计模式](https://refactoring.guru/design-patterns/state)

---

**下一步**: 学习 [06-轻量MES能力实现](./06-mes-lite.md)，将业务模型落地为具体功能模块。
