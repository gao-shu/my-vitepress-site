# 🎵 音乐播放器使用说明

## 功能说明

已在网站右下角添加了一个全局音乐播放器，具有以下功能：

- ✅ 点击播放/暂停音乐
- ✅ 音量调节滑块
- ✅ 循环播放
- ✅ 响应式设计，支持移动端

## 如何更换音乐

### 方法 1：使用在线音乐链接（推荐）

编辑文件：`docs/.vitepress/components/MusicPlayer.vue`

找到第 35 行的 `musicUrl` 变量，替换为你喜欢的音乐链接：

```javascript
const musicUrl = '你的音乐链接.mp3'
```

**推荐的免费音乐源：**
- 网易云音乐外链：`https://music.163.com/song/media/outer/url?id=歌曲ID.mp3`
- 其他直链 MP3 地址

### 方法 2：使用本地音乐文件

1. 将音乐文件（MP3格式）放到 `docs/public/` 目录下
2. 修改 `MusicPlayer.vue` 中的 `musicUrl`：

```javascript
const musicUrl = '/your-music.mp3'  // 以 / 开头，相对于 public 目录
```

例如：
- 文件位置：`docs/public/bg-music.mp3`
- 配置写法：`const musicUrl = '/bg-music.mp3'`

## 如何禁用音乐播放器

如果不想显示音乐播放器，有两种方式：

### 方式 1：临时隐藏
在 `MusicPlayer.vue` 中将 `showPlayer` 改为 `false`：

```javascript
const showPlayer = ref(false)  // 改为 false
```

### 方式 2：完全移除
删除或注释掉 `theme/index.ts` 中的音乐播放器注入代码。

## 注意事项

⚠️ **浏览器自动播放限制**：现代浏览器通常禁止页面自动播放音频，需要用户交互（点击）后才能播放。

⚠️ **音乐版权**：请确保你使用的音乐有合法使用权，建议：
- 使用无版权音乐（Royalty-Free Music）
- 使用 Creative Commons 授权的音乐
- 自己创作的音乐

## 推荐免费音乐资源

- [Free Music Archive](https://freemusicarchive.org/)
- [Incompetech](https://incompetech.com/music/)
- [YouTube Audio Library](https://www.youtube.com/audiolibrary)
- [ bensound.com](https://www.bensound.com/)
