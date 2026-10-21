import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"实践","description":"","frontmatter":{},"headers":[],"relativePath":"practices/index.md","filePath":"practices/index.md"}');
const _sfc_main = { name: "practices/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="实践" tabindex="-1">实践 <a class="header-anchor" href="#实践" aria-label="Permalink to “实践”">​</a></h1><blockquote><p>回答：<strong>我实际做过什么？</strong></p></blockquote><p>跨领域统一记录层。不按 Demo / MVP / 开源等建固定二级菜单。</p><p>未来每条实践通过 metadata / relation 描述方向、类型、技术、状态、关联目标与知识。</p><h2 id="说明" tabindex="-1">说明 <a class="header-anchor" href="#说明" aria-label="Permalink to “说明”">​</a></h2><ul><li>收藏别人的项目 → <a href="/my-vitepress-site/resources/collections/">资源 / 收藏</a></li><li>有职业证明价值 → 另链 <a href="/my-vitepress-site/career/projects/">职业 / 项目履历</a></li><li>工程方法论长文 → <a href="/my-vitepress-site/knowledge/other/">知识 / 其他</a>（不是本区）</li></ul><p>本页为占位；实践条目将在后续阶段新增。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("practices/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
