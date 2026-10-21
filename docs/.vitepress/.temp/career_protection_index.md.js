import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"职业保障","description":"","frontmatter":{},"headers":[],"relativePath":"career/protection/index.md","filePath":"career/protection/index.md"}');
const _sfc_main = { name: "career/protection/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="职业保障" tabindex="-1">职业保障 <a class="header-anchor" href="#职业保障" aria-label="Permalink to “职业保障”">​</a></h1><p>求职、面试、八股与简历等「保底竞争力」内容。</p><blockquote><p>面试问答体 → 本区；原理体系文 → 知识（一份 Canonical，多处引用）。</p></blockquote><h2 id="子入口" tabindex="-1">子入口 <a class="header-anchor" href="#子入口" aria-label="Permalink to “子入口”">​</a></h2><ul><li><a href="./java-interview/">Java 面试</a></li><li><a href="./resume/">简历</a></li><li><a href="./interview/">面试</a></li></ul><h2 id="兼容入口-旧内容" tabindex="-1">兼容入口（旧内容） <a class="header-anchor" href="#兼容入口-旧内容" aria-label="Permalink to “兼容入口（旧内容）”">​</a></h2><ul><li><a href="/my-vitepress-site/guide/">求职笔记总览</a></li><li><a href="/my-vitepress-site/java/base-overview.html">Java 模块</a></li><li><a href="/my-vitepress-site/database/overview.html">数据库</a></li><li><a href="/my-vitepress-site/redis/overview.html">Redis</a></li><li><a href="/my-vitepress-site/framework/overview.html">框架</a></li><li><a href="/my-vitepress-site/resume/resume-guide.html">简历专题</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("career/protection/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
