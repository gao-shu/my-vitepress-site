# MES 生产执行 · 基于 OpenBiz 工业域
> 现为独立应用 `openbiz-mes-app`（`E:/8.cangku/for-job/openbiz-mes-app`）：独立后端（端口 18082）+ 独立前端（Vue3/TS）+ 独立数据库 `openbiz_mes`。

> 实证：OpenBiz 母仓 iot 域的 mes 插件**仅为验证桩**（`startProduction` 复用 mock 设备指令）。本试水在 `openbiz_mes_*` 表（母仓已定义）之上自建 MES 业务层，跑通真实生产闭环。

## 复用与自建

- **复用**：OpenBiz 定义的 `openbiz_mes_*` 表（物料 / BOM / 工艺 / 生产工单 / 报工记录）+ `openbiz-saas-core` 多租户
- **自建**：工单 / 报工 Mapper / Service / Controller + 状态机
  - `CREATED → STARTED → REPORTED → QC_PASSED → COMPLETED`
  - 含 `QC_FAILED` 返工、`CANCELLED` 分支
  - 13 张业务表 · 36 个 REST 端点 · 25 个权限点（4 个岗位角色）

## 业务闭环（E2E 已验证）

**整单链**：`create → start → report(写生产记录) → qc(pass) → complete`；已完成再取消被拦截 `ILLEGAL_TRANSITION: COMPLETED -> CANCELLED`

**工序链**（P0 补齐的主线）：建路线 → 工单挂 `routing` → 逐道工序报工（良品 / 不良）→ 末道达标自动 `REPORTED` → 质检 → 完工；下游工序超上游产出直接 409（WIP 不变量），同 `eventId` 重发不计产。

**追溯链**：`GET /api/mes/work-orders/{id}/trace` 一次拿全工序流水、不良明细、物料消耗、集成投递状态。

**集成链**：
- MES 完工 → `mes_integration_outbox` → WMS 生产入库单（`source_doc_no` = 工单号，自动收货，重投幂等）
- IIoT 设备计数增量 → MES 工序报工（`mes_device_cursor` 游标去重，超计划截断）

## 验收总账

6 套脚本 · 115 项断言 + 8 步整单流程，全部本机实跑：

| 脚本 | 断言 |
|---|---|
| `e2e_mes.py` / `e2e_standard.py` | 8 步流程 / 48（整单老基线 + 统一 REST 契约） |
| `scripts/e2e_mes_p0.py` | 25（工序 / 追溯 / 集成 / 权限 / 分页） |
| `scripts/verify_mes_p0_hardening.py` | 11（CAS · OK·NG 归一 · 完工禁删） |
| `scripts/e2e_cross_system.py` | 13（MES → WMS 完工入库） |
| `scripts/e2e_iiot_telemetry.py` | 10（IIoT → MES 遥测报工） |

## 工程位置

`E:/8.cangku/for-job/openbiz-mes-app`（README + `docs/` 9 篇 · 含面试问答准备包 + `scripts/` 6 套验收）

## 价值

证明 OpenBiz 工业域「实体在、服务桩」时，消费者可自行补齐真实业务流——这正是试水的意义。更进一步：这套业务层不是只能自用，它已经通过 WMS / IIoT 两个真实系统证明能跨系统协同。

---

上一级：[OpenBiz 试水实证](/apps/openbiz/)
