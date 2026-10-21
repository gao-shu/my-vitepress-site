import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"旧文入口","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/backend/python/frameworks.md","filePath":"tech-system/backend/python/frameworks.md"}');
const _sfc_main = { name: "tech-system/backend/python/frameworks.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="旧文入口" tabindex="-1">旧文入口 <a class="header-anchor" href="#旧文入口" aria-label="Permalink to “旧文入口”">​</a></h1><p>已合并 → <a href="./03-frameworks.html">03 框架与生态</a> · <a href="./">Python 总览</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/backend/python/frameworks.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const frameworks = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  frameworks as default
};
