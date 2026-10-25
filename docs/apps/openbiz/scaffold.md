# OpenBiz 试水脚手架与坑位

> 由工单 / MES / PMS 等早期 demo 原型复现经验沉淀而来的可复制脚手架（2026-10-25 起 9 个应用统一交付于 `E:/8.cangku/for-job/openbiz-{名称}-app/`）。照此流程，第 N 个 A 类系统可在数小时内从零跑通 E2E。

## 0. 前置（一次性）

| 项 | 要求 |
|---|---|
| JDK | 21（构建 OpenBiz 与 demo 均用 21） |
| Maven | 3.9.x，本地仓库 `D:/softwork/apache-maven-3.9.11/repository`（settings.xml 自定义，**不是** `~/.m2`） |
| MySQL | 8.0 本机，`root/123456`，库 `ry-vue`（已含 RuoYi 基础表 + OpenBiz saas 表） |
| Redis | 本机 6379，db 1 |
| 代理 | 本机 `http_proxy=127.0.0.1:3700` → 构建 / curl / python 必须绕过（见坑 4） |

## 1. 构建母仓构件（P0，仅首次）

```bash
git clone --filter=blob:none <openbiz> E:/8.cangku/openbiz   # 稀疏检出排除 doc/ 大文件
cd E:/8.cangku/openbiz
mvn -pl openbiz-saas-core,ruoyi-framework -am install -DskipTests
# 需要其他域再追加模块：openbiz-service / openbiz-business / openbiz-shop / openbiz-iot
```

构件落地：`D:/softwork/apache-maven-3.9.11/repository/com/openbiz/*/3.9.2`

## 2. 新建 demo 工程的固定动作

1. `pom.xml`：`parent = com.ruoyi:ruoyi:3.9.2`；依赖 `openbiz-saas-core` + `ruoyi-framework` + `mysql-connector-j`
2. 启动类：`@SpringBootApplication(exclude=DataSourceAutoConfiguration.class)` + `@Import(OpenBizSaasAutoConfiguration.class, XxxMapperConfig.class)`
3. `application.yml`：换端口（不要用 2488，被 WorkBuddy 占用）、`spring.profiles.active: druid`
4. `application-druid.yml`：数据源指向 `jdbc:mysql://localhost:3306/ry-vue`，`root/123456`
5. 建表 SQL 放 `sql/`，命名空间 `openbiz_<模块>_*`

## 3. 跑通 E2E 的固定动作

```bash
mysql -u root -p ry-vue < sql/openbiz_<模块>_1_1.sql
# 关验证码（sys_config 表，已关可跳过）
mysql -u root -p ry-vue -e "UPDATE sys_config SET config_value='false' WHERE config_key='sys.account.captchaEnabled';"
mvn -o clean package spring-boot:repackage -DskipTests
java -jar target/openbiz-<模块>-app.jar --server.port=<端口> --ruoyi.captchaEnabled=false
# 另开终端
bash run_<模块>_e2e.sh
```

## 4. 坑位清单（必看）

| # | 坑 | 现象 | 解决 |
|---|---|---|---|
| 1 | **端口 2488 被占用** | 启动报端口冲突 / 解析异常 | 强制 `--server.port=18081/18082/18083` 等空闲端口 |
| 2 | **验证码拦截** | 登录返回「验证码错误」 | `sys_config` 表 `sys.account.captchaEnabled=false`；或登录 body 传 `code=0&uuid=`（依赖前者已置 false） |
| 3 | **缺表 / 缺字段** | 启动或请求报 `Table 'ry-vue.xxx' doesn't exist` | 先导对应 `sql/*.sql`；OpenBiz 多域 SQL 分散，缺哪张导哪张（如缺 `openbiz_member` 需补 `openbiz_saas_1_2.sql`） |
| 4 | **代理 502** | curl / python 请求走代理报 502 | 启动 / 测试前 `unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY ALL_PROXY`；curl 加 `--noproxy localhost` 或 `-x ""`；python 脚本前 `NO_PROXY="*"`；Maven 加 `-o` 离线避免联网 |
| 5 | **Maven 本地仓库路径错** | 找不到 `com.openbiz` 构件 | 确认用 `D:/softwork/apache-maven-3.9.11/repository`，非 `~/.m2` |
| 6 | **fat jar 无主清单** | `java -jar` 报无主类 | 必须 `mvn ... spring-boot:repackage`，仅 `package` 生成的 jar 不可直接运行 |
| 7 | **默认密码错** | 登录返回密码错误 | 管理员默认 `admin / admin123`（bcrypt），非库密码 `123456` |
| 8 | **Git Bash 路径扭曲** | 稀疏检出 `.git/info/sparse-checkout` 被清空 | 直接 `Write` 该文件写入正确 cone 模式，再 `git reset` + reapply |
| 9 | **拼写 / 字段错位** | 接口报 400 / 字段为 null | 注意 `idempotentKey` 非 `idempotencyKey`；请求体需带 `title/content/contactName/contactPhone` 等必填；`assigneeUserId` 须存在（如 `1`） |
| 10 | **token 提取路径错** | 取不到 token 导致后续 401 | 登录返回结构为 `resp["token"]`（非 `resp["data"]["token"]`），依实际响应调整 |

## 5. 现行标准流水线（2026-10-25 工程化加固后）

1. **建库**：`split-databases.sh` 同款套路拆出独立库 `openbiz_<模块>`（RuoYi 系统表 + quartz + saas 基础表 + 本系统业务表，导后关验证码）
2. **复制 backend**：以任一现有应用为母本（如 `openbiz-crm-app/backend`），改 `application-druid.yml` 数据源与端口；包名 `com.openbiz.<模块>`、主类 `<模块>Application`；`ApiExceptionHandler` 随复制天然获得——错误契约（409 非法流转 / 400 不存在 / 200+code 业务错 / 500 不泄露堆栈）无需重写
3. **复制 frontend**：以 `openbiz-app-template` 为母本，只改 `src/config/modules.ts` 元数据、`vite.config.ts` 的 `BACKEND_PORT`、`index.html` 标题；ESLint/Prettier 配置随模板自带
4. **双线验证**：`mvn -o clean package spring-boot:repackage -DskipTests` → `bash run_standard_e2e.sh`（契约 E2E）→ 前端 `npm run lint && npm run build`

密钥全部走环境变量（`MYSQL_PASSWORD` / `TOKEN_SECRET` / `DRUID_*`，默认值开箱即用）；`.gitignore` 已备好，可直接入 git。

## 6. 证据纪律

表述不得超过实测边界：协议 = mock、MQTT = stub、Agent = L2、本地 Maven 构件 ≠ Maven Central、单一消费者 ≠ SDK 产品化。作品集与简历一律按此口径。

---

上一级：[OpenBiz 试水实证](/apps/openbiz/)
