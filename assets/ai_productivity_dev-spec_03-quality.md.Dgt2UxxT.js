import{_ as n,o as a,c as p,ai as e}from"./chunks/framework.Ba-VnP44.js";const u=JSON.parse('{"title":"开发后","description":"","frontmatter":{},"headers":[],"relativePath":"ai/productivity/dev-spec/03-quality.md","filePath":"ai/productivity/dev-spec/03-quality.md"}'),l={name:"ai/productivity/dev-spec/03-quality.md"};function i(r,s,t,c,b,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="开发后" tabindex="-1">开发后 <a class="header-anchor" href="#开发后" aria-label="Permalink to “开发后”">​</a></h1><blockquote><p>确保 AI 做的事正确、可验证、可回滚。这些检查从项目准备到交付全程生效，不是收工才做。每项给独立的检查命令，不重复「开发中」的完整开发提示词。</p></blockquote><h2 id="快速定位" tabindex="-1">快速定位 <a class="header-anchor" href="#快速定位" aria-label="Permalink to “快速定位”">​</a></h2><table tabindex="0"><thead><tr><th>模块</th><th>什么时候用</th></tr></thead><tbody><tr><td>代码质量</td><td>检查代码本身是否符合规范、有没有隐患</td></tr><tr><td>测试与验证</td><td>验证测试结果真不真、回归全不全</td></tr><tr><td>数据与安全</td><td>查敏感信息、危险操作、越权风险</td></tr><tr><td>Git 与版本管理</td><td>提交前查状态、查 diff、保护已有改动</td></tr><tr><td>变更控制</td><td>查改动范围、兼容性</td></tr><tr><td>交付追踪与回滚</td><td>生成交付报告、回滚方案</td></tr></tbody></table><hr><h2 id="代码质量" tabindex="-1">代码质量 <a class="header-anchor" href="#代码质量" aria-label="Permalink to “代码质量”">​</a></h2><p><strong>功能介绍</strong>：独立的视角检查代码本身——逻辑、边界、异常、可读性，不重复功能开发时的自检。</p><p><strong>使用场景</strong></p><ul><li>功能写完，想再过一遍代码质量</li><li>准备提交或合并前</li><li>担心有硬编码、吞异常这类隐患</li></ul><h3 id="命令-·-代码规范与质量检查" tabindex="-1">命令 · 代码规范与质量检查 <a class="header-anchor" href="#命令-·-代码规范与质量检查" aria-label="Permalink to “命令 · 代码规范与质量检查”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请对下面的代码 / diff 做质量检查。本轮只输出问题清单，不修改文件、不宣布通过。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;粘贴代码或 diff&gt;　适用规范：&lt;粘贴项目规范，或让 AI 读取&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>检查：</span></span>
<span class="line"><span>1. 逻辑与边界：空值、零值、重复、越权、状态不允许</span></span>
<span class="line"><span>2. 异常与事务：异常是否被吞、事务边界是否合理、失败会不会留半状态数据</span></span>
<span class="line"><span>3. 兼容性：接口签名、字段含义、返回结构是否变化，调用方是否受影响</span></span>
<span class="line"><span>4. 测试：关键路径和失败路径是否覆盖，断言是否被放宽或删除</span></span>
<span class="line"><span>5. 改动范围：无关格式化、未用 import、调试打印、注释掉的分支、遗留 TODO</span></span>
<span class="line"><span>6. 可读性：命名分层是否符合现有风格，有无明显重复</span></span>
<span class="line"><span></span></span>
<span class="line"><span>每条给「文件:行号 | 问题 | 依据 | 建议」。</span></span>
<span class="line"><span>单独列出硬红线命中项：硬编码绕过、吞异常、放宽断言 / 删用例、数据特判、越界改动。</span></span>
<span class="line"><span>没问题也逐项写「已检查，无问题」，不要只给一句结论。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p><strong>预期结果</strong>：一份带行号和依据的质量问题清单，硬红线命中项单独列出。</p><hr><h2 id="测试与验证" tabindex="-1">测试与验证 <a class="header-anchor" href="#测试与验证" aria-label="Permalink to “测试与验证”">​</a></h2><p><strong>功能介绍</strong>：核对测试结果到底可不可信、回归到不到位，不重复「开发中」的「执行测试」命令。</p><p><strong>使用场景</strong></p><ul><li>AI 报告「测试都过了」，要核实</li><li>交付前确认没跑的没被写成通过</li><li>改动涉及老功能，要查回归</li></ul><h3 id="命令-·-测试结果真实性检查" tabindex="-1">命令 · 测试结果真实性检查 <a class="header-anchor" href="#命令-·-测试结果真实性检查" aria-label="Permalink to “命令 · 测试结果真实性检查”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请检查下面这份测试结果有没有把未验证的内容写成通过。本轮只检查，不改代码。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;粘贴测试命令与输出 / 完成报告&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>检查：</span></span>
<span class="line"><span>1. 每条「通过」是否附了实际执行的命令和输出证据</span></span>
<span class="line"><span>2. 有没有把「未跑 / 受限 / 不适用」写成通过</span></span>
<span class="line"><span>3. 断言是否被放宽、用例是否被删、测试数据是否被改得失真</span></span>
<span class="line"><span>4. 有没有编造的测试输出</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：可信结论 + 可疑条目（原文 + 为什么可疑 + 需补什么证据）。没有输出的「已测试」按未验证处理。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><h3 id="命令-·-回归检查" tabindex="-1">命令 · 回归检查 <a class="header-anchor" href="#命令-·-回归检查" aria-label="Permalink to “命令 · 回归检查”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请对本次改动做回归验证，只验证和报告，不改代码。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>改动：&lt;描述&gt;　相关功能 / 上下游：&lt;描述&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：</span></span>
<span class="line"><span>1. 必查项：同模块（共用方法 / DTO / 同张表）、上下游（调用方 / 消息消费方）、全局（权限 / 租户 / 状态机 / 事务）</span></span>
<span class="line"><span>2. 回归对照表：场景 | 改前行为 | 改后行为 | 验证方式 | 结论</span></span>
<span class="line"><span>3. 至少一条「改前行为保持」的证据，证明没改坏别的</span></span>
<span class="line"><span></span></span>
<span class="line"><span>无法验证的写清原因和替代检查，不要说成通过。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p><strong>预期结果</strong>：测试结果经过真实性核对，回归对照能证明「修对了、且没改坏别的」。</p><hr><h2 id="数据与安全" tabindex="-1">数据与安全 <a class="header-anchor" href="#数据与安全" aria-label="Permalink to “数据与安全”">​</a></h2><p><strong>功能介绍</strong>：查敏感信息、危险操作、越权和输入风险，命中红线先停下来确认。</p><p><strong>使用场景</strong></p><ul><li>交付前做一次安全过查</li><li>涉及数据库、权限、外部输入的功能</li><li>担心密钥、隐私写进代码或日志</li></ul><h3 id="命令-·-敏感信息与危险操作检查" tabindex="-1">命令 · 敏感信息与危险操作检查 <a class="header-anchor" href="#命令-·-敏感信息与危险操作检查" aria-label="Permalink to “命令 · 敏感信息与危险操作检查”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请对本次改动做安全检查，只输出检查结果，不修改文件。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>改动：&lt;粘贴 diff&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>四块检查：</span></span>
<span class="line"><span>1. 敏感信息：密钥 / 令牌 / 密码 / 隐私数据是否写进代码、配置、日志、提交信息；凭证文件是否被跟踪；日志是否打印完整请求体或认证头</span></span>
<span class="line"><span>2. 破坏性操作：删数据 / 清库 / 改生产配置 / 不可逆迁移；是否写死生产地址或高权限账号</span></span>
<span class="line"><span>3. 输入与权限：外部入参是否校验；越权和数据范围是否拦截；路径 / SQL / 命令拼接是否安全；是否考虑幂等</span></span>
<span class="line"><span>4. 依赖：是否新增来源不明的依赖或脚本，版本是否锁定</span></span>
<span class="line"><span></span></span>
<span class="line"><span>每项给「已检查 / 未检查 / 不适用」+ 依据。命中红线的单独列出并标「需我确认」。涉及真实凭据时只描述配置方式，不要打印密钥原文。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p><strong>预期结果</strong>：四项安全结论明确，命中红线的项被单独标出等待确认，没有敏感信息泄露。</p><hr><h2 id="git-与版本管理" tabindex="-1">Git 与版本管理 <a class="header-anchor" href="#git-与版本管理" aria-label="Permalink to “Git 与版本管理”">​</a></h2><p><strong>功能介绍</strong>：提交前查清工作区状态，保护用户已有改动，不让 AI 覆盖或擅自提交推送。</p><p><strong>使用场景</strong></p><ul><li>每次提交前</li><li>工作区里有别人的或自己的其他改动</li><li>AI 说「我帮你提交了」</li></ul><h3 id="命令-·-git-status-检查" tabindex="-1">命令 · Git Status 检查 <a class="header-anchor" href="#命令-·-git-status-检查" aria-label="Permalink to “命令 · Git Status 检查”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请只读检查当前 git 工作区状态，不要执行任何 git 写操作（不 add / commit / checkout / reset / stash / push）。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>先读：git status、git diff、git diff --cached、最近几条 git log。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：</span></span>
<span class="line"><span>1. 已修改、未跟踪、已暂存的文件分别有哪些</span></span>
<span class="line"><span>2. 哪些像本次任务的改动，哪些像用户已有改动</span></span>
<span class="line"><span>3. 有没有需要我确认才能继续的冲突（同一文件既有我的改动又有别的改动）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>不要替我合并，不要猜测改动归属，判断不了就标「需我确认」。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="命令-·-提交前-diff-检查" tabindex="-1">命令 · 提交前 Diff 检查 <a class="header-anchor" href="#命令-·-提交前-diff-检查" aria-label="Permalink to “命令 · 提交前 Diff 检查”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请对当前 diff 做提交前检查，只输出问题清单，不改文件、不提交。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>检查：</span></span>
<span class="line"><span>1. 改动文件是否都在允许范围，有没有批量格式化无关文件</span></span>
<span class="line"><span>2. 依赖文件（package.json / pom.xml 等）有没有意外变更</span></span>
<span class="line"><span>3. 有没有硬编码、吞异常、放宽断言、删除现有测试</span></span>
<span class="line"><span>4. 有没有调试打印、注释掉的分支、遗留 TODO</span></span>
<span class="line"><span>5. 提交信息是否说清「改了什么、为什么」，不是 update / fix 这类空话</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：可安全提交的文件清单 + 问题项 + 建议的提交拆分。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="命令-·-提交信息生成" tabindex="-1">命令 · 提交信息生成 <a class="header-anchor" href="#命令-·-提交信息生成" aria-label="Permalink to “命令 · 提交信息生成”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请根据本次改动生成提交信息，只输出候选，不执行提交。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>改动：&lt;粘贴 git diff --stat 和关键 diff&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>要求：</span></span>
<span class="line"><span>1. 一句话说清改了什么，第二行说为什么</span></span>
<span class="line"><span>2. 一次提交混了多件不相关的事，就指出该拆成几次并给出各自信息</span></span>
<span class="line"><span>3. 不用 update / fix bugs / misc 这类空话</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：候选提交信息。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>注意：是否提交、是否推送由我决定，不要把生成提交信息当成授权提交。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p><strong>预期结果</strong>：清楚知道工作区哪些能提交、哪些是用户改动要保留，拿到规范的提交信息，且在明确授权前不会发生写入或推送。</p><hr><h2 id="变更控制" tabindex="-1">变更控制 <a class="header-anchor" href="#变更控制" aria-label="Permalink to “变更控制”">​</a></h2><p><strong>功能介绍</strong>：检查改动有没有越界、有没有破坏兼容性——这两件事最容易在「顺手改」时发生。</p><p><strong>使用场景</strong></p><ul><li>AI 改动涉及范围较大</li><li>动了接口、字段、数据结构</li><li>怀疑 AI 扩大了需求</li></ul><h3 id="命令-·-修改范围检查" tabindex="-1">命令 · 修改范围检查 <a class="header-anchor" href="#命令-·-修改范围检查" aria-label="Permalink to “命令 · 修改范围检查”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请检查本次改动是否超出约定范围，只输出结果，不改文件。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>修改范围三栏：&lt;允许修改 / 禁止修改 / 必须保持兼容&gt;</span></span>
<span class="line"><span>当前 status 和 diff：&lt;粘贴或让 AI 读取&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>检查：</span></span>
<span class="line"><span>1. 实际改动文件是否都在「允许修改」内</span></span>
<span class="line"><span>2. 是否触碰「禁止修改」</span></span>
<span class="line"><span>3. 有没有三栏之外的意外改动（依赖文件、公共模块、无关格式化）</span></span>
<span class="line"><span>4. 「必须保持兼容」的接口 / 字段 / 状态流转是否真的没变</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：合规清单 + 越界项（文件:行号 + 说明）+ 需我确认的疑点。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h3 id="命令-·-兼容性检查" tabindex="-1">命令 · 兼容性检查 <a class="header-anchor" href="#命令-·-兼容性检查" aria-label="Permalink to “命令 · 兼容性检查”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请检查本次改动对现有调用方和数据的影响，只输出检查结论，不改代码。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>改动：&lt;描述或 diff&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>逐项核对：</span></span>
<span class="line"><span>1. 已有接口：路径、方法、入参、返回结构、错误码有没有变</span></span>
<span class="line"><span>2. 已有字段：是否删除、改名、改类型、改含义</span></span>
<span class="line"><span>3. 数据库：字段类型、非空约束、迁移能否重复执行</span></span>
<span class="line"><span>4. 缓存：数据变更后缓存键是否失效</span></span>
<span class="line"><span>5. 上下游：影响清单里的调用方是否都核对过</span></span>
<span class="line"><span></span></span>
<span class="line"><span>每项结论写「没变 / 变了但已确认兼容 / 变了需通知下游」，不要写「应该没问题」。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p><strong>预期结果</strong>：改动范围是否越界一目了然，兼容性结论明确到「没变 / 已兼容 / 需通知下游」。</p><hr><h2 id="交付追踪与回滚" tabindex="-1">交付追踪与回滚 <a class="header-anchor" href="#交付追踪与回滚" aria-label="Permalink to “交付追踪与回滚”">​</a></h2><p><strong>功能介绍</strong>：生成可追溯的交付报告，为复杂改动准备回滚方案——出问题能定位、能退回。</p><p><strong>使用场景</strong></p><ul><li>准备交付、合并、部署</li><li>改动涉及数据结构、接口、多文件</li><li>出了线上问题要决定前滚还是回滚</li></ul><h3 id="命令-·-交付报告生成" tabindex="-1">命令 · 交付报告生成 <a class="header-anchor" href="#命令-·-交付报告生成" aria-label="Permalink to “命令 · 交付报告生成”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请基于本次任务生成交付报告草稿，只输出报告，不改文件、不宣布完成。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输入：任务与范围、修改文件、验证命令与输出、安全检查结论、遗留问题。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>按结构输出：</span></span>
<span class="line"><span>1. 任务与范围：任务、级别、修改范围、不做项执行情况</span></span>
<span class="line"><span>2. 完成内容：逐条列出</span></span>
<span class="line"><span>3. 修改文件：文件 | 改了什么 | 为什么</span></span>
<span class="line"><span>4. 验证证据：层次 | 检查项 | 命令 / 操作 | 输出关键行 | 结论</span></span>
<span class="line"><span>5. 安全检查：敏感信息 / 破坏性操作 / Git 状态</span></span>
<span class="line"><span>6. 遗留问题：问题 | 影响 | 建议处理 | 谁决定</span></span>
<span class="line"><span>7. 本次沉淀：写到哪里，或「不沉淀」及原因</span></span>
<span class="line"><span></span></span>
<span class="line"><span>无法验证的如实标注，不要把没跑的检查写成通过。是否验收由我判定。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><h3 id="命令-·-回滚方案检查" tabindex="-1">命令 · 回滚方案检查 <a class="header-anchor" href="#命令-·-回滚方案检查" aria-label="Permalink to “命令 · 回滚方案检查”">​</a></h3><div class="language-text line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>请为下面这次改动生成或检查回滚方案，本轮只输出方案，不执行。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>改动：&lt;描述&gt;　范围：&lt;文件 / 接口 / 数据表 / 迁移&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出 / 检查：</span></span>
<span class="line"><span>1. 触发条件：什么情况必须回滚</span></span>
<span class="line"><span>2. 回滚粒度：按哪个提交或阶段退，列出相关提交</span></span>
<span class="line"><span>3. 数据回滚：迁移能否逆执行、数据能否恢复、有无丢失风险</span></span>
<span class="line"><span>4. 兼容兜底：新旧版本能否并存、是否要开关</span></span>
<span class="line"><span>5. 回滚步骤：按顺序写，标出需要我确认的操作</span></span>
<span class="line"><span>6. 回滚后验证：怎么确认回到可用状态</span></span>
<span class="line"><span></span></span>
<span class="line"><span>无法回滚的部分明确标出，说明替代处理（如只能前滚）。涉及删除数据的步骤必须等我确认。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p><strong>预期结果</strong>：一份可追溯、证据完整的交付报告，复杂改动有明确的回滚触发条件、步骤和验证方式。</p><hr><p>开发前打底子，开发中走流程，开发后做把关，三段合起来就是一套能直接用的操作手册。验收就看三件事——能不能快速找到命令、命令能不能直接复制、结果能不能拿证据核对。返回 <a href="/my-vitepress-site/ai/productivity/dev-spec/02-lifecycle.html">开发中</a>。</p>`,64)])])}const m=n(l,[["render",i]]);export{u as __pageData,m as default};
