import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"页面已合并","description":"","frontmatter":{},"headers":[],"relativePath":"framework/flowable-bpmn.md","filePath":"framework/flowable-bpmn.md"}');
const _sfc_main = { name: "framework/flowable-bpmn.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="页面已合并" tabindex="-1">页面已合并 <a class="header-anchor" href="#页面已合并" aria-label="Permalink to “页面已合并”">​</a></h1><p>本文已收敛到 <strong>Flowable 入门知识 Canonical</strong>。</p><p>本路径曾与 Canonical 正文完全重复；现仅保留旧 URL 兼容。</p><p>请访问：<a href="/my-vitepress-site/tech-system/backend/flowable-bpmn.html">Flowable + BPMN 快速入门</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("framework/flowable-bpmn.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const flowableBpmn = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  flowableBpmn as default
};
