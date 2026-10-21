import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"职业能力","description":"","frontmatter":{},"headers":[],"relativePath":"career/capabilities/index.md","filePath":"career/capabilities/index.md"}');
const _sfc_main = { name: "career/capabilities/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="职业能力" tabindex="-1">职业能力 <a class="header-anchor" href="#职业能力" aria-label="Permalink to “职业能力”">​</a></h1><p>「我会什么」的职业能力清单（掌握度），不是知识长文。</p><p>本页为占位；能力地图细节也可与 <a href="/my-vitepress-site/growth/capability-map/">成长 / 能力地图</a> 互链。</p><p><a href="./../">← 返回职业</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("career/capabilities/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
