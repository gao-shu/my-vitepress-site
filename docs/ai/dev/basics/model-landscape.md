# 主流大模型厂商一览

> **维护约定**：日常优先改「最新产品」（写 2～3 个核心型号即可）；系列名 / 类型 / 开源策略变了再改对应列。选型细节见 [模型选择指南](/ai/explore/model-selection)。Agent 产品见 [主流 Agent 厂商一览](./agent-landscape)。

一页地图：先认厂、认开源策略、认模态；具体怎么选环境与场景，去选型文。

| 厂商 | 代表产品（系列） | 最新产品 | 是否开源 | 类型 | 官网 |
|------|------------------|----------|----------|------|------|
| OpenAI | GPT、o 系列、GPT Image、Sora | GPT-6 Astra · GPT-5.6 · Sora | 闭源 | 文本 · 图片 · 视频 · 语音 | [openai.com](https://openai.com) · [API](https://platform.openai.com) |
| Anthropic | Claude 系列 | Claude Fable 5.1 · Claude Sonnet 5 · Claude Opus | 闭源 | 文本（含看图） | [anthropic.com](https://www.anthropic.com) · [claude.ai](https://claude.ai) |
| Google | Gemini、Imagen、Veo | Gemini 3.8 Flash · Gemini 3.x Pro · Veo | 混合（Gemma 等开源） | 文本 · 图片 · 视频 · 语音 | [Gemini](https://deepmind.google/models/gemini/) · [AI Studio](https://aistudio.google.com) |
| DeepSeek | DeepSeek-V / R 系列 | DeepSeek-V4.1 Flash · DeepSeek-V4 · DeepSeek-R1 | 混合 | 文本 | [deepseek.com](https://www.deepseek.com) · [平台](https://platform.deepseek.com) |
| 阿里（通义） | Qwen、通义万相 | Qwen3.8-Max · Qwen3.8-Flash · 通义万相 | 混合 | 文本 · 图片 · 视频 · 语音 | [qwen.ai](https://qwen.ai) · [百炼](https://bailian.console.aliyun.com) |
| Meta | Llama 系列 | Llama 4 Maverick · Llama 4 Scout · Llama 3.3 | 开源 | 文本 · 图片 · 语音 | [llama.com](https://www.llama.com) |
| 智谱 | GLM、CogView、CogVideo | GLM-5.3 · CogView · CogVideoX | 混合 | 文本 · 图片 · 视频 | [zhipuai.cn](https://www.zhipuai.cn) · [开放平台](https://open.bigmodel.cn) |
| Mistral | Mistral / Mixtral | Mistral Large · Mistral Small · Codestral | 混合 | 文本 | [mistral.ai](https://mistral.ai) |
| xAI | Grok 系列 | Grok 4 · Grok 3 · Aurora（图） | 闭源 | 文本 · 图片 | [x.ai](https://x.ai) |
| 月之暗面 | Kimi 系列 | Kimi K3 · Kimi 长上下文 · Kimi 探索版 | 混合 | 文本 · 图片 | [moonshot.cn](https://www.moonshot.cn) · [平台](https://platform.moonshot.cn) |
| 字节 | 豆包 / Seed | Doubao-Seed · 豆包视觉 · 即梦（图/视频） | 闭源 | 文本 · 图片 · 视频 · 语音 | [豆包](https://www.doubao.com) · [火山](https://www.volcengine.com) |
| Midjourney | Midjourney | Midjourney V7 · V6.1 · Niji | 闭源 | 图片 | [midjourney.com](https://www.midjourney.com) |
| Stability | Stable Diffusion 等 | SD3.5 · Stable Image · Stable Video | 开源 | 图片 · 视频 | [stability.ai](https://stability.ai) |
| Runway | Gen 系列 | Gen-4 · Gen-3 Alpha · Act-One | 闭源 | 视频 · 图片 | [runwayml.com](https://runwayml.com) |

**是否开源**：`开源` = 可下载权重本地部署；`闭源` = 仅网页 / API；`混合` = 既有云端闭源型号，也有开源权重。

**类型**：按该厂当前主推能力勾选；「文本」含对话 / 代码 / 推理，「看图」算多模态理解，不等于会「生图」。

**最新产品**：每家写 **2～3 个**当下核心型号（旗舰 / 性价比 / 特色模态），迭代时只改这一列。

---

## 怎么用这张表

1. 先看任务要不要本地：要 → 优先看「开源 / 混合」里有权重的厂。  
2. 只要 API、求稳：OpenAI / Anthropic / Google / 国内云（通义、智谱、豆包、DeepSeek）都行。  
3. 要图 / 视频：看「类型」列，别用纯文本模型硬扛。  
4. 定环境与场景后，再看 [模型选择指南](/ai/explore/model-selection)。
