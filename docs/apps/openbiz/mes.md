# MES 生产执行 · 基于 OpenBiz 工业域
> 现为独立应用 `openbiz-mes-app`（`E:/8.cangku/for-job/openbiz-mes-app`）：独立后端（端口 18082）+ 独立前端（Vue3/TS）+ 独立数据库 `openbiz_mes`。

> 实证：OpenBiz 母仓 iot 域的 mes 插件**仅为验证桩**（`startProduction` 复用 mock 设备指令）。本试水在 `openbiz_mes_*` 表（母仓已定义）之上自建 MES 业务层，跑通真实生产闭环。

## 复用与自建

- **复用**：OpenBiz 定义的 `openbiz_mes_*` 表（物料 / BOM / 工艺 / 生产工单 / 报工记录）+ `openbiz-saas-core` 多租户
- **自建**：工单 / 报工 Mapper / Service / Controller + 状态机
  - `CREATED → STARTED → REPORTED → QC_PASSED → COMPLETED`
  - 含 `QC_FAILED` 返工、`CANCELLED` 分支

## 业务闭环（E2E 已验证）

`create → start → report(写生产记录) → qc(pass) → complete`；已完成再取消被拦截 `ILLEGAL_TRANSITION: COMPLETED -> CANCELLED`

## 工程位置

`E:/8.cangku/for-job/openbiz-mes-app`（含 README 与 E2E 脚本）

## 价值

证明 OpenBiz 工业域「实体在、服务桩」时，消费者可自行补齐真实业务流——这正是试水的意义。

---

上一级：[OpenBiz 试水实证](/apps/openbiz/)
