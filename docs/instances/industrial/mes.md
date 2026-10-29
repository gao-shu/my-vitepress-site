# 生产执行管理系统 MES

> 在 OpenBiz 之上自建的轻量 MES：工单下发 → 报工 → 质检 → 完工，跑通真实生产闭环。
> ✅ 已验证 · 所属 [02 工业数字化应用](/instances/industrial/) · 模块内优先级 1 · 代码 `E:/8.cangku/for-job/openbiz-mes-app`

## 功能清单

| 功能 | 状态 | 能做什么 | 证据 |
|---|---|---|---|
| 生产工单 | ✅ | 建单 → 开工 → 报工 → 质检 → 完工全链路，六态状态机 | E2E `create→start→report→qc→complete` 通过 |
| 报工记录 | ✅ | 报工时写入生产记录，复用母仓已定义的报工表 | E2E 校验落库可查 |
| 状态机约束 | ✅ | `CREATED→STARTED→REPORTED→QC_PASSED→COMPLETED`，含 `QC_FAILED` 返工与 `CANCELLED` 分支 | 非法流转返回 `ILLEGAL_TRANSITION` |
| 多租户 | ✅ | 复用 `openbiz-saas-core` 的 TenantContext / TenantService / 自动装配 | 后端 18082 + 独立库 `openbiz_mes` |
| 工序流转 | 🔧 | 工艺路线表母仓已定义，工序交接与工序级流转业务层未实现 | 在建 |
| 质检单据 | 🔧 | 目前只有 QC_PASSED / QC_FAILED 两个状态位，没有独立检验单 | 在建 |
| 批次追溯 | 📋 | 计划中，尚无表与接口 | — |

## 待完善

- **报工只到整单级**：不支持按工序分段报工、按人/班次汇总产量与工时
- **质检缺实体**：没有检验单、抽样规则、不良代码与返工处置流程，只有状态位
- **设备侧未打通**：母仓 `iot` 域的 `mes` 插件 `startProduction` 仍复用 mock 设备指令，未接真实 PLC / 产线
- **前端只有列表页**：缺产线看板、工单甘特图与异常预警视图

## 验证证据

- 业务闭环：`create → start → report(写生产记录) → qc(pass) → complete`，HTTP E2E 全链路通过
- 反向校验：`COMPLETED -> CANCELLED` 被拦截，返回 `ILLEGAL_TRANSITION`
- 复用边界：母仓 `openbiz_mes_*` 表（物料 / BOM / 工艺 / 生产工单 / 报工记录）+ `openbiz-saas-core`；业务层自建工单、报工 Mapper / Service / Controller 与状态机
- 实证记录：[OpenBiz 试水 › MES 生产执行](/apps/openbiz/mes)
- 工程位置：`E:/8.cangku/for-job/openbiz-mes-app`（含 README 与 E2E 脚本）

---

上一级：[02 工业数字化应用](/instances/industrial/) · [实例总览](/instances/)
