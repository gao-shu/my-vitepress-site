# CI/CD 流水线搭建

## 背景与问题

发布全靠手工的团队，早晚都会撞上这几堵墙：代码靠 `scp` 上服务器，构建产物和 git 仓库没有绑定关系，出问题不知道线上跑的是哪个 commit；测试只在提测时集中跑一次，主干腐烂得很快；数据库密码、SSH 私钥直接写在部署脚本里，脚本进 git 等于密钥进 git；发布安排在下班后，一个人手工敲命令，谁都不敢碰回滚按钮。

目标是把**构建-测试-发布**固化成一条每次提交都跑的流水线：代码进主干 = 自动出制品 = 自动部署到测试环境，生产发布只保留一个人工审批动作。

## 方案设计

流水线分四段：

```
提交/合并请求
   │
   ▼
[构建+测试] ──失败→ 通知提交者，流水线终止
   │ 通过
   ▼
[制品打包] ──镜像/包 推送仓库，记录版本与 git sha
   │
   ▼
[部署测试环境] ──自动化验证（接口冒烟/E2E）
   │
   ▼
[人工审批] ──▶ [部署生产] ──▶ [部署后验证] ──失败→ 自动回滚
```

关键决策：

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 流水线工具 | GitLab CI / GitHub Actions 按仓库托管平台选 | 就近原则，别为工具迁仓库 |
| 制品形态 | Docker 镜像，tag = git sha + 语义版本 | 一套制品贯穿测试到生产，不重复构建 |
| 环境差异 | 同一制品晋级（promote），只换配置 | 消灭「测试通过的和生产跑的不是一个东西」 |
| 密钥 | CI 变量 + 短期凭据，按环境隔离 | 不落盘、不进 git |
| 生产发布 | 人工审批 + 自动部署 + 失败自动回滚 | 保留控制点，去掉手工执行 |

**核心原则：构建只做一次。** 测试环境验证过的那个制品，原样推到生产——如果生产重新构建，测试通过这件事就失去意义了。

## 关键实现

**1. 流水线定义**（GitLab CI 风格，GitHub Actions 逻辑同构）：

```yaml
stages: [build, test, package, deploy-test, deploy-prod]

build-test:
  stage: build
  script:
    - mvn -B verify                      # 编译 + 单测 + 静态检查
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

package:
  stage: package
  script:
    - docker build -t $REGISTRY/$APP:$CI_COMMIT_SHA .
    - docker push $REGISTRY/$APP:$CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"    # 只有主干出制品

deploy-test:
  stage: deploy-test
  environment: test
  script:
    - docker pull $REGISTRY/$APP:$CI_COMMIT_SHA
    - docker compose up -d app           # compose 里 image 用该 tag
    - ./scripts/smoke.sh                 # 冒烟：核心接口 + 健康检查

deploy-prod:
  stage: deploy-prod
  environment: production
  when: manual                           # 人工审批按钮
  script:
    - ./scripts/deploy.sh $CI_COMMIT_SHA
    - ./scripts/verify.sh || ./scripts/rollback.sh
```

**2. 制品管理**：镜像仓库是流水线的中枢。规则是——tag 带 git sha（可追溯到代码）+ 语义版本（可读），镜像里打 label 记录构建时间与 commit；开启「按 tag 保留策略」，最近 N 个版本可回滚，旧版本定期清理。除了镜像，构建产物的元数据（谁构建、哪个 commit、跑了哪些测试）要能在流水线页面一眼看到，出事时这比翻日志快得多。

**3. 多环境部署**：测试和生产的 compose/部署清单**同一份模板**，差异全部收敛到变量（镜像 tag、 replicas、域名）。晋升流程：`test` 验证通过 → 同一 sha 标记 `deploy: prod` → 生产拉同一个镜像。环境越少越好——小团队两套（test/prod）足够，加环境的成本远高于直觉。

**4. 密钥注入**：

- CI 变量存镜像仓库凭据、部署 SSH key、生产环境变量，设置 **masked + protected**（仅受保护分支可用）；更好的做法是流水线运行时向 Vault/云 KMS 换取**短期凭据**，用完即失效，避免长期 token 泄漏；
- 生产密钥永远不进 CI 变量——由目标服务器上的 `.env` 或编排平台的 secret 管理持有，流水线只负责下发「部署哪个版本」，不携带业务密钥。

**5. 失败通知**：

- 流水线失败 → 按 `CODEOWNERS` 定位负责人，推送 IM 群（webhook 一条消息带 commit、分支、失败阶段、日志链接）；生产部署后验证失败 → 先自动回滚再告警，**通知里必须写明「已回滚到 xxx」**，避免值班人二次操作；
- 通知要分级：MR 构建失败只 @ 提交者，主干失败 @ 全组，生产失败拉值班——不是所有红灯都需要群里炸一遍。

## 落地效果（示意）

- 每次提交自动跑构建与测试，主干失败在分钟级暴露，而不是等提测或上线才发现；制品带 git sha，从线上容器能直接反查对应 commit 与流水线记录，排查不再靠猜；
- 测试与生产跑同一制品，配置差异只在环境变量层，「环境不一致」类问题基本消失；
- 发布从多人协同的手工流程收敛为「点一个审批按钮 + 自动验证」，回滚有明确的目标版本。

（以上为方案效果示意，非生产统计数据。）

## 小结

CI/CD 的骨架是四件事：**构建测试自动化**（红灯前置）、**制品唯一且可追溯**（一次构建、多环境晋级）、**密钥与配置隔离**（流水线知道怎么部署，但不持有业务密钥）、**发布有闸门**（人工审批 + 自动验证 + 自动回滚）。工具选哪家不重要，把「构建只做一次」和「失败自动通知到人」这两条守住，流水线才真正省时间。
