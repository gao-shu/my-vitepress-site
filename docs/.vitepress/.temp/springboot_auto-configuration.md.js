import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"自动配置原理","description":"","frontmatter":{},"headers":[],"relativePath":"springboot/auto-configuration.md","filePath":"springboot/auto-configuration.md"}');
const _sfc_main = { name: "springboot/auto-configuration.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="自动配置原理" tabindex="-1">自动配置原理 <a class="header-anchor" href="#自动配置原理" aria-label="Permalink to “自动配置原理”">​</a></h1><blockquote><p>待完善...</p></blockquote><p>本节将深入剖析 SpringBoot 自动配置的原理。</p><h2 id="主要内容" tabindex="-1">主要内容 <a class="header-anchor" href="#主要内容" aria-label="Permalink to “主要内容”">​</a></h2><ul><li>@EnableAutoConfiguration 注解详解</li><li>自动配置类的加载机制</li><li>@Conditional 注解</li><li>SPI 机制</li><li>自定义 starter</li></ul><p>敬请期待！</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("springboot/auto-configuration.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const autoConfiguration = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  autoConfiguration as default
};
