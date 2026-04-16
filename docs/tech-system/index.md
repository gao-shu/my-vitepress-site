# 技术体系

本站“技术体系”仅面向 **初级 / 中级开发**，用来梳理学习路线与知识地图。偏 **中高级/高级** 的内容（如分布式一致性、云原生、LLM 微调、数仓/大数据、系统架构模式专题等）会暂时下线；同时会结合**当前趋势分析**与**个人学习方向把控**，动态调整保留内容与学习优先级。

## 🏗️ 核心技术栈

### 后端技术栈
- [Java/Spring 生态](./backend/java-spring.md) - Spring Boot、常用组件、工程化
- [Python 生态](./backend/python-stack.md) - Django、Flask、FastAPI
- [Node.js 生态](./backend/nodejs-stack.md) - Express、NestJS
- [Go 语言](./backend/golang.md) - 基础语法、并发、Web 开发

> 工业自动化、设备通信、IoT/SCADA/MES 等内容已迁移到 **[工业数字化](/tech-system/industrial-digitalization/)** 独立模块。

### 前端技术栈
- [Vue.js 生态](./frontend/vue-stack.md) - Vue 3、组合式API、Vuex/Pinia
- [React 生态](./frontend/react-stack.md) - React 18、Hooks、Redux、Next.js
- [前端工程化](./frontend/engineering.md) - Webpack、Vite、TypeScript、测试
- [移动端开发](./frontend/mobile.md) - React Native、Flutter、PWA
- [跨平台方案](./frontend/cross-platform.md) - Electron、Tauri、WebAssembly

### 数据库与存储
- [关系型数据库](./database/relational.md) - MySQL、PostgreSQL优化
- [NoSQL 数据库](./database/nosql.md) - MongoDB、Redis、Elasticsearch
- [缓存系统](./database/caching.md) - Redis集群、缓存策略、性能优化
> 数仓/大数据、分布式存储等偏中高级内容，暂时下线。

## 🔌 系统集成与通信（HTTP / 服务）

面向 **多语言服务对接** 场景：侧重应用层 API 与服务间协作。

- [跨语言调用：方式选型与常见实现](./integration/cross-language-interop.md) — HTTP/gRPC/MQ/FFI/子进程等是否可行、怎么选
- [HTTP 跨语言协作：Node.js ↔ Python](./integration/http-node-python.md) — REST/JSON、网关与算法服务拆分、常见 Express/axios 踩坑

## 🚀 DevOps 与运维

### 容器化技术
- [Docker 实战](./devops/docker.md) - 镜像构建、多阶段构建、容器编排
- [Docker Desktop Windows 配置](./devops/docker-desktop-windows.md) - 开机自启、容器自启、Docker Compose
- [Kubernetes](./devops/kubernetes.md) - Pod管理、服务发现、配置管理
- [容器安全](./devops/container-security.md) - 镜像扫描、运行时安全

### CI/CD 流水线
- [Jenkins](./devops/jenkins.md) - 流水线设计、插件开发
- [GitLab CI](./devops/gitlab-ci.md) - .gitlab-ci.yml、流水线优化
- [GitHub Actions](./devops/github-actions.md) - 工作流设计、自托管Runner

### 监控与可观测性
- [应用监控](./devops/monitoring.md) - Prometheus、Grafana、告警规则
- [日志管理](./devops/logging.md) - ELK Stack、日志聚合、分析
- [链路追踪](./devops/tracing.md) - Jaeger、Zipkin、分布式追踪

> 云原生/Service Mesh/IaC 等偏中高级内容，暂时下线。

## 🛠️ 开发工具与环境

### IDE 与编辑器
- [VS Code 配置](./tools/vscode.md) - 插件推荐、设置优化、远程开发
- [IntelliJ IDEA](./tools/intellij.md) - Java开发、插件生态
- [PyCharm](./tools/pycharm.md) - Python开发、科学计算

### 版本控制
- [Git 工作流](./tools/git-workflow.md) - 分支策略、代码审查、冲突解决
- [GitHub 协作](./tools/github-collaboration.md) - PR流程、Issue管理、项目管理
- [GitLab 企业应用](./tools/gitlab-enterprise.md) - CI/CD、容器注册表

### 构建与包管理
- [Maven/Gradle](./tools/build-tools.md) - 项目构建、依赖管理、多模块
- [npm/yarn/pnpm](./tools/package-managers.md) - 包管理、工作区、性能优化
- [Webpack/Vite](./tools/bundlers.md) - 模块打包、优化配置

### 测试工具
- [单元测试](./tools/unit-testing.md) - JUnit、pytest、Jest
- [集成测试](./tools/integration-testing.md) - TestContainers、WireMock
- [性能测试](./tools/performance-testing.md) - JMeter、k6、负载测试

## 📊 数据与分析

### 数据工程
> 数据工程/大数据方向偏中高级，暂时下线。
- [数据湖](./data/data-lake.md) - 架构设计、数据治理、成本优化
- [实时数据处理](./data/stream-processing.md) - Kafka Streams、Flink、Spark Streaming

### 商业智能
- [数据可视化](./data/visualization.md) - Tableau、Power BI、开源替代
- [报表系统](./data/reporting.md) - 动态报表、仪表板设计
- [数据分析](./data/analytics.md) - SQL分析、Python分析、统计建模

---

💡 **更新计划**: 每个技术领域会持续更新最新内容，涵盖新版本特性、最佳实践和行业趋势。欢迎关注和投稿！