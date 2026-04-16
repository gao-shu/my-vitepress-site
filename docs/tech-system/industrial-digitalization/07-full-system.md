# 07-完整系统设计与实现

> **前置知识**: [06-轻量MES能力实现](./06-mes-lite.md)

## 🎯 学习目标

掌握工业数字化系统的整体落地：
- ✅ 系统部署架构设计
- ✅ Docker Compose 编排
- ✅ 性能优化策略
- ✅ 监控与告警
- ✅ 常见问题排查

---

## 🏗️ 系统架构图

```
                          ┌─────────────────┐
                          │   用户浏览器     │
                          └────────┬────────┘
                                   │ HTTPS
                          ┌────────▼────────┐
                          │   Nginx         │
                          │  (反向代理+SSL)  │
                          └───┬─────────┬───┘
                              │         │
                    ┌─────────▼─┐   ┌──▼──────────┐
                    │ 前端服务   │   │  后端服务    │
                    │ Vue3 SPA  │   │ Spring Boot  │
                    │ :80       │   │  :8080       │
                    └───────────┘   └──────┬───────┘
                                           │
                        ┌──────────────────┼──────────────────┐
                        │                  │                  │
              ┌─────────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐
              │  MySQL 8.0     │  │  Redis 7.x   │  │ TDengine 3.x │
              │  (业务数据)     │  │  (缓存)       │  │ (时序数据)    │
              │  :3306         │  │  :6379       │  │  :6030       │
              └────────────────┘  └──────────────┘  └──────────────┘
                        │
              ┌─────────▼──────┐
              │  EMQX 5.0      │
              │  (MQTT Broker) │
              │  :1883         │
              └────────┬───────┘
                       │ MQTT
              ┌────────▼──────┐
              │  PLC/传感器    │
              │  Modbus/S7    │
              └───────────────┘
```

---

## 🐳 Docker Compose 部署

### 1. docker-compose.yml

```yaml
version: '3.8'

services:
  # ==================== 数据库服务 ====================
  
  mysql:
    image: mysql:8.0
    container_name: iot-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-root123}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-iot_platform}
      TZ: Asia/Shanghai
    ports:
      - "3306:3306"
    volumes:
      - ./data/mysql:/var/lib/mysql
      - ./sql/init.sql:/docker-entrypoint-initdb.d/init.sql
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
      - --max_connections=1000
    networks:
      - iot-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: iot-redis
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD:-redis123} --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - ./data/redis:/data
    networks:
      - iot-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ==================== 时序数据库 ====================
  
  tdengine:
    image: tdengine/tdengine:3.0
    container_name: iot-tdengine
    restart: always
    environment:
      TZ: Asia/Shanghai
    ports:
      - "6030:6030"   # TCP
      - "6041:6041"   # RESTful
      - "6030-6040:6030-6040"  # 其他端口
    volumes:
      - ./data/taos:/var/lib/taos
      - ./data/taos/log:/var/log/taos
    networks:
      - iot-network
    healthcheck:
      test: ["CMD", "taos", "-s", "show databases;"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ==================== MQTT Broker ====================
  
  emqx:
    image: emqx/emqx:5.0
    container_name: iot-emqx
    restart: always
    environment:
      EMQX_DASHBOARD__DEFAULT_USERNAME: ${EMQX_USERNAME:-admin}
      EMQX_DASHBOARD__DEFAULT_PASSWORD: ${EMQX_PASSWORD:-public}
      TZ: Asia/Shanghai
    ports:
      - "1883:1883"    # MQTT TCP
      - "8083:8083"    # MQTT WebSocket
      - "8084:8084"    # MQTT WebSocket SSL
      - "8883:8883"    # MQTT SSL
      - "18083:18083"  # Dashboard
    volumes:
      - ./data/emqx:/opt/emqx/data
    networks:
      - iot-network
    healthcheck:
      test: ["CMD", "emqx_ctl", "status"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ==================== 应用服务 ====================
  
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    container_name: iot-backend
    restart: always
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DB_HOST: mysql
      DB_PORT: 3306
      DB_NAME: ${MYSQL_DATABASE:-iot_platform}
      DB_USERNAME: root
      DB_PASSWORD: ${MYSQL_ROOT_PASSWORD:-root123}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD:-redis123}
      TDENGINE_URL: jdbc:TAOS://tdengine:6030/iot_data
      TDENGINE_USERNAME: root
      TDENGINE_PASSWORD: taosdata
      MQTT_BROKER_URL: tcp://emqx:1883
      TZ: Asia/Shanghai
    ports:
      - "8080:8080"
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
      tdengine:
        condition: service_healthy
      emqx:
        condition: service_healthy
    volumes:
      - ./logs/backend:/app/logs
      - ./uploads:/app/uploads
    networks:
      - iot-network
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '2.0'

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: iot-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - iot-network

  # ==================== 监控服务（可选）====================
  
  prometheus:
    image: prom/prometheus:latest
    container_name: iot-prometheus
    restart: always
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./data/prometheus:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    networks:
      - iot-network

  grafana:
    image: grafana/grafana:latest
    container_name: iot-grafana
    restart: always
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD:-admin123}
    volumes:
      - ./data/grafana:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
    depends_on:
      - prometheus
    networks:
      - iot-network

networks:
  iot-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### 2. .env 环境变量文件

```bash
# 数据库配置
MYSQL_ROOT_PASSWORD=root123
MYSQL_DATABASE=iot_platform

# Redis 配置
REDIS_PASSWORD=redis123

# EMQX 配置
EMQX_USERNAME=admin
EMQX_PASSWORD=public

# Grafana 配置
GRAFANA_PASSWORD=admin123

# 应用配置
SPRING_PROFILES_ACTIVE=prod
```

### 3. Dockerfile.backend

```dockerfile
# 构建阶段
FROM maven:3.8-openjdk-17 AS builder

WORKDIR /build

# 复制 pom.xml 并下载依赖（利用 Docker 缓存层）
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 复制源代码并构建
COPY src ./src
RUN mvn clean package -DskipTests -B

# 运行阶段
FROM openjdk:17-slim

WORKDIR /app

# 安装必要工具
RUN apt-get update && apt-get install -y \
    curl \
    net-tools \
    && rm -rf /var/lib/apt/lists/*

# 复制 JAR 包
COPY --from=builder /build/target/*.jar app.jar

# 创建日志目录
RUN mkdir -p /app/logs

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# JVM 参数优化
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"

# 启动应用
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### 4. Dockerfile.frontend

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /build

# 复制 package.json 并安装依赖
COPY package*.json ./
RUN npm ci --registry=https://registry.npmmirror.com

# 复制源代码并构建
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /build/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### 5. nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;

    # 前端静态资源
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # 缓存策略
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # 后端 API 代理
    location /api/ {
        proxy_pass http://backend:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket 支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket 路径
    location /ws/ {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    # 文件上传
    location /uploads/ {
        alias /app/uploads/;
        autoindex off;
        client_max_body_size 100M;
    }

    # 隐藏 Nginx 版本号
    server_tokens off;
}
```

---

## ⚡ 性能优化策略

### 1. 数据库优化

#### MySQL 索引优化

```sql
-- 工单查询常用索引
CREATE INDEX idx_work_order_status ON work_order(status);
CREATE INDEX idx_work_order_line_time ON work_order(production_line_id, planned_start_time, planned_end_time);
CREATE INDEX idx_work_order_product ON work_order(product_id, status);

-- 设备运行记录索引
CREATE INDEX idx_device_run_time ON device_run_record(device_id, start_time, end_time);
CREATE INDEX idx_device_run_type ON device_run_record(device_id, run_type, start_time);

-- OEE 日报唯一索引
CREATE UNIQUE INDEX uk_device_oee_date ON device_oee_daily(device_id, stat_date);
```

#### 查询优化

```java
/**
 * ❌ 避免 N+1 查询
 */
// 错误示例
List<WorkOrder> orders = workOrderMapper.selectAll();
for (WorkOrder order : orders) {
    // 每次循环都会查询数据库
    List<WorkOrderProcess> processes = processMapper.selectByWorkOrderId(order.getId());
}

/**
 * ✅ 使用 JOIN 或批量查询
 */
// 正确示例 1：使用 JOIN
@Select("SELECT wo.*, wop.* FROM work_order wo " +
        "LEFT JOIN work_order_process wop ON wo.id = wop.work_order_id " +
        "WHERE wo.status = #{status}")
List<WorkOrderWithProcesses> selectWithProcesses(@Param("status") String status);

// 正确示例 2：批量查询
List<String> orderIds = orders.stream().map(WorkOrder::getId).collect(Collectors.toList());
Map<String, List<WorkOrderProcess>> processMap = processMapper.selectByWorkOrderIds(orderIds)
    .stream()
    .collect(Collectors.groupingBy(WorkOrderProcess::getWorkOrderId));
```

### 2. Redis 缓存策略

```java
@Component
public class DeviceDataCache {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 缓存设备最新数据（TTL: 1小时）
     */
    public void cacheDeviceData(String deviceId, DeviceData data) {
        String key = "device:latest:" + deviceId;
        redisTemplate.opsForValue().set(key, data, 1, TimeUnit.HOURS);
    }
    
    /**
     * 缓存设备列表（TTL: 10分钟）
     */
    public List<Device> getCachedDeviceList() {
        String key = "device:list:all";
        
        List<Device> devices = (List<Device>) redisTemplate.opsForValue().get(key);
        
        if (devices == null) {
            devices = deviceMapper.selectAll();
            redisTemplate.opsForValue().set(key, devices, 10, TimeUnit.MINUTES);
        }
        
        return devices;
    }
    
    /**
     * 缓存 OEE 日报（TTL: 1天）
     */
    public DeviceOEEDaily getCachedOEEDaily(String deviceId, LocalDate date) {
        String key = String.format("device:oee:%s:%s", deviceId, date);
        
        DeviceOEEDaily oee = (DeviceOEEDaily) redisTemplate.opsForValue().get(key);
        
        if (oee == null) {
            oee = oeeDailyMapper.selectOne(
                new LambdaQueryWrapper<DeviceOEEDaily>()
                    .eq(DeviceOEEDaily::getDeviceId, deviceId)
                    .eq(DeviceOEEDaily::getStatDate, date)
            );
            
            if (oee != null) {
                redisTemplate.opsForValue().set(key, oee, 1, TimeUnit.DAYS);
            }
        }
        
        return oee;
    }
    
    /**
     * 缓存穿透保护：布隆过滤器
     */
    public boolean mightExist(String deviceId) {
        // 使用 Redis Bitmap 实现简单布隆过滤器
        int hash = Math.abs(deviceId.hashCode()) % 1000000;
        return redisTemplate.opsForValue().getBit("device:bloom", hash);
    }
    
    public void addToBloomFilter(String deviceId) {
        int hash = Math.abs(deviceId.hashCode()) % 1000000;
        redisTemplate.opsForValue().setBit("device:bloom", hash, true);
    }
}
```

### 3. TDengine 优化

```sql
-- 1. 合理设置数据保留期
ALTER DATABASE iot_data KEEP 365;

-- 2. 使用超级表 + 子表
CREATE STABLE device_data (
    ts TIMESTAMP,
    temperature FLOAT,
    pressure FLOAT
) TAGS (
    device_id VARCHAR(50),
    factory VARCHAR(50)
);

-- 3. 批量插入（每批 1000 条）
INSERT INTO 
  device_001 USING device_data TAGS ('device_001', 'factory_a') VALUES (NOW, 25.5, 1.2),
  device_001 USING device_data TAGS ('device_001', 'factory_a') VALUES (NOW+1s, 25.6, 1.2),
  ...
  device_002 USING device_data TAGS ('device_002', 'factory_a') VALUES (NOW, 30.1, 1.5);

-- 4. 降采样查询
SELECT AVG(temperature) 
FROM device_data 
WHERE ts >= NOW - 24h 
INTERVAL(1h);
```

### 4. 前端优化

```javascript
// 1. 路由懒加载
const WorkOrderList = () => import('@/views/mes/work-order/index.vue');

// 2. 组件懒加载
const ProcessRouteDesigner = defineAsyncComponent(() => 
  import('@/components/ProcessRouteDesigner.vue')
);

// 3. 图片懒加载
<img v-lazy="imageUrl" alt="设备图片" />

// 4. 虚拟滚动（大数据列表）
<el-table-v2
  :columns="columns"
  :data="largeDataSet"
  :width="800"
  :height="600"
/>

// 5. 防抖搜索
const searchDevices = debounce((keyword) => {
  fetchDevices(keyword);
}, 300);
```

---

## 📊 监控与告警

### 1. Prometheus 配置

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'spring-boot'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['backend:8080']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'mysql'
    static_configs:
      - targets: ['mysqld-exporter:9104']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```

### 2. Spring Boot Actuator 配置

```yaml
# application-prod.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true
```

### 3. Grafana 仪表板

**关键指标**:
- JVM 内存使用率
- GC 次数与耗时
- HTTP 请求 QPS 与响应时间
- 数据库连接池使用情况
- Redis 命中率
- TDengine 写入吞吐量
- MQTT 连接数

---

## 🔧 常见问题排查

### 1. 容器启动失败

```bash
# 查看容器日志
docker logs -f iot-backend

# 查看容器状态
docker ps -a

# 进入容器调试
docker exec -it iot-backend sh

# 检查网络连接
docker network inspect iot-network
```

### 2. 数据库连接失败

```bash
# 测试 MySQL 连接
docker exec -it iot-mysql mysql -uroot -proot123

# 测试 Redis 连接
docker exec -it iot-redis redis-cli -a redis123 ping

# 测试 TDengine 连接
docker exec -it iot-tdengine taos -s "show databases;"
```

### 3. 内存溢出

```bash
# 查看 JVM 堆内存
docker exec -it iot-backend jstat -gc <pid>

# 生成堆转储文件
docker exec -it iot-backend jmap -dump:format=b,file=/tmp/heap.hprof <pid>

# 调整 JVM 参数
JAVA_OPTS="-Xms1g -Xmx2g -XX:+HeapDumpOnOutOfMemoryError"
```

### 4. WebSocket 断开

```nginx
# Nginx 增加超时时间
proxy_read_timeout 86400s;
proxy_send_timeout 86400s;
```

```java
// 前端心跳检测
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'ping' }));
  }
}, 30000);
```

### 5. 时序数据写入慢

```sql
-- 检查 TDengine 配置
SHOW VARIABLES LIKE 'comp';

-- 调整压缩级别（0-2，2 为最高压缩）
ALTER DATABASE iot_data COMP 2;

-- 检查磁盘 IO
iostat -x 1
```

---

## 🚀 一键部署脚本

```bash
#!/bin/bash

# deploy.sh

set -e

echo "🚀 开始部署 IoT 平台..."

# 1. 创建数据目录
mkdir -p data/{mysql,redis,taos,taos/log,emqx,prometheus,grafana}
mkdir -p logs/backend uploads

# 2. 设置权限
chmod -R 777 data logs uploads

# 3. 停止旧容器
docker-compose down

# 4. 拉取最新镜像
docker-compose pull

# 5. 构建应用镜像
docker-compose build backend frontend

# 6. 启动服务
docker-compose up -d

# 7. 等待服务就绪
echo "⏳ 等待服务启动..."
sleep 30

# 8. 健康检查
echo "🔍 执行健康检查..."

check_service() {
  local service=$1
  local url=$2
  
  if curl -f -s "$url" > /dev/null; then
    echo "✅ $service 正常"
  else
    echo "❌ $service 异常"
    exit 1
  fi
}

check_service "Backend" "http://localhost:8080/actuator/health"
check_service "Frontend" "http://localhost/"
check_service "MySQL" "http://localhost:3306"
check_service "Redis" "http://localhost:6379"
check_service "TDengine" "http://localhost:6041/rest/sql"
check_service "EMQX" "http://localhost:18083"

echo ""
echo "🎉 部署完成！"
echo ""
echo "访问地址："
echo "  - 前端: http://localhost"
echo "  - 后端 API: http://localhost:8080"
echo "  - EMQX Dashboard: http://localhost:18083 (admin/public)"
echo "  - Grafana: http://localhost:3000 (admin/admin123)"
echo "  - Prometheus: http://localhost:9090"
echo ""
echo "查看日志："
echo "  docker-compose logs -f backend"
```

---

## 📈 性能基准测试

### 测试场景

| 场景 | 并发数 | 预期 TPS | P95 延迟 |
|------|--------|---------|---------|
| 工单列表查询 | 100 | 500 | < 200ms |
| 设备数据写入 | 50 | 10000 | < 50ms |
| OEE 计算 | 10 | 100 | < 1s |
| WebSocket 推送 | 1000 | - | < 100ms |

### JMeter 测试脚本

```xml
<!-- 工单查询压力测试 -->
<ThreadGroup>
  <num_threads>100</num_threads>
  <ramp_time>10</ramp_time>
  <duration>300</duration>
  
  <HTTPSamplerProxy>
    <protocol>http</protocol>
    <domain>localhost</domain>
    <port>8080</port>
    <path>/mes/work-order/list</path>
    <method>GET</method>
  </HTTPSamplerProxy>
</ThreadGroup>
```

---

## 💡 最佳实践总结

### 1. 开发规范

- ✅ 统一使用 Lombok 简化代码
- ✅ Service 层添加 `@Transactional` 事务控制
- ✅ Controller 层添加参数校验 `@Validated`
- ✅ 敏感配置使用环境变量或配置中心
- ✅ 日志分级：ERROR（告警）、WARN（关注）、INFO（关键流程）、DEBUG（调试）

### 2. 安全加固

```nginx
# Nginx 安全头
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Content-Security-Policy "default-src 'self'";
```

```java
// SQL 注入防护（MyBatis 自动处理）
@Select("SELECT * FROM device WHERE id = #{id}")
Device selectById(@Param("id") String id);

// XSS 防护（全局过滤器）
@Component
public class XssFilter implements Filter {
    // 过滤 HTML 标签
}
```

### 3. 备份策略

```bash
#!/bin/bash
# backup.sh - 每日凌晨 2 点备份

BACKUP_DIR="/backup/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# MySQL 备份
docker exec iot-mysql mysqldump -uroot -proot123 iot_platform > $BACKUP_DIR/mysql.sql

# Redis 备份
docker exec iot-redis redis-cli -a redis123 BGSAVE

# TDengine 备份
docker exec iot-tdengine taosdump -o $BACKUP_DIR/tdengine

# 保留最近 7 天备份
find /backup -type d -mtime +7 -exec rm -rf {} \;
```

---

## 🔗 相关资源

- [Docker 官方文档](https://docs.docker.com/)
- [Prometheus 监控](https://prometheus.io/docs/introduction/overview/)
- [JMeter 性能测试](https://jmeter.apache.org/)

---

## 🎓 学习路线总结

恭喜你完成了整个工业数字化设计系列的学习！回顾一下我们覆盖的内容：

```
✅ 00-整体架构：系统分层、技术选型
✅ 01-设备接入：Modbus/S7/MQTT 协议实现
✅ 02-数据平台：TDengine 时序数据库设计
✅ 03-实时系统：WebSocket + Netty 高性能通信
✅ 04-工业可视化：SCADA 组态画面与大屏
✅ 05-业务抽象：设备模型、工单、OEE、质量追溯（核心🔥）
✅ 06-MES实现：生产、质量、物料模块落地
✅ 07-完整系统：Docker 部署、性能优化、监控告警
```

### 下一步建议

1. **实战项目**: 基于 RuoYi-Pro 搭建一个完整的 IoT + MES Lite 系统
2. **深入优化**: 学习高可用架构（主从、集群、负载均衡）
3. **扩展功能**: 集成 AI 预测性维护、数字孪生 3D 可视化
4. **行业深耕**: 了解特定行业（汽车、电子、制药）的 MES 需求

---

**祝你在工业数字化转型的道路上越走越远！🚀**
