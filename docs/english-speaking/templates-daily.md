# 日常通用口语模板

> 这一篇优先解决"最常用、最容易开口"的日常表达。  
> 先背熟这些，再去扩展更复杂的场景。
> 
> 💡 **提示**：点击每句后面的 🔊 按钮可以听到发音

<script setup>
const speak = (text) => {
  if (!window.speechSynthesis) {
    alert('您的浏览器不支持语音合成功能')
    return
  }
  
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.9
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
  font-size: 16px;
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

## 1. 打招呼（10 句）

1. `Hi, how are you?` <button class="speak-btn" @click="speak('Hi, how are you?')">🔊</button>
2. `How's it going?` <button class="speak-btn" @click="speak('How\'s it going?')">🔊</button>
3. `Good morning.` <button class="speak-btn" @click="speak('Good morning.')">🔊</button>
4. `Good afternoon.` <button class="speak-btn" @click="speak('Good afternoon.')">🔊</button>
5. `Good evening.` <button class="speak-btn" @click="speak('Good evening.')">🔊</button>
6. `Nice to see you.` <button class="speak-btn" @click="speak('Nice to see you.')">🔊</button>
7. `Long time no see.` <button class="speak-btn" @click="speak('Long time no see.')">🔊</button>
8. `How have you been?` <button class="speak-btn" @click="speak('How have you been?')">🔊</button>
9. `It's good to see you again.` <button class="speak-btn" @click="speak('It\'s good to see you again.')">🔊</button>
10. `Hope you're doing well.` <button class="speak-btn" @click="speak('Hope you\'re doing well.')">🔊</button>

## 2. 自我表达近况（8 句）

11. `I'm doing well, thanks.` <button class="speak-btn" @click="speak('I\'m doing well, thanks.')">🔊</button>
12. `I've been pretty busy lately.` <button class="speak-btn" @click="speak('I\'ve been pretty busy lately.')">🔊</button>
13. `Things are going well.` <button class="speak-btn" @click="speak('Things are going well.')">🔊</button>
14. `I'm a little tired today.` <button class="speak-btn" @click="speak('I\'m a little tired today.')">🔊</button>
15. `I've had a long day.` <button class="speak-btn" @click="speak('I\'ve had a long day.')">🔊</button>
16. `Everything is fine so far.` <button class="speak-btn" @click="speak('Everything is fine so far.')">🔊</button>
17. `I'm just taking it easy today.` <button class="speak-btn" @click="speak('I\'m just taking it easy today.')">🔊</button>
18. `I've been learning a lot recently.` <button class="speak-btn" @click="speak('I\'ve been learning a lot recently.')">🔊</button>

## 3. 表达感谢（8 句）

19. `Thank you so much.` <button class="speak-btn" @click="speak('Thank you so much.')">🔊</button>
20. `Thanks a lot.` <button class="speak-btn" @click="speak('Thanks a lot.')">🔊</button>
21. `I really appreciate it.` <button class="speak-btn" @click="speak('I really appreciate it.')">🔊</button>
22. `That means a lot to me.` <button class="speak-btn" @click="speak('That means a lot to me.')">🔊</button>
23. `Thanks for your help.` <button class="speak-btn" @click="speak('Thanks for your help.')">🔊</button>
24. `Thanks for your time.` <button class="speak-btn" @click="speak('Thanks for your time.')">🔊</button>
25. `I appreciate your support.` <button class="speak-btn" @click="speak('I appreciate your support.')">🔊</button>
26. `I'm grateful for that.` <button class="speak-btn" @click="speak('I\'m grateful for that.')">🔊</button>

## 4. 表达抱歉（8 句）

27. `I'm sorry.` <button class="speak-btn" @click="speak('I\'m sorry.')">🔊</button>
28. `I'm really sorry about that.` <button class="speak-btn" @click="speak('I\'m really sorry about that.')">🔊</button>
29. `Sorry for the trouble.` <button class="speak-btn" @click="speak('Sorry for the trouble.')">🔊</button>
30. `Sorry I'm late.` <button class="speak-btn" @click="speak('Sorry I\'m late.')">🔊</button>
31. `Sorry to keep you waiting.` <button class="speak-btn" @click="speak('Sorry to keep you waiting.')">🔊</button>
32. `I didn't mean to do that.` <button class="speak-btn" @click="speak('I didn\'t mean to do that.')">🔊</button>
33. `It was my mistake.` <button class="speak-btn" @click="speak('It was my mistake.')">🔊</button>
34. `Please accept my apology.` <button class="speak-btn" @click="speak('Please accept my apology.')">🔊</button>

## 5. 请求帮助（10 句）

35. `Could you help me?` <button class="speak-btn" @click="speak('Could you help me?')">🔊</button>
36. `Could you help me with this?` <button class="speak-btn" @click="speak('Could you help me with this?')">🔊</button>
37. `Can you show me how to do this?` <button class="speak-btn" @click="speak('Can you show me how to do this?')">🔊</button>
38. `Would you mind helping me for a minute?` <button class="speak-btn" @click="speak('Would you mind helping me for a minute?')">🔊</button>
39. `Can I ask you something?` <button class="speak-btn" @click="speak('Can I ask you something?')">🔊</button>
40. `Could you explain that again?` <button class="speak-btn" @click="speak('Could you explain that again?')">🔊</button>
41. `Can you give me an example?` <button class="speak-btn" @click="speak('Can you give me an example?')">🔊</button>
42. `Could you slow down a little?` <button class="speak-btn" @click="speak('Could you slow down a little?')">🔊</button>
43. `Can you speak a bit more clearly?` <button class="speak-btn" @click="speak('Can you speak a bit more clearly?')">🔊</button>
44. `Could you point me in the right direction?` <button class="speak-btn" @click="speak('Could you point me in the right direction?')">🔊</button>

## 6. 表达听不懂（8 句）

45. `I don't understand.` <button class="speak-btn" @click="speak('I don\'t understand.')">🔊</button>
46. `I didn't catch that.` <button class="speak-btn" @click="speak('I didn\'t catch that.')">🔊</button>
47. `Could you say that again?` <button class="speak-btn" @click="speak('Could you say that again?')">🔊</button>
48. `Could you repeat that, please?` <button class="speak-btn" @click="speak('Could you repeat that, please?')">🔊</button>
49. `What do you mean by that?` <button class="speak-btn" @click="speak('What do you mean by that?')">🔊</button>
50. `I'm not sure I follow.` <button class="speak-btn" @click="speak('I\'m not sure I follow.')">🔊</button>
51. `Could you explain it in a simpler way?` <button class="speak-btn" @click="speak('Could you explain it in a simpler way?')">🔊</button>
52. `Let me make sure I understand.` <button class="speak-btn" @click="speak('Let me make sure I understand.')">🔊</button>

## 7. 表达喜欢 / 不喜欢（8 句）

53. `I like it.` <button class="speak-btn" @click="speak('I like it.')">🔊</button>
54. `I love it.` <button class="speak-btn" @click="speak('I love it.')">🔊</button>
55. `I'm really into that.` <button class="speak-btn" @click="speak('I\'m really into that.')">🔊</button>
56. `That sounds great.` <button class="speak-btn" @click="speak('That sounds great.')">🔊</button>
57. `I'm not a big fan of it.` <button class="speak-btn" @click="speak('I\'m not a big fan of it.')">🔊</button>
58. `It's not really my thing.` <button class="speak-btn" @click="speak('It\'s not really my thing.')">🔊</button>
59. `I don't like it that much.` <button class="speak-btn" @click="speak('I don\'t like it that much.')">🔊</button>
60. `I'd rather do something else.` <button class="speak-btn" @click="speak('I\'d rather do something else.')">🔊</button>

## 8. 结束对话（10 句）

61. `I have to go now.` <button class="speak-btn" @click="speak('I have to go now.')">🔊</button>
62. `Talk to you later.` <button class="speak-btn" @click="speak('Talk to you later.')">🔊</button>
63. `See you soon.` <button class="speak-btn" @click="speak('See you soon.')">🔊</button>
64. `See you next time.` <button class="speak-btn" @click="speak('See you next time.')">🔊</button>
65. `Take care.` <button class="speak-btn" @click="speak('Take care.')">🔊</button>
66. `Have a nice day.` <button class="speak-btn" @click="speak('Have a nice day.')">🔊</button>
67. `Have a good one.` <button class="speak-btn" @click="speak('Have a good one.')">🔊</button>
68. `It was nice talking to you.` <button class="speak-btn" @click="speak('It was nice talking to you.')">🔊</button>
69. `Let's catch up again soon.` <button class="speak-btn" @click="speak('Let\'s catch up again soon.')">🔊</button>
70. `Bye for now.` <button class="speak-btn" @click="speak('Bye for now.')">🔊</button>

---

## 使用建议

- 先优先背 `35-52` 这组，它们最实用
- 每次挑 10 句，先读熟再替换关键词
- 把这些句子录音，反复听自己的发音
- **新功能**：点击每句后的 🔊 按钮听标准发音，对照练习
