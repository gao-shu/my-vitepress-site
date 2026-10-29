# 多端应用与现场交付

> 把系统送到手上、装到机器旁 —— 移动端、小程序、桌面端、上位机与离线协同。

本类只讲**端上技术与交付**：扫码采集、离线存储与同步、自动更新、串口通信、打包分发。业务实现（MES 报工、仓储出入库、设备点检）分别归 [工业数字化应用](/apps/industrial/) 与 [企业业务应用](/apps/business/)，端侧只负责落地。

| 子域 | 讲什么 | 文章 |
|---|---|---|
| 移动端与手持终端 | Android 原生、工业 PDA、扫描引擎与设备选型 | [PDA 移动端应用开发](/apps/terminal/pda-app) · [扫码采集与扫描引擎对接](/apps/terminal/scanner-sdk) |
| 小程序与轻应用 | 登录态、环境配置、审核发布、低端机性能 | [微信小程序开发实践](/apps/business/mini-program) |
| 桌面客户端 | Electron 进程模型、自动更新、打包分发（Tauri 规划中） | [Electron 桌面客户端实践](/apps/terminal/electron-desktop) |
| 上位机与设备交互 | WPF/WinForms、串口网口通信、实时刷新 | [C# 上位机界面开发](/apps/terminal/csharp-hmi) |
| 离线与协同 | 本地优先存储、变更队列、冲突解决、端云一致 | [离线优先设计](/apps/terminal/offline-first) · [Web 与 PDA 协同](/apps/terminal/web-pda-sync) |

## 各端技术栈

| 平台 | 主力语言 | 常用框架 | 本站取舍 |
|---|---|---|---|
| Android | Kotlin（存量为 Java） | Jetpack Compose / XML + View | 工业 PDA 的唯一现实选择，厂商扫描 SDK 只提供 Android AAR |
| iOS | Swift（存量为 Objective-C） | SwiftUI / UIKit | 制造业项目基本用不到，暂不单独立文 |
| 微信小程序 | TypeScript / JavaScript + WXML + WXSS | 原生小程序、Taro、uni-app | 已有实践，见小程序子域 |
| 跨端 App | Dart（Flutter）· Vue（uni-app）· React（Taro） | 自绘或原生桥接 | 适合通用产品；PDA 需自写原生插件，不推荐 |
| 桌面客户端 | TypeScript（Electron）· Rust（Tauri） | Chromium + Node / 系统 WebView | Electron 已有实践，Tauri 规划中 |
| 上位机 | C# | WPF / WinForms | 工控现场生态最匹配 |

**项目状态图例**：✅ 已验证（有运行/测试证据） · 🔧 验证中/在建（代码存在，证据整理中） · 📋 规划中（尚未开始）

## 📋 规划中

| 项目 | 状态 | 说明 |
|---|---|---|
| text-manager 文本管理工具 | 📋 待验证整理 | TypeScript + Tauri 桌面应用，代码已在 GitHub 公开，构建/运行/测试验证后补充为案例 |

## 📋 技术实践

| 文章 | 解决的问题 |
|------|------------|
| [PDA 移动端应用开发](/apps/terminal/pda-app) | 扫码兼容、离线缓存与同步、弱网处理、现场接口设计与部署 |
| [扫码采集与扫描引擎对接](/apps/terminal/scanner-sdk) | 三条取码路线怎么选、统一桥接层、GS1 与 DPM 解析、去抖与业务幂等 |
| [微信小程序开发实践](/apps/business/mini-program) | 登录态与授权、后端接口联调、体验版与发布流程、常见审核与性能问题 |
| [Electron 桌面客户端实践](/apps/terminal/electron-desktop) | 主/渲染进程分工、自动更新、本地存储与托盘、与后端联调、打包分发 |
| [C# 上位机界面开发](/apps/terminal/csharp-hmi) | WinForms/WPF 选型、串口与网口通信、实时数据刷新、业务系统对接、异常与日志 |
| [Web 与 PDA 数据协同](/apps/terminal/web-pda-sync) | 任务分发与回传、状态一致性、冲突处理、条码与二维码数据流 |
| [离线优先的终端应用设计](/apps/terminal/offline-first) | 本地优先存储、变更队列与增量同步、冲突解决策略、重连补偿 |

---

上一级：[应用矩阵](/apps/)
