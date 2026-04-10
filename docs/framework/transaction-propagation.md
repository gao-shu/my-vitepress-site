# Spring 事务传播机制详解

---

### ❓ 面试官：Spring 的 `@Transactional` 注解有哪些事务传播行为？`REQUIRED` 和 `REQUIRES_NEW` 有什么区别？
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
Spring 定义了 7 种事务传播行为，最常用的是 `REQUIRED`（默认）和 `REQUIRES_NEW`。`REQUIRED` 表示如果当前有事务就加入，没有就新建；`REQUIRES_NEW` 表示**无论当前是否有事务，都新建一个独立的事务**。

**📝 七种传播行为详解：**

1. **`REQUIRED`（默认，最常用）**：
   - 如果当前有事务，就加入；没有就新建。
   - **场景**：99% 的业务方法都用这个。

2. **`REQUIRES_NEW`（常用，独立事务）**：
   - **无论当前是否有事务，都新建一个独立事务**。
   - **场景**：记录操作日志。即使主业务回滚了，日志也要保存。

3. **`SUPPORTS`**：
   - 如果当前有事务就加入，没有就以非事务方式执行。

4. **`NOT_SUPPORTED`**：
   - 以非事务方式执行，如果当前有事务，会挂起当前事务。

5. **`MANDATORY`**：
   - 必须在事务中执行，如果当前没有事务，抛异常。

6. **`NEVER`**：
   - 必须在非事务中执行，如果当前有事务，抛异常。

7. **`NESTED`**：
   - 如果当前有事务，创建一个嵌套事务（保存点）；没有就新建。

**🔥 实战场景对比（面试高频）：**

**场景：用户下单后，需要记录操作日志**

```java
@Transactional
public void createOrder() {
    // 创建订单
    orderService.save(order);
    
    // 记录日志（希望即使订单失败，日志也要保存）
    logService.saveLog();  // 如果这里也用 REQUIRED，订单回滚时日志也会回滚
}
```

**解决方案**：
```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void saveLog() {
    // 即使外层事务回滚，这个独立事务也会提交
}
```

**🌟 面试加分项（常见陷阱）：**
"很多同学在同一个类中调用带 `@Transactional` 的方法，发现事务不生效。这是因为 Spring AOP 是基于代理的，**只有通过代理对象调用，事务才会生效**。同一个类内部调用，走的是 `this.method()`，绕过了代理，所以事务失效。解决方法：注入自己（`@Autowired private LogService self;`）或者把方法提取到另一个 Service 类中。"