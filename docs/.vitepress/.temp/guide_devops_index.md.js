import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"DevOps（面试 + 实战）","description":"","frontmatter":{},"headers":[],"relativePath":"guide/devops/index.md","filePath":"guide/devops/index.md"}');
const _sfc_main = { name: "guide/devops/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="devops-面试-实战" tabindex="-1">DevOps（面试 + 实战） <a class="header-anchor" href="#devops-面试-实战" aria-label="Permalink to “DevOps（面试 + 实战）”">​</a></h1><p>就业侧只关心一件事：<strong>你能不能把代码稳定送到环境里，出问题能不能快速定位。</strong><br> 不背工具百科，按「面试怎么问 → 你怎么答 → 你怎么做」准备。</p><h2 id="建议阅读顺序" tabindex="-1">建议阅读顺序 <a class="header-anchor" href="#建议阅读顺序" aria-label="Permalink to “建议阅读顺序”">​</a></h2><ol><li><a href="./docker-interview.html">Docker 实战与面试</a> — 容器、镜像、常见命令、上线相关问题</li><li><a href="./docker-compose-interview.html">Docker Compose 实战与面试</a> — 多服务编排、本地联调、面试怎么讲</li><li><a href="./k8s-interview.html">Kubernetes 实战与面试</a> — 集群编排、与 Compose 对比、发布回滚</li><li><a href="./cicd-interview.html">CI/CD 实战与面试</a> — 流水线怎么讲、最小可落地配置</li><li><a href="./monitoring-interview.html">线上问题排查实战与面试</a> — 指标/日志/告警，线上怎么查</li></ol><h2 id="面试官通常想听什么" tabindex="-1">面试官通常想听什么 <a class="header-anchor" href="#面试官通常想听什么" aria-label="Permalink to “面试官通常想听什么”">​</a></h2><ul><li>你是否亲手搭过或改过流水线 / 容器部署</li><li>出故障时你的排查顺序（先看什么、再看什么）</li><li>能不能说清一次真实经历：构建失败、发布回滚、内存打满等</li></ul><h2 id="和「技术体系」的关系" tabindex="-1">和「技术体系」的关系 <a class="header-anchor" href="#和「技术体系」的关系" aria-label="Permalink to “和「技术体系」的关系”">​</a></h2><p>这里是 <strong>求职口述 + 最小实操</strong>。<br> 更深的工具清单若以后需要，再单独补；面试优先把这几篇讲顺。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("guide/devops/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
