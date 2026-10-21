import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"AI 学习计划","description":"","frontmatter":{},"headers":[],"relativePath":"growth/learning-plan/ai/index.md","filePath":"growth/learning-plan/ai/index.md"}');
const _sfc_main = { name: "growth/learning-plan/ai/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="ai-学习计划" tabindex="-1">AI 学习计划 <a class="header-anchor" href="#ai-学习计划" aria-label="Permalink to “AI 学习计划”">​</a></h1><blockquote><p>归属：<strong>成长 → 学习计划 → AI</strong><br> 回答「我要怎么学 AI」，不是「我已经掌握了什么 AI 知识」。<br> 知识正文见 <a href="/my-vitepress-site/knowledge/ai/">知识 / AI</a> → Canonical 内容在 <a href="/my-vitepress-site/ai/"><code>/ai/</code></a>。</p></blockquote><h2 id="phase-列表" tabindex="-1">Phase 列表 <a class="header-anchor" href="#phase-列表" aria-label="Permalink to “Phase 列表”">​</a></h2><ol><li><a href="./phase1-llm-agent.html">Phase 1：大模型（LLM）与 Agent 入门学习规划</a></li><li><a href="./phase2-mvp-server.html">Phase 2：MVP Server 与数据中台规划</a></li><li><a href="./phase3-multimodal-kg.html">Phase 3：多模态 / 向量检索 / 知识图谱规划</a></li><li><a href="./phase4-mlops-platform.html">Phase 4：部署 / 平台化 / MLOps 规划</a></li></ol><h2 id="关联" tabindex="-1">关联 <a class="header-anchor" href="#关联" aria-label="Permalink to “关联”">​</a></h2><ul><li>知识主路径（Canonical）：<a href="/my-vitepress-site/ai/ai-roadmap.html">/ai/ai-roadmap</a></li><li>AI 探索入口：<a href="/my-vitepress-site/ai/">/ai/</a></li></ul><p><a href="./../">← 返回学习计划</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("growth/learning-plan/ai/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
