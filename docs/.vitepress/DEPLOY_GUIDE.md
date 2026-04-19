# 🚀 GitHub Pages 部署指南

## 📋 部署前检查清单

### 1. 修改 base 配置

编辑文件：`docs/.vitepress/config.mts`

根据你的 GitHub 仓库名称修改 `base` 配置：

```typescript
// 如果你的网站地址是：https://username.github.io/my-vitepress-site/
base: '/my-vitepress-site/',

// 如果使用自定义域名或仓库名就是 username.github.io
base: '/',
```

**示例：**
- 仓库名：`my-vitepress-site`
- GitHub Pages URL：`https://yourname.github.io/my-vitepress-site/`
- 配置：`base: '/my-vitepress-site/'`

### 2. 创建 GitHub Actions 工作流

在 `.github/workflows/` 目录创建 `deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]  # 或者你的主分支名

# 设置 GITHUB_TOKEN 权限
permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. 启用 GitHub Pages

1. 进入仓库 **Settings** → **Pages**
2. 在 **Source** 选择 **GitHub Actions**
3. 保存后，每次推送到 main 分支会自动部署

## ⚠️ 常见问题

### 问题 1：页面显示 404

**原因**：base 配置不正确

**解决**：
- 检查 `config.mts` 中的 `base` 是否与仓库名一致
- 重新构建并推送

### 问题 2：口语发音按钮不工作

**可能原因**：
1. **浏览器不支持**：Web Speech API 需要现代浏览器
   - ✅ 推荐：Chrome、Edge、Safari
   - ❌ 可能有问题：Firefox（部分版本）

2. **HTTPS 要求**：某些浏览器要求 HTTPS 才能使用语音 API
   - ✅ GitHub Pages 默认提供 HTTPS

3. **用户交互限制**：浏览器要求用户先与页面交互
   - 解决：点击页面任意位置后再点击发音按钮

4. **移动端限制**：iOS Safari 可能需要额外授权
   - 解决：在设置中允许网站使用麦克风/语音

### 问题 3：音乐播放器不工作

**检查项**：
1. 网络连接是否正常
2. 音乐链接是否有效（Pixabay CDN 通常很稳定）
3. 浏览器是否阻止了自动播放
   - 解决：手动点击播放按钮

### 问题 4：静态资源加载失败

**原因**：路径问题

**解决**：
- 确保所有资源路径以 `/` 开头（相对于 base）
- 例如：`/logo.svg` 而不是 `logo.svg`

## 🔍 调试技巧

### 本地预览构建结果

```bash
npm run build
npm run preview
```

访问 `http://localhost:4173` 查看构建后的效果。

### 检查浏览器控制台

1. 打开浏览器开发者工具（F12）
2. 查看 **Console** 标签页的错误信息
3. 查看 **Network** 标签页的资源加载情况

### 测试 Web Speech API

在浏览器控制台运行：

```javascript
// 测试浏览器是否支持
console.log('Speech Synthesis supported:', 'speechSynthesis' in window)

// 测试发音
const utterance = new SpeechSynthesisUtterance('Hello World')
utterance.lang = 'en-US'
speechSynthesis.speak(utterance)
```

## 📱 移动端注意事项

- iOS Safari：首次使用语音功能可能需要用户授权
- Android Chrome：通常无需额外配置
- 建议在多个设备上测试

## ✨ 最佳实践

1. **渐进增强**：即使语音功能不可用，页面内容仍可正常浏览
2. **错误提示**：给用户清晰的错误信息和解决方案
3. **备用方案**：考虑添加音标或文字说明作为补充
4. **性能优化**：语音合成不会增加页面体积，无需担心加载速度

---

> 💡 **提示**：如果遇到其他问题，可以查看浏览器控制台的错误信息进行排查。
