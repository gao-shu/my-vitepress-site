# 01 AI 应用

> 智能助手、知识库、工作流与智能体 —— 用大模型与 Agent 构建的应用。

**项目状态图例**：✅ 已验证 · 🔧 验证中/在建 · 📋 规划中（尚未开始实现）

## 项目规划

| 序号 | 软件项目 | 核心功能 | 状态 |
|---|---|---|---|
| 1 | [AI 智能助手](/instances/ai/assistant) | 多模型接入、智能对话、文件分析、工具调用 | ✅ 已验证 |
| 2 | [AI 知识库系统](/instances/ai/kb) | 文档管理、知识检索、智能问答、来源引用 | ✅ 已验证 |
| 3 | [AI 工作流与智能体平台](/instances/ai/agent-platform) | 工作流编排、智能体配置、工具调用、任务自动化 | ✅ 已验证 |

> 三个项目已全部交付至 `E:\8.cangku\for-job\` 目录（`ai-assistant` / `ai-knowledge-base` / `ai-agent-platform`），
> 共 **630 个单元测试**（187 + 199 + 244）与 **39 项 E2E 检查**全部通过，均具备可执行 jar 包、前端工程与完整文档。

## 与现有内容的关系

本模块是当前基础最好的方向，已有明确载体：

- **AI 智能助手** ← [ModelDesk](/apps/ai/modeldesk)（✅ 已验证：多模型接入 + OpenAI 兼容网关 + 模型对比）与 Java Agent 示例（🔧 验证中：Tool Calling / MCP / Multi-Agent）
- **AI 知识库系统** ← 个人知识库 java-langchain4j-lab（🔧 验证中：Spring Boot + LangChain4j + pgvector，笔记 + 检索 + AI 助手）
- **AI 工作流与智能体平台** ← 智能体工作流的设计方法已沉淀在[功能开发 › AI 应用](/apps/ai/)技术实践页

## 优先级建议

1. ~~**AI 知识库系统**~~（✅ 已完成）
2. ~~**AI 智能助手**~~（✅ 已完成）
3. ~~**AI 工作流与智能体平台**~~（✅ 已完成）

---

上一级：[应用实例](/instances/)
