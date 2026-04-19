# 🎵 周杰伦音乐播放器使用说明

## 📁 文件存放位置

将周杰伦的 MP3 文件放到以下目录：

```
docs/public/music/
```

## 🎶 需要的文件列表（MP3 格式）

请准备以下 5 首歌曲的 **MP3 格式**文件，并按以下名称命名：

1. **qingtian.mp3** - 晴天
2. **qilixiang.mp3** - 七里香
3. **gaobaiqiqiu.mp3** - 告白气球
4. **daoxiang.mp3** - 稻香
5. **qinghuaci.mp3** - 青花瓷

### ⚠️ 重要提示

- ✅ **推荐使用 MP3 格式** - 兼容性最好，所有浏览器都支持
- ❌ **不推荐 FLAC/WAV** - Safari 不支持，文件体积大
- ❌ **不要用 MP4** - 这是视频格式，不适合纯音频

## 🔄 如何转换格式

如果你只有 FLAC、WAV 或其他格式的文件：

### 方法 1：在线转换（最简单）
访问以下网站免费转换：
- https://cloudconvert.com/flac-to-mp3
- https://online-audio-converter.com/cn/

### 方法 2：本地软件转换
- **Windows**: 格式工厂、Foobar2000
- **Mac**: Audacity、XLD
- **跨平台**: VLC 媒体播放器

### 方法 3：从音乐平台下载
直接从网易云音乐、QQ 音乐等平台下载 MP3 格式（通常需要会员）。

## ✅ 验证文件是否正确

启动开发服务器后，在浏览器访问以下地址测试：

```
http://localhost:6174/my-vitepress-site/music/qingtian.mp3
```

如果能看到音频播放器或自动下载，说明文件路径正确。

## 🔧 如果不想用这 5 首歌

编辑 `docs/.vitepress/config.mts` 文件，修改第 275-280 行左右的 `songs` 数组：

```javascript
const songs = [
  { name: '你的歌名', url: '/music/你的文件名.mp3' },
  // 添加更多...
];
```

## 🚀 部署到 GitHub Pages

MP3 文件会自动随项目一起部署，无需额外配置。

构建命令：
```bash
npm run build
```

构建后的文件会位于：
```
docs/.vitepress/dist/music/
```

---

> 💡 **提示**：由于版权原因，请不要将这些 MP3 文件上传到公开的 Git 仓库。可以考虑：
> 1. 在 `.gitignore` 中忽略 `docs/public/music/` 目录
> 2. 仅在本地或私有环境中使用
> 3. 或者使用免版权的轻音乐替代
