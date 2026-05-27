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

---

### ❓ 面试官：Spring 事务在哪些情况下会失效？如何排查和解决？【中高级】
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
Spring 事务失效主要有 **8 种常见原因**：**同类内部调用、方法非 public、异常被捕获、数据库引擎不支持、手动回滚未配置、自注入问题、代理模式限制、数据源配置错误**。排查时先看日志，再检查代码结构，最后验证数据库配置。

**📝 8 种事务失效场景及解决方案：**

---

#### 1. 同类内部调用（最常见 ⭐⭐⭐⭐⭐）

**❌ 错误写法**：

```java
@Service
public class OrderService {
    
    @Autowired
    private OrderMapper orderMapper;
    
    /**
     * 创建订单
     */
    @Transactional
    public void createOrder(Order order) {
        orderMapper.insert(order);
        
        // ❌ 同类内部调用，事务失效！
        updateStock(order.getProductId());
    }
    
    /**
     * 扣减库存
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateStock(Long productId) {
        // 这个方法的事务不会生效
        productMapper.updateStock(productId);
    }
}
```

**原因**：Spring AOP 基于动态代理，只有通过代理对象调用才会触发事务。同类内部调用使用 `this.updateStock()`，绕过了代理。

**✅ 解决方案 1：注入自己（自注入）**

```java
@Service
public class OrderService {
    
    @Autowired
    private OrderMapper orderMapper;
    
    @Autowired
    private OrderService self;  // 注入自己
    
    @Transactional
    public void createOrder(Order order) {
        orderMapper.insert(order);
        
        // ✅ 通过代理对象调用，事务生效
        self.updateStock(order.getProductId());
    }
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateStock(Long productId) {
        productMapper.updateStock(productId);
    }
}
```

**✅ 解决方案 2：提取到另一个 Service**

```java
@Service
public class OrderService {
    
    @Autowired
    private OrderMapper orderMapper;
    
    @Autowired
    private StockService stockService;  // 注入另一个 Service
    
    @Transactional
    public void createOrder(Order order) {
        orderMapper.insert(order);
        
        // ✅ 跨类调用，事务生效
        stockService.updateStock(order.getProductId());
    }
}

@Service
public class StockService {
    
    @Autowired
    private ProductMapper productMapper;
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateStock(Long productId) {
        productMapper.updateStock(productId);
    }
}
```

**✅ 解决方案 3：使用 AopContext 获取代理对象**

```java
@Service
public class OrderService {
    
    @Transactional
    public void createOrder(Order order) {
        orderMapper.insert(order);
        
        // ✅ 通过 AopContext 获取代理对象
        ((OrderService) AopContext.currentProxy()).updateStock(order.getProductId());
    }
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateStock(Long productId) {
        productMapper.updateStock(productId);
    }
}

// 需要在启动类或配置类上启用 exposeProxy
@EnableAspectJAutoProxy(exposeProxy = true)
@SpringBootApplication
public class Application { ... }
```

**推荐**：方案 2（提取到另一个 Service）最符合单一职责原则，代码更清晰。

---

#### 2. 方法不是 public（⭐⭐⭐⭐）

**❌ 错误写法**：

```java
@Service
public class OrderService {
    
    // ❌ private 方法，事务失效
    @Transactional
    private void createOrder(Order order) {
        orderMapper.insert(order);
    }
    
    // ❌ protected 方法，事务失效
    @Transactional
    protected void updateOrder(Order order) {
        orderMapper.updateById(order);
    }
    
    // ❌ 默认访问权限，事务失效
    @Transactional
    void deleteOrder(Long id) {
        orderMapper.deleteById(id);
    }
}
```

**原因**：Spring AOP 只能代理 public 方法。

**✅ 正确写法**：

```java
@Service
public class OrderService {
    
    // ✅ public 方法，事务生效
    @Transactional
    public void createOrder(Order order) {
        orderMapper.insert(order);
    }
}
```

---

#### 3. 异常被捕获未抛出（⭐⭐⭐⭐⭐）

**❌ 错误写法**：

```java
@Service
public class OrderService {
    
    @Autowired
    private OrderMapper orderMapper;
    
    @Transactional
    public void createOrder(Order order) {
        try {
            orderMapper.insert(order);
            
            // 模拟异常
            int result = 1 / 0;
            
        } catch (Exception e) {
            // ❌ 异常被捕获，事务不会回滚
            log.error("创建订单失败", e);
        }
    }
}
```

**原因**：Spring 事务只在**异常抛出到事务拦截器之外**时才会回滚。如果异常被捕获且未重新抛出，事务拦截器感知不到异常，不会回滚。

**✅ 解决方案 1：重新抛出异常**

```java
@Transactional
public void createOrder(Order order) {
    try {
        orderMapper.insert(order);
        int result = 1 / 0;
        
    } catch (Exception e) {
        log.error("创建订单失败", e);
        throw e;  // ✅ 重新抛出异常，触发回滚
    }
}
```

**✅ 解决方案 2：手动回滚**

```java
@Transactional
public void createOrder(Order order) {
    try {
        orderMapper.insert(order);
        int result = 1 / 0;
        
    } catch (Exception e) {
        log.error("创建订单失败", e);
        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();  // ✅ 手动回滚
    }
}
```

**✅ 解决方案 3：只捕获特定异常，其他异常继续抛出**

```java
@Transactional
public void createOrder(Order order) {
    try {
        orderMapper.insert(order);
        int result = 1 / 0;
        
    } catch (BusinessException e) {
        // 业务异常，记录日志但不回滚
        log.warn("业务异常: {}", e.getMessage());
        
    } catch (Exception e) {
        // 系统异常，记录日志并抛出，触发回滚
        log.error("系统异常", e);
        throw e;
    }
}
```

---

#### 4. 数据库引擎不支持事务（⭐⭐⭐）

**❌ 问题场景**：

```sql
-- 查看表的存储引擎
SHOW TABLE STATUS LIKE 't_order';

-- 结果：Engine = MyISAM（不支持事务）
```

**原因**：MySQL 的 MyISAM 引擎不支持事务，只有 InnoDB 支持。

**✅ 解决方案**：

```sql
-- 修改表的存储引擎为 InnoDB
ALTER TABLE t_order ENGINE = InnoDB;

-- 或者建表时指定
CREATE TABLE t_order (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(64) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
```

**检查所有表的引擎**：

```sql
SELECT table_name, engine 
FROM information_schema.tables 
WHERE table_schema = 'your_database' 
AND engine != 'InnoDB';
```

---

#### 5. 异常类型不匹配（⭐⭐⭐）

**❌ 错误写法**：

```java
@Service
public class OrderService {
    
    @Autowired
    private OrderMapper orderMapper;
    
    /**
     * 默认只回滚 RuntimeException 和 Error
     *  checked Exception（如 IOException）不会触发回滚
     */
    @Transactional
    public void createOrder(Order order) throws IOException {
        orderMapper.insert(order);
        
        // 抛出 checked Exception，事务不会回滚
        throw new IOException("IO 异常");
    }
}
```

**原因**：Spring 事务默认只回滚 `RuntimeException` 和 `Error`，不回滚 checked Exception（编译期异常）。

**✅ 解决方案 1：指定回滚的异常类型**

```java
@Transactional(rollbackFor = Exception.class)  // ✅ 所有异常都回滚
public void createOrder(Order order) throws IOException {
    orderMapper.insert(order);
    throw new IOException("IO 异常");
}
```

**✅ 解决方案 2：抛出 RuntimeException**

```java
@Transactional
public void createOrder(Order order) {
    orderMapper.insert(order);
    throw new RuntimeException("运行时异常");  // ✅ 默认会回滚
}
```

**最佳实践**：**始终使用 `@Transactional(rollbackFor = Exception.class)`**，确保所有异常都能触发回滚。

---

#### 6. 自注入导致的循环依赖（⭐⭐）

**❌ 错误写法**：

```java
@Service
public class OrderService {
    
    @Autowired
    private OrderService self;  // ❌ 可能导致循环依赖
    
    @Transactional
    public void createOrder(Order order) {
        orderMapper.insert(order);
        self.updateStock(order.getProductId());
    }
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateStock(Long productId) {
        productMapper.updateStock(productId);
    }
}
```

**原因**：Spring Boot 2.6+ 默认禁止循环依赖，自注入会导致启动失败。

**✅ 解决方案**：

**方案 1：允许循环依赖（不推荐）**

```yaml
# application.yml
spring:
  main:
    allow-circular-references: true  # 允许循环依赖
```

**方案 2：使用 `@Lazy` 延迟注入**

```java
@Service
public class OrderService {
    
    @Autowired
    @Lazy
    private OrderService self;  // ✅ 延迟注入，避免循环依赖
    
    @Transactional
    public void createOrder(Order order) {
        orderMapper.insert(order);
        self.updateStock(order.getProductId());
    }
}
```

**方案 3：提取到另一个 Service（推荐）**

```java
@Service
public class OrderService {
    
    @Autowired
    private StockService stockService;
    
    @Transactional
    public void createOrder(Order order) {
        orderMapper.insert(order);
        stockService.updateStock(order.getProductId());
    }
}

@Service
public class StockService {
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateStock(Long productId) {
        productMapper.updateStock(productId);
    }
}
```

---

#### 7. 代理模式限制（CGLib vs JDK）（⭐⭐）

**问题场景**：

```java
@Service
public class OrderService implements IOrderService {
    
    @Transactional
    public void createOrder(Order order) {
        // ...
    }
}
```

**原因**：
- 如果使用 **JDK 动态代理**（基于接口），只能通过接口调用才能触发事务。
- 如果使用 **CGLib 代理**（基于继承），可以直接通过类调用。

**Spring Boot 2.x+ 默认使用 CGLib**，所以这个问题较少见。但如果强制使用 JDK 代理，需要注意：

**✅ 解决方案**：

```yaml
# application.yml
spring:
  aop:
    proxy-target-class: true  # 强制使用 CGLib 代理（默认就是 true）
```

---

#### 8. 数据源配置错误（⭐）

**❌ 错误配置**：

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test?useSSL=false
    username: root
    password: 123456
    driver-class-name: com.mysql.jdbc.Driver  # ❌ 旧版驱动
    
# 或者使用了多个数据源，但未正确配置事务管理器
```

**✅ 正确配置**：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test?useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver  # ✅ MySQL 8.0+ 驱动
    
  jpa:
    show-sql: true  # 打印 SQL，便于调试
```

**多数据源配置**：

```java
@Configuration
public class DataSourceConfig {
    
    @Bean
    @Primary
    public DataSource primaryDataSource() {
        // 主数据源
    }
    
    @Bean
    public DataSource secondaryDataSource() {
        // 从数据源
    }
    
    @Bean
    @Primary
    public PlatformTransactionManager primaryTransactionManager(
            @Qualifier("primaryDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}

// 使用时指定事务管理器
@Transactional(transactionManager = "primaryTransactionManager")
public void createOrder(Order order) {
    // ...
}
```

---

### 📊 事务失效排查清单

| 序号 | 检查项 | 解决方法 |
|------|--------|---------|
| 1 | 是否是同类内部调用？ | 注入自己或提取到另一个 Service |
| 2 | 方法是否是 public？ | 改为 public |
| 3 | 异常是否被捕获未抛出？ | 重新抛出或手动回滚 |
| 4 | 数据库引擎是否支持事务？ | 改为 InnoDB |
| 5 | 异常类型是否匹配？ | 使用 `rollbackFor = Exception.class` |
| 6 | 是否存在循环依赖？ | 使用 `@Lazy` 或提取 Service |
| 7 | 代理模式是否正确？ | 确认使用 CGLib |
| 8 | 数据源配置是否正确？ | 检查驱动、URL、事务管理器 |

---

### 🔍 快速排查步骤

**步骤 1：开启 SQL 日志**

```yaml
# application.yml
logging:
  level:
    org.springframework.transaction: DEBUG
    org.hibernate.SQL: DEBUG
```

**步骤 2：检查日志输出**

```
# 正常情况
Creating new transaction with name [xxx]
Initiating transaction commit
Committing JDBC transaction

# 异常情况（事务未生效）
Participating in existing transaction  # 加入了已有事务
No transaction created  # 未创建事务
```

**步骤 3：验证回滚**

```java
@Transactional
public void testTransaction() {
    orderMapper.insert(order);
    throw new RuntimeException("测试回滚");
}

// 调用后检查数据库，确认数据是否回滚
```

**步骤 4：使用单元测试验证**

```java
@SpringBootTest
class OrderServiceTest {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private OrderMapper orderMapper;
    
    @Test
    void testTransactionRollback() {
        Order order = new Order();
        order.setOrderNo("TEST001");
        
        try {
            orderService.createOrder(order);
        } catch (Exception e) {
            // 预期异常
        }
        
        // 验证数据是否回滚
        Order saved = orderMapper.selectByOrderNo("TEST001");
        assertNull(saved);  // 应该为 null，说明回滚成功
    }
}
```

---

### 🎯 面试加分项

"在实际项目中，我们遇到过多次事务失效的问题，总结了以下经验：

1. **同类内部调用是最常见的陷阱**：我们通过代码审查规范，禁止在同一个 Service 中直接调用带 `@Transactional` 的方法，必须通过注入或提取到其他 Service

2. **异常处理不规范**：要求所有 `@Transactional` 方法要么不捕获异常，要么捕获后必须重新抛出或手动回滚

3. **统一使用 `rollbackFor = Exception.class`**：避免因异常类型不匹配导致事务不回滚

4. **数据库迁移时检查引擎**：确保所有表都使用 InnoDB 引擎

5. **编写单元测试验证事务**：每个涉及事务的方法都要有回滚测试用例

这些实践帮助我们避免了大量线上事务失效的问题。"