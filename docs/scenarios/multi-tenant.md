# 多租户架构设计与数据隔离

---

### ❓ 面试官：你们公司的 SaaS 平台需要支持多个企业客户（租户）使用，如何设计多租户架构？不同租户的数据如何实现隔离？【中高级】
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
多租户架构的核心是**"一套代码、多套数据"**。根据隔离级别从低到高分为三种方案：**字段级隔离（共享数据库+共享 Schema）**、**Schema 级隔离（共享数据库+独立 Schema）**、**数据库级隔离（独立数据库）**。选择哪种方案取决于业务对安全性、成本、运维复杂度的权衡。

**📝 三种主流方案的详细对比与实现：**

#### 方案一：字段级隔离（Tenant ID 列）—— 最常用、性价比最高
**适用场景**：中小型企业 SaaS、对成本敏感、租户数量多但单租户数据量不大。

**核心思路**：所有租户共用一张表，通过 `tenant_id` 字段区分数据归属。

```sql
-- 示例：订单表
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id BIGINT NOT NULL COMMENT '租户ID',
    order_no VARCHAR(64) NOT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(10,2),
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tenant_id (tenant_id),  -- 必须加索引！
    INDEX idx_tenant_order (tenant_id, order_no)  -- 联合索引优化查询
);
```

**✅ 优点**：
- **成本最低**：只需一套数据库，硬件资源利用率最高。
- **运维简单**：备份、升级、扩容都是统一操作。
- **跨租户统计方便**：做全局数据分析时不需要跨库查询。

**⚠️ 缺点与风险**：
- **数据泄露风险高**：如果代码里忘记加 `WHERE tenant_id = ?`，就会查错数据甚至跨租户泄露！这是致命问题。
- **性能瓶颈**：单表数据量会指数级增长，即使分库分表也很复杂。
- **备份恢复困难**：无法单独为某个租户做数据恢复。

**🛡️ 如何保证数据隔离不泄露（关键考点）：**
1. **MyBatis 拦截器 / Hibernate Filter**：在 ORM 层自动注入 `tenant_id` 条件，开发者写 SQL 时无感知。
   ```java
   // MyBatis Plus 的多租户插件配置示例
   @Bean
   public MybatisPlusInterceptor mybatisPlusInterceptor() {
       MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
       TenantLineInnerInterceptor tenantInterceptor = new TenantLineInnerInterceptor();
       tenantInterceptor.setTenantLineHandler(new TenantLineHandler() {
           @Override
           public Expression getTenantId() {
               // 从 ThreadLocal 或 SecurityContext 获取当前租户ID
               return new LongValue(TenantContextHolder.getTenantId());
           }
           
           @Override
           public String getTenantIdColumn() {
               return "tenant_id";
           }
           
           @Override
           public boolean ignoreTable(String tableName) {
               // 某些公共表（如字典表）不需要租户隔离
               return "sys_dict".equals(tableName);
           }
       });
       interceptor.addInnerInterceptor(tenantInterceptor);
       return interceptor;
   }
   ```

2. **代码审查与单元测试**：强制要求所有查询必须带租户上下文，CI/CD 流程中加入自动化检测。

3. **数据库权限控制**：应用层账号只允许访问自己的 Schema，防止越权。

---

#### 方案二：Schema 级隔离（PostgreSQL Schema / MySQL Database）
**适用场景**：中大型企业、对数据安全性要求较高、租户数量适中（几十到几百个）。

**核心思路**：每个租户拥有独立的 Schema（PostgreSQL）或 Database（MySQL），但物理上仍在同一台数据库服务器。

```sql
-- PostgreSQL 示例：为每个租户创建独立 Schema
CREATE SCHEMA tenant_1001;
CREATE SCHEMA tenant_1002;

-- 在每个 Schema 下创建相同的表结构
CREATE TABLE tenant_1001.orders (
    id BIGINT PRIMARY KEY,
    order_no VARCHAR(64),
    ...
);

CREATE TABLE tenant_1002.orders (
    id BIGINT PRIMARY KEY,
    order_no VARCHAR(64),
    ...
);
```

**✅ 优点**：
- **逻辑隔离清晰**：天然避免了"忘写 WHERE tenant_id"的 bug。
- **独立备份恢复**：可以单独备份某个租户的数据。
- **性能相对较好**：不同租户的数据不会互相干扰索引和缓存。

**⚠️ 缺点**：
- **运维复杂度增加**：新增租户时需要动态创建 Schema 并执行建表脚本。
- **跨租户查询困难**：如果需要做全局报表，需要 UNION 多个 Schema 的表。
- **连接池管理复杂**：需要根据租户路由到不同的 Schema。

**🔧 技术实现要点**：
```java
// Spring Boot + Dynamic DataSource 实现 Schema 切换
@Component
public class TenantDataSourceRouter extends AbstractRoutingDataSource {
    
    @Override
    protected Object determineCurrentLookupKey() {
        // 根据当前租户ID返回对应的 DataSource Key
        Long tenantId = TenantContextHolder.getTenantId();
        return "tenant_" + tenantId;
    }
}

// 配置多个数据源
@Configuration
public class DataSourceConfig {
    
    @Bean("tenant_1001")
    public DataSource tenant1001DataSource() {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:postgresql://localhost:5432/saas_db");
        ds.setUsername("saas_user");
        ds.setPassword("password");
        // 设置 search_path 指定 Schema
        ds.addDataSourceProperty("currentSchema", "tenant_1001");
        return ds;
    }
    
    @Bean("tenant_1002")
    public DataSource tenant1002DataSource() {
        // 类似配置...
    }
    
    @Primary
    @Bean
    public DataSource routingDataSource() {
        TenantDataSourceRouter router = new TenantDataSourceRouter();
        Map<Object, Object> targetDataSources = new HashMap<>();
        targetDataSources.put("tenant_1001", tenant1001DataSource());
        targetDataSources.put("tenant_1002", tenant1002DataSource());
        router.setTargetDataSources(targetDataSources);
        return router;
    }
}
```

---

#### 方案三：数据库级隔离（独立数据库实例）
**适用场景**：超大型企业客户、政府/金融等对数据安全极度敏感的场景、愿意支付高价的 VIP 租户。

**核心思路**：每个租户拥有完全独立的数据库实例，甚至可以部署在不同的物理服务器上。

**✅ 优点**：
- **物理隔离、安全性最高**：完全不用担心数据泄露。
- **性能互不影响**：大租户不会拖垮小租户。
- **灵活定制**：可以为 VIP 租户单独优化数据库配置、索引策略。

**⚠️ 缺点**：
- **成本极高**：每个租户都需要独立的计算和存储资源。
- **运维噩梦**：100 个租户就要维护 100 个数据库实例，升级、备份、监控工作量爆炸。
- **资源浪费**：小租户的数据库大部分时间空闲，但依然占用资源。

**🔧 实现方式**：
通常结合**数据库中间件**（如 ShardingSphere、MyCat）或**云数据库服务**（如 AWS RDS、阿里云 PolarDB）来实现自动化 provisioning。

---

### ❓ 面试官：在多租户系统中，有些数据是需要所有租户共享的（比如字典表、省份城市数据、系统公告），这种"数据共享"如何实现？
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
共享数据采用**"公共表 + 特殊标识"**的设计，在 ORM 层通过白名单机制跳过租户隔离逻辑。

**📝 具体实现方案：**

#### 方案一：公共表不加 tenant_id 字段
```sql
-- 系统字典表（所有租户共享）
CREATE TABLE sys_dict (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dict_type VARCHAR(64) NOT NULL COMMENT '字典类型',
    dict_key VARCHAR(64) NOT NULL COMMENT '字典键',
    dict_value VARCHAR(255) NOT NULL COMMENT '字典值',
    sort_order INT DEFAULT 0,
    is_system TINYINT DEFAULT 1 COMMENT '是否系统内置'
);

-- 省份城市表（全国通用）
CREATE TABLE sys_region (
    id BIGINT PRIMARY KEY,
    parent_id BIGINT,
    region_name VARCHAR(64),
    region_code VARCHAR(32)
);
```

**ORM 层配置白名单**：
```java
// 在 MyBatis Plus 租户插件中忽略这些表
@Override
public boolean ignoreTable(String tableName) {
    // 这些表不需要租户隔离
    return Arrays.asList("sys_dict", "sys_region", "sys_announcement")
                 .contains(tableName);
}
```

---

#### 方案二：共享表 + tenant_id = 0 或 NULL
有些场景下，共享数据和私有数据结构相同，可以用特殊值标识。

```sql
CREATE TABLE product_category (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT COMMENT '租户ID，0表示全局共享',
    category_name VARCHAR(64),
    parent_id BIGINT
);

-- 插入共享数据
INSERT INTO product_category VALUES (1, 0, '电子产品', NULL);
INSERT INTO product_category VALUES (2, 0, '服装', NULL);

-- 插入租户自定义数据
INSERT INTO product_category VALUES (101, 1001, '手机配件', 1);
INSERT INTO product_category VALUES (102, 1001, '男装', 2);
```

**查询逻辑**：
```java
// 查询时合并共享数据和租户私有数据
List<Category> categories = mapper.selectList(
    new LambdaQueryWrapper<Category>()
        .and(wrapper -> wrapper
            .eq(Category::getTenantId, 0)  // 共享数据
            .or()
            .eq(Category::getTenantId, currentTenantId)  // 私有数据
        )
);
```

---

#### 方案三：混合模式（推荐）
**核心思想**：共享数据放在公共表，租户可以基于共享数据做"个性化扩展"。

```sql
-- 基础商品分类（共享）
CREATE TABLE base_category (
    id BIGINT PRIMARY KEY,
    category_name VARCHAR(64),
    level INT COMMENT '分类层级'
);

-- 租户自定义分类扩展
CREATE TABLE tenant_category_extension (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    base_category_id BIGINT COMMENT '关联的基础分类ID',
    custom_name VARCHAR(64) COMMENT '租户自定义名称',
    sort_order INT,
    is_enabled TINYINT DEFAULT 1
);
```

**业务逻辑**：
1. 租户 A 看到的基础分类是"电子产品"。
2. 租户 A 可以在后台把"电子产品"重命名为"数码家电"（只改自己的扩展表）。
3. 其他租户不受影响，依然显示"电子产品"。

---

### ❓ 面试官：如果采用"字段级隔离"方案，随着业务发展，单表数据量达到几亿条，如何优化？
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
分库分表 + 热点数据缓存 + 历史数据归档。

**📝 优化策略组合拳：**

1. **垂直拆分**：把大字段（如商品详情 HTML）拆到扩展表，主表只保留核心字段。

2. **水平分表（Sharding）**：
   - **按租户 ID 哈希分表**：`orders_{tenant_id % 16}`，保证同一个租户的数据在同一张表。
   - **按时间范围分表**：`orders_202401`、`orders_202402`，适合有时间维度的查询。

3. **冷热数据分离**：
   - 最近 3 个月的订单放主表（热数据）。
   - 3 个月前的订单迁移到历史表或归档到 HBase/OSS（冷数据）。

4. **读写分离 + 缓存**：
   - 高频查询走 Redis 缓存。
   - 读请求打到从库，写请求走主库。

5. **搜索引擎辅助查询**：
   - 复杂的多条件筛选（如"某租户、某时间段、金额大于 1000 的订单"）同步到 Elasticsearch。

---

### ❓ 面试官：多租户系统中，如何实现"租户级别的功能开关"？比如 VIP 租户才能使用导出 Excel 功能。
*频率：🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
采用**"租户套餐表 + 功能权限矩阵"**的设计，在网关或拦截器层做功能鉴权。

**📝 实现方案：**

```sql
-- 租户套餐表
CREATE TABLE tenant_package (
    id BIGINT PRIMARY KEY,
    package_name VARCHAR(64) COMMENT '套餐名称：免费版/专业版/企业版',
    price DECIMAL(10,2),
    max_users INT COMMENT '最大用户数',
    max_storage_gb INT COMMENT '最大存储空间'
);

-- 功能权限配置表
CREATE TABLE package_feature (
    id BIGINT PRIMARY KEY,
    package_id BIGINT,
    feature_code VARCHAR(64) COMMENT '功能编码：export_excel、api_access',
    is_enabled TINYINT DEFAULT 1
);

-- 租户信息表
CREATE TABLE tenant_info (
    id BIGINT PRIMARY KEY,
    tenant_name VARCHAR(128),
    package_id BIGINT,
    expire_date DATE COMMENT '套餐到期时间'
);
```

**后端拦截器实现**：
```java
@Component
public class FeaturePermissionInterceptor implements HandlerInterceptor {
    
    @Autowired
    private TenantFeatureService featureService;
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                            HttpServletResponse response, 
                            Object handler) throws Exception {
        
        // 获取当前租户ID
        Long tenantId = TenantContextHolder.getTenantId();
        
        // 获取当前请求的功能点（从注解或 URL 解析）
        String featureCode = extractFeatureCode(request);
        
        // 检查该租户是否有此功能权限
        if (!featureService.hasFeature(tenantId, featureCode)) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.getWriter().write("您的套餐不支持此功能，请升级到专业版");
            return false;
        }
        
        return true;
    }
}

// 使用注解标记需要权限的功能
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireFeature {
    String value(); // 功能编码
}
```

**前端配合**：
根据租户套餐信息，动态隐藏或禁用不支持的功能按钮，提升用户体验。
