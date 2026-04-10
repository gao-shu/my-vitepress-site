# Java/Spring 生态

Java/Spring 生态是企业级后端开发的主流技术栈，涵盖从基础语法到微服务架构的完整解决方案。

## Java 基础

### JVM 虚拟机
- **JVM 内存模型**: 堆、栈、方法区、程序计数器
- **垃圾回收机制**: GC算法、垃圾收集器选择、分代回收
- **JVM 调优**: 参数配置、性能监控、内存分析
- **字节码**: Class文件结构、字节码指令、JIT编译

### Java 并发编程
- **线程基础**: 线程创建、生命周期、线程安全
- **并发工具类**: Atomic、Lock、Semaphore、CountDownLatch
- **线程池**: Executor框架、线程池参数配置
- **并发容器**: ConcurrentHashMap、BlockingQueue

### Java 新特性
- **Java 8**: Lambda表达式、Stream API、Optional、新的日期API
- **Java 11**: var关键字、字符串API增强、Epsilon GC
- **Java 17**: Sealed Classes、Pattern Matching、Records

## Spring 框架

### Spring Core
- **IoC 容器**: Bean生命周期、依赖注入、Bean作用域
- **AOP 面向切面**: 切点表达式、通知类型、代理机制
- **事件机制**: ApplicationEvent、事件监听器

### Spring Boot
- **自动配置**: @EnableAutoConfiguration、条件注解
- **Starter**: 官方Starter、自定义Starter开发
- **配置管理**: application.yml、@ConfigurationProperties
- **Actuator**: 健康检查、指标监控、环境信息

### Spring Data
- **JPA/Hibernate**: 实体映射、查询方法、事务管理
- **MongoDB**: 文档映射、查询操作、索引管理
- **Redis**: 缓存抽象、数据类型操作
- **Elasticsearch**: 搜索抽象、索引管理

## 微服务架构

### 服务拆分
- **DDD 领域驱动设计**: 限界上下文、聚合、实体
- **服务边界**: 康威定律、业务边界识别
- **数据一致性**: 分布式事务、Saga模式、事件溯源

### 服务通信
- **RESTful API**: HTTP方法、状态码、HATEOAS
- **RPC 框架**: Dubbo、gRPC、Thrift
- **消息队列**: RabbitMQ、Kafka、RocketMQ
- **服务网格**: Istio、Linkerd

### 服务治理
- **服务发现与实例健康**: 注册中心、心跳、实例上下线
- **负载均衡与调用**: 路由、超时、重试与幂等
- **熔断与限流**: 舱壁、熔断降级、限流
- **API 网关**: 统一入口、路由、鉴权与观测

## 数据库集成

### MySQL
- **连接池**: HikariCP、Druid配置优化
- **ORM**: JPA、MyBatis、MyBatis-Plus
- **分库分表**: ShardingSphere、MyCat
- **读写分离**: 主从复制、代理层

### Redis
- **数据类型**: String、Hash、List、Set、ZSet
- **持久化**: RDB、AOF、混合持久化
- **集群**: 主从复制、哨兵模式、Cluster
- **缓存策略**: 缓存穿透、缓存雪崩、缓存击穿

### Elasticsearch
- **索引管理**: 映射、设置、分词器
- **查询DSL**: 结构化查询、全文检索
- **聚合分析**: 指标聚合、桶聚合
- **集群管理**: 节点角色、分片、副本

## 安全与认证

### Spring Security
- **认证方式**: 表单登录、HTTP Basic、OAuth2
- **授权模型**: 基于角色的访问控制、方法级安全
- **JWT**: 无状态认证、Token刷新
- **SSO**: 单点登录实现

### OAuth2
- **授权码模式**: 标准OAuth2流程
- **密码模式**: 资源所有者密码凭据
- **客户端模式**: 客户端凭据授权
- **简化模式**: 隐式授权

## 性能优化

### JVM 调优
- **内存调优**: 堆大小、GC参数、新生代比例
- **GC 调优**: 垃圾收集器选择、GC日志分析
- **JIT 编译**: 编译阈值、代码缓存

### 应用优化
- **缓存策略**: 多级缓存、本地缓存、分布式缓存
- **异步处理**: @Async、CompletableFuture、消息队列
- **连接池**: 数据库连接池、HTTP连接池
- **监控告警**: JVM监控、应用指标、APM

## 测试

### 单元测试
- **JUnit 5**: 测试生命周期、参数化测试、动态测试
- **Mockito**: 模拟对象、行为验证、参数匹配
- **Testcontainers**: 集成测试容器化

### 集成测试
- **Spring Test**: @SpringBootTest、测试切片
- **REST Assured**: REST API测试
- **WireMock**: HTTP服务模拟

## 部署与运维

### 容器化
- **Docker**: 多阶段构建、镜像优化
- **Docker Compose**: 多服务编排
- **Kubernetes**: Deployment、Service、ConfigMap

### CI/CD
- **Jenkins**: Pipeline as Code、插件生态
- **GitLab CI**: .gitlab-ci.yml、流水线设计
- **GitHub Actions**: 工作流模板、Actions市场

## 最佳实践

### 代码规范
- **命名规范**: 包命名、类命名、方法命名
- **代码结构**: 分层架构、职责分离
- **异常处理**: 异常分类、异常链

### 设计模式
- **创建型模式**: 工厂模式、单例模式、建造者模式
- **结构型模式**: 适配器模式、装饰器模式、代理模式
- **行为型模式**: 观察者模式、策略模式、模板方法

### 架构模式
- **分层架构**: 表示层、业务层、数据访问层
- **领域驱动设计**: 领域模型、应用服务、基础设施
- **CQRS**: 命令查询职责分离、事件溯源