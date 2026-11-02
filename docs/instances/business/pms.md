# PMS 项目管理系统

> ✅ 已验证（OpenBiz 第 3 个独立消费者） · 所属模块：[03 企业业务应用](/instances/business/) · 模块优先级：第 1 位 · 工程 `openbiz-pms-app`

## 📌 项目简介

PMS（Project Management System）管理「**项目 → 任务 → 里程碑 → 看板**」的协作全链路。它是「企业业务应用」里复用度最高的系统——任务状态机与工单模型天然同构，是验证「底座复用」方法论的首个项目。

> 简称说明：PM 在行业里常指「项目经理 / 产品经理」这个角色，系统文档统一写 **PMS** 以避免歧义。

- **面向用户**：项目经理（立项 / 排期）、成员（领任务 / 推进）、干系人（看板 / 进度）
- **核心价值**：项目与任务有状态机约束、可按看板视图推进，替代散落的表格与群聊

## 🗺️ 功能规划

### ✅ 已实现（E2E 已验证）

| 功能 | 能做什么 | 证据 |
|---|---|---|
| 项目生命周期 | `PLANNING → ACTIVE → COMPLETED`，`ACTIVE ⇄ ON_HOLD`，活动态 `→ CANCELLED` | 项目状态机 E2E |
| 任务管理 | `TODO → IN_PROGRESS → DONE`，活动态 `→ CANCELLED`，`DONE → IN_PROGRESS`（重开） | 任务状态机 E2E |
| 里程碑 | `type=MILESTONE` 与 `TASK` 共用一张表 | 数据结构 |
| 看板视图 | `GET /api/pms/projects/{id}/board` 按状态分组 | 看板分组断言 |
| 非法流转拦截 | 完成后取消项目 / 任务均被拒 `ILLEGAL_PROJECT_TRANSITION` / `ILLEGAL_TASK_TRANSITION` | E2E |
| 多租户 | 复用 `openbiz-saas-core` + RuoYi 登录外壳 | 独立库 `openbiz_pms` |

### 📋 待做 / 规划

- [ ] **甘特图**：时间轴视图、依赖关系、拖拽调整
- [ ] **工时管理**：工时填报、统计
- [ ] **资源负载**：成员工作量与排期冲突
- [ ] **评论 / 动态**：任务下的讨论与操作时间线
- [ ] **行级数据权限**：项目成员 / 角色的数据隔离
- [ ] **预算与成本**：项目预算、实际成本对比

## 🏗️ 技术架构

### 平台 + 垂直定位

```
┌ 垂直应用层（薄：领域模型 + 表单/流程配置）
│   CRM · ERP · PMS · OA · BPM · Form        ◀ 本页：PMS
├ 平台内核 · OpenBiz（一次建深，覆盖通用能力约 80%）
│   多租户/数据隔离 · RBAC/行级权限 · 工作流引擎 · 动态表单引擎
│   审计日志 · 消息通知中心 · 导入导出/报表 · 开放 API/SSO
└ 数据层 · MySQL 8 · Redis · 对象存储 · 消息队列
```

PMS 是**薄垂直层**：只实现项目 / 任务状态机与看板分组，其余复用平台内核。

### 本模块内部结构

```
Vue3 前端（项目 / 任务 / 看板）
   │ REST
Controller → Service（项目 & 任务双状态机）→ Mapper
   │
MySQL `openbiz_pms`（project / task，里程碑复用 task.type=MILESTONE）
   ▲ 复用 openbiz-saas-core（多租户）+ RuoYi 登录外壳
```

## 🧰 技术栈 / 开发语言

| 分层 | 技术 |
|---|---|
| 后端 | Java 21 + Spring Boot 3 + MyBatis |
| 前端 | Vue 3 + TypeScript |
| 数据库 | MySQL 8（独立库 `openbiz_pms`） |
| 底座 | OpenBiz `openbiz-saas-core` + RuoYi 登录外壳 |
| 部署 | 独立端口 18083 + 独立库 |

## ✅ 支持什么（能力边界）

- **支持**：项目生命周期、任务状态流转（含重开）、里程碑、按状态分组看板、非法流转拦截
- **暂不支持**：甘特图、工时、资源负载、评论动态、行级权限、预算成本

## 🚀 开发路线

| 里程碑 | 内容 | 状态 |
|---|---|---|
| M1 | 项目 + 任务 + 看板最小闭环（双状态机） | ✅ 完成 |
| M2 | 甘特图 + 任务依赖 | 📋 规划 |
| M3 | 工时 + 资源负载 | 📋 规划 |
| M4 | 评论动态 + 行级权限 + 预算 | 📋 规划 |

## 🔗 相关资源

- 平台内核：[平台内核 · OpenBiz](/instances/platform)
- 实证记录：[OpenBiz 实战 › 项目管理系统](/apps/openbiz/pms)
- 工程位置：`E:/8.cangku/for-job/openbiz-pms-app`（含 README 与 E2E 脚本）

---

上一级：[03 企业业务应用](/instances/business/) · [实例总览](/instances/)
