import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"AI 开发","description":"","frontmatter":{},"headers":[],"relativePath":"knowledge/ai/ai-development/index.md","filePath":"knowledge/ai/ai-development/index.md"}');
const _sfc_main = { name: "knowledge/ai/ai-development/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="ai-开发" tabindex="-1">AI 开发 <a class="header-anchor" href="#ai-开发" aria-label="Permalink to “AI 开发”">​</a></h1><p>LLM / Prompt / RAG / Agent / MCP / AI Coding / 应用架构等。</p><h2 id="兼容入口-旧" tabindex="-1">兼容入口（旧） <a class="header-anchor" href="#兼容入口-旧" aria-label="Permalink to “兼容入口（旧）”">​</a></h2><ul><li><a href="/my-vitepress-site/ai/llm-basics.html">LLM 入门</a></li><li><a href="/my-vitepress-site/ai/agent-basics.html">Agent 基础</a></li><li><a href="/my-vitepress-site/ai/stage-1-llm/">阶段一模块</a></li><li><a href="/my-vitepress-site/ai/stage-2-agent/">阶段二模块</a></li><li><a href="/my-vitepress-site/ai/stage-3-mvp-server/">阶段三模块</a></li></ul><p><a href="./../">← 返回 AI</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("knowledge/ai/ai-development/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
