# C# · 02 核心能力

## 1. 运行时：CLR / .NET

| 线 | 说明 |
|----|------|
| **.NET**（现代，跨平台） | 新项目、ASP.NET Core 主线 |
| **.NET Framework**（偏 Windows） | 本地信息化、老外包存量大量存在 |

对中小交付：能分清项目跑在哪套 runtime、目标框架（Target Framework），比背语法重要。  
和 JVM 类似：**语言是 C#，平台是 CLR/.NET**。

### 版本混乱是常态

- 老项目 `net48`、新项目 `net8.0` 可能同场  
- NuGet 包要匹配目标框架；升级要评估 WinForms 控件与第三方驱动  

---

## 2. 适合什么 / 不适合什么

| 适合 | 不适合（对我而言） |
|------|-------------------|
| Windows 桌面工具、WinForm/WPF 上位机 | 用 C# 重写已有 Java 主业务 |
| 维护/二开本地 .NET 信息化 | 当大厂八股主战场 |
| 部分 ASP.NET 中小 Web | 和 Electron 抢「所有桌面」（能 Electron 就不必强上） |
| 远程 .NET 维护类岗位的入门筹码 | AI 胶水首选（仍让 Python） |

---

## 3. 我为什么学 C#

1. **洛阳 / 制造向中小**：Windows + 上位机/.NET 存量真实存在  
2. 有 Java 底子，语言本身不难，难在 **生态与老项目**  
3. 与 Java 分工：Java 扛 Web 主域；C# 扛撞上的 Windows/.NET 活  
4. 篇数保持「够接、够改、够讲清判断」；深度让给主栈 Java  

下一篇：[03 框架与生态](./03-frameworks.md)
