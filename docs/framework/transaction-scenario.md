# 场景实战：Spring 事务失效分析

---

### ❓ 面试实战：你们项目中 `@Transactional` 事务有失效过吗？一般是什么原因导致的？
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
我们在开发中确实踩过不少事务失效的坑。排查下来，`90%` 的原因都是**破坏了 Spring AOP 的代理机制**（比如发生了“同类内部方法自调用”），另外 `10%` 是因为**异常被手动吃掉（catch）**或者**抛出了不受检的异常类型**。

**📝 详细经典失效场景与解决方案（面试高分答题模板）：**

#### 场景一：同类内部方法自调用（最经典、最容易犯的错）
- **错误代码重现**：
  ```java
  @Service
  public class OrderService {
      public void createOrder() {
          // 在没有加事务的方法里，直接调用了加了事务的方法
          updateStock(); 
      }

      @Transactional
      public void updateStock() {
          // 扣减库存，发生异常
          int a = 1 / 0; 
      }
  }
  ```
- **为什么失效？**
  Spring 事务的底层是 AOP 动态代理。当你从 Controller 调 `createOrder` 时，拿到的是代理对象。但由于 `createOrder` 没加事务，代理对象就直接调用了真实对象的原生 `createOrder` 方法。
  在真实对象的内部，执行 `updateStock()` 相当于 `this.updateStock()`。这个 `this` 指向的是**原生对象自己**，而不是被 Spring 增强过的代理对象！所以切面逻辑（开启事务、提交、回滚）根本没有被触发，直接裸奔执行了。
- **怎么解决？**
  1. **最推荐：重构代码**。把 `updateStock` 抽离到另一个 `StockService` 类中去调用。
  2. **懒人解法（暴露代理）**：在类上加 `@EnableAspectJAutoProxy(exposeProxy = true)`，然后在代码里强行拿到当前代理对象再去调用：`((OrderService) AopContext.currentProxy()).updateStock();`。
  3. **利用自己注入自己**：在 `OrderService` 里 `@Autowired` 自己，然后用注入的对象调用。

#### 场景二：异常被手动 catch 给吃了（极其坑人）
- **错误代码重现**：
  ```java
  @Transactional
  public void doBiz() {
      try {
          userMapper.insert();
          int a = 1 / 0; // 发生异常
      } catch (Exception e) {
          log.error("插入失败", e);
          // 致命错误：抓住了异常却没有往外抛出！
      }
  }
  ```
- **为什么失效？**
  Spring 的 AOP 切面是包裹在 `doBiz()` 外面的。它是否回滚，完全取决于它**能不能捕捉到你方法里抛出的异常**。
  现在异常被你自己的 `try-catch` 给悄悄“消化”了，方法正常执行结束。外面的切面一看，哦，没报错，然后**开心地执行了 `commit` 提交事务**！于是脏数据就这么存进数据库了。
- **怎么解决？**
  如果在事务方法里必须要写 catch，在 catch 块的最后，**必须手动抛出个 RuntimeException**，或者手动触发回滚：`TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();`。

#### 场景三：修饰符错误或异常类型不匹配
1. **非 `public` 方法**：
   - `@Transactional` 只能加在 `public` 方法上。如果加在 `private` 或 `protected` 方法上，Spring AOP 在拦截时会直接放行，事务彻底失效。
2. **默认只回滚 `RuntimeException` 和 `Error`**：
   - 如果你方法里抛出了一个受检异常（比如 `IOException` 或者自定义的非运行时异常），Spring 默认是**不回滚**的！
   - **血泪教训解决方案**：在公司开发规范里，强制要求所有 `@Transactional` 必须写成 **`@Transactional(rollbackFor = Exception.class)`**，不管抛什么异常通统回滚，防患于未然。

---

### ❓ 面试实战：除了以上这些，如果遇到嵌套事务（多方法互相调用都有事务），它是怎么控制的？（事务传播行为）【中高级】
*频率：🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
这就是 Spring 的**事务传播行为（Propagation）**。默认的策略是 `REQUIRED`（如果当前没事务，就建一个；如果外层有事务，就加入外层的，大家同生共死）。但我们在实际业务中最常用的是 **`REQUIRES_NEW`**（不管外层有没有，我自己必须新建一个独立的事务，死活不连累别人）。

**📝 核心实战场景：日志记录不随主业务回滚**
- **业务痛点**：订单支付接口里，无论支付成功还是失败抛了异常（主事务回滚），我都必须在数据库里记录一条“支付流水请求日志”。
- **错误做法**：如果你把 `saveLog()` 和 `pay()` 都用默认的 `REQUIRED`。当 `pay()` 抛异常时，外层事务大回滚，刚刚成功保存的 `saveLog()` 也会被无情地一起回滚掉！连追查报错的日志都没了。
- **正确做法**：
  在 `LogService.saveLog()` 方法上，加上 **`@Transactional(propagation = Propagation.REQUIRES_NEW)`**。
  - 原理：当执行到 `saveLog` 时，Spring 会把外层的支付事务先挂起，然后**新建一个全新的事务**给 `saveLog` 用。
  - 效果：`saveLog` 自己执行完立马 `commit` 落盘。随后即使外层支付业务抛异常导致外层事务回滚，它绝对不会影响到已经独立提交的日志记录。