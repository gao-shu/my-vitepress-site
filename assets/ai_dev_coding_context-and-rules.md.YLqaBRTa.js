import{_ as n,o as a,c as l,ai as e}from"./chunks/framework.ampVZV4B.js";const h=JSON.parse('{"title":"Context & Rules","description":"","frontmatter":{},"headers":[],"relativePath":"ai/dev/coding/context-and-rules.md","filePath":"ai/dev/coding/context-and-rules.md"}'),p={name:"ai/dev/coding/context-and-rules.md"};function i(r,s,t,c,b,u){return a(),l("div",null,[...s[0]||(s[0]=[e(`<h1 id="context-rules" tabindex="-1">Context &amp; Rules <a class="header-anchor" href="#context-rules" aria-label="Permalink to “Context &amp; Rules”">​</a></h1><blockquote><p>一页讲清楚：给 AI 什么信息（Context），约束它怎么改（Rules）。够用即可，不建复杂规范体系。</p></blockquote><h3 id="什么时候用" tabindex="-1">什么时候用？ <a class="header-anchor" href="#什么时候用" aria-label="Permalink to “什么时候用？”">​</a></h3><ul><li>AI 不理解项目</li><li>AI 总改错位置</li><li>AI 不遵守项目规范</li><li>每次都要重复解释项目背景</li></ul><h3 id="目标" tabindex="-1">目标 <a class="header-anchor" href="#目标" aria-label="Permalink to “目标”">​</a></h3><p>建立可复用的 <strong>Context + Rules</strong>。</p><blockquote><p>不是给 AI 塞更多信息，而是给足够且必要的上下文。</p></blockquote><p>核心：</p><blockquote><p><strong>Context = 这个项目现在是什么。Rules = 在这个项目里应该怎么做。</strong></p></blockquote><p>没有 Context，AI 只能猜。<br> 没有 Rules，AI 容易用「它喜欢的写法」生成你维护不了的代码。</p><p>更深的实操（老项目提取 / 新项目设计）见：</p><ul><li><a href="/my-vitepress-site/ai/ai-programming/cursor-legacy-project.html">Cursor 老项目实战</a></li><li><a href="/my-vitepress-site/ai/ai-programming/cursor-new-project.html">Cursor 新项目实战</a></li></ul><p>本页只提供：<strong>最小理解 + 可复制模板</strong>（直接滚到下方模板复制即可）。</p><hr><h2 id="context-包含什么" tabindex="-1">Context 包含什么 <a class="header-anchor" href="#context-包含什么" aria-label="Permalink to “Context 包含什么”">​</a></h2><p>让 AI 理解「当前项目与当前任务」：</p><ul><li>项目概览（做什么、给谁用）</li><li>技术栈（语言、框架、关键中间件）</li><li>模块关系（谁调谁）</li><li>数据模型（核心表 / 实体）</li><li>API / 调用链（与本次任务相关的）</li><li>当前任务（要改什么、验收是什么）</li><li>相关约束（兼容旧接口、不能动公共模块等）</li></ul><p>原则：</p><ul><li>与<strong>本次任务相关</strong>优先，不要一上来贴整仓</li><li>用事实，不写愿景口号</li><li>缺信息就写「未知 / 待确认」，不要让 AI 编</li></ul><hr><h2 id="rules-包含什么" tabindex="-1">Rules 包含什么 <a class="header-anchor" href="#rules-包含什么" aria-label="Permalink to “Rules 包含什么”">​</a></h2><p>让 AI 知道「允许怎么写、禁止怎么写」：</p><ul><li>架构规则（分层、依赖方向）</li><li>编码规则（命名、包结构、日志/异常习惯）</li><li>数据库规则（事务、软删、迁移约定）</li><li>API 规则（错误码、兼容、鉴权）</li><li>测试规则（什么必须有测、怎么验收）</li><li><strong>AI 操作边界</strong>（最重要）</li></ul><p>AI 操作边界示例：</p><ul><li>只改与任务相关的文件</li><li>未经确认不重构</li><li>不擅自改公共 API / 表结构</li><li>不确定先问，再改</li><li>先方案后动手</li></ul><p>Rules 应尽量来自<strong>现有代码真实习惯</strong>，不要一次写一本理想手册。</p><hr><h2 id="最小-context-模板" tabindex="-1">最小 Context 模板 <a class="header-anchor" href="#最小-context-模板" aria-label="Permalink to “最小 Context 模板”">​</a></h2><p>复制后按项目填空，发给 AI 或放进项目文档：</p><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span># Context（本次任务）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 项目</span></span>
<span class="line"><span>- 名称：</span></span>
<span class="line"><span>- 一句话做什么：</span></span>
<span class="line"><span>- 技术栈：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 相关模块</span></span>
<span class="line"><span>- 涉及模块：</span></span>
<span class="line"><span>- 关键调用链：</span></span>
<span class="line"><span>- 相关表 / API：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 当前任务</span></span>
<span class="line"><span>- 目标：</span></span>
<span class="line"><span>- 验收标准：</span></span>
<span class="line"><span>- 明确不做：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 约束</span></span>
<span class="line"><span>- 必须兼容：</span></span>
<span class="line"><span>- 禁止修改：</span></span>
<span class="line"><span>- 已知坑 / 历史包袱：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 材料</span></span>
<span class="line"><span>- Diff / 相关文件：</span></span>
<span class="line"><span>- 日志 / 报错（如有）：</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><hr><h2 id="最小-rules-模板" tabindex="-1">最小 Rules 模板 <a class="header-anchor" href="#最小-rules-模板" aria-label="Permalink to “最小 Rules 模板”">​</a></h2><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span># Rules（本项目 AI 协作）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 架构</span></span>
<span class="line"><span>- 分层约定：</span></span>
<span class="line"><span>- 依赖方向：</span></span>
<span class="line"><span>- 新代码应放在：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 编码</span></span>
<span class="line"><span>- 风格跟随现有代码，不引入新风格</span></span>
<span class="line"><span>- 命名 / 包结构：</span></span>
<span class="line"><span>- 异常与日志：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 数据与 API</span></span>
<span class="line"><span>- 事务：</span></span>
<span class="line"><span>- 表结构变更：须先确认</span></span>
<span class="line"><span>- 对外 API：默认保持兼容</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 测试与验收</span></span>
<span class="line"><span>- 至少验证：</span></span>
<span class="line"><span>- 有测试则补测；无测试则写清手工步骤</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## AI 操作边界</span></span>
<span class="line"><span>- 只改任务相关文件</span></span>
<span class="line"><span>- 不擅自重构、不扩 scope</span></span>
<span class="line"><span>- 不编造不存在的业务规则或 API</span></span>
<span class="line"><span>- 不确定先标「需要确认」，等我确认再改</span></span>
<span class="line"><span>- 修改前先给方案（除非我明确说直接改）</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br></div></div><hr><h2 id="哪些内容应该给-ai" tabindex="-1">哪些内容应该给 AI <a class="header-anchor" href="#哪些内容应该给-ai" aria-label="Permalink to “哪些内容应该给 AI”">​</a></h2><p>优先给：</p><ul><li>当前 Diff</li><li>相关调用链与接口定义</li><li>验收标准与「不要做什么」</li><li>报错原文、复现步骤</li><li>已沉淀的 Context / Rules 摘要</li></ul><p>不要指望 AI 自己「读懂整仓业务政治」。</p><hr><h2 id="修改边界-写进-rules-也写进每次-prompt" tabindex="-1">修改边界（写进 Rules，也写进每次 Prompt） <a class="header-anchor" href="#修改边界-写进-rules-也写进每次-prompt" aria-label="Permalink to “修改边界（写进 Rules，也写进每次 Prompt）”">​</a></h2><p>默认边界：</p><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>可以：在指定范围内实现 / 修复 / 补测试草稿</span></span>
<span class="line"><span>不可以：无关重构、改公共契约、删历史兼容、扩大需求</span></span>
<span class="line"><span>必须：先分析或先方案（按你当轮要求）→ 再改 → 说明副作用</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>和 <a href="/my-vitepress-site/ai/dev/coding/cursor-workflow.html">AI Coding 工作流</a>、<a href="/my-vitepress-site/ai/dev/coding/ai-code-review.html">Code Review</a> 同一原则：</p><blockquote><p><strong>人定边界与验收，AI 在边界内提速。</strong></p></blockquote><hr><h2 id="怎么用-个人开发最小用法" tabindex="-1">怎么用（个人开发最小用法） <a class="header-anchor" href="#怎么用-个人开发最小用法" aria-label="Permalink to “怎么用（个人开发最小用法）”">​</a></h2><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>开任务前：填一版 Context（可很短）</span></span>
<span class="line"><span>  → 有则附上 Rules；没有就先写「AI 操作边界」四条</span></span>
<span class="line"><span>  → 实现 / Review / Debug 时把 Context + 边界贴进 Prompt</span></span>
<span class="line"><span>  → 任务结束后：把踩过的坑补一条进 Rules（有则改，无则先记笔记）</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>不必一上来建企业级规范库。先够用，再在实战里长出来。</p>`,48)])])}const d=n(p,[["render",i]]);export{h as __pageData,d as default};
