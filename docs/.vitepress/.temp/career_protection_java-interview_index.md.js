import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Java 面试","description":"","frontmatter":{},"headers":[],"relativePath":"career/protection/java-interview/index.md","filePath":"career/protection/java-interview/index.md"}');
const _sfc_main = { name: "career/protection/java-interview/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="java-面试" tabindex="-1">Java 面试 <a class="header-anchor" href="#java-面试" aria-label="Permalink to “Java 面试”">​</a></h1><p>Java 求职向内容入口（面试题、高频考点等）。</p><h2 id="兼容入口-旧" tabindex="-1">兼容入口（旧） <a class="header-anchor" href="#兼容入口-旧" aria-label="Permalink to “兼容入口（旧）”">​</a></h2><ul><li><a href="/my-vitepress-site/java/base-overview.html">Java 基础概述</a></li><li><a href="/my-vitepress-site/java/collections.html">集合框架</a></li><li><a href="/my-vitepress-site/java/jvm.html">JVM</a></li><li><a href="/my-vitepress-site/java/concurrency-core.html">并发核心</a></li></ul><p><a href="./../">← 返回职业保障</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("career/protection/java-interview/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
