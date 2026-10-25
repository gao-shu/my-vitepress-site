# 项目资产统一审计表（第一阶段产出）

> 审计时间：2026-10-23 01:00 | 审计人：Agent A | 依据：实际代码、Git 状态、GitHub/Gitee API、构建产物实测
> 原则：所有结论以本次实际检查为准，不引用历史描述；未执行的检查一律标记「未执行」，不推断为通过。

## 一、网站侧审计（docs/apps/ 与生效配置）

### 1.1 生效侧栏结构（实测）

| 挂载路径 | 使用函数 | 状态 |
|---|---|---|
| `/apps/` | `appsSidebar5()` → `APP_GROUPS_5`（717 行） | ✅ 生效 |
| `/apps/ops/` | `techSidebar5()`（1182 行挂载） | ✅ 生效（归「技术体系 → 部署与运维」，共 5 页） |
| `APP_CATEGORIES` + `appsSidebar()`（581–651 行） | 无任何挂载 | ⚠️ **死代码**：内含 ModelDesk 与 ops 的过期条目副本，易误导后续编辑 |

### 1.2 应用开发栏目页面清查（共 44 个 md）

| 子类（生效侧栏） | 条目数 | 页面性质 |
|---|---|---|
| AI 应用 | 6 | **1 个真实项目页**（modeldesk.md，唯一带仓库链接 + 3 张真实截图的页面）+ 5 个技术实践页 |
| 企业业务应用 | 10 | 10 个技术实践页（business 5 + integration 5，无仓库/截图/测试证据） |
| 工业数字化应用 | 5 | 5 个技术实践页 |
| 办公自动化 | 5 | 5 个技术实践页 |
| 个人工具 | 5 | 5 个技术实践页 |

性质判定依据：抽样阅读各页开头，均为「背景与问题 → 方案设计」的经验总结结构，基于真实工作但**无可公开验证的代码/运行证据**；29 个主题页无一引用仓库。

### 1.3 已发现的网站侧问题

| # | 问题 | 证据 | 处理 |
|---|---|---|---|
| W1 | **ModelDesk 项目页未进生效侧栏**（59b7aa13 误加入死数组 `APP_CATEGORIES`） | 本地修复提交 `ca82cb6b`（侧栏首条 + 分类表首行，dist-v14 复测通过） | 待推送+部署；远端 main 仍为 `26b6713d`，线上侧栏实测无 ModelDesk |
| W2 | 两个提交滞留本地未推送 | `ac7c6828`（任务追踪）、`ca82cb6b`（W1 修复） | LFS locks verify 被代理 502 拦截，未改 git 配置，网络恢复后补推 |
| W3 | 死代码 `APP_CATEGORIES`/`appsSidebar()` | 无挂载且内容与生效配置漂移 | 第二阶段清理或加注释标记废弃 |
| W4 | 应用开发栏目缺「项目状态」区分机制 | 全部页面平铺，真实项目与技术实践无法一眼区分 | 第二阶段按 verified/in-progress/planned 分层展示 |

## 二、七个候选项目审计表

### 2.1 ModelDesk（本机多模态 AI 配测台）

| 字段 | 内容 |
|---|---|
| 当前代码位置 | 源副本 `E:/8.cangku/modeldesk`（HEAD `9151f7e`，**未推送**，另有 3 个未跟踪文件）；验证副本 `E:/_proj_eval/modeldesk`（= GitHub `70d9a29`，已验证） |
| 当前状态 | **已验证（部分）**——安装/单测/smoke/构建均实际执行通过；真实模型 API 端到端**未执行** |
| 技术栈 | TypeScript · Next.js · OpenAI 兼容网关（`/v1`）· Tauri 桌面端 · pnpm monorepo |
| 已实现功能 | 多模型接入与别名、模型对比（Compare）、批量运行、本地网关统一收敛、运行记录 |
| 测试与运行 | ✅ `pnpm install` 619 包；✅ 单测 **4 包 93 测全过 0 失败**（日志 `E:/_proj_eval/unit.log`，20KB 留存）；✅ smoke **2/2**；✅ 生产构建成功。❌ 真实 API Key 端到端未执行 |
| 公开状态 | GitHub 公开 `gao-shu/modeldesk`；Release **v0.2.1（2026-08-13）/ v0.1.0（2026-08-10）**已发布，MIT |
| 对应网站页面 | `/apps/ai/modeldesk`（项目页）+ `/ai/creation/modeldesk-architecture`（文章）+ 首页/简历入口 |
| 主要缺口 | ① 侧栏入口未上线（W1/W2）② 源副本有未推送提交 + 未跟踪新截图（`demo-30s.gif`、`demo-curl-frame.png`、`data/gateway-aliases.json`）③ 项目页与最新 README 一致性未核 ④ 真实 API 验证未做（页面已如实标注边界） |
| 下一步行动 | 推送 W1/W2 → 推送源副本提交与新截图 → 核对项目页/README/版本号 → 保持「无 Key 路径」证据链 |
| 优先级 | **P0**（维护与核实，不重新开发） |

### 2.2 OpenBiz 母仓（可复用 Java 业务组件）

| 字段 | 内容 |
|---|---|
| 当前代码位置 | **仅 GitHub `gao-shu/openbiz`（公开，master，2026-09-17 推送）**，本地未克隆 |
| 当前状态 | 部分完成——**未在本地验证**（未克隆、未构建）；远程结构已实测（2026-10-23，详见 OPENBIZ-GAP-ANALYSIS.md） |
| 技术栈 | Java 21 · Spring Boot 3 · MyBatis · MySQL · Maven；RuoYi-Vue 3.9.2 运行时外壳 + 6 大能力域 |
| 已实现功能 | 五母域 + 4 个 IoT 行业插件：saas-core（Tenant/Member）· service（工单状态机：CREATED→ASSIGNED→ACCEPTED→COMPLETED/CANCELLED，幂等+租户隔离）· business（Customer/Account/流水/Order）· shop（Product/Inventory CAS/Order）· agent（最小核心：PromptTemplate→AgentInvoker→ModelPort→OpenAI 兼容，ToolPort 空边界）· iot（Device/Product/ThingModel/Command + ProtocolPort SPI + MQTT 适配 + MockDoor；插件：access 门禁/locker 储物柜/charging 充电桩/mes 验证桩）· foundation（空骨架） |
| 测试与运行 | 远程自评（2026-09-15 封板审计）：IoT 52 测试、`mvn clean test` PASS（1 skip=Agent 无 key）、`mvn package` PASS、并发扣款/库存均为真实 MySQL 测试；CI 存在；**本地未执行** |
| 公开状态 | GitHub 公开；Release `v0.1.0`；Maven 产物 `com.openbiz:openbiz-service:3.9.2`（workorder-demo 唯一业务来源） |
| 对应网站页面 | `/open-source/mine/openbiz`（开源拆解页） |
| 主要缺口 | ① 本地零验证（未克隆/未构建/`~/.m2` 无构件）② IoT v1.0 FROZEN 与扩 MES/IIoT 存在冲突，需按真实需求解冻 ③ 文档状态漂移（自述 P1）④ Agent 真实模型 E2E 无 key ⑤ 独立消费者仅 1 个 |
| 下一步行动 | 克隆到 `E:/8.cangku/openbiz` → `mvn install` 产出构件 → 作为工单 demo 的前置；适配分析与缺口清单见 OPENBIZ-GAP-ANALYSIS.md |
| 优先级 | **P0**（工单项目的硬前置；同时是 9 个企业/工业/办公系统的底座） |

### 2.3 openbiz-workorder-demo（工单系统）

| 字段 | 内容 |
|---|---|
| 当前代码位置 | `E:/_proj_eval/openbiz-workorder-demo`（git 仓库，远端 GitHub `gao-shu/openbiz-workorder-demo`，HEAD `a552e12`） |
| 当前状态 | 部分完成——**当前不可构建**（母仓构件缺失） |
| 技术栈 | Java 21 · Spring Boot 3.x · RuoYi 薄壳（Security/Druid）· MyBatis · MySQL 8.0 · 端口 18081 |
| 已实现功能 | 工单 REST 全生命周期：列表/详情/创建/派单(assign)/受理(accept)/完成(complete)/取消(cancel)，含幂等键；AuthController；业务逻辑全部委托母仓 `WorkOrderService`（本地无 Mapper/SQL/状态机） |
| 测试与运行 | **未执行**：`com.openbiz:openbiz-service:3.9.2` 不在 `~/.m2` → 无法编译；`src/test` 目录不存在 → **0 测试**；MySQL 8.0 服务本机**正在运行**（具备建库条件） |
| 公开状态 | GitHub 公开（pushed 2026-09-18） |
| 对应网站页面 | 无（计划建设为「企业业务应用」首个真实项目案例） |
| 主要缺口 | ① 母仓构件缺失导致无法编译 ② 零测试 ③ 数据库初始化未验证 ④ README 复现性未验证 ⑤ 无网站项目页 |
| 下一步行动 | 克隆母仓 → `mvn install` → demo 编译启动 → 建库（sql/ 目录）→ 核心流程 API 实测 → 补关键测试 → 建项目页 |
| 优先级 | **P0**（下一项重点工程） |

### 2.4 java-langchain4j-lab（个人知识库）

| 字段 | 内容 |
|---|---|
| 当前代码位置 | `E:/8.cangku/java-langchain4j-lab`（**有 .git 但 0 提交、无远端**） |
| 当前状态 | 部分完成——**未版本化、未验证** |
| 技术栈 | Java 21 · Spring Boot 3.5.5 · LangChain4j 1.19.x · PostgreSQL + pgvector · 本地 Embedding（AllMiniLm）· Electron 桌面壳（desktop/ 含 main.js/preload/backend/dist）+ mobile/ + NAS 部署文档 |
| 已实现功能 | 54 个 Java 文件；笔记 + 检索 + AI 助手；三段工作台设计文档齐全；**已移除漫剧相关内容，方向干净** |
| 测试与运行 | **未执行**：存在 231MB fat jar（2026-09-10 构建过，说明曾构建成功），但 **0 个测试文件**，无本次运行验证记录；依赖 PostgreSQL |
| 公开状态 | 未公开（无 git 远端） |
| 对应网站页面 | 无（计划进「AI 应用」） |
| 主要缺口 | ① **无版本控制历史（0 提交，代码有丢失风险）** ② 零测试 ③ 运行状态未知（需 PostgreSQL） ④ 未公开 |
| 下一步行动 | **立即 git 首次提交保全代码** → 确认构建可复现 → 补最小测试集 → 评估公开 → 建项目页 |
| 优先级 | **P1** |

### 2.5 java-agent-demo（Java Agent 示例）

| 字段 | 内容 |
|---|---|
| 当前代码位置 | `E:/8.cangku/java-agent-demo`（git，远端 **Gitee** `gaoshuteacher/java-agent-demo`，HEAD `f39e2a5`） |
| 当前状态 | 部分完成——**未本地验证** |
| 技术栈 | Java 21 · Spring Boot 3.4.2 · MCP 2.0（mcp-core/mcp-json-jackson2）· 内存态存储 |
| 已实现功能 | SimpleAgent 决策循环、ChatController、LlmClient、MCP 工具桥（McpToolBridge/Adapter/Facade）、SessionMemory + LongTermMemory、RAG、Multi-Agent（V0.7 设计） |
| 测试与运行 | **未执行**：13 个测试文件存在，但无 target 构建产物、无本次运行记录；跑通需 LLM API Key |
| 公开状态 | Gitee **公开**（pushed 2026-09-07）；GitHub 未同步 |
| 对应网站页面 | 无（计划进「AI 应用」） |
| 主要缺口 | ① 测试未实跑 ② 需 API Key ② 与知识库项目 RAG 能力重叠，需定位差异（Agent 模式 vs 知识库产品）③ 未同步 GitHub |
| 下一步行动 | 实跑测试（无 Key 路径优先）→ 补关键测试 → 与知识库项目做定位区分 → 评估 GitHub 镜像 → 项目页 |
| 优先级 | **P1/P2** |

### 2.6 text-manager（文本管理小工具）

| 字段 | 内容 |
|---|---|
| 当前代码位置 | 本地 `E:/8.cangku/text-manager` **为空目录**；代码在 GitHub `gao-shu/text-manager`（3MB） |
| 当前状态 | 部分完成——**未验证**（本地无副本） |
| 技术栈 | TypeScript + Tauri（src-tauri/）桌面应用 |
| 已实现功能 | GitHub 仓库含 src/、src-tauri/、docs/、package.json——具体功能未读（README 未审） |
| 测试与运行 | **未执行**（本地无代码） |
| 公开状态 | GitHub 公开（pushed 2026-06-01） |
| 对应网站页面 | 无 |
| 主要缺口 | 本地无副本；构建/运行/测试均未验证；README 未审 |
| 下一步行动 | 克隆到 8.cangku → 读 README → 验证构建 → 补测试 → 项目页（「个人工具」候选） |
| 优先级 | **P3** |

### 2.7 python-langchain-lab（Python 知识库，设计态）

| 字段 | 内容 |
|---|---|
| 当前代码位置 | `E:/8.cangku/python-langchain-lab`（git 仓库，**0 提交、无远端**） |
| 当前状态 | **仅有设计**——7 个设计文档（ARCHITECTURE / API-CONTRACT / DEV-ROADMAP / CONCEPT-MAP / SHARED-INFRA），**0 行业务代码** |
| 技术栈 | FastAPI + LangChain（设计目标）；与 java-langchain4j-lab 共用 DB/UI 的设想 |
| 已实现功能 | 无代码实现 |
| 测试与运行 | 不适用（无可测内容） |
| 公开状态 | 未公开 |
| 对应网站页面 | 无 |
| 主要缺口 | 无实现；「同一套 Postgres + 同一套前端换后端栈」的设想未落地 |
| 下一步行动 | **暂缓**。仅当决定投 Python 岗时，按 DEV-ROADMAP 做最小可展示版 |
| 优先级 | **P3（暂缓）** |

## 三、不纳入求职作品集的项目（旧方向/权限）

| 项目 | 位置 | 不纳入原因 |
|---|---|---|
| local-creator（本地漫创） | GitHub 私有 `gao-shu/local-creator` | AI 漫剧创作工具，属已退出方向；且仓库公开需维护者授权 |
| character-asset-studio（角色定妆） | GitHub 私有 `gao-shu/character-asset-studio` | 漫剧资产流水线，旧方向 |
| ai-manju-platform | `E:/8.cangku/ai-manju-platform` | AI 漫剧平台，旧方向 |
| secondbrain | `E:/8.cangku/secondbrain` | Obsidian 笔记库，非代码项目 |

## 四、环境事实（影响后续验证可行性）

- Java 21.0.8 LTS ✅ / Maven 3.9.11 ✅ / MySQL 8.0 **服务运行中** ✅ / Node 22.22.2 + pnpm 9.15.0 ✅
- `~/.m2/repository/com/openbiz/` 不存在 → 工单 demo 编译前必须先 `mvn install` 母仓
- Git 推送走代理时 LFS locks verify 端点间歇 502（网络问题，非配置问题）

## 五、审计结论与优先级判定

**值得继续（按序）**：
1. **P0 恢复交付 + ModelDesk 核实**：推送 `ac7c6828`/`ca82cb6b`（W1/W2）；推送 modeldesk 源副本未推送提交与新截图；核对项目页与 README/版本一致性。成本低、确定性高。
2. **P0 OpenBiz 工单最小闭环**：母仓克隆 + `mvn install` → demo 编译 → 建库 → 核心流程实测 → 补关键测试 → 建「企业业务应用」首个真实案例。环境齐备（Java/Maven/MySQL 均在），是作品集缺失的企业级 Java 拼图。
3. **P1 java-langchain4j-lab**：先 git 提交保全（0 提交是最大风险），再验证构建与运行，补最小测试，评估公开。
4. **P1/P2 java-agent-demo**：实跑测试、定位与知识库项目的差异，评估 GitHub 镜像。
5. **P3 text-manager / python-langchain-lab**：前者验证后可作为「个人工具」案例；后者暂缓。

**应暂缓**：local-creator / character-asset-studio / ai-manju-platform（旧方向）；python-langchain-lab（无代码，投 Python 岗再启动）。

**网站侧第二阶段动作**（见阶段二）：五子类按 verified → in-progress → planned 分层；真实项目置顶；清理死代码 `APP_CATEGORIES`；统一项目卡片字段。
