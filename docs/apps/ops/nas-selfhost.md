# NAS 自托管服务

## 背景与问题

个人和小团队手里往往攒了一堆「订阅税」：网盘会员、密码管理订阅、笔记同步、相册备份、影视库……每个月几十上百块，数据还都放在别人服务器上。与此同时家里或办公室躺着一台 NAS——闲置的盘、稳定的内网、7x24 开机的电源，正好是自托管的天然载体。

但真上手后会发现两件事：一是**服务选型杂**，awesome-selfhost 里几千个项目，很多是玩具级，跑起来没人维护；二是**内网服务直接暴露公网等于裸奔**——NAS 上跑着全家的照片和文件，一个弱密码或未授权接口就是事故。

所以自托管的重心不是「把容器起起来」，而是三件事：**选对服务、管好数据、收好入口**。

## 方案设计

按需求分层选型，每类只留一个主力：

| 需求 | 首选 | 备注 |
|------|------|------|
| 网盘/文件同步 | Nextcloud 或 Seafile | Seafile 轻快，Nextcloud 生态全 |
| 密码管理 | Vaultwarden | 官方 Bitwarden 的 Rust 实现，资源占用极小 |
| 笔记/知识库 | 语雀替代可选 AppFlowy / Logseq | 按是否需要多人协作定 |
| 相册备份 | Immich | 手机自动备份 + 人脸识别，Google 相册替代 |
| 影视库 | Jellyfin / Plex | 只在有转码需求时上硬件转码 |
| 监控/反代 | Uptime Kuma + Nginx/Caddy | 自托管服务自己也要被监控 |
| 下载 | qBittorrent | 配合限量与限速，别吃满上行 |

选型原则：**活跃维护（近 3 个月有提交）、有 Docker 镜像、社区规模够大**——个人项目断更后连安全补丁都没人打。

部署架构统一为：**Docker Compose 起服务 → Nginx/Caddy 反代 → 公网仅暴露 443 → 备份脚本定期快照**。

## 关键实现

**1. compose 编排**（以 Vaultwarden + Immich 为例的结构）：

```yaml
services:
  vaultwarden:
    image: vaultwarden/server:latest
    restart: unless-stopped
    environment:
      DOMAIN: https://vault.example.com
      SIGNUPS_ALLOWED: "false"        # 关闭公开注册
    volumes:
      - vw-data:/data
  immich-server:
    image: ghcr.io/immich-app/immich-server:release
    volumes:
      - ./upload:/usr/src/app/upload  # 照片本体，必须是 NAS 大盘
      - /etc/localtime:/etc/localtime:ro
    env_file: .env
volumes:
  vw-data:
```

注意 `latest` 只用于这种升级频繁的自托管服务，且**升级前先备份卷**；数据库类服务（Immich 的 PostgreSQL）固定小版本，不要随手 major 升级。

**2. 外网访问与安全**，按成本从低到高三种方案：

- **Cloudflare Tunnel**（推荐）：NAS 主动向外连，不暴露路由器端口，免费、自带 CDN 和 Access 访问控制，家庭宽带没有公网 IP 也能用；
- **Tailscale/WireGuard 组网**：设备级内网穿透，管理类服务（NAS 后台、监控）只给信任设备访问，最安全；
- **公网 IP + 端口转发**：仅在必须给陌生人访问时用，且只转发 443 一个口。

无论哪种方案，底线配置是：全站 HTTPS、登录开启 2FA、失败登录限速、**非 Web 的管理端口（SSH、数据库）绝不进反代也不对公网**、系统和镜像定期更新。Docker 端口绑定写成 `127.0.0.1:8080:8080` 而不是 `0.0.0.0`，确保服务只能经反代到达。

**3. 备份策略**，遵循 **3-2-1**：3 份副本、2 种介质、1 份异地。

```bash
# 示例：每日备份关键卷 + 数据库 dump，推到异地
docker run --rm -v vw-data:/data -v /backup:/b alpine \
  tar czf /b/vw-$(date +%F).tar.gz -C /data .
restic backup /backup --repo s3:s3.amazonaws.com/my-nas-backup
restic forget --keep-daily 7 --keep-weekly 4 --keep-monthly 6 --prune
```

关键点：**密码库、照片、配置 `.env` 是必备份项**；备份要用 `restic`/`borg` 这类去重加密工具而不是裸 cp，异地可以是对象存储或另一台机器；每季度做一次**恢复演练**——从备份完整恢复一个服务跑起来，没验证过的备份不算数。

## 落地效果（示意）

- 网盘、密码、相册等高频服务迁到自托管后，订阅支出收敛为一次性硬件成本，数据留在自己手里；
- 统一 compose 管理，服务清单、数据卷、端口一目了然，新设备接入或灾难重建按 compose 重放即可；
- 走 Tunnel/组网方案后路由器零端口暴露，公网扫描探测不到入口；
- 备份 + 定期恢复演练，即使硬盘损坏，核心数据可在小时级恢复。

（以上为方案效果示意，非生产统计数据。）

## 小结

NAS 自托管的公式是：**活跃项目 + compose 编排 + 隐藏入口 + 可验证的备份**。选型看维护状态，部署看数据卷归置，访问走 Tunnel/VPN 不裸露端口，备份强调异地与演练。做到这四条，自托管就从「折腾玩具」变成能托付数据的基础设施。
