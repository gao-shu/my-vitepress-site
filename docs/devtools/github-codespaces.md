# GitHub Codespaces

> 所属专题：[开发工具与环境配置](/devtools/)

GitHub Codespaces 是基于云的开发环境，让你在浏览器或 VS Code 中即可获得完整的编码体验。无需本地配置环境，开箱即用，特别适合快速启动项目、远程协作和统一团队开发环境。

## 1. 什么是 Codespaces？

### 核心特性

- ☁️ **云端环境**：在 Azure 云服务器上运行完整的 VS Code 环境
- ⚡ **秒级启动**：30 秒内即可进入开发状态
- 🔧 **预配置环境**：通过 `devcontainer.json` 定义开发环境
- 💻 **多端访问**：支持浏览器、VS Code Desktop、JetBrains IDE
- 🔄 **自动同步**：与 GitHub 仓库无缝集成，代码实时同步
- 📦 **资源弹性**：根据需求选择不同配置的机器（2核到32核）

### 适用场景

- 🚀 **快速上手新项目**：无需安装依赖，点击即开
- 👥 **团队协作**：统一的开发环境，避免"在我机器上能跑"问题
- 🌍 **远程开发**：在任何设备上继续工作
- 🎓 **教学演示**：学生无需配置环境即可开始编程
- 🔒 **安全隔离**：敏感项目在云端运行，不暴露本地环境

## 2. 快速开始

### 前置条件

- ✅ GitHub 账号（免费用户每月 60 小时免费额度）
- ✅ 一个 GitHub 仓库
- ✅ 浏览器或 VS Code Desktop

### 创建第一个 Codespace

#### 方式一：从 GitHub 网页创建

1. 进入目标仓库页面
2. 点击绿色 **Code** 按钮
3. 切换到 **Codespaces** 标签
4. 点击 **Create codespace on main**
5. 等待环境初始化（约 30-60 秒）
6. 自动打开基于浏览器的 VS Code

#### 方式二：从 VS Code 创建

1. 安装 [GitHub Codespaces](https://marketplace.visualstudio.com/items?itemName=GitHub.codespaces) 扩展
2. 按 `Ctrl+Shift+P`（或 `Cmd+Shift+P`）打开命令面板
3. 输入 `Codespaces: Create New Codespace`
4. 选择仓库和分支
5. 选择机器类型（默认即可）
6. 等待环境就绪

#### 方式三：使用命令行

```bash
# 安装 GitHub CLI
gh codespace create -r owner/repo -b main

# 列出所有 Codespaces
gh codespace list

# 连接到现有 Codespace
gh codespace code -c <codespace-name>
```

## 3. 环境配置

### devcontainer.json 基础配置

在项目根目录创建 `.devcontainer/devcontainer.json` 文件：

```json
{
  "name": "Java Spring Boot Project",
  "image": "mcr.microsoft.com/devcontainers/java:17",
  "features": {
    "ghcr.io/devcontainers/features/java:1": {
      "version": "17",
      "installMaven": true,
      "installGradle": false
    },
    "ghcr.io/devcontainers/features/docker-in-docker:2": {},
    "ghcr.io/devcontainers/features/node:1": {
      "version": "18"
    }
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "vscjava.vscode-java-pack",
        "vmware.vscode-spring-boot",
        "redhat.vscode-yaml",
        "esbenp.prettier-vscode"
      ],
      "settings": {
        "java.configuration.runtimes": [
          {
            "name": "JavaSE-17",
            "path": "/usr/local/sdkman/candidates/java/current"
          }
        ]
      }
    }
  },
  "forwardPorts": [8080, 3306],
  "postCreateCommand": "mvn clean install -DskipTests"
}
```

### 常用配置项说明

| 配置项 | 说明 | 示例 |
|--------|------|------|
| `image` | 基础镜像 | `mcr.microsoft.com/devcontainers/java:17` |
| `dockerFile` | 自定义 Dockerfile | `Dockerfile` |
| `features` | 预装工具 | Java、Node.js、Docker 等 |
| `extensions` | VS Code 扩展 | 语言支持、主题、调试器等 |
| `forwardPorts` | 端口转发 | `[8080, 3000]` |
| `postCreateCommand` | 创建后执行的命令 | `npm install` 或 `mvn install` |

### 自定义 Dockerfile

对于复杂项目，可以创建自定义 Dockerfile：

```dockerfile
FROM mcr.microsoft.com/devcontainers/java:17

# 安装额外工具
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    postgresql-client \
    redis-tools \
    && rm -rf /var/lib/apt/lists/*

# 安装 Maven
RUN curl -fsSL https://apache.osuosl.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz | tar xzf - -C /opt \
    && ln -s /opt/apache-maven-3.9.6/bin/mvn /usr/local/bin/mvn

# 设置工作目录
WORKDIR /workspace

# 复制依赖文件（利用 Docker 缓存）
COPY pom.xml .
RUN mvn dependency:go-offline

# 复制源代码
COPY . .

# 构建项目
RUN mvn clean package -DskipTests
```

对应的 `devcontainer.json`：

```json
{
  "name": "Custom Java Environment",
  "build": {
    "dockerfile": "Dockerfile"
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "vscjava.vscode-java-pack"
      ]
    }
  }
}
```

## 4. 核心功能

### 代码编辑与调试

- **完整 VS Code 体验**：支持所有扩展和功能
- **智能提示**：基于项目的语言服务器提供代码补全
- **断点调试**：支持 Java、Python、Node.js 等语言的调试
- **终端访问**：内置 bash/zsh 终端，可执行任意命令

### 端口转发

Codespaces 自动转发指定端口，方便访问 Web 应用：

```json
{
  "forwardPorts": [8080, 3000, 5432],
  "portsAttributes": {
    "8080": {
      "label": "Spring Boot App",
      "onAutoForward": "notify"
    },
    "3000": {
      "label": "Vue.js Frontend",
      "onAutoForward": "openBrowser"
    }
  }
}
```

访问方式：
- 浏览器中点击端口通知
- 手动访问 `https://<codespace-name>-8080.app.github.dev`

### 文件同步

- **自动保存**：所有更改实时同步到 GitHub 仓库
- **Git 集成**：完整的 Git 操作支持（commit、push、pull）
- **分支管理**：可直接创建和切换分支

### 扩展管理

安装的扩展会保存在 Codespace 中，下次启动时自动恢复。也可在 `devcontainer.json` 中预定义团队共享的扩展列表。

## 5. 高级用法

### 持久化存储

Codespace 停止后，`/workspace` 目录外的数据会丢失。如需持久化：

```json
{
  "mounts": [
    "source=codespace-home,target=/home/vscode,type=volume"
  ]
}
```

### 环境变量管理

#### 方式一：在 devcontainer.json 中定义

```json
{
  "containerEnv": {
    "SPRING_PROFILES_ACTIVE": "dev",
    "DATABASE_URL": "postgresql://localhost:5432/mydb"
  }
}
```

#### 方式二：使用 GitHub Secrets

1. 在仓库 Settings → Secrets 中添加密钥
2. 在 `devcontainer.json` 中引用：

```json
{
  "remoteEnv": {
    "API_KEY": "${localEnv:GITHUB_TOKEN}"
  }
}
```

#### 方式三：使用 .env 文件

```bash
# .env 文件（不要提交到 Git）
DB_PASSWORD=secret123
API_TOKEN=xyz789
```

```json
{
  "runArgs": ["--env-file", ".env"]
}
```

### 预构建优化

为加速 Codespace 启动，可启用预构建：

```json
{
  "build": {
    "dockerfile": "Dockerfile"
  },
  "updateContentCommand": "mvn clean compile",
  "waitFor": "updateContentCommand"
}
```

在仓库 Settings → Codespaces 中启用 **Prebuilds**。

### 多阶段开发环境

针对不同环境使用不同配置：

```
.devcontainer/
├── devcontainer.json          # 默认配置
├── devcontainer.dev.json      # 开发环境
├── devcontainer.test.json     # 测试环境
└── devcontainer.prod.json     # 生产环境
```

启动时指定配置：

```bash
gh codespace create --devcontainer-path .devcontainer/devcontainer.test.json
```

## 6. 成本与管理

### 定价方案

| 计划 | 免费额度 | 额外费用 |
|------|---------|---------|
| Free | 60 小时/月（2核机器） | $0.18/小时（2核） |
| Pro | 180 小时/月（2核机器） | $0.18/小时（2核） |
| Team | 按需分配 | $0.18/小时起 |

**注意**：
- 未使用的 Codespace 会在 30 天后自动删除
- 停止的 Codespace 不计费，但占用存储
- 可选择更高配置机器（费用相应增加）

### 管理 Codespaces

#### 查看使用情况

```bash
# 列出所有 Codespaces
gh codespace list

# 查看详细信息
gh codespace view -c <codespace-name>

# 查看使用时长
gh codespace usage
```

#### 停止和删除

```bash
# 停止 Codespace（保留数据）
gh codespace stop -c <codespace-name>

# 删除 Codespace
gh codespace delete -c <codespace-name>

# 删除所有停止的 Codespaces
gh codespace delete --all --keep-active
```

#### 网页管理

访问 <https://github.com/codespaces> 进行可视化管理：
- 查看所有 Codespaces
- 启动/停止/删除
- 查看使用统计
- 配置默认机器类型

### 优化成本建议

- ✅ **及时停止**：不使用后立即停止 Codespace
- ✅ **定期清理**：删除不再需要的旧 Codespaces
- ✅ **选择合适的机器**：小项目用 2 核即可
- ✅ **使用预构建**：减少重复构建时间
- ✅ **设置自动删除**：配置闲置超时自动删除

## 7. 最佳实践

### 团队协作规范

#### 1. 统一环境配置

将 `devcontainer.json` 提交到仓库，确保团队成员使用相同环境：

```json
{
  "name": "Team Standard Environment",
  "image": "mcr.microsoft.com/devcontainers/java:17",
  "features": {
    "ghcr.io/devcontainers/features/java:1": {
      "version": "17",
      "installMaven": true
    }
  },
  "customizations": {
    "vscode": {
      "extensions": [
        // 团队统一使用的扩展
        "vscjava.vscode-java-pack",
        "editorconfig.editorconfig"
      ],
      "settings": {
        // 统一的代码格式规范
        "editor.formatOnSave": true,
        "editor.tabSize": 4
      }
    }
  }
}
```

#### 2. 文档化启动流程

在 README.md 中添加：

```markdown
## 开发环境

本项目使用 GitHub Codespaces，一键启动开发环境：

1. 点击 [![Open in Codespaces](https://img.shields.io/badge/Open_in-Codespaces-blue)](https://codespaces.new/owner/repo)
2. 等待环境初始化（约 1 分钟）
3. 运行 `mvn spring-boot:run` 启动应用
4. 访问转发的 8080 端口
```

#### 3. 自动化测试环境

创建专用的测试配置：

```json
{
  "name": "Test Environment",
  "image": "mcr.microsoft.com/devcontainers/java:17",
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  },
  "postCreateCommand": "mvn test",
  "customizations": {
    "vscode": {
      "extensions": [
        "vscjava.vscode-java-test"
      ]
    }
  }
}
```

### 个人开发技巧

#### 1. 快捷键映射

保持与本地 VS Code 一致的快捷键：

```json
{
  "customizations": {
    "vscode": {
      "settings": {
        "keyboard.dispatch": "keyCode"
      }
    }
  }
}
```

#### 2. 主题同步

```json
{
  "customizations": {
    "vscode": {
      "extensions": [
        "dracula-theme.theme-dracula"
      ],
      "settings": {
        "workbench.colorTheme": "Dracula"
      }
    }
  }
}
```

#### 3. 快速模板

为常用项目类型创建模板仓库：
- Java Spring Boot 模板
- Vue.js + Node.js 模板
- Python Django 模板

## 8. 常见问题

### Q: Codespace 启动很慢怎么办？

**A:** 
- 启用预构建（Prebuilds）
- 优化 Dockerfile，利用层缓存
- 减少 `postCreateCommand` 的执行时间
- 选择更快的机器配置

### Q: 如何访问本地数据库？

**A:** 
Codespace 无法直接访问本地数据库，建议：
- 使用云端数据库服务
- 在 Codespace 中运行 Docker 容器数据库
- 使用 SSH 隧道连接远程数据库

### Q: 文件修改没有同步到 GitHub？

**A:** 
- 检查网络连接
- 手动执行 `git push`
- 确认已登录正确的 GitHub 账号
- 查看 Git 状态：`git status`

### Q: 如何备份 Codespace 中的数据？

**A:** 
- 所有 `/workspace` 下的文件都会同步到 Git
- 重要配置文件应提交到仓库
- 使用 GitHub Secrets 管理敏感信息
- 定期 commit 和 push

### Q: 免费额度用完了怎么办？

**A:** 
- 升级到 Pro 计划
- 及时停止不用的 Codespaces
- 删除旧的 Codespaces 释放空间
- 考虑自托管 runner 方案

### Q: 能否在 Codespace 中运行 Docker？

**A:** 
可以！在 `devcontainer.json` 中添加 Docker 特性：

```json
{
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  }
}
```

### Q: 如何处理大文件？

**A:** 
- 使用 Git LFS 管理大文件
- 避免在 Codespace 中处理超过 1GB 的文件
- 考虑使用外部存储服务（S3、OSS 等）

## 9. 学习资源

- 📖 [GitHub Codespaces 官方文档](https://docs.github.com/en/codespaces) - 完整的功能介绍和 API 参考
- 🎥 [Codespaces 入门教程](https://docs.github.com/en/codespaces/getting-started) - 逐步指南
- 💬 [GitHub Community](https://github.community/c/codespaces/) - 社区讨论和问题解答
- 📝 [devcontainer.json 参考](https://containers.dev/implementors/json_reference/) - 详细配置说明
- 🔧 [Dev Container Features](https://containers.dev/features) - 预建特性列表
- 🎓 [Microsoft Learn 课程](https://learn.microsoft.com/en-us/training/modules/introduction-to-github-codespaces/) - 免费学习路径

---

**提示**：对于中小型项目，Codespaces 是极佳的选择。但对于需要大量本地资源或特殊硬件的项目，仍建议使用本地开发环境。
