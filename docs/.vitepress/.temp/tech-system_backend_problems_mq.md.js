import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"后端问题 · MQ","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/backend/problems/mq.md","filePath":"tech-system/backend/problems/mq.md"}');
const _sfc_main = { name: "tech-system/backend/problems/mq.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="后端问题-·-mq" tabindex="-1">后端问题 · MQ <a class="header-anchor" href="#后端问题-·-mq" aria-label="Permalink to “后端问题 · MQ”">​</a></h1><h2 id="我怎么看消息队列" tabindex="-1">我怎么看消息队列 <a class="header-anchor" href="#我怎么看消息队列" aria-label="Permalink to “我怎么看消息队列”">​</a></h2><p>MQ 解决的是：<strong>异步、解耦、削峰</strong>。<br> 引入后必然面对：丢失、重复、积压、顺序。</p><p>中小业务 <strong>能不用强依赖就不用</strong>；AI 任务、通知、非核心链路更适合。</p><h2 id="常见坑" tabindex="-1">常见坑 <a class="header-anchor" href="#常见坑" aria-label="Permalink to “常见坑”">​</a></h2><table tabindex="0"><thead><tr><th>现象</th><th>常见根因</th><th>处理方向</th></tr></thead><tbody><tr><td>消息丢</td><td>生产者未确认、Broker 落盘策略、消费未 ack</td><td>确认机制；持久化；正确 ack</td></tr><tr><td>重复消费</td><td>至少一次投递</td><td>业务幂等（唯一键/状态判断）</td></tr><tr><td>积压</td><td>消费慢、故障、流量突增</td><td>扩容消费者；临时降级；修毒消息</td></tr><tr><td>乱序</td><td>多分区并发消费</td><td>单分区键；或状态机容忍乱序</td></tr></tbody></table><h2 id="我的默认策略" tabindex="-1">我的默认策略 <a class="header-anchor" href="#我的默认策略" aria-label="Permalink to “我的默认策略”">​</a></h2><ol><li>先问：同步调用是否够用</li><li>上 MQ 必须设计幂等</li><li>积压要有监控与人工入口</li></ol><hr><p>就业指南 MQ 专题有更细的面试剧本。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/backend/problems/mq.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const mq = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  mq as default
};
