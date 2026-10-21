import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"生活","description":"","frontmatter":{},"headers":[],"relativePath":"life/index.md","filePath":"life/index.md"}');
const _sfc_main = { name: "life/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="生活" tabindex="-1">生活 <a class="header-anchor" href="#生活" aria-label="Permalink to “生活”">​</a></h1><blockquote><p>回答：<strong>如何管理生活本身？</strong></p></blockquote><h2 id="入口" tabindex="-1">入口 <a class="header-anchor" href="#入口" aria-label="Permalink to “入口”">​</a></h2><ul><li><a href="./finance/">财务</a></li><li><a href="./health/">健康</a></li><li><a href="./personal-management/">个人管理</a></li><li><a href="./interests/">兴趣</a></li></ul><blockquote><p>英语已归入 <a href="/my-vitepress-site/knowledge/english/">知识 / 英语</a>。<br> 旧路径 <code>/life/fitness/</code> 为健康兼容入口。</p></blockquote></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("life/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
