# SpringBoot 常见问题与扩展

---

### ❓ 面试官：Spring Boot 中如何全局处理异常？你们项目是怎么做的？
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
我们在项目中使用了 **`@RestControllerAdvice` + `@ExceptionHandler`** 组合，实现了一个全局异常拦截器（GlobalExceptionHandler）。这样可以把所有 Controller 层抛出的异常收口到一个地方，统一包装成友好的 JSON 格式返回给前端，而不是让前端看到一堆恶心的 Tomcat 500 报错页面。

**📝 详细落地代码结构：**
1. **定义统一返回对象**：比如 `Result<T>`，包含 `code`、`msg`、`data` 三个字段。
2. **定义全局异常处理类**：
   ```java
   @RestControllerAdvice
   @Slf4j
   public class GlobalExceptionHandler {

       // 拦截自定义的业务异常（最常见）
       @ExceptionHandler(BusinessException.class)
       public Result handleBusinessException(BusinessException e) {
           log.warn("业务异常: {}", e.getMessage());
           return Result.fail(e.getCode(), e.getMessage());
       }

       // 拦截参数校验失败的异常（配合 @Validated 使用）
       @ExceptionHandler(MethodArgumentNotValidException.class)
       public Result handleValidException(MethodArgumentNotValidException e) {
           String msg = e.getBindingResult().getFieldError().getDefaultMessage();
           return Result.fail(400, "参数校验失败: " + msg);
       }

       // 终极兜底：拦截所有未知的系统异常（如 NullPointerException）
       @ExceptionHandler(Exception.class)
       public Result handleException(Exception e) {
           log.error("系统未知异常", e); // 未知异常必须打 error 日志并带上堆栈
           return Result.fail(500, "系统繁忙，请稍后再试");
       }
   }
   ```
3. **优势**：业务代码里不需要到处写 `try-catch`。如果发现逻辑不满足，直接 `throw new BusinessException("库存不足")` 即可，代码极其清爽。

---

### ❓ 面试官：如果多个配置文件（比如 application.yml、application-dev.yml、nacos 配置）里都有同一个配置项，它们的加载顺序和优先级是怎样的？【中级】
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
Spring Boot 的配置加载原则是：**外部配置优先于内部配置，带 Profile（环境）的配置优先于默认配置**。发生冲突时，**后加载的会覆盖先加载的**。

**📝 详细的优先级顺序（从高到低）：**
1. **Nacos / Apollo 等配置中心**（最高优先级，最常用于线上动态调参）。
2. **命令行参数**（比如你启动时敲的 `java -jar app.jar --server.port=8080`）。
3. 项目根目录或 `config` 目录下的外部配置文件。
4. 项目 `resources` 目录下的内部配置文件：
   - 先加载：`application.yml`（通用基础配置）。
   - 后加载并覆盖前者的：`application-dev.yml` 或 `application-prod.yml`（按当前激活的环境加载）。
5. `@PropertySource` 引入的自定义配置文件。
6. `SpringApplication.setDefaultProperties` 设置的默认属性。

---

### ❓ 面试官：你了解 Spring Boot 的 Actuator 吗？在线上环境有什么安全隐患？【中高级】
*频率：🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
`spring-boot-starter-actuator` 是 Spring Boot 自带的生产级监控工具。它能通过暴露 HTTP 端点，让我们实时查看应用的运行状态（如内存、线程、环境变量、Bean 加载情况）。但如果**在线上环境不加限制地暴露出去了，会导致极度严重的安全漏洞（如配置泄露、甚至远程代码执行）**。

**📝 核心端点与安全防范：**
1. **有用的常用端点**：
   - `/actuator/health`：健康检查。K8s 或 Nacos 通常通过定时请求这个接口来判断你的服务是死是活。
   - `/actuator/info`：展示在 `application.yml` 中自定义的 `info.*` 描述信息。
   - `/actuator/env`：展示当前应用的所有环境变量和配置信息。
   - `/actuator/threaddump`：直接在浏览器里打出一个线程快照，排查死锁利器。
2. **巨大的安全隐患**：
   - 之前很多公司直接在生产环境配置了 `management.endpoints.web.exposure.include="*"`（暴露所有端点），并且没有做鉴权。
   - 黑客通过访问 `/actuator/env`，直接拿到了你配置在里面的数据库账号密码、Redis 密码、甚至是阿里云的 SecretKey！
3. **如何防范**：
   - 生产环境绝对禁止暴露所有端点！通常**只暴露 `health` 和 `info`** 即可。
   - 如果非要暴露其他端点，必须整合 Spring Security，为 `/actuator/**` 路径加上极高强度的账号密码 Basic 认证。
   - 更改默认路径：把 `/actuator` 换成一个难以被猜到的混淆路径，如 `management.endpoints.web.base-path=/my-monitor-123`。