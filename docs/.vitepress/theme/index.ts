import DefaultTheme from 'vitepress/theme'

export default {
  extends: DefaultTheme
}

// 注入全局音乐播放器
function injectGlobalMusicPlayer() {
  // 检查是否已存在
  if (document.getElementById('global-music-player')) {
    return
  }
  
  // 创建样式
  const style = document.createElement('style')
  style.textContent = `
    #global-music-player {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: var(--vp-c-brand);
      color: white;
      border-radius: 50px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      user-select: none;
    }
    
    #global-music-player:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
    
    #global-music-player.playing {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    
    #music-icon {
      font-size: 18px;
    }
    
    #music-text {
      display: none;
    }
    
    #global-music-player:hover #music-text {
      display: inline;
    }
    
    @media (max-width: 768px) {
      #global-music-player {
        bottom: 10px;
        right: 10px;
        padding: 8px 12px;
      }
    }
  `
  document.head.appendChild(style)
  
  // 创建按钮
  const btn = document.createElement('div')
  btn.id = 'global-music-player'
  btn.innerHTML = '<span id="music-icon">🎵</span><span id="music-text">播放音乐</span>'
  document.body.appendChild(btn)
  
  // 初始化音频
  let audio = null
  let isPlaying = false
  
  // 绑定点击事件
  btn.addEventListener('click', function() {
    if (!audio) {
      // 久石让风格轻音乐 - Pixabay 免费资源
      audio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3')
      audio.loop = true
      audio.volume = 0.4
      
      audio.addEventListener('error', function() {
        console.error('❌ 音乐加载失败')
        isPlaying = false
        updateUI()
      })
    }
    
    if (isPlaying) {
      audio.pause()
      isPlaying = false
    } else {
      audio.play().then(function() {
        isPlaying = true
      }).catch(function(err) {
        console.error('❌ 播放失败:', err)
      })
    }
    
    updateUI()
  })
  
  // 更新 UI
  function updateUI() {
    const icon = document.getElementById('music-icon')
    const text = document.getElementById('music-text')
    
    if (icon && text) {
      icon.textContent = isPlaying ? '⏸️' : '🎵'
      text.textContent = isPlaying ? '暂停' : '播放'
      
      if (isPlaying) {
        btn.classList.add('playing')
      } else {
        btn.classList.remove('playing')
      }
    }
  }
  
  console.log('✅ 全局音乐播放器已加载')
}

// 确保音乐播放器在路由切换后仍然存在
function ensureMusicPlayerExists() {
  if (!document.getElementById('global-music-player')) {
    console.log('🔄 重新注入音乐播放器')
    injectGlobalMusicPlayer()
  }
}
