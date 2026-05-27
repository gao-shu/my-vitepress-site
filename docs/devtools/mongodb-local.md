# 本地 MongoDB 安装配置（Windows）

## 下载安装

- 下载地址：<https://www.mongodb.com/try/download/community>
- 推荐：`MongoDB Community Server` + `MongoDB Compass`（图形化管理工具）

## 安装步骤（最简）

1. 选择 `Complete`（完整安装）或 `Custom`（自定义）。
2. 选择安装目录（默认 `C:\Program Files\MongoDB\Server\7.0`）。
3. 选择数据目录（默认 `C:\Program Files\MongoDB\Server\7.0\data`，可自定义）。
4. 选择日志目录（默认即可）。
5. **取消勾选** "Install MongoDB as a Service"（如需开机自启则勾选）。
6. 取消勾选 "Install MongoDB Compass"（如已单独下载）。
7. 完成安装。

## 核心配置

- 配置文件路径：`C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg`
- 常用配置（按需修改）：

```yaml
systemLog:
  destination: file
  path: "C:\\Program Files\\MongoDB\\Server\\7.0\\log\\mongod.log"
  logAppend: true

storage:
  dbPath: "C:\\Program Files\\MongoDB\\Server\\7.0\\data"
  journal:
    enabled: true

net:
  port: 27017
  bindIp: 127.0.0.1  # 仅本地访问，如需远程改为 0.0.0.0

# 启用认证（生产环境必须）
# security:
#   authorization: enabled
```

修改后重启 MongoDB 服务生效。

## 启动与验证

### 方式 1：作为 Windows 服务（推荐）

```bash
# 启动服务
net start MongoDB

# 停止服务
net stop MongoDB

# 查看服务状态
sc query MongoDB
```

### 方式 2：命令行手动启动

```bash
# 进入 bin 目录
cd "C:\Program Files\MongoDB\Server\7.0\bin"

# 启动 MongoDB（指定配置和数据目录）
mongod --config "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg"

# 或直接指定参数
mongod --dbpath "C:\data\db" --port 27017
```

### 连接测试

```bash
# 使用 mongosh（MongoDB Shell）连接
mongosh

# 或在 Compass 中图形化连接：mongodb://localhost:27017
```

```javascript
// 查看版本
db.version()

// 查看所有数据库
show dbs

// 切换/创建数据库
use demo

// 插入文档
db.users.insertOne({
  username: "张三",
  email: "zhangsan@example.com",
  age: 25,
  created_at: new Date()
})

// 查询文档
db.users.find()

// 创建索引
db.users.createIndex({ username: 1 }, { unique: true })
```

## 常用管理命令

```bash
# 启动服务
net start MongoDB

# 停止服务
net stop MongoDB

# 重启服务
net restart MongoDB

# 查看服务状态
sc query MongoDB

# 查看日志
type "C:\Program Files\MongoDB\Server\7.0\log\mongod.log"
```

## MongoDB Compass 使用

1. 打开 MongoDB Compass。
2. 连接字符串：`mongodb://localhost:27017`
3. 点击 "Connect"。
4. 可视化操作：
   - 查看数据库和集合
   - 执行查询和聚合
   - 查看性能指标
   - 导入/导出数据

## 常见问题（快速处理）

- **端口占用**：改 `mongod.cfg` 的 `net.port`，或释放 `27017` 占用进程。
- **无法连接**：确认 MongoDB 服务已启动、防火墙允许 `27017` 端口。
- **数据目录不存在**：手动创建目录并赋予读写权限。
- **启动失败**：查看日志文件 `mongod.log` 定位错误原因。
- **内存占用过高**：
  - 调整 `wiredTigerCacheSizeGB`（默认使用物理内存的 50%）
  - 在配置文件中添加：
    ```yaml
    storage:
      wiredTiger:
        engineConfig:
          cacheSizeGB: 2  # 限制缓存大小为 2GB
    ```
- **忘记开启认证**：
  1. 先以无认证模式启动
  2. 创建管理员用户：
     ```javascript
     use admin
     db.createUser({
       user: "admin",
       pwd: "your_password",
       roles: [{ role: "root", db: "admin" }]
     })
     ```
  3. 启用配置中的 `security.authorization: enabled`
  4. 重启 MongoDB
  5. 使用认证连接：`mongodb://admin:your_password@localhost:27017/admin`

## 学习资源

- 官方文档：<https://www.mongodb.com/docs/>
- 中文教程：<https://www.runoob.com/mongodb/mongodb-tutorial.html>
- MongoDB University（免费课程）：<https://university.mongodb.com/>
- Compass 使用指南：<https://www.mongodb.com/docs/compass/current/>

