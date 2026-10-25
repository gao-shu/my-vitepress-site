# CRM 客户关系管理 · OpenBiz 第四个独立消费者
> 现为独立应用 `openbiz-crm-app`（`E:/8.cangku/for-job/openbiz-crm-app`）：独立后端（端口 18084）+ 独立前端（Vue3/TS）+ 独立数据库 `openbiz_crm`。

> 实证：OpenBiz 母仓 business 域仅有 Customer 实体，CRM 的线索 / 商机 / 跟进需自建。按 OpenBiz 命名约定自建 `openbiz_crm_*` 表，在其多租户基座之上实现「客户 + 商机」最小闭环与销售漏斗雏形。验证「百套流水线」对 A 类第 2 个系统的可复制性。

## 复用与自建

- **复用**：OpenBiz `openbiz-saas-core` 多租户（TenantContext / TenantService / 自动装配）、RuoYi 登录外壳
- **自建**：`openbiz_crm_customer` / `openbiz_crm_opportunity` 表 + Mapper / Service / Controller
  - 客户状态机：`NEW → ACTIVE → CHURNED`，活动态可转 `INVALID`（逻辑删除）
  - 商机状态机：`DRAFT → NEGOTIATING → WON` / `DRAFT → NEGOTIATING → LOST`，`DRAFT/NEGOTIATING → CANCELLED`；WON/LOST/CANCELLED 为终态
  - 统计：`GET /api/crm/opportunities/stats` 按阶段聚合（销售漏斗雏形）

## 业务闭环（E2E 已验证）

登录 → 建客户(NEW) → 激活(ACTIVE) → 建商机(DRAFT/OPEN) → 谈判(NEGOTIATING) → 赢单(WON) → 阶段统计正确 → WON 再谈判 / NEW 直接流失均被拦截 `ILLEGAL_TRANSITION` → 数据落库可重拉。

## 工程位置

`E:/8.cangku/for-job/openbiz-crm-app`（端口 18084，含 README 与 E2E 脚本）

## 价值

与工单 / MES / PMS 共同坐实「百套流水线」可复制：第 4 个系统按脚手架数小时内从零跑通 E2E。

---

上一级：[OpenBiz 试水实证](/apps/openbiz/)
