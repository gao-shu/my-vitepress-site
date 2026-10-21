import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"睡眠与作息入门","description":"","frontmatter":{},"headers":[],"relativePath":"life/health/sleep-basics.md","filePath":"life/health/sleep-basics.md"}');
const _sfc_main = { name: "life/health/sleep-basics.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="睡眠与作息入门" tabindex="-1">睡眠与作息入门 <a class="header-anchor" href="#睡眠与作息入门" aria-label="Permalink to “睡眠与作息入门”">​</a></h1><blockquote><p>示例文章：先建立「可恢复」的底盘，再谈效率。</p></blockquote><h2 id="为什么先写睡眠" tabindex="-1">为什么先写睡眠 <a class="header-anchor" href="#为什么先写睡眠" aria-label="Permalink to “为什么先写睡眠”">​</a></h2><p>求职、学习和加班都依赖恢复质量。睡眠不稳时，再多技巧也难持续。</p><h2 id="最小可行规则-先做这-3-条" tabindex="-1">最小可行规则（先做这 3 条） <a class="header-anchor" href="#最小可行规则-先做这-3-条" aria-label="Permalink to “最小可行规则（先做这 3 条）”">​</a></h2><ol><li><strong>固定起床点</strong>：工作日起床时间波动尽量不超过 1 小时</li><li><strong>睡前 60 分钟降刺激</strong>：少刷短视频，调暗灯光</li><li><strong>咖啡因截止</strong>：下午某个时点后不再摄入（按自己敏感度定）</li></ol><h2 id="可选记录表" tabindex="-1">可选记录表 <a class="header-anchor" href="#可选记录表" aria-label="Permalink to “可选记录表”">​</a></h2><table tabindex="0"><thead><tr><th>日期</th><th>入睡大概时间</th><th>起床时间</th><th>主观精力（1-5）</th><th>备注</th></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody></table><h2 id="下一步" tabindex="-1">下一步 <a class="header-anchor" href="#下一步" aria-label="Permalink to “下一步”">​</a></h2><p>稳住两周后，再看 <a href="./exercise-start.html">运动起步</a>。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("life/health/sleep-basics.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const sleepBasics = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  sleepBasics as default
};
