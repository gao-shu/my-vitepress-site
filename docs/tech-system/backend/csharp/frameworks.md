# C# / .NET 框架总结

> 中小场景常见的是 **ASP.NET 做 Web**、**WinForm/WPF 做桌面**。先认门类，再谈深挖。

---

## ASP.NET Core

- 现代 .NET Web 主线：API、MVC、中间件模型  
- 有 Java Spring Boot 经验时，路由/依赖注入/配置思路可迁移  
- 适合：中小 Web 后台、远程 .NET 维护/二开  

**判断：** 要写 C# 服务端，优先认这条，而不是死磕老 WebForms。

---

## 老 ASP.NET / WebForms（存量）

- 本地信息化、早期外包项目里仍可能遇到  
- 目标是 **能读、能改、能修 bug**，不是当新项目首选  

---

## WinForms

- Windows 桌面快速出活，工厂工具、简单上位机常见  
- UI 老但存量大；中小要的是稳定能跑，不是好看  

**判断：** 洛阳/工控旁路撞上桌面需求时，WinForms 仍是高频现实。

---

## WPF

- 比 WinForms 更现代的 Windows UI（XAML、数据绑定）  
- 上手成本高于 WinForms；新桌面可考虑，老项目看团队存量  

---

## 和 Electron 怎么选（对我）

| 场景 | 更倾向 |
|------|--------|
| 已有 Vue 前端、要跨平台桌面 | Electron（Node/TS） |
| 客户只要 Windows、已有 .NET 代码/控件/驱动封装 | C# WinForms/WPF |
| 纯 Web 中后台 | Java 或 ASP.NET，看项目历史 |

---

## 我的选择

| 场景 | 选择 |
|------|------|
| 新接触的 C# Web | ASP.NET Core |
| 老项目救火 | 按仓库技术栈，WebForms/WinForms 能改就行 |
| 生产主业务域 | 仍默认 **Java + Spring** |
| AI / 脚本 | Python |

**原则：** C#/.NET 为 **侧翼与本地场景** 服务；深度和篇数让给 Java 与后端问题。  
