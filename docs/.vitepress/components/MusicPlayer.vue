<template>
  <div class="music-player-container" v-if="showPlayer">
    <button 
      class="music-toggle-btn" 
      @click="togglePlay"
      :title="isPlaying ? '暂停音乐' : '播放音乐'"
    >
      <span class="music-icon">{{ isPlaying ? '⏸️' : '🎵' }}</span>
    </button>
    
    <div class="music-controls" v-show="isPlaying">
      <div class="volume-control">
        <span class="volume-icon">🔊</span>
        <input 
          type="range" 
          min="0" 
          max="100" 
          v-model="volume"
          @input="changeVolume"
          class="volume-slider"
          title="调节音量"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showPlayer = ref(true)
const isPlaying = ref(false)
const volume = ref(50)
let audio = null

// 音乐文件路径 - 你可以替换为自己的音乐文件
// 支持本地文件（放在 public 目录）或在线链接
// 以下是几个可用的免费轻音乐链接，选择一个即可：
const musicUrl = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3' // 推荐：Lo-Fi 学习音乐（Pixabay 免费）
// const musicUrl = 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=relaxing-mountains-rivers-streams-running-water-18178.mp3' // 备选：自然流水声
// const musicUrl = 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=soft-piano-100-bpm-121529.mp3' // 备选：柔和钢琴曲

onMounted(() => {
  // 创建音频对象
  audio = new Audio(musicUrl)
  audio.loop = true // 循环播放
  audio.volume = volume.value / 100
  
  // 监听播放结束
  audio.addEventListener('ended', () => {
    isPlaying.value = false
  })
  
  // 监听错误
  audio.addEventListener('error', (e) => {
    console.error('音频加载失败:', e)
    alert('音乐加载失败，请检查网络连接或音乐链接')
  })
})

onUnmounted(() => {
  if (audio) {
    audio.pause()
    audio = null
  }
})

const togglePlay = () => {
  if (!audio) return
  
  if (isPlaying.value) {
    audio.pause()
    isPlaying.value = false
  } else {
    audio.play().then(() => {
      isPlaying.value = true
    }).catch(err => {
      console.error('播放失败:', err)
      alert('播放失败，可能是浏览器限制了自动播放')
    })
  }
}

const changeVolume = () => {
  if (audio) {
    audio.volume = volume.value / 100
  }
}
</script>

<style scoped>
.music-player-container {
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.music-toggle-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-brand);
  background: var(--vp-c-bg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.music-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  background: var(--vp-c-brand);
}

.music-icon {
  font-size: 24px;
}

.music-controls {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 150px;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-icon {
  font-size: 16px;
}

.volume-slider {
  width: 100px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--vp-c-divider);
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  cursor: pointer;
  border: none;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .music-player-container {
    bottom: 60px;
    right: 15px;
  }
  
  .music-toggle-btn {
    width: 45px;
    height: 45px;
  }
  
  .music-icon {
    font-size: 20px;
  }
}
</style>
