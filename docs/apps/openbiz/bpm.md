# 业务流程管理 BPM · OpenBiz 第八个独立消费者
> 现为独立应用 `openbiz-bpm-app`（`E:/8.cangku/for-job/openbiz-bpm-app`）：独立后端（端口 18088）+ 独立前端（Vue3/TS）+ 独立数据库 `openbiz_bpm`。

> 实证：OpenBiz 母仓无 BPM 域，按 OpenBiz 命名约定自建 `openbiz_bpm_*` 表，在其多租户基座之上实现「流程定义 + 流程实例双状态机 + 统计」最小闭环。验证 OpenBiz V0.2「更多独立 consumer」目标。

## 复用与自建

- **复用**：OpenBiz `openbiz-saas-core` 多租户（TenantContext / TenantService / 自动装配）、RuoYi 登录外壳
- **自建**：`openbiz_bpm_process` / `openbiz_bpm_instance` 表 + Mapper / Service / Controller
  - 流程定义状态机：`DESIGN → DEPLOYED → RUNNING ⇄ SUSPENDED`，`DEPLOYED/RUNNING/SUSPENDED → RETIRED`（不可逆终态）
  - 流程实例状态机：`STARTED → RUNNING ⇄ SUSPENDED`，`RUNNING → COMPLETED / TERMINATED`（终态）

## 业务闭环（E2E 已验证）

创建流程(`DESIGN`) → 部署(`DEPLOYED`) → 启动(`RUNNING`) → 挂起(`SUSPENDED`) → 恢复(`RUNNING`)；运行中再部署被 `ILLEGAL_TRANSITION` 拒绝。建实例(`STARTED`) → 启动(`RUNNING`) → 挂起 → 恢复 → 完成(`COMPLETED`)；完成后挂起被拒。统计接口 `GET /api/bpm/stats` 返回流程 / 实例各状态数量。

## 工程位置

`E:/8.cangku/for-job/openbiz-bpm-app`（含 README 与 E2E 脚本，端口 18088）

## 价值

本例是 OpenBiz 承载「流程类系统」的试水。后续可叠加可视化设计器、审批规则、任务指派与轨迹审计，作为 OA / 审批中心的核心底座。

---

上一级：[OpenBiz 试水实证](/apps/openbiz/)
