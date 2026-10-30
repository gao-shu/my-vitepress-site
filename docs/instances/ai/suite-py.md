# Python AI 应用套件（多产品）

> `✅ 已验证（7 个 MVP）` · `🐘 PostgreSQL 16 + pgvector` · `🎭 Mock 可离线演示` · `🧪 60+ E2E`
> 所属模块：[01 AI 智能应用](/instances/ai/) · 交付：`E:\8.cangku\for-job\ai-suite-py`
> ⚠️ 与 Java 项目是**两套独立交付**：技术栈不同、代码不共享、数据库不共享。

## 📌 项目简介

`ai-suite-py` 是一个**模块化单体 + 多产品**的演示仓库：共享机制在 `packages/*`，业务在 `products/*`（产品之间禁止互相 import）。它用一套 Python 技术栈，把 7 个典型 AI 应用形态各做了一个可运行的 MVP。

- **面向用户**：需要快速验证多种 AI 产品形态的团队
- **核心价值**：一套工程骨架（鉴权 / workspace 隔离 / 异步任务 / 流式 / 引用）承载 7 个产品
- **诚实标注**：Mock 结果在 API（`is_mock`）、界面（徽标 + 横幅）、导出文档（页首声明）三处明确标注，不伪装成真实模型输出

## 📊 产品矩阵（7 个 MVP）

| # | 产品 | 一句话 |
|---|---|---|
| 1 | AI 知识库 | 上传 → 异步解析/切分/向量化 → 语义检索 → 流式问答（带可定位引用） |
| 2 | AI 文档处理助手 | PDF/DOCX/TXT/MD → 解析 → 摘要 + 关键字段抽取 → Markdown 导出 |
| 3 | AI 工作流自动化助手 | 文件库 → 六节点顺序执行 → 条件跳过 / 失败重试 → Markdown 导出 |
| 4 | AI Agent | 白名单工具循环（计算/时间/文本统计）→ 步骤落库 → 最终答案 |
| 5 | AI 数据分析助手 | CSV/XLSX → 本地画像统计 → 白名单运算 + 模型解释 → 图表与报告 |
| 6 | AI 客服与销售助手 | 客户档案 → 对话分析（事实/推断/未知 + 证据）→ 回复草稿 → 资料问答 |
| 7 | AI 内容创作助手 | 选题 → 素材 → 大纲 → 初稿 → 编辑/版本 → Markdown 导出 |

> 产品 1 的 MVP 已冻结（tag `v1.0-mvp`），其余产品 MVP 已交付。

## 🏗️ 技术架构

### 模块化单体 + 独立 worker

```
┌──────────────────────────────────────────────────────┐
│   web（Vue 3 + TS + Element Plus，各产品独立路由树）    │
├──────────────────────────────────────────────────────┤
│   apps/server（FastAPI）                              │
│   /api/kb/**  /api/documents/**  /api/docs/**  /api/wf/**│
├──────────────────────────────────────────────────────┤
│   products/*（业务，禁止互相 import）                   │
├──────────────────────────────────────────────────────┤
│   packages/*（共享：鉴权 / workspace / 任务 / 存储 / 模型）│
├──────────────────────────────────────────────────────┤
│   apps/worker（异步解析：租约 + 心跳 + 过期回收 + 退避重试）│
├──────────────────────────────────────────────────────┤
│   PostgreSQL 16 + pgvector（迁移由 Alembic 管理）        │
└──────────────────────────────────────────────────────┘
```

- **API 只入队，解析在 worker**：worker 必须启动，否则文档会停在「排队中」。
- **workspace 隔离**：所有 KB/文档/分块/任务查询强制带 workspace，越权一律 404（不泄露存在性）。
- **双状态机**：`jobs` 与业务表各自维护状态，失败可重试、可观测。

## 🧰 技术栈 / 开发语言

| 分层 | 技术 |
|---|---|
| 后端 | Python 3.12 + FastAPI + SQLAlchemy(async) + Alembic |
| 数据库 | PostgreSQL 16 + pgvector（余弦相似度） |
| 前端 | Vue 3 + TypeScript + Vite + Element Plus |
| 包管理 | uv（`uv sync` / `uv run`） |
| 异步任务 | 独立 worker 进程（租约 + 心跳 + 退避重试） |
| 模型 | Chat 真实验证（qwen-plus）；Embedding 默认 mock，可切 `openai_compatible` |
| 测试 | pytest + 多个 E2E 脚本 |

## 📂 目录结构

```
ai-suite-py/
├── apps/
│   ├── server/          # FastAPI 应用
│   └── worker/          # 异步解析 worker
├── packages/            # 共享机制（鉴权 / workspace / 任务 / 存储 / 模型）
├── products/            # 7 个产品业务
├── migrations/          # Alembic 迁移
├── web/                 # Vue 3 前端
├── scripts/             # check_db / e2e_* / evaluate_models
├── tests/               # pytest
└── docker-compose.yml
```

## 🚀 快速开始

> 前置：PostgreSQL 16 + pgvector（或 `docker compose up -d` 一键起）。不填模型 Key 时全程 Mock，仍可按 3 个 E2E 套件跑通。

```bash
cd ai-suite-py
uv sync                          # 安装依赖（uv）
cp .env.example .env             # 配置数据库连接
alembic upgrade head             # 建表
uv run apps/worker &             # 启动异步解析 worker（文档类产品必须，否则停在「排队中」）
uv run apps/server               # 启动 API（默认 :8000）
# API 文档：http://localhost:8000/docs
# 跑 E2E：pytest 或 scripts/e2e_*
```

> 真模型：在 `.env` 填 `CHAT_API_KEY`；不填则全程 Mock，结果在 API/界面/导出三处明确标注，不伪装成真实输出。

## ✅ 验证证据

| E2E | 结果 |
|---|---|
| `e2e_smoke`（产品 1） | **17 / 17 通过** |
| `e2e_docs`（产品 2） | **22 / 22 通过** |
| `e2e_workflows`（产品 3） | **26 / 26 通过** |

> 真实模型评估另有一套：`scripts/evaluate_models`（无 Key 时安全退出，Mock 基线仅作流程对照）。

## 🚀 开发路线

| 里程碑 | 内容 | 状态 |
|---|---|---|
| M1 | 产品 1 知识库 MVP（冻结 v1.0-mvp） | ✅ 完成 |
| M2 | 产品 2–7 MVP 交付 | ✅ 完成 |
| M3 | 真实 Embedding 切换 + rerank | 📋 规划 |
| M4 | 多租户组织 / 限流 / 审计日志 | 📋 规划 |

## 🔗 相关资源

- 模块总览：[01 AI 智能应用](/instances/ai/)
- 同构 Java 版：[AI 知识库系统](/instances/ai/kb) · [AI 工作流与智能体平台](/instances/ai/agent-platform)
- 技术实践：[功能开发 › AI 应用](/apps/ai/)

---

上一级：[01 AI 智能应用](/instances/ai/) · [实例总览](/instances/)
