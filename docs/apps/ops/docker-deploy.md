# Docker 容器化部署实践

## 背景与问题

应用从「开发机能跑」到「服务器上稳定跑」，中间隔着一整套环境问题：开发机 JDK 17、线上 JDK 8，本地 MySQL 5.7、测试库 8.0，配置文件里写死的路径换台机器就失效。部署脚本全靠口口相传，新人接手第一件事就是翻聊天记录找「当时是怎么启的」。

更麻烦的是升级和回滚：直接在服务器上覆盖 jar 包，升坏了想退回去，发现上一版已经被删了；多个服务共用一台机器，端口冲突、日志混在一起，排查问题先花半小时搞清楚「这个进程是谁」。Docker 不能消除这些差异，但能把差异**固化成镜像**——交付物从「一堆文件 + 一份口头文档」变成「一个带版本号的镜像」，剩下的是怎么把这件事做规范。

## 方案设计

| 环节 | 工具 | 职责 |
|------|------|------|
| 构建 | Dockerfile + 多阶段构建 | 编译、测试、裁剪出最小运行镜像 |
| 编排 | docker-compose | 单机多服务的启动顺序、网络、卷、环境变量 |
| 交付 | 镜像仓库（Harbor / 云 Registry） | 版本化存储、按 tag 部署 |
| 运行 | compose up/down + 健康检查 | 滚动替换、失败自动拉起 |

关键决策：镜像按 git commit 打 tag（`latest` 只留本地开发）、数据与容器分离（容器随便删，数据在卷里）、配置分层（非敏感进 compose、敏感进 `.env` 不进 git）、部署前保留旧镜像，回滚就是换回旧 tag 重新 up。

## 关键实现

**1. 多阶段构建压体积**

Java 服务的痛是构建镜像动辄 700MB+（带 JDK、带 Maven 缓存）。多阶段构建把编译和运行拆开，运行层只留 JRE 和 jar：

```dockerfile
# 构建阶段：带 Maven，编译完就丢
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline      # 依赖层单独缓存
COPY src ./src
RUN mvn -q package -DskipTests

# 运行阶段：只要 JRE
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/app.jar app.jar
# 非 root 运行 + 健康检查，compose 里依赖它判断就绪
USER 10001
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java","-XX:MaxRAMPercentage=75","-jar","app.jar"]
```

体积能从约 700MB 降到 200MB 出头；前端同理，`node` 阶段构建、`nginx:alpine` 只拷 `dist`。另外 `.dockerignore` 必须写——`.git`、`node_modules`、本地 `.env` 不进构建上下文，既防体积膨胀也防密钥泄漏。

**2. compose 编排**

```yaml
services:
  app:
    image: registry.example.com/demo/app:1.4.2
    restart: unless-stopped
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DB_HOST: db
    env_file: .env            # 密钥类不进 compose 文件本身
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8080:8080"
  db:
    image: mysql:8.0
    volumes:
      - mysql-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      retries: 10
volumes:
  mysql-data:
```

要点：`depends_on` 带 `condition: service_healthy` 才能保证「库真的能连了再起应用」，否则应用抢跑失败直接退出循环；`restart: unless-stopped` 兜住进程级崩溃。

**3. 数据卷与备份**：数据全放 named volume，**备份不进容器**，用一次性容器把卷内容导出：

```bash
docker run --rm -v demo_mysql-data:/data -v /backup:/backup \
  alpine tar czf /backup/mysql-$(date +%F).tar.gz -C /data .
```

**4. 环境变量分层**

非敏感配置（profile、日志级别、端口）写进 compose 的 `environment`；敏感信息（数据库密码、第三方 key）放 `.env` 文件，**不进 git**（同时加进 `.dockerignore`），服务器上手工下发或从密钥管理服务拉取；同一套 compose 在 dev/prod 之间只换 `.env` 和镜像 tag，避免两套配置漂移。

**5. 升级与回滚**

```bash
# 升级：拉新镜像 -> 起新容器 -> 旧容器被替换
docker compose pull app && docker compose up -d app
# 回滚：镜像 tag 指回旧版本后重新 up 即可
docker compose up -d app
```

前提是**数据库变更向后兼容**：迁移脚本必须被旧版本容忍（只加列不删列、先发兼容代码再清旧字段），否则回滚代码也连不上库；有状态服务升级前先快照备份兜底。

## 落地效果（示意）

- 构建产物统一为带 commit tag 的镜像，环境差异问题在构建期暴露而不是上线后；多阶段构建后运行镜像体积明显下降，拉取部署从分钟级缩短到十几秒；
- 回滚从「找旧包、手工替换」变成一条命令换 tag，配合数据库兼容策略，回滚窗口可控；服务启动顺序由 healthcheck 编排，不再靠「先启库、等半分钟、再启应用」的口头流程。

（以上为方案效果示意，非生产统计数据。）

## 小结

容器化部署的收益不在于「用了 Docker」，而在于三件事：**镜像即交付物**（版本明确、可回滚）、**数据与容器解耦**（敢删敢重建）、**配置分层**（非敏感进 compose、敏感进 .env）。多阶段构建解决体积，healthcheck 解决启动顺序，数据库向后兼容解决回滚——这三点做到，单机 compose 就能覆盖大多数小团队的生产需求。
