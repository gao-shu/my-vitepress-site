# Node.js 面试 · 异步与并发

---

## 高频问法

1. 回调地狱怎么解决？  
2. Promise 状态？`all` / `allSettled` / `race`？  
3. async/await 错误怎么捕获？  
4. 如何控制并发（比如同时只 5 个请求）？  
5. 什么会堵住事件循环？怎么查？  
6. `worker_threads` 什么时候用？

---

## 口述参考

### 1）回调 → Promise → async/await

现代代码以 async/await 为主；底层仍是 Promise。  
库若只提供回调，可 `promisify` 包装。

### 2）组合子

| API | 含义 |
|-----|------|
| `Promise.all` | 全成功才成功；一个失败即失败 |
| `allSettled` | 等全部结束，看各自状态 |
| `race` | 谁先结束听谁（含失败） |
| `any` | 谁先成功听谁 |

批量任务要「部分失败也继续」→ `allSettled`。

### 3）错误处理

`try/catch` 包 await；别忘了异步回调里的错误也要接。  
Express 等要有统一错误中间件；Promise 链别留未处理 rejection。

### 4）并发控制

不能无脑 `all` 一千个请求。  
写法：池化（自己写队列 / `p-limit` 一类）；设备采集同样要**限制并发连接数**。

### 5）堵住事件循环

症状：定时器不准、接口全卡、UI（若同进程）冻。  
原因：同步大循环、同步读大文件、`JSON.parse` 巨大字符串、加密算太久。  
处理：拆任务、`setImmediate` 让出、Worker、或把重活丢给 Java/Python 进程。

### 6）worker_threads

真要在 Node 里做 CPU 活，用 Worker 开线程跑；注意序列化开销。  
Electron 里更常见：**主进程小心别堵**，重活丢子进程。

---

## 设备轮询场景（贴项目）

```text
定时采集 → 异步 IO
  → 超时/重连
  → 结果抛到队列
  → UI 只消费状态，不直接死循环读设备
```

金句：**采集别堵渲染；失败要可见。**
