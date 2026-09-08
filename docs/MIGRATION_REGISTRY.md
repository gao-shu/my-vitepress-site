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
| `docs/ai/explore/model-selection.md` | **AI 模型选型 Canonical** | 知识 / AI / AI模型 | pending | pending | D1=B；**未在 B-1.2 处理** |
| `docs/ai/explore/llm-selection.md` | 待收敛到 model-selection | 知识 / AI / AI模型 | pending | pending | **未在 B-1.2 处理** |
| `docs/tech-system/ai/{llm,agent,mvp,multimodal,mlops,ai-roadmap}.md` | **`docs/ai/*` 同名文** | 知识 / AI（Canonical） | legacy_stub | migrated | B-1.2：旧 URL 保留为 Stub → `/ai/*` |
| `docs/ai/{llm-basics,agent-basics,mvp-server,multimodal-kg,mlops-platform,ai-roadmap}.md` | **Canonical** | 知识 / AI | keep | canonical | B-1.2 确认 |
| `docs/tech-system/ai/phase1–4*.md`（旧） | 学习计划正文已迁出 | 成长 / 学习计划 / AI | legacy_stub | migrated | Stub → `/growth/learning-plan/ai/phase*` |
| `docs/growth/learning-plan/ai/phase*.md` | **学习计划 Canonical** | 成长 / 学习计划 / AI | migrated | canonical | B-1.2：非知识正文 |
| `docs/ai/**`（其余主树） | AI 知识 | 知识 / AI | keep | canonical | B-1.2 未改正文 |
| `docs/framework/flowable-bpmn.md` | 待定一篇 | 知识 / 编程 | pending | duplicate | 与 tech-system 完全相同 |
| `docs/tech-system/backend/flowable-bpmn.md` | 待定一篇 | 知识 / 编程 | pending | duplicate | 同上 |
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
| `docs/database/local-cache.md` | 非长文主源 | 职业保障侧短文？ | pending | duplicate | 与 framework/local-cache 同主题；framework 更长 |
| `docs/framework/local-cache.md` | 倾向 Canonical 长文 | 待 Phase B 定 | pending | duplicate | |
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
