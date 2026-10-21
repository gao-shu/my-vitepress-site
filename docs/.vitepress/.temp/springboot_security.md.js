import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"安全与认证","description":"","frontmatter":{},"headers":[],"relativePath":"springboot/security.md","filePath":"springboot/security.md"}');
const _sfc_main = { name: "springboot/security.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="安全与认证" tabindex="-1">安全与认证 <a class="header-anchor" href="#安全与认证" aria-label="Permalink to “安全与认证”">​</a></h1><blockquote><p>待完善...</p></blockquote><p>本节将介绍 SpringBoot 的安全认证机制。</p><h2 id="主要内容" tabindex="-1">主要内容 <a class="header-anchor" href="#主要内容" aria-label="Permalink to “主要内容”">​</a></h2><ul><li>Spring Security 基础</li><li>认证与授权</li><li>JWT 令牌认证</li><li>OAuth2.0</li><li>权限控制</li></ul><p>敬请期待！</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("springboot/security.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const security = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  security as default
};
