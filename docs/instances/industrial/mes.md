# MES 生产执行管理系统

<div class="sys-hero">
  <div class="sys-hero__eyebrow">02 工业数字化 · 优先级 1 / 3</div>
  <div class="sys-hero__badges">
    <span class="sys-badge sys-badge--ok">✅ 已跑通（工单 → 工序报工 → 质检 → 完工 → WMS 入库）</span>
    <span class="sys-badge">Java 21 · Spring Boot 3.5</span>
    <span class="sys-badge">:18082 · openbiz_mes</span>
    <span class="sys-badge">13 表 · 36 端点 · 25 权限点</span>
    <span class="sys-badge">验收 115 项断言</span>
  </div>
  <p class="sys-hero__pitch">多品种小批量的离散装配厂：一张工单从下达到完工走七态、按道序报工，进度和质量不用再靠电话问、靠微信群报</p>
</div>

> 诚实边界：工单状态机（含 CAS）、工序级报工、物料消耗、正反向追溯、权限分级、报工 OK/NG、完工禁删、以及与 WMS / IIoT 的两条集成链路都已实现并有可复跑验收。**没做**：工厂/车间/产线/工位主数据、班次日历、生产订单与派工、领料/退料/线边库与齐套、PDA、生产看板前端、跨工单批次追溯。前端目前偏工单与报工两页；工序报工 / 追溯 / 集成运维以后端接口为主。离散装配「跟单执行」大约 **55%～65%**；要到 80% 需补终端与齐套。

## 业务场景

**一家什么样的厂**：多品种、小批量、按订单生产的离散装配厂（几十到几百人，2~5 条产线）。没有 APS，排产靠计划员 Excel 加经验；车间用纸质流转卡跟单，进度靠班组长在群里喊。

| 角色 | 在系统里做什么 | 没有系统时的样子 |
|---|---|---|
| 计划员 | 下工单（产品 / 数量 / 设备），看全厂状态分布 | Excel 排产，改一次重发一版，车间拿的是旧版 |
| 班组长 | 开工、报工、发起返工 | 纸质流转卡手写，字迹和口径都不统一 |
| 操作工 | 按工序报良品 / 不良数 | 下班前统一补记，产量对不上实物 |
| 质检员 | 质检判定，PASS 才放行完工 | 质检单单独一张纸，事后和工单对不上号 |
| 厂长 | 看进度与在制 | 打电话问，三个人给三个答案 |

**这段业务真正难的地方不是功能多，是状态不能乱**：工单进度、报工数量、质检结论三者必须永远对得上。任何一处脱节，月底就是账、单、实物三本账——这也是「最小闭环」必须先做状态机、而不是先做报表的原因。

落到业务上的五条硬约束：

- **报工与状态同事务**：不会出现「进度条动了、产量没有」
- **WIP 守不变量**：下游工序的产出不能超过上游，下一工序拿不到没做出来的量
- **返工不新建单**：同一张工单上能看到返工次数，追溯链不断
- **状态机单一来源**：前端按钮显隐与后端迁移表同源，不会「能点的按钮点了报错」
- **下游挂了不阻塞车间**：WMS / IIoT 不可用时指令先排队，生产照跑

## 功能架构

<svg viewBox="0 0 880 180" width="100%" style="max-width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MES 功能架构图">
<rect x="0" y="0" width="880" height="180" rx="14" fill="var(--vp-c-bg-soft)"/>
<text x="124" y="40" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">终端层</text>
<rect x="140" y="16" width="232" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="256" y="40" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">Vue3 管理端</text>
<rect x="384" y="16" width="232" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="500" y="40" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">工位看板（未做）</text>
<rect x="628" y="16" width="232" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="744" y="40" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">PDA 扫码（未做）</text>
<text x="124" y="98" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">应用层</text>
<rect x="140" y="74" width="134" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="207" y="98" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">生产工单</text>
<rect x="286" y="74" width="134" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="353" y="98" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">报工</text>
<rect x="433" y="74" width="134" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="500" y="98" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">工序交接</text>
<rect x="579" y="74" width="134" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="646" y="98" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">质检门禁</text>
<rect x="726" y="74" width="134" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="793" y="98" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">物料消耗</text>
<text x="124" y="156" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">领域层</text>
<rect x="140" y="132" width="171" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="226" y="156" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">状态机 · 迁移表</text>
<rect x="323" y="132" width="171" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="408" y="156" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">工序流水 · 追溯</text>
<rect x="506" y="132" width="171" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="591" y="156" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">工艺路线 · 工序</text>
<rect x="689" y="132" width="171" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="774" y="156" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">租户上下文</text>
</svg>

实心高亮 = 已实现：**生产工单 · 报工 · 工序交接 · 质检门禁 · 物料消耗 · 工艺路线 · 工序流水追溯 · 状态机 · 租户上下文**。空心为确实没做的：PDA 扫码、工位看板。图上没画但同样没做的（工厂主数据、班次、领料齐套等），见下方「P0 交付现状」逐项对账。

**集成层**（不在图中，但已跑通）：MES 完工 → `mes_integration_outbox` → WMS 生产入库单（`source_doc_no` = 工单号）；IIoT 设备计数 → MES 工序报工（`mes_device_cursor` 做增量游标）。两条链路各有一键验收脚本，实跑通过。

## 核心亮点

<div class="sys-grid">
  <div class="sys-card">
    <div class="sys-card__icon">🧭</div>
    <div class="sys-card__title">七态工单状态机</div>
    <div class="sys-card__desc">主链 CREATED → STARTED → REPORTED → QC_PASSED → COMPLETED，QC_FAILED 留返工回路</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">📝</div>
    <div class="sys-card__title">报工即落库</div>
    <div class="sys-card__desc">报工与状态迁移同事务；工序流水只追加不修改，event_id 唯一索引兜幂等</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🚫</div>
    <div class="sys-card__title">非法流转拦截</div>
    <div class="sys-card__desc">完工后再取消被拒：ILLEGAL_TRANSITION，HTTP 409</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🏢</div>
    <div class="sys-card__title">多租户 · 权限分级</div>
    <div class="sys-card__desc">全语句带 tenant_id；25 个权限点按岗位分级——报工员能开工报工，点不了完工</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🔗</div>
    <div class="sys-card__title">工序级报工</div>
    <div class="sys-card__desc">按道序记良品/不良，下游工序超上游产出直接 409，末道达标自动置 REPORTED</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🔍</div>
    <div class="sys-card__title">一单可追溯</div>
    <div class="sys-card__desc">工单详情页一次拿全：工序流水、不良明细、物料消耗、集成投递状态</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">📤</div>
    <div class="sys-card__title">跨系统解耦</div>
    <div class="sys-card__desc">完工指令先落 outbox，WMS 宕机不阻塞车间；重复投递不产生第二张入库单</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🔌</div>
    <div class="sys-card__title">统一 REST 契约</div>
    <div class="sys-card__desc">list / stats / transition / CRUD 一套形状，域动作接口另留</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🧩</div>
    <div class="sys-card__title">元数据驱动前端</div>
    <div class="sys-card__desc">modules.ts 一份配置出菜单、表格、表单与流转按钮</div>
  </div>
</div>

> 说明：简历中的「钢瓶企业轻量 MES」为公司交付项目（不可开源）。本页是作品集可复现的 **OpenBiz MES**，二者勿混为一谈。

## 功能清单

> 状态图例：✅ 已实现（有实证） · 🔧 进行中 · 📋 待做

### 已实现

| 功能域 | 功能 | 状态 | 证据 |
|---|---|---|---|
| 底座 | 多租户 / 权限 / 审计 | ✅ 复用 | 租户 `openbiz-saas-core` · 权限 RuoYi `@PreAuthorize` · 审计 RuoYi `@Log` → `sys_oper_log` |
| 底座 | 工单状态机引擎 | ✅ | `TRANSITIONS` Map + `ILLEGAL_TRANSITION` |
| 底座 | 权限点按岗位分级 | ✅ | 25 个 `mes:*` 权限点 · 4 个岗位角色 · 34 处 `@PreAuthorize` |
| 生产工单 | 建单 → 开工 → 报工 → 质检 → 完工 | ✅ | E2E 第 2~6 步依次返回 CREATED/STARTED/REPORTED/QC_PASSED/COMPLETED |
| 生产工单 | 取消（未终态） | ✅ | `CREATED/STARTED/REPORTED/QC_FAILED → CANCELLED`；`COMPLETED` 被拒（E2E 第 8 步） |
| 工序 | 工艺路线 / 工序主数据 | ✅ | `mes_routing` · `mes_routing_operation` · `POST /api/mes/routings` |
| 工序 | 工序级报工（良品 / 不良） | ✅ | `POST /api/mes/work-orders/{id}/operations/{opId}/report` |
| 工序 | WIP 不变量：下游不超上游产出 | ✅ | `UPSTREAM_QTY_INSUFFICIENT` 409（断言 13） |
| 工序 | 工序超计划量被拒 | ✅ | `OPERATION_QTY_EXCEEDED` 409（断言 11） |
| 工序 | 事件幂等：同 `event_id` 重发不计产 | ✅ | `uk(tenant_id, event_id)`（断言 10） |
| 工序 | 末道达标自动置 `REPORTED` | ✅ | 少一次人工点「报工完成」（断言 15） |
| 工序 | 进度视图 | ✅ | `GET /api/mes/work-orders/{id}/progress`（断言 16） |
| 报工 | 整单报工老路径保留 | ✅ | `routing_id IS NULL` 走原链路，9 项回归全绿 |
| 质量 | 质检门禁（PASS / FAIL 分支） | ✅ | `QC_PASSED` / `QC_FAILED` 两态，FAIL 可返工回 STARTED |
| 质量 | 不良明细（缺陷码 + 不良数） | ✅ | `mes_qc_record.defect_code`；明细合计 ≠ 不良数 → 400 `DEFECT_QTY_MISMATCH`（断言 12） |
| 质量 | 整单质检留痕 | ✅ | 整单质检也写 `mes_qc_record`（`item_code=ORDER`），不再只改状态不留证据（断言 19b） |
| 物料 | 物料消耗（理论 / 实际） | ✅ | `mes_material_consumption`；理论按**计划**、实际按**实绩**（含报废），两列口径解耦 |
| 追溯 | 单工单正 / 反向追溯 | ✅ | `GET /{id}/trace` · `/consumptions` · `/qc-records` |
| 集成 | 完工 → WMS 生产入库（outbox 解耦） | ✅ | `mes_integration_outbox`；跨系统 13 项全绿 |
| 集成 | IIoT 遥测 → 工序报工 | ✅ | `mes_device_cursor` 增量游标；10 项全绿 |
| 集成 | 集成运维（状态 / 重试 / 手动派发） | ✅ | `GET/POST /api/mes/integration/*` |
| 契约 | 统一 REST 契约（list / stats / transition / CRUD） | ✅ | 63 项断言全绿 |
| 统计 | 七态计数 `/stats` | ✅ | 返回 CREATED…CANCELLED 全量键，完工后计数 +1 |
| 统计 | 排产维度统计 `/stats/dimension` | ✅ | 优先级 / 班次 / 车间 / 产线分布 + 逾期 + 7 天临期 |
| 隔离 | 租户隔离 | ✅ | 查询/更新/删除均带 `tenant_id`，租户 2 有独立 `WO-002` |
| 排产维度 | 交期 / 优先级 / 产线 / 车间 / 班次 | ✅ | `mes_1_11.sql` 加列；建单即落库，非法枚举 → 400 `INVALID_PRIORITY` / `INVALID_SHIFT` |
| 主数据 | 物料 / BOM 下拉接口 | ✅ | `GET /api/mes/materials/list` · `/boms/list`，建工单表单不用手填 ID |
| 前端 | 元数据驱动通用表格（状态机 / 表单 / 分页） | ✅ | `modules.ts` · `npm run build`（含 vue-tsc）通过 |
| 前端 | 工序报工台 | ✅ | 工单选择 → 工序链进度 → 报工提交（幂等键 + 不良明细 + 上游余量提示） |
| 前端 | 工单追溯页 | ✅ | 工序流水 / 质检明细 + 不良汇总 / 物料消耗（理论 vs 实际 + 差异率）/ 集成投递 四类证据 |
| 前端 | 集成运维页 | ✅ | 联调开关 + 待发队列 + 失败重投 + 手动 dispatch / poll |

### P0 收尾（并发 CAS · 报工词汇 · 删除门禁）

| 功能域 | 功能 | 状态 | 现状与改法 |
|---|---|---|---|
| 并发 | 状态迁移加前置条件 | ✅ | `updateStatus` 带 `AND status = #{from}`；`affected = 0` → 409 `CONCURRENT_TRANSITION` · `docs/07` · `verify_mes_p0_hardening.py` |
| 词汇 | 报工结果枚举统一 | ✅ | 落库只写 **OK / NG**；入参兼容 PASS/FAIL（`normalizeResult`） |
| 约束 | 完工单禁删 + 记录挂靠 | ✅ | 仅 CREATED/CANCELLED 可删；同事务清 `production_record`，完工 → 409 `DELETE_FORBIDDEN` |

### P0 交付现状：补上的与还差的

上一版文章把「工序、质量、物料」整块列为待做，实际上这三条链已经在 `sql/openbiz_mes_1_9.sql` 里落地并跑过验收。逐项对账如下：

| 能力 | 状态 | 现状 / 差在哪 |
|---|---|---|
| 工序实例 | ✅ | `mes_routing_operation`（路线 + 序号 + 标准工时） |
| 按工序报工 | ✅ | 工序级接口 + 良品/不良双列 |
| 按人报工 | ✅ | `operation_record.operator`；整单路径补 `production_record.operator`（MES 1.12） |
| 按班次报工 | ✅ | 工单带 `shift`（DAY/MIDDLE/NIGHT），报工挂在哪张单就知道哪个班；`operation_record` 本身仍无 `shift` 列 |
| WIP 在制 | ✅ | 下游工序产出超上游 → 409，WIP 流转不变量由后端守 |
| 不良代码 | ✅ | `qc_record.defect_code` + 不良数 |
| IQC / IPQC / FQC 检验单 | 📋 | 现有质检明细挂在工单上，无检验类型与检验批 |
| 返工单 | 📋 | 有 `QC_FAILED → STARTED` 状态回路，但没有独立返工单据 |
| 物料消耗 | ✅ | 理论 / 实际双列，随追溯一起返回；理论按计划、实际按实绩（含报废），差额即损耗 |
| 领料 / 退料 / 补料、线边库 | 📋 | 未做（消耗只记账，不产生领料单；实际用量是**产出折算**不是仓库实领） |
| 齐套检查 | 📋 | 未做（`mes_bom_item` 有 BOM，但开工前不校验齐套） |
| 工厂 / 车间 / 产线 / 工位 | ✅ | 工单带 `workshop` / `production_line`（MES 1.11）；**工厂**与**工位**仍无维度 |
| 班次 / 日历 | 🔧 | 工单有 `shift`，日历排班未做 |
| 生产订单接入、拆分合并、派工 | 📋 | 未做，工单只能手建 |
| PDA / 工位扫码 | 📋 | 未做 |
| 生产看板 | 🔧 | 后端 `/progress` 进度视图 + 前端工序报工台的工序链进度条；车间级看板未做 |

**一句话**：MES 的「工单内核」已经是完整的（状态机 + 工序 + 追溯 + 集成 + 排产维度），「现场那层」补上了工序报工台、追溯页、集成运维页三张前端页面，但领料、扫码、齐套、看板这些现场动作仍然是空的。

### P1 / P2 待做

| 阶段 | 功能 | 状态 | 说明 |
|---|---|---|---|
| P1 | 批次级正 / 反向追溯（跨工单） | 📋 | 现为「单工单内」可查清 |
| P1 | 设备稼动率 / OEE | 📋 | 依赖 IIoT `status-durations` 聚合 |
| P1 | 简化排产、产能平衡 | 📋 | APS 是另一个问题域，塞进来边界会失控 |
| P1 | 订阅 IIoT 设备状态、安灯、电子 SOP | 📋 | 遥测→报工已通，状态订阅未做 |
| P1 | 与 ERP（订单 / BOM）OpenAPI | 📋 | WMS 侧已打通，ERP 侧未通 |
| P1 | 报表引擎（良率 / 工时 / 在制） | 📋 | 先保证数据对，再谈展示 |
| P2 | SPC/CPK、AQL、多工厂、预测性维护 | 📋 | 依赖多工厂与长期数据 |

## 核心流程

### 工序链（P0 后主线）

有工艺路线时，工单不再「一次报完工」，而是按道序走：

```
建单(挂 routing) ─▶ 开工 ─▶ 工序1 ─▶ 工序2 ─▶ … ─▶ 工序N ─▶ 自动 REPORTED ─▶ 质检 ─▶ 完工
                        │        │              │
                        └─ 不良明细 ┘           └─ 产出超上游 → 409（WIP 不变量）
```

| 环节 | 写库 | 校验 / 说明 |
|---|---|---|
| 建路线 | `INSERT mes_routing` + `mes_routing_operation` | 同 `(tenant_id, routing_code)` 唯一；工序按 `seq_no` 升序 |
| 工序报工 | `INSERT mes_operation_record`（append-only） | `uk(tenant_id, event_id)` 幂等；良品 / 不良双列；超计划量 → 409 |
| 末道达标 | `UPDATE work_order.status = REPORTED` | 工序累计达标自动置位，不用人工点「报工完成」 |
| 质检明细 | `INSERT mes_qc_record` | 缺陷码 + 不良数；明细合计 ≠ 不良数 → 400 |
| 物料消耗 | `INSERT mes_material_consumption` | 理论 / 实际双列 |
| 完工前置 | 校验 WMS 入库单已确认 | 未确认 → 409 `WMS_INBOUND_NOT_CONFIRMED`（否则仓库账上少一批货、MES 上却显示完工） |
| 完工 | `INSERT mes_integration_outbox` | 指令先落 outbox 再异步投 WMS，WMS 不可用不阻塞生产 |

### 整单链（老路径，保留兼容）

没有挂路线的工单走原来的整单报工，语义一行没改：

```
建单 ─▶ 开工 ─▶ 报工 ─▶ 质检 ─▶ 完工
          │        │        └─ fail ─▶ QC_FAILED ─返工─┐
          │        │                                   │
          └────────┴────────── 取消（未终态）──────────┴─▶ CANCELLED
```

每一步对数据的副作用 —— 整单链路里唯一会写两张表的地方：

| 环节 | 状态迁移 | 写库 | 校验 / 说明 |
|---|---|---|---|
| 建单 | `CREATED`（初态） | `INSERT work_order` | 工单号为空则自动生成 `WO-<nanoTime>`；`uk(tenant_id, work_order_no)` 防重 |
| 开工 | `CREATED → STARTED` | `UPDATE status` | 只允许从 CREATED 进入 |
| 报工 | `STARTED → REPORTED` | `UPDATE status` + `INSERT production_record` | 同事务；记录带 `device_id` / `quantity` / `result` / `command_id` |
| 质检 pass | `REPORTED → QC_PASSED` | `UPDATE status` | — |
| 质检 fail | `REPORTED → QC_FAILED` | `UPDATE status` | 返工走 `QC_FAILED → STARTED`，不是新建工单 |
| 完工 | `QC_PASSED → COMPLETED` | `UPDATE status` | 终态，`COMPLETED` 出度为 0 |
| 取消 | 任意未终态 → `CANCELLED` | `UPDATE status` | `COMPLETED / CANCELLED` 不可取消 |

> 关键取舍：**报工与状态迁移必须同事务**。否则会出现「状态已 REPORTED 但没有报工记录」——进度条动了，产量没了。当前 `report()` 已标 `@Transactional`；`create()` 同样。

## 状态机

工序链和整单链共用**同一张工单状态机**——工序报工不会绕开状态机直接改状态，只是把「一次报完工」拆成「多道工序逐步累积」。

```
CREATED ──start──▶ STARTED ──report──▶ REPORTED ──qc(pass)──▶ QC_PASSED ──complete──▶ COMPLETED
   │                  │                   │
   │                  │                   └──qc(fail)──▶ QC_FAILED ──start(返工)──▶ STARTED
   │                  │                                        │
   └──────────────────┴──────── cancel ────────────────────────┴──▶ CANCELLED
```

### 完整迁移表（服务端 `TRANSITIONS` Map 直接照抄）

| 当前状态 | 允许迁移 | 触发动作 |
|---|---|---|
| `CREATED` | `STARTED` / `CANCELLED` | start / cancel |
| `STARTED` | `REPORTED` / `CANCELLED` | report / cancel |
| `REPORTED` | `QC_PASSED` / `QC_FAILED` / `CANCELLED` | qc(pass) / qc(fail) / cancel |
| `QC_PASSED` | `COMPLETED` | complete |
| `QC_FAILED` | `STARTED` / `CANCELLED` | start（返工）/ cancel |
| `COMPLETED` | — | 终态 |
| `CANCELLED` | — | 终态 |

### 实现方式

```java
private static final Map<String, Set<String>> TRANSITIONS = Map.of(
    CREATED,   Set.of(STARTED, CANCELLED),
    STARTED,   Set.of(REPORTED, CANCELLED),
    REPORTED,  Set.of(QC_PASSED, QC_FAILED, CANCELLED),
    QC_PASSED, Set.of(COMPLETED),
    QC_FAILED, Set.of(STARTED, CANCELLED),
    COMPLETED, Set.of(),
    CANCELLED, Set.of());
```

非法流转抛 `IllegalStateException("ILLEGAL_TRANSITION: A -> B")`，由 `ApiExceptionHandler`（`@Order` 最高优先级）映射成 **HTTP 409**。

为什么不把 `if` 散在 Controller 里：迁移表本身就是流程图的可执行版本，改流程只改一处；前端 `modules.ts` 的 `transitions` 与后端同源，按钮显隐天然一致。

> 状态迁移已加 `AND status = #{from}`（与 WMS 库存 CAS 同类思路）。二次开工会 409；字段级通用乐观锁（`version` 列）仍未上，见「已知边界」。

## 技术栈与架构

| 层 | 技术 | 职责 |
|---|---|---|
| 后端 | JDK 21 · Spring Boot 3.5 · RuoYi 3.9.2 | REST、事务、状态机 |
| 底座 | openbiz-saas-core · RuoYi 3.9.2 | saas-core 只负责租户上下文与拦截器（15 个类）；权限与审计来自 RuoYi 外壳 |
| 持久 | MyBatis · Druid | 全语句带 `tenant_id` |
| 前端 | Vite · Vue 3.5 · TypeScript · Element Plus | 元数据驱动 `modules.ts`（目前 2 个实体页） |
| 存储 | MySQL 8（`openbiz_mes`） | 13 张业务表 + RuoYi 系统表 |
| 缓存 | Redis | token / 会话 |
| 集成 | outbox + 轮询，无 MQ 中间件 | 完工投递 WMS、设备遥测入库 |
| 验证 | 6 套验收脚本 | 契约 48 + 工序 25 + 收尾 11 + 跨 WMS 13 + 跨 IIoT 10 = 115 项断言，另 8 步整单流程 |

```
[ Vue3/TS 前端 :5180 ] ──代理──▶ [ Spring Boot :18082 ]
                                      ├── web/controller      # 7 个 Controller · 36 个端点
                                      ├── service             # 状态机 + 事务边界
                                      ├── domain + 状态机      # TRANSITIONS Map
                                      ├── mapper              # MyBatis，全语句带 tenant_id
                                      ├── integration         # outbox 投递 + 遥测轮询
                                      └── saas-core           # 租户上下文 + 拦截器
                                              │  ← RuoYi 外壳提供 @PreAuthorize / @Log
                                    [ MySQL openbiz_mes ]
```

```
openbiz-mes-app/
├── backend/          # 端口 18082 · fat jar
│   ├── e2e_mes.py            # 老基线：整单报工链路（9 项）
│   └── e2e_standard.py       # 统一 REST 契约（48 项）
├── frontend/         # modules.ts 元数据（目前 2 个实体页）
├── scripts/          # e2e_mes_p0.py（25）· e2e_cross_system.py（13）· e2e_iiot_telemetry.py（10）
│                     # verify_mes_p0_hardening.py（11）+ 3 个 run_*.sh 一键脚本
├── docs/             # 8 篇：00 范围 → 07 P0 收尾
└── sql/              # openbiz_mes_1_8.sql（6 张）+ 1_9.sql（7 张新表）
                      # rbac_mes_1_0.sql（25 权限点 / 4 岗位角色）
```

## 接口契约

**域动作接口**（`MesWorkOrderController`，路径前缀 `/api/mes/work-orders`）：

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/mes/work-orders` | 工单列表（租户内） |
| POST | `/api/mes/work-orders` | 建单（`workOrderNo` 可空） |
| GET | `/api/mes/work-orders/{id}` | 工单详情 |
| POST | `/api/mes/work-orders/{id}/start` | 开工 |
| POST | `/api/mes/work-orders/{id}/report` | 报工（落 `production_record`） |
| POST | `/api/mes/work-orders/{id}/qc` | 质检（`result=pass/fail`） |
| POST | `/api/mes/work-orders/{id}/complete` | 完工 |
| POST | `/api/mes/work-orders/{id}/cancel` | 取消 |
| GET | `/api/mes/work-orders/{id}/records` | 报工记录列表 |

**工序 / 追溯 / 集成接口**（P0 新增三块）：

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/mes/routings` | 建工艺路线（含工序列表） |
| GET | `/api/mes/routings/list` · `/{id}` | 路线列表 / 详情 |
| POST | `/api/mes/work-orders/{id}/operations/{opId}/report` | 工序级报工（良品 / 不良 / `eventId`） |
| GET | `/api/mes/work-orders/{id}/progress` | 各工序进度视图 |
| GET | `/api/mes/work-orders/{id}/trace` | 单工单追溯总览 |
| GET | `/api/mes/work-orders/{id}/consumptions` | 物料消耗明细 |
| GET | `/api/mes/work-orders/{id}/qc-records` | 不良明细 |
| GET | `/api/mes/integration/status` | 集成开关与两侧连通状态 |
| GET | `/api/mes/integration/outbox/list` | 投递队列（可查状态） |
| POST | `/api/mes/integration/outbox/{id}/retry` | 手动重投 |
| POST | `/api/mes/integration/dispatch` · `/poll` | 手动派发 / 手动拉遥测 |

**统一契约接口**（`StandardApiController`，与前端模板 API 工厂对齐）：

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/mes/{entity}/list` | 分页列表（`pageNum` / `pageSize`） |
| GET | `/api/mes/{entity}/stats` | 按状态计数 |
| GET | `/api/mes/{entity}/{id}` | 详情 |
| POST | `/api/mes/{entity}` | 新建 |
| PUT | `/api/mes/{entity}` | 更新（改 `status` 时走同一张迁移表校验） |
| DELETE | `/api/mes/{entity}/{id}` | 删除 |
| POST | `/api/mes/{entity}/{id}/transition?to=XXX` | 统一流转入口 |

`{entity}` 取 `work-orders`（有状态机）或 `production-record`（无状态机，流转恒非法）。`planQty` 与 `quantity` 互为别名。

请求与响应示例：

```http
POST /api/mes/work-orders
{"workOrderNo":"WO-E2E-1792907772142290200","materialId":1,"bomId":1,"quantity":10,"deviceId":1}

200 {"code":200,"msg":"操作成功","data":{"tenantId":1,"workOrder":{
      "id":3,"workOrderNo":"WO-E2E-...","materialId":1,"bomId":1,
      "quantity":10,"status":"CREATED","deviceId":1,"tenantId":1}}}
```

```http
POST /api/mes/work-orders/3/transition?to=STARTED
200 {"code":200,"data":{"status":"STARTED"}}

POST /api/mes/work-orders/3/transition?to=CANCELLED   （已完工时）
409 {"code":500,"msg":"ILLEGAL_TRANSITION: COMPLETED -> CANCELLED"}
```

```http
POST /api/mes/work-orders/3/operations/12/report
{"goodQty":60,"ngQty":3,"eventId":"EV-WO-3-OP1-001",
 "defects":[{"defectCode":"BRIDGE","qty":3}]}

200 {"code":200,"data":{"duplicate":false,"operations":[
      {"opId":12,"reportedGood":60,"reportedNg":3,"status":"DONE"}]}}

POST 同上但 goodQty=100（工序计划 80）→ 409 OPERATION_QTY_EXCEEDED
POST 同上但下游工序先报 → 409 UPSTREAM_QTY_INSUFFICIENT
```

统一错误契约（`ApiExceptionHandler`）：

| 场景 | HTTP | 响应体 |
|---|---|---|
| 成功 | 200 | `{code:200, data:…}` |
| 业务提示（登录失败等 `ServiceException`） | 200 | `{code:500, msg:"…"}` |
| 记录不存在 / 参数非法 | 400 | `{code:500, msg:"WORK_ORDER_NOT_FOUND: 12"}` |
| 状态机非法流转 | 409 | `{code:500, msg:"ILLEGAL_TRANSITION: A -> B"}` |
| 并发状态迁移 | 409 | `{code:500, msg:"CONCURRENT_TRANSITION: …"}` |
| 工序超计划 / WIP 越界 | 409 | `{code:500, msg:"OPERATION_QTY_EXCEEDED / UPSTREAM_QTY_INSUFFICIENT"}` |
| 不良明细与不良数不符 | 400 | `{code:500, msg:"DEFECT_QTY_MISMATCH: …"}` |
| 完工单被删 | 409 | `{code:500, msg:"DELETE_FORBIDDEN: status=COMPLETED"}` |
| WMS 入库未确认就完工 | 409 | `{code:500, msg:"WMS_INBOUND_NOT_CONFIRMED"}` |
| 未捕获异常 | RuoYi 全局兜底 | 只回通用错误，不泄露堆栈 |

> 演进记录：非法流转最初返回 500，与「客户端错误」语义不符；改为 409 后由 `@Order(HIGHEST_PRECEDENCE)` 的 `ApiExceptionHandler` 抢在 RuoYi 全局处理器之前接管，清空业务表重跑契约断言仍全绿。

## 核心数据模型

13 张业务表（`openbiz_mes_1_8.sql` 6 张 + `1_9.sql` 7 张），全部带 `tenant_id`，均不建外键（跨租户隔离靠应用层 + 索引，迁移与分库更简单）：

| 域 | 表 | 关键字段 | 约束 |
|---|---|---|---|
| 物料 | `openbiz_mes_material` | `material_code` · `material_name` · `material_type`(RAW) · `wms_sku_code` | `uk(tenant_id, material_code)` |
| 工艺 | `openbiz_mes_bom` | `bom_code` · `material_id` · `version` · `status` | `uk(tenant_id, bom_code)` |
| 工艺 | `openbiz_mes_bom_item` | `bom_id` · `material_id` · `quantity` | `idx(bom_id)` |
| 工艺 | `openbiz_mes_process` | `process_code` · `sequence_no` · `device_id` | `uk(tenant_id, process_code)` |
| 路线 | `openbiz_mes_routing` | `routing_code` · `material_id` · `version` · `status` | `uk(tenant_id, routing_code)` |
| 路线 | `openbiz_mes_routing_operation` | `routing_id` · `process_id` · `seq_no` · `std_time_sec` | `uk(tenant_id, routing_id, seq_no)` |
| 执行 | `openbiz_mes_work_order` | `work_order_no` · `material_id` · `bom_id` · `routing_id` · `quantity` · `status` · `device_id` · `device_code` | `uk(tenant_id, work_order_no)` |
| 报工 | `openbiz_mes_production_record` | `work_order_id` · `device_id` · `quantity` · `result` · `command_id` | `idx(work_order_id)` · `idx(command_id)` |
| 工序流水 | `openbiz_mes_operation_record` | `work_order_id` · `routing_operation_id` · `good_qty` · `ng_qty` · `event_id` · `operator` | `uk(tenant_id, event_id)` · `idx(work_order_id, routing_operation_id)` |
| 质量 | `openbiz_mes_qc_record` | `work_order_id` · `operation_record_id` · `defect_code` · `qty` · `result` · `inspector` | `idx(work_order_id)` · `idx(defect_code)` |
| 物料消耗 | `openbiz_mes_material_consumption` | `work_order_id` · `material_id` · `theory_qty` · `actual_qty` | `uk(tenant_id, work_order_id, material_id)` |
| 集成队列 | `openbiz_mes_integration_outbox` | `biz_type` · `biz_no` · `target` · `status`(PENDING/SENT) · `payload` · `retry_count` | `uk(tenant_id, biz_type, biz_no, target)` |
| 遥测游标 | `openbiz_mes_device_cursor` | `device_id` · `metric` · `last_value` · `last_ts` | `uk(tenant_id, device_id, metric)` |

三点说明：

- `device_id` 指向 IIoT 的 `openbiz_iiot_device.id`，同时冗余 `device_code`——建单时按编码回 IIoT 校验并回填 id，这是 MES 与设备之间唯一的物理连接点。
- `material.wms_sku_code` 是 MES ↔ WMS 的物料映射：MES 不该知道 WMS 的自增主键，完工入库时按业务编码让 WMS 反查 `skuId`，查不到直接 409 而不是静默降级。
- `operation_record` 只追加不更新，`event_id` 唯一索引让「终端重发」不会凭空多出一批货。

## 已知边界与风险

写清楚比藏起来有用——这几条都是能落到具体代码行的：

| 项 | 现状 | 影响 | 计划 |
|---|---|---|---|
| 状态迁移无 CAS | ~~已修~~ `AND status = #{from}` + affected 判断 | — | ✅ `docs/07` |
| 无乐观锁 | `work_order` 仍无 `version` 字段 | 字段级并发靠状态 CAS 兜主路径；通用乐观锁未上 | P1 |
| 报工词汇分叉 | ~~已修~~ 落库 OK/NG，兼容 PASS/FAIL 入参 | — | ✅ |
| 报工不累计 | 工序路径已有 `sumGoodQty`；整单路径仍只看计划量 | 整单路径超产判定弱 | 已有工序级路径 |
| 质检只有状态位 | 已有 `mes_qc_record`（P0 工序链） | 整单路径仍偏状态位 | 见 `docs/06` |
| 删除无门禁 | ~~已修~~ CREATED/CANCELLED 可删 + 清挂靠 | — | ✅ |
| 工厂维度缺失 | 工单上没有工厂/车间/产线/工位字段 | 多工厂、跨车间统计做不了 | P1 |
| 班次维度缺失 | 工序流水无 `shift` 字段 | 工时/班次产出统计做不了 | P1 |
| 前端只覆盖两实体 | 工序报工、追溯、集成运维只有后端接口 | 界面演示不到工序链 | P1 |
| 追溯只到单工单 | 跨工单的批次正/反追溯未做 | 原料批次串查要多步人工 | P1 |

### 实测数据快照（2026-11-02 21:55 · 本机库 `openbiz_mes`）

被追问「你们数据真跑过吗」时，可以直接报这张表——不是设计文档里的目标值，是库里查出来的：

| 表 | 行数 | 说明 |
|---|---|---|
| `work_order` | 25 | COMPLETED 19 / STARTED 4 / REPORTED 2 |
| `operation_record` | 33 | 工序级报工，append-only |
| `production_record` | 12 | 整单报工 |
| `qc_record` | 12 | 不良明细（缺陷码 + 不良数） |
| `routing` / `routing_operation` | 11 / 23 | 工艺路线与工序定义 |
| `material_consumption` | 22 | ⚠️ `actual_qty` 22/22 行等于 `theory_qty`，是 BOM 倒推值不是实领 |
| `integration_outbox` | 23 | SENT 10（真投递 WMS）/ PENDING 13（均为验收造的 `WO-E2E-*` 单，跑验收时按设计关掉了 job 开关） |
| `device_cursor` | 1 | IIoT 回写 `output_count=1050`，遥测链路真通 |
| `sys_oper_log` | 271 | 7 类操作留痕：工序报工 103、工单开工 43、工艺路线 37、完工 35、质检 29、报工 14、取消 10 |

跨系统落地证据：WMS 库 `openbiz_wms_inbound` 里存在 `source_doc_no = WO-*` 且 `inbound_type = PRODUCTION` 的入库单——MES 完工指令确实推动了下游库存。

## 与 WMS / IIoT 的边界

| 协同 | 链路 | 状态 |
|---|---|---|
| WMS | 完工 → outbox → WMS 生产入库单（`source_doc_no` = 工单号，自动收货） | ✅ 已打通 · 跨系统 13 项全绿 |
| IIoT | 设备计数增量 → 工序报工（游标去重，超计划截断） | ✅ 已打通 · 10 项全绿 |
| WMS | 开工领料 → WMS 出库 → 回写实际发料 | 📋 未做（缺领料单） |
| IIoT | 设备状态 / 告警 → 进度与 OEE | 📋 未做（缺 status-durations 聚合） |
| ERP | 订单 / BOM 下发；完工回写 | 📋 未做 |

原则：**独立库、不共享表**；MES 单据号写进 WMS 的 `source_doc_no`，WMS 侧 `inbound_type=PRODUCTION` 区分来源，无需跨库 join。

两条已打通的链路都刻意做成**弱依赖**：

- 完工时先把指令写 `mes_integration_outbox`，再异步投 WMS。WMS 宕机不阻塞车间生产，只是队列里多几条 PENDING；运维在 `/integration/outbox/list` 一眼能看到并手动重投。
- 重投靠 `uk(tenant_id, biz_type, biz_no, target)` 幂等：同一张工单重复投递，WMS 返回已有单据，MES 侧识别到非 `CREATED` 状态就跳过收货，不会撞状态机报错。

## 实施路线与验收

1. **阶段一（已达成）**：工单状态机 + 整单报工 + 多租户，域链路 9 项 + 统一契约 48 项断言全绿
2. **阶段二（已达成）**：P0 三链 —— 工序链 / 追溯链 / 集成链（`docs/00`~`06`）；收尾三硬伤（CAS / OK·NG / 禁删，`docs/07`）
3. **阶段三（下一步）**：工厂主数据、班次、领料齐套、PDA、看板，以及前端补工序报工与追溯页
4. **阶段四**：排产、批次追溯、OEE、ERP 接入

阶段一验收基线（证据：`backend/E2E-RESULT.txt`）：

| # | 验收项 | 通过标准 | 实测 |
|---|---|---|---|
| 1 | 登录 | `POST /login` 返回 200 且带 token | ✅ |
| 2 | 建单 | 返回 `status=CREATED`，工单号唯一 | ✅ |
| 3 | 开工 → 报工 | 状态依次 STARTED / REPORTED，`records` 条数 +1 | ✅ |
| 4 | 质检 → 完工 | QC_PASSED → COMPLETED | ✅ |
| 5 | 非法流转 | 完工后取消返回 409 `ILLEGAL_TRANSITION` | ✅ |
| 6 | 统一契约 | list / stats / transition / CRUD 48 项断言全过 | ✅ |
| 7 | 统计口径 | `/stats` 七态键齐全，状态变化后计数同步 | ✅ |
| 8 | 前端构建 | `npm run build`（含 vue-tsc 类型检查）通过 | ✅ |

### 当前验收总账（6 套脚本 · 115 项断言 + 8 步流程）

下表数字全部来自本机实跑（Windows 11 / JDK 21 / MySQL 8.0.44），不是估算：

| 脚本 | 断言 | 覆盖什么 |
|---|---|---|
| `backend/e2e_mes.py` | 8 步流程 | 老基线：整单报工链路（`routing_id IS NULL` 语义未变）。**这套用原生 `assert` 而非 `check()` 计数，故按步骤数记** |
| `backend/e2e_standard.py` | 48 | 统一 REST 契约：list / stats / transition / CRUD / 禁删门禁 |
| `scripts/e2e_mes_p0.py` | 25 | 工序级报工、WIP 门禁、事件幂等、追溯、outbox、权限分级、分页 |
| `scripts/verify_mes_p0_hardening.py` | 11 | CAS / OK·NG 归一 / 完工禁删三项硬伤 |
| `scripts/e2e_cross_system.py` | 13 | MES 完工 → WMS 生产入库：门禁、幂等、对账 |
| `scripts/e2e_iiot_telemetry.py` | 10 | IIoT 计数增量 → MES 工序报工：基线、去重、截断 |
| **合计** | **115 断言 + 8 步流程** | 前 3 套由 `run_mes_e2e.sh` 一条命令跑完；跨系统两套各自拉起 MES + 另一个系统 |

> **2026-11-02 复跑校准**：域链路那套是 8 步原生 `assert` 的流程脚本，此前按 9 项计入总数属于计法错误。实际为 48 + 25 + 11 + 13 + 10 = **115 项断言**，另加 8 步端到端流程。

几个值得单独说的断言（都是踩过坑才写的）：

| 断言 | 想证明什么 |
|---|---|
| 未开工报工返回 409 | 状态机不是装饰，`CREATED` 不能直接报工 |
| 同一 `eventId` 重发不重复计产 | 终端网络抖动重发，不会凭空多出一批货 |
| 下游工序不能超过上游产出 | WIP 流转不变量：不会出现「成品 100 件但只走到测试 60 件」 |
| 不良明细合计 ≠ 不良数被拒 | 质检数据自身要自洽，否则追溯时对不上 |
| 首次采集不产生产量（只落基线） | 设备计数器从 0 到 50000，一联网就报 5 万件 |
| WMS 未确认前完工被拦下 | 否则仓库账上少一批货、MES 上却显示已完工 |
| 重复投递不产生第二张入库单 | 幂等靠 `uk(tenant_id, biz_type, biz_no, target)`，不是靠运气 |

复现：

```bash
cd E:/8.cangku/for-job/openbiz-mes-app
bash scripts/run_mes_e2e.sh        # 单系统三套：8 步流程 + 48 + 25
bash scripts/run_cross_e2e.sh      # 跨 WMS：13（需 MES 以 MES_WMS_ENABLED=true 起）
bash scripts/run_iiot_e2e.sh       # 跨 IIoT：10
python scripts/verify_mes_p0_hardening.py   # 收尾三硬伤：11
```

> 踩过的坑：验收脚本原来把端口写死 18082，用 `run_mes_e2e.sh 19082` 起服务时，前两套脚本其实打到了 18082 上常驻的旧实例，结论不可信。现已改为 `MES_BASE` 环境变量贯穿，端口参数真正生效——**验收脚本打错实例，比断言写错更隐蔽**。

建库（按本机 MySQL 账号输入密码，四个脚本均幂等，可重复执行）：

```bash
mysql -uroot -p openbiz_mes < sql/openbiz_mes_1_8.sql   # 6 张基础表
mysql -uroot -p openbiz_mes < sql/openbiz_mes_1_9.sql   # 7 张工序/追溯/集成表
mysql -uroot -p openbiz_mes < sql/rbac_mes_1_0.sql       # 25 权限点 + 4 岗位角色
mysql -uroot -p openbiz_mes < sql/reset_mes_demo.sql     # 演示主数据
```

后端 `java -jar backend/target/openbiz-mes-app.jar`（:18082），前端 `cd frontend && npm run dev`（代理到 18082），登录 `admin / admin123`。完整说明见工程内 `README.md` 与 `docs/00-P0范围与验收.md`；实证页：[OpenBiz › MES](/apps/openbiz/mes)。

## 相关链接

- 模块总览：[02 工业数字化应用](/instances/industrial/)
- 同套件：[WMS](./wms) · [IIoT](./iiot)
- 实践文：[轻量 MES 落地](/apps/industrial/mes-lite) · [工业数字化总览](/tech-system/industrial-digitalization/)
- 关联方案：[库存并发扣减](/scenarios/inventory-deduction)（WMS 侧的 CAS 写法，可作 MES 状态迁移的参照）

---

上一级：[02 工业数字化应用](/instances/industrial/) · [实例总览](/instances/)
