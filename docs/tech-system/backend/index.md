# 后端技术体系

这里沉淀的是：**我对语言与真实工程问题的判断**，不是「从零教一门语言」。

别人看完应感觉到：这是干过业务之后的理解，不是教程搬运。

---

## 每种语言同一套五篇

和菜鸟教程一类站点的共同点：门类统一，方便对照切换。

| 分类 | 解决的问题 |
|------|------------|
| **01 语言基础** | 语法、类型、集合、函数 |
| **02 核心能力** | 语言真正不同的地方 |
| **03 框架与生态** | 用什么框架干活 |
| **04 工程实践** | 项目怎么开发、测试、部署 |
| **05 常见问题** | 遇到问题快速查 |

一门语言 **只占一组**（例如 Java 含 Spring，不再拆成「语言 / Spring」两个顶栏分组）。

---

## 目录

### 语言（五篇 × N）

- **[Java](./java/)**（主栈）· [01](./java/01-basics.md) · [02](./java/02-core.md) · [03](./java/03-frameworks.md) · [04](./java/04-engineering.md) · [05](./java/05-faq.md)
- **[Python](./python/)** · [01](./python/01-basics.md) · [02](./python/02-core.md) · [03](./python/03-frameworks.md) · [04](./python/04-engineering.md) · [05](./python/05-faq.md)
- **[TypeScript](./nodejs/)**（路径 `nodejs/`）· [01](./nodejs/01-basics.md) · [02](./nodejs/02-core.md) · [03](./nodejs/03-frameworks.md) · [04](./nodejs/04-engineering.md) · [05](./nodejs/05-faq.md)
- **[Go](./go/)** · [01](./go/01-basics.md) · [02](./go/02-core.md) · [03](./go/03-frameworks.md) · [04](./go/04-engineering.md) · [05](./go/05-faq.md)
- **[C#](./csharp/)** · [01](./csharp/01-basics.md) · [02](./csharp/02-core.md) · [03](./csharp/03-frameworks.md) · [04](./csharp/04-engineering.md) · [05](./csharp/05-faq.md)

### 后端问题（跨语言）

- [后端问题总览](./problems/)
- [并发](./problems/concurrency.md) · [数据库](./problems/database.md) · [Redis](./problems/redis.md) · [MQ](./problems/mq.md)
- [分布式](./problems/distributed.md) · [网络](./problems/network.md) · [性能](./problems/performance.md) · [安全](./problems/security.md)

---

## 写作原则

1. 写判断与取舍，少贴语法大全  
2. 能挂真实项目经验就挂（MES、CRM、AI 编排等）  
3. 面试体细题放在 [就业指南](/guide/)，这里偏「我怎么看」  
4. 五篇骨架统一；单篇厚度按主栈深、补位薄  
