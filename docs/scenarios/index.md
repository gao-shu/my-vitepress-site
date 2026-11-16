# 解决方案

面向真实业务场景的架构设计与落地实现。每一篇都写清「问题是什么 · 为什么这么做 · 有哪些取舍」，来自实际项目与复盘。

## 系统架构

| 方案 | 解决的问题 |
|---|---|
| [Web 系统架构设计与开发实战](/scenarios/web-system-design) | 从零设计中型企业管理系统（CRM/OA/ERP/MES）：技术选型、分层与交付节奏 |
| [秒杀系统架构设计](/scenarios/seckill) | 十万人抢一百台设备的防超卖与高并发：层层拦截、流量削峰、内存预扣 |
| [多租户架构设计与数据隔离](/scenarios/multi-tenant) | 一套代码多套数据：字段级 / Schema 级 / 数据库级三种隔离的取舍 |

## 认证与接口

| 方案 | 解决的问题 |
|---|---|
| [单点登录（SSO）与第三方授权（OAuth2）](/scenarios/sso) | 多子系统登录一次即可访问；同域与跨域两种解法 |
| [对外 API 接口设计与开发实战](/scenarios/open-api) | 第三方对接的身份认证方案选型与接口规范 |
| [接口幂等性设计实战](/scenarios/api-idempotent) | 重复点击与框架自动重试导致的重复扣款、重复下单 |

## 数据处理

| 方案 | 解决的问题 |
|---|---|
| [大文件分片上传与断点续传](/scenarios/large-file) | 超大文件不超时、不撑爆内存：分片、并发、合并与秒传 |

## 企业数字化

四套系统的边界、主链路与核心问题清单。每篇都按「问题 → 为什么难 → 解法 → 面试口径」写，可直接当面试稿用。

| 方案 | 解决的问题 |
|---|---|
| [四大系统边界与问题全景](/scenarios/enterprise-digital/) | ERP/WMS/MES/IIoT 怎么分工、一条链路怎么串、跨系统四道坎 |
| [ERP 核心问题清单](/scenarios/enterprise-digital/erp) | MRP 算不准、BOM 变更失控、成本核算失真、账实不符 |
| [WMS 核心问题清单](/scenarios/enterprise-digital/wms) | 库存四维模型、波次拣货、批次效期、弱网离线作业 |
| [MES 核心问题清单](/scenarios/enterprise-digital/mes) | 工单状态机、报工倒冲、WIP 对不上、质量追溯断链 |
| [IIoT 核心问题清单](/scenarios/enterprise-digital/iiot) | 协议碎片、点表字节序、写放大、断线丢数、告警风暴 |

### 库存作业技术专题

企业数字化下的库存子专题，从技术实现角度讲清库存准确性背后的三个硬骨头。

| 方案 | 解决的问题 |
|---|---|
| [库存并发扣减与防超卖](/scenarios/inventory-deduction) | 高并发下不超卖、余额与流水一致：锁 / 乐观锁 / 预扣的取舍 |
| [批次效期与 FIFO / FEFO 追溯](/scenarios/batch-fefo) | 多批次出库先发哪批、效期如何控、质量如何正反追溯 |
| [库位分配与上架策略](/scenarios/location-allocation) | 收货后放哪个库位、如何避免乱放与爆仓 |
