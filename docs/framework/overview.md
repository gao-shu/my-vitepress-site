# 框架面试总览：Spring / SpringBoot / MyBatis 高频 8 题

> 这篇不是从零教你 Spring，而是帮我梳理一遍**初/中级面试最常问的框架题**，细节放在后面的专题文章里慢慢看。

---

## 一、框架高频面试题总表

1. **能不能通俗地讲讲什么是 Spring IoC 和 DI？项目里带来了什么好处？**  
   - 关键点：控制反转、依赖注入、解耦、通过注解 + 容器管理 Bean。  
   - 👉 详细见：[Spring 核心原理（IoC 与 AOP）](/framework/spring-core)

2. **AOP 是什么？你们项目里在哪些场景用到了 AOP？**  
   - 关键点：横切关注点、日志、权限校验、埋点、事务、本质是动态代理。  
   - 👉 详细见：[Spring 核心原理（IoC 与 AOP）](/framework/spring-core)

3. **`@Transactional` 是怎么实现事务的？什么时候会“事务失效”？**  
   - 关键点：AOP 代理 + 动态代理、方法必须通过代理对象调用、`public` 方法、同类内部调用会失效等。  
   - 👉 详细见：[事务传播机制详解](/framework/transaction-propagation)、[场景实战：事务失效分析](/framework/transaction-scenario)

4. **能简单说一下 Spring Bean 的生命周期吗？**  
   - 关键点：实例化 → 属性注入 → 初始化（各种回调）→ 销毁，`BeanPostProcessor`、`@PostConstruct` / `@PreDestroy`。  
   - 👉 详细见：[Bean 生命周期与循环依赖](/framework/bean-lifecycle)

5. **什么是循环依赖？Spring 是怎么解决的？**【中级】  
   - 关键点：构造器循环依赖 vs setter 循环依赖、三级缓存思想。  
   - 👉 详细见：[Bean 生命周期与循环依赖](/framework/bean-lifecycle)

6. **SpringBoot 相比传统 Spring 有什么优势？能说说自动配置的原理吗？**  
   - 关键点：`starter`、约定大于配置、`@SpringBootApplication`、自动配置类、`spring.factories` / `AutoConfiguration`。  
   - 👉 详细见：[SpringBoot 原理](/framework/springboot-principle)

7. **MyBatis 的一级缓存、二级缓存有什么区别？在项目里一般怎么用？**  
   - 关键点：作用范围（SqlSession / Mapper 级别）、默认开启与否、和 Redis 缓存的关系。  
   - 👉 详细见：[MyBatis/MyBatis-Plus](/framework/mybatis)

8. **常见的分层架构（Controller / Service / DAO）是怎么划分职责的？**  
   - 关键点：Controller 负责接收请求和返回结果、Service 写业务逻辑、DAO/Mapper 只做数据访问。  
   - 可以准备一个自己项目里的简单接口，从 Controller 一路讲到 Mapper。

9. **在 Spring 项目里，如何正确地使用多线程？高并发接口一般怎么做保护？**【中级】  
   - 关键点：统一使用 `ThreadPoolTaskExecutor` + `@Async` 管理线程；通过限流（拦截器 + Redis）、超时控制、幂等设计、防超卖等手段保护接口。  
   - 👉 详细见：[Spring 中的多线程与高并发实战](/framework/concurrency-spring)

建议：这 8 题先自己写一份**“2～3 分钟的口述答案 + 可能被追问的点”**，做到能顺着讲下来，不被打断。

---

## 二、如何使用这个框架面试模块

- **第一步：先把这 8 题讲顺**  
  面试前，可以自测一下：拿手机录音，从 IoC/AOP 讲到事务/自动配置，看自己能不能连贯说下来。

- **第二步：对照专题文章补齐细节**  
  哪一块感觉讲得空洞，就回到对应文档：
  - IoC / AOP 基本概念与应用 → `/framework/spring-core`
  - Bean 生命周期、循环依赖 → `/framework/bean-lifecycle`
  - 事务传播 & 常见事务失效 → `/framework/transaction-propagation`、`/framework/transaction-scenario`
  - SpringBoot 自动配置原理 → `/framework/springboot-principle`
  - MyBatis 核心机制与常见坑 → `/framework/mybatis`

- **第三步：准备 1～2 个和框架相关的项目案例**  
  比如：
  - “我们项目里有个下单接口，用了哪些注解、怎么通过 AOP 做日志/权限校验、用 `@Transactional` 保证下单过程的原子性……”  
  - “曾经遇到过事务失效/循环依赖的问题，我是怎么排查并解决的……”  
  - “系统有一些高并发接口（如下单、秒杀），我们是怎么用 `@Async + 线程池` 做异步处理、在网关/拦截器做限流、在业务层做幂等和防超卖的……”

面试里，只要围绕**这 8 题 + 你自己的项目**展开，大部分初/中级的框架相关问题都能比较从容地应对。

