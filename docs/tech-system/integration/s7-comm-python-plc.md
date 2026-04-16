# Siemens S7 Comm：Python ↔ PLC（S7-1200/1500）

## 这属于「数据通信」吗？

**算，且是西门子 PLC 的专属协议**。根据你的技术偏好，**Python 是 PLC 数据采集的首选语言**，适合快速脚本化测试和边缘计算场景。

| 维度 | Modbus TCP | S7 Comm |
|------|-----------|---------|
| 协议类型 | 开放标准 | 西门子私有协议 |
| 适用设备 | 通用 PLC/变频器 | 西门子 S7-300/400/1200/1500 |
| 核心库（Python） | `pymodbus` | `python-snap7` |
| 配置复杂度 | 简单 | 中等（需 Rack/Slot + DB 块） |
| 学习成本 | 低 | 中（需理解 DB 块结构） |

---

## S7 通信最小概念

1. **Rack（机架号）**：PLC 的物理插槽位置，S7-1200/1500 通常为 `0`。
2. **Slot（槽号）**：CPU 所在槽位，S7-1200/1500 通常为 `1`。
3. **DB 块（Data Block）**：数据块，如 `DB1`、`DB100`。
4. **地址偏移**：DB 块内的字节偏移，如 `DB1.DBW0`。
5. **数据类型**：BOOL、BYTE、WORD、DWORD、INT、DINT、REAL（32位浮点）。

---

## Python：连接 S7 PLC（使用 python-snap7）

### 前置条件

`python-snap7` 依赖 Snap7 C++ 库：

**Windows**：
1. 下载 [Snap7](http://snap7.sourceforge.net/)
2. 将 `snap7.dll` 放到项目根目录或系统 PATH
3. 或将 DLL 路径添加到环境变量

**Linux**：
```bash
sudo apt-get install libsnap7-dev
# 或
sudo pip install python-snap7  # 会自动安装依赖
```

**macOS**：
```bash
brew install snap7
```

### 安装依赖

```bash
pip install python-snap7
```

### 基础读写示例

```python
import snap7
from snap7.util import get_real, get_int, get_bool

# 创建客户端
client = snap7.client.Client()

# 连接到 PLC（IP, Rack, Slot）
# S7-1200/1500: Rack=0, Slot=1
client.connect('192.168.1.101', rack=0, slot=1)

if client.get_connected():
    print("S7 连接成功")
else:
    print("连接失败")
    exit(1)

try:
    # 读取 DB1 的数据（从字节 0 开始，读取 20 字节）
    data = client.db_read(1, 0, 20)
    print("原始数据:", data.hex())
    
    # 解析不同类型的数据
    temperature = get_real(data, 0)      # DB1.DBD0 (REAL)
    pressure = get_real(data, 4)         # DB1.DBD4 (REAL)
    count = get_int(data, 8)             # DB1.DBW8 (INT)
    running = get_bool(data, 10, 0)      # DB1.DBX10.0 (BOOL)
    
    print(f"温度: {temperature:.2f} °C")
    print(f"压力: {pressure:.2f} bar")
    print(f"计数: {count}")
    print(f"运行状态: {'运行中' if running else '停止'}")
    
    # 写入数据到 DB1.DBD20（设定值）
    from snap7.util import set_real
    write_data = bytearray(4)
    set_real(write_data, 0, 85.5)
    client.db_write(1, 20, write_data)
    print("设定值已更新为 85.5°C")
    
finally:
    client.disconnect()
    print("已断开连接")
```

### 封装工具类（生产级）

```python
import time
import snap7
from snap7.util import get_real, get_int, get_dint, get_bool, set_real, set_int

class S7PlcClient:
    def __init__(self, ip, rack=0, slot=1):
        self.ip = ip
        self.rack = rack
        self.slot = slot
        self.client = None
        self.connected = False
    
    def connect(self, max_retries=3):
        """带重试的连接"""
        for attempt in range(1, max_retries + 1):
            try:
                self.client = snap7.client.Client()
                self.client.connect(self.ip, self.rack, self.slot)
                
                if self.client.get_connected():
                    self.connected = True
                    print(f"S7 连接到 {self.ip} (Rack:{self.rack}, Slot:{self.slot}) 成功")
                    return True
                else:
                    print(f"连接尝试 {attempt} 失败")
                    self.client = None
                    
                    if attempt < max_retries:
                        time.sleep(2 * attempt)  # 指数退避
                        
            except Exception as e:
                print(f"连接异常 (尝试 {attempt}): {e}")
                self.client = None
                
                if attempt < max_retries:
                    time.sleep(2 * attempt)
        
        return False
    
    def read_db(self, db_number, start, size):
        """读取 DB 块数据"""
        if not self.connected or not self.client:
            raise Exception("未连接到 PLC")
        
        try:
            data = self.client.db_read(db_number, start, size)
            return data
        except Exception as e:
            raise Exception(f"DB{db_number} 读取失败: {e}")
    
    def write_db(self, db_number, start, data):
        """写入 DB 块数据"""
        if not self.connected or not self.client:
            raise Exception("未连接到 PLC")
        
        try:
            self.client.db_write(db_number, start, data)
        except Exception as e:
            raise Exception(f"DB{db_number} 写入失败: {e}")
    
    def parse_real(self, data, offset=0):
        """解析 REAL（32位浮点）"""
        return get_real(data, offset)
    
    def parse_int(self, data, offset=0):
        """解析 INT（16位有符号整数）"""
        return get_int(data, offset)
    
    def parse_dint(self, data, offset=0):
        """解析 DINT（32位有符号整数）"""
        return get_dint(data, offset)
    
    def parse_bool(self, data, byte_offset, bit_offset=0):
        """解析 BOOL（位）"""
        return get_bool(data, byte_offset, bit_offset)
    
    def disconnect(self):
        """断开连接"""
        if self.client:
            self.client.disconnect()
            self.connected = False
            print("S7 连接已断开")

# 使用示例
def main():
    plc = S7PlcClient('192.168.1.101', rack=0, slot=1)
    
    if plc.connect():
        try:
            # 读取 DB1 的前 20 字节
            data = plc.read_db(1, 0, 20)
            
            temperature = plc.parse_real(data, 0)    # DB1.DBD0
            pressure = plc.parse_real(data, 4)       # DB1.DBD4
            running = plc.parse_bool(data, 8, 0)     # DB1.DBX8.0
            count = plc.parse_int(data, 10)          # DB1.DBW10
            
            print(f"温度: {temperature:.2f} °C")
            print(f"压力: {pressure:.2f} bar")
            print(f"运行状态: {'运行中' if running else '停止'}")
            print(f"计数: {count}")
            
            # 写入设定值
            from snap7.util import set_real
            setpoint_data = bytearray(4)
            set_real(setpoint_data, 0, 85.5)
            plc.write_db(1, 20, setpoint_data)  # 写入 DB1.DBD20
            print("设定值已更新为 85.5°C")
            
        except Exception as e:
            print(f"操作失败: {e}")
        finally:
            plc.disconnect()
    else:
        print("无法连接到 PLC")

if __name__ == "__main__":
    main()
```

### 批量采集示例（适合边缘计算）

```python
import time
import json
from datetime import datetime

def continuous_collect(plc, interval=1.0):
    """连续数据采集（适合存入数据库或上报）"""
    
    while True:
        try:
            data = plc.read_db(1, 0, 40)
            
            record = {
                "timestamp": datetime.now().isoformat(),
                "temperature": plc.parse_real(data, 0),
                "pressure": plc.parse_real(data, 4),
                "flow_rate": plc.parse_real(data, 8),
                "running": plc.parse_bool(data, 12, 0),
                "alarm": plc.parse_bool(data, 12, 1),
                "cycle_count": plc.parse_dint(data, 14),
            }
            
            # 输出 JSON（可改为写入数据库或 MQTT）
            print(json.dumps(record, ensure_ascii=False))
            
            time.sleep(interval)
            
        except Exception as e:
            print(f"采集错误: {e}")
            time.sleep(2)  # 错误后等待重连

# 使用
if __name__ == "__main__":
    plc = S7PlcClient('192.168.1.101')
    if plc.connect():
        try:
            continuous_collect(plc, interval=0.5)  # 每 500ms 采集一次
        except KeyboardInterrupt:
            print("\n用户中断")
        finally:
            plc.disconnect()
```

---

## 与 PLC 联调清单

### 1. PLC 侧配置（关键！）

**S7-1200/1500**：
- 打开 TIA Portal → 设备组态 → CPU 属性
- **防护与安全** → **连接机制**
- ✅ 勾选 **"允许来自远程对象的 PUT/GET 通信访问"**
- 下载配置到 PLC

> ⚠️ **这是最常见的坑！** 默认情况下 S7-1200/1500 禁止外部访问，必须手动启用。

**S7-300/400**：
- 检查硬件组态中的 Rack/Slot 是否正确
- 确认 CP 模块已正确配置

### 2. 网络连通性测试

```bash
# Ping 测试
ping 192.168.1.101

# 端口测试（S7 默认使用 102 端口）
telnet 192.168.1.101 102
```

### 3. 常见错误

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `TCP : Unreachable peer` | 网络不通或 PLC 未开机 | 检查网线、IP、PLC 电源 |
| `ISO : Invalid source or destination reference` | Rack/Slot 错误 | 确认硬件组态 |
| `CLI : Function refused by CPU` | 未启用 PUT/GET 权限 | 在 TIA Portal 中启用 |
| `DB not found` | DB 块不存在或未优化 | 检查 DB 编号，确保已下载到 PLC |

### 4. 性能优化

- **批量读取**：一次性读取连续地址，减少通信次数
- **避免频繁连接/断开**：保持长连接
- **扫描周期**：建议 ≥ 100ms

---

## 安全注意事项

1. **网络安全**：S7 协议 **无加密**，生产环境应放在 **专网 VLAN**
2. **写权限控制**：仅在必要时写入
3. **急停安全**：安全回路优先 **硬接线**
4. **访问控制**：限制上位机 IP 白名单

---

## 与 Node.js 方案对比

| 场景 | 推荐方案 |
|------|---------|
| Web 后端集成 | Node.js |
| **数据采集 + AI 分析** | **Python（你的首选）** |
| **快速脚本测试** | **Python（代码更简洁）** |
| 高并发多设备 | Node.js 或 Python asyncio |

---

## 延伸阅读（站内）

- [Siemens S7：Node.js ↔ PLC](./s7-comm-node-plc.md)
- [Modbus TCP：Python ↔ PLC](./modbus-tcp-python-plc.md)
- [西门子 S7 详解与 Python 采集](../../plc/s7-python-data-collection.md)
- [常见 PLC 品牌与选型](../../plc/common-brands.md)
- [S7 速查手册](../../plc/s7-quick-reference.md)
