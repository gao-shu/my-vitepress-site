# 后端技术体系

这里沉淀的是：**我对语言、框架和真实工程问题的判断**，不是「从零教一门语言」。

别人看完应感觉到：这是干过业务之后的理解，不是教程搬运。

---

## 两个维度

| 维度 | 回答的问题 |
|------|------------|
| **语言 / 框架** | 我怎么看它？适合什么？我实际怎么选？ |
| **后端问题** | 并发、库、缓存、MQ……出了问题我怎么理解和处理？ |

各语言目录结构统一，但**篇数不必一样多**：Java/Spring 可以厚，Go / C# 可以薄——深度本身就是能力证明。

---

## 目录

### 语言与框架

- **Java**
  - [分组总览](./java/)
  - 语言：[定位](./java/language/positioning.md) · [JVM](./java/language/jvm.md) · [并发](./java/language/concurrency.md) · [内存与性能](./java/language/memory-performance.md) · [适合边界](./java/language/fit.md) · [为何仍选](./java/language/why-java.md)
  - Spring：[解决什么](./java/spring/what-it-solves.md) · [IoC/DI](./java/spring/ioc-di.md) · [Boot](./java/spring/boot.md) · [MVC](./java/spring/mvc.md) · [事务](./java/spring/transaction.md) · [Cloud](./java/spring/cloud.md) · [我的选择](./java/spring/my-choices.md)
- **Python**
  - [Python 语言总结](./python/language.md)
  - [Python 框架总结](./python/frameworks.md)
- **Node(TS)**
  - [语言与运行时总结](./nodejs/language.md)
  - [框架总结](./nodejs/frameworks.md)
- **Go**
  - [Go 语言总结](./go/language.md)
  - [Go 框架总结](./go/frameworks.md)
- **C#**
  - [C# 语言总结](./csharp/language.md)
  - [C# / .NET 框架总结](./csharp/frameworks.md)

### 后端问题（跨语言）

- [后端问题总览](./problems/)
- [并发](./problems/concurrency.md) · [数据库](./problems/database.md) · [Redis](./problems/redis.md) · [MQ](./problems/mq.md)
- [分布式](./problems/distributed.md) · [网络](./problems/network.md) · [性能](./problems/performance.md) · [安全](./problems/security.md)

---

## 写作原则

1. 写判断与取舍，少贴语法大全  
2. 能挂真实项目经验就挂（MES、CRM、AI 编排等）  
3. 面试体细题放在 [就业指南](/guide/)，这里偏「我怎么看」  
4. 空目录不硬填；够讲 5 分钟再公开发  
