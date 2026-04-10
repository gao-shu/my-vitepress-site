# AI 探索（独立模块）

> 这里是专门给自己的 **AI / 大模型学习、探索热门工具与开源项目** 留的空间，不再和传统「Java / 数据库 / 框架」技术库混在一起，方便单独规划。  
> **命名说明**：顶栏使用 **「AI 探索」**——模块内仍包含**阶段路线与循序渐进**（偏系统学习）与**热门软件与开源生态地图**（偏工具与选型），避免旧名「AI 开发」过于像岗位职责描述。

---

## 🔥 热门 AI 软件与开源项目（探索入口）

想先看「当下都在用什么、该 Star 谁」——从这里进入：

- [**AI 热门软件与开源项目地图**](/ai/explore/)：按 **对话与编程辅助、本地推理、Agent 编排、RAG、推理服务、多模态** 等维度整理，附学习优先级与站内文档跳转。

---

## 🧭 从哪里开始看？

如果你现在只是普通开发，希望**先用好大模型 + 慢慢往 AI 工程靠拢**，可以按下面顺序：

1. **总览路线图**  
   - [AI 时代开发者入门路线（LLM / Agent / 多模态 / MLOps）](/ai/ai-roadmap)
2. **阶段一：用好大模型（效率为主）**  
   - [第一阶段：大模型（LLM）入门与 Prompt 规划【效率优先】](/ai/llm-basics)
3. **阶段一进阶：让模型“能干活”**  
   - [第一阶段进阶：Agent / 工具型 AI 规划【让模型“能干活”】](/ai/agent-basics)
4. **阶段二：MVP Server / 数据中台**  
   - [第二阶段：MVP Server / 数据中台规划【让模型吃到“干净数据”】](/ai/mvp-server)
5. **阶段三：RAG / 多模态 / 知识图谱（进阶可选）**  
   - [第三阶段：多模态 & 知识图谱规划【做更“聪明”的知识助手】](/ai/multimodal-kg)
6. **阶段四：部署 & MLOps（后期选修）**  
   - [第四阶段（可选）：部署 & MLOps 规划【从 Demo 走向“小产品”】](/ai/mlops-platform)

---

## 📚 三个阶段的「模块化文章」版（一步步学）

如果你更希望**按文章顺序一步步练**（每篇都有练习/验收点），从这里进入：

1. **阶段一模块：LLM & Prompt（循序渐进）**
   - [模块导航：阶段一（LLM & Prompt）](/ai/stage-1-llm/)
2. **阶段二模块：Agent & Tools（循序渐进）**
   - [模块导航：阶段二（Agent & Tools）](/ai/stage-2-agent/)
3. **阶段三模块：MVP Server / 数据中台（循序渐进）**
   - [模块导航：阶段三（MVP Server）](/ai/stage-3-mvp-server/)

---

## 🧩 大模型部署及使用（本地/云端）

- [模块导航：大模型部署及使用](/ai/model-deploy/)
  - [本地部署](/ai/model-deploy/01-local-deploy)
  - [云端部署](/ai/model-deploy/02-cloud-deploy)
  - [模型选择指南（按环境/场景）](/ai/model-deploy/03-model-selection)
  - [推理框架/工具对比与选型（2026）](/ai/model-deploy/04-runtime-compare)

---

## 🧪 面向“Agent 开发入门”的专属学习路径

> 目标很具体：**从现在的 Java 开发 → 能独立做出 1～2 个可用的 AI Agent 小工具**，优先服务你自己的“面试学习 / 知识库”场景。

### 第 0 阶段：打基础（LLM 使用 + Prompt）

- **用时建议**：1～3 天，和日常写代码/复习穿插进行。  
- **要做到：**
  - 会在网页端稳定使用 1～2 个大模型，帮你改代码、解释报错、整理面试题。  
  - 按 `llm-basics` 里的模板，整理出**自己的 Prompt 模板库**（面试 Q&A、学习总结、自我介绍生成等）。
- **对应文档：**
  - `/tech-system/ai/llm-basics`

### 第 1 阶段：单 Agent + 单工具（最小闭环）

- **用时建议**：3～7 天。  
- **核心目标：** 做出一个“**单 Agent + 一个外部工具**”的小项目，比如：
  - “面试学习助手”：  
    - 工具：读取本地 Markdown（你现在这个 VitePress 库里的某个模块）。  
    - 能力：输入模块名 → 生成 N 道面试题 + 参考答案 → 写回新的 Markdown。
- **学习要点：**
  - 读完 `/tech-system/ai/agent-basics` 中的：
    - System/User Prompt  
    - Tools / Function Calling  
    - 最小 Demo 建议  
  - 选一门你顺手的语言（推荐 Java / Node / Python 任一），手写出：
    - “调用 LLM + 调用一个 HTTP / 本地文件工具”的最小 Agent 流程。
- **对应文档：**
  - `/tech-system/ai/agent-basics`  
  - `/tech-system/ai/phase1-llm-agent`（更细的阶段一学习规划）

### 第 2 阶段：MVP Server + 简单 RAG（让 Agent“吃对数据”）

- **用时建议**：1～3 周，可拆成零散小任务。  
- **核心目标：**  
  - 做出一个**小型数据中台（MVP Server）**，专门给 Agent 提供“整理好的上下文”。  
  - 让 Agent 不再直接读文件，而是**先调你的中台，再调模型**。
- **推荐实战：**
  - 用 Spring Boot 做一个 `/context` 接口：
    - 从 `docs/` 目录扫描 Markdown，抽取标题/小节/标签。  
    - 按模块返回一批“待学习内容 + 简要摘要”。  
  - 在 Agent 侧改成：
    - 用户输入模块名 → 先调 `/context` → 再调 LLM 生成学习计划/面试题。
- **对应文档：**
  - `/tech-system/ai/mvp-server`  
  - `/tech-system/ai/phase2-mvp-server`

### 第 3 阶段（进阶）：RAG + 多知识源 Agent

- **用时建议**：2～4 周，完全可分散推进。  
- **核心目标：**
  - 让 Agent 能基于**向量检索**从你的面试笔记库中找资料，再生成答案。  
  - 初步理解“多工具、多步任务”的 Agent 流程。
- **推荐实战：**
  - 选一个向量库（本地/云端皆可），把 `Java / 数据库 / Redis` 三个模块做成向量化知识库。  
  - 写一个 “面试问答 Agent”：
    - 输入：问题 + 模块（如“数据库”）。  
    - 步骤：向量检索 → 拼上下文 → 调 LLM → 输出答案 + 引用。  
  - 有余力再尝试：把“行情 / 新闻”等外部 API 加进来，做多工具 Agent。
- **对应文档：**
  - `/tech-system/ai/multimodal-kg`  
  - `/tech-system/ai/phase3-multimodal-kg`

### 第 4 阶段（可选）：部署成“给别人用”的小服务

- **用时建议**：按兴趣慢慢来，完全可选。  
- **核心目标：**
  - 把你做好的 Agent / 学习助手，用 Docker + 简单部署方式放到公网或内网。  
  - 会画一张简易架构图，方便写进简历或在面试里讲。
- **对应文档：**
  - `/tech-system/ai/mlops-platform`  
  - `/tech-system/ai/phase4-mlops-platform`

> 总结一句：**先 LLM → 再单工具 Agent → 再 MVP Server → 再 RAG Agent → 最后看部署**。  
> 每一阶段都尽量做出**能服务你现在“面试学习/知识整理”主线的 Agent 小工具**，这样学 AI 不会和你当前求职目标脱节。

---

## 🎯 模块定位：和技术库分开的原因

- **技术库**：更多是 Java / 数据库 / Redis / 框架 等传统知识点，偏“面试 & 基础能力”。  
- **AI 模块**：专门围绕 **LLM / Agent / RAG / 部署 & MLOps**，规划「从普通开发 → 能上手 AI 工程与产品」的路线。

以后和 AI 有关的新内容（如：本地大模型部署、Agent 实战、知识库问答项目等），统一放在这个模块下，方便单独规划与回顾。

---

## 🔗 关联模块

- 技术体系总览：`/tech-system/`  
- 开源项目中的 AI & 大模型实践：`/open-source/ai-projects`、`/open-source/llm-projects`

