# AI 知识库系统

<div class="sys-hero">
  <div class="sys-hero__eyebrow">01 AI 智能应用 · 优先级 1 / 3</div>
  <div class="sys-hero__badges">
    <span class="sys-badge sys-badge--ok">✅ Java 已验证</span>
    <span class="sys-badge sys-badge--ok">✅ Python 已验证</span>
    <span class="sys-badge">🧪 204 项测试</span>
    <span class="sys-badge sys-badge--brand">🛡 无答案红线</span>
    <span class="sys-badge">:8082 / :5172</span>
  </div>
  <p class="sys-hero__pitch">让答案「有出处、可核对、不胡编」——企业级 RAG 与玩具 demo 的分水岭</p>
</div>

<div class="sys-grid">
  <div class="sys-card">
    <div class="sys-card__icon">🛡</div>
    <div class="sys-card__title">无答案红线</div>
    <div class="sys-card__desc">检索相关性不足直接拒答，绝不编造——比较原始余弦分，不用会虚高的融合分</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🔍</div>
    <div class="sys-card__title">混合检索</div>
    <div class="sys-card__desc">256 维哈希向量（中文 unigram + bigram）+ 关键词，RRF 融合排序</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">📎</div>
    <div class="sys-card__title">来源引用</div>
    <div class="sys-card__desc">答案溯源到原文片段与文档，返回可定位的引用分数</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🧩</div>
    <div class="sys-card__title">自包含 RAG</div>
    <div class="sys-card__desc">Python 版零重型依赖，哈希向量本地可跑，无需外部向量库</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">📊</div>
    <div class="sys-card__title">自动评测</div>
    <div class="sys-card__desc">命中率 + 引用准确率自动评测，可回归、可放进 CI</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">📥</div>
    <div class="sys-card__title">文档 ingestion</div>
    <div class="sys-card__desc">上传 → 解析 → 分块 → 索引，知识库级联删除</div>
  </div>
</div>

## 📌 项目简介

AI 知识库系统是一个**完整的 RAG（检索增强生成）应用**：上传文档 → 解析分块 → 向量索引 → 混合检索 → 生成回答 → 溯源引用。它最大的工程亮点是**「无答案红线」**：当检索相关性不足时直接拒答，而不是让大模型编造。Java 版 Spring Boot + 自研检索，Python 版 FastAPI + 自包含哈希向量，接口语义对齐——同一套能力，两种栈。

## 🗺️ 功能规划

### ✅ 已实现

| 功能 | 说明 |
|---|---|
| 文档管理 | 上传（TXT / MD / CSV / JSON）、解析、分块、知识库级联删除 |
| 知识检索 | 256 维哈希向量（中文 unigram + bigram）+ 关键词混合，RRF 融合排序 |
| 智能问答 | RAG 问答、多轮追问、SSE 流式输出 |
| 来源引用 | 答案溯源到原文片段与文档，返回引用分数 |
| **无答案红线** | 最佳召回分（原始余弦）低于阈值即拒答，绝不编造 |
| 效果评估 | 命中率 + 引用准确率自动评测，可回归 |
| 鉴权与限流 | JWT + Redis（降级内存版） |

### 📋 规划 / 待做

- [ ] 文档版本管理与增量重建索引
- [ ] 更强的向量模型（可切换 embedding provider）
- [ ] 检索重排（rerank）与多路召回
- [ ] 知识库权限与多租户隔离
- [ ] 评测集人工标注与可视化看板

## 🏗️ 技术架构

### RAG 全链路

```
 文档上传
    │
    ▼
┌───────────────┐   ┌────────────┐   ┌────────────────────┐
│ DocumentParser│──►│ TextChunker│──►│ HashingEmbedding   │
│ 解析 txt/md/  │   │ 重叠分块    │   │ 256 维 · L2 归一化  │
│ csv/json      │   └────────────┘   └─────────┬──────────┘
└───────────────┘                              │ 写入索引
                                               ▼
 用户提问 ──► 向量化 ──┬─ 向量检索（余弦相似度）
                       └─ 关键词检索（词重叠）
                              │
                              ▼  RRF 融合
                        Top-K 片段
                              │
                best.rawScore < 阈值 ?
                   │ 是                │ 否
                   ▼                   ▼
          ┌────────────────┐   ┌────────────────────┐
          │ 拒答（无答案红线）│   │ LLM 生成 + 引用溯源  │
          └────────────────┘   └────────────────────┘
```

**关键设计**：阈值比较的是 `rawScore()`（原始向量余弦），**绝不**比较 RRF 融合分 —— 融合分会因排名而虚高，用它会误判「有答案」。

### 双语言结构

```
┌──────────────────────────────────────────────┐
│   表现层：Vue 3（Java 版）/ REST              │
├──────────────────────────────────────────────┤
│   应用层：知识库 · 文档入库 · 问答 · 评测       │
├──────────────────────────────────────────────┤
│   RAG 管道：Parser → Chunker → Embedding →    │
│             HybridRetriever → RagPipeline     │
├──────────────────────────────────────────────┤
│   kit 套件：模型网关 · SSE · JWT · Redis 限流   │
├──────────────────────────────────────────────┤
│   数据层：H2 / SQLite · MySQL（6 张表）         │
└──────────────────────────────────────────────┘
```

## 🧰 技术栈 / 开发语言

| 分层 | Java 版 | Python 版 |
|---|---|---|
| Web | Spring Boot 3.3.6（JDK 21） | FastAPI + Uvicorn |
| 检索 | 哈希向量 + 关键词混合（RRF） | 同左（自包含实现，零重型依赖） |
| 模型接入 | OpenAI 兼容网关 | 同语义网关 |
| 流式 | `SseEmitter` | `StreamingResponse` |
| 存储 | H2 + MyBatis | SQLite + SQLAlchemy |
| 鉴权 / 限流 | JWT + Redis | PyJWT + Redis |
| 前端 | Vue 3 + Element Plus（4 个 Tab） | — |
| 测试 | 199 单测 + 14 E2E | 5 测试（pytest） |

<div class="sys-chips">
  <span class="sys-chip">Java 21</span>
  <span class="sys-chip">Spring Boot 3.3</span>
  <span class="sys-chip">FastAPI</span>
  <span class="sys-chip">哈希向量</span>
  <span class="sys-chip">RRF 融合</span>
  <span class="sys-chip">Vue 3</span>
  <span class="sys-chip">H2 / SQLite</span>
  <span class="sys-chip">MySQL</span>
  <span class="sys-chip">Redis</span>
  <span class="sys-chip">JWT</span>
</div>

## 📂 目录结构

```
ai-knowledge-base/         # Java 版
├── backend/src/main/java/com/forjob/
│   ├── kb/                # 业务：知识库 / 文档 / 问答 / 评测
│   └── ai/kit/            # 套件：rag / llm / sse / auth
├── frontend/              # Vue 3（文档/检索对比/问答/评估）
└── sql/schema.sql         # 6 张表

ai-knowledge-base-py/      # Python 版
├── backend/app/
│   ├── rag.py             # Parser / Chunker / Embedding / Retriever / Pipeline
│   ├── services.py        # KB / Ingest / QA / Eval
│   └── routes.py
├── backend/tests/         # 5 测试
└── docker-compose.yml     # MySQL + Redis + backend
```

## 🚀 快速开始（无需任何 API Key）

> 默认 `mock / echo` 网关，无需密钥即可跑通「上传 → 检索 → 问答 → 引用」全链路。

### Java 版
```bash
cd ai-knowledge-base
cd backend && mvn -o spring-boot:run      # 后端 :8082
cd ../frontend && npm i && npm run dev    # 前端 :5172
# 打开 http://localhost:5172  登录 demo / demo123
# 体验：新建知识库 → 上传 TXT/MD → 提问 → 看可定位引用
```

### Python 版
```bash
cd ai-knowledge-base-py/backend
python -m venv .venv && .venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8082 --reload
# 上传文档：POST /api/documents（multipart）  问答：POST /api/qa/stream
# 跑测试：pytest tests -q
```

## ✅ 验证证据

| 版本 | 单元测试 | E2E | 关键断言 |
|---|---|---|---|
| Java | 199 通过（33 类） | 14 / 14 | 引用定位、无答案拒答、评测指标 |
| Python | 5 通过 | — | 上传→检索→问答(引用)→拒答→评测全链路 |

<div class="sys-stats">
  <div class="sys-stat"><span class="sys-stat__num">204</span><span class="sys-stat__label">单元测试（Java 199 + Py 5）</span></div>
  <div class="sys-stat"><span class="sys-stat__num">14</span><span class="sys-stat__label">端到端 E2E</span></div>
  <div class="sys-stat"><span class="sys-stat__num">:8082</span><span class="sys-stat__label">默认后端端口</span></div>
  <div class="sys-stat"><span class="sys-stat__num">🛡</span><span class="sys-stat__label">无答案红线已落地</span></div>
</div>

## 🚀 开发路线

| 里程碑 | 内容 | 状态 |
|---|---|---|
| M1 | Java 版：RAG 全链路 + 引用 + 评测 | ✅ 完成 |
| M2 | Python 版：自包含检索同构实现 | ✅ 完成 |
| M3 | 重排 + 多路召回 + 版本管理 | 📋 规划 |
| M4 | 多租户权限 + 评测看板 | 📋 规划 |

## 🔗 相关资源

- 模块总览：[01 AI 智能应用](/instances/ai/)
- 兄弟项目：[AI 智能助手](/instances/ai/assistant) · [AI 工作流与智能体平台](/instances/ai/agent-platform)
- 技术实践：[功能开发 › AI 应用](/apps/ai/)

---

上一级：[01 AI 智能应用](/instances/ai/) · [实例总览](/instances/)
