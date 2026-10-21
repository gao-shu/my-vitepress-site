import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"成长","description":"","frontmatter":{},"headers":[],"relativePath":"growth/index.md","filePath":"growth/index.md"}');
const _sfc_main = { name: "growth/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="成长" tabindex="-1">成长 <a class="header-anchor" href="#成长" aria-label="Permalink to “成长”">​</a></h1><blockquote><p>回答：<strong>我现在要成长什么？</strong></p></blockquote><p>本区管理目标、能力、学习焦点与复盘。不是知识库正文。</p><h2 id="入口" tabindex="-1">入口 <a class="header-anchor" href="#入口" aria-label="Permalink to “入口”">​</a></h2><ul><li><a href="./goals/">目标</a></li><li><a href="./capability-map/">能力地图</a></li><li><a href="./current-learning/">当前学习</a></li><li><a href="./learning-plan/">学习计划</a>（含 <a href="./learning-plan/ai/">AI Phase 1–4</a>）</li><li><a href="./reviews/">成长复盘</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("growth/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
