import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"资源库","description":"","frontmatter":{},"headers":[],"relativePath":"resources/index.md","filePath":"resources/index.md"}');
const _sfc_main = { name: "resources/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="资源库" tabindex="-1">资源库 <a class="header-anchor" href="#资源库" aria-label="Permalink to “资源库”">​</a></h1><p>本站已不再单独设置「资源库」顶栏。</p><ul><li>开源项目 → <a href="/my-vitepress-site/open-source/">技术体系 · 开源拆解</a></li><li>英语口语 → <a href="/my-vitepress-site/english-speaking/">技术体系 · 英语口语</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
