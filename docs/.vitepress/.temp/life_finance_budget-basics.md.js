import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"记账与月度复盘","description":"","frontmatter":{},"headers":[],"relativePath":"life/finance/budget-basics.md","filePath":"life/finance/budget-basics.md"}');
const _sfc_main = { name: "life/finance/budget-basics.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="记账与月度复盘" tabindex="-1">记账与月度复盘 <a class="header-anchor" href="#记账与月度复盘" aria-label="Permalink to “记账与月度复盘”">​</a></h1><blockquote><p>示例文章：目标是「看见现金流」，不是做出完美表格。</p></blockquote><h2 id="最小记账法" tabindex="-1">最小记账法 <a class="header-anchor" href="#最小记账法" aria-label="Permalink to “最小记账法”">​</a></h2><p>只分 4 类即可起步：</p><table tabindex="0"><thead><tr><th>类别</th><th>例子</th></tr></thead><tbody><tr><td>必须支出</td><td>房租、水电、通勤、基础伙食</td></tr><tr><td>生活弹性</td><td>外卖升级、社交、订阅</td></tr><tr><td>成长投入</td><td>课程、书籍、健身</td></tr><tr><td>长期目标</td><td>应急金、投资定投</td></tr></tbody></table><p>工具随意：表格、App、笔记都行，<strong>能坚持比工具高级更重要</strong>。</p><h2 id="每月-30-分钟复盘" tabindex="-1">每月 30 分钟复盘 <a class="header-anchor" href="#每月-30-分钟复盘" aria-label="Permalink to “每月 30 分钟复盘”">​</a></h2><ol><li>本月总流入 / 总流出</li><li>哪一类超预期了？原因是什么？</li><li>下月只改 <strong>1 个</strong>行为（例如少一次无意义订阅）</li></ol><h2 id="下一步" tabindex="-1">下一步 <a class="header-anchor" href="#下一步" aria-label="Permalink to “下一步”">​</a></h2><p>有了大致图景后，去建 <a href="./emergency-fund.html">应急金</a>。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("life/finance/budget-basics.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const budgetBasics = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  budgetBasics as default
};
