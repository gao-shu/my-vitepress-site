# Node.js 面试 · 基础与事件循环

---

## 高频问法

1. Node.js 架构大概是怎样的？  
2. 事件循环阶段（口述版即可）？  
3. `process.nextTick`、`setImmediate`、`setTimeout` 差别？  
4. Buffer 是什么？  
5. Stream 解决什么问题？  
6. CommonJS / ESM 混用坑？  
7. 全局对象和模块缓存？

---

## 口述参考

### 1）架构（简版）

JS 代码跑在 V8；IO 等多靠底层线程池/系统能力，通过事件循环把结果回调回 JS 线程。  
一句话：**单线程执行 JS + 非阻塞 IO。**

### 2）事件循环（面试够用版）

每个循环处理到期定时器、IO 回调、check（setImmediate）等阶段；微任务（Promise）会在阶段之间优先清空。  
不必背完整阶段名，但要懂：**同步代码先跑完，再处理队列；长时间同步会卡死一切回调。**

### 3）nextTick / setImmediate / setTimeout

- `nextTick`：当前操作后尽快（微任务队列，优先很高）  
- `setTimeout(fn, 0)`：进定时器队列，尽快但受循环阶段影响  
- `setImmediate`：check 阶段  

实战少纠结精确顺序；原则是**别用 nextTick 递归把 IO 饿死**。

### 4）Buffer

处理二进制数据（文件、TCP）。注意编码 `utf8`；拼接与长度；避免把巨大 Buffer 无脑转字符串占内存。

### 5）Stream

流式读写，管道 `pipe`/`pipeline`，适合大文件拷贝、上传下载，降低内存峰值。

### 6）模块系统

老项目 CJS 多；新项目 ESM。  
TS 的 `module`/`moduleResolution` 配错会「本地能跑 CI 挂」。  
互操：知道 ESM 里加载 CJS 的常见限制即可。

### 7）模块缓存

`require` 同一路径会缓存实例；改配置热更新要注意清缓存或重启进程——Electron 开发时也常见。

---

## 追问预备

- 「Node 能写 CPU 密集？」→ 能但不适合主力；可 `worker_threads` 或外部服务。  
- 「集群？」→ `cluster` 多进程利用多核；桌面端少用，服务端才常见。
