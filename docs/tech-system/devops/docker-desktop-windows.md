# Windows 下 Docker Desktop 容器开机自启配置指南

在 Windows 开发环境中，很多开发者使用 **Docker Desktop** 来运行 Docker 容器。但与 Linux 服务器不同，Windows 下无法使用 `systemctl start docker` 来管理 Docker 服务。本指南介绍如何在 Windows 环境中设置 Docker Desktop 和容器的开机自启。

## 一、为什么 Windows 不能使用 systemctl

在 Linux 系统中，Docker 通常通过 **systemd** 管理：

```bash
systemctl start docker
systemctl enable docker
```

但 Windows 系统没有 systemd，因此：

- 无法使用 `systemctl` 命令
- Docker Desktop 会自动管理 Docker Engine
- 容器自启需要使用 Docker 的 restart 策略

**系统架构对比**：

| 维度 | Windows | Linux |
|------|---------|-------|
| 进程管理 | Windows Service / 任务计划 | systemd / init |
| Docker 启动 | Docker Desktop 应用 | docker service |
| 容器自启 | restart 策略 | restart 策略 + systemd |

## 二、Docker Desktop 开机启动配置

首先需要确保 Docker Desktop 在 Windows 登录时自动启动。

### 配置步骤

1. 打开 Docker Desktop
2. 进入 **Settings** → **General**
3. 勾选 **Start Docker Desktop when you log in**

### 启动流程

```
Windows 系统启动
        ↓
用户登录
        ↓
Docker Desktop 自动启动
        ↓
Docker Engine 启动
        ↓
容器恢复运行（根据重启策略）
```

## 三、Docker 容器自启配置

Docker 提供了 **容器重启策略**（Restart Policy）来控制容器自动启动行为。

### 推荐策略：unless-stopped

```
--restart unless-stopped
```

**含义**：只要 Docker Engine 启动，就自动恢复之前运行的容器，除非该容器被手动停止。

### 1. 创建容器时设置自动启动

**示例1：MySQL 容器**

```bash
docker run -d \
  --name mysql \
  --restart unless-stopped \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=password \
  mysql:8
```

**示例2：Redis 容器**

```bash
docker run -d \
  --name redis \
  --restart unless-stopped \
  -p 6379:6379 \
  redis:latest
```

**执行结果**：

```
Docker Desktop 启动
        ↓
Docker Engine 启动
        ↓
容器自动恢复运行
```

### 2. 修改已有容器的自动启动策略

如果容器已经创建，使用 `docker update` 命令修改：

```bash
# 修改单个容器
docker update --restart unless-stopped mysql

# 批量修改多个容器
docker update --restart unless-stopped nginx
docker update --restart unless-stopped redis
docker update --restart unless-stopped mongodb
```

### 3. 查看容器重启策略

查看特定容器的重启策略。**注意**：在 Windows 上使用 PowerShell 和 Bash 的命令不同。

#### 推荐方法：跨平台兼容

```bash
# Linux/Mac/PowerShell 都支持
docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' mysql
```

输出示例：
```
unless-stopped
```

#### Windows PowerShell 专用方法

**方法1：Complete JSON 查看（推荐）**

```powershell
docker inspect mysql | ConvertFrom-Json | Select-Object -Property @{
    Name = "RestartPolicy"
    Expression = { $_.HostConfig.RestartPolicy }
} | Format-List
```

输出示例：
```
RestartPolicy : @{Name=unless-stopped; MaximumRetryCount=0}
```

**方法2：仅查看重启策略名称**

```powershell
(docker inspect mysql | ConvertFrom-Json).HostConfig.RestartPolicy.Name
```

输出示例：
```
unless-stopped
```

**方法3：带上下文的搜索（调试用）**

```powershell
docker inspect mysql | Select-String "RestartPolicy" -Context 2
```

#### 批量查看多个容器策略

```powershell
# 查看所有容器的重启策略
foreach ($container in (docker ps -a --format "{{.Names}}")) {
    $policy = (docker inspect $container | ConvertFrom-Json).HostConfig.RestartPolicy.Name
    Write-Host "$container : $policy"
}
```

输出示例：
```
mysql : unless-stopped
redis : unless-stopped
nginx : unless-stopped
```

#### 常见问题修复

**❌ 报错**：`docker inspect mysql | Select-String RestartPolicy` 出错

**✅ 原因**：PowerShell 的管道输出问题

**✅ 解决方案**：使用上述推荐方法

## 四、Docker Compose 项目开机自启

如果项目使用 **Docker Compose** 管理多个服务，可以在 `docker-compose.yml` 中统一配置 restart 策略。

### 完整示例

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8
    restart: unless-stopped
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: password
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:latest
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:latest
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro

volumes:
  mysql_data:
  redis_data:
```

### 启动和管理

```bash
# 启动所有服务
docker compose up -d

# 查看服务状态
docker compose ps

# 停止所有服务
docker compose down

# 查看日志
docker compose logs -f
```

### Docker Compose 启动流程

```
Docker Engine 启动
        ↓
识别 docker-compose.yml
        ↓
启动所有已停止的服务
        ↓
检查依赖关系
        ↓
所有容器恢复运行
```

## 五、Docker Restart 策略详解

### 策略对比表

| 策略 | 说明 | 使用场景 | 自启 | 手动停止后 |
|------|------|---------|------|-----------|
| `no` | 不自动启动（默认） | 临时容器 | ❌ | - |
| `always` | Docker 启动就启动 | 生产环境常驻服务 | ✅ | ❌ 强制启动 |
| `unless-stopped` | 推荐策略 | 开发 / 生产环境 | ✅ | ✅ 保持停止状态 |
| `on-failure` | 仅在异常退出时重启 | 定时任务、批处理 | ❌ | - |
| `on-failure:5` | 异常退出最多重启 5 次 | 有失败重试需求 | ❌ | - |

### 为什么推荐 unless-stopped？

```
✅ 优点：
  - 自动实现容器自启
  - 手动停止的容器保持停止状态
  - 避免意外的自动启动
  
❌ always 的缺点：
  - 手动停止后仍会被强制重启
  - 可能导致生产环境混乱
```

## 六、常见问题和排查

### 问题 1：Docker Desktop 未在开机时启动

**症状**：
- Windows 重启后容器全部停止
- 需要手动打开 Docker Desktop

**排查步骤**：

```
1. 检查 Docker Desktop 启动配置
   ✓ Settings → General → Start Docker Desktop when you log in
   
2. 检查 Windows 用户权限
   ✓ 确保当前用户是管理员
   
3. 检查 Windows 启动任务
   ✓ 控制面板 → 管理工具 → 任务计划程序
```

### 问题 2：容器开机后没有启动

**潜在原因及解决**：

| 原因 | 表现 | 解决方案 |
|------|------|--------|
| 未设置 restart 策略 | 容器始终停止 | `docker update --restart unless-stopped <container>` |
| Docker Desktop 未启动 | 所有容器都停止 | 检查 Docker Desktop 启动配置 |
| 容器之前被手动停止 | 特定容器停止 | 如果使用 `always`，它会被重启 |
| 容器配置错误 | 容器启动失败 | 查看容器日志：`docker logs <container>` |

### 问题 3：容器启动但立即停止

```bash
# 检查容器日志
docker logs mysql

# 检查容器配置（跨平台）
docker inspect -f '{{.State}}' mysql

# 检查特定错误
docker ps -a  # 查看容器状态
```

**PowerShell 处理方式**：

```powershell
# 查看容器状态详情
(docker inspect mysql | ConvertFrom-Json).State | Format-List

# 查看容器启动命令和错误日志
docker logs mysql --tail 50  # 查看最后50行日志
```

### 问题 4：Windows PowerShell 命令执行错误

**症状**：
- `docker inspect mysql | Select-String RestartPolicy` 报错
- 管道输出格式错误或乱码
- JSON 解析失败

**原因**：
- PowerShell 和 Bash/Linux shell 的管道处理方式不同
- 字符编码差异

**解决方案**：

| 错误命令 | 正确命令 | 说明 |
|---------|--------|------|
| `docker inspect mysql \| grep RestartPolicy` | `docker inspect mysql \| Select-String RestartPolicy` | grep 是 Linux 命令，PS 用 Select-String |
| `docker inspect mysql \| grep -o '"Name": "[^"]*"'` | `(docker inspect mysql \| ConvertFrom-Json).HostConfig.RestartPolicy.Name` | 用 ConvertFrom-Json 解析 JSON 更可靠 |
| `docker ps -q \| xargs docker stop` | `docker ps -q \| ForEach-Object { docker stop $_ }` | xargs 是 Linux 命令，PS 用 ForEach-Object |

**完整排查命令**：

```powershell
# 1. 验证 Docker 服务状态
docker version

# 2. 列出所有容器
docker ps -a --format "{{.Names}}"

# 3. 用 JSON 格式查看特定容器
docker inspect mysql | ConvertFrom-Json | Select-Object Name, State, Config

# 4. 查看重启策略
$policy = (docker inspect mysql | ConvertFrom-Json).HostConfig.RestartPolicy
Write-Host "重启策略: $($policy.Name)"
Write-Host "最大重试次数: $($policy.MaximumRetryCount)"

# 5. 如果命令还是出错，尝试编码转换
docker inspect mysql | ConvertFrom-Json -ErrorAction Stop | Select-Object -ExpandProperty HostConfig
```

## 七、Windows 开发环境推荐架构

### 开发栈架构

```
┌─────────────────────────────────────────────┐
│         Windows 操作系统                     │
│  ┌──────────────────────────────────────┐  │
│  │       Docker Desktop                  │  │
│  │  ┌────────────────────────────────┐  │  │
│  │  │  Docker Engine                 │  │  │
│  │  │  ┌──────┐  ┌──────┐  ┌──────┐ │  │  │
│  │  │  │MySQL │  │Redis │  │Node  │ │  │  │
│  │  │  │      │  │      │  │      │ │  │  │
│  │  │  └──────┘  └──────┘  └──────┘ │  │  │
│  │  │  ┌──────┐  ┌──────┐  ┌──────┐ │  │  │
│  │  │  │nginx │  │Java  │  │Mongo │ │  │  │
│  │  │  │      │  │      │  │      │ │  │  │
│  │  │  └──────┘  └──────┘  └──────┘ │  │  │
│  │  └────────────────────────────────┘  │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### 常见开发容器清单

| 服务 | 镜像 | 用途 | 端口 |
|------|------|------|------|
| Nginx | nginx:latest | 反向代理、静态服务 | 80, 443 |
| MySQL | mysql:8 | 关系数据库 | 3306 |
| Redis | redis:latest | 缓存、会话存储 | 6379 |
| MongoDB | mongo:latest | NoSQL 数据库 | 27017 |
| Node.js | node:18 | JavaScript 运行时 | 3000+ |
| Java | openjdk:11 | Java 应用运行 | 8080+ |
| PostgreSQL | postgres:14 | 关系数据库 | 5432 |

## 八、完整的开发环境配置示例

### 项目结构

```
my-project/
├── docker-compose.yml        # Docker Compose 配置
├── nginx.conf               # Nginx 配置文件
├── Dockerfile              # 应用镜像定义
├── src/                    # 应用源代码
└── README.md
```

### docker-compose.yml 完整示例

```yaml
version: '3.8'

services:
  # 数据库层
  mysql:
    image: mysql:8
    container_name: dev-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: dev_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - dev-network

  redis:
    image: redis:7-alpine
    container_name: dev-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - dev-network

  # 应用层
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: dev-app
    restart: unless-stopped
    ports:
      - "8080:8080"
    depends_on:
      - mysql
      - redis
    environment:
      DATABASE_URL: mysql://root:root123@mysql:3306/dev_db
      REDIS_URL: redis://redis:6379
    volumes:
      - ./src:/app/src
    networks:
      - dev-network

  # 网关层
  nginx:
    image: nginx:alpine
    container_name: dev-nginx
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    networks:
      - dev-network

volumes:
  mysql_data:
  redis_data:

networks:
  dev-network:
    driver: bridge
```

### 一键启动

```bash
# 启动整个开发环境
docker compose up -d

# 验证服务运行状态
docker compose ps

# 查看实时日志
docker compose logs -f

# 停止所有服务
docker compose down
```

## 九、最佳实践总结

### ✅ 推荐做法

1. **Docker Desktop 配置**
   - 勾选 "Start Docker Desktop when you log in"
   - 定期更新 Docker Desktop

2. **容器初始化**
   - 所有生产容器使用 `--restart unless-stopped`
   - 使用 Docker Compose 统一管理服务

3. **数据持久化**
   - 重要数据使用 volume 而不是 bind mount
   - 定期备份数据卷

4. **日志管理**
   - 启用日志驱动程序
   - 定期清理旧日志

### ❌ 需要避免

- 使用 `--restart always` 导致意外启动
- 忘记设置 restart 策略
- 混合使用 Docker 命令和 Compose 管理同一容器
- 在 volume 中存储敏感信息（改用 secrets）

## 十、参考命令速查表

### Docker 基本命令

```bash
# 容器生命周期
docker create [OPTIONS] IMAGE
docker start CONTAINER
docker stop CONTAINER
docker restart CONTAINER
docker rm CONTAINER

# 容器信息
docker ps                          # 查看运行中的容器
docker ps -a                       # 查看所有容器
docker logs CONTAINER              # 查看容器日志
docker inspect CONTAINER           # 查看容器详细信息

# 更新容器策略
docker update --restart unless-stopped CONTAINER
```

### Windows PowerShell 专用命令

```powershell
# 容器信息查询（JSON 格式）
docker inspect mysql | ConvertFrom-Json | Select-Object Name, State

# 查看容器重启策略（推荐）
(docker inspect mysql | ConvertFrom-Json).HostConfig.RestartPolicy.Name

# 查看容器资源限制
(docker inspect mysql | ConvertFrom-Json).HostConfig | Select-Object CpuShares, Memory

# 查看所有容器名称
docker ps -a --format "{{.Names}}"

# 批量查看所有容器的重启策略
foreach ($container in (docker ps -a --format "{{.Names}}")) {
    $policy = (docker inspect $container | ConvertFrom-Json).HostConfig.RestartPolicy.Name
    Write-Host "$container : $policy"
}

# 查看特定容器的端口映射
(docker inspect mysql | ConvertFrom-Json).NetworkSettings.Ports

# 查看容器网络信息
(docker inspect mysql | ConvertFrom-Json).NetworkSettings.Networks

# 停止所有容器
docker ps -q | ForEach-Object { docker stop $_ }

# 删除所有停止的容器
docker ps -aq --filter "status=exited" | ForEach-Object { docker rm $_ }
```

### Bash 命令（Linux/Mac/WSL）

```bash
# 容器信息查询
docker inspect mysql | grep "RestartPolicy" -A 2

# 查看容器重启策略（跨平台）
docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' mysql

# 查看容器资源限制
docker inspect mysql | grep -E "CpuShares|Memory" -A 1

# 批量查看所有容器的重启策略
for container in $(docker ps -a --format "{{.Names}}"); do
    echo "$container: $(docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' $container)"
done

# 停止所有容器
docker stop $(docker ps -q)

# 删除所有停止的容器
docker rm $(docker ps -aq --filter "status=exited")
```

### Docker Compose 命令

```bash
# 生命周期
docker compose up -d               # 启动所有服务
docker compose down                # 停止并删除所有服务
docker compose restart             # 重启所有服务

# 信息查看
docker compose ps                  # 查看服务状态
docker compose logs -f             # 查看实时日志
docker compose exec SERVICE COMMAND # 在服务中执行命令

# 资源管理
docker compose pull                # 更新镜像
docker compose build               # 构建镜像
```

## 总结

要在 Windows 环境下实现 Docker 容器开机自启：

| 步骤 | 操作 | 命令/配置 |
|------|------|---------|
| 1 | 配置 Docker Desktop 自启 | Settings → Start Docker Desktop when you log in |
| 2 | 配置容器重启策略 | `--restart unless-stopped` |
| 3 | 使用 Docker Compose 管理 | `docker compose up -d` |
| 4 | 验证启动成功 | `docker compose ps` 或 `docker ps` |

这样即可实现：

```
Windows 开机
    ↓
用户登录
    ↓
Docker Desktop 自动启动
    ↓
Docker Engine 启动
    ↓
所有容器自动恢复运行 ✅
```
