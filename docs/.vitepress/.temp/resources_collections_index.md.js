import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"收藏","description":"","frontmatter":{},"headers":[],"relativePath":"resources/collections/index.md","filePath":"resources/collections/index.md"}');
const _sfc_main = { name: "resources/collections/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="收藏" tabindex="-1">收藏 <a class="header-anchor" href="#收藏" aria-label="Permalink to “收藏”">​</a></h1><blockquote><p>归属：<strong>资源 / 收藏</strong><br> 定义：别人创造、我保存/关注的外部项目与清单。</p></blockquote><p><strong>收藏 ≠ 我做过。</strong><br> 做过的记入 <a href="/my-vitepress-site/practices/">实践</a>；有职业证明价值的进入 <a href="/my-vitepress-site/career/projects/">项目履历</a>。</p><h2 id="开源项目" tabindex="-1">开源项目 <a class="header-anchor" href="#开源项目" aria-label="Permalink to “开源项目”">​</a></h2><p>本站开源以 <strong>我维护的项目</strong> 为主，见 <a href="/my-vitepress-site/open-source/">开源拆解</a>。</p><p>外部「收藏清单」若需要可另建，不再挂在 <code>/open-source/*</code>。</p><p><a href="./../">← 返回资源</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/collections/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
