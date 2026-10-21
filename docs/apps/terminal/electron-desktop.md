# Electron 桌面客户端实践

## 背景与问题

桌面客户端在工厂、门店、调度室场景里仍有一席之地：要常驻后台、要读写本地文件、要串口/扫码枪、要离线也能打开。用 Web 技术做界面，选 Electron 基本是「用熟悉的前端成本换一个跨平台壳」，但它有几个必须提前想清楚的问题：

- **安全边界**：渲染进程里跑的是网页，`nodeIntegration` 一开，任何 XSS 都等于本机任意代码执行。内网系统也不能裸奔——内网也有横向移动。
- **更新是最大运营成本**：客户装的版本不统一，出了 bug 你不知道现场跑的是哪版。没有自动更新，每次改动都要人跑一趟现场。
- **本地数据与托盘**：业务员的草稿、缓存、配置放哪？关窗口是退出还是缩到托盘？多开怎么办？
- **和后端联调**：跨域、证书、登录态、长连接，浏览器里能跑不代表打包后能跑。
- **打包分发**：安装包签名、自动更新通道、内网无外网源的更新方式，都要在选型时定。

## 方案设计

**架构：主进程与渲染进程分工明确**

```
主进程（Node.js 环境）
 ├─ 窗口/托盘/菜单生命周期
 ├─ 系统能力：文件、串口、更新、打印、开机自启
 ├─ IPC 白名单（ipcMain.handle 暴露有限方法）
 └─ 登录态、配置的持久化
        ↕ contextBridge / ipcRenderer（仅白名单 API）
渲染进程（Chromium，无 Node）
 └─ 纯前端业务界面（Vue/React），通过 window.api 调能力
```

选型原则：

- `contextIsolation: true`、`nodeIntegration: false` 为默认，不因图省事打开；渲染层要用的系统能力一律走 `preload` 暴露的白名单方法。
- 界面沿用团队已有的 Vue/React 栈，不引入额外框架。
- 更新用 `electron-updater` + 自建静态文件源（内网环境不能依赖 GitHub release）。

**关键决策**：单实例锁（`requestSingleInstanceLock`），调度类工具双开会把状态搞乱；关窗最小化到托盘，托盘菜单给「退出」，退出前提示未回传数据；本地数据用 SQLite（可查询、可批量）而不是一堆 JSON 文件，配置类小数据用 `electron-store`；更新分「静默下载 + 下次启动生效」与「强更」两档，接口不兼容才强更。

## 关键实现

**1. preload 白名单暴露**

```typescript
// preload.ts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadTasks: () => ipcRenderer.invoke('tasks:list'),
  saveDraft: (draft: unknown) => ipcRenderer.invoke('tasks:saveDraft', draft),
  onPush: (cb: (data: unknown) => void) =>
    ipcRenderer.on('push:data', (_e, data) => cb(data)),
});
```

主进程侧 `ipcMain.handle('tasks:list', ...)` 逐个实现，不提供通用 `invoke(channel, payload)` 透传，防止渲染层被攻破后任意调用。

**2. 托盘与单实例**

```typescript
if (!app.requestSingleInstanceLock()) app.quit();
app.whenReady().then(() => {
  const win = createWindow();
  const tray = new Tray(path.join(__dirname, 'tray.png'));
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: '显示主窗口', click: () => win.show() },
    { label: '退出', click: () => app.quit() }]));
  win.on('close', (e) => { if (!app.isQuitting) { e.preventDefault(); win.hide(); } });
});
```

**3. 自动更新（内网静态源）**

```typescript
// 主进程
autoUpdater.setFeedURL({ provider: 'generic', url: 'http://fileserver.internal/app/' });
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.on('update-downloaded', () => win.webContents.send('update:status', 'ready'));
```

`electron-builder` 产出 `latest.yml` + 安装包放到内网文件服务器，客户端启动时和每小时各检查一次；更新日志里带版本号与最低兼容接口版本，便于排查现场问题。

**4. 本地存储分工**

- 结构化业务数据（任务、草稿、日志）→ SQLite，主进程用 `better-sqlite3` 同步访问，写入用事务；
- 用户偏好（窗口尺寸、服务器地址）→ `electron-store`；
- 敏感信息（token）→ `safeStorage`（走系统钥匙串/DPAPI），不落明文。

**5. 与后端联调**

- 开发期配代理（Vite/webpack devServer proxy），避免打包后才发现跨域；内网自签证书在主进程 `certificate-error` 事件里按指纹白名单放行，**不要无脑 `event.preventDefault()`**；
- 登录态由主进程持有并注入请求头，渲染层看不到 token；
- 长连接（WebSocket/SSE）放主进程维护，断线重连与托盘通知在主进程做，窗口隐藏也不中断。

**6. 打包分发**

- `electron-builder`：Windows 出 NSIS 安装包 + 签名（不签名会被 SmartScreen 拦），macOS 出 dmg/zip（更新需要 zip），Linux 出 AppImage；CI 上跑打包，产物连同 `latest.yml` 发布到更新源；
- 安装包内不带任何环境配置，服务器地址首启引导或从配置文件读取，一套包发所有环境。

## 落地效果（示意）

| 维度 | 做法落地后的预期（示意） |
|------|--------------------------|
| 版本一致性 | 更新源发版后，客户端自动下载，现场无需逐台重装 |
| 安全性 | 渲染层无 Node 权限，IPC 白名单，token 不出主进程 |
| 断网体验 | SQLite 本地可读写，恢复后与后台对账回传 |
| 运维定位 | 关于页显示版本号 + 数据库版本，远程排查有依据 |

实际收益要看更新成功率与现场支持次数，上线后按版本分布统计才能确认。

## 小结

Electron 项目的技术风险集中在三处：**进程边界**（权限不外泄）、**更新链路**（发得出去、回得来）、**本地数据**（存得下、对得上）。界面反而是最不用担心的部分——就是团队熟悉的前端。先把 IPC 白名单、自动更新、单实例托盘这套骨架搭好，业务功能再往上堆，后期才不用为「现场版本太旧」和「安全性补丁」反复救火。
