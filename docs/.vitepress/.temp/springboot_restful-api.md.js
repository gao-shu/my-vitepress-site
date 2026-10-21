import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"RESTful API 开发","description":"","frontmatter":{},"headers":[],"relativePath":"springboot/restful-api.md","filePath":"springboot/restful-api.md"}');
const _sfc_main = { name: "springboot/restful-api.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="restful-api-开发" tabindex="-1">RESTful API 开发 <a class="header-anchor" href="#restful-api-开发" aria-label="Permalink to “RESTful API 开发”">​</a></h1><blockquote><p>待完善...</p></blockquote><p>本节将学习如何使用 SpringBoot 开发 RESTful API。</p><h2 id="主要内容" tabindex="-1">主要内容 <a class="header-anchor" href="#主要内容" aria-label="Permalink to “主要内容”">​</a></h2><ul><li>RESTful 架构风格</li><li>请求映射（@RequestMapping、@GetMapping 等）</li><li>参数接收</li><li>响应处理</li><li>统一返回格式</li><li>全局异常处理</li><li>接口文档（Swagger）</li></ul><p>敬请期待！</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("springboot/restful-api.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const restfulApi = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  restfulApi as default
};
