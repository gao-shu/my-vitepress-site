import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"页面已拆分（旧 Survey）","description":"","frontmatter":{},"headers":[],"relativePath":"java/concurrency.md","filePath":"java/concurrency.md"}');
const _sfc_main = { name: "java/concurrency.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="页面已拆分-旧-survey" tabindex="-1">页面已拆分（旧 Survey） <a class="header-anchor" href="#页面已拆分-旧-survey" aria-label="Permalink to “页面已拆分（旧 Survey）”">​</a></h1><p>本文曾是「多线程与并发」总览 Survey，正文与正式专题高度重叠，现降级为兼容入口。</p><p>请按主题阅读：</p><ul><li><a href="/my-vitepress-site/java/thread-basics.html">多线程基础与线程池</a> — 创建线程、线程池、项目落地</li><li><a href="/my-vitepress-site/java/concurrency-core.html">并发编程核心机制</a> — 锁、JMM、CAS、ThreadLocal 等</li></ul><p>场景实战仍独立保留：<a href="/my-vitepress-site/java/concurrency-scenario.html">场景实战：并发问题调优</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("java/concurrency.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const concurrency = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  concurrency as default
};
