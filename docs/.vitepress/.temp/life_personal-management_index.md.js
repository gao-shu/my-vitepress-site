import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"个人管理","description":"","frontmatter":{},"headers":[],"relativePath":"life/personal-management/index.md","filePath":"life/personal-management/index.md"}');
const _sfc_main = { name: "life/personal-management/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="个人管理" tabindex="-1">个人管理 <a class="header-anchor" href="#个人管理" aria-label="Permalink to “个人管理”">​</a></h1><p>时间、习惯、精力等个人管理系统占位。</p><p><a href="./../">← 返回生活</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("life/personal-management/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
