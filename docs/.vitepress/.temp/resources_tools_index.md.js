import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"工具","description":"","frontmatter":{},"headers":[],"relativePath":"resources/tools/index.md","filePath":"resources/tools/index.md"}');
const _sfc_main = { name: "resources/tools/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="工具" tabindex="-1">工具 <a class="header-anchor" href="#工具" aria-label="Permalink to “工具”">​</a></h1><blockquote><p>归属：<strong>资源 / 工具</strong><br> 正文仍在 <code>/devtools/*</code>，本页为正式 IA 入口。</p></blockquote><h2 id="docker-canonical" tabindex="-1">Docker（Canonical） <a class="header-anchor" href="#docker-canonical" aria-label="Permalink to “Docker（Canonical）”">​</a></h2><p>按 Phase 1.5 冻结：</p><ul><li><strong>Canonical</strong>：<a href="/my-vitepress-site/devtools/docker.html"><code>/devtools/docker</code></a>（资源 / 工具）</li><li>体系侧副本仅作兼容，本阶段不合并、不删除：<a href="/my-vitepress-site/tech-system/devops/docker.html"><code>/tech-system/devops/docker</code></a></li></ul><h2 id="环境与安装" tabindex="-1">环境与安装 <a class="header-anchor" href="#环境与安装" aria-label="Permalink to “环境与安装”">​</a></h2><ul><li><a href="/my-vitepress-site/devtools/jdk.html">JDK</a></li><li><a href="/my-vitepress-site/devtools/nodejs-install-version.html">Node.js</a></li><li><a href="/my-vitepress-site/devtools/python-install-version.html">Python</a></li><li><a href="/my-vitepress-site/devtools/mysql-local.html">MySQL 本地</a></li><li><a href="/my-vitepress-site/devtools/redis-local.html">Redis 本地</a></li><li><a href="/my-vitepress-site/devtools/docker.html">Docker</a></li><li><a href="/my-vitepress-site/devtools/troubleshooting.html">环境排查</a></li></ul><h2 id="开发工具" tabindex="-1">开发工具 <a class="header-anchor" href="#开发工具" aria-label="Permalink to “开发工具”">​</a></h2><ul><li><a href="/my-vitepress-site/devtools/intellij-idea.html">IntelliJ IDEA</a></li><li><a href="/my-vitepress-site/devtools/vscode.html">VS Code</a></li><li><a href="/my-vitepress-site/devtools/cursor.html">Cursor</a></li><li><a href="/my-vitepress-site/devtools/maven.html">Maven</a></li><li><a href="/my-vitepress-site/devtools/git.html">Git</a></li><li><a href="/my-vitepress-site/devtools/database-tools.html">数据库客户端</a></li><li><a href="/my-vitepress-site/devtools/api-testing.html">API 测试</a></li><li><a href="/my-vitepress-site/devtools/misc-tools.html">其他工具</a></li><li><a href="/my-vitepress-site/devtools/tool-selection.html">工具选型</a></li><li><a href="/my-vitepress-site/devtools/setup-scripts.html">一键配置脚本</a></li></ul><h2 id="总览" tabindex="-1">总览 <a class="header-anchor" href="#总览" aria-label="Permalink to “总览”">​</a></h2><ul><li><a href="/my-vitepress-site/devtools/">开发工具与环境（旧路径总览）</a></li></ul><p><a href="./../">← 返回资源</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/tools/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
