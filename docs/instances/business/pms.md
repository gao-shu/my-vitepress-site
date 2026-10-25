# 项目管理系统

> 状态：✅ 已基于 OpenBiz 试水验证（最小可运行闭环 + E2E 全链路通过） · 所属模块：[01 企业业务应用](/instances/business/) · 模块内优先级：第 1 位

## 核心功能

| 功能 | 规划说明 |
|---|---|
| 项目计划 | 项目创建、阶段划分、里程碑与计划时间管理 |
| 任务分配 | 任务拆分、负责人指派、优先级与截止时间 |
| 进度跟踪 | 任务看板、甘特图、完成率与延期预警 |
| 团队协作 | 评论、动态、成员角色与权限管理 |

## 规划要点

- 技术路线：Java 21 + Spring Boot 3 + Vue 3 + TypeScript + MySQL，与在建 OpenBiz 工单系统同栈
- 数据模型：项目 / 阶段 / 任务 / 成员角色，任务状态机与工单模型天然同构，复用度最高
- 展示价值：与工单系统任务模型最接近，是从「工单」扩展到「项目-任务」复用度最高的一个闭环

## 与现有资产的关系

- 直接复用在建 [OpenBiz 工单系统](/apps/business/)（🔧 验证中/在建）的任务模型、状态机与权限设计，是验证「底座复用」方法论的首个项目

## 建设状态

✅ **已试水验证**：作为 OpenBiz 的**第三个独立消费者**，在 `openbiz-saas-core` 多租户基座上自建项目 + 任务/里程碑 + 看板闭环，HTTP E2E 全链路通过（含状态机非法跳转拦截）。

- 实证页：[OpenBiz 试水 › 项目管理系统](/apps/openbiz/pms)
- 工程位置：`E:/8.cangku/for-job/openbiz-pms-app`（含 README 与 E2E 脚本）
- 复用的 OpenBiz 能力：`openbiz-saas-core` 多租户（TenantContext / TenantService / 自动装配）、RuoYi 登录外壳
- 自建：项目状态机（PLANNING→ACTIVE→COMPLETED，ACTIVE⇄ON_HOLD，活动态→CANCELLED）、任务状态机（TODO→IN_PROGRESS→DONE，含重开）、看板分组

---

上一级：[01 企业业务应用](/instances/business/) · [实例总览](/instances/)
