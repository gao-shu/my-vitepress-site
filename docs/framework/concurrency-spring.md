# Spring 中的多线程与高并发实战（初/中级）

> 这一篇不讲 JVM 细节，重点是：**在 Spring/SpringBoot 项目里，怎么“正确地”用多线程和保护接口，扛住高并发。**

---

## 一、面试官常问的几类问题

1. 你们项目里有用到多线程吗？**是怎么用的，用的是什么线程池？**
2. `@Async` 是怎么用的？线程池在哪里配置？怎么排查线程池打满的问题？
3. 高并发请求打到一个接口上时，你们有什么**限流/降级**措施？
4. 订单、库存这类接口，怎么避免**重复请求、超卖**？

下面用几个常见场景，把这些问题串起来。

---

## 二、在 Spring 里“正确”地用线程池和 @Async

### 1. 不要在 Controller 里随手 `new Thread()`

- 在 Web 项目里，最常见的错误就是：
  ```java
  // ❌ 反例：Controller 里直接创建线程
  @PostMapping("/order")
  public String createOrder() {
      new Thread(() -> doCreateOrder()).start();
      return "OK";
  }
  ```
- 问题：
  - 线程没办法统一管理（数量不可控、OOM 风险）。
  - 无法方便地打日志、监控、设置名字。

**面试可以直接说一句：所有线程资源都应该交给 Spring 管理，通过线程池统一配置和监控。**

### 2. 使用 `@Async` + 线程池

**基本步骤：**

1. 开启异步支持：
   ```java
   @EnableAsync
   @SpringBootApplication
   public class Application { }
   ```

2. 配置一个线程池 Bean：
   ```java
   @Configuration
   public class AsyncConfig {

       @Bean("commonExecutor")
       public ThreadPoolTaskExecutor commonExecutor() {
           ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
           executor.setCorePoolSize(4);
           executor.setMaxPoolSize(8);
           executor.setQueueCapacity(100);
           executor.setThreadNamePrefix("async-");
           executor.initialize();
           return executor;
       }
   }
   ```

3. 在 Service 上使用 `@Async`：
   ```java
   @Service
   public class NotifyService {

       @Async("commonExecutor")
       public void sendEmail(String userId) {
           // 发送邮件的耗时操作
       }
   }
   ```

> 面试时可以简单描述：**“我们项目里所有异步任务都是用 `@Async + ThreadPoolTaskExecutor`，线程池参数统一配置，可监控、可限流。”**

---

## 三、高并发接口的保护：限流 + 超时 + 降级

高并发场景下，面试官常问：**“如果突然有很多请求打到一个接口上，你们怎么防止系统被打挂？”**

可以从三点去回答：**限流、超时、降级**。

### 1. 简单限流思路（基于拦截器 + Redis）

- 在网关或 SpringMVC 拦截器里，对某个接口做 QPS 限制：
  - 例如：每个用户/每个 IP，每分钟最多调用 N 次。
  - 可以在 Redis 里以 `key = userId:接口名` 方式计数，超过阈值直接返回友好提示。

**示意代码（伪代码）：**
```java
String key = userId + ":order:create";
Long count = redis.incr(key);
redis.expire(key, 60); // 60 秒窗口
if (count > 100) {
    throw new BizException("请求过于频繁，请稍后再试");
}
```

> 面试时不需要写很完整的代码，重点讲清楚“**在拦截器/网关层做限流，落地可以用 Redis 计数或接入 Sentinel/Resilience4j 这类组件**”。

### 2. 接口调用链的超时和降级

- 外部接口（如三方支付、短信服务）：
  - 在 `RestTemplate` / WebClient / OpenFeign 上设置**连接超时、读取超时**。
  - 超过阈值快速返回，并记录日志，避免线程长时间挂起。
- 可以配合熔断/降级：
  - 比如短信服务挂了，先记录日志 + 落库，后面用定时任务补发，而不是让用户页面一直转圈。

一句话总结：**“宁可早点失败，也不要让线程一直卡住，把整个线程池拖垮。”**

---

## 四、高并发下的典型业务问题：重复下单、库存超卖

> 这一块和数据库/Redis 有一定关系，但经常会在 “Spring + 高并发” 场景一块被问到，可以准备一个通用的回答思路。

### 1. 重复下单（接口被多次点击 / 重复请求）

常见几种处理方式：

1. **前端防重复点击**：按钮置灰、节流，但只能作为第一层防线。
2. **后端幂等设计**：
   - 生成一个业务幂等号（如订单提交 token），一次请求用一次。
   - 在 Redis 里 `SETNX` 保存，如果已存在说明是重复请求，直接返回上次结果或提示。
3. **数据库唯一约束**：
   - 例如订单表里 `(user_id, activity_id)` 建唯一索引，从根上防止“一人多单”。

### 2. 库存超卖（秒杀场景）

可以简单提到两层思路：

- **减库存操作必须放在事务里，搭配行锁/版本号**，避免并发修改同一行导致脏数据。
- 高并发场景可以先用 **Redis 预减库存 + MQ 异步落库**，减少数据库压力（这一块可以略讲，不深入细节）。

> 面试时，重点是给出“**我们不是只靠前端，而是从 Redis + 数据库约束两层防御**”这样的思路。

---

## 五、总结：怎么把这些讲成一个完整的“高并发”回答？

可以准备一个统一的说法，例如：

- 我们项目中高并发相关主要做了几件事：
  1. **多线程**：所有异步任务统一使用 `@Async + ThreadPoolTaskExecutor`，线程池参数集中配置，方便监控和调优。
  2. **接口保护**：在网关/拦截器层做简单限流（基于 Redis 计数），同时为外部接口配置合理的超时时间，避免线程池被占满。
  3. **业务幂等与防超卖**：订单/库存等敏感接口通过幂等号 + 数据库唯一约束 + 合理的事务/锁机制，避免重复下单和超卖。
- 这样既能展示你**懂一些多线程基础**，又能体现你在 **Spring 框架下具体是怎么落地高并发处理** 的。 

