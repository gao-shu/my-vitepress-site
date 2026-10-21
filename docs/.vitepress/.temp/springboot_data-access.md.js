import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"数据访问","description":"","frontmatter":{},"headers":[],"relativePath":"springboot/data-access.md","filePath":"springboot/data-access.md"}');
const _sfc_main = { name: "springboot/data-access.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="数据访问" tabindex="-1">数据访问 <a class="header-anchor" href="#数据访问" aria-label="Permalink to “数据访问”">​</a></h1><blockquote><p>待完善...</p></blockquote><p>本节将学习 SpringBoot 如何进行数据访问。</p><h2 id="主要内容" tabindex="-1">主要内容 <a class="header-anchor" href="#主要内容" aria-label="Permalink to “主要内容”">​</a></h2><ul><li>Spring Data JPA</li><li>MyBatis 集成</li><li>多数据源配置</li><li>事务管理</li><li>数据库连接池（HikariCP）</li></ul><p>敬请期待！</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("springboot/data-access.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dataAccess = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  dataAccess as default
};
