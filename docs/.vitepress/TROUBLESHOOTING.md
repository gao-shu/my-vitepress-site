# 🔧 语音功能故障排查指南

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
3. 点击发音按钮
4. 查看输出的日志信息

**正常情况应该看到：**
```
✅ 语音播放已启动
```

**异常情况会看到：**
```
❌ 语音播放失败: NotAllowedError
⚠️ 重试第 1 次...
```

### 测试浏览器兼容性

访问以下网站测试你的浏览器：
- Web Speech API: https://caniuse.com/speech-synthesis

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

// 测试 2：测试语音合成
if ('speechSynthesis' in window) {
  const test = new SpeechSynthesisUtterance('Hello World')
  test.lang = 'en-US'
  test.onend = () => console.log('✅ 语音测试成功')
  test.onerror = (e) => console.error('❌ 语音测试失败:', e)
  speechSynthesis.speak(test)
}
```

---

> 💡 **提示**：大多数问题是暂时的，刷新页面或重启浏览器通常能解决。如果问题持续，请检查浏览器是否为最新版本。
