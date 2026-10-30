# AI 智能助手

> `✅ Java 已验证` · `✅ Python 已验证` · `🧪 196 测试` · `🔑 无密钥可跑`
> 所属模块：[01 AI 智能应用](/instances/ai/) · 模块优先级：第 2 位 · 交付位置：`E:\8.cangku\for-job\ai-assistant`、`ai-assistant-py`

## 📌 项目简介

AI 智能助手是一个**可独立部署的多模型对话应用**。它不绑定单一供应商：通过 OpenAI 兼容网关接入任意兼容模型，并在无密钥时自动降级到 mock/echo，保证任何环境都能启动、能测试、能演示。

- **面向用户**：需要 AI 对话能力的终端用户；需要二次集成的开发者（REST + SSE）
- **核心价值**：把「多模型接入 → 多轮对话 → 工具调用 → 流式输出」做成一条可复用的产品化链路
- **双语言实现**：Java 版用 Spring Boot + 自研 AgentLoop；Python 版用 FastAPI + **LangGraph**，接口语义完全对齐

## 🗺️ 功能规划

### ✅ 已实现

| 功能 | 说明 |
|---|---|
| 多模型接入 | OpenAI 兼容网关，`mock / echo / openai-compatible` 三 Provider 可插拔 |
| 无密钥降级 | 未配置 key 时跳过 openai-compatible 并告警，自动落到 mock，服务不阻塞启动 |
| 智能对话 | 多轮会话、上下文管理、会话历史、会话导出 |
| 流式输出 | SSE 事件契约 `delta / tool / done`，前端可逐字渲染 |
| 工具调用 | Function Calling 工具注册中心 + Agent Loop 循环（llm ↔ tool） |
| 文件分析 | 文档上传（TXT / MD / CSV / JSON）、内容摘要、关键信息抽取 |
| 鉴权与限流 | JWT 登录鉴权；Redis 限流（无 Redis 自动降级内存版） |

### 📋 规划 / 待做

- [ ] 多模态输入（图片理解）
- [ ] 会话级长期记忆与摘要压缩
- [ ] 插件市场 / MCP 工具动态挂载
- [ ] 统一控制台前端（Python 版）

## 🏗️ 技术架构

### 核心链路：Agent Loop

```
              用户消息
                 │
                 ▼
        ┌─────────────────┐  tool_calls?  ┌─────────────────┐
        │   LLM 节点       │ ────────────► │   工具执行        │
        │  (模型网关调用)   │ ◄──────────── │ (Tool Registry)  │
        └────────┬────────┘   观察结果回灌  └─────────────────┘
                 │ 无 tool_calls / 达循环上限
                 ▼
        ┌─────────────────┐
        │  SSE 流式输出     │  delta → tool → done
        └─────────────────┘
```

- **Java 版**：自研 `AgentLoop` + `ToolRegistry` + `ToolInvoker`
- **Python 版**：`langgraph.StateGraph`，`llm` 与 `tool` 两节点用条件边构成循环，天然支持多轮工具调用

### 双语言结构

```
┌──────────────────────────────────────────────┐
│   表现层：Vue 3 + Vite + TS（Java 版）/ REST  │
├──────────────────────────────────────────────┤
│   应用层：会话管理 · 消息持久化 · 导出          │
├──────────────────────────────────────────────┤
│   Agent 层：LLM ↔ Tool 循环（AgentLoop /      │
│              LangGraph StateGraph）           │
├──────────────────────────────────────────────┤
│   kit 套件：模型网关 · 工具注册 · SSE · JWT ·   │
│             Redis 限流                        │
├──────────────────────────────────────────────┤
│   数据层：H2（Java）/ SQLite（Python）· MySQL  │
└──────────────────────────────────────────────┘
```

## 🧰 技术栈 / 开发语言

| 分层 | Java 版 | Python 版 |
|---|---|---|
| Web | Spring Boot 3.3.6（JDK 21） | FastAPI + Uvicorn |
| Agent 编排 | 自研 AgentLoop | **LangGraph StateGraph** |
| 模型接入 | OpenAI 兼容网关（三 Provider） | 同语义网关 |
| 流式 | `SseEmitter` | `StreamingResponse` |
| 存储 | H2 + MyBatis | SQLite + SQLAlchemy |
| 鉴权 / 限流 | JWT + Redis | PyJWT + Redis |
| 前端 | Vue 3 + Element Plus | — |
| 测试 | 187 单测 + 13 E2E | 9 测试（pytest） |

## 📂 目录结构

```
ai-assistant/            # Java 版
├── backend/
│   ├── src/main/java/com/forjob/
│   │   ├── assistant/    # 业务：会话 / 消息 / 工具
│   │   └── ai/kit/       # 通用套件：llm / tool / sse / auth
│   └── src/test/         # 187 单测
├── frontend/             # Vue 3
└── sql/schema.sql        # 4 张表

ai-assistant-py/         # Python 版
├── backend/app/
│   ├── kit_llm.py        # 网关
│   ├── kit_auth.py       # JWT
│   ├── services.py       # 会话 + LangGraph Agent
│   └── routes.py
├── backend/tests/        # 9 测试
└── docker-compose.yml    # MySQL + Redis + backend
```

## ✅ 验证证据

| 版本 | 单元测试 | E2E | 交付物 |
|---|---|---|---|
| Java | 187 通过（28 类） | 13 / 13 | jar、Vue 前端、README/API/TEST-REPORT、schema.sql |
| Python | 9 通过 | — | FastAPI、pytest、Docker Compose、README/API/TEST-REPORT |

## 🚀 开发路线

| 里程碑 | 内容 | 状态 |
|---|---|---|
| M1 | Java 版：网关 + 对话 + 工具调用 + SSE | ✅ 完成 |
| M2 | Python 版：LangGraph 同构重写 | ✅ 完成 |
| M3 | 多模态输入 + 长期记忆 | 📋 规划 |
| M4 | 统一控制台前端 | 📋 规划 |

## 🔗 相关资源

- 模块总览：[01 AI 智能应用](/instances/ai/)
- 兄弟项目：[AI 知识库系统](/instances/ai/kb) · [AI 工作流与智能体平台](/instances/ai/agent-platform)
- 技术实践：[功能开发 › AI 应用](/apps/ai/)

---

上一级：[01 AI 智能应用](/instances/ai/) · [实例总览](/instances/)
