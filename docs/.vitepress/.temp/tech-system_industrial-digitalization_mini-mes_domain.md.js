import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Mini MES · Domain / 问题","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/industrial-digitalization/mini-mes/domain.md","filePath":"tech-system/industrial-digitalization/mini-mes/domain.md"}');
const _sfc_main = { name: "tech-system/industrial-digitalization/mini-mes/domain.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="mini-mes-·-domain-问题" tabindex="-1">Mini MES · Domain / 问题 <a class="header-anchor" href="#mini-mes-·-domain-问题" aria-label="Permalink to “Mini MES · Domain / 问题”">​</a></h1><table tabindex="0"><thead><tr><th>字段</th><th>内容</th></tr></thead><tbody><tr><td>状态</td><td>🔵 设计中</td></tr><tr><td>类型</td><td><code>[决策]</code> Domain</td></tr><tr><td>项目</td><td>Mini MES</td></tr></tbody></table><p>制造问题先记在这里，作为 <strong>Domain Decision</strong>，不单独开「MES 教程」栏目。V0 以设备监控为主；下列问题在做工单 / OEE 前必须想清楚。</p><hr><h2 id="d001-·-停机-工单暂停" tabindex="-1">D001 · 停机 ≠ 工单暂停 <a class="header-anchor" href="#d001-·-停机-工单暂停" aria-label="Permalink to “D001 · 停机 ≠ 工单暂停”">​</a></h2><p><strong>问题</strong>：设备停机了，工单是否自动暂停？</p><p><strong>判断</strong>：不一定。停机可能是换刀、待料、故障、人员离岗、计划暂停等；工单暂停是业务状态，需独立建模。</p><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({ "--shiki-light": "#24292e", "--shiki-dark": "#e1e4e8", "--shiki-light-bg": "#fff", "--shiki-dark-bg": "#24292e" })}" tabindex="0" dir="ltr"><code><span class="line"><span>MachineStatus  ≠  WorkOrderStatus</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p><strong>影响</strong>：OEE 可用率、停机统计、工单时效、报工口径。<br><strong>落地时机</strong>：进入工单切片时再落表；V0 只做设备在线 / 采集状态。</p><hr><h2 id="d002-·-采集产量能直接当报工数吗" tabindex="-1">D002 · 采集产量能直接当报工数吗？ <a class="header-anchor" href="#d002-·-采集产量能直接当报工数吗" aria-label="Permalink to “D002 · 采集产量能直接当报工数吗？”">​</a></h2><p><strong>问题</strong>：设备上报生产 100，能否记工单完成 100？</p><p><strong>判断</strong>：不能直接等同。</p><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({ "--shiki-light": "#24292e", "--shiki-dark": "#e1e4e8", "--shiki-light-bg": "#fff", "--shiki-dark-bg": "#24292e" })}" tabindex="0" dir="ltr"><code><span class="line"><span>设备计数 ≠ 良品数 ≠ 工单完成数</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>中间还有废品、返工、抽检、补报、撤销、换线。自动采集最多作为<strong>候选产量</strong>，报工需规则或人工确认。</p><p><strong>落地时机</strong>：报工功能启动时；V0 只存原始测点。</p><hr><h2 id="d003-·-待补充" tabindex="-1">D003 · 待补充 <a class="header-anchor" href="#d003-·-待补充" aria-label="Permalink to “D003 · 待补充”">​</a></h2><p>Lab 与真实业务碰撞后再追加。每条保持：问题 → 判断 → 影响 → 何时进代码。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/industrial-digitalization/mini-mes/domain.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const domain = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  domain as default
};
