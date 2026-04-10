# 构建阶段：生成静态站点
FROM node:20-alpine AS builder
WORKDIR /app

# 安装依赖并构建
COPY package.json package-lock.json* ./
# 如果存在 package-lock.json，则会被使用；否则 npm 会按 package.json 解析版本
RUN npm ci --silent

COPY . .
RUN npm run build

# 生产阶段：用 nginx 运行构建产物
FROM nginx:alpine
# 将构建结果拷贝到 nginx 默认静态目录
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html

# 这行并不影响容器内部端口，只是给读者提示默认服务监听 80 端口
EXPOSE 80

# 前台启动 nginx，以便容器保持运行
CMD ["nginx", "-g", "daemon off;"]
