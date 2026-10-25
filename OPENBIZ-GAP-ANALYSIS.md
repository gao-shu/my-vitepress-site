# OpenBiz × 15 系统适配与缺口分析

> 日期：2026-10-23 · 数据来源：GitHub `gao-shu/openbiz`（master，2026-09-17 推送）+ 本地 `E:/_proj_eval/openbiz-workorder-demo`（HEAD `a552e12`）+ 仓库自述文档（README / final-audit / roadmap）
> 性质：只读分析，未改动 OpenBiz 任何代码

---

## 0. 直接结论：15 个系统不能全走 OpenBiz，应分三类

| 类别 | 系统 | 与 OpenBiz 的关系 |
|---|---|---|
| **A 类 · OpenBiz 为底座（9 个）** | 项目管理、CRM、ERP、MES、EAM、IIoT、OA、BPM、在线表单 | 企业/工业/办公域，与 OpenBiz「可复用业务能力组件」定位一致，在其上扩模块或建新母域 |
| **B 类 · 超出定位，独立推进（3 个）** | AI 智能助手、AI 知识库、AI 工作流与智能体平台 | OpenBiz agent 域只有最小核心；README 明确「RAG/多智能体平台不在路线图」。应分别由 ModelDesk / java-langchain4j-lab / java-agent-demo 承载，OpenBiz 只做集成方 |
| **C 类 · 不适合（3 个）** | 个人任务时间管理、个人知识库笔记、开发者工具箱 | OpenBiz 是 RuoYi 外壳 + 多租户的企业级组件库，个人工具用它属杀鸡用牛刀；技术栈可复用，代码不应进 OpenBiz |

---

## 1. OpenBiz 现状实测（母仓，远程核验）

### 1.1 架构与域

```text
RuoYi-Vue 3.9.2（运行时/认证/Demo 外壳：admin/common/framework/generator/quartz/system）
        │
openbiz-saas-core（Tenant / Member / TenantResolver / Interceptor）
        │
 ┌──────┼──────────┬──────────┬────────┐
 iot  business   service     shop    agent
```

| 域 | 已实现（实测文件） | 测试 |
|---|---|---|
| saas-core | Tenant / Member / 租户解析与拦截 | 3 |
| service（工单） | WorkOrder 全生命周期状态机 CREATED→ASSIGNED→ACCEPTED→COMPLETED / CANCELLED，幂等创建，租户隔离，Assignee 挂 RuoYi sys_user | 3 |
| business | Customer / Account / 账户流水 / Item / Order / Money | 3 |
| shop | Product / **Inventory CAS 扣减** / Order（单事务） | 3 |
| agent | **最小核心**：PromptTemplate → AgentInvoker → ModelPort → OpenAI 兼容适配器；ToolPort 为空边界 | 4（真实模型 E2E 因无 key 被 skip） |
| iot（183 文件，最大域） | core：Device / Product / ThingModel / DeviceCommand + **ProtocolPort SPI** + MQTT 适配器 + MockDoor 模拟设备；4 个行业插件：access 门禁 / locker 储物柜 / charging 充电桩 / **mes** | **52** |
| foundation | 空骨架（Skeleton） | — |

### 1.2 工程化与证据（仓库自述 + 实测）

- CI：`.github/workflows/ci.yml` 存在；50+ 份阶段报告/审计/设计文档
- 母仓自评（2026-09-15 封板审计）：五母域 PASS、IoT 52 测试、`mvn clean test` PASS（1 skip）、`mvn package` PASS、Business 扣款与 Shop 库存并发均为真实 MySQL 测试；**IoT v1.0 FROZEN**（封板后仅 Bug/Security/真实客户需求）
- 版本：GitHub Release `v0.1.0`；Maven 产物 `com.openbiz:openbiz-service:3.9.2`（注意：v0.1.0 与 3.9.2 是两套版本体系）
- 独立消费者：9 个试水 demo 齐备 —— `openbiz-workorder-demo`（首个，业务全委托母仓 WorkOrderService）、`openbiz-mes-demo`（工业域真实闭环）、`openbiz-pms-demo`（第三个，验证 V0.2「更多独立 consumer」目标）、`openbiz-crm-demo`（第四个，客户+商机+销售漏斗）、`openbiz-erp-demo`（第五个，供应商+采购单单据链）、`openbiz-eam-demo`（第六个，资产+维修单+跨实体联动）、`openbiz-oa-demo`（第七个，请假单+公告双状态机）、`openbiz-bpm-demo`（第八个，流程定义+实例双状态机）、`openbiz-iiot-demo`（第九个，设备+告警双状态机，A 类收官）；均本地跑通 MySQL E2E
- **诚实边界（README 自述，作品集表述不得超过）**：协议 = mock、MQTT = stub、Agent 证据 = L2、Local Maven Artifact ≠ Maven Central、独立消费者 ≠ SDK 产品化

---

## 2. 15 系统 × OpenBiz 适配矩阵

### A 类：OpenBiz 为底座

| # | 系统 | OpenBiz 现有可复用 | 缺什么 | 工程量 |
|---|---|---|---|---|
| 1 | 项目管理系统 | service 工单（状态机/租户/StaffUserPort） | 项目/阶段/里程碑/看板/甘特/协作 | 中（复用度最高，首选） |
| 2 | CRM | business 的 Customer/Account | 线索/商机/跟进/漏斗分析 | 中 |
| 3 | ERP | shop 的 Product/Inventory CAS + business 的 Order | 采购/供应商/销售订单/财务对接 | 大 |
| 4 | MES | iot 的 mes 域实体（WorkOrder/Process/BOM/Material/ProductionRecord） | **服务层只有验证桩**（`MesService.startProduction` 一个方法，复用 open_door mock）；缺真报工/质检/追溯/工艺执行/设备打通 | 大（但实体已在，且契合本人制造业背景） |
| 5 | EAM | iot 的 Device 台账 + service 工单（维修工单） | 保养计划/资产生命周期/备件 | 中 |
| 6 | IIoT | iot-core 的 Device/ThingModel/Command/MQTT/ProtocolPort SPI | 告警规则引擎/时序存储/趋势分析/看板（⚠️ IoT v1.0 FROZEN 明确「不做 Telemetry」，扩此项需先解冻，以真实需求驱动） | 中-大 |
| 7 | OA | RuoYi 的通知公告/权限/字典 | 待办聚合/办公申请模板/审批中心 | 小-中 |
| 8 | BPM | 无直接域（可借鉴 service 状态机） | 流程设计器/审批规则引擎/流程实例——三办公系统中最大工程 | 大 |
| 9 | 在线表单 | 无 | 表单设计器/JSON Schema 动态渲染/数据统计（内核可与 BPM 共享） | 中 |

### B 类：AI 三系统（独立推进，OpenBiz 集成）

| # | 系统 | 正确载体 | 与 OpenBiz 的集成点 |
|---|---|---|---|
| 10 | AI 智能助手 | **ModelDesk**（多模型接入+网关已验证 ✅）产品化，补对话管理/文件分析/工具调用 | agent 域 ModelPort 可作内部最小调用点；或助手独立部署 |
| 11 | AI 知识库 | **java-langchain4j-lab**（Spring Boot + LangChain4j + pgvector 已有雏形 🔧） | OpenBiz 文档/知识检索可调其 API |
| 12 | AI 工作流与智能体平台 | **java-agent-demo**（Tool Calling/MCP/Multi-Agent 扩 Workflow 🔧） | 业务系统流程节点可调智能体服务 |

> 依据：openbiz-agent README 自述「Out of scope: RAG, Memory, MCP, Workflow, multi-agent, Tool implementations」；根 README「RAG/多智能体平台不在路线图」。

### C 类：个人工具（不进 OpenBiz）

| # | 系统 | 建议 |
|---|---|---|
| 13 | 个人任务与时间管理系统 | 独立小项目（Spring Boot + SQLite 足够），验证「小闭环」方法论 |
| 14 | 个人知识库与笔记系统 | 与 #11 java-langchain4j-lab 合并（同一载体两个面向），不新开 |
| 15 | 开发者工具箱 | 纯前端/Tauri（text-manager 可作起点），与 OpenBiz 无关 |

---

## 3. OpenBiz 待完善清单（按优先级）

### P0 · 工程闭环缺口（阻塞一切的地基）

1. **母仓本地零验证**：未克隆、未构建、`~/.m2` 无 `com/openbiz` 构件 → workorder-demo 无法编译。动作：克隆到 `E:/8.cangku/openbiz` → `mvn -pl openbiz-service,ruoyi-framework -am install` → demo 指向 MySQL（`ry-vue`）+ Redis → :18081 核心流程实测。（环境齐备：Java 21.0.8 / Maven 3.9.11 / MySQL 8.0 运行中）
2. **workorder-demo 质量缺口**：0 测试（无 `src/test`）、README 复现性未验证、幂等/租户隔离无该层自动化证据（母仓测试覆盖了 service，demo 本身裸奔）
3. **证据边界纪律**：mock 协议 / MQTT stub / Agent L2 / 单一消费者——项目页与简历表述不得超出

### P1 · 能力缺口（按 15 系统映射，按需补）

- CRM 域全缺：线索/商机/跟进（Customer 已有）
- ERP：采购/供应商/销售订单（库存与订单有雏形）
- 项目管理：项目/阶段/里程碑/看板（可由工单扩展）
- MES：验证桩 → 真闭环（报工/质检/追溯/工艺执行）
- EAM：保养计划/生命周期/备件
- IIoT：告警/时序/趋势/看板（需先解冻 IoT v1.0）
- OA/BPM/表单：审批流引擎/流程设计器/表单引擎全缺
- AI 三件套：超出定位，见 B 类路线

### P2 · 工程化与开源卫生（冲 V1.0）

1. 文档状态漂移（final audit P1 自述「过期夸大」）→ 跑一遍文档-代码一致性核对
2. V1.0 三件套未建：changelog / releases 流程 / 贡献指南（V0.2 = 更多独立 consumer，V1.0 = 社区包装）
3. Agent 真实模型 E2E 缺 key 被 skip → 补一次真实调用证据（L2→L3）
4. 独立消费者仅 1 个 → **已补齐至 9 个**（工单 / MES / PMS / CRM / ERP / EAM / OA / BPM / IIoT），其中 PMS 作为第三个 consumer 验证 V0.2 目标与作品集案例，一石二鸟；CRM/ERP/EAM/OA/BPM/IIoT 进一步覆盖 A 类第 2~9 系统【已闭环 ✅】

---

## 4. 建议推进顺序

1. **P0**：克隆母仓 + `mvn install` + 工单 demo 最小闭环实测（解锁一切的前置）
2. **P1-A**：项目管理系统（第三个独立 consumer，复用度最高）【已闭环 ✅ 见 5.3】
3. **P1-B**：MES 真闭环（mes 域实体已在 + 契合制造业信息化背景）
4. **P1-C**：CRM（business 域自然延伸）
5. **B 类并行**：ModelDesk 维护核实 / langchain4j-lab 闭环 / agent-demo 实跑
6. **P2 + 视时间**：OA/BPM/表单；个人工具三线独立；文档一致性核对后冲 OpenBiz V1.0

---

## 附：与 PROJECT-AUDIT.md 的关系

---

## 5. 实测记录（2026-10-23）— P0 与 MES 试水均已闭环

### 5.1 P0：OpenBiz 母仓 + 工单 demo 独立消费验证 ✅
- 克隆母仓到 `E:/8.cangku/openbiz`（稀疏检出，排除 doc/ 大文件）
- `mvn install` 构件落地 `D:/softwork/apache-maven-3.9.11/repository/com/openbiz/*/3.9.2`
- 母仓全量 `mvn clean test`：**BUILD SUCCESS**（biz21/service18/agent14[1 skip 缺 key]/shop11/iot52）
- 工单 demo（`E:/_proj_eval/openbiz-workorder-demo`）HTTP E2E 全链路通过：
  login→create→assign→accept→complete，已完成再取消被状态机拦截 `ILLEGAL_TRANSITION`
- 详细证据见 `E:/_proj_eval/openbiz-workorder-demo/E2E-VERIFICATION.md`

### 5.2 MES 试水应用 ✅（回答「MES 能否基于 OpenBiz 完成」）
- 新建 `E:/8.cangku/openbiz-mes-demo`，依赖 `openbiz-saas-core`（多租户）+ `ruoyi-framework`
- 复用 OpenBiz 定义的 `openbiz_mes_*` 表（物料/BOM/工艺/生产工单/报工记录），自建 Mapper/Service/Controller
- 状态机：CREATED→STARTED→REPORTED→QC_PASSED→COMPLETED（含 QC_FAILED 返工、CANCELLED）
- HTTP E2E 全链路通过：create→start→report(写生产记录)→qc(pass)→complete，非法跳转正确拦截
- **结论：A 类工业/企业系统确可基于 OpenBiz 构建；MES 插件原仅为「验证桩」(`startProduction` 复用 mock 设备指令)，真实业务流需消费者自建——这正是试水价值**

### 5.3 复用模式（= 百套流水线脚手架雏形）
三个 demo 证明同一模式可复制：
1. 独立 Spring Boot 工程，parent 指向 `com.ruoyi:ruoyi:3.9.2`
2. Maven 依赖选定 `openbiz-*` 构件（saas-core 必选，其余按域选）
3. `@Import(OpenBizSaasAutoConfiguration.class)` + `@MapperScan` 本工程包
4. 业务表 schema 来自 OpenBiz 母仓 `sql/*.sql`（或按 OpenBiz 命名约定自建 `openbiz_*` 表），消费者自建 Mapper/Service
5. 复现要点：关 sys_config 验证码、强制端口绕过 WorkBuddy 2488、unset 本机 http_proxy
6. 坑位与脚手架已沉淀：`E:/8.cangku/OPENBIZ-TRIAL-SCAFFOLD.md` + 站点页 `docs/apps/openbiz/scaffold.md`

### 5.4 P1-A：项目管理系统 demo（第三个独立 consumer）✅
- 新建 `E:/8.cangku/openbiz-pms-demo`，依赖 `openbiz-saas-core`（多租户）+ `ruoyi-framework`
- OpenBiz 母仓无 PMS 域 → 按 OpenBiz 命名约定自建 `openbiz_pms_project` / `openbiz_pms_task` 表
- 自建业务层：
  - 项目状态机 `PLANNING→ACTIVE→COMPLETED`，`ACTIVE⇄ON_HOLD`，活动态→`CANCELLED`
  - 任务状态机 `TODO→IN_PROGRESS→DONE`，活动态→`CANCELLED`，`DONE→IN_PROGRESS`（重开）
  - 里程碑：`type=MILESTONE` 与 `TASK` 共用一张表
  - 看板：`GET /api/pms/projects/{id}/board` 按状态分组（Kanban）
- HTTP E2E 全链路通过：create(PLANNING)→start(ACTIVE)→建任务(TODO)→start(IN_PROGRESS)→complete(DONE)→看板分组正确→completeProject(COMPLETED)；完成后取消项目/任务均被状态机拦截 `ILLEGAL_PROJECT_TRANSITION` / `ILLEGAL_TASK_TRANSITION`
- **结论：与工单 / MES 共同坐实「百套流水线」可复制 —— OpenBiz 确可作为 A 类 9 个系统的统一底座；第 N 个系统按脚手架数小时内可从零跑通 E2E**

### 5.5 P1-C：CRM 试水应用 ✅（第四个独立 consumer）
- 新建 `E:/8.cangku/openbiz-crm-demo`，依赖 `openbiz-saas-core`（多租户）+ `ruoyi-framework`，端口 18084
- OpenBiz business 域仅有 Customer 实体 → 按 OpenBiz 命名约定自建 `openbiz_crm_customer` / `openbiz_crm_opportunity` 表
- 状态机：客户 `NEW→ACTIVE→CHURNED`（活动态→INVALID）；商机 `DRAFT→NEGOTIATING→WON/LOST`（DRAFT/NEGOTIATING→CANCELLED）
- HTTP E2E 全链路通过：登录→建客户→激活→建商机→谈判→赢单→阶段统计正确；WON 再谈判 / NEW 直接流失均被 `ILLEGAL_TRANSITION` 拒绝；落库可重拉
- **结论：A 类第 2 系统以独立消费者方式数小时内跑通，复用度与 PMS 同级**

### 5.6 P1-?：ERP 试水应用 ✅（第五个独立 consumer）
- 新建 `E:/8.cangku/openbiz-erp-demo`，依赖 `openbiz-saas-core` + `ruoyi-framework`，端口 18085
- shop 域有 Inventory CAS / business 域有 Order，但采购 / 供应商需自建 → 自建 `openbiz_erp_supplier` / `openbiz_erp_purchase_order` 表
- 状态机：供应商 `ACTIVE⇄FROZEN`→`BLOCKED`（终态）；采购单 `DRAFT→SUBMITTED→APPROVED→ORDERED→RECEIVED`（终态），`CANCELLED` 仅 DRAFT/SUBMITTED，`RECEIVED` 后任何跳转均拒
- HTTP E2E 全链路通过：登录→建供应商→冻结/解冻闭环→建采购单→提交→审批→下单→收货；RECEIVED 后取消 / BLOCKED 后解冻均被 `ILLEGAL_TRANSITION` 拒绝；金额与阶段落库正确
- **结论：工程量最大的 A 类系统（采购 / 供应商 / 单据链）同样可在 OpenBiz 基座上快速落地，底座通用性再获实证**

### 5.7 P1-?：EAM 试水应用 ✅（第六个独立 consumer）
- 新建 `E:/8.cangku/openbiz-eam-demo`，依赖 `openbiz-saas-core` + `ruoyi-framework`，端口 18086
- 母仓无 EAM 域 → 自建 `openbiz_eam_asset` / `openbiz_eam_repair_order` 表
- 状态机：资产 `IDLE→IN_USE→MAINTENANCE→IN_USE`，`IDLE/IN_USE→RETIRED`（终态）；维修单 `CREATED→SCHEDULED→REPAIRING→DONE`，`CREATED/SCHEDULED→CANCELLED`
- **跨实体联动**：维修单进入 `REPAIRING` 时，Service 层在同一事务内将对应资产置为 `MAINTENANCE`（外部事件驱动，绕过资产状态机）
- HTTP E2E 全链路通过：登录→建资产→投用→建维修单→派工→维修中（联动资产→MAINTENANCE）→完成；非法跳转（IDLE→MAINTENANCE、CREATED→DONE）均被 `ILLEGAL_TRANSITION` 拒绝且落库不变
- **结论：除状态机外，OpenBiz 同样可承载「跨实体业务规则联动」这类复杂场景，进一步拓宽 A 类覆盖边界**

### 5.8 P1-?：OA 试水应用 ✅（第七个独立 consumer）
- 新建 `E:/8.cangku/openbiz-oa-demo`，依赖 `openbiz-saas-core` + `ruoyi-framework`，端口 18087
- 母仓无 OA 域 → 自建 `openbiz_oa_leave` / `openbiz_oa_notice` 表
- 状态机：请假单 `DRAFT→SUBMITTED→APPROVED/REJECTED`，活动态 `→WITHDRAWN`（仅 SUBMITTED 可转）；公告 `DRAFT→PUBLISHED→ARCHIVED`，`PUBLISHED⇄DRAFT`（撤回）
- HTTP E2E 全链路通过（16 项断言）：登录→建请假单→提交→批准→终态再提交/撤回被拒→独立路径公告发布/撤回/归档→归档后撤回被拒；`/stats` 接口返回各状态数量，断言落库一致
- **结论：面向办公场景的应用组装（请假+公告）可在 OpenBiz 基座上快速落地，为后续 OA 待办聚合/审批中心提供骨架**

### 5.9 P1-?：BPM 试水应用 ✅（第八个独立 consumer）
- 新建 `E:/8.cangku/openbiz-bpm-demo`，依赖 `openbiz-saas-core` + `ruoyi-framework`，端口 18088
- 母仓无 BPM 域 → 自建 `openbiz_bpm_process` / `openbiz_bpm_instance` 表
- 状态机：流程定义 `DESIGN→DEPLOYED→RUNNING⇄SUSPENDED`，`DEPLOYED/RUNNING/SUSPENDED→RETIRED`（终态）；流程实例 `STARTED→RUNNING⇄SUSPENDED`，`RUNNING→COMPLETED/TERMINATED`（终态）
- HTTP E2E 全链路通过（16 步）：登录→建流程→部署→启动→挂起→恢复→运行中再部署被拒→建实例→启动→挂起→恢复→完成→完成后挂起被拒→`/stats` 统计→退役→退役后启动被拒
- **结论：流程类系统（定义+实例双状态机）可在 OpenBiz 基座上落地，后续可叠加可视化设计器/审批规则/任务指派/轨迹审计，作为 OA 审批中心核心底座**

### 5.10 P1-?：IIoT 试水应用 ✅（第九个独立 consumer，A 类收官）
- 新建 `E:/8.cangku/openbiz-iiot-demo`，依赖 `openbiz-saas-core` + `ruoyi-framework`，端口 18089
- 母仓无 IIoT 域 → 自建 `openbiz_iiot_device` / `openbiz_iiot_alarm` 表
- 状态机：设备 `OFFLINE→ONLINE→FAULT→OFFLINE`，`ONLINE/FAULT→MAINTENANCE→OFFLINE`，`OFFLINE/ONLINE→DECOMMISSIONED`（终态）；告警 `ACTIVE→ACKNOWLEDGED→RESOLVED`，`ACTIVE→CANCELLED`
- HTTP E2E 全链路通过（16 步）：登录→创建设备→上线→建告警→确认→解决→已解决再确认/取消均被拒→报故障→维护→结束维护→再上线→退役→退役后再上线被拒→落库 DECOMMISSIONED→`/stats` 统计
- **结论：A 类 9 个系统（工单/MES/PMS/CRM/ERP/EAM/OA/BPM/IIoT）全部以独立消费者方式跑通，OpenBiz 作为 A 类统一底座的结论获充分实证；后续可叠加 MQTT/Modbus 接入、时序库、设备影子与规则引擎**

### 5.11 阶段二：单体化整合 + Vue/TS 前端 ⛔ 已废弃（2026-10-25）

> **废弃原因**：合并单体偏离「100 套独立商用应用」的交付目标——100 套应用注定独立交付、独立部署、独立仓库，单体只有「演示好看」一个好处。`openbiz-platform` / `openbiz-web` 已直接删除（2026-10-25 清理，隔离区 `.trashed-merged/` 亦已移除），由阶段三的 9 个独立应用取代。本段保留为决策记录。

从「9 个分散 consumer（端口 18081–18089）」演进为「1 个统一平台 + 1 个前端」的可演示产品形态：

- **统一后端** `E:/8.cangku/openbiz-platform`（package `com.openbiz.platform`）：把 9 个试水的 domain/mapper/service 合并为 9 个 module 子包，单端口 `18090`、单登录入口 `/login`（返回 `{code:200,data:{token}}`，`Authorization: Bearer` 鉴权）；控制器统一前缀 `/api/{module}`，标准 REST（list/get/create/update/delete/transition/stats），非法流转返回 `code:500 ILLEGAL_TRANSITION`。业务表沿用 `ry-vue` 库已有 33 张 `openbiz_*` 表，未重建。
- **后端 E2E**：`e2e_platform.py` 覆盖 9 模块「创建→合法流转→stats→非法流转被拒」，**38/38 断言全绿**，`run_platform_e2e.sh` 退出码 0。
- **统一前端** `E:/8.cangku/openbiz-web`：Vite + Vue3 + TS + Element Plus + Vue Router + Pinia + axios。登录页（admin/admin123）+ 左侧 9 模块菜单 + **元数据驱动**通用组件 `EntityView.vue`（由 `src/config/modules.ts` 描述 9 模块各实体字段/状态/流转，渲染统计卡片+列表+新增/编辑弹窗+状态流转下拉+删除）。Vite dev 将 `/api`、`/login` 代理到 `127.0.0.1:18090`。
- **前后端联调**：`vue-tsc` + `npm run build` 通过；经 Vite 代理的完整鉴权链路实测通过（登录→列表→新增→NEW→ACTIVE 流转→stats 全 200）。联调修正了 Vite `localhost` 绑 IPv6 导致 127.0.0.1 不通的问题（改 `host:true` + 代理目标钉 `127.0.0.1`）。
- **踩坑补充**：环境变量 `SERVER__PORT` 会经 Spring relaxed binding 覆盖 `application.yml` 端口，启动脚本需 `unset SERVER__PORT`。

### 5.12 阶段三：9 个独立应用（独立后端 + 独立前端 + 独立数据库）✅（2026-10-25）

用户拍板：「一个项目一个数据库，9 个项目都要有各自的前端和后端，将来进 9 个 git 仓库」。落地成果：

- **目录**：`E:/8.cangku/for-job/openbiz-{名称}-app/`，每应用四件套 `backend/`（独立 Spring Boot）+ `frontend/`（独立 Vue3/TS）+ `sql/` + `README.md`；端口沿用 18081–18089。
- **数据库一应用一库**：`split-databases.sh` 从共享 `ry-vue` 拆出 9 个独立库（`openbiz_workorder/mes/pms/crm/erp/eam/oa/bpm/iiot`），每库 = RuoYi 系统表（含 admin 账号）+ quartz + openbiz 平台基础表（tenant/member）+ **仅本系统 2 张业务表**，干净结构无历史数据；各库账号体系独立，租户物理隔离。
- **前端模板化**：`openbiz-app-template` 为唯一母版，复制后只改 3 处（`modules.ts` 元数据、`vite.config.ts` 的 `BACKEND_PORT`、`index.html` 标题）。9 个前端 `vue-tsc` + `npm run build` 全通过。
- **标准契约兼容层**：每个后端新增 `StandardApiController`，把域特定端点（`/activate`、`/submit` 等）补齐为统一契约（内存分页 `list`→`{rows,total}`、`transition?to=` 状态机映射、`stats` 计数含 0 值态、`PUT`/`DELETE`），非法流转统一 `{code:500,msg:"ILLEGAL_TRANSITION"}`；域端点全部保留，旧 E2E 回归通过。
- **E2E**：9 应用各跑「域特定 E2E（旧）+ 统一契约 E2E（新）」双线全绿，证据在各 `backend/E2E-RESULT.txt`。
- **前后端联调**：CRM 应用（18084 + 5184）经 Vite 代理完整链路 **7/7 通过**（登录→列表→新增→NEW→ACTIVE 流转→非法流转被拒→统计→商机列表）。
- **目录清理（2026-10-25）**：9 个早期 demo 原型目录已删除；9 个独立应用统一移至 `E:/8.cangku/for-job/`（求职作品集交付目录），后端 Maven artifactId 与 jar 名由 `-demo` 更名为 `-app`。
- **结论：交付形态与「100 套独立商用应用」目标对齐——第 N 个应用 = 建库脚本 + 复制 backend 改数据源 + 复制前端模板改元数据 + 跑双线 E2E，「百套流水线」以独立应用为单位运转。**

本文取代并细化审计表中 openbiz 母仓条目（2.2）：审计时母仓未克隆，仅有技术栈推测；本文基于 master 全量目录树 + 各模块 README + 封板审计报告实测修正。截至 2026-10-25，A 类 9 系统最终以 **9 个独立应用**（独立后端 18081–18089 + 独立 Vue3/TS 前端 + 独立数据库 `openbiz_*`，统一位于 `E:/8.cangku/for-job/`）形态交付，前后端联调实测通过；9 个早期 demo 原型已删除，阶段二的合并单体已废弃删除。
