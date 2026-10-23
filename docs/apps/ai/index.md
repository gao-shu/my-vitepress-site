# AI 应用

> 智能体、知识库、工作流 —— 用大模型与 Agent 做出来的应用。

**项目状态图例**：✅ 已验证（有运行/测试证据） · 🔧 验证中/在建（代码存在，证据整理中） · 📋 规划中（尚未开始）

## ✅ 已验证项目

| 项目 | 简介 | 技术栈 | 验证证据 | 仓库 |
|---|---|---|---|---|
| [ModelDesk · 本机多模态 AI 配测台](/apps/ai/modeldesk) | 多个模型 API 散装接入的收敛方案：本地 OpenAI 兼容网关 + 模型对比 + 批量运行 | TypeScript · Next.js · Tauri · pnpm monorepo | 93 项单元测试通过 · smoke 2/2 · 生产构建成功 · v0.2.1 已发布 | [GitHub](https://github.com/gao-shu/modeldesk)（MIT） |

## 🔧 验证中 / 在建

| 项目 | 状态 | 说明 |
|---|---|---|
| 个人知识库（java-langchain4j-lab） | 🔧 代码保全与运行验证中 | Java 21 · Spring Boot 3.5 · LangChain4j · PostgreSQL/pgvector；笔记 + 检索 + AI 助手，含 Electron 桌面壳与 NAS 部署方案 |
| Java Agent 示例（java-agent-demo） | 🔧 测试实跑与文档整理中 | Java 21 · Spring Boot 3.4 · MCP 2.0；Tool Calling / Memory / RAG / Multi-Agent 最小实现，Gitee 公开 |

## 📋 技术实践

| 文章 | 解决的问题 |
|------|------------|
| [知识库问答（RAG）搭建实践](/apps/ai/rag-knowledge-base) | 企业文档问不出来：文档切分、检索重排与受控生成，让私有资料能被准确问答 |
| [智能体工作流设计与落地](/apps/ai/agent-workflow) | Demo 到上线的差距：用状态机、工具约束和可观测把 Agent 变成可控系统 |
| [多模型 API 接入与选型](/apps/ai/multi-model-api) | 散装接入各厂商模型：统一网关、按任务选型、降级与配额成本管理 |
| [Prompt 编排与生成流程自动化](/apps/ai/prompt-pipeline) | 多步内容生产（剧本→分镜→生图/生视频）：模板版本、人工审核与异步编排 |
| [AI 编程助手在项目中的落地](/apps/ai/ai-code-assistant) | Cursor/Claude 在老项目与新项目的用法：上下文规则、Code Review 与安全边界 |

---

上一级：[功能开发](/apps/)
