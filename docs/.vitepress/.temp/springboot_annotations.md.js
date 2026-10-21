import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"常用注解","description":"","frontmatter":{},"headers":[],"relativePath":"springboot/annotations.md","filePath":"springboot/annotations.md"}');
const _sfc_main = { name: "springboot/annotations.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="常用注解" tabindex="-1">常用注解 <a class="header-anchor" href="#常用注解" aria-label="Permalink to “常用注解”">​</a></h1><blockquote><p>待完善...</p></blockquote><p>本节将总结 SpringBoot 开发中常用的注解。</p><h2 id="主要内容" tabindex="-1">主要内容 <a class="header-anchor" href="#主要内容" aria-label="Permalink to “主要内容”">​</a></h2><ul><li>核心注解（@SpringBootApplication、@Configuration 等）</li><li>Bean 相关注解（@Component、@Service、@Repository 等）</li><li>依赖注入注解（@Autowired、@Resource 等）</li><li>Web 相关注解（@RestController、@RequestMapping 等）</li><li>配置相关注解（@Value、@ConfigurationProperties 等）</li></ul><p>敬请期待！</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("springboot/annotations.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const annotations = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  annotations as default
};
