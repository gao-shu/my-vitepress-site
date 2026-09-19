# Cursor 老项目实战

接手已有仓库：先理解系统，再做一次最小修改。不是把老项目重做成新项目。

阶段含义见 [AI Coding 工作流](/ai/dev/coding/cursor-workflow)。文件正文只在 [项目落地包](/ai/dev/coding/project-landing-kit)。概念见 [Context & Rules](/ai/dev/coding/context-and-rules)。

适用：Java / Spring 外包接手、二开、加一个小功能。  
下文用工单列表说明。你的仓库把 `ticket` / `biz_ticket` 换成真实名字即可，不要改章节标题。

最大的风险不是 AI 不会写代码，而是它不知道这段代码为什么这样写。

> **先理解，再修改。** 不因为旧代码不漂亮，就顺手重做架构。

```text
代码 → 理解 → Context → Rules → Spec
 → 最小修改 → 测试 → Review → Debug / 回归 → 交付
```

**架构整段跳过。** 架构已经在仓库里。这次要读懂它，不是用 AI 再设计一套。发现架构问题只记下来；真要重构，另开任务、另写 Spec。

---

## 0. 第一天不要做的事

* 不要让 AI「重构整个项目」
* 不要先装一堆 Skill
* 没有 `99-gotchas.md` 时，不要改对外接口
* 扫描结果没经人改过，不要写业务代码

---

## 1. 扫描：只弄清这一条链

不比谁扫的文件多。这次要回答：

```text
从哪进入 → 经过哪些层 → 碰什么数据 → 得出什么结果
```

工单示例只碰已有列表：`GET /api/tickets`。沿 Controller → Service → Mapper / SQL → 表 `biz_ticket`。配置和依赖只记与这条链有关的。Entity 里对不上的字段写「待确认」。

AI 可以扫描、整理。扫出来的只是候选，不是事实。一次只写一个文件，你删掉猜错的句子。

### 概览 → `docs/ai-context/00-overview.md`

```text
根据仓库依赖和启动类，写 docs/ai-context/00-overview.md。
标题只许有：项目概览、做什么、技术栈、本地启动、本阶段不做。
只写代码里能看到的事实。看不出的启动方式写「待确认」。不要编业务背景。
```

### 模块 → `docs/ai-context/01-modules.md`

```text
根据 Controller 写 docs/ai-context/01-modules.md。
只写这次会碰的那一条调用链和相关表。
字段必须能在 Entity 或 XML 里对上，对不上写「待确认」，不要猜。
```

### 坑 → `docs/ai-context/99-gotchas.md`

人写，不让 AI 编。能填则填：不能改的路径、历史脏数据、不要模仿的写法。  
工单示例里，人至少要写下「`/api/tickets` 已被外部调用，路径不能改」。历史数据里的小写 `open` 这类兼容，也由人写。

---

## 2. Context

上一步三个文件，经你改完，才是 Context：从代码、表、配置、接口和实际行为里抽出的事实。不是「这次要加过滤」。

看不出的保持「待确认」。AI 的猜测删掉再往下走。

---

## 3. Rules

把落地包里的 `AGENTS.md` 和 `00-core.mdc` 放进仓库，技术栈改成扫描结果。不在这里贴全文。

* `AGENTS.md`：项目卡。不是这次过滤的任务书。
* Rules：所有任务都遵守。不擅自改表，不擅自改已有 API，不扩大范围，沿现有调用链和写法，不确定就停。

「加 status 参数、不传参数要与改前一致」是 Spec，不要写进 `00-core.mdc`。

---

## 4. Spec

人确认这份 Spec 之后，才许改代码。

写入 `docs/ai-context/specs/list-status-filter.md`。有任务再新建，不预建空目录。只有这四个标题。

```markdown
# 列表增加 status 过滤

## 目标
已有 GET /api/tickets 增加可选参数 status。

## 范围
- 做：这一条列表查询
- 模块：扫描确认的那一条 Controller → Service → Mapper
- 不做：新接口、新表、改状态机、改 URL、改其他模块

## 做到什么
- 不传 status：结果与改前一致
- status=OPEN：只返回 OPEN
- 已有的其他状态：按该状态查
- 非法值：按项目现有方式失败，不要当成查全部

## 验收
- 不传参数与改前一致
- status=OPEN 只有 OPEN
```

这是一次修改的约定，不是重做工单系统。

**人**冻结。**AI**可以起草。

---

## 5. 最小修改

```text
Spec 已确认
 → 沿已有调用链找改点
 → 只改这一处
 → 人看 Diff
```

工单列表应落在现有链上：Controller → Service → Mapper → SQL。条件加在已有查询上。

不要新建一套 Service，不要另开查询接口，不要改 URL，不要重构状态，不要顺手统一风格或升级框架。Spec 没写的都不做。

```text
阅读 docs/ai-context/specs/list-status-filter.md
和 docs/ai-context/01-modules.md、99-gotchas.md。
只改 Spec「范围」里的那一条查询。
不要做「不做」里的事。
```

提问方式见 [Prompt Pattern · 实现](/ai/dev/coding/prompt-pattern#3-实现)。  
**人**看 Diff 是否只动了查询。**AI**按 Spec 改。

---

## 6. 测试

新项目只要证明功能做出来了。老项目还要证明原来的行为还在。

对照 Spec：

* 不传 `status`：与改前一致
* `status=OPEN`：只有 OPEN

有单测就跑单测。没有就固定这两支 curl。不在这里写测试理论。见 [Prompt Pattern · 测试](/ai/dev/coding/prompt-pattern#6-测试)。

**人**判定过不过。创建、改状态这次没要求重测一遍，放到回归里抽查。

---

## 7. Review

测试之后看 Diff。AI 初检，人判断。

* 是否只做了 Spec 里的过滤
* 是否违反 Rules（改表、改 URL、加依赖）
* 是否出现顺手重构、无关文件
* 不传参数的行为是否还在

| 现象 | 处理 |
|------|------|
| Diff 里出现登录、Redis、顺手优化 | 禁令补进 `00-core.mdc`，回到 Spec，不要接着写 |
| 字段和表对不上 | 先改 `01-modules.md`，停止写功能 |
| 无关文件 | 回滚那些文件，收紧范围再改 |

做法在 [AI Code Review](/ai/dev/coding/ai-code-review)。本页不复制 Prompt。

第 5 步没通过之前，不接更大的需求。

---

## 8. Debug / 回归

测试或 Review 没失败，就跳过。不要为了走流程找茬。

若失败，例如不传 `status` 时列表变了：复现这条请求，缩小到这次加的 SQL 条件，看 Diff，不要重写查询方法。改完再测「不传」和「OPEN」两支。

回归不是把系统重测一遍。Spec 没点名的旧行为要抽查：创建、改状态、`99-gotchas.md` 里写过的路径和兼容（例如历史小写 `open` 仍能读）。证明这次没有偷偷改掉它们。

**人**决定修到哪。**AI**帮着定位，不整段重写。见 [Prompt Pattern · Debug](/ai/dev/coding/prompt-pattern#5-debug)。

---

## 9. 交付

* Spec 里的验收过了
* 不传 `status` 与改前一致
* Diff 里没有无关修改
* 说得清改了哪一条链、怎么验

```text
[ ] 00-overview 的技术栈和本地启动是真的
[ ] 01-modules 的表字段和代码一致
[ ] 99-gotchas 写了不能动的接口
[ ] AGENTS.md 与 00-core.mdc 已提交
[ ] specs/list-status-filter.md 与实际改动一致
[ ] 第 6 节两支请求自己打过
```

没有新的 Spec，就不重构。不写发布流程。

---

## 和新项目的差别

新项目从需求和架构进入，见 [新项目实战](./cursor-new-project)。  
老项目从代码进入，**不重新设计架构**。看不到架构一节，是有意跳过。

```text
新项目：需求 → 拆解 → 架构 → Context → Rules → Spec → 实现
老项目：代码 → 理解 → Context → Rules → Spec → 修改
```

汇合之后才相同：

```text
Context → Rules → Spec → 实现或修改
 → 测试 → Review → Debug / 回归 → 交付
```

Context 的来源不同：新项目是人写下的已知事实；老项目是扫出来、再由人删掉猜测。
