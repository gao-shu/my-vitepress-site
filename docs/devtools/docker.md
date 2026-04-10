# Docker 快速上手

> 所属专题：[开发工具与环境配置](/devtools/)

### 5.1 安装 Docker Desktop

**Windows 安装步骤：**

1. **系统要求：**
   - Windows 10 64位（Build 19041+）
   - 启用 WSL 2 功能
   - BIOS 开启虚拟化

2. **下载安装：**
```bash
# 下载地址
https://www.docker.com/products/docker-desktop/

# 安装后验证
docker --version
docker-compose --version
```

3. **配置镜像加速（国内）：**
```json
// Docker Desktop → Settings → Docker Engine
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://registry.docker-cn.com"
  ]
}
```

### 5.2 Docker 常用命令

**容器操作：**
```bash
# 拉取镜像
docker pull nginx:latest
docker pull mysql:8.0

# 运行容器
docker run -d -p 80:80 --name my-nginx nginx
docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql:8.0

# 查看运行中的容器
docker ps
docker ps -a  # 查看所有容器

# 停止/启动容器
docker stop container_id
docker start container_id
docker restart container_id

# 删除容器
docker rm container_id
docker rm -f container_id  # 强制删除

# 查看日志
docker logs container_id
docker logs -f container_id  # 实时查看
```

**镜像操作：**
```bash
# 查看本地镜像
docker images

# 删除镜像
docker rmi image_id
docker rmi -f image_id  # 强制删除

# 构建镜像
docker build -t myapp:1.0 .

# 推送镜像
docker tag myapp:1.0 username/myapp:1.0
docker push username/myapp:1.0
```

### 5.3 Docker Compose 实战

**docker-compose.yml 示例：**
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_HOST=db
    depends_on:
      - db
    networks:
      - app-network
  
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: mydb
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - app-network

volumes:
  db-data:

networks:
  app-network:
    driver: bridge
```

**常用命令：**
```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 查看日志
docker-compose logs -f

# 重新构建并启动
docker-compose up -d --build

# 查看运行状态
docker-compose ps
```

---
