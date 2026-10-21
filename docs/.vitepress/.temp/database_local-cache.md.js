import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"页面已合并","description":"","frontmatter":{},"headers":[],"relativePath":"database/local-cache.md","filePath":"database/local-cache.md"}');
const _sfc_main = { name: "database/local-cache.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="页面已合并" tabindex="-1">页面已合并 <a class="header-anchor" href="#页面已合并" aria-label="Permalink to “页面已合并”">​</a></h1><p>本文已收敛到 <strong>本地缓存 Canonical</strong>。</p><p>独有内容（自定义 Key 生成器、容量规划要点）已提取并入 Canonical；本路径保留用于旧链接兼容。</p><p>请访问：<a href="/my-vitepress-site/framework/local-cache.html">Java 本地缓存技术详解</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("database/local-cache.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const localCache = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  localCache as default
};
