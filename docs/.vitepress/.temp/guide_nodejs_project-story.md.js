import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Node.js / TS 面试 · 项目讲述","description":"","frontmatter":{},"headers":[],"relativePath":"guide/nodejs/project-story.md","filePath":"guide/nodejs/project-story.md"}');
const _sfc_main = { name: "guide/nodejs/project-story.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="node-js-ts-面试-·-项目讲述" tabindex="-1">Node.js / TS 面试 · 项目讲述 <a class="header-anchor" href="#node-js-ts-面试-·-项目讲述" aria-label="Permalink to “Node.js / TS 面试 · 项目讲述”">​</a></h1><hr><h2 id="填空稿" tabindex="-1">填空稿 <a class="header-anchor" href="#填空稿" aria-label="Permalink to “填空稿”">​</a></h2><blockquote><p>在 <strong>（钢瓶 MES / 其它）</strong> 里，我参与 <strong>（Electron 上位机 / 设备通信 / 多端之一）</strong>。<br> 技术上用 <strong>Node + TS +（Vue）</strong>：主进程负责 <strong>（窗口/设备/本地能力）</strong>，渲染进程负责 <strong>（监控与操作界面）</strong>，中间用 <strong>（IPC/preload）</strong>。<br> 设备侧做了 <strong>（协议、超时、重连、点表）</strong>；和后端 <strong>（Java）</strong> 通过 <strong>（HTTP/MQTT/…）</strong> 协作。<br> 安全上 <strong>（关闭 nodeIntegration、桥接有限 API）</strong>。<br> 结果是 <strong>（五端协同中的上位机可用 / 采集打通）</strong>。<br> 若再做，我会加强 <strong>（崩溃上报、自动更新、协议层单测）</strong>。</p></blockquote><hr><h2 id="讲述时突出的技术点-点名即可" tabindex="-1">讲述时突出的技术点（点名即可） <a class="header-anchor" href="#讲述时突出的技术点-点名即可" aria-label="Permalink to “讲述时突出的技术点（点名即可）”">​</a></h2><ul><li>主/渲染分离与安全</li><li>异步采集不堵 UI</li><li>失败可感知（状态、日志）</li><li>与 Java 后端边界清晰</li></ul><hr><h2 id="诚实边界" tabindex="-1">诚实边界 <a class="header-anchor" href="#诚实边界" aria-label="Permalink to “诚实边界”">​</a></h2><table tabindex="0"><thead><tr><th>可以说</th><th>别硬吹</th></tr></thead><tbody><tr><td>参与上位机与联调</td><td>「我从零实现了 Electron 框架内核」</td></tr><tr><td>用过 Modbus/S7 调用</td><td>「写了完整工业协议栈」</td></tr><tr><td>TS 做接口约束</td><td>「精通 TypeScript 类型体操」</td></tr></tbody></table><hr><h2 id="常见追问" tabindex="-1">常见追问 <a class="header-anchor" href="#常见追问" aria-label="Permalink to “常见追问”">​</a></h2><ul><li>「内存泄漏？」→ 监听未移除、定时器未清、全局缓存；开发时用 Performance 看。</li><li>「如何热更新配置？」→ 点表热加载要谨慎，写操作中更新要有版本号。</li><li>「和纯 Vue Web 区别？」→ 本地能力与设备；部署是安装包不是只刷新 CDN。</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("guide/nodejs/project-story.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const projectStory = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  projectStory as default
};
