# Modbus TCP：Python ↔ PLC（数据采集与边缘计算）

## 这属于「数据通信」吗？

**算，且是工业自动化中的主流方案**。在中小企业物联网项目中，Python 常用于：
- **边缘数据采集**：从 PLC/变频器/温控器读取实时数据
- **AI 视觉联动**：将产线状态传给视觉检测系统
- **快速原型验证**：脚本化测试设备通信，比组态软件更灵活

| 维度 | Node.js | Python |
|------|---------|--------|
| 典型场景 | Web 后端集成、实时推送 | 数据采集、AI 联动、脚本测试 |
| 核心库 | `modbus-serial` | `pymodbus` |
| 优势 | 异步非阻塞、适合高并发 Web | 生态丰富（NumPy/Pandas）、易与 AI 集成 |
| 字节序处理 | 需手动处理 Buffer | `struct` 模块原生支持 |

---

## Modbus TCP 最小概念（与 Node.js 篇一致）

1. **主站 / 从站（Client / Server）**：Python 脚本通常当 **主站（Master）**，PLC 是 **从站（Slave）**。
2. **Unit ID（从站号）**：`slave=1` 要和 PLC 配置一致。
3. **端口**：Modbus TCP **默认 502**。
4. **数据类型**：
   - **线圈（Coils）**：可读写的位（功能码 `0x01`/`0x05`）。
   - **离散输入（Discrete Inputs）**：只读位（功能码 `0x02`）。
   - **输入寄存器（Input Registers）**：只读字（功能码 `0x04`）。
   - **保持寄存器（Holding Registers）**：可读写字（功能码 `0x03`/`0x06`/`0x10`）。

---

## Python：连接 Modbus TCP（使用 pymodbus）

### 安装依赖

```bash
pip install pymodbus
```

### 同步方式（适合脚本化测试）

```python
from pymodbus.client import ModbusTcpClient

# 连接 PLC
client = ModbusTcpClient('192.168.1.100', port=502)
client.connect()

if client.is_socket_open():
    print("Modbus TCP 连接成功")
else:
    print("连接失败")
    exit(1)

# 读保持寄存器（Function Code 03）
# 地址 0，读取 10 个寄存器，从站号 1
result = client.read_holding_registers(address=0, count=10, slave=1)

if not result.isError():
    print("寄存器数据:", result.registers)
    # 解析为整数
    temp = result.registers[0]  # 假设第一个寄存器是温度
    print(f"当前温度: {temp}°C")
else:
    print("读取错误:", result)

# 写单个寄存器（Function Code 06）
client.write_register(address=1, value=100, slave=1)

# 读线圈（Function Code 01）
coils = client.read_coils(address=0, count=3, slave=1)
if not coils.isError():
    print("线圈状态:", coils.bits)
    running = coils.bits[0]
    warning = coils.bits[1]
    estop = coils.bits[2]
    print(f"运行: {running}, 报警: {warning}, 急停: {estop}")

client.close()
```

### 异步方式（适合高并发采集）

```python
import asyncio
from pymodbus.client import AsyncModbusTcpClient

async def read_plc_data():
    client = AsyncModbusTcpClient('192.168.1.100', port=502)
    await client.connect()
    
    if not client.connected:
        print("连接失败")
        return
    
    # 批量读取多个地址
    tasks = [
        client.read_holding_registers(address=0, count=5, slave=1),
        client.read_coils(address=0, count=3, slave=1),
    ]
    
    results = await asyncio.gather(*tasks)
    
    regs_result, coils_result = results
    
    if not regs_result.isError():
        print("寄存器:", regs_result.registers)
    
    if not coils_result.isError():
        print("线圈:", coils_result.bits)
    
    client.close()

# 运行
asyncio.run(read_plc_data())
```

### 带重试机制的生产级示例

```python
import time
from pymodbus.client import ModbusTcpClient
from pymodbus.exceptions import ModbusException

class ModbusCollector:
    def __init__(self, host, port=502, slave=1):
        self.host = host
        self.port = port
        self.slave = slave
        self.client = None
    
    def connect(self, max_retries=3, retry_delay=2):
        """带重试的连接"""
        for attempt in range(max_retries):
            try:
                self.client = ModbusTcpClient(self.host, port=self.port)
                self.client.connect()
                if self.client.is_socket_open():
                    print(f"连接到 {self.host}:{self.port} 成功")
                    return True
            except Exception as e:
                print(f"连接尝试 {attempt + 1} 失败: {e}")
                if attempt < max_retries - 1:
                    time.sleep(retry_delay * (attempt + 1))  # 指数退避
        return False
    
    def read_registers(self, address, count, max_retries=2):
        """带重试的寄存器读取"""
        for attempt in range(max_retries):
            try:
                result = self.client.read_holding_registers(
                    address=address, 
                    count=count, 
                    slave=self.slave
                )
                if not result.isError():
                    return result.registers
                else:
                    print(f"读取错误 (尝试 {attempt + 1})")
            except ModbusException as e:
                print(f"Modbus 异常 (尝试 {attempt + 1}): {e}")
            
            if attempt < max_retries - 1:
                time.sleep(1)
        
        return None
    
    def close(self):
        if self.client:
            self.client.close()

# 使用示例
collector = ModbusCollector('192.168.1.100')
if collector.connect():
    data = collector.read_registers(address=0, count=10)
    if data:
        print("采集数据:", data)
    collector.close()
```

---

## 字节序与数据类型解析（关键！）

PLC 中 32 位浮点数（Real）占用 **2 个寄存器**，需注意字节序：

```python
import struct

# 假设从 PLC 读取到两个寄存器（16位）
registers = [17203, 26317]  # 示例数据

# 方法 1: 直接拼接为大端字节序
bytes_data = struct.pack('>HH', registers[0], registers[1])
float_value = struct.unpack('>f', bytes_data)[0]
print(f"温度值: {float_value:.2f}")

# 方法 2: 小端字节序（某些 PLC 可能用这个）
bytes_data_le = struct.pack('<HH', registers[0], registers[1])
float_value_le = struct.unpack('<f', bytes_data_le)[0]
print(f"温度值(LE): {float_value_le:.2f}")

# pymodbus 内置转换（推荐）
from pymodbus.payload import BinaryPayloadDecoder
from pymodbus.constants import Endian

# 构建解码器
decoder = BinaryPayloadDecoder.fromRegisters(
    registers, 
    byteorder=Endian.BIG,      # 字节序：大端
    wordorder=Endian.BIG       # 字序：大端
)

# 解析为 32 位浮点
temperature = decoder.decode_32bit_float()
print(f"解码温度: {temperature:.2f}")
```

**常见组合**：
- **ABCD**：`byteorder=BIG, wordorder=BIG`（西门子常用）
- **CDAB**：`byteorder=LITTLE, wordorder=LITTLE`（某些国产 PLC）
- **BADC**：`byteorder=BIG, wordorder=LITTLE`
- **DCBA**：`byteorder=LITTLE, wordorder=BIG`

> **务必与电气工程师确认 PLC 侧的字节序配置！**

---

## 与 PLC 联调清单

1. **地址表**：每个点「协议地址 / PLC 符号 / 数据类型 / 读写权限」。
2. **网络连通性**：先 `ping PLC_IP`，再 `telnet PLC_IP 502` 测试端口。
3. **从站号**：确保 `slave` 参数与 PLC 配置一致（通常是 1）。
4. **扫描周期**：避免过快轮询（建议 ≥ 100ms），防止 PLC 过载。
5. **网络安全**：Modbus TCP **无加密**，生产环境应放在 **专网 VLAN**。
6. **急停安全**：安全回路优先 **硬接线**，通信只做指示。

---

## 与 Node.js 方案对比

| 场景 | 推荐方案 |
|------|---------|
| Web 后端实时推送 | Node.js（异步非阻塞） |
| 数据采集 + AI 分析 | Python（NumPy/Pandas/PyTorch） |
| 快速脚本测试 | Python（几行代码即可） |
| 高并发多设备采集 | Node.js（事件驱动）或 Python asyncio |

---

## 延伸阅读（站内）

- [Modbus TCP：Node.js ↔ PLC](./modbus-tcp-node-plc.md)
- [Siemens S7：Python ↔ PLC](./s7-comm-python-plc.md)
- [HTTP 跨语言协作：Node.js ↔ Python](../http-node-python.md)
- [西门子 S7 详解与 Python 采集](../../plc/s7-python-data-collection.md)
