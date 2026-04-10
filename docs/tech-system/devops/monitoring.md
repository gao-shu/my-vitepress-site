# Prometheus & Grafana 应用监控

Prometheus 是一个开源的时序数据库和监控告警系统，Grafana 是数据可视化和监控平台。结合使用可以构建完整的应用监控解决方案。

## Prometheus 基础

### 核心特性
- **时序数据库**: 高效存储、快速查询、数据压缩
- **Pull 模型**: 主动抓取指标、可靠性高、防止丢失
- **多维标签**: 灵活查询、聚合、分组统计
- **PromQL**: 强大查询语言、数据处理、图表绘制

### 系统架构
```
Target (暴露指标)
   ↓
Prometheus Server (抓取、存储)
   ↓
AlertManager (告警处理)
   ↓
Grafana (可视化) or 钉钉/邮件 (告警通知)
```

### 指标类型
- **Counter**: 单调递增、请求数、错误数
- **Gauge**: 可增可减、内存使用、CPU 使用率
- **Histogram**: 观测值分布、请求延迟、响应大小
- **Summary**: 百分位数、P95、P99、响应时间

## Metrics 采集

### 应用埋点
- **Prometheus Client**: 官方库、自定义指标、Java/Python/Go
- **Micrometer**: Spring Boot 标准建议、多后端支持
- **OpenMetrics**: 标准化格式、生态兼容

### 常见指标
```
# HTTP 请求
- http_requests_total          # 请求总数
- http_request_duration_seconds # 请求延迟
- http_request_size_bytes       # 请求大小

# 应用业务
- business_orders_total        # 订单总数
- business_revenue_total       # 收入总额
- business_user_active         # 活跃用户

# 系统资源
- process_cpu_seconds_total    # CPU 时间
- process_resident_memory_bytes # 内存使用
- process_open_fds             # 打开文件数
```

## PromQL 查询

### 基础查询
```promql
# 查询当前值
up                             # 所有服务状态
prometheus_http_requests_total # HTTP 请求数

# 条件查询
up{job="mysql"}               # MySQL 状态
http_requests_total{code="200"} # 200 响应

# 标签匹配
{job=~"api.*"}               # 正则匹配
{method!="GET"}              # 不等于
```

### 高级查询
```promql
# 时间范围查询
rate(http_requests_total[5m]) # 5 分钟请求速率

# 聚合操作
sum(up)                       # 求和
avg(node_cpu_seconds_total)   # 求平均
topk(5, ...)                  # 前 5 大值

# 算术运算
(a + b) / count               # 表达式计算
```

## Grafana 可视化

### 仪表板设计
- **Panel**: 图表、数据表、统计、热力图
- **变量**: 动态筛选、下拉列表、日期选择
- **告警**: 条件设置、通知渠道、测试告警

### 常用图表
- **Graph**: 时间线图表、趋势分析
- **Stat**: 数值展示、KPI、单个指标
- **Table**: 数据表格、多维数据、排序筛选
- **Heat Map**: 热力图、分布分析

### 仪表板共享
- **导出**: JSON 导出、版本管理
- **分享**: 公开链接、权限控制
- **备份**: 定期导出、灾难恢复

## 告警规则

### 告警规则定义
```yaml
groups:
- name: examples
  interval: 30s
  rules:
  - alert: HighErrorRate
    expr: rate(errors_total[5m]) > 0.05
    for: 5m
    annotations:
      summary: "错误率过高"
      description: "{{ $value | humanizePercentage }} 错误率"
```

### 告警阶段
- **Alert**: 条件触发、发送到 AlertManager
- **AlertManager**: 去重、分组、抑制、静默
- **通知**: Email、Slack、钉钉、PagerDuty

### 告警管理
- **分组**: 按相同的 group labels 分组通知
- **路由**: 不同告警发往不同渠道
- **抑制**: 高优先级告警压制低优先级
- **静默**: 临时忽略告警、维护期间

## 最佳实践

### 指标设计
- **命名规范**: `{namespace}_{subsystem}_{name}_{unit}`
- **标签策略**: 低基数标签、避免 ID 标签、分组维度
- **指标粒度**: 适度采集、避免高基数爆炸

### 监控策略
- **RED 方法**: Rate (速率)、Errors (错误)、Duration (延迟)
- **USE 方法**: Utilization (利用率)、Saturation (饱和度)、Errors (错误)
- **关键指标**: 对业务影响大、可行动、清晰阈值

### 成本优化
- **保留期**: 默认 15 天、成本与精度权衡
- **采样**: 高频指标采样、标签优化
- **轮转**: 热数据快存储、冷数据归档

## 故障排查

### 常见问题
- **内存占用高**: 标签基数多、采集重复、保留期长
- **查询慢**: 表达式复杂、数据量大、范围太长
- **告警风暴**: 阈值太敏感、规则配置不当

### 调试方法
- **TSDB 指标**: Prometheus 自身指标、性能分析
- **查询分析**: 使用 explain 分析、性能优化
- **告警验证**: AlertManager 日志、规则测试

## 与其他工具集成

### ELK Stack
- Prometheus 采集度量、ELK 采集日志
- 组合使用、更完整的可观测性

### Jaeger 链路追踪
- 分布式追踪、服务调用链
- 与监控、日志三位一体

### 扩展生态
- kubernetes Plugin: 自动发现、标签自动化
- 第三方导出器: 数据库、缓存、中间件
