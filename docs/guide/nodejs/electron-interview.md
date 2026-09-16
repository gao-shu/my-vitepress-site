# Electron 面试 · 桌面与上位机

> 对你简历里「Electron 上位机」很关键，建议能讲满 5 分钟。

---

## 高频问法

1. Electron 主进程、渲染进程、预加载脚本？  
2. 为什么强调安全（contextIsolation / contextBridge）？  
3. 主进程和渲染进程怎么通信？  
4. 崩溃、卡死怎么排查？  
5. 自动更新、打包你了解多少？  
6. 上位机连设备时架构怎么放？

---

## 口述参考

### 1）三层

| 角色 | 职责 |
|------|------|
| 主进程 | 窗口生命周期、菜单、部分原生/设备、单例 |
| 渲染进程 | UI（可 Vue） |
| preload | 中间桥：只暴露安全 API 给页面 |

### 2）安全

- `nodeIntegration: false`  
- `contextIsolation: true`  
- 用 `contextBridge.exposeInMainWorld` 暴露有限方法  

页面若能直接 `require('fs')`，XSS ≈ 本地任意代码执行。

### 3）IPC

`ipcMain` / `ipcRenderer`（经 preload 包装）。  
约定：渲染发「请求」，主进程执行特权操作后回传。  
别把整颗 Node 能力透出。

### 4）排查

- 主进程日志与渲染 DevTools 分开看  
- 卡死：是不是主进程同步堵了、设备读写死等  
- 崩溃：看 crash dump / 版本兼容（Electron 大版本跨度大）  

### 5）打包与更新

知道 electron-builder 一类打包；自动更新要签名与喂养渠道。  
面试说「我们用过打包发布，细节按项目」即可，没有就别编。

### 6）上位机 + 设备（重点）

推荐口述架构：

```text
设备(PLC/仪表)
  ↔ 主进程或独立 Node 子进程（协议、重连、队列）
  ↔ IPC/本地端口
  ↔ 渲染进程 UI（状态展示、人工操作）
  ↔ 可选：上报 Java 后端 / MQTT
```

要点：

- 协议与 UI 解耦  
- 超时、断线重连、点表配置化  
- 写设备要确认，防误操作  

可链：[Modbus Node](/tech-system/integration/modbus-tcp-node-plc)

---

## 追问预备

- 「为什么不用纯 Web？」→ 要本地权限、连现场设备、离线。  
- 「和 Java 客户端比？」→ 前端栈复用快；复杂工业可 Java+WebView，我们选 Electron 是团队技能折中。
