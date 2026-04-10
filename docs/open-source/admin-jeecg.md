# JeecgBoot：操作与二次开发

> 姊妹篇：[RuoYi（若依）](./admin-ruoyi.md)。侧重 **Online 表单/报表、代码生成、Flowable 工作流与低代码交付**。

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

## 二、JeecgBoot 二次开发实战

### 2.1 框架简介

**JeecgBoot** 是一款基于代码生成器的**低代码开发平台**，由 [Jeecg 团队](https://www.jeecg.com/) 开发。

**核心特点：**
- 🚀 **低代码能力**：Online 表单开发、在线报表、大屏设计
- ⚡ **高效开发**：代码生成器 + 在线配置，开发效率提升 5-10 倍
- 🎯 **强大功能**：工作流、报表、消息中心、定时任务
- 🌐 **微服务支持**：提供 Spring Cloud 版本

**技术栈：**
```
后端：SpringBoot 2.x + Spring Security + MyBatis Plus + Shiro/JWT
前端：Vue 3 + Ant Design Vue + TypeScript
数据库：MySQL 5.7+ / PostgreSQL / Oracle
缓存：Redis 6.0+
工作流：Flowable
```

**与 RuoYi 的对比：**
| 维度 | RuoYi | JeecgBoot |
|-----|-------|-----------|
| 上手难度 | ⭐⭐ 简单 | ⭐⭐⭐ 中等 |
| 代码生成 | 基础 CRUD | 高级（支持关联表、一对多） |
| 低代码 | 较弱 | ⭐⭐⭐⭐⭐ 强大 |
| 工作流 | 需集成 | 内置 Flowable |
| 社区规模 | 非常大 | 较大 |
| 适合场景 | 通用后台 | 表单驱动型系统 |

### 2.2 快速开始

#### 步骤一：下载源码

```bash
# Gitee 地址
https://gitee.com/jeecg/jeecg-boot

# 下载方式
git clone https://gitee.com/jeecg/jeecg-boot.git
```

#### 步骤二：导入数据库

```sql
-- 1. 创建数据库
CREATE DATABASE jeecg-boot CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 2. 执行 SQL 脚本
-- 执行 db/jeecg-boot-mysql5.7.sql
```

#### 步骤三：修改配置

编辑 `jeecg-module-system/src/main/resources/application-dev.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/jeecg-boot?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
    username: root
    password: your_password  # 修改密码
    
# Redis 配置
redis:
  host: localhost
  port: 6379
  password: 
```

#### 步骤四：启动项目

```bash
# 1. Maven 编译
mvn clean install -Dmaven.test.skip=false

# 2. 启动后端
cd jeecg-module-system
mvn spring-boot:run

# 3. 启动前端
cd jeecgboot-vue3
npm install
npm run serve

# 访问地址：http://localhost:3088
# 默认账号：admin / admin123
```

### 2.3 核心功能：Online 表单开发

JeecgBoot 最强大的功能是**Online 表单开发**，无需写代码即可创建业务模块。

#### 使用步骤：

**1. 创建数据库表**

```sql
CREATE TABLE `demo_order` (
  `id` varchar(32) NOT NULL COMMENT 'ID',
  `order_no` varchar(100) DEFAULT NULL COMMENT '订单号',
  `customer_name` varchar(100) DEFAULT NULL COMMENT '客户姓名',
  `phone` varchar(50) DEFAULT NULL COMMENT '电话',
  `amount` decimal(12,2) DEFAULT NULL COMMENT '金额',
  `order_date` datetime DEFAULT NULL COMMENT '订单日期',
  `status` varchar(50) DEFAULT NULL COMMENT '状态（draft-草稿 submited-已提交 audited-已审核）',
  `create_by` varchar(50) DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单示例';
```

**2. Online 表单配置**

- 进入系统：Online → Online 表单
- 点击"添加表单"
- 选择表：`demo_order`
- 配置字段属性：

```
字段配置示例：
- order_no: 
  - 字段标题：订单号
  - 输入类型：文本框
  - 必填：是
  - 列表显示：✓
  
- customer_name:
  - 字段标题：客户姓名
  - 输入类型：文本框
  - 必填：是
  - 查询条件：✓
  
- amount:
  - 字段标题：订单金额
  - 输入类型：数字
  - 小数位：2
  - 统计：求和
  
- status:
  - 字段标题：订单状态
  - 输入类型：下拉框
  - 字典：订单状态（draft,submited,audited）
```

**3. 生成表单**

- 点击"保存并发布"
- 自动生成菜单和权限
- 立即访问：菜单 → 订单管理

**4. 高级功能**

```
✅ 一对多表单（主子表）
✅ 关联数据（外键选择）
✅ 数据权限（按部门、用户过滤）
✅ 流程绑定（集成工作流）
✅ 打印模板
✅ 导入导出
```

### 2.4 代码生成器

JeecgBoot 的代码生成器比 RuoYi 更强大，支持更多模板和配置选项。

#### 使用步骤：

**1. 选择表**

- Online 开发 → 代码生成器
- 选择业务表

**2. 配置生成信息**

```
基本信息：
- 包路径：org.jeecg.modules.demo
- 模块名：order
- 作者：yourname

模板选择：
- 单表模板（默认）
- 主子表模板
- 树形模板
- 自定义模板

生成内容：
✓ Entity
✓ Mapper
✓ XML
✓ Service
✓ Controller
✓ Vue (Ant Design)
✓ SQL (菜单权限)
```

**3. 自定义模板**

JeecgBoot 支持自定义代码模板（Freemarker）：

```ftl
${table.classname}.java 模板示例：
<#list columns as column>
    <#if column.isShow>
    private ${column.javaType} ${column.fieldName};  // ${column.comment}
    </#if>
</#list>
```

**4. 预览与生成**

- 预览所有生成的文件
- 一键下载到本地
- 或直接同步到项目

### 2.5 工作流集成（Flowable）

JeecgBoot 内置了 Flowable 工作流引擎，支持复杂的审批流程。

#### 请假流程示例：

**1. 绘制流程图**

使用 BPMN 设计器绘制：
```
开始 → 提交申请 → 部门经理审批 → 人事审批 → 结束
                         ↓
                    总经理审批（超过 3 天）
```

**2. 配置流程变量**

```java
// 请假申请表
CREATE TABLE `oa_leave` (
  `id` varchar(32) NOT NULL,
  `user_id` varchar(32) DEFAULT NULL COMMENT '申请人',
  `start_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `days` int DEFAULT NULL COMMENT '天数',
  `reason` text COMMENT '请假事由',
  `process_instance_id` varchar(64) DEFAULT NULL COMMENT '流程实例 ID',
  `status` varchar(20) DEFAULT '1' COMMENT '状态（1 草稿 2 审批中 3 已通过 4 已驳回）',
  PRIMARY KEY (`id`)
);
```

**3. 监听器处理**

```java
@Component
public class LeaveTaskListener implements TaskListener {
    
    @Autowired
    private OaLeaveService leaveService;
    
    @Override
    public void notify(DelegateTask delegateTask) {
        // 部门经理审批时，判断请假天数
        if ("deptManagerAudit".equals(delegateTask.getTaskDefinitionKey())) {
            String days = (String) delegateTask.getVariable("days");
            if (Integer.parseInt(days) > 3) {
                // 超过 3 天，需要总经理审批
                delegateTask.setVariable("needGeneralManager", true);
            }
        }
    }
}
```

**4. 审批接口**

```java
@PostMapping("/audit")
public Result<?> audit(@RequestBody AuditDTO auditDTO) {
    // auditDTO 包含：taskId, pass/notPass, comment
    
    if (auditDTO.isPass()) {
        taskService.complete(auditDTO.getTaskId());
    } else {
        // 驳回
        runtimeService.deleteProcessInstance(auditDTO.getProcessInstanceId(), "驳回");
        leaveService.updateStatus(auditDTO.getBusinessId(), "4"); // 已驳回
    }
    
    return Result.OK("审批完成");
}
```

### 2.6 常见二开场景

#### 场景一：自定义报表

**使用 Online 报表功能：**

```sql
-- 1. 创建视图
CREATE VIEW v_order_statistics AS
SELECT 
    DATE_FORMAT(order_date, '%Y-%m') AS month,
    customer_name,
    COUNT(*) AS order_count,
    SUM(amount) AS total_amount
FROM demo_order
WHERE status = 'audited'
GROUP BY month, customer_name;

-- 2. 在系统中配置
-- Online → Online 报表 → 添加报表
-- 选择视图 v_order_statistics
-- 配置图表类型（柱状图、饼图、折线图）
-- 设置筛选条件（月份、客户）
```

#### 场景二：数据权限控制

```java
// 按部门隔离数据
@DataScope(deptAlias = "d", userAlias = "u")
@Override
public List<OaLeave> list(OaLeave oaLeave) {
    return baseMapper.list(oaLeave);
}

// @DataScope 注解会自动注入部门权限 SQL
// SELECT * FROM oa_leave l 
// LEFT JOIN sys_user u ON l.user_id = u.id
// LEFT JOIN sys_dept d ON u.dept_id = d.id
// WHERE (d.id = #{currentDept} OR d.parent_ids LIKE '%#{currentDept}%')
```

#### 场景三：消息推送

```java
// 集成 WebSocket 推送消息
@Service
public class MsgService {
    
    @Autowired
    private ISysBaseAPI sysBaseAPI;
    
    // 审批通知
    public void sendApproveNotice(String userId, String title, String content) {
        // 1. 存入数据库
        SysAnnouncement ann = new SysAnnouncement();
        ann.setTitile(title);
        ann.setContent(content);
        ann.setSender(getCurrentUsername());
        ann.setSendTime(new Date());
        announcementMapper.insert(ann);
        
        // 2. 发送 WebSocket 消息
        JSONObject obj = new JSONObject();
        obj.put("userId", userId);
        obj.put("title", title);
        obj.put("message", content);
        
        sysBaseAPI.sendWebSocketMsg(obj.toJSONString());
    }
}
```

### 2.7 部署上线

#### Docker Compose 部署

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: jeecg-boot
    volumes:
      - mysql-data:/var/lib/mysql
    ports:
      - "3306:3306"
  
  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
  
  jeecg-boot:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
    depends_on:
      - mysql
      - redis
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./dist:/usr/share/nginx/html

volumes:
  mysql-data:
```

## 三、框架选型建议

### 3.1 快速决策

```
项目需求分析：
├─ 是否需要复杂工作流？
│  ├─ 是 → JeecgBoot（内置 Flowable）
│  └─ 否 → 继续评估
│
├─ 是否需要低代码/Online 表单？
│  ├─ 是 → JeecgBoot（强项）
│  └─ 否 → 继续评估
│
├─ 是否追求快速上手/简单易懂？
│  ├─ 是 → RuoYi（文档完善，代码简洁）
│  └─ 否 → 继续评估
│
├─ 是否需要 Vue3？
│  ├─ 是 → RuoYi-Vue3 或 JeecgBoot
│  └─ 否 → RuoYi-Vue（Vue2）
│
└─ 项目规模？
   ├─ 小型/微型 → RuoYi / ElAdmin
   └─ 中型/大型 → JeecgBoot / RuoYi-Vue3
```

### 3.2 推荐组合

**场景 A：企业 OA 系统（含请假、报销等审批）**
```
推荐：JeecgBoot
理由：
- 内置工作流引擎
- Online 表单快速搭建
- 数据权限完善
```

**场景 B：CRM 客户管理系统**
```
推荐：RuoYi-Vue3
理由：
- 代码生成器高效
- 客户跟进记录简单实现
- 销售报表易开发
```

**场景 C：进销存管理系统**
```
推荐：JeecgBoot
理由：
- 主子表支持（订单 - 订单明细）
- 库存预警易实现
- 统计报表强大
```

**场景 D：简单后台（如内容管理）**
```
推荐：RuoYi-Vue
理由：
- 快速上手
- 文章发布简单
- 社区资源丰富
```

## 常见问题（JeecgBoot）

**问题 1：Online 表单无法保存**

```bash
# 原因：数据库表名不符合规范
# 解决：
1. 表名必须以小写字母开头
2. 避免使用保留字（如 user、order）
3. 使用下划线分隔：demo_order_item ✓
```

**问题 2：工作流审批人无法获取**

```bash
# 原因：用户表达式配置错误
# 解决：
1. 检查流程设计中的审批人配置
2. 确认表达式语法：${assigneeService.findAssignee()}
3. 查看后端日志定位具体错误
```

## 练习与参考

### 基础题

1. 按文档完成本地前后端启动与默认账号登录。

### 进阶题

1. 使用 Online 表单创建一个「供应商管理」模块（含列表、查询、字典）。
2. 为一条业务配置或扩展一条审批流程（可先用官方示例改）。

### 挑战题

1. 基于 JeecgBoot 做 OA 最小演示：请假或报销单 + 多级审批。

**参考资料**

- [JeecgBoot 官方文档](http://help.jeecg.com/)
- [JeecgBoot Gitee 仓库](https://gitee.com/jeecg/jeecg-boot)
