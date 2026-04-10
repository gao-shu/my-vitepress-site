# 02 Function Calling：让模型输出可执行参数

> 目标：让模型从“输出一段话”升级成“输出结构化参数 → 你可以直接执行”。

## 1）为什么需要 Function Calling？

- 纯自然语言很难稳定解析（会夹杂解释、格式漂移）
- 结构化输出便于：
  - 权限控制
  - 日志审计
  - 错误重试
  - 多步任务编排

## 2）最小实现思路（不绑定框架）

你提供一组“可调用函数/工具”，例如：

- `read_markdown(path)`
- `write_markdown(path, content)`
- `list_docs(dir)`

