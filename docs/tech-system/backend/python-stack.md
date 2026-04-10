# Python 生态

Python 以其简洁优雅的语法和丰富的生态系统，成为后端开发、数据科学、AI应用的重要语言。

## 一、Python 基础快速入门

### 1.1 语法与核心概念
- **环境与版本**：推荐直接使用 `uv` 管理 Python 版本和虚拟环境（见文末常用工具）。  
- **基本语法**：缩进（4 空格）、注释（`#`）、`if/for/while`、`def`、`class`。  
- **数据类型**：`int / float / bool / str / list / tuple / dict / set`。  
- **控制流程**：条件判断、循环、`break/continue`、`enumerate`、`range`。  
- **函数**：位置参数、关键字参数、默认参数、`*args / **kwargs`。  
- **面向对象**：类定义、构造函数 `__init__`、继承、`super()`、魔术方法 `__str__ / __repr__`。

### 1.2 标准库（必须熟悉的几个）
- **数据结构**：`collections`（`deque、Counter、defaultdict、namedtuple`）。  
- **文件与路径**：`open`、`with` 上下文管理、`pathlib.Path`。  
- **日期时间**：`datetime`、`time`。  
- **序列化**：`json`、`pickle`（了解安全问题）。  
- **并发编程**：`threading`、`concurrent.futures`、`asyncio`（简单异步任务）。  
- **网络请求（标准库）**：`urllib.request`（真实项目多用第三方 `requests`）。

### 1.3 基础练手建议
- 写 3～5 个小脚本：
  - 批量重命名文件、简单日志分析、读取 CSV/JSON 并输出统计结果。  
  - 调用 HTTP 接口拉取数据并保存到本地。  
  - 把你 Java 面试库里的某个目录扫描成一个“目录索引”JSON。

## Web 框架

### Django
- **MTV 架构**: Model、Template、View分离
- **ORM**: 模型定义、查询API、迁移系统
- **Admin**: 自动后台管理界面
- **认证系统**: 用户模型、权限管理、会话

### Flask
- **微框架**: 核心简单、可扩展性强
- **路由系统**: URL规则、视图函数、蓝图
- **模板引擎**: Jinja2、模板继承、宏
- **扩展生态**: Flask-SQLAlchemy、Flask-Migrate

### FastAPI
- **异步支持**: async/await、并发处理
- **类型提示**: Pydantic、自动API文档
- **依赖注入**: 请求依赖、路径依赖
- **性能优化**: Uvicorn、自动序列化

### 其他框架
- **Tornado**: 异步Web框架、高并发处理
- **Sanic**: 基于uvloop的异步框架
- **Bottle**: 单文件Web框架

## 数据处理

### NumPy
- **多维数组**: ndarray、数组操作、广播
- **数学函数**: 线性代数、随机数、统计
- **性能优化**: 向量化计算、内存布局

### Pandas
- **DataFrame**: 数据结构、索引、分层索引
- **数据操作**: 选择、过滤、聚合、合并
- **时间序列**: 日期处理、重采样、时区
- **数据清洗**: 缺失值处理、异常值检测

### 数据可视化
- **Matplotlib**: 基础绘图、子图、样式设置
- **Seaborn**: 统计绘图、主题样式、美化
- **Plotly**: 交互式图表、Web集成

## 数据库集成

### SQLAlchemy
- **ORM**: 模型定义、关系映射、查询API
- **Core**: SQL表达式、连接池、事务
- **迁移**: Alembic、版本控制

### Django ORM
- **模型**: 字段类型、关系、外键
- **查询**: QuerySet API、聚合函数
- **管理器**: 自定义查询方法

### NoSQL
- **MongoDB**: PyMongo、ODM (MongoEngine)
- **Redis**: redis-py、数据类型操作
- **Elasticsearch**: elasticsearch-py、DSL查询

## 异步编程

### asyncio
- **协程**: async def、await、asyncio.run
- **任务管理**: Task、Future、事件循环
- **并发模式**: gather、wait、as_completed

### aiohttp
- **异步HTTP**: 客户端、服务端
- **WebSocket**: 双向通信、实时应用
- **中间件**: 请求处理、错误处理

### FastAPI 异步
- **异步视图**: async def endpoints
- **依赖注入**: 异步依赖、上下文管理
- **后台任务**: BackgroundTasks

## 测试

### unittest
- **测试用例**: TestCase、setUp/tearDown
- **断言方法**: assertEqual、assertRaises
- **测试发现**: 自动发现、测试运行器

### pytest
- **简洁语法**: 函数式测试、fixture
- **参数化**: @pytest.mark.parametrize
- **插件生态**: pytest-django、pytest-asyncio

### 其他测试
- **doctest**: 文档字符串测试
- **hypothesis**: 属性测试、数据生成

## 性能优化

### 代码优化
- **性能分析**: cProfile、line_profiler
- **内存优化**: memory_profiler、gc模块
- **并发优化**: multiprocessing、threading

### Cython
- **类型声明**: cdef、静态类型
- **编译优化**: 编译为C扩展
- **性能提升**: 数值计算加速

### Numba
- **JIT编译**: @jit装饰器
- **向量化**: @vectorize
- **并行计算**: @parallel

## 部署与运维

### WSGI/ASGI
- **WSGI**: Gunicorn、uWSGI、部署配置
- **ASGI**: Uvicorn、Hypercorn，部署 FastAPI 等异步服务

### 容器化
- **Docker**: 多阶段构建、Python 镜像优化（使用 `python:slim`、`uv` 官方镜像等）。  
- **Kubernetes**: Deployment、ConfigMap（中高级可选）。

### 云部署
- 轻量：Railway / Render / Fly.io / 部分国内平台——适合个人小服务。  
- 传统云：阿里云/腾讯云轻量服务器 + Docker 部署。

## 数据科学

### SciPy
- **科学计算**: 积分、优化、插值
- **信号处理**: 滤波、频谱分析
- **图像处理**: 图像变换、形态学

### Scikit-learn
- **机器学习**: 分类、回归、聚类
- **模型评估**: 交叉验证、指标计算
- **预处理**: 特征工程、数据标准化

### Jupyter
- **交互式计算**: Notebook、魔法命令
- **可视化**: matplotlib集成、widgets
- **分享**: nbconvert、JupyterHub

## Web 爬虫

### Requests
- **HTTP请求**: GET/POST、会话管理
- **认证**: Basic Auth、OAuth
- **高级功能**: 代理、SSL验证

### Beautiful Soup
- **HTML解析**: 标签选择、属性获取
- **CSS选择器**: select()、find_all()
- **文档遍历**: 父子关系、兄弟节点

### Scrapy
- **爬虫框架**: Spider、Item Pipeline
- **中间件**: 下载中间件、爬虫中间件
- **扩展**: 分布式爬取、自动限速

## API 开发

### REST API
- **设计原则**: RESTful、HTTP方法、状态码
- **序列化**: JSON、XML、自定义格式
- **文档**: Swagger/OpenAPI、自动生成

### GraphQL
- **Schema**: 类型定义、查询语言
- **解析器**: 数据获取、字段解析
- **客户端**: Apollo Client、Relay

### WebSocket
- **实时通信**: Socket.IO、WebSocket协议
- **广播**: 房间管理、命名空间
- **扩展**: 认证、错误处理

## 安全

### Web安全
- **输入验证**: 数据清洗、类型检查
- **认证**: JWT、OAuth2、会话管理
- **授权**: 角色权限、对象级权限

### 数据安全
- **加密**: hashlib、cryptography
- **密码安全**: bcrypt、scrypt
- **SSL/TLS**: HTTPS、证书验证

## 最佳实践

### 代码规范
- **PEP 8**: 代码风格、命名约定
- **类型提示**: typing模块、mypy
- **文档**: docstring、Sphinx

### 项目结构
- **包结构**: __init__.py、相对导入
- **配置管理**: 环境变量、配置文件
- **日志**: logging模块、结构化日志

### 依赖管理与 `uv` 常用操作
- **传统方式**：
  - `venv` + `pip` + `requirements.txt`。  
  - 常见问题：环境多、依赖冲突、安装速度慢。
- **推荐：使用 `uv` 统一管理 Python 与包（Rust 写的高速工具）**：
  - 安装（Windows）：
    - 参考官方文档，一般是一条安装脚本或安装包（可写一篇单独操作笔记）。
  - 常用命令（记住这几个够用）：  
    - `uv init`：初始化一个 Python 项目（自动创建虚拟环境和配置）。  
    - `uv venv`：在当前目录创建虚拟环境。  
    - `uv run main.py`：在虚拟环境中运行脚本（自动处理依赖）。  
    - `uv add fastapi uvicorn`：安装依赖并写入配置。  
    - `uv remove fastapi`：移除依赖。  
    - `uv sync`：根据配置文件同步安装依赖（类似 `npm install`）。  
  - 对你来说的好处：
    - 不用手动管理 `pip + venv` 细节，创建/切换项目更快。  
    - 安装第三方包速度更快，适合频繁试验 AI / 爬虫 / Web 小项目。