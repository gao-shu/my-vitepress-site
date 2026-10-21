import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"业务应用","description":"","frontmatter":{},"headers":[],"relativePath":"apps/business/index.md","filePath":"apps/business/index.md"}');
const _sfc_main = { name: "apps/business/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="业务应用" tabindex="-1">业务应用 <a class="header-anchor" href="#业务应用" aria-label="Permalink to “业务应用”">​</a></h1><blockquote><p>Web、SaaS、小程序、公众号 —— 面向业务的管理系统与 C 端应用。</p></blockquote><h2 id="文章列表" tabindex="-1">文章列表 <a class="header-anchor" href="#文章列表" aria-label="Permalink to “文章列表”">​</a></h2><table tabindex="0"><thead><tr><th>文章</th><th>解决的问题</th></tr></thead><tbody><tr><td><a href="/my-vitepress-site/apps/business/admin-system.html">管理后台设计与开发</a></td><td>RBAC 权限模型、菜单与路由、通用 CRUD 与字典、列表筛选与导出、前后端分离约定</td></tr><tr><td><a href="/my-vitepress-site/apps/business/crm-custom.html">CRM 定制改造实践</a></td><td>多客户差异化：配置化 vs 二开、字段与流程扩展、升级冲突避免、需求管理</td></tr><tr><td><a href="/my-vitepress-site/apps/business/erp-workflow.html">ERP 流程与单据设计</a></td><td>单据状态机、审核流、库存与单据联动、幂等与冲红、报表口径统一</td></tr><tr><td><a href="/my-vitepress-site/apps/business/mini-program.html">微信小程序开发实践</a></td><td>登录态与授权、后端接口联调、体验版与发布流程、常见审核与性能问题</td></tr><tr><td><a href="/my-vitepress-site/apps/business/saas-multi-tenant.html">多租户 SaaS 架构</a></td><td>租户隔离方案、权限与配置差异、计费与配额、数据迁移</td></tr></tbody></table><hr><p>上一级：<a href="/my-vitepress-site/apps/">应用开发</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("apps/business/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
