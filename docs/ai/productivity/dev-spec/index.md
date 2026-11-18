# AI 辅助软件开发规范

> V1.0 · 一套完整的工程规范，而不只是提示词集合。它把「AI 如何理解项目、如何规范完成一项开发任务、如何证明结果可靠」组织成三个互相支撑的层次。

## 为什么需要一套规范

零散的提示词能解决单点问题，但解决不了三件事：AI 每次都要重新理解项目、同类任务每次做法不一样、做完之后说不清「改了什么、验证过没有、能不能回滚」。

这套规范把这三件事固定下来：

- **能力可复用**：项目背景、规则、技能、分工方式沉淀在仓库里，不用每次对话重新交代。
- **过程可预期**：任何一项开发任务，从准备到交付都有明确的阶段和判断标准。
- **结果可验证**：质量、安全、变更、回滚贯穿全程，而不是收工时补一串检查。

## 三个层次

| 层次 | 目标 | 包含什么 |
| ---- | ---- | -------- |
| [第一层 · AI 工程基础](/ai/productivity/dev-spec/01-foundation/project-context) | 让 AI 正确工作 | Project Context · Rules · Skills · Agents · MCP / Tools · Hooks / Scripts |
| [第二层 · 软件开发生命周期](/ai/productivity/dev-spec/02-lifecycle/project-prep) | 让开发过程规范 | 项目准备 → 需求分析 → 架构设计 → 功能开发 → 审查 → 修复 → 优化 → 测试 → 交付 |
| [第三层 · 质量与安全保障](/ai/productivity/dev-spec/03-quality/code-quality) | 确保结果可靠 | 代码质量 · 测试验证 · 数据安全 · Git 管理 · 变更控制 · 交付追踪 |

三者是支撑关系，不是并列关系：

```text
┌─────────────────────────────────────────────┐
│  第三层 · 质量与安全保障（全程贯穿）            │
│  代码质量 · 测试验证 · 数据安全 · Git · 变更 · 追踪 │
├─────────────────────────────────────────────┤
│  第二层 · 软件开发生命周期（执行流程）           │
│  准备 → 需求 → 架构 → 开发 → 审查 → 修复 → 优化 → 测试 → 交付 │
├─────────────────────────────────────────────┤
│  第一层 · AI 工程基础（能力底座）               │
│  Context · Rules · Skills · Agents · MCP · Hooks │
└─────────────────────────────────────────────┘
```

关键关系：

- 第一层是整个体系的**能力基础**，决定 AI 能不能正确理解项目和调用能力。
- 第二层是实际工作的**执行流程**，决定一项任务怎么从开始走到结束。
- 第三层是贯穿前两层的**保障机制**——它从项目准备就生效，不是等开发结束才执行。

## 两层协同示例

开发生产报工功能：

| 层次 | AI 在做什么 |
| ---- | ----------- |
| AI 工程基础 | 读取项目 Rules、MES 业务文档，按需调用数据库设计 Skill |
| 软件开发生命周期 | 分析需求、设计架构、开发报工功能、审查、测试、交付 |
| 质量与安全保障 | 检查事务、权限、数据一致性、Git Diff、测试结果和回滚方案 |

后续出现库存数量错误：

| 层次 | AI 在做什么 |
| ---- | ----------- |
| AI 工程基础 | 读取业务规则，调用问题诊断 Skill |
| 软件开发生命周期 | 定位库存逻辑问题、修复、回归测试 |
| 质量与安全保障 | 验证库存一致性、检查数据库变更、保护已有代码 |

## 完整目录

<details>
<summary><strong>第一层 · AI 工程基础（6 页）</strong></summary>

- [Project Context · 项目上下文](/ai/productivity/dev-spec/01-foundation/project-context) — 让 AI 按需拿到准确的项目信息
- [Rules · 项目规则](/ai/productivity/dev-spec/01-foundation/rules) — 把长期约束写成 AI 必须遵守的规则
- [Skills · 专业技能](/ai/productivity/dev-spec/01-foundation/skills) — 把重复做法固化为可调用的技能
- [Agents · 智能体协作](/ai/productivity/dev-spec/01-foundation/agents) — 明确谁来做什么、权限到哪
- [MCP / Tools · 工具与外部能力](/ai/productivity/dev-spec/01-foundation/mcp-tools) — 让 AI 安全地连接仓库外的能力
- [Hooks / Scripts · 自动化执行](/ai/productivity/dev-spec/01-foundation/hooks-scripts) — 把确定性检查交给脚本

</details>

<details>
<summary><strong>第二层 · 软件开发生命周期（9 页）</strong></summary>

- [01 项目准备](/ai/productivity/dev-spec/02-lifecycle/project-prep)
- [02 需求分析](/ai/productivity/dev-spec/02-lifecycle/requirement-analysis)
- [03 技术架构设计](/ai/productivity/dev-spec/02-lifecycle/architecture-design)
- [04 功能开发](/ai/productivity/dev-spec/02-lifecycle/development)
- [05 功能审查与完善](/ai/productivity/dev-spec/02-lifecycle/review)
- [06 逻辑与 BUG 修复](/ai/productivity/dev-spec/02-lifecycle/bugfix)
- [07 代码优化与重构](/ai/productivity/dev-spec/02-lifecycle/refactor)
- [08 代码测试](/ai/productivity/dev-spec/02-lifecycle/testing)
- [09 交付与复用](/ai/productivity/dev-spec/02-lifecycle/delivery)

</details>

<details>
<summary><strong>第三层 · 质量与安全保障（6 页）</strong></summary>

- [代码质量规范](/ai/productivity/dev-spec/03-quality/code-quality)
- [测试与验证规范](/ai/productivity/dev-spec/03-quality/test-verification)
- [数据与安全规范](/ai/productivity/dev-spec/03-quality/data-security)
- [Git 与版本管理](/ai/productivity/dev-spec/03-quality/git-version)
- [变更控制](/ai/productivity/dev-spec/03-quality/change-control)
- [交付追踪与回滚](/ai/productivity/dev-spec/03-quality/delivery-rollback)

</details>

## 怎么使用这套规范

<details>
<summary><strong>按任务轻重裁剪，不要每次都走完整流程</strong></summary>

| 任务类型 | 建议做法 |
| -------- | -------- |
| 改文案、明确的小修 | 直接执行 + 局部检查，跳过大部分阶段 |
| 小 Bug | 准备 → 修复 → 验证，重点用第三层排查闭环 |
| 普通功能 | 需求 → 方案 → 开发 → 审查 → 测试 → 交付 |
| 复杂功能 / 老项目改造 | 完整走九阶段 + 三层保障全程生效 |

判断标准：**改错了需要回滚多个文件，就按完整流程走**。

</details>

<details>
<summary><strong>日常最短路径</strong></summary>

```text
① 准备    AI 读项目上下文和规则（第一层 + 项目准备）
② 说清    目标 + 约束 + 验收讲明白（需求分析）
③ 执行    简单任务直接做；复杂任务先方案后拆解（架构→开发）
④ 收尾    审查 + 测试 + 安全检查 + 交付报告（审查→测试→交付 + 第三层）
```

</details>

## 与其他栏目的边界

- 本规范讲**流程、判断标准和验收要求**，是可执行的工程规范。
- 可直接复制的零散提示词，仍见 [提示词库 · 编程开发](/ai/prompts/coding)；本规范各阶段只放与该阶段强相关的提示词，不重复维护大段模板。
- 术语衔接见 [AI 辅助编程工作流](/ai/productivity/ai-coding-workflow)。
- 工具选型见 [AI 工具与选型](/ai/productivity/tool-selection)。

> 具体工具的目录名、配置语法、加载方式以各工具当前版本官方文档为准。本规范里的文件名和目录都是通用示意，不把某个工具的约定当成行业标准。
