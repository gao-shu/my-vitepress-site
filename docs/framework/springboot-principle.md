# SpringBoot 核心原理与自动装配

---

### ❓ 面试官：Spring Boot 和 Spring 有什么区别？为什么要用 Spring Boot？
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
Spring 就像是一个庞大但需要自己组装的“毛坯房”，而 Spring Boot 是精装修的“拎包入住房”。**Spring Boot 本质上还是 Spring**，但它通过**“约定大于配置”**的理念，解决了 Spring 以前令人极其痛苦的**繁琐 XML 配置**和**依赖包版本冲突**两大痛点。

**📝 详细优势解析：**
1. **起步依赖（Starter）**：以前引入一个 Web 环境，要手动在 `pom.xml` 里找 Spring-Web、Spring-MVC、Jackson 等十几个包，还要小心翼翼对比版本号防冲突。现在只需要引入一个 `spring-boot-starter-web`，它自动帮你拉取所有测试兼容好的底层依赖。
2. **自动配置（Auto Configuration）**：以前配个 MyBatis，要写一大堆 XML（配数据源、配 SqlSessionFactory）。现在只需在 `application.yml` 里写两行数据库账号密码，SpringBoot 会在启动时**自动侦测**并帮你把这些 Bean 注册到容器里。
3. **内嵌 Web 容器**：以前要把项目打成 `war` 包丢进外部 Tomcat 的 `webapps` 目录下运行。现在 Spring Boot 直接内嵌了 Tomcat，打成 `jar` 包后直接 `java -jar` 就能独立运行。
4. **内置 Actuator 监控**：自带生产级别的健康检查和运行指标监控端点。

---

### ❓ 面试官：能详细讲讲 Spring Boot 的自动装配原理吗？（极其重要）【中高级】
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
自动装配的魔法全在启动类上的 **`@SpringBootApplication`** 这个复合注解里。其中最核心的是 **`@EnableAutoConfiguration`**。它会在启动时去读取第三方 Jar 包里 `META-INF/spring.factories` 文件（或 `org.springframework.boot.autoconfigure.AutoConfiguration.imports` 文件）中配置的各种**自动配置类**，并结合 **`@Conditional`** 条件注解，按需将 Bean 注入到 Spring 容器中。

**📝 源码级推演（面试背诵模板）：**

1. 拆解 `@SpringBootApplication`，它包含三个核心子注解：
   - `@SpringBootConfiguration`：本质就是 `@Configuration`，标明这是一个配置类。
   - `@ComponentScan`：扫描当前包及子包下的自定义 Bean（如 `@Controller`）。
   - **`@EnableAutoConfiguration`（灵魂核心）**。

2. 深入 `@EnableAutoConfiguration`：
   - 它内部 `import` 了一个叫 **`AutoConfigurationImportSelector`** 的类。
   - 这个类的 `selectImports` 方法会在项目启动时执行。
   - 它会去扫描所有引入的 Jar 包（尤其是 `spring-boot-autoconfigure.jar`），寻找 `META-INF/spring.factories` 配置文件。
   - 从这个文件里，它读取到了上百个全限定名的**自动配置类（XxxAutoConfiguration）**。

3. **`@Conditional` 过滤机制（按需加载）**：
   - 难道这上百个配置类都会被加载吗？绝对不是。
   - 每个 `XxxAutoConfiguration` 源码上都打满了 `@Conditional` 家族注解。
   - 比如 `RedisAutoConfiguration` 上有 `@ConditionalOnClass(RedisOperations.class)`。意思是：**只有当你的 pom.xml 里真实引入了 Redis 的依赖包**，这个配置类才会生效并帮你创建 `RedisTemplate`。如果你没引，这个配置类就直接跳过。这就是“按需装配”的智慧。

---

### ❓ 面试官：如果我自己写了一个组件（比如短信发送工具），怎么把它封装成一个 Starter 供别人使用？【中高级】
*频率：🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
自定义 Starter 的核心就是**写一个自动配置类，并把它暴露在 `spring.factories` 中**。分为四个步骤：引入依赖、写属性类映射 YAML、写自动配置类、配置 `spring.factories` 或 `imports` 文件。

**📝 详细实战步骤：**
1. **新建 Maven 工程**：命名规范一般为 `sms-spring-boot-starter`（官方的都是 `spring-boot-starter-xxx`）。
2. **定义 Properties 类**：用 `@ConfigurationProperties(prefix = "sms")` 绑定 `application.yml` 里用户配的账号和密钥。
3. **编写自动配置类 `SmsAutoConfiguration`**：
   - 加上 `@Configuration` 和 `@EnableConfigurationProperties(SmsProperties.class)`。
   - 写一个 `@Bean` 方法，返回真正的短信发送客户端 `SmsClient`。
   - 精髓：加上 **`@ConditionalOnMissingBean`**，防止用户自己在业务代码里定义了 `SmsClient` 被我们覆盖掉（让用户的配置优先级更高）。
4. **暴露配置类（最关键）**：
   - 在 `src/main/resources/META-INF` 目录下新建 `spring.factories` 文件。
   - 写入：`org.springframework.boot.autoconfigure.EnableAutoConfiguration=com.example.SmsAutoConfiguration`。
   - （如果是 SpringBoot 2.7+ 推荐用 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 文件直接按行写类名）。
5. **打包发布**：打成 jar 包给别的项目引用即可自动生效。