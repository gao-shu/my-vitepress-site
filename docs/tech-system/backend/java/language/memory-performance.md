# 内存与性能直觉

## 我怎么看

- 默认内存占用高于 Go / 部分 Node，换机器通常比硬抠微优化划算  
- 真正拖垮系统的往往是：**慢 SQL、一次加载过大结果集、无界缓存、无超时的远程调用**  
- JVM 调优排在「把业务与 SQL 做对」之后  

## 判断

中小项目里，性能问题 **先量链路与 SQL**，再谈 GC 参数。

相关：[JVM](./jvm.md) · [后端问题 · 性能](/tech-system/backend/problems/performance) · [后端问题 · 数据库](/tech-system/backend/problems/database)  
