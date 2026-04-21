# 多线程基础与线程池实战

## 本模块面试重点

- **为什么用多线程**：提升系统吞吐量、改善用户体验、充分利用多核 CPU。
- **使用场景**：异步处理、并行计算、定时任务、事件驱动等典型场景。
- **线程池核心**：`ThreadPoolExecutor` 7 大参数详解、执行流程、常见拒绝策略的含义。
- **常见问题**：线程泄漏、死锁、上下文切换过多、OOM 等问题及解决方案。
- **技术搭配**：CompletableFuture、@Async、消息队列、Redis 等技术的组合应用。
- **生产实践**：如何合理配置线程池参数、监控告警、避免线上事故。

---

## 一、为什么要使用多线程？

### ❓ 面试官：你们项目为什么需要使用多线程？不用不行吗？
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
多线程的核心价值是 **"提升系统吞吐量"** 和 **"改善用户体验"**。在单线程下，IO 等待会阻塞整个流程；而多线程可以让 CPU 在等待 IO 时去处理其他任务，充分利用多核 CPU 资源。

**📝 核心价值解析：**

#### 1. 提升系统吞吐量（最重要）
**场景对比**：
```
【单线程模式】
用户请求 → 查询数据库(100ms) → 调用第三方接口(200ms) → 发送邮件(50ms) → 返回结果
总耗时：350ms（串行执行，CPU 大部分时间在等待）

【多线程模式】
用户请求 → 同时发起三个异步任务
           ├─ 查询数据库(100ms) ─┐
           ├─ 调用第三方接口(200ms) ├─→ 汇总结果(10ms) → 返回结果
           └─ 发送邮件(50ms)    ─┘
总耗时：210ms（并行执行，节省 40% 时间）
```

**实际案例**：
- 电商首页需要加载：商品信息、用户信息、推荐列表、购物车数量、优惠券信息等 5 个数据源。
- 串行执行需要 500ms，并行执行只需 150ms（取决于最慢的那个接口）。
- **QPS 提升 3 倍**，用户体验显著改善。

#### 2. 改善用户体验（异步响应）
**场景**：用户注册成功后，需要发送欢迎邮件、初始化用户积分、记录日志等操作。
- **同步方式**：用户需要等待所有操作完成才能看到"注册成功"，可能需要 3-5 秒。
- **异步方式**：主流程完成后立即返回"注册成功"，后台异步执行耗时操作，用户感知不到延迟。

#### 3. 充分利用多核 CPU
- 现代服务器都是多核 CPU（8 核、16 核、32 核很常见）。
- 单线程只能利用 1 个核，其他核都在闲置，浪费资源。
- 多线程可以让多个核同时工作，提升整体处理能力。

#### 4. 实现定时任务和后台处理
- 定时清理过期订单、统计数据、生成报表等后台任务。
- 这些任务不应该阻塞主业务流程，需要用独立线程执行。

---

## 二、多线程的典型使用场景

### ❓ 面试官：能说说你们项目里哪些地方用到了多线程吗？具体怎么用的？
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
我们在项目中主要在 **异步处理、并行查询、批量任务、事件驱动、定时任务** 这 5 个场景使用多线程。核心原则是：**耗时的、非核心的、可以并行的操作都异步化**。

**📝 典型使用场景详解：**

#### 场景 1：异步处理（最常用）

**业务场景**：用户下单成功后，需要执行一系列后续操作：
1. 扣减库存
2. 生成订单
3. 发送短信通知
4. 推送订单消息到 APP
5. 记录操作日志
6. 更新用户积分
7. 触发风控检查

**问题**：如果串行执行，用户需要等待 2-3 秒才能看到"下单成功"，体验极差。

**解决方案**：核心流程同步执行，非核心流程异步执行。

```java
@Service
public class OrderService {
    
    @Autowired
    private ThreadPoolTaskExecutor asyncExecutor;  // 自定义异步线程池
    
    @Transactional
    public OrderVO createOrder(OrderDTO dto) {
        // 1. 核心流程（同步执行，保证事务一致性）
        deductStock(dto.getProductId(), dto.getQuantity());
        Order order = generateOrder(dto);
        
        // 2. 非核心流程（异步执行，不阻塞主流程）
        Long orderId = order.getId();
        asyncExecutor.execute(() -> sendSmsNotification(order));
        asyncExecutor.execute(() -> pushAppMessage(order));
        asyncExecutor.execute(() -> recordOperationLog(order));
        asyncExecutor.execute(() -> updateUserPoints(order.getUserId(), order.getAmount()));
        asyncExecutor.execute(() -> triggerRiskControl(order));
        
        // 3. 立即返回，用户无需等待异步任务完成
        return convertToVO(order);
    }
}
```

**注意事项**：
- ✅ 核心业务（扣库存、生成订单）必须同步执行，保证事务一致性
- ✅ 非核心业务（发短信、推消息）可以异步执行，即使失败也不影响主流程
- ⚠️ 异步任务中不能使用 `@Transactional`，因为不在同一个事务上下文
- ⚠️ 异步任务要做好异常处理和日志记录，方便排查问题

---

#### 场景 2：并行查询（提升性能）

**业务场景**：电商商品详情页需要聚合多个数据源：
- 商品基本信息（MySQL）
- 商品评价统计（MySQL）
- 推荐商品列表（Redis + MySQL）
- 用户浏览历史（Redis）
- 优惠券信息（MySQL）

**问题**：串行查询需要 300-500ms，页面加载慢。

**解决方案**：使用 `CompletableFuture` 并行查询，最后汇总结果。

```java
@Service
public class ProductDetailService {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private RecommendService recommendService;
    
    @Autowired
    private CouponService couponService;
    
    public ProductDetailVO getProductDetail(Long productId, Long userId) {
        // 并行发起 4 个查询请求
        CompletableFuture<ProductVO> productFuture = 
            CompletableFuture.supplyAsync(() -> productService.getById(productId));
        
        CompletableFuture<ReviewStatsVO> reviewFuture = 
            CompletableFuture.supplyAsync(() -> reviewService.getStats(productId));
        
        CompletableFuture<List<ProductVO>> recommendFuture = 
            CompletableFuture.supplyAsync(() -> recommendService.getRecommend(productId));
        
        CompletableFuture<List<CouponVO>> couponFuture = 
            CompletableFuture.supplyAsync(() -> couponService.getAvailableCoupons(userId));
        
        // 等待所有任务完成并汇总结果
        CompletableFuture.allOf(productFuture, reviewFuture, recommendFuture, couponFuture).join();
        
        // 组装最终结果
        ProductDetailVO detailVO = new ProductDetailVO();
        detailVO.setProduct(productFuture.join());
        detailVO.setReviewStats(reviewFuture.join());
        detailVO.setRecommendList(recommendFuture.join());
        detailVO.setCouponList(couponFuture.join());
        
        return detailVO;
    }
}
```

**性能对比**：
- 串行执行：100ms + 80ms + 120ms + 50ms = 350ms
- 并行执行：max(100ms, 80ms, 120ms, 50ms) = 120ms
- **性能提升 65%**

**注意事项**：
- ✅ 适用于多个独立的查询任务，彼此没有依赖关系
- ⚠️ 不要并行太多任务（建议不超过 10 个），否则线程切换开销会抵消收益
- ⚠️ 要设置合理的超时时间，防止某个任务卡死导致整体超时

---

#### 场景 3：批量任务处理

**业务场景**：每天凌晨需要处理 10 万条过期订单，执行关闭订单、释放库存、退款等操作。

**问题**：单线程处理需要 2-3 小时，影响第二天业务。

**解决方案**：将任务分片，多线程并行处理。

```java
@Service
public class ExpiredOrderJob {
    
    @Autowired
    private OrderMapper orderMapper;
    
    @Autowired
    private ThreadPoolTaskExecutor batchExecutor;
    
    /**
     * 定时任务：每天凌晨 2 点执行
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void closeExpiredOrders() {
        log.info("开始处理过期订单");
        
        // 1. 查询所有过期订单 ID
        List<Long> orderIds = orderMapper.selectExpiredOrderIds();
        log.info("共找到 {} 条过期订单", orderIds.size());
        
        // 2. 分批处理（每批 1000 条）
        int batchSize = 1000;
        List<CompletableFuture<Void>> futures = new ArrayList<>();
        
        for (int i = 0; i < orderIds.size(); i += batchSize) {
            int end = Math.min(i + batchSize, orderIds.size());
            List<Long> batchIds = orderIds.subList(i, end);
            
            // 3. 提交到线程池异步处理
            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                processBatch(batchIds);
            }, batchExecutor);
            
            futures.add(future);
        }
        
        // 4. 等待所有批次完成
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        
        log.info("过期订单处理完成");
    }
    
    private void processBatch(List<Long> orderIds) {
        for (Long orderId : orderIds) {
            try {
                // 关闭订单、释放库存、退款等操作
                orderService.closeOrder(orderId);
            } catch (Exception e) {
                log.error("处理订单失败 | orderId={}", orderId, e);
                // 记录失败订单，稍后重试
            }
        }
    }
}
```

**性能对比**：
- 单线程：10 万条 × 10ms/条 = 1000 秒 ≈ 17 分钟
- 10 线程并行：17 分钟 / 10 = 1.7 分钟
- **效率提升 10 倍**

---

#### 场景 4：事件驱动架构

**业务场景**：订单状态变更时，需要通知多个下游系统（仓储系统、财务系统、物流系统等）。

**解决方案**：使用 Spring Event 或消息队列实现事件驱动。

```java
// 1. 定义事件
public class OrderStatusChangedEvent extends ApplicationEvent {
    private Long orderId;
    private String oldStatus;
    private String newStatus;
    
    public OrderStatusChangedEvent(Object source, Long orderId, String oldStatus, String newStatus) {
        super(source);
        this.orderId = orderId;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
    }
    
    // getters...
}

// 2. 发布事件
@Service
public class OrderService {
    
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    public void updateOrderStatus(Long orderId, String newStatus) {
        String oldStatus = getOrderStatus(orderId);
        
        // 更新订单状态
        orderMapper.updateStatus(orderId, newStatus);
        
        // 发布事件（异步通知）
        eventPublisher.publishEvent(new OrderStatusChangedEvent(this, orderId, oldStatus, newStatus));
    }
}

// 3. 监听事件（自动在线程池中异步执行）
@Component
public class OrderEventListener {
    
    @Async("orderEventExecutor")  // 指定异步线程池
    @EventListener
    public void handleOrderStatusChanged(OrderStatusChangedEvent event) {
        log.info("订单状态变更 | orderId={} | {} -> {}", 
                 event.getOrderId(), event.getOldStatus(), event.getNewStatus());
        
        // 通知仓储系统
        warehouseService.notifyOrderStatus(event.getOrderId(), event.getNewStatus());
        
        // 通知财务系统
        financeService.notifyOrderStatus(event.getOrderId(), event.getNewStatus());
        
        // 通知物流系统
        logisticsService.notifyOrderStatus(event.getOrderId(), event.getNewStatus());
    }
}
```

**优势**：
- ✅ 解耦：订单服务不需要知道有哪些下游系统
- ✅ 扩展：新增下游系统只需添加新的监听器，无需修改订单服务
- ✅ 异步：不阻塞主流程，提升响应速度

---

#### 场景 5：定时任务

**业务场景**：定期执行数据统计、缓存预热、日志清理等后台任务。

```java
@Component
public class ScheduledTasks {
    
    @Autowired
    private ThreadPoolTaskExecutor scheduledExecutor;
    
    /**
     * 每小时统计一次销售数据
     */
    @Scheduled(cron = "0 0 * * * ?")
    public void calculateSalesStats() {
        scheduledExecutor.execute(() -> {
            log.info("开始统计销售数据");
            statsService.calculateHourlyStats();
            log.info("销售数据统计完成");
        });
    }
    
    /**
     * 每天凌晨 3 点清理 7 天前的日志
     */
    @Scheduled(cron = "0 0 3 * * ?")
    public void cleanOldLogs() {
        scheduledExecutor.execute(() -> {
            log.info("开始清理旧日志");
            logService.cleanLogsBefore(LocalDate.now().minusDays(7));
            log.info("日志清理完成");
        });
    }
    
    /**
     * 每 10 分钟预热热门商品缓存
     */
    @Scheduled(fixedRate = 10 * 60 * 1000)
    public void warmupCache() {
        scheduledExecutor.execute(() -> {
            log.info("开始预热缓存");
            cacheService.warmupHotProducts();
            log.info("缓存预热完成");
        });
    }
}
```

---

## 三、创建线程的方式

### ❓ 面试官：创建线程有哪几种方式？你们在项目里是怎么创建的？
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
基础方式有三种：继承 `Thread` 类、实现 `Runnable` 接口、实现 `Callable` 接口（配合 `FutureTask` 可获取返回值）。但**在实际企业项目中，我们绝对不会显式地去 `new Thread()`，而是 100% 必须通过「线程池」来创建和管理线程。**

**📝 详细原理解析：**
1. **继承 `Thread` vs 实现 `Runnable`**：
   - 继承 `Thread` 扩展性差，因为 Java 只支持单继承。
   - 实现 `Runnable` 更好，还可以去继承其他的业务类，且方便实现多线程之间的数据共享。
2. **`Runnable` vs `Callable`**：
   - `Runnable` 的 `run()` 方法没有返回值，也无法向外抛出受检异常。
   - `Callable` 的 `call()` 方法有泛型返回值，且支持 `throws Exception`。通常用于需要拿到多线程并发计算结果的场景（如并行调用三个接口，最后汇总结果）。

**🌟 面试加分项（阿里规约）：**
"《阿里巴巴 Java 开发手册》强制规定：线程资源必须通过线程池提供，不允许在应用中自行显式创建线程。因为每次 `new Thread()` 都会消耗几兆的内存，且销毁线程也要耗费 CPU。如果不加控制，遇到突发流量瞬间创建几万个线程，会直接把服务器内存撑爆（OOM），或者导致 CPU 上下文切换过度而死机。"

---

## 四、线程池核心参数详解

### ❓ 面试官：那你能详细讲讲线程池的核心参数吗？（ThreadPoolExecutor）【中高级】
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
`ThreadPoolExecutor` 有 7 个核心参数。最重要的三个是：**核心线程数（corePoolSize）**、**最大线程数（maximumPoolSize）**、**阻塞队列（workQueue）**。它们共同决定了线程池面对高并发时的处理策略。

**📝 详细参数与执行流程（必背）：**
当一个新的任务提交到线程池时，它的处理流转如下：
1. **`corePoolSize`（核心线程数）**：如果当前干活的线程数 < 核心数，**立刻创建新线程**去执行这个任务（哪怕有其他空闲线程也不管）。
2. **`workQueue`（阻塞队列）**：如果核心线程全都在忙，新来的任务会被**扔进阻塞队列**里排队等待。
3. **`maximumPoolSize`（最大线程数）**：如果阻塞队列也**塞满了**，且当前线程数 < 最大线程数，线程池会**"破例"创建非核心（救急）线程**来立刻处理这个任务。
4. **`handler`（拒绝策略）**：如果队列满了，且救急线程也达到最大数量了，说明彻底崩盘了，就会触发拒绝策略。
   - `AbortPolicy`（默认）：直接抛出异常，阻止系统正常运行。
   - `CallerRunsPolicy`：谁提交的任务（比如主线程），谁自己去执行它（起到限流作用）。
   - `DiscardPolicy`：直接把任务丢弃，当没发生过。
   - `DiscardOldestPolicy`：踢掉队列里排队最久（最老）的那个任务，把新任务塞进去。
5. **`keepAliveTime` & `unit`**：救急线程空闲了多长时间后，会被自动回收销毁。
6. **`threadFactory`**：线程工厂，用来给线程起个有意义的业务名字（排查死锁日志时非常有用）。

**🎯 执行流程图示：**
```
新任务到来
    ↓
核心线程数未满？ → 是 → 创建核心线程执行
    ↓ 否
阻塞队列已满？ → 否 → 放入队列等待
    ↓ 是
最大线程数未满？ → 是 → 创建救急线程执行
    ↓ 否
触发拒绝策略
```

---

## 五、线程池参数配置实战

### ❓ 面试官：你们项目里线程池参数是怎么设置的？有什么经验可以分享吗？【中级】
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
没有万能公式！需要根据**任务类型（CPU 密集型 / IO 密集型）**、**服务器配置**、**业务 QPS** 综合评估。我们的原则是：**宁可早点失败（拒绝），也不要悄悄排队排死整个系统**。

**📝 实战配置经验：**

#### 1. CPU 密集型任务（如复杂计算、加密解密）
```java
// 核心线程数 = CPU 核数 + 1
int corePoolSize = Runtime.getRuntime().availableProcessors() + 1;
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    corePoolSize,
    corePoolSize * 2,  // 最大线程数略大于核心数
    60L, TimeUnit.SECONDS,
    new LinkedBlockingQueue<>(100),  // 队列不要太大
    new ThreadPoolExecutor.CallerRunsPolicy()  // 满了就让调用者自己跑
);
```

#### 2. IO 密集型任务（如数据库查询、HTTP 请求、文件读写）
```java
// 核心线程数 = CPU 核数 * 2（或更大，根据 IO 等待时间调整）
int corePoolSize = Runtime.getRuntime().availableProcessors() * 2;
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    corePoolSize,
    corePoolSize * 3,
    60L, TimeUnit.SECONDS,
    new LinkedBlockingQueue<>(500),
    Executors.defaultThreadFactory(),
    new ThreadPoolExecutor.AbortPolicy()  // 快速失败，触发告警
);
```

#### 3. 混合型任务（大多数业务场景）
```java
// 根据压测结果动态调整
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    10,              // 核心线程数：根据日常 QPS 设定
    50,              // 最大线程数：应对突发流量
    60L, TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(1000),  // 有界队列，防止 OOM
    new CustomThreadFactory("order-service"),  // 自定义线程名
    new ThreadPoolExecutor.CallerRunsPolicy()
);
```

**⚠️ 血泪教训：**
1. **严禁使用无界队列**（如 `new LinkedBlockingQueue<>()` 不指定容量），高峰期会把内存撑爆。
2. **监控线程池状态**：定期打印 `getActiveCount()`、`getQueue().size()`，发现异常及时告警。
3. **Spring Boot 项目推荐**：使用 `@Async` 注解配合自定义线程池，避免使用默认的 `SimpleAsyncTaskExecutor`（每次都会创建新线程）。

---

## 六、多线程常见问题及解决方案

### ❓ 面试官：使用多线程会遇到哪些问题？你们是怎么解决的？
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
多线程常见问题包括：**线程安全问题、死锁、线程泄漏、上下文切换过多、OOM**。解决方案分别是：**加锁/原子类、避免嵌套锁、使用线程池、减少锁粒度、设置有界队列**。

**📝 常见问题详解：**

#### 问题 1：线程安全问题

**现象**：多个线程同时修改共享变量，导致数据不一致。

**典型案例**：
```java
// ❌ 错误示例：多线程环境下不安全
private int count = 0;

public void increment() {
    count++;  // 非原子操作：读取 → 加 1 → 写回
}
```

**解决方案**：
1. **使用 synchronized 同步块**
   ```java
   private int count = 0;
   
   public synchronized void increment() {
       count++;
   }
   ```

2. **使用 ReentrantLock**
   ```java
   private final ReentrantLock lock = new ReentrantLock();
   private int count = 0;
   
   public void increment() {
       lock.lock();
       try {
           count++;
       } finally {
           lock.unlock();
       }
   }
   ```

3. **使用原子类（推荐）**
   ```java
   private AtomicInteger count = new AtomicInteger(0);
   
   public void increment() {
       count.incrementAndGet();  // 原子操作，线程安全
   }
   ```

4. **使用线程安全的集合**
   ```java
   // ❌ 不安全
   private Map<String, Object> cache = new HashMap<>();
   
   // ✅ 安全
   private ConcurrentMap<String, Object> cache = new ConcurrentHashMap<>();
   ```

---

#### 问题 2：死锁

**现象**：两个或多个线程互相等待对方持有的锁，导致永久阻塞。

**典型案例**：
```java
// ❌ 错误示例：可能产生死锁
public void transfer(Account from, Account to, double amount) {
    synchronized (from) {  // 先锁 from
        synchronized (to) {  // 再锁 to
            // 转账逻辑
        }
    }
}

// 线程 1：transfer(A, B, 100) → 锁 A → 等待锁 B
// 线程 2：transfer(B, A, 200) → 锁 B → 等待锁 A
// 死锁！
```

**解决方案**：
1. **固定锁的顺序**
   ```java
   public void transfer(Account from, Account to, double amount) {
       // 始终按照 ID 小的先加锁
       Account first = from.getId() < to.getId() ? from : to;
       Account second = from.getId() < to.getId() ? to : from;
       
       synchronized (first) {
           synchronized (second) {
               // 转账逻辑
           }
       }
   }
   ```

2. **使用 tryLock 超时机制**
   ```java
   public void transfer(Account from, Account to, double amount) {
       ReentrantLock fromLock = from.getLock();
       ReentrantLock toLock = to.getLock();
       
       while (true) {
           if (fromLock.tryLock()) {
               try {
                   if (toLock.tryLock(1, TimeUnit.SECONDS)) {
                       try {
                           // 转账逻辑
                           return;
                       } finally {
                           toLock.unlock();
                       }
                   }
               } finally {
                   fromLock.unlock();
               }
           }
           // 等待一段时间后重试
           Thread.sleep(10);
       }
   }
   ```

3. **使用工具检测死锁**
   ```bash
   # JDK 自带工具 jstack 查看线程堆栈
   jstack <pid> | grep "DEADLOCK"
   ```

---

#### 问题 3：线程泄漏

**现象**：线程创建后没有被正确回收，导致线程数持续增长，最终 OOM。

**常见原因**：
1. 手动 `new Thread()` 但没有管理生命周期
2. 线程池使用不当（如无界队列）
3. ThreadLocal 未清理导致线程无法回收

**解决方案**：
1. **永远使用线程池**
   ```java
   // ❌ 错误：手动创建线程
   new Thread(() -> {
       // 业务逻辑
   }).start();
   
   // ✅ 正确：使用线程池
   executor.execute(() -> {
       // 业务逻辑
   });
   ```

2. **设置有界队列**
   ```java
   // ❌ 错误：无界队列可能导致 OOM
   new LinkedBlockingQueue<>();
   
   // ✅ 正确：有界队列
   new ArrayBlockingQueue<>(1000);
   ```

3. **清理 ThreadLocal**
   ```java
   try {
       UserContext.set(user);
       // 业务逻辑
   } finally {
       UserContext.remove();  // 必须清理
   }
   ```

---

#### 问题 4：上下文切换过多

**现象**：线程数过多，CPU 大量时间花在线程切换上，而不是执行业务逻辑。

**判断标准**：
- 使用 `vmstat` 命令查看 `cs`（context switch）列
- 如果 `cs` 值超过 10000/秒，说明上下文切换过于频繁

**解决方案**：
1. **减少线程数**：合理设置线程池大小
2. **减少锁竞争**：使用细粒度锁、读写锁、无锁数据结构
3. **使用 CAS 替代锁**：AtomicInteger、ConcurrentHashMap
4. **协程/虚拟线程**：JDK 21 引入的 Virtual Thread（轻量级线程）

---

#### 问题 5：OutOfMemoryError

**现象**：线程数过多导致内存耗尽。

**原因分析**：
- 每个线程需要分配栈空间（默认 1MB）
- 1000 个线程 = 1GB 内存
- 如果创建 10000 个线程，需要 10GB 内存

**解决方案**：
1. **限制线程池大小**
   ```java
   // 最大线程数不要超过 100
   new ThreadPoolExecutor(
       10, 100,  // corePoolSize, maximumPoolSize
       60L, TimeUnit.SECONDS,
       new ArrayBlockingQueue<>(1000)  // 有界队列
   );
   ```

2. **减小线程栈大小**
   ```bash
   # JVM 参数：将线程栈从 1MB 减小到 256KB
   -Xss256k
   ```

3. **监控线程数**
   ```java
   // 定期打印线程池状态
   @Scheduled(fixedRate = 60000)
   public void monitorThreadPool() {
       log.info("线程池状态 | active={} | queue={} | completed={}",
                executor.getActiveCount(),
                executor.getQueue().size(),
                executor.getCompletedTaskCount());
   }
   ```

---

## 七、多线程技术搭配方案

### ❓ 面试官：多线程一般会搭配哪些技术一起使用？
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
多线程常搭配 **CompletableFuture（异步编排）、@Async（Spring 异步）、消息队列（削峰填谷）、Redis（分布式锁/缓存）、数据库连接池** 等技术使用，形成完整的多线程解决方案。

**📝 技术搭配详解：**

#### 1. CompletableFuture + 线程池

**场景**：需要并行执行多个任务，并对结果进行组合处理。

```java
@Autowired
private ThreadPoolTaskExecutor executor;

public OrderDetailVO getOrderDetail(Long orderId) {
    // 并行查询多个数据源
    CompletableFuture<Order> orderFuture = 
        CompletableFuture.supplyAsync(() -> orderMapper.selectById(orderId), executor);
    
    CompletableFuture<User> userFuture = 
        CompletableFuture.supplyAsync(() -> userMapper.selectById(order.getUserId()), executor);
    
    CompletableFuture<List<OrderItem>> itemsFuture = 
        CompletableFuture.supplyAsync(() -> orderItemMapper.selectByOrderId(orderId), executor);
    
    // 组合结果
    return CompletableFuture.allOf(orderFuture, userFuture, itemsFuture)
        .thenApply(v -> {
            OrderDetailVO vo = new OrderDetailVO();
            vo.setOrder(orderFuture.join());
            vo.setUser(userFuture.join());
            vo.setItems(itemsFuture.join());
            return vo;
        })
        .join();
}
```

**优势**：
- ✅ 代码简洁，链式调用
- ✅ 支持异常处理、超时控制
- ✅ 可以指定自定义线程池

---

#### 2. @Async + 自定义线程池

**场景**：Spring Boot 项目中简化异步任务开发。

```java
@Configuration
@EnableAsync
public class AsyncConfig {
    
    @Bean("asyncExecutor")
    public Executor asyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(50);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("async-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
}

@Service
public class NotificationService {
    
    @Async("asyncExecutor")
    public void sendEmail(String to, String subject, String content) {
        // 异步发送邮件
        emailClient.send(to, subject, content);
    }
    
    @Async("asyncExecutor")
    public void sendSms(String phone, String message) {
        // 异步发送短信
        smsClient.send(phone, message);
    }
}

// 调用方
@Service
public class OrderService {
    
    @Autowired
    private NotificationService notificationService;
    
    public void createOrder(OrderDTO dto) {
        // 创建订单
        Order order = orderMapper.insert(dto);
        
        // 异步发送通知（不阻塞主流程）
        notificationService.sendEmail(order.getEmail(), "订单成功", "...");
        notificationService.sendSms(order.getPhone(), "订单成功");
        
        return order;
    }
}
```

**注意事项**：
- ⚠️ `@Async` 方法必须是 `public` 的
- ⚠️ 不能在同一个类中调用（会绕过代理，导致异步失效）
- ⚠️ 返回值只能是 `void` 或 `CompletableFuture`

---

#### 3. 消息队列 + 线程池

**场景**：高并发场景下削峰填谷，异步解耦。

```java
@Service
public class OrderService {
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    public void createOrder(OrderDTO dto) {
        // 1. 同步创建订单
        Order order = orderMapper.insert(dto);
        
        // 2. 发送消息到队列（异步处理后续流程）
        rabbitTemplate.convertAndSend("order.exchange", "order.created", order);
        
        // 3. 立即返回
        return order;
    }
}

// 消费者（在线程池中异步处理）
@Component
@RabbitListener(queues = "order.created.queue")
public class OrderCreatedConsumer {
    
    @Autowired
    private ThreadPoolTaskExecutor orderProcessor;
    
    @RabbitHandler
    public void handle(Order order) {
        // 提交到线程池异步处理
        orderProcessor.execute(() -> {
            // 扣减库存
            inventoryService.deduct(order.getProductId(), order.getQuantity());
            
            // 发送通知
            notificationService.sendOrderCreatedNotification(order);
            
            // 记录日志
            logService.recordOrderCreated(order);
        });
    }
}
```

**优势**：
- ✅ 削峰填谷：高峰期消息堆积在队列，消费者按能力处理
- ✅ 解耦：订单服务不需要知道有哪些下游系统
- ✅ 可靠性：消息持久化，即使消费者宕机也不会丢失

---

#### 4. Redis + 多线程

**场景 1：分布式锁**
```java
@Autowired
private RedisTemplate<String, String> redisTemplate;

public void processOrder(Long orderId) {
    String lockKey = "order:lock:" + orderId;
    String requestId = UUID.randomUUID().toString();
    
    // 尝试获取锁（最多等待 5 秒，锁定 10 秒后自动释放）
    Boolean locked = redisTemplate.opsForValue()
        .setIfAbsent(lockKey, requestId, 10, TimeUnit.SECONDS);
    
    if (Boolean.TRUE.equals(locked)) {
        try {
            // 业务逻辑
            processOrderInternal(orderId);
        } finally {
            // 释放锁（只有持有锁的线程才能释放）
            String script = "if redis.call('get', KEYS[1]) == ARGV[1] then " +
                           "return redis.call('del', KEYS[1]) else return 0 end";
            redisTemplate.execute(new DefaultRedisScript<>(script, Long.class),
                                 Collections.singletonList(lockKey), requestId);
        }
    } else {
        throw new BusinessException("订单正在处理中，请稍后再试");
    }
}
```

**场景 2：缓存热点数据**
```java
public ProductVO getProductDetail(Long productId) {
    String cacheKey = "product:" + productId;
    
    // 1. 查缓存
    ProductVO cached = (ProductVO) redisTemplate.opsForValue().get(cacheKey);
    if (cached != null) {
        return cached;
    }
    
    // 2. 查数据库
    Product product = productMapper.selectById(productId);
    ProductVO vo = convertToVO(product);
    
    // 3. 写入缓存
    redisTemplate.opsForValue().set(cacheKey, vo, 24, TimeUnit.HOURS);
    
    return vo;
}
```

---

#### 5. 数据库连接池 + 多线程

**场景**：多线程环境下高效管理数据库连接。

```yaml
# application.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20        # 最大连接数
      minimum-idle: 5              # 最小空闲连接
      connection-timeout: 30000    # 获取连接超时时间（30秒）
      idle-timeout: 600000         # 空闲连接存活时间（10分钟）
      max-lifetime: 1800000        # 连接最大生命周期（30分钟）
```

**注意事项**：
- ⚠️ 线程池大小不能超过数据库连接池大小，否则会等待连接
- ⚠️ 确保每个线程使用完连接后立即归还（try-finally 或 try-with-resources）

---

## 八、实战案例与问题排查

### ❓ 面试官：你实际遇到过哪些线程池相关的问题？是怎么排查和解决的？【开放题】
*频率：🔥🔥🔥🔥*

这一题没有标准答案，但可以提前准备 1～2 个简单案例：

- **案例 1：线程池参数设置不合理导致任务堆积**  
  - **问题**：核心线程太少（只有 2 个）、队列太大（10000），导致高峰期请求都在队列里排队，整体响应时间从 100ms 飙升到 5s。
  - **排查**：通过监控发现 `queue.size` 长期维持在 8000+，但 `active.count` 只有 2。
  - **解决**：根据 QPS 重新估算 `corePoolSize` 从 2 提升到 20，队列长度降到 500，引入超时和降级策略（`CallerRunsPolicy` 或直接拒绝 + 友好提示）。
  - **总结**：线程池不是随便 new，一个重要经验是**宁可早点失败，也不要悄悄排队排死整个系统**。

- **案例 2：线程命名不规范导致线上问题难排查**  
  - **问题**：多个业务共用同一个线程池，出现死锁时日志里全是 `pool-1-thread-3`，根本分不清是哪个业务的线程。
  - **解决**：为每个业务模块创建独立的线程池，并通过 `ThreadFactory` 自定义线程名称（如 `order-service-pool-1`、`payment-service-pool-1`）。
  - **总结**：良好的命名规范能节省大量排查时间。

- **案例 3：ThreadLocal 未清理导致内存泄漏**  
  - **问题**：线上服务器运行 3 天后内存持续增长，最终 OOM。
  - **排查**：通过 MAT 工具分析堆转储文件，发现大量 ThreadLocal 对象未被回收。
  - **原因**：线程池中的线程长期存活，ThreadLocal 的 value 强引用导致无法 GC。
  - **解决**：在拦截器的 `finally` 块中调用 `ThreadLocal.remove()`。
  - **总结**：使用 ThreadLocal 必须成对出现 set/remove，尤其是在线程池环境中。

---
