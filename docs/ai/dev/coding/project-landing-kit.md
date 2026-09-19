# 项目落地包（外包上手标准）

外包或新仓第一天只做一件事：**把下面这套文件放进仓库，并按「示例项目」改成真实信息。**

本页是唯一模板来源。新项目、老项目实战只讲步骤，不再另写一套示例。

| 文件 | 必放 | 作用 |
|------|------|------|
| `AGENTS.md` | 是 | 项目是什么、技术栈、禁止事项 |
| `.cursor/rules/00-core.mdc` | 是 | AI 怎么改、不能改什么 |
| `docs/ai-context/00-overview.md` | 是 | 一页项目说明 |
| `docs/ai-context/01-modules.md` | 老项目必放；新项目有模块后补 | 模块与调用链 |
| `docs/ai-context/99-gotchas.md` | 老项目必放 | 已知坑、不能动的接口 |
| Skills | 否 | 不进业务仓。见 [Skills](./skills-in-coding) |

---

## 目录

```text
<repo>/
├── AGENTS.md
├── .cursor/rules/00-core.mdc
└── docs/ai-context/
    ├── 00-overview.md
    ├── 01-modules.md
    └── 99-gotchas.md
```

有前端再加 `.cursor/rules/20-frontend.mdc`。Java 项目有分层习惯再加 `10-java-spring.mdc`。没有就不要建空文件。

---

## 示例项目（后文全部用这一套）

| 项 | 值 |
|----|----|
| 仓库名 | `ticket-admin` |
| 做什么 | 内部工单：新建、列表、改状态 |
| 后端 | Java 17 / Spring Boot 3 / MyBatis-Plus |
| 前端 | Vue 3 / Element Plus |
| 库 | MySQL 8 |
| 包 | `com.demo.ticket` |
| 表 | `biz_ticket`（id, title, status, created_at） |
| 接口 | `POST /api/tickets`、`GET /api/tickets`、`PATCH /api/tickets/{id}/status` |

接到真实外包时，只替换上表，**不要改文件职责和章节标题**。

---

## 1. `AGENTS.md`

```markdown
# AGENTS.md

## 项目
- 名称：ticket-admin
- 一句话：内部工单的新建、列表、改状态
- 用户：客服、值班同事

## 技术栈
- 后端：Java 17 / Spring Boot 3 / MyBatis-Plus
- 前端：Vue 3 / Element Plus
- 数据库：MySQL 8
- 缓存 / MQ：本阶段不用

## 目录
- 后端：backend/src/main/java/com/demo/ticket/
- 前端：frontend/src/
- AI 说明：docs/ai-context/

## 必须遵守
- 先给方案，确认后再改代码
- 只改当前任务相关文件
- 分层：Controller 收参，业务在 Service，数据在 Mapper
- 返回体、异常处理跟随仓库已有写法

## 禁止
- 改已发布的 `/api/**` 路径（任务写明除外）
- 改表结构（任务写明除外）
- 引入仓库里没有的框架
- 编造不存在的表、字段、接口

## 验收
- 后端：`mvn -q -DskipTests package` 通过
- 手工：能新建工单、能按状态查出、能改状态
```

---

## 2. `.cursor/rules/00-core.mdc`

```markdown
---
description: 本仓库 AI 协作边界
alwaysApply: true
---

# 核心规则

- 只改与当前任务相关的文件
- 不顺手重构、不扩大需求
- 不引入未使用的依赖
- 表结构和对外 API 变更必须先确认
- 不确定就停下来问，不要编业务规则
- 改完必须写：改了哪些文件、怎么验收、有什么风险
```

Java 分层（有 Spring 再另存为 `10-java-spring.mdc`）：

```text
- Controller 不写业务
- 写操作事务放在 Service
- 状态只允许：OPEN → DOING → DONE，禁止跳步（除非任务写明）
```

---

## 3. `docs/ai-context/00-overview.md`

```markdown
# 项目概览

## 做什么
内部工单：新建、列表、改状态。

## 技术栈
- Java 17 / Spring Boot 3 / MyBatis-Plus
- Vue 3 / Element Plus
- MySQL 8

## 本地启动
- MySQL：库名 ticket，账号见 application-local.yml
- 后端：8080
- 前端：5173

## 本阶段不做
- 登录权限细化
- 附件
- 消息通知
- Redis / MQ
```

## 4. `docs/ai-context/01-modules.md`

```markdown
# 模块

| 模块 | 职责 | 代码 |
|------|------|------|
| ticket | 工单增查改状态 | com.demo.ticket |

## 调用链
POST /api/tickets
  → TicketController.create
  → TicketService.create
  → TicketMapper.insert

## 表
biz_ticket
- id
- title
- status：OPEN / DOING / DONE
- created_at
```

## 5. `docs/ai-context/99-gotchas.md`（老项目必填）

```markdown
# 已知坑

- `/api/tickets` 已被外部系统调用，路径不能改
- status 历史数据里有小写 open，读取时要兼容，新写入只用大写
- 不要在 Controller 里直接拼 SQL
```

新项目第一天可以只写一行：`暂无。出现不能改的接口或脏数据再补。`

---

## 放进去之后怎么验收

用下面这段话测一次。AI 如果开始改登录、加 Redis、改表，说明规则没生效，先改 `00-core.mdc` 再继续。

```text
阅读 AGENTS.md 和 docs/ai-context/。
任务：给工单列表增加按 status 过滤。
先只输出方案：改哪些类、SQL 条件、怎么验收。
不要改代码。
```

通过标准：方案只涉及工单查询，并主动提到不能改接口路径。

下一步：

- 新仓：[新项目实战](/ai/ai-programming/cursor-new-project)
- 接手已有仓：[老项目实战](/ai/ai-programming/cursor-legacy-project)
