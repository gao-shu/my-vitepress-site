# C# · 01 语言基础

> 侧翼技能：补 Windows / .NET 与本地中小、工控旁路；**不替代 Java 主栈**。

## 1. 定位

- 与 Java 同属 **强类型 OO 企业语言**，有 Java 底子迁移成本低  
- 绑在 **.NET** 上：Web、桌面、部分工控上位机一条链  
- 语法比老 Java 更「现代」一点（async、LINQ、属性），本质仍是工程交付  
- Windows 生态存量多，洛阳制造向信息化更容易撞上  

一句话：C# 卖的是 **.NET 与 Windows 场景覆盖**，不是换主粮。

---

## 2. 语法与类型（从 Java 迁移视角）

| Java 直觉 | C# 对应 |
|-----------|---------|
| class / interface | 基本一致；属性（Property）更常见 |
| generics | 有；约束语法不同但概念同 |
| null | 可空引用类型（NRT）建议打开 |
| stream | LINQ（`Where`/`Select`） |
| CompletableFuture | async/await Task |
| package | namespace + 项目引用 |

### 该熟练的

- 属性、自动属性、`record`（DTO）  
- `async`/`await` 与 `Task`（别同步阻塞 `.Result` 死锁）  
- 异常与 `using` / `await using` 释放资源  
- 可空注解：`string?` 与警告当回事  

### 集合

- `List<T>` / `Dictionary<TKey,TValue>` / `HashSet<T>`  
- LINQ 短查询好用；热点路径注意多次枚举与分配  

下一篇：[02 核心能力](./02-core.md)
