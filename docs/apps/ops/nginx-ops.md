# Nginx 反向代理与 HTTPS

## 背景与问题

服务一多，入口就乱了：每个应用自己绑 8080、8081、9090，对外开一堆端口，防火墙规则越加越多；HTTP 明文传输，登录接口被中间人截获只是时间问题；前端 JS/CSS 每次请求都回源，稍大的页面加载卡顿；用户报「打不开」，登录上去先猜是服务挂了、端口没开还是证书过期——排查全凭经验。Nginx 作为统一反向代理能把这些收口到一个入口：**对外只暴露 80/443，对内按域名分发到各服务**，证书、缓存、压缩、日志在入口层统一处理。但配置里每个指令都有坑，502/404 出现时知道去哪看，比会写配置更重要。

## 方案设计

入口架构：

```
客户端 ──HTTPS──▶ Nginx(443, 统一证书/静态缓存/gzip)
                     ├─ app.example.com  ──▶ 127.0.0.1:8080 (Java 后端)
                     ├─ www.example.com  ──▶ 127.0.0.1:3000 (前端)
                     └─ api.internal     ──▶ 127.0.0.1:8000 (内网服务，限 IP)
```

关键决策：

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 证书 | Let's Encrypt + certbot 自动续期 | 免费、可信，续期自动化否则 90 天必翻车 |
| 分发方式 | 按 `server_name` 域名分发 | 比端口分发可读，SSL 也只需一个入口 |
| 后端连接 | `proxy_pass` 到 127.0.0.1 | 后端不对外，防火墙少开 N 个口 |
| 静态资源 | Nginx 直接 serve + 长缓存 | 不经后端，带宽和延迟都省 |
| 上传大小 | 显式设 `client_max_body_size` | 默认 1MB，文件上传 413 的头号原因 |

## 关键实现

**1. 站点反代**：

```nginx
server {
    listen 443 ssl http2;
    server_name app.example.com;

    ssl_certificate     /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    client_max_body_size 20m;        # 按业务最大上传调

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 5s;
        proxy_read_timeout    60s;
    }
}
server {                              # HTTP 全部跳 HTTPS
    listen 80;
    server_name app.example.com;
    return 301 https://$host$request_uri;
}
```

`X-Forwarded-*` 三个头必须传——后端拿不到真实客户端 IP 和协议，日志与 HTTPS 判断都会错。

**2. 证书申请与续期**：

```bash
certbot --nginx -d app.example.com -d www.example.com   # 自动改配置并装证书
certbot renew --dry-run                                  # 验证续期可行
# crontab: 0 3 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

要点：证书 **90 天有效期**，靠 cron/systemd timer 每天跑 `renew` 自动续，续期后 reload nginx；`--dry-run` 先验证一次，别等到期前一天才发现续期脚本报错。监控上把「证书剩余天数」做成告警项，比依赖自动续期更保险。

**3. 静态资源缓存与 gzip**：

```nginx
gzip on;
gzip_types text/css application/javascript application/json image/svg+xml;
gzip_min_length 1k;
gzip_comp_level 5;

location /assets/ {                  # 带 hash 的构建产物：永久缓存
    expires 1y;
    add_header Cache-Control "public, immutable";
}
location ~* \.(html)$ {
    expires -1;                      # 入口 html 不缓存，保证发版即生效
}
```

原则：**带内容 hash 的资源长缓存，html 永不缓存**——反过来会把发版卡在浏览器缓存里。`gzip` 别压图片/PDF 这类已压缩格式，白耗 CPU。

## 落地效果（示意）

- 对外只保留 80/443 两个口，所有业务按域名分流，防火墙规则从「N 个端口」收敛到 2 个；全站 HTTPS 自动续期，上线后无需人工干预换证书；
- 静态资源命中缓存 + gzip 压缩，重复访问的资源不再回源，页面加载与带宽占用明显下降；
- 502/404 按「查 Nginx 错误日志 → 查后端存活 → 查转发配置」三步走，排查路径固定、可交接。

（以上为方案效果示意，非生产统计数据。）

## 常见问题排查

- **502 Bad Gateway**：Nginx 连不上后端。依次查：后端进程活着吗（`curl 127.0.0.1:8080`）→ 端口绑对了吗（后端只绑了 IPv6 的 `::1` 而 Nginx 转 127.0.0.1 是经典坑）→ `proxy_pass` 路径对不对（末尾带不带 `/` 语义完全不同）→ 后端超时是否太短；
- **404**：先分清是 Nginx 还是应用返回的——看 `error.log`/`access.log`，Nginx 自己 404 多半是 `root`/`try_files` 没配（前端 history 路由需要 `try_files $uri $uri/ /index.html;`），应用返回 404 则查反代路径重写；
- **413 Request Entity Too Large**：`client_max_body_size` 太小，调大即可；**504 Gateway Timeout**：后端处理超时，调 `proxy_read_timeout` 或优化慢接口。

**排查口诀**：先 `tail -f /var/log/nginx/error.log` 复现一次，再 `curl -v` 看真实响应，最后确认后端进程与端口——日志永远比猜测快。

## 小结

Nginx 入口层的四个职责：**统一反代**（域名分流、后端不对外）、**HTTPS 自动续期**（certbot + reload + 剩余天数告警）、**静态缓存与压缩**（hash 资源长缓存、html 不缓存）、**可观测**（access/error 日志按 vhost 分开）。配置本身不难，难的是出 502/404 时能靠日志在几分钟内定位——把排查三步记熟，比背配置模板有用。
