# SpringBoot 概述

## 什么是 SpringBoot？

**SpringBoot** 是由 Pivotal 团队提供的全新框架，其设计目的是用来简化新 Spring 应用的初始搭建以及开发过程。

**核心理念**：约定优于配置（Convention over Configuration）

## 为什么需要 SpringBoot？

### 传统 Spring 的痛点

1. **配置繁琐**：需要大量的 XML 配置或 Java 配置
2. **依赖管理复杂**：需要手动管理各种依赖的版本
3. **部署复杂**：需要配置外部 Web 服务器（如 Tomcat）
4. **开发效率低**：大量时间花在配置上，而不是业务逻辑

### SpringBoot 的优势

1. **自动配置**：根据类路径中的依赖自动配置 Spring
2. **起步依赖**：提供一系列 starters 简化依赖管理
3. **内嵌服务器**：内嵌 Tomcat、Jetty 等，无需部署 WAR 文件
4. **生产就绪**：提供监控、指标、健康检查等功能
5. **无代码生成**：不需要 XML 配置

## 快速开始

### 1. 创建项目

#### 方式一：使用 Spring Initializr（推荐）

访问 [https://start.spring.io/](https://start.spring.io/) 生成项目

#### 方式二：手动创建 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>
    
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Web 起步依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- 测试起步依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 2. 创建主类

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

### 3. 创建 Controller

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello, SpringBoot!";
    }
}
```

### 4. 运行应用

直接运行 `DemoApplication` 的 main 方法，然后访问：
```
http://localhost:8080/hello
```

## 核心特性

### 1. 起步依赖（Starters）

SpringBoot 提供了一系列的 starters，简化依赖管理。

**常用 Starters**：

| Starter | 依赖 | 用途 |
|---------|------|------|
| spring-boot-starter-web | Spring MVC + Tomcat | Web 开发 |
| spring-boot-starter-data-jpa | Spring Data JPA + Hibernate | 数据访问 |
| spring-boot-starter-data-redis | Spring Data Redis | Redis |
| spring-boot-starter-security | Spring Security | 安全认证 |
| spring-boot-starter-test | JUnit + Mockito | 测试 |
| spring-boot-starter-validation | Hibernate Validator | 参数校验 |
| spring-boot-starter-aop | Spring AOP | 面向切面编程 |
| mybatis-spring-boot-starter | MyBatis | MyBatis 集成 |

### 2. 自动配置（Auto Configuration）

SpringBoot 会根据类路径中的依赖自动配置 Spring。

**示例**：
- 类路径有 `mysql-connector-java` → 自动配置数据源
- 类路径有 `spring-boot-starter-web` → 自动配置 Tomcat 和 Spring MVC
- 类路径有 `spring-boot-starter-data-redis` → 自动配置 RedisTemplate

### 3. 配置文件

#### application.properties

```properties
# 服务器端口
server.port=8080

# 数据源配置
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA 配置
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

#### application.yml

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

#### 多环境配置

```
application.yml          # 默认配置
application-dev.yml      # 开发环境
application-test.yml     # 测试环境
application-prod.yml     # 生产环境
```

激活指定环境：
```properties
# application.yml
spring:
  profiles:
    active: dev
```

### 4. 读取配置

#### @Value 注解

```java
@RestController
public class ConfigController {
    
    @Value("${server.port}")
    private String port;
    
    @Value("${custom.message:默认消息}")
    private String message;
    
    @GetMapping("/config")
    public String getConfig() {
        return "Port: " + port + ", Message: " + message;
    }
}
```

#### @ConfigurationProperties

```java
@Component
@ConfigurationProperties(prefix = "myapp")
public class MyAppProperties {
    
    private String name;
    private String version;
    private List<String> features;
    
    // getter 和 setter
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }
}
```

```yaml
# application.yml
myapp:
  name: 我的应用
  version: 1.0.0
  features:
    - 功能 1
    - 功能 2
```

### 5. 日志配置

SpringBoot 默认使用 Logback 作为日志框架。

```properties
# 日志级别
logging.level.root=INFO
logging.level.com.example.demo=DEBUG

# 日志文件
logging.file.name=logs/app.log
logging.file.max-size=10MB

# 日志格式
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
```

## 项目结构

```
demo/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/demo/
│   │   │       ├── DemoApplication.java      # 启动类
│   │   │       ├── controller/                # 控制器
│   │   │       ├── service/                   # 服务层
│   │   │       ├── repository/                # 数据访问层
│   │   │       ├── entity/                    # 实体类
│   │   │       ├── dto/                       # 数据传输对象
│   │   │       ├── config/                    # 配置类
│   │   │       └── exception/                 # 异常处理
│   │   └── resources/
│   │       ├── application.yml               # 配置文件
│   │       ├── static/                       # 静态资源
│   │       ├── templates/                    # 模板文件
│   │       └── mapper/                       # MyBatis Mapper
│   └── test/                                 # 测试代码
├── pom.xml                                   # Maven 配置
└── README.md
```

## 常见面试题

### 1. SpringBoot 的核心注解是什么？

**答案要点**：

`@SpringBootApplication` 是一个组合注解，包含三个核心注解：

```java
@SpringBootConfiguration      // 标注配置类（实际上是 @Configuration）
@EnableAutoConfiguration      // 启用自动配置
@ComponentScan                // 组件扫描，扫描当前包及子包
```

**核心是 `@EnableAutoConfiguration`**：
- 根据类路径中的依赖自动配置 Bean
- 通过 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 文件加载自动配置类
- 使用 `@Conditional` 注解实现条件装配

### 2. SpringBoot 自动配置原理？

**答案要点**：

1. `@EnableAutoConfiguration` 启用自动配置
2. 通过 `@Import(AutoConfigurationImportSelector.class)` 导入自动配置类
3. 读取 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 文件
4. 加载所有自动配置类
5. 使用 `@Conditional` 注解根据条件决定是否生效

**示例**：
```java
@Configuration
@ConditionalOnClass({DataSource.class, EmbeddedDatabaseType.class})
@ConditionalOnMissingBean(DataSource.class)
public class DataSourceAutoConfiguration {
    
    @Bean
    @ConditionalOnProperty(name = "spring.datasource.url")
    public DataSource dataSource() {
        // 创建数据源
    }
}
```

### 3. SpringBoot 常用的 Starter 有哪些？

**答案要点**：

- **spring-boot-starter-web**：Web 开发
- **spring-boot-starter-data-jpa**：JPA 数据访问
- **spring-boot-starter-data-redis**：Redis
- **spring-boot-starter-security**：安全认证
- **spring-boot-starter-test**：测试
- **spring-boot-starter-validation**：参数校验
- **spring-boot-starter-aop**：AOP
- **mybatis-spring-boot-starter**：MyBatis
- **spring-boot-starter-cache**：缓存
- **spring-boot-starter-actuator**：监控

## 最佳实践

1. **使用最新稳定版本**：保持版本更新，享受最新特性
2. **合理使用 starters**：避免引入不必要的依赖
3. **配置文件外部化**：敏感信息不要写在代码中
4. **使用 profiles**：区分不同环境配置
5. **健康检查**：集成 Actuator 监控应用状态
6. **异常处理**：使用 `@ControllerAdvice` 统一异常处理

## 下一步

- [自动配置原理](/springboot/auto-configuration) - 深入理解自动配置
- [常用注解](/springboot/annotations) - 掌握 SpringBoot 常用注解
- [RESTful API 开发](/springboot/restful-api) - 学习 RESTful 接口开发
