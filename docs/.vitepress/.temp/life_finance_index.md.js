import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"财务","description":"","frontmatter":{},"headers":[],"relativePath":"life/finance/index.md","filePath":"life/finance/index.md"}');
const _sfc_main = { name: "life/finance/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="财务" tabindex="-1">财务 <a class="header-anchor" href="#财务" aria-label="Permalink to “财务”">​</a></h1><blockquote><p>模块定位：先建立现金流与风险缓冲，再谈进阶配置。<br> 以下为示例骨架，数字请按你自己的实际情况替换。</p></blockquote><h2 id="建议阅读顺序" tabindex="-1">建议阅读顺序 <a class="header-anchor" href="#建议阅读顺序" aria-label="Permalink to “建议阅读顺序”">​</a></h2><ol><li><a href="./budget-basics.html">记账与月度复盘</a> — 先看清钱去哪了</li><li><a href="./emergency-fund.html">应急金：先给自己买安全感</a> — 抗波动</li><li><a href="./money-mindset.html">理财认知入门（非荐股）</a> — 原则层，不做具体荐基荐股</li></ol><h2 id="使用方式" tabindex="-1">使用方式 <a class="header-anchor" href="#使用方式" aria-label="Permalink to “使用方式”">​</a></h2><ul><li>先跑通「记账 → 复盘 → 应急金」，再考虑复杂产品</li><li>本站内容是个人学习笔记，不构成投资建议</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("life/finance/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
