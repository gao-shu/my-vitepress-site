import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Java 语言总结（已合并）","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/backend/java/language.md","filePath":"tech-system/backend/java/language.md"}');
const _sfc_main = { name: "tech-system/backend/java/language.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="java-语言总结-已合并" tabindex="-1">Java 语言总结（已合并） <a class="header-anchor" href="#java-语言总结-已合并" aria-label="Permalink to “Java 语言总结（已合并）”">​</a></h1><p>已并入统一五篇，请从 <a href="./">Java 总览</a> 进入：</p><ul><li><a href="./01-basics.html">01 语言基础</a></li><li><a href="./02-core.html">02 核心能力</a></li><li><a href="./03-frameworks.html">03 框架与生态</a></li><li><a href="./04-engineering.html">04 工程实践</a></li><li><a href="./05-faq.html">05 常见问题</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/backend/java/language.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const language = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  language as default
};
