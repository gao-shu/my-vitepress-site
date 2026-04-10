# MyBatis 与 MyBatis-Plus 核心连环问

---

### ❓ 面试官：MyBatis 中 `#` 和 `$` 的区别是什么？能混用吗？
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
- `#{}` 是**预编译处理**（PreparedStatement），参数会被当作一个安全的字符串带引号替换进去，能**绝对防止 SQL 注入**。
- `${}` 是**单纯的字符串拼接**（Statement），原样把参数拼接到 SQL 语句中，**存在严重的 SQL 注入风险**。
- 日常开发中 `99%` 的情况必须用 `#{}`。

**📝 详细原理解析与例外场景：**
1. **防注入原理（为什么 `#` 安全？）**
   当使用 `#{name}` 时，MyBatis 会把它解析成 `?` 占位符：
   `SELECT * FROM user WHERE name = ?`
   即使你传入的值是 `admin' OR '1'='1`，底层 JDBC 会把它当成一个普通字符串常量处理：
   `SELECT * FROM user WHERE name = 'admin'' OR ''1''=''1'`（数据库查不到结果，安全）。
   如果用 `${}`，SQL 变成了 `SELECT * FROM user WHERE name = 'admin' OR '1'='1'`，导致表全被查出来（危险）。
2. **什么时候必须用 `${}`？（核心考点）**
   因为 `#{}` 会自动加引号，所以在**动态传入表名、列名、排序字段**时，只能用 `${}`。
   - **错误示例**：`ORDER BY #{column}` -> 变成了 `ORDER BY 'create_time'`（语法错误或失效）。
   - **正确做法**：`ORDER BY ${column}`。但为了防注入，必须在 Java 代码里对 `column` 变量做**白名单校验**（只允许它等于有限的几个英文字段名）。

---

### ❓ 面试官：MyBatis 的一缓和二缓是什么？为什么在分布式项目中大家都会把它们关掉？【中高级】
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
- **一级缓存（本地缓存）**：作用域是同一个 `SqlSession`，默认**开启**。
- **二级缓存（全局缓存）**：作用域是同一个 `Mapper`（Namespace），默认**关闭**。
- **致命坑点**：它们都是基于**单机 JVM 内存**的缓存。在分布式（多台服务器）环境下，会导致极度严重的**脏读问题**，因此企业级开发中通常会禁用 MyBatis 缓存，统一交给 Redis 等专业缓存中间件来做。

**📝 详细踩坑分析（为什么不用？）：**
假设我们部署了 A 和 B 两台订单服务。
1. **一缓脏读**：一级缓存只在一个 Session 内有效，其实很少引发大问题，但如果我们结合了 Spring 的 `@Transactional`，整个事务期间共用一个 Session。如果此时另一个线程改了数据库，当前事务内再次查询拿到的还是本地一缓的旧数据（破坏了数据库的隔离级别期望）。通常可以在全局配置里加 `localCacheScope=STATEMENT` 来关闭一缓。
2. **二缓灾难**：
   - 请求 1 打到 A 服务器，A 查了一次订单表，把数据放入 A 的二级缓存里。
   - 请求 2 打到 B 服务器，B 执行了 `UPDATE` 更新了订单表（B 自己清空了自己的缓存，但它无法通知 A）。
   - 请求 3 又打到 A 服务器，A 会直接从自己的二级缓存里返回**旧数据**！
   - 所以，MyBatis 的缓存机制太弱（不支持跨 JVM 的缓存失效通知），直接弃用。

---

### ❓ 面试官：你们项目为什么用 MyBatis-Plus？它底层是怎么实现那些 CRUD 接口的？
*频率：🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
MyBatis-Plus（MP）是 MyBatis 的最强增强工具。我们用它主要是为了**消灭那些枯燥的单表 CRUD XML 配置**。它底层利用了**自定义的 SQL 注入器（ISqlInjector）**，在项目启动时通过反射读取实体类，自动在内存中拼接并注入这些基础的 SQL 语句，避免了我们手动去写 Mapper。

**📝 核心亮点（面试怎么吹？）：**
1. **开发效率起飞**：Mapper 接口继承 `BaseMapper`，Service 继承 `IService`，瞬间拥有了几十个常用的增删改查和分页方法，一行 XML 都不用写。
2. **强大的 Wrapper 构造器**：
   以前写多条件动态查询：
   ```xml
   <where>
     <if test="name != null"> AND name = #{name} </if>
   </where>
   ```
   现在用 MP 的 `LambdaQueryWrapper`（极其优雅且防防手误拼错字段）：
   ```java
   LambdaQueryWrapper< User > query = new LambdaQueryWrapper<>();
   query.eq(StringUtils.isNotBlank(name), User::getName, name);
   userMapper.selectList(query);
   ```
3. **自带极好用的插件**：
   - **分页插件（PaginationInnerInterceptor）**：物理分页，底层根据不同的数据库方言（MySQL 用 limit，Oracle 用 rownum）自动拼接。
   - **乐观锁插件（OptimisticLockerInnerInterceptor）**：只需给实体的 `version` 字段打上 `@Version` 注解，执行 update 时自动帮你带上版本号条件，解决并发更新丢失的问题。
   - **自动填充插件**：配合 `@TableField(fill = FieldFill.INSERT)`，在插入或修改时，自动帮你把 `create_time` 和 `update_time` 赋上系统时间，再也不用手动 set 了。