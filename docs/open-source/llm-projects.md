# 大语言模型项目

本页面精选了大语言模型(LLM)相关的开源项目，包括模型、工具、应用框架等。

## 开源大语言模型

### 基础模型
- **Llama**：Meta开源大语言模型系列
  - GitHub: [https://github.com/facebookresearch/llama](https://github.com/facebookresearch/llama)
  - 特点: 指令微调、多任务学习
  - 版本: Llama 2, Llama 3

- **GPT-J**：EleutherAI开源GPT模型
  - GitHub: [https://github.com/kingoflolz/mesh-transformer-jax](https://github.com/kingoflolz/mesh-transformer-jax)
  - 特点: 6B参数、开源替代

- **BLOOM**：BigScience多语言大模型
  - GitHub: [https://github.com/bigscience-workshop/bloom](https://github.com/bigscience-workshop/bloom)
  - 特点: 176种语言、分布式训练

- **Falcon**：TII开源大模型
  - GitHub: [https://github.com/tiiuae/falcon](https://github.com/tiiuae/falcon)
  - 特点: 高性能、商业友好许可

### 中文模型
- **ChatGLM**：智谱AI对话模型
  - GitHub: [https://github.com/THUDM/ChatGLM-6B](https://github.com/THUDM/ChatGLM-6B)
  - 特点: 中文优化、轻量级

- **Baichuan**：百川智能大模型
  - GitHub: [https://github.com/baichuan-inc/Baichuan-7B](https://github.com/baichuan-inc/Baichuan-7B)
  - 特点: 商业级、开源可用

- **Qwen**：阿里通义千问
  - GitHub: [https://github.com/QwenLM/Qwen](https://github.com/QwenLM/Qwen)
  - 特点: 多语言、工具调用

### 代码模型
- **Code Llama**：Meta代码生成模型
  - GitHub: [https://github.com/facebookresearch/codellama](https://github.com/facebookresearch/codellama)
  - 功能: 代码生成、解释、调试

- **StarCoder**：BigCode代码模型
  - GitHub: [https://github.com/bigcode-project/starcoder](https://github.com/bigcode-project/starcoder)
  - 特点: 多语言代码、80+编程语言

## 模型平台与工具

### Hugging Face 生态
- **Transformers**：模型库和工具
  - GitHub: [https://github.com/huggingface/transformers](https://github.com/huggingface/transformers)
  - 功能: 60,000+预训练模型

- **Datasets**：数据集处理库
  - GitHub: [https://github.com/huggingface/datasets](https://github.com/huggingface/datasets)
  - 功能: 数据加载、处理

- **Accelerate**：分布式训练库
  - GitHub: [https://github.com/huggingface/accelerate](https://github.com/huggingface/accelerate)
  - 功能: 简化分布式训练

### ModelScope
- **ModelScope**：阿里模型平台
  - GitHub: [https://github.com/modelscope/modelscope](https://github.com/modelscope/modelscope)
  - 功能: 中文模型、工具链

- **Swift**：ModelScope微调工具
  - GitHub: [https://github.com/modelscope/swift](https://github.com/modelscope/swift)
  - 功能: 高效微调、量化

## LLM应用框架

### LangChain 生态
- **LangChain**：LLM应用开发框架
  - GitHub: [https://github.com/langchain-ai/langchain](https://github.com/langchain-ai/langchain)
  - 功能: 链式调用、记忆、代理

- **LangChain.js**：JavaScript版本
  - GitHub: [https://github.com/langchain-ai/langchainjs](https://github.com/langchain-ai/langchainjs)
  - 功能: Node.js/Web LLM应用

- **LangServe**：LangChain服务部署
  - GitHub: [https://github.com/langchain-ai/langserve](https://github.com/langchain-ai/langserve)
  - 功能: API服务、流式响应

### LlamaIndex
- **LlamaIndex**：LLM数据框架
  - GitHub: [https://github.com/run-llama/llama_index](https://github.com/run-llama/llama_index)
  - 功能: RAG、数据索引、检索

- **LlamaParse**：文档解析工具
  - GitHub: [https://github.com/run-llama/llama_parse](https://github.com/run-llama/llama_parse)
  - 功能: 复杂文档解析

### 其他框架
- **AutoGen**：微软多代理框架
  - GitHub: [https://github.com/microsoft/autogen](https://github.com/microsoft/autogen)
  - 功能: 代理对话、任务解决

- **CrewAI**：多代理协作框架
  - GitHub: [https://github.com/joaomdmoura/crewai](https://github.com/joaomdmoura/crewai)
  - 功能: 角色扮演、任务分配

## 微调与训练工具

### 微调框架
- **PEFT**：参数高效微调
  - GitHub: [https://github.com/huggingface/peft](https://github.com/huggingface/peft)
  - 功能: LoRA、Prefix Tuning

- **Axolotl**：LLM微调工具
  - GitHub: [https://github.com/OpenAccess-AI-Collective/axolotl](https://github.com/OpenAccess-AI-Collective/axolotl)
  - 功能: 多种微调方法

### 训练优化
- **DeepSpeed**：微软深度学习优化库
  - GitHub: [https://github.com/microsoft/DeepSpeed](https://github.com/microsoft/DeepSpeed)
  - 功能: 大模型训练优化

- **Megatron-LM**：NVIDIA大模型训练
  - GitHub: [https://github.com/NVIDIA/Megatron-LM](https://github.com/NVIDIA/Megatron-LM)
  - 功能: 分布式训练

## 模型量化与压缩

- **GPTQ**：模型量化
  - GitHub: [https://github.com/IST-DASLab/gptq](https://github.com/IST-DASLab/gptq)
  - 功能: 4-bit量化、推理加速

- **AWQ**：激活感知量化
  - GitHub: [https://github.com/mit-han-lab/llm-awq](https://github.com/mit-han-lab/llm-awq)
  - 功能: 高精度量化

- **AutoGPTQ**：自动量化工具
  - GitHub: [https://github.com/PanQiWei/AutoGPTQ](https://github.com/PanQiWei/AutoGPTQ)
  - 功能: 一键量化

## 推理与部署

### 推理引擎
- **vLLM**：高性能LLM推理
  - GitHub: [https://github.com/vllm-project/vllm](https://github.com/vllm-project/vllm)
  - 功能: 连续批处理、PagedAttention

- **TGI (Text Generation Inference)**：Hugging Face推理服务
  - GitHub: [https://github.com/huggingface/text-generation-inference](https://github.com/huggingface/text-generation-inference)
  - 功能: 优化的推理服务

- **Ollama**：本地LLM运行
  - GitHub: [https://github.com/jmorganca/ollama](https://github.com/jmorganca/ollama)
  - 功能: 本地模型管理

### 部署工具
- **LMDeploy**：LLM部署工具
  - GitHub: [https://github.com/InternLM/lmdeploy](https://github.com/InternLM/lmdeploy)
  - 功能: 量化部署、推理加速

- **TensorRT-LLM**：NVIDIA推理优化
  - GitHub: [https://github.com/NVIDIA/TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM)
  - 功能: GPU推理优化

## 评估与基准测试

- **Open LLM Leaderboard**：模型评估平台
  - GitHub: [https://github.com/open-llm-leaderboard/open-llm-leaderboard](https://github.com/open-llm-leaderboard/open-llm-leaderboard)
  - 功能: 自动化评估

- **LM Evaluation Harness**：EleutherAI评估工具
  - GitHub: [https://github.com/EleutherAI/lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness)
  - 功能: 标准基准测试

## 应用与Demo

### 聊天界面
- **Chatbot UI**：开源聊天界面
  - GitHub: [https://github.com/mckaywrigley/chatbot-ui](https://github.com/mckaywrigley/chatbot-ui)
  - 功能: 美观界面、多模型支持

- **PrivateGPT**：本地文档问答
  - GitHub: [https://github.com/imartinez/privateGPT](https://github.com/imartinez/privateGPT)
  - 功能: 隐私保护、离线使用

### 开发工具
- **Continue**：VS Code AI编程助手
  - GitHub: [https://github.com/continuedev/continue](https://github.com/continuedev/continue)
  - 功能: 代码生成、解释

- **GitHub Copilot Alternative**：开源代码助手
  - GitHub: [https://github.com/BloopAI/bloop](https://github.com/BloopAI/bloop)
  - 功能: 本地代码搜索

## 数据集与资源

- **OpenWebText**：开源文本数据集
  - GitHub: [https://github.com/jcpeterson/openwebtext](https://github.com/jcpeterson/openwebtext)
  - 功能: 训练数据

- **C4**：Common Crawl数据集
  - GitHub: [https://github.com/google-research-datasets/c4](https://github.com/google-research-datasets/c4)
  - 功能: 大规模文本数据

## 安全与对齐

- **OpenAI Moderation**：内容审核
  - GitHub: [https://github.com/openai/moderation-api](https://github.com/openai/moderation-api)
  - 功能: 安全过滤

- **Constitutional AI**：Anthropic对齐方法
  - GitHub: [https://github.com/anthropics/constitutional-ai](https://github.com/anthropics/constitutional-ai)
  - 功能: AI安全对齐