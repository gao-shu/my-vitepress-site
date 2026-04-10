# Java 学习指南

一个基于 VitePress 构建的 Java 后端学习知识分享网站。

## 🎯 项目愿景

### 核心目的

1. **巩固学习，加深理解**  
   通过整理和输出知识，帮助自己系统地梳理 Java 后端技术体系，在教中学、在学中教，真正理解技术原理而非死记硬背。

2. **降低门槛，普惠入门**  
   致力于让更多初学者能够轻松入门 Java 后端开发，提供清晰易懂的学习路径和实战案例，让技术学习不再困难。

3. **服务中小企业，创造实际价值**  
   关注中小企业在实际开发中的痛点和需求，提供接地气、可落地的技术方案和最佳实践，帮助中小企业提升开发效率、降低技术成本。

> 💡 **我们的理念**：学习是为了成长，而不是为了高薪。希望每一位学习者都能享受技术带来的乐趣，建立扎实的技术基础，并能将所学应用到实际工作中，为企业创造价值。

## 项目简介

本项目是一个开源的 Java 后端学习知识库，涵盖 Java 基础、数据库、框架等核心知识点。内容注重原理讲解和实战应用，适合：

- 🌱 **初学者**：系统学习 Java 后端开发基础
- 📚 **在校学生**：补充课堂知识，了解企业实际应用
- 🔄 **转行开发者**：快速了解 Java 技术栈
- ✍️ **知识整理者**：参考内容组织方式，构建自己的知识体系

## 技术栈

- **VitePress**：Vue 驱动的静态网站生成器
- **Vue 3**：渐进式 JavaScript 框架
- **Vite**：下一代前端构建工具

## 项目结构

```
E:\vitepress\
├── docs/
│   ├── .vitepress/          # VitePress 配置文件
│   │   └── config.mts       # 站点配置
│   ├── java/                # Java 基础部分
│   │   ├── base-overview.md
│   │   ├── oop.md
│   │   ├── collections.md
│   │   ├── concurrency.md
│   │   ├── jvm.md
│   │   └── java8-features.md
│   ├── database/            # 数据库部分
│   │   ├── overview.md
│   │   ├── mysql-basics.md
│   │   ├── mysql-index.md
│   │   ├── mysql-transaction-lock.md
│   │   ├── sql-optimization.md
│   │   └── redis.md
│   ├── springboot/          # SpringBoot 部分
│   │   ├── overview.md
│   │   ├── auto-configuration.md
│   │   ├── annotations.md
│   │   ├── restful-api.md
│   │   ├── data-access.md
│   │   └── security.md
│   └── index.md             # 首页
├── package.json
└── README.md
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

启动后访问：http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 本地预览生产构建

```bash
npm run preview
```

## 内容规划

### ✅ 已完成

**Java 基础模块**（7/7 篇文章）✅
- [x] Java 基础概述 - 数据类型、面向对象、面试题
- [x] 面向对象编程 - 封装、继承、多态、抽象类、接口
- [x] 集合框架 - HashMap、ConcurrentHashMap、ArrayList 等详细解析
- [x] 多线程与并发 - JMM、volatile、synchronized、AQS、线程池、ThreadLocal
- [x] JVM 内存模型 - 内存结构、GC 算法、回收器、类加载、调优实战
- [x] Java 8 新特性 - Lambda、Stream、Optional、函数式接口、新日期 API
- [x] 场景实战：并发问题调优 - CPU100%、死锁、内存泄漏、线程池耗尽

**数据库模块**（6/6 篇文章）✅
- [x] 数据库基础 - SQL、事务、索引、范式
- [x] MySQL 基础 - 数据类型、SQL 语句、存储引擎
- [x] MySQL 索引 - B+ 树、索引类型、优化策略
- [x] MySQL 事务与锁 - ACID、MVCC、锁机制、死锁
- [x] SQL 优化 - EXPLAIN、索引优化、分页优化
- [x] 场景实战：慢查询优化 - EXPLAIN、索引优化、深分页

**Redis 模块**（8/8 篇文章）✅
- [x] Redis 基础 - 简介、安装、命令、性能优化
- [x] 数据类型与使用场景 - String、List、Hash、Set、ZSet、Bitmap、HyperLogLog
- [x] 持久化机制 - RDB、AOF、混合持久化、故障恢复
- [x] 事务与发布订阅 - WATCH、乐观锁、Pub/Sub、消息队列
- [x] 缓存常见问题 - 穿透、击穿、雪崩、一致性解决方案
- [x] 分布式锁 - Redis 实现、Redisson、看门狗机制
- [x] 集群与高可用 - 主从复制、哨兵模式、Redis Cluster
- [x] 场景实战：缓存设计 - 多级缓存、命中率优化、预热方案

**框架模块**（0/8 篇文章）⏳
- [ ] Spring 核心 - IoC、AOP、事务、Bean 生命周期
- [ ] SpringBoot 原理 - 自动配置、配置文件、启动流程
- [ ] SpringCloud 微服务 - 注册中心、配置中心、网关、熔断
- [ ] MyBatis/MyBatis-Plus - 配置、使用、优化
- [ ] Spring 常见问题 - Bean、AOP、事务、循环依赖
- [ ] SpringBoot 常见问题 - 启动、配置、Web 开发、部署
- [ ] 微服务常见问题 - 服务治理、分布式事务、链路追踪
- [ ] 场景实战：事务失效分析 - 8 种失效场景及解决方案

## 内容编写规范

### Markdown 格式

```markdown
# 一级标题

## 二级标题

### 三级标题

**粗体文本**

*斜体文本*

- 无序列表项 1
- 无序列表项 2

1. 有序列表项 1
2. 有序列表项 2

[链接文本](链接地址)

![图片描述](图片路径)

```java
// 代码块
public class Example {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```

### 文章结构建议

1. **简介**：简要介绍本节主题和学习目标
2. **核心概念**：详细讲解知识点，注重原理理解
3. **代码示例**：提供清晰、可运行的代码示例
4. **常见问题**：总结学习过程中容易遇到的困惑和解决方案
5. **实战练习**：提供动手实践的建议或小项目
6. **学习建议**：给出深入学习的方向或最佳实践
7. **下一步**：引导读者学习下一节内容

## 贡献指南

欢迎提交 Issue 和 Pull Request 来完善本站内容！

## 资源分类

### 学习教程

### 工具推荐

### 书籍推荐

### 视频资源

### 官方文档

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎通过 Issue 反馈。
