# C# · 03 框架与生态

> 中小场景常见：**ASP.NET 做 Web**、**WinForm/WPF 做桌面**。先认门类，再谈深挖。

## 1. ASP.NET Core

- 现代 .NET Web 主线：API、MVC、中间件模型  
- 有 Java Spring Boot 经验时，路由 / DI / 配置思路可迁移  
- 适合：中小 Web 后台、远程 .NET 维护/二开  

**判断：** 要写 C# 服务端，优先认这条，而不是死磕老 WebForms。

## 2. 老 ASP.NET / WebForms（存量）

- 本地信息化、早期外包项目里仍可能遇到  
- 目标是 **能读、能改、能修 bug**，不是当新项目首选  
- 页面生命周期、ViewState 等概念与现代 MVC 不同，撞上再查  

## 3. WinForms

- Windows 桌面快速出活，工厂工具、简单上位机常见  
- UI 老但存量大；中小要的是稳定能跑，不是好看  

**判断：** 洛阳/工控旁路撞上桌面需求时，WinForms 仍是高频现实。

## 4. WPF

- 比 WinForms 更现代的 Windows UI（XAML、数据绑定）  
- 上手成本高于 WinForms；新桌面可考虑，老项目看团队存量  

---

## 5. 和 Electron 怎么选（对我）

| 条件 | 更倾向 |
|------|--------|
| 已有 Vue/TS，要跨平台 UI | **Electron** |
| 强绑 Windows 控件 / 现场驱动 / 存量 WinForms | **WinForms/WPF** |
| 既要本地设备又要现代 Web UI | Electron 本地服务 + 可选 C# 驱动桥（看驱动 API） |

| 场景 | 选择 |
|------|------|
| 新的中小 Web（恰好 .NET 团队） | ASP.NET Core |
| 老 WebForms | 维护为主 |
| 工厂小工具桌面 | WinForms 常见 |
| 我的默认主 Web | 仍是 **Java + Spring Boot** |

下一篇：[04 工程实践](./04-engineering.md)
