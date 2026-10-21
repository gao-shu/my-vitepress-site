import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"后端问题 · 性能","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/backend/problems/performance.md","filePath":"tech-system/backend/problems/performance.md"}');
const _sfc_main = { name: "tech-system/backend/problems/performance.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="后端问题-·-性能" tabindex="-1">后端问题 · 性能 <a class="header-anchor" href="#后端问题-·-性能" aria-label="Permalink to “后端问题 · 性能”">​</a></h1><h2 id="我怎么看性能" tabindex="-1">我怎么看性能 <a class="header-anchor" href="#我怎么看性能" aria-label="Permalink to “我怎么看性能”">​</a></h2><p>性能优化的第一原则：</p><blockquote><p><strong>先测量，再动手。</strong></p></blockquote><p>猜「是不是 JVM」「是不是换语言」通常浪费时间。</p><h2 id="常见路径" tabindex="-1">常见路径 <a class="header-anchor" href="#常见路径" aria-label="Permalink to “常见路径”">​</a></h2><ol><li>看接口耗时拆分：DB / Redis / 下游 / 本机计算</li><li>慢 SQL 与 N+1</li><li>缓存是否打中</li><li>池是否打满（线程、连接、HTTP）</li><li>最后才是 GC、语言级微优化</li></ol><h2 id="我的默认策略" tabindex="-1">我的默认策略 <a class="header-anchor" href="#我的默认策略" aria-label="Permalink to “我的默认策略”">​</a></h2><ul><li>分页、限流、超时是基本盘</li><li>AI 生成等慢操作必须异步，别同步扛在网关后面</li><li>优化要有前后对比数字，否则不算做完</li></ul><hr><p>相关排查可挂就业指南慢查询 / 并发场景文。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/backend/problems/performance.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const performance = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  performance as default
};
