# Siemens S7 Comm：Node.js ↔ PLC（S7-1200/1500）

## 这属于「数据通信」吗？

**算，且是西门子 PLC 的专属协议**。S7 通信协议是西门子私有的 TCP 协议，与标准的 Modbus TCP 不同，需要专门的库来解析。

| 维度 | Modbus TCP | S7 Comm |
|------|-----------|---------|
| 协议类型 | 开放标准（IEC 60870） | 西门子私有协议 |
| 适用设备 | 通用 PLC/变频器/温控器 | 西门子 S7-300/400/1200/1500 |
| 核心库（Node.js） | `modbus-serial` | `node-snap7` / `plc-s7` |
| 配置复杂度 | 简单（只需 IP + 端口 + 站号） | 中等（需 Rack/Slot + DB 块地址） |
| 性能 | 中等 | 高（二进制协议优化） |

在中小企业项目中，如果现场使用 **西门子 PLC**，优先选择 S7 协议而非 Modbus TCP（除非 PLC 侧已启用 Modbus TCP 服务器）。

---

## S7 通信最小概念

1. **Rack（机架号）**：PLC 的物理插槽位置，S7-1200/1500 通常为 `0`。
2. **Slot（槽号）**：CPU 所在槽位，S7-1200/1500 通常为 `1`，S7-300/400 需查硬件组态。
3. **DB 块（Data Block）**：数据块，如 `DB1`、`DB100`，用于存储工艺数据。
4. **地址偏移**：DB 块内的字节偏移，如 `DB1.DBW0` 表示 DB1 的第 0-1 字节（Word）。
5. **数据类型**：
   - **BOOL**：1 位
   - **BYTE**：8 位
   - **WORD**：16 位
   - **DWORD**：32 位
   - **INT**：16 位有符号整数
   - **DINT**：32 位有符号整数
   - **REAL**：32 位浮点数

---

## Node.js：连接 S7 PLC（使用 node-snap7）

### 前置条件

`node-snap7` 依赖 Snap7 C++ 库，需要先安装动态链接库：

**Windows**：
1. 下载 [Snap7](http://snap7.sourceforge.net/)
2. 将 `snap7.dll` 放到项目根目录或系统 PATH

**Linux**：
```bash
sudo apt-get install libsnap7-dev
# 或从源码编译
```

**macOS**：
```bash
brew install snap7
```

### 安装依赖

```bash
npm install node-snap7
```

### 基础读写示例

```javascript
const S7Client = require('node-snap7');

async function s7Example() {
  const client = new S7Client();
  
  // 连接到 PLC（IP, Rack, Slot）
  // S7-1200/1500: Rack=0, Slot=1
  // S7-300/400: 根据硬件组态，常见 Rack=0, Slot=2
  const result = await client.ConnectTo('192.168.1.101', 0, 1);
  
  if (result !== 0) {
    console.error('连接失败，错误码:', result);
    return;
  }
  
  console.log('S7 连接成功');
  
  try {
    // 读取 DB1 的数据（从字节 0 开始，读取 10 字节）
    const buffer = Buffer.alloc(10);
    const readResult = await client.DBRead(1, 0, 10, buffer);
    
    if (readResult === 0) {
      console.log('原始数据:', buffer);
      
      // 解析不同类型的数据
      const intVal = buffer.readInt16BE(0);      // DB1.DBW0 (INT)
      const realVal = buffer.readFloatBE(2);     // DB1.DBD2 (REAL)
      const boolVal = (buffer[6] & 0x01) !== 0;  // DB1.DBX6.0 (BOOL)
      
      console.log('INT 值:', intVal);
      console.log('REAL 值:', realVal.toFixed(2));
      console.log('BOOL 值:', boolVal);
    } else {
      console.error('读取失败，错误码:', readResult);
    }
    
    // 写入单个字节到 DB1.DBW10
    const writeBuffer = Buffer.from([0x00, 0x64]); // 十进制 100
    const writeResult = await client.DBWrite(1, 10, 2, writeBuffer);
    
    if (writeResult === 0) {
      console.log('写入成功');
    } else {
      console.error('写入失败，错误码:', writeResult);
    }
    
  } catch (err) {
    console.error('操作异常:', err);
  } finally {
    client.Disconnect();
    console.log('已断开连接');
  }
}

s7Example();
```

### 封装工具类（生产级）

```javascript
const S7Client = require('node-snap7');

class S7PlcClient {
  constructor(ip, rack = 0, slot = 1) {
    this.ip = ip;
    this.rack = rack;
    this.slot = slot;
    this.client = null;
    this.connected = false;
  }
  
  async connect(maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.client = new S7Client();
        const result = await this.client.ConnectTo(this.ip, this.rack, this.slot);
        
        if (result === 0) {
          this.connected = true;
          console.log(`S7 连接到 ${this.ip} (Rack:${this.rack}, Slot:${this.slot}) 成功`);
          return true;
        } else {
          console.warn(`连接尝试 ${attempt} 失败，错误码: ${result}`);
          this.client = null;
          
          if (attempt < maxRetries) {
            await this.sleep(2000 * attempt); // 指数退避
          }
        }
      } catch (err) {
        console.error(`连接异常 (尝试 ${attempt}):`, err.message);
        if (attempt < maxRetries) {
          await this.sleep(2000 * attempt);
        }
      }
    }
    
    return false;
  }
  
  async readDB(dbNumber, start, size) {
    if (!this.connected || !this.client) {
      throw new Error('未连接到 PLC');
    }
    
    const buffer = Buffer.alloc(size);
    const result = await this.client.DBRead(dbNumber, start, size, buffer);
    
    if (result !== 0) {
      throw new Error(`DB${dbNumber} 读取失败，错误码: ${result}`);
    }
    
    return buffer;
  }
  
  async writeDB(dbNumber, start, data) {
    if (!this.connected || !this.client) {
      throw new Error('未连接到 PLC');
    }
    
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const result = await this.client.DBWrite(dbNumber, start, buffer.length, buffer);
    
    if (result !== 0) {
      throw new Error(`DB${dbNumber} 写入失败，错误码: ${result}`);
    }
  }
  
  // 解析 REAL（32位浮点）
  parseReal(buffer, offset = 0) {
    return buffer.readFloatBE(offset);
  }
  
  // 解析 INT（16位有符号整数）
  parseInt(buffer, offset = 0) {
    return buffer.readInt16BE(offset);
  }
  
  // 解析 DINT（32位有符号整数）
  parseDInt(buffer, offset = 0) {
    return buffer.readInt32BE(offset);
  }
  
  // 解析 BOOL（位）
  parseBool(buffer, byteOffset, bitOffset = 0) {
    return (buffer[byteOffset] & (1 << bitOffset)) !== 0;
  }
  
  async disconnect() {
    if (this.client) {
      this.client.Disconnect();
      this.connected = false;
      console.log('S7 连接已断开');
    }
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 使用示例
async function main() {
  const plc = new S7PlcClient('192.168.1.101', 0, 1);
  
  if (await plc.connect()) {
    try {
      // 读取 DB1 的前 20 字节
      const data = await plc.readDB(1, 0, 20);
      
      const temperature = plc.parseReal(data, 0);   // DB1.DBD0
      const pressure = plc.parseReal(data, 4);      // DB1.DBD4
      const running = plc.parseBool(data, 8, 0);    // DB1.DBX8.0
      const count = plc.parseInt(data, 10);         // DB1.DBW10
      
      console.log('温度:', temperature.toFixed(2), '°C');
      console.log('压力:', pressure.toFixed(2), 'bar');
      console.log('运行状态:', running ? '运行中' : '停止');
      console.log('计数:', count);
      
      // 写入设定值
      const setpointBuffer = Buffer.alloc(4);
      setpointBuffer.writeFloatBE(85.5, 0);
      await plc.writeDB(1, 20, setpointBuffer);  // 写入 DB1.DBD20
      console.log('设定值已更新为 85.5°C');
      
    } catch (err) {
      console.error('操作失败:', err.message);
    } finally {
      await plc.disconnect();
    }
  } else {
    console.error('无法连接到 PLC');
  }
}

main();
```

---

## 与 PLC 联调清单

### 1. PLC 侧配置（关键！）

**S7-1200/1500**：
- 打开 TIA Portal → 设备组态 → CPU 属性
- **防护与安全** → **连接机制**
- ✅ 勾选 **"允许来自远程对象的 PUT/GET 通信访问"**
- 下载配置到 PLC

**S7-300/400**：
- 检查硬件组态中的 Rack/Slot 是否正确
- 确认 CP 模块（通信处理器）已正确配置

### 2. 网络连通性测试

```bash
# Ping 测试
ping 192.168.1.101

# 端口测试（S7 默认使用 102 端口）
telnet 192.168.1.101 102
```

### 3. 常见错误码

| 错误码 | 含义 | 解决方案 |
|--------|------|---------|
| 0 | 成功 | - |
| 1 | 无效参数 | 检查 DB 号、偏移量、长度 |
| 2 | 资源不足 | 减少并发连接数 |
| 3 | 地址错误 | 检查 DB 是否存在 |
| 4 | 数据类型不匹配 | 确认读写长度与数据类型一致 |
| 5 | 尺寸错误 | 缓冲区大小与实际数据不符 |
| 7 | 未连接 | 先调用 ConnectTo |
| 0x000A0000 | 拒绝访问 | PLC 未启用 PUT/GET 权限 |

### 4. 性能优化

- **批量读取**：一次性读取连续地址，减少通信次数
- **避免频繁连接/断开**：保持长连接，定期心跳检测
- **扫描周期**：建议 ≥ 100ms，避免过快轮询

---

## 安全注意事项

1. **网络安全**：S7 协议 **无加密**，生产环境应放在 **专网 VLAN**
2. **写权限控制**：仅在必要时写入，关键参数需二次确认
3. **急停安全**：安全回路优先 **硬接线**，通信只做指示
4. **访问控制**：限制上位机 IP 白名单（在 PLC 侧配置）

---

## 与 Python 方案对比

| 场景 | 推荐方案 |
|------|---------|
| Web 后端集成 | Node.js（异步非阻塞） |
| 数据采集 + AI 分析 | Python（NumPy/Pandas） |
| 快速脚本测试 | Python（代码更简洁） |
| 高并发多设备 | Node.js（事件驱动） |

---

## 延伸阅读（站内）

- [Siemens S7：Python ↔ PLC](./s7-comm-python-plc.md)
- [Modbus TCP：Node.js ↔ PLC](./modbus-tcp-node-plc.md)
- [西门子 S7 详解与 Python 采集](../../plc/s7-python-data-collection.md)
- [常见 PLC 品牌与选型](../../plc/common-brands.md)
