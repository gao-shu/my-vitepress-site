# 任务追踪 · 个人技术网站改造

> Agent A（执行）维护本文件。状态：`待办` / `进行中` / `待审查` / `阻塞` / `已完成`
> 更新于：2026-10-23

## 阶段 0：安全检查

| ID | 任务 | 优先级 | 状态 | 实际修改文件 | 验证命令与结果 | 审查结论 | 未解决问题 |
|---|---|---|---|---|---|---|---|
| S0-1 | 检查 Git 状态/分支/最新提交/远端 | P0 | 已完成 | 无 | `git status` 干净；HEAD `ffb89a5e`；`origin/main` = `884d7cbb` | — | — |
| S0-2 | 核实此前提交是否已推送 | P0 | 已完成 | 无 | 续推成功：`884d7cbb..7fa6cc83 main->main`，0 未推送；Actions 部署 run `39637597420` in_progress | — | 部署待核验（见 S0-7） |
| S0-3 | 核查构建失败原因与异常删除文件 | P0 | 已完成 | 无 | 失败于 `vite:prepare-out-dir` → safe-delete shim trash 失败；`dist` 126M→114M，`dist/about`、`dist/ai` 被删 | — | 非代码问题 |
| S0-4 | 确认工作区无未保护的用户修改 | P0 | 已完成 | 无 | 仅 `.workbuddy/memory/2026-10-21.md` 为本人日志 | — | — |
| S0-5 | 建立可恢复基线 | P0 | 已完成 | 无 | 基线提交 `ffb89a5e`；改造前再打一次提交 | — | — |
| S0-6 | 开通安全构建验证通道（不改动原 dist） | P0 | 已完成 | `docs/.vitepress/config.mts`、`.gitignore` | `VITEPRESS_OUT_DIR=.vitepress/dist-build npm run build` → `✓ rendering pages` 全部通过；产物 136M / 35 项，`index/plan/about/apps/tech-system/ai` 均存在；仅收尾清理 `.temp` 被 safe-delete 批量保护拦截 | — | 清理阶段被环境拦截，不影响产物与部署（CI 无此限制） |

## 阶段 1：网站框架改造

| ID | 任务 | 优先级 | 状态 | 实际修改文件 | 验证命令与结果 | 审查结论 | 未解决问题 |
|---|---|---|---|---|---|---|---|
| S1-1 | 顶部五个栏目、移除下拉 | P0 | 已完成 | `config.mts` | 构建产物中首页与深层页均为 5 项，无「开源拆解」「AI赋能」 | 待 Agent B | — |
| S1-2 | 五个栏目各自左侧导航 | P0 | 已完成 | `config.mts` | apps 5 类 / tech 6 类 / ai 5 类 + 1 案例子组 / about 4 类，构建产物全部命中 | 待 Agent B | 同时修正栏目首页正文口径（见 S3-2） |
| S1-3 | 首页求职化重构 | P0 | 已完成 | `docs/index.md` | 定位、能力、代表项目、工业经验、AI 入口、简历、联系方式齐全 | 待 Agent B | — |
| S1-4 | 「其他内容」低调入口 `/more/` | P0 | 已完成 | `docs/more/index.md` | `/more/` 产物存在，含就业/成长/资源/开源入口 | 待 Agent B | — |
| S1-5 | 项目详情页模板 | P0 | 已完成 | `docs/.vitepress/templates/project.md` | 模板含背景/状态/职责/架构/测试/仓库/文章九项；已移出 `docs/`，不作为公开页面 | 待复查 | — |
| S1-6 | 技术文章模板 | P0 | 已完成 | `docs/.vitepress/templates/article.md` | 模板含背景/思路/过程/代码/结果/链接六项；已移出 `docs/`，不作为公开页面 | 待复查 | — |
| S1-7 | 旧内容映射表（按目录聚合，覆盖 445 篇） | P0 | 已完成 | `docs/plan/mapping.md` | 全站目录全覆盖，URL 变更 0 | 待 Agent B | — |

## 阶段 2：验证与修复

| ID | 任务 | 优先级 | 状态 | 实际修改文件 | 验证命令与结果 | 审查结论 | 未解决问题 |
|---|---|---|---|---|---|---|---|
| S2-1 | 生产构建 | P0 | 已完成 | — | `VITEPRESS_OUT_DIR=.vitepress/dist-v3 npm run build` → `✓ building` + `✓ rendering pages`；产物 113M / 37 项 | 待 Agent B | 收尾清理 `.temp` 被环境拦截，不影响产物与 CI |
| S2-2 | 主要路由/侧栏/内部链接检查 | P0 | 已完成 | — | 5 栏目侧栏全命中；提取 774 个唯一站内目标，22 个死链目标（对应 35 处引用），均来自旧文章正文（历史遗留）；新页面与 config 死链 0 | 待 Agent B | 22 个历史死链列为后续治理 |
| S2-3 | 页面实际访问检查 | P0 | 已完成 | — | 产物含 index/plan/more/深层页；`404.html` 存在；模板已移出 `docs/` 不再构建 | 待 Agent B | 浏览器级检查见阶段 3 |

## 阶段 3：独立审查（Agent B）

| ID | 任务 | 优先级 | 状态 | 实际修改文件 | 验证命令与结果 | 审查结论 | 未解决问题 |
|---|---|---|---|---|---|---|---|
| S3-1 | Agent B 独立审查 | P0 | 已完成 | — | 结论「有条件通过」：4 项 P1（栏目首页口径不一致 ×2、首页项目状态矛盾、简历页联系方式公开）+ 8 项 P2；独立复算 22 个死链属实且为历史遗留 | 4 P1 / 8 P2 | — |
| S3-2 | 按审查意见修复 | P0 | 已完成 | `docs/apps/index.md`、`docs/ai/index.md`、`docs/about/index.md`、`docs/index.md`、`docs/plan/index.md`、`config.mts`、`docs/guide/my-resume.md` | 修复 P1-1/2/3；P1-4 经用户确认后手机号脱敏（`132****2001`，保留邮箱）；另修 editLink、模板公开、计划页进度 | 待复查 | 已关闭 P1-4 |
| S3-3 | Agent B 复查 | P0 | 已完成 | — | 结论「有条件完成」：P1-1/2/3 闭环，新增 2 项回归 P2（integration 孤页、AI 口径）已修复，无新增死链、无删文 | 有条件通过 | — |

## 阶段 4：后续 30 天推进

| ID | 任务 | 优先级 | 状态 | 实际修改文件 | 验证命令与结果 | 审查结论 | 未解决问题 |
|---|---|---|---|---|---|---|---|
| S4-1 | 盘点 GitHub 仓库 | P0 | 已完成 | — | GitHub API 返回 6 个仓库；候选 3 个：`openbiz`（Java 多模块）、`openbiz-workorder-demo`（Java 小示例）、`modeldesk`（TS 全栈 AI 配测台） | — | 待定首个代表项目 |
| S4-2 | 评估候选并选定第一个代表项目 | P0 | 已完成 | — | 已核查三仓库 README/结构/依赖：选 **modeldesk**（AI 配测台，MIT，已发 v0.2.1；环境 Node22+pnpm9.15 匹配；smoke 与 unit 可离线跑）；openbiz-workorder-demo 核心逻辑在母仓、需 MySQL/Redis，作为独立作品展示力弱，降级为候选二 | — | — |
| S4-3 | 完成 modeldesk 的安装/运行/测试与证据 | P0 | 已完成 | `E:/_proj_eval/modeldesk/`（独立评估目录，非工作区） | `pnpm install` 619 包/52.8s✅；`test:unit` 4 包 **93 测全过 0 失败**✅（日志留存 `/e/_proj_eval/unit.log`）；`smoke` **2/2**✅；`build` 生产构建成功✅（含 `/v1/[...path]`、`/models`、`/runs/compare`、`/healthz`） | 待 Agent B | 不假称真实模型 API 已验证（需用户 Key）；install/smoke/build 以产物与脚本为证，可复现 |
| S4-4 | modeldesk 项目详情页 + 首篇技术文章 | P0 | 已完成 | `docs/apps/ai/modeldesk.md`、`docs/ai/creation/modeldesk-architecture.md`、`docs/public/projects/*.png`、`config.mts`（侧栏入口） | 项目页含真实截图与验证表；文章基于真实架构与验证过程，如实标注边界；两页已加入侧栏；构建已渲染（文章页在 dist-v9 复测） | 待 Agent B | 截图来自仓库真实产物，非示意图 |
| S4-5 | 网站集成后整体构建验证 | P0 | 已完成 | `config.mts`、`docs/apps/ai/modeldesk.md`、`docs/ai/creation/modeldesk-architecture.md` | 安全目录 dist-v13 全量构建：409 个 HTML 全部渲染，新文章页/项目页/首页均生成；仅收尾目录清理被 safe-delete 拦截（CI 无此限制） | 待 Agent B | 环境 safe-delete 间歇超时，非代码问题 |
| S4-6 | Agent B 独立审查（网站新增页 + modeldesk 证据） | P0 | 已完成 | — | Agent B 结论「通过」：无 P0/P1；独立核实 93 测 0 失败（unit.log）、GitHub v0.2.1 发布、MIT、README 一致性、无虚构真实模型验证；4 项 P2 已修 | 通过 | — |
| S4-7 | 提交并推送（触发部署） | P0 | 已完成 | 提交 `59b7aa13`、`0708a830`、`be8a4fbe` | `git push` 成功：`7fa6cc83..be8a4fbe`；远端 main=`be8a4fbe`；Actions 部署 completed/success；线上 `/apps/ai/modeldesk` 与 `/ai/creation/modeldesk-architecture` 均 200、内容正确；首页含 ModelDesk 代表项目行；截图 `/projects/*.png` 200 | — | 带尾斜杠 URL 404（GitHub Pages 扁平 .html 表现），侧栏无斜杠链接正常，非阻塞 |
| S4-8 | 首页突出代表项目 + 简历口径统一 | P0 | 已完成 | `docs/index.md`、`docs/guide/my-resume.md` | 首页代表项目表新增 ModelDesk 首行；简历新增「开源作品 · ModelDesk」小节；线上首页已含「可运行验证」ModelDesk 行 | 随 S4-6 通过 | — |
| S4-9 | 第二篇技术文章（基于真实工作） | P1 | 已完成 | `docs/tech-system/frontend/site-refactor-job-portfolio.md`、`config.mts`（前端工程侧栏入口）、`.gitignore`（补 `docs/dist-*/`） | 文章《把个人网站从「学习站」改造成「求职作品集」》基于真实改造：6→5 栏目、22 个历史死链实证审计（774 个站内目标）、445→449 篇 0 迁移；本地 dist-v13 渲染 409 页验证通过；提交 `26b6713d` 已推送，Actions 部署 success，线上文章页 200、工程化页侧栏入口可见 | 随 S4-6 口径通过 | 22 个历史死链仍待治理（文章已如实标注） |

## 阶段 0 补充：持续交付条件恢复

| ID | 任务 | 优先级 | 状态 | 实际修改文件 | 验证命令与结果 | 审查结论 | 未解决问题 |
|---|---|---|---|---|---|---|---|
| S0-7 | 推送 7 个待推提交并验证部署 | P0 | 已完成 | 无 | `git push` 成功：`884d7cbb..7fa6cc83`；Actions run `39637597420` completed/success；线上复测 `/more/`=200、`/plan/`=200、导航含「AI 实践」、无「开源拆解」 | — | — |

## 关键事实记录

- **远端同步**：`ffb89a5e` 未推送。`git push` 持续报 `CONNECT tunnel failed 502` / `schannel: server closed abruptly`。属网络/代理阻断，非权限问题。
- **构建环境**：VitePress 默认 `outDir = docs/.vitepress/dist`；`dist` 内仍有 15 个文件被 Git 跟踪（历史遗留），失败构建会逐渐删除 `dist`。
- **安全策略**：第 1 天不改动任何 `.md` 路径；未归类内容经 `/more/` 可达；不执行 `reset --hard` / 强制清理。

## 下一步最有价值的任务

1. ~~**第二篇技术文章**（S4-9，P1）~~ ✅ 已完成：站点重构与死链治理，已入侧栏并构建验证。
2. **简历/首页/项目页三处口径再核对**（尤其 AI 漫剧状态），保持一致。
3. **可选**：启动第二个项目（openbiz-workorder-demo 需母仓+MySQL+Redis，成本高；或从 modeldesk 派生一个独立小工具）。
4. **求职动作**：网站+GitHub+简历三件套已就绪（含 2 篇真实技术文章 + 1 个可验证开源项目），用户决定投递时机后开始并记录反馈。
5. 日常维护：代理恢复后推送本次提交；远端 main=`3650e05b`。
