# JDK 安装与多版本管理

> 所属专题：[开发工具与环境配置](/devtools/)

### 1.1 JDK 版本选择建议

**推荐版本：**
- ✅ **JDK 8**：经典稳定，大量老项目仍在使用（面试必考）
- ✅ **JDK 11**：LTS 版本，性能提升明显，企业主流选择
- ✅ **JDK 17**：最新 LTS 版本，新项目首选
- ✅ **JDK 21**：最新 LTS 版本（2023 年发布），虚拟线程是亮点

**版本特性对比：**
```
JDK 8   → Lambda 表达式、Stream API、Optional
JDK 11  → var 局部变量、HTTP Client、String 新特性
JDK 17  → sealed classes、pattern matching、records
JDK 21  → 虚拟线程（Project Loom）、结构化并发
```

### 1.2 Windows 安装 JDK

**下载安装步骤：**

1. **下载地址：**
   - Oracle 官网：https://www.oracle.com/java/technologies/downloads/
   - Adoptium（开源）：https://adoptium.net/
   - Azul Zulu：https://www.azul.com/downloads/

2. **安装配置：**
```bash
# 下载后双击安装，默认路径：
C:\Program Files\Java\jdk-17

# 配置环境变量
JAVA_HOME=C:\Program Files\Java\jdk-17
Path=%JAVA_HOME%\bin
```

3. **验证安装：**
```bash
java -version
javac -version
```

### 1.3 多版本管理工具（强烈推荐）

#### SDKMAN!（Linux/Mac 首选）

```bash
# 安装 SDKMAN!
curl -s "https://get.sdkman.io" | bash

# 查看可用版本
sdk list java

# 安装多个版本
sdk install java 8.0.382-amzn
sdk install java 11.0.20-oracle
sdk install java 17.0.8-oracle
sdk install java 21.0.0-oracle

# 切换版本
sdk use java 8.0.382-amzn    # 临时切换
sdk default java 17.0.8-oracle  # 默认版本

# 查看已安装版本
sdk current java
```

#### Jabba（跨平台，支持 Windows）

```bash
# Windows 安装 Jabba
choco install jabba

# 或者使用 Scoop
scoop install jabba

# 安装 JDK 版本
jabba install openjdk@1.8.0
jabba install adopt@11.0.20
jabba install temurin@17.0.8
jabba install temurin@21.0.0

# 切换版本
jabba use openjdk@1.8.0
jabba alias default temurin@17.0.8
```

---
