# 库存并发扣减与防超卖

> 面向 WMS / 电商 / 票务的库存扣减：高并发下不超卖、余额与流水一致。关联实例：[WMS 仓储管理](/instances/industrial/wms)。

## 问题

- 多人同时出库 / 下单，`stock` 被并发修改，出现**超卖或负库存**。
- 余额与流水对不上：扣了库存没落流水，或流水与余额不一致，无法对账。

## 方案对比

| 方案 | 做法 | 优点 | 缺点 |
|---|---|---|---|
| 悲观锁 | `select ... for update` | 简单、强一致 | 锁范围大、并发差 |
| 乐观锁 | `version` / CAS 条件更新 | 无锁、并发好 | 冲突需重试 |
| 分布式锁 | Redis `SETNX` | 跨实例互斥 | 锁粒度 / 续期复杂 |
| 预扣 + 异步 | `reserved` 预占，MQ 异步落库 | 削峰、体验好 | 最终一致 |

## 推荐做法

1. 余额拆成 `total / reserved / available`，`available = total - reserved - locked`。
2. 扣减用 **CAS 条件更新**，影响行数为 0 即失败（拒绝或重试）：

```sql
UPDATE wms_stock SET available = available - #{n}
WHERE sku_id = #{sku} AND batch_id = #{batch} AND available >= #{n};
```

3. 流水 `wms_stock_flow` **只 append**，不 update / delete，作为对账依据。
4. 超高并发先用 Redis 预扣，再 MQ 异步落库（见 [秒杀系统架构](/scenarios/seckill)）。

## 取舍

- 强一致优先 → 乐观锁 + 事务；吞吐优先 → 预扣 + 最终一致。
- 预扣会引入「超时释放」逻辑，复杂度上升。

## 关联

- [接口幂等性设计](/scenarios/api-idempotent)（重复提交导致重复扣减）
- [秒杀系统架构](/scenarios/seckill)（内存预扣 + 异步落库）
- 实例：[WMS 仓储管理](/instances/industrial/wms)

---

上一级：[解决方案总览](/scenarios/)
