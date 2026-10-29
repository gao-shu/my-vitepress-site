# CRM 客户关系管理系统

> OpenBiz 第 4 个独立消费者：客户主数据 + 商机状态机 + 销售漏斗统计的最小闭环。
> ✅ 已验证 · 所属 [03 企业业务应用](/instances/business/) · 模块内优先级 2 · 代码 `E:/8.cangku/for-job/openbiz-crm-app`

## 功能清单

| 功能 | 状态 | 能做什么 | 证据 |
|---|---|---|---|
| 客户档案 | ✅ | 建客户(NEW) → 激活(ACTIVE) → 流失(CHURNED)；活动态可转 INVALID 做逻辑删除 | 客户状态机 E2E 通过 |
| 商机管理 | ✅ | `DRAFT → NEGOTIATING → WON`；`DRAFT/NEGOTIATING → CANCELLED`；`DRAFT → NEGOTIATING → LOST`；WON/LOST/CANCELLED 为终态 | 商机状态机 E2E 通过 |
| 销售漏斗统计 | ✅ | `GET /api/crm/opportunities/stats` 按阶段聚合商机数与金额 | E2E 校验阶段数字正确 |
| 非法流转拦截 | ✅ | WON 再谈判、NEW 直接流失均被拒 | 返回 `ILLEGAL_TRANSITION` |
| 多租户 | ✅ | 复用 `openbiz-saas-core` 多租户 + RuoYi 登录外壳 | 端口 18084 + 独立库 `openbiz_crm` |
| 销售线索 | 📋 | 原规划有，实际未建表 —— 客户与商机之间缺线索层 | 待补充 |
| 客户跟进 | 📋 | 跟进记录、下次联系提醒、沟通时间线均未实现 | 待补充 |

## 待完善

- **线索层缺失**：客户直接跳商机，没有线索录入 / 来源追踪 / 分配回收，销售漏斗上游是断的
- **客户主数据偏薄**：只有基础字段，联系人、标签分类、查重合并都还在规划里
- **权限只到登录级**：复用 RuoYi 外壳，没有销售团队 / 角色的行级数据隔离
- **统计只有当前快照**：没有时间维度，看不出赢单率趋势与阶段停留时长

## 验证证据

- 闭环：登录 → 建客户(NEW) → 激活(ACTIVE) → 建商机(DRAFT) → 谈判(NEGOTIATING) → 赢单(WON) → 阶段统计 → 非法流转拦截 → 重拉数据
- 复用与自建：复用 `openbiz-saas-core`（TenantContext / 自动装配）；自建 `openbiz_crm_customer`、`openbiz_crm_opportunity` 表与 Mapper / Service / Controller
- 实证记录：[OpenBiz 实战 › CRM](/apps/openbiz/crm/)
- 工程位置：`E:/8.cangku/for-job/openbiz-crm-app`（端口 18084，含 README 与 E2E 脚本）

---

上一级：[03 企业业务应用](/instances/business/) · [实例总览](/instances/)
