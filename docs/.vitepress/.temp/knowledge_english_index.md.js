import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"英语","description":"","frontmatter":{},"headers":[],"relativePath":"knowledge/english/index.md","filePath":"knowledge/english/index.md"}');
const _sfc_main = { name: "knowledge/english/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="英语" tabindex="-1">英语 <a class="header-anchor" href="#英语" aria-label="Permalink to “英语”">​</a></h1><blockquote><p>归属：<strong>知识 / 英语</strong>（第二大脑 V1）<br> 正文仍在原路径，本页为正式 IA 入口（不复制正文）。</p></blockquote><h2 id="模块入口" tabindex="-1">模块入口 <a class="header-anchor" href="#模块入口" aria-label="Permalink to “模块入口”">​</a></h2><ul><li><a href="/my-vitepress-site/english-speaking/">英语口语总览</a></li><li><a href="/my-vitepress-site/english-speaking/phonetics-48.html">48 音标与发音入门</a></li><li><a href="/my-vitepress-site/english-speaking/templates-daily.html">日常通用口语模板</a></li><li><a href="/my-vitepress-site/english-speaking/templates-work.html">工作沟通口语模板</a></li><li><a href="/my-vitepress-site/english-speaking/templates-meeting.html">会议表达口语模板</a></li><li><a href="/my-vitepress-site/english-speaking/templates-call.html">电话/视频沟通模板</a></li><li><a href="/my-vitepress-site/english-speaking/templates-social.html">社交寒暄口语模板</a></li></ul><blockquote><p>旧 URL <code>/english-speaking/*</code> 保持可访问。</p></blockquote><p><a href="./../">← 返回知识</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("knowledge/english/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
