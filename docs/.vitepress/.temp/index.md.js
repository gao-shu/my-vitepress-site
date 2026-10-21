import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"一口三个馍","text":"个人技术学习站","tagline":"用 AI 提升效率，改善生活，探索创造财富的新可能。","image":{"src":"/logo.svg","alt":"一口三个馍"},"actions":[{"theme":"brand","text":"就业指南","link":"/guide/"},{"theme":"alt","text":"技术体系","link":"/tech-system/"}]},"features":[{"icon":"📝","title":"就业指南","details":"Java、数据库、框架、面试准备与项目讲述","link":"/guide/","linkText":"开始学习"},{"icon":"🎯","title":"技术体系","details":"后端、前端、工业数字化与开源拆解","link":"/tech-system/","linkText":"查看体系"},{"icon":"🤖","title":"AI 赋能","details":"认知成长、生产力、创作表达与商业探索","link":"/ai/","linkText":"进入 AI 赋能"},{"icon":"👤","title":"关于我","details":"定位、经历与联系方式","link":"/about/","linkText":"了解更多"}]},"headers":[],"relativePath":"index.md","filePath":"index.md"}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
