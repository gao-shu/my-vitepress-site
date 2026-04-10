# Git 版本控制实战

> 所属专题：[开发工具与环境配置](/devtools/)

### 4.1 安装与配置

**下载安装：**
```bash
# 下载地址
https://git-scm.com/download/win

# 安装后配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 配置默认分支名
git config --global init.defaultBranch main

# 配置换行符（Windows）
git config --global core.autocrlf true
```

### 4.2 常用 Git 命令

**基础操作：**
```bash
# 初始化仓库
git init

# 克隆远程仓库
git clone https://github.com/user/repo.git

# 查看状态
git status

# 添加文件
git add .
git add filename.java

# 提交更改
git commit -m "feat: add new feature"
git commit -am "fix: bug fix"  # 跳过 add 直接 commit

# 推送代码
git push origin main
git push -u origin main  # 首次推送

# 拉取代码
git pull
git fetch origin
```

**分支管理：**
```bash
# 查看分支
git branch
git branch -a  # 查看所有分支

# 创建分支
git branch feature-xxx
git checkout -b feature-xxx  # 创建并切换

# 合并分支
git checkout main
git merge feature-xxx

# 删除分支
git branch -d feature-xxx
git branch -D feature-xxx  # 强制删除

# 推送分支到远程
git push origin feature-xxx
```

**回退与撤销：**
```bash
# 撤销工作区修改
git checkout -- filename.java
git restore filename.java

# 撤销暂存区
git reset HEAD filename.java
git restore --staged filename.java

# 回退到指定版本
git reset --hard HEAD~1
git reset --hard abc1234

# 查看提交历史
git log
git log --oneline --graph
```

### 4.3 Git Flow 工作流

```bash
# 主分支保护
main (生产环境)
  ↑
develop (开发分支)
  ↑
feature/* (功能分支)
  ↑
release/* (发布分支)
  ↑
hotfix/* (热修复分支)
```

**标准流程：**
```bash
# 1. 从 develop 创建功能分支
git checkout develop
git checkout -b feature/user-login

# 2. 开发并提交
git add .
git commit -m "feat: implement user login"

# 3. 推送到远程
git push origin feature/user-login

# 4. 创建 Pull Request 合并到 develop

# 5. 发布时创建 release 分支
git checkout -b release/1.0.0

# 6. 测试完成后合并到 main 和 develop
git checkout main
git merge release/1.0.0
git tag v1.0.0
```

---
