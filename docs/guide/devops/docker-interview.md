# Docker 实战与面试

目标：能本地跑起来常用服务，能讲清镜像/容器/卷/网络，能说一次真实踩坑。

---

## 面试高频问法

1. Docker 和虚拟机有什么区别？  
2. 镜像和容器什么关系？`docker run` 时发生了什么？  
3. 数据怎么持久化？volume 和 bind mount 怎么选？  
4. 容器里服务挂了怎么查？怎么看日志、进容器排查？  
5. 你项目里 Docker 怎么用的？（本地依赖 / 测试 / 部署）

---

## 口述参考（短版）

**区别：** 虚拟机虚拟整套系统和内核；容器共享宿主机内核，更轻、启动更快，适合打包应用和依赖。  

**镜像与容器：** 镜像是只读模板；容器是镜像跑起来的实例。改容器不自动回写镜像，要持久化靠卷或重新 build。  

**持久化：** 数据库、上传文件用 volume；开发时挂源码可用 bind mount。生产更偏向 volume + 备份策略。  

**排查顺序：** `docker ps -a` → `docker logs` → `docker exec -it ... sh` → 看端口/环境变量/配置是否写错。

---

## 实战：10 分钟最小闭环

### 1）跑一个 Redis（最常见）

```bash
docker run -d --name redis \
  -p 6379:6379 \
  --restart unless-stopped \
  redis:7
```

验证：

```bash
docker ps
docker logs redis --tail 50
```

### 2）跑一个 MySQL（注意密码和卷）

```bash
docker run -d --name mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -v mysql_data:/var/lib/mysql \
  --restart unless-stopped \
  mysql:8
```

### 3）必须会的排查命令

```bash
docker ps -a
docker logs <容器名> --tail 200
docker exec -it <容器名> sh
docker inspect <容器名>
docker stats
```

### 4）本地常用：docker compose（口述加分）

面试可以说：多服务（app + mysql + redis）用 compose 一次拉起，环境一致、减少「我机器能跑」。

---

## 结合你简历怎么讲

结合 MES / 业务系统经历，建议练成这段：

> 本地和联调环境用 Docker 起 MySQL、Redis 等依赖；关键服务配了 restart 策略，避免重启后服务没起来。出问题先看容器状态和日志，再进容器查配置和端口。

有 CI/CD 或服务器部署经验，再补一句镜像构建与发布流程。

---

## 常见坑（面试也好用）

- 端口被占用：`3306`/`6379` 冲突  
- 容器起来了但连不上：看映射端口、防火墙、是否只监听 `127.0.0.1`  
- 数据丢了：没挂卷就把容器删了  
- Windows 下路径、文件权限、Docker Desktop 未启动  

---

## 自测清单

- [ ] 能不看文档起 Redis/MySQL  
- [ ] 能用 logs/exec 定位一次启动失败  
- [ ] 能用 1 分钟讲清镜像 vs 容器 vs 卷  
- [ ] 能结合自己项目说清「我具体用 Docker 干什么」
