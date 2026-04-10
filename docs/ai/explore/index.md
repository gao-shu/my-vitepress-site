# AI 热门软件与开源项目地图

> **定位**：用一张「分类地图」快速了解当下常见的 AI 应用、工具与开源项目——适合 **选型参考、按需学习、面试闲聊素材**，不等同于官方排行榜。  
> **和维护关系**：仓库迭代快，请以各项目官网 / Release 为准；本文只描述**典型用途**与**学习优先级**。

---

## 这张地图怎么读？

| 你的目标 | 建议优先看 |
|---------|-----------|
| 先把大模型用顺、提效开发 | [对话与编程辅助](#一对话与编程辅助商用--开源)、本地轻量 [本地推理](#二本地推理与管理终端侧体验) |
| 做 Agent / 自动化工作流 | [Agent 与可视化编排](#三agent--工作流编排)、[RAG 与知识库](#四rag--记忆--知识库) |
| 自己部署模型、省 API 钱 | [推理与服务化](#五训练推理与服务化-gpu--工程向)、[部署专题](/ai/model-deploy/) |
| 多模态 / AIGC 玩图与视频 | [多模态与创意管线](#六多模态与-aigc-管线) |
| 了解「业界在造什么轮子」 | 全文扫一遍，把感兴趣的 **Star + 读 README** |

---

## 一、对话与编程辅助（商用 + 开源）

面向**日常提问、写代码、改文档**：闭源产品体验通常更省心；开源类适合**自建、二次开发、学习协议与插件**。

| 名称 | 形态 | 适合谁 | 一句话 | 入口 |
|------|------|--------|--------|------|
| ChatGPT / Copilot（微软） | 商用订阅 | 全栈、办公提效 | 生态全、插件多，适合「先习惯 AI 结对编程」 | 官网各产品线 |
| Claude | 商用 API / 网页 | 长文本、复杂推理 | 长上下文与说明书类任务口碑好 | Anthropic |
| Cursor | 商用 IDE | 前端/全栈 | 「AI 原生编辑器」代表，适合重度编码 | cursor.com |
| Continue | 开源插件 | 想用 VS Code / JetBrains + 自建模型 | 可对接本地/Ollama/云端，适合练「工具链组装」 | GitHub: continue-dev/continue |
| GitHub Copilot | 商用 | 已在 Git GitHub 生态内 | 与 PR、Issue、Copilot Chat 一体 | GitHub |
| 通义灵码 / 豆包 / Kimi 等 | 国产商用 | 国内网络与合规 | 中文场景与文档检索往往更顺手 | 各厂商官网 |

**学习建议**：至少熟练 **1 个闭源对话** + **1 个编辑器内助手**；有折腾精神再装 **Continue + 本地模型**。

---

## 二、本地推理与管理（终端侧体验）

在**本机或内网**跑小模型：隐私、离线、省 token；代价是机器配置与工程排错。

| 名称 | 类型 | 适合谁 | 一句话 | 入口 |
|------|------|--------|--------|------|
| Ollama | 本地模型拉起 + CLI | 入门本地推理首选 | `pull / run` 一条龙，和 Continue、Dify 等常联动 | ollama.com |
| llama.cpp | C/C++ 推理引擎 | 要极致压缩与嵌入式 | 各类「.gguf」与边缘部署常见底座 | ggerganov/llama.cpp |
| LM Studio | 桌面 GUI | 不想敲命令 | 可视化下载与聊天，适合非研发体验 | lmstudio.ai |
| llamafile | 单文件分发 | 演示与传播 | 把权重+运行时打成一个文件，便于分享 | Mozilla Ocho 系 |
| GPT4All | 桌面 + 本地 RAG | 轻量知识库试验 | 自带简单文档检索玩法的入门套件 | nomic-ai/gpt4all |

与站内 [模型部署专题](/ai/model-deploy/) 的关系：**本表偏「客户端/工具」**；**vLLM、TGI** 等偏服务端，见下一节。

---

## 三、Agent / 工作流编排

让模型**多步调用工具、走状态机、接业务 API**：从库到产品的分水岭。

| 名称 | 类型 | 适合谁 | 一句话 | 入口 |
|------|------|--------|--------|------|
| LangChain | Python/JS 生态框架 | 快速原型 | 组件多、示例多；需自己把控复杂度 | langchain-ai/langchain |
| LangGraph | 图状态机 | 要可控流程与重试 | 适合「多节点 Agent + 条件分支」 | langchain-ai/langgraph |
| AutoGen / Semantic Kernel 等 | 多 Agent 协作 | .NET / Python 团队 | 微软系与其它多角色对话实验 | 各官方仓库 |
| Dify | 开源 LLMOps 平台 | 低代码搭 Bot + 知识库 | 私有化、工作流、RAG 一套常有 | langgenius/dify |
| FastGPT | 开源应用编排 | 国内私有化常见 | 偏「应用 + 知识库」快速交付 | labring/FastGPT |
| n8n | 工作流自动化 | 运营 + 研发胶水 | 节点丰富，接 HTTP/Webhook，再挂 AI 节点即可 | n8n-io/n8n |
| Coze / 扣子 等 | 平台型 | 快速验证 | 平台与开源「Bot 引擎」可对照学**工作流建模** | 各官方 |

**学习建议**：跟着本站 [Agent 模块](/ai/stage-2-agent/) 先写「**单 Agent + 单工具**」，再挑 **Dify 或 LangGraph** 二选一深入。

---

## 四、RAG / 记忆 / 知识库

解决 **「模型瞎编」与「读你的文档」**：向量库、重排、索引管线是后端面试高频词。

| 名称 | 类型 | 适合谁 | 一句话 | 入口 |
|------|------|--------|--------|------|
| LlamaIndex | Python 数据框架 | 做严肃 RAG | 连接器与索引抽象全，适合与现有数据源对接 | run-llama/llama_index |
| LangChain / LCEL | 编排 + 向量存储抽象 | 已在 LC 生态 | Retrieval Chain 模板多 | 同上 LangChain |
| Milvus / Qdrant / Weaviate 等 | 向量数据库 | 工程化部署 | 选型见业务规模与运维能力 | 各官方 |
| AnythingLLM | 本地知识库 GUI | 想先要「能用的知识库」 | 文档拖入 + 对话，适合演示 | Mintplex-Labs/anything-llm |
| Mem0 | 记忆层 | 多轮对话要「记住用户」 | 把记忆当组件接进 Agent | mem0ai/mem0 |

---

## 五、训练、推理与服务化（GPU / 工程向）

偏**机房与云平台**：与服务端 Java/Go/Python 同事协作时会遇到。

| 名称 | 类型 | 适合谁 | 一句话 | 入口 |
|------|------|--------|--------|------|
| vLLM | 高吞吐推理服务 | 生产 API | PagedAttention，适合多并发 | vllm-project/vllm |
| Text Generation Inference (TGI) | Hugging Face 推理栈 | HF 生态 | 与 HF 模型仓库衔接顺 | huggingface/text-generation-inference |
| llama.cpp HTTP Server | 轻量服务 | 小团队 | 资源占用相对可控 | llama.cpp 子项目 |
| Hugging Face Transformers / PEFT | 训练与微调库 | 算法向 | LoRA/QLoRA 等常见微调入口 | huggingface |
| Axolotl / Unsloth | 微调工具包 | 真要训小模型 | 封装训练配置，降低踩坑成本 | 各官方仓库 |
| Open WebUI | 自托管 Chat UI | 内网统一入口 | 常和 Ollama 组合出现 | open-webui/open-webui |

更系统的选型可对照：[推理框架对比（2026）](/ai/model-deploy/04-runtime-compare)。

---

## 六、多模态与 AIGC 管线

文生图、图生图、工作流节点**拖拽**：视觉向与创意运营常用。

| 名称 | 类型 | 适合谁 | 一句话 | 入口 |
|------|------|--------|--------|------|
| ComfyUI | 节点式工作流 | 深度玩 SD 生态 | 可复现管线、社区节点极多 | comfyanonymous/ComfyUI |
| Stable Diffusion WebUI (A1111) | Web 控制台 | 经典入门 | 插件多、资料多 | AUTOMATIC1111/stable-diffusion-webui |
| InvokeAI | 工具链 | 偏产品化体验 | 兼顾 CLI 与 UI | invoke-ai/InvokeAI |

---

## 七、评测、安全与可观测（进阶）

做产品或企业落地时，迟早要回答：**「模型好不好」**与**「哪里会出事」**。

| 名称 | 类型 | 适合谁 | 一句话 | 入口 |
|------|------|--------|--------|------|
| OpenCompass 等 | 评测框架 | 要比榜单、比版本 | 统一跑基准，适合发版前回归 | open-compass/opencompass |
| LangSmith / Phoenix 等 | Trace / 调试 | Agent 排障 | 看调用链、延迟与 Token | 各云服务或开源 |
| 安全与红队工具（概念） | Policy / Guardrail | 企业合规 | 输入输出过滤、提示注入防护需单独设计 | 按需检索最新项目 |

---

## 使用本模块的姿势（防劝退）

1. **先选一个闭环**：例如「Ollama + Open WebUI」或「Dify + 一份业务文档」，跑通比收藏重要。  
2. **再和本站阶段路线对齐**：[/ai/](/ai/) 里从 LLM → Agent → MVP Server 递进。  
3. **每季度扫一眼 Release**：热门项目的 breaking change 多，面试吹「我看过源码」前记得真的 clone 过一次。

---

## 相关站内文档

- [AI 探索总览](/ai/)
- [Agent 循序渐进](/ai/stage-2-agent/)
- [大模型部署及使用](/ai/model-deploy/)
- [技术体系 · LLM 基础（长文地图）](/tech-system/ai/llm-basics)
