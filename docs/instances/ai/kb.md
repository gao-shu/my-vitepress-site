# AI 知识库系统

> 状态：✅ 已验证（已交付） · 所属模块：[01 AI 应用](/instances/ai/) · 模块内优先级：第 1 位
> 交付位置：`E:\8.cangku\for-job\ai-knowledge-base`

## 核心功能

| 功能 | 交付说明 |
|---|---|
| 文档管理 | 文档上传、解析（TXT / MD / CSV / JSON）、分块、知识库级联删除 |
| 知识检索 | 向量检索 + 关键词混合检索（RRF 融合）、相似度排序、两种模式对比视图 |
| 智能问答 | RAG 问答、SSE 流式输出、多轮追问、引用定位 |
| 来源引用 | 答案溯源到原文片段与文档、命中率 + 引用准确率评估报告 |

## 技术栈

- 后端：JDK 21 + Spring Boot 3.3.6 + Maven + H2 + JWT 鉴权
- 检索：256 维哈希向量（中文 unigram + bigram，murmur3，L2 归一化）+ 关键词混合召回
- 前端：Vue 3.4 + Vite 5 + TypeScript + Element Plus + Pinia + vue-router + markdown-it
- 运行端口：后端 `8082`，前端 `5172`

## 关键设计

- **无答案红线**：相似度低于阈值时拒绝作答（直接回答"不知道"）而不是编造答案；阈值比较的是原始向量余弦分，不是 RRF 融合分
- **无密钥降级**：未配置 OpenAI 密钥时自动切换 Mock 生成，保证链路可跑通

## 验证证据

- 单元测试：**199 个测试全部通过**（33 个测试类）
- E2E 测试：**14 / 14 通过**（`backend/e2e_kb.py`，覆盖知识库创建、文档上传、统计、检索对比、问答引用、无答案拒答、效果评估等全链路）
- 交付物：`ai-knowledge-base-1.0.0.jar` 可执行包、README / API / TEST-REPORT / ARCHITECTURE 文档、`sql/schema.sql`（6 张表）

## 建设状态

✅ 已交付：RAG 全链路（解析-索引-检索-生成-引用）闭环达成，测试与文档齐备。

---

上一级：[01 AI 应用](/instances/ai/) · [实例总览](/instances/)
