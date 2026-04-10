# 第四阶段（可选）：部署 & MLOps 规划【从 Demo 走向“小产品”】

> 这一篇更多是“有余力再看”的阶段规划：**当你想把自己的 AI 工具变成真正线上可用的小产品时，需要了解些什么？**

---

## 1. 适合哪些学习目的？

- **目的 A：只想提效 / 做学习助手**
  - 可以先不看这一阶段；顶多把自己的工具部署在本机即可。

- **目的 B：想做稳定可用的小产品 / 兼职项目**
  - 很值得投入一点时间：至少要学会 Docker 打包 + 简单部署。

- **目的 C：有意往“平台 / 基础设施 / AI 工程”方向发展**
  - 这一阶段是你的必经之路，后续可以深入到 K8s、灰度发布、监控告警等。

对你当前来说，如果未来有“做个小 SaaS / 工具网站”的想法，可以把这里当作 **中期目标**。

---

## 2. 能力拆解：从“能跑”到“好用”

可以按三个层次来规划：

1. **能跑起来（本地环境）**
   - 会用命令行启动你的 LLM/Agent 服务和 MVP Server。
   - 能在浏览器或 Postman 调试接口。
2. **能部署（单机 / 云服务器）**
   - 会写一个简单的 `Dockerfile`，把服务打成镜像。
   - 会在一台云服务器上用 Docker 跑起来，对外暴露端口。
3. **能维护（基础运维能力）**
   - 有简单日志记录，能查问题。  
   - 知道如何重启服务、回滚版本。  

> 对你现在来说，专注第 1、2 层就已经很有价值。

---

## 3. 本地大模型部署实战（以 Qwen 为例）

> 这一小节帮你回答一个非常具体的问题：**如果我想在自己电脑上跑一个大模型（例如 Qwen2.5 / Qwen-Coder），用于开发和小产品验证，应该怎么选方案？**

### 3.1 常见的 5 种本地部署方式概览

可以简单按“难度 + 场景”来记住这 5 种方式：

- **Ollama**：上手最简单，本地跑模型 + 提供简单 API，适合**个人开发 / 日常使用**。  
- **vLLM**：高性能推理引擎，OpenAI 兼容 API，适合**做 AI 服务 / 产品后端**。  
- **Transformers（Hugging Face）**：Python 直接加载模型，适合**做算法实验 / 自定义逻辑 / 微调**。  
- **LM Studio**：桌面 GUI，像 ChatGPT 一样本地聊天，适合**纯聊天 / 体验模型**。  
- **LocalAI（Docker）**：通过 Docker 跑 OpenAI 兼容服务，适合**自建 AI API 平台**。

下面重点只讲**最实用、你现在最容易用起来的几种**。

### 3.2 90% 人适合的起点：Ollama + Qwen2.5

**场景：** 在本机先把模型跑起来，给自己的小工具 / Agent / 测试环境用。  

1. **安装 Ollama**  
   - 直接去官网下载安装：`https://ollama.com`（支持 Windows / Mac / Linux）。  
2. **一行命令拉起 Qwen2.5**：

```bash
ollama run qwen2.5
# 或者指定小一点的模型
ollama run qwen2.5:7b
```

3. **通过 API 调用（默认端口 11434）**：

```bash
curl http://localhost:11434/api/generate \
  -d '{
    "model": "qwen2.5",
    "prompt": "帮我用 3 点总结 ACID 事务特性"
  }'
```

**特点小结：**

- 安装最简单，自动下载模型。  
- 自带本地 API，很适合做**本地 Agent / CLI 工具 / 浏览器插件后端**。  
- 模型选择多（Qwen / LLaMA / DeepSeek 等），后面想换模型成本也很低。

> 结合前面几篇文章，你可以把结构想象成：  
> `你的应用 / Agent → 调用 Ollama API → Qwen2.5 模型`。

### 3.3 要做服务/产品时：vLLM + Qwen

**场景：** 你要做的是**面向多用户的 API 服务**，需要更高吞吐、OpenAI 兼容接口，方便和现有 SDK 对接。  

1. 安装 vLLM：

```bash
pip install vllm
```

2. 启动一个 OpenAI 兼容的 API Server（以 Qwen2.5-7B-Instruct 为例）：

```bash
python -m vllm.entrypoints.openai.api_server \
  --model Qwen/Qwen2.5-7B-Instruct
```

3. 之后你就可以像用 OpenAI 一样，调用 `/v1/chat/completions`：

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen2.5-7B-Instruct",
    "messages": [
      {"role": "user", "content": "用面试官口吻解释一下数据库事务隔离级别"}
    ]
  }'
```

**特点小结：**

- 高吞吐、高并发，对 GPU 资源利用更好。  
- 完整的 OpenAI 兼容接口，很适合和现有 SDK / 前端组件对接。  
- 更适合作为**AI 产品后端的推理引擎**。

> 典型结构可以是：`前端 / 用户 → FastAPI / Spring Boot → vLLM → Qwen`。

### 3.4 Python 里直接玩模型：Transformers

**场景：** 你要在 Python 里做实验、写脚本、或者尝试简单微调。  

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "Qwen/Qwen2.5-7B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)
```

**优点**：最灵活，几乎所有细节都能自己控制，可以对接训练/微调流程。  
**缺点**：对显存和配置要求高，工程封装要自己做，**不太适合直接拿来做线上服务**。

### 3.5 只想像 ChatGPT 一样聊天：LM Studio

如果你只是想在本机**体验不同模型、像聊天软件一样使用**，可以用 LM Studio：

- 提供 GUI，支持下载/管理各种开源模型（包括 Qwen）。  
- 支持本地聊天，也可以暴露一个简易的 OpenAI 兼容 API。  
- 不太适合作为正式的服务后端，更适合**学习和日常使用**。

### 3.6 用 Docker 搭 OpenAI 兼容服务：LocalAI

如果你偏向容器化部署，又希望**一套 Docker 就能把 OpenAI 兼容 API 跑起来**，可以考虑 LocalAI：

```bash
docker run -p 8080:8080 localai/localai
```

- 支持 GGUF 等格式的模型，可以挂载你下载好的 Qwen / LLaMA / Mistral 等模型。  
- 提供 OpenAI 风格的接口，方便和现有代码对接。  
- 更适合**自建 AI API 平台**或在服务器上统一管理多个模型。

### 3.7 按你当前路线的推荐组合

结合你现在的目标（**普通开发 → AI 开发 + 做一点产品**），可以优先这样选：

- **本地开发 / 学习阶段：**
  - `Ollama + Qwen2.5 (或 Qwen2.5-Coder)`  
  - 如果想要一个好看的 Web 界面，可以加一个 `Open WebUI`，结构大致是：  
    - `前端（Open WebUI / 自己的小页面）→ Ollama API → Qwen2.5`
- **做产品 / 服务验证阶段：**
  - `vLLM + Qwen + FastAPI/Spring Boot + Docker`  
  - 结构可以是：  
    - `前端 / 第三方调用方 → 你的 Web 服务（FastAPI / Spring Boot）→ vLLM → Qwen`

### 3.8 设备配置一般时怎么选模型？

如果你的机器内存/显存比较紧张（例如 8GB 内存 / 没有独立显卡），可以先从**小参数量模型**开始：

- `qwen2.5:1.5b`  
- `qwen2.5:3b`

在 Ollama 中运行示例：

```bash
ollama run qwen2.5:3b
```

> 小模型虽然能力弱一些，但对于“练习 Prompt、理解架构、做本地工具 DEMO”已经足够。  
> 后续有更好设备时，再平滑切换到更大的 Qwen2.5/DeepSeek 等模型即可。

---

## 4. 建议的学习路线（按功能而不是按工具）

### 3.1 打包：把服务装进 Docker（2～4 天）

- 学习内容：
  - Docker 基本概念：镜像 / 容器 / 仓库。  
  - 针对你选的服务栈（例如 Java Spring Boot），写一个最简 `Dockerfile`：
    - 包含：构建/复制 jar / 暴露端口 / 启动命令。
- 实践建议：
  - 把你前面做的一个项目（比如“面试学习 Agent”或“投资助手”）打成镜像。
  - 在本机用 `docker run` 启动，确认功能正常。

### 3.2 部署：放到云上跑（2～5 天）

- 选择一个便宜/方便的云服务（轻量应用服务器、或者提供容器托管的平台）。
- 步骤：
  1. 把镜像推到某个镜像仓库（或在服务器上直接构建）。  
  2. 在云服务器上用 Docker 启动容器。  
  3. 做简单的安全设置：改端口、加基础认证（如果需要），或者通过反向代理（如 Nginx）暴露。  

> 目标不是做成大型生产系统，而是**让你第一次体验“别人也可以访问你做的 AI 工具”**。

### 3.3 监控 & 日志（可选 + 按需）

- 最基本的：
  - 为每个请求记录：时间、路径、耗时、错误信息。
  - 出问题时，能通过日志快速看出大概位置。
- 有余力时可以：
  - 接入简单的监控系统（如 Prometheus + Grafana 或云厂商的监控）。  
  - 观察 QPS、错误率、延迟，调整线程池/超时/限流策略。

---

## 5. 结合前面各阶段的整体规划建议

你可以把这一篇看作**前面 3 个阶段的“封顶”动作**：

1. **LLM + Agent 阶段**：你有了一个真正能帮你干活的 AI 工具（比如面试助手 / 投资助手）。  
2. **MVP Server 阶段**：你让工具吃到的是“自己整理过的数据”，而不是网上乱抓。  
3. **多模态 / 知识库阶段**：你增强了工具的检索与理解能力。  
4. **部署 & MLOps 阶段**：你给它一个“稳定运行的家”，从此它不只是你电脑上的小脚本，而是一个可以长期使用的小服务。

对你来说，一个非常自然的目标可以是：

- **做一个“我的面试学习助手”网站**：
  - 后端：整合你的 VitePress 文档 + 向量检索 + LLM。  
  - 前端：一个简单的网页，可以选择模块（Java/数据库/Redis…）、输入问题。  
  - 部署：用 Docker 放到云上，随时可以访问。

当你做到这一步时，你已经不只是“会用 AI 的开发者”，而是真正拥有一套 **“从知识 → 工具 → 产品”** 的闭环能力了。  

