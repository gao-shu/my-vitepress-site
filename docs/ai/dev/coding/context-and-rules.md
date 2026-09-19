# Context & Rules

> 一页讲清楚：给 AI 什么信息（Context），约束它怎么改（Rules）。够用即可，不建复杂规范体系。

### 什么时候用？

* AI 不理解项目
* AI 总改错位置
* AI 不遵守项目规范
* 每次都要重复解释项目背景

### 目标

建立可复用的 **Context + Rules**。

> 不是给 AI 塞更多信息，而是给足够且必要的上下文。

核心：

> **Context = 这个项目现在是什么。Rules = 在这个项目里应该怎么做。**

没有 Context，AI 只能猜。  
没有 Rules，AI 容易用「它喜欢的写法」生成你维护不了的代码。

仓库里的正式文件只维护一份：[项目落地包](/ai/dev/coding/project-landing-kit)。  
本页模板只用于**单次任务**贴进对话，不要再另写一套 AGENTS。

执行顺序：

* 新仓：[新项目实战](/ai/ai-programming/cursor-new-project)
* 老仓：[老项目实战](/ai/ai-programming/cursor-legacy-project)
* Skill 何时启用：[Skills](/ai/dev/coding/skills-in-coding)

---

## Context 包含什么

让 AI 理解「当前项目与当前任务」：

* 项目概览（做什么、给谁用）
* 技术栈（语言、框架、关键中间件）
* 模块关系（谁调谁）
* 数据模型（核心表 / 实体）
* API / 调用链（与本次任务相关的）
* 当前任务（要改什么、验收是什么）
* 相关约束（兼容旧接口、不能动公共模块等）

原则：

* 与**本次任务相关**优先，不要一上来贴整仓
* 用事实，不写愿景口号
* 缺信息就写「未知 / 待确认」，不要让 AI 编

---

## Rules 包含什么

让 AI 知道「允许怎么写、禁止怎么写」：

* 架构规则（分层、依赖方向）
* 编码规则（命名、包结构、日志/异常习惯）
* 数据库规则（事务、软删、迁移约定）
* API 规则（错误码、兼容、鉴权）
* 测试规则（什么必须有测、怎么验收）
* **AI 操作边界**（最重要）

AI 操作边界示例：

* 只改与任务相关的文件
* 未经确认不重构
* 不擅自改公共 API / 表结构
* 不确定先问，再改
* 先方案后动手

Rules 应尽量来自**现有代码真实习惯**，不要一次写一本理想手册。

---

## 单次任务 Context（贴进对话，不进仓库）

章节标题固定。示例使用落地包中的工单项目，接到别的项目只改名称和路径。

```text
# Context（本次任务）

## 项目
- 名称：ticket-admin
- 说明文件：AGENTS.md、docs/ai-context/

## 相关模块
- 模块：ticket
- 调用链：TicketController → TicketService → TicketMapper
- 表 / API：biz_ticket；GET /api/tickets

## 当前任务
- 目标：列表增加 status 过滤
- 验收：status=OPEN 只返回 OPEN；不传参数与改前一致
- 明确不做：改 URL、改表、加 Redis

## 约束
- 禁止修改：/api/** 路径、其他模块
- 已知坑：见 docs/ai-context/99-gotchas.md
```

---

## Rules 以落地包为准

仓库里只保留 `.cursor/rules/00-core.mdc`，全文在 [项目落地包](./project-landing-kit) 第 2 节。  
不要在对话里再维护一份「理想规范」。单次任务只在 Prompt 里重复这四条：

```text
范围：只改本次点名的文件
禁止：改 URL、改表、加依赖、改其他模块
顺序：先方案，确认后再改
验收：写出命令或页面步骤
```

---

## 哪些内容应该给 AI

优先给：

* 当前 Diff
* 相关调用链与接口定义
* 验收标准与「不要做什么」
* 报错原文、复现步骤
* 已沉淀的 Context / Rules 摘要

不要指望 AI 自己「读懂整仓业务政治」。

---

## 修改边界（写进 Rules，也写进每次 Prompt）

默认边界：

```text
可以：在指定范围内实现 / 修复 / 补测试草稿
不可以：无关重构、改公共契约、删历史兼容、扩大需求
必须：先分析或先方案（按你当轮要求）→ 再改 → 说明副作用
```

和 [AI Coding 工作流](/ai/dev/coding/cursor-workflow)、[Code Review](/ai/dev/coding/ai-code-review) 同一原则：

> **人定边界与验收，AI 在边界内提速。**

---

## 怎么用（个人开发最小用法）

```text
开任务前：填一版 Context（可很短）
  → 有则附上 Rules；没有就先写「AI 操作边界」四条
  → 实现 / Review / Debug 时把 Context + 边界贴进 Prompt
  → 任务结束后：把踩过的坑补一条进 Rules（有则改，无则先记笔记）
```

不必一上来建企业级规范库。先够用，再在实战里长出来。
