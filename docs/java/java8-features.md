# Java 8 及以后新特性核心

## 本模块面试重点

- **Java 8 必会特性**：Lambda、Stream API、`Optional`、`java.time` 新日期时间，是简历写 “熟悉 Java 8” 时必须讲得清楚的四大块。
- **Stream 常见坑**：并行流 `parallelStream` 的误用、延迟执行导致代码不生效、在流中修改外部变量等高频追问点。
- **新版本常问亮点**：了解 JDK 11 / 17 作为 LTS 的定位，以及对业务开发者有感知的几个语法糖（`var`、文本块、增强 `switch`、`record`），足够应对“你们为什么升级到 17？”这一类问题。

---

### ❓ 面试官：你们项目里用的是哪个版本的 JDK？Java 8 有哪些常用的新特性？
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
我们项目主要使用的是 JDK 8（或 11/17）。Java 8 是划时代的一个大版本，最核心也是我们在业务里天天用的新特性是：**Lambda 表达式、Stream API、Optional 防空指针、以及新的日期时间 API（LocalDate）**。

**📝 核心新特性详解与实战：**

1. **Lambda 表达式与函数式接口**：
   - **痛点**：以前写一个简单的线程或者集合排序，要写一大堆匿名内部类的臃肿代码。
   - **解决**：Lambda 本质上是一个语法糖，允许把“函数”作为一个参数传递。只要接口里只有一个抽象方法（`@FunctionalInterface`），就可以用 `(参数) -> {逻辑}` 的极简写法。
   ```java
   // 老写法
   Collections.sort(list, new Comparator< Integer >() {
       @Override
       public int compare(Integer o1, Integer o2) {
           return o1 - o2;
       }
   });
   // Lambda 写法
   list.sort((o1, o2) -> o1 - o2);
   ```

2. **Stream API（极其重要）**：
   - **痛点**：以前对集合进行过滤、映射、分组、统计，需要写很多层 `for` 循环和 `if` 判断，代码可读性极差。
   - **解决**：Stream 提供了像 SQL 语句一样声明式的集合操作。常用的有 `filter()` 过滤、`map()` 转换字段、`collect(Collectors.toList())` 收集结果、`Collectors.groupingBy()` 分组。

3. **Optional 类（防 NPE 神器）**：
   - **痛点**：臭名昭著的 `NullPointerException`，导致以前代码里到处都是 `if (user != null && user.getAddress() != null)`。
   - **解决**：`Optional` 是一个容器类。通过 `Optional.ofNullable()` 包装对象，配合 `.map().orElse()` 优雅地实现级联判空和赋默认值。

4. **新的日期时间 API（java.time 包）**：
   - **痛点**：老版的 `Date` 和 `SimpleDateFormat` 是**线程不安全**的，且 API 设计极其反人类（比如月份是从 0 开始的）。
   - **解决**：引入了不可变且线程安全的 `LocalDate`、`LocalTime`、`LocalDateTime`，以及非常方便的 `DateTimeFormatter`。

---

### ❓ 面试官：在使用 Stream 流的时候，有哪些常见的坑或者性能问题？【中级】
*频率：🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
最大的坑是**在遍历海量数据时滥用 `.parallelStream()` 导致线程池被占满**，以及**在 Stream 中修改外部变量（引发并发安全或编译报错）**。

**📝 详细踩坑分析：**

1. **并行流（ParallelStream）的坑**：
   - 很多人觉得 `stream()` 慢，就喜欢用 `parallelStream()`。
   - **真相**：`parallelStream` 底层用的是 JVM 全局共享的 `ForkJoinPool.commonPool`。如果你的流操作里有**耗时的网络 I/O 或数据库查询**，这会导致全局线程池被瞬间占满，拖垮整个系统的其他业务请求！
   - **建议**：只在纯 CPU 密集型的大量计算，且数据量足够大（上万条）时才使用并行流。普通 CRUD 的 List 转换，老老实实用串行 `stream()` 足矣。

2. **Stream 的延迟执行特性（Lazy Evaluation）**：
   - Stream 的中间操作（如 `filter`, `map`）都是**延迟执行**的。如果你写了一串中间操作，但是没有写最终的**终端操作（如 `collect`, `forEach`, `count`）**，那么这串代码**根本不会被执行！**

3. **修改外部变量的限制**：
   - 在 Lambda 或 Stream 内部引用的外部局部变量，必须是 `final` 或事实上的 `final`。
   - 原因：Java 在底层会把 Lambda 里用到的外部变量**拷贝**一份进去（值传递）。如果不限制修改，会导致外部的变量和拷贝进来的变量值不一致，引发极其难调的 Bug。如果非要修改，可以用线程安全的 `AtomicInteger` 包装一下。

---

### ❓ 面试官：除了 JDK 8，你了解 JDK 11 / 17 有哪些「常见」新特性吗？为什么很多公司在推 JDK 17？【中级】
*频率：🔥🔥（新项目/新公司面试越来越爱问）*

**💡 一句话总结（先抛结论）：**
面试时只要记住两点就够了：**（1）JDK 17 是最新 LTS 版本，Spring Boot 3 要求至少 17；（2）比起 8，主要多了一些语法糖，写业务代码更省事**。

**📝 核心升级亮点（吹牛必备）：**

1. **LTS 版本与生态**（面向面试官的“背景位”）：
   - JDK 8 / 11 / 17 都是 **LTS 版本**，其中 **17 是当前主流的长期支持版**。
   - 很多新版本框架（尤其是 **Spring Boot 3.x**）最低要求就是 JDK 17，这也是很多公司升级的主要原因。

2. **对业务开发者有感知的语法糖**（记住 2～3 个即可）：
   - **`var` 局部变量推断（JDK 10）**：简化局部变量声明，`var map = new HashMap<>()`，对阅读影响不大，但能少写很多泛型。
   - **文本块（Text Blocks, JDK 15）**：用三个双引号 `"""` 包裹多行字符串。写 SQL/JSON 时不再满屏 `\n` 和 `+`，复制粘贴即可。
   - **Switch 表达式增强（JDK 14）**：`switch` 支持 `->` 写法、返回值，减少 `break` 漏写 Bug。
   - **Record 记录类（JDK 16）**：一个 `record User(String name, int age) {}` 就能生成不可变 DTO/VO，非常适合做简单入参/出参。

**🌟 面试加分项（架构视野，简单一句话）：**
“目前我们公司的新项目会优先选择 JDK 17，一方面是因为它是 LTS 版本，另一方面是像 Spring Boot 3.x 这类主流框架已经要求 17 起步。如果一直停留在 8，以后在引入新框架和组件时会背负较重的技术债。”