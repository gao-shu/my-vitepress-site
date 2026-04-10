# 工具推荐

推荐一些全栈开发工程师日常工作中必需的工具及开源库。

## 集成开发环境（IDE）

### IntelliJ IDEA（推荐）
- **[官网](https://www.jetbrains.com/idea/)** - JetBrains IntelliJ IDEA
- **[下载页](https://www.jetbrains.com/idea/download/)** - 社区版/旗舰版下载
- **[官方文档](https://www.jetbrains.com/help/idea/)** - 使用文档
- **特点**: Java开发最强IDE，收费（有社区免费版）

### PyCharm（Python开发）
- **[官网](https://www.jetbrains.com/pycharm/)** - JetBrains PyCharm
- **[下载页](https://www.jetbrains.com/pycharm/download/)** - 社区版/专业版下载
- **特点**: Python开发专用IDE

### VS Code（全栈通用）
- **[官网](https://code.visualstudio.com/)** - Visual Studio Code
- **[Java扩展](https://marketplace.visualstudio.com/items?itemName=redhat.java)** - Java语言支持
- **[Python扩展](https://marketplace.visualstudio.com/items?itemName=ms-python.python)** - Python语言支持
- **[Vue扩展](https://marketplace.visualstudio.com/items?itemName=Vue.volar)** - Vue.js支持
- **[React扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)** - React/TypeScript支持
- **特点**: 轻量级，插件丰富，免费

### WebStorm（前端开发）
- **[官网](https://www.jetbrains.com/webstorm/)** - JetBrains WebStorm
- **特点**: 前端开发专用IDE

## 版本控制工具

- **[Git](https://git-scm.com/)** - 分布式版本控制
- **[GitHub](https://github.com/)** - 全球代码托管平台
- **[Gitee](https://gitee.com/)** - 国内代码托管平台
- **[GitHub Desktop](https://desktop.github.com/)** - GitHub可视化客户端

## 项目构建工具

### Java生态
- **[Maven官网](https://maven.apache.org/)** - Apache Maven
- **[中央仓库](https://mvnrepository.com/)** - Maven依赖查询
- **[阿里云镜像](https://maven.aliyun.com/mvn/view)** - 加速仓库
- **[Gradle官网](https://gradle.org/)** - Gradle构建工具

### Python生态
- **[Pip官网](https://pip.pypa.io/)** - Python包管理器
- **[Conda官网](https://docs.conda.io/)** - Conda包和环境管理器
- **[Poetry官网](https://python-poetry.org/)** - Python依赖管理工具

### Node.js生态
- **[NPM官网](https://www.npmjs.com/)** - NPM包管理器
- **[Yarn官网](https://yarnpkg.com/)** - Yarn包管理器
- **[PNPM官网](https://pnpm.io/)** - PNPM高效包管理器

### 前端构建
- **[Webpack官网](https://webpack.js.org/)** - Webpack打包工具
- **[Vite官网](https://vitejs.dev/)** - Vite快速构建工具
- **[Parcel官网](https://parceljs.org/)** - Parcel零配置打包器

## 容器与部署

- **[Docker](https://www.docker.com/)** - 容器化平台
- **[Docker Hub](https://hub.docker.com/)** - 镜像仓库
- **[Docker文档](https://docs.docker.com/)** - 使用指南
- **[Kubernetes](https://kubernetes.io/)** - 容器编排平台

## Java开源库（GitHub/Gitee）

### 数据库连接池

| 库 | GitHub | Gitee | 用途 |
|----|--------|-------|------|
| Druid | [链接](https://github.com/alibaba/druid) | [链接](https://gitee.com/dromara/druid) | 阿里数据库连接池，功能强大 |
| HikariCP | [链接](https://github.com/brettwooldridge/HikariCP) | [链接](https://gitee.com/yunju/hikaricp) | 高性能连接池，推荐 |

### JSON序列化库

| 库 | GitHub | Gitee | 用途 |
|----|--------|-------|------|
| Jackson | [链接](https://github.com/FasterXML/jackson) | [链接](https://gitee.com/anji-plus/jackson) | 功能完整，社区活跃 |
| Fastjson2 | [链接](https://github.com/alibaba/fastjson2) | [链接](https://gitee.com/dromara/fastjson2) | 阿里新一代JSON库，性能优图 |
| Gson | [链接](https://github.com/google/gson) | - | Google出品，易用稳定 |

### HTTP客户端

| 库 | GitHub | Gitee | 用途 |
|----|--------|-------|------|
| OkHttp | [链接](https://github.com/square/okhttp) | [链接](https://gitee.com/okhttp/okhttp) | Square出品，稳定高效 |
| Retrofit | [链接](https://github.com/square/retrofit) | [链接](https://gitee.com/retrofit/retrofit) | RESTful API客户端 |

### 工具库

| 库 | GitHub | Gitee | 用途 |
|----|--------|-------|------|
| Lombok | [链接](https://github.com/projectlombok/lombok) | [链接](https://gitee.com/lombok/lombok) | 消除样板代码，必装 |
| Hutool | [链接](https://github.com/dromara/hutool) | [链接](https://gitee.com/dromara/hutool) | Java工具集，国产精品 |
| Commons Lang | [链接](https://github.com/apache/commons-lang) | - | Apache通用工具库 |

### Redis客户端

| 库 | GitHub | Gitee | 用途 |
|----|--------|-------|------|
| Jedis | [链接](https://github.com/redis/jedis) | [链接](https://gitee.com/redis/jedis) | Redis官方Java客户端 |
| Lettuce | [链接](https://github.com/lettuce-io/lettuce-core) | - | 异步高性能客户端 |
| Redisson | [链接](https://github.com/redisson/redisson) | [链接](https://gitee.com/redisson/redisson) | 分布式锁实现 |

### 日志框架

| 库 | GitHub | 用途 |
|----|--------|------|
| SLF4J | [链接](https://github.com/qos-ch/slf4j) | 日志门面，必装 |
| Logback | [链接](https://github.com/qos-ch/logback) | 日志实现，推荐 |
| Log4j2 | [链接](https://github.com/apache/logging-log4j2) | 日志框架，功能强大 |

## Python开源库

### Web框架

| 库 | GitHub | 用途 |
|----|--------|------|
| Django | [链接](https://github.com/django/django) | 全功能Web框架 |
| Flask | [链接](https://github.com/pallets/flask) | 轻量级Web框架 |
| FastAPI | [链接](https://github.com/tiangolo/fastapi) | 现代API框架 |

### 数据科学

| 库 | GitHub | 用途 |
|----|--------|------|
| NumPy | [链接](https://github.com/numpy/numpy) | 科学计算基础库 |
| Pandas | [链接](https://github.com/pandas-dev/pandas) | 数据分析库 |
| Matplotlib | [链接](https://github.com/matplotlib/matplotlib) | 数据可视化 |
| Seaborn | [链接](https://github.com/mwaskom/seaborn) | 统计图表库 |

### 机器学习

| 库 | GitHub | 用途 |
|----|--------|------|
| Scikit-learn | [链接](https://github.com/scikit-learn/scikit-learn) | 经典机器学习库 |
| PyTorch | [链接](https://github.com/pytorch/pytorch) | 深度学习框架 |
| TensorFlow | [链接](https://github.com/tensorflow/tensorflow) | 深度学习框架 |

## Node.js开源库

### Web框架

| 库 | GitHub | 用途 |
|----|--------|------|
| Express | [链接](https://github.com/expressjs/express) | 经典Web框架 |
| Koa | [链接](https://github.com/koajs/koa) | 现代Web框架 |
| NestJS | [链接](https://github.com/nestjs/nest) | 企业级框架 |

### 工具库

| 库 | GitHub | 用途 |
|----|--------|------|
| Lodash | [链接](https://github.com/lodash/lodash) | 实用工具库 |
| Axios | [链接](https://github.com/axios/axios) | HTTP客户端 |
| Moment.js | [链接](https://github.com/moment/moment) | 日期处理库 |

## Vue.js生态

### 核心库

| 库 | GitHub | 用途 |
|----|--------|------|
| Vue Router | [链接](https://github.com/vuejs/router) | 官方路由管理 |
| Pinia | [链接](https://github.com/vuejs/pinia) | 官方状态管理 |
| Vue CLI | [链接](https://github.com/vuejs/vue-cli) | 项目脚手架 |

### UI组件库

| 库 | GitHub | 用途 |
|----|--------|------|
| Element Plus | [链接](https://github.com/element-plus/element-plus) | Vue3组件库 |
| Ant Design Vue | [链接](https://github.com/vueComponent/ant-design-vue) | Ant Design Vue版 |
| Vant | [链接](https://github.com/youzan/vant) | 移动端组件库 |

## React生态

### 核心库

| 库 | GitHub | 用途 |
|----|--------|------|
| React Router | [链接](https://github.com/remix-run/react-router) | 路由管理 |
| Redux | [链接](https://github.com/reduxjs/redux) | 状态管理 |
| Zustand | [链接](https://github.com/pmndrs/zustand) | 轻量状态管理 |

### UI组件库

| 库 | GitHub | 用途 |
|----|--------|------|
| Ant Design | [链接](https://github.com/ant-design/ant-design) | 企业级组件库 |
| Material-UI | [链接](https://github.com/mui/material-ui) | Material Design |
| Chakra UI | [链接](https://github.com/chakra-ui/chakra-ui) | 现代组件库 |

## 在线工具

- **[JSON在线转换](https://jsoncrack.com/)** - JSON可视化
- **[SQL格式化](https://www.sqlformat.org/)** - SQL语句格式化
- **[正则表达式测试](https://regex101.com/)** - 正则表达式在线测试
- **[代码高亮](https://highlight.hohogen.com/)** - 代码染色
- **[API测试](https://www.postman.com/)** - API接口测试工具

## 性能监控工具

- **[JProfiler](https://www.jprofiler.com/)** - Java应用性能分析器
- **[YourKit](https://www.yourkit.com/)** - Java性能分析工具
- **[async-profiler](https://github.com/async-profiler/async-profiler)** - 低开销性能测试工具

### JSON序列化库

| 库 | GitHub | Gitee | 用途 |
|----|--------|-------|------|
| Jackson | [链接](https://github.com/FasterXML/jackson) | [链接](https://gitee.com/anji-plus/jackson) | 功能完整，社区活跃 |
| Fastjson2 | [链接](https://github.com/alibaba/fastjson2) | [链接](https://gitee.com/dromara/fastjson2) | 阿里新一代JSON库，性能优图 |
| Gson | [链接](https://github.com/google/gson) | - | Google出品，易用稳定 |

### HTTP客户端

| 库 | GitHub | Gitee | 用途 |
|----|--------|-------|------|
| OkHttp | [链接](https://github.com/square/okhttp) | [链接](https://gitee.com/okhttp/okhttp) | Square出品，稳定高效 |
| Retrofit | [链接](https://github.com/square/retrofit) | [链接](https://gitee.com/retrofit/retrofit) | RESTful API客户端 |

### 工具库

| 库 | GitHub | Gitee | 用途 |
|----|--------|-------|------|
| Lombok | [链接](https://github.com/projectlombok/lombok) | [链接](https://gitee.com/lombok/lombok) | 消除样板代码，必装 |
| Hutool | [链接](https://github.com/dromara/hutool) | [链接](https://gitee.com/dromara/hutool) | Java工具集，国产精品 |
| Commons Lang | [链接](https://github.com/apache/commons-lang) | - | Apache通用工具库 |

### Redis客户端

| 库 | GitHub | Gitee | 用途 |
|----|--------|-------|------|
| Jedis | [链接](https://github.com/redis/jedis) | [链接](https://gitee.com/redis/jedis) | Redis官方Java客户端 |
| Lettuce | [链接](https://github.com/lettuce-io/lettuce-core) | - | 异步高性能客户端 |
| Redisson | [链接](https://github.com/redisson/redisson) | [链接](https://gitee.com/redisson/redisson) | 分布式锁实现 |

### 日志框架

| 库 | GitHub | 用途 |
|----|--------|------|
| SLF4J | [链接](https://github.com/qos-ch/slf4j) | 日志门面，必装 |
| Logback | [链接](https://github.com/qos-ch/logback) | 日志实现，推荐 |
| Log4j2 | [链接](https://github.com/apache/logging-log4j2) | 日志框架，功能强大 |

## 在线工具

- **[JSON在线转换](https://jsoncrack.com/)** - JSON可视化
- **[SQL格式化](https://www.sqlformat.org/)** - SQL语句格式化
- **[正则表达式测试](https://regex101.com/)** - 正则表达式在线测试
- **[Markdown编辑](https://markdown.lovejade.cn/)** - Markdown在线编辑
- **[代码高亮](https://highlight.hohogen.com/)** - 代码染色

## 性能监控工具

- **[JProfiler](https://www.jprofiler.com/)** - Java应用性能分析器
- **[YourKit](https://www.yourkit.com/)** - Java性能分析工具
- **[async-profiler](https://github.com/async-profiler/async-profiler)** - 低开销性能测试工具
