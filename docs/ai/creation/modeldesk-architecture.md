---
title: ModelDesk 架构解析：把多个模型 API 收敛成本地一个 /v1 网关
outline: deep
---

# ModelDesk 架构解析：把多个模型 API 收敛成本地一个 /v1 网关

> 本文基于 ModelDesk（<https://github.com/gao-shu/modeldesk>，MIT）的真实架构与本地验证过程写成。涉及「调用真实模型返回结果」的部分需用户自备 API Key，本人**未**用真实 Key 跑通业务数据；下文的「验证」均指构建 / 单测 / 冒烟层面的可复现证据。

## 一、问题背景

做 AI 应用的人迟早会遇到同一个摩擦：要用多家模型（OpenAI、火山、智谱、本地 Ollama……）。厂商控制台适合测单个模型，但一旦要**对比**多家接口，就得在多个后台、多套 Key、多种返回格式之间来回切换，最后还得手工改调用代码接到业务里。

痛点拆开是三件事：

1. **配置分散**：Key 散落在各处，换机器就重来。
2. **对比困难**：同一问题并行打 2～3 个模型，要自己拼并发、收结果、对齐延迟/Token。
3. **接入割裂**：业务代码要为每个厂商写一套适配。

## 二、方案比较

| 方案 | 做法 | 取舍 |
|---|---|---|
| A. 业务里直接调各厂商 SDK | 最快上手 | 厂商耦合重，换模型要改代码；Key 难统一管理 |
| B. 自建一层适配服务 | 业务只打自己的服务 | 要自己维护服务、部署、Key 存储 |
| C. 本机配测台 + 本地网关 | 配置/测试/对比在桌面完成，业务只打本机 `:3300/v1` | 不解决云端多租户，但**本机开发场景**最省事，零部署 |

ModelDesk 选 **C**：定位是「开发者本机工具」，不碰登录、多租户、云同步。边界清晰，反而好做。

## 三、关键设计

### 3.1 同进程：界面即网关

最省事的一点——**Gateway 和 Web 界面同进程**，默认都在 `http://127.0.0.1:3300`。业务代码指向 `:3300/v1`，不需要再起一个独立网关服务；想要无头 HTTP，也有独立的 `modeldesk-gateway`（`:3310`），契约相同。

```text
业务 / 脚本 / Cursor / MCP
        ↓ 只打一个地址
http://127.0.0.1:3300/v1   ← OpenAI 兼容
        ↓
ModelDesk（已配好模型与 Key）
        ↓
各厂商 API
```

### 3.2 统一契约 + 别名

业务里 `model` 字段可以填三种东西：**稳定别名**、台账 UUID、或唯一配置名。先把常用模型绑成别名：

```bash
curl -s -X PUT http://127.0.0.1:3300/v1/aliases \
  -H "Content-Type: application/json" \
  -d '{"llm-default":"<text-registry-id>","image-default":"<image-registry-id>"}'
```

之后业务写死 `llm-default` / `image-default`，换模型只改别名、不动业务代码。上游 Key 只用 Desk 里已保存的——请求里即使带 Key 也不会被用来调厂商，避免把调用方 Key 误用出去。

### 3.3 本地优先的安全边界

- API Key **本地存储**，落盘加密；
- 默认只监听 `localhost`，不暴露公网；
- 无登录、无多租户云同步。

这是「本机工具」定位带来的天然安全优势：敏感 Key 不出本机。

### 3.4 monorepo 模块拆分

```text
apps/web         Next 界面（Playground / Compare / Models / Settings）
apps/desktop     Tauri 桌面壳（需 Rust）
apps/gateway     无头网关（可选）
apps/cli · mcp   命令行 / MCP 入口
packages/run-core       run 编排：并发、部分失败保留
packages/adapters       厂商 / 协议适配
packages/model-registry 配置名 ↔ 网关 model id、别名
packages/object-storage / tos-storage  产物 / 对象存储
packages/shared         导航、类型
packages/gateway-client TS 客户端（baseUrl → :3300）
```

界面 → `run-core` → `adapters` + `model-registry` → 加密 Key / SQLite，这条主链路把「配置、测试、对比、选用」串起来。

## 四、实际实现里的两个难点

### 4.1 Compare 的并发编排与「部分失败保留」

对比页用相同输入并行跑 2～3 个同模态模型。难点不在「并发」，而在**一路失败不能拖垮其他路**：某模型超时或报错，其他列仍要正常展示结果与指标。这在 `run-core` 里通过「每个 job 独立 try/catch、聚合时标记 partial」实现，也是单测重点覆盖的路径。

### 4.2 适配器与注册表解耦

新增一个厂商，本质是加一个 `adapter` + 在 `model-registry` 登记映射，界面与网关契约不动。这让「支持更多模型」变成可增量扩展的能力，而不是改核心。

## 五、验证结果（本地复现）

我在本地按官方流程跑了一遍，结论可复现：

| 命令 | 结果 |
|---|---|
| `pnpm install`（Node 22 + pnpm 9.15.0） | 619 包，52.8s，成功 |
| `pnpm test:unit` | 4 包共 **93 测全过**（run-core 31 / adapters 36 / object-storage 20 / tos-storage 6），0 失败 |
| `pnpm smoke` | **2/2**（web.home、web.models 均 200） |
| `pnpm build` | 生产构建成功，产出 `/models`、`/runs/compare`、`/v1/[...path]`、`/healthz` |

> 诚实边界：以上验证覆盖「能装、能构建、页面能渲染、核心单测通过」。**真实模型的返回质量/延迟对比**依赖用户自备 Key，我未做该部分验证，也不在本文声称。

## 六、局限与改进空间

- **不解决云端场景**：本机工具定位，没有登录/多租户/云同步，团队共用需另起服务。
- **不做 AI 裁判**：Compare 只并排展示事实（结果/延迟/Token/错误），不做自动评分或排名——这是产品冻结时的明确边界。
- **桌面端依赖 Rust/Tauri**：纯 Web 可 `pnpm dev`，但要打安装包需 Rust 工具链。

## 七、小结

把「多模型配置 + 对比 + 接入」收敛成本机一个 `:3300/v1`，核心价值不是又包了一层，而是**让业务代码只依赖一个稳定契约和一个别名机制**，模型供应商的变动被隔离在 Desk 之内。配合本地优先的安全设计，它对「单人多模型开发」场景是低成本、低风险的选型。

- 项目详情页：[ModelDesk · 本机多模态 AI 配测台](/apps/ai/modeldesk)
- 仓库：<https://github.com/gao-shu/modeldesk>
