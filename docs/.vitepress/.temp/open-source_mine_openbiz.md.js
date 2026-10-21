import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"OpenBiz","description":"","frontmatter":{},"headers":[],"relativePath":"open-source/mine/openbiz.md","filePath":"open-source/mine/openbiz.md"}');
const _sfc_main = { name: "open-source/mine/openbiz.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="openbiz" tabindex="-1">OpenBiz <a class="header-anchor" href="#openbiz" aria-label="Permalink to “OpenBiz”">​</a></h1><blockquote><p>状态：<strong>占位</strong>。仓库已存在，文档与能力说明随开发补全。</p></blockquote><ul><li>GitHub：<a href="https://github.com/gao-shu/openbiz" target="_blank" rel="noreferrer">gao-shu/openbiz</a></li></ul><hr><h2 id="它想解决什么" tabindex="-1">它想解决什么 <a class="header-anchor" href="#它想解决什么" aria-label="Permalink to “它想解决什么”">​</a></h2><p>面向 <strong>中小企业信息化</strong> 的开源业务/后台底座：能跑通权限、基础业务闭环，方便二开与演示——而不是又一个空壳脚手架名词堆砌。</p><p>（具体模块边界以仓库 README 为准，此处随迭代更新。）</p><hr><h2 id="和我简历的关系" tabindex="-1">和我简历的关系 <a class="header-anchor" href="#和我简历的关系" aria-label="Permalink to “和我简历的关系”">​</a></h2><ul><li>对应主叙事：<strong>Java / 中小业务交付</strong></li><li>用来证明：不是只会接私有项目，也能把可复用的东西拆干净开源出去</li></ul><hr><h2 id="当前进度-占位" tabindex="-1">当前进度（占位） <a class="header-anchor" href="#当前进度-占位" aria-label="Permalink to “当前进度（占位）”">​</a></h2><ul><li>[ ] README：定位、技术栈、如何启动</li><li>[ ] 最小可运行：登录 / 权限 / 一个业务示例</li><li>[ ] 本页补：架构草图、我为什么这样拆、局限</li></ul><hr><h2 id="一句话" tabindex="-1">一句话 <a class="header-anchor" href="#一句话" aria-label="Permalink to “一句话”">​</a></h2><p>OpenBiz = 我的 <strong>业务向开源主打候选</strong>；先完整再漂亮。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("open-source/mine/openbiz.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const openbiz = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  openbiz as default
};
