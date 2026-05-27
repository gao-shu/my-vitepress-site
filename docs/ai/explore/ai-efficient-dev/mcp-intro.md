# MCP（Model Context Protocol）协议详解与实战

> **定位**：AI 工具与外部系统（数据库、API、文件系统）的标准通信协议，让 AI 助手能够安全地访问和操作外部数据源。

---

## 一、什么是 MCP？

### 1.1 核心概念

**MCP（Model Context Protocol）** 是由 Anthropic 提出的开放协议，旨在标准化 AI 模型与外部数据源之间的交互方式。

**类比理解**：

- **传统方式**：每个 AI 工具都需要自己实现数据库连接、API 调用等逻辑，重复造轮子
- **MCP 方式**：通过统一协议，AI 工具可以像"插拔 USB 设备"一样连接各种数据源

### 1.2 为什么需要 MCP？

**痛点**：

1. **安全性问题**：直接让 AI 访问数据库存在 SQL 注入、数据泄露风险
2. **权限控制**：无法细粒度控制 AI 能做什么操作（查询/插入/更新/删除）
3. **标准化缺失**：不同 AI 工具的集成方式各不相同，维护成本高

**MCP 的价值**：

- ✅ **安全沙箱**：通过配置限制 AI 的操作权限
- ✅ **统一接口**：所有 MCP Server 遵循相同协议
- ✅ **即插即用**：新增数据源只需配置，无需改代码

---

## 二、MCP 架构原理

### 2.1 核心组件

```
┌─────────────────┐
│   AI 客户端      │  ← Cursor、Claude Desktop 等
│  (MCP Client)   │
└────────┬────────┘
         │ MCP 协议（JSON-RPC over stdio/SSE）
┌────────▼────────┐
│   MCP Server    │  ← 数据库、API、文件系统等
│  (数据源适配器)  │
└────────┬────────┘
         │
┌────────▼────────┐
│   外部系统       │  ← MySQL、PostgreSQL、GitHub 等
└─────────────────┘
```

### 2.2 工作流程

1. **初始化**：AI 客户端启动 MCP Server（通过 `npx` 或本地进程）
2. **能力协商**：Server 告知 Client 自己支持哪些操作（查询、插入等）
3. **请求处理**：Client 发送自然语言请求 → Server 转换为具体操作
4. **结果返回**：Server 执行操作并返回结构化数据给 Client

---

## 三、实战：MySQL MCP Server 配置

### 3.1 配置文件示例

在 Cursor 或 Claude Desktop 的配置文件中添加：

```json
{
  "mcpServers": {
    "mysql": {
      "command": "npx",
      "args": [
        "-y",
        "@benborla29/mcp-server-mysql"
      ],
      "env": {
        "MYSQL_HOST": "127.0.0.1",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "root",
        "MYSQL_PASS": "123456",
        "MYSQL_DB": "test",
        "ALLOW_INSERT_OPERATION": "true",
        "ALLOW_UPDATE_OPERATION": "true",
        "ALLOW_DELETE_OPERATION": "false"
      }
    }
  }
}
```

### 3.2 配置项说明

| 配置项 | 说明 | 示例值 |
|-------|------|--------|
| `MYSQL_HOST` | 数据库主机地址 | `127.0.0.1` |
| `MYSQL_PORT` | 数据库端口 | `3306` |
| `MYSQL_USER` | 数据库用户名 | `root` |
| `MYSQL_PASS` | 数据库密码 | `123456` |
| `MYSQL_DB` | 默认数据库名 | `test` |
| `ALLOW_INSERT_OPERATION` | 是否允许插入操作 | `true/false` |
| `ALLOW_UPDATE_OPERATION` | 是否允许更新操作 | `true/false` |
| `ALLOW_DELETE_OPERATION` | 是否允许删除操作 | `true/false`（建议禁用） |

### 3.3 安全最佳实践

#### ❌ 不推荐的配置

```json
{
  "ALLOW_DELETE_OPERATION": "true"  // 危险！AI 可能误删数据
}
```

#### ✅ 推荐的配置

```json
{
  "ALLOW_DELETE_OPERATION": "false",  // 禁用删除操作
  "MYSQL_USER": "ai_readonly_user",   // 使用只读账号
  "MYSQL_PASS": "strong_password"     // 强密码
}
```

**建议**：

1. **最小权限原则**：为 AI 创建专用数据库账号，仅授予必要权限
2. **禁用危险操作**：生产环境禁用 `DELETE`，谨慎启用 `UPDATE`
3. **审计日志**：记录所有 AI 执行的 SQL 语句，便于追溯

---

## 四、使用场景示例

### 4.1 场景 1：数据库查询

**用户提问**：

> "帮我查一下 test 数据库中 user 表的前 10 条记录"

**MCP 执行流程**：

1. Cursor 识别到需要访问数据库
2. 调用 MySQL MCP Server
3. Server 执行：`SELECT * FROM user LIMIT 10`
4. 返回结果给 Cursor
5. Cursor 以表格形式展示给用户

### 4.2 场景 2：数据分析

**用户提问**：

> "统计一下 orders 表中每个月的订单数量"

**MCP 执行**：

```sql
SELECT 
  DATE_FORMAT(order_date, '%Y-%m') as month,
  COUNT(*) as order_count
FROM orders
GROUP BY month
ORDER BY month;
```

### 4.3 场景 3：数据插入（需谨慎）

**用户提问**：

> "在 products 表中插入一条新记录：名称='测试商品', 价格=99.9"

**MCP 执行**：

```sql
INSERT INTO products (name, price) VALUES ('测试商品', 99.9);
```

**注意**：仅在 `ALLOW_INSERT_OPERATION=true` 时生效

---

## 五、常见 MCP Server 推荐

### 5.1 官方/社区热门 Server

| Server 名称 | 功能 | 安装命令 |
|------------|------|---------|
| `@modelcontextprotocol/server-filesystem` | 文件系统访问 | `npx -y @modelcontextprotocol/server-filesystem` |
| `@modelcontextprotocol/server-postgres` | PostgreSQL 数据库 | `npx -y @modelcontextprotocol/server-postgres` |
| `@modelcontextprotocol/server-github` | GitHub API | `npx -y @modelcontextprotocol/server-github` |
| `@modelcontextprotocol/server-slack` | Slack 消息发送 | `npx -y @modelcontextprotocol/server-slack` |
| `@benborla29/mcp-server-mysql` | MySQL 数据库 | `npx -y @benborla29/mcp-server-mysql` |

### 5.2 自定义 MCP Server

如果你需要连接特殊数据源，可以自己开发 MCP Server：

**技术栈**：

- **语言**：Node.js / Python
- **协议**：JSON-RPC over stdio 或 SSE
- **SDK**：`@modelcontextprotocol/sdk`

**示例结构**（Node.js）：

```javascript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'my-custom-server',
  version: '1.0.0'
}, {
  capabilities: {
    resources: {},
    tools: {}
  }
});

// 注册工具
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === 'query_database') {
    // 执行自定义逻辑
    return {
      content: [{ type: 'text', text: '查询结果...' }]
    };
  }
});

// 启动服务
const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## 六、MCP vs 传统集成方式对比

| 维度 | 传统方式 | MCP 方式 |
|-----|---------|---------|
| **集成复杂度** | 高（需编写大量胶水代码） | 低（配置即可） |
| **安全性** | 依赖开发者实现 | 协议层内置权限控制 |
| **可维护性** | 分散在各处，难以统一管理 | 集中配置，易于审计 |
| **扩展性** | 每次新增数据源需改代码 | 仅需添加配置 |
| **标准化** | 无统一标准 | 开放协议，生态丰富 |

---

## 七、给 Java 开发者的建议

### 7.1 当前阶段如何使用 MCP？

根据你的 **"稳定项目优先"** 策略：

1. **第一阶段（当前）**：
   - 在 Cursor 中配置 MySQL MCP Server
   - 用于快速查询数据库结构、验证 SQL 语句
   - **不要**启用写入操作，仅做读取

2. **第二阶段（未来）**：
   - 在你的 Java 项目中集成 MCP Server
   - 让 AI 助手能够访问项目文档、API 文档
   - 提升老项目维护效率

### 7.2 实际应用场景

**场景 1：数据库结构探索**

> "帮我看看 test 数据库中有哪些表，以及 user 表的字段结构"

**场景 2：SQL 语句验证**

> "我写了一个复杂的 JOIN 查询，帮我检查是否有语法错误"

**场景 3：数据字典生成**

> "导出所有表的字段信息，生成 Markdown 格式的数据字典"

---

## 八、注意事项与避坑指南

### ❌ 常见错误

1. **密码明文存储**
   - 错误：将数据库密码硬编码在配置文件中
   - 正确：使用环境变量或密钥管理工具

2. **权限过大**
   - 错误：使用 root 账号且启用所有操作
   - 正确：创建专用账号，最小权限原则

3. **生产环境直连**
   - 错误：直接在生产数据库上启用 MCP
   - 正确：先在测试环境验证，生产环境谨慎使用

### ✅ 最佳实践

1. **使用只读副本**：如果数据库有主从架构，让 MCP 连接从库
2. **定期审计**：检查 MCP 执行的所有操作日志
3. **版本锁定**：在 `package.json` 中锁定 MCP Server 版本，避免意外升级

---

## 九、延伸阅读

- [AI 学习方向：Java 开发者稳定项目优先版](/ai/explore/java-stable-learning-path)
- [AI 编程实战模块](/ai/ai-programming/)
- [AI 漫剧平台深度解析](/ai/explore/ai-drama-platform-analysis)

---

## 十、后续规划

本模块将持续补充以下内容：

- [ ] Cursor Rules 配置技巧
- [ ] AI 辅助代码审查流程
- [ ] Prompt 工程最佳实践
- [ ] AI 工具链整合方案
- [ ] 自定义 MCP Server 开发教程

敬请期待！
