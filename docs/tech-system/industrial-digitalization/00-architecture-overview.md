# 工业数字化整体架构

> **前置知识**: 建议先了解 [PLC 基础知识](../plc/common-brands.md) 和 [物联网项目学习路线](../backend/iot-project.md)

## 🎯 学习目标

本模块旨在帮助开发者基于 **RuoYi-Pro** 快速构建轻量级工业数字化系统，包含：
- **IoT 设备接入层**: PLC、传感器数据采集与协议适配
- **SCADA Lite 监控层**: 实时数据可视化、报警管理、历史趋势
- **MES Lite 业务层**: 生产计划、工单管理、质量追溯、OEE 分析

**适用场景**: 中小企业智能制造转型、设备监控系统、生产管理轻量化落地

---

## 🏗️ 系统总体架构

```
┌─────────────────────────────────────────────────────────────┐
│                     前端展示层 (Vue3 + ECharts)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ SCADA监控 │  │ MES工单  │  │ OEE分析  │  │ 报表中心  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕ WebSocket / HTTP
┌─────────────────────────────────────────────────────────────┐
│                   业务应用层 (RuoYi-Pro)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ 设备管理  │  │ 生产管理  │  │ 质量管理  │  │ 系统管理  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                  数据处理层 (Spring Boot)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Netty服务 │  │ MQTT Broker│ │ 规则引擎  │  │ 告警引擎  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    数据存储层                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  MySQL   │  │  Redis   │  │ TDengine │  │ MinIO    │   │
│  │(业务数据) │  │ (缓存)   │  │(时序数据) │  │ (文件)   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                   设备接入层                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Modbus TCP│  │ Siemens S7│  │  OPC UA  │  │  MQTT    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                   物理设备层                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  PLC     │  │ 传感器   │  │  CNC     │  │ 机器人   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 技术选型

### 后端技术栈

| 组件 | 技术选型 | 说明 |
|------|---------|------|
| **基础框架** | RuoYi-Pro (Spring Boot 3.x) | 快速开发脚手架，集成权限、代码生成 |
| **通信协议** | Netty + MQTT (EMQX/Mosquitto) | 高性能 TCP 长连接 + 消息队列 |
| **时序数据库** | TDengine / InfluxDB | 存储海量设备采集数据 |
| **关系数据库** | MySQL 8.0 | 业务数据（设备、工单、用户） |
| **缓存** | Redis 7.x | 实时数据缓存、会话管理 |
| **文件存储** | MinIO | 存储工艺图纸、质检图片 |

### 前端技术栈

| 组件 | 技术选型 | 说明 |
|------|---------|------|
| **框架** | Vue 3 + TypeScript | RuoYi-Vue3 前端框架 |
| **UI 库** | Element Plus | 企业级组件库 |
| **图表** | ECharts 5.x | 实时曲线、柱状图、仪表盘 |
| **组态** | SVG + Canvas / AntV X6 | SCADA 画面绘制 |
| **状态管理** | Pinia | 全局状态管理 |

### 部署架构

```
┌──────────────────────────────────────┐
│         Nginx (反向代理 + 负载均衡)   │
└──────────────────────────────────────┘
           ↙              ↘
┌─────────────────┐  ┌─────────────────┐
│  RuoYi-Pro App  │  │  Netty Gateway  │
│  (Spring Boot)  │  │  (TCP/MQTT)     │
└─────────────────┘  └─────────────────┘
           ↙              ↘
┌──────────────────────────────────────┐
│   Docker Compose / K8s 编排          │
│   MySQL + Redis + TDengine + EMQX    │
└──────────────────────────────────────┘
```

---

## 📋 核心功能模块

### 1️⃣ IoT 设备接入层

**目标**: 实现多协议设备统一接入与数据采集

**关键能力**:
- ✅ **协议适配**: Modbus TCP、Siemens S7、OPC UA、MQTT
- ✅ **边缘计算**: 数据清洗、异常过滤、单位转换
- ✅ **断点续传**: 网络异常时本地缓存，恢复后补传
- ✅ **设备影子**: 维护设备最新状态快照

**技术实现**:
```java
// 示例：Netty 处理 Modbus TCP 连接
@ChannelHandler.Sharable
public class ModbusTcpHandler extends SimpleChannelInboundHandler<ByteBuf> {
    
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) {
        // 1. 解析 Modbus 报文
        ModbusRequest request = ModbusParser.parse(msg);
        
        // 2. 读取 PLC 寄存器数据
        short[] registers = plcClient.readHoldingRegisters(
            request.getSlaveId(), 
            request.getStartAddress(), 
            request.getLength()
        );
        
        // 3. 转换为业务数据模型
        DeviceData deviceData = convertToBusinessModel(registers);
        
        // 4. 发布到 MQTT Topic
        mqttPublisher.publish("device/" + deviceData.getDeviceId(), deviceData);
        
        // 5. 写入时序数据库
        tdengineService.insert(deviceData);
    }
}
```

---

### 2️⃣ SCADA Lite 监控层

**目标**: 提供实时数据可视化与报警管理

**关键能力**:
- ✅ **实时监控**: WebSocket 推送设备状态（1秒刷新）
- ✅ **历史趋势**: 查询 TDengine 时序数据，绘制曲线图
- ✅ **报警管理**: 阈值判断、分级告警、通知推送（短信/邮件）
- ✅ **组态画面**: SVG 绘制工艺流程图，绑定实时数据

**技术实现**:
```javascript
// 前端：WebSocket 接收实时数据
const ws = new WebSocket('ws://localhost:8080/ws/device');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  // 更新设备状态
  updateDeviceStatus(data.deviceId, data.status);
  
  // 更新实时曲线
  echartsInstance.setOption({
    series: [{
      data: [...historyData, { value: [data.timestamp, data.temperature] }]
    }]
  });
  
  // 触发报警
  if (data.temperature > 80) {
    ElNotification.warning({
      title: '温度告警',
      message: `设备 ${data.deviceName} 温度过高: ${data.temperature}°C`
    });
  }
};
```

---

### 3️⃣ MES Lite 业务层

**目标**: 实现轻量级生产管理核心功能

**关键能力**:
- ✅ **生产计划**: 工单创建、排产调度、进度跟踪
- ✅ **工艺路线**: 工序定义、标准工时、SOP 文档
- ✅ **质量追溯**: 质检记录、不良品分析、SPC 统计
- ✅ **OEE 分析**: 设备综合效率计算（可用率 × 性能率 × 合格率）

**核心算法 - OEE 计算**:
```java
/**
 * 计算设备 OEE (Overall Equipment Effectiveness)
 */
public class OEECalculator {
    
    public OEEResult calculate(String deviceId, LocalDate date) {
        // 1. 可用率 = 运行时间 / 计划生产时间
        double availability = calculateAvailability(deviceId, date);
        
        // 2. 性能率 = (理论周期 × 总产量) / 运行时间
        double performance = calculatePerformance(deviceId, date);
        
        // 3. 合格率 = 合格品数量 / 总产量
        double quality = calculateQuality(deviceId, date);
        
        // 4. OEE = 可用率 × 性能率 × 合格率
        double oee = availability * performance * quality;
        
        return new OEEResult(availability, performance, quality, oee);
    }
    
    private double calculateAvailability(String deviceId, LocalDate date) {
        // 从 TDengine 查询设备运行时长
        long runningTime = tdengineService.queryRunningTime(deviceId, date);
        long plannedTime = getPlannedProductionTime(deviceId, date);
        return (double) runningTime / plannedTime;
    }
}
```

---

## 🚀 快速开始

### 环境准备

```bash
# 1. 安装 JDK 17+
java -version

# 2. 安装 Docker & Docker Compose
docker --version
docker-compose --version

# 3. 克隆 RuoYi-Pro 项目
git clone https://gitee.com/JavaLionLi/RuoYi-Vue-Plus.git
cd RuoYi-Vue-Plus
```

### 启动基础服务

```yaml
# docker-compose.yml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: ry_plus
    ports:
      - "3306:3306"
    volumes:
      - ./sql:/docker-entrypoint-initdb.d

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  tdengine:
    image: tdengine/tdengine:3.0
    ports:
      - "6030:6030"
      - "6041:6041"

  emqx:
    image: emqx/emqx:5.0
    ports:
      - "1883:1883"   # MQTT
      - "8083:8083"   # WebSocket
      - "18083:18083" # Dashboard
```

```bash
# 启动服务
docker-compose up -d

# 初始化数据库
mysql -uroot -proot123 ry_plus < sql/ry_plus.sql

# 启动后端
cd ruoyi-admin
mvn spring-boot:run

# 启动前端
cd ruoyi-ui
npm install
npm run dev
```

---

## 📚 学习路径建议

按照以下顺序逐步深入：

1. **[01-设备接入与数据采集](./01-device-access.md)** - 理解 PLC 通信协议、Netty 服务端开发
2. **[02-数据平台设计](./02-data-platform.md)** - 掌握时序数据库选型与优化
3. **[03-实时系统设计](./03-realtime-system.md)** - 学习 WebSocket 推送与高性能通信
4. **[04-工业可视化](./04-scada-visualization.md)** - 实现 SCADA 组态画面与实时监控
5. **[05-业务抽象设计](./05-business-abstract.md)** 🔥 - 核心！理解设备模型、工单流程、OEE 计算
6. **[06-轻量MES实现](./06-mes-lite.md)** - 落地生产计划、质量管理、物料追溯
7. **[07-完整系统设计](./07-full-system.md)** - RuoYi-Pro 集成实战与部署优化

---

## 💡 最佳实践

### 1. 数据采集频率控制

```java
// 避免高频采集导致数据库压力
@Component
public class DataCollector {
    
    @Scheduled(fixedRate = 1000) // 每秒采集一次
    public void collectData() {
        List<Device> devices = deviceService.getAllEnabledDevices();
        
        devices.parallelStream().forEach(device -> {
            try {
                // 根据设备类型选择不同采集策略
                DeviceData data = collectByProtocol(device);
                
                // 数据去重：仅当值变化时才入库
                if (hasValueChanged(device.getId(), data)) {
                    tdengineService.insert(data);
                    websocketService.push(device.getId(), data);
                }
            } catch (Exception e) {
                log.error("采集设备 {} 数据失败", device.getName(), e);
            }
        });
    }
}
```

### 2. 报警防抖机制

```java
// 避免同一报警频繁触发
public class AlarmDebouncer {
    
    private final Map<String, Long> lastAlarmTime = new ConcurrentHashMap<>();
    private static final long DEBOUNCE_INTERVAL = 300_000; // 5分钟
    
    public boolean shouldTriggerAlarm(String deviceId, String alarmType) {
        String key = deviceId + ":" + alarmType;
        long now = System.currentTimeMillis();
        
        Long lastTime = lastAlarmTime.get(key);
        if (lastTime != null && (now - lastTime) < DEBOUNCE_INTERVAL) {
            return false; // 在防抖期内，不触发
        }
        
        lastAlarmTime.put(key, now);
        return true;
    }
}
```

### 3. 时序数据分区策略

```sql
-- TDengine 超级表设计
CREATE STABLE device_data (
    ts TIMESTAMP,
    temperature FLOAT,
    pressure FLOAT,
    status INT
) TAGS (
    device_id VARCHAR(50),
    factory VARCHAR(20)
);

-- 自动按月分区
CREATE TABLE device_data_2024_01 USING device_data TAGS ('device_001', 'factory_a');
```

---

## 🔗 相关资源

- [RuoYi-Pro 官方文档](https://plus-doc.dromara.org/)
- [TDengine 时序数据库](https://docs.taosdata.com/)
- [Netty 权威指南](https://github.com/netty/netty)
- [EMQX MQTT Broker](https://www.emqx.io/)

---

**下一步**: 深入学习 [01-设备接入与数据采集](./01-device-access.md)，掌握 PLC 通信协议与 Netty 服务端开发。
