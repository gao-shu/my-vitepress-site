import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"当前学习","description":"","frontmatter":{},"headers":[],"relativePath":"growth/current-learning/index.md","filePath":"growth/current-learning/index.md"}');
const _sfc_main = { name: "growth/current-learning/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="当前学习" tabindex="-1">当前学习 <a class="header-anchor" href="#当前学习" aria-label="Permalink to “当前学习”">​</a></h1><blockquote><p>当前正在推进的学习焦点。</p></blockquote><p>本页为占位入口，内容将在后续阶段逐步填充。</p><p><a href="./../">← 返回成长</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("growth/current-learning/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
