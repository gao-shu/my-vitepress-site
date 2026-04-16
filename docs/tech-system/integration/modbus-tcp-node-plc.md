# Modbus TCP：Node.js ↔ PLC（工业现场常见）

## 这属于「数据通信」吗？

**算，而且是另一类「数据通信」**：

| 维度 | HTTP（上一篇） | Modbus TCP（本篇） |
|------|----------------|-------------------|
| 典型场景 | Web、微服务、开放平台 API | PLC、变频器、温控、产线设备 |
| 传输 | 多半 JSON + REST | 二进制 PDU，**寄存器/位**读写 |
| 实时性 | 毫秒～秒级，偏交互 | 常要求 **固定轮询周期**（ tens ms～秒，看工艺） |
| 工程关键 | 鉴权、幂等、超时 | **地址表、功能码、 endian、线缆与交换机** |

在自动化项目里，常说 **「设备通信」「现场总线」「数采」**；计算机网络课里的「数据链路层」也会涉及以太网帧，但 **Modbus 是应用层习惯叫法下的工控协议族**，和 REST 不是一套世界观。

---

## Modbus TCP 最小概念（和 PLC 对表必会）

1. **主站 / 从站（Client / Server）**：PC 上的 Node 通常当 **主站（Master）**，PLC 是 **从站（Slave）**。
2. **Unit ID（从站号）**：以太网里也常叫 **站地址**，`setID(1)` 要和 PLC 配置一致。
3. **端口**：Modbus TCP **默认 502**（你代码里是 `{ port: 502 }`，正确）。
4. **数据类型（逻辑区）**（不同 PLC 厂商映射到「%M/%Q/%IW/%QW」等，**必须和电气/PLC 工程师要地址表**）：
   - **线圈（Coils）**：可读写的位。
   - **离散输入（Discrete Inputs）**：只读位。
   - **输入寄存器（Input Registers）**：只读字（16 bit）。
   - **保持寄存器（Holding Registers）**：可读写字。

你示例里的 `ADDR_RUNNING / ADDR_WARNING / ADDR_ESTOP` 多半是 **线圈或保持寄存器的逻辑编号**，实际报文里还要对应 **功能码**（如读线圈 `0x01`、读保持寄存器 `0x03`、写单线圈 `0x05` 等）。

---

## Node.js：连接 Modbus TCP（与你示例同思路）

下面演示 **连接 + 节流重连** 的思路（库名以常见 `modbus-serial` 为例，API 与你贴的 `ModbusRTU` + `connectTCP` 一致；具体 import 以你项目为准）。

```typescript
import ModbusRTU from 'modbus-serial';

const ADDR_RUNNING = 0;
const ADDR_WARNING = 1;
const ADDR_ESTOP = 2;

let modbusStartTime: number | undefined;
const client = new ModbusRTU();
client.setTimeout(2000);
client.setID(1);

export async function connectModbus(host: string) {
  const now = Date.now();
  if (modbusStartTime && now - modbusStartTime < 5000) {
    return; // 5s 内避免狂连
  }
  modbusStartTime = now;

  try {
    await client.close(() => undefined);
  } catch {
    /* ignore */
  }

  try {
    await client.connectTCP(host, { port: 502 });
    console.log('Modbus TCP connected');
  } catch (err) {
    console.error('Modbus connect fail', err);
  }
}

// 读线圈示例（地址与功能码需与 PLC 侧一致）
export async function readFlags() {
  const coils = await client.readCoils(ADDR_RUNNING, 3);
  return {
    running: !!coils.data[0],
    warning: !!coils.data[1],
    estop: !!coils.data[2],
  };
}
```

**要点**：

- **IP 来源**：生产环境用环境变量（如 `VITE_MODBUS_IP` 仅在浏览器构建可用；**纯 Node 服务端**更常用 `process.env.MODBUS_IP`）。
- **重连策略**：除「5 秒节流」外，建议 **指数退避 + 最大重试**，避免 PLC 或交换机被打爆。
- **并发**：Modbus 很多现场实现 **不支持高频并行会话**，尽量 **单连接 + 串行队列**。

---

## 与 PLC 联调清单（比写代码更重要）

1. **地址表**：每个点「协议地址 / PLC 符号 / 数据类型 / 读写权限」。
2. **Endian（字节序）**：32 位浮点跨两个寄存器时，**高低字**是否与 Node 侧解析一致。
3. **扫描周期**：读太快可能被 PLC 认为异常或占满端口。
4. **网络**：Modbus TCP **无内建加密**；生产应放在 **专网 VLAN**，禁止直接暴露在公网。
5. **急停（E-Stop）**：安全回路优先 **硬接线**，通信只做指示，**不要相信纯软件急停**。

---

## 和 HTTP 那篇怎么配在一起用？

很常见架构：

- **Modbus TCP**：从 PLC 读产线状态（运行/报警/急停）。
- **HTTP**：把状态汇总给 **Python 视觉/OCR 服务** 或 **MES/云平台**。

两者都是「数据通信」，但 **协议与故障模式不同**：Modbus 要先查 **网络通、502、站号、地址**；HTTP 要先查 **URL、超时、JSON 契约**。

---

## 延伸阅读（站内）

- [Modbus TCP：Python ↔ PLC](./modbus-tcp-python-plc.md)
- [Siemens S7：Node.js ↔ PLC](./s7-comm-node-plc.md)
- [Siemens S7：Python ↔ PLC](./s7-comm-python-plc.md)
- [HTTP 跨语言协作：Node.js ↔ Python](./http-node-python.md)
- [物联网项目学习路线](/tech-system/backend/iot-project)
- [Node.js 技术栈](/tech-system/backend/nodejs-stack)
- [常见 PLC 品牌与选型](/tech-system/plc/common-brands.md)
