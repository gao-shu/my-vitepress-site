# 生产执行管理系统 MES

> 状态：✅ 已基于 OpenBiz 试水验证（最小可运行闭环 + E2E 全链路通过） · 所属模块：[02 工业数字化应用](/instances/industrial/) · 模块内优先级：第 1 位

## 核心功能

| 功能 | 规划说明 |
|---|---|
| 生产工单 | 工单下发、执行状态跟踪、完工入库登记 |
| 工序管理 | 工艺路线定义、工序流转、工序交接与扫码报工 |
| 生产报工 | 产量上报、工时统计、良品/不良品记录 |
| 质量追溯 | 批次追溯、质检记录、不良品分析与处置 |

## 规划要点

- 技术路线：**走扩展路线**——以在建 OpenBiz 工单系统为底座扩展工序流转、报工与质检，而不是另起炉灶；Java 21 + Spring Boot 3 + Vue 3 + TypeScript + MySQL
- 数据模型：工单-工序-状态机与 MES 的生产工单、工序管理天然同构，扩展工艺路线、报工记录、质检单据三块即可覆盖核心场景
- 展示价值：复用工单系统底座，投入产出比最高；且与本人制造业信息化（工艺模块）工作背景直接对应

## 与现有资产的关系

- 底座为在建 [OpenBiz 工单系统](/apps/business/)（🔧 验证中/在建），计划在其之上扩展工序流转与报工
- 轻量 MES 落地、PLC 采集、协议对接的实践经验已沉淀在[功能开发 › 工业数字化应用](/apps/industrial/)

## 建设状态

✅ **已试水验证**：作为 OpenBiz 的**第二个试水应用**，在 OpenBiz 定义的 `openbiz_mes_*` 表（母仓仅验证桩）之上自建 MES 业务层，跑通真实生产工单闭环，HTTP E2E 全链路通过。

- 实证页：[OpenBiz 试水 › MES 生产执行](/apps/openbiz/mes)
- 工程位置：`E:/8.cangku/for-job/openbiz-mes-app`（含 README 与 E2E 脚本）
- 复用的 OpenBiz 能力：`openbiz_mes_*` 表（物料/BOM/工艺/生产工单/报工记录）、`openbiz-saas-core` 多租户
- 自建：生产工单状态机（CREATED→STARTED→REPORTED→QC_PASSED→COMPLETED，含 QC_FAILED 返工、CANCELLED）、报工记录

---

上一级：[02 工业数字化应用](/instances/industrial/) · [实例总览](/instances/)
