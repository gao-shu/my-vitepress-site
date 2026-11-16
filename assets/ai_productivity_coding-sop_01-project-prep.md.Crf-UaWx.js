import{_ as n,o as a,c as p,ai as l}from"./chunks/framework.Ba-VnP44.js";const u=JSON.parse('{"title":"01 项目准备","description":"","frontmatter":{},"headers":[],"relativePath":"ai/productivity/coding-sop/01-project-prep.md","filePath":"ai/productivity/coding-sop/01-project-prep.md"}'),e={name:"ai/productivity/coding-sop/01-project-prep.md"};function i(r,s,t,b,c,d){return a(),p("div",null,[...s[0]||(s[0]=[l(`<h1 id="_01-项目准备" tabindex="-1">01 项目准备 <a class="header-anchor" href="#_01-项目准备" aria-label="Permalink to “01 项目准备”">​</a></h1><blockquote><p>让 AI 先搞懂项目：新项目怎么初始化、老项目怎么接手、怎么摸清结构与调用链、怎么建立最小且长期生效的协作配置。准备到「能说清改哪里、会影响谁」就够了，不要先建一堆文档。</p></blockquote><h2 id="一、什么时候用" tabindex="-1">一、什么时候用 <a class="header-anchor" href="#一、什么时候用" aria-label="Permalink to “一、什么时候用”">​</a></h2><table tabindex="0"><thead><tr><th>场景</th><th>怎么做</th></tr></thead><tbody><tr><td>全新项目，代码还没开始写</td><td>新项目初始化</td></tr><tr><td>已有脚手架，尚未正式开发</td><td>检查现有结构，补项目约定</td></tr><tr><td>接手别人开发的项目</td><td>老项目接管</td></tr><tr><td>已开发一段时间，AI 经常理解错</td><td>补上下文与规则，不必重做接入</td></tr><tr><td>小型一次性项目</td><td>只做最小必要准备</td></tr></tbody></table><p>项目准备的核心任务只有三个：让 AI 知道项目是什么、知道如何开发与验证、知道哪些事情不能擅自做。</p><p><strong>不是每次开发都要重新准备一遍。</strong> 结果沉淀在仓库里，后续会话直接读。</p><h3 id="实际开发的四步流程" tabindex="-1">实际开发的四步流程 <a class="header-anchor" href="#实际开发的四步流程" aria-label="Permalink to “实际开发的四步流程”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>① 准备项目    让 AI 理解项目，读取规则和必要上下文（本页）</span></span>
<span class="line"><span>② 描述任务    说清目标和约束，让 AI 分析、拆解、编码（第 02 页）</span></span>
<span class="line"><span>③ 遇到问题    让 AI 定位根因、修复并验证（第 03 页）</span></span>
<span class="line"><span>④ 完成验收    检查功能、测试、构建和交付结果（第 04 页）</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>不需要每次都走完四步。改一句文案，直接从第②步开始；接手陌生项目，从第①步开始。</p><h3 id="任务轻重决定准备深度" tabindex="-1">任务轻重决定准备深度 <a class="header-anchor" href="#任务轻重决定准备深度" aria-label="Permalink to “任务轻重决定准备深度”">​</a></h3><table tabindex="0"><thead><tr><th>任务类型</th><th>准备到什么程度</th></tr></thead><tbody><tr><td>简单修改</td><td>当前文件上下文即可</td></tr><tr><td>小 Bug</td><td>一条调用链 + 复现条件</td></tr><tr><td>普通功能</td><td>模块地图 + 影响范围</td></tr><tr><td>复杂功能 / 老项目</td><td>完整接入 + 四层上下文分析</td></tr></tbody></table><h2 id="二、操作步骤" tabindex="-1">二、操作步骤 <a class="header-anchor" href="#二、操作步骤" aria-label="Permalink to “二、操作步骤”">​</a></h2><h3 id="_2-1-新项目初始化-七步" tabindex="-1">2.1 新项目初始化（七步） <a class="header-anchor" href="#_2-1-新项目初始化-七步" aria-label="Permalink to “2.1 新项目初始化（七步）”">​</a></h3><table tabindex="0"><thead><tr><th>步骤</th><th>AI 要做什么</th><th>产出</th></tr></thead><tbody><tr><td>1</td><td>明确项目目标、用户和核心功能</td><td>项目目标</td></tr><tr><td>2</td><td>确认技术栈与运行环境</td><td>技术约定</td></tr><tr><td>3</td><td>检查或建立项目目录结构</td><td>项目骨架</td></tr><tr><td>4</td><td>确定开发、构建和测试命令</td><td>命令清单</td></tr><tr><td>5</td><td>确定代码规范和修改边界</td><td>项目规则</td></tr><tr><td>6</td><td>检查开发环境是否可用</td><td>环境检查结果</td></tr><tr><td>7</td><td>整理必要的项目上下文</td><td>项目说明</td></tr></tbody></table><p>先定边界，再定文件，最后才让 AI 写代码。顺序反了，AI 会用「它认为合理」的结构替你做架构决策，而且这个决策只存在那轮对话里。</p><h3 id="_2-2-老项目接管-九步" tabindex="-1">2.2 老项目接管（九步） <a class="header-anchor" href="#_2-2-老项目接管-九步" aria-label="Permalink to “2.2 老项目接管（九步）”">​</a></h3><table tabindex="0"><thead><tr><th>步骤</th><th>检查内容</th><th>产出</th></tr></thead><tbody><tr><td>1</td><td>项目目录与模块划分</td><td>项目结构</td></tr><tr><td>2</td><td>技术栈、依赖和版本</td><td>技术环境</td></tr><tr><td>3</td><td>启动、构建和测试方式</td><td>命令清单</td></tr><tr><td>4</td><td>核心业务模块与调用关系</td><td>业务地图</td></tr><tr><td>5</td><td>数据库、接口和外部依赖</td><td>关键依赖清单</td></tr><tr><td>6</td><td>代码规范和已有规则</td><td>开发约定</td></tr><tr><td>7</td><td>当前已知问题和风险</td><td>风险清单</td></tr><tr><td>8</td><td>与当前任务相关的代码位置</td><td>任务上下文</td></tr><tr><td>9</td><td>汇总并检查认知准确性</td><td>项目接入报告</td></tr></tbody></table><p><strong>新项目可以设计结构，老项目必须尊重现状。</strong> 不要求一次理解整个系统：先掌握整体结构，再围绕实际任务深入对应模块。</p><p><strong>七条硬禁令</strong>（突破需说明原因、影响范围并取得授权）：</p><ol><li>不擅自重构原有架构。</li><li>不随意修改已有接口签名。</li><li>不随意升级依赖和框架版本。</li><li>不批量格式化无关文件。</li><li>不把推测出来的业务规则当作真实规则。</li><li>不擅自删除已有功能。</li><li>不修改生产数据或执行不可逆操作。</li></ol><h3 id="_2-3-项目分析-四层收敛" tabindex="-1">2.3 项目分析：四层收敛 <a class="header-anchor" href="#_2-3-项目分析-四层收敛" aria-label="Permalink to “2.3 项目分析：四层收敛”">​</a></h3><p>无效扫描的根因是范围没有分层。按外到内四层收敛，每层有停止条件，上一层没完成不进下一层。</p><table tabindex="0"><thead><tr><th>层次</th><th>产出</th><th>可以停的条件</th><th>典型耗时</th></tr></thead><tbody><tr><td>项目地图</td><td>模块清单 + 入口 + 构建方式</td><td>能说出「项目由哪几块组成」</td><td>3–5 分钟</td></tr><tr><td>模块地图</td><td>本次任务涉及的目录与子模块</td><td>能指出「改动落在哪个包」</td><td>2–3 分钟</td></tr><tr><td>调用链</td><td>入口 → 服务 → 数据完整路径</td><td>能画出「请求经过哪几层」</td><td>5–10 分钟</td></tr><tr><td>相关文件</td><td>待读待改文件清单（含不改但受影响的）</td><td>每个文件都能说出为何关心</td><td>1–2 分钟</td></tr></tbody></table><p><strong>明确跳过</strong>：<code>node_modules/</code>、<code>target/</code>、<code>dist/</code>、<code>.git/</code>、依赖目录、生成代码、大体积二进制。扫进去只会消耗上下文。</p><p>追踪调用链时，六类路径都要覆盖：同步调用、前端调用、异步任务（定时 / <code>@Async</code>）、消息消费、配置开关、动态 SQL。只跟同步链会漏掉大量场景。</p><p>链条要追到数据落点才算完：<strong>数据改在哪张表、事务边界在哪、异常最终怎么处理。</strong></p><p>数据库结构以迁移脚本或实际库为准，不以实体类为准；接口要同时看前端 <code>api/*.ts</code> 与后端 DTO；缓存、MQ、第三方接口即使是间接依赖也要指出。</p><h3 id="_2-4-建立最小协作配置" tabindex="-1">2.4 建立最小协作配置 <a class="header-anchor" href="#_2-4-建立最小协作配置" aria-label="Permalink to “2.4 建立最小协作配置”">​</a></h3><p><strong>启动只建五项</strong>：项目认知资料、一份全局 Rules、一条开发主链、任务输入与验收习惯、进度记录方式。不需要全套 Agent、Skill 库、MCP、Hooks。</p><table tabindex="0"><thead><tr><th>机制</th><th>回答什么</th><th>归属</th><th>能不能放业务事实</th></tr></thead><tbody><tr><td>Rules</td><td>所有任务必须遵守什么</td><td>跟仓库走</td><td>只写约束句，不复制说明</td></tr><tr><td>Agent</td><td>谁来做、权限到哪</td><td>跟仓库或人走</td><td>不存事实</td></tr><tr><td>Skills</td><td>重复出现的方法怎么一步步做</td><td>跟人走，可跨项目</td><td><strong>禁止</strong></td></tr></tbody></table><p><strong>Rules 写什么</strong>：技术栈与版本、构建测试命令、命名分层、禁改目录、安全红线、跨任务成立的业务约束。不写本次任务、完整业务流程、分阶段操作步骤。每条要可验证，禁止项要配反例，全局控制在 30 行内，用「必须 / 禁止」而非「建议 / 尽量」。</p><p><strong>Agent 的关键边界</strong>：执行者不能当验收人。审查者只输出「问题清单和依据」，完成判定由人做。没有冻结的 Spec 就不要拆并行角色。</p><p><strong>Skill 的三个条件同时满足才建</strong>：同类操作出现三次以上、有稳定步骤和检查点、至少两个任务验证有效。Skill 里出现具体表名、客户名、业务字段，就是写错了地方。</p><p><strong>MCP / Hooks 不越界</strong>：MCP 只解决仓库外的能力或数据，接前过必要性 / 边界 / 降级三项检查；凡是「漏了就出事且能脚本判定」的检查（构建、单测、密钥扫描、禁改区 diff）交给脚本，不靠提示词提醒。</p><p><strong>工具适配边界</strong>：上面所有文件名和目录都是通用示意。Cursor、WorkBuddy 等工具的具体目录、配置语法、加载方式，以各自当前版本官方文档为准，不把某个工具的目录当成行业规范。</p><h3 id="_2-5-最小项目资料-按需" tabindex="-1">2.5 最小项目资料（按需） <a class="header-anchor" href="#_2-5-最小项目资料-按需" aria-label="Permalink to “2.5 最小项目资料（按需）”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>项目根目录/</span></span>
<span class="line"><span>├── README.md</span></span>
<span class="line"><span>├── AGENTS.md                 # 项目级 AI 开发约定（按需）</span></span>
<span class="line"><span>├── docs/</span></span>
<span class="line"><span>│   └── development/</span></span>
<span class="line"><span>│       ├── project-overview.md</span></span>
<span class="line"><span>│       ├── architecture.md</span></span>
<span class="line"><span>│       └── known-issues.md</span></span>
<span class="line"><span>└── .cursor/</span></span>
<span class="line"><span>    └── rules/                # Cursor 专属规则（按需）</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>已有文档能承担职责就复用；不要为目录看起来完整而创建空文件；不同工具配置格式不同，按工具适配。</p><h3 id="_2-6-什么时候可以开始开发" tabindex="-1">2.6 什么时候可以开始开发 <a class="header-anchor" href="#_2-6-什么时候可以开始开发" aria-label="Permalink to “2.6 什么时候可以开始开发”">​</a></h3><ol><li>知道项目是什么。</li><li>知道项目如何运行。</li><li>知道如何编译和测试。</li><li>知道开发时要遵守哪些规则。</li><li>当前任务相关信息能够继续获取。</li><li>未确认的信息已经明确标注。</li></ol><p><strong>不需要等整个项目完全理解后才开始开发。</strong> 新功能只需在开始该任务前补对应业务上下文。</p><h2 id="三、提示词" tabindex="-1">三、提示词 <a class="header-anchor" href="#三、提示词" aria-label="Permalink to “三、提示词”">​</a></h2><h3 id="_3-1-新项目初始化" tabindex="-1">3.1 新项目初始化 <a class="header-anchor" href="#_3-1-新项目初始化" aria-label="Permalink to “3.1 新项目初始化”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>现在准备开始一个新项目。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>你的任务是协助我完成项目初始化，但暂时不要直接大规模编写业务代码。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第一步：明确项目目标</span></span>
<span class="line"><span>请先了解：</span></span>
<span class="line"><span>1. 项目要解决什么问题？</span></span>
<span class="line"><span>2. 主要用户是谁？</span></span>
<span class="line"><span>3. 核心业务功能有哪些？</span></span>
<span class="line"><span>4. 当前已经确定的技术选型是什么？</span></span>
<span class="line"><span>5. 有哪些明确的开发约束？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>如果现有信息足够，不要重复询问。</span></span>
<span class="line"><span>如果存在关键缺失，一次性列出需要我确认的问题。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第二步：检查现有环境</span></span>
<span class="line"><span>检查当前工作目录：</span></span>
<span class="line"><span>- 是否已经存在项目文件？</span></span>
<span class="line"><span>- 是否已经有技术脚手架？</span></span>
<span class="line"><span>- 是否存在 Git 仓库？</span></span>
<span class="line"><span>- 是否已有项目规则文件？</span></span>
<span class="line"><span>- 是否已经安装必要依赖？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>不要覆盖或删除已有内容。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第三步：提出初始化方案</span></span>
<span class="line"><span>给出：</span></span>
<span class="line"><span>1. 推荐目录结构。</span></span>
<span class="line"><span>2. 技术栈与依赖建议。</span></span>
<span class="line"><span>3. 开发、构建、测试命令。</span></span>
<span class="line"><span>4. 必要的项目规则。</span></span>
<span class="line"><span>5. 当前阶段需要创建的文件。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第四步：控制初始化范围</span></span>
<span class="line"><span>只创建当前阶段真正需要的内容。</span></span>
<span class="line"><span>不要预建大量空文档。</span></span>
<span class="line"><span>不要为了使用 Agent、Skills 或 MCP 而强行增加配置。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第五步：执行环境检查</span></span>
<span class="line"><span>在获得必要授权后，执行初始化和环境检查。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>最终向我报告：</span></span>
<span class="line"><span>- 已完成的初始化内容。</span></span>
<span class="line"><span>- 项目目录结构。</span></span>
<span class="line"><span>- 技术栈。</span></span>
<span class="line"><span>- 开发和测试命令。</span></span>
<span class="line"><span>- 尚未解决的问题。</span></span>
<span class="line"><span>- 下一步建议。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>特别要求：</span></span>
<span class="line"><span>不要把尚未确认的技术选型写成既定事实。</span></span>
<span class="line"><span>不要在没有确认的情况下执行高风险操作。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br></div></div><h3 id="_3-2-老项目接管" tabindex="-1">3.2 老项目接管 <a class="header-anchor" href="#_3-2-老项目接管" aria-label="Permalink to “3.2 老项目接管”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>你现在需要接管一个已经存在的软件项目。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>本轮任务是：理解项目现状，建立后续开发所需的上下文。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>暂时不要修改业务代码，不要进行重构，不要安装新依赖。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请按以下顺序检查：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>一、项目基本情况</span></span>
<span class="line"><span>- 项目技术栈及版本。</span></span>
<span class="line"><span>- 前后端架构。</span></span>
<span class="line"><span>- 模块划分。</span></span>
<span class="line"><span>- 目录结构。</span></span>
<span class="line"><span>- 主要依赖。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>二、运行与开发方式</span></span>
<span class="line"><span>- 如何启动项目？</span></span>
<span class="line"><span>- 如何构建项目？</span></span>
<span class="line"><span>- 如何执行测试？</span></span>
<span class="line"><span>- 是否存在数据库及相关配置？</span></span>
<span class="line"><span>- 是否存在 Docker 或其他运行环境？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>三、业务结构</span></span>
<span class="line"><span>- 核心业务模块有哪些？</span></span>
<span class="line"><span>- 模块之间如何调用？</span></span>
<span class="line"><span>- 关键接口在哪里？</span></span>
<span class="line"><span>- 重要数据实体有哪些？</span></span>
<span class="line"><span>- 是否存在第三方系统集成？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>四、开发规范</span></span>
<span class="line"><span>- 是否存在 AGENTS.md、CLAUDE.md、.cursor/rules 等规则文件？</span></span>
<span class="line"><span>- 是否存在项目自己的代码规范？</span></span>
<span class="line"><span>- 是否有特殊的命名、目录或架构约束？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>五、风险与注意事项</span></span>
<span class="line"><span>- 哪些模块不应该随意修改？</span></span>
<span class="line"><span>- 哪些操作可能影响生产数据？</span></span>
<span class="line"><span>- 是否存在已知问题？</span></span>
<span class="line"><span>- 哪些信息无法从代码中确认？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>六、输出项目接入报告</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请使用以下格式：</span></span>
<span class="line"><span>1. 项目基本信息</span></span>
<span class="line"><span>2. 技术栈与版本</span></span>
<span class="line"><span>3. 目录与模块结构</span></span>
<span class="line"><span>4. 项目启动、构建和测试方式</span></span>
<span class="line"><span>5. 核心业务模块</span></span>
<span class="line"><span>6. 重要接口与数据实体</span></span>
<span class="line"><span>7. 开发规范</span></span>
<span class="line"><span>8. 外部依赖</span></span>
<span class="line"><span>9. 已知风险与注意事项</span></span>
<span class="line"><span>10. 尚未确认的信息</span></span>
<span class="line"><span></span></span>
<span class="line"><span>每项信息标记为：</span></span>
<span class="line"><span>- 已确认：有代码、配置或文档证据。</span></span>
<span class="line"><span>- 待确认：目前无法从现有资料确定。</span></span>
<span class="line"><span>- 人工补充：需要项目维护人员提供。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>执行约束：</span></span>
<span class="line"><span>1. 本轮只读分析，不修改任何文件。</span></span>
<span class="line"><span>2. 不扫描无关目录和大型依赖目录。</span></span>
<span class="line"><span>3. 优先检查项目入口、配置、README、模块结构和关键业务代码。</span></span>
<span class="line"><span>4. 不要把猜测当成事实。</span></span>
<span class="line"><span>5. 不要为了生成报告而重复读取大量相同内容。</span></span>
<span class="line"><span>6. 如果项目规模较大，先输出整体地图，再针对重要模块深入。</span></span>
<span class="line"><span>7. 不需要一次性理解整个项目的所有业务细节。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>最后告诉我：</span></span>
<span class="line"><span>- 当前是否已经具备开发条件？</span></span>
<span class="line"><span>- 如果开始一个新功能，还缺少哪些必要信息？</span></span>
<span class="line"><span>- 哪些内容建议写入项目规则文件？</span></span>
<span class="line"><span>- 哪些内容应该等具体开发任务出现时再分析？</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br></div></div><h3 id="_3-3-项目地图扫描" tabindex="-1">3.3 项目地图扫描 <a class="header-anchor" href="#_3-3-项目地图扫描" aria-label="Permalink to “3.3 项目地图扫描”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>你的任务只有一个：产出一份项目地图。不要修改任何文件，不要提改进建议。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>背景：我需要了解一个已有项目的整体结构，还没有开始任何开发。</span></span>
<span class="line"><span>目标：让我能回答「这个项目由哪几块组成、从哪里进入、怎么构建」。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>约束：</span></span>
<span class="line"><span>- 只读分析，不修改任何文件。</span></span>
<span class="line"><span>- 跳过以下目录，不要读取：node_modules、target、dist、build、.git、vendor、依赖目录、生成代码目录。</span></span>
<span class="line"><span>- 优先读取：依赖与构建文件、README、启动入口类、前端入口、配置文件、目录结构。</span></span>
<span class="line"><span>- 不要逐个文件通读，只看入口、配置和目录结构。</span></span>
<span class="line"><span>- 结论必须带证据路径；推断的内容单独放在「待确认」段。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请输出：</span></span>
<span class="line"><span>1. 项目类型与技术栈（后端框架、前端框架、数据库、缓存、消息队列）</span></span>
<span class="line"><span>2. 模块清单（模块名 → 职责一句话 → 入口文件路径）</span></span>
<span class="line"><span>3. 入口清单（启动类、前端入口、可执行脚本）</span></span>
<span class="line"><span>4. 目录结构概览（只列到有业务含义的那一层）</span></span>
<span class="line"><span>5. 构建、启动、测试命令（附来源文件）</span></span>
<span class="line"><span>6. 配置文件清单（路径 → 管什么）</span></span>
<span class="line"><span>7. 外部依赖（数据库、Redis、MQ、第三方接口）</span></span>
<span class="line"><span>8. 本轮未覆盖范围（一句话说明你跳过了什么）</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br></div></div><h3 id="_3-4-调用链追踪" tabindex="-1">3.4 调用链追踪 <a class="header-anchor" href="#_3-4-调用链追踪" aria-label="Permalink to “3.4 调用链追踪”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>你的任务只有一个：追踪一条完整调用链，输出链路和数据流。不要修改任何文件。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>入口：&lt;入口描述，如「POST /api/mes/work-orders/{id}/report」或「前端页面 X 的提交按钮」&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>约束：</span></span>
<span class="line"><span>- 从入口一直追到数据落点，中间不要停。</span></span>
<span class="line"><span>- 必须覆盖并说明：同步调用、异步任务（定时/线程池）、消息消费、配置开关、动态 SQL 拼装。</span></span>
<span class="line"><span>- 每一步给出「文件路径:行号」和「方法名」。</span></span>
<span class="line"><span>- 找出事务边界（@Transactional 的开始与结束位置）和异常处理位置。</span></span>
<span class="line"><span>- 指出这条链上所有会读写的表。</span></span>
<span class="line"><span>- 没有找到的环节明确标「未找到」，不要跳过不提。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请输出：</span></span>
<span class="line"><span>1. 调用链总览（一行一步的链路图）</span></span>
<span class="line"><span>2. 逐层明细（层 | 文件:行号 | 方法 | 职责 | 数据变化）</span></span>
<span class="line"><span>3. 涉及的数据表（表名 | 读/写 | 关键字段）</span></span>
<span class="line"><span>4. 事务边界与异常处理</span></span>
<span class="line"><span>5. 隐藏路径（异步/消息/定时/动态 SQL）</span></span>
<span class="line"><span>6. 这条链上最容易出问题的 3 个位置及原因</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><h3 id="_3-5-全局-rules-模板" tabindex="-1">3.5 全局 Rules 模板 <a class="header-anchor" href="#_3-5-全局-rules-模板" aria-label="Permalink to “3.5 全局 Rules 模板”">​</a></h3><div class="language-markdown line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;"># &lt;规则名&gt; · &lt;适用范围&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 适用范围</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 生效范围：全局 / 项目 / &lt;目录路径&gt;</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 不适用：&lt;明确写出例外&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 事实依据</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;来源：项目认知资料第 X 节 / 某次事故复盘 / 团队约定&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 必须遵守</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">| 编号 | 规则 | 验证方式 |</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">| ---- | ---- | -------- |</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">| C01 | | &lt;命令或 diff 特征&gt; |</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 明确禁止</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">| 编号 | 禁止项 | 反例（曾经或可能出错的写法） | 验证方式 |</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">| ---- | ------ | ---------------------------- | -------- |</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">| P01 | | | |</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 例外与审批</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 需要例外时，由 &lt;角色&gt; 确认，并记在 &lt;位置&gt;。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 变更记录</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">| 日期 | 版本 | 改了什么 | 触发原因 |</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">| ---- | ---- | -------- | -------- |</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><h2 id="四、验收标准" tabindex="-1">四、验收标准 <a class="header-anchor" href="#四、验收标准" aria-label="Permalink to “四、验收标准”">​</a></h2><h3 id="项目接入检查" tabindex="-1">项目接入检查 <a class="header-anchor" href="#项目接入检查" aria-label="Permalink to “项目接入检查”">​</a></h3><ul><li>[ ] 新项目目标与技术栈明确，开发命令已实际跑通；或老项目有一份可靠的接入报告。</li><li>[ ] 每条认知结论都有来源；推测都进了「待确认」，正文没有「应该是」「一般是」。</li><li>[ ] gotchas 由人写，不是 AI 代笔。</li><li>[ ] 构建命令、测试命令、最小冒烟验证在本机实际跑通过一次。</li><li>[ ] 禁改区与安全边界写明，并已同步进规则文件。</li><li>[ ] 明确写出「未覆盖范围」。</li><li>[ ] 老项目：确认没有任何架构级改动，git diff 只有文档。</li><li>[ ] 没有创建无意义的空文档或复杂配置。</li></ul><h3 id="上下文是否足够的五问" tabindex="-1">上下文是否足够的五问 <a class="header-anchor" href="#上下文是否足够的五问" aria-label="Permalink to “上下文是否足够的五问”">​</a></h3><ol><li>我知道要改哪几个文件吗？</li><li>我知道改完之后谁会受影响吗？</li><li>我知道涉及哪张表、哪个接口吗？</li><li>我知道现有实现为什么这么写吗？</li><li>我知道哪些地方不能碰吗？</li></ol><p><strong>有两条答不上来，回到对应层补，不要带着缺口开始改代码。</strong></p><h3 id="配置检查" tabindex="-1">配置检查 <a class="header-anchor" href="#配置检查" aria-label="Permalink to “配置检查”">​</a></h3><ul><li>[ ] 全局规则不超过 30 行，每条都有验证方式，禁止项都配了反例。</li><li>[ ] 规则里没有「本次」「这个需求」「先做……再做……」这类任务措辞。</li><li>[ ] 启用的角色有职责与权限边界，审查者明确不判定通过。</li><li>[ ] Skill 里没有具体表名、客户名、业务字段。</li><li>[ ] 能脚本化的检查已进入脚本，不靠提示词提醒。</li></ul><h3 id="准备阶段最容易犯的错" tabindex="-1">准备阶段最容易犯的错 <a class="header-anchor" href="#准备阶段最容易犯的错" aria-label="Permalink to “准备阶段最容易犯的错”">​</a></h3><ul><li><strong>让 AI 一次性扫描整个仓库</strong>：上下文被无关代码占满，关键信息反而被稀释。</li><li><strong>初始化阶段创建大量文档</strong>：生成没人维护的空文件。</li><li><strong>接手老项目时顺手重构</strong>：加一个功能却引入大量无关变更。</li><li><strong>把「看懂了」当成「验证过了」</strong>：靠命名和注释推测业务规则。</li></ul><p><strong>完成准备后进入 <a href="/my-vitepress-site/ai/productivity/coding-sop/02-task-execution.html">第 02 页 · 任务执行</a>。</strong></p>`,63)])])}const m=n(e,[["render",i]]);export{u as __pageData,m as default};
