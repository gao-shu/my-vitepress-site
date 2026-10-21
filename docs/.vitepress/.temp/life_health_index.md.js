import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"健康","description":"","frontmatter":{},"headers":[],"relativePath":"life/health/index.md","filePath":"life/health/index.md"}');
const _sfc_main = { name: "life/health/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="健康" tabindex="-1">健康 <a class="header-anchor" href="#健康" aria-label="Permalink to “健康”">​</a></h1><blockquote><p>模块定位：用可执行的小计划把身体状态撑住，服务长期学习与工作。<br> 归属：<strong>生活 / 健康</strong>（第二大脑 V1）</p></blockquote><h2 id="建议阅读顺序" tabindex="-1">建议阅读顺序 <a class="header-anchor" href="#建议阅读顺序" aria-label="Permalink to “建议阅读顺序”">​</a></h2><ol><li><a href="./sleep-basics.html">睡眠与作息入门</a> — 先稳住恢复</li><li><a href="./exercise-start.html">运动起步：每周最小可行计划</a> — 用最小成本动起来</li><li><a href="./desk-posture.html">久坐与肩颈：程序员常见问题</a> — 针对长时间电脑工作</li></ol><h2 id="使用方式" tabindex="-1">使用方式 <a class="header-anchor" href="#使用方式" aria-label="Permalink to “使用方式”">​</a></h2><ul><li>每周只改 1 个习惯，观察两周再加下一项</li><li>记录比完美更重要：练了几次、睡得如何，写下来即可</li><li>有伤病或不适，以专业建议为准；这里只做个人实践笔记</li></ul><p><a href="./../">← 返回生活</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("life/health/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
