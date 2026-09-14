# Node(TS) · 框架总结

> Express / Nest / Fastify 等，默认按 **TypeScript** 来写。

---

## Express

- 简单直接，中间件模型清晰  
- 适合 BFF、小 API、Electron 旁路服务  

**判断：** 小而美场景的默认选择。

---

## Fastify

- 更偏性能与 schema 校验  
- 适合对延迟敏感、仍想保持轻量的服务  

---

## NestJS

- 模块、DI、结构像「Spring 味」  
- 适合 Node 侧也要多人协作、边界清晰的中型后端  

**判断：** 真要做中大型 Node 域再上；别小脚本套 Nest。

---

## 我的选择

| 场景 | 选择 |
|------|------|
| Vue/Electron 配套 API | Express 或 Fastify |
| Node 侧中型业务 | NestJS |
| 实时 | Socket.IO / `ws`（按复杂度） |

**原则：** Node 框架为前端与桌面服务；核心业务数据权威仍在 Java。  
