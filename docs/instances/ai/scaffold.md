# 通用 AI 应用脚手架

<div class="sys-hero">
  <div class="sys-hero__eyebrow">01 AI 智能应用 · 定位：Java 三件套公共基座</div>
  <div class="sys-hero__badges">
    <span class="sys-badge sys-badge--ok">✅ 已验证</span>
    <span class="sys-badge">🧪 142 单测 + 26 E2E</span>
    <span class="sys-badge">🔑 零 Key 可完整演示</span>
    <span class="sys-badge sys-badge--brand">♻ kit 可逐字节复制</span>
    <span class="sys-badge">:8090 / :5190</span>
  </div>
  <p class="sys-hero__pitch">一次建深，三件套复用——把「模型接入 / 流式 / 工具 / RAG / 鉴权 / 响应」收敛成六个可复制子包</p>
</div>

<div class="sys-grid">
  <div class="sys-card">
    <div class="sys-card__icon">♻</div>
    <div class="sys-card__title">六子包 kit</div>
    <div class="sys-card__desc">网关 / 工具 / RAG / SSE / 鉴权 / 统一响应，业务侧只剩「表 + 控制器」</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">📋</div>
    <div class="sys-card__title">新建应用 5 步清单</div>
    <div class="sys-card__desc">从 kit 到一个可运行应用的标准路径，复制即起步</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🧪</div>
    <div class="sys-card__title">142 单测 + 26 E2E</div>
    <div class="sys-card__desc">20 个测试类覆盖六子包，端到端走通三条示例链路</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">📦</div>
    <div class="sys-card__title">可逐字节复制</div>
    <div class="sys-card__desc">kit 不依赖任何业务类，scripts/sync-kit.sh 一键同步到其他项目</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🔑</div>
    <div class="sys-card__title">零 Key 演示</div>
    <div class="sys-card__desc">含 demo/notes · demo/chat · demo/rag 三个可点击示例模块</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🧱</div>
    <div class="sys-card__title">四层单向依赖</div>
    <div class="sys-card__desc">L4 应用 → L3 编排 → L2 能力 → L1 基础设施，依赖严格单向</div>
  </div>
</div>

## 📌 项目简介

每个 AI 应用都要重写一遍同样六件事：**模型接入与降级、流式输出、工具调用编排、检索增强、鉴权、统一响应**。
本工程把这六件事收敛成 `com.forjob.ai.kit` 六个子包，业务侧只剩「表 + 控制器」——它是 [AI 智能助手](/instances/ai/assistant)、[AI 知识库系统](/instances/ai/kb)、[AI 工作流与智能体平台](/instances/ai/agent-platform) 的共同起点。

## 🗺️ 能力矩阵（都能点一下就跑）

| 能力 | 关键类 | 无 Key 可演示 |
|---|---|---|
| 多模型接入 + 降级链 | `LlmProvider` / `ModelRegistry` / `LlmGateway` | ✅ 落到 mock |
| 流式输出（SSE） | `SseStreamer` | ✅ 25ms/块打字机 |
| 工具调用（≤5 轮） | `ToolRegistry` / `ToolInvoker` / `AgentLoop` | ✅ 计算器 / 时间 / 文本统计 |
| RAG（上传→检索→引用） | `DocumentParser` / `TextChunker` / `HashingEmbeddingModel` / `HybridRetriever` / `RagPipeline` | ✅ 全链路本地 |
| 三模式检索对比 | `RetrievalMode{VECTOR, KEYWORD, HYBRID}` | ✅ 返回 score + rawScore |
| 无答案兜底 | `RagPipeline`（阈值判定，不调 LLM） | ✅ 固定话术 |
| 统一响应 + 全局异常 | `ApiResult` / `GlobalExceptionHandler` | ✅ |
| HMAC 鉴权（只保护写接口） | `TokenService` / `AuthInterceptor` | ✅ demo/demo123 |
| 全链路 traceId | `TraceIdFilter` | ✅ 响应头 `X-Trace-Id` |

## 🏗️ 技术架构

### 四层分层，依赖严格单向

```
┌──────────────────────────────────────────────┐
│ L4 应用层   com.forjob.scaffold.demo           │
│             notes · chat · rag（复制起点）      │
├──────────────────────────────────────────────┤
│ L3 编排层   LlmGateway · AgentLoop ·           │
│             RagPipeline · HybridRetriever ·    │
│             ToolInvoker                        │
├──────────────────────────────────────────────┤
│ L2 能力层   ModelRegistry · ToolRegistry ·     │
│             InMemoryVectorStore · KeywordIndex │
│             HashingEmbeddingModel · TextChunker│
│             DocumentParser · SseStreamer       │
├──────────────────────────────────────────────┤
│ L1 基础设施  common · auth · llm 抽象           │
│             （零外部框架依赖）                  │
└──────────────────────────────────────────────┘
        L4 → L3 → L2 → L1（单向）
```

`kit` 不 import 任何 `com.forjob.scaffold` 业务类，因此可以整块复制到其他项目（见 `scripts/sync-kit.sh`）。

### 六件事 → 六个子包

```
common（统一响应/异常/IdGen/TraceId）
auth（TokenService/AuthInterceptor）
llm（Provider/Registry/Gateway + 降级）
tool（Registry/Invoker/AgentLoop）
rag（Parser/Chunker/Embedding/Retriever/Pipeline）
sse（SseStreamer）
```

## 🧰 技术栈 / 开发语言

| 分层 | 技术 |
|---|---|
| 后端 | Java 21 + Spring Boot 3.3.6 + H2 文件库 |
| 前端 | Vue 3.5 + Vite 5 + TypeScript + Element Plus + Pinia + vue-router + markdown-it |
| 端口 | 后端 8090 / 前端 5190 |
| 鉴权 | HMAC Token（只保护写接口） |
| 测试 | 142 单测（20 类）+ 26 项 E2E |

<div class="sys-chips">
  <span class="sys-chip">Java 21</span>
  <span class="sys-chip">Spring Boot 3.3</span>
  <span class="sys-chip">Vue 3.5</span>
  <span class="sys-chip">Pinia</span>
  <span class="sys-chip">markdown-it</span>
  <span class="sys-chip">H2</span>
  <span class="sys-chip">HMAC</span>
</div>

## 📂 目录结构

```
ai-app-scaffold/
├── backend/
│   ├── src/main/java/com/forjob/
│   │   ├── ai/kit/            # 六个子包（可复制）
│   │   └── scaffold/demo/     # 示例业务模块（notes / chat / rag）
│   └── src/test/              # 142 单测
├── frontend/                  # Vue 3.5
├── scripts/sync-kit.sh        # kit 同步到其他项目
├── sql/                       # schema
└── docs/                      # 新建应用 5 步清单
```

## 🚀 快速开始

```bash
cd ai-app-scaffold
cd backend && mvn -o spring-boot:run     # 后端 :8090（H2 文件库）
cd ../frontend && npm i && npm run dev    # 前端 :5190
# 打开 http://localhost:5190  体验 demo/notes · demo/chat · demo/rag
# 写接口用 HMAC 鉴权：demo / demo123
# 复制 kit 到新项目：bash scripts/sync-kit.sh
# 单测：mvn test   |   E2E：见 docs/ 下的「新建应用 5 步清单」
```

## ✅ 验证证据

| 项目 | 结果 |
|---|---|
| `mvn test` | **142 用例全绿**（20 个测试类） |
| E2E | **26 项全通过** |
| `npm run build` | 成功 |

<div class="sys-stats">
  <div class="sys-stat"><span class="sys-stat__num">142</span><span class="sys-stat__label">单元测试</span></div>
  <div class="sys-stat"><span class="sys-stat__num">26</span><span class="sys-stat__label">端到端 E2E</span></div>
  <div class="sys-stat"><span class="sys-stat__num">:8090</span><span class="sys-stat__label">默认后端端口</span></div>
  <div class="sys-stat"><span class="sys-stat__num">6</span><span class="sys-stat__label">kit 子包</span></div>
</div>

## 🚀 开发路线

| 里程碑 | 内容 | 状态 |
|---|---|---|
| M1 | kit 六子包 + 三示例模块 + 5 步清单 | ✅ 完成 |
| M2 | kit 同步脚本 + 三件套复用验证 | ✅ 完成 |
| M3 | 可插拔向量库（替换 InMemoryVectorStore） | 📋 规划 |
| M4 | MCP 工具动态挂载 | 📋 规划 |

## 🔗 相关资源

- 复用方：[AI 智能助手](/instances/ai/assistant) · [AI 知识库系统](/instances/ai/kb) · [AI 工作流与智能体平台](/instances/ai/agent-platform)
- 模块总览：[01 AI 智能应用](/instances/ai/)
- 技术实践：[功能开发 › AI 应用](/apps/ai/)

---

上一级：[01 AI 智能应用](/instances/ai/) · [实例总览](/instances/)
