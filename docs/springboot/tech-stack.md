# Spring Boot 前后台管理系统技术栈大全

> 📝 本文基于真实企业项目结构，详解前后台管理系统所需的技术栈和核心配置，不是理论版，是能直接开干的实战指南。

## 🧠 一、系统架构概览

一个典型的前后台管理系统架构：

```text
前端（Vue/React）
   ↓ HTTP(JSON)
后端（Spring Boot）
   ↓
数据库（MySQL）
缓存（Redis）
权限（JWT / Spring Security）
日志 / MQ / 文件 / 网关
```

---

## 🚀 二、后端核心技术栈（必须掌握）

### 🔵 1️⃣ Spring Boot（基础框架）

**核心作用**：
- 项目启动
- 自动配置
- 依赖管理

**起步依赖示例**：
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

---

### 🔵 2️⃣ Spring MVC（接口层）

**用来写**：
- Controller
- REST API

**示例代码**：
```java
@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public Result<User> getUser(@PathVariable Long id) {
        return Result.success(userService.getById(id));
    }
    
    @PostMapping
    public Result<User> createUser(@RequestBody User user) {
        userService.save(user);
        return Result.success(user);
    }
}
```

---

### 🔵 3️⃣ MyBatis / MyBatis-Plus（数据库层）

**常用功能**：
- CRUD 操作
- 分页查询
- 条件查询
- 动态 SQL

**MyBatis-Plus 示例**：
```java
@Mapper
public interface UserMapper extends BaseMapper<User> {
    
    @Select("SELECT * FROM user WHERE name = #{name}")
    List<User> selectByName(String name);
}

// Service 层
public class UserServiceImpl extends ServiceImpl<UserMapper, User> 
    implements UserService {
    
    // 继承 BaseMapper，自带 CRUD 方法
    @Override
    public Page<User> pageQuery(Page<User> page, QueryWrapper<User> wrapper) {
        return this.page(page, wrapper);
    }
}
```

---

### 🔵 4️⃣ MySQL（主数据库）

**存储内容**：
- 用户信息
- 权限角色
- 订单数据
- 菜单配置

**表结构示例**：
```sql
-- 用户表
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码 (加密)',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `status` tinyint DEFAULT 1 COMMENT '状态:0-禁用，1-正常',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 角色表
CREATE TABLE `role` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '角色名',
  `code` varchar(50) NOT NULL COMMENT '角色编码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 用户角色关联表
CREATE TABLE `user_role` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';
```

---

### 🔵 5️⃣ Redis（缓存）

**应用场景**：
- 登录状态存储
- 验证码缓存
- 热点数据缓存
- 分布式锁

**使用示例**：
```java
@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    @Autowired
    private UserMapper userMapper;
    
    // 缓存用户信息
    @Override
    public User getById(Long id) {
        String key = "user:" + id;
        
        // 先查缓存
        String json = redisTemplate.opsForValue().get(key);
        if (json != null) {
            return JSON.parseObject(json, User.class);
        }
        
        // 缓存未命中，查数据库
        User user = userMapper.selectById(id);
        
        // 写入缓存，30 分钟过期
        redisTemplate.opsForValue().set(key, 
            JSON.toJSONString(user), 30, TimeUnit.MINUTES);
        
        return user;
    }
    
    // 存储验证码
    public void saveCaptcha(String uuid, String code) {
        String key = "captcha:" + uuid;
        redisTemplate.opsForValue().set(key, code, 5, TimeUnit.MINUTES);
    }
}
```

---

### 🔵 6️⃣ Spring Security / JWT（权限认证）

**核心功能**：
- 用户登录
- Token 生成与校验
- 权限控制

**JWT 工具类**：
```java
@Component
public class JwtUtil {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expire}")
    private Long expire;
    
    /**
     * 生成 Token
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(userDetails.getUsername())
            .setId(UUID.randomUUID().toString())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expire * 1000))
            .signWith(SignatureAlgorithm.HS512, secret)
            .compact();
    }
    
    /**
     * 验证 Token
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) 
                && !isTokenExpired(token));
    }
    
    /**
     * 从 Token 中获取用户名
     */
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
            .setSigningKey(secret)
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
    
    /**
     * 判断 Token 是否过期
     */
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }
    
    /**
     * 获取 Token 过期时间
     */
    public Date getExpirationDateFromToken(String token) {
        return Jwts.parser()
            .setSigningKey(secret)
            .parseClaimsJws(token)
            .getBody()
            .getExpiration();
    }
}
```

**Spring Security 配置**：
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(
                SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, 
                UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

**JWT 过滤器**：
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) 
            throws ServletException, IOException {
        
        // 从请求头获取 Token
        String token = getTokenFromRequest(request);
        
        if (token != null && jwtUtil.validateToken(token, userDetailsService)) {
            // 解析 Token，设置认证信息
            String username = jwtUtil.getUsernameFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            
            authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request));
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

---

### 🔵 7️⃣ Filter / Interceptor（请求拦截）

**应用场景**：
- JWT 校验
- TraceId 追踪
- 日志记录
- 黑名单检查

**拦截器示例**：
```java
@Component
public class LogInterceptor implements HandlerInterceptor {
    
    private static final Logger log = LoggerFactory.getLogger(LogInterceptor.class);
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                           HttpServletResponse response, 
                           Object handler) throws Exception {
        
        long startTime = System.currentTimeMillis();
        request.setAttribute("startTime", startTime);
        
        // 记录请求信息
        log.info("Request: {} {} | IP: {} | Params: {}",
            request.getMethod(),
            request.getRequestURI(),
            getClientIp(request),
            JSON.toJSONString(request.getParameterMap()));
        
        return true;
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request,
                              HttpServletResponse response,
                              Object handler,
                              Exception ex) throws Exception {
        
        long startTime = (Long) request.getAttribute("startTime");
        long costTime = System.currentTimeMillis() - startTime;
        
        log.info("Response: {} {} | Status: {} | Cost: {}ms",
            request.getMethod(),
            request.getRequestURI(),
            response.getStatus(),
            costTime);
        
        if (ex != null) {
            log.error("Exception:", ex);
        }
    }
    
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
```

**注册拦截器**：
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Autowired
    private LogInterceptor logInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(logInterceptor)
            .addPathPatterns("/api/**")
            .excludePathPatterns("/api/auth/**", "/api/public/**");
    }
}
```

---

### 🔵 8️⃣ Swagger / Knife4j（接口文档）

**用于前后端联调**

**引入依赖**：
```xml
<!-- Knife4j -->
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-openapi3-spring-boot-starter</artifactId>
    <version>4.3.0</version>
</dependency>
```

**配置示例**：
```java
@Configuration
public class SwaggerConfig {
    
    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.OAS_30)
            .apiInfo(apiInfo())
            .select()
            .apis(RequestHandlerSelectors.basePackageName("com.example.controller"))
            .paths(PathSelectors.any())
            .build()
            .globalRequestParameters(getGlobalParameters());
    }
    
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
            .title("后台管理系统 API 文档")
            .description("提供详细的 API 接口文档")
            .contact(new Contact("开发者", "", "email@example.com"))
            .version("1.0")
            .build();
    }
    
    // 全局参数（如 Token）
    private List<RequestParameter> getGlobalParameters() {
        List<RequestParameter> parameters = new ArrayList<>();
        
        RequestParameter tokenParam = new RequestParameterBuilder()
            .name("Authorization")
            .description("JWT Token")
            .in(ParameterType.HEADER)
            .required(false)
            .query(q -> q.model(m -> m.scalarModel(ScalarType.STRING)))
            .build();
        
        parameters.add(tokenParam);
        return parameters;
    }
}
```

**Controller 使用**：
```java
@RestController
@RequestMapping("/api/user")
@Tag(name = "用户管理")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Operation(summary = "根据 ID 查询用户")
    @GetMapping("/{id}")
    public Result<User> getUser(
        @Parameter(description = "用户 ID") @PathVariable Long id) {
        return Result.success(userService.getById(id));
    }
    
    @Operation(summary = "创建用户")
    @PostMapping
    public Result<User> createUser(
        @Parameter(description = "用户信息") @RequestBody @Validated User user) {
        userService.save(user);
        return Result.success(user);
    }
}
```

**访问地址**：
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Knife4j UI: `http://localhost:8080/doc.html`

---

### 🔵 9️⃣ Maven（项目管理）

**核心作用**：
- 依赖管理
- 项目构建
- 打包部署

**完整 pom.xml 示例**：
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
        <relativePath/>
    </parent>
    
    <groupId>com.example</groupId>
    <artifactId>admin-system</artifactId>
    <version>1.0.0</version>
    <name>admin-system</name>
    <description>后台管理系统</description>
    
    <properties>
        <java.version>17</java.version>
        <mybatis-plus.version>3.5.4</mybatis-plus.version>
        <knife4j.version>4.3.0</knife4j.version>
        <jjwt.version>0.9.1</jjwt.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- Spring Boot Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- Spring Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <!-- MyBatis Plus -->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
            <version>${mybatis-plus.version}</version>
        </dependency>
        
        <!-- MySQL -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Redis -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        
        <!-- Knife4j -->
        <dependency>
            <groupId>com.github.xiaoymin</groupId>
            <artifactId>knife4j-openapi3-spring-boot-starter</artifactId>
            <version>${knife4j.version}</version>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Hutool 工具类 -->
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>5.8.24</version>
        </dependency>
        
        <!-- Test -->
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
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

### 🔵 🔟 Logback（日志）

**日志配置**：
- 请求日志
- 错误日志
- 接口耗时
- 文件输出

**logback-spring.xml 示例**：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="60 seconds">
    
    <!-- 定义变量 -->
    <property name="LOG_HOME" value="./logs"/>
    <property name="LOG_PATTERN" 
              value="%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n"/>
    
    <!-- 控制台输出 -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>${LOG_PATTERN}</pattern>
            <charset>UTF-8</charset>
        </encoder>
    </appender>
    
    <!-- INFO 级别日志文件 -->
    <appender name="INFO_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_HOME}/info.log</file>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>INFO</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${LOG_HOME}/info.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy 
                class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>100MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>${LOG_PATTERN}</pattern>
            <charset>UTF-8</charset>
        </encoder>
    </appender>
    
    <!-- ERROR 级别日志文件 -->
    <appender name="ERROR_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_HOME}/error.log</file>
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>ERROR</level>
        </filter>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${LOG_HOME}/error.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy 
                class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>100MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>${LOG_PATTERN}</pattern>
            <charset>UTF-8</charset>
        </encoder>
    </appender>
    
    <!-- 开发环境配置 -->
    <springProfile name="dev">
        <root level="INFO">
            <appender-ref ref="CONSOLE"/>
        </root>
        <logger name="com.example" level="DEBUG"/>
    </springProfile>
    
    <!-- 生产环境配置 -->
    <springProfile name="prod">
        <root level="INFO">
            <appender-ref ref="CONSOLE"/>
            <appender-ref ref="INFO_FILE"/>
            <appender-ref ref="ERROR_FILE"/>
        </root>
    </springProfile>
    
</configuration>
```

---

## 🚀 三、常见扩展技术（进阶项目会用）

### 🔥 1️⃣ Spring AOP

**应用场景**：
- 统一日志处理
- 权限校验
- 性能监控
- 事务管理

**AOP 日志切面示例**：
```java
@Aspect
@Component
@Slf4j
public class LogAspect {
    
    @Pointcut("@annotation(com.example.annotation.OperationLog)")
    public void logPointcut() {
    }
    
    @Around("logPointcut()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        long beginTime = System.currentTimeMillis();
        
        // 执行方法
        Object result = point.proceed();
        
        // 执行时长
        long time = System.currentTimeMillis() - beginTime;
        
        // 获取方法信息
        MethodSignature signature = (MethodSignature) point.getSignature();
        Method method = signature.getMethod();
        
        log.info("=== 方法执行 ===");
        log.info("方法名：{}.{}", 
            point.getTarget().getClass().getName(), 
            method.getName());
        log.info("参数：{}", JSON.toJSONString(point.getArgs()));
        log.info("结果：{}", JSON.toJSONString(result));
        log.info("耗时：{}ms", time);
        log.info("==============");
        
        return result;
    }
}
```

---

### 🔥 2️⃣ RabbitMQ / Kafka（消息队列）

**应用场景**：
- 异步处理
- 系统解耦
- 削峰填谷
- 延迟任务

**RabbitMQ 示例**：
```java
@Configuration
public class RabbitMQConfig {
    
    @Bean
    public Queue orderQueue() {
        return new Queue("order.queue", true);
    }
    
    @Bean
    public TopicExchange orderExchange() {
        return new TopicExchange("order.exchange");
    }
    
    @Bean
    public Binding orderBinding(Queue orderQueue, TopicExchange orderExchange) {
        return BindingBuilder.bind(orderQueue)
            .to(orderExchange)
            .with("order.#");
    }
}

// 发送消息
@Service
public class OrderService {
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    public void createOrder(Order order) {
        // 保存订单
        orderMapper.insert(order);
        
        // 发送消息
        rabbitTemplate.convertAndSend("order.exchange", 
            "order.created", order);
    }
}

// 消费消息
@Component
@RabbitListener(queues = "order.queue")
public class OrderConsumer {
    
    @RabbitHandler
    public void handle(Order order) {
        log.info("收到订单消息：{}", order);
        // 处理订单逻辑
    }
}
```

---

### 🔥 3️⃣ Nginx

**应用场景**：
- 反向代理
- 前端部署
- 负载均衡
- SSL 终止

**Nginx 配置示例**：
```nginx
server {
    listen 80;
    server_name api.example.com;
    
    # 前端静态文件
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # 后端 API 代理
    location /api/ {
        proxy_pass http://backend-server:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

---

### 🔥 4️⃣ Docker

**应用场景**：
- 容器化部署
- 一键运行
- 环境一致性

**Dockerfile 示例**：
```dockerfile
# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

# 运行阶段
FROM openjdk:17-slim

WORKDIR /app

# 安装 tzdata(时区)
RUN apt-get update && apt-get install -y tzdata

# 设置时区
ENV TZ=Asia/Shanghai

# 复制 jar 包
COPY target/admin-system-1.0.0.jar app.jar

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# 启动命令
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Docker Compose 示例**：
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: admin_db
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - app-network
  
  redis:
    image: redis:alpine
    container_name: redis
    ports:
      - "6379:6379"
    networks:
      - app-network
  
  backend:
    build: .
    container_name: backend
    ports:
      - "8080:8080"
    depends_on:
      - mysql
      - redis
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DB_HOST: mysql
      REDIS_HOST: redis
    networks:
      - app-network
  
  nginx:
    image: nginx:alpine
    container_name: nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./dist:/usr/share/nginx/html
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  mysql-data:

networks:
  app-network:
    driver: bridge
```

---

### 🔥 5️⃣ 文件存储（MinIO / OSS）

**应用场景**：
- 图片上传
- 视频存储
- 文件管理

**MinIO 示例**：
```java
@Configuration
public class MinIOConfig {
    
    @Value("${minio.endpoint}")
    private String endpoint;
    
    @Value("${minio.accessKey}")
    private String accessKey;
    
    @Value("${minio.secretKey}")
    private String secretKey;
    
    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
            .endpoint(endpoint)
            .credentials(accessKey, secretKey)
            .build();
    }
}

@Service
public class FileService {
    
    @Autowired
    private MinioClient minioClient;
    
    /**
     * 上传文件
     */
    public String uploadFile(MultipartFile file, String bucketName) throws Exception {
        String objectName = UUID.randomUUID().toString() + 
            "-" + file.getOriginalFilename();
        
        minioClient.putObject(
            PutObjectArgs.builder()
                .bucket(bucketName)
                .object(objectName)
                .stream(file.getInputStream(), file.getSize(), -1)
                .contentType(file.getContentType())
                .build());
        
        return getObjectUrl(bucketName, objectName);
    }
    
    /**
     * 获取文件访问 URL
     */
    public String getObjectUrl(String bucketName, String objectName) {
        return endpoint + "/" + bucketName + "/" + objectName;
    }
}
```

---

## 🚀 四、Spring Boot 项目核心配置

### 🔵 1️⃣ application.yml（最核心）

```yaml
# 服务器配置
server:
  port: 8080
  servlet:
    context-path: /
  tomcat:
    threads:
      max: 200
      min-spare: 10
  compression:
    enabled: true
    mime-types: text/html,text/xml,text/plain,text/css,application/json,application/javascript

# Spring 配置
spring:
  application:
    name: admin-system
  
  # 数据源配置
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:admin_db}?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: ${DB_USER:root}
    password: ${DB_PASSWORD:root123}
    
    # HikariCP 连接池配置
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      idle-timeout: 30000
      pool-name: HikariCP
      max-lifetime: 1800000
      connection-timeout: 30000
      connection-test-query: SELECT 1
  
  # Redis 配置
  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
    password: ${REDIS_PASSWORD:}
    database: 0
    timeout: 5000ms
    lettuce:
      pool:
        max-active: 20
        max-idle: 10
        min-idle: 5
        max-wait: 3000ms
  
  # Jackson 序列化配置
  jackson:
    time-zone: Asia/Shanghai
    date-format: yyyy-MM-dd HH:mm:ss
    serialization:
      write-dates-as-timestamps: false
  
  # 文件上传配置
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

# MyBatis-Plus 配置
mybatis-plus:
  mapper-locations: classpath*:/mapper/**/*.xml
  type-aliases-package: com.example.entity
  configuration:
    map-underscore-to-camel-case: true
    cache-enabled: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  global-config:
    db-config:
      id-type: auto
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0

# JWT 配置
jwt:
  secret: ${JWT_SECRET:your-secret-key-here-change-in-production}
  expire: 7200  # 2 小时，单位秒
  header: Authorization
  prefix: Bearer 

# Knife4j/Swagger配置
knife4j:
  enable: true
  setting:
    language: zh_cn

# 日志配置
logging:
  level:
    root: INFO
    com.example: DEBUG
    org.springframework.web: INFO
    org.springframework.security: INFO
  pattern:
    console: '%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n'
  
# Actuator 监控配置
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
  health:
    redis:
      enabled: true

# MinIO 配置
minio:
  endpoint: http://localhost:9000
  accessKey: minioadmin
  secretKey: minioadmin
  bucketName: files

# 环境区分配置
---
spring:
  config:
    activate:
      on-profile: dev

logging:
  level:
    com.example: DEBUG

---
spring:
  config:
    activate:
      on-profile: prod

logging:
  level:
    com.example: INFO
```

---

### 🔵 2️⃣ MyBatis 配置

```java
@Configuration
@MapperScan("com.example.mapper")
public class MybatisConfig {
    
    /**
     * 分页插件
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        
        // 分页插件
        PaginationInnerInterceptor paginationInterceptor = 
            new PaginationInnerInterceptor(DbType.MYSQL);
        paginationInterceptor.setMaxLimit(1000L); // 限制最大查询数量
        
        interceptor.addInnerInterceptor(paginationInterceptor);
        
        // 乐观锁插件
        interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
        
        return interceptor;
    }
    
    /**
     * SQL 性能分析插件 (仅开发环境)
     */
    @Bean
    @Profile({"dev", "test"})
    public MybatisPlusInterceptor performanceInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new IllegalSQLInnerInterceptor());
        return interceptor;
    }
}
```

---

### 🔵 3️⃣ CORS 跨域配置

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOriginPatterns("*") // 支持所有来源
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

---

## 🧠 五、一次请求完整链路（非常重要）

理解请求的完整处理流程：

```text
1. 前端发起请求
   ↓
2. Nginx（可选，负责反向代理）
   ↓
3. Spring Boot 接收请求
   ↓
4. Filter 链（JWT 校验、TraceId、黑名单）
   ↓
5. Interceptor（日志记录、权限预检）
   ↓
6. Controller（参数校验、业务入口）
   ↓
7. Service（业务逻辑、事务控制）
   ↓
8. DAO / Mapper（MyBatis 数据访问）
   ↓
9. MySQL / Redis（数据存储/缓存）
   ↓
10. 返回结果逐层向上
   ↓
11. 统一异常处理（@RestControllerAdvice）
   ↓
12. 统一响应包装（Result<T>）
   ↓
13. 返回给前端
```

**统一响应封装**：
```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result<T> implements Serializable {
    
    private Integer code;
    private String message;
    private T data;
    private Long timestamp;
    
    public static <T> Result<T> success() {
        return new Result<>(200, "success", null, System.currentTimeMillis());
    }
    
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "success", data, System.currentTimeMillis());
    }
    
    public static <T> Result<T> error(String message) {
        return new Result<>(500, message, null, System.currentTimeMillis());
    }
    
    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null, System.currentTimeMillis());
    }
}
```

**统一异常处理**：
```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    /**
     * 业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        log.warn("业务异常：{}", e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }
    
    /**
     * 参数校验异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleValidationException(
            MethodArgumentNotValidException e) {
        String message = e.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.joining(", "));
        
        return Result.error(400, message);
    }
    
    /**
     * 其他异常
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("系统异常", e);
        return Result.error("系统繁忙，请稍后再试");
    }
}
```

---

## ⚡ 六、总结（面试级）

### 👉 一个前后台系统（Spring Boot）核心技术栈：

| 分类 | 技术 | 作用 |
|------|------|------|
| **框架** | Spring Boot | 快速开发、自动配置 |
| **接口** | Spring MVC | REST API 接口 |
| **数据库** | MyBatis / MyBatis-Plus | ORM 映射、CRUD |
| **主存储** | MySQL | 持久化数据 |
| **缓存** | Redis | 缓存、会话、分布式锁 |
| **认证** | JWT + Spring Security | Token 认证、权限控制 |
| **拦截** | Filter / Interceptor | 请求过滤、日志、鉴权 |
| **文档** | Swagger / Knife4j | API 接口文档 |
| **构建** | Maven | 依赖管理、项目构建 |
| **日志** | Logback | 日志记录、监控 |

---

## 🚀 七、项目目录结构参考

```
admin-system/
├── src/main/java/com/example/
│   ├── AdminSystemApplication.java          # 启动类
│   ├── config/                              # 配置类
│   │   ├── CorsConfig.java                  # 跨域配置
│   │   ├── JwtConfig.java                   # JWT 配置
│   │   ├── MybatisConfig.java               # MyBatis 配置
│   │   ├── RedisConfig.java                 # Redis 配置
│   │   └── SwaggerConfig.java               # Swagger 配置
│   ├── controller/                          # 控制器
│   │   ├── AuthController.java              # 认证接口
│   │   ├── UserController.java              # 用户接口
│   │   └── RoleController.java              # 角色接口
│   ├── service/                             # 服务层
│   │   ├── UserService.java
│   │   ├── impl/
│   │   │   └── UserServiceImpl.java
│   │   └── RoleService.java
│   ├── mapper/                              # DAO 层
│   │   ├── UserMapper.java
│   │   └── RoleMapper.java
│   ├── entity/                              # 实体类
│   │   ├── User.java
│   │   └── Role.java
│   ├── dto/                                 # 数据传输对象
│   │   ├── request/                         # 请求 DTO
│   │   │   ├── LoginRequest.java
│   │   │   └── UserCreateRequest.java
│   │   └── response/                        # 响应 DTO
│   │       └── UserResponse.java
│   ├── common/                              # 公共组件
│   │   ├── Result.java                      # 统一响应
│   │   ├── BusinessException.java           # 业务异常
│   │   └── annotation/                      # 自定义注解
│   ├── security/                            # 安全相关
│   │   ├── JwtUtil.java                     # JWT 工具
│   │   ├── JwtAuthenticationFilter.java     # JWT 过滤器
│   │   └── UserDetailsServiceImpl.java      # 用户详情服务
│   └── interceptor/                         # 拦截器
│       └── LogInterceptor.java              # 日志拦截器
├── src/main/resources/
│   ├── mapper/                              # MyBatis XML
│   │   ├── UserMapper.xml
│   │   └── RoleMapper.xml
│   ├── application.yml                      # 主配置文件
│   ├── application-dev.yml                  # 开发环境配置
│   ├── application-prod.yml                 # 生产环境配置
│   └── logback-spring.xml                   # 日志配置
├── pom.xml                                  # Maven 配置
├── Dockerfile                               # Docker 构建
└── docker-compose.yml                       # Docker 编排
```

---

## 🎯 八、快速开始步骤

### 1. 初始化数据库
```sql
CREATE DATABASE admin_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 修改配置文件
编辑 `application.yml`，配置数据库、Redis、JWT 等信息

### 3. 启动项目
```bash
# 本地开发
mvn spring-boot:run

# 或者打包后运行
mvn clean package
java -jar target/admin-system-1.0.0.jar
```

### 4. 访问接口文档
```
http://localhost:8080/doc.html
```

### 5. Docker 部署
```bash
# 构建镜像
docker build -t admin-system:1.0.0 .

# 运行容器
docker run -d \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_HOST=mysql \
  -e REDIS_HOST=redis \
  --name admin-system \
  admin-system:1.0.0

# 或使用 Docker Compose
docker-compose up -d
```

---

## 📚 九、学习建议

### ✅ 必学内容（按优先级）：
1. **Spring Boot 基础**：自动配置、起步依赖
2. **RESTful API 设计**：Controller、Request/Response
3. **MyBatis-Plus**：CRUD、分页、条件查询
4. **JWT 认证**：Token 生成、校验、刷新
5. **Redis 应用**：缓存、会话管理
6. **统一封装**：响应、异常、日志

### ⚠️ 可缓一缓的内容：
- Spring Cloud 微服务
- RabbitMQ/Kafka 消息队列
- 复杂的 AOP 切面
- 自定义 Starter

### 💡 最佳实践：
1. **先跑通整个流程**：登录 → 增删改查 → 权限控制
2. **再优化细节**：缓存、日志、异常处理
3. **最后考虑扩展**：MQ、分库分表、微服务

---

## 🔗 十、参考资料

- [Spring Boot 官方文档](https://spring.io/projects/spring-boot)
- [MyBatis-Plus 官方文档](https://baomidou.com/)
- [Knife4j 文档](https://doc.xiaominfo.com/)
- [Spring Security 官方文档](https://spring.io/projects/spring-security)
- [Redis 官方文档](https://redis.io/documentation)

---

> 💡 **本质总结**：Spring Boot 前后台系统就是 **"Controller + 鉴权 + 数据库 + 缓存 + 前端接口"** 的整合工程。掌握这套技术栈，你就能快速搭建企业级的后台管理系统！
