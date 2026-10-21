import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"简历","description":"","frontmatter":{},"headers":[],"relativePath":"career/protection/resume/index.md","filePath":"career/protection/resume/index.md"}');
const _sfc_main = { name: "career/protection/resume/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="简历" tabindex="-1">简历 <a class="header-anchor" href="#简历" aria-label="Permalink to “简历”">​</a></h1><h2 id="兼容入口-旧" tabindex="-1">兼容入口（旧） <a class="header-anchor" href="#兼容入口-旧" aria-label="Permalink to “兼容入口（旧）”">​</a></h2><ul><li><a href="/my-vitepress-site/guide/my-resume.html">个人简历正文</a></li><li><a href="/my-vitepress-site/resume/resume-guide.html">简历排版与编写</a></li><li><a href="/my-vitepress-site/resume/resume-analysis.html">简历分析</a></li><li><a href="/my-vitepress-site/resume/skills-interview-prep.html">专业技能面试准备</a></li></ul><p><a href="./../">← 返回职业保障</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("career/protection/resume/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
