# Cursor 安装与配置

> 所属专题：[开发工具与环境配置](/devtools/)

## 1. 下载与安装

- **官方下载地址**：<https://www.cursor.com/>
- **官方中文文档**：<https://cursor.com/cn/docs>

### 安装步骤

1. 访问官网下载对应操作系统的安装包
2. 运行安装程序，按照提示完成安装
3. 安装完成后可直接导入 VS Code 的配置与扩展（推荐）

## 2. 初始配置

### 账号登录

- 首次启动需要注册或登录 Cursor 账号
- 支持 GitHub、Google 等第三方登录方式

### 配置导入（可选）

- **VS Code 设置同步**：自动检测并导入已有的 VS Code 配置
- **扩展迁移**：一键安装之前在 VS Code 中使用的扩展
- **主题与快捷键**：可选择保留原有主题和快捷键方案，或采用 Cursor 默认配置

### 基础设置

- 选择界面主题（浅色/深色）
- 配置编辑器字体和字号
- 设置代码格式化规则

## 3. AI 功能配置

### API 密钥设置

- 在设置中配置 AI 服务提供商（Cursor 默认提供）
- 也可自定义接入其他大模型 API

### 智能辅助选项

- 启用/禁用自动代码补全
- 配置 AI 对话的上下文范围
- 设置代码生成的偏好（简洁性 vs 详细注释）

## 4. 核心功能

### AI 对话辅助

- **侧边栏聊天**：随时提问获取代码建议
- **行内编辑**：选中代码后使用 AI 进行重构或优化
- **问题解答**：解释代码逻辑、排查错误原因

### 代码生成与修改

- **自然语言生成代码**：用描述性文字让 AI 编写代码
- **智能重构**：自动识别可优化的代码结构
- **批量修改**：基于项目上下文进行多处联动修改

### 项目理解能力

- 自动索引当前项目的代码结构
- 理解模块间的依赖关系
- 基于项目规范生成符合风格的代码

## 5. 高级功能

### Composer 多文件编辑

- 同时修改多个相关文件
- AI 自动分析影响范围
- 预览所有变更后再应用

### Chat with Codebase

- 针对整个代码库提问
- 查询特定功能的实现位置
- 了解项目架构和设计模式

### Debug 辅助

- AI 协助分析错误日志
- 提供可能的修复方案
- 生成单元测试用例

## 6. MCP (Model Context Protocol) 集成

### 什么是 MCP？

MCP（Model Context Protocol）是 Cursor 支持的协议标准，允许 AI 助手安全地访问外部数据源和工具。通过 MCP，Cursor 可以：

- 📂 **读取本地文件**：访问项目文档、配置文件等
- 🔍 **搜索代码库**：快速定位特定代码或文档
- 🌐 **连接数据库**：查询数据库结构和数据（只读模式）
- 📊 **获取 API 信息**：调用 REST API 获取实时数据
- 🔧 **执行命令**：在沙箱环境中运行安全的 shell 命令

### 配置 MCP Servers

#### 方式一：通过设置界面配置

1. 打开 Cursor 设置（`Ctrl + ,` 或 `Cmd + ,`）
2. 搜索 "MCP" 或 "Model Context Protocol"
3. 点击 "Add MCP Server" 添加新的服务器配置

#### 方式二：手动编辑配置文件

在项目根目录或用户目录下创建 `.cursor/mcp.json` 文件：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/directory"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your_github_token"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
    }
  }
}
```

### 常用 MCP Servers

#### 1. 文件系统服务器

允许 AI 读取指定目录下的文件内容：

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "./docs", "./src"]
  }
}
```

**使用场景**：
- 让 AI 阅读项目文档后回答问题
- 基于现有代码风格生成新代码
- 分析多个文件的关联性

#### 2. GitHub 服务器

连接 GitHub API，获取仓库信息：

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_TOKEN": "ghp_xxxxxxxxxxxx"
    }
  }
}
```

**使用场景**：
- 查询 Issues 和 Pull Requests
- 获取仓库结构和提交历史
- 分析代码审查意见

#### 3. 数据库服务器

支持 PostgreSQL、MySQL 等数据库的只读查询：

```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:pass@localhost/dbname"]
  }
}
```

**使用场景**：
- 查询表结构和字段说明
- 分析数据关系生成 ER 图描述
- 基于实际数据编写查询语句

#### 4. Web 搜索服务器

让 AI 能够搜索最新信息：

```json
{
  "web-search": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-web-search"]
  }
}
```

**使用场景**：
- 查询最新的技术文档
- 获取最新的 API 变更信息
- 搜索最佳实践和解决方案

### MCP 使用示例

#### 示例 1：基于文档生成代码

```
请阅读 ./docs/api-spec.md 文件，然后根据规范实现用户登录接口
```

AI 会自动通过 MCP 读取文档内容，然后生成符合规范的代码。

#### 示例 2：分析数据库结构

```
查询 users 表和 orders 表的结构，帮我生成一个获取用户订单列表的 SQL 查询
```

AI 通过 MCP 连接数据库，获取表结构后生成准确的 SQL 语句。

#### 示例 3：查询 GitHub Issues

```
查看当前仓库最近的 5 个 bug 报告，总结主要问题
```

AI 通过 GitHub MCP 获取 Issues 列表并进行总结。

### 安全注意事项

- ⚠️ **权限控制**：仅授予必要的目录访问权限
- ⚠️ **敏感信息**：不要在 MCP 配置中硬编码密码，使用环境变量
- ⚠️ **只读优先**：优先使用只读模式的 MCP servers
- ⚠️ **审计日志**：定期检查 MCP 的访问记录

### 故障排查

**Q: MCP Server 无法启动？**
- 检查命令路径是否正确
- 确认依赖包已安装（`npm install -g @modelcontextprotocol/*`）
- 查看 Cursor 控制台输出错误信息

**Q: 连接被拒绝？**
- 验证网络连接
- 检查防火墙设置
- 确认服务地址和端口正确

**Q: 权限不足？**
- 检查文件或目录的读写权限
- 确认环境变量配置正确
- 验证 API Token 是否有效

---

## 7. 使用建议

### 最佳实践

- ✅ **代码审查**：AI 生成的代码务必人工 review 后再提交
- ✅ **版本控制**：重要修改前先创建 Git 分支或提交
- ✅ **渐进式采用**：先从简单的代码解释、文档生成开始熟悉
- ✅ **提示词优化**：提供清晰的上下文和具体要求，获得更好的结果

### 适用场景

- 📝 **快速原型开发**：根据需求描述生成基础代码框架
- 🔍 **代码理解**：阅读陌生项目时快速获取关键信息
- 🛠️ **重构优化**：识别代码异味并提供改进建议
- 📚 **文档整理**：自动生成函数注释、README 等文档
- 🐛 **问题排查**：分析错误堆栈和日志定位问题根源

### 注意事项

- ⚠️ 涉及敏感代码时注意隐私保护
- ⚠️ 复杂业务逻辑仍需人工设计和验证
- ⚠️ AI 建议可能不完全符合项目规范，需适当调整
- ⚠️ 定期查看[官方文档](https://cursor.com/cn/docs)了解新功能和使用技巧

## 8. 常见问题

### Q: Cursor 和 VS Code 有什么区别？

A: Cursor 基于 VS Code 构建，完全兼容 VS Code 扩展，但深度集成了 AI 能力，提供更智能的代码辅助体验。

### Q: 是否需要付费？

A: Cursor 提供免费版本和付费版本。免费版有使用次数限制，付费版可享受更快的响应速度和更高的使用额度。

### Q: 如何迁移现有的 VS Code 配置？

A: 首次启动时会提示是否导入 VS Code 配置，也可在设置中手动触发导入流程。

### Q: AI 生成的代码安全吗？

A: 建议在本地运行 Cursor，避免将敏感代码上传到云端。对于企业内部项目，可考虑私有化部署方案。

## 9. 学习资源