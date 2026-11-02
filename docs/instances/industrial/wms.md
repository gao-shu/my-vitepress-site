# WMS 仓储管理系统

<div class="sys-hero">
  <div class="sys-hero__eyebrow">02 工业数字化 · 优先级 3 / 3</div>
  <div class="sys-hero__badges">
    <span class="sys-badge sys-badge--ok">✅ 已跑通（收货 → 上架 → 拣货 → 发货全链路）</span>
    <span class="sys-badge">Java 21 · Spring Boot 3</span>
    <span class="sys-badge">:18086 · openbiz_wms</span>
    <span class="sys-badge">17 表 · 2 视图 · 2 触发器</span>
    <span class="sys-badge">验收 297 项断言</span>
  </div>
  <p class="sys-hero__pitch">带批次与效期的工厂仓：货在哪、有多少、从哪来到哪去，账实对得上，先到期的先出，并发下单不超卖</p>
</div>

> 诚实边界：库存中心、入出库主链路、移库、盘点、退货、Excel / 打印、多租户、报表、PDA 扫码壳、操作日志页、CI/Docker、Swagger 都已实现（`docs/11` A/B/C 齐）。**未做**：上架策略与波次、库存冻结与手工调整、批次正反向追溯、与 MES/ERP 的 `/open/v1/**` 开放接口（设计有、代码未实装）、万级 SKU 吞吐。`PRODUCTION` / `PICKING` 目前是可存枚举，走同一主链路，无专属分支。中小自营仓日常作业大约覆盖 **70%～80%**；3PL / 立库 / 波次拣货不在范围。

## 业务场景

**一家什么样的仓**：原料仓 + 成品仓，物料带批次与效期（食品、化工、汽配、医药中间体这类行业最常见）。仓管用 Excel 记账，月底盘一次，盘完调平。

| 角色 | 在系统里做什么 | 没有系统时的样子 |
|---|---|---|
| 收货员 | 收货登记，货进待检位并锁定 | 手写收货单，先堆在待检区，账上没数 |
| 质检员 | 逐行判定 PASS / FAIL | 结果回填不及时，货已经被上架了 |
| 上架工 | 按库位建议上架，落流水 | 哪有空位放哪，找货靠老员工记忆 |
| 拣货员 | 按 FEFO 分配结果拣货 | 凭手感拿，临期货压到过期才报废 |
| 复核员 | 复核发货，扣减库存并落流水 | 发多发少没人核，差异留到月底 |
| 仓管主管 | 看三态余额与对账差异 | 盘库靠点数，差异拍脑袋调平 |

**这段业务真正难的地方是账实一致**：库存从来不是一个数字，而是「在手 / 已占 / 锁定」三个数加一本只能追加的流水。少一个维度就会出现两种典型事故——把已分配未发货的货又卖一次（超卖），或者账面有货实物没有（盘亏说不清）。

三条落到业务上的硬约束：

- **预占不动流水，只转移分配权**：`SUM(流水) = on_hand` 才成立，否则对账口径直接作废
- **冲红也走 INSERT**：任何时点的库存都能重放出来，不是靠「最后改了一次」
- **扣减走 CAS 条件更新**：100 并发打同一 SKU 也不会为负

## 功能架构

<svg viewBox="0 0 880 180" width="100%" style="max-width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="WMS 功能架构图">
<rect x="0" y="0" width="880" height="180" rx="14" fill="var(--vp-c-bg-soft)"/>
<text x="124" y="40" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">终端层</text>
<rect x="140" y="16" width="232" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="256" y="40" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">Vue3 管理端</text>
<rect x="384" y="16" width="232" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="500" y="40" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">PDA 扫码端</text>
<rect x="628" y="16" width="232" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="744" y="40" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">标签 / 电子秤</text>
<text x="124" y="98" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">应用层</text>
<rect x="140" y="74" width="134" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="207" y="98" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">入库管理</text>
<rect x="286" y="74" width="134" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="353" y="98" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">出库管理</text>
<rect x="433" y="74" width="134" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="500" y="98" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">移库 / 盘点</text>
<rect x="579" y="74" width="134" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="646" y="98" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">库存中心</text>
<rect x="726" y="74" width="134" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="793" y="98" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">策略引擎</text>
<text x="124" y="156" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">领域层</text>
<rect x="140" y="132" width="171" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="226" y="156" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">库位 · 三级结构</text>
<rect x="323" y="132" width="171" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="408" y="156" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">批次 · 效期</text>
<rect x="506" y="132" width="171" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="591" y="156" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">单据状态机</text>
<rect x="689" y="132" width="171" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="774" y="156" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">扣减 · 预占</text>
</svg>

实心高亮 = 已实现：**入库 · 出库 · 移库 / 盘点 · 库存中心 · 扣减预占**。空心为 P1 / P2：库内策略（上架策略、波次拣货，明确不做）、策略引擎、标签设备对接。

## 核心亮点

<div class="sys-grid">
  <div class="sys-card">
    <div class="sys-card__icon">📦</div>
    <div class="sys-card__title">三态库存</div>
    <div class="sys-card__desc">available / reserved / locked，单字段 qty 撑不住「已分配未发货」</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🧾</div>
    <div class="sys-card__title">不可篡改流水</div>
    <div class="sys-card__desc">append-only 台账，冲红也走 INSERT，对账可复现任意时点</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🔀</div>
    <div class="sys-card__title">单据状态机</div>
    <div class="sys-card__desc">入库 / 出库各有流转约束，非法跳转统一 409 拦截</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🗺</div>
    <div class="sys-card__title">三级库位</div>
    <div class="sys-card__desc">仓 → 区 → 位，库存落到格，拣货才不用满仓找</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">⏳</div>
    <div class="sys-card__title">批次 FEFO</div>
    <div class="sys-card__desc">先到期先出，正反向追溯全靠流水串起来</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🔒</div>
    <div class="sys-card__title">并发不超卖</div>
    <div class="sys-card__desc">CAS 条件更新 + 同事务落账，100 并发打同一 SKU 也不为负</div>
  </div>
</div>

## 功能清单

> 状态图例：✅ 已实现并有验收断言 · 🔧 部分实现（字段/类型就位，专属业务分支未做） · 📋 待做

### P0 · 最小闭环

| 功能域 | 功能 | 状态 | 说明 |
|---|---|---|---|
| 基础档案 | 仓库 / 库区 / 库位 | ✅ | 三级库位，树形维护 + 引用守卫 |
| 基础档案 | SKU 物料主数据 | ✅ | 规格、单位、批次/效期开关 |
| 基础档案 | 批次 / 效期 | ✅ | 临期 30 天预警、过期拦截分配 |
| 入库 | 采购入库 `PURCHASE`（收货 → 上架） | ✅ | 主路径，5 步状态机，类型缺省值 |
| 入库 | 退货入库 `RETURN` | ✅ | 必填 `ref_doc_no` 关联原出库单，按行校验可退量，累计不超原发；`verify_return.py` 17 项 |
| 入库 | 生产入库 `PRODUCTION` | 🔧 | 类型值可存、走同一主链路；MES 完工推送 `POST /open/v1/production-inbound` 仅有设计稿 |
| 库存 | 实时库存（三态余额） | ✅ | available / reserved / locked |
| 库存 | 正确性扣减 | ✅ | CAS 条件更新 + 同事务落账 |
| 库存 | 库存流水（append-only） | ✅ | 不可篡改台账，触发器兜底 |
| 出库 | 销售出库 `SALES`（拣货 → 发货） | ✅ | 主路径，6 步状态机，类型缺省值 |
| 出库 | FEFO 分配 | ✅ | `expiry_date ASC`，过期批次不分配 |
| 出库 | 领料出库 `PICKING` | 🔧 | 类型值可存、走同一主链路；MES 领料 `POST /open/v1/picking-request` 仅有设计稿 |
| 出库 | 取消出库（释放预占） | ✅ | 按 `wms_alloc` 行精确释放 |
| 库内作业 | 移库 / 调拨（建单 → 确认 → 作废） | ✅ | `TF` 单号；确认时 CAS 扣源库位、加目标库位，落 `TRANSFER` 流水，**净变动按库位对冲，不进收发存的出库口径** |
| 库内作业 | 移库校验 | ✅ | 同库位 / `qty ≤ 0` / 库位或 SKU 不存在 → 400；重复确认由 `markDone` 影响 0 行兜住 |
| 库内作业 | 移库的自动化验收 | ✅ | `verify_transfer.py` · 作废 / 确认扣增 / TRANSFER 流水 / 同库位与超量拒绝 / 对账 |

### 交付补齐（工程 A 档）

| 功能 | 状态 | 说明 |
|---|---|---|
| Excel 导入导出（SKU / 库位 / 期初 / 单据） | ✅ | `docs/12-sprint1-excel.md` · `verify_excel.py` 18 项 |
| 打印 / 条码模板 | ✅ | `docs/13-sprint1-print.md` · `verify_print.py` 16 项 |
| 退货入库 `RETURN` | ✅ | `ref_doc_no` 关联原出库；可退量累计 · `verify_return.py` 17 项 |
| 多租户对照验收 | ✅ | `admin2`@租户2 · `verify_tenant_isolation.py` 18 项 |
| 收发存 / 库龄 / 呆滞报表 | ✅ | `docs/16-sprint2-report.md` · `verify_report.py` 22 项，库龄四档 0-30 / 31-60 / 61-90 / 90+ |
| 移库 / 调拨验收 | ✅ | `docs/17-sprint2-transfer.md` · `verify_transfer.py` 22 项（源减目标增 / TRANSFER 流水 / 同库位与超量拒绝 / 对账健康） |
| 盘点调平 | ✅ | 账面快照 + 四条拒绝路径（未盘完 / 盘亏吃预占 / 超量 / 重复提交）· `verify_stocktake.py` 35 项 |
| 盘点按库区 / 品类生成 | ✅ | `docs/19-sprint2-stocktake-scope.md` · `verify_stocktake_scope.py` 14 项 |
| 操作日志查询页 | ✅ | `docs/20-c4-operlog.md` · `verify_operlog.py` |
| Docker / GitHub Actions CI | ✅ | `docs/21-c2-ci-docker.md` · `ci/m2-seed` 注入私有底座 · GHA 前端 typecheck/build + `mvn test` · `Dockerfile` / `docker-compose.yml` |
| API 文档（Swagger / springdoc） | ✅ | `docs/22-c3-swagger.md` · `/swagger-ui.html` · `/v3/api-docs` · `verify_swagger.py` |
| PDA 扫码端 | ✅ | `docs/18-sprint2-pda.md` · `verify_pda.py` 11 项；8 个 PDA 页面 + 统一 `GET /pda/resolve` 扫码解析，收货 / 上架 / 拣货 / 盘点复用原接口 |
| RBAC / 审计 / 备份 | ✅ | 5 角色 46 项 · 操作留痕 15 项 · 备份恢复 16 项 |

### P1 / P2 · 路线

| 阶段 | 功能 | 状态 |
|---|---|---|
| P1 | ASN 预收货、上架策略（波次拣货明确不做） | 📋 |
| P1 | 库存冻结与手工调整（移库 / 调拨已完成，见上） | 📋 |
| P1 | 批次正反向追溯（FIFO / FEFO 分配已入 P0） | 📋 |
| P1 | 预警（上下限 / 效期） | 📋 |
| P1 | ERP 订单 / MES 领料 OpenAPI | 📋 |
| P2 | 万级 SKU 吞吐优化（分桶 / 缓存 / 批量落库 / 分库） | 📋 |
| P2 | TMS 发运、IIoT AGV/立库、多货主计费、行业模板 | 📋 |

## 核心流程

```
收货 ─▶ 质检 ─▶ 上架 ─▶ (流水 IN +N) ─▶ 拣货 ─▶ 复核 ─▶ 发货 ─▶ (流水 OUT -N)
```

每一步对库存的副作用 —— 这是 WMS 唯一真正难的地方。注意 `available` 是生成列（`on_hand - reserved - locked`），没人直接写它，只改三态：

| 环节 | `on_hand` | `reserved` | `locked` | 流水事件 |
|---|---|---|---|---|
| 收货（入待检位） | `+N` | — | `+N` | `INBOUND_RECEIVE` |
| 质检 PASS | — | — | — | 无 |
| 质检 FAIL | — | — | — | 无（货留在待检位，单据转 `QC_FAIL`） |
| 上架（出待检位） | `-N` | — | `-N` | `INBOUND_PUTAWAY` |
| 上架（入存储位） | `+N` | — | — | `INBOUND_PUTAWAY` |
| 拣货分配 | — | `+N` | — | **无**（预占只转移分配权，不进流水） |
| 复核 | — | — | — | 无（校验实物与单） |
| 发货 | `-N` | `-N` | — | `OUTBOUND_SHIP` |
| 取消出库 | — | `-N` | — | **无**（按 `wms_alloc` 行释放） |
| 移库确认 | 源 `-N` / 目标 `+N` | — | — | `TRANSFER` ×2（一出一入，合计净变动 0） |
| 盘点调平 | `±diff` | — | — | `STOCKTAKE_ADJUST` |

移库为什么单独用 `TRANSFER` 事件而不是「假出库 + 假入库」：一旦借用了出库口径，收发存报表会把内部搬货算成发货，月底对不上账。两条相反流水、同一 `doc_no`，净变动恒为 0，报表按事件类型就能把它们排除在外。

「预占不进流水」不是省事，是必须：`SUM(qty_change)` 必须等于 `on_hand`，否则对账口径直接作废。预占的正确性靠第二条独立校验 `v_wms_reserve_reconcile`（`reserved` = 未发货 alloc 合计）兜住。

## 单据状态机

**入库单**

```
CREATED → RECEIVED → QC → PUTAWAY → DONE
              ↘ QC_FAIL（待检 / 退货分支）
任意未终态 → CANCELLED（已上架不可取消，只能冲红）
```

**出库单**

```
CREATED → ALLOCATED → PICKED → CHECKED → SHIPPED → DONE
             ↘ SHORT（缺货：回退 ALLOCATED 或部分发货）
任意未终态 → CANCELLED（SHIPPED 后不可取消）
```

关键接口（前缀 `/api/wms`）：

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/inbound` | 建入库单 |
| POST | `/inbound/{id}/receive` | 收货登记（入待检位，`locked += n`） |
| POST | `/inbound/{id}/qc` | 逐行质检 PASS / FAIL |
| POST | `/inbound/{id}/putaway` | 上架（落流水） |
| POST | `/outbound` | 建出库单 |
| POST | `/outbound/{id}/allocate` | 分配（FEFO 预占，返回 alloc 明细） |
| POST | `/outbound/{id}/pick` | 拣货确认 |
| POST | `/outbound/{id}/ship` | 复核发货（扣减 + 流水） |
| POST | `/outbound/{id}/cancel` | 取消（按 alloc 行释放） |
| GET | `/stock` · `/stock/flow` | 三态余额 / 流水查询 |
| GET | `/stock/reconcile` | 两条对账校验，`diff <> 0` 即异常 |
| POST | `/transfer` | 建移库单（`fromLocationCode` / `toLocationCode` / `qty`） |
| POST | `/transfer/{id}/confirm` | 执行移库：CAS 扣源库位、加目标库位，落 `TRANSFER` 流水 |
| POST | `/transfer/{id}/cancel` | 作废（仅 `CREATED`，与 MES 状态机同一套 409 约束） |
| POST | `/stocktake` · `/{id}/confirm` · `/{id}/cancel` | 盘点单建单 / 调平 / 作废 |
| GET | `/report/io` · `/report/aging` · `/report/stale` | 收发存 / 库龄四档 / 呆滞 |
| GET | `/pda/resolve?code=` | 扫码解析：码 → 单据/物料/库位，PDA 端统一入口（收货、上架、拣货、盘点复用上面这些接口） |

完整请求体、响应体、错误码与幂等约定见工程 `docs/04-接口设计.md`。

状态机不写在 if-else 里：统一走 `StatusMachine` + `ILLEGAL_TRANSITION`，非法流转返回 409。与 [MES 状态机](./mes#状态机) 同一套做法。

## 技术栈与架构

| 层 | 技术 | 职责 |
|---|---|---|
| 后端 | Java 21 · Spring Boot 3.5 · MyBatis | REST、事务、库存扣减（正确性靠 DB 行锁 + 条件更新，不靠分布式锁） |
| 前端 | Vue 3 · TypeScript · Element Plus | 管理端 13 条业务路由（10 个列表页 + 3 个详情页） |
| 终端 | 浏览器 + PDA 壳 | `/pda` 扫枪键盘楔；无独立 App |
| 存储 | MySQL 8（`openbiz_wms`） | 17 张业务表 + 2 个对账视图 + 2 个流水触发器 |
| 缓存 | Redis | 只给底座用（token / 会话），**不参与库存扣减** |
| 消息 | 未接 MQ | 与 MES / ERP 的联动只有设计稿，无生产者也无消费者 |
| 底座 | OpenBiz saas-core + RuoYi 登录外壳 | 多租户 / 权限 / 审计 / 备份 |

<svg viewBox="0 0 880 292" width="100%" style="max-width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="WMS 分层结构图">
<rect x="0" y="0" width="880" height="292" rx="14" fill="var(--vp-c-bg-soft)"/>
<text x="124" y="38" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">接口</text>
<rect x="140" y="16" width="720" height="34" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="158" y="38" font-size="13" fill="var(--vp-c-text-1)">web/ · 11 个 Controller · 68 个方法级端点</text>
<text x="844" y="38" font-size="12" text-anchor="end" fill="var(--vp-c-text-3)">校验 · 租户 · 幂等</text>
<text x="124" y="84" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">应用</text>
<rect x="140" y="62" width="720" height="34" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="158" y="84" font-size="13" fill="var(--vp-c-text-1)">application/ · 用例编排</text>
<text x="844" y="84" font-size="12" text-anchor="end" fill="var(--vp-c-text-3)">入 / 出 / 移库 / 盘点事务边界</text>
<text x="124" y="130" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">领域</text>
<rect x="140" y="108" width="720" height="34" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="158" y="130" font-size="13" fill="var(--vp-c-text-1)">domain/ · 库存 · 库位 · 批次 · 策略 · 状态机</text>
<text x="844" y="130" font-size="12" text-anchor="end" fill="var(--vp-c-text-3)">扣减与预占只在这里发生</text>
<text x="124" y="176" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">持久</text>
<rect x="140" y="154" width="720" height="34" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="158" y="176" font-size="13" fill="var(--vp-c-text-1)">mapper/ · MyBatis</text>
<text x="844" y="176" font-size="12" text-anchor="end" fill="var(--vp-c-text-3)">CAS 更新、流水只 INSERT</text>
<text x="124" y="222" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">设施</text>
<rect x="140" y="200" width="720" height="34" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="158" y="222" font-size="13" fill="var(--vp-c-text-1)">infrastructure/ · 打印 · Excel · 备份</text>
<text x="844" y="222" font-size="12" text-anchor="end" fill="var(--vp-c-text-3)">标签模板、导入导出、mysqldump</text>
<text x="124" y="268" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">底座</text>
<rect x="140" y="246" width="720" height="34" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)" stroke-dasharray="5 4"/>
<text x="158" y="268" font-size="13" fill="var(--vp-c-text-1)">openbiz-saas-core · 多租户 / 权限 / 状态机</text>
<text x="844" y="268" font-size="12" text-anchor="end" fill="var(--vp-c-text-3)">MySQL openbiz_wms</text>
</svg>

工程目录：

```
openbiz-wms-app/
├── backend/     # Spring Boot · 端口 18086
├── frontend/    # Vue3/TS
├── sql/         # 业务表
├── scripts/     # E2E 验收脚本
└── README.md
```

## 库存模型

余额拆三态。单字段 `qty` 一定会在「已分配未发货」时出错：账面有货，实际发不出。

| 字段 | 含义 | 谁改 |
|---|---|---|
| `on_hand` | 账面实存，货在仓库里就算 | 收货 `+` / 上架 `-`(出待检位) `+`(入存储位) / 发货 `-` / 盘盈亏 `±` |
| `reserved` | 已被出库单占用，货还在架上 | 分配 `+` / 发货 `-` / 取消 `-` |
| `locked` | 质检待判、盘点锁定、异常冻结 | 收货入待检 `+` / 上架出待检 `-` / 冻结 `+` / 解冻 `-` |
| `available` | 可用，能被新单据分配 | **生成列，没人直接写**：`on_hand - reserved - locked` |

两条约束：三态均不得为负（`CHECK`）；任意时刻 `SUM(flow.qty_change) = on_hand`，且 `reserved` = 未发货 `alloc` 合计（两个视图各管一条）。

扣减分两层，别混着讲：

| 层 | 目标 | 做法 |
|---|---|---|
| 正确性 · **P0** | 不超卖、余额与流水一致 | `UPDATE ... WHERE available >= #{n}` 单语句 CAS + 同事务写流水；或 `reserved` 两段式预占 |
| 吞吐 · P2 | 万级并发不排队 | 库存分桶 / Redis 热点缓存 / 批量合并落库 / 分库 |

**只有 `StockService` 能写 `wms_stock` 与 `wms_stock_flow`**，Controller 与单据 Service 一律不许直接 `UPDATE`。

「不可篡改流水」是三条硬约束，不是形容词：

1. **应用层**：只允许 `INSERT`，不提供 update / delete 接口，Mapper 不生成对应语句。
2. **数据库层**：`REVOKE UPDATE, DELETE`，或触发器 `BEFORE UPDATE / DELETE → SIGNAL SQLSTATE '45000'`，绕过应用层的写也失败。
3. **字段一次写全**：`doc_no` · `biz_type` · `sku_id` · `batch_id` · `location_id` · `qty_change` · `qty_before` · `qty_after` · `operator` · `occurred_at`。

冲红也走 INSERT（反向 `qty_change`），不改历史行 —— 按时间轴累加即可复现任意时点库存。细节见 [库存并发扣减与防超卖](/scenarios/inventory-deduction)。

## 系统边界

| 协同 | 链路 | 方向 | 现状 |
|---|---|---|---|
| MES | 开工领料 → WMS 出库 → 回写 | MES ↔ WMS | 📋 设计稿有 `POST /open/v1/picking-request`，代码未实装 |
| MES | 完工 → WMS 生产入库上架 | MES ↔ WMS | 📋 设计稿有 `POST /open/v1/production-inbound`，代码未实装 |
| IIoT | AGV / 立库状态 → 调度 | IIoT → WMS | 📋 P2 |
| ERP | 采购 / 销售订单 → 入出库单 | ERP ↔ WMS | 📋 P1；`source_doc_no` 幂等字段已留，但无调用方 |

原则：各系统独立库、不共享表；将来同步走 OpenAPI、异步走 MQ；`tenantId` 全程透传。

但要讲清楚现状：**当前 WMS 没有任何跨系统调用**——全库 grep 不到 HTTP client，也没有 MQ 生产者 / 消费者，`/open/v1/**` 只存在于 `docs/04-接口设计.md`。能做的是「别的系统按 WMS 的入出库接口来建单」，反过来 WMS 不主动推事件。这一层属于真正落地时补的第一块，不是已经具备的能力。

## 路线与验收

1. **阶段一（最小闭环）**：建 `openbiz-wms-app`，核心表 + 「收货 → 上架 → 流水 → 拣货 → 发货」单链 E2E —— **已达成**
2. **阶段二（Sprint 1 / Sprint 2 已完成）**：Excel / 打印 / 退货 / 多租户 / 盘点 / 报表 / 移库调拨 / PDA 扫码 —— **已达成**（`verify_all` 13 套 297 项）
3. **阶段三（未开始）**：批次正反向追溯、预警、与 MES / ERP 开放接口；TMS / IIoT / 性能与行业模板靠后

阶段一做到下面 7 条才算跑通：

| # | 验收项 | 通过标准 | 实测 |
|---|---|---|---|
| 1 | 链路 | 建入库单 → 收货 → 质检 → 上架 → 建出库单 → 分配 → 拣货 → 发货，全程无手工改库 | ✅ `e2e_wms.py` 42 项 |
| 2 | 建表 | 17 张表（主数据 5 / 单据 4 / 库存 3 / 单号序列 1 / 盘点 2 / 移库 2）+ 2 个对账视图 + 2 个流水触发器，种子数据含 WH01 / 待检位 / SKU | ✅ 见 `sql/` 11 个脚本 |
| 3 | 接口 | 上表关键接口可用（全量 68 个方法级端点，11 个 Controller），非法状态流转返回 409 | ✅ |
| 4 | 库存 | 上架后 `on_hand` 增、发货后 `on_hand` 与 `reserved` 同减；两条对账视图 `diff` 恒为 0 | ✅ `stockDiff=0` / `reserveDiff=0` |
| 5 | 并发 | 同一 SKU 并发 100 次发货，成功数 = 实际库存数，`available` 从不为负 | ✅ 恰好 10 成功，7 项断言 |
| 6 | 流水 | 无任何 update / delete 入口；直接 `UPDATE wms_stock_flow` 被数据库拒绝 | ✅ 触发器 `trg_wms_flow_no_update` / `no_delete` |
| 7 | E2E | 一条可重复执行的脚本跑完整条链并断言库存，落在 `scripts/` | ✅ `run_wms_e2e.sh`，连跑两次 exit 0 |

## 相关链接

- 模块总览：[02 工业数字化应用](/instances/industrial/)
- 同套件：[MES](./mes) · [IIoT](./iiot)
- 关联方案：[库存并发扣减](/scenarios/inventory-deduction) · [批次 FEFO](/scenarios/batch-fefo) · [库位分配](/scenarios/location-allocation)
- 设计文档：`E:/8.cangku/for-job/openbiz-wms-app/docs/`（**22 篇**，00 开源参考 → 04 接口设计 → 06 验收清单 → 16 报表 / 17 移库 / 18 PDA → 20 操作日志 / 21 CI·Docker / 22 Swagger）
- 实证（2026-11-02 更新）：
  - **一键验收** `bash scripts/verify_all.sh` → 13 个套件 **297 项断言**（单测 34 + 交付 27 + 权限 46 + 审计 15 + 盘点 35 + 备份 16 + Excel 18 + 打印 16 + 退货 17 + 多租户 18 + 报表 22 + 移库 22 + PDA 11）
  - **主链路 E2E** `bash scripts/run_wms_e2e.sh` → `e2e_wms.py` **42 项** + `concurrency_check.py` **7 项**（100 并发恰好 10 成功、零超卖）
  - **前端 UI 冒烟** `ui_smoke.py` → **38 项**（8 个管理端页面：SKU / 库位 / 批次 / 入库 / 出库 / 库存 / 流水 / 主数据，真实点击增删改、列表→详情、零 console error）；移库 / 报表 / 盘点 / PDA 页面尚未纳入 UI 冒烟
  - 证据文件：工程根目录 `E2E-RESULT.txt` · `UI-SMOKE-RESULT.txt` · `screenshots/`

> 已知未覆盖：`PRODUCTION` / `PICKING` 只有类型值没有专属分支；移库只有 HTTP 验收、没有单元测试；无开放接口、无 MQ；PDA 是浏览器壳（键盘楔）非原生 App；并发只验了 100 这一档。

---

上一级：[02 工业数字化应用](/instances/industrial/) · [实例总览](/instances/)
