# Java 本地缓存技术详解

## 一、本地缓存概述

### 1.1 什么是本地缓存？

本地缓存（Local Cache）是指**存储在 JVM 堆内存中的缓存**，数据以对象形式直接存在于应用进程内，访问速度达到**纳秒级**。

```
┌─────────────────────────────────────────┐
│         应用程序 (JVM)                   │
│  ┌───────────────────────────────────┐  │
│  │   本地缓存 (HashMap/ConcurrentMap) │  │ ← 纳秒级
│  │   - Caffeine                      │  │
│  │   - Guava Cache                   │  │
│  │   - Ehcache                       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 1.2 常见本地缓存方案对比

| 缓存方案 | 性能 | 功能丰富度 | Spring 集成 | 适用场景 | 推荐指数 |
|---------|------|-----------|-----------|---------|---------|
| **Caffeine** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 默认支持 | 生产环境首选 | ⭐⭐⭐⭐⭐ |
| **Guava Cache** | ⭐⭐⭐ | ⭐⭐⭐⭐ | 需配置 | 老项目兼容 | ⭐⭐⭐ |
| **Ehcache 3.x** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 需插件 | 需要持久化 | ⭐⭐⭐⭐ |
| **ConcurrentHashMap** | ⭐⭐⭐⭐⭐ | ⭐ | 手动封装 | 简单场景 | ⭐⭐ |
| **LinkedHashMap** | ⭐⭐⭐ | ⭐⭐ | 手动实现 | 学习原理 | ⭐ |

### 1.3 使用场景

**✅ 适合使用本地缓存：**
- 热点数据（配置信息、字典表、元数据）
- 读多写少的数据
- 计算结果缓存（避免重复计算）
- 防缓存穿透（作为 Redis 前置缓冲）
- 单实例应用或不需要跨应用共享

**❌ 不适合使用本地缓存：**
- 频繁变更的数据
- 强一致性要求的数据
- 需要跨应用共享的数据
- 超大对象（占用过多内存）

---

## 二、ConcurrentHashMap - 最基础的本地缓存

### 2.1 基础用法

```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class SimpleCache {
    
    // 线程安全的 HashMap
    private ConcurrentMap<String, Object> cache = new ConcurrentHashMap<>();
    
    // 放入缓存
    public void put(String key, Object value) {
        cache.put(key, value);
    }
    
    // 获取缓存
    public Object get(String key) {
        return cache.get(key);
    }
    
    // 如果不存在则放入
    public Object putIfAbsent(String key, Object value) {
        return cache.putIfAbsent(key, value);
    }
    
    // 删除缓存
    public void remove(String key) {
        cache.remove(key);
    }
    
    // 清空缓存
    public void clear() {
        cache.clear();
    }
}
```

**优点：**
- ✅ JDK 内置，无需额外依赖
- ✅ 线程安全，高并发性能好
- ✅ 简单易用

**缺点：**
- ❌ 无过期时间，需要手动管理
- ❌ 无容量限制，可能导致 OOM
- ❌ 无统计功能

**适用场景：** 简单的、永不过期的缓存需求

---

## 三、LinkedHashMap - 实现 LRU 缓存

### 3.1 手动实现 LRU 缓存

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class LRUCache<K, V> extends LinkedHashMap<K, V> {
    
    private final int maxCapacity;
    
    public LRUCache(int maxCapacity) {
        // initialCapacity = maxCapacity, loadFactor = 0.75f, accessOrder = true
        super(maxCapacity, 0.75f, true);
        this.maxCapacity = maxCapacity;
    }
    
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        // 当大小超过最大容量时，移除最旧的元素
        return size() > maxCapacity;
    }
    
    public static void main(String[] args) {
        LRUCache<String, Integer> cache = new LRUCache<>(3);
        
        cache.put("a", 1);
        cache.put("b", 2);
        cache.put("c", 3);
        
        // 访问 a，使其变为最近使用的
        cache.get("a");
        
        // 再放入 d，会移除最久未使用的 b
        cache.put("d", 4);
        
        System.out.println(cache.keySet()); // 输出：[a, c, d]
    }
}
```

**优点：**
- ✅ 基于 JDK 内置类实现
- ✅ 自动维护访问顺序
- ✅ 适合学习 LRU 原理

**缺点：**
- ❌ 线程不安全，需要外部同步
- ❌ 功能单一，只有容量淘汰
- ❌ 无过期时间

**适用场景：** 学习缓存原理、简单场景

---

## 四、Guava Cache - 上一代经典

### 4.1 基础用法

```java
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import java.util.concurrent.TimeUnit;

public class GuavaCacheDemo {
    
    // 创建缓存
    private Cache<String, Object> cache = CacheBuilder.newBuilder()
            .maximumSize(10_000)                    // 最大容量
            .expireAfterWrite(10, TimeUnit.MINUTES) // 写入后过期
            .expireAfterAccess(5, TimeUnit.MINUTES) // 访问后过期
            .recordStats()                          // 开启统计
            .removalListener(notification -> {      // 删除监听
                System.out.println("Key removed: " + notification.getKey());
            })
            .build();
    
    public void put(String key, Object value) {
        cache.put(key, value);
    }
    
    public Object get(String key) {
        return cache.getIfPresent(key);
    }
    
    public void remove(String key) {
        cache.invalidate(key);
    }
    
    // 查看统计信息
    public void printStats() {
        System.out.println("命中次数：" + cache.stats().hitCount());
        System.out.println("未命中次数：" + cache.stats().missCount());
        System.out.println("命中率：" + cache.stats().hitRate());
    }
}
```

### 4.2 带自动加载的缓存

```java
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import java.util.concurrent.ExecutionException;

public class LoadingCacheDemo {
    
    // 创建带自动加载功能的缓存
    private LoadingCache<String, User> cache = CacheBuilder.newBuilder()
            .maximumSize(5_000)
            .expireAfterAccess(5, TimeUnit.MINUTES)
            .build(new CacheLoader<String, User>() {
                @Override
                public User load(String userId) throws Exception {
                    System.out.println("【加载数据】userId: " + userId);
                    return loadUserFromDatabase(userId);
                }
            });
    
    public User getUser(String userId) throws ExecutionException {
        return cache.get(userId); // 缓存不存在时自动调用 load 方法
    }
    
    private User loadUserFromDatabase(String userId) {
        // 模拟数据库查询
        return new User(userId, "张三", 25);
    }
}
```

**Guava Cache 特点：**
- ✅ 功能较全面（过期、容量、统计）
- ✅ API 简洁易用
- ⚠️ 性能一般（已被 Caffeine 超越）
- ⚠️ 社区已转向推荐 Caffeine

---

## 五、Caffeine Cache - 生产环境首选 ⭐

### 5.1 为什么选择 Caffeine？

Caffeine 是新一代高性能缓存库，Spring Boot 2.x+ 的默认本地缓存方案：

**核心优势：**
1. **性能最强**：使用 W-TinyLru 算法，比 Guava 提升 30%+ 命中率
2. **三种过期策略**：
   - 基于容量（Capacity-based）
   - 基于时间（Time-based）
   - 基于引用（Reference-based）
3. **异步刷新**：支持 `CompletableFuture` 非阻塞刷新
4. **完善统计**：实时监控命中率、加载时间等

### 5.2 快速入门

```java
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;

public class CaffeineBasicDemo {
    
    // 创建缓存
    private Cache<String, Object> cache = Caffeine.newBuilder()
            .maximumSize(10_000)                    // 最大容量 10000 条
            .expireAfterWrite(Duration.ofMinutes(10))  // 写入后 10 分钟过期
            .recordStats()                          // 开启统计
            .build();
    
    public void operate() {
        // 放入缓存
        cache.put("key1", "value1");
        
        // 获取缓存
        Object value = cache.getIfPresent("key1");
        
        // 获取缓存，不存在时自动加载
        Object value2 = cache.get("key2", k -> loadData(k));
        
        // 删除缓存
        cache.invalidate("key1");
        
        // 批量删除
        cache.invalidateAll(List.of("key1", "key2"));
        
        // 清空所有
        cache.invalidateAll();
        
        // 查看统计
        System.out.println("命中率：" + cache.stats().hitRate());
    }
    
    private Object loadData(String key) {
        return "Loaded: " + key;
    }
}
```

### 5.3 LoadingCache - 自动加载模式

```java
import com.github.benmanes.caffeine.cache.LoadingCache;
import java.util.concurrent.TimeUnit;

public class CaffeineLoadingDemo {
    
    private LoadingCache<String, User> userCache = Caffeine.newBuilder()
            .maximumSize(5_000)
            .expireAfterAccess(5, TimeUnit.MINUTES)  // 访问后过期
            .refreshAfterWrite(1, TimeUnit.MINUTES)  // 写入后自动刷新
            .build(key -> {
                System.out.println("【数据库加载】key: " + key);
                return loadUserFromDb(key);
            });
    
    public User getUser(String userId) {
        // 第一次调用 - 缓存未命中，触发加载函数
        // 后续调用 - 直接返回缓存
        return userCache.get(userId);
    }
    
    private User loadUserFromDb(String userId) {
        // 实际场景中这里会查询数据库
        return new User(userId, "张三", 25);
    }
    
    // 测试效果
    public static void main(String[] args) {
        CaffeineLoadingDemo demo = new CaffeineLoadingDemo();
        
        demo.getUser("001");  // 输出：【数据库加载】key: 001
        demo.getUser("001");  // 不输出，直接使用缓存
        
        // 1 分钟后再次调用，后台会自动异步刷新
    }
}
```

### 5.4 AsyncLoadingCache - 异步刷新（生产必备）

```java
import com.github.benmanes.caffeine.cache.AsyncLoadingCache;
import java.util.concurrent.CompletableFuture;

public class AsyncCacheDemo {
    
    // 异步缓存，不阻塞主线程
    private AsyncLoadingCache<String, Data> cache = Caffeine.newBuilder()
            .maximumSize(10_000)
            .refreshAfterWrite(Duration.ofMinutes(10))
            .buildAsync(key -> CompletableFuture.supplyAsync(() -> {
                // 异步加载数据
                return loadFromDatabase(key);
            }));
    
    public CompletableFuture<Data> getData(String key) {
        return cache.get(key);
    }
    
    private Data loadFromDatabase(String key) {
        // 耗时操作
        return database.query(key);
    }
}
```

---

## 六、Ehcache 3.x - 功能最全面的缓存

### 6.1 Ehcache 特点

- ✅ 支持堆内、堆外、磁盘三级存储
- ✅ 支持持久化，重启后数据不丢失
- ✅ 支持分布式缓存（Terracotta）
- ⚠️ 配置相对复杂
- ⚠️ 性能略逊于 Caffeine

### 6.2 快速入门

```java
import org.ehcache.Cache;
import org.ehcache.CacheManager;
import org.ehcache.config.builders.*;
import org.ehcache.expiry.Duration;
import java.time.temporal.ChronoUnit;

public class EhcacheDemo {
    
    // 创建缓存管理器
    private CacheManager cacheManager = CacheManagerBuilder.newCacheManagerBuilder().build(true);
    
    // 创建缓存
    private Cache<String, Object> cache = cacheManager.createCache("myCache",
            ResourcePoolsBuilder.heap(10_000)           // 堆内最多 10000 条
                .offHeap(100, MemoryUnit.MB)            // 堆外 100MB
                .disk(1, MemoryUnit.GB)                 // 磁盘 1GB
            , ExpiryPolicyBuilder.timeToLiveExpiration(
                Duration.of(10, ChronoUnit.MINUTES)     // TTL 10 分钟
            ));
    
    public void operate() {
        // 放入缓存
        cache.put("key1", "value1");
        
        // 获取缓存
        Object value = cache.get("key1");
        
        // 删除缓存
        cache.remove("key1");
    }
}
```

### 6.3 XML 配置方式（Spring 集成）

```xml
<!-- ehcache.xml -->
<config xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'
        xmlns='http://www.ehcache.org/v3'>
    
    <cache alias="users">
        <heap unit="entries">5000</heap>
        <offheap unit="MB">50</offheap>
        <expiry>
            <ttl unit="minutes">30</ttl>
        </expiry>
    </cache>
    
    <cache alias="products">
        <heap unit="entries">10000</heap>
        <resources>
            <offheap unit="MB">100</offheap>
            <disk persistent="true" unit="GB">1</disk>
        </resources>
    </cache>
</config>
```

---

## 七、Spring Cache 统一抽象（推荐使用）

### 7.1 Spring Cache 的优势

Spring 提供了统一的缓存抽象层，可以灵活切换底层实现：

```java
// 只需切换配置文件即可更换缓存实现
@Configuration
@EnableCaching
public class CacheConfig {
    
    // 使用 Caffeine
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(10_000)
            .expireAfterWrite(10, TimeUnit.MINUTES));
        return cacheManager;
    }
    
    // 想换成 Ehcache？只需改这里！
    // @Bean
    // public CacheManager cacheManager() {
    //     return new EhCacheCacheManager();
    // }
}
```

### 7.2 注解式使用（最常用）

```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * 查询用户，自动使用缓存
     */
    @Cacheable(value = "users", key = "#userId", unless = "#result == null")
    public User getUserById(String userId) {
        System.out.println("【查询数据库】" + userId);
        return userRepository.findById(userId).orElse(null);
    }
    
    /**
     * 更新用户，同步删除缓存
     */
    @CacheEvict(value = "users", key = "#user.id")
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    /**
     * 新增用户，放入缓存
     */
    @CachePut(value = "users", key = "#user.id")
    public User createUser(User user) {
        return userRepository.save(user);
    }
}
```

### 7.3 配置文件方式

```yaml
# application.yml - 使用 Caffeine
spring:
  cache:
    type: caffeine
    cache-names: users,products,configs
    caffeine:
      spec: maximumSize=10000,expireAfterAccess=600s

# application.yml - 使用 Ehcache
spring:
  cache:
    type: ehcache
    ehcache:
      config: classpath:ehcache.xml
```

---

## 八、多级缓存架构（生产环境最佳实践）

### 8.1 架构设计

```
请求 → Nginx 层 → Caffeine(L1) → Redis(L2) → Database
       ↓          ↓纳秒级        ↓毫秒级      ↓秒级
     限流       命中率 90%+    命中率 95%+    兜底查询
```

### 8.2 代码实现

```java
@Service
public class MultiLevelCacheService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    // L1 缓存：Caffeine（热点数据）
    private LoadingCache<String, Object> l1Cache = Caffeine.newBuilder()
            .maximumSize(1_000)
            .expireAfterWrite(Duration.ofMinutes(5))
            .build(key -> loadFromRedis(key));
    
    // L2 缓存：Redis（全量数据）
    private Object loadFromRedis(String key) {
        Object value = redisTemplate.opsForValue().get(key);
        if (value != null) {
            System.out.println("【Redis 命中】" + key);
            return value;
        }
        // Redis 未命中，查询数据库
        return loadFromDatabase(key);
    }
    
    public Object getData(String key) {
        // 优先从 L1 获取
        return l1Cache.get(key);
    }
    
    private Object loadFromDatabase(String key) {
        System.out.println("【数据库查询】" + key);
        // 查询数据库并回写 Redis
        Object data = database.query(key);
        redisTemplate.opsForValue().set(key, data, 30, TimeUnit.MINUTES);
        return data;
    }
}
```

### 8.3 性能对比

| 层级 | 响应时间 | 典型命中率 | 成本 |
|-----|---------|----------|------|
| L1 (Caffeine) | 0.1ms | 90%+ | 低 |
| L2 (Redis) | 5ms | 95%+ | 中 |
| Database | 100ms+ | - | 高 |

**综合性能提升：** 90% × 0.1ms + 9.5% × 5ms + 0.5% × 100ms ≈ **1ms**

---

## 九、特殊场景解决方案

### 9.1 防缓存穿透

```java
@Service
public class CachePenetrationService {
    
    private LoadingCache<String, Object> cache = Caffeine.newBuilder()
            .maximumSize(5_000)
            .expireAfterWrite(Duration.ofMinutes(2))  // 短时间过期
            .build(key -> {
                Object data = queryDatabase(key);
                // 即使为空也缓存，防止穿透
                return data != null ? data : NULL_OBJECT;
            });
    
    private static final Object NULL_OBJECT = new Object();
    
    public Object getData(String key) {
        Object result = cache.get(key);
        return (result == NULL_OBJECT) ? null : result;
    }
}
```

### 9.2 防缓存击穿（互斥锁）

```java
@Service
public class CacheBreakdownService {
    
    private ConcurrentHashMap<String, Object> cache = new ConcurrentHashMap<>();
    
    public Object getData(String key) {
        Object value = cache.get(key);
        if (value != null) {
            return value;
        }
        
        // 双重检查锁
        synchronized (this) {
            value = cache.get(key);
            if (value == null) {
                value = queryDatabase(key);
                cache.put(key, value);
            }
        }
        return value;
    }
}
```

### 9.3 防缓存雪崩（随机过期）

```java
@Service
public class CacheAvalancheService {
    
    public void cacheWithRandomTTL(String key, Object value) {
        // 基础过期时间 + 随机值，避免同时过期
        long baseTTL = 30; // 分钟
        long randomTTL = ThreadLocalRandom.current().nextInt(10);
        long ttl = baseTTL + randomTTL;
        
        cache.put(key, value, ttl, TimeUnit.MINUTES);
    }
}
```

---

## 十、监控与调优

### 10.1 监控指标

```java
@Component
public class CacheMonitor {
    
    @Autowired
    private CacheManager cacheManager;
    
    @Scheduled(fixedRate = 60000)  // 每分钟监控
    public void monitor() {
        for (String name : cacheManager.getCacheNames()) {
            Cache cache = cacheManager.getCache(name);
            
            if (cache instanceof CaffeineCache) {
                CaffeineCache caffeineCache = (CaffeineCache) cache;
                var nativeCache = caffeineCache.getNativeCache();
                
                Stats stats = nativeCache.stats();
                
                System.out.printf("=== 缓存 [%s] ===\n", name);
                System.out.printf("命中率：%.2f%%\n", stats.hitRate() * 100);
                System.out.printf("总请求：%d\n", stats.hitCount() + stats.missCount());
                System.out.printf("平均加载：%.2fms\n", stats.averageLoadPenalty() / 1_000_000);
            }
        }
    }
}
```

### 10.2 调优建议

| 问题 | 原因 | 解决方案 |
|-----|------|---------|
| 命中率 < 80% | 容量太小 | 增大 `maximumSize` |
| 命中率 < 80% | 过期太快 | 延长 `expireAfterWrite` |
| OOM | 无容量限制 | 必须设置 `maximumSize` |
| 数据不一致 | 更新未清理 | 使用 `@CacheEvict` |

---

## 十一、技术选型建议

### 11.1 快速决策树

```
是否需要跨应用共享？
├─ 是 → 使用 Redis/Memcached
└─ 否 → 继续使用本地缓存
    ├─ 是否需要持久化？
    │   ├─ 是 → Ehcache 3.x（支持磁盘存储）
    │   └─ 否 → 继续选择
    │       ├─ Spring Boot 项目 → Caffeine（默认集成）
    │       ├─ 老项目兼容 → Guava Cache
    │       └─ 超简单场景 → ConcurrentHashMap
```

### 11.2 推荐组合

**方案一：Spring Boot + Caffeine（推荐）**
```yaml
# 适用于 90% 的场景
spring:
  cache:
    type: caffeine
    caffeine:
      spec: maximumSize=10000,expireAfterAccess=300s
```

**方案二：多级缓存（高并发场景）**
```
Caffeine(L1) + Redis(L2) + MySQL
```

**方案三：Ehcache（需要持久化）**
```xml
<!-- 支持重启后数据不丢失 -->
<disk persistent="true" unit="GB">1</disk>
```

---

## 十二、面试高频题

### 12.1 Caffeine vs Guava vs Ehcache

**参考答案：**
- **性能**：Caffeine > Ehcache > Guava
- **功能**：Ehcache（支持持久化）> Caffeine > Guava
- **易用性**：Caffeine（Spring 默认）最方便
- **推荐**：新项目首选 Caffeine

### 12.2 本地缓存 vs 分布式缓存

| 维度 | 本地缓存 | 分布式缓存 |
|-----|---------|-----------|
| 速度 | 纳秒级 | 毫秒级 |
| 一致性 | 差（各实例独立） | 好（集中存储） |
| 容量 | 受 JVM 限制 | 可横向扩展 |
| 可靠性 | 应用重启丢失 | 持久化保存 |
| 场景 | 单机、热点数据 | 集群、共享数据 |

### 12.3 缓存三大问题如何解决？

**缓存穿透**：缓存空值、布隆过滤器  
**缓存击穿**：互斥锁、逻辑过期  
**缓存雪崩**：随机 TTL、多级缓存  

---

## 十三、课后作业

1. **基础题**：使用 Caffeine 实现用户信息查询缓存
2. **进阶题**：实现 Caffeine + Redis 两级缓存
3. **挑战题**：编写缓存监控面板，实时展示命中率

---

**参考资料：**
- [Caffeine 官方文档](https://github.com/ben-manes/caffeine)
- [Spring Cache 指南](https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#cache)
- 《Java 缓存实战》
- 《深入理解 Java 缓存设计与实践》