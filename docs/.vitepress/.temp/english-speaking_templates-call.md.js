import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
const __pageData = JSON.parse('{"title":"电话 / 视频沟通模板","description":"","frontmatter":{},"headers":[],"relativePath":"english-speaking/templates-call.md","filePath":"english-speaking/templates-call.md"}');
const __default__ = { name: "english-speaking/templates-call.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="电话-视频沟通模板" tabindex="-1">电话 / 视频沟通模板 <a class="header-anchor" href="#电话-视频沟通模板" aria-label="Permalink to “电话 / 视频沟通模板”">​</a></h1><blockquote><p>这一篇适合打电话、语音、视频会议时使用。<br> 这类场景最常见的问题是：<strong>听不清、卡顿、确认信息、礼貌衔接</strong>。</p><p>💡 <strong>提示</strong>：点击每句后面的 🔊 按钮可以听到发音</p></blockquote><hr><h2 id="_1-接通与确认-10-句" tabindex="-1">1. 接通与确认（10 句） <a class="header-anchor" href="#_1-接通与确认-10-句" aria-label="Permalink to “1. 接通与确认（10 句）”">​</a></h2><ol><li><code>Hello, this is [your name].</code> <button class="speak-btn">🔊</button></li><li><code>Hi, am I speaking to [name]?</code> <button class="speak-btn">🔊</button></li><li><code>Can you hear me clearly?</code> <button class="speak-btn">🔊</button></li><li><code>Can you see my screen?</code> <button class="speak-btn">🔊</button></li><li><code>Is the audio okay on your side?</code> <button class="speak-btn">🔊</button></li><li><code>Thanks for joining the call.</code> <button class="speak-btn">🔊</button></li><li><code>Let&#39;s wait a minute for the others to join.</code> <button class="speak-btn">🔊</button></li><li><code>Can we start now?</code> <button class="speak-btn">🔊</button></li><li><code>I&#39;m calling about today&#39;s update.</code> <button class="speak-btn">🔊</button></li><li><code>I&#39;m reaching out to discuss this issue.</code> <button class="speak-btn">🔊</button></li></ol><h2 id="_2-听不清-网络问题-10-句" tabindex="-1">2. 听不清 / 网络问题（10 句） <a class="header-anchor" href="#_2-听不清-网络问题-10-句" aria-label="Permalink to “2. 听不清 / 网络问题（10 句）”">​</a></h2><ol start="11"><li><code>Your voice is breaking up.</code> <button class="speak-btn">🔊</button></li><li><code>The connection is a bit unstable.</code> <button class="speak-btn">🔊</button></li><li><code>I can&#39;t hear you very well.</code> <button class="speak-btn">🔊</button></li><li><code>Could you say that again?</code> <button class="speak-btn">🔊</button></li><li><code>Could you speak a little louder?</code> <button class="speak-btn">🔊</button></li><li><code>I think your microphone is muted.</code> <button class="speak-btn">🔊</button></li><li><code>The screen is frozen on my side.</code> <button class="speak-btn">🔊</button></li><li><code>You cut out for a second.</code> <button class="speak-btn">🔊</button></li><li><code>Let me reconnect quickly.</code> <button class="speak-btn">🔊</button></li></ol></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("english-speaking/templates-call.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
