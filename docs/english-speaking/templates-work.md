# 工作沟通口语模板

> 这一篇适合工作、协作、汇报、催进度、说明问题等常见表达。  
> 重点不是高级词汇，而是**简单、清楚、礼貌**。
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

## 1. 开始沟通（8 句）

1. `I'd like to discuss something with you.` <button class="speak-btn" onclick="speak('I\'d like to discuss something with you.')">🔊</button>
2. `Do you have a minute?` <button class="speak-btn" onclick="speak('Do you have a minute?')">🔊</button>
3. `Can we talk about this for a moment?` <button class="speak-btn" onclick="speak('Can we talk about this for a moment?')">🔊</button>
4. `I want to give you a quick update.` <button class="speak-btn" onclick="speak('I want to give you a quick update.')">🔊</button>
5. `I need your input on this.` <button class="speak-btn" onclick="speak('I need your input on this.')">🔊</button>
6. `I'd like to get your opinion.` <button class="speak-btn" onclick="speak('I\'d like to get your opinion.')">🔊</button>
7. `Let's go over this together.` <button class="speak-btn" onclick="speak('Let\'s go over this together.')">🔊</button>
8. `I want to make sure we're aligned.` <button class="speak-btn" onclick="speak('I want to make sure we\'re aligned.')">🔊</button>

## 2. 反馈进度（10 句）

9. `I'm working on it now.` <button class="speak-btn" onclick="speak('I\'m working on it now.')">🔊</button>
10. `I've already started on it.` <button class="speak-btn" onclick="speak('I\'ve already started on it.')">🔊</button>
11. `It's currently in progress.` <button class="speak-btn" onclick="speak('It\'s currently in progress.')">🔊</button>
12. `I'm almost done.` <button class="speak-btn" onclick="speak('I\'m almost done.')">🔊</button>
13. `I've completed the first part.` <button class="speak-btn" onclick="speak('I\'ve completed the first part.')">🔊</button>
14. `I'm waiting for the final confirmation.` <button class="speak-btn" onclick="speak('I\'m waiting for the final confirmation.')">🔊</button>
15. `We are on schedule.` <button class="speak-btn" onclick="speak('We are on schedule.')">🔊</button>
16. `We're making good progress.` <button class="speak-btn" onclick="speak('We\'re making good progress.')">🔊</button>
17. `There are still a few things to finish.` <button class="speak-btn" onclick="speak('There are still a few things to finish.')">🔊</button>
18. `I expect to finish it by tomorrow.` <button class="speak-btn" onclick="speak('I expect to finish it by tomorrow.')">🔊</button>