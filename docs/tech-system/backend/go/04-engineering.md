# Go · 04 工程实践

## 1. 什么时候真的写 Go

- 需要单二进制丢到现场跑的小服务  
- 边车：限流、转换协议、本地代理  
- 读/改开源组件（很多云原生工具是 Go）  
- 验证「高并发小 IO」原型，再决定是否值得长期维护  

不写 Go 的时候：主业务迭代、复杂事务、团队全是 Java——别为了履历硬上。

---

## 2. 工程习惯

```
cmd/server/main.go
internal/...      # 不导出
pkg/...           # 可复用才放
go.mod
```

- 配置：环境变量；密钥不进仓库  
- `context` 从入口贯穿到 DB/HTTP 客户端  
- 表驱动测试；关键路径加 `-race`  
- 错误：边界打日志 + metrics；中间返回 `%w`  

---

## 3. 构建与部署

- `CGO_ENABLED=0` 做纯静态（按依赖情况）  
- 多阶段 Docker：builder + scratch/distroless  
- 健康检查、优雅退出（信号 + context cancel）  

## 4. 和 Java 协作

- Go 服务尽量无状态或状态外置  
- 契约：HTTP JSON / gRPC；超时与重试策略对齐  
- 观测：同样要有 request id 与结构化日志  

下一篇：[05 常见问题](./05-faq.md)
