# MCP 与 Skill 选型

> **更新日期**：2026-05  
> **目标**：理解 MCP 协议、Function Calling 和 Agent Skill 的区别与选型策略，搭建 AI 与外部系统的桥梁。

---

## 一、理解核心概念

### MCP（Model Context Protocol）

由 Anthropic 提出的开放协议，标准化 AI 模型与外部数据源的交互方式。

```
┌─────────────────┐
│   AI 客户端      │  ← Cursor、Claude Desktop、IDE 等
│  (MCP Client)   │
└────────┬────────┘
         │ MCP 协议（JSON-RPC over stdio/SSE）
┌────────▼────────┐
│   MCP Server    │  ← 数据库、API、文件系统适配器
└────────┬────────┘
         │
┌────────▼────────┐
│   外部系统       │  ← MySQL、PostgreSQL、GitHub 等
└─────────────────┘
```

### Function Calling（函数调用）

模型原生支持的 API 调用能力，模型根据用户请求自动选择合适的函数并生成参数。

### Agent Skill（技能/工具）

在 Agent 框架中预定义的、可复用的能力模块，通常封装了某个特定领域的操作逻辑。

---

## 二、三者的关系与选型

| 维度 | MCP | Function Calling | Agent Skill |
|------|-----|-----------------|-------------|
| **定位** | 通信协议（标准） | 模型 API 能力 | 业务逻辑封装 |
| **标准化** | 开放协议，跨平台 | 各厂商实现不同 | 框架自定义 |
| **配置复杂度** | 中（需安装 Server） | 低（API 参数） | 中（需开发维护） |
| **安全控制** | 内置（权限配置） | 需自行实现 | 需自行实现 |
| **适用场景** | 数据库/文件/API 集成 | 简单工具调用 | 复杂业务编排 |

**选型建议**：
- **系统集成** → MCP（标准化、安全）
- **简单工具调用** → Function Calling（零配置）
- **复杂业务逻辑** → Agent Skill（灵活定制）

---

## 三、MCP Server 选型

### 官方/社区热门 Server

| Server | 功能 | 安装方式 | 推荐场景 |
|--------|------|---------|---------|
| `server-filesystem` | 文件系统读写 | `npx` | 本地文档处理 |
| `server-postgres` | PostgreSQL 查询 | `npx` | 数据库分析 |
| `server-github` | GitHub API | `npx` | 代码仓库管理 |
| `server-slack` | 消息发送 | `npx` | 团队通知 |
| `server-mysql` | MySQL 查询 | `npx` | MySQL 数据库操作 |
| `server-sqlite` | SQLite 查询 | `npx` | 本地数据库 |

### 选型策略

| 需求 | 推荐 Server | 注意事项 |
|------|------------|---------|
| 读写项目文件 | `server-filesystem` | 限定目录范围，防止越权 |
| 查询业务数据库 | `server-mysql` / `server-postgres` | 使用只读账号，禁用写操作 |
| 管理代码 | `server-github` | 最小 Token 权限 |
| 集成内部系统 | 自定义 MCP Server | 遵循 MCP 协议规范 |

### 安全最佳实践

```
✅ 必须做到：
  - 为每个 MCP Server 创建专用账号
  - 遵循最小权限原则
  - 启用操作白名单（禁用 DELETE 等危险操作）
  - 定期审计 MCP Server 调用日志

❌ 避免：
  - 使用 root/管理员账号连接
  - 在生产环境直接暴露 MCP Server
  - 在配置文件中硬编码密码
```

---

## 四、Function Calling 选型

### 各模型 Function Calling 能力对比

| 模型 | 能力评级 | 特点 |
|------|---------|------|
| GPT-4o | ⭐⭐⭐⭐⭐ | 最成熟，参数格式自动推导 |
| Claude 4 | ⭐⭐⭐⭐⭐ | 结构化输出对齐好 |
| Gemini 2.5 | ⭐⭐⭐⭐ | Google 生态工具集成 |
| DeepSeek | ⭐⭐⭐⭐ | 性价比高，代码场景强 |
| Qwen 2.5 | ⭐⭐⭐⭐ | 中文工具调用表现好 |
| Llama 4 | ⭐⭐⭐ | 需额外对齐，建议加校验 |

### 实现建议

```python
# Function Calling 的推荐实践
functions = [
    {
        "name": "query_database",
        "description": "执行 SQL 查询（只读）",
        "parameters": {
            "type": "object",
            "properties": {
                "sql": {
                    "type": "string",
                    "description": "SQL 查询语句"
                }
            },
            "required": ["sql"]
        }
    }
]

# 安全校验层
def validate_function_call(func_name, args):
    if func_name == "query_database":
        sql = args["sql"].lower()
        # 禁止修改操作
        forbidden = ["insert", "update", "delete", "drop", "alter"]
        if any(kw in sql for kw in forbidden):
            raise PermissionError("只允许查询操作")
    return True
```

---

## 五、Agent Skill 选型

### Skill 设计原则

| 原则 | 说明 |
|------|------|
| **单一职责** | 每个 Skill 只做一件事，做得好 |
| **输入输出规范** | 明确定义参数和返回值格式 |
| **幂等性** | 多次执行同一操作，结果一致 |
| **错误处理** | 内置重试、超时、降级策略 |
| **可观测** | 记录每次调用的输入、输出、耗时 |

### 常见 Skill 类型

| Skill 类型 | 示例 | 适用场景 |
|-----------|------|---------|
| **查询类** | 查数据库、查文档、查 API | 信息检索 |
| **操作类** | 创建工单、发送通知、更新状态 | 业务操作 |
| **分析类** | 数据分析、代码审查、日志分析 | 决策辅助 |
| **转换类** | 格式转换、翻译、摘要 | 内容处理 |

### Skill 选型框架

```
这个操作是否需要 AI 参与？
├─ 纯规则可搞定 → 不要做成 Skill，写普通函数
├─ 需要 AI 理解上下文 → 做成 Skill
└─ 需要 AI + 规则 → 做成 Skill + 校验层

这个操作是否有副作用？
├─ 有（写操作）→ 必须有人工确认或审批流
└─ 无（只读）→ 可以自动执行
```

---

## 六、综合选型案例

### 场景 1：Java 后端开发提效

```
需求：AI 助手能查询数据库、读写文件、管理 Git

方案：
├─ 数据库查询 → MCP Server (MySQL, 只读账号)
├─ 文件读写   → MCP Server (filesystem, 限项目目录)
├─ Git 操作   → Function Calling (封装常用命令)
└─ Agent Skill → 自定义「代码审查 Skill」
```

### 场景 2：企业内部知识库

```
需求：员工可以用自然语言查询内部文档

方案：
├─ 文档检索 → RAG Pipeline + MCP (向量库)
├─ 权限控制 → Agent Skill (根据用户角色过滤)
├─ 日志审计 → MCP + Function Calling (记录查询)
└─ 通知推送 → MCP Server (Slack/钉钉)
```

### 场景 3：自动化运维

```
需求：AI 能监控系统状态并执行运维操作

方案：
├─ 状态查询 → MCP (服务器监控 API)
├─ 告警通知 → MCP (消息推送)
├─ 操作执行 → Function Calling (需人工确认)
└─ 故障分析 → Agent Skill (多步骤诊断流程)
```

---

## 七、MCP 的延伸阅读

如果你需要深入了解 MCP 协议本身，以下资源值得关注：

- [MCP 官方规范](https://modelcontextprotocol.io/) — 协议标准与 SDK
- [MCP Server 市场](https://github.com/modelcontextprotocol/servers) — 社区 Server 合集
- 自定义 MCP Server 开发：使用 `@modelcontextprotocol/sdk`（Node.js）或 `mcp`（Python）

---

> **回到顶部**：[AI 选型概览](./ai-selection/) | 下一篇：[AI 开发工具选型](./dev-tools-selection)
