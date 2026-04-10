# 部署工具

本页面精选了应用部署相关的开源工具，包括容器化、编排、服务网格等。

## 容器化平台

### Docker
- **Docker Engine**：容器运行时
  - GitHub: [https://github.com/docker/docker](https://github.com/docker/docker)
  - 功能: 容器创建、管理

- **Docker Compose**：多容器编排
  - GitHub: [https://github.com/docker/compose](https://github.com/docker/compose)
  - 功能: 定义多容器应用

- **Docker Swarm**：Docker原生集群
  - GitHub: [https://github.com/docker/swarm](https://github.com/docker/swarm)
  - 功能: 容器集群管理

### Podman
- **Podman**：无守护进程容器工具
  - GitHub: [https://github.com/containers/podman](https://github.com/containers/podman)
  - 特点: 无需守护进程、rootless

- **Buildah**：容器镜像构建工具
  - GitHub: [https://github.com/containers/buildah](https://github.com/containers/buildah)
  - 功能: 脚本化镜像构建

## 容器编排

### Kubernetes
- **Kubernetes**：容器编排平台
  - GitHub: [https://github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes)
  - 功能: 自动化部署、扩展、管理

- **k3s**：轻量级Kubernetes
  - GitHub: [https://github.com/k3s-io/k3s](https://github.com/k3s-io/k3s)
  - 特点: 简化安装、资源占用少

- **minikube**：本地Kubernetes环境
  - GitHub: [https://github.com/kubernetes/minikube](https://github.com/kubernetes/minikube)
  - 功能: 本地开发测试

### 其他编排工具
- **Nomad**：HashiCorp工作负载编排
  - GitHub: [https://github.com/hashicorp/nomad](https://github.com/hashicorp/nomad)
  - 功能: 容器、虚拟机编排

- **Docker Swarm**：Docker原生编排
  - GitHub: [https://github.com/docker/swarm](https://github.com/docker/swarm)
  - 功能: 简单容器编排

## 服务网格

- **Istio**：服务网格平台
  - GitHub: [https://github.com/istio/istio](https://github.com/istio/istio)
  - 功能: 流量管理、安全、可观测性

- **Linkerd**：轻量级服务网格
  - GitHub: [https://github.com/linkerd/linkerd2](https://github.com/linkerd/linkerd2)
  - 特点: 简单、安全、资源效率

- **Consul**：服务发现和配置
  - GitHub: [https://github.com/hashicorp/consul](https://github.com/hashicorp/consul)
  - 功能: 服务网格、配置管理

## 云原生工具

### CNCF 项目
- **Helm**：Kubernetes包管理器
  - GitHub: [https://github.com/helm/helm](https://github.com/helm/helm)
  - 功能: 应用打包、部署

- **etcd**：分布式键值存储
  - GitHub: [https://github.com/etcd-io/etcd](https://github.com/etcd-io/etcd)
  - 功能: 配置存储、服务发现

- **CoreDNS**：DNS服务器
  - GitHub: [https://github.com/coredns/coredns](https://github.com/coredns/coredns)
  - 功能: 服务发现、DNS解析

### 存储
- **Rook**：云原生存储编排
  - GitHub: [https://github.com/rook/rook](https://github.com/rook/rook)
  - 功能: Ceph、NFS存储

- **Longhorn**：云原生分布式块存储
  - GitHub: [https://github.com/longhorn/longhorn](https://github.com/longhorn/longhorn)
  - 特点: 简单、可靠

## CI/CD 工具

### Jenkins
- **Jenkins**：自动化服务器
  - GitHub: [https://github.com/jenkinsci/jenkins](https://github.com/jenkinsci/jenkins)
  - 功能: 持续集成、部署

- **Jenkins X**：云原生CI/CD
  - GitHub: [https://github.com/jenkins-x/jx](https://github.com/jenkins-x/jx)
  - 功能: GitOps、自动化

### GitOps
- **ArgoCD**：GitOps持续交付
  - GitHub: [https://github.com/argoproj/argo-cd](https://github.com/argoproj/argo-cd)
  - 功能: 声明式部署

- **Flux**：GitOps工具包
  - GitHub: [https://github.com/fluxcd/flux2](https://github.com/fluxcd/flux2)
  - 功能: 持续部署

### 其他CI/CD
- **Drone**：容器原生CI/CD
  - GitHub: [https://github.com/harness/drone](https://github.com/harness/drone)
  - 特点: 轻量级、Docker原生

- **Tekton**：云原生CI/CD
  - GitHub: [https://github.com/tektoncd/pipeline](https://github.com/tektoncd/pipeline)
  - 功能: Kubernetes原生管道

## 配置管理

- **Ansible**：自动化配置管理
  - GitHub: [https://github.com/ansible/ansible](https://github.com/ansible/ansible)
  - 功能: 自动化部署、配置

- **Puppet**：配置管理工具
  - GitHub: [https://github.com/puppetlabs/puppet](https://github.com/puppetlabs/puppet)
  - 功能: 基础设施即代码

- **Chef**：自动化平台
  - GitHub: [https://github.com/chef/chef](https://github.com/chef/chef)
  - 功能: 基础设施自动化

## 监控与可观测性

### Prometheus 生态
- **Prometheus**：监控系统
  - GitHub: [https://github.com/prometheus/prometheus](https://github.com/prometheus/prometheus)
  - 功能: 指标收集、告警

- **Alertmanager**：告警管理
  - GitHub: [https://github.com/prometheus/alertmanager](https://github.com/prometheus/alertmanager)
  - 功能: 告警路由、分组

- **Node Exporter**：系统指标导出
  - GitHub: [https://github.com/prometheus/node_exporter](https://github.com/prometheus/node_exporter)
  - 功能: 系统监控

### 可视化
- **Grafana**：仪表板平台
  - GitHub: [https://github.com/grafana/grafana](https://github.com/grafana/grafana)
  - 功能: 数据可视化

- **Kibana**：ELK可视化
  - GitHub: [https://github.com/elastic/kibana](https://github.com/elastic/kibana)
  - 功能: 日志可视化

### 分布式追踪
- **Jaeger**：分布式追踪
  - GitHub: [https://github.com/jaegertracing/jaeger](https://github.com/jaegertracing/jaeger)
  - 功能: 请求追踪、性能分析

- **Zipkin**：分布式追踪
  - GitHub: [https://github.com/openzipkin/zipkin](https://github.com/openzipkin/zipkin)
  - 特点: 轻量级

## 服务发现

- **Consul**：服务发现和配置
  - GitHub: [https://github.com/hashicorp/consul](https://github.com/hashicorp/consul)
  - 功能: 服务注册、健康检查

- **Eureka**：Netflix服务发现
  - GitHub: [https://github.com/Netflix/eureka](https://github.com/Netflix/eureka)
  - 功能: 微服务注册中心

- **Zookeeper**：分布式协调服务
  - GitHub: [https://github.com/apache/zookeeper](https://github.com/apache/zookeeper)
  - 功能: 配置管理、分布式锁

## API 网关

- **Kong**：云原生API网关
  - GitHub: [https://github.com/Kong/kong](https://github.com/Kong/kong)
  - 功能: API管理、微服务网关

- **Traefik**：云原生边缘路由器
  - GitHub: [https://github.com/traefik/traefik](https://github.com/traefik/traefik)
  - 功能: 自动服务发现、负载均衡

- **NGINX**：高性能Web服务器
  - GitHub: [https://github.com/nginx/nginx](https://github.com/nginx/nginx)
  - 功能: 反向代理、负载均衡

## 负载均衡

- **HAProxy**：高可用负载均衡
  - GitHub: [https://github.com/haproxy/haproxy](https://github.com/haproxy/haproxy)
  - 功能: TCP/HTTP负载均衡

- **Envoy**：云原生代理
  - GitHub: [https://github.com/envoyproxy/envoy](https://github.com/envoyproxy/envoy)
  - 功能: 服务代理、API网关

- **MetalLB**：Kubernetes负载均衡
  - GitHub: [https://github.com/metallb/metallb](https://github.com/metallb/metallb)
  - 功能: 裸机负载均衡

## 安全工具

### 访问控制
- **Keycloak**：身份和访问管理
  - GitHub: [https://github.com/keycloak/keycloak](https://github.com/keycloak/keycloak)
  - 功能: SSO、身份管理

- **OAuth2 Proxy**：OAuth2反向代理
  - GitHub: [https://github.com/oauth2-proxy/oauth2-proxy](https://github.com/oauth2-proxy/oauth2-proxy)
  - 功能: 身份验证代理

### 网络安全
- **Calico**：云原生网络安全
  - GitHub: [https://github.com/projectcalico/calico](https://github.com/projectcalico/calico)
  - 功能: 网络策略、安全

- **Cilium**：eBPF网络安全
  - GitHub: [https://github.com/cilium/cilium](https://github.com/cilium/cilium)
  - 功能: 网络可见性、安全策略

## 备份与恢复

- **Velero**：Kubernetes备份恢复
  - GitHub: [https://github.com/vmware-tanzu/velero](https://github.com/vmware-tanzu/velero)
  - 功能: 集群备份、灾难恢复

- **Restic**：现代备份程序
  - GitHub: [https://github.com/restic/restic](https://github.com/restic/restic)
  - 特点: 安全、快速、开源

- **Bacula**：企业级备份
  - GitHub: [https://github.com/bacula-org/bacula](https://github.com/bacula-org/bacula)
  - 功能: 网络备份、恢复

## 应用运行时

### Java
- **OpenJDK**：开源Java平台
  - GitHub: [https://github.com/openjdk/jdk](https://github.com/openjdk/jdk)
  - 功能: Java运行时

- **GraalVM**：高性能JDK
  - GitHub: [https://github.com/oracle/graal](https://github.com/oracle/graal)
  - 功能: 多语言支持、AOT编译

### Node.js
- **Node.js**：JavaScript运行时
  - GitHub: [https://github.com/nodejs/node](https://github.com/nodejs/node)
  - 功能: 服务器端JavaScript

- **Deno**：安全JavaScript运行时
  - GitHub: [https://github.com/denoland/deno](https://github.com/denoland/deno)
  - 特点: 内置TypeScript、安全默认

### Python
- **CPython**：Python参考实现
  - GitHub: [https://github.com/python/cpython](https://github.com/python/cpython)
  - 功能: Python解释器

- **PyPy**：高性能Python
  - GitHub: [https://github.com/pypy/pypy](https://github.com/pypy/pypy)
  - 特点: JIT编译、内存效率