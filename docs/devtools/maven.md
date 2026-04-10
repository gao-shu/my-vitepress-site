# Maven 配置与最佳实践

> 所属专题：[开发工具与环境配置](/devtools/)

### 3.1 安装与配置

**下载安装：**
```bash
# 下载地址
https://maven.apache.org/download.cgi

# 解压到本地，例如：
D:\apache-maven-3.8.6

# 配置环境变量
MAVEN_HOME=D:\apache-maven-3.8.6
Path=%MAVEN_HOME%\bin
```

**验证安装：**
```bash
mvn -version
```

### 3.2 配置阿里云镜像（加速下载）

编辑 `%MAVEN_HOME%\conf\settings.xml`：

```xml
<mirrors>
  <mirror>
    <id>aliyun</id>
    <name>Aliyun Maven</name>
    <url>https://maven.aliyun.com/repository/public</url>
    <mirrorOf>central</mirrorOf>
  </mirror>
  
  <mirror>
    <id>huaweicloud</id>
    <name>Huawei Cloud Maven</name>
    <url>https://repo.huaweicloud.com/repository/maven/</url>
    <mirrorOf>central</mirrorOf>
  </mirror>
</mirrors>
```

### 3.3 常用命令速查

```bash
# 清理编译
mvn clean

# 编译项目
mvn compile

# 运行测试
mvn test

# 打包（跳过测试）
mvn package -DskipTests

# 安装到本地仓库
mvn install

# 清除依赖缓存
mvn dependency:purge-local-repository

# 查看依赖树
mvn dependency:tree

# 查看重复依赖
mvn dependency:analyze
```

### 3.4 父子项目管理

**父 POM 配置：**
```xml
<project>
  <groupId>com.example</groupId>
  <artifactId>parent</artifactId>
  <version>1.0.0</version>
  <packaging>pom</packaging>
  
  <modules>
    <module>service-a</module>
    <module>service-b</module>
  </modules>
  
  <dependencyManagement>
    <dependencies>
      <!-- 统一版本管理 -->
    </dependencies>
  </dependencyManagement>
</project>
```

---
