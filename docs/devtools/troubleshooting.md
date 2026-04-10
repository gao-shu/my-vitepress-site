# 环境常见问题排查

> 所属专题：[开发工具与环境配置](/devtools/)

### 10.1 JDK 相关问题

**问题 1：多个 JDK 版本冲突**
```bash
# 症状：IDEA 识别错误的 JDK 版本
# 解决：明确指定 JAVA_HOME

# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-17
set Path=%JAVA_HOME%\bin;%Path%

# Linux/Mac
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export PATH=$JAVA_HOME/bin:$PATH
```

**问题 2：Maven 下载依赖慢**
```bash
# 解决：配置阿里云镜像
# 编辑 settings.xml，添加 mirror 配置（见上文）
```

### 10.2 Git 相关问题

**问题 1：Git 中文乱码**
```bash
# 解决：配置 Git 显示中文
git config --global core.quotepath false
git config --global gui.encoding utf-8
git config --global i18n.commitencoding utf-8
```

**问题 2：忘记提交代码就切换分支**
```bash
# 解决：使用 git stash
git stash          # 暂存当前修改
git checkout xxx   # 切换分支
git stash pop      # 恢复修改
```

### 10.3 Docker 相关问题

**问题 1：Docker Desktop 启动失败**
```bash
# 解决：
1. 确保 BIOS 开启虚拟化
2. 启用 WSL 2 功能
3. 更新 Windows 到最新版本
4. 以管理员身份运行
```

**问题 2：容器无法访问**
```bash
# 检查端口映射
docker ps

# 检查防火墙设置
netstat -an | findstr "8080"

# 使用 host 网络模式
docker run --network host ...
```

---
