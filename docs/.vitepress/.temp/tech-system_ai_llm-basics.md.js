import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"页面已迁移","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/ai/llm-basics.md","filePath":"tech-system/ai/llm-basics.md"}');
const _sfc_main = { name: "tech-system/ai/llm-basics.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="页面已迁移" tabindex="-1">页面已迁移 <a class="header-anchor" href="#页面已迁移" aria-label="Permalink to “页面已迁移”">​</a></h1><p>本文已统一到 <strong>AI 知识主目录（Canonical）</strong>。</p><p>请访问：<a href="/my-vitepress-site/ai/llm-basics.html">LLM 入门与 Prompt 规划</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/ai/llm-basics.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const llmBasics = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  llmBasics as default
};
