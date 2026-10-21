import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Node(TS)（已合并）","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/backend/nodejs-stack.md","filePath":"tech-system/backend/nodejs-stack.md"}');
const _sfc_main = { name: "tech-system/backend/nodejs-stack.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="node-ts-已合并" tabindex="-1">Node(TS)（已合并） <a class="header-anchor" href="#node-ts-已合并" aria-label="Permalink to “Node(TS)（已合并）”">​</a></h1><p>请改看 <a href="./nodejs/">Node(TS) 五篇结构</a>。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/backend/nodejs-stack.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const nodejsStack = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  nodejsStack as default
};
