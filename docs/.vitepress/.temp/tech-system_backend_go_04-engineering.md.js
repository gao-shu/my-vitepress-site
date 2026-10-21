import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Go · 04 工程实践","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/backend/go/04-engineering.md","filePath":"tech-system/backend/go/04-engineering.md"}');
const _sfc_main = { name: "tech-system/backend/go/04-engineering.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="go-·-04-工程实践" tabindex="-1">Go · 04 工程实践 <a class="header-anchor" href="#go-·-04-工程实践" aria-label="Permalink to “Go · 04 工程实践”">​</a></h1><h2 id="_1-什么时候真的写-go" tabindex="-1">1. 什么时候真的写 Go <a class="header-anchor" href="#_1-什么时候真的写-go" aria-label="Permalink to “1. 什么时候真的写 Go”">​</a></h2><ul><li>需要单二进制丢到现场跑的小服务</li><li>边车：限流、转换协议、本地代理</li><li>读/改开源组件（很多云原生工具是 Go）</li><li>验证「高并发小 IO」原型，再决定是否值得长期维护</li></ul><p>不写 Go 的时候：主业务迭代、复杂事务、团队全是 Java——别为了履历硬上。</p><hr><h2 id="_2-工程习惯" tabindex="-1">2. 工程习惯 <a class="header-anchor" href="#_2-工程习惯" aria-label="Permalink to “2. 工程习惯”">​</a></h2><div class="language- line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({ "--shiki-light": "#24292e", "--shiki-dark": "#e1e4e8", "--shiki-light-bg": "#fff", "--shiki-dark-bg": "#24292e" })}" tabindex="0" dir="ltr"><code><span class="line"><span>cmd/server/main.go</span></span>
<span class="line"><span>internal/...      # 不导出</span></span>
<span class="line"><span>pkg/...           # 可复用才放</span></span>
<span class="line"><span>go.mod</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><ul><li>配置：环境变量；密钥不进仓库</li><li><code>context</code> 从入口贯穿到 DB/HTTP 客户端</li><li>表驱动测试；关键路径加 <code>-race</code></li><li>错误：边界打日志 + metrics；中间返回 <code>%w</code></li></ul><hr><h2 id="_3-构建与部署" tabindex="-1">3. 构建与部署 <a class="header-anchor" href="#_3-构建与部署" aria-label="Permalink to “3. 构建与部署”">​</a></h2><ul><li><code>CGO_ENABLED=0</code> 做纯静态（按依赖情况）</li><li>多阶段 Docker：builder + scratch/distroless</li><li>健康检查、优雅退出（信号 + context cancel）</li></ul><h2 id="_4-和-java-协作" tabindex="-1">4. 和 Java 协作 <a class="header-anchor" href="#_4-和-java-协作" aria-label="Permalink to “4. 和 Java 协作”">​</a></h2><ul><li>Go 服务尽量无状态或状态外置</li><li>契约：HTTP JSON / gRPC；超时与重试策略对齐</li><li>观测：同样要有 request id 与结构化日志</li></ul><p>下一篇：<a href="./05-faq.html">05 常见问题</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/backend/go/04-engineering.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _04Engineering = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  _04Engineering as default
};
