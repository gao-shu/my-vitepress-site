# 并发编程核心机制（锁、JMM、CAS）

## 本模块面试重点

- **锁机制**：`synchronized` / `volatile` / `Lock` 的适用场景与底层原理。
- **JMM 与可见性**：Java 内存模型、`happens-before` 规则、`volatile` 能做什么、不能做什么。
- **CAS 无锁机制**：原子操作原理、ABA 问题及解决方案。
- **常用并发类**：`ConcurrentHashMap`、`CountDownLatch`、`Semaphore`、`Future` 等的场景。
- **ThreadLocal**：使用场景、内存泄漏风险、线程池中的脏数据问题。

---

### ❓ 面试官：Java 里有哪些锁？能讲讲 synchronized 和 ReentrantLock 的区别吗？【中级】
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
`synchronized` 是 Java 语言内置的**关键字（隐式锁）**，基于 JVM 层面实现，使用最简单；`ReentrantLock` 是 JUC 包下的**API 类（显式锁）**，基于 AQS 底层实现，功能更强大灵活（支持公平锁、响应中断、超时尝试）。

**📝 详细对比：**
| 维度 | `synchronized` (内置锁) | `ReentrantLock` (API 锁) |
|------|-------------------------|--------------------------|
| **底层实现** | JVM 层面的 Monitor 对象（C++ 实现） | Java 层面的 AQS 机制（CAS + 队列） |
| **加锁释放** | 自动加锁，代码块执行完/抛异常自动释放，**绝不会死锁** | 必须手动 `lock()`，且必须在 `finally` 中 `unlock()`，否则可能死锁 |
| **灵活性** | 只能是非公平锁、不可中断 | 可配置公平/非公平、支持 `lockInterruptibly()` 响应中断、支持 `tryLock(time)` 超时放弃 |
| **锁升级优化**| JDK 6 引入了偏向锁 → 轻量级锁 → 重量级锁的自动升级过程 | 始终是重量级控制，但由于是 Java 代码，自旋逻辑更可控 |

**🎯 使用建议：**
- **优先用 `synchronized`**：90% 的场景都够用，代码简洁，不会忘记释放锁。
- **需要高级特性时用 `ReentrantLock`**：如需要公平锁、需要尝试获取锁（`tryLock`）、需要响应中断等。

---

### ❓ 面试官：什么是 volatile 关键字？它能保证线程安全吗？【中高级】
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
`volatile` 是 Java 最轻量级的同步机制。它只能保证变量的**可见性**和**有序性（禁止指令重排）**，但**不能保证原子性**！因此，它**不能**完全替代锁来保证线程安全（比如 `volatile int i; i++` 依然是不安全的）。

**📝 详细原理解析：**
1. **可见性（保证读到最新值）**：
   - 现代 CPU 都有多级缓存（L1/L2 Cache）。Java 线程在读取主内存变量时，会先拷贝一份到自己的工作内存里。
   - 线程 A 修改了变量，没有及时刷回主内存；线程 B 读的依然是自己工作内存里的旧值（脏读）。
   - 加了 `volatile` 后：**强制线程每次写完立刻刷回主内存，强制其他线程每次读都必须直接去主内存拉取最新值**。
2. **有序性（禁止指令重排）**：
   - 编译器和 CPU 为了性能，有时候会把我们写的代码顺序打乱（比如把毫不相干的两行代码颠倒执行）。
   - 在单线程下没问题，但在多线程（最经典的 DCL 单例模式）下会导致灾难。`volatile` 底层通过插入**内存屏障（Memory Barrier）**来禁止前后指令重排序。
3. **为什么不能保证原子性？**
   - `i++` 其实分为三步：取值、加 1、写回。
   - `volatile` 只保证取值那一瞬间是最新的。但在加 1 的过程中，如果另一个线程抢先写回了新值，当前线程再写回时依然会发生数据覆盖。保证原子性必须用 `synchronized` 或者 `AtomicInteger`（CAS）。

**🌟 经典应用场景：**
```java
// 场景 1：状态标志位（一写多读）
private volatile boolean shutdown = false;

public void shutdown() {
    shutdown = true;  // 一个线程修改
}

public void doWork() {
    while (!shutdown) {  // 多个线程读取，保证看到最新值
        // 执行业务逻辑
    }
}

// 场景 2：DCL 单例模式（双重检查锁定）
public class Singleton {
    private static volatile Singleton instance;  // 必须加 volatile！
    
    public static Singleton getInstance() {
        if (instance == null) {  // 第一次检查，不加锁提高性能
            synchronized (Singleton.class) {
                if (instance == null) {  // 第二次检查，防止重复创建
                    instance = new Singleton();  // 这行代码会被重排序，volatile 禁止重排
                }
            }
        }
        return instance;
    }
}
```

---

### ❓ 面试官：你刚刚提到了 CAS，能说说什么是 CAS 吗？它有什么缺点？（ABA 问题）【高级】
*频率：🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
CAS（Compare And Swap，比较并交换）是一种**无锁（乐观锁）**的原子并发机制。它包含三个操作数：内存地址 V、旧的预期值 A、准备写入的新值 B。**当且仅当 V 处的值等于 A 时，才把 V 的值更新为 B**。

**📝 详细原理解析与缺点：**
- **底层原理**：CAS 不是 Java 实现的，它是直接调用底层的 `Unsafe` 类，映射到了底层 CPU 提供的硬件级别的原子指令（如 x86 的 `cmpxchg` 指令），绝对保证操作原子性且不需要挂起线程。
- **三大缺点（必考坑点）**：
  1. **自旋开销大**：如果运气不好，一直有别的线程在修改值，CAS 会一直失败并进入 `while(true)` 死循环（自旋），极大地消耗 CPU 资源。
  2. **只能保证一个共享变量**：如果要同时原子的修改多个变量，CAS 无能为力，必须上 `synchronized` 锁。
  3. **ABA 问题（致命大坑）**：
     - 线程 1 读到共享变量的值是 A，准备改成 C。
     - 就在这时，线程 2 跑过来，先把 A 改成了 B，紧接着又把 B 改回了 A！
     - 线程 1 醒来执行 CAS，发现变量的值还是 A（其实已经是被修改过无数次又变回来的伪装 A），于是很开心地修改成了 C。
     - **解决方案**：引入版本号（Version）。每次修改变量时版本号 +1（A1 -> B2 -> A3）。JDK 提供了 `AtomicStampedReference` 类来解决这个问题，CAS 比较时不仅比对值，还必须比对版本号。

**🎯 常见 CAS 应用：**
```java
// AtomicInteger 内部就是基于 CAS 实现
AtomicInteger count = new AtomicInteger(0);
count.incrementAndGet();  // 原子自增，比 i++ 线程安全

// AtomicReference 用于引用类型
AtomicReference<String> ref = new AtomicReference<>("initial");
ref.compareAndSet("initial", "updated");  // CAS 更新
```

---

### ❓ 面试官：什么是 Java 内存模型（JMM）？"happens-before" 大概是什么意思？【中级】
*频率：🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
JMM 规定了**线程之间如何通过内存（主内存 + 工作内存）来进行通信**，以及哪些操作在别的线程看来一定是"先发生"的，这套规则就叫 `happens-before`。只要能说清几条常见规则（`synchronized`、`volatile`、线程启动/终止），就够应付大部分初/中级面试。

**📝 可以重点记住的几条 happens-before 规则：**
1. **程序次序规则**：在同一个线程内，代码按顺序执行，前面的操作对后面的操作可见。
2. **锁定规则**：对同一把锁的 **解锁** `unlock` 一定先于后面对这把锁的 **加锁** `lock`（后面的线程能看到前面线程在锁内做的修改）。
3. **volatile 变量规则**：对某个 `volatile` 变量的写，一定先于后面对这个变量的读（保证可见性和有序性）。
4. **线程启动规则**：`Thread.start()` 之前对共享变量的写，对新线程是可见的。
5. **线程终止规则**：线程在结束前对共享变量的写，对调用 `thread.join()` 的线程是可见的。

> 面试时不需要把所有规则背下来，更重要的是能举 1～2 个例子，说明你知道"为什么加了 synchronized / volatile 后，别的线程就能看到最新值"。

---

### ❓ 面试官：说说你们项目里是怎么用 ThreadLocal 的？有什么需要注意的？【中级】
*频率：🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
`ThreadLocal` 用来在**同一线程内传递上下文数据**（比如登录用户信息、traceId 等），避免到处传参。最大的问题是：在线程池里如果**不及时清理**，很容易导致内存泄漏和"脏数据"问题。

**📝 常见使用场景：**
- 保存当前登录用户信息：在过滤器/拦截器里解析出用户信息，放入 `ThreadLocal`，后面的 Service 直接取。
- 保存一次请求的 traceId：方便链路日志串起来。

**⚠️ 必须注意的几个坑：**
1. **线程池复用线程**：请求结束了，线程却不会销毁；如果不 `remove()`，下一个请求复用这个线程时，可能还能读到上一个请求留下来的旧数据。
2. **一定要在 finally 里清理**：
   ```java
   try {
       UserContext.set(user);
       // 业务逻辑
   } finally {
       UserContext.remove();
   }
   ```
3. **不要存放大对象/集合**：否则容易撑爆内存，而且不容易排查。
4. **内存泄漏原理**：`ThreadLocal` 的 key 是弱引用，但 value 是强引用。如果线程长期存活（如线程池），而 `ThreadLocal` 对象被 GC 回收了，value 却依然存在于 Thread 的 `threadLocals` Map 中，导致无法回收。

> 面试时可以准备一个"小故事"：比如线上排查过因为 ThreadLocal 没清导致用户串号/内存飙升的案例，会非常加分。

---

### ❓ 面试官：ConcurrentHashMap 为什么线程安全？JDK 7 和 JDK 8 有什么区别？【中高级】
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
- **JDK 7**：采用**分段锁（Segment）**机制，将整个 HashMap 分成 16 个段，每个段独立加锁，并发度最高为 16。
- **JDK 8**：抛弃了 Segment，改用 **Node + CAS + synchronized**，只对链表头节点或红黑树根节点加锁，粒度更细，并发性能更好。

**📝 详细对比：**

| 维度 | JDK 7 | JDK 8 |
|------|-------|-------|
| **数据结构** | 数组 + 链表 | 数组 + 链表 + 红黑树（链表长度 > 8 转红黑树） |
| **锁机制** | Segment 分段锁（ReentrantLock） | Node 节点锁（synchronized + CAS） |
| **并发度** | 固定 16（Segment 数量） | 理论上等于数组长度（默认 16，可扩容） |
| **查询复杂度** | O(n) | O(log n)（红黑树优化） |

**🎯 为什么 JDK 8 性能更好？**
1. **锁粒度更细**：JDK 7 锁住整个 Segment（可能包含多个桶），JDK 8 只锁住单个桶的头节点。
2. **减少内存开销**：去掉了 Segment 对象，节省内存。
3. **红黑树优化**：哈希冲突严重时，查询效率从 O(n) 提升到 O(log n)。

---

### ❓ 面试官：常用的并发工具类有哪些？分别用在什么场景？【中级】
*频率：🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
JUC 包提供了丰富的并发工具类，最常用的有：`CountDownLatch`（倒计时门闩）、`CyclicBarrier`（循环屏障）、`Semaphore`（信号量）、`CompletableFuture`（异步编排）。

**📝 常用工具类对比：**

| 工具类 | 核心作用 | 典型场景 |
|--------|---------|---------|
| **CountDownLatch** | 一个或多个线程等待其他 N 个线程完成 | 主线程等待多个子任务全部完成后汇总结果 |
| **CyclicBarrier** | 多个线程互相等待，到达屏障后一起继续执行 | 多线程分阶段计算，每阶段都要同步 |
| **Semaphore** | 控制同时访问某资源的线程数量 | 限流、数据库连接池 |
| **CompletableFuture** | 异步任务编排，支持链式调用和组合 | 并行调用多个接口，最后合并结果 |

**🎯 代码示例：**
```java
// CountDownLatch：等待多个接口并行调用完成
CountDownLatch latch = new CountDownLatch(3);

CompletableFuture.runAsync(() -> {
    userService.getUserInfo();
    latch.countDown();
});

CompletableFuture.runAsync(() -> {
    orderService.getOrderList();
    latch.countDown();
});

CompletableFuture.runAsync(() -> {
    productService.getProductList();
    latch.countDown();
});

latch.await();  // 主线程阻塞，等待三个任务全部完成
System.out.println("所有数据加载完成");

// Semaphore：限制同时执行的线程数
Semaphore semaphore = new Semaphore(10);  // 最多允许 10 个线程同时执行

public void handleRequest() {
    semaphore.acquire();  // 获取许可
    try {
        // 业务逻辑
    } finally {
        semaphore.release();  // 释放许可
    }
}
```

---
