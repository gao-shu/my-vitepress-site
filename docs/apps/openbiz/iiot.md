# 工业物联网 IIoT · OpenBiz 第九个独立消费者（A 类收官）
> 现为独立应用 `openbiz-iiot-app`（`E:/8.cangku/for-job/openbiz-iiot-app`）：独立后端（端口 18089）+ 独立前端（Vue3/TS）+ 独立数据库 `openbiz_iiot`。

> **当前状态**：设备 + 告警双状态机已验证（16 步 E2E 全绿）；P0 采集链路已打通写入 → 缓存 → 查询（P0-01 数据层、P0-02 状态机、P0-03 契约收口、P0-04 点位、P0-05 攒批幂等写入、P0-06 最新值缓存、P0-07 降采样查询，均验收通过），**并已完成 MQTT 接入与数据模拟器**（P0-08 报文解析 + 订阅器 + 内嵌 broker、P0-14 直写 / 发报文双输出模拟器，34 项断言全绿），**规则引擎已跑通告警闭环**（P0-10 持续时长 + 迟滞恢复 + 收敛窗口，告警与通知 outbox 同事务，30 项断言全绿），**通知派发已闭环**（P0-11 outbox → 企微 webhook → 退避重试 → 死信，并回写告警通知状态，25 项断言全绿），**长期运行能力已补齐**（P0-12 按天分区自动补建与过期清理、5 分钟聚合只写已封口桶、按设备采集周期算阈值的心跳判活，38 项断言全绿），**看板已上线**（P0-13 首屏一个接口出状态灯/活动告警/关键点位，曲线内联 SVG 不引图表库，降级按数据年龄判定不白屏，27 项接口断言 + 11 个降级单测全绿），余 Modbus 接入。实施设计见工程仓库 `openbiz-iiot-app/docs/iiot-p0-design.md`。

> 实证：OpenBiz 母仓无 IIoT 域，按 OpenBiz 命名约定自建 `openbiz_iiot_*` 表，在其多租户基座之上实现「设备 + 告警双状态机 + 统计」最小闭环。**这是 A 类 9 个系统中最后一个试水的，标志 A 类试水全覆盖完成。**

## 复用与自建

- **复用**：OpenBiz `openbiz-saas-core` 多租户（TenantContext / TenantService / 自动装配）、RuoYi 登录外壳
- **自建**：`openbiz_iiot_device` / `openbiz_iiot_alarm` 表 + Mapper / Service / Controller
  - 设备状态机：`OFFLINE → ONLINE → FAULT → OFFLINE`，`ONLINE/FAULT → MAINTENANCE → OFFLINE`，`OFFLINE/ONLINE → DECOMMISSIONED`（不可逆终态）
  - 告警状态机：`ACTIVE → ACKNOWLEDGED → RESOLVED`，`ACTIVE → CANCELLED`

## 业务闭环（E2E 已验证）

创建设备(`OFFLINE`) → 上线(`ONLINE`) → 建告警(`ACTIVE`) → 确认(`ACKNOWLEDGED`) → 解决(`RESOLVED`)；已解决再确认 / 取消均被 `ILLEGAL_TRANSITION` 拒绝。独立路径报故障(`FAULT`) → 维护(`MAINTENANCE`) → 结束维护(`OFFLINE`) → 再上线(`ONLINE`) → 退役(`DECOMMISSIONED`)；退役后再上线被拒。统计接口 `GET /api/iiot/stats` 返回设备 / 告警各状态数量。

## 工程位置

`E:/8.cangku/for-job/openbiz-iiot-app`（含 README 与 E2E 脚本，端口 18089）

## 价值

与工单 / MES / PMS / CRM / ERP / OA / BPM 等共同坐实「百套流水线」可复制。EAM 已下线，仓储场景改由规划中的 WMS 承接；当前 OpenBiz 已交付 **10** 个独立应用（含本 IIoT）。

## 下一步（P0）

从「状态机 Demo」推进到「可连真设备演示」，P0 只补三件事：**采得上**（MQTT 订阅 + Modbus TCP 轮询，收敛到统一 `Sample`）、**存得下**（MySQL 分区明细 + 5 分钟聚合，幂等批量写入）、**报得准**（阈值 + 持续时长 + 迟滞恢复 + 收敛窗口）。

明确不做：Modbus RTU、OPC-UA/S7、TDengine、动态阈值、设备影子与 OTA —— 这些归 P1/P2，P0 不碰。完整表结构、接口契约、任务拆解与 16 条验收用例见工程仓库 `openbiz-iiot-app/docs/iiot-p0-design.md`（实施文档不发布到站点）。

---

上一级：[OpenBiz 试水实证](/apps/openbiz/)
