# Python · 04 工程实践

> 和 Java 怎么协作、项目怎么落、怎么测怎么部署。

## 1. 与 Java 的分工（强制想清楚）

| 放在 Java | 放在 Python |
|-----------|-------------|
| 用户、权限、配额、计费状态 | 调模型、拼 Prompt、后处理 |
| 任务表、状态机、可重试权威记录 | 无状态或短生命周期 worker |
| 对前端的主 API | 内部模型代理 / 批处理 Job |

反例：只在 Python 里 `sqlite` 记任务，Java 不知情 → 对账与客服查单灾难。

正例（AI 漫剧类）：

1. Java 创建任务（pending）  
2. Python / 或 Java 调模型（执行中）  
3. 结果回写 Java（成功/失败/可重试原因）  
4. 前端只信 Java 的状态  

---

## 2. 推荐的最小项目结构

```
app/
  main.py           # FastAPI 入口
  api/              # 路由
  schemas/          # Pydantic
  services/         # 调模型、业务胶水
  core/config.py    # 环境变量
tests/
pyproject.toml / requirements.txt
Dockerfile
```

原则：

- 路由瘦、service 胖一点但别做成上帝类  
- 密钥走环境变量；示例用 `.env.example`  
- 模型名、温度、超时做成配置，方便不改代码试参  

---

## 3. 异步任务怎么做（实用档）

| 阶段 | 做法 |
|------|------|
| 最早 | 接口同步调模型（只适合 Demo） |
| 中小 | 任务表（可在 Java）+ 后台协程/进程消费 |
| 更大 | Redis/MQ + 多 worker；死信与告警 |

必须具备：**幂等、超时、重试上限、错误分类、可人工重跑**。

---

## 4. 测试

- 纯函数 / Prompt 组装：pytest  
- HTTP：`TestClient`；外部模型 mock  
- 「黄金样例」：固定输入看输出结构是否仍符合 schema（模型内容可变，结构要稳）  

---

## 5. 依赖与部署

- 锁文件进仓库；CI 用同一锁安装  
- Docker：瘦基础镜像；别把宿主机 venv 拷进镜像思路搞反  
- 配置：`ENV` 区分；生产关 debug、关自动重载  
- 观察：请求日志带 `task_id`；模型耗时、token/费用单独打点  

### 本地开发

- `uvicorn app.main:app --reload`  
- 与 Java 联调：先约定 OpenAPI，再用示例 curl/httpie 固化  

下一篇：[05 常见问题](./05-faq.md)  
速成路线：[Python 技能速成](/tech-system/python/python-skill)
