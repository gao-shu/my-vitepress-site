import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Java / Spring（已合并）","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/backend/java-spring.md","filePath":"tech-system/backend/java-spring.md"}');
const _sfc_main = { name: "tech-system/backend/java-spring.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="java-spring-已合并" tabindex="-1">Java / Spring（已合并） <a class="header-anchor" href="#java-spring-已合并" aria-label="Permalink to “Java / Spring（已合并）”">​</a></h1><p>请改看 <a href="./java/">Java 五篇结构</a>。跨语言问题见 <a href="./problems/">后端问题</a>。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/backend/java-spring.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const javaSpring = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  javaSpring as default
};
