import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"旧文入口","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/backend/go/language.md","filePath":"tech-system/backend/go/language.md"}');
const _sfc_main = { name: "tech-system/backend/go/language.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="旧文入口" tabindex="-1">旧文入口 <a class="header-anchor" href="#旧文入口" aria-label="Permalink to “旧文入口”">​</a></h1><p>已合并 → <a href="./">Go 五篇</a> 从 <a href="./01-basics.html">01 语言基础</a> 起</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/backend/go/language.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const language = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  language as default
};
