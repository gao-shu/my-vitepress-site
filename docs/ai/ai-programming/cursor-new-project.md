# Cursor 新项目实战

从空仓库到第一个能演示的功能。示例项目与文件内容以 [项目落地包](/ai/dev/coding/project-landing-kit) 为准，本页只规定**顺序**。

适用：Java / Spring Boot 外包或自研后台，从 0 开始。  
不做：一次生成整套系统。

---

## 0. 当天必须完成

1. 建仓库  
2. 按落地包放入并改好：

```text
AGENTS.md
.cursor/rules/00-core.mdc
docs/ai-context/00-overview.md
```

3. `01-modules.md`、`99-gotchas.md` 可以在第一个功能确认后再补全

未完成第 2 步，不要让 AI 写业务代码。

---

## 1. 先出方案，不写代码

把落地包里的「示例项目」改成客户真实名称后，发送：

```text
阅读 AGENTS.md 与 docs/ai-context/00-overview.md。

只输出方案，不要写代码：
1. 后端包结构
2. biz_ticket 字段（只保留能跑通新建和列表的字段）
3. 三个接口：新建、列表、改状态
4. 状态只能 OPEN → DOING → DONE
5. 明确本阶段不做的事（照 overview 里的「本阶段不做」）

等我回复「可以写」再生成代码。
```

你要改的只有：表名、字段、状态名、不做清单。结构不要改。

人工确认：字段是否够演示、有没有多出来的模块（用户中心、支付、消息）。有就删掉再进入下一步。

---

## 2. 只实现后端最小闭环

```text
按已确认方案实现后端。

范围：
- 只允许改 com.demo.ticket 及对应 Mapper XML / 建表 SQL
- 三个接口：POST /api/tickets、GET /api/tickets、PATCH /api/tickets/{id}/status

禁止：
- 登录、Redis、MQ、前端
- 改接口路径
- 引入 AGENTS.md 里没有的依赖

验收（写在回复里）：
- mvn -q -DskipTests package
- curl 新建一条
- curl 列表能看到
- curl 把状态从 OPEN 改到 DOING
```

包名、路径按你改过的 `AGENTS.md` 替换。

---

## 3. 再补前端（可选，仍是一个任务）

```text
只做工单列表页和新建表单，对接已有三个接口。

范围：frontend/src 下工单页面
禁止：新 UI 库、改后端接口
验收：页面能新建、能看到列表、能改状态
```

---

## 4. 交给客户或下一轮开发前

```text
[ ] AGENTS.md 与真实技术栈一致
[ ] 00-overview 写了「本阶段不做」
[ ] 01-modules 与真实包名、接口一致
[ ] 用第 2 步的 curl 自己点过
[ ] git diff 里没有无关模块
```

Skills 不要在这一阶段安装。重复第三次的检查动作，再看 [Skills](/ai/dev/coding/skills-in-coding)。

接手已有代码用 [老项目实战](./cursor-legacy-project)。
