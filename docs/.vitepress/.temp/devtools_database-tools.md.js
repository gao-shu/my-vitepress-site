import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"数据库客户端工具","description":"","frontmatter":{},"headers":[],"relativePath":"devtools/database-tools.md","filePath":"devtools/database-tools.md"}');
const _sfc_main = { name: "devtools/database-tools.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="数据库客户端工具" tabindex="-1">数据库客户端工具 <a class="header-anchor" href="#数据库客户端工具" aria-label="Permalink to “数据库客户端工具”">​</a></h1><blockquote><p>所属专题：<a href="/my-vitepress-site/devtools/">开发工具与环境配置</a></p></blockquote><h2 id="_1-navicat" tabindex="-1">1) Navicat <a class="header-anchor" href="#_1-navicat" aria-label="Permalink to “1) Navicat”">​</a></h2><ul><li>下载地址：<a href="https://www.navicat.com/en/download/navicat-premium-lite" target="_blank" rel="noreferrer">https://www.navicat.com/en/download/navicat-premium-lite</a></li><li>核心功能： <ul><li>数据库连接管理</li><li>SQL 编辑与执行</li><li>表结构与数据可视化查看</li></ul></li><li>简单配置： <ul><li>新建连接：<code>Connection -&gt; MySQL</code></li><li>填写 <code>Host</code> / <code>Port(3306)</code> / <code>Username</code> / <code>Password</code></li><li>点击 <code>Test Connection</code> 成功后保存</li></ul></li></ul><h2 id="_2-dbeaver" tabindex="-1">2) DBeaver <a class="header-anchor" href="#_2-dbeaver" aria-label="Permalink to “2) DBeaver”">​</a></h2><ul><li>下载地址：<a href="https://dbeaver.io/download/" target="_blank" rel="noreferrer">https://dbeaver.io/download/</a></li><li>核心功能： <ul><li>多数据库连接管理</li><li>SQL 编辑与执行</li><li>数据导入导出</li></ul></li><li>简单配置： <ul><li>新建连接：<code>Database -&gt; New Database Connection</code></li><li>选择 <code>MySQL</code>，填写 <code>Host</code> / <code>Port(3306)</code> / <code>Database</code> / <code>Username</code> / <code>Password</code></li><li>首次连接按提示下载驱动，完成后点击 <code>Test Connection</code></li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("devtools/database-tools.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const databaseTools = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  databaseTools as default
};
