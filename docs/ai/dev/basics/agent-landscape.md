# 主流 Agent 厂商一览

> **维护约定**：国外只盯几家标杆；国内产品名变了改表即可。底层模型见 [主流大模型厂商一览](./model-landscape)；概念见 [Agent 是什么](/ai/dev/agent/agent-overview)。

一页地图：先分清 **Code Agent**（改代码）和 **Worker Agent**（办任务）。国外列标杆，国内列常用可触达产品。

## 国外（标杆）

| 厂商 / 出品方 | 代表产品 | 形态 | 类型 | 是否开源 | 官网 |
|---------------|----------|------|------|----------|------|
| Anysphere | Cursor（Agent / Cloud Agent） | AI IDE · CLI · 云端 | Code | 闭源 | [cursor.com](https://cursor.com) |
| Anthropic | Claude Code | 终端为主 · IDE 协同 | Code | 闭源 | [文档](https://docs.anthropic.com/en/docs/claude-code) · [claude.ai](https://claude.ai) |
| OpenAI | Codex · Operator | 终端/云端改代码 · 浏览器办事 | Code + Worker | 闭源 | [Codex](https://chatgpt.com/codex) · [openai.com](https://openai.com) |
| Cognition | Devin · Windsurf | 云端委托 · AI IDE | Code | 闭源 | [devin.ai](https://devin.ai) · [windsurf.com](https://windsurf.com) |

## 国内

| 厂商 / 出品方 | 代表产品 | 形态 | 类型 | 是否开源 | 官网 |
|---------------|----------|------|------|----------|------|
| 腾讯 | CodeBuddy · WorkBuddy | IDE/插件/CLI · 办公桌面 Agent | Code + Worker | 闭源 | [CodeBuddy](https://www.workbuddy.cn/docs/ide/) · [WorkBuddy](https://cloud.tencent.com.cn/product/workbuddy) |
| 小米 | MiMo Code | 终端 Code Agent（基于 OpenCode） | Code | 开源 | [MiMo Code](https://mimo.mi.com/docs/zh-CN/news/latest/mimocode) · [GitHub](https://github.com/XiaomiMiMo/MiMo-Code) |
| 阿里 | 通义灵码 | IDE 插件 · 企业研发流 | Code | 闭源 | [lingma.aliyun.com](https://lingma.aliyun.com) |
| 字节 | 豆包 / 火山 Agent 能力 | 应用内助手 · 研发与办公 | 混合 | 闭源 | [豆包](https://www.doubao.com) · [火山](https://www.volcengine.com) |
| 月之暗面 | Kimi（含编程 / 长程任务） | 网页 · API | 混合 | 混合 | [moonshot.cn](https://www.moonshot.cn) |
| 智谱 | GLM Coding / ZCode 等 | IDE · API · 编程 Agent | Code | 混合 | [zhipuai.cn](https://www.zhipuai.cn) · [开放平台](https://open.bigmodel.cn) |
| 百度 | 文心 / Comate 等 | IDE · 应用助手 | 混合 | 闭源 | [comate.baidu.com](https://comate.baidu.com) |
| DeepSeek | 模型 API + 各端 Agent 接入 | 多通过 IDE/终端接模型当 Agent 脑 | Code（偏底座） | 混合 | [deepseek.com](https://www.deepseek.com) |

**国内怎么认**：腾讯拆成两条——**CodeBuddy 写代码**，**WorkBuddy 办办公活**（Worker），别混成一个产品。小米 **MiMo Code** 是终端编程 Agent，能拍上「国内 Code」这一栏，但更偏新开源探索，不和 Cursor / Claude Code 当同一成熟度去比。

**类型**：`Code` = 读仓改码跑命令；`Worker` = 浏览器/文件/业务交付；`混合` = 两边都沾。

**形态**：AI IDE / 终端 / 云端委托 / 网页应用——同一厂可多形态并存。

---

## 怎么用

1. 日常写代码 → 国外先看 **Cursor**；要终端深改再看 **Claude Code / Codex**。  
2. 丢任务异步出活 → **Devin**（国外）或国内各厂云端/应用内 Agent。  
3. 办事、点网页 → 国外看 **Operator**；国内优先看各厂应用内助手是否够用。  
4. 选模型底座仍回 [主流大模型厂商一览](./model-landscape)。
