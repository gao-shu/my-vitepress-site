# 本地 PostgreSQL 安装配置（Windows）

## 下载安装

- 下载地址：<https://www.postgresql.org/download/windows/>
- 推荐：使用 `PostgreSQL Installer`（包含 pgAdmin 图形化管理工具）

## 安装步骤（最简）

1. 选择安装目录（默认 `C:\Program Files\PostgreSQL\16`）。
2. 选择组件：保留默认（Server + pgAdmin 4 + Command Line Tools）。
3. 设置数据目录（默认即可）。
4. 设置 `postgres` 超级用户密码并记住。
5. 保留默认端口 `5432`。
6. 选择区域设置（建议 `Default locale` 或 `Chinese, China`）。
7. 完成安装后，确认服务 `postgresql-x64-16` 已启动。

## 核心配置

- 配置文件路径：`C:\Program Files\PostgreSQL\16\data\postgresql.conf`
- 常用项（按需修改）：

```ini
# 监听地址（默认 localhost，如需远程访问改为 *）
listen_addresses = 'localhost'

# 端口号
port = 5432

# 最大连接数
max_connections = 100

# 共享缓冲区（建议为物理内存的 25%）
shared_buffers = 128MB

# 工作内存（单个查询可用内存）
work_mem = 4MB

# 日志配置
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d.log'
```

- 客户端认证配置：`C:\Program Files\PostgreSQL\16\data\pg_hba.conf`

```ini
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
```

修改后重启 PostgreSQL 服务生效。

## 初始化与验证

```bash
# 使用 psql 命令行工具连接
psql -U postgres -h localhost

# 或在 pgAdmin 中图形化操作
```

```sql
-- 创建数据库
CREATE DATABASE demo WITH ENCODING 'UTF8';

-- 查看所有数据库
\l

-- 切换数据库
\c demo

-- 创建表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 查看版本
SELECT version();
```

## 常用管理命令

```bash
# 启动服务
net start postgresql-x64-16

# 停止服务
net stop postgresql-x64-16

# 重启服务
net restart postgresql-x64-16

# 查看服务状态
sc query postgresql-x64-16
```

## 常见问题（快速处理）

- **端口占用**：改 `postgresql.conf` 的 `port`，或释放 `5432` 占用进程。
- **无法连接**：确认服务在运行、账号密码正确、`pg_hba.conf` 允许连接。
- **中文乱码**：创建数据库时指定 `ENCODING 'UTF8'`。
- **忘记 postgres 密码**：
  1. 修改 `pg_hba.conf`，将 `md5` 改为 `trust`
  2. 重启 PostgreSQL 服务
  3. 无需密码登录，执行 `ALTER USER postgres WITH PASSWORD '新密码';`
  4. 改回 `md5` 并重启服务
- **pgAdmin 无法连接**：确认 PostgreSQL 服务已启动，检查防火墙是否阻止 `5432` 端口。

## 学习资源

- 官方文档：<https://www.postgresql.org/docs/>
- 中文教程：<https://www.runoob.com/postgresql/postgresql-tutorial.html>
- pgAdmin 使用指南：<https://www.pgadmin.org/docs/>

