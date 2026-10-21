---
title: ModelDesk · 本机多模态 AI 配测台
outline: deep
---

# ModelDesk · 本机多模态 AI 配测台

> **项目状态**：已发布（GitHub Release v0.2.1 安装包；源码 0.2.3）· 可运行验证已完成（本地 install / unit / smoke / build 全部通过）
> 角色：项目作者 / 全栈开发。这是一个面向开发者的本机工具，不是聊天产品。

ModelDesk 把「配置模型 → 测试模型 → 对比模型 → 选用模型 → 接入应用」这条链路收进一个本机配测台：一处配置 Text / Image / Audio / Video 相关 API，用相同输入并行对比 2～3 个模型，查看输出、延迟、TTFT、Token 与错误信息，点击 **Use this model** 复制 curl / Python / Java，通过本机 OpenAI 兼容网关 `:3300/v1` 接入自己的程序。

- 仓库：<https://github.com/gao-shu/modeldesk>（MIT）
- 安装包：<https://github.com/gao-shu/modeldesk/releases>

![ModelDesk 模型配置页](/projects/modeldesk-models.png)
![ModelDesk 图片实测](/projects/modeldesk-run-image.png)

## 一、项目背景与解决的问题

**使用场景**：开发者同时用多家模型的 API（OpenAI / 火山 / 智谱 / 本地 Ollama 等）。厂商控制台适合测单个模型，但要对比多家接口，往往要在多个后台、多套 Key、多种返回格式之间来回切换，最后还得手工改调用代码接到业务里。

**要解决的具体问题**：
- 一处配置、统一保存多家模型与加密 Key；
- 同一输入并行对比 2～3 个模型，并排看结果、延迟、Token；
- 选中模型后直接生成可复制的调用代码；
- 通过本机 OpenAI 兼容网关，让业务代码只打一个 `/v1`，不直连各家厂商。

**目标用户**：需要用多个模型、做选型与接入的开发者（不是终端消费者）。

## 二、项目状态

| 项目 | 说明 |
|---|---|
| 当前阶段 | 已发布（Windows 安装包 v0.2.1；源码 0.2.3） |
| 完成度 | 核心链路（配置 / Playground / Compare / Use / Gateway / MCP）可用 |
| 最后更新 | 2026-10-22 |
| 可访问地址 | GitHub Release 提供安装包；源码可 `pnpm dev` 本地运行 |
| 可运行验证 | ✅ 已完成（见第七节）：`pnpm install` / `test:unit` 93 测全过 / `smoke` 2/2 / `build` 成功 |

> **诚实说明**：本页列出的「构建 / 单元测试 / 冒烟 / 生产构建」由我在本地独立完成并保留日志；「调用真实模型返回结果」需用户自备 API Key，我**未**用任何真实外部模型 Key 跑通业务数据，相关功能以官方文档与本地无 Key 路径（页面渲染、网关契约、单测）为证。

## 三、个人承担的工作

- 产品定位与范围冻结（Positioning / Product Freeze）：明确「Test. Compare. Use.」主线，划清不做 SaaS / 多租户 / Agent 编排平台。
- 整体架构与模块拆分：Web（Next）界面 + 同进程 Gateway `/v1` + `packages/run-core` 编排 + `adapters` 适配器 + `model-registry` 注册表 + `object-storage` / `tos-storage`。
- 网关与 MCP 接入设计：OpenAI 兼容 `/v1` 契约、别名机制、Cursor/MCP 配置导出。
- 本地优先与安全：API Key 落盘加密、默认仅监听 localhost、无登录无云同步。
- 工程化：pnpm monorepo、Docker / docker-compose、GitHub Actions、SECURITY.md、CHANGELOG、OSS 发布检查脚本。

## 四、技术栈与架构

- **前端 / 界面**：Next.js（apps/web），Playground / Compare / Models / Settings / History。
- **网关**：OpenAI 兼容 HTTP（`:3300/v1`，与 Web 同进程；可选无头 `:3310`）。
- **核心编排**：`packages/run-core`（run 编排、并发、部分失败保留）。
- **适配器**：`packages/adapters`（对接各厂商 / 协议）。
- **模型注册表**：`packages/model-registry`（配置名 ↔ 网关 model id 映射、别名）。
- **存储**：`packages/object-storage` + `packages/tos-storage`（产物 / 对象存储，按需公网 URL）。
- **共享**：`packages/shared`（导航、类型）、`packages/gateway-client`（TS 客户端）。
- **桌面端**：apps/desktop（Tauri 壳，需 Rust）。
- **数据**：SQLite + 加密后的 Key，默认仓库 `data/`（开发）或系统数据目录。

```text
界面（Playground · Compare · Models）
        ↓
   packages/run-core
        ↓
 适配器（adapters）+ 模型注册表
        ↓
 加密后的 API Key / SQLite（数据目录）

界面 ──► OpenAI 兼容网关（:3300/v1）
              ↓
     自己的应用 / 脚本 / Cursor / MCP / CLI
```

## 五、核心功能与关键实现

### 1. Playground（单模型实测）
分别测试 Text / Image / Audio / Video，一次测一个模型（`/runs/text`、`/runs/image` 等）。实现上由 `run-core` 统一封装「构造请求 → 调适配器 → 收集延迟/TTFT/Token/错误」。

### 2. Compare（同输入并行对比）
`/runs/compare` 用相同输入并行运行 2～3 个同模态模型，各列独立展示结果与指标；**某一路失败不影响其他路**。复杂度在并发编排与「部分失败保留」——这也正是 `run-core` 单测重点覆盖的路径（`creates 3 jobs and finalizes as partial when one fails` 等）。

### 3. Use this model（生成调用代码）
在对比结果卡片上点击，复制面向本机网关的 curl / Python / Java 示例；系统设置里也提供 Gateway / MCP 片段。

### 4. 本地 OpenAI 兼容网关
业务只打 `http://127.0.0.1:3300/v1`，`model` 可填稳定别名、台账 UUID 或唯一配置名；上游 Key 只用 Desk 里已保存的，请求里即使带 Key 也不会被用来调厂商。契约见 `openapi.yaml`。

## 六、运行截图或演示

均为仓库内真实截图（非示意图）：

- 模型配置页：`/projects/modeldesk-models.png`
- 图片实测：`/projects/modeldesk-run-image.png`
- 结果画廊：`/projects/modeldesk-gallery.png`

> 演示视频仍在准备中；完整链路（测试 → 对比 → 查看 → 使用当前模型 → curl/Python/Java → 本地网关）当前版本已支持。

## 七、测试与部署说明

**本地运行方式**：

```bash
pnpm install          # Node 22 + pnpm 9.15.0
cp .env.example apps/web/.env.local
pnpm dev              # http://127.0.0.1:3300
```

**测试范围与结果（本人本地实测，2026-10-22）**：

| 命令 | 结果 |
|---|---|
| `pnpm install` | 619 包，52.8s，成功 |
| `pnpm test:unit` | 4 个包共 **93 测全过**（run-core 31 / adapters 36 / object-storage 20 / tos-storage 6），0 失败 |
| `pnpm smoke` | **2/2 通过**（web.home、web.models 均 200） |
| `pnpm build` | 生产构建成功，产出 `/models`、`/runs/compare`、`/v1/[...path]`、`/healthz` 等路由 |

**部署方式**：Docker / docker-compose 本机部署（见 `docs/deploy-baota.md`）；GitHub Actions 负责构建与发版检查。桌面端经 Tauri 打 Windows / macOS 安装包。

## 八、GitHub 仓库

- 仓库地址：<https://github.com/gao-shu/modeldesk>
- 许可证：MIT（见 `LICENSE`）
- 第三方依赖与原创边界：本项目为作者原创的本地工具；若后续接入任何上游 SDK，会在 `docs/adapters` 与 NOTICE 中明确标注。

## 九、相关技术文章

- [ModelDesk 架构解析：把多个模型 API 收敛成本地一个 /v1 网关](/ai/creation/modeldesk-architecture)

---

> 本页所有「可运行 / 可验证」结论均来自本人本地复现；未使用真实模型 Key 跑业务数据，相关能力以官方文档与无 Key 路径为证，不夸大、不虚构。
