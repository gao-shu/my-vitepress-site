# AI Coding 内容架构分析

只读盘点。本文件不改导航、不改正文、不新建栏目页。  
盘点日期：2026-09-20。  
范围：侧边栏「AI → 技术 → AI Coding」及两篇实战；顺带核对基础认知里的 Prompt 页、技术 Agent 页、未进导航的占位页。

网站正文里没有「Vibe Coding」这个词，也没有名为 Spec 的页面。

---

## 1. 当前内容地图

侧边栏顺序（`docs/.vitepress/config.mts` → `aiDevSidebar`）：

```text
AI Coding
├── 工作流
├── Context & Rules
├── 项目落地包（Rules/AGENTS）
├── Skills 与 AI Coding
├── Prompt Pattern
├── Code Review
└── 实战
    ├── Cursor 老项目实战
    └── Cursor 新项目实战
```

入口页 `/ai/dev/coding/` 不在侧边栏子项里，但从「技术」导航进入 AI Coding 分组时，总览仍是独立文章。

未进导航、与主题相关：

| 文件 | 状态 |
|------|------|
| `docs/ai/dev/coding/workflow-sketch.md` | 三行占位，与工作流重复 |
| `docs/ai/dev/coding/fix-one-bug.md` | 两行占位，工作流里点名「有材料再挂」 |
| `docs/ai/dev/basics/prompt-engineering.md` | 在「基础认知」，不在 AI Coding 菜单 |
| `docs/ai/dev/agent/*` | 在「技术 → Agent」，讲 Agent 技术，不是编码流程 |

| 文件 | 当前标题 | 当前定位 | 核心内容 | 上游内容 | 下游内容 | 与其他文章重复点 | 当前缺失 |
| -- | ---- | ---- | ---- | ---- | ---- | -------- | ---- |
| `docs/ai/dev/coding/index.md` | AI Coding | 栏目入口：我现在要做什么 | 定位、适用范围、10 步闭环缩写、跳转表 | 无 | 工作流或直接进实战 / 落地包 | 与工作流都写了一遍「需求→实现→Review→测试→Debug」 | 不告诉读者各页的唯一职责边界 |
| `docs/ai/dev/coding/cursor-workflow.md` | AI Coding 工作流 | 可重复的总流程 | 10 步：需求、拆解、上下文、实现、架构判断、Review、测试、Debug、重构、交付 | 总览（可选） | 实战、Code Review、Prompt Pattern | 总览的闭环；第 3 步「准备上下文」与 Context 页重叠；第 6 步与 Code Review 重叠 | 不指向落地包；没有 Spec；上下文和 Rules 没分开 |
| `docs/ai/dev/coding/context-and-rules.md` | Context & Rules | 概念：给什么信息、约束怎么改 | Context/Rules 定义、单次任务 Context 示例、四条操作边界 | 工作流第 3 步 | 落地包、新/老项目 | 操作边界与落地包 `00-core.mdc` 同义；单次 Context 示例与老项目「status 过滤」同题 | 没有把 AGENTS 从 Rules 里拆开讲；没有 Spec |
| `docs/ai/dev/coding/project-landing-kit.md` | 项目落地包 | 仓库里要放的文件，唯一模板源 | 目录、`ticket-admin` 示例、AGENTS / rules / ai-context 全文 | Context & Rules 的概念 | 新项目或老项目的步骤 | 验收 Prompt 与新/老项目里的「先方案后改」句式相同，但是文件模板不重复 | 模板里的「必须遵守」混进了流程（先方案再改），和 Rules 的「怎么写代码」贴在一起 |
| `docs/ai/dev/coding/prompt-pattern.md` | Prompt Pattern | 6 类可复制 Prompt | 理解、设计、实现、Review、Debug、测试 | Context 摘要；基础认知的 Prompt 写法 | Code Review（Review 类应跳过去） | 「设计」容易被当成架构文；Review 模板与 Code Review 页各有一份 | 没有声明：这些模板不是 Spec，也不是项目文件 |
| `docs/ai/dev/coding/skills-in-coding.md` | Skills 与 AI Coding | 何时启用 Skill，不进业务仓 | 跟人走 vs 跟仓走、一份「Java 改动检查」格式 | 落地包已在仓里 | 重复第三次后再自建 | 检查项和 Code Review / Rules 边界有交叉，但已写明业务名不进 Skill | 没有外部 Skill 的具体名单（这是对的，不必凑） |
| `docs/ai/dev/coding/ai-code-review.md` | AI Code Review | 改完代码后的质量页 | 流程、分级、可复制 Prompt、防误报、二次 Review | 实现之后；工作流第 6 步 | 测试 / 修复 | Prompt Pattern 第 4 类也是 Review | 与实战页没有「做到哪一步必须来这里」的硬连接 |
| `docs/ai/ai-programming/cursor-new-project.md` | Cursor 新项目实战 | 空仓到第一个可演示功能的顺序 | 放 3 个文件 → 出方案 → 后端三接口 → 可选前端 → 清单 | 落地包（模板） | Skills（明确说先不装） | 方案 Prompt 把包结构、表、接口、状态机写在一起 | 目标流程里的需求、架构、Spec、Test、Review、Debug、文档、发布都没有独立步骤 |
| `docs/ai/ai-programming/cursor-legacy-project.md` | Cursor 老项目实战 | 接手已有仓：先扫描再小改 | 禁令、三次扫描写入规定文件、status 过滤验证、停手条件 | 落地包的章节标题 | 新项目（反向链接） | 扫描标题与落地包模板一致（这是对齐，不是第二套模板） | 无 Spec；无 Test/Review/回归步骤；扫描只覆盖「这次会碰的一条调用链」 |

链接关系（实际正文，不是猜测）：

- 总览 → 几乎所有 AI Coding 页
- 工作流 → Code Review、两篇实战、总览；不链落地包
- Context → 落地包、两篇实战、Skills、工作流、Code Review
- 落地包 → Skills、两篇实战
- Prompt Pattern → 基础认知 Prompt 页、Context
- Code Review → Context
- 新项目 ↔ 老项目；两者都只链落地包和 Skills
- Skills → 落地包、两篇实战、Agent 应用（用来划界）

---

## 2. 当前文章职责

| 文章 | 应属类型 | 正文是否匹配 | 不一致之处 |
|------|----------|--------------|------------|
| 总览 `index.md` | 栏目入口，不是方法论全文 | 一半匹配 | 又写了一遍闭环，和「只做路由」冲突 |
| 工作流 | 方法论 | 匹配 | 步骤里夹了概念定义（上下文、架构判断），但没有展开成第二篇文章，可接受 |
| Context & Rules | 概念解释 | 基本匹配 | 后半又给了可粘贴的任务 Context，和「概念页不维护模板」略粘 |
| 项目落地包 | 项目模板 | 匹配 | 文末验收 Prompt 越界到「怎么下指令」，量很小 |
| Prompt Pattern | Prompt 工具箱 | 匹配 | 「设计」标题像架构方法，正文只是一段提问模板 |
| Skills | 自动化能力（启用策略） | 匹配 | 没有讲 Cursor 按钮，这是对的 |
| Code Review | 质量保障 | 匹配 | 自带完整 Prompt，和工具箱重复一份 |
| 新项目实战 | 新项目实战 | 匹配「最小上手」，不匹配「完整工程阶段」 | 见第 4 节 |
| 老项目实战 | 老项目实战 | 匹配「接手后第一刀」，不是完整维护流程 | 见第 5 节 |
| `prompt-engineering.md` | 概念解释（怎么写 Prompt） | 在基础认知，不在本栏目 | 和 Prompt Pattern 的「结构」重叠，但不该搬进 AI Coding 菜单 |
| `workflow-sketch.md` / `fix-one-bug.md` | 无 | 占位 | 不应出现在任何「当前体系」叙述里，除非删除或标成草稿且不链 |

没有单独的「工具使用 / Cursor 安装」文。这和总览声明一致，不要补。

---

## 3. 概念边界分析

### 当前是否已经明确区分？

部分区分，没有一张总表。

已经分开的：

- Context 与 Rules：Context 页用了一句话切开。
- 仓库文件与 Skill：落地包和 Skills 页写了「跟仓走 / 跟人走」。
- 编码 Agent 与业务 Agent：Skills 页指向 Agent 应用，技术 Agent 在另一个侧边栏。

没有分开或没有名字的：

- AGENTS.md 被当成落地文件，没有解释它和 Rules、和 Context 文档各写什么。
- 「方案」在新项目里同时承担架构、接口和状态机，没有 Spec 这个词。
- Prompt、单次任务 Context、Rules 四条，在 Context 页后半叠在同一次对话里。

### 逐个概念

| 概念 | 现在在哪 | 边界是否清楚 |
|------|----------|----------------|
| Requirements | 只有工作流第 1 步三句话 | 是流程阶段，没有独立页。够用，不必建页 |
| Architecture | 工作流第 5 步叫「人工架构判断」，发生在代码生成之后 | 和「动手前的架构设计」不是同一件事。新项目没有设计步骤 |
| Context | 概念页 + `docs/ai-context/*` | 项目 Context 和「本次任务 Context」混在同一页，但已标明一个进仓库、一个贴对话 |
| Rules | 概念页 + `00-core.mdc` | 清楚。不要再写第三份规则正文 |
| AGENTS | 只在落地包模板 | 缺一句定义：给 Agent 的项目卡片，不是 Spec，也不是 Prompt |
| Spec | 无 | 缺口。见第 7 节 |
| Prompt | Prompt Pattern + 基础认知 + Code Review 里各有模板 | 工具，不是阶段。阶段是「开发 / Review / Debug」 |
| Agent | 技术 → Agent；应用 → Agent 应用 | 与 AI Coding 已分开。不要在编码栏目再解释 Agent 是什么 |
| Skills | Skills 页 | 清楚 |
| Development | 工作流第 4 步；新项目第 2 步 | 是阶段 |
| Test | 工作流第 7 步；Prompt Pattern 第 6 类 | 没有实战里的必做步骤 |
| Review | 工作流第 6 步 + 专页 + Prompt 第 4 类 | 方法在专页，模板有两份 |
| Debug | 工作流第 8 步 + Prompt 第 5 类 | 没有专页。工作流写明暂不挂 `fix-one-bug`。同意，先不要为 Debug 建页 |
| Documentation | 无交付文档阶段 | 落地包的 ai-context 是给 AI 的说明，不是给用户的文档。不要混 |

### 五个必答题

1. **是否已经明确区分？** 核心文件层（Context 文件 / Rules / Skill）基本区分了。阶段层（需求、架构、Spec、开发、测试）没有区分。
2. **重复解释：** 总览与工作流的闭环；Context 页的四条边界与 `00-core.mdc`；Prompt Pattern 的 Review 与 Code Review 页；基础认知 Prompt 页与 Prompt Pattern 的「目标+约束+输出」。
3. **缺少独立位置：** Spec；AGENTS 的定义（可以只是落地包开头的三行，不必新页）；动手前的架构（相对「生成后的架构判断」）。
4. **不应该单独成文：** Requirements、Debug、Documentation、Release、Refactor、Cursor 安装、Vibe Coding、每一种 Prompt 各一篇、AGENTS 单独一篇。
5. **应该只是流程中的一个阶段：** 需求、架构设计、准备 Context/Rules、写 Spec、开发、测试、Review、Debug、回归、文档、发布。这些阶段由工作流点名，由新/老项目决定哪些必做，不要每阶段一篇。

特别结论：

> Context ≠ Rules ≠ Spec ≠ Prompt ≠ Agent ≠ Skills  
> 网站已经守住了 Agent 和 Skills。  
> 没有守住 Spec。  
> Rules 与「每次 Prompt 里的四条边界」仍容易被读成同一份文档。

---

## 4. 新项目实战分析

对照目标流程：

需求分析 → 架构设计 → Context → Rules / AGENTS → Spec → 模块开发 → Test → Review → Debug / Regression → Documentation → Release

| 阶段 | 当前文章 |
|------|----------|
| 需求分析 | 未覆盖。直接假设要做工单三接口 |
| 架构设计 | 未覆盖。第 1 步让 AI「输出包结构」，这是目录建议，不是架构方法 |
| Context | 覆盖：先放 `00-overview.md` |
| Rules / AGENTS | 覆盖：先放 `AGENTS.md` 与 `00-core.mdc` |
| Spec | 未命名。第 1 步「方案」里夹了字段、接口、状态机 |
| 模块开发 | 覆盖：第 2、3 步，范围和禁止写清楚 |
| Test | 只有 curl 验收，没有测试阶段 |
| Review | 无 |
| Debug / Regression | 无 |
| Documentation | 无（ai-context 不算交付文档） |
| Release | 第 4 步是交付清单，不是发布方法 |

### 只提到、未形成方法

- 「先方案后写代码」有 Prompt，没有说明方案里必须有哪些标题才算做完。
- 「人工确认字段和多余模块」是检查点，不是架构设计方法。

### 应该从文章中删除

- 没有大段概念讲解，这是对的，不要删步骤。
- 不要把落地包里的文件再贴一遍（当前没有贴，保持）。

### 应该放到其他文章

- 文件正文：继续只放落地包。
- Review / 测试的做法：链接到 Code Review 和工作流，不要在新项目里再写一套检查维度。

### 是否需要新增 Spec Coding 这一层

需要这一**阶段**，不需要在本阶段新写文章。  
新项目若继续没有 Spec，第 1 步的「方案」会永远和质量标准绑在一段自由 Prompt 上，换一个客户就变形。

### 「架构设计 → Context / Rules → Spec → 开发」是否完整

**不完整，而且当前顺序不同。**

当前实际顺序是：

```text
先放 AGENTS + Rules + overview
→ 再让 AI 出包结构/表/接口（把架构和 Spec 混在一次回复里）
→ 再写代码
```

目标顺序是先设计、再冻结说明文件、再写 Spec、再开发。  
现有顺序的好处是：没文件就不许写代码。这个约束应保留。  
缺的是：文件放进去之后，仍缺少一份与代码分离的 Spec（接口、状态、验收、不做）。

---

## 5. 老项目实战分析

对照：代码 → 项目扫描 → 理解系统 → Context → Rules → Spec → 局部修改 → Test → Review → Regression

| 阶段 | 当前 |
|------|------|
| 代码 / 扫描 / 理解 | 有。三次扫描，一次一个文件，禁止编造 |
| Context | 合理。写入 `00-overview` 与 `01-modules`，标题与落地包锁定 |
| Rules | 合理。扫描后放入 `00-core` 与 `AGENTS`，不从零写理想规范 |
| Spec | 无。验证任务「加 status 过滤」直接当需求，没有先写规格 |
| 局部修改 | 有，且有停手表 |
| Test / Review / Regression | 无。验收只有 curl 和 diff 干净 |

Context 构建合理的部分：事实 / 待确认 / 人写 gotchas。  
偏窄的部分：调用链「只写本次会碰的一条」。做第一刀够用，不能当成系统理解完成。

Rules 提取合理：从扫描结果填技术栈，不另起规范。  
不够的部分：没有写「哪些习惯从代码里抽进 `10-java-spring.mdc`，哪些不要写」。

与新项目的重复：

- 都说先放落地包、先方案后改、用工单例子、先不装 Skill。这是**应保持的同一套约束**，不是两套流程。
- 没有重复粘贴 AGENTS 全文。这点不要改回去。

应保持一致：

- 同一示例项目 `ticket-admin`
- 同一文件名和章节标题
- 同一句顺序：先方案，确认后再改
- 同一禁止：不改 URL、不改表、不加依赖、不装 Skill

应明确区分：

| | 新项目 | 老项目 |
|--|--------|--------|
| Context 从哪来 | 人按已知目标写 overview | 从代码扫描，人删掉猜测 |
| 第一刀 | 三个接口的垂直切片 | 已有列表上加一个过滤 |
| gotchas | 可写「暂无」 | 必填，且人写 |
| 架构 | 人要先定模块边界（目前缺） | 不重新设计，只标出现状 |

---

## 6. 内容重复分析

### 类型 1：概念重复

- 总览「什么叫 AI Coding」与工作流开篇，同一条闭环写了两次。总览可以只留跳转。
- Context 页解释「修改边界」，落地包 `00-core` 再写一遍。概念页保留定义即可，四条原文只留在落地包。
- 工作流第 3 步「准备上下文」列举的材料和 Context 页清单同义。工作流应改成链接，不要再列清单。这是调整，不是两篇文章都错。

### 类型 2：模板重复

- **没有**第二套 AGENTS / Rules 全文。落地包是唯一全文。这是当前做得对的地方，后续修改不要破坏。
- 单次任务 Context 示例（Context 页）与老项目 status 过滤是同一道题的两种写法。可以留一种，另一种改成「见某页」。
- Code Review 的可复制 Prompt 与 Prompt Pattern 第 4 节是两份 Review 模板。应只留 Code Review 页那份。

### 类型 3：流程重复

- 总览、工作流、新项目、老项目都在说「先边界再动手」。
- 工作流是 10 步通用闭环；两篇实战是场景顺序。重复的是原则，不是步骤表。
- 不应把实战写成工作流的缩写，也不应把工作流写成工单教程。
- 新项目目前太短，还谈不上「又完整描述了一遍 10 步」。缺阶段，不是流程重复过多。

### 类型 4：工具重复

- Prompt 的通用结构：`prompt-engineering.md` 与 Prompt Pattern 开篇。
- Review：工作流一段 + 专页 + Prompt 第 4 类。
- Agent：编码栏目只在 Skills 末尾划界，没有重复讲 Agent 原理。保持这样。
- Cursor 产品操作：各页都没写按钮。没有工具说明书重复。

---

## 7. Spec Coding 缺口分析

存在缺口，位置就在：

```text
Architecture
  ↓
Context / Rules / AGENTS
  ↓
Spec          ← 现在没有名字，也没有固定章节
  ↓
Development
```

新项目的「方案」和老项目的「先输出方案」都是口头 Spec，换一次对话就丢。

1. **为什么需要：** 外包接手时，客户要的是可验收的约定（接口、状态、不做清单），不是又一段聊天。没有 Spec，AI 每一轮都在重新解释需求。
2. **解决什么问题：** 把「这次改什么、怎样算做完、明确不做什么」写成仓库里的短文件，开发和 Review 都对着它。
3. **与 Prompt 的区别：** Prompt 是这一轮怎么问。Spec 是问完之后冻结的结果。Prompt 可以扔，Spec 要留下。
4. **与 Agent 的区别：** Agent 是执行者。Spec 是执行者要遵守的任务说明。不解释 Agent 架构。
5. **与 Rules 的区别：** Rules 管所有任务（分层、禁止改 URL）。Spec 只管这一次功能。
6. **与落地包的关系：** 落地包继续管长期文件（AGENTS、rules、overview、modules、gotchas）。Spec 是按任务新增的短文件，例如 `docs/ai-context/specs/` 下一篇，模板将来可以放进落地包，但正文方法不要塞进 AGENTS.md。
7. **导航位置：** 若做页面，放在「Context & Rules」和「项目落地包」之间，或放在落地包之后、Prompt 之前。不要放进实战下面，也不要放进 Agent。

本阶段不创建该文章。是否新建页，放到下一阶段 Spec 里决定。默认建议：**先规定 Spec 的章节标题，写进新/老项目的步骤里；确认标题稳定后，再决定要不要独立一页。** 不要现在就拆出 Spec Coding 大文。

---

## 8. 推荐信息架构

不采用「每个阶段一篇」的结构。当前 8 篇主文已经覆盖入口、流程、概念、模板、Skill、Prompt、质量、两种实战。再拆会碎。

推荐（在现有菜单上改职责，不先加页）：

```text
AI Coding
├── 总览                 只做路由
├── 工作流               唯一的阶段名单（含 Spec 这一步的名字）
├── Context & Rules      只定义 Context / Rules / AGENTS 三个词
├── 项目落地包           唯一文件模板
├── Prompt Pattern       只保留提问模板；Review 改为链接
├── Skills
├── Code Review
└── 实战
    ├── 新项目           按阶段引用上面各页，补上 Spec 步骤
    └── 老项目           同上，扫描与第一刀保持现状
```

暂不放入菜单：

- Spec 独立页（P1，等章节标题定稿）
- Debug 专页、测试专页、发布专页
- Vibe Coding
- `workflow-sketch.md`、`fix-one-bug.md`

与用户示例结构的差别：示例把 Spec Coding 放进导航。分析结论是**流程里必须有 Spec，导航里先不要为它占一位**，避免在模板还没定死时又多一篇概念文。

---

## 9. 每篇文章最终职责

| 页面 | 最终职责 | 应该讲什么 | 不应该讲什么 |
| -- | ---- | ----- | ------ |
| 总览 | 路由 | 我现在该打开哪一页 | 10 步详解、个人履历长文 |
| 工作流 | 阶段名单与人机分工 | 每步谁拍板、验收是什么、链到专页 | 工单示例、文件模板、Prompt 全文 |
| Context & Rules | 三个词的定义 | Context、Rules、AGENTS 各管什么；项目 Context 与本次任务 Context 的差别 | 第二份 rules 全文、完整开发流程 |
| 项目落地包 | 可复制文件 | 目录、`ticket-admin`、五个文件的章节 | 新/老项目的多步教程 |
| Prompt Pattern | 提问模板 | 理解 / 设计 / 实现 / Debug / 测试五类骨架 | Review 第二份模板、架构方法论 |
| Skills | 启用条件 | 何时进个人目录、何时禁止进仓库 | 客户业务表、Agent 原理 |
| Code Review | 改完后的检查 | 分级、防误报、唯一 Review Prompt | 如何从 0 建项目 |
| 新项目 | 空仓顺序 | 放文件 → 架构要点 → Spec → 一个模块 → 链到 Test/Review | 再贴一份 AGENTS；一次讲完全部阶段的教材 |
| 老项目 | 接手顺序 | 扫描 → 人改 Context → 放 Rules → Spec → 一刀小改 | 重新讲 Context 是什么；系统级重构 |

---

## 10. 修改优先级

### P0：必须修改

| 动作 | 对象 | 原因 |
|------|------|------|
| 重写步骤，不重写模板 | 新项目、老项目 | 补上 Spec 这一步的固定标题；接上 Test/Review 的链接。不把落地包复制进来 |
| 调整 | 工作流 | 步骤表加上 Spec；第 3 步改为链接 Context，不重复清单；链到落地包 |
| 调整 | Context & Rules | 删掉与 `00-core` 重复的规则正文；用三行定义 AGENTS |
| 调整 | 总览 | 闭环改成指向工作流，避免两份阶段表 |
| 保留 | 落地包 | 已是唯一模板源。只允许以后追加 Spec 文件名，不要换示例项目 |
| 移动 | Prompt Pattern 的 Review 节 | 改成链接 Code Review，删除第二份模板 |

不新增页面。不删除实战文。

### P1：建议修改

| 动作 | 对象 |
|------|------|
| 决定 Spec 是「实战中的一节」还是「独立短页」 | 下一阶段 Spec 定稿后再动 |
| 调整 | Code Review：文首写明「Prompt Pattern 不再保留 Review 模板」 |
| 保留 | Skills、基础认知 Prompt 页、技术 Agent 三篇 |
| 不移动 | Agent 应用三篇。它们不是 AI Coding |

### P2：可以以后修改

| 动作 | 对象 |
|------|------|
| 删除或继续隐藏 | `workflow-sketch.md`、`fix-one-bug.md` |
| 有真实材料再写 | Debug 专页、测试专页、发布说明 |
| 不写 | Vibe Coding 词条、Cursor 安装、每个 Prompt 一页 |

---

## 11. 下一阶段修改建议

下一阶段只写信息架构 Spec，仍不改站点正文。Spec 需要拍板的只有四件事：

1. 工作流阶段名单是否定为：需求 → 架构 → Context/Rules/AGENTS → Spec → 开发 → Review → 测试 → Debug/回归。重构和发布留在工作流，不进实战必做。
2. Spec 的固定章节标题（建议不超过：目标、接口或改动点、验收、明确不做）。
3. 新项目与老项目共用该标题，但 Context 的来源不同（人写 vs 扫描）。
4. 导航是否在本轮保持不变。建议保持不变。

不要在 Spec 里增加：Skill 大全、Agent 教程、第二套工单示例、Debug 新文。

---

## 当前阶段结论

> 当前 AI Coding 栏目已经把「模板、概念、实战步骤」拆开，落地包没有第二套副本，这是正确的，不要推倒重来。  
> 真正的缺口是阶段，不是文章数量：新项目和老项目都停在「放文件 + 出一段方案 + 写代码」，没有名为 Spec 的冻结结果，也没有把 Review / 测试接进实战必做步骤。  
> Context、Rules、Prompt、Skill、Agent 没有全部混在一起；混在一起的是「方案、架构、接口约定」。

## 下一阶段应该修改什么

> 只确定最终信息架构 Spec：阶段名单、Spec 章节、每页继续只做一件事、导航先不动。  
> 确认后再改工作流和新/老项目的步骤。本文件不是修改指令，未改任何现有文章。
