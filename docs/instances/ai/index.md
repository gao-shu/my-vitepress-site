# 01 AI 智能应用

> 智能助手、知识库、工作流与智能体 —— 用大模型与 Agent 构建的应用。
> 本模块是 **Java + Python 双语言实现**：同一套 LLM 应用能力，用两种主流技术栈各落地一遍。

**状态徽章**：`✅ Java 已验证` · `✅ Python 已验证` · `🧪 800+ 项测试全绿` · `🐳 Docker Compose` · `🔑 无密钥可跑`

**项目状态图例**：✅ 已验证 · 🔧 验证中 / 在建 · 📋 规划中（尚未开始实现）

## 📌 模块简介

本模块由 **1 个基座 + 3 个产品形态 + 1 个多产品套件** 组成，全部可运行、可测试、有文档：

- **通用 AI 应用脚手架**：Java 三件套的公共基座 —— `kit` 六子包（网关 / 工具 / RAG / SSE / 鉴权 / 统一响应）
- **AI 智能助手**：对话型应用 —— 多轮对话 + 工具调用（Agent Loop）+ 流式输出
- **AI 知识库系统**：RAG 应用 —— 文档解析 → 分块 → 检索 → 生成 → 引用溯源
- **AI 工作流与智能体平台**：Agent 编排应用 —— 工作流 DAG / LangGraph 编排 + 状态管理
- **Python AI 应用套件**：模块化单体 + 7 个产品 MVP（知识库 / 文档 / 工作流 / Agent / 数据分析 / 客服销售 / 内容创作）

前三者共享一套**通用 AI 套件（kit）**：模型网关、工具调用、RAG 管道、SSE 流式、JWT 鉴权、限流。
Java 版用 `com.forjob.ai.kit`，Python 版用 `app/kit_*`，接口语义完全对齐 —— 这就是「一套能力，两种栈」。

## 📊 项目状态总览

| 序号 | 软件项目 | 核心功能 | 状态 |
|---|---|---|---|
| 0 | [通用 AI 应用脚手架](/instances/ai/scaffold) | kit 六子包、示例模块、新建应用 5 步清单 | ✅ 142 单测 + 26 E2E |
| 1 | [AI 智能助手](/instances/ai/assistant) | 多模型接入、智能对话、文件分析、工具调用 | ✅ Java 187 + 13E2E / Python 9 |
| 2 | [AI 知识库系统](/instances/ai/kb) | 文档管理、知识检索、智能问答、来源引用 | ✅ Java 199 + 14E2E / Python 5 |
| 3 | [AI 工作流与智能体平台](/instances/ai/agent-platform) | 工作流编排、智能体配置、工具调用、任务自动化 | ✅ Java 244 + 12E2E / Python 10 |
| 4 | [Python AI 应用套件](/instances/ai/suite-py) | 7 个产品 MVP（知识库/文档/工作流/Agent/数据分析/客服/创作） | ✅ 7 MVP + 65 E2E |

> **合计**：Java 三件套 **630 单测 + 39 E2E**、Python 三件套 **24 测试**、脚手架 **142 单测 + 26 E2E**、Python 套件 **7 MVP + 65 E2E**。
> 交付位置：`E:\8.cangku\for-job\`（`ai-app-scaffold` / `ai-assistant` / `ai-knowledge-base` / `ai-agent-platform` / 对应 `-py` / `ai-suite-py`）。

## 🏗️ 模块架构

```
┌──────────────────────────────────────────────────────────────┐
│                     应用层（三大产品形态）                       │
│   AI 智能助手        AI 知识库系统        AI 工作流与智能体平台     │
│  对话 + 工具调用       RAG 检索问答         工作流 / LangGraph 编排  │
│                         ▲                                     │
│                  Python AI 应用套件（7 个产品 MVP）              │
└───────────────┬──────────────────┬──────────────────┬─────────┘
                │                  │                  │
                ▼                  ▼                  ▼
┌──────────────────────────────────────────────────────────────┐
│          通用 AI 套件 kit（双语言同构 · ai-app-scaffold 起家）   │
│  ┌──────────┬──────────┬──────────┬──────────┬────────────┐  │
│  │ 模型网关  │ 工具调用  │ RAG 管道  │ SSE 流式  │ 鉴权/限流   │  │
│  │ Gateway  │ Tool+Loop│ Parse→RAG│ Emitter  │ JWT+Redis  │  │
│  └──────────┴──────────┴──────────┴──────────┴────────────┘  │
│   Java: com.forjob.ai.kit      Python: app/kit_*              │
└───────────────┬──────────────────────────────────────────────┘
                ▼
┌──────────────────────────────────────────────────────────────┐
│   数据层：H2 / SQLite（默认单机） · MySQL 8 · PostgreSQL + pgvector │
└──────────────────────────────────────────────────────────────┘
```

- **基座先行**：先有 `ai-app-scaffold` 的 kit，再派生三个产品；Python 版复用同一套接口语义。
- **应用层薄、套件层厚**：三个项目只写各自领域逻辑（对话 / 检索 / 编排），公共能力全部下沉到 kit。
- **双语言对齐**：同一套接口语义在 Java 与 Python 各实现一遍，便于横向对比与迁移。

## 🧰 技术栈 / 开发语言

| 分层 | Java 版 | Python 版 |
|---|---|---|
| Web 框架 | Spring Boot 3.3.6（JDK 21） | FastAPI + Uvicorn |
| 编排 / Agent | 自研 DAG 工作流引擎（NodeExecutor 注册表） | **LangGraph StateGraph** + MemorySaver |
| 模型接入 | OpenAI 兼容网关（mock / echo / openai-compatible） | 同左（同语义网关） |
| 检索 | 256 维哈希向量 + 关键词混合（RRF） | 同左 |
| 流式输出 | `SseEmitter`（delta / tool / citation / done） | `StreamingResponse`（同事件协议） |
| 存储 | H2（文件）/ MySQL | SQLite / MySQL / PostgreSQL + pgvector |
| 鉴权 / 限流 | JWT + Redis | PyJWT + Redis |
| 前端 | Vue 3 + Vite + TS + Element Plus | Vue 3 + Vite + TS + Element Plus |
| 部署 | jar + Docker | Docker Compose（MySQL + Redis + backend） |

## 🎯 核心优势

1. **基座 + 产品**：先有可复制的 `kit`（脚手架），再派生三个产品，最后用 Python 套件验证多产品承载能力 —— 工程结构清晰。
2. **双语言同构**：同一套 LLM 应用范式用 Java 和 Python 各实现一遍，说明掌握的是工程方法而非某个框架。
3. **共享 kit 抽象**：网关降级、工具调用循环、RAG 管道、SSE 契约、鉴权限流全部可复用，零重复造轮子。
4. **无密钥可跑**：`mock / echo` 恒可用，`openai-compatible` 无 key 时自动跳过并告警，任何环境都能启动、能测试、能演示。
5. **工程化证据完整**：800+ 测试、多套 E2E、Docker Compose、schema.sql、API 文档，不是「能跑一下的 demo」。
6. **覆盖 LLM 应用全形态**：对话 / RAG / Agent 编排 / 文档处理 / 数据分析 / 客服销售 / 内容创作。

## 🚀 建设路线

| 里程碑 | 内容 | 状态 |
|---|---|---|
| M1 | 通用脚手架（kit + 示例模块） | ✅ 完成 |
| M2 | Java 三件套：助手 / 知识库 / 智能体平台 | ✅ 完成 |
| M3 | Python 三件套：同构重写，补齐 LangGraph 栈 | ✅ 完成 |
| M4 | Python 多产品套件：7 个 MVP | ✅ 完成 |
| M5 | 图像 / 视频生成模型接入与多模态扩展 | 📋 规划 |

## 🔗 相关资源

- 技术实践：[功能开发 › AI 应用](/apps/ai/)
- 相关实例：[ModelDesk · 多模态 AI 配测台](/apps/ai/modeldesk)
- 各项目页：[通用脚手架](/instances/ai/scaffold) · [AI 智能助手](/instances/ai/assistant) · [AI 知识库系统](/instances/ai/kb) · [AI 工作流与智能体平台](/instances/ai/agent-platform) · [Python AI 套件](/instances/ai/suite-py)

---

上一级：[应用实例](/instances/)
