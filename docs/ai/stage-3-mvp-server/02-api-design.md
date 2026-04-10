# 02 接口设计：最小可用的 3 个接口

> 目标：不要一上来做“大而全”，先用 2～3 个接口跑通闭环。

## 1）推荐的 3 个接口（足够你前期使用）

- `GET /health`
  - 返回 `ok`
- `GET /modules`
  - 返回模块列表（java/database/redis/...）
- `GET /context?module=xxx&limit=20`
  - 返回该模块的内容片段（标题、路径、摘要、正文片段）

## 2）统一输出结构（非常关键）

你对外返回的数据结构要稳定，比如：

- `id`
- `title`
- `source_path`
- `snippet`
- `tags`

> 结构稳定后，你的 Agent/Prompt 就不会经常改。

