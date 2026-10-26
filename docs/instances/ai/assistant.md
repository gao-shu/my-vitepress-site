# AI 智能助手

> 可独立部署的多模型对话助手：三种 Provider 可插拔、SSE 流式输出、Function Calling 工具循环。
> ✅ 已验证（已交付）· 所属 [01 AI 应用](/instances/ai/) · 模块内优先级 2 · 代码 `E:\8.cangku\for-job\ai-assistant`

## 功能清单

| 功能 | 状态 | 能做什么 | 证据 |
|---|---|---|---|
| 多模型接入 | ✅ | OpenAI 兼容网关，OpenAI-Compatible / Echo / Mock 三种 Provider 可插拔；多供应商密钥管理；模型路由与降级；无密钥自动降级 Mock 且不阻塞启动 | 187 个单测全通过 |
| 智能对话 | ✅ | 多轮会话、上下文管理、SSE 流式输出、会话历史查询、会话导出 | E2E 同步 / 流式双通道通过 |
| 工具调用 | ✅ | Function Calling 工具注册与执行、Agent Loop 循环调度、调用记录落库 | E2E 工具列表用例 + 调用链 |
| 登录鉴权 | ✅ | JWT 鉴权，受保护接口统一拦截 | E2E 登录鉴权用例 |
| 文件分析 | ✅ | TXT / MD / CSV / JSON 上传、内容摘要、关键信息抽取 | 已实现；E2E 未单列用例 |
| 多租户 | 📋 | 当前单租户，未做租户隔离 | 待补充 |
| RAG / 向量检索 | 📋 | 不在本项目，独立在 AI 知识库系统 | 见 [AI 知识库系统](/instances/ai/kb) |
| PDF / 图片解析 | 📋 | 仅支持纯文本类格式，无 OCR | 待补充 |

## 待完善

- **存储用 H2 文件库**：适合演示与自测，未切 MySQL / PostgreSQL，并发与迁移能力受限
- **无 RAG 检索**：长文档只能一次性塞进上下文，缺切片、向量化与召回
- **工具为内置注册**：暂不支持 MCP / 外部工具动态接入，新增能力要改代码
- **文件分析覆盖窄**：只有 4 种文本格式，没有 PDF 解析与图片 OCR
- **前端形态单一**：只有单一会话列表，无会话分享、多标签与知识库挂载

## 验证证据

- 单元测试：**187 个全部通过**（28 个测试类）
- E2E：**13 / 13 通过**（`backend/e2e_assistant.py`，覆盖健康检查、登录鉴权、模型列表、工具列表、会话创建、同步 / 流式对话、消息历史、导出等全链路）
- 交付物：`ai-assistant-1.0.0.jar` 可执行包、README / API / TEST-REPORT / ARCHITECTURE 文档、`sql/schema.sql`（4 张表）
- 技术栈：JDK 21 + Spring Boot 3.3.6 + Maven + H2 + JWT；Vue 3.4 + Vite 5 + TS + Element Plus + Pinia
- 运行端口：后端 `8081` · 前端 `5171`

---

上一级：[01 AI 应用](/instances/ai/) · [实例总览](/instances/)
