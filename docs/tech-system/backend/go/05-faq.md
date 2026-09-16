# Go · 05 常见问题

| 问题 | 怎么看 |
|------|--------|
| goroutine 泄漏 | 没退出条件 / channel 未关闭 / 没听 context.Done |
| 数据竞争 | `go test -race`；共享 map 加锁或改为 channel 所有权 |
| 错误处理啰嗦 | 可接受；包装上下文，别裸 `return err` 丢信息 |
| slice 意外共享 | append 与底层数组；理解 cap |
| nil map 写入 panic | 先 make |
| 要不要上 ORM | 小服务 database/sql + 轻封装往往够 |
| 和 Java 比谁快 | 多数业务无感；选生态与团队，别只选跑分 |
| channel 死锁 | 收发双方与缓冲要想清；prefer context 超时 |

相关：[01](./01-basics.md) · [02](./02-core.md) · [03](./03-frameworks.md) · [04](./04-engineering.md) · [后端问题](../problems/)
