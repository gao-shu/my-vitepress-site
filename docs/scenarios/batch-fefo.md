# 批次效期与 FIFO / FEFO 追溯

> 同物料多批次时，出库发哪批、效期怎么控、质量如何追溯。关联实例：[WMS 仓储管理](/instances/industrial/wms)。

## 问题

- 同 SKU 多批次混放，出库随意取，导致**临期 / 过期先发或后发**。
- 质量问题需要追溯：某批次流向哪些订单？某订单用了哪些批次？

## 方案

- **批次记账**：库存按 `(sku, batch)` 维度记录；批次表存批号 / 生产日期 / 效期 / 状态。
- **分配策略**：
  - **FIFO**：按入库时间先进先出（`order by inbound_time`）
  - **FEFO**：按效期先到期先出（`order by expire_date`）—— 食品 / 医药首选
  - **指定批次**：客户或质量要求指定
- **追溯**：流水记录批次，支持**正查**（批次 → 订单）与**反查**（订单 → 批次）。

## 落地要点

```sql
-- FEFO 分配候选：先到期先出
SELECT batch_id, available FROM wms_stock
WHERE sku_id = #{sku} AND available > 0 AND expire_date > NOW()
ORDER BY expire_date ASC;
```

- 批次表 `wms_batch`（批号、效期、状态）；`wms_stock` 增加 `batch_id`。
- 效期索引 `(sku_id, expire_date)`，避免全表扫描。

## 取舍

- 批次粒度越细，库存查询与调拨越复杂；无批次要求的行业可退化到 SKU 维度。

## 关联

- [库存并发扣减与防超卖](/scenarios/inventory-deduction)（按批次扣减）
- 实例：[WMS 仓储管理](/instances/industrial/wms)

---

上一级：[解决方案总览](/scenarios/)
