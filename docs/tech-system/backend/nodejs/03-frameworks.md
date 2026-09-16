# Node(TS) · 03 框架与生态

> Express / Nest / Fastify 等，默认按 **TypeScript** 来写。

## 1. Express

- 简单直接，中间件模型清晰  
- 适合 BFF、小 API、Electron 旁路服务  

**判断：** 小而美场景的默认选择。生态中间件多，也要自己拼结构（目录、错误处理、校验）。

## 2. Fastify

- 更偏性能与 schema 校验  
- 适合对延迟敏感、仍想保持轻量的服务  
- 与 JSON schema / TypeBox 结合时，契约感接近 FastAPI  

## 3. NestJS

- 模块、DI、结构像「Spring 味」  
- 适合 Node 侧也要多人协作、边界清晰的中型后端  

**判断：** 真要做中大型 Node 域再上；别小脚本套 Nest（启动与概念成本不值）。

有 Java Spring 经验时，Nest 的模块/提供者概念好迁移；仍要记住：**运行时是 Node，事务与生态深度不如 Spring + JDBC 熟路。**

---

## 4. 实时与配套

| 需求 | 常见选择 |
|------|----------|
| WebSocket | `ws`、Socket.IO（要房间/降级时） |
| 校验 | zod、class-validator（Nest） |
| ORM | Prisma / TypeORM / 轻封装 SQL——能不用重 ORM 就不用 |
| 日志 | pino / winston；结构化 + request id |
| HTTP 客户端 | undici / axios；超时必设 |

---

## 5. 选择表

| 场景 | 选择 |
|------|------|
| Vue/Electron 配套 API | Express 或 Fastify |
| Node 侧中型业务 | NestJS |
| 实时 | Socket.IO / `ws`（按复杂度） |
| 核心业务数据权威 | 仍在 **Java** |

**原则：** Node 框架为前端与桌面服务；不要在 Node 里复制一整套域规则。

下一篇：[04 工程实践](./04-engineering.md)
