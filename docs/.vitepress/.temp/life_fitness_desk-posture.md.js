import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"已迁移","description":"","frontmatter":{},"headers":[],"relativePath":"life/fitness/desk-posture.md","filePath":"life/fitness/desk-posture.md"}');
const _sfc_main = { name: "life/fitness/desk-posture.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="已迁移" tabindex="-1">已迁移 <a class="header-anchor" href="#已迁移" aria-label="Permalink to “已迁移”">​</a></h1><p>本文已归入：<a href="/my-vitepress-site/life/health/desk-posture.html">久坐与肩颈：程序员常见问题</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("life/fitness/desk-posture.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const deskPosture = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  deskPosture as default
};
