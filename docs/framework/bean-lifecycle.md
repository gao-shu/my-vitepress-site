# Spring Bean 生命周期与循环依赖

---

### ❓ 面试官：能详细说说 Spring Bean 的生命周期吗？从创建到销毁经历了哪些步骤？
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
Spring Bean 的生命周期包括：**实例化 → 属性填充 → 初始化 → 使用 → 销毁**。其中初始化阶段会执行 `@PostConstruct`、`InitializingBean`、`init-method` 等方法。

**📝 详细生命周期流程（面试必背）：**

1. **实例化（Instantiation）**：
   - Spring 通过反射调用构造器创建 Bean 实例。

2. **属性填充（Populate Properties）**：
   - 通过 `@Autowired`、`@Value` 等注解注入依赖。

3. **初始化前（Before Initialization）**：
   - 执行 `BeanPostProcessor.postProcessBeforeInitialization()`。

4. **初始化（Initialization）**：
   - 执行 `@PostConstruct` 注解的方法。
   - 执行 `InitializingBean.afterPropertiesSet()`。
   - 执行自定义的 `init-method`。

5. **初始化后（After Initialization）**：
   - 执行 `BeanPostProcessor.postProcessAfterInitialization()`（AOP 代理就是在这里创建的）。

6. **使用阶段**：
   - Bean 可以被正常使用了。

7. **销毁（Destroy）**：
   - 容器关闭时，执行 `@PreDestroy`、`DisposableBean.destroy()`、自定义 `destroy-method`。

**🌟 实战应用（加分项）：**
"在项目中，我们经常在 `@PostConstruct` 方法里做一些初始化工作，比如加载配置、预热缓存。在 `@PreDestroy` 方法里做资源清理，比如关闭线程池、释放连接。"

---

### ❓ 面试官：Spring 是如何解决循环依赖的？能详细说说三级缓存机制吗？【中级】
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
Spring 通过**三级缓存（三个 Map）**来解决循环依赖问题。核心思想是：**提前暴露半成品的 Bean（只完成了实例化，还没完成属性填充）**，让其他 Bean 可以先拿到这个半成品，完成自己的初始化。

**📝 三级缓存详解：**

假设有两个类互相依赖：
- `UserService` 依赖 `OrderService`
- `OrderService` 依赖 `UserService`

**三级缓存结构**：
```java
// 一级缓存：存放完整的单例 Bean（成品）
singletonObjects

// 二级缓存：存放半成品 Bean（提前暴露的，用于解决循环依赖）
earlySingletonObjects

// 三级缓存：存放 Bean 工厂（用于生成 AOP 代理对象）
singletonFactories
```

**解决流程（简化版）**：
1. 创建 `UserService`：实例化后，放入三级缓存（工厂对象）。
2. 填充 `UserService` 属性时，发现需要 `OrderService`。
3. 创建 `OrderService`：实例化后，放入三级缓存。
4. 填充 `OrderService` 属性时，发现需要 `UserService`。
5. 从三级缓存中拿到 `UserService` 的工厂，创建半成品 `UserService`，放入二级缓存。
6. `OrderService` 拿到半成品 `UserService`，完成自己的初始化，放入一级缓存。
7. `UserService` 拿到完整的 `OrderService`，完成自己的初始化，放入一级缓存。

**🌟 为什么需要三级缓存？**
"如果只有两级缓存，当存在 AOP 代理时，无法区分是返回原始对象还是代理对象。三级缓存通过工厂模式，可以在需要时动态创建代理对象，保证循环依赖时也能正确生成 AOP 代理。"