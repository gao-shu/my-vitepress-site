# C# · 04 工程实践

## 1. 真实工作中怎么用

- **接维护单**：先搞清 Target Framework、解决方案结构、配置落在哪  
- **改桌面工具**：关注 UI 线程、设备读写超时、日志落盘位置  
- **小 Web 二开**：ASP.NET Core 中间件管道、DI 注册、appsettings  
- **不主动**：用 C# 重写已稳定的 Java 域  

---

## 2. 工程习惯

| 项 | 做法 |
|----|------|
| 项目文件 | 认 SDK 风格 csproj；老 csproj 更啰嗦 |
| 配置 | `appsettings.json` + 环境变量；密钥外置 |
| DI | 构架与 Spring 类似；注意生命周期 Singleton/Scoped/Transient |
| 桌面 | UI 线程不跑重活；`async` 到底，慎用 `.Result` |
| 日志 | 文件 + 关键操作审计（现场不好远程调试） |

### 和设备 / 工控旁路

- 驱动往往只有 Windows/.NET 示例：C# 做采集桥，数据仍可上报 Java  
- 时钟、重连、粘包：和任何设备项目一样，比语言细节更致命  

---

## 3. 构建与发布

- Visual Studio / `dotnet` CLI  
- 桌面：安装包、依赖运行时（自包含 vs 框架依赖）要选清楚  
- Web：IIS / Kestrel / 容器（现代 .NET）按客户环境  

下一篇：[05 常见问题](./05-faq.md)
