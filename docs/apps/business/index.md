# 企业业务应用

> Web、SaaS、系统集成 —— 面向业务的管理系统与对外能力开放。

**项目状态图例**：✅ 已验证（有运行/测试证据） · 🔧 验证中/在建（代码存在，证据整理中） · 📋 规划中（尚未开始）

## 🔧 验证中 / 在建

| 项目 | 状态 | 说明 |
|---|---|---|
| OpenBiz 工单系统 | 🔧 最小可运行闭环搭建中 | Java 21 · Spring Boot · RuoYi 薄壳 · MyBatis · MySQL 8.0；工单创建/派单/受理/完成/取消全生命周期 REST API，业务逻辑由可复用组件仓提供；母仓依赖安装、数据库初始化与核心流程实测进行中 |

## 📋 技术实践 · 业务系统

| 文章 | 解决的问题 |
|------|------------|
| [管理后台设计与开发](/apps/business/admin-system) | RBAC 权限模型、菜单与路由、通用 CRUD 与字典、列表筛选与导出、前后端分离约定 |
| [CRM 定制改造实践](/apps/business/crm-custom) | 多客户差异化：配置化 vs 二开、字段与流程扩展、升级冲突避免、需求管理 |
| [ERP 流程与单据设计](/apps/business/erp-workflow) | 单据状态机、审核流、库存与单据联动、幂等与冲红、报表口径统一 |
| [多租户 SaaS 架构](/apps/business/saas-multi-tenant) | 租户隔离方案、权限与配置差异、计费与配额、数据迁移 |

> 微信小程序的开发技术（登录态、发布审核、低端机性能）已归入 [05 多端应用与现场交付](/apps/terminal/)，[原文](/apps/business/mini-program)地址不变。

## 📋 技术实践 · 系统集成

| 文章 | 解决的问题 |
|------|------------|
| [对外 API 设计与开放平台](/apps/integration/open-api) | API 版本与兼容、鉴权与配额、文档与 SDK、对外开放的灰度与回收 |
| [Webhook 接入与可靠投递](/apps/integration/webhook-design) | 签名校验、幂等去重、重试与死信、对账补偿 |
| [系统间数据同步方案](/apps/integration/data-sync) | 全量/增量选型、冲突合并、延迟对账、断点续传 |
| [单点登录与授权打通](/apps/integration/sso-oauth) | OAuth2/OIDC 流程、令牌刷新、多系统会话一致 |
| [老系统集成改造](/apps/integration/legacy-integration) | 无接口老系统的适配层、数据清洗、双写与切换回滚 |

---

上一级：[功能开发](/apps/)
