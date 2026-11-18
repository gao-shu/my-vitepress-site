import{_ as n,o as a,c as p,ai as e}from"./chunks/framework.Ba-VnP44.js";const u=JSON.parse('{"title":"开发前","description":"","frontmatter":{},"headers":[],"relativePath":"ai/productivity/dev-spec/01-foundation.md","filePath":"ai/productivity/dev-spec/01-foundation.md"}'),l={name:"ai/productivity/dev-spec/01-foundation.md"};function i(r,s,t,c,b,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="开发前" tabindex="-1">开发前 <a class="header-anchor" href="#开发前" aria-label="Permalink to “开发前”">​</a></h1><blockquote><p>让 AI 具备正确工作所需的能力：读懂项目、遵守规则、复用技能、分工协作、连接工具、自动检查。每个模块给可直接复制的命令，介绍只讲用途。</p></blockquote><h2 id="快速定位" tabindex="-1">快速定位 <a class="header-anchor" href="#快速定位" aria-label="Permalink to “快速定位”">​</a></h2><table tabindex="0"><thead><tr><th>模块</th><th>什么时候用</th></tr></thead><tbody><tr><td>Project Context</td><td>让 AI 快速了解项目、模块、调用链</td></tr><tr><td>Rules</td><td>生成或检查 AI 必须遵守的项目规则</td></tr><tr><td>Skills</td><td>把重复做法固化成可复用技能</td></tr><tr><td>Agents</td><td>多 Agent 分工、配置与结果审查</td></tr><tr><td>MCP / Tools</td><td>评估、接入、检查外部工具能力</td></tr><tr><td>Hooks / Scripts</td><td>把确定性检查交给自动化脚本</td></tr></tbody></table><hr><h2 id="project-context-·-项目上下文" tabindex="-1">Project Context · 项目上下文 <a class="header-anchor" href="#project-context-·-项目上下文" aria-label="Permalink to “Project Context · 项目上下文”">​</a></h2><p><strong>功能介绍</strong>：让 AI 按需拿到准确的项目信息，不靠猜、不做无意义的全仓扫描。</p><p><strong>使用场景</strong></p><ul><li>接手陌生项目</li><li>AI 频繁理解错模块或业务</li><li>准备改涉及多个模块的功能</li></ul><h3 id="命令-·-项目快速认知" tabindex="-1">命令 · 项目快速认知 <a class="header-anchor" href="#命令-·-项目快速认知" aria-label="Permalink to “命令 · 项目快速认知”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请分析当前项目，先不要修改任何文件。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>重点检查：</span></span>
<span class="line"><span>1. 项目技术栈和目录结构</span></span>
<span class="line"><span>2. 核心模块及其职责</span></span>
<span class="line"><span>3. 项目启动、构建和测试命令</span></span>
<span class="line"><span>4. 关键配置文件和外部依赖</span></span>
<span class="line"><span>5. 核心业务入口和主要调用关系</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出一份简明项目说明，所有结论尽可能提供文件路径作为依据，无法确认的内容单独列出。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="命令-·-模块分析" tabindex="-1">命令 · 模块分析 <a class="header-anchor" href="#命令-·-模块分析" aria-label="Permalink to “命令 · 模块分析”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请只读分析 &lt;模块名或目录&gt;，不要修改任何文件。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：</span></span>
<span class="line"><span>1. 这个模块的职责和边界</span></span>
<span class="line"><span>2. 对外暴露的接口 / 入口</span></span>
<span class="line"><span>3. 内部关键文件及各自作用</span></span>
<span class="line"><span>4. 依赖哪些模块、被哪些模块调用</span></span>
<span class="line"><span>5. 涉及的数据表或外部服务</span></span>
<span class="line"><span></span></span>
<span class="line"><span>结论带文件路径，推测标「待确认」。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="命令-·-业务调用链分析" tabindex="-1">命令 · 业务调用链分析 <a class="header-anchor" href="#命令-·-业务调用链分析" aria-label="Permalink to “命令 · 业务调用链分析”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请只读追踪一条完整调用链，不要修改任何文件。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>入口：&lt;接口路径或页面操作，如 POST /api/order/create&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>要求：从入口追到数据落点，覆盖同步调用、异步任务、消息消费、配置开关；每步给出「文件路径:行号」；标出事务边界、异常处理和读写的表；找不到的环节明确写「未找到」。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：链路清单 / 涉及的表 / 事务与异常 / 最易出错的位置。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p><strong>预期结果</strong>：一份带文件路径依据的项目说明、模块说明或调用链，能直接用来定位「改哪里、影响谁」。</p><hr><h2 id="rules-·-项目规则" tabindex="-1">Rules · 项目规则 <a class="header-anchor" href="#rules-·-项目规则" aria-label="Permalink to “Rules · 项目规则”">​</a></h2><p><strong>功能介绍</strong>：把跨任务成立的约束写成 AI 每次都会读到的规则，不用每次对话重复交代。</p><p><strong>使用场景</strong></p><ul><li>新项目要建立开发约定</li><li>AI 命名、分层、命令各做各的</li><li>口头禁令换个会话就失效</li></ul><h3 id="命令-·-检查现有规则" tabindex="-1">命令 · 检查现有规则 <a class="header-anchor" href="#命令-·-检查现有规则" aria-label="Permalink to “命令 · 检查现有规则”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请只读检查当前项目已有的 AI 规则文件（如 AGENTS.md、.cursor/rules 等），不要修改任何文件。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：</span></span>
<span class="line"><span>1. 找到了哪些规则文件、各自生效范围</span></span>
<span class="line"><span>2. 每条规则是否可验证（能否说清怎么算违反）</span></span>
<span class="line"><span>3. 是否混入了一次性任务、完整业务流程、操作步骤</span></span>
<span class="line"><span>4. 是否有「尽量 / 建议」这类无法验证的软规则</span></span>
<span class="line"><span>5. 缺失的关键约束（技术栈、命令、禁改目录、安全红线）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>只列问题和依据，不要替我改写规则。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="命令-·-生成项目规则" tabindex="-1">命令 · 生成项目规则 <a class="header-anchor" href="#命令-·-生成项目规则" aria-label="Permalink to “命令 · 生成项目规则”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请根据当前项目现状和下面的约定，生成一份 AI 规则文件草稿。本轮只输出草稿，不写文件。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>项目约定：&lt;粘贴口头约定、命令、禁令&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>要求：</span></span>
<span class="line"><span>1. 只保留跨任务成立、能验证的约束</span></span>
<span class="line"><span>2. 每条用「必须 / 禁止」并配验证方式（命令或 diff 特征）</span></span>
<span class="line"><span>3. 禁止项配一条反例</span></span>
<span class="line"><span>4. 删掉无法验证的软规则</span></span>
<span class="line"><span>5. 写明适用范围和例外审批方式</span></span>
<span class="line"><span>6. 具体文件放哪、怎么加载，按我使用的工具说明，不要假设通用目录</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：规则草稿 + 被删内容及原因。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h3 id="命令-·-检查规则是否生效" tabindex="-1">命令 · 检查规则是否生效 <a class="header-anchor" href="#命令-·-检查规则是否生效" aria-label="Permalink to “命令 · 检查规则是否生效”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请验证当前 AI 规则是否真的对新会话生效，只做检查，不修改文件或配置。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>检查：</span></span>
<span class="line"><span>1. 规则文件是否放在工具会读取的位置（按我使用的工具为准）</span></span>
<span class="line"><span>2. 规则内容是否自相矛盾或重复</span></span>
<span class="line"><span>3. 能否给出 2～3 个具体场景，说明每条关键规则会怎样约束 AI 的行为</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：生效情况 + 存疑点 + 需要我确认的工具差异。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p><strong>预期结果</strong>：知道项目有没有规则、规则写得好不好、要不要补,以及该放哪个工具目录。</p><blockquote><p>不同 AI 工具的规则文件名、目录、加载方式不同。上面的命令不假定固定路径，需要时把「我使用的工具是 Cursor / WorkBuddy」补进命令。</p></blockquote><hr><h2 id="skills-·-专业技能" tabindex="-1">Skills · 专业技能 <a class="header-anchor" href="#skills-·-专业技能" aria-label="Permalink to “Skills · 专业技能”">​</a></h2><p><strong>功能介绍</strong>：把反复用、验证有效的做法固化成技能，让 AI 按固定步骤做，而不是每次重新发明。</p><p><strong>使用场景</strong></p><ul><li>同类操作做过很多次</li><li>好做法只活在某次对话里</li><li>要把个人经验沉淀成可复用能力</li></ul><h3 id="命令-·-识别可沉淀技能" tabindex="-1">命令 · 识别可沉淀技能 <a class="header-anchor" href="#命令-·-识别可沉淀技能" aria-label="Permalink to “命令 · 识别可沉淀技能”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请回顾本次任务，判断有没有值得沉淀为 Skill 的做法。本轮只判断，不创建文件。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>先回答三问：</span></span>
<span class="line"><span>1. 这个做法还会再出现吗？</span></span>
<span class="line"><span>2. 不沉淀的代价是什么？</span></span>
<span class="line"><span>3. 有没有第二处任务能验证它？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>任一答不上来，就写「暂不沉淀」，并说明留在哪里（交付报告 / 认知资料）。</span></span>
<span class="line"><span>三条都成立，才列出可沉淀的做法和它稳定的步骤、检查点。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h3 id="命令-·-创建-skill" tabindex="-1">命令 · 创建 Skill <a class="header-anchor" href="#命令-·-创建-skill" aria-label="Permalink to “命令 · 创建 Skill”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请把下面这套做法整理成一个 Skill 草稿。本轮只输出草稿，不写文件。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>做法记录：&lt;粘贴步骤、检查点、踩过的坑&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>要求：</span></span>
<span class="line"><span>1. 只写「怎么做」的通用方法，不要写具体表名、客户名、业务字段</span></span>
<span class="line"><span>2. 包含：适用场景、不适用、前置条件、带检查点的操作步骤、失败处理、复用记录表</span></span>
<span class="line"><span>3. 步骤要稳定可复现，不是靠临场发挥</span></span>
<span class="line"><span>4. 标注这个 Skill 放在哪里、怎么被工具加载（按我使用的工具说明）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：Skill 草稿。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><h3 id="命令-·-检查-skill-质量" tabindex="-1">命令 · 检查 Skill 质量 <a class="header-anchor" href="#命令-·-检查-skill-质量" aria-label="Permalink to “命令 · 检查 Skill 质量”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请检查下面这个 Skill 是否适合跨项目复用，只输出问题清单，不改内容。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;粘贴 Skill 内容&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>检查：</span></span>
<span class="line"><span>1. 是否混入具体表名、客户名、业务字段</span></span>
<span class="line"><span>2. 是否混入一次性临时绕法、未验证的做法</span></span>
<span class="line"><span>3. 步骤有没有明确检查点</span></span>
<span class="line"><span>4. 是否有复用记录和至少两处验证</span></span>
<span class="line"><span></span></span>
<span class="line"><span>每条给原文片段、问题、建议。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p><strong>预期结果</strong>：判断出值不值得沉淀、拿到一份干净的 Skill 草稿，或明确「暂不沉淀」。</p><hr><h2 id="agents-·-智能体协作" tabindex="-1">Agents · 智能体协作 <a class="header-anchor" href="#agents-·-智能体协作" aria-label="Permalink to “Agents · 智能体协作”">​</a></h2><p><strong>功能介绍</strong>：明确多个 AI 角色各做什么、能改哪些文件，避免互相覆盖、自己宣布完成。</p><p><strong>使用场景</strong></p><ul><li>前后端或模块能并行、互不冲突</li><li>想让一个 Agent 执行、另一个审查</li><li>多人多 Agent 同时改一个项目</li></ul><h3 id="命令-·-任务分工" tabindex="-1">命令 · 任务分工 <a class="header-anchor" href="#命令-·-任务分工" aria-label="Permalink to “命令 · 任务分工”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>这个任务需要多 Agent 并行。请先给出分工方案，不要开始改代码。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>任务：&lt;一句话&gt;</span></span>
<span class="line"><span>冻结的契约：&lt;接口 / 数据结构 / 字段名；若尚无，写「需先冻结」&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>要求：</span></span>
<span class="line"><span>1. 按文件所有权划分，同一文件不被同时改，列出每个 Agent 负责的文件和只读文件</span></span>
<span class="line"><span>2. 契约没冻结就只做契约设计，不进入并行实现</span></span>
<span class="line"><span>3. 每个 Agent 都收到同一份任务、修改范围、不做项和验收标准</span></span>
<span class="line"><span>4. 分工含执行者和审查者，审查者只输出问题清单、不判定通过</span></span>
<span class="line"><span>5. 说明结果如何收拢、由谁做最终验收</span></span>
<span class="line"><span></span></span>
<span class="line"><span>先输出分工表和风险点，等我确认再启动。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h3 id="命令-·-生成-agent-配置" tabindex="-1">命令 · 生成 Agent 配置 <a class="header-anchor" href="#命令-·-生成-agent-配置" aria-label="Permalink to “命令 · 生成 Agent 配置”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请根据下面的角色职责，生成一份 Agent 配置草稿。本轮只输出草稿，不写文件。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>角色：&lt;名称&gt;　职责：&lt;规划 / 执行 / 审查&gt;　权限：&lt;能改哪些文件&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>要求：</span></span>
<span class="line"><span>1. 写清职责、可改文件、只读文件、明确不做的事</span></span>
<span class="line"><span>2. 写清共同上下文：任务、修改范围、禁止修改、必须兼容、验收标准</span></span>
<span class="line"><span>3. 审查类角色必须写明「不判定通过，最终由人确认」</span></span>
<span class="line"><span>4. 配置语法、文件名和放置位置按我使用的工具说明，不要假设通用格式</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：Agent 配置草稿 + 需要我确认的工具差异。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><h3 id="命令-·-协作结果审查" tabindex="-1">命令 · 协作结果审查 <a class="header-anchor" href="#命令-·-协作结果审查" aria-label="Permalink to “命令 · 协作结果审查”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请审查下面这些 Agent 的产出和 diff，只输出问题清单，不修改文件，不宣布通过。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;粘贴各 Agent 的产出与 diff&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>检查：</span></span>
<span class="line"><span>1. 各自改动是否超出文件所有权、是否互相覆盖</span></span>
<span class="line"><span>2. 接口 / 数据结构是否按冻结的契约实现</span></span>
<span class="line"><span>3. 是否有 One Agent 改了另一个 Agent 负责的文件</span></span>
<span class="line"><span>4. 功能、边界、异常、兼容性问题</span></span>
<span class="line"><span>5. 是否留下调试代码、遗漏 TODO</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：越界项 / 冲突项 / 质量问题 / 需人确认的疑点。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p><strong>预期结果</strong>：一份边界清晰的分工方案、Agent 配置草稿，以及可核对的多 Agent 产出问题清单。</p><hr><h2 id="mcp-tools-·-工具与外部能力" tabindex="-1">MCP / Tools · 工具与外部能力 <a class="header-anchor" href="#mcp-tools-·-工具与外部能力" aria-label="Permalink to “MCP / Tools · 工具与外部能力”">​</a></h2><p><strong>功能介绍</strong>：让 AI 安全地连接仓库外的能力和数据，接入前先判断值不值得、权限会不会过大。</p><p><strong>使用场景</strong></p><ul><li>想接数据库、浏览器、外部 API 等能力</li><li>不确定某个工具该不该接</li><li>要检查现有工具权限是否过大</li></ul><h3 id="命令-·-工具需求评估" tabindex="-1">命令 · 工具需求评估 <a class="header-anchor" href="#命令-·-工具需求评估" aria-label="Permalink to “命令 · 工具需求评估”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请评估是否值得接入下面这个工具，本轮只评估，不做配置。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>工具：&lt;名称&gt;　想解决的场景：&lt;描述&gt;　当前卡点：&lt;描述&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>按三问评估：</span></span>
<span class="line"><span>1. 必要性：这个能力是不是仓库内拿不到、又确实必须？有没有更简单的替代？</span></span>
<span class="line"><span>2. 边界：开放什么权限？只读还是可写？能碰生产环境或敏感数据吗？</span></span>
<span class="line"><span>3. 降级：它不可用时怎么办？有没有替代检查或手动方案？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：三问结论 + 权限最小化建议 + 哪些动作必须人确认 + 结论（建议 / 暂缓 / 不建议）。答不上的标「待确认」，不要替我假设。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="命令-·-接入配置检查" tabindex="-1">命令 · 接入配置检查 <a class="header-anchor" href="#命令-·-接入配置检查" aria-label="Permalink to “命令 · 接入配置检查”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请只读检查当前已接入的 AI 工具 / MCP 配置，不要修改任何文件。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>对每个工具列出：</span></span>
<span class="line"><span>1. 开放了什么能力</span></span>
<span class="line"><span>2. 权限级别（只读 / 可写）和访问范围</span></span>
<span class="line"><span>3. 是否触及生产或敏感数据</span></span>
<span class="line"><span>4. 不可用时有没有降级方案</span></span>
<span class="line"><span>5. 是否记录了谁配置、怎么降级</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：能力清单 + 风险项（权限过大 / 触生产 / 无降级）。配置语法按我使用的工具核对。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="命令-·-权限检查" tabindex="-1">命令 · 权限检查 <a class="header-anchor" href="#命令-·-权限检查" aria-label="Permalink to “命令 · 权限检查”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请检查下面这个工具的权限设置是否符合最小化原则，只输出检查结论，不修改配置。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>工具：&lt;名称&gt;　当前权限：&lt;描述&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>检查：</span></span>
<span class="line"><span>1. 能否只读就不给写权限</span></span>
<span class="line"><span>2. 能否连测试库就不连生产库</span></span>
<span class="line"><span>3. 能否限定目录就不开放全盘</span></span>
<span class="line"><span>4. 删除、写入、发送等动作是否设为需要人确认</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：不合规项 + 建议的最小权限配置。涉及生产凭据时，只描述配置方式，不要打印任何真实密钥。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p><strong>预期结果</strong>：明确该不该接、接了哪些、权限是否最小、哪些动作需要人工确认。</p><hr><h2 id="hooks-scripts-·-自动化执行" tabindex="-1">Hooks / Scripts · 自动化执行 <a class="header-anchor" href="#hooks-scripts-·-自动化执行" aria-label="Permalink to “Hooks / Scripts · 自动化执行”">​</a></h2><p><strong>功能介绍</strong>：把「漏了就出事、且能明确判定」的检查交给脚本和 Hook，不靠 AI 记得或人工盯。</p><p><strong>使用场景</strong></p><ul><li>同样检查每次都要手动跑</li><li>密钥、禁改区这类红线没人自动拦</li><li>Hook 装太多、误报不断</li></ul><h3 id="命令-·-自动化检查设计" tabindex="-1">命令 · 自动化检查设计 <a class="header-anchor" href="#命令-·-自动化检查设计" aria-label="Permalink to “命令 · 自动化检查设计”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>下面这些检查每次都要手动做，请设计成自动化方案。本轮只出方案，不写代码、不改配置。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>检查清单：&lt;粘贴&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>对每项判断：</span></span>
<span class="line"><span>1. 是否「漏了就出事且能明确判定」——是则适合脚本化，否则说明留人工</span></span>
<span class="line"><span>2. 脚本的输入输出、失败时的报错（要说清怎么改）</span></span>
<span class="line"><span>3. 触发时机：显式运行还是提交前 Hook</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：可脚本化清单 + 每项方案 + 建议挂到 Hook 的最小集合（只挑最关键最稳的，避免误报）。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="命令-·-生成检查脚本" tabindex="-1">命令 · 生成检查脚本 <a class="header-anchor" href="#命令-·-生成检查脚本" aria-label="Permalink to “命令 · 生成检查脚本”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请为下面这项检查生成一个可独立运行的脚本，并说明用法。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>检查项：&lt;描述&gt;　项目技术栈：&lt;描述&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>要求：</span></span>
<span class="line"><span>1. 检查结果非黑即白，不依赖业务判断</span></span>
<span class="line"><span>2. 失败时报错说清「哪里不对、怎么改」</span></span>
<span class="line"><span>3. 不删除、不修改任何文件，除非我明确要求</span></span>
<span class="line"><span>4. 给出运行命令和退出码含义</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：脚本内容 + 用法说明。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><h3 id="命令-·-hook-配置检查" tabindex="-1">命令 · Hook 配置检查 <a class="header-anchor" href="#命令-·-hook-配置检查" aria-label="Permalink to “命令 · Hook 配置检查”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请只读检查当前 Hook / 自动化检查配置是否过载，不要修改配置。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;粘贴现有 Hook 清单，或让 AI 读取后列出&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>检查：</span></span>
<span class="line"><span>1. 哪些检查误报多、很少拦住真问题</span></span>
<span class="line"><span>2. 哪些太慢、拖慢日常操作</span></span>
<span class="line"><span>3. 哪些需要业务判断、不该自动化</span></span>
<span class="line"><span>4. 有没有「漏了就出事且能判定」但没覆盖的检查</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：建议移除 / 改为显式 / 新增的清单及理由。配置语法按我使用的工具核对。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p><strong>预期结果</strong>：一份该自动化的最小清单、可运行的检查脚本，以及一份不误报的 Hook 配置建议。</p><hr><p>开发前先把底子打好：项目上下文、规则、技能、分工、工具、自动化检查。准备好之后进入 → <a href="/my-vitepress-site/ai/productivity/dev-spec/02-lifecycle.html">开发中</a>。</p>`,79)])])}const o=n(l,[["render",i]]);export{u as __pageData,o as default};
