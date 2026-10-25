# 项目管理系统 · OpenBiz 第三个独立消费者
> 现为独立应用 `openbiz-pms-app`（`E:/8.cangku/for-job/openbiz-pms-app`）：独立后端（端口 18083）+ 独立前端（Vue3/TS）+ 独立数据库 `openbiz_pms`。

> 实证：OpenBiz 母仓无 PMS 域，按 OpenBiz 命名约定自建 `openbiz_pms_*` 表，在其多租户基座之上实现「项目 + 任务 / 里程碑 + 看板」最小闭环。验证 OpenBiz V0.2「更多独立 consumer」目标。

## 复用与自建

- **复用**：OpenBiz `openbiz-saas-core` 多租户（TenantContext / TenantService / 自动装配）、RuoYi 登录外壳
- **自建**：`openbiz_pms_project` / `openbiz_pms_task` 表 + Mapper / Service / Controller
  - 项目状态机：`PLANNING → ACTIVE → COMPLETED`，`ACTIVE ⇄ ON_HOLD`，活动态 `→ CANCELLED`
  - 任务状态机：`TODO → IN_PROGRESS → DONE`，活动态 `→ CANCELLED`，`DONE → IN_PROGRESS`（重开）
  - 里程碑：`type=MILESTONE` 与 `TASK` 共用一张表
  - 看板：`GET /api/pms/projects/{id}/board` 按状态分组，对应 Kanban 视图

## 业务闭环（E2E 已验证）

创建(`PLANNING`) → 启动(`ACTIVE`) → 建任务(`TODO`) → 开始(`IN_PROGRESS`) → 完成(`DONE`) → 看板分组正确 → 完成项目(`COMPLETED`)；完成后取消项目 / 任务均被拦截 `ILLEGAL_PROJECT_TRANSITION` / `ILLEGAL_TASK_TRANSITION`

## 工程位置

`E:/8.cangku/for-job/openbiz-pms-app`（含 README 与 E2E 脚本）

## 价值

与工单 / MES 共同坐实「百套流水线」可复制：独立工程 + 选定 `openbiz-*` 构件 + 自建 Mapper / Service。

---

上一级：[OpenBiz 试水实证](/apps/openbiz/)
