# 阶段三：MVP Server / 数据中台（模块导航）

> 目标：把“数据接入与清洗”做成一个你能控制的中间层服务，让 Agent 先调你的中台，再调模型。

## 学习顺序

1. [01-为什么需要中台：从“模型乱搜”到“数据可控”](./01-why-mvp-server)
2. [02-接口设计：最小可用的 3 个接口](./02-api-design)
3. [03-数据接入：HTTP 拉取 + 统一结构](./03-data-ingestion)
4. [04-存储与缓存：文件/SQLite/MySQL/Redis 怎么选](./04-storage-cache)
5. [05-串联 Agent：先取 context，再生成答案](./05-integrate-agent)
6. [Checklist：这一阶段合格线](./checklist)

## 你学完应该能做到

- 有一个独立服务项目（Spring Boot/FastAPI/Nest 任一）
- 至少 1 个真实数据源接入并清洗
- 对外提供稳定 JSON 接口，供 LLM/Agent 消费

