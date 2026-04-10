# Java/Spring 开源项目

本页面精选了优秀的Java/Spring开源项目，包括Spring Boot应用、微服务框架、工具库等。

## Spring Boot 应用框架

### 企业级应用
- **mall**：完整的电商系统，包括前后台管理系统
  - GitHub: [https://github.com/macrozheng/mall](https://github.com/macrozheng/mall)
  - 技术栈: Spring Boot + MyBatis + Redis + Elasticsearch
  - 功能: 商品管理、订单处理、用户管理、支付集成

- **mall-swarm**：微服务版本的电商系统
  - GitHub: [https://github.com/macrozheng/mall-swarm](https://github.com/macrozheng/mall-swarm)
  - 技术栈: Spring Cloud + Nacos + Gateway + Docker
  - 功能: 分布式电商系统，支持高并发

- **eladmin**：基于Spring Boot的后台管理系统
  - GitHub: [https://github.com/elunez/eladmin](https://github.com/elunez/eladmin)
  - 技术栈: Spring Boot + Vue.js + MySQL + Redis
  - 功能: 用户管理、权限控制、系统监控

### 权限认证框架
- **Sa-Token**：轻量级Java权限认证框架
  - GitHub: [https://github.com/dromara/Sa-Token](https://github.com/dromara/Sa-Token)
  - 功能: 登录认证、权限验证、会话管理
  - 特点: 简单易用，支持分布式

- **Spring Security**：官方安全框架
  - GitHub: [https://github.com/spring-projects/spring-security](https://github.com/spring-projects/spring-security)
  - 功能: 身份认证、授权、防护攻击

### 工具库
- **Hutool**：Java工具类库
  - GitHub: [https://github.com/dromara/hutool](https://github.com/dromara/hutool)
  - 功能: 日期处理、HTTP客户端、加密解密等

- **Apache Commons**：Apache通用工具库
  - GitHub: [https://github.com/apache/commons-lang](https://github.com/apache/commons-lang)
  - 功能: 字符串处理、集合操作、IO工具

## 微服务框架

### Spring Cloud 生态
- **Spring Cloud Alibaba**：阿里微服务解决方案
  - GitHub: [https://github.com/alibaba/spring-cloud-alibaba](https://github.com/alibaba/spring-cloud-alibaba)
  - 组件: Nacos、Sentinel、Seata等

- **Spring Cloud Netflix**：Netflix微服务组件
  - GitHub: [https://github.com/spring-cloud/spring-cloud-netflix](https://github.com/spring-cloud/spring-cloud-netflix)
  - 组件: Eureka、Ribbon、Hystrix等

### 服务治理
- **Nacos**：服务发现和配置管理
  - GitHub: [https://github.com/alibaba/nacos](https://github.com/alibaba/nacos)
  - 功能: 服务注册发现、配置中心、DNS服务

- **Sentinel**：流量控制和熔断降级
  - GitHub: [https://github.com/alibaba/Sentinel](https://github.com/alibaba/Sentinel)
  - 功能: 限流、熔断、系统负载保护

## 数据访问层

### ORM框架
- **MyBatis**：优秀的持久层框架
  - GitHub: [https://github.com/mybatis/mybatis-3](https://github.com/mybatis/mybatis-3)
  - 特点: SQL映射、动态SQL、插件机制

- **MyBatis-Plus**：MyBatis增强工具
  - GitHub: [https://github.com/baomidou/mybatis-plus](https://github.com/baomidou/mybatis-plus)
  - 功能: 代码生成器、通用CRUD、分页插件

- **Hibernate**：全功能ORM框架
  - GitHub: [https://github.com/hibernate/hibernate-orm](https://github.com/hibernate/hibernate-orm)
  - 特点: JPA实现、对象关系映射

## 测试框架

- **JUnit 5**：Java单元测试框架
  - GitHub: [https://github.com/junit-team/junit5](https://github.com/junit-team/junit5)
  - 功能: 单元测试、集成测试

- **TestNG**：下一代测试框架
  - GitHub: [https://github.com/testng-team/testng](https://github.com/testng-team/testng)
  - 功能: 并行测试、数据驱动测试

## 构建工具

- **Maven**：项目管理和构建工具
  - GitHub: [https://github.com/apache/maven](https://github.com/apache/maven)
  - 功能: 依赖管理、项目构建

- **Gradle**：现代构建工具
  - GitHub: [https://github.com/gradle/gradle](https://github.com/gradle/gradle)
  - 特点: Groovy/Kotlin DSL、增量构建