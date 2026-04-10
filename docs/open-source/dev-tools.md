# 开发工具

本页面精选了开发过程中常用的开源工具，包括IDE插件、代码质量工具、调试工具等。

## IDE 与编辑器

### Visual Studio Code
- **VS Code**：微软开源代码编辑器
  - GitHub: [https://github.com/microsoft/vscode](https://github.com/microsoft/vscode)
  - 特点: 轻量级、插件丰富、跨平台

- **VS Code Extensions**：插件生态
  - 推荐: Python、Java、Vue、React插件

### IntelliJ IDEA 社区版
- **IntelliJ IDEA Community**：JetBrains Java IDE
  - GitHub: [https://github.com/JetBrains/intellij-community](https://github.com/JetBrains/intellij-community)
  - 功能: Java开发、插件支持

### PyCharm 社区版
- **PyCharm Community**：JetBrains Python IDE
  - GitHub: [https://github.com/JetBrains/pycharm-community](https://github.com/JetBrains/pycharm-community)
  - 功能: Python开发、科学计算

## 代码质量工具

### 代码检查
- **ESLint**：JavaScript代码检查
  - GitHub: [https://github.com/eslint/eslint](https://github.com/eslint/eslint)
  - 功能: 代码规范、错误检测

- **Prettier**：代码格式化
  - GitHub: [https://github.com/prettier/prettier](https://github.com/prettier/prettier)
  - 功能: 自动格式化、多语言支持

- **Black**：Python代码格式化
  - GitHub: [https://github.com/psf/black](https://github.com/psf/black)
  - 特点: 无配置、严格格式

### 静态分析
- **SonarQube**：代码质量检测
  - GitHub: [https://github.com/SonarSource/sonarqube](https://github.com/SonarSource/sonarqube)
  - 功能: 漏洞检测、代码异味

- **SpotBugs**：Java静态分析
  - GitHub: [https://github.com/spotbugs/spotbugs](https://github.com/spotbugs/spotbugs)
  - 功能: 缺陷检测

## 版本控制工具

### Git 增强工具
- **Git LFS**：大文件存储
  - GitHub: [https://github.com/git-lfs/git-lfs](https://github.com/git-lfs/git-lfs)
  - 功能: 大文件版本控制

- **GitHub CLI**：命令行GitHub工具
  - GitHub: [https://github.com/cli/cli](https://github.com/cli/cli)
  - 功能: PR管理、Issue处理

### Git 工作流
- **Git Flow**：分支管理模型
  - GitHub: [https://github.com/nvie/gitflow](https://github.com/nvie/gitflow)
  - 功能: 标准化分支策略

- **Conventional Commits**：提交信息规范
  - GitHub: [https://github.com/conventional-changelog/conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)
  - 功能: 标准化提交格式

## API 开发工具

### API 文档
- **Swagger/OpenAPI**：API规范
  - GitHub: [https://github.com/swagger-api/swagger-ui](https://github.com/swagger-api/swagger-ui)
  - 功能: API文档生成

- **Postman**：API测试工具
  - 功能: 接口测试、自动化测试

### API 客户端
- **Insomnia**：REST客户端
  - GitHub: [https://github.com/Kong/insomnia](https://github.com/Kong/insomnia)
  - 功能: API设计、测试

- **HTTPie**：命令行HTTP客户端
  - GitHub: [https://github.com/httpie/httpie](https://github.com/httpie/httpie)
  - 特点: 直观语法、彩色输出

## 数据库工具

### 通用工具
- **DBeaver**：通用数据库客户端
  - GitHub: [https://github.com/dbeaver/dbeaver](https://github.com/dbeaver/dbeaver)
  - 支持: MySQL、PostgreSQL、Redis等

- **TablePlus**：现代化数据库客户端
  - 功能: 多数据库支持、美观界面

### 迁移工具
- **Flyway**：数据库版本控制
  - GitHub: [https://github.com/flyway/flyway](https://github.com/flyway/flyway)
  - 功能: 数据库迁移

- **Liquibase**：数据库重构
  - GitHub: [https://github.com/liquibase/liquibase](https://github.com/liquibase/liquibase)
  - 功能: 变更管理

## 容器化工具

### Docker 工具
- **Docker Compose**：多容器应用
  - GitHub: [https://github.com/docker/compose](https://github.com/docker/compose)
  - 功能: 容器编排

- **Portainer**：Docker可视化管理
  - GitHub: [https://github.com/portainer/portainer](https://github.com/portainer/portainer)
  - 功能: Web界面管理

### Kubernetes 工具
- **kubectl**：Kubernetes命令行
  - GitHub: [https://github.com/kubernetes/kubectl](https://github.com/kubernetes/kubectl)
  - 功能: 集群管理

- **Lens**：Kubernetes IDE
  - GitHub: [https://github.com/lensapp/lens](https://github.com/lensapp/lens)
  - 功能: 可视化管理

- **k9s**：终端Kubernetes管理
  - GitHub: [https://github.com/derailed/k9s](https://github.com/derailed/k9s)
  - 特点: 键盘操作、实时监控

## 监控与日志

### 应用监控
- **Prometheus**：监控系统
  - GitHub: [https://github.com/prometheus/prometheus](https://github.com/prometheus/prometheus)
  - 功能: 指标收集、告警

- **Grafana**：可视化仪表板
  - GitHub: [https://github.com/grafana/grafana](https://github.com/grafana/grafana)
  - 功能: 数据可视化

### 日志工具
- **ELK Stack**：日志分析平台
  - Elasticsearch: [https://github.com/elastic/elasticsearch](https://github.com/elastic/elasticsearch)
  - Logstash: [https://github.com/elastic/logstash](https://github.com/elastic/logstash)
  - Kibana: [https://github.com/elastic/kibana](https://github.com/elastic/kibana)

- **Fluentd**：日志收集器
  - GitHub: [https://github.com/fluent/fluentd](https://github.com/fluent/fluentd)
  - 功能: 统一日志处理

## 性能测试工具

- **JMeter**：Apache性能测试
  - GitHub: [https://github.com/apache/jmeter](https://github.com/apache/jmeter)
  - 功能: 负载测试、压力测试

- **Locust**：Python性能测试
  - GitHub: [https://github.com/locustio/locust](https://github.com/locustio/locust)
  - 功能: 分布式测试、Web界面

- **k6**：现代性能测试
  - GitHub: [https://github.com/grafana/k6](https://github.com/grafana/k6)
  - 功能: 脚本化测试、云原生

## 安全工具

### 代码安全
- **OWASP ZAP**：Web应用安全扫描
  - GitHub: [https://github.com/zaproxy/zaproxy](https://github.com/zaproxy/zaproxy)
  - 功能: 漏洞扫描

- **SonarQube**：代码质量与安全
  - GitHub: [https://github.com/SonarSource/sonarqube](https://github.com/SonarSource/sonarqube)
  - 功能: 安全漏洞检测

### 依赖检查
- **OWASP Dependency-Check**：依赖漏洞扫描
  - GitHub: [https://github.com/jeremylong/DependencyCheck](https://github.com/jeremylong/DependencyCheck)
  - 功能: 第三方库漏洞检测

- **Snyk**：开发安全平台
  - 功能: 依赖扫描、容器安全

## CI/CD 工具

### Jenkins
- **Jenkins**：自动化服务器
  - GitHub: [https://github.com/jenkinsci/jenkins](https://github.com/jenkinsci/jenkins)
  - 功能: 持续集成、持续部署

### GitHub Actions
- **GitHub Actions**：工作流自动化
  - GitHub: [https://github.com/actions](https://github.com/actions)
  - 功能: CI/CD、自动化任务

### GitLab CI
- **GitLab Runner**：GitLab CI执行器
  - GitHub: [https://github.com/gitlabhq/gitlab-runner](https://github.com/gitlabhq/gitlab-runner)
  - 功能: 作业执行

## 文档工具

- **MkDocs**：静态站点生成器
  - GitHub: [https://github.com/mkdocs/mkdocs](https://github.com/mkdocs/mkdocs)
  - 功能: Markdown文档

- **Docusaurus**：React文档框架
  - GitHub: [https://github.com/facebook/docusaurus](https://github.com/facebook/docusaurus)
  - 功能: 现代化文档站点

- **Sphinx**：Python文档生成器
  - GitHub: [https://github.com/sphinx-doc/sphinx](https://github.com/sphinx-doc/sphinx)
  - 功能: API文档、书籍

## 调试工具

### 网络调试
- **Wireshark**：网络协议分析器
  - GitHub: [https://github.com/wireshark/wireshark](https://github.com/wireshark/wireshark)
  - 功能: 网络包分析

- **Charles**：Web调试代理
  - 功能: HTTP/HTTPS代理、移动端调试

### 内存调试
- **MAT (Memory Analyzer)**：Java堆转储分析
  - GitHub: [https://github.com/eclipse/mat](https://github.com/eclipse/mat)
  - 功能: 内存泄漏分析

- **Valgrind**：内存调试工具
  - GitHub: [https://github.com/valgrind/valgrind](https://github.com/valgrind/valgrind)
  - 功能: 内存错误检测

## 团队协作工具

- **GitLab**：DevOps平台
  - GitHub: [https://github.com/gitlabhq/gitlabhq](https://github.com/gitlabhq/gitlabhq)
  - 功能: 代码托管、CI/CD

- **Gitea**：轻量级Git服务
  - GitHub: [https://github.com/go-gitea/gitea](https://github.com/go-gitea/gitea)
  - 特点: 自托管、简单部署

- **Mattermost**：开源Slack替代品
  - GitHub: [https://github.com/mattermost/mattermost](https://github.com/mattermost/mattermost)
  - 功能: 团队沟通、文件共享