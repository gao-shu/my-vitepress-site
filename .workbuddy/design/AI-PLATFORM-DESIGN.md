# AI 应用产品矩阵 —— 总体设计 v2（架构复审版）

> 状态：**待最终审查**。本版只改设计文档，未创建、未修改任何项目代码。
> 约束：`E:/8.cangku/for-job/` 下的 `ai-knowledge-base`、`ai-app-scaffold`、`ai-assistant`、`ai-agent-platform`、`openbiz-*` 及 `AI-SUITE-SPEC.md` 全部**只读**。

---

## 版本记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1 | 2026-10-26 | 初版：模块化单体 + packages/products + pgvector + PG 任务表 |
| v2 | 2026-10-26 | 八项复审意见的落实，详见第 15 章 |
| **v2.1** | 2026-10-26 | Q1/Q3 定稿；**新增 14.4 实机环境核验、14.5 数据库双轨、14.6 环境约定、14.7 凭据阻断项**；S0 DoD 与 16 章同步修订。详见 14.4 |
| **v2.2** | 2026-10-26 | **S0 已实施完成**：新增 14.8 实施记录与实测证据；S0 章节改为「健康检查 liveness/readiness 分离」，数据库下移到 S1；记录 Starlette 1.x 路由枚举差异 |
| **v2.3** | 2026-10-26 | **S1 范围收缩**：原「9 张表」改为「基础设施 + `app_meta` 单表」，业务表按 S2/S3/S5 分阶段引入（用户要求）。新增 **14.9 S1 准入清单**：三项 S0 复查处置（R1 OpenAPI 枚举不可信 → 双源枚举 + 路由策略登记；R2/R3 以真机迁移为验收）、六条 S1 验收、**测试库三重守卫 L1/L2/L3**。文档状态改为「暂停等库」 |
| **v2.4** | 2026-10-26 | **固化 S1 验收标准（用户确认）**：将 6 项已确认验收要求并入 **14.9**——① 数据库身份四元组核验（含 `inet_server_addr()` 可 `NULL`、联合判据、fail closed）② 应用角色 `rolsuper=false` 且两库 pgvector 版本一致（预期 0.8.6）+ 临时表探针 ③ 迁移三段验证（`upgrade→downgrade→upgrade`，仅测试库）④ 测试库隔离不得仅依赖连接串/库名 ⑤ 路由策略以 `(method, path)` 登记、未登记即失败、登记不替代行为测试、覆盖 Starlette 1.x 递归/嵌套/`Mount` ⑥ 回归须重跑 pytest/mypy/ruff/import-linter 且提供实际命令与输出、禁止 skip/降标准。仅修改本设计文档，未改代码与 AGENTS.md |
| **v2.5** | 2026-10-26 | **S1 已实施完成并通过全部 14.9 验收**：交付 `migrations/`（`env.py` 从 `Settings` 取 URL + `-x target/-x op` + L3 非测试库拒绝 downgrade 的 fail-closed 守卫）、首个迁移 `app_meta`、`packages/core/config` 的 L1 库名守卫、`db.py` 的 `Base`/`AppMeta`/`session_scope`、`deps.get_db`、`scripts/check_db.py`、`tests/route_policy`（OpenAPI×ASGI 双源枚举）、`test_db_guard`、`test_migrations`（三段回滚，仅 `aisuite_test`）。迁移三段在 `aisuite_test` 验证通过；L3 守卫拒绝 dev 库 downgrade；两库 `app_meta` 已应用；pytest 31 passed；mypy/ruff/import-linter 全过。提交 `e630a29`。文档 `alembic/` 笔误已统一为 `migrations/`。S1 验收后进入 S2 |
| **v2.6** | 2026-10-26 | **S2 已实施完成并通过 DoD**：新增 `packages/identity`（models:User/Workspace/WorkspaceMember、security:bcrypt、jwt:HS256+exp、repository、service:注册即建 personal workspace 且 role=owner、认证不泄露用户存在）、`apps/server/routers/auth`（`/api/auth/register|login|me`）、`deps.get_current_user`+`_resolve_db_url`（test 模式连 test_database_url）。迁移 `002 users_and_workspaces`（含 ON DELETE CASCADE）。pytest 39 passed；mypy/ruff/import-linter 全过；迁移三段在 `aisuite_test` 验证通过，dev 库升到 head。提交 `5ea49b7`。下一步 S3：上传+异步解析 |

**v2 的六处结构性修订**

1. 新增「部署模式 / 租户模型 / 资源归属」三概念区分，引入 `workspace` 作为资源归属层（不是完整多租户）
2. 模型接入层重写：能力声明（Capabilities）+ 命名档位（profile）+ 明确的降级策略
3. 向量检索增加 `VectorStore` 接口隔离，并诚实界定「隔离检索动作，不隔离数据存储」
4. 后台任务独立成章：租约式领取、心跳、超时回收、错误分类、幂等写入、双状态机
5. S0–S8 全部改为「验收标准驱动」，每阶段给出可执行命令与 DoD 清单
6. 公共能力边界重写为「机制共享、策略不共享」，附下沉规则与禁止的抽象清单

---

## 1. 目标与关键假设

### 1.1 目标（优先级）

| 优先级 | 目标 | 判定标准 |
|---|---|---|
| P0 | 七个产品复用同一底座 | 第二个产品接入时，新增代码 90% 落在 `products/` 下 |
| P0 | 产品边界清晰、可独立部署 | 删除某个 `products/*` 目录，其余产品仍能启动 |
| P1 | 单人 + AI 工具可持续维护 | 新会话靠 `AGENTS.md` 在 10 分钟内定位到改动点 |
| P1 | 简单、稳定、可测试 | 核心模块覆盖 ≥ 70%，测试不消耗真实模型额度 |
| P2 | 第一阶段交付一个完整产品 | 知识库可上传、可问答、有引用、有错误可查 |

### 1.2 关键假设

| # | 假设 | 若不成立的影响 |
|---|---|---|
| A1 | 一个部署实例服务一个组织（个人或一家企业），不做公开注册 SaaS | 若做 SaaS，需在 workspace 上加 tenant 层（见第 6 章，代价可控） |
| A2 | 并发低：同时在线 < 200，QPS < 50 | 需引入 Redis、多 worker、连接池调优 |
| A3 | 单机 Docker Compose 部署 | K8s 只影响部署配置，不改代码 |
| A4 | 模型走 HTTP API，不本地部署大模型 | 若本地 vLLM，适配层不变，硬件成本上升 |
| A5 | 单库文档 < 5 万页，总量 < 100 GB | pgvector 需调 HNSW 参数或换专用向量库（见第 8 章） |
| A6 | 旧 Java 项目不参与新产品业务链路 | 若需集成，只走 HTTP（见 3.5） |
| A7 | 第一版不处理扫描件（图片型 PDF） | 需提前引入 OCR（见 13.4 Q4） |

### 1.3 三条设计原则（v2 新增）

| 原则 | 含义 | 反例（本设计拒绝的做法） |
|---|---|---|
| **机制共享，策略不共享** | 公共层提供"怎么做"的机制，产品层决定"做什么"的策略 | 公共层写死「KB 只查公开文档」这类业务判断 |
| **廉价前瞻，昂贵后置** | 成本极低的前瞻（加一列、加一层 ID、加一个接口）现在做；成本高的（多租户运营台、工作流引擎）等真实需求 | 现在就做租户管理后台；现在就抽象工作流引擎 |
| **隔离靠测试守护，不靠纪律** | 关键边界写自动化测试，不依赖开发时记得 | 只在文档里写「查询必须带 workspace_id」 |

---

## 2. 技术选型

### 2.1 决策一览

| 领域 | 选择 | 为什么 | 解决什么 | 代价 | 可延后 |
|---|---|---|---|---|---|
| 架构风格 | 模块化单体 | 单人维护，微服务运维成本无人分摊 | 避免七个产品各成一套服务 | 未来拆分需重构 import | 否 |
| 仓库 | 单仓库 monorepo | 公共模块与产品同仓，一处改动全局可见 | 多仓版本对齐问题 | 仓库体积增长 | 否 |
| 运行时 | **Python 3.12.10**（`D:\softwork\Python312`） | 与设计基线一致；wheel 覆盖最全 | 避免第三方库在 3.13 上缺预编译包 | 比 3.13 少部分新语法 | 否 |
| 依赖工具 | **uv 0.10.9**（`pyproject.toml` 仍为标准声明） | 解析与安装比 pip 快一个量级，锁文件可复现 | 换机器不出现版本漂移 | 多一个工具；`uv.lock` 需入库 | 否（可退回 pip） |
| 后端 | FastAPI | 原生 async、Pydantic 集成、OpenAPI、SSE 成熟 | 校验与文档零成本 | 无内置 admin | 否 |
| 校验 | Pydantic v2 | 与 FastAPI 同源 | 请求/响应/配置统一类型 | — | 否 |
| ORM | SQLAlchemy 2.x async（锁文件定版，实测 2.1.6） | 生态最成熟，`select()` 新写法 | 避免手写 SQL 与注入 | 学习曲线 | 否 |
| 迁移 | Alembic | SQLAlchemy 官方配套 | schema 可追溯可回滚 | 需禁手改库 | 否 |
| 主库 | PostgreSQL 16 | pgvector、JSONB、`SKIP LOCKED`、全文检索 | 一库解决业务+向量+队列 | 单点，需备份 | 否 |
| 向量 | pgvector 0.7+ | 与业务同库，事务一致 | 避免向量与业务不同步 | 超大规模性能不足 | 否（可换实现） |
| 缓存 | V1 不用 Redis | 无状态 JWT + PG 任务表已够 | 少一个组件 | 多 worker 时需补 | 是 |
| 后台任务 | 独立 worker 进程 + PG 任务表 | 见第 7 章 | 解析不阻塞接口、重启不丢任务 | 多一个进程要运维 | 否（可换 Celery） |
| 前端 | Vue 3 + TS + Vite + Element Plus + Pinia | 现有栈 | 减少上下文切换 | — | 否 |
| 测试 | pytest + pytest-asyncio + httpx | 事实标准 | 可测 async 接口 | 需真实 PG 容器 | 否 |
| 部署 | Docker Compose | 单机够用 | 环境一致 | 无自动扩缩容 | 否 |
| 日志 | structlog（JSON） | 结构化、可关联 trace_id | 可检索可归因 | 比 print 啰嗦 | 否 |
| 配置 | pydantic-settings | 启动即校验配置 | 避免运行中途报缺配置 | — | 否 |
| 模型接入 | 自建薄适配层 + OpenAI 兼容协议 | 见 2.3 | 换供应商不改业务 | 私有能力靠 escape hatch | 否 |
| Prompt | 文件模板（Jinja2）+ git 版本 | diff 可读，AI 工具可直接改 | 避免 Prompt 散落 | 无 UI 编辑 | 部分 |
| 文档解析 | 按格式分流（PDF/DOCX/TXT/MD） | 覆盖 90% 企业文档 | 避免引重型 OCR | 扫描件不支持 | 是 |
| 切分 | 自建规则（标题感知 + 定长兜底） | 中文可控 | 避免框架版本漂移 | 需自己调参 | 否 |
| Agent 框架 | V1 不引入 | 第一个产品不需要 | 避免为不用而引入 | 做 Agent 产品时再评估 | 是 |
| 依赖注入 | FastAPI `Depends` + 显式构造 | 无第三方 DI 容器 | 保持简单可测 | 层级深时略冗 | 否 |

### 2.2 明确不引入

| 组件 | 结论 | 理由 |
|---|---|---|
| Kubernetes | 不引入 | 单机 Compose 足够；引入后时间全花在运维 |
| 微服务 / 服务网格 | 不引入 | 无团队分摊；装配式单体已满足边界 |
| Celery / RabbitMQ | V1 不引入 | 任务量不需要；worker 层已抽象，可平滑替换 |
| 独立向量库 | V1 不引入 | 分库引入一致性问题（见第 8 章） |
| LangChain / LlamaIndex 作为必需依赖 | 不引入 | 版本变动频繁，AI 工具易写过时 API |
| LangGraph | V1 不引入 | 第一个产品无多步编排 |
| Django Admin | 不引入 | 运维用脚本，产品化后再做 |
| 第三方 DI 容器 | 不引入 | FastAPI Depends 已足 |
| 通用 CRUD 基类 / 泛型仓储 | 不引入 | AI 产品业务差异大，抽象收益小于理解成本 |

### 2.3 模型接入层（v2 重写）

#### 2.3.1 目录

```
packages/llm/
├── contracts.py            # 接口与数据结构（协议层）
├── capabilities.py         # 能力声明与校验
├── service.py              # 唯一调用入口（档位解析、重试、用量统计）
├── errors.py               # 错误分类
├── providers/
│   ├── openai_compatible.py   # 第一个实现
│   └── __init__.py
└── testing/
    └── mock_provider.py    # 确定性输出，不联网
```

#### 2.3.2 接口的能力边界（v2 关键补充）

**问题**：不同模型在流式、结构化输出、工具调用、多模态上差异极大。接口设计成"最小公倍数"会丢能力，设计成"全能力"会强迫所有 provider 假装支持。

**方案**：能力声明 + 显式校验 + 明确降级。

```python
# capabilities.py（示意）
@dataclass(frozen=True)
class Capabilities:
    streaming: bool
    structured_output: bool      # 原生 response_format / json_schema
    tool_calling: bool
    vision: bool
    max_context_tokens: int
    max_output_tokens: int
```

`contracts.py` 定义：

| 类型 | 内容 |
|---|---|
| `LLMRequest` | messages、temperature、max_tokens、`response_schema`（可选 Pydantic 模型）、tools（V1 不用）、`extra` |
| `LLMResponse` | content、`structured`（解析后的 Pydantic 实例，可选）、usage、model、provider、latency_ms |
| `StreamChunk` | delta、finish_reason、usage（末帧） |
| `ChatProvider` Protocol | `capabilities` 属性、`complete()`、`stream()` |
| `EmbeddingProvider` Protocol | `dim`、`embed(texts) -> EmbeddingBatch` |

#### 2.3.3 命名档位（profile）

业务代码**不写模型名**，写档位：

```python
resp = await llm.complete(req, profile="strong")   # 复杂推理
resp = await llm.complete(req, profile="cheap")    # 常规问答
vecs = await llm.embed(texts, profile="embedding")
```

配置：

```dotenv
LLM_PROFILE_DEFAULT=cheap
LLM_PROFILE_CHEAP_PROVIDER=openai_compat
LLM_PROFILE_CHEAP_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
LLM_PROFILE_CHEAP_API_KEY=
LLM_PROFILE_CHEAP_MODEL=qwen-plus
LLM_PROFILE_STRONG_MODEL=qwen-max
LLM_PROFILE_EMBEDDING_MODEL=text-embedding-v3
LLM_PROFILE_EMBEDDING_DIM=1024
```

**收益**：换模型只改 `.env`；对比测试换档位；成本控制换默认档。**代价**：多一层间接，配置项变多。

#### 2.3.4 降级策略（必须明确，不能含糊）

| 场景 | 策略 | 理由 |
|---|---|---|
| 请求 `response_schema` 但 provider 无原生结构化 | 用「JSON 指令 + Pydantic 校验 + 失败重试 1 次」兜底，仍失败抛 `StructuredOutputError` | 抽取类需求高频，必须能用 |
| 请求流式但 provider 不支持 | **不支持就不支持**，抛 `CapabilityError` | 假流式（整段返回后切片）会误导前端与用户预期 |
| 请求工具调用但 provider 不支持 | 抛 `CapabilityError` | 用提示词模拟工具调用不可靠，是生产事故源头 |
| 请求视觉输入但 provider 不支持 | 抛 `CapabilityError` | 同上 |
| 上下文超限 | `service` 层预检查，超限抛 `ContextOverflowError`，附实际/上限 token | 让调用方决定截断还是换档位，不静默截断 |
| 限流 / 5xx | 指数退避重试 2 次（仅幂等请求），仍失败抛 `ProviderUnavailableError` | 网络抖动常见，但不无限重试 |
| 无 API Key | 自动切 `MockProvider`，响应标 `provider="mock"` | 开发与演示必须能离线跑 |

**硬性规则**：业务代码禁止 `import openai`，只能 `from packages.llm import service as llm`。用 ruff `banned-api` 或自定义 lint 强制。

#### 2.3.5 明确不做

- 不为十几个厂商各写适配器
- 不做模型自动路由（按成本/质量自动选）——V1 由代码显式指定档位
- 不做 token 计费与配额（V1 只把用量记到 `kb_messages.usage`）

---

## 3. 整体架构

### 3.1 分层

```
┌──────────────────────────────────────────────────────────────────┐
│  浏览器  Vue 3 + TS + Element Plus（静态资源）                      │
│  路由前缀隔离：/kb/*  /doc/*  /agent/* …                           │
└───────────────────────────┬──────────────────────────────────────┘
                            │ HTTPS / SSE
┌───────────────────────────▼──────────────────────────────────────┐
│  apps/server —— FastAPI（只处理请求，不跑重任务）                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 横切：CORS / 请求ID / 结构化日志 / 统一异常 / 认证 / 限流(内存) │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────┐  │
│  │ products/kb  │ │ products/doc │ │ products/…  (未来)        │  │
│  └──────┬───────┘ └──────┬───────┘ └────────────┬─────────────┘  │
│  ┌──────▼────────────────▼──────────────────────▼─────────────┐  │
│  │ packages：core │ llm │ prompts │ storage │ ingest │ rag │ jobs│
│  └──────┬──────────────────────────────────────────┬───────────┘  │
└─────────┼──────────────────────────────────────────┼──────────────┘
          │                                          │
┌─────────▼──────────┐                    ┌──────────▼───────────┐
│ apps/worker        │                    │ 外部模型 API          │
│ 独立进程            │                    │ OpenAI 兼容协议       │
│ 轮询 jobs / 心跳    │                    └──────────────────────┘
└─────────┬──────────┘
          │
┌─────────▼──────────────────┐   ┌──────────────────────────┐
│ PostgreSQL 16 + pgvector   │   │ 文件存储（本地卷 → MinIO） │
│ 业务表 / 向量 / jobs        │   └──────────────────────────┘
└────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ 旧 Java 项目（完全隔离，只读）                                      │
│ 独立仓库 / 独立数据库 / 独立端口 / 仅 HTTP 可集成                    │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 职责与禁区

| 层 | 职责 | 禁止 |
|---|---|---|
| 前端 | 展示、交互、流式渲染、状态 | 不直连 LLM，不存密钥 |
| 横切层 | 认证、日志、异常、追踪、限流 | 不含业务逻辑 |
| `apps/server` | 装配产品、注册中间件、lifespan | 不写业务逻辑 |
| `apps/worker` | 领取任务、执行 handler、心跳 | 不暴露 HTTP 接口 |
| `products/*` | 业务编排、资源归属、权限判断 | 不 import 其他 product |
| `packages/*` | 纯技术能力，无产品语义 | 不 import products，不含业务规则 |
| 数据层 | 持久化 | 不含业务判断 |

### 3.3 依赖方向（CI 强制）

```
apps/server ─┐
apps/worker ─┴─► products/* ─► packages/* ─► (stdlib / 三方库)

✗ products/kb ─► products/doc
✗ packages/* ─► products/*
✗ packages/jobs ─► packages/rag（jobs 只依赖 core）
```

用 `import-linter` 的 layers + forbidden 契约检查，CI 失败即阻断。

### 3.4 多产品的共享与隔离

**共享**：一切被两个以上产品需要的**机制**下沉到 `packages`（判据见 5.3）。

**隔离**三机制：

| 机制 | 实现 | 效果 |
|---|---|---|
| 代码 | `products/<name>/` 独立目录，禁互相 import | 删目录即下线产品 |
| 装配 | `create_app(enabled: list[str])` 按配置挂载 router | 一个部署可只开部分产品 |
| 数据 | 表名带产品前缀（`kb_*`、`doc_*`） | 归属清晰，未来可拆库 |

独立部署的落地方式（现在不做，结构留好）：

```python
# apps/server/main.py
def create_app(enabled: list[str]) -> FastAPI:
    app = FastAPI()
    install_middlewares(app)
    for name in enabled:
        mod = importlib.import_module(f"products.{name}")
        app.include_router(mod.router, prefix=mod.PREFIX)
    return app
```

将来单独部署 KB：启第二个进程 `create_app(["kb"])`，**代码零改动**。这是「用装配代替拆分」。

### 3.5 新旧项目隔离

| 维度 | 规则 |
|---|---|
| 代码 | 不共享。Python 不 import 任何 Java 符号；Java 侧一行不改 |
| 数据库 | 不同 database（不同实例或不同库名）、不同账号，Python 账号无 Java 库权限 |
| 部署 | 独立 `docker-compose.yml`、独立端口、独立数据卷 |
| 认证 | V1 各自独立。**不共享 JWT 密钥**（耦合后无法独立升级） |
| 集成 | 若需要：只走 HTTP，Python 侧封装 `clients/java_api.py`，带超时/重试/熔断 |
| 文件 | 不共用存储目录 |
| 复用 | **不复用** `AI-SUITE-SPEC.md` 约定的 Java `kit` 包，Python 侧独立实现 |

**与既有 Java 知识库的叙事区分**（避免面试被问倒）：

| | `ai-knowledge-base`（Java） | 新 Python 套件第一个产品 |
|---|---|---|
| 定位 | 上一轮交付的 v1 作品 | 多产品工程底座的第一个验证 |
| 检索 | 哈希向量（可跑通，无语义能力） | 真 embedding + pgvector + 可评测 |
| 数据库 | H2 文件模式 | PostgreSQL + pgvector |
| 目标 | 功能闭环 + 单测 | 可复用底座 + 可量化效果 |

两者并存不矛盾：一个是功能交付，一个是工程体系与效果升级。但**站点与简历必须写清这个关系**，否则会被当成重复劳动。

---

## 4. 目录结构

### 4.1 第一阶段结构

```
ai-suite-py/                        # Q1 已定 A：E:/8.cangku/for-job/ai-suite-py/
├── AGENTS.md                       # AI 协作规则（第 11 章）
├── README.md
├── pyproject.toml                  # 依赖 + ruff + mypy + pytest 配置
├── alembic.ini
├── docker-compose.yml              # S0 只含 db；S7 才补 api + worker + web（见 14.6）
├── Dockerfile
├── .env.example
├── .gitignore
│
├── apps/
│   ├── server/
│   │   ├── main.py                 # create_app()
│   │   ├── deps.py                 # get_db / get_current_user / get_llm / get_store
│   │   ├── middleware.py           # 请求ID、耗时、异常
│   │   └── lifespan.py             # 连库、关闭钩子
│   ├── worker/
│   │   ├── main.py                 # 轮询循环 + 心跳 + 回收
│   │   └── registry.py             # job type → handler 映射
│   └── web/
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── src/
│           ├── main.ts / App.vue
│           ├── router/index.ts
│           ├── stores/auth.ts
│           ├── shared/
│           │   ├── api/client.ts    # fetch 封装：错误、401、SSE
│           │   ├── api/types.ts     # 与后端 OpenAPI 对齐
│           │   └── components/
│           ├── layouts/DefaultLayout.vue
│           └── products/kb/{views,components,api.ts}
│
├── packages/
│   ├── core/
│   │   ├── config.py               # Settings
│   │   ├── db.py                   # engine / session / Base
│   │   ├── logging.py
│   │   ├── errors.py               # AppError 体系
│   │   ├── security.py             # 密码哈希、JWT
│   │   ├── sse.py                  # 统一 SSE 事件封装
│   │   └── pagination.py
│   ├── llm/                        # 见 2.3
│   ├── prompts/
│   │   ├── registry.py             # 加载、变量校验、渲染
│   │   └── templates/
│   │       ├── common/             # 跨产品共用
│   │       └── kb/                 # 产品专用
│   ├── storage/
│   │   ├── contracts.py            # ObjectStore Protocol
│   │   └── local.py
│   ├── ingest/
│   │   ├── contracts.py            # Parser Protocol
│   │   ├── parsers/{pdf,docx,text,markdown}.py
│   │   ├── chunker.py
│   │   └── service.py              # 编排
│   ├── rag/
│   │   ├── store/                  # VectorStore 实现（pgvector）
│   │   ├── retriever.py            # 检索编排
│   │   └── context.py              # token 预算 + 上下文拼装
│   └── jobs/
│       ├── models.py               # Job 模型
│       ├── queue.py                # enqueue / claim / heartbeat / reclaim
│       ├── runner.py               # 执行与错误处理
│       └── errors.py               # Retryable / NonRetryable
│
├── products/
│   └── kb/
│       ├── __init__.py             # router + PREFIX + register_jobs()
│       ├── api.py                  # 薄路由
│       ├── service.py              # 业务编排
│       ├── repository.py           # 数据访问（强制 workspace 过滤）
│       ├── schemas.py
│       ├── models.py
│       ├── authz.py                # 资源级授权
│       └── jobs.py                 # ingest_document handler
│
├── migrations/
├── scripts/{seed.py,reembed.py}
├── tests/
│   ├── conftest.py                 # PG 容器、事务回滚、MockProvider
│   ├── packages/{llm,rag,ingest,jobs}/
│   ├── products/kb/
│   └── isolation/                  # 隔离契约测试（第 6.4）
└── docs/{adr,api.md}
```

### 4.2 明确不创建

| 不建 | 何时建 |
|---|---|
| `packages/agents/` | 做 Agent 产品时 |
| `packages/workflow/` | 做 Workflow 产品时 |
| `packages/analytics/` | 有成本看板需求时 |
| `packages/notify/` | 需邮件/IM 推送时 |
| `packages/tenancy/` | 确认做 SaaS 时（V1 用 workspace 字段即可） |
| `products/{doc,agent,cs,bi,creator}/` | 各自立项时 |
| `apps/web/src/products/*`（除 kb 外） | 同上 |
| `docs/*.md` 大量说明 | 只留 `adr/` + `api.md` |

> 原则：目录反映已存在的东西，不反映想象的需求。

### 4.3 第一阶段 vs 后续

| 模块 | V1 | 触发条件 |
|---|---|---|
| core / llm / prompts / storage / ingest / rag / jobs | 全部 | — |
| products/kb | 全部 | — |
| OCR | 不做 | 扫描件占比 > 30% |
| rerank / 混合检索 | 不做 | 评测显示召回不足 |
| Redis | 不做 | 多 worker 需共享缓存/限流 |
| VectorStore 第二实现 | 不做 | 需适配达梦等无 pgvector 环境 |
| Agent 框架 | 不做 | 做 Agent 产品 |

---

## 5. 公共能力划分

### 5.1 三档

**A · 第一阶段必须建立**

| 能力 | 内容 | 判据 |
|---|---|---|
| 配置 | Settings + `.env` + 启动校验（缺项直接退出） | 无法区分环境 |
| 数据库 | engine / session / Base / 迁移 | 无法存储 |
| 日志 | structlog + 请求ID + 耗时 | 线上无法定位 |
| 异常 | `AppError` 体系 + 全局处理器 + 统一错误体 | 前端无法统一处理 |
| 认证 | 密码哈希 + JWT + `get_current_user` | 产品要求登录 |
| 模型接入 | contracts + service + 1 个 provider + Mock | 核心依赖 |
| Prompt | registry + 模板目录 + 变量校验 | 避免散落 |
| 文件存储 | `ObjectStore` Protocol + 本地实现 | 上传必需 |
| 任务 | 表 + 队列 + worker + runner | 解析不能阻塞请求 |

**B · 第一个产品实现（设计成可复用）**

| 能力 | 复用给 | 复用方式 |
|---|---|---|
| 文档解析 | 文档处理、客服 | 调 `ingest.parse()` |
| 切分 | 同上 | 调 `ingest.chunk()` |
| 向量化入库 | 所有 RAG 产品 | 调 `rag.index()` |
| 检索 | 客服、Agent、数据分析 | 调 `rag.search()` |
| 引用构造 | 客服、Agent | `rag.context.build_citations()` |
| 流式封装 | 全部 | `core.sse` |
| 结构化输出 | 文档处理、数据分析 | `llm.complete(response_schema=...)` |

**C · 有真实需求再写**

| 能力 | 触发 |
|---|---|
| 多租户运营（tenant 表、租户管理台、计费） | 确认做 SaaS |
| 工具调用 / Function Calling | 做 Agent 产品 |
| 工作流编排 | 做 Workflow 产品 |
| rerank / 混合检索 / 查询改写 | 评测驱动 |
| OCR / 版面分析 | 扫描件需求 |
| 会话记忆压缩 | 长对话体验问题 |
| 用量配额与计费 | 商务需求 |
| Prompt 数据库化与 A/B | 非开发人员要调 Prompt |
| SSO（企微/钉钉/OIDC） | 企业客户要求 |
| 审计日志 | 合规要求 |

### 5.2 机制共享，策略不共享（v2 核心）

公共层只提供机制，产品层决定策略。

| 能力 | 共享（packages 提供机制） | 不共享（留在 product，属策略） |
|---|---|---|
| 模型调用 | 请求/响应结构、超时、重试、用量统计、能力校验、降级 | 用哪个档位、Prompt 内容、温度、输出格式 |
| 文件存储 | put / get / delete / signed_url、key 生成规则 | 文件与业务对象的关联、谁能下载 |
| 文档解析 | `parse(bytes, mime) -> ParsedDoc{text, meta}` | 解析结果如何映射字段、是否入库 |
| 知识检索 | 向量检索、top-k、上下文拼装、token 预算 | 查哪些库、相似度阈值、排序偏好、拒答规则 |
| 后台任务 | 队列、租约、重试、状态机、幂等工具 | job 的业务含义、handler 实现 |
| 认证 | 我是谁（JWT）、workspace 成员查询 | 谁能访问哪个资源（authz 在 product） |
| Prompt | 渲染引擎、变量校验、目录结构 | 具体模板内容 |
| 日志 | 结构化输出、trace_id 传播 | 记录哪些业务字段 |

**一句话**：`packages/rag/store` 负责「怎么在向量库里找」，`products/kb` 负责「找什么、找到多少算够、找不到怎么答」。

### 5.3 下沉规则与禁止的抽象

**下沉到 packages 的条件（三条全满足）**

1. ≥ 2 个产品有真实调用方
2. 接口稳定，连续两个产品接入未改动签名
3. 不含业务判断（没有 if 产品名、没有业务阈值）

**不下沉的情形**：只有 1 个产品用 → 留在 `products/`；接口还在变 → 留观；含业务规则 → 永远不下沉。

**禁止的抽象（写死，防止"顺手抽象"）**

| 禁止 | 原因 |
|---|---|
| 通用 CRUD Service 基类 / 泛型仓储 | AI 产品业务差异大，抽象后每个产品都要绕开 |
| 通用「实体+字段+表单」元数据驱动 | 是低代码平台方向，与目标冲突 |
| 万能 Agent 抽象（`BaseAgent`） | V1 无 Agent，过早抽象锁死后续 |
| 通用工作流引擎 | 需求未明，必然返工 |
| 统一 DTO 自动映射层 | Pydantic 已足够，多一层只增加调试难度 |
| 跨产品共享 ORM 模型基类（除时间戳字段） | 会导致表结构强耦合 |

---

## 6. 部署模式、租户与数据隔离（v2 新增）

### 6.1 三个概念必须分开

| 概念 | 定义 | 本项目 V1 |
|---|---|---|
| **部署模式** | 一套运行实例服务几个客户 | 单实例服务一个组织（内部可多用户） |
| **租户模型** | 数据是否存在租户边界 | V1 用 `workspace` 作归属层；**不建 tenant 表、不做租户管理台** |
| **资源归属** | 每个业务对象属于谁 | 一切业务资源挂 `workspace_id`，用户通过成员关系进入 |

关键判断：**V1 不做多租户运营，但必须有资源归属层。** 两件事成本差一个数量级：

- 加 `workspace_id` 列 + 一层成员表：约 1 天
- 完整多租户（tenant 表、租户管理、计费、导出、隔离测试、迁移工具）：约 3–4 周，且需商务决策

### 6.2 workspace 模型

```
users ──< workspace_members >── workspaces ──< kb_knowledge_bases ──< kb_documents ──< kb_chunks
                                                  └──< kb_conversations ──< kb_messages
```

| 规则 | 说明 |
|---|---|
| 注册即建空间 | 用户注册时自动创建 personal workspace，`role=owner` |
| 资源归属 | KB、文档、会话全部带 `workspace_id`；job 通过 `resource_type/id` 关联 |
| 成员角色 | V1 只有 `owner` / `member`，不做细粒度角色 |
| 可见性 | KB 有 `visibility`：`private`（仅 owner）/ `workspace`（空间内所有人可读） |
| 默认 | 新建 KB 默认 `private`，需显式改为 `workspace` 才共享 |

**为什么不保留 v1 的 `kb_members`**：V1 只需 owner/viewer 两级，viewer 等价于「同 workspace 的人」，`visibility` + `owner_id` 足够。加回来的触发条件：出现「只分享给张三」的需求。

### 6.3 隔离的三层实现

| 层 | 做法 | 失效风险 |
|---|---|---|
| 数据层 | 单库单 schema，靠 `workspace_id` 列（row-level） | 漏加 WHERE |
| 查询层 | **所有 repository 方法第一个参数必须是 `workspace_id`**，禁止无参查询 | 有人绕过 repository 直写 SQL |
| 应用层 | `authz.require_kb_access(user, kb_id, level)` 在 service 入口调用 | 新接口忘了调 |

三层的关系：数据层是事实，查询层是纪律，应用层是给用户看的错误。

**为什么不用 schema-per-tenant / database-per-tenant**：V1 只有一个组织，用不上；且迁移、备份、连接池都变复杂。触发条件：确认 SaaS 且客户要求物理隔离。

### 6.4 隔离靠测试守护（v2 关键）

三道自动化测试，缺一不可：

| 测试 | 做法 | 通过标准 |
|---|---|---|
| **跨空间读取** | 建 A、B 两个 workspace，各建 KB 与文档；用 A 的 token 请求 B 的所有资源 | 全部返回 **404**（不是 403，避免泄露存在性） |
| **跨空间写入** | 用 A 的 token 对 B 的资源执行上传/删除/改名 | 全部 404 |
| **路由全覆盖** | 从 OpenAPI schema 反射枚举所有受保护路由，逐条跑跨空间访问 | 覆盖率 100%，新增路由自动纳入 |

第三条是核心：**用 OpenAPI schema 反射生成用例**，以后新增接口不需要记得补测试——不加防护就会红。

```python
# tests/isolation/test_cross_workspace.py（示意）
@pytest.mark.parametrize("route", all_protected_routes())
async def test_cross_workspace_denied(route, ctx):
    resp = await ctx.client.request(route.method, route.fill(ctx.other_ids),
                                    headers=ctx.a_token)
    assert resp.status_code == 404
```

### 6.5 V1 明确不做

- 不做租户管理界面、租户切换、计费
- 不做 schema/database 级隔离
- 不做数据导出/删除的合规流程
- 不做跨租户管理员视角

**未来升级路径**（若确认 SaaS）：`workspaces` 上加 `tenant_id`，`users` 与 tenant 多对多，其余业务表**不动**（已挂 `workspace_id`）。这是 workspace 设计的主要收益。

---

## 7. 后台任务机制（v2 独立成章）

### 7.1 为什么 worker 独立进程（修订 v1 的「同进程」）

| 问题 | 后果 |
|---|---|
| PDF 解析是 CPU 密集（大文件可占满单核） | API 事件循环被拖慢，请求超时 |
| embedding 批量调用是长网络等待（单文档 30–120s） | 占用 API 进程连接与内存 |
| 重启 API 会丢掉正在跑的任务 | 需等租约过期才恢复，用户等待翻倍 |

独立进程的代价只是 compose 里多一个 service，**不是多一个中间件**，属于合理成本。

### 7.2 领取机制：租约式

```sql
UPDATE jobs
SET status = 'running',
    worker_id = :worker_id,
    started_at = now(),
    lease_until = now() + interval '15 minutes',
    attempts = attempts + 1
WHERE id = (
    SELECT id FROM jobs
    WHERE status = 'queued' AND run_after <= now()
    ORDER BY run_after
    FOR UPDATE SKIP LOCKED
    LIMIT 1
)
RETURNING *;
```

| 要点 | 说明 |
|---|---|
| `SKIP LOCKED` | 多 worker 并发安全，不互相阻塞 |
| `lease_until` | 到期即视为 worker 失联，可被回收 |
| `attempts + 1` | 领取即计数，避免崩溃循环无限重试 |
| `worker_id` | 心跳与回收时校验归属，防误抢 |

### 7.3 心跳与超时回收

| 机制 | 实现 | 参数 |
|---|---|---|
| 心跳 | worker 每 30s 执行 `UPDATE jobs SET lease_until = now() + interval '15 minutes' WHERE id = :id AND worker_id = :wid` | 周期 30s，租约 15min（30 倍余量） |
| 回收 | worker 每 60s 执行 `UPDATE jobs SET status='queued', worker_id=NULL, error_message='lease expired' WHERE status='running' AND lease_until < now()` | 回收后重新入队，计入 attempts |
| 卡死判定 | 同一任务连续 3 次租约过期 → 直接 `failed`，不再重试 | 防毒任务无限循环 |
| 长任务 | handler 内部按页/批分段，每段结束上报进度并续租 | V1 单文档解析最长约 10min，15min 租约够用 |

### 7.4 重试与错误分类

```python
class JobError(Exception): ...
class RetryableError(JobError): ...      # 网络超时、429、DB 连接抖动
class NonRetryableError(JobError): ...   # 文件损坏、格式不支持、参数非法
```

| 错误类型 | 处理 |
|---|---|
| `RetryableError` | `run_after = now() + min(2**attempts 分钟, 30 分钟)` |
| `NonRetryableError` | 立即 `failed`，不消耗重试次数 |
| 未捕获异常 | 视为 `RetryableError`，但记录完整堆栈 |
| `attempts >= max_attempts`（默认 3） | `failed` |

退避序列：1min → 2min → 4min（上限 30min）。

### 7.5 幂等：避免重复写入

**重复执行的三个来源**：租约过期被回收、worker 崩溃后重跑、人工重试。

**方案：单事务「先删后插」+ 唯一约束兜底**

```
1. 解析 → 切分 → 得到 chunks 列表（纯内存，无副作用）
2. 批量 embedding（外部调用，幂等）
3. 单事务：
     DELETE FROM kb_chunks WHERE document_id = :id
     INSERT INTO kb_chunks (...) VALUES (...)
     UPDATE kb_documents SET status='ready', chunk_count=N WHERE id=:id
     COMMIT
```

| 环节 | 幂等保证 |
|---|---|
| 步骤 1–2 | 无写入，天然幂等 |
| 步骤 3 | 事务原子：要么全成，要么全回滚。重跑先删，不会累积 |
| 兜底 | `UNIQUE (document_id, seq)`，逻辑出错也不会脏数据 |

**关键约束**：**embedding 调用绝不放事务内**，否则外部 API 慢会长时间持锁。

### 7.6 重启恢复

| 场景 | 恢复方式 |
|---|---|
| worker 崩溃（任务在 running） | 租约 15min 后过期 → 回收 → 重新入队 |
| worker 崩溃（解析中途） | 同上；写入是最后一步单事务，中途崩溃无脏数据 |
| API 重启 | 不影响任务（worker 独立） |
| 数据库重启 | worker 重连后继续轮询；running 任务靠租约回收 |
| 文档状态卡在 `parsing` | 回收 job 时同事务把 `kb_documents.status` 重置为 `pending` |

### 7.7 两个状态机必须分开（v1 的含糊处）

| 状态机 | 归属 | 用途 |
|---|---|---|
| `jobs.status` | 任务调度 | `queued → running → done / failed`（回收回到 `queued`） |
| `kb_documents.status` | 产品展示 | `pending → parsing → chunking → embedding → ready / failed` |

**规则**：调度只看 `jobs`，前端进度只看 `kb_documents`。更新文档状态是 handler 的职责，不是队列的职责。混用会导致「任务重试了但文档状态没回退」这类问题。

### 7.8 可观测

| 需求 | 做法 |
|---|---|
| 查某文档的所有任务 | `jobs.resource_type` + `resource_id` 索引 |
| 查积压 | `SELECT status, count(*) FROM jobs GROUP BY status` |
| 查卡住 | `WHERE status='running' AND lease_until < now()` |
| 耗时分布 | 日志打 `job_id / type / duration_ms / attempts` |
| 失败原因 | `jobs.error_message` + 结构化日志 |

V1 不建监控看板，只提供 SQL 与日志。

---

## 8. 向量检索与存储隔离（v2 新增）

### 8.1 诚实界定：隔离「检索动作」，不隔离「数据存储」

v1 说「接口隔离，将来换存储不牵连业务」——只对一半，必须说清边界。

| 换存储时的影响 | 范围 |
|---|---|
| `embedding` 列从 PG 移到 Qdrant/Milvus | `kb_chunks` 表结构变；删除文档需双写清理 |
| 检索实现替换 | 只改 `rag/store/` 下一个类 |
| 业务代码（`products/kb`） | **不改**，它只调 `rag.search()` |
| 一致性维护 | **新增复杂度**：文档删除、chunk 重算要保证两边同步 |

结论：**接口隔离保护业务代码，但不消除跨存储一致性成本。** 这正是选 pgvector 的理由——现在不必付这笔成本。

### 8.2 接口设计

```python
# packages/rag/store/contracts.py
class VectorStore(Protocol):
    async def upsert(self, items: list[VectorItem]) -> None: ...
    async def search(self, query_vec: list[float], *, workspace_id: UUID,
                     kb_ids: list[UUID], top_k: int,
                     min_score: float | None = None) -> list[ScoredChunk]: ...
    async def delete_by_document(self, document_id: UUID) -> int: ...
```

| 约束 | 说明 |
|---|---|
| `workspace_id` 必填 | 隔离下沉到存储层，业务层无法漏传 |
| 返回 `ScoredChunk`（内容+分数+元数据），不返回 ORM 对象 | 业务层不感知 SQLAlchemy |
| 不暴露 SQL、不暴露连接 | 换实现时业务零改动 |
| `rag.search()` 接受**查询文本**而非「用户问题」 | 让 Agent/客服能把任意子任务当查询传入 |

### 8.3 嵌入维度锁定（必须提前处理）

pgvector 列维度固定。换嵌入模型 = 维度变化 = 全库重建。

| 措施 | 阶段 |
|---|---|
| `kb_knowledge_bases` 记 `embedding_model` / `embedding_dim` | V1（表结构必留） |
| 建库时校验：配置 dim 与 KB 记录一致，不一致拒绝写入 | V1 |
| `scripts/reembed.py` 重建脚本 | V2 |
| 迁移策略：新模型建新列或新表，后台回填 | V2（真实需求驱动） |

### 8.4 V1 检索策略（刻意保守）

```
问题 → embedding → pgvector 余弦 top-20 → 取 top-5 → 拼上下文（带引用标记）→ 生成
```

| 不做 | 原因 |
|---|---|
| rerank | 没有评测基线，加了不知道有没有用 |
| 混合检索（BM25） | 同上 |
| 查询改写 | 同上 |
| 多路召回 | 同上 |

**规则**：任何检索增强必须有「评测集 + before/after 数字」才允许加。写进 `AGENTS.md`。

---

## 9. AI 知识库 V1 功能设计

### 9.1 功能清单

**V1 必需**

| # | 功能 | 要点 |
|---|---|---|
| F1 | 注册 / 登录 | 邮箱 + 密码，JWT access 2h，V1 不做 refresh 轮换 |
| F2 | 知识库 CRUD | 创建/改名/删除/列表；软删；默认 `private` |
| F3 | 文件上传 | 单文件 ≤ 50MB；pdf/docx/txt/md；同 KB 内 sha256 去重 |
| F4 | 异步解析 | 入队 → worker 执行 → 状态可查 |
| F5 | 文档分段 | 标题感知 + 定长兜底；500–800 字；overlap 100 |
| F6 | 向量化 | 批量 16 条；失败按 Retryable 处理 |
| F7 | 向量检索 | top-20 召回 → top-5 入上下文 |
| F8 | 流式问答 | SSE；携带最近 6 条消息；token 预算控制 |
| F9 | 答案引用 | `[{chunk_id, document_id, doc_name, seq, snippet, score}]` |
| F10 | 基础权限 | KB `visibility` + `owner_id`；跨 workspace 一律 404 |
| F11 | 错误处理 | 解析失败记录原因并在前端可见；LLM 失败返回可读提示 |
| F12 | 任务状态 | 文档详情返回状态 + 失败原因 + 重试次数 |
| F13 | 基础日志 | 每次问答记录：workspace、KB、命中数、token、耗时 |

**V2+ 增强**：无答案拒答、rerank、混合检索、查询改写、扫描件 OCR、KB 共享给特定人、对话管理、评测集与回归、引用定位到页码、增量重算。

### 9.2 接口

```
POST   /api/auth/register | login
GET    /api/auth/me

GET    /api/kb
POST   /api/kb
GET    /api/kb/{kb_id}
PATCH  /api/kb/{kb_id}
DELETE /api/kb/{kb_id}

POST   /api/kb/{kb_id}/documents        multipart → {document_id, job_id}
GET    /api/kb/{kb_id}/documents
GET    /api/documents/{doc_id}
DELETE /api/documents/{doc_id}
POST   /api/documents/{doc_id}/retry    仅允许 failed 状态

POST   /api/kb/{kb_id}/chat             SSE
GET    /api/kb/{kb_id}/conversations
GET    /api/conversations/{cid}
```

约定：路径参数显式命名（`{kb_id}` 而非 `{id}`）；成功直返资源；失败统一 `{"error":{"code","message","request_id"}}`；分页 `?limit=&cursor=`；写操作响应带 `request_id`。

### 9.3 问答链路

```
问题
 → 取最近 6 条消息（受 token 预算约束）
 → embedding(问题)
 → VectorStore.search(workspace_id, kb_ids, top_k=20)
 → 取 top-5，按分数过滤
 → 拼上下文（每 chunk 前加 [ref:doc_name#seq]）
 → 渲染 kb/answer 模板
 → llm.stream(profile="cheap")
 → SSE 逐帧发送；结束帧附 citations + usage
 → 落库 kb_messages
```

### 9.4 为后续产品铺路

| 产品 | 直接复用 | 需新增 |
|---|---|---|
| 文档智能处理 | ingest / storage / jobs / `llm(response_schema)` | 抽取 schema、置信度、复核队列 |
| AI 客服 | rag（检索+引用）/ llm / sse / workspace 权限 | 会话路由、人工转接、满意度 |
| AI Agent | llm（工具调用扩展点）/ rag 作为检索工具 | 工具注册表、多步状态机 |
| AI 数据分析 | `llm(response_schema)` / prompts | SQL 生成与校验、语义层 |
| AI 工作流 | jobs（升级为 DAG） | 节点定义、执行引擎 |
| AI 内容创作 | llm 流式 / prompts | 模板体系、素材管理 |

---

## 10. 数据库设计

### 10.1 表清单（V1：9 张）

| 表 | 必需 | 说明 |
|---|---|---|
| `users` | ✅ | 账号 |
| `workspaces` | ✅ | 资源归属层（v2 新增） |
| `workspace_members` | ✅ | 用户与空间关系（v2 新增） |
| `kb_knowledge_bases` | ✅ | 知识库 |
| `kb_documents` | ✅ | 文档 |
| `kb_chunks` | ✅ | 分段 + 向量 |
| `kb_conversations` | ✅ | 会话 |
| `kb_messages` | ✅ | 消息 |
| `jobs` | ✅ | 后台任务 |
| `kb_members` | ❌ | v1 有，v2 删除（用 visibility 替代） |
| `audit_logs` / `usage_records` / `tenants` | ❌ | 各自触发条件见 10.4 |

### 10.2 DDL 要点

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE users (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email         citext UNIQUE NOT NULL,
    password_hash text NOT NULL,
    display_name  text NOT NULL DEFAULT '',
    is_active     boolean NOT NULL DEFAULT true,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE workspaces (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name       text NOT NULL,
    slug       citext UNIQUE NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE workspace_members (
    workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role         text NOT NULL DEFAULT 'member',   -- owner|member
    created_at   timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (workspace_id, user_id)
);
CREATE INDEX idx_wm_user ON workspace_members(user_id);

CREATE TABLE kb_knowledge_bases (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    owner_id        uuid NOT NULL REFERENCES users(id),
    name            text NOT NULL,
    description     text NOT NULL DEFAULT '',
    visibility      text NOT NULL DEFAULT 'private',   -- private|workspace
    embedding_model text NOT NULL,
    embedding_dim   int  NOT NULL,
    deleted_at      timestamptz,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX uq_kb_name ON kb_knowledge_bases(workspace_id, owner_id, name)
    WHERE deleted_at IS NULL;

CREATE TABLE kb_documents (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id  uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    kb_id         uuid NOT NULL REFERENCES kb_knowledge_bases(id) ON DELETE CASCADE,
    filename      text NOT NULL,
    mime_type     text NOT NULL,
    size_bytes    bigint NOT NULL,
    sha256        text NOT NULL,
    storage_key   text NOT NULL,
    status        text NOT NULL DEFAULT 'pending',
                  -- pending|parsing|chunking|embedding|ready|failed
    chunk_count   int NOT NULL DEFAULT 0,
    error_message text,
    deleted_at    timestamptz,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_doc_kb ON kb_documents(kb_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uq_doc_sha ON kb_documents(kb_id, sha256) WHERE deleted_at IS NULL;

CREATE TABLE kb_chunks (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    kb_id        uuid NOT NULL REFERENCES kb_knowledge_bases(id) ON DELETE CASCADE,
    document_id  uuid NOT NULL REFERENCES kb_documents(id) ON DELETE CASCADE,
    seq          int NOT NULL,
    content      text NOT NULL,
    token_count  int NOT NULL DEFAULT 0,
    meta         jsonb NOT NULL DEFAULT '{}',
    embedding    vector(1024) NOT NULL,
    created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX uq_chunk_seq ON kb_chunks(document_id, seq);
CREATE INDEX idx_chunk_kb ON kb_chunks(kb_id);
-- HNSW：chunks > 10,000 行后再建
-- CREATE INDEX idx_chunk_vec ON kb_chunks USING hnsw (embedding vector_cosine_ops);

CREATE TABLE kb_conversations (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    kb_id        uuid NOT NULL REFERENCES kb_knowledge_bases(id) ON DELETE CASCADE,
    user_id      uuid NOT NULL REFERENCES users(id),
    title        text NOT NULL DEFAULT '新会话',
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE kb_messages (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid NOT NULL REFERENCES kb_conversations(id) ON DELETE CASCADE,
    role            text NOT NULL,                 -- user|assistant
    content         text NOT NULL,
    citations       jsonb NOT NULL DEFAULT '[]',
    usage           jsonb NOT NULL DEFAULT '{}',
    created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_msg_conv ON kb_messages(conversation_id, created_at);

CREATE TABLE jobs (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type          text NOT NULL,
    payload       jsonb NOT NULL DEFAULT '{}',
    status        text NOT NULL DEFAULT 'queued',   -- queued|running|done|failed
    attempts      int NOT NULL DEFAULT 0,
    max_attempts  int NOT NULL DEFAULT 3,
    run_after     timestamptz NOT NULL DEFAULT now(),
    worker_id     text,
    lease_until   timestamptz,
    resource_type text,
    resource_id   uuid,
    error_message text,
    started_at    timestamptz,
    finished_at   timestamptz,
    created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_jobs_claim ON jobs(status, run_after);
CREATE INDEX idx_jobs_lease ON jobs(status, lease_until) WHERE status = 'running';
CREATE INDEX idx_jobs_resource ON jobs(resource_type, resource_id);
```

### 10.3 关键决策

| 决策 | 为什么 | 代价 |
|---|---|---|
| UUID 主键 | 前端可预构造、未来分库、不泄露数量 | 索引略大（此量级无影响） |
| 业务表全带 `workspace_id` | 隔离下沉到数据层，查询无法漏判 | 多一列、多一次校验 |
| 软删 | 误删可恢复、任务可追溯 | 所有查询须带 `deleted_at IS NULL`（repository 统一封装） |
| `embedding_model/dim` 存 KB | 换模型可识别需重建的库 | 两个字段 |
| 引用存 jsonb 非关联表 | 引用是快照，文档可能被删 | 无法按 chunk 反查引用 |
| `jobs` 加 `resource_type/id` | 支持「查某文档的所有任务」 | 两列一索引 |
| `unique(document_id, seq)` | 幂等兜底 | 重算时必须先删 |
| 删 `kb_members` | V1 只需两级可见性，避免过度设计 | 「分享给特定人」需加表 |

### 10.4 何时新增表

| 需求出现 | 加什么 |
|---|---|
| 「只分享给张三」 | `kb_members` |
| 合规审计 | `audit_logs`（who / what / before / after / ip） |
| 计费或配额 | `usage_records`（按 workspace + 天聚合） |
| 做 SaaS | `tenants` + `workspaces.tenant_id` |
| 文档版本 | `kb_document_versions` |

---

## 11. AI 编程规范

### 11.1 `AGENTS.md` 草案

```markdown
# AGENTS.md —— 本项目开发规则

## 项目地图
- apps/server/main.py       应用装配入口（产品在此注册）
- apps/worker/main.py       job 轮询与执行
- packages/                 技术能力，无业务语义
- products/                 业务产品，只依赖 packages
- migrations/               Alembic，禁止手改库与手写 CREATE TABLE 进代码

## 常用命令
- 装依赖：uv sync
- 起依赖：docker compose up -d db（容器 PG 映射 5433；本机 PG 亦可用，见 14.5）
- 迁移：alembic upgrade head
- 起 API：uvicorn apps.server.main:app --reload
- 起 worker：python -m apps.worker.main
- 测试：pytest -q
- 单模块测试：pytest tests/products/kb -q
- 类型：mypy packages products apps
- 格式：ruff check --fix . && ruff format .
- 依赖方向：lint-imports
- 前端：cd apps/web && npm run dev

## 硬性规则（可逐条核对）
1. products/* 之间禁止互相 import。
2. packages/* 禁止 import products/*。
3. 业务代码禁止 import openai 或任何厂商 SDK，只能用 packages.llm.service。
4. 禁止在 api.py 写 SQL；所有 DB 访问走 repository。
5. repository 方法第一个参数必须是 workspace_id（全局表除外）。
6. api.py 只做参数校验与调 service，单函数 ≤ 30 行，不写业务分支。
7. 所有对外函数必须有完整类型标注，禁止裸 Any。
8. 所有网络调用必须设超时：LLM 60s，embedding 30s，HTTP 客户端 10s。
9. 自定义异常必须继承 AppError；禁止裸 raise Exception。
10. 表结构变更必须写 Alembic 迁移，且必须可 downgrade。
11. 新增公开函数/复杂分支必须配单测；涉及 LLM 必须用 MockProvider。
12. embedding 调用禁止放入数据库事务内。
13. 新增检索增强（rerank/混合/改写）必须先有评测数据支撑。
14. 禁止提交 .env、密钥、真实用户数据。
15. 禁止修改 E:/8.cangku/for-job/ 下既有 Java 项目及 AI-SUITE-SPEC.md。

## 修改前必做
- 判定改动属于哪一层（product / package / app），不得跨层塞逻辑
- 先 grep 是否已有实现（先查 packages 再写新的）
- 涉及表结构 → 先确认迁移可回滚
- 涉及 Prompt → 说明改动理由并记录在 commit message
- 涉及跨产品复用 → 按 5.3 的三条下沉条件判断

## 完成后必做
- pytest 全绿（含 isolation 测试）
- mypy 无新增错误
- ruff 无告警
- lint-imports 通过
- 若改 API → 更新 apps/web/src/shared/api/types.ts
- 若加依赖 → 说明为什么已有依赖无法解决

## 命名
- 模块/文件 snake_case；类 PascalCase；常量 UPPER_SNAKE
- 表名小写复数，带产品前缀（kb_documents）
- API 路径 kebab-case 复数，路径参数显式命名（/api/kb/{kb_id}/documents）
- Prompt 模板：products/<p>/<purpose>.md.j2 或 common/<purpose>.md.j2
- 环境变量 UPPER_SNAKE，按前缀分组（LLM_ / DB_ / STORAGE_）

## 错误响应
{"error": {"code": "DOC_PARSE_FAILED", "message": "...", "request_id": "..."}}
code 用 UPPER_SNAKE；前端按 code 分支，不解析 message。

## 一次会话只做一件事
跨多层改动拆成多轮，每轮可独立验证。
```

### 11.2 为什么这套规则对 AI 工具有效

| 规则类型 | 作用 |
|---|---|
| 项目地图 | 不必每次扫描全仓找入口 |
| 常用命令 | 不猜测试框架、不猜启动方式 |
| 编号硬性规则 | 可逐条核对，也可写进 CI |
| 修改前/后清单 | 把隐性要求变成显性步骤 |
| 命名规范 | 减少风格漂移与 review 成本 |
| 「一次只做一件事」 | 避免一次改动跨多层的不可控风险 |

### 11.3 CI 检查

```
ruff check
mypy packages products apps
lint-imports
pytest -q --cov=packages --cov=products --cov-fail-under=60
alembic upgrade head && alembic downgrade base（空库验证双向）
```

---

## 12. 分阶段实施计划（验收标准驱动）

> 时间仅为估算，不作为交付承诺。**完成以 DoD 清单全绿为准，不以写代码量衡量。**

### S0 · 骨架可启动 ✅ **已完成（2026-10-26，见 14.8）**

| 项 | 内容 |
|---|---|
| 交付 | 仓库结构、`.python-version`、pyproject、`docker-compose.yml`（**仅 db 一个 service**）、`core`（config/logging/errors/db）、`llm`（contracts/capabilities/service/providers/mock）、`/health` + `/health/ready`、README（含独立性声明）、AGENTS.md |
| 运行验证 | `uv run python -m uvicorn apps.server.main:app` 无报错；`curl /health` → 200；`curl -i /health/ready` → **503 + not_configured**（未配数据库时的预期行为） |
| 测试 | ≥ 3 条（实际 **24 条**）：liveness 200、readiness 未配置 503、readiness 不可达 503、请求 ID 回显、配置缺项拒启、MockProvider 确定性、流式分片等价、能力缺失即报错、错误响应契约、OpenAPI 路由暴露 |
| DoD | ① **S0 不要求 PG 可用**（数据库在 S1 接入，见 14.5/14.8） ② liveness 与 readiness **分离**，readiness 不把「进程活着」当「数据库可用」 ③ `pytest` 24 passed ④ `mypy` 27 文件无错 ⑤ `lint-imports` 3 契约全 KEPT ⑥ `.env.example` 齐全且无真实凭据 ⑦ README 首段含「与 Java 项目独立」声明 ⑧ venv 基于 `D:\softwork\Python312`（`sys.base_prefix` 已核验） |

### S1 · 数据层基础设施（**不含业务表**）

> v2.3 修订：原版 S1 一次性建 9 张表。用户要求「S1 只建基础设施，`workspace`/知识库/文档/任务表按各自阶段引入」。
> 理由成立：业务语义尚未定稿时先固表结构，后续每加一个字段都要写迁移，返工成本高于分阶段建表。

| 项 | 内容 |
|---|---|
| 交付 | ① `packages/core/db.py` 异步 engine + `async_sessionmaker` + 请求级 session 依赖 ② `migrations/` 配置（`env.py` 读 `Settings`，不读 `os.environ`）③ 首个迁移：`app_meta` 表 ④ `tests/` 库名守卫 ⑤ `scripts/check_db.py`（连通性 + 库名 + pgvector 版本三查） |
| **明确不交付** | `users`/`workspaces`/`workspace_members`（S2）、`kb_*`（S3/S4）、`jobs`（S3）、`conversations`/`messages`（S5）、repository 基类、seed 脚本 —— **一律不在 S1 出现** |
| 「最小基础元数据」的具体解读 | 仅一张 `app_meta(key text PK, value text, updated_at timestamptz)`，用途单一：承载 schema 标记与迁移冒烟验证。**不承载任何业务语义**。选它而非空迁移，因为空迁移无法证明「建表→回滚→无残留」这条链路真的通。若你更倾向连这张表都不要（S1 只验证连接 + 空迁移），告我一声即可，改动量约 20 行 |
| 运行验证 | `alembic upgrade head` → `alembic current` 输出 head；`alembic downgrade base` → `alembic current` 为空；`python -m scripts.check_db` 打印库名与 pgvector 版本 |
| 测试 | ≥ 5：迁移升级后 `app_meta` 存在 / 回滚后 `app_meta` 不存在 / 库名守卫在非 test 库上拒绝执行 / 会话依赖可正常提交与回滚 / `check_db` 能识别缺失的 vector 扩展 |
| DoD | ① `upgrade head` 与 `downgrade base` **双向**均成功，且回滚后 `\dt` 无残留表 ② `SELECT current_database()` = `aisuite_test`（测试）/ `aisuite_dev`（开发），有断言非默许 ③ 两库 `pg_extension` 均查到 `vector` ④ engine 用 `asyncpg` 真实连通（非 mock）⑤ 既有 24 项测试仍全绿 ⑥ mypy / ruff / lint-imports 全过 ⑦ 无新增业务表、无 Redis、无 Celery、无 testcontainers ⑧ `for-job` 下 Java 项目零改动 |

### S2 · 认证与隔离地基

| 项 | 内容 |
|---|---|
| 交付 | 注册（自动建 workspace）、登录、JWT、`get_current_user`、成员关系查询 |
| 运行验证 | 注册 → 登录 → 带 token 访问 `/api/auth/me` 返回用户与 workspace |
| 测试 | ≥ 6：正确密码、错误密码、过期 token、无 token、失效 token、重复邮箱 |
| DoD | ① 注册即建 workspace 且角色 owner ② 密码 bcrypt 存储 ③ token 过期返回 401 ④ 错误密码不泄露用户是否存在 ⑤ 测试全绿 |

### S3 · 上传与异步解析

| 项 | 内容 |
|---|---|
| 交付 | 上传接口、jobs 入队、独立 worker、租约/心跳/回收、四种格式解析、切分、状态流转 |
| 运行验证 | 上传 PDF → `GET /api/documents/{id}` 轮询至 `ready`，`chunk_count > 0` |
| 测试 | ≥ 8：正常解析、格式不支持、文件超限、重复上传去重、任务重试、租约回收、幂等重复执行、worker 中断后恢复 |
| DoD | ① worker 可独立启动领取任务 ② 心跳每 30s 生效（日志可见） ③ 人为 kill worker 后 15min 内任务被回收重跑 ④ 同一文档重复执行不产生重复 chunk ⑤ 失败文档有可读 `error_message` ⑥ 文档状态与 job 状态各自正确 ⑦ 测试全绿 |

### S4 · 向量与检索

| 项 | 内容 |
|---|---|
| 交付 | 批量 embedding、`VectorStore` 实现、检索编排、上下文拼装、token 预算 |
| 运行验证 | 灌入 3 篇文档，检索关键词能召回正确 chunk（人工核对） |
| 测试 | ≥ 5：写入后可检索、top_k 生效、workspace 隔离（A 查不到 B）、维度不符拒绝写入、删除文档后向量清除 |
| DoD | ① embedding 在事务外 ② 结果带 score ③ 跨 workspace 检索返回空 ④ 维度校验生效 ⑤ 测试全绿 |

### S5 · 问答与引用

| 项 | 内容 |
|---|---|
| 交付 | SSE 流式问答、引用构造、会话与消息落库、usage 记录 |
| 运行验证 | `curl -N` 调用 chat，逐帧 delta，末帧含 citations 与 usage |
| 测试 | ≥ 6：流式帧格式、引用非空、多轮上下文、token 超限报错、LLM 失败降级、消息落库 |
| DoD | ① SSE 事件格式固定（delta/citation/done/error） ② 引用含 doc_name + seq + snippet ③ 会话可查历史 ④ 失败时前端能显示可读错误 ⑤ 测试全绿 |

### S6 · 前端

| 项 | 内容 |
|---|---|
| 交付 | 登录页、KB 列表/详情、上传、状态轮询、对话页（流式渲染 + 引用） |
| 运行验证 | 浏览器完整走通：注册 → 建库 → 上传 → 等 ready → 提问 → 看到流式回答与引用 |
| 测试 | 前端不强制单测；后端补 2 条联调用例（CORS、SSE 跨域） |
| DoD | ① 控制台无报错 ② 上传大文件有进度 ③ 失败文档能看到原因并可重试 ④ `npm run build` 通过 ⑤ 手工验收记录写入 `docs/` |

### S7 · 加固与交付

| 项 | 内容 |
|---|---|
| 交付 | 错误处理补全、日志规范化、Docker 一键启动、README、`docs/api.md`、4 份 ADR |
| 运行验证 | 全新机器 `docker compose up` 后 30 分钟内可用（含迁移与 seed） |
| 测试 | 核心模块补齐至 ≥ 70%；isolation 全路由覆盖 |
| DoD | ① 一条命令起全套 ② 重启后数据不丢 ③ 所有路由有 isolation 覆盖 ④ README 含架构图与排错 ⑤ ADR 覆盖 4 个关键决策 |

### S8 · 评测（可选）

| 项 | 内容 |
|---|---|
| 交付 | 50–100 条问答标注、评测脚本（Recall@5 / 引用准确率 / 无答案率 / P95 延迟 / 单次成本）、基线报告 |
| 运行验证 | `python scripts/eval.py` 输出一张指标表 |
| 测试 | 评测脚本本身 2 条单测（指标计算正确性） |
| DoD | ① 评测集人工标注 ② 指标可复现（同输入同输出） ③ 报告含基线对比 ④ 结论写明「哪些增强值得做」 |

**阶段估算**：S0 3–5 天、S1 3–4、S2 2、S3 6–8、S4 4–5、S5 4–6、S6 7–10、S7 3–5、S8 4–6，合计约 **7–9 周**（较 v1 上调，因新增租约机制、隔离测试与验收标准）。

**顺序铁律**：S3/S4 之间不插前端。后端链路不通就做界面，等于在假数据上做 UI。

---

## 13. 风险、过度设计与待确认

### 13.1 技术风险

| # | 风险 | 缓解 |
|---|---|---|
| R1 | 嵌入维度锁定 | KB 记 model/dim + 写入校验 + V2 重建脚本 |
| R2 | PDF 解析质量参差 | V1 只承诺文本型 PDF，文档写明限制 |
| R3 | 切分策略影响召回 | 参数可配；由 S8 评测驱动调整 |
| R4 | LLM 输出不稳定、引用错 | Prompt 强制引用格式 + 后处理校验 |
| R5 | 长上下文溢出 | `rag/context` token 预算 + 显式报错 |
| R6 | 租约机制误回收长任务 | 租约 15min + 30s 心跳 + 连续 3 次过期才判死 |
| R7 | 跨空间隔离被新接口绕过 | OpenAPI 反射生成隔离用例，新增路由自动纳入 |
| R8 | 测试依赖真实 PG，CI 慢 | testcontainers 复用容器；不降级 SQLite |
| R9 | AI 工具写过时 API | `AGENTS.md` 锁版本 + lockfile + mypy + CI |
| R10 | packages 膨胀成垃圾场 | 5.3 下沉规则 + 每包显式导出 + 禁止清单 |

### 13.2 过度设计诱惑（及否决理由）

| 诱惑 | 为什么不现在做 |
|---|---|
| 微服务 | 单人维护，运维吃掉全部开发时间。用装配代替拆分 |
| K8s | 单机 Compose 能撑几百用户，K8s 不解决产品问题 |
| Celery + Redis | PG 任务表在千级/天足够；worker 已抽象，替换只改一个模块 |
| 独立向量库 | 引入跨库一致性成本（第 8 章） |
| LangChain | 版本漂移，AI 工具易写过时 API；核心链路自写更可控 |
| 完整多租户 | 3–4 周且需商务决策；用 workspace 预留，成本 1 天 |
| Prompt 管理后台 | 现在无运营人员。文件 + git 已能版本管理 |
| Agent 框架 | 第一个产品不是 Agent |
| 通用 CRUD / 泛型仓储 | AI 产品业务差异大，抽象后要逐个绕开 |
| 通用工作流引擎 | 需求未明，必然返工 |
| 一次建七个产品目录 | 空目录误导 AI 工具，也让人误以为已完成 |

### 13.3 已确认的架构决策（本轮定稿，无需再议）

| # | 决策 |
|---|---|
| C1 | 模块化单体 + 单 FastAPI 进程 + app factory 装配，不做微服务 |
| C2 | `packages` 提供机制，`products` 决定策略；依赖单向，CI 强制 |
| C3 | 模型接入走统一接口 + OpenAI 兼容首个实现，不写多厂商适配器矩阵 |
| C4 | PostgreSQL + pgvector 单库；`VectorStore` 接口隔离检索动作 |
| C5 | PG 任务表 + 独立 worker 进程 + 租约机制；V1 不引 Celery/Redis |
| C6 | `workspace` 作资源归属层；V1 不做多租户运营 |
| C7 | 隔离靠 OpenAPI 反射的自动化测试守护，不靠人工纪律 |
| C8 | 每阶段以 DoD 清单验收，不以天数或代码量衡量 |
| C9 | 旧 Java 项目零改动、零共享、零迁移 |

### 13.4 仍需你决定

| # | 问题 | 为什么必须现在定 | 若不确定的默认 |
|---|---|---|---|
| ~~**Q1**~~ | ~~新项目根目录~~ → **已定 A（2026-10-26）**：`E:/8.cangku/for-job/ai-suite-py/` | — | — |
| **Q2** | 模型来源：云端 API 还是本地部署？**数据能否出内网**？ | 决定部署形态、硬件、embedding 方案 | 默认云端 API，可配 |
| ~~**Q3**~~ | ~~是否需要信创~~ → **已定（2026-10-26）：否**，第一阶段用 PostgreSQL + pgvector | — | — |
| **Q4** | PDF 中扫描件占比是否超 30%？ | 决定 OCR 是否进 S3 | 默认不超，V1 不做 OCR |
| **Q5** | 新 Python 知识库与 Java 版 `ai-knowledge-base` 在站点/简历里如何表述？ | 两个知识库并存需解释清楚 | 默认「Java 是 v1 功能交付，Python 是工程体系 + 效果升级」 |
| **Q6** | 第二、第三个产品分别是哪个？ | 决定哪些公共能力值得提前抽象 | 默认第二个做「文档智能处理」（复用度最高） |

### 13.5 本版采用的默认假设（不否决即按此执行）

| # | 默认 |
|---|---|
| D1 | 单实例服务一个组织；workspace 做归属层；不建 tenant |
| D2 | 模型走云端 API，配置可切；无 key 自动 Mock |
| D3 | 不做信创适配，pgvector 单库 |
| D4 | V1 不处理扫描件 |
| D5 | worker 独立进程，租约 15min，心跳 30s，最大重试 3 |
| D6 | 嵌入维度按 1024 设计（可在配置改，改后需重建） |
| D7 | 新项目与 Java 项目零代码共享、零数据库共享 |

---

## 14. 路径与操作安全

### 14.1 本次实际操作记录（已执行）

| 检查项 | 结果 |
|---|---|
| 读取 E 盘根目录 | 确认 30 个条目，无新项目同名冲突 |
| 定位 Java 项目 | `E:/8.cangku/for-job/` 下：`ai-knowledge-base`（Maven + Vue，51 个测试文件）、`ai-app-scaffold`、`ai-assistant`、`ai-agent-platform`、7 个 `openbiz-*` |
| 发现既有契约 | `E:/8.cangku/for-job/AI-SUITE-SPEC.md`（171 行，2026-10-25），定义 Java 三件套为唯一事实来源 |
| 发现既有 Python 项目 | `E:/8.cangku/for-job/ai-assistant-py/`（requirements.txt + docker-compose） |
| 本次写入的文件 | 仅 `E:/vitepress/.workbuddy/design/AI-PLATFORM-DESIGN.md`——位于 VitePress 工作区的设计目录，**不属于任何 Java 项目** |
| 对 Java 项目的操作 | **零**。未创建、未修改、未移动、未删除 |

### 14.2 新项目位置（Q1 已定：A）

| 候选 | 优点 | 缺点 |
|---|---|---|
| **A. `E:/8.cangku/for-job/ai-suite-py/`** | 与作品集项目同层，便于统一管理；名字带 `py` 明确技术栈 | 与「for-job = Java 三件套」的语义有轻微冲突，需在新 README 注明边界 |
| B. `E:/8.cangku/ai-suite-py/` | 与 for-job 分离，作品集边界更干净 | 与现有仓库组织习惯不一致 |
| C. `E:/project-work/ai-suite-py/` | 完全独立 | 需确认 `project-work` 现有用途 |

**2026-10-26 用户确认：选 A —— `E:/8.cangku/for-job/ai-suite-py/`，要求与现有 Java 项目完全独立。**

落地约束（S0 硬性要求）：

1. 新仓库 README 第一段必须写明：「本项目与 `for-job` 下的 Java 三件套是两套独立交付，技术栈不同，无代码依赖。」
2. `AI-SUITE-SPEC.md` 保持原义（Java 交付契约），**不修改、不追加 Python 内容**；Python 侧契约写在 `ai-suite-py/AGENTS.md`。
3. 新建 `ai-suite-py/.git` 独立仓库（不在 `for-job` 根建 git 仓库，避免把 Java 项目卷进同一个提交历史）。

### 14.3 开工前路径安全清单（每次创建/移动/删除前执行）

```bash
# 1. 确认目标路径不存在或为空
ls -la "$TARGET" 2>/dev/null || echo "目标不存在，可创建"

# 2. 确认不在任何 Java 项目内
realpath "$TARGET" | grep -q 'ai-knowledge-base\|ai-app-scaffold\|ai-assistant\|ai-agent-platform\|openbiz-' \
  && echo "危险：位于 Java 项目内" || echo "安全"

# 3. 确认未触碰既有契约文件
git -C /e/8.cangku/for-job status --short 2>/dev/null
```

**对 Java 项目的禁止操作清单**

- 禁止在其目录内创建任何文件
- 禁止修改 `pom.xml`、`AI-SUITE-SPEC.md`、`README.md`
- 禁止删除 `target/`、`data/`、`node_modules/`
- 禁止改造其为 Python（不迁移、不重写、不并行双栈）

---

### 14.4 实机环境核验（2026-10-26 实测）

> 本节全部为命令实测结果，非推测。凡与文档原假设不符之处，已在下方给出处置。

| 项 | 实测结果 | 与设计是否一致 | 处置 |
|---|---|---|---|
| 目标路径 | `E:/8.cangku/for-job/ai-suite-py/` **不存在**（可安全新建） | ✅ | 直接创建 |
| 同层既有项目 | `AI-SUITE-SPEC.md`、`ai-agent-platform`、`ai-app-scaffold`、`ai-assistant`、`ai-knowledge-base`、`ai-assistant-py`、8 个 `openbiz-*`、`build-all.log` | ✅ 已知 | 全程只读 |
| Python（`py -0`） | 3.12（默认）、3.10、3.9、3.7 | ✅ 3.12 可用 | 锁定 3.12.10 |
| Python（`python`） | 3.13.14，来自 **WorkBuddy 内置解释器** `C:\Users\56298\.workbuddy\binaries\python\versions\3.13.12` | ⚠️ **不可用** | **禁止用它建 venv**：随 WorkBuddy 升级会被替换，venv 会失效 |
| uv | 0.10.9，`uv venv --python 3.12` 解析到 `D:\softwork\Python312\python.exe` | ✅ | 用它建 venv 与锁依赖 |
| Node / 包管理 | Node v22.22.2、npm 10.9.7、pnpm 9.15.0 | ✅ | S6 用 npm 即可 |
| Docker CLI | 29.2.1 / Compose v5.0.2 **已安装** | ✅ | — |
| Docker 守护进程 | **未运行**（`com.docker.service` = Stopped，npipe 连接失败） | ❌ **阻断 S0 DoD ①** | 见 14.5 双轨方案 |
| 本机 PostgreSQL | **16.11 已装且运行中**：服务 `postgresql-x64-16`（Automatic），路径 `D:\softwork\PostgreSQL\16`，数据目录 `.../data`，监听 **5432**（PID 6980） | ✅ 版本与设计一致 | 优先作为开发库 |
| pgvector | **已安装 0.8.6**（`share/extension/vector.control` + `lib/vector.dll`，含 0.1.0→0.8.6 全量升级脚本） | ✅ 满足「0.7+」 | 无需自行编译 |
| PG 认证 | `pg_hba.conf` 全部 `scram-sha-256`，**无 pgpass**，postgres 口令未知 | ⚠️ 待补 | **需你提供口令**（见 14.7） |
| `psql` | 不在 PATH，实际在 `D:\softwork\PostgreSQL\16\bin\psql.exe` | ⚠️ | 加 PATH 或用全路径 |
| 端口占用 | **5432 被本机 PG 占用**；8000 / 5173 / 3000 **空闲** | ⚠️ 5432 冲突 | 容器 PG 改用 **5433** |
| Java 项目数据源 | `ai-knowledge-base`、`ai-app-scaffold` 均为 **H2 文件库**（`./data/kb`、`./data/scaffold`） | ✅ **关键证据** | 新项目用 PG **与 Java 项目零数据库交集**，物理上不可能互相影响 |
| `ai-assistant-py` 端口 | MySQL 3306、Redis 6379、应用 8081 | ✅ 不冲突 | 与 5432/8000 均不撞 |
| PyPI 连通性 | 经本机代理 `127.0.0.1:11561` 可达，**索引响应约 20s（偏慢）**；`uv pip install --dry-run` 成功 | ⚠️ 慢但可用 | 建议配置国内索引镜像（14.6） |
| 磁盘 | E: 301 GB，可用 140 GB | ✅ | 足够（含 PG 数据与镜像） |

**依赖实测解析结果（2026-10-26，`uv pip install --dry-run`）**

| 包 | 解析版本 | 备注 |
|---|---|---|
| fastapi | 0.162.0 | 比文档写作时的常见版本更新 |
| starlette | 1.10.0 | **已进入 1.x**，中间件 API 与 0.4x 有差异 |
| pydantic / pydantic-core | 2.14.1 / 2.50.1 | v2 线 |
| sqlalchemy | **2.1.6** | 文档写「2.0 async」，实际解析到 2.1 |
| greenlet | 3.5.6 | async 必需 |
| pgvector（Python 客户端） | 0.5.1 | 与 PG 侧 0.8.6 是两件事，不冲突 |
| anyio | 4.15.1 | — |

**结论：文档里「SQLAlchemy 2.0」应改述为「SQLAlchemy 2.x（uv.lock 锁定实际版本）」。** 不追新写死 2.1，也不写死 2.0.x；以锁文件为准，`pyproject.toml` 只写区间 `sqlalchemy>=2.0,<2.2`。同理 starlette 1.x 的中间件签名需在 S0 写 `middleware.py` 时按实际版本编码，不照抄旧教程。

### 14.5 数据库部署：开发与交付双轨

Docker 守护进程未运行，而本机 PG 16.11 + pgvector 0.8.6 已就绪。因此**不把「必须有 Docker」写进 S0**，改双轨：

| 场景 | 用哪个 PG | 连接串 | 端口 | 为什么 |
|---|---|---|---|---|
| 日常开发（S0–S6） | **本机 PG 16.11** | `postgresql+asyncpg://aisuite:****@127.0.0.1:5432/aisuite_dev` | 5432 | 免启 Docker；pgvector 已装；冷启动快 |
| 自动化测试 | **本机 PG 16.11** | `...@127.0.0.1:5432/aisuite_test` | 5432 | 每次 drop/create schema，比容器快 5–10 倍 |
| 交付验收（S7） | **compose 容器** `pgvector/pgvector:pg16` | `...@db:5432/aisuite` | **宿主映射 5433** | 验证「一条命令起全套」；映射 5433 以避开本机 5432 |
| CI / 他人机器 | compose 容器 | 同上 | 5433 | 无本机 PG 时自动走这条 |

**三条硬约束**

1. **库名必须区分**：`aisuite_dev` / `aisuite_test` / compose 内的 `aisuite`。禁止使用 `postgres` 库，禁止任何 `drop database` 出现在脚本里。
2. **测试库独立**：`TEST_DATABASE_URL` 与 `DATABASE_URL` 分开配置；conftest 启动时校验两者不同，相同则直接报错退出（防止测试清掉开发数据）。
3. **不做 testcontainers（V1）**：会重新依赖 Docker 守护进程。用「独立测试库 + 每个用例事务回滚」，速度更快、依赖更少。需要容器时只在 CI 用 compose。

**S0 的 DoD ① 相应改写**：由「compose 起 PG 成功」改为「**任一 PG 可用即可** —— 本机 5432 或容器 5433，`/health` 返回 `db: ok`」。Docker 只在 S7 交付验收时成为硬性要求。

### 14.6 开工前需固定下来的三项环境约定

| 项 | 决定 | 写入位置 |
|---|---|---|
| Python 解释器 | 固定 `D:\softwork\Python312\python.exe`（3.12.10），**不用** WorkBuddy 内置 3.13 | `.python-version` 写 `3.12`；README 注明绝对路径 |
| 依赖源 | `pyproject.toml` 加 `[tool.uv]` 索引配置指向国内镜像（清华/阿里），保留 `pypi.org` 作 fallback | `pyproject.toml`、README |
| PG 口令 | **不写进文件**。`.env`（gitignore）+ `.env.example` 只放占位符；本机口令由你填一次 | `.env.example` |

### 14.7 唯一剩余阻断项：PostgreSQL 凭据

本机 PG 使用 `scram-sha-256`，需要口令才能建库。两个选择：

| 方案 | 操作 | 优缺点 |
|---|---|---|
| **A（推荐）** | 你执行一次（或用 pgAdmin）：<br>`CREATE ROLE aisuite LOGIN PASSWORD '<自定>';`<br>`CREATE DATABASE aisuite_dev OWNER aisuite;`<br>`CREATE DATABASE aisuite_test OWNER aisuite;`<br>`\c aisuite_dev` → `CREATE EXTENSION vector;`（test 库同样） | 用专用角色，**永远不用 postgres 超级用户跑应用**；口令只在你手里 |
| B | 你把 postgres 口令发我，我代建 | 省事，但超级用户口令进对话记录，不推荐 |

**两个库都必须建 `vector` 扩展**，否则 S4 迁移会失败。若 A 方案执行 `CREATE EXTENSION` 报权限不足，需给 `aisuite` 角色 `SUPERUSER` 或由 postgres 代为创建扩展。

---

### 14.8 S0 实施记录（2026-10-26 完成）

**位置**：`E:/8.cangku/for-job/ai-suite-py/`，独立 git 仓库（`git init -b main`，首次提交 `32f4251`），**未在 `for-job` 根建仓**。

#### 一、交付文件（git 跟踪 35 个）

| 分组 | 文件 |
|---|---|
| 工程 | `pyproject.toml`、`uv.lock`、`.python-version`、`.gitignore`、`.env.example`、`docker-compose.yml`（仅 db，映射 5433）、`README.md`、`AGENTS.md` |
| 应用层 | `apps/server/{main,lifespan,middleware,errors,health,deps}.py` |
| 基础层 | `packages/core/{config,logging,errors,db}.py` |
| 模型层 | `packages/llm/{contracts,capabilities,service}.py`、`providers/openai_compatible.py`、`testing/mock_provider.py` |
| 测试 | `tests/{conftest,test_health,test_config,test_llm,test_errors}.py` |

**未创建**：`products/`、`apps/worker/`、`apps/web/`、`migrations/`、`packages/{ingest,rag,storage,jobs,prompts}/`、任何空目录。

#### 二、实测版本（`uv pip list`）

| 包 | 版本 | 包 | 版本 |
|---|---|---|---|
| Python | **3.12.10**（`base_prefix=D:\softwork\Python312`） | pytest | 9.1.1 |
| uv | 0.10.9 | pytest-asyncio | 1.4.1 |
| fastapi | **0.162.0** | mypy | 2.4.0 |
| starlette | **1.10.0** | ruff | 0.17.2 |
| pydantic / settings | 2.14.1 / 2.16.1 | import-linter | 2.15 |
| sqlalchemy | **2.1.6** | structlog | 26.1.0 |
| uvicorn | 0.54.0 | asyncpg | 0.32.0 |

#### 三、验收证据

| 检查 | 命令 | 结果 |
|---|---|---|
| 解释器 | `.venv\Scripts\python.exe -c "import sys; print(sys.executable, sys.base_prefix)"` | `...\ai-suite-py\.venv\Scripts\python.exe` / `D:\softwork\Python312` |
| 测试 | `uv run pytest -o addopts="" -q` | **24 passed in 1.21s**，0 skipped |
| 类型 | `uv run mypy` | Success: no issues found in **27** source files |
| 格式 | `uv run ruff check .` / `ruff format --check .` | All checks passed / 30 files formatted |
| 依赖方向 | `uv run lint-imports` | **3 kept, 0 broken** |
| 启动 | `uv run python -m uvicorn apps.server.main:app --port 8000` | `Application startup complete`；`app_assembled routes=['/health','/health/ready']` |
| liveness | `curl /health` | `200 {"status":"ok","app":"ai-suite-py","version":"0.1.0","env":"dev"}` |
| readiness | `curl -i /health/ready` | **`503 {"status":"not_ready","db":"unavailable","detail":"not_configured"}`** |
| 凭据 | `git ls-files \| grep -c "^\.env$"` | **0**；且磁盘上不存在 `.env` |
| 旧项目 | `find for-job -newermt "-180 minutes" -not -path "./ai-suite-py/*"` | **无输出（零改动）** |

#### 四、实施中修正的三处设计（文档已同步）

| # | 设计与实现的偏差 | 处置 | 原因 |
|---|---|---|---|
| 1 | 原设计 `/health` 返回 `{"status":"ok","db":"ok"}`，把存活性与依赖状态混在一个端点 | 拆为 `/health`（liveness，恒 200，无 db 字段）与 `/health/ready`（readiness，DB 不可用即 503） | 「进程启动成功」≠「数据库可用」；混用会导致编排系统把坏实例当健康 |
| 2 | 原 S0 DoD 要求「compose 起 PG 成功」 | 改为**S0 不要求 PG**，数据库整体下移到 S1 | Docker 守护进程未运行；且数据库问题应与应用启动问题解耦，否则排障时无法区分是解释器、依赖还是 DB |
| 3 | 原设计假设 `app.routes` 可枚举路由 | 改为走 `app.openapi()["paths"]` | **Starlette 1.x 的 `include_router` 生成 `_IncludedRouter`，该类没有任何公开属性**，按 `app.routes` 遍历会静默漏掉全部子路由。已加回归测试 `test_openapi_exposes_health_endpoints` |

第 3 条影响面超出 S0：设计 6.4 的「从 OpenAPI schema 反射枚举受保护路由」**本来就是正确做法**，若改用 `app.routes` 会让隔离测试假绿。这条已写入 `AGENTS.md` 之外的代码注释。

#### 五、S0 阶段的刻意取舍

| 取舍 | 说明 |
|---|---|
| `packages/llm/__init__.py` 不做 re-export | 避免 `capabilities → contracts → service → providers` 的循环 import；入口统一走 `packages.llm.service` |
| Mock 只声明 `STREAMING` | 不模拟 `TOOL_CALLING`/`VISION`。需要这些能力的测试必须失败，防止假绿 |
| db 模块按 url 缓存 engine | 同一进程可同时持有 dev 与 test 两个 engine，为 S1 的 `TEST_DATABASE_URL` 校验预留 |
| 不建 `models.py`/`Base` 实体 | S0 无业务表，提前建 `Base` 只会引出无主模型 |

#### 六、S1 的前置条件（唯一阻断）

S0 已做到「无数据库也能完整启动与测试」。进入 S1 需要：

1. 建角色与两库（14.7 的 SQL）
2. 两库分别 `CREATE EXTENSION vector;`
3. 在 `.env` 填 `DATABASE_URL`（**由你本机填写，不入库、不进对话**）

在此之前，S1 的任何工作都无法验证迁移是否可用。

---

### 14.9 S1 准入清单（2026-10-26 复审补录）

用户 S0 验收通过，但要求 S1 前先固化三类约束。本节是**开工前必须能逐条指认的规则**，不是建议。

#### 一、S0 复查的三个细节及处置

| # | 复查点 | 判断 | 处置 |
|---|---|---|---|
| R1 | `app.openapi()["paths"]` 只能枚举**公开** API，被排除的路由会漏，且它**不能证明**每条路由都做了认证与隔离 | 成立，比 S0 时的认识更严格 | S6 隔离测试改为**双源枚举 + 落差即失败**，见下表 |
| R2 | S0 测试通过 ≠ S1 的迁移、事务、异步会话已通过；SQLAlchemy 2.1.6 / Alembic / asyncpg 组合需真机验证 | 成立 | S1 一律以真实 PG 上的迁移结果验收，不以「依赖装上」为通过条件；不为求稳主动降级已锁版本 |
| R3 | 24 项测试只证明骨架可运行，不构成架构验收；迁移、事务回滚、连接池、并发、库权限均未验证 | 成立 | 上述五项全部列入 S1 的 DoD 与 14.9 第二节 6 条验收，**不提前在 S0 补做** |

**R1 的具体做法（S6 强制，S1 先留接口）**

| 项 | 规则 |
|---|---|
| 枚举源 A | `app.openapi()["paths"]` —— 公开 API 全集 |
| 枚举源 B | 递归展开 ASGI 路由树（含 Starlette 1.x 的 `_IncludedRouter.routes`、**嵌套路由**与 `Mount` 子应用），得到**实际注册**的全部 `(HTTP method, path)` |
| 登记粒度 | 以 `(HTTP method, path)` 为单位登记策略；同一 path 的 **GET / POST / DELETE 等不同方法必须分别登记**，策略互不覆盖 |
| 落差处理 | 若 `A ⊄ B` → 测试失败（说明有路由绕过了 OpenAPI 却不自知）；若 `B \ A ≠ ∅` → 逐条登记进 `tests/route_policy.py`，标注 `public` / `authed` / `workspace_scoped` / `internal`，**未登记即失败** |
| 防漏基线 | `tests/route_policy.py` 里维护一份显式清单，新增路由必须同 PR 补登记，否则 CI 红 |
| 越权断言 | 所有 `workspace_scoped` 路由必须有一条「跨 workspace 访问返回 404（非 403）」用例 |
| 行为兜底 | 策略登记**不能替代**认证、授权与跨 workspace 访问的**实际行为测试**；`route_policy` 仅声明预期，对应路由仍需 `test_*` 用例真实断言 401 / 403 / 404 等行为 |

> 一句话：**枚举不可信，登记才可信。** OpenAPI 只用来发现「有哪些」，用什么策略保护由显式清单决定。

#### 二、S1 六条验收（对应你提出的表）

| # | 验收项 | 必须拿出的证据 |
|---|---|---|
| 1 | 数据库连接 | 应用经 `asyncpg` 真实连通；`SELECT 1` 与 `current_database()` 均返回预期值（非 mock） |
| 2 | Alembic 初始化 | `env.py` 从 `Settings` 取 URL（不读 `os.environ`）；`alembic current` 可执行 |
| 3 | 正向迁移 | `alembic upgrade head` 成功，`\dt` 见 `app_meta` 与 `alembic_version` |
| 4 | 迁移三段完整性 | **`upgrade head` → `downgrade base` → 再次 `upgrade head`** 三段均成功：回滚后**无残留表**（`app_meta` 消失），再次升级能重建结构。三段验证**只在专用测试库 `aisuite_test` 执行**，禁止在开发库 `aisuite_dev` 做破坏性回滚验收 |
| 5 | 测试库隔离 | 三重守卫与身份核验全绿（见第三节）；测试连接串指向 `aisuite_test` |
| 6 | 回归 | 既有的 **24** 项 S0 测试与 S1 新增测试**全部通过**；S1 完成后重新运行 `pytest` / `mypy` / `ruff` / `import-linter` 全绿；**所有验收结果必须提供实际命令与执行输出，不得以 skip 测试或降低标准代替通过** |
| 7 | 应用角色与 pgvector 权限 | `aisuite` 角色 `rolsuper = false`（**非超级用户**）；`aisuite_dev` 与 `aisuite_test` 均已启用 `vector` 扩展且**版本一致**（当前预期 **0.8.6**）；用 `aisuite` 角色实际 `CREATE TEMP TABLE _probe(v vector(3))` → 使用 → `DROP` 成功；升级或换环境后须重新核验 |

#### 三、测试库隔离与数据库身份核验（不能只靠「两个 URL 不相同」或「库名不同」）

> **核心原则**：隔离**不得仅依赖**连接串不同或数据库名称不同来证明。身份无法确认时**必须 fail closed（停止危险操作），绝不继续执行**。

**身份核验四元组（L2 / L3 共用，取代「只看库名」）**

| 维度 | 取值 | 说明 |
|---|---|---|
| 预期目标配置 | 设计文档 / `.env` 中声明的目标库名、连接方式、角色 | 先有「应该连到哪里」的预期，再与实际比对 |
| `current_database()` | `aisuite_test` / `aisuite_dev` | 实际所在库 |
| `inet_server_addr()` | 实际监听地址 | **Unix socket 等连接方式下可能返回 `NULL`**，不可作为唯一判据 |
| `inet_server_port()` | 实际监听端口 | 地址 + 端口**不能独立证明**两个库不是同一实例 |
| `current_user` | `aisuite` / `postgres` | 当前连接角色 |

> 四元组须与「预期目标配置 + 库名 + 连接方式 + 角色权限」**联合判断**；任一维度无法确认 → 停止危险操作，不继续。

| 层 | 时机 | 规则 | 失败行为 |
|---|---|---|---|
| **L1 静态** | `Settings` 构造时 | `TEST_DATABASE_URL` 的库名必须匹配 `^[a-z0-9_]+_test$`；`DATABASE_URL` 的库名**禁止**以 `_test` 结尾；两者库名必须不同 | 启动即抛 `ConfigError` |
| **L2 运行时** | `conftest` 的 session 级 fixture，**建任何连接之前** | 执行上表四元组核验；`current_database()` 必须等于 `aisuite_test`，`current_user` 应为 `aisuite`；不匹配则 `pytest.exit(..., returncode=2)` | 整套测试拒绝启动 |
| **L3 危险操作前** | 执行 `downgrade` / `DROP` / `TRUNCATE` 之前 | 再次执行四元组核验，且 `current_database()` **不得**等于 `aisuite_dev`；同时独立比对 `DATABASE_URL` 库名 | 该操作直接拒绝执行 |

> L3 存在的理由：L2 只保护了「测试进程」，保护不了「手工跑 alembic 时把环境变量指错」。**迁移脚本是最容易误伤开发库的入口。**

#### 四、S1 边界（用户明确要求，逐条可核对）

| 允许 | 禁止 |
|---|---|
| `db.py` 连接与 session 管理 | 任何业务表（`users`/`workspaces`/`kb_*`/`jobs`/`conversations`） |
| `migrations/`（`env.py` + `script.py.mako` + `versions/`） | repository 基类、seed 脚本 |
| `app_meta` 一张表 | Redis、Celery、testcontainers |
| `scripts/check_db.py` | 任何 `products/*` 目录 |
| `tests/` 库名守卫 | 修改 `for-job` 下 Java 项目或 `ai-assistant-py` |

---

## 15. 与 v1 的关键变更

| 章节 | v1 | v2 | 变更原因 |
|---|---|---|---|
| 1.3 | 无 | 新增三条设计原则 | 为后续判断提供判据 |
| 2.3 | 单一 `OpenAICompatProvider` | 能力声明 + profile 档位 + 降级表 + 目录重构 | 复审意见 2：不能把所有模型当成完全兼容 |
| 3 | worker 与 API 同进程 | worker 独立为 `apps/worker` | 复审意见 4：解析阻塞接口、重启丢任务 |
| **6** | 无（只在 Q1 提一句） | **整章新增**：三概念区分、workspace 模型、三层隔离、隔离测试 | 复审意见 1：保留租户扩展能力但不做多租户运营 |
| **7** | 散落在 2.1 与 4.1 | **整章新增**：租约领取、心跳、回收、错误分类、幂等、双状态机、可观测 | 复审意见 4：明确任务执行机制 |
| **8** | 一句话「接口隔离」 | **整章新增**：诚实界定隔离边界、`VectorStore` 契约、维度锁定 | 复审意见 3：避免换存储牵连业务 |
| 5.2 | 三档分类 | 三档 + **机制共享/策略不共享对照表** + 下沉规则 + 禁止抽象清单 | 复审意见 6：防止公共模块变成超级框架 |
| 10 | 8 张表 | 9 张：删 `kb_members`，加 `workspaces`/`workspace_members`；`jobs` 加 4 列 | 复审意见 1、7 |
| **12** | 天数表 | **验收标准驱动**：每阶段给运行验证 + 测试要求 + DoD 清单 | 复审意见 5：不能按天数推进 |
| 13.3 | 8 个问题 | 收敛为 9 条已定决策 + 6 个必须定 + 7 条默认假设 | 复审意见：不要一次性堆问题 |
| **14** | 无 | **整章新增**：路径检查记录、位置候选、安全清单 | 复审意见 8 |

---

## 16. 下一步

**已闭环（2026-10-26）**

- ✅ Q1 定为 A：`E:/8.cangku/for-job/ai-suite-py/`，与 Java 项目完全独立
- ✅ Q3 定为否：第一阶段 `PostgreSQL 16 + pgvector`，不做信创
- ✅ 实机环境核验完成（14.4），六处与文档不符之处已修正
- ✅ **S0 完成**：骨架可启动、24 测试通过、mypy/ruff/lint-imports 全绿、旧项目零改动（14.8）

**当前暂停点：S0 已通过验收，S1 未开工（等数据库就绪）**

**进入 S1 的唯一前置（由用户本人执行，我不介入）**

1. `aisuite` 角色 + `aisuite_dev` / `aisuite_test` 两库
2. 两库各执行 `CREATE EXTENSION IF NOT EXISTS vector;` 并查 `pg_extension` 确认
3. 在 `ai-suite-py/.env` 写入两条连接串（**不贴对话、不入 Git**）

> 我承诺：在用户明确告知「库已就绪」之前，**不建库、不改角色、不执行任何需要管理员权限的 SQL、不写 S1 代码**。

**S1 开工后的执行纪律（v2.3 细化，见 14.9）**

1. 写迁移前先确认 `DATABASE_URL` 指向 `aisuite_dev`，测试跑在 `aisuite_test`
2. 库名隔离用**三重守卫**（L1 静态库名后缀 / L2 conftest 运行时 `current_database()` / L3 危险操作前二次校验），**不只比较两个 URL 是否相同**
3. `upgrade head` 与 `downgrade base` 必须双向都跑通，回滚后无残留表
4. 每阶段结束交付：DoD 勾选清单 + `pytest` 实际输出 + 关键命令输出
5. 不开工本文件中标注为 C 类（第 5.1）的任何能力
6. 全程对 `for-job` 下 Java 项目零写入（14.3 禁止清单）

**可由我直接按默认推进、不必再问的事项**：Q2（云端 API，无 key 走 Mock）、Q4（V1 不做 OCR）、Q5（Java=v1 功能交付 / Python=工程体系+效果升级）、Q6（第二个产品做文档智能处理）。
