# OpenBiz 实战（10 个独立商用应用）

> 一句话结论：**OpenBiz 可作为 A 类（企业 / 工业 / 办公）商用系统的统一底座，且已按「一个应用 = 独立后端 + 独立前端 + 独立数据库 + 独立 git 仓库」的交付形态落地 10 个完整应用**，每个都是可独立运行、独立演示的商用系统。全部真实跑通 MySQL，前后端经 Vite 代理全链路联调通过。

## 架构演进

| 阶段 | 形态 | 状态 |
|---|---|---|
| 试水期 | 8 个独立 Spring Boot consumer（端口 18081–18089，共享 ry-vue 库） | ✅ 证明模式可复制 |
| 阶段二 | 合并为 1 个单体后端 + 1 个前端 | ⛔ 已废弃（偏离「100 套独立应用」目标，合并版已删除） |
| **当前** | **10 个独立应用**：各自 backend（Spring Boot）+ frontend（Vue3/TS）+ 独立数据库 + 独立 git 仓库 | ✅ 已联调验证 |

## 10 个独立应用总览

统一命名 `E:/8.cangku/for-job/openbiz-{名称}-app/`，每个应用一套四件套：

| # | 应用 | 目录 | 后端端口 | 独立数据库 | 表数 | 端点 | 关键状态机 | 实证页 |
|---|---|---|---|---|---|---|---|---|
| 1 | 工单系统 | `openbiz-workorder-app` | 18081 | `openbiz_workorder` | 1 | 15 | CREATED→ASSIGNED→ACCEPTED→COMPLETED | [工单](/apps/openbiz/workorder) |
| 2 | MES 生产执行 | `openbiz-mes-app` | 18082 | `openbiz_mes` | 13 | 36 | CREATED→STARTED→REPORTED→QC_PASSED→COMPLETED | [MES](/apps/openbiz/mes) |
| 3 | 项目管理系统 | `openbiz-pms-app` | 18083 | `openbiz_pms` | 2 | 28 | 项目 + 任务双状态机 | [PMS](/apps/openbiz/pms) |
| 4 | CRM 客户关系 | `openbiz-crm-app` | 18084 | `openbiz_crm` | 2 | 25 | 客户 NEW→ACTIVE→CHURNED；商机 DRAFT→NEGOTIATING→WON/LOST | [CRM](/apps/openbiz/crm) |
| 5 | ERP 企业资源 | `openbiz-erp-app` | 18085 | `openbiz_erp` | 7 | 41 | 采购单 DRAFT→SUBMITTED→APPROVED→ORDERED→RECEIVED | [ERP](/apps/openbiz/erp) |
| 6 | WMS 仓储管理 | `openbiz-wms-app` | 18086 | `openbiz_wms` | 17 | 70 | 入库/出库/调拨/盘点单据链 + 批次效期 | [WMS](/instances/industrial/wms) |
| 7 | OA 办公自动化 | `openbiz-oa-app` | 18087 | `openbiz_oa` | 2 | 17 | 请假单 + 公告双状态机 | [OA](/apps/openbiz/oa) |
| 8 | BPM 流程管理 | `openbiz-bpm-app` | 18088 | `openbiz_bpm` | 2 | 23 | 流程定义 + 实例双状态机 | [BPM](/apps/openbiz/bpm) |
| 9 | IIoT 工业物联 | `openbiz-iiot-app` | 18089 | `openbiz_iiot` | 11 | 78 | 设备 + 告警双状态机 | [IIoT](/apps/openbiz/iiot) |
| 10 | HRM 人力资源 | `openbiz-hrm-app` | 18091 | `openbiz_hrm` | 14 | 97 | 组织/岗位/员工/合同 + 班次排班考勤 | [HRM](/instances/office/hrm) |

> 端点数为后端 `@*Mapping` 注解的实际计数（`grep -rhoE "@(Get|Post|Put|Delete)Mapping"`）。
> 表数为该库中**非 RuoYi 系统表**（`sys_*` / `qrtz_*`）、非代码生成器表（`gen_*`）、非平台基础表（`openbiz_tenant` / `openbiz_member`）的实际张数。其中 ERP 为 6 张业务表 + 1 张单号计数器表（`openbiz_erp_order_seq`），其余应用均为纯业务表。

每个应用目录结构：

```
openbiz-{名称}-app/
├── backend/    # 独立 Spring Boot（RuoYi 3.9.2 + openbiz-saas-core 多租户基座）
├── frontend/   # 独立 Vue3 + TS 前端（元数据驱动）
├── sql/        # 本系统业务表建表脚本
├── docs/       # 设计文档（数据模型 / 状态机 / 接口契约 / 验收记录）
└── README.md   # 运行方式 + E2E 证据
```

## 数据库：一应用一库

10 个应用各自独立数据库（`openbiz_{名称}`），每库包含：

1. RuoYi 系统表（`sys_*` + quartz，含 admin 账号）——登录/权限/定时任务
2. OpenBiz 平台基础表（`openbiz_tenant` / `openbiz_member`）——多租户基座
3. **仅本系统的业务表**——干净结构，无其他系统数据

业务表张数按复杂度递增：工单 1 张 → CRM/PMS/OA/BPM 2 张 → ERP 6 业务表（+1 计数器）→ IIoT 11 张 → MES 13 张 → HRM 14 张 → WMS 17 张。

各库账号体系互相独立（各有 admin / admin123），租户数据物理隔离——这是「独立交付」的应有形态。

## 版本控制：10 个应用各自独立 git 仓库

每个应用都是**独立的 git 仓库**（不是一个大仓库里的子目录），提交历史按模块分批，面试时可直接 `git log` 看推进过程：

| 约定 | 说明 |
|---|---|
| 提交前缀 | `feat` / `test` / `docs` / `chore` + 圆括号标注系统名（如 `feat(erp): ...`）|
| 分批粒度 | 基线快照 → 后端实现 → 测试脚本 → 前端 → 设计文档，每层一次提交 |
| 换行策略 | 统一 `.gitattributes`（`* text=auto eol=lf`），任何平台检出结果一致 |
| 不入库的内容 | `target/` / `node_modules/` / `dist/` 构建产物、数据库导出快照、商业授权 jar |

**为什么强调这一点**：作品集的可信度不来自代码量，而来自「能验证的演进过程」。一把梭的 `initial commit` 证明不了任何东西，分层的 `feat → test → docs` 才能说明「先设计、再实现、再验证」。

## 前端：模板化 + 元数据驱动

10 个前端均由统一模板 `E:/8.cangku/openbiz-app-template` 复制生成，复制后**只需改 3 处**：`src/config/modules.ts`（本系统元数据）、`vite.config.ts` 的 `BACKEND_PORT`、`index.html` 标题。

- 技术栈：Vite 8 + Vue 3.5 + TypeScript 5.9 + Element Plus 2.14 + Vue Router 5 + Pinia 4 + axios 1.20
- 元数据驱动：菜单 / 路由 / 表格列 / 表单 / 状态流转 / 统计卡片全部由 `modules.ts` 生成
- 契约统一：`/login` 拿 token → `Authorization: Bearer`；实体 REST 为 `/api/{module}/{entity}` 的 `list / {id} / POST / PUT / DELETE / {id}/transition?to= / stats`

**标准契约兼容层**：每个后端都新增 `StandardApiController`，把域特定端点（`/activate`、`/submit` 等）补齐为统一契约（`transition?to=` 状态机映射、`stats` 计数、`PUT`/`DELETE`）。错误由 `ApiExceptionHandler` 全局统一处理：非法流转返回 **HTTP 409** `{code:500,msg:"ILLEGAL_TRANSITION"}`，记录不存在返回 HTTP 400，控制器不再各自 try/catch。前端零特判，10 个应用一套前端代码模式。

> 分页实现有代际差异：ERP 与 WMS 已把 `list` 下沉到 SQL（`COUNT` + `LIMIT/OFFSET`），其余应用仍是内存切片。差异如实标注，不做统一话术。

## 运行方式（以 CRM 为例）

```bash
# 1) 后端（另开终端）
cd E:/8.cangku/for-job/openbiz-crm-app/backend
java -jar target/openbiz-crm-app.jar --server.port=18084

# 2) 前端（另开终端，自动代理到 18084）
cd E:/8.cangku/for-job/openbiz-crm-app/frontend
npm install     # 首次
npm run dev     # http://localhost:5184
```

登录：`admin / admin123`（各应用独立库，账号互不影响）。

**已实测联调**：CRM 应用经 Vite 代理完整链路 **8/8 通过**（登录→列表→新增→NEW→ACTIVE 流转→非法流转被拒(409)→不存在记录(400)→统计→商机列表）。

## 复用模式（百套流水线脚手架）

第 N 个应用的诞生只需四步：

1. **建库**：跑 `E:/8.cangku/split-databases.sh` 同款脚本（RuoYi 系统表 + 平台基础表 + 业务表）
2. **后端**：复制任一 app 的 `backend/`，改数据源库名与端口，替换业务四层（domain/mapper/service/web）
3. **前端**：复制 `openbiz-app-template`，改 `modules.ts` 元数据 + `BACKEND_PORT`
4. **验证**：跑统一契约 E2E（`backend/run_standard_e2e.sh`）

完整脚手架与坑位清单见 [脚手架与坑位](/apps/openbiz/scaffold)。

## 与「应用实例」页面的关系

站点的[应用实例](/instances/)板块按**场景**组织（AI / 工业 / 企业 / 办公 / 工具），本板块按**工程形态**组织。两者交叉引用，同一套代码在两处都有落点：

| 场景 | 对应 OpenBiz 应用 |
|---|---|
| 工业数字化 | [MES](/instances/industrial/mes) · [WMS](/instances/industrial/wms) · [IIoT](/instances/industrial/iiot) |
| 企业业务 | [CRM](/instances/business/crm) · [ERP](/instances/business/erp) · [PMS](/instances/business/pms) |
| 办公自动化 | [OA](/instances/office/oa) · [BPM](/instances/office/bpm) · [HRM](/instances/office/hrm) |
| 智能制造 | [工单](/apps/openbiz/workorder)（生产协同） |

另有 3 个 AI 系统走独立套件（ModelDesk / langchain4j-lab / agent-demo），3 个个人工具不进 OpenBiz。

---

上一级：[功能开发](/apps/)
