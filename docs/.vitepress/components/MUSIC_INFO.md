# 音乐功能说明

## 📍 位置
音乐播放按钮位于 **"关于我"** 页面底部。

## 🎵 当前音乐
- **类型**：Lo-Fi 学习音乐（适合编程时听）
- **来源**：Pixabay（免费、无版权）
- **特点**：循环播放、音量适中

## 🔧 如何更换音乐

编辑文件：`docs/about/index.md`

找到第 47 行的音乐链接，替换为你喜欢的：

```javascript
audio = new Audio('你的音乐链接.mp3')
```

### 推荐的免费音乐源：

1. **Pixabay Music**（推荐）
   - 网址：https://pixabay.com/music/
   - 优点：完全免费，无需署名，CDN 稳定

2. **其他选项**（在代码中已注释）：
   ```javascript
   // 自然流水声
   // audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3')
   
   // 柔和钢琴曲
   // audio = new Audio('https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3')
   ```

## 💡 设计理念

- ✅ **简单实用**：只在需要的地方添加，不干扰正常浏览
- ✅ **用户可控**：点击才播放，尊重用户选择
- ✅ **零依赖**：使用浏览器原生 Audio API，无需安装插件
