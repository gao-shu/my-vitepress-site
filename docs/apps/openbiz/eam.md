# 企业资产管理 · OpenBiz 第六个独立消费者
> 现为独立应用 `openbiz-eam-app`（`E:/8.cangku/for-job/openbiz-eam-app`）：独立后端（端口 18086）+ 独立前端（Vue3/TS）+ 独立数据库 `openbiz_eam`。

> 实证：OpenBiz 母仓无 EAM 域，按 OpenBiz 命名约定自建 `openbiz_eam_*` 表，在其多租户基座之上实现「资产 + 维修单状态机 + 跨实体联动」最小闭环。验证 OpenBiz V0.2「更多独立 consumer」目标。

## 复用与自建

- **复用**：OpenBiz `openbiz-saas-core` 多租户（TenantContext / TenantService / 自动装配）、RuoYi 登录外壳
- **自建**：`openbiz_eam_asset` / `openbiz_eam_repair_order` 表 + Mapper / Service / Controller
  - 资产状态机：`IDLE → IN_USE → MAINTENANCE → IN_USE`，`IDLE/IN_USE → RETIRED`（不可逆终态）
  - 维修单状态机：`CREATED → SCHEDULED → REPAIRING → DONE`，`CREATED/SCHEDULED → CANCELLED`
  - **跨实体联动**：维修单进入 `REPAIRING` 时，Service 层在同一事务内将对应资产置为 `MAINTENANCE`（外部事件驱动，绕过资产状态机）

## 业务闭环（E2E 已验证）

创建资产(`IDLE`) → 投用(`IN_USE`) → 建维修单(`CREATED`) → 派工(`SCHEDULED`) → 维修中(`REPAIRING`，**联动资产→MAINTENANCE**) → 完成(`DONE`)；非法跳转（如 `IDLE→MAINTENANCE`、`CREATED→DONE`）均被状态机以 `ILLEGAL_TRANSITION` 拒绝并落库不变。

## 工程位置

`E:/8.cangku/for-job/openbiz-eam-app`（含 README 与 E2E 脚本，端口 18086）

## 价值

与工单 / MES / PMS / CRM / ERP 共同坐实「百套流水线」可复制：独立工程 + 选定 `openbiz-*` 构件 + 自建 Mapper / Service，且本例额外验证了「跨实体状态联动」这类复杂业务规则同样可承载。

---

上一级：[OpenBiz 试水实证](/apps/openbiz/)
