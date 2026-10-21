import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"知识","description":"","frontmatter":{},"headers":[],"relativePath":"knowledge/index.md","filePath":"knowledge/index.md"}');
const _sfc_main = { name: "knowledge/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="知识" tabindex="-1">知识 <a class="header-anchor" href="#知识" aria-label="Permalink to “知识”">​</a></h1><blockquote><p>回答：<strong>我理解和掌握了什么？</strong></p></blockquote><p>按领域组织，不按职业组织。AI 属于本区，不是一级导航。</p><h2 id="入口" tabindex="-1">入口 <a class="header-anchor" href="#入口" aria-label="Permalink to “入口”">​</a></h2><ul><li><a href="./programming/">编程</a></li><li><a href="./ai/">AI</a></li><li><a href="./product/">产品</a></li><li><a href="./business/">商业</a></li><li><a href="./english/">英语</a></li><li><a href="./other/">其他</a></li></ul><h2 id="兼容入口-旧内容-暂未迁移" tabindex="-1">兼容入口（旧内容，暂未迁移） <a class="header-anchor" href="#兼容入口-旧内容-暂未迁移" aria-label="Permalink to “兼容入口（旧内容，暂未迁移）”">​</a></h2><ul><li><a href="/my-vitepress-site/tech-system/">技术体系总览</a></li><li><a href="/my-vitepress-site/ai/">AI 探索（旧顶栏路径）</a></li><li><a href="/my-vitepress-site/tech-system/industrial-digitalization/">工业数字化</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("knowledge/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
