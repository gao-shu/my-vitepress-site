# Figma

> 所属专题：[开发工具与环境配置](/devtools/)

Figma 是基于浏览器的协作式 UI 设计工具，支持实时协作、原型设计和设计系统管理。对于全栈开发者而言，掌握 Figma 能够更高效地与设计师协作，准确还原设计稿，提升前端开发效率。

## 1. 什么是 Figma？

### 核心特性

- 🌐 **云端协作**：基于浏览器，无需安装客户端，多人实时编辑
- 🎨 **矢量设计**：强大的矢量编辑功能，适合 UI/UX 设计
- 🔗 **组件系统**：可复用的组件库，支持变体和属性
- 📱 **原型设计**：交互式原型，模拟真实用户体验
- 💻 **开发者模式**：专为开发者优化的查看和导出功能
- 🔌 **插件生态**：丰富的插件市场，扩展功能边界
- 📐 **自动布局**：类似 CSS Flexbox 的布局系统
- 🎯 **设计标注**：自动生成间距、颜色、字体等开发信息

### 适用场景

- 👥 **团队协作**：设计师和开发者实时协作
- 📱 **移动应用设计**：iOS 和 Android 界面设计
- 🌍 **Web 应用设计**：响应式网页设计
- 🎨 **设计系统**：构建和维护统一的设计语言
- 🖼️ **原型演示**：制作可交互的产品原型
- ✂️ **切图导出**：为前端开发提供精确的资源

## 2. 快速开始

### 注册与登录

1. 访问 [Figma 官网](https://www.figma.com/)
2. 点击 **Get started for free**
3. 使用邮箱、Google 或 GitHub 账号注册
4. 选择个人用途（免费）或团队用途

### 创建第一个设计文件

#### 方式一：从空白文件开始

1. 登录后点击 **New design file**
2. 进入画布界面
3. 使用左侧工具栏开始绘制

#### 方式二：使用模板

1. 点击 **Explore Community**
2. 浏览或搜索模板（UI Kits、Wireframes 等）
3. 点击 **Duplicate** 复制到自己的文件
4. 基于模板进行修改

#### 方式三：导入现有设计

1. 点击 **Import file**
2. 支持格式：`.fig`、`.sketch`、`.png`、`.jpg`、`.svg`
3. 上传后自动转换为 Figma 格式

### 界面概览

```
┌─────────────────────────────────────────────┐
│  顶部工具栏 (Top Bar)                        │
│  [文件名] [分享] [评论] [播放原型]           │
├──────────┬──────────────────┬───────────────┤
│          │                  │               │
│  左侧    │     中央画布      │   右侧面板     │
│  工具栏  │   (Canvas)       │  (Properties)  │
│          │                  │               │
│  - 选择  │                  │  - 图层        │
│  - 框架  │                  │  - 样式        │
│  - 形状  │                  │  - 导出        │
│  - 文字  │                  │  - 原型        │
│  - 钢笔  │                  │               │
└──────────┴──────────────────┴───────────────┘
```

## 3. 基础操作

### 常用快捷键

| 操作 | Windows/Linux | macOS |
|------|--------------|-------|
| 选择工具 | `V` | `V` |
| 框架工具 | `F` | `F` |
| 矩形工具 | `R` | `R` |
| 椭圆工具 | `O` | `O` |
| 文字工具 | `T` | `T` |
| 钢笔工具 | `P` | `P` |
| 移动画布 | `空格 + 拖动` | `空格 + 拖动` |
| 缩放画布 | `Ctrl + 滚轮` | `Cmd + 滚轮` |
| 复制 | `Ctrl + D` | `Cmd + D` |
| 组合 | `Ctrl + G` | `Cmd + G` |
| 取消组合 | `Ctrl + Shift + G` | `Cmd + Shift + G` |
| 对齐 | `Ctrl + Alt + K` | `Cmd + Option + K` |

### 框架（Frame）

框架是 Figma 的核心容器，类似于 HTML 的 `<div>`：

1. 按 `F` 键选择框架工具
2. 在右侧面板选择预设尺寸（iPhone、Desktop 等）或自定义
3. 在框架内添加其他元素

**常用框架尺寸**：
- iPhone 14: 390 × 844
- iPad: 834 × 1194
- Desktop: 1440 × 1024
- Web: 1920 × 1080

### 自动布局（Auto Layout）

自动布局类似 CSS Flexbox，用于创建响应式设计：

#### 创建自动布局

1. 选中多个元素
2. 按 `Shift + A` 或点击右侧面板 **Add auto layout**
3. 调整布局方向、间距、对齐方式

#### 关键属性

- **Direction**：水平（→）或垂直（↓）
- **Gap**：元素间距
- **Padding**：内边距
- **Alignment**：对齐方式（左/中/右/顶/底）
- **Resizing**：固定宽度、填充容器、 Hug contents

#### 示例：创建按钮组件

```
1. 绘制矩形作为背景
2. 添加文字标签
3. 选中两者，按 Shift + A
4. 设置：
   - Direction: Horizontal
   - Gap: 8px
   - Padding: 12px 16px
   - Alignment: Center
5. 添加圆角和填充色
```

### 组件（Components）

组件是可复用的设计元素，类似前端组件：

#### 创建主组件

1. 选中设计元素
2. 按 `Ctrl + Alt + K`（Windows）或 `Cmd + Option + K`（Mac）
3. 或点击右侧面板 **Create component**
4. 菱形图标 ◆ 表示主组件

#### 创建实例

1. 从 Assets 面板拖拽组件到画布
2. 或复制主组件（`Ctrl/Cmd + D`）
3. 方形图标 ◇ 表示实例

#### 变体（Variants）

为组件创建不同状态：

1. 选中主组件
2. 点击右侧面板 **Properties** → **Add variant**
3. 定义属性（如 state: default/hover/disabled）
4. 为每个变体设计不同样式

**示例：按钮变体**
```
Button
├── State: Default
├── State: Hover
├── State: Active
└── State: Disabled
```

## 4. 开发者模式

Figma 的开发者模式专为前端工程师优化，提供精确的开发信息。

### 启用开发者模式

1. 在设计文件右上角切换开关
2. 从 **Design** 切换到 **Dev mode**
3. 或使用快捷键 `/` 快速切换

### 查看设计标注

#### 间距测量

1. 按住 `Alt`（Windows）或 `Option`（Mac）
2. 鼠标悬停在元素上
3. 显示与其他元素的距离

#### 属性检查

选中元素后，右侧面板显示：
- **尺寸**：宽度和高度
- **位置**：X、Y 坐标
- **样式**：填充、描边、效果
- **文本**：字体、字号、行高、字间距
- **布局**：Auto Layout 属性

#### 代码片段

Figma 自动生成 CSS、iOS、Android 代码：

```css
/* CSS 示例 */
.button {
  width: 120px;
  height: 40px;
  background: #4F46E5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
}
```

### 导出资源

#### 导出图片

1. 选中要导出的元素
2. 右侧面板找到 **Export** 部分
3. 选择格式：PNG、JPG、SVG、PDF
4. 选择倍率：1x、2x、3x（适配不同屏幕）
5. 点击 **Export** 下载

#### 批量导出

1. 选中多个元素
2. 为每个元素设置导出选项
3. 点击 **Export X layers** 一次性导出

#### 导出 SVG 图标

```
推荐设置：
- 格式: SVG
- 勾选 "Outline text"（文字转路径）
- 勾选 "Include id attribute"
- 清理多余代码（使用 SVGO 工具）
```

### 复制 CSS 属性

1. 选中元素
2. 在 Dev mode 右侧面板
3. 点击属性旁的 **Copy** 按钮
4. 直接粘贴到代码编辑器

**可复制的属性**：
- Box shadow
- Background gradient
- Border radius
- Font styles
- Auto layout properties

## 5. 协作功能

### 实时协作

- **多人编辑**：团队成员可同时编辑同一文件
- **光标追踪**：看到其他人的光标位置和姓名
- **实时保存**：所有更改自动保存到云端

### 评论与反馈

#### 添加评论

1. 按 `C` 键或点击评论工具
2. 点击要评论的位置
3. 输入评论内容
4. 提及团队成员（@name）

#### 回复评论

- 直接在评论线程中回复
- 标记为已解决（Resolve）
- 过滤查看未解决的评论

### 版本历史

1. 点击顶部工具栏的文件名
2. 选择 **Show version history**
3. 查看所有保存的版本
4. 可恢复到任意历史版本

**注意**：免费计划保留 30 天版本历史，付费计划无限保留。

### 分享与权限

#### 分享链接

1. 点击右上角 **Share** 按钮
2. 设置权限：
   - **Can view**：仅查看
   - **Can edit**：可编辑
   - **Can comment**：可查看和评论
3. 复制链接发送给团队成员

#### 团队权限

- **Owner**：完全控制
- **Admin**：管理文件和成员
- **Editor**：编辑设计文件
- **Viewer**：仅查看

## 6. 设计系统

### 样式（Styles）

统一管理颜色、文本、效果等样式：

#### 创建颜色样式

1. 选中带有填充色的元素
2. 右侧面板点击 **Style** 旁的 **+** 号
3. 命名样式（如 "Primary Color"）
4. 在其他元素中应用该样式

#### 创建文本样式

1. 选中文本元素
2. 设置字体、字号、行高等属性
3. 点击 **Text style** 旁的 **+** 号
4. 命名（如 "Heading 1"、"Body Text"）

#### 管理样式库

- 在右侧面板 **Local styles** 查看所有样式
- 右键样式可编辑或删除
- 发布为团队库供其他文件使用

### 组件库

#### 创建设计系统

```
Design System/
├── Colors/
│   ├── Primary
│   ├── Secondary
│   └── Neutral
├── Typography/
│   ├── Heading 1
│   ├── Heading 2
│   ├── Body
│   └── Caption
├── Components/
│   ├── Buttons
│   ├── Inputs
│   ├── Cards
│   └── Navigation
└── Icons/
    ├── Social
    ├── Navigation
    └── Actions
```

#### 发布组件库

1. 在包含组件的文件中
2. 点击顶部工具栏 **Team library** 图标（书本形状）
3. 点击 **Publish**
4. 填写更新说明
5. 其他文件可启用该库并使用组件

### 使用团队库

1. 打开新设计文件
2. 点击左侧面板 **Assets** 标签
3. 点击 **Book** 图标启用团队库
4. 从库中拖拽组件到画布
5. 组件更新时接收通知

## 7. 插件与集成

### 热门插件

#### 开发相关

- **[CSS to Figma](https://www.figma.com/community/plugin/739932768976800840)**：将 CSS 代码转换为 Figma 设计
- **[HTML to Design](https://www.figma.com/community/plugin/913691171892825688)**：从 HTML 生成 Figma 框架
- **[Icons8](https://www.figma.com/community/plugin/744047966581015514)**：插入高质量图标
- **[Unsplash](https://www.figma.com/community/plugin/738454987945972471)**：插入免费高清图片

#### 效率工具

- **[Autoflow](https://www.figma.com/community/plugin/733902567457592893)**：快速绘制流程图箭头
- **[Content Reel](https://www.figma.com/community/plugin/740252899656509999)**：快速填充占位内容
- **[Remove BG](https://www.figma.com/community/plugin/740892601908893095)**：一键去除图片背景
- **[Color Contrast Checker](https://www.figma.com/community/plugin/748533339900865324)**：检查颜色对比度是否符合 WCAG 标准

#### 数据可视化

- **[Charts](https://www.figma.com/community/plugin/731965056548591961)**：创建柱状图、折线图等
- **[Mapsicle](https://www.figma.com/community/plugin/741931915324598946)**：插入地图

### 安装插件

1. 点击顶部菜单 **Plugins** → **Browse plugins in Community**
2. 搜索所需插件
3. 点击 **Install**
4. 使用时：**Plugins** → 选择已安装的插件

### API 集成

#### Figma API

通过 REST API 获取设计文件数据：

```bash
# 获取文件信息
curl -H "X-Figma-Token: YOUR_ACCESS_TOKEN" \
  https://api.figma.com/v1/files/:file_key

# 获取节点信息
curl -H "X-Figma-Token: YOUR_ACCESS_TOKEN" \
  https://api.figma.com/v1/files/:file_key/nodes?ids=:node_ids
```

**应用场景**：
- 自动化导出设计资源
- 同步设计令牌到代码库
- 构建设计到代码的工具链

#### Webhooks

监听文件变化事件：
- FILE_UPDATE
- COMMENT_CREATE
- VERSION_CREATE

## 8. 最佳实践

### 给开发者的建议

#### 1. 建立设计规范

```
命名规范：
- 颜色：color-primary, color-secondary, color-error
- 文本：text-heading-1, text-body, text-caption
- 间距：spacing-xs (4px), spacing-sm (8px), spacing-md (16px)
- 组件：btn-primary, input-text, card-product
```

#### 2. 使用约束（Constraints）

确保设计在不同屏幕尺寸下正确响应：

- **Left & Right**：元素宽度随容器变化
- **Top & Bottom**：元素高度随容器变化
- **Center**：元素保持居中
- **Scale**：元素按比例缩放

#### 3. 组织图层结构

```
良好的图层命名：
✅ Header / Navigation / Logo
❌ Rectangle 234 / Group 567

使用页面分组：
- Cover（封面）
- Wireframes（线框图）
- Designs（最终设计）
- Components（组件库）
- Archive（归档）
```

#### 4. 利用网格系统

```
常见网格设置：
- Web: 12 列，间距 24px，边距 80px
- Mobile: 4 列，间距 16px，边距 16px
- Tablet: 8 列，间距 24px，边距 40px
```

### 设计与开发协作流程

#### 1. 设计阶段

```
设计师：
1. 创建设计稿
2. 使用组件和样式保持一致性
3. 添加标注和说明
4. 邀请开发者评论
```

#### 2. 审查阶段

```
开发者：
1. 查看设计稿（Dev mode）
2. 检查技术可行性
3. 提出问题和修改建议
4. 确认实现细节
```

#### 3. 开发阶段

```
开发者：
1. 从 Figma 复制 CSS 属性
2. 导出所需图片资源
3. 查看间距和布局信息
4. 参考组件变体实现不同状态
```

#### 4. 验收阶段

```
设计师：
1. 查看开发成果
2. 在 Figma 中标注差异
3. 迭代优化
```

### 性能优化

- ✅ **简化图层**：合并不必要的分组
- ✅ **压缩图片**：导出前优化图片大小
- ✅ **使用组件**：避免重复创建相同元素
- ✅ **定期清理**：删除未使用的样式和组件
- ✅ **分页管理**：大型项目按功能模块分页

## 9. 常见问题

### Q: Figma 和 Sketch 有什么区别？

**A:** 
- **平台**：Figma 基于浏览器（跨平台），Sketch 仅限 macOS
- **协作**：Figma 支持实时协作，Sketch 需要第三方工具
- **价格**：Figma 有免费计划，Sketch 需一次性购买
- **性能**：Sketch 处理超大文件更流畅，Figma 依赖网络

### Q: 免费版的限制是什么？

**A:** 
- 最多 3 个设计文件
- 无限草稿文件
- 版本历史保留 30 天
- 最多 2 个协作者同时编辑
- 对于个人学习和小型项目足够使用

### Q: 如何从 Sketch 迁移到 Figma？

**A:** 
1. 在 Sketch 中导出为 `.sketch` 文件
2. 在 Figma 中点击 **Import file**
3. 上传 `.sketch` 文件
4. 手动调整不兼容的元素（如某些插件效果）

### Q: Figma 可以离线使用吗？

**A:** 
- 桌面应用支持有限的离线功能
- 可查看和编辑最近打开的文件
- 重新联网后自动同步更改
- 建议保持网络连接以获得完整体验

### Q: 如何保护设计文件不被复制？

**A:** 
- 设置查看权限为 "Can view" 而非 "Can edit"
- 禁用复制功能（付费团队版）
- 使用水印插件
- 导出低分辨率预览图分享

### Q: 如何处理中文排版？

**A:** 
- 使用中文字体（如思源黑体、苹方）
- 调整行高为字号的 1.5-1.8 倍
- 注意中英文混排时的间距
- 使用合适的字重区分层级

### Q: Figma 能导出代码吗？

**A:** 
- 可导出 CSS、iOS (Swift)、Android (XML) 代码片段
- 第三方插件可生成 React、Vue 组件代码
- 但生成的代码通常需要手动优化
- 建议作为参考，而非直接使用

## 10. 学习资源

- 📖 [Figma 官方文档](https://help.figma.com/hc/en-us) - 完整的功能指南
- 🎥 [Figma YouTube 频道](https://www.youtube.com/c/Figmadesign) - 官方教程和案例
- 🎓 [Figma Learn](https://www.figma.com/best-practices/) - 最佳实践和设计技巧
- 💬 [Figma Community](https://www.figma.com/community) - 免费模板、插件和资源
- 📚 [Figma 中文社区](https://www.figma.cool/) - 中文教程和资源
- 🔧 [Figma API 文档](https://www.figma.com/developers/api) - API 参考和示例
- 🎨 [UI Design Daily](https://uidesigndaily.com/) - 每日 UI 设计灵感

---

**提示**：对于 Java 全栈开发者，建议重点掌握 Figma 的开发者模式、组件系统和自动布局功能，这将大幅提升与设计团队的协作效率。
