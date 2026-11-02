# IIoT 工业物联网监控系统

<div class="sys-hero">
  <div class="sys-hero__eyebrow">02 工业数字化 · 优先级 2 / 3</div>
  <div class="sys-hero__badges">
    <span class="sys-badge sys-badge--ok">✅ P0 已收口（MQTT · Modbus · 规则告警 · 看板 · P0-15 E2E）</span>
    <span class="sys-badge">Java 21 · Spring Boot 3</span>
    <span class="sys-badge">:18089 · openbiz_iiot</span>
    <span class="sys-badge">一键 verify-p0-15 · E2E-RESULT.txt</span>
  </div>
  <p class="sys-hero__pitch">设备不再靠人喊：PLC 与仪表的状态、工艺参数、告警自动收上来，断线补传不丢数，故障先于停线被发现</p>
</div>

> 诚实边界：MQTT / Modbus TCP、点位、攒批幂等、规则告警（持续/迟滞/收敛）、通知 outbox、分区聚合、看板、P0-15 一键验收都已落地。**P1-16 协议**：Modbus RTU（CRC + RTU-over-TCP）、S7 SoftPLC（ISO-on-TCP Read DB）、OPC-UA Soft（OBUA 演示帧，非完整 UA Binary）均可本地闭环；真 RS485 / 真 PLC / 完整 `opc.tcp` 仍需硬件或 Milo/Kepware。**未做**：边缘网关、TDengine、OEE、真机 TLS；断库补传与 20 万队列溢出（设计用例 4/5）在一键脚本里显式 SKIP。

## 业务场景

**一家什么样的厂**：设备品牌杂、协议杂——PLC、仪表、变频器、AGV 各说各话。数据其实一直在设备里，但没人取；故障靠操作工喊人，停机原因事后靠回忆复盘。

| 角色 | 在系统里做什么 | 没有系统时的样子 |
|---|---|---|
| 设备工程师 | 配点位（设备 × 指标 × 采集周期） | 想看一次数据要拎笔记本去现场连 PLC |
| 班组长 | 看看板状态灯与活动告警 | 挨台设备看指示灯，靠经验判断正不正常 |
| 值班调度 | 收告警、认领、处理、关单 | 电话通知，谁处理了、处理到哪没人知道 |
| 设备主管 | 看历史曲线与故障频次 | 停机了才复盘，没有数据只能凭印象 |

**这段业务真正难的地方是「采得上、存得下、报得准」三件事同时成立**：采集端一断就丢数，高频写入一攒就把业务库拖死，告警一多就没人看——三个问题互相牵制，任何一环偷懒，看板上的数字就没人敢信。

三条落到业务上的硬约束：

- **采集线程不写库**：写库慢不拖采集，断线进本地缓冲，恢复后按时间序补传，缺口显式标记
- **告警只由规则产生**：阈值 + 持续时长 + 迟滞恢复 + 窗口收敛，不允许接口手工造告警
- **遥测只追加**：明细表不提供改删，纠错靠补新点 + 缺口标记，历史永远查得回

## 功能架构

<svg viewBox="0 0 880 236" width="100%" style="max-width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IIoT 功能架构图">
<rect x="0" y="0" width="880" height="236" rx="14" fill="var(--vp-c-bg-soft)"/>
<text x="124" y="40" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">现场层</text>
<rect x="140" y="16" width="232" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="256" y="40" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">PLC · 传感器</text>
<rect x="384" y="16" width="232" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="500" y="40" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">仪表 · 变频器</text>
<rect x="628" y="16" width="232" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="744" y="40" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">AGV · 立库</text>
<text x="124" y="98" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">接入层</text>
<rect x="140" y="74" width="232" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="256" y="98" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">MQTT 订阅</text>
<rect x="384" y="74" width="232" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="500" y="98" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">Modbus 轮询</text>
<rect x="628" y="74" width="232" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="744" y="98" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">缓冲 · 补传</text>
<text x="124" y="156" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">应用层</text>
<rect x="140" y="132" width="171" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="226" y="156" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">点位配置</text>
<rect x="323" y="132" width="171" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="408" y="156" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">遥测写入</text>
<rect x="506" y="132" width="171" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="591" y="156" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">规则评估</text>
<rect x="689" y="132" width="171" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="774" y="156" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">看板 · 曲线</text>
<text x="124" y="214" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">领域层</text>
<rect x="140" y="190" width="232" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="256" y="214" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">设备状态机 · 5 态</text>
<rect x="384" y="190" width="232" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="500" y="214" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">告警状态机 · 4 态</text>
<rect x="628" y="190" width="232" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="744" y="214" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">点位 · 规则 · 通知</text>
</svg>

实心高亮 = **P0 已落地**（接入 → 应用 → 领域）。现场层 PLC/仪表/AGV 仍是被采对象，不在本仓库里模拟硬件本体。三层职责不能混：接入层只管「读得到、不丢」，应用层只管「存得下、报得出」，领域层只管「状态对不对」。

## 核心亮点

<div class="sys-grid">
  <div class="sys-card">
    <div class="sys-card__icon">🔌</div>
    <div class="sys-card__title">协议收敛</div>
    <div class="sys-card__desc">MQTT 上报与 Modbus 轮询差异收进适配层，上层只认「设备 + 点位 + 值」</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🧯</div>
    <div class="sys-card__title">断线不丢数</div>
    <div class="sys-card__desc">指数退避重连 + 本地环形缓冲，恢复后按时间序补传，缺口显式标记</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🌊</div>
    <div class="sys-card__title">高频写不压业务库</div>
    <div class="sys-card__desc">攒批异步落库，明细 / 聚合分层保留，采集与写库解耦</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🔔</div>
    <div class="sys-card__title">告警不刷屏</div>
    <div class="sys-card__desc">阈值 + 持续时长 + 迟滞恢复 + 窗口收敛，误报先死在规则里</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">⚡</div>
    <div class="sys-card__title">最新值快查</div>
    <div class="sys-card__desc">最新值走 Redis，历史曲线走范围聚合，看板不被慢查询拖白屏</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🔁</div>
    <div class="sys-card__title">双状态机</div>
    <div class="sys-card__desc">设备 5 态、告警 4 态，非法流转统一 409 ILLEGAL_TRANSITION</div>
  </div>
</div>

## 功能清单

> 状态图例：✅ 已实现 · 🔧 进行中 · 📋 待做

### 已实现（E2E 16 步全绿）

| 功能域 | 功能 | 状态 | 证据 |
|---|---|---|---|
| 底座 | 多租户 / 权限 / 审计 | ✅ 复用 | `openbiz-saas-core`，表带 `tenant_id` |
| 底座 | 统一状态机 + 全局错误契约 | ✅ 复用 | `ILLEGAL_TRANSITION` → 409 |
| 设备 | 设备台账（编码 / 型号 / 位置） | ✅ | `openbiz_iiot_device` |
| 设备 | 五态状态机 | ✅ | `OFFLINE/ONLINE/FAULT/MAINTENANCE/DECOMMISSIONED` |
| 告警 | 告警记录与四态状态机 | ✅ | `ACTIVE→ACKNOWLEDGED→RESOLVED` / `ACTIVE→CANCELLED` |
| 统计 | 设备 / 告警状态计数 | ✅ | `GET /api/iiot/stats` |
| 验证 | HTTP E2E 脚本 | ✅ | `backend/e2e_iiot.py` · `E2E-RESULT.txt` |

### P0 能力（已到「可连真设备演示」；约覆盖监控场景 60%～70%）

| 功能域 | 功能 | 状态 | 说明 |
|---|---|---|---|
| 协议 | MQTT 接入（内嵌 broker / EMQX，QoS1） | ✅ | 主题 `iiot/{tenantId}/{deviceCode}/telemetry` · P0-08 |
| 协议 | Modbus TCP 轮询（寄存器 → 点位） | ✅ | 内嵌从站 + 分组合并读 + 解码 · `verify_modbus.py` 15 PASS · P0-09；RTU 归 P1 |
| 点位 | 点位定义与配置 | ✅ | 设备 × 指标 × 数据类型 × 采集周期 · P0-04 |
| 时序 | 遥测写入（攒批 + 幂等） | ✅ | 明细按天分区 · P0-05 |
| 时序 | 最新值缓存 | ✅ | Redis Hash · P0-06 |
| 时序 | 范围查询与降采样 | ✅ | `interval` 驱动 min/max/avg · P0-07 |
| 监控 | 实时看板、趋势曲线 | ✅ | 状态灯 + 内联 SVG 曲线 + 活动告警 · P0-13 |
| 告警 | 阈值规则配置（持续时长 / 迟滞） | ✅ | 规则可热更新 · P0-10 |
| 告警 | 分级 + 企业微信机器人通知 | ✅ | outbox + 重试 · P0-11 |
| 协议 | 前端通用契约（`/list` · `/transition`） | ✅ | devices / alarms / points / rules |
| 收尾 | P0-15 E2E 扩展 | ✅ | `verify-p0-15.sh` → 原 16 步 + 契约 + 扩展 **11 PASS** 写入 `E2E-RESULT.txt`；用例 4/5（断库 / 20 万溢出）显式 SKIP |

### P1 / P2 待做

| 阶段 | 功能 | 状态 |
|---|---|---|
| P1 | 向 MES 供数（`/api/iiot/v1` 集成层：HMAC 签名 / 幂等键 / 防重放、状态语义拆分、计数器差值、工单产量归属、下行写点位、事件推送、主数据对账） | ✅ | `verify-mes.sh`：8 张表迁移幂等 + 85 单测 + 契约 34 PASS / 0 FAIL（写点位 5 例待开启 `IIOT_WRITE_ENABLED`）；见工程 `docs/iiot-mes-integration.md` |
| P1 | Modbus RTU / S7 SoftPLC / OPC-UA Soft（P1-16） | ✅ | 单元环回全绿；真串口 / 真 PLC / 完整 UA Binary 仍豁免；见工程 `docs/p1-16-protocols.md` |
| P1 | 边缘网关离线缓存、TDengine 时序库、告警升级与排班、能耗 | 📋 | 需硬件 / 时序库 / 7 天基线；触发条件见设计文档 §11 |
| P1 | OEE / 能耗分析 | 📋 | 设计上明确归 MES（性能率需要工艺节拍），IIoT 只供数 |
| P2 | SCADA 组态、设备影子、远程指令 / OTA、预测性维护、万级点位、TLS 双向认证、行业测点模板 | 📋 |

## 核心流程

一条数据从现场到看板，只有五个动作：

```
设备 ─▶ 采集适配 ─▶ 归一化 ─▶ 攒批落库 ─▶ 规则评估 ─▶ 告警 / 通知
                        │                        │
                   Redis 最新值            看板 / 曲线查询
```

每一步对数据的副作用 —— 这是 IIoT 真正难的地方：

| 环节 | 时序明细 | Redis 最新值 | 告警 | 失败时怎么办 |
|---|---|---|---|---|
| 采集（MQTT / Modbus） | — | — | — | 进本地缓冲，标记 `gap` |
| 归一化 | — | — | — | 单位 / 类型不合法 → 丢弃并计数 |
| 攒批落库 | `INSERT` 一批 | `HSET` 覆盖 | — | 整批重试，幂等键去重 |
| 规则评估 | 只读窗口 | 只读 | 命中则建告警 | 跳过本轮，下轮重算 |
| 通知 | — | — | 写 outbox | 重试 3 次后落死信 |

三条不能破的约束：**采集线程不写库**（写慢不拖采集）、**落库与规则解耦**（规则挂不阻塞入库）、**告警只由规则产生**（不允许接口手工造 ACTIVE 告警绕过规则）。

## 状态机

**设备**（真实转移表，`Set.of()` 即终态）

| 当前态 | 可转移到 | 触发 |
|---|---|---|
| `OFFLINE` | `ONLINE` · `MAINTENANCE` · `DECOMMISSIONED` | 上线 / 检修 / 退役 |
| `ONLINE` | `FAULT` · `MAINTENANCE` · `OFFLINE` · `DECOMMISSIONED` | 故障 / 检修 / 掉线 / 退役 |
| `FAULT` | `OFFLINE` · `MAINTENANCE` | 恢复（回离线待上线）/ 检修 |
| `MAINTENANCE` | `OFFLINE` | 结束维护 |
| `DECOMMISSIONED` | — | 终态，不可再上线 |

**告警**

| 当前态 | 可转移到 | 触发 |
|---|---|---|
| `ACTIVE` | `ACKNOWLEDGED` · `RESOLVED` · `CANCELLED` | 认领 / 自愈恢复 / 误报取消 |
| `ACKNOWLEDGED` | `RESOLVED` | 处理完成 |
| `RESOLVED` / `CANCELLED` | — | 终态 |

关键接口（前缀 `/api/iiot`）：

| 方法 | 路径 | 说明 | 状态 |
|---|---|---|---|
| GET | `/devices/list` | 设备分页列表（通用契约） | ✅ 已实现 · 前端待切 |
| POST | `/devices/{id}/transition?to=ONLINE` | 状态流转统一入口 | ✅ 已实现 · 前端待切 |
| POST | `/devices/{id}/online` · `/fault` · `/recover` · `/offline` · `/maintenance` · `/end-maintenance` · `/decommission` | 动作式流转 | ✅ |
| POST | `/alarms/{id}/ack` · `/resolve` · `/cancel` | 告警流转 | ✅ |
| GET | `/points` · POST/PUT/DELETE | 点位配置 | ✅ |
| POST | `/telemetry/ingest` | 内部采集入口（幂等，`X-Internal-Token`） | ✅ |
| GET | `/telemetry/latest` | 最新值（读 Redis） | ✅ |
| GET | `/telemetry/series` | 区间曲线（降采样） | ✅ |
| GET | `/dashboard/overview` | 看板聚合（状态 + 活动告警 + 关键点位） | ✅ |
| GET | `/stats` | 设备 / 告警状态计数 | ✅ |

非法流转不写在 if-else 里：统一走 `StatusMachine` + `ILLEGAL_TRANSITION`，返回 409。与 [MES 状态机](./mes#状态机)、[WMS 单据状态机](./wms#单据状态机) 同一套做法。

## 技术栈与架构

| 层 | 技术 | 职责 |
|---|---|---|
| 后端 | Java 21 · Spring Boot 3 · MyBatis · Druid | REST、状态机、采集调度 |
| 采集 | Eclipse Paho（MQTT）· 自研 Modbus TCP 主站/内嵌从站 | 订阅与轮询，收敛到同一 `Sample` / `IngestService` |
| 前端 | Vite · Vue 3 · TypeScript · Element Plus · ECharts | 元数据驱动（`modules.ts`）+ 看板 |
| 存储 | MySQL 8（`openbiz_iiot`） | 台账、点位、规则、遥测明细 / 聚合 |
| 缓存 | Redis | 最新值 Hash、规则缓存、分布式锁 |
| 消息 | EMQX 5.x | 设备上报入口，QoS1 |
| 底座 | OpenBiz `saas-core` + RuoYi 登录外壳 | 多租户 / 权限 / 审计 |

<svg viewBox="0 0 880 292" width="100%" style="max-width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IIoT 分层结构图">
<rect x="0" y="0" width="880" height="292" rx="14" fill="var(--vp-c-bg-soft)"/>
<text x="124" y="38" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">接入</text>
<rect x="140" y="16" width="720" height="34" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="158" y="38" font-size="13" fill="var(--vp-c-text-1)">ingest/ · MQTT 订阅 · Modbus 轮询 · 归一化</text>
<text x="844" y="38" font-size="12" text-anchor="end" fill="var(--vp-c-text-3)">断线退避 · 本地缓冲</text>
<text x="124" y="84" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">接口</text>
<rect x="140" y="62" width="720" height="34" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="158" y="84" font-size="13" fill="var(--vp-c-text-1)">controller/ · REST + 内部采集入口</text>
<text x="844" y="84" font-size="12" text-anchor="end" fill="var(--vp-c-text-3)">租户 · 幂等 · 校验</text>
<text x="124" y="130" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">应用</text>
<rect x="140" y="108" width="720" height="34" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="158" y="130" font-size="13" fill="var(--vp-c-text-1)">application/ · 写入编排 · 查询编排 · 规则调度</text>
<text x="844" y="130" font-size="12" text-anchor="end" fill="var(--vp-c-text-3)">事务边界 · 攒批</text>
<text x="124" y="176" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">领域</text>
<rect x="140" y="154" width="720" height="34" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="158" y="176" font-size="13" fill="var(--vp-c-text-1)">domain/ · 设备 · 告警 · 点位 · 规则 · 状态机</text>
<text x="844" y="176" font-size="12" text-anchor="end" fill="var(--vp-c-text-3)">状态流转只在这里判定</text>
<text x="124" y="222" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">持久</text>
<rect x="140" y="200" width="720" height="34" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="158" y="222" font-size="13" fill="var(--vp-c-text-1)">mapper/ · MyBatis</text>
<text x="844" y="222" font-size="12" text-anchor="end" fill="var(--vp-c-text-3)">批量 INSERT · 分区查询</text>
<text x="124" y="268" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">底座</text>
<rect x="140" y="246" width="720" height="34" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)" stroke-dasharray="5 4"/>
<text x="158" y="268" font-size="13" fill="var(--vp-c-text-1)">openbiz-saas-core · 多租户 / 权限 / 审计</text>
<text x="844" y="268" font-size="12" text-anchor="end" fill="var(--vp-c-text-3)">MySQL openbiz_iiot · Redis</text>
</svg>

```
openbiz-iiot-app/
├── backend/          # :18089
│   ├── src/main/java/com/openbiz/iiot/
│   │   ├── ingest/   #   P0 新增：mqtt / modbus / 归一化 / 缓冲
│   │   ├── domain/   #   设备 · 告警 · 点位 · 规则 · 状态机
│   │   ├── mapper/   #   MyBatis
│   │   ├── service/  #   编排
│   │   └── web/      #   控制器 · 全局异常
│   ├── e2e_iiot.py   #   HTTP E2E
│   └── E2E-RESULT.txt
├── frontend/         # Vue3/TS · modules.ts 元数据 · 看板
├── sql/              # 建表脚本（按版本递增）
└── README.md
```

## 核心数据模型

| 域 | 表 | 谁写 | 关键约束 |
|---|---|---|---|
| 设备 | `openbiz_iiot_device` | 设备 Service | `uk_tenant_code(tenant_id, device_code)` |
| 告警 | `openbiz_iiot_alarm` | 告警 Service | 状态只经状态机改 |
| 点位 | `openbiz_iiot_point` | 点位 Service | `uk(tenant_id, device_id, metric)` |
| 遥测明细 | `openbiz_iiot_telemetry` | 采集写入器 | `uk(device_id, metric, ts)` 幂等，按天分区 |
| 遥测聚合 | `openbiz_iiot_telemetry_agg` | 聚合任务 | `uk(device_id, metric, bucket)`，5 分钟粒度 |
| 规则 | `openbiz_iiot_rule` | 规则 Service | 变更后发事件刷新内存缓存 |
| 通知 | `openbiz_iiot_notify_outbox` | 通知派发器 | 状态机 `PENDING/SENT/DEAD`，重试 3 次 |

四条硬约束，和 WMS 的「不可篡改流水」同性质，不是形容词：

1. **遥测只 `INSERT`**：明细表不提供 update / delete，纠错靠补新点 + 缺口标记，不改历史。
2. **幂等键唯一**：`(device_id, metric, ts)` 唯一索引，MQTT QoS1 重投与补传重复不产生重复行。
3. **最新值可重建**：Redis 丢了不慌，`MAX(ts)` 回查一次即恢复；Redis 只是加速，不是数据源。
4. **聚合可重算**：聚合表任意时间窗可删除重算，明细是唯一事实来源。

保留策略（P0 固定值，P1 可配）：明细 7 天、5 分钟聚合 90 天、告警与状态变更长期保留。

## 系统边界

| 协同 | 链路 | 方向 |
|---|---|---|
| MES | 设备状态 / 产量 / 告警 → 进度、OEE、安灯（P1） | IIoT → MES |
| WMS | AGV / 立库状态 → 调度（P2） | IIoT → WMS |
| ERP | 设备台账主数据（P1） | ERP → IIoT |

原则：IIoT **只采集与告警**，不承载生产工单或库存业务；各系统独立库、不共享表；同步 OpenAPI、异步 MQ 事件；`tenantId` 透传。

## 路线与验收

1. **阶段一（已达成）**：设备 + 告警双状态机，证明 OpenBiz 可承载物联域
2. **阶段二（P0，已收口）**：数据层与状态机已落地（P0-01 迁移幂等 / P0-02 状态机抽泛型）；采集链路打通「写入 → 缓存 → 查询」——点位配置、攒批幂等写入（10 线程 × 1000 条并发去重到 1000 行）、Redis 最新值与回填、区间降采样与断线缺口标记（P0-03 ~ P0-07，32 项断言全绿）；**MQTT 接入与数据模拟器已通**——报文解析做成纯函数单测穷举异常分支，订阅端按 60s TTL 缓存设备与点位元数据（否则 100 台设备 1Hz 就是每秒 300 次查库），模拟器支持「直写」与「发报文」双输出，后者能把 MQTT 链路整条自证（P0-08 + P0-14，34 项断言全绿）；**规则引擎已跑通告警闭环**——持续时长、迟滞恢复、收敛窗口三件套，判定用采集旁路喂进的内存时间窗口而不是每轮查库（「窗口内全部样本满足」用聚合值推不出来），命中后告警与通知 outbox 同事务落库（P0-10，30 项断言全绿）；**通知派发已闭环**——派发器只读 outbox，成功置 `SENT`、失败按 2 的幂退避重试、超限置 `DEAD` 并回写告警的通知状态，webhook 未配置时照常出队（用计数表达「主动放弃」，而不是让 `PENDING` 积压成一个假故障）（P0-11，25 项断言全绿）；**长期运行的三件事也补上了**——按天分区自动补建与过期清理（跨天不补就会全部落进 `MAXVALUE` 兜底分区，写入不报错但分区裁剪失效）、5 分钟聚合只写「已封口」的桶并用重算窗口吸收迟到数据、心跳判活按每台设备的采集周期算阈值（判活下限必须大于 `last_seen` 的 30 秒写库节流，否则正常上报的设备会被反复判离线，状态灯开始抖）（P0-12，38 项断言全绿）；**看板把链路变成了看得见的东西**——首屏一个接口返回状态灯、活动告警与关键点位最新值，曲线用内联 SVG 画而不是引图表库（8KB 的独立 chunk），降级判定看「数据有多旧」而不是「这次请求成没成」：请求失败但快照还新时继续显示旧数据，超过 15 秒才亮黄条，后端挂了也不白屏（P0-13，27 项接口断言 + 11 个降级单测全绿）。**P0-09 Modbus TCP 已通**（内嵌从站 + 分组合并读 + 解码，`verify_modbus.py` 15 PASS）。**P0-15 E2E 扩展已通**（2026-11-02，`verify-p0-15.sh` 一键全绿：Modbus 单测 + 双 E2E 回归 + 扩展 11 PASS / 2 SKIP）。**至此 P0-01 ~ P0-15 全部落地**；用例 4/5（断库补传、20 万条溢出压测）需故障注入，在一键脚本里显式 SKIP、不伪装通过。

## 相关链接

- 模块总览：[02 工业数字化应用](/instances/industrial/)
- 同套件：[MES](./mes) · [WMS](./wms)
- 实施设计：见工程仓库 `openbiz-iiot-app/docs/iiot-p0-design.md`（不对外发布）
- 实践文：[PLC 数据采集](/apps/industrial/plc-collect) · [设备监控与告警](/apps/industrial/device-monitor)
- 实证页：[OpenBiz › IIoT](/apps/openbiz/iiot)

---

上一级：[02 工业数字化应用](/instances/industrial/) · [实例总览](/instances/)
