# 🔧 语音/音乐功能故障排查指南

## 🎤 英语口语发音功能

### 常见问题

#### 1. "语音播放失败，请重试"

**原因分析：**
- 浏览器语音合成服务临时故障
- 网络问题导致语音包加载失败
- 浏览器限制了连续播放

**解决方案：**
✅ **已自动优化**：代码现在会自动重试 2 次
✅ 如果仍然失败，会显示具体错误类型

**手动排查：**
```javascript
// 在浏览器控制台运行测试
console.log('语音合成支持:', 'speechSynthesis' in window)

// 测试基本发音
const test = new SpeechSynthesisUtterance('Test')
test.lang = 'en-US'
speechSynthesis.speak(test)
```

#### 2. 完全没有声音

**检查清单：**
- [ ] 浏览器是否静音？（检查系统音量）
- [ ] 是否使用了支持的浏览器？（推荐 Chrome/Edge/Safari）
- [ ] 页面是否有其他音频在播放？
- [ ] 是否点击了页面任意位置？（浏览器安全策略）

**解决步骤：**
1. 刷新页面
2. 点击页面空白处
3. 再次点击发音按钮
4. 检查浏览器控制台（F12）的错误信息

#### 3. 声音很小或听不清

**调整方法：**
- 调大系统音量
- 使用耳机测试
- 代码中已设置音量为 100%（最大值）

---

## 🎵 背景音乐播放器

### 常见问题

#### 1. "音乐加载失败"

**原因分析：**
- 网络连接问题
- CDN 链接暂时不可用
- 防火墙/代理阻止

**解决方案：**
✅ **已自动优化**：配置了 3 个备用音乐链接，自动切换
✅ 第一个链接失败会自动尝试第二个、第三个

**手动排查：**
```javascript
// 在浏览器控制台测试音乐链接
const testAudio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3')
testAudio.play()
  .then(() => console.log('✅ 音乐链接正常'))
  .catch(err => console.error('❌ 音乐链接失败:', err))
```

#### 2. 点击播放没反应

**可能原因：**
- 浏览器阻止了自动播放
- 页面还未完全加载

**解决步骤：**
1. 确保页面完全加载完成
2. 点击页面任意位置
3. 再次点击播放按钮
4. 查看浏览器控制台是否有错误

#### 3. 音乐卡顿或断断续续

**原因：**
- 网络速度慢
- CDN 服务器负载高

**解决方案：**
- 等待缓冲完成再播放
- 切换到其他备用链接（会自动进行）
- 检查网络连接

---

## 🌐 GitHub Pages 部署后的问题

### 1. 本地正常，部署后不工作

**常见原因：**
- `base` 配置不正确
- HTTPS 证书问题（GitHub Pages 自动提供）
- 跨域资源被阻止

**检查步骤：**
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签的错误信息
3. 查看 Network 标签的资源加载状态
4. 确认网站使用 HTTPS（地址栏应有锁图标）

### 2. 移动端无法播放

**iOS Safari 特别注意：**
- 首次使用需要用户授权
- 可能在设置中禁用了语音功能

**解决：**
- 前往 设置 → Safari → 检查权限
- 确保允许网站使用麦克风和语音

**Android Chrome：**
- 通常无需额外配置
- 确保 Chrome 是最新版本

---

## 🔍 高级调试技巧

### 查看浏览器控制台

1. 按 `F12` 打开开发者工具
2. 切换到 **Console** 标签
3. 点击发音/播放按钮
4. 查看输出的日志信息

**正常情况应该看到：**
```
✅ 语音播放已启动
🎵 开始播放音乐
✅ 音乐加载成功
```

**异常情况会看到：**
```
❌ 语音播放失败: NotAllowedError
⚠️ 重试第 1 次...
音乐加载失败: NetworkError
```

### 测试浏览器兼容性

访问以下网站测试你的浏览器：
- Web Speech API: https://caniuse.com/speech-synthesis
- HTML5 Audio: https://caniuse.com/audio

### 清除缓存

如果之前能正常工作，突然不行了：
1. 按 `Ctrl + Shift + Delete`（Windows）或 `Cmd + Shift + Delete`（Mac）
2. 清除浏览器缓存和 Cookie
3. 刷新页面重试

---

## 📞 仍然有问题？

### 收集以下信息：

1. **浏览器信息**
   - 浏览器名称和版本
   - 操作系统（Windows/Mac/iOS/Android）

2. **错误信息**
   - 浏览器控制台的完整错误日志
   - 截图（如果有弹窗提示）

3. **重现步骤**
   - 如何操作会出现问题
   - 是否每次都会出现

4. **网络环境**
   - 是否使用代理/VPN
   - 公司网络还是家庭网络

### 快速测试代码

在浏览器控制台粘贴以下代码：

```javascript
// 测试 1：检查浏览器支持
console.log('=== 浏览器能力检测 ===')
console.log('Web Speech API:', 'speechSynthesis' in window)
console.log('HTML5 Audio:', typeof Audio !== 'undefined')

// 测试 2：测试语音合成
if ('speechSynthesis' in window) {
  const test = new SpeechSynthesisUtterance('Hello World')
  test.lang = 'en-US'
  test.onend = () => console.log('✅ 语音测试成功')
  test.onerror = (e) => console.error('❌ 语音测试失败:', e)
  speechSynthesis.speak(test)
}

// 测试 3：测试音频播放
const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3')
audio.play()
  .then(() => {
    console.log('✅ 音频测试成功')
    audio.pause()
  })
  .catch(err => console.error('❌ 音频测试失败:', err))
```

---

> 💡 **提示**：大多数问题是暂时的，刷新页面或重启浏览器通常能解决。如果问题持续，请检查浏览器是否为最新版本。
