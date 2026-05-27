# Spring MVC 核心原理与实战

---

### ❓ 面试官：能讲讲 Spring MVC 的请求处理流程吗？【中级】
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
Spring MVC 的核心是 **`DispatcherServlet`（前端控制器）**，它负责接收所有请求，然后通过 **HandlerMapping** 找到对应的 Controller，再通过 **HandlerAdapter** 执行方法，最后通过 **ViewResolver** 渲染视图返回。整个过程就像一个"中央调度器 + 多个组件协作"的流水线。

**📝 完整请求处理流程（9 步）：**

```
用户浏览器
    ↓
1. 发送 HTTP 请求
    ↓
2. DispatcherServlet（前端控制器）接收请求
    ↓
3. HandlerMapping（处理器映射器）查找匹配的 Controller
    ↓
4. HandlerAdapter（处理器适配器）执行 Controller 方法
    ↓
5. Controller 调用 Service → Mapper 处理业务逻辑
    ↓
6. 返回 ModelAndView 或 @ResponseBody 数据
    ↓
7. ViewResolver（视图解析器）解析视图（如果是 JSP/Thymeleaf）
    ↓
8. DispatcherServlet 渲染视图
    ↓
9. 返回 HTTP 响应给浏览器
```

**代码示例**：

```java
// 1. Controller 层
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // GET /api/users/1
    @GetMapping("/{id}")
    public ApiResponse<UserVO> getUser(@PathVariable Long id) {
        UserVO user = userService.getById(id);
        return ApiResponse.success(user);
    }
    
    // POST /api/users
    @PostMapping
    public ApiResponse<Void> createUser(@RequestBody @Valid UserDTO dto) {
        userService.create(dto);
        return ApiResponse.success(null);
    }
}

// 2. Service 层
@Service
public class UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    public UserVO getById(Long id) {
        User user = userMapper.selectById(id);
        return convertToVO(user);
    }
    
    public void create(UserDTO dto) {
        User user = new User();
        BeanUtils.copyProperties(dto, user);
        userMapper.insert(user);
    }
}

// 3. Mapper 层
@Mapper
public interface UserMapper extends BaseMapper<User> {
    // MyBatis-Plus 自动提供 CRUD 方法
}
```

**关键组件说明**：

| 组件 | 作用 | 类比 |
|------|------|------|
| **DispatcherServlet** | 前端控制器，统一入口 | 公司前台接待 |
| **HandlerMapping** | 根据 URL 找到对应的 Controller | 查询通讯录找负责人 |
| **HandlerAdapter** | 适配不同类型的 Controller | 翻译官，统一调用方式 |
| **Controller** | 处理业务逻辑 | 具体办事人员 |
| **ViewResolver** | 解析视图模板（JSP/Thymeleaf） | 文档排版员 |
| **Interceptor** | 拦截器，预处理请求 | 保安检查证件 |

---

### ❓ 面试官：@RequestMapping、@GetMapping、@PostMapping 有什么区别？参数如何接收？【初级】
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
`@RequestMapping` 是通用注解，可以指定任意 HTTP 方法；`@GetMapping`、`@PostMapping` 等是简化写法，语义更清晰。**参数接收有 5 种常见方式**：路径变量、请求参数、请求体、请求头、表单数据。

**📝 参数接收方式详解：**

#### 1. 路径变量（@PathVariable）

```java
// GET /api/users/123
@GetMapping("/{id}")
public ApiResponse<UserVO> getUser(@PathVariable Long id) {
    // id = 123
}

// GET /api/users/123/orders/456
@GetMapping("/{userId}/orders/{orderId}")
public ApiResponse<OrderVO> getOrder(
    @PathVariable Long userId,
    @PathVariable Long orderId) {
    // userId = 123, orderId = 456
}
```

#### 2. 请求参数（@RequestParam）

```java
// GET /api/users?page=1&size=10&keyword=张三
@GetMapping
public ApiResponse<Page<UserVO>> listUsers(
    @RequestParam(defaultValue = "1") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(required = false) String keyword) {
    // page = 1, size = 10, keyword = "张三"
}

// 如果参数名与 URL 参数名不一致
@GetMapping
public ApiResponse<UserVO> search(
    @RequestParam("kw") String keyword) {
    // URL: /api/users?kw=张三
}
```

#### 3. 请求体（@RequestBody）

```java
// POST /api/users
// Content-Type: application/json
// Body: {"name": "张三", "age": 25, "email": "zhangsan@example.com"}
@PostMapping
public ApiResponse<Void> createUser(@RequestBody @Valid UserDTO dto) {
    // dto.name = "张三", dto.age = 25, dto.email = "zhangsan@example.com"
}

// DTO 定义
@Data
public class UserDTO {
    @NotBlank(message = "姓名不能为空")
    private String name;
    
    @Min(value = 1, message = "年龄必须大于0")
    @Max(value = 150, message = "年龄不能超过150")
    private Integer age;
    
    @Email(message = "邮箱格式不正确")
    private String email;
}
```

#### 4. 请求头（@RequestHeader）

```java
@GetMapping
public ApiResponse<List<UserVO>> listUsers(
    @RequestHeader("Authorization") String token,
    @RequestHeader(value = "X-Request-ID", required = false) String requestId) {
    // token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 5. 表单数据（无需注解）

```java
// POST /api/login
// Content-Type: application/x-www-form-urlencoded
// Body: username=admin&password=123456
@PostMapping("/login")
public ApiResponse<Void> login(
    String username,
    String password) {
    // 自动绑定表单参数
}
```

**参数接收对比表**：

| 注解 | 适用场景 | HTTP 方法 | Content-Type |
|------|---------|----------|--------------|
| `@PathVariable` | RESTful 风格 URL | GET/POST/PUT/DELETE | - |
| `@RequestParam` | URL 查询参数 | GET | - |
| `@RequestBody` | JSON 请求体 | POST/PUT | application/json |
| `@RequestHeader` | 获取请求头信息 | 任意 | - |
| 无注解 | 表单数据 | POST | application/x-www-form-urlencoded |

---

### ❓ 面试官：Spring MVC 如何实现全局异常处理？【中级】
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
使用 **`@RestControllerAdvice` + `@ExceptionHandler`** 实现全局异常处理，统一返回格式，避免每个 Controller 都写 try-catch。

**📝 完整实现方案：**

#### 1. 定义统一响应体

```java
@Data
public class ApiResponse<T> {
    private Integer code;
    private String message;
    private T data;
    private Long timestamp;
    
    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("success");
        response.setData(data);
        response.setTimestamp(System.currentTimeMillis());
        return response;
    }
    
    public static <T> ApiResponse<T> error(Integer code, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(code);
        response.setMessage(message);
        response.setTimestamp(System.currentTimeMillis());
        return response;
    }
}
```

#### 2. 定义业务异常类

```java
@Getter
public class BusinessException extends RuntimeException {
    private Integer code;
    
    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }
    
    public BusinessException(String message) {
        super(message);
        this.code = 500;
    }
}
```

#### 3. 全局异常处理器

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    /**
     * 业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public ApiResponse<Void> handleBusinessException(BusinessException e) {
        log.warn("业务异常: {}", e.getMessage());
        return ApiResponse.error(e.getCode(), e.getMessage());
    }
    
    /**
     * 参数校验异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<Void> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldError().getDefaultMessage();
        log.warn("参数校验失败: {}", message);
        return ApiResponse.error(400, message);
    }
    
    /**
     * 权限不足
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ApiResponse<Void> handleAccessDeniedException(AccessDeniedException e) {
        return ApiResponse.error(403, "权限不足，无法访问");
    }
    
    /**
     * 资源不存在
     */
    @ExceptionHandler(NoSuchElementException.class)
    public ApiResponse<Void> handleNoSuchElementException(NoSuchElementException e) {
        return ApiResponse.error(404, "资源不存在");
    }
    
    /**
     * 系统异常（兜底）
     */
    @ExceptionHandler(Exception.class)
    public ApiResponse<Void> handleException(Exception e) {
        log.error("系统异常", e);
        return ApiResponse.error(500, "系统繁忙，请稍后再试");
    }
}
```

#### 4. 在 Controller 中使用

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public ApiResponse<UserVO> getUser(@PathVariable Long id) {
        // 不需要 try-catch，异常会被全局处理器捕获
        UserVO user = userService.getById(id);
        return ApiResponse.success(user);
    }
    
    @PostMapping
    public ApiResponse<Void> createUser(@RequestBody @Valid UserDTO dto) {
        userService.create(dto);
        return ApiResponse.success(null);
    }
}

// Service 层抛出业务异常
@Service
public class UserService {
    
    public UserVO getById(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException(404, "用户不存在");
        }
        return convertToVO(user);
    }
    
    public void create(UserDTO dto) {
        // 检查用户名是否重复
        if (userMapper.existsByUsername(dto.getUsername())) {
            throw new BusinessException(409, "用户名已存在");
        }
        
        User user = new User();
        BeanUtils.copyProperties(dto, user);
        userMapper.insert(user);
    }
}
```

**优势**：
- ✅ 代码简洁，Controller 不需要写 try-catch
- ✅ 统一返回格式，前端易于处理
- ✅ 集中管理异常，便于维护和修改
- ✅ 可以记录日志、监控告警

---

### ❓ 面试官：Spring MVC 的拦截器（Interceptor）和过滤器（Filter）有什么区别？【中级】
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
**过滤器（Filter）** 是 Servlet 规范的一部分，在请求进入 Spring MVC 之前执行；**拦截器（Interceptor）** 是 Spring MVC 提供的，在 DispatcherServlet 之后、Controller 之前执行。**Filter 更底层，Interceptor 更灵活**。

**📝 详细对比：**

| 特性 | Filter（过滤器） | Interceptor（拦截器） |
|------|-----------------|---------------------|
| **所属规范** | Servlet 规范 | Spring MVC 框架 |
| **执行时机** | 请求进入容器时 | DispatcherServlet 之后 |
| **依赖注入** | ❌ 不能使用 @Autowired | ✅ 可以使用 Spring Bean |
| **拦截范围** | 所有请求（包括静态资源） | 只拦截 Controller 请求 |
| **执行顺序** | Filter → Interceptor → Controller | Interceptor → Controller |
| **典型用途** | 字符编码、CORS、安全过滤 | 权限校验、日志记录、性能监控 |

---

**过滤器实现**：

```java
@Component
@Order(1)  // 执行顺序
public class CorsFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // 设置 CORS 头
        httpResponse.setHeader("Access-Control-Allow-Origin", "*");
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        
        // 处理预检请求
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        
        // 继续执行下一个过滤器或 Servlet
        chain.doFilter(request, response);
    }
}
```

**拦截器实现**：

```java
@Component
public class AuthInterceptor implements HandlerInterceptor {
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        
        // 1. 获取 Token
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            response.setStatus(401);
            response.getWriter().write("{\"code\":401,\"message\":\"未登录\"}");
            return false;
        }
        
        // 2. 验证 Token
        token = token.substring(7);
        if (!jwtTokenProvider.validateToken(token)) {
            response.setStatus(401);
            response.getWriter().write("{\"code\":401,\"message\":\"Token 无效或已过期\"}");
            return false;
        }
        
        // 3. 将用户信息放入请求上下文
        Claims claims = jwtTokenProvider.parseToken(token);
        Long userId = Long.parseLong(claims.getSubject());
        UserContext.setUserId(userId);
        
        return true;
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
                               Object handler, Exception ex) throws Exception {
        // 清理 ThreadLocal，防止内存泄漏
        UserContext.clear();
    }
}

// 注册拦截器
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    @Autowired
    private AuthInterceptor authInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
            .addPathPatterns("/api/**")      // 拦截所有 API 请求
            .excludePathPatterns("/api/auth/login", "/api/auth/register");  // 排除登录注册
    }
}
```

**实际应用场景**：

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| 跨域配置（CORS） | Filter | 需要在最早阶段处理 |
| 字符编码转换 | Filter | Servlet 规范要求 |
| JWT 认证 | Interceptor | 需要依赖 Spring Bean |
| 权限校验 | Interceptor | 需要访问数据库 |
| 日志记录 | Interceptor | 需要记录 Controller 信息 |
| 性能监控 | Interceptor | 需要统计接口耗时 |

---

### ❓ 面试官：Spring MVC 如何处理文件上传？【初级】
*频率：🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
使用 **`MultipartFile`** 接收上传文件，配置最大文件大小限制，保存到本地磁盘或 OSS（阿里云/腾讯云）。

**📝 完整实现方案：**

#### 1. 配置文件大小限制

```yaml
# application.yml
spring:
  servlet:
    multipart:
      max-file-size: 10MB        # 单个文件最大 10MB
      max-request-size: 50MB     # 整个请求最大 50MB
```

#### 2. 单文件上传

```java
@RestController
@RequestMapping("/api/files")
public class FileUploadController {
    
    @Value("${file.upload-path:/uploads}")
    private String uploadPath;
    
    /**
     * 单文件上传
     */
    @PostMapping("/upload")
    public ApiResponse<FileVO> uploadFile(@RequestParam("file") MultipartFile file) {
        // 1. 校验文件
        if (file.isEmpty()) {
            throw new BusinessException(400, "文件不能为空");
        }
        
        // 2. 校验文件类型
        String contentType = file.getContentType();
        if (!isAllowedType(contentType)) {
            throw new BusinessException(400, "不支持的文件类型");
        }
        
        // 3. 生成唯一文件名
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String filename = UUID.randomUUID().toString() + extension;
        
        // 4. 保存文件
        String filePath = uploadPath + "/" + filename;
        try {
            file.transferTo(new File(filePath));
        } catch (IOException e) {
            log.error("文件保存失败", e);
            throw new BusinessException(500, "文件保存失败");
        }
        
        // 5. 返回文件信息
        FileVO fileVO = new FileVO();
        fileVO.setFilename(filename);
        fileVO.setUrl("/files/" + filename);
        fileVO.setSize(file.getSize());
        fileVO.setContentType(contentType);
        
        return ApiResponse.success(fileVO);
    }
    
    private boolean isAllowedType(String contentType) {
        List<String> allowedTypes = Arrays.asList(
            "image/jpeg", "image/png", "image/gif",
            "application/pdf", "application/msword"
        );
        return allowedTypes.contains(contentType);
    }
    
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
}
```

#### 3. 多文件上传

```java
/**
 * 多文件上传
 */
@PostMapping("/upload-batch")
public ApiResponse<List<FileVO>> uploadFiles(@RequestParam("files") MultipartFile[] files) {
    List<FileVO> fileVOList = new ArrayList<>();
    
    for (MultipartFile file : files) {
        if (!file.isEmpty()) {
            FileVO fileVO = uploadSingleFile(file);
            fileVOList.add(fileVO);
        }
    }
    
    return ApiResponse.success(fileVOList);
}
```

#### 4. 上传到阿里云 OSS（生产环境推荐）

```java
@Service
public class OssFileService {
    
    @Value("${aliyun.oss.endpoint}")
    private String endpoint;
    
    @Value("${aliyun.oss.access-key-id}")
    private String accessKeyId;
    
    @Value("${aliyun.oss.access-key-secret}")
    private String accessKeySecret;
    
    @Value("${aliyun.oss.bucket-name}")
    private String bucketName;
    
    public String uploadToOss(MultipartFile file) throws IOException {
        // 1. 创建 OSS 客户端
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        
        try {
            // 2. 生成文件名
            String filename = UUID.randomUUID().toString() + getFileExtension(file.getOriginalFilename());
            
            // 3. 上传文件
            ossClient.putObject(bucketName, filename, file.getInputStream());
            
            // 4. 返回访问 URL
            return "https://" + bucketName + "." + endpoint + "/" + filename;
            
        } finally {
            ossClient.shutdown();
        }
    }
}
```

**前端调用示例**：

```vue
<template>
  <el-upload
    action="/api/files/upload"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
    accept="image/*"
  >
    <el-button type="primary">点击上传</el-button>
  </el-upload>
</template>

<script setup>
function beforeUpload(file) {
  const isImage = file.type.startsWith('image/');
  const isLt10M = file.size / 1024 / 1024 < 10;
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件');
    return false;
  }
  if (!isLt10M) {
    ElMessage.error('图片大小不能超过 10MB');
    return false;
  }
  return true;
}

function handleSuccess(response) {
  if (response.code === 200) {
    ElMessage.success('上传成功');
    console.log('文件URL:', response.data.url);
  } else {
    ElMessage.error(response.message);
  }
}
</script>
```

---

### ❓ 面试官：Spring MVC 如何实现 RESTful 风格的 API？【初级】
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
RESTful 是一种设计风格，核心是 **用 HTTP 方法表示操作类型**（GET 查询、POST 创建、PUT 更新、DELETE 删除），**用 URL 表示资源**（`/api/users`、`/api/users/1`）。Spring MVC 通过 `@RestController`、`@RequestMapping`、`@GetMapping` 等注解轻松实现。

**📝 RESTful 设计规范：**

#### 1. URL 设计原则

```
✅ 正确做法：
GET    /api/users           # 查询用户列表
GET    /api/users/1         # 查询单个用户
POST   /api/users           # 创建用户
PUT    /api/users/1         # 全量更新用户
PATCH  /api/users/1         # 部分更新用户
DELETE /api/users/1         # 删除用户

❌ 错误做法：
GET    /api/getUsers
POST   /api/createUser
POST   /api/updateUser
POST   /api/deleteUser
```

**原则**：
- ✅ URL 中只包含**名词**（资源），不包含动词
- ✅ 使用**复数形式**表示资源集合（`/api/users` 而非 `/api/user`）
- ✅ 使用**嵌套 URL** 表示子资源（`/api/users/1/orders` 查询用户的订单）
- ✅ 使用**查询参数**进行过滤、排序、分页（`/api/users?page=1&size=10&status=active`）

#### 2. 完整示例

```java
@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    
    @Autowired
    private CustomerService customerService;
    
    /**
     * 查询客户列表（支持分页、筛选）
     * GET /api/customers?page=1&size=10&keyword=张三&status=1
     */
    @GetMapping
    public ApiResponse<Page<CustomerVO>> listCustomers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status) {
        
        Page<CustomerVO> result = customerService.list(page, size, keyword, status);
        return ApiResponse.success(result);
    }
    
    /**
     * 查询单个客户
     * GET /api/customers/123
     */
    @GetMapping("/{id}")
    public ApiResponse<CustomerVO> getCustomer(@PathVariable Long id) {
        CustomerVO customer = customerService.getById(id);
        return ApiResponse.success(customer);
    }
    
    /**
     * 创建客户
     * POST /api/customers
     * Body: { customerName, phone, email, ... }
     */
    @PostMapping
    public ApiResponse<CustomerVO> createCustomer(@RequestBody @Valid CustomerDTO dto) {
        CustomerVO customer = customerService.create(dto);
        return ApiResponse.success(customer);
    }
    
    /**
     * 全量更新客户
     * PUT /api/customers/123
     * Body: { customerName, phone, email, ... }（所有字段）
     */
    @PutMapping("/{id}")
    public ApiResponse<CustomerVO> updateCustomer(
            @PathVariable Long id,
            @RequestBody @Valid CustomerDTO dto) {
        CustomerVO customer = customerService.update(id, dto);
        return ApiResponse.success(customer);
    }
    
    /**
     * 部分更新客户
     * PATCH /api/customers/123
     * Body: { phone: "新手机号" }（只更新手机号）
     */
    @PatchMapping("/{id}")
    public ApiResponse<CustomerVO> patchCustomer(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        CustomerVO customer = customerService.patch(id, updates);
        return ApiResponse.success(customer);
    }
    
    /**
     * 删除客户
     * DELETE /api/customers/123
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteById(id);
        return ApiResponse.success(null);
    }
    
    /**
     * 查询客户的订单列表（子资源）
     * GET /api/customers/123/orders
     */
    @GetMapping("/{customerId}/orders")
    public ApiResponse<List<OrderVO>> listCustomerOrders(@PathVariable Long customerId) {
        List<OrderVO> orders = orderService.listByCustomerId(customerId);
        return ApiResponse.success(orders);
    }
}
```

#### 3. HTTP 状态码规范

| 状态码 | 含义 | 使用场景 |
|--------|------|---------|
| 200 OK | 成功 | GET/PUT/PATCH 成功 |
| 201 Created | 已创建 | POST 创建成功 |
| 204 No Content | 无内容 | DELETE 成功 |
| 400 Bad Request | 请求参数错误 | 参数校验失败 |
| 401 Unauthorized | 未认证 | Token 缺失或无效 |
| 403 Forbidden | 无权限 | 权限不足 |
| 404 Not Found | 资源不存在 | ID 不存在 |
| 409 Conflict | 冲突 | 数据重复（如用户名已存在） |
| 429 Too Many Requests | 请求过于频繁 | 触发限流 |
| 500 Internal Server Error | 服务器错误 | 系统异常 |

**返回示例**：

```json
// 成功响应
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 123,
    "customerName": "某某公司",
    "phone": "13800138000"
  },
  "timestamp": 1700000000000
}

// 错误响应
{
  "code": 404,
  "message": "客户不存在",
  "data": null,
  "timestamp": 1700000000000
}
```

---

### 🎯 面试加分项

"在实际项目中，我们基于 Spring MVC 构建了 CRM/OA/ERP 系统的后端 API，总结了以下最佳实践：

1. **统一响应格式**：所有接口返回 `ApiResponse<T>`，包含 code、message、data、timestamp，前端处理更简单

2. **全局异常处理**：使用 `@RestControllerAdvice` 统一捕获异常，避免每个 Controller 都写 try-catch

3. **参数校验**：使用 `@Valid` + JSR-303 注解（`@NotBlank`、`@Email` 等），在 Controller 层就拦截非法参数

4. **JWT 认证**：通过 Interceptor 拦截所有 API 请求，验证 Token 有效性，将用户信息放入 ThreadLocal

5. **文件上传**：小文件存本地，大文件上传到阿里云 OSS，配置大小限制防止恶意上传

6. **RESTful 规范**：严格遵循 RESTful 设计风格，URL 语义清晰，HTTP 方法表达操作意图

这些实践让我们的 API 接口更加规范、稳定、易维护。"