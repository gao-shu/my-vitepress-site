# 平台内核 · OpenBiz

> 10 个垂直应用共用的底座 · 状态：✅ 多租户已验证（9 个应用接入基座）· 🔧 部分能力试水中 · 📋 多项规划 · 工程 `E:/8.cangku/for-job/openbiz-*`

## 📌 平台简介

OpenBiz 不是又一个业务系统，而是「**一次建深、多次复用**」的企业应用底座。垂直应用只做领域模型与配置，通用能力全部下沉。

关键在于：这个底座其实有**两层**，很多介绍会把它们混成一句「OpenBiz 平台」。分开看才准确——

| 层 | 内容 | 来源 |
|---|---|---|
| **L0 技术基座** | RuoYi 3.9.2：登录 / JWT、RBAC 权限、菜单、字典、操作日志、代码生成、Quartz 定时任务 | 上游开源，不重复造 |
| **L1 应用内核** | `openbiz-saas-core`：租户上下文、租户↔成员关系、请求级隔离注入 | 自研，15 个类 |

垂直应用写的是第三层：**领域模型 + 业务状态机 + 该领域特有的规则**。

## 🏗️ 整体架构

```
┌ 垂直应用层（10 个独立工程，独立端口 + 独立库）
│
│  办公类（薄）   CRM · PMS · OA · BPM        各 11 个类 / 2 张表
│  业务类（中）   WorkOrder · ERP · HRM       7~54 个类 / 1~14 张表
│  工业类（厚）   MES · WMS · IIoT            43~119 个类 / 11~17 张表
│                                              ▲ 厚的是领域复杂度，不是基础设施
├ 平台内核 · OpenBiz
│  L1 应用内核  openbiz-saas-core〔自研 15 类〕
│     租户上下文 ThreadLocal · 租户↔成员 · 请求拦截注入 · 租户探针
│  L0 技术基座  RuoYi 3.9.2〔上游〕
│     登录 / JWT · RBAC · 菜单 · 字典 · 操作日志 · 代码生成 · Quartz
└ 数据层 · MySQL 8 · Redis · 对象存储 · 消息队列
```

两条设计主张：

- **上薄下厚**：垂直应用只保留领域模型与配置，越往上越薄；通用能力全部下沉到内核。
- **一处升级、处处受益**：租户、登录、权限在内核改一次，9 个接入 L1 内核的应用同时生效。

## 🔍 MES / WMS / IIoT 到底用没用内核？

**用到了，而且是内核最重的三个消费者。** 早期版本把架构图画成只有办公类应用才接平台，那是错的。

### 证据一：依赖声明完全一致

10 个应用的 `backend/pom.xml` 里有 9 个是同一套三件套：

```xml
<parent>          com.ruoyi : ruoyi : 3.9.2            <!-- L0 基座 -->
<dependency>      com.openbiz : openbiz-saas-core      <!-- L1 内核 -->
<dependency>      com.ruoyi  : ruoyi-framework         <!-- 登录/权限外壳 -->
```

统计结果：`openbiz-saas-core` 在 10 个应用里出现 **9 次**，唯一例外是 WorkOrder——它依赖的是 `openbiz-service` 母域模块，没有接租户内核（早期原型，见下文「诚实的边界」）。

### 证据二：租户隔离是真的落到了 SQL 里

| 应用 | 端口 | 独立库 | Java 类 | 业务表 | SQL 中 `tenant_id` | `TenantContext` 引用 |
|---|---|---|---|---|---|---|
| PMS | 18083 | `openbiz_pms` | 11 | 2 | 21 | 2 |
| CRM | 18084 | `openbiz_crm` | 11 | 2 | 22 | 2 |
| ERP | 18085 | `openbiz_erp` | 39 | 7 | 68 | 8 |
| **MES** | 18082 | `openbiz_mes` | 43 | 13 | 25 | **11** |
| **WMS** | 18086 | `openbiz_wms` | 61 | 17 | **132** | 2 |
| **IIoT** | 18089 | `openbiz_iiot` | 119 | 11 | **118** | **13** |

> 口径说明：SQL 中的 `tenant_id` 统计的是**全部查询与写入语句**里带租户条件的次数，
> XML mapper 与注解式 SQL 都计入。WMS 用 MyBatis 注解（`@Select` / `@Insert` 直接写在 Mapper 接口上），
> ERP / MES / IIoT 用 XML mapper——两种写法对租户隔离的要求完全一样：**每一条触及业务表的语句都要带 `tenant_id`**，
> 漏一条就是跨租户数据泄漏。
>
> 「业务表」指该库中非 RuoYi 系统表（`sys_*` / `qrtz_*`）、非代码生成器表（`gen_*`）、非平台基础表（`openbiz_tenant` / `openbiz_member`）的表。ERP 的 7 张里，6 张是业务表、1 张 `openbiz_erp_order_seq` 是单号计数器。

办公类应用（CRM / PMS / OA / BPM）各只有 **11 个类、2 张表**，几乎纯领域模型；工业类单应用就有 17 张表、132 处租户过滤。**但它们站在同一个底座上**——这正是「薄」与「厚」的正确理解：厚薄差在业务，不在基础设施。

### 证据三：租户不是各写各的，走的同一条链路

```java
// L1 内核：请求进入时解析，ThreadLocal 持有，请求结束必清理
TenantContext.clear();                                  // 防 Tomcat 线程复用串租户
Long userId = currentUserIdOrNull();                    // 从 RuoYi LoginUser 取
Long tenantId = tenantResolver.resolveTenantId(userId); // 查 openbiz_member
TenantContext.setTenantId(tenantId);

// 垂直应用侧：直接取，不关心来源
Long t = TenantContext.getTenantId();                   // WMS StockService / IIoT IngestService / MES 均如此
```

MES 的 11 处、IIoT 的 13 处引用都套用这个模式，没有应用自己发明租户机制。

### 内核的边界：定时任务没有「请求」

这是接入时最早撞上的坑，也是最能说明内核边界的地方（代码注释里就写着）：

> 定时任务没有请求上下文，拿不到 `TenantContext`。这里不查系统租户表，也不做半成品的跨租户遍历。

MES 的设备轮询、IIoT 的采集任务都跑在 `@Scheduled` 里，此时 ThreadLocal 为空。当前做法是**显式限定在单租户**，跨租户批处理留给 P1 的「租户列表 + 上下文切换」。这类边界不写进内核，反而避免了「看起来支持多租户、实际会串数据」的假象。

## 🧩 复用清单：谁负责什么

| 能力 | 由谁提供 | 垂直应用要做的事 |
|---|---|---|
| 登录 / JWT / 会话 | L0 RuoYi | 只配置 `application.yml`，不写认证代码 |
| RBAC 角色与菜单 | L0 RuoYi | 写 `rbac_<域>.sql` 灌菜单与角色（MES / WMS 均已做） |
| 字典 / 参数 / 操作日志 | L0 RuoYi | 直接调用，不重复实现 |
| 租户隔离 | L1 `openbiz-saas-core` | Service 里取 `TenantContext`，SQL 带 `tenant_id` |
| 多租户成员关系 | L1 `openbiz-saas-core`（`openbiz_tenant` / `openbiz_member`） | 不建同类表 |
| 领域状态机 | 各应用自建 | MES / WMS / ERP 各自实现，不共享（见边界） |
| 跨应用集成 | 各应用自建 | MES → WMS/IIoT 走 HTTP 客户端 + outbox 表，**不共享库** |
| 定时任务 | L0 Quartz 或 `@Scheduled` | 自行处理无请求上下文的租户问题 |

一句话：**「登录、权限、租户」一律复用；「实体、状态机、集成」一律自建。**

## 🔌 接入一个新应用的标准动作

已被 10 个应用反复验证的流程：

1. **起独立工程** `openbiz-<域>-app`：独立端口（18081–18089、18091 已用满）+ 独立库 `openbiz_<域>`
2. **接三件套**：父 POM `com.ruoyi:ruoyi:3.9.2` + `openbiz-saas-core` + `ruoyi-framework`
3. **按命名约定建表**：`openbiz_<域>_*`，业务表统一带 `tenant_id`
4. **定义领域状态机**：合法流转白名单 + 非法跳转拦截
5. **补 E2E 闭环**，达成「可运行 → 可测试 → 有文档」

## 📦 已接入应用（10 个）

| 应用 | 端口 | 独立库 | 内核 | 规模 |
|---|---|---|---|---|
| [WorkOrder 服务工单](/apps/openbiz/workorder) | 18081 | `openbiz_workorder` | ⚠️ 仅 L0 + `openbiz-service` | 7 类 / 1 表 |
| [MES 生产执行](/instances/industrial/mes) | 18082 | `openbiz_mes` | ✅ L0 + L1 | 41 类 / 13 表 |
| [PMS 项目管理](/instances/business/pms) | 18083 | `openbiz_pms` | ✅ L0 + L1 | 11 类 / 2 表 |
| [CRM 客户关系](/instances/business/crm) | 18084 | `openbiz_crm` | ✅ L0 + L1 | 11 类 / 2 表 |
| [ERP 企业资源](/instances/business/erp) | 18085 | `openbiz_erp` | ✅ L0 + L1 | 39 类 / 7 表 |
| [WMS 仓储管理](/instances/industrial/wms) | 18086 | `openbiz_wms` | ✅ L0 + L1 | 61 类 / 17 表 |
| [OA 办公自动化](/instances/office/oa) | 18087 | `openbiz_oa` | ✅ L0 + L1 | 11 类 / 2 表 |
| [BPM 流程管理](/instances/office/bpm) | 18088 | `openbiz_bpm` | ✅ L0 + L1 | 11 类 / 2 表 |
| [IIoT 工业物联网](/instances/industrial/iiot) | 18089 | `openbiz_iiot` | ✅ L0 + L1 | 119 类 / 11 表 |
| [HRM 人力资源](/instances/office/hrm) | 18091 | `openbiz_hrm` | ✅ L0 + L1 | 54 类 / 14 表 |

## 🚫 诚实的边界

做平台最容易夸大的就是「内核覆盖了 80%」。以下是当前真实情况：

- **工作流没有下沉内核**：BPM 应用自己实现流程，其他应用也各自写状态机，没有共享的流程引擎（三个工业应用均未依赖 Flowable）。
- **只有租户内核被真正复用**：基座仓库里还有 `openbiz-foundation` / `business` / `service` / `iot` / `shop` / `agent` 等母域模块，但**没有一个垂直应用依赖它们**（唯一例外是 WorkOrder 用了 `openbiz-service`）。它们目前是实验与归档形态，不要算进「共享内核」。
- **WorkOrder 是唯一没接租户内核的应用**：表里有 `tenant_id` 列、Mapper 也按 `tenantId` 过滤，但 Java 侧 `TenantContext` 引用为 **0**——租户值由兼容层从别处传入，没有走统一上下文，属于「字段有了、机制没接」的半成品；它接的是 `openbiz-service` 母域模块而非 `openbiz-saas-core`。
- **IIoT 的权限形态与其他应用不同**：对外 `/api/v1/**` 用 `@Anonymous` + `InternalToken` 自行鉴权（设备/第三方接入，不走用户登录）；管理端走通用 `EntityHandler`，因此方法级没有 `@PreAuthorize`。
- **Form 动态表单只存在于规划**：架构图里出现过 `Form`，但 10 个工程中没有对应实现。
- **审计、消息通知、导入导出**：前两项主要依赖 RuoYi 自带能力与各应用自建的 outbox，没有统一的消息中心。

## 🚀 平台演进路线

| 里程碑 | 内容 | 状态 |
|---|---|---|
| M1 | 多租户 + 独立工程骨架（当时 8 个应用接入验证，现已扩展到 9 个接 L1 内核） | ✅ 完成 |
| M2 | 租户机制补齐 WorkOrder、定时任务跨租户批处理 | 🔧 待做 |
| M3 | 工作流下沉内核（当前 BPM 独占） | 📋 规划 |
| M4 | 动态表单引擎 + 统一消息中心 + 开放 API / SSO | 📋 规划 |

## 🔗 相关资源

- 实证总览：[OpenBiz 实战](/apps/openbiz/)
- 工业侧消费者：[MES](/instances/industrial/mes) · [WMS](/instances/industrial/wms) · [IIoT](/instances/industrial/iiot)
- 办公侧消费者：[功能开发 › 企业业务应用](/apps/business/) · [功能开发 › 办公自动化](/apps/office/)

---

上一级：[项目实例总表](/instances/) · [03 企业业务应用](/instances/business/)
