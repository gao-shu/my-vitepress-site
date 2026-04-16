# 本地 MySQL 安装配置（Windows）

## 下载安装

- 下载地址：<https://dev.mysql.com/downloads/installer/>
- 推荐：`MySQL Installer Community`

## 安装步骤（最简）

1. 选择 `Server only`（只装服务端）或 `Developer Default`（开发全套）。
2. 保留默认端口 `3306`。
3. 设置 `root` 密码并记住。
4. 完成安装后，确认服务 `MySQL80` 已启动。

## 核心配置

- 配置文件常见路径：`C:\ProgramData\MySQL\MySQL Server 8.0\my.ini`
- 常用项（按需）：

```ini
[mysqld]
port=3306
character-set-server=utf8mb4
collation-server=utf8mb4_general_ci
```

修改后重启 MySQL 服务生效。

## 初始化与验证

```sql
CREATE DATABASE demo CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
SHOW DATABASES;
SELECT VERSION();
```

## 常见问题（快速处理）

- 端口占用：改 `my.ini` 的 `port`，或释放 `3306` 占用进程。
- 无法连接：确认 `MySQL80` 服务在运行、账号密码正确、主机是 `127.0.0.1`。
- 中文乱码：确认库/表/连接都用 `utf8mb4`。

