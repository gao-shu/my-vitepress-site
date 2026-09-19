# Cursor 新项目实战

从空仓库到第一个能演示的功能。阶段含义见 [AI Coding 工作流](/ai/dev/coding/cursor-workflow)。文件正文只在 [项目落地包](/ai/dev/coding/project-landing-kit)，本页不另贴一套。

适用：Java / Spring Boot 外包或自研后台，从 0 开始。  
案例：`ticket-admin`。不做：一次生成整套系统。

```text
需求 → 拆解 → 架构 → Context → Rules → Spec
 → 实现 → 测试 → Review → Debug / 回归 → 交付
```

---

## 0. 这次做出什么

客服、值班同事能新建工单、看列表、改状态。  
后端三个接口，表 `biz_ticket`。前端不在这一刀里。

未放入 `AGENTS.md`、`.cursor/rules/00-core.mdc`、`docs/ai-context/00-overview.md` 之前，不要让 AI 写业务代码。Spec 未经人确认，也不要写。

---

## 1. 需求

内部要把工单从口头变成能查的记录：新建、列表、改状态。

这里只回答为什么做。title 是否必填、curl 怎么验，不写在这一节。

**人**决定做不做。**AI**不决定。

---

## 2. 拆解

不要发「帮我把工单功能做出来」。那一句会带上登录、消息、页面。

这一刀只做能一起验收的后端闭环：

* 创建
* 列表
* 状态变更

三个接口同一次做完，不拆成三个项目。前端是下一刀：另写一篇 Spec，不在本篇展开。

拆解是工程决策，不是 Prompt 技巧。

**人**砍到这一刀。**AI**可以列草案，采用哪一刀人定。

---

## 3. 架构

写代码之前定系统边界。AI 可以列选项，人拍板。多出来的用户中心、支付、消息，删掉再往下。

`ticket-admin` 只定这些：

* 一个模块 `ticket`，包 `com.demo.ticket`
* Controller 收参，业务在 Service，数据在 Mapper
* 一张表 `biz_ticket`：id、title、status、created_at
* 三个接口：`POST /api/tickets`、`GET /api/tickets`、`PATCH /api/tickets/{id}/status`
* 状态只允许 OPEN → DOING → DONE，禁止跳步
* 不引入登录、Redis、MQ

字段校验和测试命令不写在这里。

---

## 4. Context

Context 是项目现在是什么，不是这一次的验收。

从 [项目落地包](/ai/dev/coding/project-landing-kit) 复制章节，只改成上面已经定下的事实。概念见 [Context & Rules](/ai/dev/coding/context-and-rules)。

```text
docs/ai-context/
├── 00-overview.md
├── 01-modules.md
└── 99-gotchas.md
```

* `00-overview.md`：内部工单、技术栈、本地怎么启动、本阶段不做登录 / 附件 / 通知 / Redis。不写 title 必填。
* `01-modules.md`：模块边界定了再写。先写职责、表、三个 URL；调用链等代码落地后补。没有内容不要建空文件。
* `99-gotchas.md`：新项目可写一行「暂无」。

**人**确认事实。**AI**可以按架构整理草稿，不能编一套还没有的系统。

---

## 5. Rules / AGENTS

仍从落地包复制，只改项目名和路径。不在这里贴全文。

* `AGENTS.md`：项目卡。是什么项目、技术栈、目录、Spec 放在哪。不是这一次的任务书。
* `.cursor/rules/00-core.mdc`：所有任务都遵守。只改相关文件，不改已发布路径，不加仓库里没有的依赖，不确定就停。

「title 必填」「这一刀不做前端」是 Spec，不要写进 Rules。

---

## 6. Spec

Spec 是这一次的冻结约定。人确认之前，不许改代码。

写入 `docs/ai-context/specs/ticket-apis.md`。有任务再新建这个文件，不预建空目录。骨架只有这四个标题，见落地包，不要再加章节。

```markdown
# 工单三个接口

## 目标
客服能新建工单、看列表、把状态从 OPEN 改到 DOING 再改到 DONE。

## 范围
- 做：POST /api/tickets、GET /api/tickets、PATCH /api/tickets/{id}/status
- 模块：TicketController、TicketService、TicketMapper；表 biz_ticket
- 不做：前端、登录、缓存、MQ、附件、消息通知

## 做到什么
- 创建：title 必填，初始 status=OPEN
- 列表：返回 id、title、status、created_at
- 改状态：只允许 OPEN→DOING→DONE，禁止跳步

## 验收
- mvn -q -DskipTests package 通过
- curl 能创建，列表能看到
- 非法跳转不会成功
```

包名、路径按你改过的 `AGENTS.md` 替换。你要改的是名称和字段，不是这四个标题。

**人**冻结。**AI**可以起草。

---

## 7. 实现

```text
Spec 已确认
 → AI 按 Spec 实现
 → 人看 Diff
 → 再跑验收
```

```text
阅读 docs/ai-context/specs/ticket-apis.md。
只实现该文件「范围」里的后端。
不要做「不做」里的事。
改完列出：改了哪些文件、怎么验收。
```

不要用一句话「帮我实现工单」代替这份 Spec。提问方式见 [Prompt Pattern · 实现](/ai/dev/coding/prompt-pattern#3-实现)。

**人**看 Diff 是否越出 Spec。**AI**写代码。

---

## 8. 测试

对照 Spec 的「验收」，不是看代码像不像能跑。

有单测就跑单测。这一刀没有测试类时，固定走 Spec 里那几条：`mvn -q -DskipTests package`、curl 创建、列表、一次非法跳转。

主路径和 Spec 写明的失败路径都要过。「package 通过」不等于「状态机对了」。

**人**判定过不过。**AI**可以起草命令。见 [Prompt Pattern · 测试](/ai/dev/coding/prompt-pattern#6-测试)。

---

## 9. Review

测试之后看 Diff。AI 初检，人判断。要改就改完再测，不在这里重做架构。

看这几件就够：

* 有没有超出 Spec（前端、登录、Redis）
* 有没有违反 Rules（改路径、加依赖）
* 有没有无关文件
* 创建和列表是否还在
* 有没有明显的质量问题

完整做法在 [AI Code Review](/ai/dev/coding/ai-code-review)。本页不复制 Prompt。

---

## 10. Debug / 回归

测试或 Review 没失败，就跳过。不要为了走流程制造故障。

若 curl 把 OPEN 直接改成 DONE 也成功，按这个收，不要让 AI 重写三个类：

```text
复现：同一条 curl
 → 缩小到状态判断（TicketService）
 → 看 Diff，不看整仓
 → 假设：漏了禁止跳步
 → 只补这一处
 → 再测非法跳转
 → 回归：创建和列表仍可用
```

**人**决定修到哪。**AI**帮着定位。见 [Prompt Pattern · Debug](/ai/dev/coding/prompt-pattern#5-debug)。

老项目还要证明没点名的旧行为没变，不在本篇展开。见 [老项目实战](./cursor-legacy-project)。

---

## 11. 交付

对照 Spec 勾验收，并确认「不做」没有出现在 Diff 里。

```text
[ ] specs/ticket-apis.md 与实际接口一致
[ ] AGENTS.md、00-overview 与真实技术栈一致
[ ] 01-modules 与真实包名、接口一致
[ ] 第 8 节的命令自己跑过
[ ] git diff 里没有前端、登录、Redis、无关模块
[ ] 说得清改了什么、怎么验
```

没有新的 Spec，就不重构。不在这里写发布流程。

Skills 不要在这一阶段安装。重复第三次的检查动作，再看 [Skills](/ai/dev/coding/skills-in-coding)。

接手已有代码用 [老项目实战](./cursor-legacy-project)。老项目不重做第 3 节的架构。
