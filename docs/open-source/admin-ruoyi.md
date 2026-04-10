# RuoYi（若依）：操作与二次开发

> 姊妹篇：[JeecgBoot](./admin-jeecg.md)。侧重**环境跑通、权限与代码生成、常见二开套路与部署**。

## 一、为什么选择开源后台管理系统？

### 1.1 核心价值

对于中小企业项目（企业官网、OA 系统、小型商城等），使用成熟的开源后台管理系统可以：

- ✅ **节省 70% 开发时间**：基础功能（用户、角色、权限、菜单）开箱即用
- ✅ **降低维护成本**：经过大量项目验证，稳定性高
- ✅ **快速响应需求**：聚焦业务逻辑，无需重复造轮子
- ✅ **降低学习成本**：文档完善，社区活跃

### 1.2 主流框架对比

| 框架 | 技术栈 | 优势 | 适用场景 | 推荐指数 |
|-----|--------|------|---------|---------|
| **RuoYi-Vue** | SpringBoot + Vue2 | 简单易用、文档完善、社区庞大 | 中小项目快速交付 | ⭐⭐⭐⭐⭐ |
| **RuoYi-Vue3** | SpringBoot + Vue3 | 技术先进、性能更优 | 新项目首选 | ⭐⭐⭐⭐⭐ |
| **JeecgBoot** | SpringBoot + Vue3 | 低代码能力强、在线开发 | 复杂业务、表单驱动 | ⭐⭐⭐⭐ |
| **ElAdmin** | SpringBoot + Vue | 代码简洁、轻量级 | 小微型项目 | ⭐⭐⭐ |
| **Renren-Fast** | SpringBoot + Vue | 老牌框架、稳定可靠 | 传统项目 | ⭐⭐⭐ |

**推荐选择：**
- **新手入门/快速交付** → RuoYi-Vue/Vue3
- **低代码需求/复杂表单** → JeecgBoot
- **追求轻量/简单项目** → ElAdmin

---

## 二、RuoYi（若依）二次开发实战

### 2.1 框架简介

**RuoYi** 是国内最流行的 Java 后台管理系统之一，由 [若依团队](https://ruoyi.vip/) 开发维护。

**核心特点：**
- 📦 **开箱即用**：用户管理、角色管理、权限控制、菜单管理、部门管理等
- 🔧 **代码生成**：根据数据库表自动生成 CRUD 代码
- 🎨 **主题丰富**：支持多种主题切换
- 📱 **多端适配**：提供 Vue2/Vue3/小程序等多版本

**技术栈：**
```
后端：SpringBoot 2.x + Spring Security + MyBatis + MySQL/Oracle
前端：Vue 2/3 + Element UI/Plus + Axios
数据库：MySQL 5.7+ / Oracle 11g+
缓存：Redis 5.0+
```

### 2.2 快速开始

#### 步骤一：下载源码

```bash
# Gitee 地址（推荐，下载更快）
https://gitee.com/y_project/RuoYi-Vue

# GitHub 地址
https://github.com/yangzongzhuan/RuoYi-Vue

# 下载方式 1：Git 克隆
git clone https://gitee.com/y_project/RuoYi-Vue.git

# 下载方式 2：直接下载 ZIP 压缩包解压
```

#### 步骤二：导入数据库

```sql
-- 1. 创建数据库
CREATE DATABASE ruoyi CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 2. 导入 SQL 文件
-- 执行 docs/sql/ry_202xxxxx.sql（完整数据）
-- 或 docs/sql/ry_v2.x.x.sql（结构 + 演示数据）
```

#### 步骤三：修改配置文件

编辑 `ruoyi-admin/src/main/resources/application-druid.yml`：

```yaml
spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    driverClassName: com.mysql.cj.jdbc.Driver
    druid:
      master:
        url: jdbc:mysql://localhost:3306/ruoyi?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8
        username: root
        password: your_password  # 修改为你的数据库密码
```

编辑 `ruoyi-admin/src/main/resources/application.yml`：

```yaml
# Redis 配置
redis:
  host: localhost
  port: 6379
  password:  # 如果有密码请填写
```

#### 步骤四：启动项目

```bash
# 1. 启动后端
cd ruoyi-admin
mvn clean install
mvn spring-boot:run

# 或使用 IDEA 直接运行 RuoYiApplication.java

# 2. 启动前端
cd ruoyi-ui
npm install
npm run dev

# 访问地址：http://localhost:80
# 默认账号：admin / admin123
```

### 2.3 核心功能模块解析

#### 用户 - 角色 - 菜单权限体系

```
用户 (User) 
  ↓ N:N
角色 (Role)
  ↓ N:N  
菜单 (Menu)
```

**权限控制流程：**
```java
// 1. 用户登录时加载权限
List<String> permissions = userService.selectUserPermissions(username);

// 2. 使用注解控制接口访问
@PreAuthorize("@ss.hasPermi('system:user:add')")
@PostMapping
public AjaxResult add(@RequestBody SysUser user) {
    return toAjax(userService.insertUser(user));
}

// 3. 前端按钮级别权限控制
<el-button 
  v-hasPermi="['system:user:add']"
  @click="handleAdd">新增</el-button>
```

#### 代码生成器（强烈推荐）⭐

**使用步骤：**

1. **导入数据库表**
   - 系统工具 → 代码生成 → 导入表
   - 选择已创建的業務表

2. **编辑生成配置**
   - 基本信息：模块名、包路径、作者等
   - 字段信息：哪些字段需要显示、查询、必填等
   - 生成信息：模板选择（单表、树表、主子表）

3. **预览与下载**
   - 预览生成的代码（Entity、Mapper、XML、Service、Controller、Vue）
   - 下载到本地或直接同步到项目中

4. **手动微调**
   - 补充业务逻辑
   - 调整页面样式
   - 添加特殊校验

**示例：生成订单管理模块**

```sql
-- 1. 创建订单表
CREATE TABLE `biz_order` (
  `order_id` bigint NOT NULL AUTO_INCREMENT COMMENT '订单 ID',
  `order_no` varchar(32) NOT NULL COMMENT '订单编号',
  `customer_name` varchar(50) DEFAULT NULL COMMENT '客户姓名',
  `amount` decimal(10,2) DEFAULT NULL COMMENT '订单金额',
  `status` char(1) DEFAULT '0' COMMENT '状态（0 待支付 1 已支付 2 已取消）',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 2. 在若依后台导入此表
-- 3. 配置生成信息：
--    模块名：business
--    包路径：com.ruoyi.business
--    生成模板：单表
-- 4. 点击生成代码
```

生成的代码结构：
```
com.ruoyi/
├── business/
│   ├── domain/
│   │   └── BizOrder.java          # 实体类
│   ├── mapper/
│   │   └── BizOrderMapper.java    # DAO 层
│   ├── service/
│   │   ├── IBizOrderService.java  # Service 接口
│   │   └── impl/
│   │       └── BizOrderServiceImpl.java  # Service 实现
│   └── controller/
│       └── BizOrderController.java # Controller 层
resources/
├── mapper/business/
│   └── BizOrderMapper.xml         # MyBatis XML
ruoyi-ui/src/views/
├── business/
│   └── order/
│       ├── index.vue              # 列表页
│       └── form.vue               # 表单页
```

### 2.4 常见二开场景

#### 场景一：添加新模块

**步骤：**

1. **设计数据库表**
2. **使用代码生成器生成基础代码**
3. **补充业务逻辑**
4. **配置菜单权限**
5. **测试验证**

**示例：添加客户管理模块**

```java
// 1. 创建客户表
CREATE TABLE `biz_customer` (
  `customer_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '客户名称',
  `phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `source` char(2) DEFAULT NULL COMMENT '客户来源（01 线上 02 线下 03 转介绍）',
  `level` char(1) DEFAULT '1' COMMENT '客户等级（1 普通 2 VIP 3 大客户）',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`customer_id`)
);

// 2. 在若依后台导入表并生成代码

// 3. 补充业务逻辑（例如：手机号唯一校验）
@Service
public class BizCustomerServiceImpl implements IBizCustomerService {
    
    @Override
    public int insertCustomer(BizCustomer customer) {
        // 检查手机号是否已存在
        long count = customerMapper.countByPhone(customer.getPhone());
        if (count > 0) {
            throw new ServiceException("手机号已存在");
        }
        return customerMapper.insertCustomer(customer);
    }
}

// 4. 在系统中配置菜单
// 系统管理 → 菜单管理 → 新增子菜单
// - 菜单名称：客户管理
// - 路由地址：/business/customer
// - 组件路径：business/customer/index
// - 权限标识：business:customer:list

// 5. 分配角色权限
// 系统管理 → 角色管理 → 分配菜单
```

#### 场景二：修改现有功能

**示例：增强用户登录功能**

```java
// 自定义登录逻辑（增加验证码校验、IP 限制等）
@Service
public class CustomUserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. 查询用户信息
        SysUser user = userMapper.selectUserByUserName(username);
        if (Objects.isNull(user)) {
            throw new ServiceException("用户不存在");
        }
        
        // 2. 检查用户状态
        if (UserStatus.DELETED.getCode().equals(user.getDelFlag())) {
            throw new ServiceException("用户已被删除");
        }
        if (UserStatus.DISABLE.getCode().equals(user.getStatus())) {
            throw new ServiceException("用户已被禁用");
        }
        
        // 3. 记录登录日志
        logininforService.recordLoginInfo(username, Constants.LOGIN_SUCCESS, "登录成功");
        
        // 4. 返回用户详情
        return createLoginUser(user);
    }
    
    // 自定义登录用户信息
    private LoginUser createLoginUser(SysUser user) {
        LoginUser loginUser = new LoginUser();
        loginUser.setUserId(user.getUserId());
        loginUser.setUsername(user.getUserName());
        loginUser.setUserType(user.getUserType());
        loginUser.setDeptId(user.getDeptId());
        
        // 加载角色权限
        List<SysRole> roles = roleMapper.selectRolesByUserId(user.getUserId());
        loginUser.setRoles(roles.stream()
            .map(SysRole::getRoleKey)
            .collect(Collectors.toSet()));
        
        // 加载权限标识
        Set<String> permissions = menuMapper.selectPermsByUserId(user.getUserId());
        loginUser.setPermissions(permissions);
        
        return loginUser;
    }
}
```

#### 场景三：集成第三方服务

**示例：集成短信发送（阿里云）**

```java
// 1. 添加依赖
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>dysmsapi20170525</artifactId>
    <version>2.0.23</version>
</dependency>

// 2. 配置短信参数
@Configuration
public class SmsConfig {
    @Value("${sms.aliyun.accessKeyId}")
    private String accessKeyId;
    
    @Value("${sms.aliyun.accessKeySecret}")
    private String accessKeySecret;
    
    @Bean
    public Client createClient() throws Exception {
        Config config = new Config()
            .setAccessKeyId(accessKeyId)
            .setAccessKeySecret(accessKeySecret);
        config.endpoint = "dysmsapi.aliyuncs.com";
        return new Client(config);
    }
}

// 3. 编写短信服务
@Service
public class SmsService {
    
    @Autowired
    private Client smsClient;
    
    @Value("${sms.signName}")
    private String signName;
    
    @Value("${sms.templateCode}")
    private String templateCode;
    
    public void sendSms(String phone, String code) {
        SendSmsRequest request = new SendSmsRequest()
            .setPhoneNumbers(phone)
            .setSignName(signName)
            .setTemplateCode(templateCode)
            .setTemplateParam("{\"code\":\"" + code + "\"}");
        
        try {
            smsClient.sendSms(request);
        } catch (Exception e) {
            throw new ServiceException("短信发送失败");
        }
    }
}

// 4. 在注册/找回密码时使用
@PostMapping("/register")
public AjaxResult register(@RequestBody RegisterBody registerBody) {
    // 验证短信验证码
    smsService.verifySms(registerBody.getPhone(), registerBody.getCode());
    
    // 注册用户
    userService.register(registerBody.getUsername(), registerBody.getPassword());
    return success();
}
```

### 2.5 部署上线

#### Docker 部署（推荐）

```dockerfile
# 1. 构建后端镜像
FROM maven:3.8-openjdk-11 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=build /app/ruoyi-admin/target/ruoyi-admin.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# 2. 构建命令
docker build -t ruoyi-backend .

# 3. 运行容器
docker run -d \
  -p 80:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -v /data/logs:/app/logs \
  --name ruoyi \
  ruoyi-backend
```

#### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端静态文件
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # 后端 API 代理
    location /prod-api/ {
        proxy_pass http://backend:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 常见问题（RuoYi）

**问题 1：登录一直提示验证码错误**

```bash
# 原因：Redis 未启动或连接失败
# 解决：
1. 检查 Redis 服务：redis-cli ping
2. 检查配置文件中的 Redis 连接信息
3. 重启 Redis：systemctl restart redis
```

**问题 2：代码生成后访问 404**

```bash
# 原因：菜单未配置或权限不足
# 解决：
1. 系统管理 → 菜单管理 → 确认菜单已添加
2. 系统管理 → 角色管理 → 分配菜单权限
3. 重新登录刷新权限
```

**问题 3：上传文件失败**

```bash
# 原因：上传路径不存在或无权限
# 解决：
1. 检查 application.yml 中的 profile 配置
2. 确保目录存在：mkdir -p /opt/uploadPath
3. 赋予权限：chmod 755 /opt/uploadPath
```

## 练习与参考

### 基础题

1. 在本地成功部署 RuoYi-Vue3。
2. 使用代码生成器生成一个简单的「文章管理」模块。

### 进阶题

1. 按文中示例集成一种第三方能力（如短信），并串起注册/登录流程。

### 挑战题

1. 基于 RuoYi 搭建一个可演示的 CRM 最小闭环（客户、跟进记录、简单统计）。

**参考资料**

- [RuoYi 官方文档](http://doc.ruoyi.vip/)
- [RuoYi Gitee 仓库](https://gitee.com/y_project/RuoYi-Vue)
