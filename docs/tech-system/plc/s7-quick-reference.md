# 西门子 S7 PLC 速查手册

> 本文是 [西门子 S7 详解与 Python 采集实战](./s7-python-data-collection.md) 的精简版，适合快速查阅。

## 一、快速连接

```python
import snap7

client = snap7.client.Client()
client.connect("192.168.1.100", 0, 1)  # IP, Rack=0, Slot=1
```

---

## 二、常用读取操作

### 读取 BOOL（位）
```python
data = client.db_read(1, 0, 1)
value = snap7.util.get_bool(data, 0, 0)  # DB1.DBX0.0
```

### 读取 INT（16位整数）
```python
data = client.db_read(1, 0, 2)
value = snap7.util.get_int(data, 0)  # DB1.DBW0
```

### 读取 DINT（32位整数）
```python
data = client.db_read(1, 0, 4)
value = snap7.util.get_dint(data, 0)  # DB1.DBD0
```

### 读取 REAL（浮点数）
```python
data = client.db_read(10, 0, 4)
value = snap7.util.get_real(data, 0)  # DB10.DBD0
```

### 批量读取（推荐）
```python
data = client.db_read(1, 0, 20)  # 一次读 20 字节
temp = snap7.util.get_real(data, 0)
pressure = snap7.util.get_real(data, 4)
count = snap7.util.get_dint(data, 8)
```

---

## 三、写入操作

```python
# 写入 BOOL
data = bytearray(1)
snap7.util.set_bool(data, 0, 0, True)
client.db_write(1, 0, data)

# 写入 INT
data = bytearray(2)
snap7.util.set_int(data, 0, 100)
client.db_write(1, 10, data)

# 写入 REAL
data = bytearray(4)
snap7.util.set_real(data, 0, 25.5)
client.db_write(10, 0, data)
```

---

## 四、内存地址对照表

| 类型 | 示例地址 | 长度 | Python 函数 |
|------|----------|------|-------------|
| BOOL | `DB1.DBX0.0` | 1 bit | `get_bool(data, byte_offset, bit)` |
| BYTE | `DB1.DBB0` | 1 byte | `data[0]` |
| WORD | `DB1.DBW0` | 2 bytes | `get_int(data, 0)` |
| DWORD | `DB1.DBD0` | 4 bytes | `get_dint(data, 0)` / `get_real(data, 0)` |

---

## 五、常见错误排查

### 连接失败
```bash
# 测试网络连通性
ping 192.168.1.100
telnet 192.168.1.100 102
```

**检查清单**：
- ✅ PLC IP 地址正确
- ✅ PC 与 PLC 同网段
- ✅ 防火墙放行端口 102
- ✅ TIA Portal 中启用 PUT/GET 权限
- ✅ Rack=0, Slot=1（S7-1200/1500）

---

### 数据读取错误
**可能原因**：
1. 字节序问题（S7 是大端序）
2. 地址偏移计算错误
3. DB 块启用了"优化访问"

**解决方案**：
- 使用 `snap7.util` 工具函数（自动处理字节序）
- 在 TIA Portal 中取消勾选 **"优化的块访问"**
- 打印原始字节验证：`print(data.hex())`

---

## 六、性能优化建议

| 优化项 | 说明 |
|--------|------|
| **批量读取** | 1 次读 20 字节 > 5 次读 4 字节 |
| **减少频率** | 根据实际需求设置采集间隔（1-5 秒） |
| **异常重试** | 实现自动重连机制 |
| **异步采集** | 高频场景使用 `aiosnap7` |

---

## 七、完整示例模板

```python
import snap7
from snap7.util import get_real, get_int, get_bool
import time

class PLCCollector:
    def __init__(self, ip):
        self.client = snap7.client.Client()
        self.ip = ip
    
    def connect(self):
        self.client.connect(self.ip, 0, 1)
    
    def read_status(self):
        data = self.client.db_read(1, 0, 20)
        return {
            "temp": get_real(data, 0),
            "pressure": get_real(data, 4),
            "count": snap7.util.get_dint(data, 8),
            "running": get_bool(data, 12, 0)
        }
    
    def close(self):
        self.client.disconnect()

# 使用
collector = PLCCollector("192.168.1.100")
collector.connect()

while True:
    status = collector.read_status()
    print(status)
    time.sleep(2)

collector.close()
```

---

## 八、相关资源

- 📖 [完整教程：西门子 S7 详解与 Python 采集](./s7-python-data-collection.md)
- 🔧 [Modbus TCP 通信实战](../integration/modbus-tcp-node-plc.md)
- 🌐 [python-snap7 GitHub](https://github.com/gijzelaerr/python-snap7)
