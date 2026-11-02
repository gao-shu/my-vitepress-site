# ERP 企业资源计划系统

<div class="sys-hero">
  <div class="sys-hero__eyebrow">03 企业业务应用 · 工程量最大 · OpenBiz 第 5 个独立应用</div>
  <div class="sys-hero__badges">
    <span class="sys-badge sys-badge--ok">✅ 已验证（采购域闭环 + 库存入账）</span>
    <span class="sys-badge">Java 21 · Spring Boot 3</span>
    <span class="sys-badge">:18085 · openbiz_erp</span>
    <span class="sys-badge">6 张业务表 + 1 计数器表 · 41 个端点</span>
    <span class="sys-badge">E2E 259 条断言全绿</span>
    <span class="sys-badge">单测 125 条 · 1.3s</span>
    <span class="sys-badge">6 线程并发实测</span>
    <span class="sys-badge">账实相符已断言</span>
  </div>
  <p class="sys-hero__pitch">把「采购靠 Excel、库存靠盘点」的混乱，收成一条有状态约束、账实一致、可审计的单据链</p>
</div>

<div class="sys-grid">
  <div class="sys-card">
    <div class="sys-card__icon">📦</div>
    <div class="sys-card__title">收货即入库</div>
    <div class="sys-card__desc">ORDERED → RECEIVED 与「写流水 + 加库存」在同一事务内，要么全成要么全滚</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">⚖️</div>
    <div class="sys-card__title">移动加权平均成本</div>
    <div class="sys-card__desc">一条 ON DUPLICATE KEY UPDATE 原子完成，成本随入库自动滚动</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🔐</div>
    <div class="sys-card__title">业务权限 + 职责分离</div>
    <div class="sys-card__desc">采购员 / 审批人 / 仓管 / 主管四角色，提交人不能审批自己的单</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">📄</div>
    <div class="sys-card__title">主子结构 + 业务单号</div>
    <div class="sys-card__desc">主单持状态机，明细持物料与金额；PO-yyyyMMdd-NNNN 可追溯到库存流水</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🚫</div>
    <div class="sys-card__title">三类错误分层</div>
    <div class="sys-card__desc">400 参数错 / 403 要授权 / 409 状态或业务规则冲突，语义不混用</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🏢</div>
    <div class="sys-card__title">多租户隔离</div>
    <div class="sys-card__desc">全语句带 tenant_id，独立库 openbiz_erp，租户物理隔离</div>
  </div>
</div>

> 诚实边界：当前覆盖「物料主数据 → 供应商 → 采购单 → 收货入库 → 库存台账 → 库存流水」这条**采购域闭环**，库存是真实可记账的（不再是「收货只改状态」）。但**销售、应收应付、财务总账、BOM / MRP、多仓与批次**仍未实现，审批仍是单级硬编码——这些归 P2 / P3，不伪装成已完成。并发这一块 1.5 已经补上实测：6 个线程同时收货同一张单，只有 1 个成功、库存只加一次、流水只有 1 条；**1.6 又补上了业务字段乐观锁**（同一 `version` 并发改备注，1 成功 + 5 个版本冲突）与**列表过滤排序**；**1.7 补上了前端账本页面**——库存流水与手工出入库此前只有后端能调，界面上演示不出来，现在补齐了，并用「台账结存 == 全部流水净累计」这条等式把**账实相符**变成了可断言的事实。但出库并发仍只到 6 线程规模，**没有吞吐压测**，字段级审计表也没做，流水也仍无分页——这些如实留在债务表里。

## 功能架构

<svg viewBox="0 0 880 240" width="100%" style="max-width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ERP 功能架构图">
<rect x="0" y="0" width="880" height="240" rx="14" fill="var(--vp-c-bg-soft)"/>
<text x="124" y="40" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">终端层</text>
<rect x="140" y="16" width="232" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="256" y="40" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">Vue3 管理端</text>
<rect x="384" y="16" width="232" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="500" y="40" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">供应商门户（规划）</text>
<rect x="628" y="16" width="232" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="744" y="40" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">财务对账台（规划）</text>
<text x="124" y="98" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">应用层</text>
<rect x="140" y="74" width="110" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="195" y="98" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">物料主数据</text>
<rect x="262" y="74" width="110" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="317" y="98" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">供应商</text>
<rect x="384" y="74" width="110" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="439" y="98" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">采购单</text>
<rect x="506" y="74" width="110" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="561" y="98" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">库存台账</text>
<rect x="628" y="74" width="110" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="683" y="98" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">库存流水</text>
<rect x="750" y="74" width="110" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="805" y="98" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">销售（规划）</text>
<text x="124" y="156" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">领域层</text>
<rect x="140" y="132" width="110" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="195" y="156" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">双状态机</text>
<rect x="262" y="132" width="110" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="317" y="156" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">主单 + 明细</text>
<rect x="384" y="132" width="110" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="439" y="156" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">加权成本</text>
<rect x="506" y="132" width="110" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="561" y="156" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">幂等闸门</text>
<rect x="628" y="132" width="110" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="683" y="156" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">业务单号</text>
<rect x="750" y="132" width="110" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="805" y="156" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">租户上下文</text>
<text x="124" y="214" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">治理层</text>
<rect x="140" y="190" width="168" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="224" y="214" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">权限矩阵（12 权限点）</text>
<rect x="320" y="190" width="168" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="404" y="214" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">职责分离 SoD</text>
<rect x="500" y="190" width="168" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="584" y="214" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">提交 / 审批留痕</text>
<rect x="680" y="190" width="168" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="764" y="214" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">软删 + 审计</text>
</svg>

实心高亮 = 已实现并纳入 E2E 断言。空心为 P2 / P3 路线项。

## 功能清单

> 状态图例：✅ 已实现（有实证） · 📋 规划中

### 已实现（E2E 已验证）

| 功能域 | 功能 | 状态 | 证据 |
|---|---|---|---|
| 主数据 | 物料档案（编码/名称/规格/单位/采购价/`wmsSkuCode`） | ✅ | E2E 第 2~5 步：建/改/停用/启用/统计 |
| 主数据 | 物料编码租户内唯一 | ✅ | 重复创建 → 409 `MATERIAL_CODE_DUPLICATED` |
| 供应商 | 建档 → 冻结 ⇄ 解冻 → 封禁 | ✅ | E2E 第 6、13、14 步 |
| 供应商 | 封禁终态不可解冻 | ✅ | `ILLEGAL_TRANSITION: BLOCKED -> ACTIVE` |
| 采购单 | 主子结构（明细行 / 税额 / 总额服务端推导） | ✅ | 2 行明细合计 3292.50 由 `单价×数量` 推导 |
| 采购单 | 五态流转 + 留痕 | ✅ | `submitBy` / `approveBy` 落库可读回 |
| 采购单 | 业务规则：冻结/封禁供应商不可下单 | ✅ | 409 `SUPPLIER_NOT_ALLOWABLE` |
| 采购单 | 业务单号 `PO-yyyyMMdd-NNNN` | ✅ | 数据库单行计数器原子取号；6 线程并发建单 6/6 成功且单号不重复 |
| **库存** | **收货自动入库（同事务）** | ✅ | MAT-001 7→17、MAT-002 12→17 |
| **库存** | **移动加权平均成本** | ✅ | 单条 `ON DUPLICATE KEY UPDATE` 原子滚动 |
| **库存** | **幂等闸门（不重复入账）** | ✅ | 重复收货 409 `RECEIVED -> RECEIVED`，库存不再变 |
| **库存** | **不出负库存** | ✅ | 超量出库 409 `INSUFFICIENT_STOCK`，失败不落库存 |
| **库存** | **手工出入库（盘盈/领用/退料）** | ✅ | `POST /inventory/adjust`，停用物料禁入、允许出清 |
| **库存** | **流水可按来源单号反查** | ✅ | `IN-PO-20261102-0010-MAT-002` |
| **权限** | **四业务角色 + 12 权限点** | ✅ | 各角色 `/session` 权限集与矩阵一致（含反向断言） |
| **权限** | **越权 403 且无副作用** | ✅ | 仓管建单 / 采购员改库存 / 仓管冻结供应商 |
| **权限** | **职责分离（自审拦截）** | ✅ | 409 `SELF_APPROVAL_FORBIDDEN` |
| **并发** | **状态流转 CAS（不重复流转）** | ✅ | `WHERE status = 旧值`，影响 0 行 → 409 `CONCURRENT_MODIFICATION` |
| **并发** | **收货只入账一次（多线程实测）** | ✅ | 6 线程抢收同一单：1 成功 + 5 个 409，库存 +10 一次、流水 1 条 |
| **并发** | **不超卖（多线程实测）** | ✅ | 库存 10、6 线程各出 5：2 成功 + 4 个 409，归零不为负、流水只 2 条 |
| **并发** | **业务字段乐观锁（不丢更新）** | ✅ | 6 线程带同一 `version` 改单：1 成功 + 5 个版本冲突，最终 `version=1` |
| **工程** | **分页下沉到 SQL** | ✅ | `COUNT` + `LIMIT/OFFSET`，`pageSize` 上限 200，越界页 total 如实 |
| **工程** | **列表过滤 / 搜索 / 排序** | ✅ | `keyword` / `status` / 关联对象过滤 + 白名单排序，全部下沉 SQL |
| **工程** | **排序不可注入** | ✅ | 白名单映射生成 `ORDER BY`，`%` `_` `\` 关键字转义 |
| **工程** | **列表无 N+1** | ✅ | 明细按 `IN (orderIds)` 一次取回后分组 |
| 工程 | 强类型 DTO + `@Valid` | ✅ | 空明细 / `qty=0` / 缺 `name` 全 400 |
| 工程 | 软删 + 审计（`deleted` / `create_by`） | ✅ | 删除后列表不可见、单查 400 |
| 前端 | 元数据驱动 5 个实体 | ✅ | `modules.ts` · `vue-tsc` + `npm run build` 通过 |
| 前端 | 过滤 / 排序条（1.6） | ✅ | 元数据声明可排序列，页面渲染过滤条；前端只收集参数，过滤排序全在后端 SQL |
| 前端 | 编辑回传 `version`（1.6） | ✅ | 乐观锁闭环：前端带版本，后端判「是不是最新那版」 |
| 前端 | **库存流水页（1.7）** | ✅ | 按物料 / 来源单号过滤，方向 IN/OUT 绿红标签；后端能力不再只能靠 curl 演示 |
| 前端 | **手工出入库入口（1.7）** | ✅ | 盘盈 / 盘亏 / 领用；超量出库 409 不扣成负数，成功后自动刷新流水 |
| 隔离 | 多租户 | ✅ | 全语句带 `tenant_id`，独立库 `openbiz_erp` |

### P2 / P3 · 规划中

| 阶段 | 功能 | 状态 |
|---|---|---|
| P2 | 销售：客户 / 报价 / 销售订单 / 发货（出库走同一账本） | 📋 |
| P2 | 应收应付台账：收货生成 AP、发货生成 AR | 📋 |
| P2 | Excel 导出 / 单据打印（中小企业对账刚需） | 📋 |
| P2 | 多级可配置审批流（当前 `submit → approve` 单级硬编码） | 📋 |
| P2 | 采购申请 → 订单闭环、采购退货、三单匹配 | 📋 |
| P3 | 多仓 / 批次 / FIFO、盘点单、库存预警 | 📋 |
| P3 | 字段级审计表（记录改了哪一列的前后值） | 📋 |
| P3 | 与 WMS / MES 的真实事件联动（见「系统边界」） | 📋 |

## 核心流程

**采购单主链路（含库存副作用）**

```
建单 ─▶ 提交 ─▶ 审批 ─▶ 下单 ─▶ 收货 ──┬─▶ 状态 RECEIVED
  │       │       │       │            └─▶ 写流水 + 加库存（同事务）
  └───────┴── 取消（仅 DRAFT/SUBMITTED）──▶ CANCELLED
```

每一步对数据的副作用：

| 环节 | 状态迁移 | 写库 | 校验 / 说明 |
|---|---|---|---|
| 建单 | `DRAFT`（初态） | 主单 + N 行明细 | 供应商必须存在且为 `ACTIVE`；明细非空、`qty ≥ 1`；总额服务端推导 |
| 提交 | `DRAFT → SUBMITTED` | `status/stage` + `submit_by` | 需 `order:submit` |
| 审批 | `SUBMITTED → APPROVED` | `status/stage` + `approve_by` | 需 `order:approve`；**提交人不得自审** |
| 下单 | `APPROVED → ORDERED` | `status/stage` | 需 `order:create`（采购员执行动作） |
| 收货 | `ORDERED → RECEIVED` | `status/stage` + **流水 N 条 + 台账累加** | 需 `order:receive`；三件事同一事务 |
| 取消 | `DRAFT/SUBMITTED → CANCELLED` | `status/stage` | `APPROVED/ORDERED/RECEIVED` 不可取消 |

`stage`（粗粒度阶段）由 `status` 推导：`PLANNING(DRAFT,SUBMITTED)` / `EXECUTING(APPROVED,ORDERED)` / `CLOSED(RECEIVED,CANCELLED)`——统计按 stage 看「计划 / 执行 / 关闭」，按 status 看五态明细，两套口径同一来源。

**收货入库（P1 的关键一段）**

```java
@Transactional
public ErpPurchaseOrder receive(Long id, String actor) {
    transition(require(id), RECEIVED, actor);      // 1. 状态机放行
    ErpPurchaseOrder received = withItems(require(id));
    inventoryService.inboundForPurchaseOrder(received, actor);  // 2. 写流水 + 加库存
    return received;
}
```

> 为什么必须同事务：若入库放到事务外或异步，一旦入库失败，单据已显示「已入库」而库存是空的——这是 ERP 里最难排查的一类脏数据。**要么都成功，要么都回滚。**

**供应商生命周期**

```
建档 ─▶ ACTIVE ⇄ FROZEN ─▶ BLOCKED（终态）
              │
              └─ 封禁后不可解冻
```

| 环节 | 状态迁移 | 说明 |
|---|---|---|
| 建档 | `ACTIVE`（初态） | `name` 必填，默认 `grade=C` |
| 冻结 | `ACTIVE → FROZEN` | 暂停合作（资质待审等），冻结期间不可下采购单 |
| 解冻 | `FROZEN → ACTIVE` | 恢复合作 |
| 封禁 | `ACTIVE/FROZEN → BLOCKED` | 终态，质量问题等；BLOCKED 不可再解冻 |

**库存入账（手工调整 / 出库）**

```
入库：物料校验(必须 ACTIVE) ─▶ 写流水 ─▶ 台账 upsert（加权成本）
出库：写流水前先扣减 ─▶ UPDATE ... WHERE qty >= ?  ─▶ 影响 0 行 = INSUFFICIENT_STOCK(409)
```

## 状态机

ERP 有两张独立的迁移表：供应商一张、采购单一张。两者都不写在 `if-else` 里，统一走 `Map<String,Set<String>>` 迁移表 + `ILLEGAL_TRANSITION` 异常。

```
DRAFT ──submit──▶ SUBMITTED ──approve──▶ APPROVED ──order──▶ ORDERED ──receive──▶ RECEIVED
  │                  │
  └──cancel──▶ CANCELLED   └──cancel──▶ CANCELLED
```

### 采购单完整迁移表（服务端 `O_TRANS` Map 直接照抄）

| 当前状态 | 允许迁移 | 触发动作 |
|---|---|---|
| `DRAFT` | `SUBMITTED` / `CANCELLED` | submit / cancel |
| `SUBMITTED` | `APPROVED` / `CANCELLED` | approve / cancel |
| `APPROVED` | `ORDERED` | order |
| `ORDERED` | `RECEIVED` | receive |
| `RECEIVED` | — | 终态 |
| `CANCELLED` | — | 终态 |

### 供应商完整迁移表（服务端 `S_TRANS` Map）

| 当前状态 | 允许迁移 | 触发动作 |
|---|---|---|
| `ACTIVE` | `FROZEN` / `BLOCKED` | freeze / block |
| `FROZEN` | `ACTIVE` / `BLOCKED` | unfreeze / block |
| `BLOCKED` | — | 终态 |

### 物料状态（极简两态，不引入状态机）

| 当前状态 | 允许迁移 | 触发动作 |
|---|---|---|
| `ACTIVE` | `DISABLED` | disable |
| `DISABLED` | `ACTIVE` | enable |

### 实现方式

```java
private static final Map<String, Set<String>> O_TRANS = Map.of(
    DRAFT,     Set.of(SUBMITTED, CANCELLED),
    SUBMITTED, Set.of(APPROVED, CANCELLED),
    APPROVED,  Set.of(ORDERED),
    ORDERED,   Set.of(RECEIVED),
    RECEIVED,  Set.of(),
    CANCELLED, Set.of());

private void transition(ErpPurchaseOrder o, String target, String actor) {
    String from = o.getStatus();
    Set<String> allowed = O_TRANS.get(from);
    if (allowed == null || !allowed.contains(target)) {
        throw new IllegalStateException("ILLEGAL_TRANSITION: " + from + " -> " + target);
    }
    switch (target) {
        case SUBMITTED -> orderMapper.markSubmitted(o.getId(), o.getTenantId(), actor);
        case APPROVED  -> orderMapper.markApproved(o.getId(), o.getTenantId(), actor);
        default        -> orderMapper.updateStatus(o.getId(), o.getTenantId(), target, stageOf(target));
    }
}
```

非法流转抛 `IllegalStateException("ILLEGAL_TRANSITION: A -> B")`，由 `ApiExceptionHandler`（`@Order` 最高优先级）映射成 **HTTP 409**。标准契约的 `transition?to=X` 入口把未知目标态也视为非法流转，同样 409。

> 关键取舍：**状态机的校验只在一处**。改流程只改那张 Map，前端 `modules.ts` 的 `transitions` 与后端同源，按钮显隐天然一致。

## 权限与职责分离

### 为什么不用 RuoYi 的 `@PreAuthorize`

`@PreAuthorize("@ss.hasPermi('erp:order:add')")` 依赖 `sys_menu.perms` 有数据，而本应用没有菜单表种子，等于空转。这里改用**角色键**（`sys_role.role_key`）映射到业务权限点：角色由管理员在 RuoYi 里分配，**权限矩阵由代码集中定义**（一个不可变 `Map`），便于评审与审查。

角色每次**实时查库**、不做缓存——权限收回必须立刻生效，缓存反而制造「已停职但还能批单」的窗口期。

### 权限矩阵（`ErpPermissionService.ROLE_PERMS` 直接照抄）

| 角色 | 主数据 | 建单 | 提交 | 审批 | 下单 | 收货 | 取消 | 库存写 |
|---|---|---|---|---|---|---|---|---|
| `erp_buyer` 采购员 | 读写 | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| `erp_approver` 审批人 | 只读 | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `erp_warehouse` 仓管 | 只读 | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| `erp_manager` 主管 | 读写 | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| `admin` 超管 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

共 12 个权限点：`material:read|write`、`supplier:read|write`、`order:read|create|submit|approve|receive|cancel`、`inventory:read|write`。

设计意图很直白：**审批人不能建单，仓管不能建单也不能审批**。这不是为了卡人，而是让「谁动的库存、谁批的单」在审计时说得清。

### SoD 是权限之外的另一半

| 手段 | 管什么 | 实现位置 | 违反结果 |
|---|---|---|---|
| 权限矩阵 | 「**能不能**审批」 | `ErpPermissionService.require()`（入口处） | 403 `FORBIDDEN` |
| 职责分离 | 「能不能审批**自己提的单**」 | `ErpPurchaseOrderService.approve()`（业务不变量） | 409 `SELF_APPROVAL_FORBIDDEN` |

```java
@Transactional
public ErpPurchaseOrder approve(Long id, String actor) {
    ErpPurchaseOrder o = require(id);
    String submitBy = o.getSubmitBy();
    if (submitBy != null && submitBy.equals(actor) && !permissionService.isSuperAdmin()) {
        throw new IllegalStateException("SELF_APPROVAL_FORBIDDEN: 提交人 " + actor + " 不能审批自己提交的单据");
    }
    transition(o, APPROVED, actor);
    return withItems(require(id));
}
```

> SoD 放在 **Service** 而不是 Controller：这是业务不变量，不是接口层规矩。任何入口（REST、定时任务、将来的 MQ 消费者）都必须受同一条约束。`admin` 豁免只为演示可用，生产应关闭。

### 为什么 403 和 409 必须分开

| 状态码 | 含义 | 客户端该做什么 |
|---|---|---|
| 400 | 参数不合法 | 改参数 |
| 403 | 身份不允许这个动作 | 去申请授权 / 换人操作 |
| 409 | 当前状态或业务规则不允许 | 重读单据状态，按合法路径走 |

把越权压成 400 或 409，前端就只能弹「操作失败」——用户不知道是填错了还是没权限。

## 技术栈与架构

| 层 | 技术 | 职责 |
|---|---|---|
| 后端 | JDK 21 · Spring Boot 3 · RuoYi 3.9.2 | REST、事务、状态机 |
| 底座 | openbiz-saas-core | 多租户 / 权限 / 审计 |
| 持久 | MyBatis · Druid | 全语句带 `tenant_id` |
| 前端 | Vite · Vue 3 · TypeScript · Element Plus | 元数据驱动 `modules.ts` |
| 存储 | MySQL 8（`openbiz_erp`） | 6 张业务表 + 1 张单号计数器表 + RuoYi 系统表 |
| 缓存 | Redis | token / 会话 |
| 验证 | `e2e_erp.py` · `e2e_standard.py` · `e2e_concurrency.py` · `e2e_ledger.py` | 域链路 94 + 统一契约 100 + 并发 36 + 账本 29 = 259 条断言 |

```
[ Vue3/TS 前端 :5180 ] ──代理──▶ [ Spring Boot :18085 ]
                                      ├── web/controller      # 域动作 + 统一契约 + 库存 + 会话自省
                                      ├── service             # 状态机 / SoD / 库存入账 / 权限矩阵
                                      ├── domain + 状态机      # O_TRANS / S_TRANS Map
                                      ├── mapper              # MyBatis，全语句带 tenant_id
                                      └── saas-core           # 多租户 / 权限 / 审计
                                              │
                                    [ MySQL openbiz_erp ]
```

```
openbiz-erp-app/
├── backend/          # 端口 18085 · fat jar
│   ├── src/main/java/.../rule/            # 纯逻辑：状态机 / 金额 / 入库合并 / 排序白名单 / 列表条件
│   ├── src/main/java/.../page/            # 分页值对象：Paging + PageSlice
│   ├── src/test/java/                     # JUnit 5 单测 125 条（不连库，1.3s）
│   ├── e2e_erp.py / run_erp_e2e.sh        # 域链路 94 条断言
│   ├── e2e_concurrency.py                 # 6 线程并发正确性 36 条断言
│   ├── e2e_standard.py / run_standard_e2e.sh  # 统一契约 100 条断言
│   ├── e2e_ledger.py                      # 库存账本契约 29 条断言
│   └── E2E-RESULT.txt
├── frontend/         # modules.ts 元数据（供应商 / 物料 / 采购单 / 库存台账 / 库存流水）
├── sql/              # 1_1 全量 · 1_2 主子结构 · 1_3 库存与权限 · 1_5 单号计数器 · 1_6 乐观锁
└── README.md
```

## 接口契约

**域动作接口**（`ErpController`，前缀 `/api/erp`）：

| 方法 | 路径 | 权限 | 说明 |
|---|---|---|---|
| POST | `/suppliers` | `supplier:write` | 建供应商（`name` 必填，默认 `grade=C`） |
| GET | `/suppliers` · `/suppliers/{id}` | `supplier:read` | 列表 / 详情 |
| POST | `/suppliers/{id}/freeze` `unfreeze` `block` | `supplier:write` | 生命周期流转 |
| POST | `/orders` | `order:create` | 建单（`supplierId` + `items[]` + `remark`） |
| GET | `/orders` · `/orders/{id}` | `order:read` | 列表（装配明细）/ 详情 |
| POST | `/orders/{id}/submit` | `order:submit` | `DRAFT → SUBMITTED`，记 `submit_by` |
| POST | `/orders/{id}/approve` | `order:approve` | `SUBMITTED → APPROVED`，记 `approve_by`，SoD 校验 |
| POST | `/orders/{id}/order` | `order:create` | `APPROVED → ORDERED` |
| POST | `/orders/{id}/receive` | `order:receive` | `ORDERED → RECEIVED` + 自动入库 |
| POST | `/orders/{id}/cancel` | `order:cancel` | 仅 `DRAFT/SUBMITTED` |
| GET | `/orders/stats` | `order:read` | status 全态 + stage 双维度 |
| GET | `/session` | 登录即可 | 当前用户 / 角色 / 权限点（前端按钮显隐依据） |

**物料与库存接口**（`ErpMaterialController` / `ErpInventoryController`）：

| 方法 | 路径 | 权限 | 说明 |
|---|---|---|---|
| POST / GET | `/materials` · `/materials/list` · `/materials/{id}` | `material:read/write` | 主数据 CRUD + 分页 |
| PUT | `/materials` | `material:write` | 改名称/规格/单位/采购价/`wmsSkuCode` |
| POST | `/materials/{id}/transition?to=` | `material:write` | `ACTIVE ⇄ DISABLED` |
| POST | `/materials/{id}/disable` `enable` | `material:write` | 便捷入口 |
| DELETE | `/materials/{id}` | `material:write` | 软删 |
| GET | `/materials/stats` | `material:read` | 按状态计数 |
| GET | `/inventory` · `/inventory/list` | `inventory:read` | 库存台账（含 `avgCost` / `amount`） |
| GET | `/inventory/txns?materialCode=&sourceDocNo=` | `inventory:read` | 流水，按物料或**来源单号**反查 |
| POST | `/inventory/adjust` | `inventory:write` | 手工出入库（盘盈/领用/退料） |
| GET | `/inventory/stats` | `inventory:read` | 物料种类 / 总量 / 总金额 / 零库存种类 / 出入库笔数 |

**统一契约接口**（`StandardApiController`，与前端模板 API 工厂对齐）：

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/erp/{entity}/list` | 分页列表（`pageNum` / `pageSize` / `keyword` / `status` / `sort` / `order`） |
| GET | `/api/erp/{entity}/stats` | 按状态计数（含 0 值） |
| PUT | `/api/erp/{entity}` | 更新业务字段（`status/stage` 由状态机管理）；带 `version` 时走乐观锁 |
| DELETE | `/api/erp/{entity}/{id}` | 软删 |
| POST | `/api/erp/{entity}/{id}/transition?to=XXX` | 统一流转入口 |

`{entity}` 取 `suppliers` / `orders` / `materials`。未知目标态或非法流转一律 409。

> 排序参数 `sort` 只接受白名单里的列名（如 `totalAmount`、`createTime`），方向 `asc` / `desc`；
> 白名单外的列名会被拒，而不是拼进 SQL。`keyword` 里的 `%` `_` `\` 会转义，杜绝 LIKE 通配符注入。

请求与响应示例：

```http
POST /api/erp/orders
{"supplierId":1,"remark":"十月补货",
 "items":[{"materialCode":"MAT-001","qty":10,"unitPrice":320,"taxRate":0.13}]}

200 {"code":200,"data":{"id":9,"orderNo":"PO-20261102-0009","supplierId":1,
     "totalAmount":3200.00,"stage":"PLANNING","status":"DRAFT",
     "items":[{"materialCode":"MAT-001","qty":10,"unitPrice":320,
               "taxAmount":416.00,"amount":3200.00}]}}
```

```http
POST /api/erp/orders/12/receive      （仓管角色，ORDERED 状态）
200 {"status":"RECEIVED"}
# 同时落库：2 条库存流水（PURCHASE_RECEIPT，sourceDocNo=PO-...）+ 台账累加
```

```http
POST /api/erp/orders/9/approve       （提交人自己审批）
409 {"code":500,"msg":"SELF_APPROVAL_FORBIDDEN: 提交人 erp_manager 不能审批自己提交的单据"}

POST /api/erp/orders                 （仓管账号）
403 {"code":500,"msg":"FORBIDDEN: 缺少权限 order:create（当前角色：erp_warehouse）"}

POST /api/erp/inventory/adjust       （出库量 > 结存）
409 {"code":500,"msg":"INSUFFICIENT_STOCK: 物料 MAT-001 当前库存 14，需出库 999999"}
```

统一错误契约（`ApiExceptionHandler`，`@Order(HIGHEST_PRECEDENCE)` 抢在 RuoYi 全局处理器之前）：

| 场景 | HTTP | 响应体 |
|---|---|---|
| 成功 | 200 | `{code:200, data:…}` |
| 参数校验失败 | 400 | `{code:500, msg:"items[0].qty: 最小不能小于1"}` |
| 记录不存在 / 参数非法 | 400 | `{code:500, msg:"ORDER_NOT_FOUND: 12"}` |
| 越权 | 403 | `{code:500, msg:"FORBIDDEN: 缺少权限 order:approve（当前角色：erp_buyer）"}` |
| 状态机非法流转 | 409 | `{code:500, msg:"ILLEGAL_TRANSITION: A -> B"}` |
| 业务规则冲突 | 409 | `SUPPLIER_NOT_ALLOWABLE` / `SELF_APPROVAL_FORBIDDEN` / `INSUFFICIENT_STOCK` / `MATERIAL_CODE_DUPLICATED` |
| 未捕获异常 | RuoYi 全局兜底 | 只回通用错误，不泄露堆栈 |

> 演进记录：非法流转最初返回 500，与「客户端错误」语义不符；改为 409 后由 `@Order(HIGHEST_PRECEDENCE)` 的 `ApiExceptionHandler` 统一接管。三类错误（400/403/409）分层的意义是——**客户端能据此决定「改参数、去申请授权、还是重读状态」**。

## 核心数据模型

6 张业务表，全部带 `tenant_id`，均不建外键（跨租户隔离靠应用层 + 索引，迁移与分库更简单）；另有 1 张 `openbiz_erp_order_seq` 单号计数器表（`pk(tenant_id, seq_date)`，非业务表）：

| 域 | 表 | 关键字段 | 约束 |
|---|---|---|---|
| 主数据 | `openbiz_erp_material` | `material_code` · `name` · `spec` · `unit` · `purchase_price` · `wms_sku_code` · `status` · `create_by` · `deleted` | `uk(tenant_id, material_code)` |
| 供应商 | `openbiz_erp_supplier` | `name` · `contact` · `phone` · `grade` · `status` · `create_by` · `deleted` | `uk(tenant_id, name)`，`idx(tenant_id, status)` |
| 采购主单 | `openbiz_erp_purchase_order` | `order_no` · `supplier_id` · `remark` · `total_amount` · `stage` · `status` · `create_by` · `submit_by` · `approve_by` · `deleted` | `uk(tenant_id, order_no)`，`idx(supplier_id)` / `idx(status)` |
| 采购明细 | `openbiz_erp_purchase_order_item` | `order_id` · `material_code` · `material_name` · `qty` · `unit_price` · `tax_rate` · `tax_amount` · `amount` | `idx(tenant_id, order_id)` |
| 库存台账 | `openbiz_erp_inventory` | `warehouse_code` · `material_code` · `qty` · `avg_cost` · `version` | `uk(tenant_id, warehouse_code, material_code)` |
| 库存流水 | `openbiz_erp_stock_txn` | `txn_no` · `direction` · `qty` · `unit_cost` · `amount` · `biz_type` · `source_doc_no` · `create_by` | `uk(tenant_id, txn_no)`，`uk(tenant_id, source_doc_no, material_code, direction)` |
| 单号计数 | `openbiz_erp_order_seq` | `tenant_id` · `seq_date` · `seq` · `update_time` | `pk(tenant_id, seq_date)`；`LAST_INSERT_ID(seq+1)` 原子分配单号 |

四点设计说明：

- **金额不由客户端说了算**：`amount = unit_price × qty`、`tax_amount = amount × tax_rate`、主单 `total_amount` = 各行 `amount` 之和，全部服务端推导。请求里塞总额会被忽略。
- **`status` 是唯一真相，`stage` 是推导列**：`stage` 便于按三阶段统计，每次迁移一并更新，不单独维护。
- **流水是事实来源，台账是可重算的物化视图**：先写流水再改库存。万一两者不一致，以流水为准重算即可。
- **`wms_sku_code` 是跨系统对齐锚点**：ERP 用 `material_code`，WMS 用 `sku_code`，映射字段先留好，打通时不用改表。

**库存台账的两次原子操作（`ErpInventoryMapper.xml`）**

```sql
-- 入库：有则累加、无则插入。avg_cost 必须写在 qty 之前 —— MySQL 的 ON DUPLICATE KEY
-- 赋值从左到右求值，此时右侧 qty 仍是旧值，正好用于移动加权平均。
INSERT INTO openbiz_erp_inventory (tenant_id, warehouse_code, material_code, qty, avg_cost, ...)
VALUES (...)
ON DUPLICATE KEY UPDATE
  avg_cost = IF(qty + VALUES(qty) > 0,
                (avg_cost * qty + VALUES(avg_cost) * VALUES(qty)) / (qty + VALUES(qty)),
                avg_cost),
  qty      = qty + VALUES(qty),
  version  = version + 1;

-- 出库：负库存在 SQL 层就不可能出现；影响行数 0 即库存不足
UPDATE openbiz_erp_inventory
SET qty = qty - #{qty}, version = version + 1
WHERE tenant_id = #{tenantId} AND warehouse_code = #{warehouseCode}
  AND material_code = #{materialCode} AND qty >= #{qty};
```

> 这里刻意**不做「先查余额再扣」**：两个并发请求都读到 10、再各扣 8，是经典丢失更新。正确性交给数据库的行锁 + 原子 SQL，应用层只负责解释「影响 0 行」这个结果。
>
> 幂等同理：靠 `INSERT IGNORE` + `uk_source` 唯一键，而不是「先查有没有入过账」。应用层判重在并发下必然有竞态窗口。同一张单出现两行同物料时，先按物料合并（数量与金额相加）再入账，否则唯一键会把第二行挡掉导致少入账。

## 系统边界

| 协同 | 链路 | 方向 | 现状 |
|---|---|---|---|
| WMS | 采购收货 → WMS 采购入库 | ERP → WMS | 🟡 模型与契约已对齐（WMS `inboundType` 默认已是 `PURCHASE`），ERP 侧尚未写集成层 |
| WMS | 销售发货 → WMS 销售出库 | ERP → WMS | 📋 待销售模块 |
| MES | BOM / 生产订单下发；完工回写 | ERP ↔ MES | 📋 两侧都缺（ERP 无 BOM/生产订单） |
| CRM | 客户 / 商机成交 → 销售订单 | CRM → ERP | 📋 待销售模块 |

原则：**独立库、不共享表**；同步走 OpenAPI，异步走领域事件；`tenantId` 全程透传；主数据以 ERP 为准。

一个诚实的判断：**集成的上限不在接口，在业务数据的完备度**。当前 ERP 有物料主数据（`material_code` ↔ `wms_sku_code` 映射位已留）、有库存流水（`source_doc_no` 已是业务单号，天然可追溯到采购单），所以打通 WMS 的**地基已在**；但 ERP 自身**没有任何 HTTP client / MQ / 事件发布代码**（全库 grep 为空），仍是架构上的孤点。真正落地要补的是「采购收货后把入库单推给 WMS」这一段事件通道，而不是再写一个 ERP 模块。

## 路线与验收

1. **P0（已达成）**：物料主数据 + 主子表 + 强类型 DTO + 软删审计 + 业务规则
2. **P1（已达成）**：库存台账与流水 + 收货自动入库 + 四角色权限 + 职责分离 + 业务单号
3. **P2（进行中方向）**：销售 + 应收应付 + Excel 导出 + 多级审批
4. **P3（远期）**：多仓 / 批次 / 盘点、与 WMS / MES 事件联动
5. **P1.5（已达成，1.4 版）**：核心领域单测 94 条 + 纯逻辑抽离到 `rule` 包 + springdoc 在线契约
6. **P1.6（已达成，1.5 版）**：分页下沉 + N+1 消除 + 状态流转 CAS + 单号原子分配 + 6 线程并发实测（收货 / 提交 / 建单 / 出库）
7. **P1.7（已达成，1.6 版）**：业务字段乐观锁（`version` 列）+ 列表过滤 / 搜索 / 排序下沉 SQL + 出入库写序统一 + 并发编辑实测
8. **P1.8（已达成，1.7 版）**：前端补齐账本形态——库存流水页 + 手工出入库入口（ADR-018）+ 账本契约 E2E

P0 + P1 验收（证据：`backend/E2E-RESULT.txt`，单测 125 条 + E2E 259 条断言，全绿）：

| # | 验收项 | 通过标准 | 实测 |
|---|---|---|---|
| 1 | 登录 + 会话自省 | `/login` 拿 token，`/session` 返回角色与权限点 | ✅ admin 12 权限点 |
| 2 | 物料主数据 | 建/改/停用/启用/统计；编码重复 409；软删后单查 400 | ✅ |
| 3 | 供应商生命周期 | `ACTIVE → FROZEN → ACTIVE`，封禁后解冻 409 | ✅ |
| 4 | 采购单主子结构 | 2 行明细，合计 3292.50 由单价×数量推导 | ✅ |
| 5 | 五态流转 + 留痕 | `DRAFT→…→RECEIVED`，`submitBy`/`approveBy` 落库 | ✅ |
| 6 | **收货自动入库** | 库存增加、生成对应流水、`sourceDocNo` = 采购单号 | ✅ MAT-001 7→17 |
| 7 | **重复收货幂等** | 409 `RECEIVED -> RECEIVED`，库存不再增加 | ✅ |
| 8 | **库存不为负** | 超量出库 409 `INSUFFICIENT_STOCK`，失败不改库存 | ✅ |
| 9 | **越权拦截** | 仓管建单 / 审批人建单 / 采购员改库存均 403 且无副作用 | ✅ |
| 10 | **职责分离** | 自审 409 `SELF_APPROVAL_FORBIDDEN`，换人审批 200 | ✅ |
| 11 | **多用户链路** | 采购员建单提交 → 审批人审批 → 采购员下单 → 仓管收货 | ✅ 流水操作人 = erp_warehouse |
| 12 | 业务规则 | 冻结供应商下单 409 `SUPPLIER_NOT_ALLOWABLE` | ✅ |
| 13 | 参数校验 | 空清单 / `qty=0` / 缺 `name` 全 400 | ✅ |
| 14 | 统一契约 | suppliers / orders / materials 的 list·CRUD·transition·stats 行为一致 | ✅ 100 条断言 |
| 15 | **分页契约** | pageSize 上限 200、越界页 rows 空但 total 如实、页码负数钳到 1、相邻页无重叠 | ✅ |
| 16 | **并发正确性** | 6 线程同时收货 / 提交 / 建单 / 出库：不重复流转、不重复入库、不超卖 | ✅ 36 条断言 |
| 17 | **过滤 / 排序契约** | keyword / status / 关联对象命中数正确；排序方向正确；白名单外列名被拒 | ✅ |
| 18 | **乐观锁契约** | 带过期 `version` 更新 → 409 `CONCURRENT_MODIFICATION` | ✅ |
| 19 | **并发编辑** | 6 线程同一 `version` 改单：1 成功 + 5 版本冲突，`version` 只 +1 | ✅ |
| 20 | **账本契约（1.7）** | 流水返回数组且字段齐全、不泄漏 `tenantId`；按物料 / 来源单号过滤生效 | ✅ 29 条断言 |
| 21 | **手工出入库（1.7）** | 入库 / 出库各写一条流水（`bizType=MANUAL_ADJUST`）；超量出库 409 且库存不变 | ✅ |
| 22 | **账实相符（1.7）** | 台账结存 == 该物料**全部**流水的净累计（IN 减 OUT） | ✅ |

复现：`cd backend && bash run_erp_e2e.sh`（域链路）· `bash run_standard_e2e.sh`（统一契约）· `python e2e_concurrency.py`（并发）· `python e2e_ledger.py`（账本）。

**单测 125 条**（`cd backend && mvn -o test`，1.3 秒，不连数据库）——测的是「规则」，与 E2E 分工明确：

| 层次 | 测什么 | 为什么放在这一层 |
|---|---|---|
| 单测 125 | 状态机 6×6 穷举、金额/税额/加权成本、同物料合并、SoD 分支、幂等与负库存的**调用方分支**、CAS 冲突分支、乐观锁冲突分支、排序白名单与关键字转义、分页归一化 | 这些错是「逻辑错」，1 毫秒可验；用 E2E 验要起库+服务，慢且覆盖不到全组合 |
| E2E 194 | 唯一键、行锁、事务回滚、跨模块链路、权限矩阵、分页与过滤排序契约 | 这些只有真 MySQL + HTTP 能证明；用单测模拟 SQL 语义是自欺 |
| 并发 36 | 6 线程抢同一张单 / 抢同一批库存 / 抢同一个 `version`：CAS、乐观锁与 `WHERE qty >= ?` 是否真的互斥 | **单测证明不了**——它依赖行锁与隔离级别，只有真库 + 真并发能证明 |
| 账本 29 | 流水端点契约（数组而非分页、字段齐全、不泄漏 `tenantId`）、手工出入库、**账实相符等式** | 「台账 == 流水净累计」是跨两张表的恒等式，只有真库能验；单测 mock 掉 SQL 后这个等式根本不成立 |

为让逻辑可测，1.4 做了一次**行为零变化**的重构：把原本藏在三个 Service 私有字段里的迁移表、金额算式、入库合并抽到 `com.openbiz.erp.rule`，于是「代码 / 文档状态机图 / 测试」读同一份表。重构后 E2E 仍全绿，证明抽离没有改变语义。

### 并发测试推翻了原方案（1.5）

这是这个项目里唯一一次「测试把设计证伪」，值得单独写出来。

并发脚本第一次跑，**建单用例直接红了**：6 个线程同时建单，只有 1 个成功，其余 3 次重试全部撞键，日志里还夹着 `Deadlock found when trying to get lock`。

原因不是重试次数不够，而是**重试读到的还是旧值**：MySQL 默认 REPEATABLE READ，事务内的一致性快照在第一次读时建立、之后不刷新，所以 `SELECT MAX(order_no)` 每次都返回同一个数，重试注定失败；而重复键插入会加间隙锁，多事务交叉持锁就死锁。

修法不是「把重试次数加到 10」，而是换机制：用一张 `openbiz_erp_order_seq(tenant_id, seq_date, seq)` 存计数器，取号是一条写：

```sql
INSERT INTO openbiz_erp_order_seq (tenant_id, seq_date, seq, update_time)
VALUES (?, ?, LAST_INSERT_ID(1), NOW())
ON DUPLICATE KEY UPDATE seq = LAST_INSERT_ID(seq + 1), update_time = NOW();
```

写操作永远基于最新已提交版本、只加行锁不加间隙锁，于是 6/6 成功、单号连续。

> 结论：**唯一键能防重，但不能代替「原子取号」**——它只是最后一道闸门，不是分配机制。

### 两种并发控制，别混为一谈（1.6）

1.6 补上业务字段乐观锁后，项目里同时存在两套并发控制，容易讲混：

| | CAS（1.5 已有） | 乐观锁（1.6 新增） |
|---|---|---|
| 比什么 | 状态：`WHERE status = 旧值` | 版本：`WHERE version = ?` |
| 挡什么 | 状态被流转两次（重复收货） | 业务字段被覆盖（丢失更新） |
| 冲突文案 | 已被他人修改（当前状态 X） | 已被他人修改（版本 N 已失效），请刷新后重试 |
| 为什么不混用 | 状态流转是业务规则，带 `from` 条件更精确 | 业务字段是自由文本，只能靠版本号判断「有没有人改过」 |

乐观锁的写法没有神秘：

```sql
UPDATE openbiz_erp_purchase_order
SET remark = #{remark}, version = version + 1
WHERE id = #{id} AND tenant_id = #{tenantId} AND version = #{version};
```

影响 0 行就说明有人抢先改过 → 409 `CONCURRENT_MODIFICATION`。

**没有用悲观锁的理由**：`SELECT ... FOR UPDATE` 会把并发请求串行化，
在这种「低并发 + 偶发冲突」的 ERP 场景里，乐观锁的重试成本远低于锁等待；
而且乐观锁失败是**显式返回 409**，用户能看到「请刷新后重试」，
不像悲观锁那样表现为「请求卡住」。

排序参数同理：ORDER BY 的列名无法参数化，白名单外的列名**直接拒绝**而不是拼进 SQL；
关键字里的 `%` `_` `\` 会转义，杜绝 LIKE 通配符注入。

> 已知未覆盖：乐观锁的 `version` 是字段级的，只答「有没有人改过」，不答「改了什么」（字段级审计表未做）；`keyword` 是 `%kw%` 前导通配，走不了索引；出库并发只压到 6 线程规模、没有吞吐压测；`avg_cost` 是移动加权，无批次 / FIFO；SoD 对 `admin` 留有豁免（演示通道，已登记为技术债）。

## 本地运行（摘要）

```bash
# 0. 建库/升级（新环境按 1_1 → 1_2 → 1_3；已有库按版本顺序补增量脚本）
mysql -u root -p123456 openbiz_erp < sql/openbiz_erp_1_1.sql
mysql -u root -p123456 openbiz_erp < sql/openbiz_erp_1_2.sql
mysql -u root -p123456 openbiz_erp < sql/openbiz_erp_1_3.sql
mysql -u root -p123456 openbiz_erp < sql/openbiz_erp_1_5.sql   # 单号计数器（含历史单号初始化）
mysql -u root -p123456 openbiz_erp < sql/openbiz_erp_1_6.sql   # 乐观锁 version 列 + 检索索引

# 1. 后端（端口 18085）
cd E:/8.cangku/for-job/openbiz-erp-app/backend
mvn -o clean package -DskipTests
java -jar target/openbiz-erp-app.jar --server.port=18085 --ruoyi.captchaEnabled=false

# 2. 前端（dev 默认 5180，自动代理 /api 与 /login 到 18085）
cd ../frontend && npm run dev
```

演示账号（1.3 脚本创建，口令同 `admin123`，仅演示用）：

| 账号 | 角色 | 能做什么 |
|---|---|---|
| `admin` | 超管 | 全部权限（含自审豁免，仅演示） |
| `erp_buyer` | 采购员 | 主数据 + 建单/提交/下单/取消 |
| `erp_approver` | 审批人 | 只看单 + 审批 |
| `erp_warehouse` | 仓管 | 收货入库 + 库存调整 |
| `erp_manager` | 主管 | 建单 + 提交 + 审批（用于验证自审被拦） |

完整说明见工程内 `README.md`；实证页：[OpenBiz › ERP](/apps/openbiz/erp)。

## 相关链接

- 模块总览：[03 企业业务应用](/instances/business/)
- 同套件：[CRM](./crm) · [PMS](./pms)
- 平台内核：[OpenBiz 平台内核](/instances/platform)
- 实践文：[企业业务应用总览](/apps/business/)
- 关联方案：[库存并发扣减（WMS 侧 CAS 写法）](/scenarios/inventory-deduction)

---

上一级：[03 企业业务应用](/instances/business/) · [实例总览](/instances/)
