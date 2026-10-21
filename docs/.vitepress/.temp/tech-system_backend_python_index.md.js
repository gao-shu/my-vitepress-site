import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Python","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/backend/python/index.md","filePath":"tech-system/backend/python/index.md"}');
const _sfc_main = { name: "tech-system/backend/python/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="python" tabindex="-1">Python <a class="header-anchor" href="#python" aria-label="Permalink to “Python”">​</a></h1><p>与 Go / TypeScript <strong>同构五篇</strong>。定位：加速 AI 与自动化，不替代 Java 主业务。</p><table tabindex="0"><thead><tr><th>篇</th><th>链接</th><th>本次</th></tr></thead><tbody><tr><td><strong>01 语言基础</strong></td><td><a href="./01-basics.html">01-basics</a></td><td>✅ Java → Python 迁移速查（8 章）</td></tr><tr><td>02 核心能力</td><td><a href="./02-core.html">02-core</a></td><td>暂不扩写</td></tr><tr><td>03 框架与生态</td><td><a href="./03-frameworks.html">03-frameworks</a></td><td>暂不扩写</td></tr><tr><td>04 工程实践</td><td><a href="./04-engineering.html">04-engineering</a></td><td>暂不扩写</td></tr><tr><td>05 常见问题</td><td><a href="./05-faq.html">05-faq</a></td><td>暂不扩写</td></tr></tbody></table><p>学习节奏另见：<a href="/my-vitepress-site/tech-system/python/python-skill.html">Python 技能速成</a>（3–5 天清单，与 01 互补，不替代）。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/backend/python/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
