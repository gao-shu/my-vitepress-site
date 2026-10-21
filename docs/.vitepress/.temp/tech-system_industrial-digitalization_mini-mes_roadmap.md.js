import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Mini MES · Roadmap","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/industrial-digitalization/mini-mes/roadmap.md","filePath":"tech-system/industrial-digitalization/mini-mes/roadmap.md"}');
const _sfc_main = { name: "tech-system/industrial-digitalization/mini-mes/roadmap.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="mini-mes-·-roadmap" tabindex="-1">Mini MES · Roadmap <a class="header-anchor" href="#mini-mes-·-roadmap" aria-label="Permalink to “Mini MES · Roadmap”">​</a></h1><table tabindex="0"><thead><tr><th>字段</th><th>内容</th></tr></thead><tbody><tr><td>状态</td><td>🔵 设计中</td></tr><tr><td>类型</td><td><code>[决策]</code></td></tr><tr><td>项目</td><td>Mini MES</td></tr></tbody></table><hr><h2 id="阶段" tabindex="-1">阶段 <a class="header-anchor" href="#阶段" aria-label="Permalink to “阶段”">​</a></h2><table tabindex="0"><thead><tr><th>阶段</th><th>内容</th><th>状态</th></tr></thead><tbody><tr><td>R0</td><td>文档立桩：目标 / 演进 / 判断 / Lab 占位</td><td>🟡 进行中</td></tr><tr><td>R1</td><td>GitHub 建仓 + 模块骨架（gateway / server / web / deploy）</td><td>⚪ 待实现</td></tr><tr><td>R2</td><td>Lab 001：模拟设备 → HTTP → 监控页跑通</td><td>⚪ 待实现</td></tr><tr><td>R3</td><td>补指标与截图；判断文状态改为 🟢 已验证（能验证的部分）</td><td>⚪ 待实现</td></tr><tr><td>R4</td><td>Lab 002：引入 MQTT，做 HTTP vs MQTT 对照</td><td>⚪ 待实现</td></tr><tr><td>R5</td><td>Domain：工单最小切片（若需要）</td><td>⚪ 未开始</td></tr><tr><td>R6</td><td>开源 README / Docker Compose 一键起</td><td>⚪ 未开始</td></tr></tbody></table><hr><h2 id="近期不做清单" tabindex="-1">近期不做清单 <a class="header-anchor" href="#近期不做清单" aria-label="Permalink to “近期不做清单”">​</a></h2><ul><li>扩写底稿 00–07</li><li>新开 OPC UA / Kafka / LoRa 百科文</li><li>未跑通前把状态标成 🟢</li></ul><p>有变更只改本页日期与表格，不另开「规划长文」。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/industrial-digitalization/mini-mes/roadmap.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const roadmap = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  roadmap as default
};
