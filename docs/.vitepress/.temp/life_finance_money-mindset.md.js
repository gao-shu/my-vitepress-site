import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"理财认知入门（非荐股）","description":"","frontmatter":{},"headers":[],"relativePath":"life/finance/money-mindset.md","filePath":"life/finance/money-mindset.md"}');
const _sfc_main = { name: "life/finance/money-mindset.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="理财认知入门-非荐股" tabindex="-1">理财认知入门（非荐股） <a class="header-anchor" href="#理财认知入门-非荐股" aria-label="Permalink to “理财认知入门（非荐股）”">​</a></h1><blockquote><p>示例文章：只谈原则，不推荐具体产品或个股。</p></blockquote><h2 id="几条底线" tabindex="-1">几条底线 <a class="header-anchor" href="#几条底线" aria-label="Permalink to “几条底线”">​</a></h2><ol><li><strong>先理解，再出手</strong>：不懂的结构不要碰</li><li><strong>风险与收益同在</strong>：承诺稳赚的多半有问题</li><li><strong>时间与分散</strong>：比频繁操作更重要</li><li><strong>费用会吃收益</strong>：关注隐性成本</li></ol><h2 id="常见误区" tabindex="-1">常见误区 <a class="header-anchor" href="#常见误区" aria-label="Permalink to “常见误区”">​</a></h2><ul><li>把「听说能赚」当成研究结论</li><li>应急金还没建好就上高波动资产</li><li>用借来的钱博收益</li></ul><h2 id="建议顺序-个人向" tabindex="-1">建议顺序（个人向） <a class="header-anchor" href="#建议顺序-个人向" aria-label="Permalink to “建议顺序（个人向）”">​</a></h2><p>记账看清现金流 → 应急金 → 再考虑长期、可承受波动的配置。</p><p>相关：<a href="./budget-basics.html">记账与月度复盘</a> · <a href="./emergency-fund.html">应急金</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("life/finance/money-mindset.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const moneyMindset = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  moneyMindset as default
};
