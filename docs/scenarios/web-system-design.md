 # Web 系统架构设计与开发实战

---

### ❓ 面试官：如果让你从零设计一个中型的电商后台管理系统（包含商品管理、订单管理、用户管理、数据统计），你会如何设计整体架构？【中高级】
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
采用 **"前后端分离 + 轻量级单体架构"**，前端 Vue3 + Element Plus，后端 Spring Boot + MyBatis-Plus，数据库 MySQL + Redis 缓存。不盲目上微服务，优先保证快速交付和易维护性。

**📝 完整架构设计方案：**

#### 1. 技术选型（实用主义导向）

**前端技术栈**：
- **框架**：Vue 3 + TypeScript + Vite
- **UI 组件库**：Element Plus（成熟稳定，组件丰富）
- **状态管理**：Pinia（比 Vuex 更简洁）
- **路由**：Vue Router 4
- **HTTP 请求**：Axios（封装拦截器处理 Token、错误统一提示）
- **图表**：ECharts（数据可视化）

**后端技术栈**：
- **框架**：Spring Boot 2.7+（稳定版本）
- **ORM**：MyBatis-Plus（简化 CRUD，支持分页、条件构造器）
- **数据库**：MySQL 8.0（主从复制预留扩展空间）
- **缓存**：Redis 6+（热点数据缓存、分布式锁）
- **权限控制**：Spring Security + JWT（无状态认证）
- **文档**：Knife4j（Swagger 增强版，在线接口文档）
- **工具类**：Hutool（国产工具库，减少重复造轮子）

**部署方案**：
- **容器化**：Docker + Docker Compose（一键部署）
- **反向代理**：Nginx（静态资源托管、负载均衡）
- **日志**：Logback + ELK（可选，初期直接看日志文件）

---

#### 2. 数据库设计核心要点

**关键表结构设计**：

```sql
-- 1. 用户表（支持多角色）
CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(128) NOT NULL COMMENT '加密密码',
    real_name VARCHAR(64) COMMENT '真实姓名',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(128) COMMENT '邮箱',
    status TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
    last_login_time DATETIME COMMENT '最后登录时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_email (email)
);

-- 2. 角色表
CREATE TABLE sys_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_code VARCHAR(64) NOT NULL UNIQUE COMMENT '角色编码：admin/operator/viewer',
    role_name VARCHAR(64) NOT NULL COMMENT '角色名称',
    description VARCHAR(255) COMMENT '角色描述'
);

-- 3. 用户-角色关联表（多对多）
CREATE TABLE sys_user_role (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    INDEX idx_role_id (role_id)
);

-- 4. 菜单/权限表（树形结构）
CREATE TABLE sys_menu (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT DEFAULT 0 COMMENT '父菜单ID',
    menu_name VARCHAR(64) NOT NULL COMMENT '菜单名称',
    menu_type TINYINT COMMENT '类型：1目录 2菜单 3按钮',
    path VARCHAR(128) COMMENT '路由路径',
    component VARCHAR(128) COMMENT '组件路径',
    permission VARCHAR(128) COMMENT '权限标识：product:list',
    sort_order INT DEFAULT 0 COMMENT '排序',
    icon VARCHAR(64) COMMENT '图标',
    visible TINYINT DEFAULT 1 COMMENT '是否显示'
);

-- 5. 商品表（核心业务表）
CREATE TABLE product (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_no VARCHAR(64) NOT NULL UNIQUE COMMENT '商品编号',
    product_name VARCHAR(128) NOT NULL COMMENT '商品名称',
    category_id BIGINT COMMENT '分类ID',
    brand_id BIGINT COMMENT '品牌ID',
    price DECIMAL(10,2) NOT NULL COMMENT '售价',
    cost_price DECIMAL(10,2) COMMENT '成本价',
    stock INT DEFAULT 0 COMMENT '库存',
    status TINYINT DEFAULT 1 COMMENT '状态：0下架 1上架',
    main_image VARCHAR(255) COMMENT '主图URL',
    detail_html TEXT COMMENT '详情HTML',
    sales_count INT DEFAULT 0 COMMENT '销量',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_product_name (product_name)
);

-- 6. 订单表
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(64) NOT NULL UNIQUE COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总额',
    pay_amount DECIMAL(10,2) COMMENT '实付金额',
    status TINYINT DEFAULT 0 COMMENT '状态：0待支付 1已支付 2已发货 3已完成 4已取消',
    pay_time DATETIME COMMENT '支付时间',
    delivery_time DATETIME COMMENT '发货时间',
    complete_time DATETIME COMMENT '完成时间',
    receiver_name VARCHAR(64) COMMENT '收货人',
    receiver_phone VARCHAR(20) COMMENT '收货电话',
    receiver_address VARCHAR(255) COMMENT '收货地址',
    remark VARCHAR(500) COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_order_no (order_no),
    INDEX idx_status (status),
    INDEX idx_create_time (create_time)
);

-- 7. 订单明细表
CREATE TABLE order_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL COMMENT '订单ID',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    product_name VARCHAR(128) COMMENT '商品名称快照',
    product_image VARCHAR(255) COMMENT '商品图片快照',
    price DECIMAL(10,2) NOT NULL COMMENT '下单时单价',
    quantity INT NOT NULL COMMENT '购买数量',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '小计金额',
    INDEX idx_order_id (order_id)
);
```

**设计原则**：
1. **所有表必须有主键**：使用 BIGINT 自增或雪花算法 ID
2. **关键字段加索引**：查询频繁的字段（如 user_id、status、create_time）
3. **冗余字段优化查询**：订单明细表冗余商品名称和图片，避免关联查询
4. **软删除**：重要业务表增加 `deleted` 字段，不物理删除数据
5. **审计字段**：所有表都有 `create_time` 和 `update_time`

---

#### 3. 后端分层架构设计

**标准三层架构**：

```
com.example.ecommerce
├── controller      # 控制层（接收请求、参数校验、返回响应）
├── service         # 业务层（核心业务逻辑、事务控制）
│   └── impl        # 业务实现类
├── mapper          # 数据访问层（MyBatis-Plus Mapper）
├── entity          # 实体类（对应数据库表）
├── dto             # 数据传输对象（接收前端参数）
├── vo              # 视图对象（返回给前端的数据）
├── config          # 配置类（Security、Redis、Swagger 等）
├── common          # 通用模块
│   ├── Result.java         # 统一响应体
│   ├── ResultCode.java     # 响应码枚举
│   ├── BusinessException.java  # 业务异常
│   └── GlobalExceptionHandler.java  # 全局异常处理器
├── interceptor     # 拦截器（JWT 验证、日志记录）
└── utils           # 工具类（JWT 生成、Excel 导出等）
```

**统一响应体设计**：
```java
@Data
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    private Long timestamp;
    
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMessage("success");
        result.setData(data);
        result.setTimestamp(System.currentTimeMillis());
        return result;
    }
    
    public static <T> Result<T> error(Integer code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        result.setTimestamp(System.currentTimeMillis());
        return result;
    }
}
```

**全局异常处理**：
```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    /**
     * 业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        log.warn("业务异常: {}", e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }
    
    /**
     * 参数校验异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldError().getDefaultMessage();
        return Result.error(400, message);
    }
    
    /**
     * 系统异常
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("系统异常", e);
        return Result.error(500, "系统繁忙，请稍后再试");
    }
}
```

---

#### 4. 权限控制设计（RBAC 模型）

**核心思路**：基于角色的访问控制（Role-Based Access Control）

**JWT Token 结构**：
```java
@Component
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;  // 过期时间（毫秒）
    
    /**
     * 生成 Token
     */
    public String generateToken(UserDetails userDetails, List<String> roles) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("roles", roles)  // 将角色放入 Claims
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }
    
    /**
     * 解析 Token
     */
    public Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }
}
```

**权限拦截器**：
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        
        try {
            // 1. 从请求头获取 Token
            String token = resolveToken(request);
            
            if (token != null && tokenProvider.validateToken(token)) {
                // 2. 解析 Token 获取用户名
                Claims claims = tokenProvider.parseToken(token);
                String username = claims.getSubject();
                
                // 3. 加载用户信息和权限
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                // 4. 构建认证对象
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                    );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // 5. 设置到 SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            log.error("JWT 认证失败", e);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

**权限注解使用**：
```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @GetMapping
    @PreAuthorize("hasAuthority('product:list')")  // 需要商品列表权限
    public Result<Page<ProductVO>> listProducts(@RequestParam(defaultValue = "1") int page,
                                                @RequestParam(defaultValue = "10") int size) {
        // ...
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('product:add')")  // 需要新增商品权限
    public Result<Void> addProduct(@RequestBody @Valid ProductDTO dto) {
        // ...
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('product:edit')")  // 需要编辑商品权限
    public Result<Void> updateProduct(@PathVariable Long id, @RequestBody @Valid ProductDTO dto) {
        // ...
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('product:delete')")  // 需要删除商品权限
    public Result<Void> deleteProduct(@PathVariable Long id) {
        // ...
    }
}
```

---

#### 5. 缓存策略设计

**哪些数据需要缓存**：
1. **字典数据**：商品分类、品牌列表（更新频率低，读取频繁）
2. **用户信息**：登录后的用户基本信息（减少数据库查询）
3. **商品详情**：热门商品的详细信息（高并发读取）
4. **验证码**：短信/图形验证码（设置短过期时间）
5. **统计数据**：首页的销量排行、今日订单数（定时刷新）

**Redis 缓存实现**：
```java
@Service
public class ProductService {
    
    @Autowired
    private ProductMapper productMapper;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    private static final String PRODUCT_CACHE_KEY = "product:detail:";
    private static final long CACHE_EXPIRE_HOURS = 24;
    
    /**
     * 查询商品详情（带缓存）
     */
    public ProductVO getProductDetail(Long productId) {
        // 1. 先查缓存
        String cacheKey = PRODUCT_CACHE_KEY + productId;
        ProductVO cachedProduct = (ProductVO) redisTemplate.opsForValue().get(cacheKey);
        if (cachedProduct != null) {
            return cachedProduct;
        }
        
        // 2. 缓存未命中，查数据库
        Product product = productMapper.selectById(productId);
        if (product == null) {
            throw new BusinessException(404, "商品不存在");
        }
        
        ProductVO vo = convertToVO(product);
        
        // 3. 写入缓存
        redisTemplate.opsForValue().set(cacheKey, vo, CACHE_EXPIRE_HOURS, TimeUnit.HOURS);
        
        return vo;
    }
    
    /**
     * 更新商品（删除缓存）
     */
    @Transactional
    public void updateProduct(Long productId, ProductDTO dto) {
        // 1. 更新数据库
        Product product = new Product();
        BeanUtils.copyProperties(dto, product);
        product.setId(productId);
        productMapper.updateById(product);
        
        // 2. 删除缓存（下次查询时重新加载）
        String cacheKey = PRODUCT_CACHE_KEY + productId;
        redisTemplate.delete(cacheKey);
    }
}
```

**缓存穿透防护**：
```java
/**
 * 查询商品详情（防止缓存穿透）
 */
public ProductVO getProductDetailWithProtection(Long productId) {
    String cacheKey = PRODUCT_CACHE_KEY + productId;
    
    // 1. 查缓存
    ProductVO cachedProduct = (ProductVO) redisTemplate.opsForValue().get(cacheKey);
    if (cachedProduct != null) {
        // 特殊值表示数据库中也不存在
        if ("NULL".equals(cachedProduct.toString())) {
            return null;
        }
        return cachedProduct;
    }
    
    // 2. 查数据库
    Product product = productMapper.selectById(productId);
    
    if (product == null) {
        // 3. 数据库中也不存在，缓存空值（短过期时间）
        redisTemplate.opsForValue().set(cacheKey, "NULL", 5, TimeUnit.MINUTES);
        return null;
    }
    
    ProductVO vo = convertToVO(product);
    
    // 4. 写入缓存
    redisTemplate.opsForValue().set(cacheKey, vo, CACHE_EXPIRE_HOURS, TimeUnit.HOURS);
    
    return vo;
}
```

---

#### 6. 前端工程化设计

**项目结构**：
```
src
├── api              # API 接口封装
│   ├── product.ts   # 商品相关接口
│   ├── order.ts     # 订单相关接口
│   └── user.ts      # 用户相关接口
├── components       # 公共组件
│   ├── UploadImage.vue    # 图片上传组件
│   ├── SearchForm.vue     # 搜索表单组件
│   └── Pagination.vue     # 分页组件
├── views            # 页面组件
│   ├── product
│   │   ├── List.vue       # 商品列表
│   │   └── Edit.vue       # 商品编辑
│   ├── order
│   │   └── List.vue       # 订单列表
│   └── dashboard
│       └── Index.vue      # 数据看板
├── router           # 路由配置
│   └── index.ts
├── store            # 状态管理
│   ├── user.ts      # 用户信息
│   └── app.ts       # 应用配置
├── utils            # 工具函数
│   ├── request.ts   # Axios 封装
│   ├── auth.ts      # 认证工具
│   └── validate.ts  # 表单验证
├── types            # TypeScript 类型定义
└── styles           # 全局样式
```

**Axios 封装**：
```typescript
// utils/request.ts
import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败');
      
      // Token 过期，跳转登录页
      if (res.code === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
      
      return Promise.reject(new Error(res.message));
    }
    
    return res.data;
  },
  error => {
    ElMessage.error(error.message || '网络错误');
    return Promise.reject(error);
  }
);

export default service;
```

**API 接口封装**：
```typescript
// api/product.ts
import request from '@/utils/request';

export interface ProductListParams {
  page: number;
  size: number;
  productName?: string;
  categoryId?: number;
  status?: number;
}

export interface ProductVO {
  id: number;
  productNo: string;
  productName: string;
  price: number;
  stock: number;
  status: number;
  createTime: string;
}

// 查询商品列表
export function getProductList(params: ProductListParams) {
  return request.get<any, { records: ProductVO[]; total: number }>('/api/products', { params });
}

// 新增商品
export function addProduct(data: any) {
  return request.post('/api/products', data);
}

// 更新商品
export function updateProduct(id: number, data: any) {
  return request.put(`/api/products/${id}`, data);
}

// 删除商品
export function deleteProduct(id: number) {
  return request.delete(`/api/products/${id}`);
}
```

---

#### 7. 性能优化策略

**后端优化**：
1. **数据库索引优化**：为查询频繁的字段添加索引
2. **分页查询**：避免一次性加载大量数据，使用 MyBatis-Plus 分页插件
3. **批量操作**：批量插入/更新使用 `saveBatch()` / `updateBatchById()`
4. **异步处理**：非核心业务（如发送通知邮件）使用 `@Async` 异步执行
5. **连接池调优**：HikariCP 最大连接数设置为 `CPU 核数 * 2 + 1`

**前端优化**：
1. **路由懒加载**：按需加载页面组件
   ```typescript
   const ProductList = () => import('@/views/product/List.vue');
   ```
2. **图片懒加载**：使用 `v-lazy` 指令延迟加载图片
3. **防抖节流**：搜索框输入使用防抖，按钮点击使用节流
4. **虚拟滚动**：大数据量表格使用虚拟滚动（如 `el-table-v2`）
5. **CDN 加速**：第三方库（Vue、Element Plus）使用 CDN 引入

---

### ❓ 面试官：你们的系统如何处理高并发场景？比如促销活动时的大量订单请求。【中高级】
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
对于中小型项目，不需要过度设计。采用 **"缓存抗读 + 队列抗写 + 限流保护"** 三板斧即可应对大部分高并发场景。

**📝 具体实施方案：**

#### 1. 读多写少场景（如商品详情页）
- **多级缓存**：本地缓存（Caffeine） + Redis 缓存 + 浏览器缓存
- **静态化**：商品详情页生成静态 HTML，推送到 CDN
- **读写分离**：查询走从库，写入走主库

#### 2. 写多场景（如下单）
- **异步削峰**：下单请求先入 RocketMQ/RabbitMQ，后台消费者慢慢处理
- **库存预扣**：Redis 原子操作预扣库存，防止超卖
- **幂等性保证**：订单号唯一索引 + 业务流水号去重

#### 3. 限流保护
- **网关层限流**：Nginx 限制单个 IP 的请求频率
- **应用层限流**：使用 Guava RateLimiter 或 Redis 滑动窗口
- **降级策略**：非核心功能（如推荐、评价）暂时关闭

---

### ❓ 面试官：你们如何做系统监控和日志排查？线上出了问题怎么快速定位？【中级】
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
建立 **"日志集中管理 + 关键指标监控 + 链路追踪"** 三位一体的监控体系，配合告警机制做到早发现、早定位、早解决。

**📝 监控体系搭建：**

#### 1. 日志规范
```java
// 统一日志格式：时间 | 级别 | 线程名 | 类名 | traceId | 消息
@Slf4j
@Service
public class OrderService {
    
    public void createOrder(OrderDTO dto) {
        String traceId = MDC.get("traceId");  // 从上下文获取 traceId
        log.info("[{}] 开始创建订单 | userId={} | amount={}", 
                 traceId, dto.getUserId(), dto.getAmount());
        
        try {
            // 业务逻辑
            log.info("[{}] 订单创建成功 | orderId={}", traceId, orderId);
        } catch (Exception e) {
            log.error("[{}] 订单创建失败 | userId={}", traceId, dto.getUserId(), e);
            throw e;
        }
    }
}
```

#### 2. 关键指标监控
- **JVM 监控**：堆内存使用率、GC 次数、线程数（使用 Prometheus + Grafana）
- **接口监控**：QPS、平均响应时间、错误率（使用 Micrometer）
- **数据库监控**：慢查询数量、连接池使用率
- **业务监控**：每日订单量、支付成功率、库存预警

#### 3. 告警规则
- 接口错误率 > 5% → 钉钉/企业微信告警
- 平均响应时间 > 2s → 检查慢查询
- JVM 堆内存使用率 > 80% → 准备扩容
- 数据库连接池使用率 > 90% → 检查是否有连接泄漏

#### 4. 快速定位问题
1. **根据用户反馈的时间点和操作**，在日志系统中搜索对应的 `traceId`
2. **查看完整的调用链路**，定位是哪个环节出错
3. **检查当时的系统指标**（CPU、内存、数据库负载）
4. **复现问题**：在测试环境模拟相同场景
5. **修复并验证**：热修复或发布新版本

---
