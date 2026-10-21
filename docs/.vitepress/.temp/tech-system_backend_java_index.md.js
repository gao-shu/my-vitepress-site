import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Java","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/backend/java/index.md","filePath":"tech-system/backend/java/index.md"}');
const _sfc_main = { name: "tech-system/backend/java/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="java" tabindex="-1">Java <a class="header-anchor" href="#java" aria-label="Permalink to “Java”">​</a></h1><p>主栈。与 Python / Node(TS) / Go / C# <strong>同一套五篇结构</strong>——一门语言只占一组，不再拆「语言 vs Spring」。</p><table tabindex="0"><thead><tr><th>篇</th><th>解决什么</th></tr></thead><tbody><tr><td><a href="./01-basics.html">01 语言基础</a></td><td>语法、类型、集合、函数</td></tr><tr><td><a href="./02-core.html">02 核心能力</a></td><td>JVM、并发、内存——Java 真正不同的地方</td></tr><tr><td><a href="./03-frameworks.html">03 框架与生态</a></td><td>Spring / Boot / 生态怎么干活</td></tr><tr><td><a href="./04-engineering.html">04 工程实践</a></td><td>项目怎么开发、测试、部署</td></tr><tr><td><a href="./05-faq.html">05 常见问题</a></td><td>遇到问题快速查</td></tr></tbody></table><blockquote><p>面试细题见 <a href="/my-vitepress-site/guide/">就业指南</a>。这里偏判断与取舍。</p></blockquote></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/backend/java/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
