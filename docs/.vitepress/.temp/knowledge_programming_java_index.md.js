import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Java","description":"","frontmatter":{},"headers":[],"relativePath":"knowledge/programming/java/index.md","filePath":"knowledge/programming/java/index.md"}');
const _sfc_main = { name: "knowledge/programming/java/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="java" tabindex="-1">Java <a class="header-anchor" href="#java" aria-label="Permalink to “Java”">​</a></h1><p>知识 Canonical 入口（原理 / 体系 / 工程）。面试问答体见职业保障。</p><h2 id="兼容入口-旧" tabindex="-1">兼容入口（旧） <a class="header-anchor" href="#兼容入口-旧" aria-label="Permalink to “兼容入口（旧）”">​</a></h2><ul><li><a href="/my-vitepress-site/tech-system/backend/java/">技术体系 · Java 五篇</a></li><li><a href="/my-vitepress-site/springboot/overview.html">Spring Boot 概述</a></li><li>面试向正文暂见 <a href="/my-vitepress-site/career/protection/java-interview/">职业保障 / Java 面试</a></li></ul><p><a href="./../">← 返回编程</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("knowledge/programming/java/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
