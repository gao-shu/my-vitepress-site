# 电话 / 视频沟通模板

> 这一篇适合打电话、语音、视频会议时使用。  
> 这类场景最常见的问题是：**听不清、卡顿、确认信息、礼貌衔接**。
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

## 1. 接通与确认（10 句）

1. `Hello, this is [your name].` <button class="speak-btn" onclick="speak('Hello, this is [your name].')">🔊</button>
2. `Hi, am I speaking to [name]?` <button class="speak-btn" onclick="speak('Hi, am I speaking to [name]?')">🔊</button>
3. `Can you hear me clearly?` <button class="speak-btn" onclick="speak('Can you hear me clearly?')">🔊</button>
4. `Can you see my screen?` <button class="speak-btn" onclick="speak('Can you see my screen?')">🔊</button>
5. `Is the audio okay on your side?` <button class="speak-btn" onclick="speak('Is the audio okay on your side?')">🔊</button>
6. `Thanks for joining the call.` <button class="speak-btn" onclick="speak('Thanks for joining the call.')">🔊</button>
7. `Let's wait a minute for the others to join.` <button class="speak-btn" onclick="speak('Let\'s wait a minute for the others to join.')">🔊</button>
8. `Can we start now?` <button class="speak-btn" onclick="speak('Can we start now?')">🔊</button>
9. `I'm calling about today's update.` <button class="speak-btn" onclick="speak('I\'m calling about today\'s update.')">🔊</button>
10. `I'm reaching out to discuss this issue.` <button class="speak-btn" onclick="speak('I\'m reaching out to discuss this issue.')">🔊</button>

## 2. 听不清 / 网络问题（10 句）

11. `Your voice is breaking up.` <button class="speak-btn" onclick="speak('Your voice is breaking up.')">🔊</button>
12. `The connection is a bit unstable.` <button class="speak-btn" onclick="speak('The connection is a bit unstable.')">🔊</button>
13. `I can't hear you very well.` <button class="speak-btn" onclick="speak('I can\'t hear you very well.')">🔊</button>
14. `Could you say that again?` <button class="speak-btn" onclick="speak('Could you say that again?')">🔊</button>
15. `Could you speak a little louder?` <button class="speak-btn" onclick="speak('Could you speak a little louder?')">🔊</button>
16. `I think your microphone is muted.` <button class="speak-btn" onclick="speak('I think your microphone is muted.')">🔊</button>
17. `The screen is frozen on my side.` <button class="speak-btn" onclick="speak('The screen is frozen on my side.')">🔊</button>
18. `You cut out for a second.` <button class="speak-btn" onclick="speak('You cut out for a second.')">🔊</button>
19. `Let me reconnect quickly.` <button class="speak-btn" onclick="speak('Let me reconnect quickly.')">🔊</button>