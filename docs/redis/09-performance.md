# 9. 性能：BigKey、HotKey、Pipeline、淘汰

目标：能定位「Redis 变慢 / 内存打满 / 某一分片被打爆」，并给出可落地优化。

相关：[基础原理](./01-basics) · [缓存问题](./cache-issues)

---

## BigKey（大 Key）

**是什么：** 单个 Key 的 value 过大（大 String、上百万字段的 Hash、超长 List 等）。

**危害：** 网络带宽打满、阻塞主线程（大范围读写）、主从复制与迁移变慢、过期/删除卡顿。

**优化：**

- 拆 Key（按用户/时间分片）  
- 删除用 `UNLINK`，避免 `DEL` 堵主线程  
- 禁止 `HGETALL` 拉全量大 Hash，改 `HSCAN`  
- 接入监控：定时扫描或中间件告警大 Key  

---

## HotKey（热点 Key）

**是什么：** 极少数 Key 承担绝大部分访问（爆款商品、首页配置）。

**危害：** 单核/单分片/单网卡打满；Cluster 下槽位倾斜。

**优化：**

- **本地缓存**（Caffeine）挡最热一层  
- 读写分离 / 副本读（注意一致性）  
- 热点 Key 复制多副本（随机后缀）打散  
- 互斥重建，防击穿（见[缓存问题](./cache-issues)）  

---

## Pipeline

把多条命令打包发送，减少 RTT。

适用：批量 `GET`/`SET`、预热、批量写。

注意：Pipeline **不保证原子**；要原子用 Lua/事务（弱）。

---

## 批量操作

| 做法 | 说明 |
|------|------|
| `MGET` / `MSET` | 简单批量；Cluster 跨槽可能受限 |
| Pipeline | 灵活批量，注意错误处理 |
| Lua | 逻辑批量且原子 |
| 分批 | 每批几百，避免一次巨包 |

---

## 内存淘汰

`maxmemory` + 淘汰策略（如 `allkeys-lru`、`volatile-lru`、`noeviction`）。

口述：

> 缓存场景常用 LRU 类策略；设了过期的用 volatile-*。关键数据不能只靠淘汰，该持久化的业务数据在 DB。内存打满要先分清是大 Key、没用的无 TTL Key，还是容量规划不足。

---

## 核心优化清单

1. 上线前评估 Key 大小与基数  
2. 慢查询日志 + 大 Key / 热 Key 巡检  
3. 批量优先 Pipeline，逻辑原子用 Lua  
4. `maxmemory-policy` 与业务一致，监控驱逐与内存水位  
5. Cluster 关注槽位与热点倾斜  

下一步：[实战](./10-practice) · [高可用](./cluster-ha)
