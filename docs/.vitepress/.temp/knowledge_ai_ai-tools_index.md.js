import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"AI 工具","description":"","frontmatter":{},"headers":[],"relativePath":"knowledge/ai/ai-tools/index.md","filePath":"knowledge/ai/ai-tools/index.md"}');
const _sfc_main = { name: "knowledge/ai/ai-tools/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="ai-工具" tabindex="-1">AI 工具 <a class="header-anchor" href="#ai-工具" aria-label="Permalink to “AI 工具”">​</a></h1><p>开发工具、MCP、Skill 等。</p><h2 id="兼容入口-旧" tabindex="-1">兼容入口（旧） <a class="header-anchor" href="#兼容入口-旧" aria-label="Permalink to “兼容入口（旧）”">​</a></h2><ul><li><a href="/my-vitepress-site/ai/explore/dev-tools-selection.html">AI 开发工具选型</a></li><li><a href="/my-vitepress-site/ai/explore/mcp-skill-selection.html">MCP 与 Skill 选型</a></li></ul><p><a href="./../">← 返回 AI</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("knowledge/ai/ai-tools/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
