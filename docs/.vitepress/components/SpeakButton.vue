<template>
  <button 
    class="speak-button" 
    @click="speak"
    :title="'点击播放发音: ' + text"
  >
    🔊
  </button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  lang: {
    type: String,
    default: 'en-US'
  },
  rate: {
    type: Number,
    default: 0.9
  }
})

const isSpeaking = ref(false)

const speak = () => {
  if (!window.speechSynthesis) {
    alert('您的浏览器不支持语音合成功能')
    return
  }

  // 如果正在播放，先停止
  if (isSpeaking.value) {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
    return
  }

  const utterance = new SpeechSynthesisUtterance(props.text)
  utterance.lang = props.lang
  utterance.rate = props.rate
  utterance.pitch = 1
  
  utterance.onstart = () => {
    isSpeaking.value = true
  }
  
  utterance.onend = () => {
    isSpeaking.value = false
  }
  
  utterance.onerror = () => {
    isSpeaking.value = false
  }

  window.speechSynthesis.speak(utterance)
}
</script>

<style scoped>
.speak-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  padding: 4px 8px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background-color: var(--vp-c-bg-soft);
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.speak-button:hover {
  background-color: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
  transform: scale(1.05);
}

.speak-button:active {
  transform: scale(0.95);
}
</style>
