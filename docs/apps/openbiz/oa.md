# 办公自动化 OA · OpenBiz 第七个独立消费者
> 现为独立应用 `openbiz-oa-app`（`E:/8.cangku/for-job/openbiz-oa-app`）：独立后端（端口 18087）+ 独立前端（Vue3/TS）+ 独立数据库 `openbiz_oa`。

> 实证：OpenBiz 母仓无 OA 域，按 OpenBiz 命名约定自建 `openbiz_oa_*` 表，在其多租户基座之上实现「请假单 + 公告双状态机」最小闭环。验证 OpenBiz V0.2「更多独立 consumer」目标。

## 复用与自建

- **复用**：OpenBiz `openbiz-saas-core` 多租户（TenantContext / TenantService / 自动装配）、RuoYi 登录外壳
- **自建**：`openbiz_oa_leave` / `openbiz_oa_notice` 表 + Mapper / Service / Controller
  - 请假单状态机：`DRAFT → SUBMITTED → APPROVED / REJECTED`，活动态 `→ WITHDRAWN`（仅 SUBMITTED 可转）
  - 公告状态机：`DRAFT → PUBLISHED → ARCHIVED`，`PUBLISHED ⇄ DRAFT`（撤回）

## 业务闭环（E2E 已验证）

创建请假单(`DRAFT`) → 提交(`SUBMITTED`) → 批准(`APPROVED`)；终态后再提交 / 撤回均被 `ILLEGAL_TRANSITION` 拒绝。独立路径创建公告(`DRAFT`) → 发布(`PUBLISHED`) → 撤回(`DRAFT`) → 归档(`ARCHIVED`)；归档后撤回被拒。统计接口 `GET /api/oa/{leaves|notices}/stats` 返回各状态数量，断言落库一致。

## 工程位置

`E:/8.cangku/for-job/openbiz-oa-app`（含 README 与 E2E 脚本，端口 18087）

## 价值

与 BPM 同一模块，本例聚焦「面向办公场景的应用组装」（请假 + 公告）。后续 OA 的待办聚合、审批中心可在此之上叠加，复用本状态机骨架。

---

上一级：[OpenBiz 试水实证](/apps/openbiz/)
