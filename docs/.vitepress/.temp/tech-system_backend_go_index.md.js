import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Go","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/backend/go/index.md","filePath":"tech-system/backend/go/index.md"}');
const _sfc_main = { name: "tech-system/backend/go/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="go" tabindex="-1">Go <a class="header-anchor" href="#go" aria-label="Permalink to “Go”">​</a></h1><p>补位技能。与 Python / TypeScript <strong>同构五篇</strong>。</p><table tabindex="0"><thead><tr><th>篇</th><th>链接</th><th>本次</th></tr></thead><tbody><tr><td><strong>01 语言基础</strong></td><td><a href="./01-basics.html">01-basics</a></td><td>✅ Java → Go 迁移速查（8 章）</td></tr><tr><td>02 核心能力</td><td><a href="./02-core.html">02-core</a></td><td>暂不扩写</td></tr><tr><td>03 框架与生态</td><td><a href="./03-frameworks.html">03-frameworks</a></td><td>暂不扩写</td></tr><tr><td>04 工程实践</td><td><a href="./04-engineering.html">04-engineering</a></td><td>暂不扩写</td></tr><tr><td>05 常见问题</td><td><a href="./05-faq.html">05-faq</a></td><td>暂不扩写</td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/backend/go/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
