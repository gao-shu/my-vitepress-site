import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"后端问题总览","description":"","frontmatter":{},"headers":[],"relativePath":"tech-system/backend/problems/index.md","filePath":"tech-system/backend/problems/index.md"}');
const _sfc_main = { name: "tech-system/backend/problems/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="后端问题总览" tabindex="-1">后端问题总览 <a class="header-anchor" href="#后端问题总览" aria-label="Permalink to “后端问题总览”">​</a></h1><p>这里沉淀的是 <strong>跨语言的工程问题</strong>：出了状况我怎么理解、怎么处理。<br> 不是面试题库（细题在就业指南），也不绑死某一门语言。</p><table tabindex="0"><thead><tr><th>主题</th><th>我关心的核心问题</th></tr></thead><tbody><tr><td><a href="./concurrency.html">并发</a></td><td>线程/协程用砸了怎么办？资源怎么封顶？</td></tr><tr><td><a href="./database.html">数据库</a></td><td>为什么慢？事务边界怎么划？</td></tr><tr><td><a href="./redis.html">Redis</a></td><td>缓存一致性、击穿穿透、锁</td></tr><tr><td><a href="./mq.html">MQ</a></td><td>丢失、重复、积压</td></tr><tr><td><a href="./distributed.html">分布式</a></td><td>要不要拆？一致性怎么做够用？</td></tr><tr><td><a href="./network.html">网络</a></td><td>超时、重试、幂等</td></tr><tr><td><a href="./performance.html">性能</a></td><td>先量再猜；瓶颈常在 IO/SQL</td></tr><tr><td><a href="./security.html">安全</a></td><td>鉴权、注入、密钥与越权</td></tr></tbody></table><p><strong>原则：</strong> 先有边界与可观测，再谈中间件名词。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tech-system/backend/problems/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
