# Second Brain — Migration Registry

> 数据迁移账本：旧路径 → Canonical → 新 IA。  
> Phase A2 建立；后续 B/C 继续追加。**禁止靠记忆迁移。**

Status 取值：`pending` · `linked` · `migrated` · `canonical` · `duplicate` · `deprecated`

| Old Path | Canonical | New IA | Action | Status | Notes |
|---|---|---|---|---|---|
| `docs/english-speaking/*` | 原文（不复制） | 知识 / 英语 | linked | linked | 正式入口 `/knowledge/english/`；旧 URL 保留；sidebar 增加归属 |
| `docs/life/fitness/*`（正文） | 迁入 `life/health/*` | 生活 / 健康 | migrated | migrated | 正文移至 health；fitness 留兼容 stub |
| `docs/life/fitness/index.md` 等 stub | — | 生活 / 健康（兼容） | linked | linked | 旧 URL 跳转到 health |
| `docs/open-source/*` | 原文（不复制） | 资源 / 收藏 | linked | linked | `/resources/collections/` 索引；**不进实践/履历** |
| `docs/devtools/*` | 原文（不复制） | 资源 / 工具 | linked | linked | `/resources/tools/` 索引 |
| `docs/devtools/docker.md` | **Docker Canonical** | 资源 / 工具 | canonical | canonical | Phase 1.5 D2 |
| `docs/tech-system/devops/docker.md` | 非 Canonical | 知识侧兼容 | linked | duplicate | 本阶段仅引用，不合并删除 |
| `docs/ai/explore/model-selection.md` | **AI 模型选型 Canonical** | 知识 / AI / AI模型 | keep | canonical | B-2.2：D1=B；Extract from llm-selection |
| `docs/ai/explore/llm-selection.md` | `docs/ai/explore/model-selection.md` | 知识 / AI / AI模型 | legacy_stub | migrated | B-2.2：Extract + Stub；旧 URL 保留 |
| `docs/tech-system/ai/{llm,agent,mvp,multimodal,mlops,ai-roadmap}.md` | **`docs/ai/*` 同名文** | 知识 / AI（Canonical） | legacy_stub | migrated | B-1.2：旧 URL 保留为 Stub → `/ai/*` |
| `docs/ai/{llm-basics,agent-basics,mvp-server,multimodal-kg,mlops-platform,ai-roadmap}.md` | **Canonical** | 知识 / AI | keep | canonical | B-1.2 确认 |
| `docs/tech-system/ai/phase1–4*.md`（旧） | 学习计划正文已迁出 | 成长 / 学习计划 / AI | legacy_stub | migrated | Stub → `/growth/learning-plan/ai/phase*` |
| `docs/growth/learning-plan/ai/phase*.md` | **学习计划 Canonical** | 成长 / 学习计划 / AI | migrated | canonical | B-1.2：非知识正文 |
| `docs/ai/**`（其余主树） | AI 知识 | 知识 / AI | keep | canonical | B-1.2 未改正文 |
| `docs/tech-system/backend/flowable-bpmn.md` | **Flowable 入门 Canonical** | 知识 / 编程 / Java / 工作流 | keep | canonical | B-3.2：Canonical-1 |
| `docs/framework/flowable-bpmn.md` | `docs/tech-system/backend/flowable-bpmn.md` | 知识 / 编程 / Java / 工作流 | legacy_stub | migrated | B-3.2：字节级克隆 → Stub；旧 URL 保留 |
| `docs/tech-system/backend/flowable-enterprise-extensions.md` | **Flowable 企业二开 Canonical** | 知识 / 编程 / Java / 工作流 | keep | canonical | B-3.2：Canonical-2；独立正文，不并入门 |
| `docs/springboot/*` | 教程 → 知识 | 知识 / 编程 / Java | pending | pending | D3=A |
| `docs/framework/springboot-*` | 面试/FAQ → 职业保障 | 职业 / 职业保障 | pending | pending | D3=A |
| `docs/tech-system/backend/java-spring.md` | 生态地图 → 知识 | 知识 / 编程 / Java | pending | pending | 与上两线同主题不同用途 |
| `docs/tech-system/practices/*` | 工程方法 | 知识 / 其他 | pending | pending | D4=A；**不进实践日志** |
| `docs/java|database|redis|…`（求职集群） | 面试体 → 职业保障 | 职业 / 职业保障 | pending | pending | 后期可抽 Knowledge Canonical |
| `docs/guide/*` | 求职总纲 | 职业 / 定位·保障 | pending | pending | |
| `docs/tech-system/industrial-*` 等 | 工业数字化 | 知识 / 其他 / 工业 | pending | pending | |
| `docs/about/*` | 关于 | 页脚 | linked | linked | A1 已移出一级导航 |
| `docs/growth/**` | 成长空壳 | 成长 | linked | linked | A1 建立 |
| `docs/career/**` | 职业空壳 + 兼容链 | 职业 | linked | linked | A1；正文仍在 guide/resume/java… |
| `docs/knowledge/**` | 知识空壳 + 兼容链 | 知识 | linked | linked | A1/A2 |
| `docs/practices/index.md` | 实践日志层（空） | 实践 | linked | linked | 无固定二级菜单 |
| `docs/resources/{books,learning,docs,official-links}` | 原文 | 资源 | linked | linked | books 已有；courses/websites 为索引 |
| `docs/framework/local-cache.md` | **本地缓存 Canonical** | 职业 / 职业保障（框架侧） | keep | canonical | B-4.2：Extract from database/local-cache |
| `docs/database/local-cache.md` | `docs/framework/local-cache.md` | 职业 / 职业保障 | legacy_stub | migrated | B-4.2：Extract+Stub → `/framework/local-cache` |
| `docs/java/concurrency.md` | `concurrency-core` + `thread-basics` | 职业 / 职业保障 | legacy_stub | migrated | B-4.2：Survey Stub；scenario 独立 |
| `docs/java/concurrency-core.md` | **并发核心 Canonical** | 职业 / 职业保障 | keep | canonical | B-4.2 确认 |
| `docs/java/thread-basics.md` | **线程/线程池 Canonical** | 职业 / 职业保障 | keep | canonical | B-4.2 确认 |
| `docs/java/concurrency-scenario.md` | **场景实战 Canonical** | 职业 / 职业保障 | keep | canonical | B-4.2：保持独立，未合并 |
| `docs/tech-system/devops/monitoring.md` | 待定 | 知识/其他 | pending | duplicate | 与 monitoring-observability 同主题 |
| `docs/tech-system/devops/monitoring-observability.md` | 待定 | 知识/其他 | pending | duplicate | |
| `docs/mq|network-linux|design-patterns|scenarios|resume/*` | 面试体 → 职业保障 | 职业 / 职业保障 | pending | pending | 求职集群细分 |
| `docs/english-speaking/SPEAK_FEATURE_GUIDE.md` | 站点功能说明 | 非 IA / meta | pending | pending | 含 file:// 链接；非学习正文 |
| `docs/ai/index.md` → `/ai/model-deploy/*` | — | — | pending | pending | **死链**：目标页不存在（规划未写） |
| `docs/tech-system/index.md` → 大量 ./devops|tools|data/* | — | — | pending | pending | **死链**：路线图占位未落地 |
| `docs/english-speaking/common-templates` | — | — | pending | pending | **死链**：索引引用缺失页 |
| `docs/resume/skills-optimization` | — | — | pending | pending | **死链** |
| `docs/tech-system/integration/*` 内 `../../plc/*` | 相对路径错误 | 工业知识 | pending | pending | 应为 `../plc/`；本阶段不修 |

## Phase log

| Phase | Date | Summary |
|-------|------|---------|
| A1 | 2026-09-08 | IA 骨架 + 新 nav；旧 URL 保留 |
| A2 | 2026-09-08 | 英语/健康/收藏/工具归位；本登记表建立 |
| A3 | 2026-09-08 | 结构健康检查；补登记表缺口；不修正文 |
| B-1.2 | 2026-09-08 | AI 双源收敛：6 同名 Stub；phase1–4 → 成长/学习计划/AI |
| B-2.2 | 2026-09-08 | model-selection Canonical；llm-selection Extract+Stub；导航统一主推 Canonical |
| B-3.2 | 2026-09-08 | Flowable：入门+企业二开双 Canonical；framework 克隆 Stub |
| B-4.2 | 2026-09-08 | Local Cache Extract+Stub；java/concurrency Survey Stub |

### B-2.2 detail

- **Canonical**：`docs/ai/explore/model-selection.md`（路径不变）
- **Legacy**：`docs/ai/explore/llm-selection.md` → Stub → `/ai/explore/model-selection`
- **收敛策略**：Extract + Stub（方案 C）
- **提取的独有内容**：LLM 三梯队表（含 Gemini / GLM / Llama 4 / Phi-4 / Mistral）；Ollama + Open WebUI；Cursor / Continue / MCP / Gateway / A-B / 监控；本知识库用途推荐表；→ `dev-tools-selection` 导航
- **导航调整**：sidebar「AI 选型」主推 model-selection；`ai-selection/index` 主推 Canonical；`knowledge/ai/ai-models` 区分主入口 / Legacy；`ai/index` 死链 `/ai/model-deploy/03-model-selection` → `/ai/explore/model-selection`
- **旧 URL**：`/ai/explore/llm-selection` 保留
- **本次未处理**：Flowable / Spring / Docker / RAG 专页 / model-deploy 模块其余死链 / 其他 duplicate / 模型知识大更新

### B-3.2 detail

- **Canonical-1**：`docs/tech-system/backend/flowable-bpmn.md`（入门；路径不变）
- **Canonical-2**：`docs/tech-system/backend/flowable-enterprise-extensions.md`（企业二开；独立，未合并）
- **Legacy**：`docs/framework/flowable-bpmn.md` → Stub → `/tech-system/backend/flowable-bpmn`
- **导航**：tech-system sidebar 已主推两篇 Canonical；framework sidebar 无 Flowable 完整正文入口
- **未创建**：Practice / Career Project
- **未参与收敛**：`open-source/admin-jeecg.md`、`scenarios/web-system-design.md`
- **本次未处理**：Spring / Docker / 其他 duplicate / 全站 dead links

### B-4.2 detail

- **Local Cache Canonical**：`docs/framework/local-cache.md`
- **Local Cache Legacy**：`docs/database/local-cache.md` → Stub → `/framework/local-cache`
- **Extract**：§7.4 自定义 Key 生成器；§10.2 容量规划要点（来自 database 版）
- **Concurrency Survey Legacy**：`docs/java/concurrency.md` → Stub → `/java/thread-basics` + `/java/concurrency-core`
- **保持独立**：`docs/java/concurrency-scenario.md`
- **未处理**：Monitoring / Docker / Spring / RuoYi / Jeecg / 工业平行篇

