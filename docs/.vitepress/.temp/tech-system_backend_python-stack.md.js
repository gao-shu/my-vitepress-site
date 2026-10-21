import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Python（已合并）","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/backend/python-stack.md","filePath":"tech-system/backend/python-stack.md"}');
const _sfc_main = { name: "tech-system/backend/python-stack.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="python-已合并" tabindex="-1">Python（已合并） <a class="header-anchor" href="#python-已合并" aria-label="Permalink to “Python（已合并）”">​</a></h1><p>请改看 <a href="./python/">Python 五篇结构</a>。技能速成仍见 <a href="./../python/python-skill.html">Python 技能速成</a>。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/backend/python-stack.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const pythonStack = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  pythonStack as default
};
