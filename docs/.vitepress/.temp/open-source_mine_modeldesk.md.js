import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"ModelDesk","description":"","frontmatter":{},"headers":[],"relativePath":"open-source/mine/modeldesk.md","filePath":"open-source/mine/modeldesk.md"}');
const _sfc_main = { name: "open-source/mine/modeldesk.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="modeldesk" tabindex="-1">ModelDesk <a class="header-anchor" href="#modeldesk" aria-label="Permalink to “ModelDesk”">​</a></h1><blockquote><p>状态：<strong>占位</strong>。仓库已存在，文档与能力说明随开发补全。</p></blockquote><ul><li>GitHub：<a href="https://github.com/gao-shu/modeldesk" target="_blank" rel="noreferrer">gao-shu/modeldesk</a></li></ul><hr><h2 id="它想解决什么" tabindex="-1">它想解决什么 <a class="header-anchor" href="#它想解决什么" aria-label="Permalink to “它想解决什么”">​</a></h2><p><strong>模型接入 / 桌面侧模型工作台</strong>：把常用模型 Endpoint、Key、试调、简单编排收拢到一个本地可用的桌子上，减少每次接模型都从零拼脚本。</p><p>（具体功能以仓库 README 为准，此处随迭代更新。）</p><hr><h2 id="和另外两个怎么分工" tabindex="-1">和另外两个怎么分工 <a class="header-anchor" href="#和另外两个怎么分工" aria-label="Permalink to “和另外两个怎么分工”">​</a></h2><table tabindex="0"><thead><tr><th>项目</th><th>重心</th></tr></thead><tbody><tr><td>OpenBiz</td><td>中小业务 / 后台交付</td></tr><tr><td>本地漫创</td><td>垂直场景：AI 漫创生产</td></tr><tr><td>ModelDesk</td><td>横向能力：模型连接与试调工作台</td></tr></tbody></table><p>三者别做成同一个「万能 AI 后台」，边界分开更好讲。</p><hr><h2 id="和我简历的关系" tabindex="-1">和我简历的关系 <a class="header-anchor" href="#和我简历的关系" aria-label="Permalink to “和我简历的关系”">​</a></h2><ul><li>对应：<strong>AI 应用工程师</strong> 的「会接模型、会做本地工具」</li><li>可与 Java 主服务、Python 胶水配合讲：ModelDesk 管接入体验，业务状态仍可在主栈</li></ul><hr><h2 id="当前进度-占位" tabindex="-1">当前进度（占位） <a class="header-anchor" href="#当前进度-占位" aria-label="Permalink to “当前进度（占位）”">​</a></h2><ul><li>[ ] README：定位、支持的模型形态、如何配置 Key</li><li>[ ] 最小闭环：配 Endpoint → 发出请求 → 看到结果</li><li>[ ] 本页补：界面/架构、与本地漫创是否复用、局限</li></ul><hr><h2 id="一句话" tabindex="-1">一句话 <a class="header-anchor" href="#一句话" aria-label="Permalink to “一句话”">​</a></h2><p>ModelDesk = <strong>模型桌面工作台</strong>；和漫创场景解耦，避免一个仓库扛所有 AI 故事。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("open-source/mine/modeldesk.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const modeldesk = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  modeldesk as default
};
