# Skills 与 AI Coding

Skills 不是项目模板。外包仓先放 [项目落地包](./project-landing-kit)，不要把 Skill 拷进每个客户仓库。

| | 放哪 | 何时用 |
|--|------|--------|
| Rules / AGENTS / ai-context | 客户仓库 | 每个项目第一天 |
| Skill | 你自己的 Cursor Skills 目录 | 同一套步骤重复做到第 3 次 |

---

## 不要引入的情况

- 项目第一天
- 老项目还没写完 `99-gotchas.md`
- Skill 描述的是「这个客户的表和接口」（那是 Context，不是 Skill）
- 只是听说好用

## 可以引入的情况

- 每个仓库都做的事：开 PR 前的检查、按固定格式写提交说明
- 官方或社区 Skill 刚好覆盖你本机工具（看 CI、发 PR），用完可以关

---

## 自建 Skill 的固定格式

标题和章节不要改，只改步骤里的检查项。

```markdown
# Java 改动检查

## 何时用
准备提交或开 PR 之前

## 输入
- 需求一句话
- 当前 diff

## 步骤
1. 列出改动文件
2. 标出与需求无关的文件
3. 检查是否改了表结构或对外 URL
4. 检查是否新增了 AGENTS.md 里没有的依赖
5. 给出最少手工验收步骤

## 输出
- 必须改
- 可以不改
- 验收步骤
```

这个 Skill 不包含 `biz_ticket` 这类业务名。业务名只出现在仓库的 `docs/ai-context/`。

---

## 和两篇实战的关系

- [新项目](/ai/ai-programming/cursor-new-project) 第 0～3 步：不启用 Skill  
- [老项目](/ai/ai-programming/cursor-legacy-project) 第 2 步验证通过之后：如果同一段检查话你已经说了三遍，再把上面这份 Skill 存到本机

业务里的 Agent（工具、权限、验证）不是 Coding Skill，见 [Agent 应用](/ai/app/agent/development)。
