# ERP 企业资源计划 · OpenBiz 第五个独立消费者
> 现为独立应用 `openbiz-erp-app`（`E:/8.cangku/for-job/openbiz-erp-app`）：独立后端（端口 18085）+ 独立前端（Vue3/TS）+ 独立数据库 `openbiz_erp`。

> 实证：OpenBiz shop 域有 Inventory CAS、business 域有 Order，但采购 / 供应商需自建。按 OpenBiz 命名约定自建 `openbiz_erp_*` 表，在其多租户基座之上实现「物料 → 供应商 → 采购单 → 收货入库 → 库存台账」的完整采购域闭环。验证「百套流水线」对 A 类工程量最大系统（第 3 个）的可复制性。

## 复用与自建

- **复用**：OpenBiz `openbiz-saas-core` 多租户、`ruoyi-framework` 基础能力（用户 / 角色 / token）
- **自建**：6 张 `openbiz_erp_*` 业务表 + 1 张单号计数器表 + Mapper / Service / Controller + 元数据驱动前端
  - 供应商状态机：`ACTIVE ⇄ FROZEN`，二者均可 `→ BLOCKED`（终态）；BLOCKED 解冻被拒
  - 采购单状态机：`DRAFT → SUBMITTED → APPROVED → ORDERED → RECEIVED`（终态）；`CANCELLED` 仅 DRAFT/SUBMITTED 可转
  - 物料状态：`ACTIVE ⇄ DISABLED`（极简两态，不引入状态机）
  - 统计：`GET /api/erp/orders/stats` 返回 status 全态 + stage（PLANNING/EXECUTING/CLOSED）双维度，缺段补 0

## 数据模型（6 张业务表 + 1 张计数器表）

| 表 | 关键字段 | 说明 |
|---|---|---|
| `openbiz_erp_material` | `material_code` · `name` · `spec` · `unit` · `purchase_price` · `wms_sku_code` · `status` | `uk(tenant_id, material_code)`；`wms_sku_code` 对齐 WMS 的 `sku_code` |
| `openbiz_erp_supplier` | `name` · `contact` · `phone` · `grade` · `status` | `uk(tenant_id, name)`；`status` ∈ ACTIVE/FROZEN/BLOCKED |
| `openbiz_erp_purchase_order` | `order_no` · `supplier_id` · `total_amount` · `stage` · `status` · `submit_by` · `approve_by` · `version` | `uk(tenant_id, order_no)`；`stage` 由 status 推导；`version` 为乐观锁版本号 |
| `openbiz_erp_purchase_order_item` | `order_id` · `material_code` · `qty` · `unit_price` · `tax_rate` · `tax_amount` · `amount` | 金额全部服务端推导 |
| `openbiz_erp_inventory` | `warehouse_code` · `material_code` · `qty` · `avg_cost` · `version` | `uk(tenant_id, warehouse, material)`；移动加权平均成本 |
| `openbiz_erp_stock_txn` | `txn_no` · `direction` · `qty` · `biz_type` · `source_doc_no` · `create_by` | 只增不改的账本；`uk(tenant_id, source_doc_no, material, direction)` 做幂等 |
| `openbiz_erp_order_seq` | `tenant_id` · `seq_date` · `seq` | 单号计数器（非业务表）；`pk(tenant_id, seq_date)`，原子分配 `PO-yyyyMMdd-NNNN` |

## 业务闭环（E2E 已验证）

登录 → 建物料 → 建供应商(ACTIVE) → 冻结/解冻闭环 → 建采购单(2 行明细，合计服务端推导) → 提交 → 审批 → 下单 → **收货(RECEIVED，同事务自动入库并写流水)** → 库存台账增加、流水可按单号反查 → 重复收货被状态机拦 → 超量出库被拒 → 冻结供应商下单被拒 → 数据落库可重拉。

账本侧闭环（1.7 补测）：查流水（全量数组，按 `materialCode` / `sourceDocNo` 过滤）→ 手工入库 → 手工出库 → 超量出库 409 → **账实相符断言**（台账结存 == 该物料全部流水净累计）→ 非法参数 400。

单测 **125 条**（`mvn -o test`，1.3s，不连库）+ E2E **259 条**（域链路 94 + 统一契约 100 + 并发 36 + 账本契约 29），全部通过。

## 工程约束（P0 / P1 补强）

- **强类型 DTO + Bean Validation**：入参不再用 `Map<String,Object>`，改为 `dto/ErpRequests` + `@Valid`，校验失败 400 且压成「字段: 原因」。
- **三类错误分层**：400 参数错 / 403 越权（`ErpForbiddenException`）/ 409 状态机与业务规则冲突，客户端能据此决定「改参数、去申请授权、还是重读状态」。
- **业务权限 + 职责分离**：`erp_buyer` / `erp_approver` / `erp_warehouse` / `erp_manager` 四角色映射 12 个权限点；`submit_by ≠ approve_by`，自审 409 `SELF_APPROVAL_FORBIDDEN`。
- **库存正确性靠数据库**：入库 `ON DUPLICATE KEY UPDATE` 原子加权，出库 `WHERE qty >= ?` 杜绝负库存，幂等靠唯一键而非应用判重。
- **两层并发控制**：状态流转用 CAS（`WHERE status = 旧值`），业务字段编辑用乐观锁（`WHERE version = ?`）；两者冲突都归 409 `CONCURRENT_MODIFICATION`，但文案可区分「当前状态」与「版本已失效」。
- **列表过滤与排序下沉 SQL**：`keyword` / `status` / 关联对象过滤 + 白名单排序，`count` 与 `page` 共用同一 where 片段；排序列名不在白名单直接拒绝，不拼进 SQL。
- **软删 + 审计**：六张业务表均有 `deleted` / `create_by`，采购单另有 `submit_by` / `approve_by` / `version`。
- **业务单号**：`PO-yyyyMMdd-NNNN`，由数据库单行计数器原子分配（`LAST_INSERT_ID(seq+1)`），6 线程并发建单不重号；库存流水 `source_doc_no` 记的就是它。

## 工程位置

`E:/8.cangku/for-job/openbiz-erp-app`（端口 18085，含 README、5 个迁移脚本与 4 套 E2E 脚本（域链路 / 统一契约 / 并发 / 账本契约））

## 价值

工程量最大的 A 类系统（主数据 / 单据链 / 单据-库存联动 / 角色权限）同样可在 OpenBiz 基座上以独立消费者方式落地。相较前四个应用，ERP 多证明了两件事：

1. **底座能撑住「跨模块事务一致性」**——收货 = 状态流转 + 流水 + 台账，三者在同一事务内，不靠最终一致兜底；
2. **底座能撑住「业务级权限」**——RuoYi 的菜单权限对本应用是空转的，改用 `sys_role.role_key` 映射业务权限点，说明基座的用户体系可被复用而不被其权限模型绑死。

## 下一步（规划，未实现）

当前是「采购域闭环 + 库存入账」，不是完整进销存，更不是可交付商用的 ERP。P2 / P3 待补：

- [ ] **销售管理**：客户 / 报价 / 销售订单 / 发货（出库走同一账本，`biz_type=SALES_DELIVERY` 已预留）
- [ ] **应收应付台账**：收货生成 AP、发货生成 AR（业财一体的最小一步）
- [ ] **Excel 导出 / 单据打印**：中小企业对账与报税的刚需，成本最低、优先级不低
- [ ] **多级可配置审批流**：当前 `submit → approve` 单级硬编码，无审批人 / 流程表
- [ ] **采购申请 → 订单闭环、采购退货、三单匹配**（订单-收货-发票）
- [ ] **多仓 / 批次 / FIFO、盘点单、库存预警**（当前单仓硬编码 `MAIN`，成本为移动加权）
- [x] **并发与分页**（1.5）：分页下沉到 SQL、状态流转 CAS、6 线程收货/提交/建单/出库实测
- [x] **业务字段乐观锁 + 列表过滤排序**（1.6）：`version` 列乐观锁、keyword/status/关联对象过滤 + 白名单排序、出入库写序统一、并发编辑实测
- [x] **前端补齐库存流水台账 + 手工出入库入口**（1.7）：新增第 5 个实体「库存流水」与手工出入库对话框，后端 1.4 就有的账本能力终于能在界面上演示；新增 `e2e_ledger.py` 29 条断言（含账实相符）
- [ ] **工程补课（剩余）**：字段级审计表（记录改了哪一列的前后值）、压测工具（k6 / JMeter）跑吞吐与长稳
- [ ] **与 WMS / MES 打通**：模型与契约已对齐（WMS `inboundType` 默认已是 `PURCHASE`），但 ERP 侧尚无集成层（无 HTTP client / MQ / 事件发布），属架构孤点

明确不在此页范围：财务总账、多组织合并报表、与第三方 ERP（如 SAP / 用友）的对接——这些超出 OpenBiz 作品集定位，属企业真实深水区。

详细架构、接口契约、状态机完整迁移表、权限矩阵与「单测 125 + E2E 259」验收清单见 [ERP 实例页](/instances/business/erp)。

---

上一级：[OpenBiz 试水实证](/apps/openbiz/)
