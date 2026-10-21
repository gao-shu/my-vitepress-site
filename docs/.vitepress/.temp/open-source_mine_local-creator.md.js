import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"本地漫创（local-creator）","description":"","frontmatter":{},"headers":[],"relativePath":"open-source/mine/local-creator.md","filePath":"open-source/mine/local-creator.md"}');
const _sfc_main = { name: "open-source/mine/local-creator.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="本地漫创-local-creator" tabindex="-1">本地漫创（local-creator） <a class="header-anchor" href="#本地漫创-local-creator" aria-label="Permalink to “本地漫创（local-creator）”">​</a></h1><blockquote><p>状态：<strong>试用阶段占位</strong>。品牌名「本地漫创」为占位名。<br> 当前建议仓库保持 <strong>私有</strong>；公开开源时机自行决定后再挂外链。</p></blockquote><hr><h2 id="它是什么" tabindex="-1">它是什么 <a class="header-anchor" href="#它是什么" aria-label="Permalink to “它是什么”">​</a></h2><p>本地桌面端 <strong>AI 漫创工具</strong>：</p><ul><li>创作工坊 + 无限画布</li><li><strong>无需登录</strong></li><li>模型 Endpoint / API Key <strong>自备</strong>，第三方费用自理</li><li>本软件 <strong>不提供</strong> 云充值或公司后台</li></ul><p>定位：把创作链路留在本地，模型调用交给用户自己的 Key。</p><hr><h2 id="环境要求" tabindex="-1">环境要求 <a class="header-anchor" href="#环境要求" aria-label="Permalink to “环境要求”">​</a></h2><p>（占位：待仓库 README 同步，例如 OS、Node/Electron 版本、磁盘与网络说明。）</p><hr><h2 id="和我简历的关系" tabindex="-1">和我简历的关系 <a class="header-anchor" href="#和我简历的关系" aria-label="Permalink to “和我简历的关系”">​</a></h2><ul><li>对应：<strong>Electron / Node(TS) + AI 应用落地</strong></li><li>和「远程 AI 应用 / 桌面工具」叙事一致</li><li>可讲清：本地优先、无账号体系、费用边界（用户自备 Key）</li></ul><hr><h2 id="当前进度-占位" tabindex="-1">当前进度（占位） <a class="header-anchor" href="#当前进度-占位" aria-label="Permalink to “当前进度（占位）”">​</a></h2><ul><li>[ ] 试用包 / 启动说明（可先仅私有仓库）</li><li>[ ] 创作工坊与画布的最小闭环可演示</li><li>[ ] 本页补：功能截图、架构、已知限制</li><li>[ ] 若开源：补 LICENSE、公开仓库地址</li></ul><hr><h2 id="一句话" tabindex="-1">一句话 <a class="header-anchor" href="#一句话" aria-label="Permalink to “一句话”">​</a></h2><p>本地漫创 = <strong>桌面 AI 创作</strong> 向作品；先把试用体验做稳，再谈公开开源。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("open-source/mine/local-creator.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const localCreator = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  localCreator as default
};
