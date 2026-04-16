# 02-数据平台设计（存储/处理）

> **前置知识**: [01-设备接入与数据采集](./01-device-access.md)

## 🎯 学习目标

掌握工业时序数据平台的核心设计：
- ✅ 理解时序数据特点与存储挑战
- ✅ 时序数据库选型对比（TDengine vs InfluxDB vs TimescaleDB）
- ✅ TDengine 超级表设计与性能优化
- ✅ 数据分层存储策略（热数据/冷数据）
- ✅ 数据清洗与聚合计算

---

## 📊 时序数据特点

### 为什么需要时序数据库？

工业场景产生的数据具有典型时序特征：

| 特征 | 说明 | 传统关系型数据库痛点 |
|------|------|---------------------|
| **写多读少** | 每秒数千次写入，查询相对较少 | MySQL 插入性能瓶颈 |
| **时间有序** | 数据按时间顺序产生 | B+树索引不适合时间范围查询 |
| **高压缩率** | 相邻数据点相似度高 | 未针对时序数据优化压缩算法 |
| **降采样需求** | 历史数据需聚合展示 | 手动编写 GROUP BY 复杂且慢 |
| **数据过期** | 超过一定时间的数据可删除或归档 | 手动清理大表效率低 |

**数据量估算**:
```
假设 100 台设备，每台 50 个测点，采集频率 1Hz
- 每秒写入: 100 × 50 = 5,000 条
- 每天写入: 5,000 × 86,400 = 4.32 亿条
- 每月写入: ~130 亿条
- 原始数据大小: ~500GB/月（未压缩）
```

---

## 🔍 时序数据库选型对比

### 主流方案对比

| 特性 | TDengine | InfluxDB | TimescaleDB | Prometheus |
|------|---------|----------|-------------|------------|
| **开源协议** | AGPL v3 / 商业许可 | SSPL / 商业许可 | Apache 2.0 | Apache 2.0 |
| **开发语言** | C | Go | PostgreSQL 扩展 | Go |
| **数据模型** | 超级表 + 子表 | Measurement + Tag | Hypertable | Metric + Label |
| **写入性能** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **查询能力** | SQL（兼容 MySQL） | InfluxQL / Flux | 完整 SQL | PromQL |
| **压缩率** | 10:1 ~ 20:1 | 5:1 ~ 10:1 | 3:1 ~ 5:1 | 不适用 |
| **集群支持** | ✅ 原生分布式 | ❌ 仅企业版 | ✅ 基于 PG | ✅ Federation |
| **社区活跃度** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **中文文档** | ✅ 完善 | ⚠️ 一般 | ⚠️ 一般 | ⚠️ 一般 |
| **适用场景** | 工业互联网、IoT | DevOps 监控 | 已有 PG 生态 | K8s 监控 |

### 推荐选择：**TDengine**

**理由**:
1. ✅ **国产化**: 涛思数据出品，中文文档完善，技术支持响应快
2. ✅ **高性能**: C 语言开发，写入性能优于 InfluxDB 2~3 倍
3. ✅ **SQL 友好**: 兼容 MySQL 语法，学习成本低
4. ✅ **内置功能**: 自动分区、数据保留、连续查询（降采样）
5. ✅ **生态集成**: Spring Boot、Grafana、Telegraf 等主流工具支持

---

## 🏗️ TDengine 架构设计

### 核心概念

```
┌─────────────────────────────────────────────┐
│              Database (数据库)                │
│  ┌───────────────────────────────────────┐  │
│  │       Super Table (超级表)             │  │
│  │  ┌──────────┐ ┌──────────┐           │  │
│  │  │ Subtable │ │ Subtable │  ...      │  │
│  │  │ (设备1)  │ │ (设备2)  │           │  │
│  │  └──────────┘ └──────────┘           │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

- **Database**: 逻辑隔离的数据集合
- **Super Table (STable)**: 定义数据结构与标签（类似模板）
- **Subtable**: 实际存储数据的表，每个设备一个子表
- **Tag**: 设备的静态属性（如工厂、产线、型号），用于快速过滤

### 表结构设计

```sql
-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS iot_data
KEEP 365          -- 数据保留 365 天
DURATION 10       -- 每 10 天一个数据文件
BLOCKS 6          -- 内存块数量
COMP 2;           -- 压缩级别 (0-2)

-- 2. 创建设备数据超级表
CREATE STABLE IF NOT EXISTS iot_data.device_data (
    ts TIMESTAMP,                    -- 时间戳（主键）
    temperature FLOAT,               -- 温度
    pressure FLOAT,                  -- 压力
    vibration FLOAT,                 -- 振动
    current FLOAT,                   -- 电流
    voltage FLOAT,                   -- 电压
    status INT,                      -- 设备状态 (0:停机, 1:运行, 2:告警)
    product_count INT                -- 产量计数
) TAGS (
    device_id VARCHAR(50),           -- 设备 ID
    device_name VARCHAR(100),        -- 设备名称
    factory VARCHAR(50),             -- 工厂
    workshop VARCHAR(50),            -- 车间
    production_line VARCHAR(50),     -- 产线
    device_type VARCHAR(50)          -- 设备类型
);

-- 3. 自动创建子表（通过应用层或 INSERT INTO ... USING）
-- 示例：为设备 device_001 创建子表
CREATE TABLE IF NOT EXISTS iot_data.device_001 
USING iot_data.device_data 
TAGS ('device_001', 'CNC机床-001', 'Factory-A', 'Workshop-1', 'Line-01', 'CNC');
```

---

## 💻 Spring Boot 集成 TDengine

### 1. 依赖配置

```xml
<!-- pom.xml -->
<dependency>
    <groupId>com.taosdata.jdbc</groupId>
    <artifactId>taos-jdbcdriver</artifactId>
    <version>3.2.5</version>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jdbc</artifactId>
</dependency>
```

```yaml
# application.yml
spring:
  datasource:
    tdengine:
      driver-class-name: com.taosdata.jdbc.TSDBDriver
      url: jdbc:TAOS://localhost:6030/iot_data?charset=UTF-8&locale=en_US.UTF-8
      username: root
      password: taosdata
      hikari:
        maximum-pool-size: 20
        minimum-idle: 5
        connection-timeout: 30000
```

### 2. 配置类

```java
@Configuration
public class TDengineConfig {
    
    @Bean
    @ConfigurationProperties("spring.datasource.tdengine")
    public DataSource tdengineDataSource() {
        return DataSourceBuilder.create().build();
    }
    
    @Bean
    public JdbcTemplate tdengineJdbcTemplate(@Qualifier("tdengineDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
```

### 3. 数据访问层

```java
@Repository
@Slf4j
public class DeviceDataRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    /**
     * 批量插入设备数据
     */
    public void batchInsert(List<DeviceData> dataList) {
        if (dataList == null || dataList.isEmpty()) {
            return;
        }
        
        String sql = "INSERT INTO ? USING device_data TAGS (?, ?, ?, ?, ?, ?) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        List<Object[]> batchArgs = new ArrayList<>();
        
        for (DeviceData data : dataList) {
            // 动态生成子表名
            String subTableName = "device_" + data.getDeviceId().replace("-", "_");
            
            batchArgs.add(new Object[]{
                subTableName,                          // 子表名
                data.getDeviceId(),                    // device_id
                data.getDeviceName(),                  // device_name
                data.getFactory(),                     // factory
                data.getWorkshop(),                    // workshop
                data.getProductionLine(),              // production_line
                data.getDeviceType(),                  // device_type
                new Timestamp(data.getTimestamp().toInstant(ZoneOffset.UTC).toEpochMilli()), // ts
                data.getTemperature(),                 // temperature
                data.getPressure(),                    // pressure
                data.getVibration(),                   // vibration
                data.getCurrent(),                     // current
                data.getVoltage(),                     // voltage
                data.getStatus(),                      // status
                data.getProductCount()                 // product_count
            });
        }
        
        jdbcTemplate.batchUpdate(sql, batchArgs);
        log.debug("批量插入 {} 条设备数据", dataList.size());
    }
    
    /**
     * 查询设备最近 N 条数据
     */
    public List<DeviceData> queryRecentData(String deviceId, int limit) {
        String sql = "SELECT * FROM device_? ORDER BY ts DESC LIMIT ?";
        
        return jdbcTemplate.query(sql, new Object[]{deviceId.replace("-", "_"), limit}, 
            (rs, rowNum) -> mapRowToDeviceData(rs));
    }
    
    /**
     * 查询时间范围内的数据
     */
    public List<DeviceData> queryByTimeRange(String deviceId, LocalDateTime start, LocalDateTime end) {
        String sql = "SELECT * FROM device_? WHERE ts >= ? AND ts <= ? ORDER BY ts ASC";
        
        return jdbcTemplate.query(sql, new Object[]{
            deviceId.replace("-", "_"),
            Timestamp.valueOf(start),
            Timestamp.valueOf(end)
        }, (rs, rowNum) -> mapRowToDeviceData(rs));
    }
    
    /**
     * 降采样查询（计算平均值）
     */
    public List<AggregatedData> queryAverageByInterval(String deviceId, LocalDateTime start, LocalDateTime end, String interval) {
        String sql = "SELECT AVG(temperature) as avg_temp, AVG(pressure) as avg_pressure " +
                     "FROM device_? WHERE ts >= ? AND ts <= ? INTERVAL(?)";
        
        return jdbcTemplate.query(sql, new Object[]{
            deviceId.replace("-", "_"),
            Timestamp.valueOf(start),
            Timestamp.valueOf(end),
            interval  // 如: "1m", "1h", "1d"
        }, (rs, rowNum) -> {
            AggregatedData data = new AggregatedData();
            data.setTimestamp(rs.getTimestamp("ts").toLocalDateTime());
            data.setAvgTemperature(rs.getFloat("avg_temp"));
            data.setAvgPressure(rs.getFloat("avg_pressure"));
            return data;
        });
    }
    
    private DeviceData mapRowToDeviceData(ResultSet rs) throws SQLException {
        DeviceData data = new DeviceData();
        data.setTimestamp(rs.getTimestamp("ts").toLocalDateTime());
        data.setTemperature(rs.getFloat("temperature"));
        data.setPressure(rs.getFloat("pressure"));
        data.setVibration(rs.getFloat("vibration"));
        data.setCurrent(rs.getFloat("current"));
        data.setVoltage(rs.getFloat("voltage"));
        data.setStatus(rs.getInt("status"));
        data.setProductCount(rs.getInt("product_count"));
        return data;
    }
}
```

---

## ⚡ 性能优化策略

### 1. 批量写入优化

```java
@Component
@Slf4j
public class DataBatchWriter {
    
    @Autowired
    private DeviceDataRepository repository;
    
    /** 缓冲区 */
    private final Map<String, List<DeviceData>> bufferMap = new ConcurrentHashMap<>();
    
    /** 批量大小阈值 */
    private static final int BATCH_SIZE = 1000;
    
    /** 刷新间隔（毫秒） */
    private static final long FLUSH_INTERVAL = 5000;
    
    /**
     * 添加数据到缓冲区
     */
    public void addData(DeviceData data) {
        String key = data.getDeviceId();
        
        bufferMap.computeIfAbsent(key, k -> new ArrayList<>()).add(data);
        
        // 达到批量大小，立即刷新
        if (bufferMap.get(key).size() >= BATCH_SIZE) {
            flushBuffer(key);
        }
    }
    
    /**
     * 定时刷新所有缓冲区
     */
    @Scheduled(fixedRate = FLUSH_INTERVAL)
    public void scheduledFlush() {
        for (String deviceId : bufferMap.keySet()) {
            flushBuffer(deviceId);
        }
    }
    
    private synchronized void flushBuffer(String deviceId) {
        List<DeviceData> dataList = bufferMap.remove(deviceId);
        
        if (dataList != null && !dataList.isEmpty()) {
            try {
                repository.batchInsert(dataList);
                log.debug("刷新设备 {} 的 {} 条数据", deviceId, dataList.size());
            } catch (Exception e) {
                log.error("刷新数据失败", e);
                // 失败则重新放回缓冲区
                bufferMap.put(deviceId, dataList);
            }
        }
    }
}
```

### 2. 索引优化

```sql
-- TDengine 自动为 TAGS 列创建索引，无需手动创建

-- 查询优化：使用 TAGS 过滤（高效）
SELECT * FROM device_data 
WHERE factory = 'Factory-A' 
  AND production_line = 'Line-01' 
  AND ts >= NOW - 1h;

-- 避免：对非 TAG 列进行频繁过滤（性能较差）
SELECT * FROM device_data 
WHERE temperature > 80;  -- 温度不是 TAG，全表扫描
```

### 3. 数据保留策略

```sql
-- 创建数据库时设置保留期
CREATE DATABASE iot_data KEEP 365;

-- 修改保留期
ALTER DATABASE iot_data KEEP 730;  -- 改为保留 2 年

-- 查看数据库配置
SHOW DATABASES;
```

### 4. 连续查询（自动降采样）

```sql
-- 创建连续查询：每小时计算一次平均值，保存到另一张表
CREATE TABLE IF NOT EXISTS iot_data.device_hour_avg (
    ts TIMESTAMP,
    avg_temperature FLOAT,
    avg_pressure FLOAT,
    max_temperature FLOAT,
    min_temperature FLOAT
) TAGS (
    device_id VARCHAR(50)
);

-- 创建流式计算任务
CREATE STREAM device_hour_avg_stream INTO iot_data.device_hour_avg
AS SELECT 
    _wstart AS ts,
    AVG(temperature) AS avg_temperature,
    AVG(pressure) AS avg_pressure,
    MAX(temperature) AS max_temperature,
    MIN(temperature) AS min_temperature
FROM iot_data.device_data
INTERVAL(1h)
GROUP BY device_id;
```

---

## 🔄 数据分层存储

### 冷热数据分离策略

```
┌─────────────────────────────────────────┐
│         热数据（Redis 缓存）              │
│   最近 1 小时数据，毫秒级响应             │
└─────────────────────────────────────────┘
              ↓ 过期
┌─────────────────────────────────────────┐
│       温数据（TDengine SSD）              │
│   最近 30 天数据，秒级响应                │
└─────────────────────────────────────────┘
              ↓ 归档
┌─────────────────────────────────────────┐
│       冷数据（TDengine HDD / OSS）        │
│   30 天以上数据，分钟级响应               │
└─────────────────────────────────────────┘
```

### Redis 缓存最新数据

```java
@Component
public class DeviceDataCache {
    
    @Autowired
    private RedisTemplate<String, DeviceData> redisTemplate;
    
    private static final String CACHE_KEY_PREFIX = "device:latest:";
    private static final long CACHE_TTL = 3600; // 1 小时
    
    /**
     * 缓存设备最新数据
     */
    public void cacheLatestData(DeviceData data) {
        String key = CACHE_KEY_PREFIX + data.getDeviceId();
        redisTemplate.opsForValue().set(key, data, CACHE_TTL, TimeUnit.SECONDS);
    }
    
    /**
     * 获取设备最新数据
     */
    public DeviceData getLatestData(String deviceId) {
        String key = CACHE_KEY_PREFIX + deviceId;
        return redisTemplate.opsForValue().get(key);
    }
    
    /**
     * 批量获取多个设备最新数据
     */
    public Map<String, DeviceData> batchGetLatestData(List<String> deviceIds) {
        List<String> keys = deviceIds.stream()
            .map(id -> CACHE_KEY_PREFIX + id)
            .collect(Collectors.toList());
        
        List<DeviceData> dataList = redisTemplate.opsForValue().multiGet(keys);
        
        Map<String, DeviceData> result = new HashMap<>();
        for (int i = 0; i < deviceIds.size(); i++) {
            if (dataList.get(i) != null) {
                result.put(deviceIds.get(i), dataList.get(i));
            }
        }
        return result;
    }
}
```

---

## 📈 Grafana 可视化集成

### 1. 安装 TDengine 数据源插件

```bash
# 在 Grafana 中安装 TDengine 插件
grafana-cli plugins install tdengine-datasource
```

### 2. 配置数据源

- URL: `http://localhost:6041`
- Database: `iot_data`
- User: `root`
- Password: `taosdata`

### 3. 创建仪表板

**实时温度曲线**:
```sql
SELECT temperature FROM device_$device_id WHERE ts >= NOW - 1h
```

**设备状态饼图**:
```sql
SELECT COUNT(*) FROM device_data 
WHERE ts >= NOW - 24h 
GROUP BY status
```

**产量统计**:
```sql
SELECT SUM(product_count) FROM device_data 
WHERE factory = '$factory' 
  AND ts >= TODAY()
```

---

## 🧪 性能测试

### 写入性能基准测试

```java
@SpringBootTest
public class TDenginePerformanceTest {
    
    @Autowired
    private DeviceDataRepository repository;
    
    @Test
    public void testWritePerformance() {
        int totalRecords = 1_000_000; // 100 万条
        int batchSize = 1000;
        
        long startTime = System.currentTimeMillis();
        
        for (int i = 0; i < totalRecords; i += batchSize) {
            List<DeviceData> batch = generateBatchData(batchSize);
            repository.batchInsert(batch);
        }
        
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        
        System.out.println("写入 " + totalRecords + " 条数据耗时: " + duration + "ms");
        System.out.println("吞吐量: " + (totalRecords * 1000.0 / duration) + " records/sec");
    }
    
    private List<DeviceData> generateBatchData(int size) {
        List<DeviceData> dataList = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        for (int i = 0; i < size; i++) {
            DeviceData data = DeviceData.builder()
                .deviceId("device_001")
                .deviceName("CNC机床-001")
                .factory("Factory-A")
                .workshop("Workshop-1")
                .productionLine("Line-01")
                .deviceType("CNC")
                .timestamp(now.plusSeconds(i))
                .temperature(25.0f + ThreadLocalRandom.current().nextFloat() * 50)
                .pressure(1.0f + ThreadLocalRandom.current().nextFloat() * 0.5f)
                .vibration(ThreadLocalRandom.current().nextFloat() * 10)
                .current(10.0f + ThreadLocalRandom.current().nextFloat() * 5)
                .voltage(220.0f + ThreadLocalRandom.current().nextFloat() * 10)
                .status(1)
                .productCount(i)
                .build();
            
            dataList.add(data);
        }
        
        return dataList;
    }
}
```

**预期结果**:
```
写入 1,000,000 条数据耗时: ~5000ms
吞吐量: ~200,000 records/sec
```

---

## 💡 最佳实践

### 1. 子表命名规范

```java
// 推荐：使用设备 ID 作为子表名（替换特殊字符）
String subTableName = "device_" + deviceId.replace("-", "_").replace(".", "_");

// 避免：使用中文或特殊字符
// ❌ CREATE TABLE 设备-001 ...
// ✅ CREATE TABLE device_001 ...
```

### 2. 时间戳精度

```java
// TDengine 支持毫秒级精度
Timestamp ts = new Timestamp(System.currentTimeMillis());

// 如果需要微秒级，使用 nanotime
long nanos = System.nanoTime();
```

### 3. 异常处理

```java
try {
    repository.batchInsert(dataList);
} catch (DataAccessException e) {
    log.error("TDengine 写入失败", e);
    
    // 降级策略：写入本地文件
    saveToLocalFile(dataList);
    
    // 异步重试
    retryService.scheduleRetry(dataList);
}
```

---

## 🔗 相关资源

- [TDengine 官方文档](https://docs.taosdata.com/)
- [TDengine GitHub](https://github.com/taosdata/TDengine)
- [Grafana TDengine 插件](https://grafana.com/grafana/plugins/tdengine-datasource/)

---

**下一步**: 学习 [03-实时系统设计](./03-realtime-system.md)，掌握 WebSocket 推送与 Netty 高性能通信。
