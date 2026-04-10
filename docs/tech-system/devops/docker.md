# Docker 实战学习技术（知识框架 -> 工程实践）

Docker 是容器化技术：把应用及其运行环境依赖打包成轻量、可移植的单元。学习 Docker 的关键不是“记命令”，而是建立一套清晰的模型：镜像是模板，容器是运行实例；网络与数据是容器世界里“如何互联与如何保留”的规则。

---

## 1. Docker 核心概念（知识框架）

### 1.1 镜像（Image）
- 镜像可以理解为“应用 + 依赖”的**只读模板/快照**。
- 同一个镜像可以被创建出多个容器实例，每个容器运行时拥有自己的可写层。

常见做法：
- 为镜像打标签（`tag`），例如 `myapp:dev`、`myapp:1.0.0`
- 通过 Dockerfile 构建镜像（`docker build`）

### 1.2 容器（Container）
- 容器是镜像的**运行实例**。
- 容器具有隔离的文件系统、进程空间和网络环境。
- 容器可读写（相对于镜像的只读模板），写入内容通常落在容器的可写层。

容器生命周期（理解即可）：
- 创建 -> 启动 -> 运行 -> 停止 -> 删除（可复用或重建）

### 1.3 仓库（Registry）
- 仓库是镜像的存储与分发位置。
- 常见选择：
  - Docker Hub（公共镜像）
  - 私有 Registry（团队/企业内部镜像）

典型流程：
- 拉取镜像：`docker pull`
- 推送镜像：`docker push`

### 1.4 Dockerfile
- Dockerfile 是“构建镜像的脚本/指令集”。
- Dockerfile 会被构建成一系列层（layer），最终得到镜像。

Dockerfile 常用指令（入门必须会）：
- `FROM`：基础镜像
- `WORKDIR`：工作目录
- `COPY`：拷贝文件到镜像
- `RUN`：构建时执行命令
- `EXPOSE`：声明容器内部监听端口（不等于宿主机映射端口）
- `CMD` / `ENTRYPOINT`：容器启动命令
- `ENV`：构建/运行环境变量

### 1.5 Volumes（数据卷）
- 容器的可写层适合运行时临时文件，但对于关键业务数据需要持久化。
- Volume 提供“跨容器生命周期”的数据存储能力。

常见用途：
- 数据库（MySQL/PostgreSQL）数据持久化
- 上传文件/用户生成内容持久化

### 1.6 Network（网络）
- Docker 通过网络能力让容器与容器、宿主机之间实现通信。
- 常见两类访问方式：
  - 从宿主机访问容器：端口映射（`-p host:container` 或 Compose 的 `ports`）
  - 容器之间互访：使用网络与服务名（Compose 通常会提供更顺滑的服务发现体验）

---

## 2. Docker 操作基础（命令模型）

### 2.1 容器管理命令
典型命令：
- 运行：`docker run`
- 查看运行中：`docker ps`
- 查看所有（含停止）：`docker ps -a`
- 停止：`docker stop`
- 删除：`docker rm`
- 进入容器执行命令：`docker exec -it <container> <cmd>`
- 查看日志：`docker logs <container>`

快速示例（nginx + 端口映射）：
```bash
docker run -d --name web -p 8080:80 nginx:alpine
docker ps
docker logs web
```

### 2.2 镜像管理命令
典型命令：
- 构建：`docker build`
- 拉取：`docker pull`
- 推送：`docker push`
- 镜像列表：`docker images`
- 给镜像打标签：`docker tag`

快速示例（构建镜像）：
```bash
docker build -t myapp:dev .
docker images
```

### 2.3 日志与监控（运维视角）
- 日志：`docker logs`（排查启动失败/运行报错最常用）
- 资源占用：`docker stats`（CPU/内存/网络的快速观察）

建议实践：
- 服务尽量将关键日志输出到标准输出（stdout/stderr），便于 `docker logs` 或日志采集平台抓取。

---

## 3. Docker 高级特性（工程化能力）

### 3.1 Docker Compose（多容器编排）
- Compose 用一个声明文件（`docker-compose.yml` 或 `compose.yaml`）管理多个服务。
- 你可以在一套配置中定义：
  - 服务镜像/构建方式
  - 端口映射
  - 环境变量
  - 数据卷（Volume）
  - 网络（可选）

常见目标：
- 一条命令启动整套系统（比如前端 + 后端 + 数据库）
- 可复现环境（便于团队协作与交付）

### 3.2 网络模式（理解差异）
常见网络模式（概念级理解即可）：
- `bridge`：默认模式，适合单机互联
- `host`：与宿主机共享网络栈（端口/隔离更“直接”，需要谨慎）
- `overlay`：跨主机网络（偏集群场景，例如 Swarm）

> 建议入门阶段：优先使用默认网络 + Compose 网络；等 Compose 稳定后再理解高级模式。

### 3.3 数据管理（volume / bind mount / tmpfs）
- `volume`：Docker 管理的数据卷（更适合长期持久化）
- `bind mount`：把宿主机目录挂载进容器（常用于开发环境热更新）
- `tmpfs`：临时内存文件系统（适合不需要落盘的数据）

工程选择原则：
- 生产/持久数据倾向 `volume`
- 开发联调倾向 `bind mount`
- 临时且可丢数据倾向 `tmpfs`

### 3.4 多阶段构建（Multi-stage build）
- 核心思想：构建阶段使用完整工具链，运行阶段只保留必要产物。
- 结果：最终镜像更小、攻击面更低、依赖更可控。

典型结构：
- `builder` 阶段：编译/打包
- `runtime` 阶段：拷贝构建产物并运行

### 3.5 镜像优化（缓存 + 体积）
优化点（入门必须掌握）：
- 利用构建缓存（layer cache）：让“不变的步骤”尽量排在前面
- 使用 `.dockerignore`：避免把无关大文件（如 `node_modules`、构建产物）送进构建上下文
- 分层原则：把依赖安装与业务代码拷贝分开，降低缓存失效频率

收益：
- 构建更快
- 镜像体积更小
- 更容易在 CI/CD 中稳定复现

### 3.6 健康检查与排错（Healthcheck + Logs）
- `healthcheck` 表示“服务是否可用”，不等于“容器是否在运行”。
- 搭配日志/状态信息可以快速定位：
  - 端口监听失败
  - 依赖服务不可达
  - 配置/环境变量错误

---

## 4. Docker 与 DevOps（工程落地）

### 4.1 容器化部署（CI/CD 思路）
典型流水线（概念级）：
1. 代码提交（Git）
2. CI 构建镜像（`docker build`）
3. （可选）运行测试/质量检查
4. 推送镜像到 Registry（`docker push`）
5. 部署环境拉取镜像并启动（`docker pull` + `docker run` 或 Compose）

关键能力点：
- 镜像可复现（同一提交 -> 同样构建产物）
- 环境配置可控（环境变量/配置文件/密钥管理）
- 部署可回滚（镜像版本化）

常用工具链：
- CI：Jenkins / GitHub Actions / GitLab CI
- 构建分发：Docker Hub 或私有 Registry
- 部署：服务器上的 Docker/Compose，或进入集群平台

### 4.2 Kubernetes 入门（与 Compose 的关系）
- Docker 更偏“容器运行与镜像构建”。
- Kubernetes 更偏“集群调度与编排”（把容器作为基础单元进行统一管理）。

学习建议：
- 先把 Compose 项目跑稳定（容器间通信、卷、日志都要理解）
- 再学习 Kubernetes 的 Pod/Service/Deployment 等概念，迁移成本更低

---

## 5. 建议的学习路径（技术体系下的“阶段化验收”）

你可以把本页当作“知识框架”，配合阶段化验收，形成可落地的能力：

1. Stage 1：容器入门
   - 能用 `docker run` 启动常见镜像并排查启动问题
   - 能理解端口映射与日志定位
2. Stage 2：Dockerfile 构建镜像
   - 能编写最小 Dockerfile 并完成构建-运行闭环
3. Stage 3：数据与网络
   - 能使用 Volume 持久化数据
   - 能通过 Compose 网络让服务互相通信
4. Stage 4：Compose 与交付
   - 能用 Compose 编排多服务，并输出可复现的 README
5. Stage 5：镜像优化
   - 能使用 `.dockerignore` 与 multi-stage build 做镜像体积/构建速度优化
6. Stage 6：CI/CD（可选但推荐）
   - 能在 CI 中构建并推送镜像，至少完成镜像流水线自动化

---

## 6. 常见排错速查（把问题定位到“哪一层”）

当你遇到“服务起不来/访问不了/数据不对”，优先按层排查：

### 6.1 端口/访问失败
- 先确认容器内部是否监听目标端口
- 再检查宿主机端口映射是否正确（`docker ps` / Compose 的 `ports`）
- 检查是否被防火墙或网关拦截（本地开发一般不会，但线上会）

### 6.2 容器启动失败
- 优先看日志：
  - `docker logs <container>`
- 再看容器状态（停止/退出码）：
  - `docker ps -a`

### 6.3 容器间通信失败
- Compose 场景下优先检查：
  - 服务名是否正确（用 Compose 服务名访问）
  - 环境变量/连接串是否一致（例如数据库地址、端口、账号）

---

## 7. 交付物建议（放到你的项目仓库/笔记）

为了让 Docker 学习“能用”，建议每个阶段都产出可复现的文件：
- `Dockerfile`：镜像构建脚本
- `compose.yaml` / `docker-compose.yml`：多服务编排
- `README.md`：包含启动命令、端口、环境变量说明、数据卷说明

---

如果你希望我把这一页进一步“落到你的项目模板”，你告诉我你主要用的技术栈（Java/Node/Python）和是否需要数据库（MySQL/PostgreSQL/无），我可以直接给出一个 `Dockerfile + Compose + README` 的建议骨架。

