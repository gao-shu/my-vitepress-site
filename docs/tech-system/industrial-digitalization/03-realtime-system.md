# 03-实时系统设计

> **前置知识**: [01-设备接入与数据采集](./01-device-access.md) | [02-数据平台设计](./02-data-platform.md)

## 🎯 学习目标

掌握工业实时系统的核心技术：
- ✅ WebSocket 双向通信实现
- ✅ Netty 高性能网关设计
- ✅ 实时告警引擎（阈值判断、防抖、分级）
- ✅ 前端实时数据刷新策略
- ✅ 消息推送可靠性保障

---

## 📡 实时通信方案对比

| 方案 | 延迟 | 双向通信 | 浏览器支持 | 适用场景 |
|------|------|---------|-----------|---------|
| **WebSocket** | ⭐⭐⭐⭐⭐ | ✅ | ✅ 现代浏览器 | 实时监控、SCADA |
| **SSE** | ⭐⭐⭐⭐ | ❌ 单向 | ✅ 现代浏览器 | 服务端推送通知 |
| **Long Polling** | ⭐⭐ | ✅ | ✅ 所有浏览器 | 兼容旧浏览器 |
| **MQTT over WS** | ⭐⭐⭐⭐⭐ | ✅ | ✅ 需库支持 | IoT 设备管理 |

**推荐**: **WebSocket**（低延迟 + 双向通信 + 广泛支持）

---

## 🔌 WebSocket 实现

### 1. Spring Boot 集成 WebSocket

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

### 2. WebSocket 配置类

```java
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    
    @Autowired
    private DeviceDataWebSocketHandler webSocketHandler;
    
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler, "/ws/device")
                .setAllowedOrigins("*");  // 生产环境应限制域名
        
        // 支持 SockJS 降级（兼容旧浏览器）
        registry.addHandler(webSocketHandler, "/ws/device-sockjs")
                .withSockJS();
    }
}
```

### 3. WebSocket 处理器

```java
@Component
@Slf4j
@ChannelHandler.Sharable
public class DeviceDataWebSocketHandler extends TextWebSocketHandler {
    
    /** 存储会话：deviceId -> Session */
    private final Map<String, WebSocketSession> sessionMap = new ConcurrentHashMap<>();
    
    /** 订阅关系：deviceId -> Set<Session> */
    private final Map<String, Set<WebSocketSession>> subscriptions = new ConcurrentHashMap<>();
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("WebSocket 连接建立: {}", session.getId());
        
        // 从 URL 参数中获取设备 ID
        String deviceId = getDeviceIdFromSession(session);
        
        if (deviceId != null) {
            // 注册会话
            sessionMap.put(session.getId(), session);
            
            // 添加订阅
            subscriptions.computeIfAbsent(deviceId, k -> ConcurrentHashMap.newKeySet())
                        .add(session);
            
            log.info("设备 {} 订阅成功，当前订阅数: {}", 
                deviceId, subscriptions.get(deviceId).size());
            
            // 发送欢迎消息
            sendTextMessage(session, JSON.toJSONString(Map.of(
                "type", "welcome",
                "message", "连接成功",
                "deviceId", deviceId
            )));
        } else {
            session.close(CloseStatus.BAD_DATA);
        }
    }
    
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            // 解析客户端消息
            Map<String, Object> msg = JSON.parseObject(message.getPayload(), Map.class);
            String action = (String) msg.get("action");
            
            switch (action) {
                case "subscribe":
                    // 订阅设备
                    String deviceId = (String) msg.get("deviceId");
                    subscribeDevice(session, deviceId);
                    break;
                    
                case "unsubscribe":
                    // 取消订阅
                    deviceId = (String) msg.get("deviceId");
                    unsubscribeDevice(session, deviceId);
                    break;
                    
                default:
                    log.warn("未知操作: {}", action);
            }
            
        } catch (Exception e) {
            log.error("处理 WebSocket 消息失败", e);
        }
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        log.info("WebSocket 连接关闭: {}, 状态: {}", session.getId(), status);
        
        // 清理会话
        sessionMap.remove(session.getId());
        
        // 清理订阅关系
        for (Set<WebSocketSession> sessions : subscriptions.values()) {
            sessions.remove(session);
        }
    }
    
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        log.error("WebSocket 传输错误: {}", session.getId(), exception);
    }
    
    /**
     * 向指定设备的所有订阅者推送数据
     */
    public void pushToDevice(String deviceId, DeviceData data) {
        Set<WebSocketSession> sessions = subscriptions.get(deviceId);
        
        if (sessions == null || sessions.isEmpty()) {
            return;
        }
        
        String jsonData = JSON.toJSONString(Map.of(
            "type", "data",
            "deviceId", deviceId,
            "timestamp", System.currentTimeMillis(),
            "data", data
        ));
        
        // 并行推送
        sessions.parallelStream().forEach(session -> {
            try {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(jsonData));
                }
            } catch (IOException e) {
                log.error("推送数据失败", e);
                // 移除失效会话
                sessions.remove(session);
            }
        });
    }
    
    /**
     * 广播告警消息
     */
    public void broadcastAlarm(AlarmMessage alarm) {
        String jsonData = JSON.toJSONString(Map.of(
            "type", "alarm",
            "timestamp", System.currentTimeMillis(),
            "alarm", alarm
        ));
        
        sessionMap.values().parallelStream().forEach(session -> {
            try {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(jsonData));
                }
            } catch (IOException e) {
                log.error("广播告警失败", e);
            }
        });
    }
    
    private void subscribeDevice(WebSocketSession session, String deviceId) {
        subscriptions.computeIfAbsent(deviceId, k -> ConcurrentHashMap.newKeySet())
                    .add(session);
        
        log.info("会话 {} 订阅设备 {}", session.getId(), deviceId);
    }
    
    private void unsubscribeDevice(WebSocketSession session, String deviceId) {
        Set<WebSocketSession> sessions = subscriptions.get(deviceId);
        if (sessions != null) {
            sessions.remove(session);
        }
    }
    
    private String getDeviceIdFromSession(WebSocketSession session) {
        // 从 URI 查询参数中获取
        String query = session.getUri().getQuery();
        if (query != null) {
            String[] params = query.split("&");
            for (String param : params) {
                if (param.startsWith("deviceId=")) {
                    return param.substring("deviceId=".length());
                }
            }
        }
        return null;
    }
    
    private void sendTextMessage(WebSocketSession session, String text) {
        try {
            session.sendMessage(new TextMessage(text));
        } catch (IOException e) {
            log.error("发送消息失败", e);
        }
    }
}
```

### 4. 前端 WebSocket 客户端

```javascript
// useDeviceWebSocket.js - Vue Composition API
import { ref, onMounted, onUnmounted } from 'vue';

export function useDeviceWebSocket(deviceId) {
  const ws = ref(null);
  const deviceData = ref(null);
  const alarms = ref([]);
  const isConnected = ref(false);
  
  const connect = () => {
    const wsUrl = `ws://localhost:8080/ws/device?deviceId=${deviceId}`;
    ws.value = new WebSocket(wsUrl);
    
    ws.value.onopen = () => {
      console.log('WebSocket 连接成功');
      isConnected.value = true;
      
      // 订阅设备数据
      ws.value.send(JSON.stringify({
        action: 'subscribe',
        deviceId: deviceId
      }));
    };
    
    ws.value.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'welcome':
          console.log('欢迎消息:', message.message);
          break;
          
        case 'data':
          // 更新设备数据
          deviceData.value = message.data;
          break;
          
        case 'alarm':
          // 添加告警
          alarms.value.unshift(message.alarm);
          // 限制告警数量
          if (alarms.value.length > 50) {
            alarms.value.pop();
          }
          break;
      }
    };
    
    ws.value.onerror = (error) => {
      console.error('WebSocket 错误:', error);
      isConnected.value = false;
    };
    
    ws.value.onclose = () => {
      console.log('WebSocket 连接关闭');
      isConnected.value = false;
      
      // 自动重连（指数退避）
      setTimeout(() => {
        console.log('尝试重新连接...');
        connect();
      }, 3000);
    };
  };
  
  const disconnect = () => {
    if (ws.value) {
      ws.value.close();
    }
  };
  
  onMounted(() => {
    connect();
  });
  
  onUnmounted(() => {
    disconnect();
  });
  
  return {
    deviceData,
    alarms,
    isConnected
  };
}
```

```vue
<!-- DeviceMonitor.vue -->
<template>
  <div>
    <el-tag :type="isConnected ? 'success' : 'danger'">
      {{ isConnected ? '已连接' : '未连接' }}
    </el-tag>
    
    <!-- 实时数据展示 -->
    <el-card v-if="deviceData">
      <el-descriptions title="设备实时数据" :column="2" border>
        <el-descriptions-item label="温度">
          {{ deviceData.temperature }}°C
        </el-descriptions-item>
        <el-descriptions-item label="压力">
          {{ deviceData.pressure }} MPa
        </el-descriptions-item>
        <el-descriptions-item label="电流">
          {{ deviceData.current }} A
        </el-descriptions-item>
        <el-descriptions-item label="电压">
          {{ deviceData.voltage }} V
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    
    <!-- 告警列表 -->
    <el-card class="mt-4">
      <template #header>
        <span>实时告警</span>
      </template>
      <el-timeline>
        <el-timeline-item
          v-for="alarm in alarms"
          :key="alarm.id"
          :type="getAlarmType(alarm.level)"
          :timestamp="formatTime(alarm.timestamp)"
        >
          {{ alarm.message }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { useDeviceWebSocket } from '@/composables/useDeviceWebSocket';

const props = defineProps({
  deviceId: {
    type: String,
    required: true
  }
});

const { deviceData, alarms, isConnected } = useDeviceWebSocket(props.deviceId);

const getAlarmType = (level) => {
  const types = {
    'INFO': 'info',
    'WARNING': 'warning',
    'ERROR': 'danger',
    'CRITICAL': 'danger'
  };
  return types[level] || 'info';
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN');
};
</script>
```

---

## ⚡ Netty 高性能网关

### 为什么需要 Netty？

对于高并发场景（数千设备同时连接），Spring WebSocket 可能成为瓶颈。Netty 提供：
- ✅ **更高性能**: NIO 模型，单线程可处理数万连接
- ✅ **更低延迟**: 零拷贝、内存池优化
- ✅ **更灵活**: 自定义协议、编解码器

### Netty WebSocket 网关实现

```java
@Component
@Slf4j
public class NettyWebSocketGateway {
    
    private EventLoopGroup bossGroup;
    private EventLoopGroup workerGroup;
    private Channel serverChannel;
    
    @Value("${netty.websocket.port:8081}")
    private int port;
    
    @PostConstruct
    public void start() throws InterruptedException {
        bossGroup = new NioEventLoopGroup(1);
        workerGroup = new NioEventLoopGroup();
        
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(bossGroup, workerGroup)
                .channel(NioServerSocketChannel.class)
                .option(ChannelOption.SO_BACKLOG, 1024)
                .childOption(ChannelOption.SO_KEEPALIVE, true)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        ChannelPipeline pipeline = ch.pipeline();
                        
                        // HTTP 编解码器
                        pipeline.addLast(new HttpServerCodec());
                        pipeline.addLast(new HttpObjectAggregator(65536));
                        
                        // WebSocket 协议处理器
                        pipeline.addLast(new WebSocketServerProtocolHandler("/ws"));
                        
                        // 自定义业务处理器
                        pipeline.addLast(new NettyWebSocketHandler());
                    }
                });
        
        serverChannel = bootstrap.bind(port).sync().channel();
        log.info("Netty WebSocket 网关启动成功，端口: {}", port);
    }
    
    @PreDestroy
    public void stop() {
        if (serverChannel != null) {
            serverChannel.close();
        }
        if (workerGroup != null) {
            workerGroup.shutdownGracefully();
        }
        if (bossGroup != null) {
            bossGroup.shutdownGracefully();
        }
        log.info("Netty WebSocket 网关已停止");
    }
}
```

```java
@ChannelHandler.Sharable
@Slf4j
public class NettyWebSocketHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {
    
    private static final Map<String, Channel> channelMap = new ConcurrentHashMap<>();
    private static final Map<String, Set<Channel>> subscriptions = new ConcurrentHashMap<>();
    
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        log.info("客户端连接: {}", ctx.channel().remoteAddress());
        channelMap.put(ctx.channel().id().toString(), ctx.channel());
    }
    
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame frame) {
        try {
            String text = frame.text();
            Map<String, Object> msg = JSON.parseObject(text, Map.class);
            String action = (String) msg.get("action");
            
            switch (action) {
                case "subscribe":
                    String deviceId = (String) msg.get("deviceId");
                    subscribe(ctx.channel(), deviceId);
                    break;
                    
                case "unsubscribe":
                    deviceId = (String) msg.get("deviceId");
                    unsubscribe(ctx.channel(), deviceId);
                    break;
            }
            
        } catch (Exception e) {
            log.error("处理消息失败", e);
        }
    }
    
    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        log.info("客户端断开: {}", ctx.channel().remoteAddress());
        channelMap.remove(ctx.channel().id().toString());
        
        // 清理订阅关系
        for (Set<Channel> channels : subscriptions.values()) {
            channels.remove(ctx.channel());
        }
    }
    
    /**
     * 向设备推送数据
     */
    public static void pushToDevice(String deviceId, DeviceData data) {
        Set<Channel> channels = subscriptions.get(deviceId);
        if (channels == null || channels.isEmpty()) {
            return;
        }
        
        String jsonData = JSON.toJSONString(Map.of(
            "type", "data",
            "deviceId", deviceId,
            "data", data
        ));
        
        TextWebSocketFrame frame = new TextWebSocketFrame(jsonData);
        
        channels.forEach(channel -> {
            if (channel.isActive()) {
                channel.writeAndFlush(frame.retain());
            }
        });
    }
    
    private void subscribe(Channel channel, String deviceId) {
        subscriptions.computeIfAbsent(deviceId, k -> ConcurrentHashMap.newKeySet())
                    .add(channel);
        log.info("通道 {} 订阅设备 {}", channel.id(), deviceId);
    }
    
    private void unsubscribe(Channel channel, String deviceId) {
        Set<Channel> channels = subscriptions.get(deviceId);
        if (channels != null) {
            channels.remove(channel);
        }
    }
}
```

---

## 🚨 实时告警引擎

### 告警规则配置

```java
@Data
public class AlarmRule {
    
    /** 规则 ID */
    private String ruleId;
    
    /** 设备 ID */
    private String deviceId;
    
    /** 测点名称 */
    private String pointName;
    
    /** 条件类型 */
    private ConditionType conditionType;
    
    /** 阈值 */
    private Double threshold;
    
    /** 告警级别 */
    private AlarmLevel level;
    
    /** 告警消息模板 */
    private String messageTemplate;
    
    /** 是否启用 */
    private boolean enabled;
    
    /** 防抖时间（毫秒） */
    private long debounceTime;
    
    public enum ConditionType {
        GREATER_THAN,    // 大于
        LESS_THAN,       // 小于
        EQUALS,          // 等于
        NOT_EQUALS,      // 不等于
        RANGE            // 范围
    }
    
    public enum AlarmLevel {
        INFO, WARNING, ERROR, CRITICAL
    }
}
```

### 告警引擎实现

```java
@Component
@Slf4j
public class AlarmEngine {
    
    @Autowired
    private WebSocketService webSocketService;
    
    @Autowired
    private AlarmRecordService alarmRecordService;
    
    /** 告警规则缓存 */
    private final Map<String, List<AlarmRule>> ruleCache = new ConcurrentHashMap<>();
    
    /** 告警防抖：记录最后触发时间 */
    private final Map<String, Long> lastAlarmTime = new ConcurrentHashMap<>();
    
    /**
     * 检查数据是否触发告警
     */
    public void checkAlarms(String deviceId, DeviceData data) {
        List<AlarmRule> rules = ruleCache.get(deviceId);
        if (rules == null || rules.isEmpty()) {
            return;
        }
        
        for (AlarmRule rule : rules) {
            if (!rule.isEnabled()) {
                continue;
            }
            
            // 获取测点值
            Object value = getPointValue(data, rule.getPointName());
            if (value == null) {
                continue;
            }
            
            // 判断是否满足条件
            if (evaluateCondition(value, rule)) {
                // 防抖检查
                if (shouldTriggerAlarm(rule)) {
                    triggerAlarm(rule, value);
                }
            }
        }
    }
    
    /**
     * 评估条件
     */
    private boolean evaluateCondition(Object value, AlarmRule rule) {
        double numValue = convertToDouble(value);
        
        switch (rule.getConditionType()) {
            case GREATER_THAN:
                return numValue > rule.getThreshold();
                
            case LESS_THAN:
                return numValue < rule.getThreshold();
                
            case EQUALS:
                return numValue == rule.getThreshold();
                
            case RANGE:
                // 假设 threshold 存储为 "min,max"
                String[] range = rule.getThreshold().toString().split(",");
                double min = Double.parseDouble(range[0]);
                double max = Double.parseDouble(range[1]);
                return numValue >= min && numValue <= max;
                
            default:
                return false;
        }
    }
    
    /**
     * 触发告警
     */
    private void triggerAlarm(AlarmRule rule, Object value) {
        String key = rule.getRuleId();
        lastAlarmTime.put(key, System.currentTimeMillis());
        
        // 构建告警消息
        AlarmMessage alarm = AlarmMessage.builder()
            .id(UUID.randomUUID().toString())
            .deviceId(rule.getDeviceId())
            .ruleId(rule.getRuleId())
            .level(rule.getLevel())
            .pointName(rule.getPointName())
            .currentValue(value)
            .threshold(rule.getThreshold())
            .message(formatMessage(rule, value))
            .timestamp(LocalDateTime.now())
            .build();
        
        // 保存告警记录
        alarmRecordService.save(alarm);
        
        // WebSocket 推送
        webSocketService.broadcastAlarm(alarm);
        
        // 发送通知（短信/邮件/钉钉）
        notificationService.send(alarm);
        
        log.warn("触发告警: {}", alarm.getMessage());
    }
    
    /**
     * 防抖检查
     */
    private boolean shouldTriggerAlarm(AlarmRule rule) {
        String key = rule.getRuleId();
        Long lastTime = lastAlarmTime.get(key);
        
        if (lastTime == null) {
            return true;
        }
        
        long now = System.currentTimeMillis();
        return (now - lastTime) >= rule.getDebounceTime();
    }
    
    private String formatMessage(AlarmRule rule, Object value) {
        return rule.getMessageTemplate()
            .replace("{device}", rule.getDeviceId())
            .replace("{point}", rule.getPointName())
            .replace("{value}", value.toString())
            .replace("{threshold}", rule.getThreshold().toString());
    }
    
    private Object getPointValue(DeviceData data, String pointName) {
        // 根据测点名称获取对应的值
        return data.getDataPoints().stream()
            .filter(p -> p.getPointName().equals(pointName))
            .map(DeviceData.DataPoint::getValue)
            .findFirst()
            .orElse(null);
    }
    
    private double convertToDouble(Object value) {
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        return Double.parseDouble(value.toString());
    }
}
```

---

## 📊 前端实时刷新策略

### ECharts 实时更新

```javascript
// useRealtimeChart.js
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';

export function useRealtimeChart(deviceId, pointName, maxDataPoints = 100) {
  const chartRef = ref(null);
  let chartInstance = null;
  const dataHistory = ref([]);
  
  const initChart = () => {
    chartInstance = echarts.init(chartRef.value);
    
    const option = {
      title: {
        text: `${pointName} 实时曲线`
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'time',
        boundaryGap: false
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: pointName,
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: dataHistory.value,
        areaStyle: {
          opacity: 0.3
        }
      }]
    };
    
    chartInstance.setOption(option);
  };
  
  const updateData = (timestamp, value) => {
    dataHistory.value.push([timestamp, value]);
    
    // 限制数据点数量
    if (dataHistory.value.length > maxDataPoints) {
      dataHistory.value.shift();
    }
    
    // 更新图表
    chartInstance.setOption({
      series: [{
        data: dataHistory.value
      }]
    });
  };
  
  onMounted(() => {
    initChart();
  });
  
  onUnmounted(() => {
    if (chartInstance) {
      chartInstance.dispose();
    }
  });
  
  return {
    chartRef,
    updateData
  };
}
```

```vue
<template>
  <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { useDeviceWebSocket } from '@/composables/useDeviceWebSocket';
import { useRealtimeChart } from '@/composables/useRealtimeChart';

const props = defineProps({
  deviceId: String,
  pointName: {
    type: String,
    default: 'temperature'
  }
});

const { deviceData } = useDeviceWebSocket(props.deviceId);
const { chartRef, updateData } = useRealtimeChart(props.deviceId, props.pointName);

// 监听数据变化，更新图表
watch(deviceData, (newData) => {
  if (newData) {
    const timestamp = Date.now();
    const value = newData[props.pointName];
    updateData(timestamp, value);
  }
});
</script>
```

---

## 💡 最佳实践

### 1. 心跳检测与断线重连

```javascript
// 客户端心跳
let heartbeatTimer = null;

const startHeartbeat = () => {
  heartbeatTimer = setInterval(() => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify({
        action: 'ping',
        timestamp: Date.now()
      }));
    }
  }, 30000); // 每 30 秒发送一次心跳
};

const stopHeartbeat = () => {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
  }
};
```

```java
// 服务端心跳处理
@Override
protected void handleTextMessage(WebSocketSession session, TextMessage message) {
    Map<String, Object> msg = JSON.parseObject(message.getPayload(), Map.class);
    
    if ("ping".equals(msg.get("action"))) {
        // 回复 pong
        sendTextMessage(session, JSON.toJSONString(Map.of(
            "type", "pong",
            "timestamp", System.currentTimeMillis()
        )));
        
        // 更新最后活跃时间
        updateLastActiveTime(session.getId());
    }
}
```

### 2. 消息确认机制

```java
@Data
public class ReliableMessage {
    private String messageId;
    private String type;
    private Object payload;
    private long timestamp;
    private int retryCount;
}

// 发送消息并等待确认
public void sendWithAck(String deviceId, Object data) {
    String messageId = UUID.randomUUID().toString();
    
    ReliableMessage message = new ReliableMessage();
    message.setMessageId(messageId);
    message.setType("data");
    message.setPayload(data);
    message.setTimestamp(System.currentTimeMillis());
    
    // 存储待确认消息
    pendingMessages.put(messageId, message);
    
    // 发送消息
    pushToDevice(deviceId, message);
    
    // 超时重试
    scheduledExecutor.schedule(() -> {
        if (pendingMessages.containsKey(messageId)) {
            log.warn("消息 {} 未收到确认，重试", messageId);
            retryMessage(messageId);
        }
    }, 5, TimeUnit.SECONDS);
}

// 客户端发送确认
public void handleAck(String messageId) {
    pendingMessages.remove(messageId);
}
```

---

## 🔗 相关资源

- [Spring WebSocket 官方文档](https://docs.spring.io/spring-framework/reference/web/websocket.html)
- [Netty 用户指南](https://netty.io/wiki/user-guide-for-4.x.html)
- [ECharts 官方文档](https://echarts.apache.org/)

---

**下一步**: 学习 [04-工业可视化（SCADA）](./04-scada-visualization.md)，实现组态画面与实时监控大屏。
