# IntelliJ IDEA 配置

> 所属专题：[开发工具与环境配置](/devtools/)

### 2.1 安装

**下载地址：**
- 社区版（免费）：https://www.jetbrains.com/idea/download/

### 2.2 必装插件推荐

**编码效率类：**
```
✅ Lombok - 简化 Java 代码（必装）
✅ Key Promoter X - 快捷键提示
✅ CodeGlance - 代码小地图
✅ Rainbow Brackets - 彩虹括号
✅ String Manipulation - 字符串转换工具
```

**框架支持类：**
```
✅ Spring Boot Helper - Spring Boot 支持
✅ MyBatisX - MyBatis 增强工具
✅ Vue.js - 前端框架支持
✅ GitToolBox - Git 集成增强
```

**代码质量类：**
```
✅ Alibaba Java Coding Guidelines - 阿里代码规范
✅ SonarLint - 代码质量检测
✅ CheckStyle-IDEA - 代码风格检查
```

**界面美化类：**
```
✅ Material Theme UI - 主题美化
✅ Nyan Progress Bar - 进度条美化
✅ Power Mode II - 打字特效（可选）
```

### 2.3 常用快捷键（Windows/Linux）

| 功能 | 快捷键 | 说明 |
|------|--------|------|
| 搜索任意内容 | `Shift + Shift` | 万能搜索 |
| 查找类 | `Ctrl + N` | 快速定位类 |
| 查找文件 | `Ctrl + Shift + N` | 查找任意文件 |
| 全局搜索 | `Ctrl + Shift + F` | 全文搜索 |
| 代码补全 | `Ctrl + Space` | 智能提示 |
| 生成代码 | `Alt + Insert` | Getter/Setter/构造器 |
| 重构重命名 | `Shift + F6` | 安全重命名 |
| 提取方法 | `Ctrl + Alt + M` | 重构神器 |
| 格式化代码 | `Ctrl + Alt + L` | 代码格式化 |
| 优化导入 | `Ctrl + Alt + O` | 清理无用 import |
| 查看调用链 | `Ctrl + Alt + H` | 方法调用层级 |
| 运行 | `Shift + F10` | 启动应用 |
| 调试 | `Shift + F9` | Debug 模式 |
| 最近的文件 | `Ctrl + E` | 快速切换文件 |

### 2.4 实用配置技巧

**修改内存配置：**
```ini
# 编辑 idea64.exe.vmoptions
-Xms512m
-Xmx2048m
-XX:ReservedCodeCacheSize=512m
```

**启用自动保存：**
```
Settings → Appearance & Behavior → System Settings
✓ Save files on frame deactivation
✓ Save files automatically if application is idle for 1 sec
```

**配置 Maven：**
```
Settings → Build, Execution, Deployment → Build Tools → Maven
- Maven home directory: D:\apache-maven-3.8.6
- User settings file: D:\apache-maven-3.8.6\conf\settings.xml
✓ Override
```

**关闭双击相关功能（按需）：**
```
1) 关闭“单击文件自动打开”（避免频繁双击/误开）
Settings → Editor → General → Editor Tabs
取消勾选 Enable preview tab

2) 关闭“编辑器标签双击关闭”
Settings → Editor → General → Editor Tabs
将 “Close tab on double click” 设为 None（或取消对应双击动作）
```

---

## 个人环境备忘（可替换为你的路径）

以下为一套可直接对照填写的示例：**自动导包、Maven 路径、Import JVM、常用插件与 Live Template**。路径请按本机修改。

### 自动导入（Auto Import）

- `Settings` → `Editor` → `General` → `Auto Import`
  - 勾选 **Add unambiguous imports on the fly**
  - 勾选 **Optimize imports**（可配合保存时优化：`Settings` → `Tools` → `Actions on Save` → Optimize imports）

### Maven 与 Import 进程的 JVM（示例路径）

| 项 | 示例值 |
|----|--------|
| Maven home | `D:/01.soft/work/apache-maven-3.8.4` |
| User settings file | `D:\01.soft\work\apache-maven-3.8.4\conf\settings.xml` |

在 **同一 Maven 设置页** 中展开 **Runner** / **Importing**（视 IDEA 版本而定），可为 **VM options** 填入（仅示例，内存可按机器调大）：

```text
-XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m -Xms64m -Xmx128m -Xmn64m -Xss256k -XX:SurvivorRatio=8 -XX:+UseConcMarkSweepGC
```

> 注：`UseConcMarkSweepGC` 在 JDK 9+ 已移除；若使用 JDK 11/17，可改成 G1：`-XX:+UseG1GC`，并适当增大 `-Xmx`。

### 插件清单（名称以 IDEA Marketplace 为准）

| 用途 | 插件名（关键词） |
|------|------------------|
| 省去 getter/setter 等样板代码 | **Lombok** |
| 依赖冲突分析 | **Maven Helper** |
| 中英文翻译 | **Translation** |
| Mapper/XML 跳转与生成 | **MyBatisX** |
| MyBatis-Plus 辅助（若使用 MP） | **MyBatis Plus**（或选同类 “Free” 版本） |
| 阿里通义 | **通义灵码（Tongyi）** 等 |
| 代码生成 | **Easy Code** |
| Setter 批量生成 | **GenerateAllSetter** |
| 右侧代码缩略图 | **CodeGlance** |
| 时序图（UML） | **SequenceDiagram** |
| Mapper XML 热刷新/辅助 | **MybatisMapperRefresh**（或同类，以插件市场实际为准） |
| 接口调试（团队常用） | **Apipost**（或 Apifox 等） |
| 驼峰等命名切换 | **CamelCase** |
| 试用重置（仅限合规许可场景） | **IDE Eval Reset**（自行评估合规性） |
| 热部署 | **JRebel**（商业） |
| 快捷键记忆 | **Key Promoter X** |
| 括号配色 | **Rainbow Brackets** |

按需安装即可，不必全部开启，避免启动变慢。

### Live Template 示例

**todo：**

```java
// todo 功能未写待补充
```

**test 方法：**

```java
@Test
public void test$content$(){
    $content1$
}
```

**list：**

```java
List<$T$> orderLines = new ArrayList<>();
```

在 `Settings` → `Editor` → `Live Templates` 中新增模板组，将 `$content$`、`$T$` 等设为变量即可。

---
