# 阶段二：Agent 与工具调用（模块导航）

> 目标：让模型“能干活”——会做 **单 Agent + 单工具** 的最小闭环，再进阶到多步任务与可靠性。

## 学习顺序（照着做）

1. [01-Agent 是什么：LLM + Tools + 循环](./01-agent-overview)
2. [02-Function Calling：让模型输出可执行参数](./02-function-calling)
3. [03-做一个工具：读写 Markdown（本地知识库）](./03-tool-readwrite-markdown)
4. [04-最小闭环：面试题生成 Agent（读 → 生成 → 写）](./04-mini-agent-interview-qa)
5. [05-多步任务与可靠性：重试、超时、日志、幂等](./05-reliability)
6. [Checklist：这一阶段合格线](./checklist)

## 你学完应该能做到

- 能解释清楚 System/User Prompt、Tools、Function Calling 的关系。
- 能做一个“读写文件/调 HTTP 接口”的工具，并让模型结构化调用。
- 能做一个可用的 Agent 小工具：输入模块名 → 生成题库 → 写入到 `docs/` 新页面。

