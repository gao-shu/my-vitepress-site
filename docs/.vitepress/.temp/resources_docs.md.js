import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"官方文档","description":"","frontmatter":{},"headers":[],"relativePath":"resources/docs.md","filePath":"resources/docs.md"}');
const _sfc_main = { name: "resources/docs.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="官方文档" tabindex="-1">官方文档 <a class="header-anchor" href="#官方文档" aria-label="Permalink to “官方文档”">​</a></h1><p>企业开发中常用技术的官方文档链接。</p><h2 id="java-spring" tabindex="-1">Java &amp; Spring <a class="header-anchor" href="#java-spring" aria-label="Permalink to “Java &amp; Spring”">​</a></h2><ul><li><a href="https://docs.oracle.com/javase/" target="_blank" rel="noreferrer">Java 官方文档</a></li><li><a href="https://spring.io/projects/spring-framework" target="_blank" rel="noreferrer">Spring 官方文档</a></li><li><a href="https://spring.io/projects/spring-boot" target="_blank" rel="noreferrer">SpringBoot 官方文档</a></li></ul><h2 id="数据库" tabindex="-1">数据库 <a class="header-anchor" href="#数据库" aria-label="Permalink to “数据库”">​</a></h2><ul><li><a href="https://dev.mysql.com/doc/" target="_blank" rel="noreferrer">MySQL 官方文档</a></li><li><a href="https://redis.io/docs/" target="_blank" rel="noreferrer">Redis 官方文档</a></li><li><a href="https://docs.mongodb.com/" target="_blank" rel="noreferrer">MongoDB 官方文档</a></li></ul><h2 id="其他" tabindex="-1">其他 <a class="header-anchor" href="#其他" aria-label="Permalink to “其他”">​</a></h2><p>敬请期待...</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/docs.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const docs = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  docs as default
};
