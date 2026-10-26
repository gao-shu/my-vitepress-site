# AI 工作流与智能体平台

> 状态：✅ 已验证（已交付） · 所属模块：[01 AI 应用](/instances/ai/) · 模块内优先级：第 3 位
> 交付位置：`E:\8.cangku\for-job\ai-agent-platform`

## 核心功能

| 功能 | 交付说明 |
|---|---|
| 工作流编排 | DAG 工作流设计、节点编排、条件分支与循环、变量上下文传递、节点级超时保护 |
| 智能体配置 | 角色设定、提示词模板、模型选择、Agent Loop 工具调用循环 |
| 工具调用 | 工具注册中心、参数 schema、执行结果回传、调用记录落库 |
| 任务自动化 | 模板导入导出、同步/流式执行、执行日志与回溯、定时调度开关 |

## 技术栈

- 后端：JDK 21 + Spring Boot 3.3.6 + Maven + H2 + JWT 鉴权
- 编排引擎：节点执行器注册表（Start / End / LLM / Tool / Condition / Loop 六种）+ 线程池隔离 + 超时守卫
- 前端：Vue 3.4 + Vite 5 + TypeScript + Element Plus + Pinia + vue-router + @vue-flow/core 流程画布
- 运行端口：后端 `8083`，前端 `5173`

## 关键设计

- **引擎与业务解耦**：工作流引擎只依赖 `NodeExecutor` 接口，新节点类型注册即用
- **变量与表达式**：节点间通过 `VariableResolver` 传递上下文，条件节点支持表达式求值
- **无密钥降级**：LLM 节点未配置密钥时走 Mock 响应，工作流仍可完整跑通

## 验证证据

- 单元测试：**244 个测试全部通过**（33 个测试类）
- E2E 测试：**12 / 12 通过**（`backend/e2e_agent.py`，覆盖智能体 CRUD、模板导入、工作流校验、同步执行等全链路）
- 交付物：`ai-agent-platform-1.0.0.jar` 可执行包、README / API / TEST-REPORT / ARCHITECTURE 文档

## 建设状态

✅ 已交付：编排 + 配置化闭环达成，`doc-summary` 模板工作流 E2E 实测跑通（全节点 SUCCESS）。

---

上一级：[01 AI 应用](/instances/ai/) · [实例总览](/instances/)
