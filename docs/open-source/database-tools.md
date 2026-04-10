# 数据库工具

本页面精选了数据库相关的开源工具，包括管理工具、监控工具、迁移工具等。

## MySQL 工具

### 管理工具
- **phpMyAdmin**：Web-based MySQL管理工具
  - GitHub: [https://github.com/phpmyadmin/phpmyadmin](https://github.com/phpmyadmin/phpmyadmin)
  - 功能: Web界面、SQL查询、数据库管理

- **Adminer**：轻量级数据库管理工具
  - GitHub: [https://github.com/vrana/adminer](https://github.com/vrana/adminer)
  - 特点: 单文件、支持多种数据库

- **MySQL Workbench**：官方GUI工具
  - GitHub: [https://github.com/mysql/mysql-workbench](https://github.com/mysql/mysql-workbench)
  - 功能: 数据库设计、SQL开发、服务器管理

### 命令行工具
- **mycli**：MySQL命令行客户端
  - GitHub: [https://github.com/dbcli/mycli](https://github.com/dbcli/mycli)
  - 特点: 自动补全、语法高亮

- **Percona Toolkit**：MySQL工具集
  - GitHub: [https://github.com/percona/percona-toolkit](https://github.com/percona/percona-toolkit)
  - 功能: 性能分析、数据恢复

### 监控工具
- **Prometheus MySQL Exporter**：MySQL监控导出器
  - GitHub: [https://github.com/prometheus/mysqld_exporter](https://github.com/prometheus/mysqld_exporter)
  - 功能: 指标收集、Prometheus集成

- **Percona Monitoring and Management**：数据库监控平台
  - GitHub: [https://github.com/percona/pmm](https://github.com/percona/pmm)
  - 功能: 性能监控、查询分析

## Redis 工具

### 管理工具
- **RedisInsight**：Redis可视化管理工具
  - GitHub: [https://github.com/RedisInsight/RedisInsight](https://github.com/RedisInsight/RedisInsight)
  - 功能: 数据浏览、性能监控、CLI

- **Redis Commander**：Web-based Redis管理
  - GitHub: [https://github.com/joeferner/redis-commander](https://github.com/joeferner/redis-commander)
  - 功能: 数据查看、键操作

### 命令行工具
- **iredis**：Redis命令行客户端
  - GitHub: [https://github.com/laixintao/iredis](https://github.com/laixintao/iredis)
  - 特点: 自动补全、语法高亮

### 集群工具
- **Redis Cluster Proxy**：Redis集群代理
  - GitHub: [https://github.com/RedisLabs/redis-cluster-proxy](https://github.com/RedisLabs/redis-cluster-proxy)
  - 功能: 集群负载均衡

## MongoDB 工具

### 管理工具
- **MongoDB Compass**：官方GUI工具
  - GitHub: [https://github.com/mongodb-js/compass](https://github.com/mongodb-js/compass)
  - 功能: 数据浏览、查询构建、性能分析

- **Studio 3T**：MongoDB IDE
  - GitHub: [https://github.com/Studio3T/robomongo](https://github.com/Studio3T/robomongo)
  - 功能: 查询构建、可视化编辑

- **NoSQLBooster**：MongoDB GUI工具
  - GitHub: [https://github.com/nosqlbooster/nosqlbooster](https://github.com/nosqlbooster/nosqlbooster)
  - 功能: SQL查询、导入导出

### 命令行工具
- **mongo-hacker**：MongoDB shell增强
  - GitHub: [https://github.com/TylerBrock/mongo-hacker](https://github.com/TylerBrock/mongo-hacker)
  - 功能: 语法高亮、自动补全

## PostgreSQL 工具

### 管理工具
- **pgAdmin**：PostgreSQL管理平台
  - GitHub: [https://github.com/pgadmin-org/pgadmin4](https://github.com/pgadmin-org/pgadmin4)
  - 功能: 数据库管理、查询工具

- **DBeaver**：通用数据库工具
  - GitHub: [https://github.com/dbeaver/dbeaver](https://github.com/dbeaver/dbeaver)
  - 支持: PostgreSQL、MySQL等多种数据库

### 扩展工具
- **PostGIS**：PostgreSQL地理空间扩展
  - GitHub: [https://github.com/postgis/postgis](https://github.com/postgis/postgis)
  - 功能: 地理数据处理、空间查询

## 数据库迁移工具

### 通用迁移
- **Flyway**：数据库版本控制
  - GitHub: [https://github.com/flyway/flyway](https://github.com/flyway/flyway)
  - 功能: 版本化迁移、多种数据库支持

- **Liquibase**：数据库重构工具
  - GitHub: [https://github.com/liquibase/liquibase](https://github.com/liquibase/liquibase)
  - 功能: 变更日志、回滚支持

### 数据迁移
- **pgloader**：PostgreSQL数据加载器
  - GitHub: [https://github.com/dimitri/pgloader](https://github.com/dimitri/pgloader)
  - 功能: 数据迁移、格式转换

## 数据库备份工具

- **mysqldump**：MySQL官方备份工具
  - 功能: 逻辑备份、恢复

- **pg_dump**：PostgreSQL备份工具
  - 功能: 数据库备份、恢复

- **mongodump**：MongoDB备份工具
  - 功能: BSON格式备份

## 性能分析工具

### MySQL
- **MySQLTuner**：MySQL性能调优脚本
  - GitHub: [https://github.com/major/MySQLTuner-perl](https://github.com/major/MySQLTuner-perl)
  - 功能: 配置建议、性能分析

- **pt-query-digest**：MySQL查询分析
  - GitHub: [https://github.com/percona/percona-toolkit](https://github.com/percona/percona-toolkit)
  - 功能: 慢查询分析

### Redis
- **redis-benchmark**：Redis性能测试
  - 功能: 基准测试、性能评估

### 通用工具
- **sysbench**：多线程基准测试工具
  - GitHub: [https://github.com/akopytov/sysbench](https://github.com/akopytov/sysbench)
  - 功能: CPU、内存、I/O、数据库测试

## 数据库代理

- **ProxySQL**：MySQL代理
  - GitHub: [https://github.com/sysown/proxysql](https://github.com/sysown/proxysql)
  - 功能: 读写分离、连接池、查询路由

- **MaxScale**：数据库代理
  - GitHub: [https://github.com/mariadb-corporation/MaxScale](https://github.com/mariadb-corporation/MaxScale)
  - 支持: MySQL、MariaDB

## 数据库中间件

- **ShardingSphere**：分布式数据库中间件
  - GitHub: [https://github.com/apache/shardingsphere](https://github.com/apache/shardingsphere)
  - 功能: 数据分片、读写分离

- **MyCat**：MySQL分库分表中间件
  - GitHub: [https://github.com/MyCATApache/Mycat-Server](https://github.com/MyCATApache/Mycat-Server)
  - 功能: 分库分表、读写分离

## 数据库连接池

- **HikariCP**：高性能JDBC连接池
  - GitHub: [https://github.com/brettwooldridge/HikariCP](https://github.com/brettwooldridge/HikariCP)
  - 特点: 快速、轻量级

- **Druid**：阿里数据库连接池
  - GitHub: [https://github.com/alibaba/druid](https://github.com/alibaba/druid)
  - 功能: 监控、SQL解析