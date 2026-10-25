# 工业物联网 IIoT · OpenBiz 第九个独立消费者（A 类收官）
> 现为独立应用 `openbiz-iiot-app`（`E:/8.cangku/for-job/openbiz-iiot-app`）：独立后端（端口 18089）+ 独立前端（Vue3/TS）+ 独立数据库 `openbiz_iiot`。

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

与工单 / MES / PMS / CRM / ERP / EAM / OA / BPM 共同坐实「百套流水线」可复制。至此 **A 类 9 个系统（工单/MES/PMS/CRM/ERP/EAM/OA/BPM/IIoT）全部以独立消费者方式跑通**，OpenBiz 作为 A 类统一底座的结论获充分实证。后续可叠加 MQTT/Modbus 接入、时序库、设备影子与规则引擎。

---

上一级：[OpenBiz 试水实证](/apps/openbiz/)
