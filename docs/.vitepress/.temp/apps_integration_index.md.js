import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"系统集成","description":"","frontmatter":{},"headers":[],"relativePath":"apps/integration/index.md","filePath":"apps/integration/index.md"}');
const _sfc_main = { name: "apps/integration/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="系统集成" tabindex="-1">系统集成 <a class="header-anchor" href="#系统集成" aria-label="Permalink to “系统集成”">​</a></h1><blockquote><p>API、Webhook、数据同步 —— 系统之间打通与数据流转。</p></blockquote><h2 id="文章列表" tabindex="-1">文章列表 <a class="header-anchor" href="#文章列表" aria-label="Permalink to “文章列表”">​</a></h2><table tabindex="0"><thead><tr><th>文章</th><th>解决的问题</th></tr></thead><tbody><tr><td><a href="/my-vitepress-site/apps/integration/open-api.html">对外 API 设计与开放平台</a></td><td>接口规范、签名与 OAuth 鉴权、限流配额、版本管理、文档与联调怎么做才经得起第三方接入</td></tr><tr><td><a href="/my-vitepress-site/apps/integration/webhook-design.html">Webhook 接入与可靠投递</a></td><td>回调注册与验签、重试与幂等、死信与人工补偿、乱序事件怎么处理才不丢不重不错序</td></tr><tr><td><a href="/my-vitepress-site/apps/integration/data-sync.html">系统间数据同步方案</a></td><td>全量与增量同步、CDC 与定时任务选型、字段映射清洗、对账与补偿怎么兜底</td></tr><tr><td><a href="/my-vitepress-site/apps/integration/sso-oauth.html">单点登录与授权打通</a></td><td>OAuth2 授权码与密码模式、Token 生命周期、多系统统一登录、登出与会话联动</td></tr><tr><td><a href="/my-vitepress-site/apps/integration/legacy-integration.html">老系统集成改造</a></td><td>无接口老系统怎么对接（库表直连、消息队列、补接口）、防腐层隔离、灰度切换与回退</td></tr></tbody></table><hr><p>上一级：<a href="/my-vitepress-site/apps/">应用开发</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("apps/integration/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
