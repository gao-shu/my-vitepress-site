# 消息队列项目

本页面精选了消息队列相关的开源项目，包括MQ服务器、客户端、监控工具等。

## RabbitMQ

### 核心服务器
- **RabbitMQ**：开源消息代理
  - GitHub: [https://github.com/rabbitmq/rabbitmq-server](https://github.com/rabbitmq/rabbitmq-server)
  - 特点: AMQP协议、集群支持、多种语言客户端

### 管理工具
- **RabbitMQ Management Plugin**：Web管理界面
  - GitHub: [https://github.com/rabbitmq/rabbitmq-management](https://github.com/rabbitmq/rabbitmq-management)
  - 功能: 队列监控、连接管理、消息追踪

### 客户端库
- **RabbitMQ Java Client**：Java客户端
  - GitHub: [https://github.com/rabbitmq/rabbitmq-java-client](https://github.com/rabbitmq/rabbitmq-java-client)
  - 功能: AMQP协议实现

- **Pika**：Python客户端
  - GitHub: [https://github.com/pika/pika](https://github.com/pika/pika)
  - 特点: 异步支持、连接池

## Apache Kafka

### 核心服务器
- **Apache Kafka**：分布式流处理平台
  - GitHub: [https://github.com/apache/kafka](https://github.com/apache/kafka)
  - 特点: 高吞吐量、持久化、水平扩展

### 管理工具
- **Kafka Manager**：Kafka管理界面
  - GitHub: [https://github.com/yahoo/kafka-manager](https://github.com/yahoo/kafka-manager)
  - 功能: 集群管理、主题监控

- **Kafka Tool**：Kafka GUI工具
  - GitHub: [https://github.com/kafkatool/kafkatool](https://github.com/kafkatool/kafkatool)
  - 功能: 消息浏览、生产消费

### 客户端库
- **Kafka Java Client**：Java客户端
  - GitHub: [https://github.com/apache/kafka](https://github.com/apache/kafka)
  - 功能: Producer、Consumer API

- **kafka-python**：Python客户端
  - GitHub: [https://github.com/dpkp/kafka-python](https://github.com/dpkp/kafka-python)
  - 特点: 纯Python实现

## Apache RocketMQ

### 核心服务器
- **Apache RocketMQ**：分布式消息中间件
  - GitHub: [https://github.com/apache/rocketmq](https://github.com/apache/rocketmq)
  - 特点: 高可用、低延迟、万亿级消息容量

### 管理工具
- **RocketMQ Console**：管理控制台
  - GitHub: [https://github.com/apache/rocketmq-externals](https://github.com/apache/rocketmq-externals)
  - 功能: 集群监控、消息查询

### 客户端库
- **RocketMQ Java Client**：Java客户端
  - GitHub: [https://github.com/apache/rocketmq-client-java](https://github.com/apache/rocketmq-client-java)
  - 功能: 生产消费、事务消息

## Apache ActiveMQ

### 核心服务器
- **Apache ActiveMQ**：开源消息代理
  - GitHub: [https://github.com/apache/activemq](https://github.com/apache/activemq)
  - 特点: JMS支持、多种协议

### Artemis (ActiveMQ 6)
- **Apache ActiveMQ Artemis**：下一代ActiveMQ
  - GitHub: [https://github.com/apache/activemq-artemis](https://github.com/apache/activemq-artemis)
  - 特点: 高性能、非阻塞架构

## Redis 消息队列

### 基于Redis的MQ
- **Redis**：内存数据结构存储
  - GitHub: [https://github.com/redis/redis](https://github.com/redis/redis)
  - 功能: 发布订阅、列表、流

### Redis MQ库
- **Bull**：Node.js Redis队列
  - GitHub: [https://github.com/OptimalBits/bull](https://github.com/OptimalBits/bull)
  - 功能: 作业队列、延迟任务

- **RQ (Redis Queue)**：Python Redis队列
  - GitHub: [https://github.com/rq/rq](https://github.com/rq/rq)
  - 功能: 任务队列、工作者进程

## 其他消息队列

### NATS
- **NATS**：云原生消息系统
  - GitHub: [https://github.com/nats-io/nats-server](https://github.com/nats-io/nats-server)
  - 特点: 高性能、简单易用

### NSQ
- **NSQ**：实时分布式消息平台
  - GitHub: [https://github.com/nsqio/nsq](https://github.com/nsqio/nsq)
  - 特点: 分布式、无单点故障

### ZeroMQ
- **ZeroMQ**：高性能异步消息库
  - GitHub: [https://github.com/zeromq/libzmq](https://github.com/zeromq/libzmq)
  - 特点: 多种模式、跨语言支持

## 消息队列监控

### 通用监控
- **Kafka Monitor**：Kafka监控工具
  - GitHub: [https://github.com/linkedin/kafka-monitor](https://github.com/linkedin/kafka-monitor)
  - 功能: 端到端延迟监控

- **RabbitMQ Prometheus Plugin**：RabbitMQ监控
  - GitHub: [https://github.com/rabbitmq/rabbitmq-prometheus](https://github.com/rabbitmq/rabbitmq-prometheus)
  - 功能: Prometheus指标导出

### 管理平台
- **Kafdrop**：Kafka Web UI
  - GitHub: [https://github.com/obsidiandynamics/kafdrop](https://github.com/obsidiandynamics/kafdrop)
  - 功能: 主题浏览、消息查看

## 消息队列客户端

### Java
- **Spring AMQP**：Spring消息抽象
  - GitHub: [https://github.com/spring-projects/spring-amqp](https://github.com/spring-projects/spring-amqp)
  - 功能: RabbitMQ集成

- **Spring Kafka**：Spring Kafka集成
  - GitHub: [https://github.com/spring-projects/spring-kafka](https://github.com/spring-projects/spring-kafka)
  - 功能: Kafka集成

### Python
- **Celery**：分布式任务队列
  - GitHub: [https://github.com/celery/celery](https://github.com/celery/celery)
  - 支持: RabbitMQ、Redis等多种后端

### Node.js
- **Bull**：Node.js队列库
  - GitHub: [https://github.com/OptimalBits/bull](https://github.com/OptimalBits/bull)
  - 功能: Redis队列、作业调度

## 流处理框架

- **Apache Flink**：流处理框架
  - GitHub: [https://github.com/apache/flink](https://github.com/apache/flink)
  - 功能: 实时流处理、批处理

- **Apache Storm**：分布式实时计算
  - GitHub: [https://github.com/apache/storm](https://github.com/apache/storm)
  - 功能: 实时数据处理

- **Apache Spark Streaming**：Spark流处理
  - GitHub: [https://github.com/apache/spark](https://github.com/apache/spark)
  - 功能: 微批处理、实时分析