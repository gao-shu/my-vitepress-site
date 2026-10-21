import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"项目履历","description":"","frontmatter":{},"headers":[],"relativePath":"career/projects/index.md","filePath":"career/projects/index.md"}');
const _sfc_main = { name: "career/projects/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="项目履历" tabindex="-1">项目履历 <a class="header-anchor" href="#项目履历" aria-label="Permalink to “项目履历”">​</a></h1><p>具有职业证明价值的项目（我做过、能讲清楚）。</p><blockquote><p>收藏别人的开源 ≠ 履历。开源清单见 <a href="/my-vitepress-site/resources/collections/">资源 / 收藏</a>。</p></blockquote><p>本页为占位。</p><p><a href="./../">← 返回职业</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("career/projects/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
