# Docker Compose 实战与面试

目标：能自己写一份多服务 `compose` 拉起本地环境，能讲清它和单容器 `docker run` 的区别，能说一次真实联调/排障经历。

单容器基础见 [Docker 实战与面试](./docker-interview)。本篇只盯 **Compose**。

---

## 面试高频问法

1. Docker Compose 解决什么问题？和 `docker run` 有什么区别？  
2. `docker-compose.yml` 里常用字段有哪些？（`services` / `ports` / `volumes` / `depends_on` / `networks`）  
3. `depends_on` 能保证依赖服务「就绪」吗？  
4. 开发和生产你会怎么用 Compose？有什么边界？  
5. 容器间怎么互相访问？服务名当主机名是什么意思？  
6. 数据怎么持久化？删 `down` 会不会丢库？  
7. 你项目里 Compose 具体管过哪些服务？

---

## 口述参考（短版）

**解决什么：** 一次定义多个容器（比如 app + MySQL + Redis），一条命令拉起整套环境，减少「我机器能跑、你机器缺依赖」。

**和 `docker run`：**  
`run` 适合单服务临时验证；Compose 适合固定组合、可复现的本地/联调环境。配置进仓库，新人 `up` 就能对齐。

**服务怎么通信：** 同一 compose 网络里，用 **服务名** 当主机名（例如 `jdbc:mysql://mysql:3306/...`），不必记容器 IP。

**depends_on：** 只保证「容器启动顺序」，**不保证** MySQL 已经 accept 连接。应用侧要有重试，或用健康检查 / wait 脚本。

**生产边界：** 很多团队生产用 K8s / 单机 docker + 编排脚本；Compose 更多在本地、测试机、小项目。面试如实说边界比吹「生产全靠 compose」更稳。

与 K8s 的系统对比见：[Kubernetes 实战与面试](./k8s-interview)。

---

## 实战：一份可直接用的最小栈

场景：本地联调 Java / 全栈常用依赖——**MySQL + Redis**（业务应用仍可在本机 IDE 跑，只把依赖容器化）。

### 1）`docker-compose.yml`

```yaml
services:
  mysql:
    image: mysql:8
    container_name: demo-mysql
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: demo
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "127.0.0.1", "-uroot", "-proot"]
      interval: 5s
      timeout: 5s
      retries: 10

  redis:
    image: redis:7
    container_name: demo-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  mysql_data:
  redis_data:
```

### 2）常用命令（必须会）

```bash
docker compose up -d
docker compose ps
docker compose logs -f mysql
docker compose logs --tail 100 redis
docker compose exec mysql mysql -uroot -proot -e "SHOW DATABASES;"
docker compose stop
docker compose down          # 停并删容器，默认保留 named volume
docker compose down -v       # 连 volume 一起删（库数据会没）
```

说明：新版 Docker CLI 用 `docker compose`（空格）；老环境可能是 `docker-compose`（连字符）。面试提一句「我用的是 Compose V2 插件」即可。

### 3）应用怎么连（口述 + 实操）

| 谁在访问 | host 怎么写 |
|----------|-------------|
| 本机 IDE / 本机 Spring Boot | `localhost:3306` / `localhost:6379`（走端口映射） |
| 同一 compose 里的另一个容器 | 服务名：`mysql:3306` / `redis:6379` |

### 4）再进一步：把应用也放进 Compose（加分）

```yaml
services:
  # ... mysql / redis 同上 ...
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/demo?useSSL=false&allowPublicKeyRetrieval=true
      SPRING_DATA_REDIS_HOST: redis
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_started
```

面试可以说：依赖用 healthcheck，业务容器 `depends_on` + `condition: service_healthy`，减少「MySQL 还没好应用就连爆」的启动失败。

---

## 结合你简历怎么讲

可按 MES / 企业业务系统真实用法练成这段：

> 本地和联调环境用 Docker Compose 统一拉起 MySQL、Redis 等依赖，配置进仓库，团队环境一致。应用开发多数在本机，连 `localhost` 映射端口；如果服务也容器化，容器之间用服务名通信。排障先 `compose ps` / `compose logs`，再 `exec` 进容器。`down` 默认保留 volume，避免误删库。

有健康检查或 CI 里 `compose up` 跑集成测试，再补一句，分值更高。

---

## 常见坑（面试也好用）

| 现象 | 常见原因 | 怎么处理 |
|------|----------|----------|
| 端口占用 | 本机已有 MySQL/Redis | 改映射 `3307:3306` 或停本机服务 |
| 应用连不上库 | 用了 `localhost` 却在容器里跑 | 容器内改用服务名 `mysql` |
| 启动瞬间连库失败 | `depends_on` 只等进程起 | 加重试 / healthcheck |
| 数据丢了 | `down -v` 或没挂 volume | 生产数据卷要备份；日常慎用 `-v` |
| Windows 路径/权限怪 | Desktop、文件共享、行尾 | 确认 Docker Desktop 已启动；卷尽量用 named volume |
| 改了 yml 不生效 | 还在跑旧容器 | `compose up -d --force-recreate` |

---

## 和单容器 Docker 的边界（防止讲混）

- **只会 `docker run`：** 能演示单个中间件  
- **会 Compose：** 能交付「一套可复现环境」——这才是团队协作和面试加分点  
- **Compose ≠ K8s：** 编排能力、调度、扩缩容不是一回事；小团队本地/单机测试用 Compose 很常见

---

## 自测清单

- [ ] 能手写一份 MySQL + Redis 的 `compose` 并 `up -d` 跑通  
- [ ] 能说清服务名访问 vs `localhost` 端口映射  
- [ ] 能解释 `depends_on` 的局限和 healthcheck 的用途  
- [ ] 知道 `down` 与 `down -v` 对数据的影响  
- [ ] 能结合自己项目用 1 分钟讲清「我用 Compose 干什么」

---

## 相关

- [Docker 实战与面试](./docker-interview)  
- [CI/CD 实战与面试](./cicd-interview)  
- [线上问题排查实战与面试](./monitoring-interview)
