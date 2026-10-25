# ERP 企业资源计划 · OpenBiz 第五个独立消费者
> 现为独立应用 `openbiz-erp-app`（`E:/8.cangku/for-job/openbiz-erp-app`）：独立后端（端口 18085）+ 独立前端（Vue3/TS）+ 独立数据库 `openbiz_erp`。

> 实证：OpenBiz shop 域有 Inventory CAS、business 域有 Order，但采购 / 供应商需自建。按 OpenBiz 命名约定自建 `openbiz_erp_*` 表，在其多租户基座之上实现「供应商 + 采购单」最小闭环与单据状态机。验证「百套流水线」对 A 类工程量最大系统（第 3 个）的可复制性。

## 复用与自建

- **复用**：OpenBiz `openbiz-saas-core` 多租户、`ruoyi-framework` 基础能力
- **自建**：`openbiz_erp_supplier` / `openbiz_erp_purchase_order` 表 + Mapper / Service / Controller
  - 供应商状态机：`ACTIVE ⇄ FROZEN`，二者均可 `→ BLOCKED`（终态）；BLOCKED 解冻被拒
  - 采购单状态机：`DRAFT → SUBMITTED → APPROVED → ORDERED → RECEIVED`（终态）；`CANCELLED` 仅 DRAFT/SUBMITTED 可转；RECEIVED 后任何跳转均被拒
  - 统计：`GET /api/erp/purchase/stats` 返回完整三段（PLANNING/EXECUTING/CLOSED，缺段补 0）

## 业务闭环（E2E 已验证）

登录 → 建供应商(ACTIVE) → 冻结/解冻闭环 → 建采购单(DRAFT) → 提交 → 审批 → 下单 → 收货(RECEIVED) → 各阶段统计正确 → RECEIVED 后取消 / BLOCKED 后解冻均被拦截 `ILLEGAL_TRANSITION` → 数据落库可重拉。

## 工程位置

`E:/8.cangku/for-job/openbiz-erp-app`（端口 18085，含 README 与 E2E 脚本）

## 价值

工程量最大的 A 类系统（采购 / 供应商 / 订单单据链）同样可在 OpenBiz 基座上以独立消费者方式快速落地，进一步证明底座通用性。

---

上一级：[OpenBiz 试水实证](/apps/openbiz/)
