# Node.js 全栈开发

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，使开发者可以用 JavaScript 构建高性能、可扩展的服务器端应用。

## Node.js 基础

### 运行时环境
- **V8 引擎**: JavaScript 解析、编译、优化
- **事件循环**: 非阻塞 I/O、异步编程、高并发
- **模块系统**: CommonJS、ES Modules、模块加载
- **包管理**: npm、yarn、pnpm、版本管理

### 核心 API
- **文件系统**: fs 模块、文件读写、流式处理
- **HTTP 服务**: http 模块、连接管理、请求处理
- **事件驱动**: EventEmitter、事件管理、发布订阅
- **进程管理**: child_process、多进程、工作池

## 后端框架

### Express.js
- **基础**: middleware 机制、路由定义、请求处理
- **中间件**: 身份认证、日志、错误处理、CORS
- **性能**: 连接池、缓存策略、性能优化
- **扩展**: 插件生态、第三方集成

### NestJS
- **架构**: 模块化设计、依赖注入、装饰器
- **核心**: 控制器、服务、提供者、拦截器
- **应用**: 微服务、GraphQL、WebSocket
- **最佳实践**: 测试驱动、代码生成

### Fastify
- **高性能**: 异步处理、流式响应、低延迟
- **插件系统**: 功能扩展、模块管理
- **JSON Schema**: 请求验证、序列化优化
- **大规模应用**: 可扩展性、生产就绪

## 数据访问

### 数据库驱动
- **SQL 驱动**: MySQL、PostgreSQL、连接管理
- **NoSQL 驱动**: MongoDB、Redis、DynamoDB
- **ORM/ODM**: TypeORM、Sequelize、Mongoose
- **事务管理**: ACID、事务处理、一致性

### API 设计
- **RESTful API**: 资源设计、HTTP 方法、状态管理
- **GraphQL**: Schema 定义、查询优化、实时订阅
- **gRPC**: Protocol Buffers、高性能通信、流式处理
- **版本管理**: API 版本控制、向后兼容、迁移策略

## 异步编程

### 异步模式
- **Callbacks**: 回调函数、error-first 模式
- **Promises**: 状态管理、链式调用、错误处理
- **Async/Await**: 代码可读性、错误处理、流程控制
- **RxJS**: 响应式编程、流处理、操作符

### 并发控制
- **队列管理**: 任务队列、优先级、背压处理
- **资源池**: 连接池、线程池、工作线程
- **限流降级**: 令牌桶、漏桶、熔断

## 测试与调试

### 单元测试
- **框架**: Jest、Mocha、Vitest
- **断言库**: Chai、Expect、Should
- **Mock**: Sinon、jest.mock、模拟数据
- **覆盖率**: 代码覆盖、质量指标

### 调试工具
- **Chrome DevTools**: 远程调试、性能分析
- **Node Inspector**: 命令行调试、断点调试
- **日志框架**: Winston、Pino、Bunyan
- **性能监控**: 内存泄漏、CPU 分析、火焰图

## 部署与运维

### 容器化
- **Docker**: 镜像构建、容器打包、镜像优化
- **多阶段构建**: 缩小镜像体积、构建优化
- **Docker Compose**: 本地开发、环境一致性

### 进程管理
- **PM2**: 进程守护、负载均衡、集群模式
- **systemd**: 服务管理、系统集成
- **守护进程**: 自动重启、日志管理、监控

### 云部署
- **Heroku/Vercel**: 云平台部署、自动化部署
- **AWS Lambda**: Serverless 函数、事件驱动
- **Kubernetes**: 容器编排、自动扩容、服务发现

## 完整技术栈

### MEAN Stack
- MongoDB、Express、Angular、Node.js
- 全 JavaScript 栈、端到端开发

### MERN Stack  
- MongoDB、Express、React、Node.js
- 现代化前后端分离架构

### PERN Stack
- PostgreSQL、Express、React、Node.js
- 企业级应用架构

## 最佳实践

### 代码组织
- 分层架构、模块化设计、关注分离
- 路由、中间件、服务、数据访问层

### 性能优化
- 缓存策略、数据库查询优化
- 连接复用、流式传输、压缩传输

### 安全实践
- 输入验证、认证授权、加密存储
- 依赖管理、漏洞扫描、安全审计
