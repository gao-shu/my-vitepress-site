import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"实验室","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/industrial-digitalization/labs/index.md","filePath":"tech-system/industrial-digitalization/labs/index.md"}');
const _sfc_main = { name: "tech-system/industrial-digitalization/labs/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="实验室" tabindex="-1">实验室 <a class="header-anchor" href="#实验室" aria-label="Permalink to “实验室”">​</a></h1><p>记录 <strong>跑过的实验</strong>：环境、指标、问题、失败与结论。不是教程目录。</p><table tabindex="0"><thead><tr><th>Lab</th><th>标题</th><th>状态</th></tr></thead><tbody><tr><td>001</td><td><a href="./lab-001.html">设备采集最小闭环</a></td><td>⚪ 待实现</td></tr></tbody></table><p>有 GitHub / Docker / 截图后，在对应 Lab 页回填证据字段。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/industrial-digitalization/labs/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
