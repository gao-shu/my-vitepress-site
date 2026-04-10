# 05 串联 Agent：先取 context，再生成答案

> 目标：让你的 Agent 不再直接读文件，而是先调中台 `/context`，再把结构化数据交给 LLM。

## 1）调用流程（固定）

1. 用户输入：模块名/问题
2. Agent 调用：`GET /context?module=xxx`
3. Agent 把返回片段拼成 Prompt 上下文
4. Agent 调用 LLM 生成题库/答案
5. Agent 写回 Markdown

## 2）你立刻能得到的收益

- 上下文更干净（减少无关内容）
- 输出更稳定（Prompt 不用贴整篇文档）
- 方便扩展（以后把数据源从 docs 换成 DB/API 也不影响 Agent）

