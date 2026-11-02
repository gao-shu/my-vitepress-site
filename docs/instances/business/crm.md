# CRM 客户关系管理系统

> ✅ 已验证（OpenBiz 第 4 个独立消费者） · 所属模块：[03 企业业务应用](/instances/business/) · 模块优先级：第 2 位 · 工程 `openbiz-crm-app`

## 📌 项目简介

CRM 管理「**客户 → 商机 → 成交**」的销售全链路。它把客户档案与销售过程沉淀为可流转、可统计的结构化数据，是销售团队跟进客户、销售主管看漏斗的统一入口。

- **面向用户**：销售（建客户 / 推商机）、销售主管（看漏斗与阶段转化）
- **核心价值**：客户与商机不再散落在 Excel / 微信里，而是有状态机约束、可统计的资产

## 🗺️ 功能规划

### ✅ 已实现（E2E 已验证）

| 功能 | 能做什么 | 证据 |
|---|---|---|
| 客户档案 | `NEW → ACTIVE → CHURNED`，活动态可转 `INVALID`（逻辑删除） | 客户状态机 E2E |
| 商机管理 | `DRAFT → NEGOTIATING → WON / LOST`；`DRAFT/NEGOTIATING → CANCELLED`；WON/LOST/CANCELLED 为终态 | 商机状态机 E2E |
| 销售漏斗统计 | `GET /api/crm/opportunities/stats` 按阶段聚合商机数与金额 | 统计断言通过 |
| 非法流转拦截 | WON 再谈判、NEW 直接流失均被拒 `ILLEGAL_TRANSITION` | E2E |
| 多租户 | 复用 `openbiz-saas-core` + RuoYi 登录外壳 | 独立库 `openbiz_crm` |

### 📋 待做 / 规划

- [ ] **销售线索层**：线索录入 / 来源追踪 / 分配回收——当前客户直接跳商机，漏斗上游是断的
- [ ] **客户跟进**：跟进记录、下次联系提醒、沟通时间线
- [ ] **客户主数据增强**：联系人、标签分类、查重合并
- [ ] **行级数据权限**：销售团队 / 角色的数据隔离（当前只到登录级）
- [ ] **时间维度统计**：赢单率趋势、阶段停留时长

## 🏗️ 技术架构

### 平台 + 垂直定位

```
┌ 垂直应用层（薄：领域模型 + 表单/流程配置）
│   CRM · ERP · PMS · OA · BPM · Form        ◀ 本页：CRM
├ 平台内核 · OpenBiz（一次建深，覆盖通用能力约 80%）
│   多租户/数据隔离 · RBAC/行级权限 · 工作流引擎 · 动态表单引擎
│   审计日志 · 消息通知中心 · 导入导出/报表 · 开放 API/SSO
└ 数据层 · MySQL 8 · Redis · 对象存储 · 消息队列
```

CRM 是**薄垂直层**：只实现客户 / 商机状态机与漏斗统计，多租户、登录、权限、消息全部复用平台内核。

### 本模块内部结构

```
Vue3 前端（客户 / 商机 / 漏斗）
   │ REST
Controller → Service（状态机校验）→ Mapper
   │
MySQL `openbiz_crm`（customer / opportunity）
   ▲ 复用 openbiz-saas-core（TenantContext 多租户）+ RuoYi 登录外壳
```

## 🧰 技术栈 / 开发语言

| 分层 | 技术 |
|---|---|
| 后端 | Java 21 + Spring Boot 3 + MyBatis |
| 前端 | Vue 3 + TypeScript |
| 数据库 | MySQL 8（独立库 `openbiz_crm`） |
| 底座 | OpenBiz `openbiz-saas-core` + RuoYi 登录外壳 |
| 部署 | 独立端口 18084 + 独立库 |

## ✅ 支持什么（能力边界）

- **支持**：单租户内客户生命周期管理、商机阶段流转、按阶段漏斗统计、非法流转拦截
- **暂不支持**：线索管理、跟进提醒、行级数据权限、跨时间趋势分析

## 🚀 开发路线

| 里程碑 | 内容 | 状态 |
|---|---|---|
| M1 | 客户 + 商机最小闭环（状态机 + 漏斗） | ✅ 完成 |
| M2 | 销售线索层（录入 / 来源 / 分配） | 📋 规划 |
| M3 | 客户跟进与提醒 | 📋 规划 |
| M4 | 行级数据权限 + 趋势统计 | 📋 规划 |

## 🔗 相关资源

- 平台内核：[平台内核 · OpenBiz](/instances/platform)
- 实证记录：[OpenBiz 实战 › CRM](/apps/openbiz/crm/)
- 工程位置：`E:/8.cangku/for-job/openbiz-crm-app`（端口 18084，含 README 与 E2E 脚本）

---

上一级：[03 企业业务应用](/instances/business/) · [实例总览](/instances/)
