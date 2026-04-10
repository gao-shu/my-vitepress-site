# 阶段二 Checklist：合格线

## 1）概念（必须讲清楚）

- 能讲清楚 System Prompt / User Prompt 区别
- 能讲清楚 Tools 与 Function Calling 的关系
- 能用“LLM 负责想、Tools 负责做”解释 Agent

## 2）能力（必须做到）

- 你实现了两个工具：
  - 读 Markdown
  - 写 Markdown
- 你做出了一个最小 Agent 闭环：
  - 输入模块名 → 读笔记 → 生成题库 → 写回新页面

## 3）工程化（建议做到）

- 超时 + 重试
- 输出模板校验（不合格自动重写）
- 不覆盖写入（幂等/时间戳）

做到这些，你就可以进入 **阶段三：MVP Server / 数据中台**（让 Agent 吃到“更干净、更可控”的数据）。

