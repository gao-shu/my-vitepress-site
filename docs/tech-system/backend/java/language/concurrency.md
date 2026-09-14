# 并发模型

> Java 并发是 **线程 + 共享内存** 为主。

## 我常用的几块

- `synchronized` / Lock：互斥  
- `volatile`：可见性与有序，不保证复合操作原子性  
- 线程池：资源边界，别裸 `new Thread`  

## 和其它模型比

| | 模型 |
|--|------|
| Java | 线程 + 共享内存（重，但匹配企业共享状态） |
| Go | Goroutine + Channel |
| Node | 事件循环 |

## 我的用法

- 业务默认：单线程请求模型 + 必要时线程池  
- 复杂编排（如 AI 任务）：队列 / 状态机，而不是在接口里狂开线程  

相关：[后端问题 · 并发](/tech-system/backend/problems/concurrency)  
