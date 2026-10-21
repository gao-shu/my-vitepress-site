import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"页面已迁移","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/ai/phase1-llm-agent.md","filePath":"tech-system/ai/phase1-llm-agent.md"}');
const _sfc_main = { name: "tech-system/ai/phase1-llm-agent.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="页面已迁移" tabindex="-1">页面已迁移 <a class="header-anchor" href="#页面已迁移" aria-label="Permalink to “页面已迁移”">​</a></h1><p>本篇是 <strong>AI 学习计划（Phase 1）</strong>，已归入第二大脑：</p><p><strong>成长 → 学习计划 → AI</strong></p><p>请访问：<a href="/my-vitepress-site/growth/learning-plan/ai/phase1-llm-agent.html">Phase 1：大模型与 Agent 入门学习规划</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/ai/phase1-llm-agent.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const phase1LlmAgent = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  phase1LlmAgent as default
};
