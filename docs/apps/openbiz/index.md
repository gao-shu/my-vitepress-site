# OpenBiz 实战（9 个独立商用应用）

> 一句话结论：**OpenBiz 可作为 A 类（企业 / 工业 / 办公）商用系统的统一底座，且已按「一个应用 = 独立后端 + 独立前端 + 独立数据库」的交付形态落地 9 个完整应用**，每个都是可独立运行、独立演示、独立进 git 仓库的商用系统。全部真实跑通 MySQL，前后端经 Vite 代理全链路联调通过。

## 架构演进

| 阶段 | 形态 | 状态 |
|---|---|---|
| 试水期 | 9 个独立 Spring Boot consumer（端口 18081–18089，共享 ry-vue 库） | ✅ 证明模式可复制 |
| 阶段二 | 合并为 1 个单体后端 + 1 个前端 | ⛔ 已废弃（偏离「100 套独立应用」目标，合并版已删除） |
| **当前** | **9 个独立应用**：各自 backend（Spring Boot）+ frontend（Vue3/TS）+ 独立数据库 | ✅ 已联调验证 |

## 9 个独立应用总览

统一命名 `E:/8.cangku/for-job/openbiz-{名称}-app/`，每个应用一套四件套：

| # | 应用 | 目录 | 后端端口 | 独立数据库 | 关键状态机 | 实证页 |
|---|---|---|---|---|---|---|
| 1 | 工单系统 | `openbiz-workorder-app` | 18081 | `openbiz_workorder` | CREATED→ASSIGNED→ACCEPTED→COMPLETED | [工单](/apps/openbiz/workorder) |
| 2 | MES 生产执行 | `openbiz-mes-app` | 18082 | `openbiz_mes` | CREATED→STARTED→REPORTED→QC_PASSED→COMPLETED | [MES](/apps/openbiz/mes) |
| 3 | 项目管理系统 | `openbiz-pms-app` | 18083 | `openbiz_pms` | 项目 + 任务双状态机 | [PMS](/apps/openbiz/pms) |
| 4 | CRM 客户关系 | `openbiz-crm-app` | 18084 | `openbiz_crm` | 客户 NEW→ACTIVE→CHURNED；商机 DRAFT→NEGOTIATING→WON/LOST | [CRM](/apps/openbiz/crm) |
| 5 | ERP 企业资源 | `openbiz-erp-app` | 18085 | `openbiz_erp` | 供应商 + 采购单单据链 | [ERP](/apps/openbiz/erp) |
| 6 | EAM 资产管理 | `openbiz-eam-app` | 18086 | `openbiz_eam` | 资产 + 维修单跨实体联动 | [EAM](/apps/openbiz/eam) |
| 7 | OA 办公自动化 | `openbiz-oa-app` | 18087 | `openbiz_oa` | 请假单 + 公告双状态机 | [OA](/apps/openbiz/oa) |
| 8 | BPM 流程管理 | `openbiz-bpm-app` | 18088 | `openbiz_bpm` | 流程定义 + 实例双状态机 | [BPM](/apps/openbiz/bpm) |
| 9 | IIoT 工业物联 | `openbiz-iiot-app` | 18089 | `openbiz_iiot` | 设备 + 告警双状态机 | [IIoT](/apps/openbiz/iiot) |

每个应用目录结构：

```
openbiz-{名称}-app/
├── backend/    # 独立 Spring Boot（RuoYi 3.9.2 + openbiz-saas-core 多租户基座）
├── frontend/   # 独立 Vue3 + TS 前端（元数据驱动）
├── sql/        # 本系统业务表建表脚本
└── README.md   # 运行方式 + E2E 证据
```

## 数据库：一应用一库

9 个应用各自独立数据库（`openbiz_{名称}`），每库包含：

1. RuoYi 系统表（`sys_*` + quartz，含 admin 账号）——登录/权限/定时任务
2. OpenBiz 平台基础表（`openbiz_tenant` / `openbiz_member` 等）——多租户基座
3. **仅本系统的业务表**（每系统 2 张）——干净结构，无其他系统数据

各库账号体系互相独立（各有 admin / admin123），租户数据物理隔离——这是「独立交付」的应有形态。

## 前端：模板化 + 元数据驱动

9 个前端均由统一模板 `E:/8.cangku/openbiz-app-template` 复制生成，复制后**只需改 3 处**：`src/config/modules.ts`（本系统元数据）、`vite.config.ts` 的 `BACKEND_PORT`、`index.html` 标题。

- 技术栈：Vite + Vue3 + TypeScript + Element Plus + Vue Router + Pinia + axios
- 元数据驱动：菜单 / 路由 / 表格列 / 表单 / 状态流转 / 统计卡片全部由 `modules.ts` 生成
- 契约统一：`/login` 拿 token → `Authorization: Bearer`；实体 REST 为 `/api/{module}/{entity}` 的 `list / {id} / POST / PUT / DELETE / {id}/transition?to= / stats`

**标准契约兼容层**：每个后端都新增 `StandardApiController`，把域特定端点（`/activate`、`/submit` 等）补齐为统一契约（内存分页 `list`、`transition?to=` 状态机映射、`stats` 计数、`PUT`/`DELETE`），非法流转统一返回 `{code:500,msg:"ILLEGAL_TRANSITION"}`。前端零特判，9 个应用一套前端代码模式。

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

**已实测联调**：CRM 应用经 Vite 代理完整链路 7/7 通过（登录→列表→新增→NEW→ACTIVE 流转→非法流转被拒→统计→商机列表）。

## 复用模式（百套流水线脚手架）

第 N 个应用的诞生只需四步：

1. **建库**：跑 `E:/8.cangku/split-databases.sh` 同款脚本（RuoYi 系统表 + 平台基础表 + 业务表）
2. **后端**：复制任一 app 的 `backend/`，改数据源库名与端口，替换业务四层（domain/mapper/service/web）
3. **前端**：复制 `openbiz-app-template`，改 `modules.ts` 元数据 + `BACKEND_PORT`
4. **验证**：跑统一契约 E2E（`backend/run_standard_e2e.sh`）

完整脚手架与坑位清单见 [脚手架与坑位](/apps/openbiz/scaffold)。

## 与「应用实例」15 系统的关系

OpenBiz 是其中 9 个 A 类系统的底座，现已全部以独立应用形态交付；另 3 个 AI 系统走独立套件（ModelDesk / langchain4j-lab / agent-demo），3 个个人工具不进 OpenBiz。详细适配与缺口分析见仓库根目录 `OPENBIZ-GAP-ANALYSIS.md`。

---

上一级：[功能开发](/apps/)
