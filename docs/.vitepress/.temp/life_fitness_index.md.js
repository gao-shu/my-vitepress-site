import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"运动健身（已归入「健康」）","description":"","frontmatter":{},"headers":[],"relativePath":"life/fitness/index.md","filePath":"life/fitness/index.md"}');
const _sfc_main = { name: "life/fitness/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="运动健身-已归入「健康」" tabindex="-1">运动健身（已归入「健康」） <a class="header-anchor" href="#运动健身-已归入「健康」" aria-label="Permalink to “运动健身（已归入「健康」）”">​</a></h1><p>本目录为<strong>兼容入口</strong>。正文已归入第二大脑：</p><p><strong>生活 → 健康</strong> → <a href="/my-vitepress-site/life/health/">/life/health/</a></p><table tabindex="0"><thead><tr><th>旧路径</th><th>新路径</th></tr></thead><tbody><tr><td>本页</td><td><a href="/my-vitepress-site/life/health/">健康总览</a></td></tr><tr><td>sleep-basics</td><td><a href="/my-vitepress-site/life/health/sleep-basics.html">睡眠与作息入门</a></td></tr><tr><td>exercise-start</td><td><a href="/my-vitepress-site/life/health/exercise-start.html">运动起步</a></td></tr><tr><td>desk-posture</td><td><a href="/my-vitepress-site/life/health/desk-posture.html">久坐与肩颈</a></td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("life/fitness/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
