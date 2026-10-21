import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"当前定位","description":"","frontmatter":{},"headers":[],"relativePath":"career/positioning/index.md","filePath":"career/positioning/index.md"}');
const _sfc_main = { name: "career/positioning/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="当前定位" tabindex="-1">当前定位 <a class="header-anchor" href="#当前定位" aria-label="Permalink to “当前定位”">​</a></h1><p>记录当前职业定位与近期求职/发展目标。</p><h2 id="兼容入口" tabindex="-1">兼容入口 <a class="header-anchor" href="#兼容入口" aria-label="Permalink to “兼容入口”">​</a></h2><ul><li><a href="/my-vitepress-site/guide/">面试准备指南（旧总纲）</a></li></ul><p><a href="./../">← 返回职业</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("career/positioning/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
