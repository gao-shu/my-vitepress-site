import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"职业","description":"","frontmatter":{},"headers":[],"relativePath":"career/index.md","filePath":"career/index.md"}');
const _sfc_main = { name: "career/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="职业" tabindex="-1">职业 <a class="header-anchor" href="#职业" aria-label="Permalink to “职业”">​</a></h1><blockquote><p>回答：<strong>我如何保持职业竞争力，并获得下一份工作/职业机会？</strong></p></blockquote><h2 id="入口" tabindex="-1">入口 <a class="header-anchor" href="#入口" aria-label="Permalink to “入口”">​</a></h2><ul><li><a href="./positioning/">当前定位</a></li><li><a href="./protection/">职业保障</a></li><li><a href="./capabilities/">职业能力</a></li><li><a href="./projects/">项目履历</a></li><li><a href="./remote-work/">远程工作</a></li><li><a href="./development/">职业发展</a></li></ul><h2 id="兼容入口-旧内容-暂未迁移" tabindex="-1">兼容入口（旧内容，暂未迁移） <a class="header-anchor" href="#兼容入口-旧内容-暂未迁移" aria-label="Permalink to “兼容入口（旧内容，暂未迁移）”">​</a></h2><p>现有求职向正文仍保留在原路径，可通过下方入口访问：</p><ul><li><a href="/my-vitepress-site/guide/">求职准备总览（旧）</a></li><li><a href="/my-vitepress-site/resume/resume-guide.html">简历与面试（旧）</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("career/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
