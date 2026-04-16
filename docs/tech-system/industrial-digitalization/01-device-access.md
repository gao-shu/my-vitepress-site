# 01-设备接入与数据采集

> **前置知识**: [常见 PLC 品牌与选型](../plc/common-brands.md) | [Modbus TCP 通信](../integration/modbus-tcp-node-plc.md) | [Siemens S7 协议](../plc/s7-python-data-collection.md)

## 🎯 学习目标

掌握工业设备数据采集的核心技术：
- ✅ 理解主流工业通信协议（Modbus TCP、S7、OPC UA、MQTT）
- ✅ 使用 Netty 构建高性能 TCP 服务端
- ✅ 实现多协议适配层，统一数据模型
- ✅ 边缘计算：数据清洗、异常过滤、断点续传

---

## 📡 工业通信协议对比

| 协议 | 应用场景 | 传输层 | 特点 | 适用设备 |
|------|---------|--------|------|---------|
| **Modbus TCP** | 通用传感器、仪表 | TCP 502 | 简单、开放、广泛支持 | 温湿度传感器、流量计 |
| **Siemens S7** | 西门子 PLC | TCP 102 | 高效、专有协议 | S7-200/300/400/1200/1500 |
| **OPC UA** | 跨平台设备互联 | TCP 4840 | 安全、标准化、复杂 | CNC、机器人、高端设备 |
| **MQTT** | IoT 设备上报 | TCP 1883 | 轻量、发布订阅、云原生 | 智能网关、边缘盒子 |

---

## 🔌 协议一：Modbus TCP 接入

### 1.1 协议原理

Modbus TCP 基于主从架构，报文结构：

```
┌─────────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ Transaction │ Protocol │ Length   │ Unit ID  │ Function │ Data     │
│ Identifier  │ ID       │          │          │ Code     │          │
│ (2 bytes)   │(2 bytes) │(2 bytes) │(1 byte)  │(1 byte)  │(N bytes) │
└─────────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

**常用功能码**:
- `0x03`: 读保持寄存器 (Read Holding Registers)
- `0x04`: 读输入寄存器 (Read Input Registers)
- `0x06`: 写单个寄存器 (Write Single Register)
- `0x10`: 写多个寄存器 (Write Multiple Registers)

### 1.2 Netty 实现 Modbus TCP 客户端

```java
@Component
@Slf4j
public class ModbusTcpClient {
    
    private EventLoopGroup group;
    private Bootstrap bootstrap;
    
    @PostConstruct
    public void init() {
        group = new NioEventLoopGroup();
        bootstrap = new Bootstrap();
        bootstrap.group(group)
                .channel(NioSocketChannel.class)
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
                .handler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        ch.pipeline().addLast(new ModbusTcpDecoder());
                        ch.pipeline().addLast(new ModbusTcpEncoder());
                        ch.pipeline().addLast(new ModbusResponseHandler());
                    }
                });
    }
    
    /**
     * 读取保持寄存器
     * @param ip PLC IP 地址
     * @param port 端口（默认 502）
     * @param slaveId 从站 ID
     * @param startAddress 起始地址
     * @param length 寄存器数量
     */
    public CompletableFuture<short[]> readHoldingRegisters(
            String ip, int port, int slaveId, 
            int startAddress, int length) {
        
        CompletableFuture<short[]> future = new CompletableFuture<>();
        
        bootstrap.connect(ip, port).addListener((ChannelFutureListener) cf -> {
            if (cf.isSuccess()) {
                Channel channel = cf.channel();
                
                // 构建 Modbus 请求报文
                ByteBuf request = buildReadRequest(slaveId, startAddress, length);
                channel.writeAndFlush(request);
                
                // 存储 future 供响应处理器使用
                ModbusContext.setFuture(channel.id(), future);
                
                // 5秒超时
                future.orTimeout(5, TimeUnit.SECONDS);
            } else {
                future.completeExceptionally(cf.cause());
            }
        });
        
        return future;
    }
    
    private ByteBuf buildReadRequest(int slaveId, int startAddress, int length) {
        ByteBuf buf = Unpooled.buffer(12);
        
        // Transaction ID (随机生成)
        buf.writeShort(ThreadLocalRandom.current().nextInt(0, 65535));
        // Protocol ID (固定为 0)
        buf.writeShort(0);
        // Length (后续字节长度)
        buf.writeShort(6);
        // Unit ID (从站 ID)
        buf.writeByte(slaveId);
        // Function Code (0x03 = 读保持寄存器)
        buf.writeByte(0x03);
        // Start Address
        buf.writeShort(startAddress);
        // Quantity
        buf.writeShort(length);
        
        return buf;
    }
}
```

### 1.3 响应处理器

```java
@ChannelHandler.Sharable
@Slf4j
public class ModbusResponseHandler extends SimpleChannelInboundHandler<ByteBuf> {
    
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) {
        // 解析响应报文
        int transactionId = msg.readUnsignedShort();
        int protocolId = msg.readUnsignedShort();
        int length = msg.readUnsignedShort();
        int unitId = msg.readUnsignedByte();
        int functionCode = msg.readUnsignedByte();
        
        if (functionCode > 0x80) {
            // 错误响应
            int errorCode = msg.readUnsignedByte();
            log.error("Modbus 错误: 功能码={}, 错误码={}", functionCode - 0x80, errorCode);
            return;
        }
        
        // 正常响应：读取数据
        int byteCount = msg.readUnsignedByte();
        short[] registers = new short[byteCount / 2];
        
        for (int i = 0; i < registers.length; i++) {
            registers[i] = msg.readShort();
        }
        
        // 完成 Future
        CompletableFuture<short[]> future = ModbusContext.getFuture(ctx.channel().id());
        if (future != null) {
            future.complete(registers);
        }
    }
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        log.error("Modbus 通信异常", cause);
        ctx.close();
    }
}
```

---

## 🔌 协议二：Siemens S7 接入

### 2.1 S7 协议特点

西门子 S7 协议是专有协议，相比 Modbus：
- ✅ **更高效**: 二进制编码，报文更小
- ✅ **功能更强**: 支持位、字节、字、双字多种数据类型
- ❌ **复杂性高**: 需要处理连接建立、PDU 协商等

### 2.2 使用 Snap7 库（推荐）

对于 Java 项目，推荐使用 **Snap7** 的 Java 封装：

```xml
<!-- pom.xml -->
<dependency>
    <groupId>com.github.s7connector</groupId>
    <artifactId>s7connector</artifactId>
    <version>2.1</version>
</dependency>
```

```java
@Component
@Slf4j
public class SiemensS7Client {
    
    private S7Connector connector;
    
    /**
     * 连接 PLC
     */
    public void connect(String ip, int rack, int slot) {
        connector = S7ConnectorFactory
            .buildTCPConnector()
            .withHost(ip)
            .withRack(rack)      // 机架号（通常 0）
            .withSlot(slot)      // 槽号（CPU 所在槽，通常 1）
            .build();
        
        log.info("成功连接到西门子 PLC: {}:{}", ip, 102);
    }
    
    /**
     * 读取 DB 块数据
     * @param dbNumber DB 块编号
     * @param start 起始字节偏移
     * @param size 读取字节数
     */
    public byte[] readDB(int dbNumber, int start, int size) {
        return connector.read(DaveArea.DB, dbNumber, size, start);
    }
    
    /**
     * 写入 DB 块数据
     */
    public void writeDB(int dbNumber, int start, byte[] data) {
        connector.write(DaveArea.DB, dbNumber, start, data);
    }
    
    /**
     * 读取 M 区（标志位）
     */
    public boolean readMBit(int byteOffset, int bitOffset) {
        byte[] data = connector.read(DaveArea.MK, 0, 1, byteOffset);
        return (data[0] & (1 << bitOffset)) != 0;
    }
    
    @PreDestroy
    public void disconnect() {
        if (connector != null) {
            connector.close();
        }
    }
}
```

### 2.3 数据解析示例

```java
/**
 * 解析 PLC 数据为业务对象
 */
@Data
public class MachineStatus {
    private String deviceId;
    private LocalDateTime timestamp;
    private boolean running;        // M0.0 - 运行状态
    private int cycleTime;          // DB1.DBD0 - 节拍时间(ms)
    private int productCount;       // DB1.DBD4 - 产量计数
    private float temperature;      // DB1.DBD8 - 温度
    private short errorCode;        // DB1.DBW12 - 错误代码
}

@Service
public class MachineDataService {
    
    @Autowired
    private SiemensS7Client s7Client;
    
    public MachineStatus readMachineStatus(String deviceId) {
        MachineStatus status = new MachineStatus();
        status.setDeviceId(deviceId);
        status.setTimestamp(LocalDateTime.now());
        
        // 读取 M0.0 - 运行状态
        status.setRunning(s7Client.readMBit(0, 0));
        
        // 读取 DB1 块数据
        byte[] dbData = s7Client.readDB(1, 0, 16);
        
        // 解析数据（注意字节序：西门子为大端）
        ByteBuffer buffer = ByteBuffer.wrap(dbData);
        buffer.order(ByteOrder.BIG_ENDIAN);
        
        status.setCycleTime(buffer.getInt());    // DBD0
        status.setProductCount(buffer.getInt()); // DBD4
        status.setTemperature(buffer.getFloat()); // DBD8
        status.setErrorCode(buffer.getShort());   // DBW12
        
        return status;
    }
}
```

---

## 🔌 协议三：MQTT 设备上报

### 3.1 为什么需要 MQTT？

对于远程设备或智能网关，MQTT 是最佳选择：
- ✅ **轻量级**: 报文头最小仅 2 字节
- ✅ **异步解耦**: 发布订阅模式，设备无需知道服务端地址
- ✅ **QoS 保障**: 支持消息确认机制
- ✅ **云原生友好**: 易于对接云平台

### 3.2 集成 EMQX Broker

```yaml
# docker-compose.yml
services:
  emqx:
    image: emqx/emqx:5.0
    ports:
      - "1883:1883"   # MQTT TCP
      - "8083:8083"   # MQTT WebSocket
      - "18083:18083" # Dashboard
    environment:
      EMQX_DASHBOARD__DEFAULT_USERNAME: admin
      EMQX_DASHBOARD__DEFAULT_PASSWORD: public
```

### 3.3 Spring Boot 集成 MQTT

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.integration</groupId>
    <artifactId>spring-integration-mqtt</artifactId>
</dependency>
```

```java
@Configuration
public class MqttConfig {
    
    @Value("${mqtt.broker-url:tcp://localhost:1883}")
    private String brokerUrl;
    
    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[]{brokerUrl});
        options.setCleanSession(true);
        options.setAutomaticReconnect(true);
        factory.setConnectionOptions(options);
        return factory;
    }
    
    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }
    
    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler mqttMessageHandler() {
        return message -> {
            String topic = message.getHeaders().get("mqtt_receivedTopic", String.class);
            String payload = (String) message.getPayload();
            
            log.info("收到 MQTT 消息 - Topic: {}, Payload: {}", topic, payload);
            
            // 处理设备数据
            deviceDataService.handleMqttMessage(topic, payload);
        };
    }
    
    @Bean
    public MessageProducerSupport mqttInbound() {
        MqttPahoMessageDrivenChannelAdapter adapter = 
            new MqttPahoMessageDrivenChannelAdapter(
                "consumer-client", 
                mqttClientFactory(), 
                "device/+/data"  // 订阅所有设备的数据主题
            );
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }
}
```

### 3.4 设备端模拟（Python）

```python
import paho.mqtt.client as mqtt
import json
import time
import random

BROKER = "localhost"
PORT = 1883
DEVICE_ID = "device_001"

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")

client = mqtt.Client()
client.on_connect = on_connect
client.connect(BROKER, PORT, 60)
client.loop_start()

try:
    while True:
        # 模拟设备数据
        data = {
            "deviceId": DEVICE_ID,
            "timestamp": int(time.time() * 1000),
            "temperature": round(random.uniform(20, 80), 2),
            "pressure": round(random.uniform(0.5, 1.5), 3),
            "status": random.choice(["running", "idle", "alarm"])
        }
        
        # 发布到 MQTT
        topic = f"device/{DEVICE_ID}/data"
        client.publish(topic, json.dumps(data), qos=1)
        print(f"Published: {data}")
        
        time.sleep(2)  # 每 2 秒上报一次
        
except KeyboardInterrupt:
    client.loop_stop()
    client.disconnect()
```

---

## 🔄 统一数据模型设计

### 4.1 设备数据抽象

无论使用哪种协议，最终都转换为统一的业务模型：

```java
@Data
@Builder
public class DeviceData {
    
    /** 设备唯一标识 */
    private String deviceId;
    
    /** 采集时间戳 */
    private LocalDateTime collectTime;
    
    /** 数据点列表 */
    private List<DataPoint> dataPoints;
    
    /** 设备状态 */
    private DeviceStatus status;
    
    @Data
    @Builder
    public static class DataPoint {
        /** 测点名称（如：temperature、pressure） */
        private String pointName;
        
        /** 测点值 */
        private Object value;
        
        /** 数据类型 */
        private DataType dataType;
        
        /** 单位 */
        private String unit;
    }
    
    public enum DeviceStatus {
        ONLINE, OFFLINE, ALARM, MAINTENANCE
    }
    
    public enum DataType {
        INTEGER, FLOAT, BOOLEAN, STRING
    }
}
```

### 4.2 协议适配器模式

```java
/**
 * 协议适配器接口
 */
public interface ProtocolAdapter {
    
    /**
     * 采集设备数据
     */
    DeviceData collect(DeviceConfig config);
    
    /**
     * 支持的协议类型
     */
    ProtocolType getProtocolType();
}

/**
 * Modbus TCP 适配器
 */
@Component
@Slf4j
public class ModbusAdapter implements ProtocolAdapter {
    
    @Autowired
    private ModbusTcpClient modbusClient;
    
    @Override
    public DeviceData collect(DeviceConfig config) {
        try {
            // 读取寄存器
            short[] registers = modbusClient.readHoldingRegisters(
                config.getIp(), 
                config.getPort(),
                config.getSlaveId(),
                config.getStartAddress(),
                config.getLength()
            ).get(5, TimeUnit.SECONDS);
            
            // 转换为统一数据模型
            return convertToDeviceData(config, registers);
            
        } catch (Exception e) {
            log.error("Modbus 采集失败: {}", config.getDeviceId(), e);
            throw new DeviceCollectException("采集失败", e);
        }
    }
    
    @Override
    public ProtocolType getProtocolType() {
        return ProtocolType.MODBUS_TCP;
    }
    
    private DeviceData convertToDeviceData(DeviceConfig config, short[] registers) {
        List<DeviceData.DataPoint> points = new ArrayList<>();
        
        // 根据配置映射寄存器到业务测点
        for (PointMapping mapping : config.getPointMappings()) {
            short rawValue = registers[mapping.getRegisterIndex()];
            Object convertedValue = applyConversion(rawValue, mapping);
            
            points.add(DeviceData.DataPoint.builder()
                .pointName(mapping.getPointName())
                .value(convertedValue)
                .dataType(mapping.getDataType())
                .unit(mapping.getUnit())
                .build());
        }
        
        return DeviceData.builder()
            .deviceId(config.getDeviceId())
            .collectTime(LocalDateTime.now())
            .dataPoints(points)
            .status(DeviceData.DeviceStatus.ONLINE)
            .build();
    }
}

/**
 * S7 适配器
 */
@Component
public class S7Adapter implements ProtocolAdapter {
    
    @Autowired
    private SiemensS7Client s7Client;
    
    @Override
    public DeviceData collect(DeviceConfig config) {
        // 类似实现...
        return null;
    }
    
    @Override
    public ProtocolType getProtocolType() {
        return ProtocolType.SIEMENS_S7;
    }
}

/**
 * 策略工厂：根据协议类型选择适配器
 */
@Component
public class ProtocolAdapterFactory {
    
    private final Map<ProtocolType, ProtocolAdapter> adapters;
    
    public ProtocolAdapterFactory(List<ProtocolAdapter> adapterList) {
        this.adapters = adapterList.stream()
            .collect(Collectors.toMap(
                ProtocolAdapter::getProtocolType, 
                adapter -> adapter
            ));
    }
    
    public ProtocolAdapter getAdapter(ProtocolType protocolType) {
        ProtocolAdapter adapter = adapters.get(protocolType);
        if (adapter == null) {
            throw new IllegalArgumentException("不支持的协议类型: " + protocolType);
        }
        return adapter;
    }
}
```

---

## ⚙️ 边缘计算与数据清洗

### 5.1 数据去重与防抖

```java
@Component
@Slf4j
public class DataDeduplicationService {
    
    /** 缓存最近一次的数据值 */
    private final Map<String, Object> lastValues = new ConcurrentHashMap<>();
    
    /** 防抖时间窗口（毫秒） */
    private static final long DEBOUNCE_WINDOW = 1000;
    
    /** 最后更新时间 */
    private final Map<String, Long> lastUpdateTimes = new ConcurrentHashMap<>();
    
    /**
     * 判断是否需要入库
     */
    public boolean shouldPersist(String deviceId, String pointName, Object newValue) {
        String key = deviceId + ":" + pointName;
        long now = System.currentTimeMillis();
        
        Object lastValue = lastValues.get(key);
        Long lastTime = lastUpdateTimes.get(key);
        
        // 首次采集，直接入库
        if (lastValue == null) {
            updateCache(key, newValue, now);
            return true;
        }
        
        // 防抖：在时间窗口内忽略相同值
        if (lastTime != null && (now - lastTime) < DEBOUNCE_WINDOW) {
            if (Objects.equals(lastValue, newValue)) {
                return false; // 值未变化且在防抖期内
            }
        }
        
        // 值发生变化，入库
        updateCache(key, newValue, now);
        return true;
    }
    
    private void updateCache(String key, Object value, long time) {
        lastValues.put(key, value);
        lastUpdateTimes.put(key, time);
    }
}
```

### 5.2 异常值过滤

```java
@Component
public class DataValidationService {
    
    /**
     * 验证数据是否在合理范围内
     */
    public boolean isValid(DataPoint point, ValidationRule rule) {
        if (point.getValue() == null) {
            return false;
        }
        
        double value = convertToDouble(point.getValue());
        
        // 范围检查
        if (value < rule.getMinValue() || value > rule.getMaxValue()) {
            log.warn("数据超出范围: {}={}, 范围=[{}, {}]", 
                point.getPointName(), value, rule.getMinValue(), rule.getMaxValue());
            return false;
        }
        
        // 变化率检查（防止跳变）
        if (rule.getMaxChangeRate() > 0) {
            double lastValue = getLastValue(point.getPointName());
            double changeRate = Math.abs(value - lastValue) / lastValue;
            
            if (changeRate > rule.getMaxChangeRate()) {
                log.warn("数据变化率过大: {}={}, 变化率={}", 
                    point.getPointName(), value, changeRate);
                return false;
            }
        }
        
        return true;
    }
}
```

### 5.3 断点续传机制

```java
@Component
@Slf4j
public class OfflineBufferService {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    private static final String BUFFER_KEY_PREFIX = "device:buffer:";
    private static final int MAX_BUFFER_SIZE = 1000;
    
    /**
     * 网络异常时，缓存到 Redis
     */
    public void bufferData(String deviceId, DeviceData data) {
        String key = BUFFER_KEY_PREFIX + deviceId;
        String jsonData = JSON.toJSONString(data);
        
        // 使用 List 存储离线数据
        redisTemplate.opsForList().leftPush(key, jsonData);
        
        // 限制缓冲区大小
        redisTemplate.opsForList().trim(key, 0, MAX_BUFFER_SIZE - 1);
        
        log.warn("设备 {} 离线，数据已缓存，当前缓冲条数: {}", 
            deviceId, redisTemplate.opsForList().size(key));
    }
    
    /**
     * 网络恢复后，批量上传
     */
    @Async
    public void flushBuffer(String deviceId) {
        String key = BUFFER_KEY_PREFIX + deviceId;
        
        List<String> bufferedData = redisTemplate.opsForList().range(key, 0, -1);
        if (bufferedData == null || bufferedData.isEmpty()) {
            return;
        }
        
        log.info("开始上传设备 {} 的 {} 条离线数据", deviceId, bufferedData.size());
        
        for (String jsonData : bufferedData) {
            try {
                DeviceData data = JSON.parseObject(jsonData, DeviceData.class);
                
                // 写入时序数据库
                tdengineService.insert(data);
                
            } catch (Exception e) {
                log.error("上传离线数据失败", e);
                break; // 遇到错误则停止，下次继续
            }
        }
        
        // 清空缓冲区
        redisTemplate.delete(key);
        log.info("设备 {} 离线数据上传完成", deviceId);
    }
}
```

---

## 📊 定时采集任务

### 6.1 基于 Spring Schedule

```java
@Component
@Slf4j
public class DeviceDataCollector {
    
    @Autowired
    private DeviceService deviceService;
    
    @Autowired
    private ProtocolAdapterFactory adapterFactory;
    
    @Autowired
    private DataDeduplicationService deduplicationService;
    
    @Autowired
    private TDengineService tdengineService;
    
    @Autowired
    private WebSocketService webSocketService;
    
    /**
     * 每秒执行一次采集
     */
    @Scheduled(fixedRate = 1000)
    public void collectAllDevices() {
        List<Device> devices = deviceService.getAllEnabledDevices();
        
        // 并行采集（注意控制并发数）
        devices.parallelStream().forEach(device -> {
            try {
                collectSingleDevice(device);
            } catch (Exception e) {
                log.error("采集设备 {} 失败", device.getName(), e);
            }
        });
    }
    
    private void collectSingleDevice(Device device) {
        // 1. 获取协议适配器
        ProtocolAdapter adapter = adapterFactory.getAdapter(device.getProtocolType());
        
        // 2. 采集原始数据
        DeviceData rawData = adapter.collect(device.getConfig());
        
        // 3. 数据去重
        for (DeviceData.DataPoint point : rawData.getDataPoints()) {
            if (!deduplicationService.shouldPersist(
                    device.getId(), 
                    point.getPointName(), 
                    point.getValue())) {
                continue;
            }
            
            // 4. 写入时序数据库
            tdengineService.insert(device.getId(), point);
            
            // 5. WebSocket 推送前端
            webSocketService.push(device.getId(), point);
        }
    }
}
```

---

## 🧪 测试与调试

### 7.1 Modbus 模拟器

使用 **Modbus Slave** 工具模拟 PLC：

1. 下载 [Modbus Slave](https://www.modbustools.com/modbus_slave.html)
2. 设置连接方式：Modbus TCP
3. 配置保持寄存器（Holding Registers）
4. 填写测试数据

### 7.2 Postman 测试接口

```http
POST http://localhost:8080/api/device/test-connect
Content-Type: application/json

{
  "deviceId": "test_001",
  "protocol": "MODBUS_TCP",
  "ip": "192.168.1.100",
  "port": 502,
  "slaveId": 1
}
```

---

## 💡 最佳实践

### 1. 连接池管理

```java
@Component
public class PlcConnectionPool {
    
    private final Map<String, ModbusTcpClient> connectionPool = new ConcurrentHashMap<>();
    private static final int MAX_POOL_SIZE = 50;
    
    public ModbusTcpClient getConnection(String deviceKey) {
        return connectionPool.computeIfAbsent(deviceKey, key -> {
            if (connectionPool.size() >= MAX_POOL_SIZE) {
                throw new IllegalStateException("连接池已满");
            }
            return new ModbusTcpClient();
        });
    }
    
    public void releaseConnection(String deviceKey) {
        ModbusTcpClient client = connectionPool.remove(deviceKey);
        if (client != null) {
            client.close();
        }
    }
}
```

### 2. 心跳检测

```java
@Component
public class DeviceHeartbeatMonitor {
    
    @Scheduled(fixedRate = 10000) // 每 10 秒检查一次
    public void checkHeartbeat() {
        List<Device> devices = deviceService.getAllEnabledDevices();
        
        for (Device device : devices) {
            long lastCollectTime = device.getLastCollectTime();
            long now = System.currentTimeMillis();
            
            if (now - lastCollectTime > 30000) { // 超过 30 秒未采集
                device.setStatus(DeviceStatus.OFFLINE);
                deviceService.updateStatus(device);
                
                // 发送告警
                alarmService.triggerAlarm(device.getId(), "设备离线");
            }
        }
    }
}
```

---

## 🔗 相关资源

- [Netty 官方文档](https://netty.io/wiki/user-guide-for-4.x.html)
- [Modbus 协议规范](https://modbus.org/docs/Modbus_over_serial_line_V1_02.pdf)
- [Snap7 Java 库](https://github.com/s7connector/s7connector)
- [EMQX MQTT Broker](https://www.emqx.io/)

---

**下一步**: 学习 [02-数据平台设计](./02-data-platform.md)，掌握时序数据库选型与优化策略。
