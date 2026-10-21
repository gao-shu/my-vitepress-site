import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"AI 多模态","description":"","frontmatter":{},"headers":[],"relativePath":"knowledge/ai/ai-multimodal/index.md","filePath":"knowledge/ai/ai-multimodal/index.md"}');
const _sfc_main = { name: "knowledge/ai/ai-multimodal/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="ai-多模态" tabindex="-1">AI 多模态 <a class="header-anchor" href="#ai-多模态" aria-label="Permalink to “AI 多模态”">​</a></h1><h2 id="兼容入口-旧" tabindex="-1">兼容入口（旧） <a class="header-anchor" href="#兼容入口-旧" aria-label="Permalink to “兼容入口（旧）”">​</a></h2><ul><li><a href="/my-vitepress-site/ai/multimodal-kg.html">多模态 &amp; 知识图谱规划</a></li></ul><p><a href="./../">← 返回 AI</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("knowledge/ai/ai-multimodal/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
