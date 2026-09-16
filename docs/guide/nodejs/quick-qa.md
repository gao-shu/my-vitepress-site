# Node.js / TS 面试 · 高频快答

---

## 定位

**Q：Node 用到什么程度？**  
A：能写工具服务、Electron 主进程、设备通信脚本；不是专职 Node 中台，核心业务 Java。

**Q：TS 呢？**  
A：项目里用 TS 做类型与接口；会 interface、联合类型、基本泛型；少用 `any`。

---

## Node

**Q：Node 和浏览器 JS？**  
A：都是 JS；Node 无 DOM、有 fs/net/process；浏览器有 DOM、无任意系统权限。

**Q：事件循环？**  
A：非阻塞 IO，忙完进队列回调；适合高并发 IO；重 CPU 会堵循环。

**Q：CJS vs ESM？**  
A：`require` vs `import`；项目统一一种；TS 编译配置要匹配。

---

## 异步

**Q：Promise / async-await？**  
A：用 async-await 写异步流程；注意 try/catch；并发用 Promise.all 并想清失败策略。

**Q：如何避免堵事件循环？**  
A：大计算拆出去；同步读大文件慎用；设备轮询别在渲染进程死循环。

---

## Electron

**Q：主进程 / 渲染进程？**  
A：主进程 Node 管窗口与系统；渲染进程是页面；用 preload + contextBridge 暴露有限 API。

**Q：为什么别开 nodeIntegration？**  
A：页面被 XSS 后等于拿到 Node 权限，风险极大。

---

## 项目

**Q：你项目里 Node 干什么？**  
A：见 [项目讲述](./project-story)；钢瓶 MES 上位机是好钩子。
