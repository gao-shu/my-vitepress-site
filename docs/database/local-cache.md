# 本地缓存：Caffeine Cache 详解

## 一、什么是本地缓存？

### 1.1 缓存层次结构

在企业级应用中，缓存通常分为三个层次：

```
┌─────────────────────────────────────┐
│   浏览器缓存 (Browser Cache)        │
│   - LocalStorage / SessionStorage   │
│   - HTTP Cache                      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   分布式缓存 (Distributed Cache)    │
│   - Redis / Memcached               │
│   - 跨应用共享，支持集群            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   本地缓存 (Local Cache)            │
│   - Caffeine / Guava Cache          │
│   - JVM 进程内，速度最快            │
└─────────────────────────────────────┘
```

### 1.2 本地缓存的特点

**优势：**
- ✅ **性能极致**：直接在 JVM 内存中，无网络开销，读写速度纳秒级
- ✅ **简单可靠**：无需额外部署中间件，零依赖
- ✅ **线程安全**：内置并发控制，支持高并发场景
- ✅ **功能丰富**：支持多种过期策略、统计信息、异步加载

**劣势：**
- ❌ **数据孤立**：每个应用实例独立缓存，无法跨应用共享
- ❌ **内存限制**：受限于 JVM 堆内存大小
- ❌ **持久化弱**：应用重启后缓存丢失

**适用场景：**
- 热点数据（如配置信息、字典表、元数据）
- 计算结果缓存（避免重复计算）
- 防缓存穿透（作为 Redis 的前置缓冲）
- 单实例应用或不需要跨应用共享的场景

---

## 二、Caffeine Cache 核心特性

### 2.1 为什么选择 Caffeine？

Caffeine 是 Google Guava Cache 的升级版，Spring Boot 2.x 默认的本地缓存方案：

```java
// Maven 依赖（Spring Boot 已集成，无需额外添加）
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
    <version>3.1.8</version>
</dependency>
```

**核心优势：**
1. **高性能**：使用 W-TinyLru 算法，命中率比 Guava 提升 30%+
2. **三种过期策略**：
   - 基于容量（Capacity-based）
   - 基于时间（Time-based）
   - 基于引用（Reference-based）
3. **统计监控**：实时统计命中率、加载时间等指标
4. **异步加载**：支持 `CompletableFuture` 异步刷新

---

## 三、快速入门

### 3.1 基础使用示例

#### 方式一：手动放入缓存

```java
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;

public class CaffeineDemo {
    
    // 创建缓存对象
    private Cache<String, Object> cache = Caffeine.newBuilder()
            .maximumSize(10_000)           // 最大容量 10000 条
            .expireAfterWrite(Duration.ofMinutes(10))  // 写入后 10 分钟过期
            .recordStats()                 // 开启统计
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
        System.out.println("平均加载时间：" + cache.stats().averageLoadPenalty() + "ms");
    }
}
```

#### 方式二：自动加载（推荐）

```java
import com.github.benmanes.caffeine.cache.LoadingCache;
import java.util.concurrent.TimeUnit;

public class LoadingCacheDemo {
    
    // 创建带自动加载功能的缓存
    private LoadingCache<String, User> userCache = Caffeine.newBuilder()
            .maximumSize(5_000)
            .expireAfterAccess(5, TimeUnit.MINUTES)  // 最后一次访问后 5 分钟过期
            .refreshAfterWrite(1, TimeUnit.MINUTES)  // 写入后 1 分钟自动刷新
            .build(key -> loadUserFromDatabase(key)); // 缓存未命中时的加载函数
    
    // 获取缓存，不存在时自动调用 load 方法
    public User getUser(String userId) {
        return userCache.get(userId);
    }
    
    // 模拟从数据库加载
    private User loadUserFromDatabase(String userId) {
        System.out.println("【数据库查询】userId: " + userId);
        // 实际场景中这里会查询数据库
        return new User(userId, "张三", 25);
    }
}
```

**效果演示：**
```java
LoadingCacheDemo demo = new LoadingCacheDemo();

// 第一次查询 - 缓存未命中，会调用 loadUserFromDatabase
demo.getUser("001");  // 输出：【数据库查询】userId: 001

// 第二次查询 - 缓存命中，直接返回
demo.getUser("001");  // 不会输出数据库查询日志

// 1 分钟后 - 自动刷新，后台异步加载最新数据
// ...
```

---

## 四、Spring Boot 集成实战

### 4.1 配置文件

```yaml
# application.yml
spring:
  cache:
    type: caffeine
    cache-names: users,products,configs
    caffeine:
      spec: maximumSize=10000,expireAfterAccess=600s
```

### 4.2 使用 @Cacheable 注解（推荐）

```java
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * 查询用户，自动使用缓存
     * @Cacheable 说明：
     * - value: 缓存名称（对应 cache-names 中的配置）
     * - key: 缓存键，支持 SpEL 表达式
     * - unless: 条件，满足时不缓存（如 null 值）
     */
    @Cacheable(value = "users", key = "#userId", unless = "#result == null")
    public User getUserById(String userId) {
        System.out.println("【查询数据库】userId: " + userId);
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
     * 批量查询，使用自定义 key 生成器
     */
    @Cacheable(value = "users", keyGenerator = "cacheKeyGenerator")
    public List<User> getUsersByIds(List<String> userIds) {
        return userRepository.findAllById(userIds);
    }
}
```

### 4.3 自定义 Key 生成器

```java
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.stereotype.Component;

@Component
public class CacheKeyGenerator implements KeyGenerator {
    
    @Override
    public Object generate(Object target, Method method, Object... params) {
        // 自定义 key 生成逻辑，例如：类名 + 方法名 + 参数 hash
        String className = target.getClass().getSimpleName();
        String methodName = method.getName();
        String paramHash = Arrays.hashCode(params);
        return String.format("%s:%s:%d", className, methodName, paramHash);
    }
}
```

---

## 五、高级用法

### 5.1 多级缓存架构

```java
@Service
public class MultiLevelCacheService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    // 一级缓存：Caffeine（纳秒级）
    private LoadingCache<String, Object> l1Cache = Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(Duration.ofMinutes(5))
            .build(key -> loadFromRedis(key));
    
    // 二级缓存：Redis（毫秒级）
    private Object loadFromRedis(String key) {
        Object value = redisTemplate.opsForValue().get(key);
        if (value != null) {
            return value;
        }
        // Redis 未命中，查询数据库
        return loadFromDatabase(key);
    }
    
    public Object getData(String key) {
        // 优先从 L1 缓存获取
        return l1Cache.get(key);
    }
    
    private Object loadFromDatabase(String key) {
        // 查询数据库逻辑
        return database.query(key);
    }
}
```

**架构优势：**
```
请求 → Caffeine(L1) → Redis(L2) → Database
       ↓ 纳秒级         ↓ 毫秒级      ↓ 秒级
      命中率 90%+      命中率 95%+    兜底查询
```

### 5.2 防缓存穿透

```java
@Service
public class CachePenetrationService {
    
    private LoadingCache<String, Object> cache = Caffeine.newBuilder()
            .maximumSize(5000)
            .expireAfterWrite(Duration.ofMinutes(2))  // 短时间过期
            .build(key -> {
                // 即使数据库中没有，也缓存一个空值
                Object data = queryDatabase(key);
                return data != null ? data : new NullObject();
            });
    
    public Object getData(String key) {
        Object result = cache.get(key);
        // 如果是空值对象，说明数据库中也没有
        if (result instanceof NullObject) {
            return null;
        }
        return result;
    }
    
    // 空值对象类
    private static class NullObject {
        // 占位符，防止缓存穿透
    }
}
```

### 5.3 异步刷新（生产环境必备）

```java
@Service
public class AsyncRefreshService {
    
    // 使用 AsyncLoadingCache 支持异步刷新
    private AsyncLoadingCache<String, Data> cache = Caffeine.newBuilder()
            .maximumSize(10_000)
            .refreshAfterWrite(Duration.ofMinutes(10))  // 10 分钟后异步刷新
            .buildAsync(key -> CompletableFuture.supplyAsync(() -> {
                // 异步加载数据，不阻塞主线程
                return loadDataFromSource(key);
            }));
    
    public CompletableFuture<Data> getData(String key) {
        return cache.get(key);
    }
    
    // 主动刷新某个 key
    public void refresh(String key) {
        cache.synchronous().refresh(key);
    }
}
```

---

## 六、监控与调优

### 6.1 监控指标

```java
@Component
public class CacheMonitor {
    
    @Autowired
    private CacheManager cacheManager;
    
    @Scheduled(fixedRate = 60000)  // 每分钟监控一次
    public void monitorCacheStats() {
        Collection<String> cacheNames = cacheManager.getCacheNames();
        
        for (String name : cacheNames) {
            Cache cache = cacheManager.getCache(name);
            if (cache instanceof CaffeineCache) {
                CaffeineCache caffeineCache = (CaffeineCache) cache;
                com.github.benmanes.caffeine.cache.Cache nativeCache = 
                    caffeineCache.getNativeCache();
                
                Stats stats = nativeCache.stats();
                
                System.out.println("=== 缓存 [" + name + "] 统计 ===");
                System.out.println("命中率：" + String.format("%.2f%%", stats.hitRate() * 100));
                System.out.println("总请求数：" + (stats.hitCount() + stats.missCount()));
                System.out.println("未命中数：" + stats.missCount());
                System.out.println("平均加载时间：" + stats.averageLoadPenalty() / 1_000_000 + "ms");
                System.out.println("驱逐数量：" + nativeCache.estimatedSize());
            }
        }
    }
}
```

### 6.2 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| 命中率低 | 缓存容量太小 | 增大 `maximumSize` |
| 命中率低 | 过期时间太短 | 延长 `expireAfterWrite` |
| OOM | 缓存无限制增长 | 必须设置 `maximumSize` |
| 数据不一致 | 更新后未清理缓存 | 使用 `@CacheEvict` 及时清理 |
| 刷新不及时 | 异步刷新延迟 | 缩短 `refreshAfterWrite` |

---

## 七、最佳实践总结

### 7.1 配置建议

```yaml
# 生产环境推荐配置
spring:
  cache:
    caffeine:
      spec: |
        maximumSize=50000,
        expireAfterAccess=300s,
        recordStats
```

### 7.2 使用原则

1. **适合缓存的数据：**
   - ✅ 读多写少的数据（如配置、字典）
   - ✅ 计算成本高的结果
   - ✅ 允许短暂不一致的数据

2. **不适合缓存的数据：**
   - ❌ 频繁变更的数据
   - ❌ 强一致性要求的数据
   - ❌ 大对象（占用过多内存）

3. **容量规划：**
   - 单个缓存不超过 5 万条
   - 总内存占用不超过 JVM 堆的 20%
   - 定期监控命中率，低于 80% 需优化

### 7.3 与 Redis 的配合

```
┌──────────────────────────────────────┐
│          应用层                       │
│  ┌──────────────────────────────┐    │
│  │  Caffeine (L1 缓存)          │    │
│  │  - 热点数据                   │    │
│  │  - 纳秒级响应                 │    │
│  └──────────────────────────────┘    │
│              ↓                        │
│  ┌──────────────────────────────┐    │
│  │  Redis (L2 缓存)             │    │
│  │  - 全量数据                   │    │
│  │  │  - 毫秒级响应                 │    │
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘
```

---

## 八、面试高频题

### 8.1 Caffeine vs Guava vs Ehcache

| 特性 | Caffeine | Guava Cache | Ehcache |
|------|----------|-------------|---------|
| 性能 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 命中率 | 95%+ | 85%+ | 90%+ |
| 过期策略 | 3 种 | 2 种 | 4 种 |
| 统计监控 | 完善 | 基础 | 完善 |
| Spring 集成 | 默认 | 需配置 | 需插件 |

### 8.2 缓存雪崩、穿透、击穿如何解决？

**参考答案：**
```java
// 1. 缓存穿透：缓存空值
cache.get(key, k -> db.query(k) ?: NULL_OBJECT);

// 2. 缓存击穿：互斥锁重建
if (cache.getIfPresent(key) == null) {
    synchronized(this) {
        if (cache.getIfPresent(key) == null) {
            cache.put(key, db.query(key));
        }
    }
}

// 3. 缓存雪崩：随机过期时间
Duration ttl = Duration.ofMinutes(base + random.nextInt(30));
```

---

## 九、课后作业

1. **基础题**：在项目中集成 Caffeine，缓存用户信息查询
2. **进阶题**：实现 Caffeine + Redis 多级缓存
3. **挑战题**：编写缓存监控面板，实时展示命中率

---

**参考资料：**
- [Caffeine 官方文档](https://github.com/ben-manes/caffeine)
- [Spring Cache 官方指南](https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#cache)
- 《深入理解 Java 缓存设计与实践》