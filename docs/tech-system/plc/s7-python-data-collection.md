# 西门子 S7 PLC 详解与 Python 数据采集实战

本文深入介绍西门子 S7 系列 PLC 的技术特点、内存结构，并提供使用 Python 进行数据采集的完整实战指南。

## 一、西门子 S7 系列概览

### 1.1 主要产品线

| 系列 | 定位 | I/O 点数 | 典型应用 | 价格区间 |
|------|------|----------|----------|----------|
| **S7-200 SMART** | 小型经济型 | ≤ 256 | 简单逻辑控制、小型设备 | ¥ |
| **S7-1200** | 中小型通用型 | ≤ 1024 | 包装机械、 HVAC、水处理 | ¥¥ |
| **S7-1500** | 中大型高性能 | ≤ 8192 | 汽车制造、复杂产线 | ¥¥¥ |
| **S7-300/400** | 经典中型（逐步淘汰） | ≤ 65536 |  legacy 系统维护 | ¥¥¥ |

> 💡 **建议**：新项目优先选择 **S7-1200**（性价比最高）或 **S7-1500**（高性能需求）。

---

### 1.2 S7-1200 vs S7-1500 核心对比

| 特性 | S7-1200 | S7-1500 |
|------|---------|---------|
| **处理器速度** | 0.08 μs/指令 | 0.02 μs/指令 |
| **最大工作内存** | 150 KB | 6 MB |
| **运动控制轴数** | 6 轴 | 32 轴 |
| **PROFINET 端口** | 2 | 3 |
| **Web 服务器** | ✅ | ✅（功能更强） |
| **OPC UA 支持** | ❌（需固件升级） | ✅ 原生支持 |
| **TIA Portal 版本** | V11+ | V13+ |
| **适用场景** | 中小项目 | 大型复杂项目 |

---

## 二、S7 PLC 内存结构与数据类型

### 2.1 内存区域划分

理解 S7 的内存结构是数据采集的基础：

```
┌─────────────────────────────────────┐
│         S7 PLC 内存布局              │
├──────────┬──────────────────────────┤
│ 区域     │ 说明                     │
├──────────┼──────────────────────────┤
│ I (Input)    │ 数字量输入映像区      │
│ Q (Output)   │ 数字量输出映像区      │
│ M (Memory)   │ 位存储器（中间变量）  │
│ DB (Data Block)│ 数据块（用户数据）   │
│ T (Timer)    │ 定时器                │
│ C (Counter)  │ 计数器                │
└──────────┴──────────────────────────┘
```

**重点说明**：
- **I/Q/M 区**：按**位（bit）**寻址，如 `I0.0`、`Q1.2`、`M10.5`
- **DB 块**：按**字节（byte）**寻址，用于存储结构化数据，如 `DB1.DBD0`（DB1 的第 0-3 字节）
- **T/C 区**：专用定时器/计数器，较少用于外部数据采集

---

### 2.2 常用数据类型

| 类型 | 缩写 | 长度 | 示例地址 | 说明 |
|------|------|------|----------|------|
| **BOOL** | - | 1 bit | `DB1.DBX0.0` | 布尔值（0/1） |
| **BYTE** | B | 8 bits | `DB1.DBB0` | 无符号字节（0-255） |
| **WORD** | W | 16 bits | `DB1.DBW0` | 无符号字（0-65535） |
| **DWORD** | DW | 32 bits | `DB1.DBD0` | 无符号双字 |
| **INT** | - | 16 bits | `DB1.DBW0` | 有符号整数（-32768~32767） |
| **DINT** | - | 32 bits | `DB1.DBD0` | 有符号双整数 |
| **REAL** | - | 32 bits | `DB1.DBD0` | 浮点数（IEEE 754） |
| **STRING** | - | 可变 | `DB1.DBB0` | 字符串（最多 254 字符） |

> ⚠️ **注意**：S7 采用**大端字节序（Big-Endian）**，高位字节在前。Python 读取时需注意字节序转换。

---

### 2.3 DB 块详解

**DB 块**是 S7 PLC 中最常用的数据存储区，分为两类：

#### （1）全局 DB 块
- 所有程序块都可访问
- 适合存储共享数据（如设备状态、工艺参数）
- 示例：`DB1`、`DB100`

#### （2）背景 DB 块（Instance DB）
- 与特定 FB（功能块）绑定
- 存储该 FB 的静态变量
- 示例：调用 `FB10` 时自动生成的 `DB10`

**实际项目中的 DB 块规划示例**：

```
DB1   - 设备状态（运行/停止/故障）
DB10  - 温度传感器数据（REAL 类型）
DB20  - 生产计数（DINT 类型）
DB30  - 配方参数（混合类型）
DB100 - 报警信息（STRING 类型）
```

---

## 三、S7 通信协议

### 3.1 S7 专有协议（ISO-on-TCP）

西门子 S7 PLC 使用专有的 **S7 Communication Protocol**，基于 ISO-on-TCP（RFC 1006），默认端口 **102**。

**协议栈**：
```
应用层: S7 Protocol (读写请求/响应)
传输层: ISO-on-TCP (RFC 1006)
网络层: TCP/IP
物理层: Ethernet
```

**优势**：
- ✅ 直接访问所有内存区域（I/Q/M/DB/T/C）
- ✅ 性能高，延迟低（< 10ms）
- ✅ 支持批量读写

**劣势**：
- ❌ 非开放标准，依赖第三方库
- ❌ 需要配置 PLC 允许 PUT/GET 通信

---

### 3.2 启用 S7 通信权限

在 TIA Portal 中配置：

1. 打开 **设备组态** → **属性** → **防护与安全**
2. 勾选 **"允许来自远程对象的 PUT/GET 通信"**
3. 下载程序到 PLC

> ⚠️ **安全提醒**：生产环境建议配合防火墙限制访问 IP。

---

### 3.3 Modbus TCP 替代方案

如果无法启用 S7 协议，可使用 **Modbus TCP**（端口 502）：

- S7-1200/1500 需添加 **MB_SERVER** 指令块
- 将 DB 块映射到 Modbus 保持寄存器
- 使用标准 Modbus 库读取

**对比**：
| 特性 | S7 协议 | Modbus TCP |
|------|---------|------------|
| 配置复杂度 | 简单（只需启用权限） | 中等（需编程映射） |
| 数据访问灵活性 | 高（任意地址） | 低（仅映射的寄存器） |
| 跨平台兼容性 | 低（依赖 snap7） | 高（标准协议） |
| 性能 | 优 | 良 |

---

## 四、Python 读取 S7 PLC 数据实战

### 4.1 环境准备

#### 安装 python-snap7

```bash
pip install python-snap7
```

#### 验证安装

```python
import snap7
print(snap7.__version__)  # 应输出版本号
```

> 💡 **注意**：`python-snap7` 依赖底层 `snap7.dll`（Windows）或 `libsnap7.so`（Linux），pip 会自动安装。

---

### 4.2 连接 PLC

```python
import snap7
from snap7.util import get_real, get_int, get_bool

# 创建客户端实例
client = snap7.client.Client()

# 连接 PLC
# 参数：PLC IP 地址, Rack（通常为0）, Slot（S7-1200/1500为1，S7-300为2）
plc_ip = "192.168.1.100"
rack = 0
slot = 1

try:
    client.connect(plc_ip, rack, slot)
    print(f"✅ 成功连接到 PLC: {plc_ip}")
except Exception as e:
    print(f"❌ 连接失败: {e}")
    exit(1)

# 检查连接状态
if client.get_connected():
    print("PLC 连接状态: 正常")
else:
    print("PLC 连接状态: 断开")
```

---

### 4.3 读取不同类型数据

#### （1）读取 BOOL 类型（位）

```python
# 读取 DB1.DBX0.0（DB1 的第 0 字节第 0 位）
data = client.db_read(1, 0, 1)  # 读取 DB1，从偏移 0 开始，读 1 字节
value = get_bool(data, 0, 0)     # 从字节 0 的第 0 位提取布尔值
print(f"DB1.DBX0.0 = {value}")

# 读取 M10.5（位存储器）
data = client.read_area(snap7.types.Areas.MK, 0, 10, 1)
value = get_bool(data, 0, 5)
print(f"M10.5 = {value}")
```

---

#### （2）读取 INT/DINT 类型（整数）

```python
# 读取 DB1.DBW0（16 位有符号整数）
data = client.db_read(1, 0, 2)  # 读 2 字节
value = get_int(data, 0)
print(f"DB1.DBW0 (INT) = {value}")

# 读取 DB1.DBD0（32 位有符号整数）
data = client.db_read(1, 0, 4)  # 读 4 字节
value = snap7.util.get_dint(data, 0)
print(f"DB1.DBD0 (DINT) = {value}")
```

---

#### （3）读取 REAL 类型（浮点数）

```python
# 读取 DB10.DBD0（32 位浮点数，常用于温度、压力等模拟量）
data = client.db_read(10, 0, 4)  # 读 4 字节
value = get_real(data, 0)
print(f"DB10.DBD0 (REAL) = {value:.2f} °C")
```

---

#### （4）读取 STRING 类型（字符串）

```python
# 读取 DB100 中的字符串（假设最大长度 50）
data = client.db_read(100, 0, 52)  # S7 字符串前 2 字节为长度信息
value = snap7.util.get_string(data, 0, 50)
print(f"DB100 字符串 = {value}")
```

---

#### （5）批量读取（提高效率）

```python
# 一次性读取 DB1 的前 100 字节
data = client.db_read(1, 0, 100)

# 解析多个变量
temp = get_real(data, 0)      # DB1.DBD0
pressure = get_real(data, 4)  # DB1.DBD4
count = snap7.util.get_dint(data, 8)  # DB1.DBD8
running = get_bool(data, 12, 0)  # DB1.DBX12.0

print(f"温度: {temp:.2f}, 压力: {pressure:.2f}, 计数: {count}, 运行: {running}")
```

> 💡 **性能提示**：批量读取比多次单次读取快 5-10 倍，推荐用于高频采集场景。

---

### 4.4 写入数据到 PLC

```python
# 写入 BOOL 值（置位/复位）
data = bytearray(1)
snap7.util.set_bool(data, 0, 0, True)  # 设置为 True
client.db_write(1, 0, data)  # 写入 DB1.DBX0.0

# 写入 INT 值
data = bytearray(2)
snap7.util.set_int(data, 0, 100)  # 设置值为 100
client.db_write(1, 10, data)  # 写入 DB1.DBW10

# 写入 REAL 值
data = bytearray(4)
snap7.util.set_real(data, 0, 25.5)  # 设置值为 25.5
client.db_write(10, 0, data)  # 写入 DB10.DBD0
```

> ⚠️ **注意**：写入操作需谨慎，避免误改关键控制参数。建议在生产环境中限制写入权限。

---

### 4.5 完整示例：周期性数据采集

```python
import snap7
from snap7.util import get_real, get_int, get_bool
import time
import json
from datetime import datetime

class S7DataCollector:
    """S7 PLC 数据采集器"""
    
    def __init__(self, plc_ip, rack=0, slot=1):
        self.client = snap7.client.Client()
        self.plc_ip = plc_ip
        self.rack = rack
        self.slot = slot
        self.connected = False
    
    def connect(self):
        """连接 PLC"""
        try:
            self.client.connect(self.plc_ip, self.rack, self.slot)
            self.connected = self.client.get_connected()
            print(f"✅ 已连接到 PLC: {self.plc_ip}")
        except Exception as e:
            print(f"❌ 连接失败: {e}")
            self.connected = False
    
    def disconnect(self):
        """断开连接"""
        if self.connected:
            self.client.disconnect()
            self.connected = False
            print("🔌 已断开连接")
    
    def read_device_status(self):
        """读取设备状态（示例）"""
        if not self.connected:
            return None
        
        try:
            # 批量读取 DB1 的前 20 字节
            data = self.client.db_read(1, 0, 20)
            
            status = {
                "timestamp": datetime.now().isoformat(),
                "temperature": get_real(data, 0),      # DB1.DBD0
                "pressure": get_real(data, 4),         # DB1.DBD4
                "production_count": snap7.util.get_dint(data, 8),  # DB1.DBD8
                "is_running": get_bool(data, 12, 0),   # DB1.DBX12.0
                "has_alarm": get_bool(data, 12, 1),    # DB1.DBX12.1
                "motor_speed": get_int(data, 14),      # DB1.DBW14
            }
            
            return status
        except Exception as e:
            print(f"❌ 读取失败: {e}")
            return None
    
    def collect_loop(self, interval=1.0, max_iterations=None):
        """
        周期性采集数据
        
        参数:
            interval: 采集间隔（秒）
            max_iterations: 最大采集次数（None 表示无限循环）
        """
        iteration = 0
        print(f"🔄 开始数据采集，间隔: {interval}s")
        
        try:
            while max_iterations is None or iteration < max_iterations:
                status = self.read_device_status()
                
                if status:
                    # 打印到控制台
                    print(f"\n[{status['timestamp']}]")
                    print(f"  温度: {status['temperature']:.2f} °C")
                    print(f"  压力: {status['pressure']:.2f} bar")
                    print(f"  产量: {status['production_count']}")
                    print(f"  运行: {'✅' if status['is_running'] else '❌'}")
                    print(f"  报警: {'⚠️' if status['has_alarm'] else '✓'}")
                    print(f"  转速: {status['motor_speed']} RPM")
                    
                    # 保存到 JSON 文件（可选）
                    with open("plc_data.json", "a", encoding="utf-8") as f:
                        f.write(json.dumps(status, ensure_ascii=False) + "\n")
                
                time.sleep(interval)
                iteration += 1
        
        except KeyboardInterrupt:
            print("\n\n⏹️  用户中断采集")
        finally:
            self.disconnect()


# 使用示例
if __name__ == "__main__":
    collector = S7DataCollector(plc_ip="192.168.1.100")
    collector.connect()
    
    if collector.connected:
        # 采集 100 次，每次间隔 2 秒
        collector.collect_loop(interval=2.0, max_iterations=100)
```

---

### 4.6 异常处理与重连机制

```python
import time

def robust_read(client, db_number, offset, size, max_retries=3):
    """
    带重试机制的健壮读取
    
    参数:
        client: snap7 客户端
        db_number: DB 块编号
        offset: 偏移量
        size: 读取字节数
        max_retries: 最大重试次数
    """
    for attempt in range(max_retries):
        try:
            data = client.db_read(db_number, offset, size)
            return data
        except Exception as e:
            print(f"⚠️  读取失败 (尝试 {attempt + 1}/{max_retries}): {e}")
            
            # 检查连接状态，必要时重连
            if not client.get_connected():
                print("🔄 尝试重新连接...")
                try:
                    client.reconnect()
                    print("✅ 重连成功")
                except Exception as reconnect_err:
                    print(f"❌ 重连失败: {reconnect_err}")
                    time.sleep(2)
            
            if attempt == max_retries - 1:
                raise  # 最后一次重试仍失败，抛出异常
            
            time.sleep(1)  # 等待 1 秒后重试
    
    return None
```

---

## 五、常见问题与排查

### 5.1 连接失败

**症状**：`Connection refused` 或 `Timeout`

**排查步骤**：
1. ✅ 确认 PLC IP 地址正确（在 TIA Portal 中查看）
2. ✅ 确认 PC 与 PLC 在同一网段
3. ✅ 检查防火墙是否放行端口 102
4. ✅ 确认 PLC 已启用 PUT/GET 权限
5. ✅ 确认 Rack/Slot 参数正确（S7-1200/1500: Rack=0, Slot=1）

**测试连通性**：
```bash
ping 192.168.1.100
telnet 192.168.1.100 102
```

---

### 5.2 读取数据错误

**症状**：读取到的值与实际不符

**常见原因**：
1. ❌ **字节序问题**：S7 是大端序，确保使用 `snap7.util` 工具函数
2. ❌ **地址偏移错误**：确认 DB 块起始地址和数据类型长度
3. ❌ **DB 块未优化**：在 TIA Portal 中取消勾选 **"优化的块访问"**

**解决方案**：
- 使用 TIA Portal 的 **监控表** 验证地址
- 打印原始字节数据对比：
  ```python
  data = client.db_read(1, 0, 4)
  print(f"原始字节: {data.hex()}")  # 例如: 41c80000
  ```

---

### 5.3 性能优化

**问题**：采集频率低（> 100ms）

**优化建议**：
1. ✅ 使用**批量读取**代替多次单次读取
2. ✅ 减少不必要的变量采集
3. ✅ 增加采集间隔（根据实际需求）
4. ✅ 使用异步库（如 `asyncio` + `aiosnap7`）

**示例：优化前后对比**
```python
# ❌ 低效：5 次单独读取
temp = client.db_read(1, 0, 4)
pressure = client.db_read(1, 4, 4)
count = client.db_read(1, 8, 4)
running = client.db_read(1, 12, 1)
speed = client.db_read(1, 14, 2)

# ✅ 高效：1 次批量读取
data = client.db_read(1, 0, 20)
temp = get_real(data, 0)
pressure = get_real(data, 4)
count = snap7.util.get_dint(data, 8)
running = get_bool(data, 12, 0)
speed = get_int(data, 14)
```

---

## 六、进阶主题

### 6.1 使用 OPC UA 替代方案

对于 S7-1500（或固件升级后的 S7-1200），可使用标准 OPC UA 协议：

```python
from opcua import Client

# 连接 OPC UA 服务器
client = Client("opc.tcp://192.168.1.100:4840")
client.connect()

# 读取节点值
node = client.get_node("ns=3;s=\"DB1\".\"Temperature\"")
value = node.get_value()
print(f"温度: {value}")

client.disconnect()
```

**优势**：
- ✅ 标准化协议，跨厂商兼容
- ✅ 内置安全性（加密、认证）
- ✅ 支持订阅机制（变化推送）

---

### 6.2 集成到 Spring Boot 后端

**架构方案**：
```
[PLC] ←S7/Modbus→ [Python 采集服务] ←HTTP/gRPC→ [Spring Boot] ←→ [Vue 前端]
```

**实现思路**：
1. Python 服务作为**数据采集网关**，周期性读取 PLC 数据
2. 通过 REST API 暴露数据接口
3. Spring Boot 调用 Python 服务或直接消费 MQTT/Kafka 消息
4. Vue 前端展示实时数据

**Python Flask 示例**：
```python
from flask import Flask, jsonify
import snap7

app = Flask(__name__)
client = snap7.client.Client()
client.connect("192.168.1.100", 0, 1)

@app.route('/api/plc/status')
def get_status():
    data = client.db_read(1, 0, 20)
    return jsonify({
        "temperature": get_real(data, 0),
        "pressure": get_real(data, 4),
        "running": get_bool(data, 12, 0)
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

---

### 6.3 数据存储与可视化

**技术栈推荐**：
- **时序数据库**：InfluxDB / TimescaleDB
- **消息队列**：MQTT / Redis Stream
- **可视化**：Grafana / Vue + ECharts

**数据流**：
```
PLC → Python 采集 → MQTT → InfluxDB → Grafana 大屏
```

---

## 七、学习资源

### 官方文档
- [西门子 S7-1200 手册](https://support.industry.siemens.com/cs/document/109742075)
- [TIA Portal 入门指南](https://support.industry.siemens.com/cs/cn/zh/view/109767651)

### Python 库
- [python-snap7 GitHub](https://github.com/gijzelaerr/python-snap7)
- [Snap7 官方文档](http://snap7.sourceforge.net/)

### 仿真软件
- **PLCSIM Advanced**：S7-1500 仿真（需授权）
- **S7-PLCSIM**：S7-1200/1500 基础仿真（TIA Portal 自带）

---

## 八、总结

| 要点 | 说明 |
|------|------|
| **选型建议** | 中小项目选 S7-1200，大型项目选 S7-1500 |
| **通信协议** | 优先使用 S7 专有协议（性能好），备选 Modbus TCP |
| **Python 库** | `python-snap7` 是最成熟的解决方案 |
| **数据类型** | 注意字节序（大端）、地址偏移、DB 块优化选项 |
| **性能优化** | 批量读取 > 单次读取，合理设置采集频率 |
| **安全注意** | 生产环境限制写入权限，配置防火墙规则 |

**下一步行动**：
1. 📖 阅读 [Modbus TCP 通信实战](../integration/modbus-tcp-node-plc.md)
2. 🛠️ 使用 PLCSIM 仿真软件练习 Python 数据采集
3. 🚀 将采集的数据接入 Spring Boot 后端，实现可视化监控

---

> 💡 **实用主义提示**：对于中小企业物联网项目，**无需深入研究 S7 协议底层细节**。掌握 `python-snap7` 的基本用法、理解 DB 块结构、能稳定采集数据即可。遇到问题直接查询文档或使用 AI 辅助，避免陷入理论陷阱。
