# AI 工作流与智能体平台

> `✅ Java 已验证` · `✅ Python 已验证` · `🧪 254 测试` · `🧭 LangGraph 编排` · `🔁 失败重试 + 结果校验`
> 所属模块：[01 AI 智能应用](/instances/ai/) · 模块优先级：第 3 位 · 交付位置：`E:\8.cangku\for-job\ai-agent-platform`、`ai-agent-platform-py`

## 📌 项目简介

AI 工作流与智能体平台是三个项目里**技术展示度最高**的一个：它把「智能体配置 + 工作流编排 + 工具调用 + 状态管理 + 失败重试」做成了一个可运行的引擎。Java 版用自研 DAG 引擎，Python 版用 **LangGraph StateGraph** —— 两条路线实现同一套编排语义。

- **面向用户**：需要把 LLM 能力编排成业务流程的开发者 / 业务方
- **核心价值**：让 AI 从「一问一答」升级为「可编排、可追踪、可重试、可校验」的自动化流程
- **双语言实现**：Java 自研 `WorkflowEngine` + `NodeExecutor` 注册表；Python 动态建图 + `MemorySaver` checkpointer

## 🗺️ 功能规划

### ✅ 已实现

| 功能 | 说明 |
|---|---|
| 工作流编排 | 工作流 JSON（nodes + edges）动态编译为可执行图 |
| 六种节点 | `start / end / llm / tool / condition / loop` |
| 智能体配置 | 角色提示词、模型选择、可用工具绑定 |
| 工具调用 | 工具注册中心（calculator / summarize / get_weather） |
| 条件分支 | 表达式求值 + 条件边路由到不同节点 |
| 状态管理 | 共享 state 传递变量；Python 版用 `MemorySaver` 检查点 |
| 失败重试 | 节点级策略 `abort / continue / retry1` |
| 结果校验门 | 运行结束校验输出非空，空则判 FAILED |
| 模板 | `doc-summary`（线性）、`conditional-branch`（分支） |
| 运行追踪 | 每次运行持久化 trace（逐节点），可回溯 |

### 📋 规划 / 待做

- [ ] 可视化流程设计器（拖拽画布）
- [ ] 定时 / 事件触发调度
- [ ] 人工审批节点（human-in-the-loop）
- [ ] 运行级重放与断点续跑
- [ ] 多智能体协作（Multi-Agent）

## 🏗️ 技术架构

### 工作流执行引擎

```
 工作流 JSON {nodes, edges}
        │
        ▼
┌─────────────────┐      ┌──────────────────────────────┐
│  校验（validate）│─────►│  动态建图（LangGraph / DAG）    │
│  start/end/边   │      │  节点 → 图节点，边 → 图边        │
└─────────────────┘      └──────────────┬───────────────┘
                                        ▼
                     ┌──────────────────────────────────┐
                     │  执行（共享 state.vars 传递变量）    │
                     │  ┌──────┬──────┬──────┬────────┐  │
                     │  │ llm  │ tool │ cond │ loop   │  │
                     │  └──────┴──────┴──────┴────────┘  │
                     │  失败策略 abort / continue / retry1│
                     └──────────────┬───────────────────┘
                                    ▼
                     ┌──────────────────────────────────┐
                     │  结果校验门：output 非空？          │
                     │  ✅ SUCCESS      ❌ FAILED        │
                     └──────────────────────────────────┘
```

- **Java 版**：`WorkflowEngine` + 六个 `NodeExecutor` + `NodeTimeoutGuard`（节点超时保护）
- **Python 版**：`StateGraph` 动态编译 + `MemorySaver` checkpointer + 条件边路由

### 双语言结构

```
┌──────────────────────────────────────────────┐
│   表现层：Vue 3 + @vue-flow 画布（Java 版）     │
├──────────────────────────────────────────────┤
│   应用层：智能体 · 模板 · 工作流 · 运行记录      │
├──────────────────────────────────────────────┤
│   编排引擎：NodeExecutor 注册表 /               │
│             LangGraph StateGraph              │
├──────────────────────────────────────────────┤
│   kit 套件：模型网关 · 工具注册 · SSE · JWT      │
├──────────────────────────────────────────────┤
│   数据层：H2 / SQLite · MySQL（5 张表）         │
└──────────────────────────────────────────────┘
```

## 🧰 技术栈 / 开发语言

| 分层 | Java 版 | Python 版 |
|---|---|---|
| Web | Spring Boot 3.3.6（JDK 21） | FastAPI + Uvicorn |
| 编排引擎 | 自研 DAG（NodeExecutor 注册表） | **LangGraph StateGraph** + MemorySaver |
| 状态管理 | 运行记录 + 节点 trace 持久化 | checkpointer + trace |
| 失败处理 | 节点级 abort/continue/retry1 | 同左 |
| 流式 | `SseEmitter` | `StreamingResponse` |
| 存储 | H2 + MyBatis | SQLite + SQLAlchemy |
| 前端 | Vue 3 + @vue-flow/core | — |
| 测试 | 244 单测 + 12 E2E | 10 测试（pytest） |

## 📂 目录结构

```
ai-agent-platform/         # Java 版
├── backend/src/main/java/com/forjob/
│   ├── agent/             # 业务：智能体 / 工作流 / 运行
│   └── ai/kit/            # 套件：tool / llm / sse / auth
├── frontend/              # Vue 3 + @vue-flow 流程画布
└── sql/schema.sql

ai-agent-platform-py/      # Python 版
├── backend/app/
│   ├── workflow.py        # LangGraph 动态建图 + 失败策略 + 校验门
│   ├── services.py        # 工具 / 智能体 / 模板 / 运行
│   └── routes.py
├── backend/tests/         # 10 测试
└── docker-compose.yml     # MySQL + Redis + backend
```

## 🚀 快速开始（无需任何 API Key）

> 默认 `mock / echo` 网关，工作流引擎与工具调用（calculator/summarize/get_weather）本地可跑。

### Java 版
```bash
cd ai-agent-platform
cd backend && mvn -o spring-boot:run      # 后端 :8083
cd ../frontend && npm i && npm run dev    # 前端 :5173（@vue-flow 流程画布）
# 打开 http://localhost:5173  导入模板 doc-summary 或 conditional-branch
```

### Python 版
```bash
cd ai-agent-platform-py/backend
python -m venv .venv && .venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8083 --reload
# 校验工作流：POST /api/workflows/validate
# 运行（同步）：POST /api/runs/sync  body: {"workflow": <json>, "inputs": {...}, "run_id": "r1"}
# 跑测试：pytest tests -q
```

## ✅ 验证证据

| 版本 | 单元测试 | E2E | 关键断言 |
|---|---|---|---|
| Java | 244 通过（33 类） | 12 / 12 | `doc-summary` 全节点 SUCCESS |
| Python | 10 通过 | — | `doc-summary` SUCCESS、条件分支输出 14、缺 end 校验失败 |

## 🚀 开发路线

| 里程碑 | 内容 | 状态 |
|---|---|---|
| M1 | Java 版：DAG 引擎 + 六节点 + 运行追踪 | ✅ 完成 |
| M2 | Python 版：LangGraph 编排 + checkpointer | ✅ 完成 |
| M3 | 可视化设计器 + 定时调度 | 📋 规划 |
| M4 | 人工审批节点 + Multi-Agent | 📋 规划 |

## 🔗 相关资源

- 模块总览：[01 AI 智能应用](/instances/ai/)
- 兄弟项目：[AI 智能助手](/instances/ai/assistant) · [AI 知识库系统](/instances/ai/kb)
- 技术实践：[功能开发 › AI 应用](/apps/ai/)

---

上一级：[01 AI 智能应用](/instances/ai/) · [实例总览](/instances/)
