# Node.js / TypeScript 面试总览

就业指南专题：按**开口能讲**准备。对齐 **Electron 上位机、Node 调设备、TS 工程化**，不卷框架源码。

---

## 怎么用

| 顺序 | 页 | 目的 |
|------|-----|------|
| 0 | [高频快答](./quick-qa) | 一面 30～60 秒 |
| 1 | [Node 基础与事件循环](./basics-interview) | 运行时、模块、循环、缓冲 |
| 2 | [TypeScript](./typescript-interview) | 类型、interface/type、泛型、工程配置 |
| 3 | [异步与并发](./async-interview) | Promise、并发控制、别堵事件循环 |
| 4 | [Electron 与桌面](./electron-interview) | 主/渲染进程、安全、和设备通信 |
| 5 | [实战场景题](./scenario-interview) | BFF、本地服务、设备桥、排错 |
| 6 | [项目讲述](./project-story) | 上位机 / MES 多端怎么讲 |

---

## 30 秒定位（可背）

> 我用 Node/TS 做桌面上位机和设备侧协作：Electron 主进程跑 Node，渲染进程做界面；设备通信注意重连、超时，避免堵死 UI。类型用 TypeScript 做接口约束；重业务与事务仍以 Java 为主。

---

## 和本站

- [Vue 面试](/resume/vue-interview)  
- [Modbus Node 示例](/tech-system/integration/modbus-tcp-node-plc)  
- [Python 面试](/guide/python/)  
- [工业数字化](/tech-system/industrial-digitalization/)  
