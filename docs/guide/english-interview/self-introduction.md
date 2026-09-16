# Self Introduction

第一份由训练产生的面试素材。60 秒是主版本；30 秒 / 90 秒是压缩与扩展。目标不是背得像播音员，而是能脱离稿子、用自己的话稳定介绍自己。

点击 🔊：**问题旁听问题，答案旁听回答**（浏览器 Web Speech，建议 Chrome / Edge）。

返回：[英文技术面试](./) · [90天计划](./90-day-plan)

<script setup>
const clips = {
  s30: `Hi, I'm Gao Shu. I have more than ten years of experience in Java and full-stack development. I've mainly worked on enterprise business systems and industrial applications, including MES-related projects. Recently, I've been focusing more on AI application development and Agent-based systems. Now I'm looking for a remote development role where I can combine my software engineering experience with AI.`,
  s60: `Hi, I'm Gao Shu. I have more than ten years of experience in Java and full-stack development. Most of my work has been related to enterprise business systems and industrial applications. I've worked with Java, Spring Boot, MySQL, Redis, Vue, Docker, and other technologies. I've also worked on MES and industrial digitalization projects, so I'm familiar with both software development and real business requirements. Recently, I've been moving toward AI application development. I've been working with LLMs, prompt engineering, tool calling, workflows, and Agent-based applications. I also built an AI drama writing platform as a personal project. At this stage, I'm looking for a remote development role where I can use my existing engineering experience while continuing to work on AI applications.`,
  s90: `Hi, I'm Gao Shu. I have more than ten years of experience in Java and full-stack development. I started my career mainly with Java backend development, and over the years I've worked on different types of enterprise business systems. My experience includes Java, Spring Boot, MySQL, Redis, Vue, Docker, and distributed systems. I've also worked on MES and industrial digitalization projects. These projects gave me experience not only in software development, but also in understanding business processes and solving problems in real production environments. In recent years, I've become more interested in AI application development. Instead of focusing only on model training, I'm more interested in how we can integrate large language models into real business applications. Recently, I've been working with LLM APIs, prompt engineering, tool calling, workflows, and Agent-based applications. I also built an AI drama writing platform, where AI is involved in different stages of the content generation workflow. So my current direction is a combination of traditional software engineering and AI application development. I'm now looking for a remote role, preferably related to Java full-stack development or AI application development. I hope to use my existing engineering experience while continuing to build practical AI applications.`,
  qEnterprise: `What kind of enterprise systems have you worked on?`,
  qWhyAi: `Why are you moving into AI application development?`,
  aWhyAi: `I already have a strong software engineering background, so I think AI application development is a natural next step for me. I'm interested in how we can connect AI models with real business systems and workflows.`,
  qAiApp: `What kind of AI applications have you built?`,
  aAiApp: `I built an AI drama writing platform. The system uses AI in different stages of the writing workflow, such as planning, script generation, review, and revision.`,
  qWhyRemote: `Why are you looking for a remote job?`,
  aWhyRemote: `I'm looking for a remote role because I think it allows me to work with a wider range of teams and companies. I'm also comfortable working independently and communicating with teammates online.`
}

const speak = (key) => {
  if (!window.speechSynthesis) {
    alert('您的浏览器不支持语音合成功能\n\n建议使用 Chrome、Edge 或 Safari')
    return
  }
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(clips[key])
  utterance.lang = 'en-US'
  utterance.rate = 0.9
  utterance.volume = 1.0
  utterance.onerror = (event) => {
    if (event.error === 'interrupted') return
    if (event.error === 'not-allowed') {
      alert('语音播放被阻止，请先点击页面任意位置后再试')
      return
    }
    alert(`语音播放失败 (${event.error})，可刷新后重试`)
  }
  window.speechSynthesis.speak(utterance)
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

## 30 Seconds <button class="speak-btn" @click="speak('s30')" title="播放 30 秒版本">🔊</button>

Hi, I'm Gao Shu. I have more than ten years of experience in Java and full-stack development.

I've mainly worked on enterprise business systems and industrial applications, including MES-related projects.

Recently, I've been focusing more on AI application development and Agent-based systems.

Now I'm looking for a remote development role where I can combine my software engineering experience with AI.

---

## 60 Seconds（主版本） <button class="speak-btn" @click="speak('s60')" title="播放 60 秒版本">🔊</button>

Hi, I'm Gao Shu. I have more than ten years of experience in Java and full-stack development.

Most of my work has been related to enterprise business systems and industrial applications. I've worked with Java, Spring Boot, MySQL, Redis, Vue, Docker, and other technologies.

I've also worked on MES and industrial digitalization projects, so I'm familiar with both software development and real business requirements.

Recently, I've been moving toward AI application development. I've been working with LLMs, prompt engineering, tool calling, workflows, and Agent-based applications. I also built an AI drama writing platform as a personal project.

At this stage, I'm looking for a remote development role where I can use my existing engineering experience while continuing to work on AI applications.

---

## 90 Seconds <button class="speak-btn" @click="speak('s90')" title="播放 90 秒版本">🔊</button>

Hi, I'm Gao Shu. I have more than ten years of experience in Java and full-stack development.

I started my career mainly with Java backend development, and over the years I've worked on different types of enterprise business systems. My experience includes Java, Spring Boot, MySQL, Redis, Vue, Docker, and distributed systems.

I've also worked on MES and industrial digitalization projects. These projects gave me experience not only in software development, but also in understanding business processes and solving problems in real production environments.

In recent years, I've become more interested in AI application development. Instead of focusing only on model training, I'm more interested in how we can integrate large language models into real business applications.

Recently, I've been working with LLM APIs, prompt engineering, tool calling, workflows, and Agent-based applications. I also built an AI drama writing platform, where AI is involved in different stages of the content generation workflow.

So my current direction is a combination of traditional software engineering and AI application development.

I'm now looking for a remote role, preferably related to Java full-stack development or AI application development. I hope to use my existing engineering experience while continuing to build practical AI applications.

---

## Key Words

- Java / full-stack development
- Enterprise business systems
- Industrial applications
- MES
- Industrial digitalization
- Spring Boot
- MySQL
- Redis
- Vue
- Docker
- LLM
- Prompt engineering
- Tool calling
- Workflow
- Agent-based applications
- AI application development

---

## Possible Follow-up Questions

### 1. What kind of enterprise systems have you worked on? <button class="speak-btn" @click="speak('qEnterprise')" title="播放问题">🔊</button>

主要准备：ERP、CRM、HR、OA、MES、other business systems。

不要一次全部说，优先选择和目标岗位最相关的项目。

### 2. Why are you moving into AI application development? <button class="speak-btn" @click="speak('qWhyAi')" title="播放问题">🔊</button>

核心不是说「AI 很火」，而是技术路线：

> I already have a strong software engineering background, so I think AI application development is a natural next step for me. I'm interested in how we can connect AI models with real business systems and workflows. <button class="speak-btn" @click="speak('aWhyAi')" title="播放回答">🔊</button>

### 3. What kind of AI applications have you built? <button class="speak-btn" @click="speak('qAiApp')" title="播放问题">🔊</button>

重点讲 AI 漫剧平台（个人项目 / 正在推进，不夸大已上线）：

> I built an AI drama writing platform. The system uses AI in different stages of the writing workflow, such as planning, script generation, review, and revision. <button class="speak-btn" @click="speak('aAiApp')" title="播放回答">🔊</button>

然后根据面试官追问继续展开。

### 4. Why are you looking for a remote job? <button class="speak-btn" @click="speak('qWhyRemote')" title="播放问题">🔊</button>

保持简单、职业化：

> I'm looking for a remote role because I think it allows me to work with a wider range of teams and companies. I'm also comfortable working independently and communicating with teammates online. <button class="speak-btn" @click="speak('aWhyRemote')" title="播放回答">🔊</button>

不要把重点放在「不想上班」或「通勤太远」。

---

## Training Notes

这一页不是为了背下来。

训练阶段：

1. 看稿能够完整说完
2. 只看关键词能够说完
3. 不看稿自然表达
4. 面对追问能够继续回答

### 我的当前问题

每次练习后记录：

- 哪些句子说不出来？
- 哪些单词容易卡住？
- 哪些地方需要中文思考后再翻译？
- 面试官可能继续追问什么？

最终目标：

> **不是把这篇稿子背得像播音员，而是能够脱离稿子，用自己的话稳定地介绍自己。**
