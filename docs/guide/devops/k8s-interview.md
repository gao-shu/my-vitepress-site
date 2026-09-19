# Kubernetes（K8s）实战与面试

目标：能讲清 K8s 解决什么问题、核心对象干什么、和 Docker Compose 怎么选；能描述一次排障/发布思路。不背全部 API。

前置：[Docker](./docker-interview) → [Docker Compose](./docker-compose-interview)。本篇盯 **编排与生产向能力**。

---

## 面试高频问法

1. K8s 是什么？和 Docker / Compose 什么关系？  
2. Pod、Deployment、Service 分别干什么？  
3. 为什么生产常用 K8s，而本地常用 Compose？  
4. 滚动更新和回滚大概怎么做？  
5. 配置和密钥怎么进容器？（ConfigMap / Secret）  
6. 探针有哪些？Readiness 和 Liveness 区别？  
7. 你实际用过 K8s 的哪些部分？（如实说边界）

---

## 口述参考（短版）

**是什么：** 容器集群的编排平台：多台机器上调度容器、管副本、做服务发现、滚动发布、自愈。

**和 Docker 关系：** Docker（或其它运行时）负责「跑容器」；K8s 负责「跑多少个、挂了怎么办、流量怎么进、怎么换版本」。

**三个必提对象：**

| 对象 | 一句话 |
|------|--------|
| **Pod** | 最小调度单元，通常一个主容器（可附带 sidecar） |
| **Deployment** | 声明期望副本数，管滚动更新/回滚 |
| **Service** | 稳定访问入口，把流量打到一组 Pod（ClusterIP / NodePort / LoadBalancer） |

**自愈：** 副本不够会拉起新 Pod；结合探针，不健康的可摘流量或重启。

**配置：** 非敏感用 ConfigMap，密码/Token 用 Secret；不要写死进镜像。

---

## K8s vs Docker Compose（面试重点）

两者都是「用声明文件描述多容器」，但定位不同：

| 维度 | Docker Compose | Kubernetes |
|------|----------------|------------|
| **主要场景** | 本地开发、联调、单机/小项目测试 | 多节点生产、测试集群、要弹性与自愈 |
| **机器规模** | 通常 **一台宿主机** | **多节点集群**（也可单节点学习） |
| **能力重心** | 快速 `up` 一整套依赖 | 调度、副本、滚动发布、服务发现、配额 |
| **扩缩容** | 基本靠改 `replicas` 或手工再起 | 声明副本；可配合 HPA 按指标扩 |
| **自愈** | `restart` 策略，能力有限 | 副本控制器 + 探针，挂了自动补 |
| **网络** | 同 compose 网络，服务名互访 | Cluster 网络 + Service / Ingress |
| **发布** | 重建容器为主 | 滚动更新、回滚是一等能力 |
| **复杂度** | 低，yml 好读 | 高，概念和运维面更大 |
| **学习/运维成本** | 低 | 要集群、权限、监控、存储、发布规范 |

### 怎么选（直接背这段）

```text
本地联调、一人项目、依赖中间件一键起
  → Docker Compose

多实例、要滚动发布/回滚、多机器、要自愈和统一调度
  → Kubernetes

小团队生产、单机 Docker + Compose/脚本也能跑
  → 先别为了「有 K8s」而上 K8s
```

> Compose 解决「环境一致性」；K8s 解决「规模化运行与发布」。面试说清边界，比假装全生产 K8s 更加分。

### 概念对照（方便迁移理解）

| Compose 里常见 | K8s 里大致对应 |
|----------------|----------------|
| `services.xxx` | Deployment / Pod 模板 |
| `ports` 映射 | Service +（可选）Ingress |
| `environment` | env / ConfigMap / Secret |
| named `volumes` | PersistentVolumeClaim（PVC） |
| `depends_on` | 不保证就绪；靠探针 + 应用重试 |
| `docker compose up` | `kubectl apply -f ...` |
| `docker compose logs` | `kubectl logs` / 集群日志方案 |
| `restart` | Deployment 副本与探针策略 |

---

## 实战：你要能讲清的最小落地

不必搭完整生产集群。面试官更关心你是否理解 **声明式** 和 **排障顺序**。

### 1）最小 Deployment + Service（示意）

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: demo
  template:
    metadata:
      labels:
        app: demo
    spec:
      containers:
        - name: app
          image: demo-app:1.0.0
          ports:
            - containerPort: 8080
          readinessProbe:
            httpGet:
              path: /actuator/health
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: demo-app
spec:
  selector:
    app: demo
  ports:
    - port: 80
      targetPort: 8080
  type: ClusterIP
```

口述：Deployment 保证 2 个副本；Service 用标签选中 Pod，集群内用服务名访问；Readiness 没通过的不进流量。

### 2）必会排查命令

```bash
kubectl get pods
kubectl get deploy,svc
kubectl describe pod <pod名>
kubectl logs <pod名> --tail=200
kubectl logs <pod名> -c <容器名>   # 多容器时
kubectl get events --sort-by=.lastTimestamp
kubectl rollout status deploy/demo-app
kubectl rollout undo deploy/demo-app
```

排障顺序（和 Docker 类似，只是对象变了）：

```text
Pod 状态 → describe 事件 → logs → 配置/镜像/探针/资源 → Service 选择器是否匹配
```

常见状态口述：`Pending`（调度/资源/拉取）、`CrashLoopBackOff`（启动失败反复重启）、`ImagePullBackOff`（镜像名/权限/仓库）。

### 3）发布与回滚（加分）

```bash
kubectl set image deploy/demo-app app=demo-app:1.0.1
kubectl rollout status deploy/demo-app
# 有问题
kubectl rollout undo deploy/demo-app
```

结合 [CI/CD](./cicd-interview)：流水线构建镜像并推仓库 → `kubectl apply` 或 GitOps 更新版本 → 看 rollout 与健康检查。

---

## 结合你简历怎么讲

有真实接触：

> 业务镜像打 tag 后进仓库；测试/生产在 K8s 用 Deployment 管副本，Service 暴露服务。发布看滚动状态和探针；异常会 `rollout undo`。本地开发仍多用 Compose 起 MySQL/Redis，不把整套中间件都塞进个人 K8s。

还在学、生产未上：

> 我清楚 Compose 和 K8s 的分工：本地 Compose，集群与滚动发布用 K8s。目前实践以 Docker/Compose 和流水线为主，K8s 在补 Deployment/Service/排查和回滚，避免为了简历硬上集群。

比编造「管过上百节点」更稳。

---

## 常见坑

| 现象 | 常见原因 |
|------|----------|
| Service 通不了 | 标签选择器与 Pod label 不一致；探针一直失败 |
| 频繁重启 | Liveness 过严 / 启动慢；应用本身 panic |
| 配置改了不生效 | 只改了 ConfigMap，Pod 没重建 |
| 本地能跑集群不行 | 镜像架构、时区、依赖服务名、资源 limit 太小 |
| 把数据库也随意丢进集群 | 有状态服务要 PVC、备份、运维规范；面试要提谨慎 |

---

## 自测清单

- [ ] 能用 1 分钟对比 Compose vs K8s，并说出各自适用场景  
- [ ] 能解释 Pod / Deployment / Service  
- [ ] 能说清 Readiness 与 Liveness 的差别  
- [ ] 知道滚动发布和 `rollout undo`  
- [ ] 能按「状态 → describe → logs」排一次 Pod 起不来  
- [ ] 能结合自己项目如实讲清：本地用啥、生产用啥  

---

## 相关

- [Docker 实战与面试](./docker-interview)  
- [Docker Compose 实战与面试](./docker-compose-interview)  
- [CI/CD 实战与面试](./cicd-interview)  
- [线上问题排查实战与面试](./monitoring-interview)
