import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"久坐与肩颈：程序员常见问题","description":"","frontmatter":{},"headers":[],"relativePath":"life/health/desk-posture.md","filePath":"life/health/desk-posture.md"}');
const _sfc_main = { name: "life/health/desk-posture.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="久坐与肩颈-程序员常见问题" tabindex="-1">久坐与肩颈：程序员常见问题 <a class="header-anchor" href="#久坐与肩颈-程序员常见问题" aria-label="Permalink to “久坐与肩颈：程序员常见问题”">​</a></h1><blockquote><p>示例文章：针对长时间对着屏幕的身体管理备忘。</p></blockquote><h2 id="常见信号" tabindex="-1">常见信号 <a class="header-anchor" href="#常见信号" aria-label="Permalink to “常见信号”">​</a></h2><ul><li>颈肩僵硬、后背发紧</li><li>下午注意力明显下降</li><li>手腕、前臂隐隐不适</li></ul><h2 id="工作中的小干预-每-50–60-分钟" tabindex="-1">工作中的小干预（每 50–60 分钟） <a class="header-anchor" href="#工作中的小干预-每-50–60-分钟" aria-label="Permalink to “工作中的小干预（每 50–60 分钟）”">​</a></h2><ol><li>站起来走 2 分钟，或做 10 次开合肩</li><li>视线离开屏幕看远处 20 秒</li><li>检查：屏幕大致平视、手腕中立、双脚着地</li></ol><h2 id="桌面快检" tabindex="-1">桌面快检 <a class="header-anchor" href="#桌面快检" aria-label="Permalink to “桌面快检”">​</a></h2><ul><li>屏幕顶部不超过眉毛太多</li><li>键盘鼠标尽量同高、靠近身体</li><li>椅子能支撑腰，而不是整个人塌进去</li></ul><h2 id="和运动的关系" tabindex="-1">和运动的关系 <a class="header-anchor" href="#和运动的关系" aria-label="Permalink to “和运动的关系”">​</a></h2><p>肩颈问题靠「只拉伸不运动」往往不够；搭配 <a href="./exercise-start.html">运动起步</a> 里的力量与走动会更稳。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("life/health/desk-posture.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const deskPosture = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  deskPosture as default
};
