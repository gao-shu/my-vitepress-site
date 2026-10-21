import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"AI 模型","description":"","frontmatter":{},"headers":[],"relativePath":"knowledge/ai/ai-models/index.md","filePath":"knowledge/ai/ai-models/index.md"}');
const _sfc_main = { name: "knowledge/ai/ai-models/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="ai-模型" tabindex="-1">AI 模型 <a class="header-anchor" href="#ai-模型" aria-label="Permalink to “AI 模型”">​</a></h1><p>模型选型与能力边界。</p><h2 id="主入口-canonical" tabindex="-1">主入口（Canonical） <a class="header-anchor" href="#主入口-canonical" aria-label="Permalink to “主入口（Canonical）”">​</a></h2><ul><li><a href="/my-vitepress-site/ai/explore/model-selection.html">模型选择指南</a> — 按环境与场景选型（LLM / 图片 / 视频 / RAG / Agent）</li></ul><h2 id="兼容入口-legacy" tabindex="-1">兼容入口（Legacy） <a class="header-anchor" href="#兼容入口-legacy" aria-label="Permalink to “兼容入口（Legacy）”">​</a></h2><ul><li><a href="/my-vitepress-site/ai/explore/llm-selection.html">大模型选型指南（旧）</a> — 已合并进 Canonical，旧 URL 保留</li></ul><p><a href="./../">← 返回 AI</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("knowledge/ai/ai-models/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
