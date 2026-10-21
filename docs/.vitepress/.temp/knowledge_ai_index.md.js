import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"AI","description":"","frontmatter":{},"headers":[],"relativePath":"knowledge/ai/index.md","filePath":"knowledge/ai/index.md"}');
const _sfc_main = { name: "knowledge/ai/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="ai" tabindex="-1">AI <a class="header-anchor" href="#ai" aria-label="Permalink to “AI”">​</a></h1><p>AI 是知识领域之一，不是整站一级菜单。</p><h2 id="入口" tabindex="-1">入口 <a class="header-anchor" href="#入口" aria-label="Permalink to “入口”">​</a></h2><ul><li><a href="./ai-development/">AI 开发</a></li><li><a href="./ai-models/">AI 模型</a></li><li><a href="./ai-multimodal/">AI 多模态</a></li><li><a href="./ai-tools/">AI 工具</a></li></ul><h2 id="兼容入口-旧" tabindex="-1">兼容入口（旧） <a class="header-anchor" href="#兼容入口-旧" aria-label="Permalink to “兼容入口（旧）”">​</a></h2><ul><li><a href="/my-vitepress-site/ai/">AI 探索总览</a></li><li><a href="/my-vitepress-site/ai/ai-roadmap.html">AI 路线</a></li><li><a href="/my-vitepress-site/ai/explore/ai-selection/">选型概览</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("knowledge/ai/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
