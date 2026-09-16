# Node(TS) · 04 工程实践

## 1. 典型落地形态

### BFF

- 聚合多个 Java 接口，适配前端字段  
- 会话/JWT 校验可在此，但权限规则以 Java 为准  
- 缓存短 TTL 的聚合结果；注意失效  

### Electron 本地服务

- 主进程或独立本地 HTTP：管设备、文件、串口  
- 与渲染进程消息边界清晰；别把重活放渲染进程  
- 升级、日志目录、权限（尤其 Windows）要单独设计  

### 和 Java 的契约

- OpenAPI / 示例请求；错误码对齐  
- 超时链：浏览器 → BFF → Java → DB，逐层更严  

---

## 2. 推荐结构（Express/Fastify 轻量）

```
src/
  app.ts
  routes/
  services/
  schemas/          # zod
  middlewares/
  config.ts
```

Nest 则按其 module 切。原则一样：**路由瘦、服务清晰、配置外置。**

---

## 3. 工程习惯

| 项 | 做法 |
|----|------|
| 包管理 | `pnpm` 优先；锁文件进仓库 |
| 构建 | `tsc` 或 bundler；生产跑 `dist` |
| 环境变量 | 校验后才能启动（zod 解析 env） |
| 日志 | 结构化；带 `requestId` |
| 安全 | 依赖审计；不暴露 stack 给公网 |

---

## 4. 测试与部署

- 单测：vitest / jest；对外部 HTTP mock  
- 超烟：关键 BFF 路径  
- Docker：`node:lts-alpine` + `node dist/main.js`  
- 与前端同仓 monorepo 可以，**发布物分离**（别把整个 monorepo 塞一个镜像瞎跑）  

下一篇：[05 常见问题](./05-faq.md)
