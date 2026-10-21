import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"开源拆解","description":"","frontmatter":{},"headers":[],"relativePath":"open-source/index.md","filePath":"open-source/index.md"}');
const _sfc_main = { name: "open-source/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="开源拆解" tabindex="-1">开源拆解 <a class="header-anchor" href="#开源拆解" aria-label="Permalink to “开源拆解”">​</a></h1><p>以 <strong>我自己维护的开源</strong> 为主，证明会交付什么——中小业务、桌面 AI、模型接入。</p><h2 id="我的开源-暂定三件" tabindex="-1">我的开源（暂定三件） <a class="header-anchor" href="#我的开源-暂定三件" aria-label="Permalink to “我的开源（暂定三件）”">​</a></h2><table tabindex="0"><thead><tr><th>项目</th><th>一句话</th><th>状态</th></tr></thead><tbody><tr><td><a href="./mine/openbiz.html">OpenBiz</a></td><td>面向中小的业务/后台向开源底座</td><td>仓库已建，内容持续补</td></tr><tr><td><a href="./mine/local-creator.html">本地漫创（local-creator）</a></td><td>本地桌面端 AI 漫创：创作工坊 + 无限画布</td><td>试用阶段，建议私有</td></tr><tr><td><a href="./mine/modeldesk.html">ModelDesk</a></td><td>模型接入 / 桌面侧模型工作台</td><td>仓库已建，内容持续补</td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("open-source/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
