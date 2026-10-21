import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"学习计划","description":"","frontmatter":{},"headers":[],"relativePath":"growth/learning-plan/index.md","filePath":"growth/learning-plan/index.md"}');
const _sfc_main = { name: "growth/learning-plan/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="学习计划" tabindex="-1">学习计划 <a class="header-anchor" href="#学习计划" aria-label="Permalink to “学习计划”">​</a></h1><blockquote><p>归属：<strong>成长 / 学习计划</strong><br> 回答「我要怎么学」，可与知识路线、实践互链。</p></blockquote><h2 id="按方向" tabindex="-1">按方向 <a class="header-anchor" href="#按方向" aria-label="Permalink to “按方向”">​</a></h2><ul><li><a href="./ai/">AI 学习计划</a>（Phase 1–4）</li></ul><p>后续可扩展：英语、产品、商业、编程等方向的学习计划。</p><p><a href="./../">← 返回成长</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("growth/learning-plan/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
