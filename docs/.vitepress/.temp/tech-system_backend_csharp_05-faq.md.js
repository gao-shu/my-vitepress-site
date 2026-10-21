import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"C# · 05 常见问题","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/backend/csharp/05-faq.md","filePath":"tech-system/backend/csharp/05-faq.md"}');
const _sfc_main = { name: "tech-system/backend/csharp/05-faq.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="c-·-05-常见问题" tabindex="-1">C# · 05 常见问题 <a class="header-anchor" href="#c-·-05-常见问题" aria-label="Permalink to “C# · 05 常见问题”">​</a></h1><table tabindex="0"><thead><tr><th>问题</th><th>怎么看</th></tr></thead><tbody><tr><td>Framework vs .NET</td><td>先看目标框架；NuGet 与 API 面不同</td></tr><tr><td>桌面卡死</td><td>UI 线程跑了重 IO/计算；改用 async 或后台线程</td></tr><tr><td><code>.Result</code> / <code>.Wait()</code> 死锁</td><td>UI 或同步上下文下常见；async 贯通</td></tr><tr><td>依赖注入找不到服务</td><td>生命周期或未注册；Scoped 误作 Singleton 持有</td></tr><tr><td>配置没读到</td><td>环境名、json 层级、用户机密覆盖</td></tr><tr><td>老 WebForms 无从下手</td><td>先复现 bug，再局部改；别一上来大重构</td></tr><tr><td>要不要用 C# 重写 Java</td><td>默认否；只有场景与团队强绑 .NET 才考虑</td></tr><tr><td>和 Electron 抢桌面</td><td>已有 TS 栈优先 Electron；强 Windows 控件再 C#</td></tr></tbody></table><p>相关：<a href="./01-basics.html">01</a> · <a href="./02-core.html">02</a> · <a href="./03-frameworks.html">03</a> · <a href="./04-engineering.html">04</a> · <a href="./../problems/">后端问题</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/backend/csharp/05-faq.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _05Faq = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  _05Faq as default
};
