# Redis 安装配置（Windows）

## 下载安装

- 下载地址（Windows 兼容发行版）：<https://github.com/tporadowski/redis/releases>
- 选择对应系统位数的 `zip` 包，解压到本地目录（如 `D:\redis`）。

## 启动方式

```powershell
cd D:\redis
.\redis-server.exe .\redis.windows.conf
```

另开一个终端验证：

```powershell
cd D:\redis
.\redis-cli.exe
ping
```

返回 `PONG` 即正常。

## 核心配置

编辑 `redis.windows.conf`（或你的配置文件）：

```conf
bind 127.0.0.1
port 6379
requirepass your_password
appendonly yes
```

## 简单配置建议

- 开发机建议开启密码：`requirepass`。
- 建议开启 AOF：`appendonly yes`，降低异常退出丢数据风险。
- 若只本机使用，保持 `bind 127.0.0.1`，避免外网暴露。

## 常见问题（快速处理）

- 连接失败：确认 Redis 服务已启动，端口 `6379` 未被占用。
- 认证报错：先执行 `auth your_password` 再操作。
- 持久化无文件：确认已开启 `appendonly yes` 并检查目录权限。

