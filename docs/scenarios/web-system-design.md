 # Web 系统架构设计与开发实战

---

### ❓ 面试官：如果让你从零设计一个中型的企业级管理系统（CRM/OA/ERP/MES），你会如何设计整体架构？【中高级】
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
采用 **"前后端分离 + 轻量级单体架构"**，前端 Vue3 + Element Plus/Ant Design Vue，后端 Spring Boot + MyBatis-Plus，数据库 MySQL + Redis 缓存。不盲目上微服务，优先保证快速交付和易维护性，1-3 个月内完成 MVP 版本上线。

**📝 完整架构设计方案：**

#### 1. 技术选型（实用主义导向）

**前端技术栈**：
- **框架**：Vue 3 + TypeScript + Vite
- **UI 组件库**：Element Plus（通用）或 Ant Design Vue（企业级更专业）
- **状态管理**：Pinia（比 Vuex 更简洁）
- **路由**：Vue Router 4
- **HTTP 请求**：Axios（封装拦截器处理 Token、错误统一提示）
- **图表**：ECharts（数据看板、统计报表）
- **流程引擎**：bpmn-js（工作流可视化，OA/ERP 必备）

**后端技术栈**：
- **框架**：Spring Boot 2.7+（稳定版本）
- **ORM**：MyBatis-Plus（简化 CRUD，支持分页、条件构造器）
- **数据库**：MySQL 8.0（主从复制预留扩展空间）
- **缓存**：Redis 6+（热点数据缓存、分布式锁、Session 共享）
- **权限控制**：Spring Security + JWT（无状态认证，支持多端登录）
- **工作流引擎**：Flowable/Activiti（OA 审批流、ERP 业务流程）
- **文档**：Knife4j（Swagger 增强版，在线接口文档）
- **工具类**：Hutool（国产工具库，减少重复造轮子）
- **Excel 处理**：EasyExcel（大数据量导入导出，CRM/ERP 高频需求）

**部署方案**：
- **容器化**：Docker + Docker Compose（一键部署）
- **反向代理**：Nginx（静态资源托管、负载均衡、HTTPS）
- **日志**：Logback + ELK（可选，初期直接看日志文件）
- **监控**：Spring Boot Actuator + Prometheus + Grafana（可选）

---

#### 2. 数据库设计核心要点

**关键表结构设计**：

```
-- 1. 用户表（支持多角色、多部门）
CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(128) NOT NULL COMMENT '加密密码',
    real_name VARCHAR(64) COMMENT '真实姓名',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(128) COMMENT '邮箱',
    dept_id BIGINT COMMENT '部门ID',
    position VARCHAR(64) COMMENT '职位',
    status TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
    last_login_time DATETIME COMMENT '最后登录时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_email (email),
    INDEX idx_dept_id (dept_id)
);

-- 2. 部门表（树形结构）
CREATE TABLE sys_dept (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT DEFAULT 0 COMMENT '父部门ID',
    dept_name VARCHAR(64) NOT NULL COMMENT '部门名称',
    order_num INT DEFAULT 0 COMMENT '排序',
    leader VARCHAR(64) COMMENT '负责人',
    phone VARCHAR(20) COMMENT '联系电话',
    email VARCHAR(128) COMMENT '邮箱',
    status TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用'
);

-- 3. 角色表
CREATE TABLE sys_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_code VARCHAR(64) NOT NULL UNIQUE COMMENT '角色编码：admin/sales/manager',
    role_name VARCHAR(64) NOT NULL COMMENT '角色名称',
    description VARCHAR(255) COMMENT '角色描述',
    data_scope TINYINT DEFAULT 1 COMMENT '数据权限：1全部 2本部门 3本部门及子部门 4仅本人'
);

-- 4. 用户-角色关联表（多对多）
CREATE TABLE sys_user_role (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    INDEX idx_role_id (role_id)
);

-- 5. 菜单/权限表（树形结构）
CREATE TABLE sys_menu (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT DEFAULT 0 COMMENT '父菜单ID',
    menu_name VARCHAR(64) NOT NULL COMMENT '菜单名称',
    menu_type TINYINT COMMENT '类型：1目录 2菜单 3按钮',
    path VARCHAR(128) COMMENT '路由路径',
    component VARCHAR(128) COMMENT '组件路径',
    permission VARCHAR(128) COMMENT '权限标识：customer:list',
    sort_order INT DEFAULT 0 COMMENT '排序',
    icon VARCHAR(64) COMMENT '图标',
    visible TINYINT DEFAULT 1 COMMENT '是否显示'
);

-- 6. 客户表（CRM 核心）
CREATE TABLE crm_customer (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_no VARCHAR(64) NOT NULL UNIQUE COMMENT '客户编号',
    customer_name VARCHAR(128) NOT NULL COMMENT '客户名称',
    customer_type TINYINT COMMENT '类型：1企业 2个人',
    industry VARCHAR(64) COMMENT '所属行业',
    source VARCHAR(64) COMMENT '客户来源',
    level VARCHAR(32) COMMENT '客户等级：A/B/C',
    owner_id BIGINT COMMENT '负责人ID（销售）',
    phone VARCHAR(20) COMMENT '联系电话',
    email VARCHAR(128) COMMENT '邮箱',
    address VARCHAR(255) COMMENT '地址',
    status TINYINT DEFAULT 1 COMMENT '状态：1潜在 2跟进中 3成交 4流失',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_owner_id (owner_id),
    INDEX idx_status (status),
    INDEX idx_customer_name (customer_name)
);

-- 7. 跟进记录表（CRM）
CREATE TABLE crm_follow_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL COMMENT '客户ID',
    follow_type TINYINT COMMENT '跟进方式：1电话 2拜访 3邮件 4微信',
    content TEXT COMMENT '跟进内容',
    next_follow_time DATETIME COMMENT '下次跟进时间',
    operator_id BIGINT COMMENT '跟进人ID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customer_id (customer_id),
    INDEX idx_operator_id (operator_id)
);

-- 8. 审批流程表（OA/ERP 核心）
CREATE TABLE oa_approval (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    approval_no VARCHAR(64) NOT NULL UNIQUE COMMENT '审批单号',
    business_type VARCHAR(64) NOT NULL COMMENT '业务类型：leave/purchase/reimburse',
    business_id BIGINT COMMENT '业务数据ID',
    applicant_id BIGINT NOT NULL COMMENT '申请人ID',
    status TINYINT DEFAULT 0 COMMENT '状态：0草稿 1审批中 2已通过 3已拒绝 4已撤回',
    current_node VARCHAR(64) COMMENT '当前节点',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_applicant_id (applicant_id),
    INDEX idx_status (status)
);

-- 9. 审批记录表
CREATE TABLE oa_approval_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    approval_id BIGINT NOT NULL COMMENT '审批单ID',
    node_name VARCHAR(64) COMMENT '节点名称',
    approver_id BIGINT COMMENT '审批人ID',
    action TINYINT COMMENT '操作：1同意 2拒绝 3转交',
    comment VARCHAR(500) COMMENT '审批意见',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_approval_id (approval_id)
);

-- 10. 物料表（ERP/MES 核心）
CREATE TABLE erp_material (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    material_no VARCHAR(64) NOT NULL UNIQUE COMMENT '物料编码',
    material_name VARCHAR(128) NOT NULL COMMENT '物料名称',
    material_type TINYINT COMMENT '类型：1原材料 2半成品 3成品',
    spec VARCHAR(128) COMMENT '规格型号',
    unit VARCHAR(32) COMMENT '单位',
    price DECIMAL(10,2) COMMENT '单价',
    stock_quantity DECIMAL(10,2) DEFAULT 0 COMMENT '库存数量',
    safety_stock DECIMAL(10,2) COMMENT '安全库存',
    supplier_id BIGINT COMMENT '默认供应商ID',
    status TINYINT DEFAULT 1 COMMENT '状态：0停用 1启用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_material_no (material_no),
    INDEX idx_material_type (material_type)
);

-- 11. 工单表（MES 核心）
CREATE TABLE mes_work_order (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(64) NOT NULL UNIQUE COMMENT '工单号',
    product_id BIGINT NOT NULL COMMENT '产品ID',
    quantity INT NOT NULL COMMENT '计划数量',
    completed_quantity INT DEFAULT 0 COMMENT '已完成数量',
    status TINYINT DEFAULT 0 COMMENT '状态：0待生产 1生产中 2已完成 3已暂停',
    plan_start_time DATETIME COMMENT '计划开始时间',
    plan_end_time DATETIME COMMENT '计划结束时间',
    actual_start_time DATETIME COMMENT '实际开始时间',
    actual_end_time DATETIME COMMENT '实际结束时间',
    workshop_id BIGINT COMMENT '车间ID',
    line_id BIGINT COMMENT '产线ID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_no (order_no),
    INDEX idx_status (status),
    INDEX idx_plan_start_time (plan_start_time)
);

-- 12. 生产报工表（MES）
CREATE TABLE mes_production_report (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    work_order_id BIGINT NOT NULL COMMENT '工单ID',
    process_id BIGINT COMMENT '工序ID',
    quantity INT NOT NULL COMMENT '报工数量',
    qualified_quantity INT COMMENT '合格数量',
    defective_quantity INT COMMENT '不合格数量',
    operator_id BIGINT COMMENT '操作员ID',
    report_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '报工时间',
    remark VARCHAR(500) COMMENT '备注',
    INDEX idx_work_order_id (work_order_id),
    INDEX idx_report_time (report_time)
);
```

**设计原则**：
1. **所有表必须有主键**：使用 BIGINT 自增或雪花算法 ID
2. **关键字段加索引**：查询频繁的字段（如 owner_id、status、create_time）
3. **冗余字段优化查询**：避免频繁关联查询，适当冗余（如客户名称、物料名称）
4. **软删除**：重要业务表增加 `deleted` 字段，不物理删除数据
5. **审计字段**：所有表都有 `create_time` 和 `update_time`，关键表增加 `create_by` 和 `update_by`
6. **数据权限**：通过 `data_scope` 实现行级数据权限控制（本部门、本人等）

---

#### 3. 后端分层架构设计

**标准三层架构**：

```
com.example.enterprise
├── controller      # 控制层（接收请求、参数校验、返回响应）
│   ├── crm         # CRM 模块控制器
│   ├── oa          # OA 模块控制器
│   ├── erp         # ERP 模块控制器
│   └── mes         # MES 模块控制器
├── service         # 业务层（核心业务逻辑、事务控制）
│   ├── impl        # 业务实现类
│   └── workflow    # 工作流服务
├── mapper          # 数据访问层（MyBatis-Plus Mapper）
├── entity          # 实体类（对应数据库表）
├── dto             # 数据传输对象（接收前端参数）
├── vo              # 视图对象（返回给前端的数据）
├── config          # 配置类（Security、Redis、Swagger、Flowable 等）
├── common          # 通用模块
│   ├── Result.java              # 统一响应体
│   ├── ResultCode.java          # 响应码枚举
│   ├── BusinessException.java   # 业务异常
│   ├── GlobalExceptionHandler.java  # 全局异常处理器
│   └── DataScopeHandler.java    # 数据权限处理器
├── interceptor     # 拦截器（JWT 验证、日志记录、数据权限）
├── aspect          # AOP 切面（操作日志、数据权限）
└── utils           # 工具类（JWT 生成、Excel 导出、工作流工具等）
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
     * 权限不足
     */
    @ExceptionHandler(AccessDeniedException.class)
    public Result<Void> handleAccessDeniedException(AccessDeniedException e) {
        return Result.error(403, "权限不足，无法访问");
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

#### 4. 权限控制设计（RBAC + 数据权限）

**核心思路**：基于角色的访问控制（RBAC）+ 行级数据权限控制

**JWT Token 结构**：
```java
@Component
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;  // 过期时间（毫秒），默认 2 小时
    
    /**
     * 生成 Token
     */
    public String generateToken(Long userId, String username, List<String> roles, Long deptId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("username", username)
                .claim("roles", roles)
                .claim("deptId", deptId)  // 部门ID，用于数据权限
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS256, secret)
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
    
    /**
     * 验证 Token
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
```

**权限拦截器**：
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        
        try {
            // 1. 从请求头获取 Token
            String token = resolveToken(request);
            
            if (token != null && tokenProvider.validateToken(token)) {
                // 2. 解析 Token 获取用户信息
                Claims claims = tokenProvider.parseToken(token);
                Long userId = Long.parseLong(claims.getSubject());
                String username = claims.get("username", String.class);
                List<String> roles = claims.get("roles", List.class);
                Long deptId = claims.get("deptId", Long.class);
                
                // 3. 构建认证对象
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        userId, null, roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList())
                    );
                
                // 4. 将用户信息放入 SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                // 5. 将用户信息放入 ThreadLocal，供后续使用
                UserContext.setUserId(userId);
                UserContext.setUsername(username);
                UserContext.setDeptId(deptId);
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

**数据权限拦截（AOP 实现）**：
```java
@Aspect
@Component
public class DataScopeAspect {
    
    /**
     * 拦截带有 @DataScope 注解的方法
     */
    @Before("@annotation(dataScope)")
    public void doBefore(JoinPoint point, DataScope dataScope) {
        // 获取当前用户信息
        Long userId = UserContext.getUserId();
        Long deptId = UserContext.getDeptId();
        List<String> roles = UserContext.getRoles();
        
        // 如果是超级管理员，不限制数据权限
        if (roles.contains("admin")) {
            return;
        }
        
        // 根据角色的数据范围构造 SQL 过滤条件
        String dataScopeFilter = buildDataScopeFilter(dataScope, userId, deptId);
        
        // 将过滤条件放入参数中，供 Mapper 使用
        Map<String, Object> params = new HashMap<>();
        params.put("dataScope", dataScopeFilter);
        
        // 如果方法参数中有 Map 类型，注入过滤条件
        for (Object arg : point.getArgs()) {
            if (arg instanceof Map) {
                ((Map<?, ?>) arg).putAll(params);
            }
        }
    }
    
    /**
     * 构造数据权限过滤条件
     */
    private String buildDataScopeFilter(DataScope dataScope, Long userId, Long deptId) {
        // 根据角色查询数据权限
        Integer dataScopeType = getDataScopeTypeByRole();
        
        switch (dataScopeType) {
            case 1: // 全部数据权限
                return "";
            case 2: // 本部门数据权限
                return "AND dept_id = " + deptId;
            case 3: // 本部门及子部门数据权限
                return "AND dept_id IN (SELECT id FROM sys_dept WHERE ancestors LIKE '%" + deptId + "%')";
            case 4: // 仅本人数据权限
                return "AND create_by = " + userId;
            default:
                return "AND 1 = 0"; // 默认无权限
        }
    }
}

// 使用示例
@DataScope(deptAlias = "d", userAlias = "u")
List<CustomerVO> selectCustomerList(Map<String, Object> params);
```

**权限注解使用**：
```java
@RestController
@RequestMapping("/api/crm/customers")
public class CustomerController {
    
    @GetMapping
    @PreAuthorize("hasAuthority('crm:customer:list')")  // 需要客户列表权限
    public Result<Page<CustomerVO>> listCustomers(@RequestParam(defaultValue = "1") int page,
                                                   @RequestParam(defaultValue = "10") int size) {
        // ...
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('crm:customer:add')")  // 需要新增客户权限
    public Result<Void> addCustomer(@RequestBody @Valid CustomerDTO dto) {
        // ...
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('crm:customer:edit')")  // 需要编辑客户权限
    public Result<Void> updateCustomer(@PathVariable Long id, @RequestBody @Valid CustomerDTO dto) {
        // ...
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('crm:customer:delete')")  // 需要删除客户权限
    public Result<Void> deleteCustomer(@PathVariable Long id) {
        // ...
    }
}
```

---

#### 5. 缓存策略设计

**哪些数据需要缓存**：
1. **字典数据**：客户类型、行业分类、物料类型、审批状态等（更新频率低，读取频繁）
2. **用户信息**：登录后的用户基本信息、权限列表（减少数据库查询）
3. **组织架构**：部门树、岗位列表（变化少，查询多）
4. **验证码**：短信/图形验证码（设置短过期时间 5 分钟）
5. **统计数据**：今日新增客户数、待审批数量、生产进度（定时刷新）
6. **流程定义**：工作流 BPMN  XML（解析耗时，缓存提升性能）

**Redis 缓存实现**：
```java
@Service
public class CustomerService {
    
    @Autowired
    private CustomerMapper customerMapper;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    private static final String CUSTOMER_CACHE_KEY = "crm:customer:";
    private static final long CACHE_EXPIRE_HOURS = 2;  // 客户信息缓存 2 小时
    
    /**
     * 查询客户详情（带缓存）
     */
    public CustomerVO getCustomerDetail(Long customerId) {
        // 1. 先查缓存
        String cacheKey = CUSTOMER_CACHE_KEY + customerId;
        CustomerVO cachedCustomer = (CustomerVO) redisTemplate.opsForValue().get(cacheKey);
        if (cachedCustomer != null) {
            return cachedCustomer;
        }
        
        // 2. 缓存未命中，查数据库
        Customer customer = customerMapper.selectById(customerId);
        if (customer == null) {
            throw new BusinessException(404, "客户不存在");
        }
        
        CustomerVO vo = convertToVO(customer);
        
        // 3. 写入缓存
        redisTemplate.opsForValue().set(cacheKey, vo, CACHE_EXPIRE_HOURS, TimeUnit.HOURS);
        
        return vo;
    }
    
    /**
     * 更新客户（删除缓存）
     */
    @Transactional
    public void updateCustomer(Long customerId, CustomerDTO dto) {
        // 1. 更新数据库
        Customer customer = new Customer();
        BeanUtils.copyProperties(dto, customer);
        customer.setId(customerId);
        customerMapper.updateById(customer);
        
        // 2. 删除缓存（下次查询时重新加载）
        String cacheKey = CUSTOMER_CACHE_KEY + customerId;
        redisTemplate.delete(cacheKey);
    }
}
```

**缓存穿透防护**：
```java
/**
 * 查询客户详情（防止缓存穿透）
 */
public CustomerVO getCustomerDetailWithProtection(Long customerId) {
    String cacheKey = CUSTOMER_CACHE_KEY + customerId;
    
    // 1. 查缓存
    CustomerVO cachedCustomer = (CustomerVO) redisTemplate.opsForValue().get(cacheKey);
    if (cachedCustomer != null) {
        // 特殊值表示数据库中也不存在
        if ("NULL".equals(cachedCustomer.toString())) {
            return null;
        }
        return cachedCustomer;
    }
    
    // 2. 查数据库
    Customer customer = customerMapper.selectById(customerId);
    
    if (customer == null) {
        // 3. 数据库中也不存在，缓存空值（短过期时间）
        redisTemplate.opsForValue().set(cacheKey, "NULL", 5, TimeUnit.MINUTES);
        return null;
    }
    
    CustomerVO vo = convertToVO(customer);
    
    // 4. 写入缓存
    redisTemplate.opsForValue().set(cacheKey, vo, CACHE_EXPIRE_HOURS, TimeUnit.HOURS);
    
    return vo;
}
```

**企业级系统典型缓存场景**：

1. **CRM - 客户公海池**
```java
// 缓存今日可领取的客户列表（每 10 分钟刷新）
@Scheduled(fixedRate = 10 * 60 * 1000)
public void refreshPublicCustomerCache() {
    List<Customer> publicCustomers = customerMapper.selectPublicCustomers();
    redisTemplate.opsForValue().set("crm:public:today", publicCustomers, 10, TimeUnit.MINUTES);
}
```

2. **OA - 待办事项统计**
```java
// 缓存用户待办数量（实时更新，过期时间短）
public int getPendingApprovalCount(Long userId) {
    String cacheKey = "oa:pending:" + userId;
    Integer count = (Integer) redisTemplate.opsForValue().get(cacheKey);
    
    if (count == null) {
        count = approvalMapper.countPendingByUserId(userId);
        redisTemplate.opsForValue().set(cacheKey, count, 1, TimeUnit.MINUTES);
    }
    
    return count;
}
```

3. **ERP - 物料库存预警**
```java
// 缓存库存低于安全库存的物料列表（每小时刷新）
@Scheduled(fixedRate = 60 * 60 * 1000)
public void refreshLowStockCache() {
    List<Material> lowStockMaterials = materialMapper.selectLowStockMaterials();
    redisTemplate.opsForValue().set("erp:material:low_stock", lowStockMaterials, 1, TimeUnit.HOURS);
}
```

4. **MES - 产线实时状态**
```java
// 缓存产线当前工单和进度（高频查询，短时间缓存）
public WorkOrderStatus getLineStatus(Long lineId) {
    String cacheKey = "mes:line:" + lineId + ":status";
    WorkOrderStatus status = (WorkOrderStatus) redisTemplate.opsForValue().get(cacheKey);
    
    if (status == null) {
        status = workOrderMapper.getCurrentWorkOrderByLineId(lineId);
        redisTemplate.opsForValue().set(cacheKey, status, 30, TimeUnit.SECONDS);
    }
    
    return status;
}
```

---

#### 6. 前端工程化设计

**项目结构**：
```
src
├── api              # API 接口封装
│   ├── crm          # CRM 模块接口
│   │   ├── customer.ts    # 客户管理
│   │   ├── contact.ts     # 联系人
│   │   └── follow.ts      # 跟进记录
│   ├── oa           # OA 模块接口
│   │   ├── approval.ts    # 审批流程
│   │   ├── leave.ts       # 请假申请
│   │   └── notice.ts      # 通知公告
│   ├── erp          # ERP 模块接口
│   │   ├── material.ts    # 物料管理
│   │   ├── purchase.ts    # 采购管理
│   │   └── inventory.ts   # 库存管理
│   ├── mes          # MES 模块接口
│   │   ├── workorder.ts   # 工单管理
│   │   ├── process.ts     # 工序管理
│   │   └── report.ts      # 生产报工
│   └── system       # 系统管理接口
│       ├── user.ts        # 用户管理
│       ├── role.ts        # 角色管理
│       └── menu.ts        # 菜单管理
├── components       # 公共组件
│   ├── BusinessForm.vue     # 业务表单通用组件
│   ├── SearchPanel.vue      # 高级搜索面板
│   ├── DataPermission.vue   # 数据权限选择器
│   ├── ApprovalFlow.vue     # 审批流程展示
│   ├── FileUpload.vue       # 文件上传（支持批量）
│   └── ExportExcel.vue      # Excel 导出按钮
├── views            # 页面组件
│   ├── crm
│   │   ├── customer
│   │   │   ├── List.vue       # 客户列表
│   │   │   ├── Detail.vue     # 客户详情
│   │   │   └── Edit.vue       # 客户编辑
│   │   └── dashboard
│   │       └── Index.vue      # CRM 数据看板
│   ├── oa
│   │   ├── approval
│   │   │   ├── Create.vue     # 发起审批
│   │   │   ├── Pending.vue    # 待我审批
│   │   │   └── History.vue    # 我已审批
│   │   └── workflow
│   │       └── Designer.vue   # 流程设计器
│   ├── erp
│   │   ├── material
│   │   │   ├── List.vue       # 物料列表
│   │   │   └── Stock.vue      # 库存查询
│   │   └── purchase
│   │       └── OrderList.vue  # 采购订单
│   ├── mes
│   │   ├── workorder
│   │   │   ├── List.vue       # 工单列表
│   │   │   └── Progress.vue   # 生产进度
│   │   └── monitoring
│   │       └── Realtime.vue   # 实时监控看板
│   └── system
│       ├── user
│       │   └── List.vue       # 用户管理
│       └── dept
│           └── Tree.vue       # 部门树形管理
├── router           # 路由配置
│   └── index.ts
├── store            # 状态管理
│   ├── user.ts      # 用户信息、权限
│   ├── app.ts       # 应用配置（主题、语言）
│   └── tagsView.ts  # 标签页管理
├── utils            # 工具函数
│   ├── request.ts   # Axios 封装
│   ├── auth.ts      # 认证工具
│   ├── permission.ts# 权限判断
│   ├── excel.ts     # Excel 导入导出
│   └── validate.ts  # 表单验证
├── types            # TypeScript 类型定义
├── styles           # 全局样式
└── layout           # 布局组件
    ├── index.vue    # 主布局
    ├── Sidebar.vue  # 侧边栏菜单
    └── TagsView.vue # 标签页
```

**Axios 封装**：
``typescript
// utils/request.ts
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import router from '@/router';
import { useUserStore } from '@/store/user';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000  // 企业系统超时时间稍长
});

let loadingInstance: any = null;

// 请求拦截器
service.interceptors.request.use(
  config => {
    const userStore = useUserStore();
    const token = userStore.token;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 显示加载动画（可选）
    if (config.showLoading !== false) {
      loadingInstance = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    }
    
    return config;
  },
  error => {
    if (loadingInstance) loadingInstance.close();
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    if (loadingInstance) loadingInstance.close();
    
    const res = response.data;
    
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败');
      
      // Token 过期或无效，跳转登录页
      if (res.code === 401) {
        const userStore = useUserStore();
        userStore.logout();
        router.push('/login');
      }
      
      return Promise.reject(new Error(res.message));
    }
    
    return res.data;
  },
  error => {
    if (loadingInstance) loadingInstance.close();
    
    if (error.response) {
      switch (error.response.status) {
        case 403:
          ElMessage.error('权限不足，无法访问');
          break;
        case 404:
          ElMessage.error('请求的资源不存在');
          break;
        case 500:
          ElMessage.error('服务器错误，请联系管理员');
          break;
        default:
          ElMessage.error(error.message || '网络错误');
      }
    } else {
      ElMessage.error('网络连接失败，请检查网络');
    }
    
    return Promise.reject(error);
  }
);

export default service;
```

**API 接口封装示例**：
``typescript
// api/crm/customer.ts
import request from '@/utils/request';

export interface CustomerListParams {
  page: number;
  size: number;
  customerName?: string;
  status?: number;
  ownerId?: number;
  startDate?: string;
  endDate?: string;
}

export interface CustomerVO {
  id: number;
  customerNo: string;
  customerName: string;
  customerType: number;
  industry: string;
  level: string;
  ownerName: string;
  phone: string;
  status: number;
  createTime: string;
}

// 查询客户列表
export function getCustomerList(params: CustomerListParams) {
  return request.get<any, { records: CustomerVO[]; total: number }>('/api/crm/customers', { params });
}

// 新增客户
export function addCustomer(data: any) {
  return request.post('/api/crm/customers', data);
}

// 更新客户
export function updateCustomer(id: number, data: any) {
  return request.put(`/api/crm/customers/${id}`, data);
}

// 删除客户
export function deleteCustomer(id: number) {
  return request.delete(`/api/crm/customers/${id}`);
}

// 分配客户给销售
export function assignCustomer(customerId: number, ownerId: number) {
  return request.post(`/api/crm/customers/${customerId}/assign`, { ownerId });
}

// 领取公海客户
export function claimCustomer(customerId: number) {
  return request.post(`/api/crm/customers/${customerId}/claim`);
}

// 导出客户数据
export function exportCustomers(params: CustomerListParams) {
  return request.get('/api/crm/customers/export', { 
    params,
    responseType: 'blob'  // 重要：指定响应类型为 blob
  });
}
```

**Excel 导入导出工具**：
``typescript
// utils/excel.ts
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * 导出 Excel
 */
export function exportExcel(data: any[], filename: string, headers: string[]) {
  // 转换数据格式
  const wsData = [headers, ...data.map(item => headers.map(h => item[h]))];
  
  // 创建工作簿
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
  // 导出文件
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${filename}.xlsx`);
}

/**
 * 导入 Excel
 */
export function importExcel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const results = XLSX.utils.sheet_to_json(worksheet);
        
        resolve(results);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.readAsBinaryString(file);
  });
}
```

**使用示例**：
``vue
<template>
  <div>
    <el-button @click="handleExport">导出客户</el-button>
    <el-upload
      action="#"
      :auto-upload="false"
      :on-change="handleImport"
      accept=".xlsx,.xls"
    >
      <el-button>导入客户</el-button>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { exportCustomers, getCustomerList } from '@/api/crm/customer';
import { exportExcel, importExcel } from '@/utils/excel';

// 导出
const handleExport = async () => {
  try {
    const blob = await exportCustomers({ page: 1, size: 10000 });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `客户列表_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('导出失败', error);
  }
};

// 导入
const handleImport = async (file: any) => {
  try {
    const data = await importExcel(file.raw);
    console.log('导入数据', data);
    // 调用后端接口批量导入
  } catch (error) {
    console.error('导入失败', error);
  }
};
</script>
```

---

#### 7. 性能优化策略

**后端优化**：
1. **数据库索引优化**：为查询频繁的字段添加索引（owner_id、status、create_time）
2. **分页查询**：避免一次性加载大量数据，使用 MyBatis-Plus 分页插件
3. **批量操作**：批量导入客户/物料使用 `saveBatch()` / `updateBatchById()`
4. **异步处理**：非核心业务（如发送通知、记录日志）使用 `@Async` 异步执行
5. **连接池调优**：HikariCP 最大连接数设置为 `CPU 核数 * 2 + 1`
6. **SQL 优化**：避免 N+1 查询，使用 JOIN 或批量查询
7. **缓存热点数据**：字典、组织架构、权限列表等

**前端优化**：
1. **路由懒加载**：按需加载页面组件
   ```typescript
   const CustomerList = () => import('@/views/crm/customer/List.vue');
   ```
2. **表格虚拟滚动**：大数据量表格使用虚拟滚动（如 `el-table-v2`）
3. **防抖节流**：搜索框输入使用防抖，按钮点击使用节流
4. **图片懒加载**：客户头像、产品图片使用懒加载
5. **CDN 加速**：第三方库（Vue、Element Plus）使用 CDN 引入
6. **Gzip 压缩**：Nginx 开启 Gzip 压缩
7. **浏览器缓存**：静态资源设置长期缓存策略

**企业系统特有优化**：
1. **大数据量导出**：使用流式导出，避免内存溢出
2. **复杂报表查询**：预计算 + 定时任务生成统计表
3. **工作流引擎优化**：缓存流程定义，减少 XML 解析
4. **权限判断优化**：用户权限列表缓存到 Redis，避免频繁查询

---

### ❓ 面试官：你们的系统如何处理高并发场景？比如月初/月末的集中审批、大量数据导入。【中高级】
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
对于企业级系统，高并发场景主要是 **"定时高峰"**（月初报销、月末统计）和 **"批量操作"**（数据导入、批量审批）。采用 **"异步处理 + 队列削峰 + 分批处理 + 限流保护"** 即可应对。

**📝 具体实施方案：**

#### 1. 批量数据导入（CRM 客户、ERP 物料）

**问题**：一次性导入 10 万条客户数据，直接插入会导致数据库压力过大、事务超时。

**解决方案**：分批处理 + 异步执行 + 进度反馈

```java
@Service
public class CustomerImportService {
    
    @Autowired
    private ThreadPoolTaskExecutor importExecutor;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 批量导入客户
     */
    public String importCustomers(MultipartFile file, Long userId) {
        // 1. 生成任务 ID
        String taskId = UUID.randomUUID().toString();
        
        // 2. 初始化进度
        Map<String, Object> progress = new HashMap<>();
        progress.put("total", 0);
        progress.put("success", 0);
        progress.put("failed", 0);
        progress.put("status", "processing");
        redisTemplate.opsForValue().set("import:progress:" + taskId, progress, 1, TimeUnit.HOURS);
        
        // 3. 异步处理
        importExecutor.execute(() -> {
            try {
                // 解析 Excel
                List<CustomerDTO> customers = parseExcel(file);
                
                progress.put("total", customers.size());
                
                // 分批处理（每批 500 条）
                int batchSize = 500;
                for (int i = 0; i < customers.size(); i += batchSize) {
                    int end = Math.min(i + batchSize, customers.size());
                    List<CustomerDTO> batch = customers.subList(i, end);
                    
                    // 批量插入
                    int successCount = batchInsert(batch, userId);
                    
                    // 更新进度
                    progress.put("success", (int) progress.get("success") + successCount);
                    redisTemplate.opsForValue().set("import:progress:" + taskId, progress, 1, TimeUnit.HOURS);
                }
                
                progress.put("status", "completed");
                
            } catch (Exception e) {
                log.error("导入失败", e);
                progress.put("status", "failed");
                progress.put("error", e.getMessage());
            }
        });
        
        // 4. 立即返回任务 ID
        return taskId;
    }
    
    /**
     * 查询导入进度
     */
    public Map<String, Object> getImportProgress(String taskId) {
        return (Map<String, Object>) redisTemplate.opsForValue().get("import:progress:" + taskId);
    }
}
```

**前端轮询进度**：
```typescript
// 启动导入
const taskId = await importCustomers(file);

// 轮询进度
const timer = setInterval(async () => {
  const progress = await getImportProgress(taskId);
  
  if (progress.status === 'completed') {
    clearInterval(timer);
    ElMessage.success(`导入完成！成功${progress.success}条，失败${progress.failed}条`);
  } else if (progress.status === 'failed') {
    clearInterval(timer);
    ElMessage.error('导入失败：' + progress.error);
  }
}, 1000);
```

---

#### 2. 集中审批场景（OA）

**问题**：月初大量员工提交报销申请，审批人集中处理导致系统卡顿。

**解决方案**：异步通知 + 批量审批 + 乐观锁

```java
@Service
public class ApprovalService {
    
    /**
     * 批量审批
     */
    @Transactional
    public void batchApprove(List<Long> approvalIds, Long approverId, String action, String comment) {
        for (Long approvalId : approvalIds) {
            // 使用乐观锁防止重复审批
            int updated = approvalMapper.updateStatusWithLock(
                approvalId, 
                currentStatus,  // 当前状态
                newStatus,      // 新状态
                approverId,
                comment
            );
            
            if (updated == 0) {
                log.warn("审批失败，可能已被处理 | approvalId={}", approvalId);
                continue;
            }
            
            // 异步通知申请人
            notificationService.sendApprovalResult(approvalId, action);
        }
    }
}

// Mapper SQL
@Update("UPDATE oa_approval SET status = #{newStatus}, update_time = NOW() " +
        "WHERE id = #{approvalId} AND status = #{currentStatus}")
int updateStatusWithLock(@Param("approvalId") Long approvalId,
                         @Param("currentStatus") Integer currentStatus,
                         @Param("newStatus") Integer newStatus,
                         @Param("approverId") Long approverId,
                         @Param("comment") String comment);
```

---

#### 3. 限流保护

**网关层限流**：Nginx 限制单个 IP 的请求频率
**应用层限流**：使用 Guava RateLimiter 或 Redis 滑动窗口
**接口级限流**：对高频接口（如查询、导出）单独限流

```java
@Component
public class ApiRateLimiter {
    
    private final Map<String, RateLimiter> limiters = new ConcurrentHashMap<>();
    
    public boolean tryAcquire(String apiKey, double permitsPerSecond) {
        RateLimiter limiter = limiters.computeIfAbsent(apiKey, 
            k -> RateLimiter.create(permitsPerSecond));
        
        return limiter.tryAcquire();
    }
}

// 使用
@GetMapping("/customers")
public Result<List<CustomerVO>> listCustomers() {
    if (!rateLimiter.tryAcquire("customer:list", 10)) {  // 每秒最多 10 次
        return Result.error(429, "请求过于频繁，请稍后再试");
    }
    
    // 业务逻辑
}
```

---

### ❓ 面试官：你们如何做系统监控和日志排查？线上出了问题怎么快速定位？【中级】
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
建立 **"日志集中管理 + 关键指标监控 + 链路追踪"** 三位一体的监控体系，配合告警机制做到早发现、早定位、早解决。

**📝 监控体系搭建：**

#### 1. 日志规范
```java
// 统一日志格式：时间 | 级别 | 线程名 | 类名 | traceId | 用户ID | 消息
@Slf4j
@Service
public class CustomerService {
    
    public void createCustomer(CustomerDTO dto) {
        String traceId = MDC.get("traceId");
        Long userId = UserContext.getUserId();
        
        log.info("[{}] 创建客户 | userId={} | customerName={}", 
                 traceId, userId, dto.getCustomerName());
        
        try {
            // 业务逻辑
            log.info("[{}] 客户创建成功 | customerId={}", traceId, customerId);
        } catch (Exception e) {
            log.error("[{}] 客户创建失败 | userId={}", traceId, userId, e);
            throw e;
        }
    }
}
```

#### 2. 关键指标监控
- **JVM 监控**：堆内存使用率、GC 次数、线程数（使用 Prometheus + Grafana）
- **接口监控**：QPS、平均响应时间、错误率（使用 Micrometer）
- **数据库监控**：慢查询数量、连接池使用率
- **业务监控**：
  - CRM：今日新增客户数、跟进完成率
  - OA：待审批数量、平均审批时长
  - ERP：库存预警数量、采购订单完成率
  - MES：工单完成率、产线稼动率

#### 3. 告警规则
- 接口错误率 > 5% → 钉钉/企业微信告警
- 平均响应时间 > 2s → 检查慢查询
- JVM 堆内存使用率 > 80% → 准备扩容
- 数据库连接池使用率 > 90% → 检查是否有连接泄漏
- 待审批数量突增 → 通知管理人员

#### 4. 快速定位问题
1. **根据用户反馈的时间点和操作**，在日志系统中搜索对应的 `traceId`
2. **查看完整的调用链路**，定位是哪个环节出错
3. **检查当时的系统指标**（CPU、内存、数据库负载）
4. **复现问题**：在测试环境模拟相同场景
5. **修复并验证**：热修复或发布新版本

---
