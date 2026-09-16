# 判断记录

挂在 **Mini MES** 上的架构决策与否决项。先写清「为什么」，再写代码验证；验证后把状态从 🔵 改为 🟢。

## 第一批（写完即停笔去写代码）

| # | 标题 | 状态 |
|---|------|------|
| 01 | [V0 为何 Gateway → HTTP → Spring Boot](./01-v0-gateway-http) | 🔵 设计中 |
| 02 | [为何暂不用 MQTT / EMQX](./02-no-mqtt-yet) | 🔵 设计中 |
| 03 | [Redis 与 MySQL 分别存什么](./03-redis-vs-mysql) | 🔵 设计中 |
| 04 | [为何暂不用 TDengine](./04-no-tdengine) | 🔵 设计中 |
| 05 | [为何第一版不做微服务](./05-no-microservice) | 🔵 设计中 |

模板：背景 → 候选 → 判断 → 适用/不适用 → 验证状态 → 关联 Lab / 代码。
