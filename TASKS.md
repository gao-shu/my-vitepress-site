# 任务追踪 · 个人技术网站改造

> Agent A（执行）维护本文件。状态：`待办` / `进行中` / `待审查` / `阻塞` / `已完成`
> 更新于：2026-10-21

## 阶段 0：安全检查

| ID | 任务 | 优先级 | 状态 | 实际修改文件 | 验证命令与结果 | 审查结论 | 未解决问题 |
|---|---|---|---|---|---|---|---|
| S0-1 | 检查 Git 状态/分支/最新提交/远端 | P0 | 已完成 | 无 | `git status` 干净；HEAD `ffb89a5e`；`origin/main` = `884d7cbb` | — | — |
| S0-2 | 核实此前提交是否已推送 | P0 | 已完成 | 无 | `git ls-remote` 502；本地追踪引用未前移 + reflog 无 push → **未推送** | — | 网络/代理阻断，稍后重试 |
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
| S4-2 | 评估候选并选定第一个代表项目 | P0 | 进行中 | — | 已核对根目录：三者均有 README/LICENSE/构建配置 | — | 需读 README 判断完成度与原创占比 |
| S4-3 | 完成第一个项目的 README/运行/测试/发布 | P0 | 待办 | — | — | — | 依赖 S4-2 |
| S4-4 | 项目详情页 + 首篇技术文章 | P0 | 待办 | — | — | — | — |

## 关键事实记录

- **远端同步**：`ffb89a5e` 未推送。`git push` 持续报 `CONNECT tunnel failed 502` / `schannel: server closed abruptly`。属网络/代理阻断，非权限问题。
- **构建环境**：VitePress 默认 `outDir = docs/.vitepress/dist`；`dist` 内仍有 15 个文件被 Git 跟踪（历史遗留），失败构建会逐渐删除 `dist`。
- **安全策略**：第 1 天不改动任何 `.md` 路径；未归类内容经 `/more/` 可达；不执行 `reset --hard` / 强制清理。

## 下一步最有价值的任务

S0-6 → S1-1 ~ S1-7 → S2 → S3。
