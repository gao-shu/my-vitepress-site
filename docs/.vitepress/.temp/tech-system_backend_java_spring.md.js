import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Spring（已合并进 Java）","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/backend/java/spring.md","filePath":"tech-system/backend/java/spring.md"}');
const _sfc_main = { name: "tech-system/backend/java/spring.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="spring-已合并进-java" tabindex="-1">Spring（已合并进 Java） <a class="header-anchor" href="#spring-已合并进-java" aria-label="Permalink to “Spring（已合并进 Java）”">​</a></h1><p>Spring 不再单独成组，内容在：</p><ul><li><a href="./03-frameworks.html">03 框架与生态</a></li><li><a href="./04-engineering.html">04 工程实践</a></li><li><a href="./05-faq.html">05 常见问题</a></li></ul><p><a href="./">Java 总览</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/backend/java/spring.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const spring = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  spring as default
};
