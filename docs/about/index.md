# 关于我

## 我为什么做这个网站？

**最核心的目标：通过输出倒逼输入，让自己持续学习和成长。**

这个网站首先是我个人的**学习成长记录**。通过系统整理和输出技术知识，我能够：

- 📝 **加深理解**：把学到的知识写出来，强迫自己真正理解，而不是停留在表面
- 🎯 **建立体系**：将零散的知识点串联成完整的知识体系，形成自己的技术框架
- 🔄 **持续迭代**：随着学习的深入，不断更新和完善内容，见证自己的成长轨迹
- 💡 **反思总结**：在整理过程中发现知识盲区，明确下一步学习方向

## 次要目标：知识分享

在自我学习的同时，我也希望这些整理的内容能够：

- 🌱 帮助到同样在学习的开发者，特别是初学者
- 📚 提供一个系统化的学习路径参考
- 🤝 与大家交流技术，共同进步

## 我的学习方向

目前主要专注于：

✓ **Java 后端技术**：基础、框架、微服务架构  
✓ **数据库与中间件**：MySQL、Redis、消息队列等  
✓ **AI 技术栈**：大模型、Agent、RAG 等 AI 学习与工程实践  

## 我的学习方式

- **系统化学习**：按模块整理，构建完整知识体系
- **实战驱动**：结合项目实践，学以致用
- **输出倒逼输入**：通过写作加深理解，发现盲区
- **持续更新**：跟随技术发展，不断迭代内容

---

> 💭 **我的理念**：最好的学习方式就是尝试教会别人。这个网站是我学习路上的见证，也是我不断进步的动力。

感谢你的访问！如果这些内容对你有帮助，那我会很开心；如果发现错误或不足，也欢迎指正，这同样是我学习的机会。

## 🎵 听首歌放松一下

<div style="margin-top: 2rem; padding: 1.5rem; background: var(--vp-c-bg-soft); border-radius: 8px; text-align: center;">
  <p style="margin-bottom: 1rem; color: var(--vp-c-text-2);">工作累了？听首《Summer》放松一下吧 ☕</p>
  <button id="musicBtn" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: var(--vp-c-brand); color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0, 0, 0, 0.1)'">
    <span id="musicIcon">🎵</span>
    <span id="musicText">播放音乐</span>
  </button>
</div>

<script>
(function() {
  let audio = null;
  let isPlaying = false;
  
  function toggleMusic() {
    console.log('🎵 点击了音乐按钮');
    
    if (!audio) {
      // 久石让风格轻音乐 - Pixabay 免费资源
      audio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3');
      audio.loop = true;
      audio.volume = 0.5;
      
      audio.addEventListener('error', function(e) {
        console.error('❌ 音乐加载失败:', e);
        alert('⚠️ 音乐加载失败\n\n请检查网络连接后重试');
        isPlaying = false;
        updateButton();
      });
      
      audio.addEventListener('canplaythrough', function() {
        console.log('✅ 音乐可以播放了');
      });
    }
    
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      console.log('⏸️ 音乐已暂停');
    } else {
      audio.play().then(function() {
        isPlaying = true;
        console.log('▶️ 音乐开始播放');
      }).catch(function(err) {
        console.error('❌ 播放失败:', err);
        if (err.name === 'NotAllowedError') {
          alert('⚠️ 播放被阻止\n\n请先点击页面任意位置，然后再试');
        } else {
          alert('⚠️ 播放失败: ' + err.message);
        }
      });
    }
    
    updateButton();
  }
  
  function updateButton() {
    const icon = document.getElementById('musicIcon');
    const text = document.getElementById('musicText');
    if (icon && text) {
      icon.textContent = isPlaying ? '⏸️' : '🎵';
      text.textContent = isPlaying ? '暂停音乐' : '播放音乐';
    }
  }
  
  // 立即执行绑定，不等待 DOMContentLoaded
  function bindEvent() {
    const btn = document.getElementById('musicBtn');
    if (btn) {
      console.log('✅ 找到音乐按钮，绑定点击事件');
      btn.onclick = toggleMusic;
      return true;
    }
    return false;
  }
  
  // 尝试立即绑定
  if (!bindEvent()) {
    // 如果没找到，等待一小段时间再试（VitePress SPA 路由）
    setTimeout(bindEvent, 100);
    setTimeout(bindEvent, 500);
    setTimeout(bindEvent, 1000);
  }
})();
</script>