# 技术体系

本站「技术体系」面向 **初级 / 中级开发**，用来梳理学习路线与知识地图。偏中高级的内容（分布式一致性、云原生、LLM 微调、数仓 / 大数据等）暂不下线，只在对应章节标注为选修。

## 🏗️ 核心技术栈

### 后端技术栈

沉淀判断，不是教程：[后端技术体系](/tech-system/backend/)。每种语言统一五篇：基础 → 核心 → 框架 → 工程 → 常见问题。

- **Java**：[五篇速览](/tech-system/backend/java/)（含 Spring，不拆两组）
- **Python**：[五篇速览](/tech-system/backend/python/) · [技能速成](/tech-system/backend/python/python-skill)
- **TypeScript**：[五篇速览](/tech-system/backend/nodejs/)（Node 运行时）
- **Go**：[五篇速览](/tech-system/backend/go/)
- **C#**：[五篇速览](/tech-system/backend/csharp/)
- **后端问题**：[并发 / 库 / Redis / MQ / 分布式…](/tech-system/backend/problems/)

Java 主线的深度专题另在技术体系之外维护：

- [Java 语言与并发](/java/base-overview) — 集合、JVM、线程池、并发核心机制
- [框架与中间件](/framework/overview) — Spring 核心、事务、MyBatis、SpringCloud
- [SpringBoot 实践](/springboot/overview) — 概述与前后台管理系统技术栈

### 前端技术栈

- [Vue 技术栈](/tech-system/frontend/vue-stack) — Vue 3、组合式 API、Pinia
- [React 技术栈](/tech-system/frontend/react-stack) — React 18、Hooks、Redux、Next.js
- [前端工程化](/tech-system/frontend/engineering) — Vite、TypeScript、测试
- [移动端开发](/tech-system/frontend/mobile) — React Native、Flutter、PWA
- [跨平台方案](/tech-system/frontend/cross-platform) — Electron、Tauri、WebAssembly
- [站点重构与求职作品集](/tech-system/frontend/site-refactor-job-portfolio) — 本站自身的重构复盘

### 数据库与存储

- [数据库体系与选型](/database/database-stack) — 关系型 / NoSQL / NewSQL 全景
- [关系型数据库](/database/relational) — MySQL、PostgreSQL 优化
- [NoSQL 数据库](/database/nosql) — MongoDB、Redis、Elasticsearch
- [缓存系统](/database/caching) — 缓存策略、集群与性能
- 深入专题：[索引原理](/database/mysql-index) · [事务与锁](/database/mysql-transaction-lock) · [SQL 优化](/database/sql-optimization) · [分库分表](/database/sharding) · [主从架构](/database/master-slave-arch)
- 中间件：[Redis](/redis/) · [消息队列](/mq/overview)

> 数仓 / 大数据、分布式存储等偏中高级内容，暂时下线。

## 🔌 系统集成与通信

面向 **多语言服务对接** 与 **设备通信** 场景。

- [跨语言调用：方式选型](/tech-system/integration/cross-language-interop) — HTTP / gRPC / MQ / FFI / 子进程怎么选
- [HTTP：Node.js ↔ Python](/tech-system/integration/http-node-python) — REST/JSON、网关与算法服务拆分
- [Modbus TCP：Node.js ↔ PLC](/tech-system/integration/modbus-tcp-node-plc)
- [Modbus TCP：Python ↔ PLC](/tech-system/integration/modbus-tcp-python-plc)
- [S7：Node.js ↔ PLC](/tech-system/integration/s7-comm-node-plc)
- [S7：Python ↔ PLC](/tech-system/integration/s7-comm-python-plc)

## 🏭 工业数字化

完整方法论 + 真实项目，见 [工业数字化实验室](/tech-system/industrial-digitalization/)：

- [00 架构总览](/tech-system/industrial-digitalization/00-architecture-overview)
- [01 设备接入](/tech-system/industrial-digitalization/01-device-access)
- [02 数据平台](/tech-system/industrial-digitalization/02-data-platform)
- [03 实时系统](/tech-system/industrial-digitalization/03-realtime-system)
- [04 SCADA 可视化](/tech-system/industrial-digitalization/04-scada-visualization)
- [05 业务抽象](/tech-system/industrial-digitalization/05-business-abstract)
- [06 MES Lite](/tech-system/industrial-digitalization/06-mes-lite)
- [07 完整系统](/tech-system/industrial-digitalization/07-full-system)

配套：

- PLC 与采集：[常见品牌](/tech-system/plc/common-brands) · [S7 与 Python 采集](/tech-system/plc/s7-python-data-collection) · [S7 速查](/tech-system/plc/s7-quick-reference)
- 判断记录：[判断索引](/tech-system/industrial-digitalization/decisions/)（为何不用 MQTT、为何不做微服务…）
- 动手实验：[实验室索引](/tech-system/industrial-digitalization/labs/) · [Lab 001 设备采集最小闭环](/tech-system/industrial-digitalization/labs/lab-001)
- 项目推演：[Mini MES](/tech-system/industrial-digitalization/mini-mes/) · [架构演进](/tech-system/industrial-digitalization/mini-mes/architecture)

## 🚀 DevOps 与运维

- [Docker 实战](/tech-system/devops/docker) — 镜像构建、多阶段构建、容器编排
- [Docker Desktop（Windows）](/tech-system/devops/docker-desktop-windows) — 开机自启、容器自启、Compose
- [CI/CD 流水线](/tech-system/devops/ci-cd-pipeline)
- [监控与告警](/tech-system/devops/monitoring)
- [监控与可观测性](/tech-system/devops/monitoring-observability) — Prometheus、Grafana、日志、链路追踪
- 面试向复盘：[DevOps 面试](/guide/devops/)

> 云原生 / Service Mesh / IaC 等偏中高级内容，暂时下线。

## 🔐 安全

- [安全体系](/tech-system/security/security-stack)
- [Web 安全](/tech-system/security/web-security)

## 🧪 工程实践

- [代码质量](/tech-system/practices/code-quality)
- [开发实践](/tech-system/practices/development-practices)

## 🛠️ 开发工具与资源

- [开发工具与环境](/devtools/) — IDE、本地数据库、容器、版本控制
- [资源库](/resources/) — 教程、书籍、官方链接、课程与网站

## 📈 行业趋势

- [行业趋势观察](/tech-system/trends/industry-trends)

---

## 开源拆解

以我维护的项目为主（OpenBiz、本地漫创、ModelDesk）：

- [开源拆解](/open-source/)

---

💡 每个技术领域会持续更新，涵盖新版本特性、最佳实践和行业趋势。
