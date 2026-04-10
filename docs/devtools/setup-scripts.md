# 一键配置脚本

> 所属专题：[开发工具与环境配置](/devtools/)

### 9.1 Windows PowerShell 自动化脚本

```powershell
# 创建开发环境安装脚本 setup-dev.ps1

# 1. 安装 Chocolatey 包管理器
Set-ExecutionPolicy Bypass -Scope Process -Force; 
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# 2. 批量安装开发工具
choco install -y jdk11
choco install -y intellijidea-community
choco install -y maven
choco install -y git
choco install -y docker-desktop
choco install -y vscode
choco install -y navicat-premium
choco install -y postman
choco install -y snipaste
choco install -y everything

# 3. 配置 Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

Write-Host "开发环境安装完成！请重启电脑后使用。" -ForegroundColor Green
```

### 9.2 Mac Homebrew 自动化脚本

```bash
#!/bin/bash
# setup-dev.sh

# 1. 安装 Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. 安装开发工具
brew install openjdk@17
brew install --cask intellij-idea-ce
brew install maven
brew install git
brew install --cask docker
brew install --cask visual-studio-code
brew install --cask postman

# 3. 配置 SDKMAN!
curl -s "https://get.sdkman.io" | bash

echo "开发环境安装完成！请重启终端后使用。"
```

---
