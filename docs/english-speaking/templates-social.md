# 社交寒暄口语模板

> 这一篇适合初次见面、轻松交流、聊天破冰、发出邀请、礼貌回应。  
> 社交口语的重点是：**自然、轻松、不要太书面**。
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

## 1. 初次见面（10 句）

1. `Nice to meet you.` <button class="speak-btn" onclick="speak('Nice to meet you.')">🔊</button>
2. `It's great to meet you.` <button class="speak-btn" onclick="speak('It\'s great to meet you.')">🔊</button>
3. `I've heard a lot about you.` <button class="speak-btn" onclick="speak('I\'ve heard a lot about you.')">🔊</button>
4. `Thanks for taking the time to meet me.` <button class="speak-btn" onclick="speak('Thanks for taking the time to meet me.')">🔊</button>
5. `I'm glad we finally met.` <button class="speak-btn" onclick="speak('I\'m glad we finally met.')">🔊</button>
6. `Please call me [name].` <button class="speak-btn" onclick="speak('Please call me [name].')">🔊</button>
7. `Let me introduce myself.` <button class="speak-btn" onclick="speak('Let me introduce myself.')">🔊</button>
8. `It's a pleasure to meet you.` <button class="speak-btn" onclick="speak('It\'s a pleasure to meet you.')">🔊</button>
9. `I've been looking forward to meeting you.` <button class="speak-btn" onclick="speak('I\'ve been looking forward to meeting you.')">🔊</button>
10. `Thanks for being here.` <button class="speak-btn" onclick="speak('Thanks for being here.')">🔊</button>

## 2. 轻松聊天（10 句）

11. `How's your day going?` <button class="speak-btn" onclick="speak('How\'s your day going?')">🔊</button>
12. `What have you been up to lately?` <button class="speak-btn" onclick="speak('What have you been up to lately?')">🔊</button>
13. `How was your weekend?` <button class="speak-btn" onclick="speak('How was your weekend?')">🔊</button>
14. `Did you do anything fun recently?` <button class="speak-btn" onclick="speak('Did you do anything fun recently?')">🔊</button>
15. `That's interesting. Tell me more.` <button class="speak-btn" onclick="speak('That\'s interesting. Tell me more.')">🔊</button>
16. `That sounds really nice.` <button class="speak-btn" onclick="speak('That sounds really nice.')">🔊</button>
17. `I've had a similar experience.` <button class="speak-btn" onclick="speak('I\'ve had a similar experience.')">🔊</button>
18. `I know what you mean.` <button class="speak-btn" onclick="speak('I know what you mean.')">🔊</button>
19. `That must have been exciting.` <button class="speak-btn" onclick="speak('That must have been exciting.')">🔊</button>