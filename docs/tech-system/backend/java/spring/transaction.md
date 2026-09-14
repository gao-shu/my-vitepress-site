# 事务

这是业务系统里 **最值钱的一块理解**。

## 必须能讲清的点

- `@Transactional` 靠代理；同类自调用会失效  
- 异常被吃掉、非 public，都会让人误以为「加了注解就安全」  
- 传播行为常用 `REQUIRED` / `REQUIRES_NEW`，先精通再扩展  

## 判断

能讲清失效场景，比背全部分传播枚举更有用。  
真实项目里：事务保证「该在一个库事务里的事」；跨服务靠状态机 / 补偿，不迷信分布式事务框架。

相关：[后端问题 · 数据库](/tech-system/backend/problems/database) · [后端问题 · 分布式](/tech-system/backend/problems/distributed)  
