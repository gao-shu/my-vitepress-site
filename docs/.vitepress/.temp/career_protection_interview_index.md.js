import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"面试","description":"","frontmatter":{},"headers":[],"relativePath":"career/protection/interview/index.md","filePath":"career/protection/interview/index.md"}');
const _sfc_main = { name: "career/protection/interview/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="面试" tabindex="-1">面试 <a class="header-anchor" href="#面试" aria-label="Permalink to “面试”">​</a></h1><p>面试技巧与流程相关。</p><h2 id="兼容入口-旧" tabindex="-1">兼容入口（旧） <a class="header-anchor" href="#兼容入口-旧" aria-label="Permalink to “兼容入口（旧）”">​</a></h2><ul><li><a href="/my-vitepress-site/resume/interview-skills.html">自我介绍与项目讲述</a></li><li><a href="/my-vitepress-site/resume/job-platform-strategy.html">投递平台与策略</a></li></ul><p><a href="./../">← 返回职业保障</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("career/protection/interview/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
