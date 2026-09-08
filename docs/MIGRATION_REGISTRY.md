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
| `docs/ai/explore/model-selection.md` | **AI 模型选型 Canonical** | 知识 / AI / AI模型 | pending | pending | D1=B；A2 不处理正文 |
| `docs/ai/explore/llm-selection.md` | 待收敛到 model-selection | 知识 / AI / AI模型 | pending | pending | 检查独立价值后再提取/重定向 |
| `docs/tech-system/ai/*` | 以 `docs/ai` 为准 | 知识 / AI | pending | duplicate | A/B 类重复；B/C 处理 |
| `docs/framework/flowable-bpmn.md` | 待定一篇 | 知识 / 编程 | pending | duplicate | 与 tech-system 完全相同 |
| `docs/tech-system/backend/flowable-bpmn.md` | 待定一篇 | 知识 / 编程 | pending | duplicate | 同上 |
| `docs/springboot/*` | 教程 → 知识 | 知识 / 编程 / Java | pending | pending | D3=A |
| `docs/framework/springboot-*` | 面试/FAQ → 职业保障 | 职业 / 职业保障 | pending | pending | D3=A |
| `docs/tech-system/backend/java-spring.md` | 生态地图 → 知识 | 知识 / 编程 / Java | pending | pending | 与上两线同主题不同用途 |
| `docs/tech-system/practices/*` | 工程方法 | 知识 / 其他 | pending | pending | D4=A；**不进实践日志** |
| `docs/java|database|redis|…`（求职集群） | 面试体 → 职业保障 | 职业 / 职业保障 | pending | pending | 后期可抽 Knowledge Canonical |
| `docs/guide/*` | 求职总纲 | 职业 / 定位·保障 | pending | pending | |
| `docs/ai/**`（主树） | AI 知识 | 知识 / AI | pending | pending | Phase B 挂接 |
| `docs/tech-system/industrial-*` 等 | 工业数字化 | 知识 / 其他 / 工业 | pending | pending | |
| `docs/about/*` | 关于 | 页脚 | linked | linked | A1 已移出一级导航 |

## Phase log

| Phase | Date | Summary |
|-------|------|---------|
| A1 | 2026-09-08 | IA 骨架 + 新 nav；旧 URL 保留 |
| A2 | 2026-09-08 | 英语/健康/收藏/工具归位；本登记表建立 |
