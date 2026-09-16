# C# · 05 常见问题

| 问题 | 怎么看 |
|------|--------|
| Framework vs .NET | 先看目标框架；NuGet 与 API 面不同 |
| 桌面卡死 | UI 线程跑了重 IO/计算；改用 async 或后台线程 |
| `.Result` / `.Wait()` 死锁 | UI 或同步上下文下常见；async 贯通 |
| 依赖注入找不到服务 | 生命周期或未注册；Scoped 误作 Singleton 持有 |
| 配置没读到 | 环境名、json 层级、用户机密覆盖 |
| 老 WebForms 无从下手 | 先复现 bug，再局部改；别一上来大重构 |
| 要不要用 C# 重写 Java | 默认否；只有场景与团队强绑 .NET 才考虑 |
| 和 Electron 抢桌面 | 已有 TS 栈优先 Electron；强 Windows 控件再 C# |

相关：[01](./01-basics.md) · [02](./02-core.md) · [03](./03-frameworks.md) · [04](./04-engineering.md) · [后端问题](../problems/)
