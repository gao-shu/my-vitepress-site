# 会议表达口语模板

> 这一篇适合开会时发言、补充、提问、同意、不同意、总结。  
> 会上最重要的是：**短句、清晰、自然接话**。
> 
> 💡 **提示**：点击每句后面的 🔊 按钮可以听到发音

<script setup>
const speak = (text) => {
  // 检查浏览器支持
  if (!window.speechSynthesis) {
    alert('❌ 您的浏览器不支持语音合成功能\n\n建议使用 Chrome、Edge 或 Safari 浏览器')
    return
  }
  
  // 如果正在播放，先停止
  window.speechSynthesis.cancel()
  
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.9  // 语速稍慢，便于学习
  utterance.volume = 1.0  // 最大音量
  
  let retryCount = 0
  const maxRetries = 2
  
  // 错误处理
  utterance.onerror = (event) => {
    console.error('语音播放失败:', event)
    
    // 如果是 "interrupted" 错误，通常是正常的（被新的播放中断）
    if (event.error === 'interrupted') {
      console.log('播放被中断（正常现象）')
      return
    }
    
    // 尝试重试
    if (retryCount < maxRetries && event.error !== 'not-allowed') {
      retryCount++
      console.log(`重试第 ${retryCount} 次...`)
      
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance)
        } catch (err) {
          console.error('重试失败:', err)
        }
      }, 300)
      return
    }
    
    // 显示错误提示
    if (event.error === 'not-allowed') {
      alert('⚠️ 语音播放被阻止\n\n请点击页面任意位置后再试')
    } else if (event.error === 'network') {
      alert('⚠️ 网络连接问题\n\n请检查网络后重试')
    } else {
      alert(`语音播放失败 (${event.error})\n\n建议：刷新页面后重试`)
    }
  }
  
  // 开始播放
  try {
    window.speechSynthesis.speak(utterance)
    console.log('✅ 语音播放已启动')
  } catch (err) {
    console.error('播放异常:', err)
    alert('播放失败，请刷新页面后重试')
  }
}
</script>

<style>
.speak-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  padding: 2px 8px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background-color: var(--vp-c-bg-soft);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  vertical-align: middle;
}

.speak-btn:hover {
  background-color: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
  transform: scale(1.05);
}

.speak-btn:active {
  transform: scale(0.95);
}
</style>

---

## 1. 会议开场（10 句）

1. `Let's get started.` <button class="speak-btn" onclick="speak('Let\'s get started.')">🔊</button>
2. `Thanks, everyone, for joining.` <button class="speak-btn" onclick="speak('Thanks, everyone, for joining.')">🔊</button>
3. `Let's begin with a quick overview.` <button class="speak-btn" onclick="speak('Let\'s begin with a quick overview.')">🔊</button>
4. `The purpose of today's meeting is to discuss this issue.` <button class="speak-btn" onclick="speak('The purpose of today\'s meeting is to discuss this issue.')">🔊</button>
5. `I'll briefly walk through the current status.` <button class="speak-btn" onclick="speak('I\'ll briefly walk through the current status.')">🔊</button>
6. `Let's start with the main point.` <button class="speak-btn" onclick="speak('Let\'s start with the main point.')">🔊</button>
7. `We have a few things to cover today.` <button class="speak-btn" onclick="speak('We have a few things to cover today.')">🔊</button>
8. `First, let's review where we are.` <button class="speak-btn" onclick="speak('First, let\'s review where we are.')">🔊</button>
9. `I'd like to start with a short update.` <button class="speak-btn" onclick="speak('I\'d like to start with a short update.')">🔊</button>
10. `Let's go through the agenda together.` <button class="speak-btn" onclick="speak('Let\'s go through the agenda together.')">🔊</button>

## 2. 补充观点（10 句）

11. `I'd like to add something here.` <button class="speak-btn" onclick="speak('I\'d like to add something here.')">🔊</button>
12. `Let me add one more point.` <button class="speak-btn" onclick="speak('Let me add one more point.')">🔊</button>
13. `I want to build on that.` <button class="speak-btn" onclick="speak('I want to build on that.')">🔊</button>
14. `From my perspective, this is important.` <button class="speak-btn" onclick="speak('From my perspective, this is important.')">🔊</button>
15. `I think there's another angle to consider.` <button class="speak-btn" onclick="speak('I think there\'s another angle to consider.')">🔊</button>
16. `One thing we should keep in mind is this.` <button class="speak-btn" onclick="speak('One thing we should keep in mind is this.')">🔊</button>
17. `I'd also like to point out that...` <button class="speak-btn" onclick="speak('I\'d also like to point out that...')">🔊</button>
18. `Another thing to consider is the timeline.` <button class="speak-btn" onclick="speak('Another thing to consider is the timeline.')">🔊</button>
19. `We should also think about the impact.` <button class="speak-btn" onclick="speak('We should also think about the impact.')">🔊</button>