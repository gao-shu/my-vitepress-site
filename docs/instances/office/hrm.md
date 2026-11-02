# HRM 人力资源管理系统

<div class="sys-hero">
  <div class="sys-hero__eyebrow">04 办公自动化 · 模块优先级 1 · PRD v1.2（2026-11-02）· M1–M2 已落地</div>
  <div class="sys-hero__badges">
    <span class="sys-badge sys-badge--ok">🔧 M1–M2 已验证（组织 / 档案 / 编制 / 合同 / 考勤 / 假勤）</span>
    <span class="sys-badge sys-badge--plan">📋 M3–M4 仍为设计（薪酬 / 招聘 / 绩效）</span>
    <span class="sys-badge">Java 21 · Spring Boot 3</span>
    <span class="sys-badge">:18091 · openbiz_hrm</span>
    <span class="sys-badge">14 张表 · 97 个端点 · E2E 209 条断言</span>
    <span class="sys-badge">M1–M4 分四期交付</span>
  </div>
  <p class="sys-hero__pitch">把散落在 Excel、纸质单、群聊里的人事事务，收成一条有状态约束、可审批、可核对、可追溯的员工全生命周期数据链</p>
</div>

<div class="sys-grid">
  <div class="sys-card">
    <div class="sys-card__icon">🧾</div>
    <div class="sys-card__title">工资条是快照</div>
    <div class="sys-card__desc">算薪时把档案、考勤、社保参数固化进工资条，事后改档案不会追溯改动历史工资</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">📅</div>
    <div class="sys-card__title">考勤日结 + 幂等</div>
    <div class="sys-card__desc">按天 upsert 一条日结记录，重复跑批覆盖而非累加，月度汇总是可重算的物化结果</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🔁</div>
    <div class="sys-card__title">审批委托 BPM</div>
    <div class="sys-card__desc">请假 / 加班 / 转正 / 调岗只存业务单 + 流程实例 ID，回调驱动状态机，不自建审批引擎</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🧮</div>
    <div class="sys-card__title">薪酬参数版本化</div>
    <div class="sys-card__desc">社保基数、个税税率表按版本存表，工资条记住算它时用的版本号，政策变了不污染历史</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🔐</div>
    <div class="sys-card__title">敏感字段分级</div>
    <div class="sys-card__desc">身份证 / 银行卡加密落库，列表默认脱敏，只有持敏感权限且留审计的请求才解密</div>
  </div>
  <div class="sys-card">
    <div class="sys-card__icon">🌳</div>
    <div class="sys-card__title">部门树 + 编制</div>
    <div class="sys-card__desc">物化路径支撑子树查询与行级过滤，编制占用 / 释放与员工状态迁移同事务</div>
  </div>
</div>

> **文档性质（先看这一段）**：本页是**产品设计文档（PRD）**。**M1**（组织 / 岗位 / 编制 / 档案 / 合同 / 敏感字段 / 花名册导入）与 **M2**（班次 / 排班 / 打卡 / 日结 / 假勤 / 年假额度 / 行级隔离）已于 2026-11-02 **落地并跑通 209 条 E2E 断言**，工程在 `E:/8.cangku/for-job/openbiz-hrm-app`；M3（薪酬）、M4（招聘 / 绩效）**仍是设计**，对应章节的 📋 尚无代码。凡标 ✅ 的条目都有断言可查（`backend/E2E-RESULT.txt`），凡标 📋 的都还没有——本文按这两档如实标注，不把设计写成已完成。

### M1 实施记录（2026-11-02）

| 维度 | 落地情况 |
|---|---|
| 工程 | `openbiz-hrm-app`：`backend/`（Spring Boot 3.5.16 · 18091）+ `frontend/`（Vue3/TS · dev 5191）+ `sql/` |
| 数据库 | 独立库 `openbiz_hrm`：RuoYi 系统表 33 张 + **业务表 14 张**（M1：org / position / headcount / employee / employment / contract / job_change / sensitive_audit；M2：shift / schedule / punch / attendance_daily / leave_request / leave_balance） |
| 接口 | **97 个端点**：组织 18 + 员工 25 + 考勤 13 + 假勤 16 + 合同 9 + 班次 8 + 自助 6 + 登录 1 + 会话 1 |
| 证据 | `bash run_hrm_e2e.sh` → **209 条断言全绿**（M1 70 + M2 139），连续两轮可重复执行 |
| 前端 | 元数据驱动 **8 个实体**（员工 / 组织 / 岗位 / 合同 / 班次 / 假勤单 / 考勤日结 / 年假额度），`vue-tsc` + `vite build` 通过，14 个列表端点经 Vite 代理实测 200 |
| 演示账号 | `admin` / `hrm_admin` / `hrm_manager` / `payroll_specialist` / `dept_manager` / `employee`，口令均为 `admin123` |

四件在实现中被验证为「设计对得上代码」的事：

1. **编制占用的并发语义交给数据库**：`UPDATE ... WHERE used < total` 影响 0 行即 409 `HEADCOUNT_EXHAUSTED`，且员工不落库（E2E 第 9 步用「前后员工数相等」验证了回滚）。
2. **列表从不解密**：身份证 / 手机号的掩码在**写入时**算好存 `*_mask` 列，列表与详情只读掩码；明文只能走 `/sensitive`，每次调用写审计，越权调用也写一条 `DENIED`（E2E 验证 GRANTED≥2、DENIED≥1）。
3. **物化路径平移子树一次 UPDATE 完成**：移动后子孙路径整体重写，且禁止挂到自身子孙下（409 `ORG_CANNOT_MOVE_INTO_DESCENDANT`）。
4. **导入逐行独立事务**：3 行样本（1 正常 / 1 工号重复 / 1 缺姓名）→ 成功 1、失败 2，报告带每行原因。

口径修正（PRD 原稿 → 实际）：权限点 **13 → 14**（`org/employee/attendance/leave/payroll/recruit/perf` 七组共 14 个）；端口 **18090 → 18091**（18090 已被其它服务占用）；前端 dev **5190 → 5191**（5190 亦被占用）。

## 一、为什么做：定位、用户与边界

### 1.1 一句话定位

HRM 覆盖员工**「入转调离 + 考勤 + 薪酬 + 招聘 + 绩效」**的全生命周期，是企业里**唯一全员高频**的后台系统。它不重复造流程与表单——请假、加班、转正、调岗、Offer 的审批全部委托 [BPM](/instances/office/bpm)，HRM 只负责**人事领域的结构化数据与业务不变量**。

### 1.2 四类用户，四种真实诉求

| 角色 | 谁 | 每天在 HRM 里做什么 | 现在的做法（要替换掉的） |
|---|---|---|---|
| **HR 专员** | 人事执行岗 | 办入职、收材料、算考勤异常、跟进招聘、发起转正 | Excel 花名册 + 纸质入职表 + 微信催材料 |
| **HR 主管** | 人事负责人 | 审转正 / 调薪 / 离职、看编制与人力成本 | 靠专员汇总的表，数据滞后一周 |
| **部门经理** | 用人部门 | 批本部门请假加班、评绩效、提用人需求 | 群里发消息批，事后无留痕 |
| **员工** | 全员 | 打卡、请假、看考勤、查工资条 | 打卡 App + 纸质请假条 + 工资条截图私聊 |

### 1.3 明确的边界（不做清单）

这一节比功能清单更重要——**不写清楚边界，HRM 会膨胀成永远做不完的项目**：

- ❌ 不做**多法人 / 多组织合并报表**（单租户单法人主体，跨主体合并属集团版）
- ❌ 不做**银行代发对接**（只产出代发文件 / 工资条，打款走财务）
- ❌ 不做**生物识别与考勤硬件**（指纹机、人脸 SDK、闸机协议）——只做数据接入
- ❌ 不做**排班优化算法**（只做班次定义 + 手工排班 + 导入）
- ❌ 不做**境外税务与多地社保规则库**（参数化留口，内置一套中国境内规则做参考实现）
- ❌ 不做**电子签章 / 合同在线签署**（可后接第三方，不在本期）
- ❌ 不做**劳务派遣 / 外包结算 / 工时计件工资**（制造业计时计件属 MES 域）

> 取舍原则：**HRM 的价值在「全员用得上 + 数据能对上账」，不在功能多。** 一个能被 200 人真实用起来的 6 模块系统，胜过 12 个模块但没人录入的演示系统。

## 二、功能架构

<svg viewBox="0 0 880 250" width="100%" style="max-width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="HRM 功能架构图">
<rect x="0" y="0" width="880" height="250" rx="14" fill="var(--vp-c-bg-soft)"/>
<text x="118" y="40" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">终端层</text>
<rect x="134" y="16" width="168" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="218" y="40" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">HR 工作台（规划）</text>
<rect x="316" y="16" width="168" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="400" y="40" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">员工自助（规划）</text>
<rect x="498" y="16" width="168" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="582" y="40" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">经理审批（规划）</text>
<rect x="680" y="16" width="168" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="764" y="40" font-size="13" text-anchor="middle" fill="var(--vp-c-text-1)">企微/钉钉打卡（规划）</text>
<text x="118" y="98" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">模块层</text>
<rect x="134" y="74" width="106" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="187" y="98" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">组织架构</text>
<rect x="252" y="74" width="106" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="305" y="98" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">员工档案</text>
<rect x="370" y="74" width="106" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="423" y="98" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">考勤管理</text>
<rect x="488" y="74" width="106" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="541" y="98" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">薪酬管理</text>
<rect x="606" y="74" width="106" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="659" y="98" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">招聘管理</text>
<rect x="724" y="74" width="106" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="777" y="98" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">绩效管理</text>
<text x="118" y="156" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">领域层</text>
<rect x="134" y="132" width="106" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="187" y="156" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">物化路径树</text>
<rect x="252" y="132" width="106" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="305" y="156" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">编制占用</text>
<rect x="370" y="132" width="106" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="423" y="156" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">日结 + 汇总</text>
<rect x="488" y="132" width="106" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="541" y="156" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">快照式工资条</text>
<rect x="606" y="132" width="106" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="659" y="156" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">Offer→入职</text>
<rect x="724" y="132" width="106" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="777" y="156" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">目标→评分</text>
<text x="118" y="214" font-size="12" font-weight="600" text-anchor="end" fill="var(--vp-c-text-2)">底座层</text>
<rect x="134" y="190" width="168" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="218" y="214" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">OpenBiz 多租户 / 权限</text>
<rect x="316" y="190" width="168" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="400" y="214" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">BPM 审批（已验收）</text>
<rect x="498" y="190" width="168" height="38" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
<text x="582" y="214" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">RuoYi 用户 / 角色 / 字典</text>
<rect x="680" y="190" width="168" height="38" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-divider)"/>
<text x="764" y="214" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">MySQL 8 · openbiz_hrm</text>
</svg>

实心 = 可直接复用的既有能力（已验收）；空心 = 本系统待建部分。

**分层职责**：

- **终端层**：HR 工作台是主入口；员工自助与经理审批是同一套 API 的两种视图，不做第二套后端。
- **模块层**：6 个模块，但只有 4 个「有状态」——组织、考勤、薪酬、招聘有状态机；档案与绩效以审批驱动。
- **领域层**：真正决定系统好不好用的是这 6 个机制，不是页面数量。
- **底座层**：多租户、权限、审批、用户体系全部复用，HRM 只写人事域。

## 三、功能清单与分期

> 状态图例：✅ 已实现并有断言 · 📋 规划中（本 PRD 定义，未实现） · ❌ 不做

### 3.1 P0 · M1 组织与档案（约 20%）· 已落地

| 功能域 | 功能 | 状态 |
|---|---|---|
| 组织 | 部门树（无限层级）+ 物化路径 `org_path` 支撑子树查询 | ✅ 建/改/平移/删除约束 + 环检测 |
| 组织 | 岗位（职位名称 / 职级 / 序列） | ✅ 编码与名称唯一 + 启停 |
| 组织 | 编制：部门 × 岗位 × 期次的编制数、已占数、可用数 | ✅ 原子占用/释放，低于已占数拒绝 |
| 档案 | 员工主档：工号、姓名、证件、手机、入职日、状态、直属上级 | ✅ 七态生命周期 |
| 档案 | 任职记录：一次任职一行（部门 / 岗位 / 职级 / 生效日 / 失效日），支持一人多段任职 | ✅ 离职自动关闭任职段 |
| 档案 | 合同：类型（固定期 / 无固定期 / 实习 / 劳务）、起止、续签次数、到期提醒 | ✅ 到期提醒按天扫描 |
| 档案 | 入转调离：入职、转正、调岗、调薪、离职五类变更留痕 | ✅ M1 直转 + 留痕；**审批接 BPM 待 M2**，调岗/调薪单据待 M2 |
| 档案 | 敏感字段加密 + 列表脱敏 + 解密审计 | ✅ AES-GCM + HMAC + mask 列 + 审计表 |
| 档案 | 花名册导入（Excel / CSV 模板 + 校验报告：重复工号 / 缺必填 / 部门不存在） | ✅ 逐行独立事务，失败行带原因 |

### 3.2 P0 · M2 考勤与假勤（累计约 40%）· 已落地

| 功能域 | 功能 | 状态 |
|---|---|---|
| 班次 | 班次定义（上下班时间 / 弹性 / 跨天 / 休息时长） | ✅ 8 端点；跨天班 `cross_day=1` 校验下班时间须早于上班时间 |
| 排班 | 手工排班 + 按部门批量套用；不排班默认套用部门默认班次 | ✅ 手工 / 批量 / 重排改班次不新增行 |
| 打卡 | 打卡记录接入（导入 / 开放接口 / 企微回调），只做数据接入不做硬件 | ⚠️ 导入接口已通（`punches/import`，按员工+时间幂等去重）；**开放接口 / 企微回调未做** |
| 日结 | 每日跑批生成 `attendance_daily`（应出勤 / 实出勤 / 迟到 / 早退 / 缺卡 / 加班 / 请假时长） | ✅ 跑批幂等；跨天班记在上班当天；人工修正 `manual_flag=1` 不被覆盖 |
| 假勤 | 请假单（年假 / 病假 / 事假 / 婚假 / 产假 / 丧假 / 调休），走 BPM 审批 | ✅ 七态状态机 + `callback` 回调契约（BPM 未接时用回调推进）；自审批 409 |
| 假勤 | 年假额度：按司龄规则生成额度、按天扣减、跨年结转上限 | ✅ 按司龄生成 + 结转封顶 40h；提交即校验可用额度，不足 409 |
| 假勤 | 加班单（工作日 / 休息日 / 法定节假日三种倍率） | ⚠️ **单据与 `ot_hours` 回写已通**（`OVERTIME` 三类型）；**倍率计算未做**，无节假日日历 |
| 假勤 | 补卡申请（缺卡申诉，审批通过后回写日结） | ❌ **仅建单 + 审批状态机**；审批通过后**未补打卡流水**，日结不回写（代码内已留注释标明） |
| 汇总 | 月度考勤汇总（按人 / 按部门），可重算、可导出 | ⚠️ 按人 / 按部门汇总与重算已通；**导出未做**（全库零导出端点） |

### 3.3 P1 · M3 薪酬（累计约 50%）

| 功能域 | 功能 | 状态 |
|---|---|---|
| 参数 | 社保 / 公积金参数版本（城市、基数上下限、比例、生效期） | 📋 |
| 参数 | 个税税率表版本 + 专项附加扣除项 | 📋 |
| 算薪 | 薪酬批次：`DRAFT → CALCULATED → REVIEWED → PAID → CLOSED` | 📋 |
| 算薪 | 应发项：基本工资 / 岗位工资 / 绩效工资 / 加班费 / 补贴 / 补发 | 📋 |
| 算薪 | 扣减项：缺勤扣款 / 事假扣款 / 社保个人 / 公积金个人 / 个税 / 其他 | 📋 |
| 算薪 | 累计预扣预缴个税，按人按年累计，跨月可续算 | 📋 |
| 算薪 | 入职 / 离职当月按**在职天数**折算 | 📋 |
| 算薪 | 工资条快照落库（含所用参数版本号），封账后不可改 | 📋 |
| 算薪 | 工资条查看：员工看自己、HR 看全部、部门经理看本部门汇总（不含明细金额） | 📋 |
| 算薪 | 代发文件导出（银行模板 CSV）+ 工资表 Excel 导出 | 📋 |
| 算薪 | 调薪：生效日落在哪个月，由批次自动带出，不手工改数 | 📋 |

### 3.4 P2 · M4 招聘与绩效（累计约 60%）

| 功能域 | 功能 | 状态 |
|---|---|---|
| 招聘 | 职位发布（JD / 部门 / 编制 / 薪资区间 / 招聘人数） | 📋 |
| 招聘 | 候选人库（简历附件 / 来源渠道 / 联系方式脱敏） | 📋 |
| 招聘 | 面试安排（轮次 / 面试官 / 时间 / 评价表 / 结论） | 📋 |
| 招聘 | Offer（薪资构成 / 报到日 / 审批 / 接受或拒绝） | 📋 |
| 招聘 | Offer 接受 → 一键生成待入职员工（`PENDING`），占编制 | 📋 |
| 绩效 | 周期（季度 / 半年 / 年度）+ 分阶段推进 | 📋 |
| 绩效 | 目标设定（OKR 或 KPI，权重合计必须为 100%） | 📋 |
| 绩效 | 自评 → 主管评 → 校准 → 发布；结果分档映射绩效系数 | 📋 |
| 绩效 | 绩效系数回写下一个薪酬批次的绩效工资项 | 📋 |

### 3.5 M5 及以后（剩余约 40%，本 PRD 不展开）

培训管理、员工自助证明开具、报表分析（人力成本 / 流动率 / 编制使用率）、人才盘点、移动端与企业微信 / 钉钉深度集成。

## 四、核心业务闭环

### 4.1 闭环 A：招聘到入职（把人招进来）

```
职位发布 ─▶ 候选人入库 ─▶ 面试(多轮) ─▶ Offer 审批 ─▶ 候选人接受
                                                        │
                            ┌───────────────────────────┘
                            ▼
              员工建档 PENDING（占编制） ─▶ 到岗 PROBATION ─▶ 转正 REGULAR
                            │
                            └─▶ 放弃入职 CANCELLED（释放编制）
```

| 环节 | 状态迁移 | 写库 | 校验 / 说明 |
|---|---|---|---|
| Offer 接受 | `OFFER → ONBOARDED` | 职位 `filled_count + 1` | 招聘人数已满则拒绝 |
| 员工建档 | `PENDING`（初态） | `employee` + `employment`（首段任职） | 工号租户内唯一；身份证 / 手机号唯一；部门与岗位必须存在且启用 |
| 占编制 | — | `headcount.used + 1` | **与建档同事务**；可用编制为 0 时拒绝（可配置为告警放行） |
| 到岗 | `PENDING → PROBATION` | `employment.start_date` | 到岗日不得早于建档日 |
| 转正 | `PROBATION → REGULAR` | `employment` 新增一段或改 `regular_date` | 需 BPM 转正审批通过；试用期未满可提前转正（记 `early=true`） |
| 放弃入职 | `PENDING → CANCELLED` | `headcount.used - 1` | 终态，释放编制 |

> 设计要点：**「占编制」不是一个可选的附加动作**。如果建档成功但编制没占，年底盘点必然对不上；所以两者必须同事务，且 `headcount.used` 不做应用层「先查后加」，用 `UPDATE ... SET used = used + 1 WHERE used < total` 一行原子语句，影响 0 行即编制不足。

### 4.2 闭环 B：考勤到薪酬（把钱算对）

这是 HRM 的主链路，也是唯一一条**跨月、跨模块、必须可复算**的链路：

```
打卡/请假/加班 ─▶ 每日日结 ─▶ 月度汇总 ─┐
                                        ├─▶ 算薪(CALCULATED) ─▶ 复核(REVIEWED) ─▶ 发放(PAID) ─▶ 封账(CLOSED)
调薪/入离职折算 ────────────────────────┘         │
                                                   └─▶ 工资条快照（含参数版本）
```

| 环节 | 状态迁移 | 写库 | 校验 / 说明 |
|---|---|---|---|
| 日结 | — | `attendance_daily` upsert | `uk(tenant_id, employee_id, work_date)`；**同一天重跑覆盖，不累加** |
| 汇总 | — | 内存计算或 `attendance_monthly` 物化 | 汇总只是日结的聚合视图，可随时重算 |
| 算薪 | `DRAFT → CALCULATED` | 每人一行 `payroll_item` + N 行明细 | 批次期间内不允许有未审批完成的假勤单（否则提示先处理） |
| 复核 | `CALCULATED → REVIEWED` | `review_by` / `review_at` | 复核人不得是算薪人（职责分离） |
| 退回 | `REVIEWED → CALCULATED` | 清空复核痕迹 | 重算会**覆盖**未发放批次，已发放不可退回 |
| 发放 | `REVIEWED → PAID` | `pay_at` / `pay_by` | 记发放渠道（银行代发 / 现金），不接银行接口 |
| 封账 | `PAID → CLOSED` | `closed_at` | 终态；封账后工资条不可改、不可重算 |

> 为什么「考勤日结」要单独一张表，而不是算薪时现查打卡流水？三个理由：① 打卡流水是事实，日结是解释（迟到几分钟、算不算加班是规则判断），规则会变但事实不能变；② 算薪要跑几十人的月度数据，现算会重复解释 N 次；③ 日结可被人事手工修正并留痕，修正后能重算。

### 4.3 闭环 C：离职（把人送走并结清）

```
提出离职 ─▶ 审批 ─▶ LEAVING(待离职) ─▶ 交接完成 ─▶ 离职日到期 ─▶ RESIGNED
                │                                        │
                └─ 撤回 ─▶ REGULAR                        ├─▶ 释放编制
                                                          ├─▶ 当月按在职天数折算薪酬
                                                          └─▶ 账号停用 / 待办转交
```

| 环节 | 状态迁移 | 写库 | 校验 / 说明 |
|---|---|---|---|
| 提出 | `PROBATION/REGULAR → LEAVING` | 变更单 + `last_work_date` | 离职日不得早于申请日；需 BPM 审批 |
| 撤回 | `LEAVING → REGULAR` | 清空 `last_work_date` | 仅离职日未到可撤回 |
| 到期 | `LEAVING → RESIGNED` | `employee.status` + `employment.end_date` | 由定时任务在离职日次日执行，也可手工触发 |
| 释放编制 | — | `headcount.used - 1` | 与状态迁移同事务 |
| 折算 | — | 由薪酬批次读取 `in_service_days` | 离职当月社保通常仍需缴纳，按配置决定 |

> 一条容易漏的规则：**离职员工的账号停用不能交给 HRM**。HRM 只发领域事件「员工已离职」，由 RuoYi 用户体系 / OA 待办各自消费——HRM 不该直接改 `sys_user`，否则人事和账号两套状态会互相打架。

## 五、状态机

HRM 有五张独立迁移表。**全部用 `Map<String, Set<String>>` 声明，不用 if-else 散落在 Service 里**——这是 OpenBiz 系应用的统一写法，改流程只改一张 Map。

### 5.1 员工生命周期（`openbiz_hrm_employee.status`）

```
PENDING ──onboard──▶ PROBATION ──regular──▶ REGULAR ⇄ suspend/resume ─┐
   │                     │                     │                      │
   └──cancel──▶ CANCELLED└──leave──▶ LEAVING ◀──┘                      │
                                        │  ▲                          │
                                        │  └──withdraw────────────────┘
                                        └──depart──▶ RESIGNED（终态）
```

| 当前状态 | 允许迁移 | 触发动作 |
|---|---|---|
| `PENDING` 待入职 | `PROBATION` / `CANCELLED` | onboard / cancel |
| `PROBATION` 试用 | `REGULAR` / `LEAVING` | regular / leave |
| `REGULAR` 正式 | `LEAVING` / `SUSPENDED` | leave / suspend |
| `SUSPENDED` 停薪留职 | `REGULAR` / `LEAVING` | resume / leave |
| `LEAVING` 待离职 | `RESIGNED` / `REGULAR` | depart / withdraw |
| `RESIGNED` 已离职 | — | 终态 |
| `CANCELLED` 放弃入职 | — | 终态 |

### 5.2 考勤单（请假 / 加班 / 补卡共用一套，`openbiz_hrm_leave_request.status`）

| 当前状态 | 允许迁移 | 触发动作 |
|---|---|---|
| `DRAFT` | `SUBMITTED` | submit |
| `SUBMITTED` | `APPROVED` / `REJECTED` / `WITHDRAWN` | approve / reject / withdraw |
| `APPROVED` | `CANCELLED` | cancel（销假，需回滚已扣额度） |
| `REJECTED` / `WITHDRAWN` / `CANCELLED` | — | 终态（可复制重提） |

### 5.3 薪酬批次（`openbiz_hrm_payroll_period.status`）

| 当前状态 | 允许迁移 | 触发动作 |
|---|---|---|
| `DRAFT` | `CALCULATED` / `CANCELLED` | calculate / cancel |
| `CALCULATED` | `REVIEWED` / `CALCULATED` / `CANCELLED` | review / recalculate / cancel |
| `REVIEWED` | `PAID` / `CALCULATED` | pay / rollback |
| `PAID` | `CLOSED` | close |
| `CLOSED` / `CANCELLED` | — | 终态，工资条锁定 |

### 5.4 招聘职位（`openbiz_hrm_job_posting.status`）

| 当前状态 | 允许迁移 | 触发动作 |
|---|---|---|
| `DRAFT` | `PUBLISHED` / `CLOSED` | publish / close |
| `PUBLISHED` | `SCREENING` / `CLOSED` | screen / close |
| `SCREENING` | `INTERVIEW` / `CLOSED` | interview / close |
| `INTERVIEW` | `OFFER` / `CLOSED` | offer / close |
| `OFFER` | `ONBOARDED` / `DECLINED` | accept / decline |
| `ONBOARDED` / `DECLINED` / `CLOSED` | — | 终态 |

### 5.5 绩效周期（`openbiz_hrm_perf_cycle.status`）

| 当前状态 | 允许迁移 | 触发动作 |
|---|---|---|
| `DRAFT` | `GOAL_SETTING` / `CANCELLED` | start / cancel |
| `GOAL_SETTING` | `SELF_REVIEW` | closeGoals |
| `SELF_REVIEW` | `MANAGER_REVIEW` | submitSelf |
| `MANAGER_REVIEW` | `CALIBRATION` / `SELF_REVIEW` | submitManager / returnToSelf |
| `CALIBRATION` | `PUBLISHED` / `MANAGER_REVIEW` | publish / returnToManager |
| `PUBLISHED` | `CLOSED` | close（写绩效系数） |
| `CLOSED` / `CANCELLED` | — | 终态 |

### 5.6 实现方式（与 ERP / OA 同构）

```java
private static final Map<String, Set<String>> E_TRANS = Map.of(
    PENDING,   Set.of(PROBATION, CANCELLED),
    PROBATION, Set.of(REGULAR, LEAVING),
    REGULAR,   Set.of(LEAVING, SUSPENDED),
    SUSPENDED, Set.of(REGULAR, LEAVING),
    LEAVING,   Set.of(RESIGNED, REGULAR),
    RESIGNED,  Set.of(),
    CANCELLED, Set.of());

private void transition(HrmEmployee e, String target, String actor) {
    Set<String> allowed = E_TRANS.get(e.getStatus());
    if (allowed == null || !allowed.contains(target)) {
        throw new IllegalStateException("ILLEGAL_TRANSITION: " + e.getStatus() + " -> " + target);
    }
    employeeMapper.updateStatus(e.getId(), e.getTenantId(), target, actor);
}
```

非法流转抛 `ILLEGAL_TRANSITION` → 由 `ApiExceptionHandler` 映射 **HTTP 409**（与 [ERP](/instances/business/erp) 一致）。前端 `modules.ts` 的 `transitions` 与后端同源，按钮显隐天然一致。

## 六、数据模型（规划 19 张，M1 已落 8 张）

全部带 `tenant_id`、`create_by`、`create_time`、`deleted`，不建外键（跨租户隔离靠应用层 + 索引）。**所有金额字段 `DECIMAL(14,2)`，所有比例字段 `DECIMAL(8,4)`，禁止用 double。**

### 6.1 P0 组织与档案（5 张）

| 表 | 关键字段 | 约束 / 说明 |
|---|---|---|
| `openbiz_hrm_org` | `parent_id` · `name` · `org_path` · `leader_id` · `sort` · `status` | `uk(tenant_id, parent_id, name)`；`org_path` 形如 `/1/3/7/`，子树查询 `LIKE '/1/3/%'` |
| `openbiz_hrm_position` | `code` · `name` · `job_level` · `job_family` · `status` | `uk(tenant_id, code)`；职级用于薪资带宽与绩效分档 |
| `openbiz_hrm_headcount` | `org_id` · `position_id` · `period` · `total` · `used` | `uk(tenant_id, org_id, position_id, period)`；`used` 只由占 / 释编制改 |
| `openbiz_hrm_employee` | `emp_no` · `name` · `id_card_enc` · `mobile_enc` · `org_id` · `position_id` · `leader_id` · `hire_date` · `status` · `dimission_date` | `uk(tenant_id, emp_no)`；`uk(tenant_id, id_card_hash)`；加密字段配 `*_hash` 做等值查询 |
| `openbiz_hrm_employment` | `employee_id` · `org_id` · `position_id` · `job_level` · `start_date` · `end_date` · `change_type` | 一人多段任职；`end_date IS NULL` 即当前任职；`uk(tenant_id, employee_id, start_date)` |

### 6.2 P0 档案附属与考勤（5 张）

| 表 | 关键字段 | 约束 / 说明 |
|---|---|---|
| `openbiz_hrm_contract` | `employee_id` · `contract_no` · `type` · `start_date` · `end_date` · `renew_count` · `status` | `uk(tenant_id, contract_no)`；到期前 30 天进提醒列表 |
| `openbiz_hrm_job_change` | `employee_id` · `change_type` · `before_json` · `after_json` · `effective_date` · `process_instance_id` · `status` | 入转调离五类变更单；`process_instance_id` 关联 BPM 实例 |
| `openbiz_hrm_attendance_daily` | `employee_id` · `work_date` · `shift_id` · `should_hours` · `actual_hours` · `late_min` · `early_min` · `absent_min` · `ot_hours` · `leave_hours` · `manual_flag` | `uk(tenant_id, employee_id, work_date)`；`manual_flag` 标记被人工修正 |
| `openbiz_hrm_leave_request` | `request_no` · `employee_id` · `type` · `start_time` · `end_time` · `hours` · `reason` · `process_instance_id` · `status` | `uk(tenant_id, request_no)`；类型含请假 / 加班 / 补卡 |
| `openbiz_hrm_shift` | `code` · `name` · `work_start` · `work_end` · `cross_day` · `flex_min` · `rest_min` | `uk(tenant_id, code)`；跨天班次的 `work_end` 落在次日 |

### 6.3 P1 薪酬（3 张）

| 表 | 关键字段 | 约束 / 说明 |
|---|---|---|
| `openbiz_hrm_payroll_period` | `period`（`yyyy-MM`）· `status` · `calc_by` · `review_by` · `pay_by` · `closed_at` | `uk(tenant_id, period)`；一个期间只有一个批次 |
| `openbiz_hrm_payroll_item` | `period_id` · `employee_id` · `gross` · `deduction` · `net` · `social_self` · `fund_self` · `tax` · `param_version` · `snapshot_json` | `uk(tenant_id, period_id, employee_id)`；`snapshot_json` 存算薪时的档案 / 考勤 / 参数快照 |
| `openbiz_hrm_payroll_param` | `param_type`（`SOCIAL`/`FUND`/`TAX`）· `city_code` · `version` · `effective_from` · `payload_json` | `uk(tenant_id, param_type, city_code, version)`；`payload_json` 存基数上下限 / 比例 / 税率档 |

### 6.4 P2 招聘与绩效（6 张）

| 表 | 关键字段 | 约束 / 说明 |
|---|---|---|
| `openbiz_hrm_job_posting` | `code` · `title` · `org_id` · `position_id` · `headcount` · `salary_min` · `salary_max` · `status` · `filled_count` | `uk(tenant_id, code)`；`filled_count` 不超 `headcount` |
| `openbiz_hrm_candidate` | `name` · `mobile_enc` · `source` · `resume_url` · `posting_id` · `stage` | 简历存文件服务，库内只留 URL |
| `openbiz_hrm_interview` | `candidate_id` · `round` · `interviewer_id` · `plan_time` · `score` · `conclusion` | `uk(tenant_id, candidate_id, round)` |
| `openbiz_hrm_perf_cycle` | `code` · `name` · `period_type` · `start_date` · `end_date` · `status` | `uk(tenant_id, code)` |
| `openbiz_hrm_perf_goal` | `cycle_id` · `employee_id` · `content` · `weight` · `target` · `self_score` · `manager_score` | 权重合计必须 100，校验在 Service |
| `openbiz_hrm_perf_review` | `cycle_id` · `employee_id` · `self_comment` · `manager_comment` · `final_score` · `grade` · `coefficient` | `uk(tenant_id, cycle_id, employee_id)`；`grade` 映射 `coefficient` |

**三条建模原则**：

1. **事实表只增不改，状态列单独维护**：`attendance_daily` 与 `payroll_item` 一旦生成，只允许在允许的阶段被覆盖，不允许「改历史」。审计靠 `update_by` / `update_time`。
2. **加密字段 + 哈希列成对出现**：`id_card_enc` 存 AES-GCM 密文，`id_card_hash` 存 HMAC-SHA256，后者用于唯一性校验与等值查询。只有 `*_enc` 需要解密，且解密必须走 `SensitiveService`（统一记审计）。
3. **金额永远服务端推导**：应发、扣减、实发、个税全部由服务端算，请求里传金额一律忽略。`net = gross - deduction` 在落库前断言，不等则 500 并拒绝写入——这是薪酬系统最后一道自检。

## 七、个税与折算：两个必须写死的算法

### 7.1 累计预扣预缴（工资薪金）

```
累计应纳税所得额 = 累计收入 − 累计免税收入 − 累计减除费用（5000 × 月数）
                  − 累计专项扣除（社保 + 公积金个人部分）
                  − 累计专项附加扣除（子女教育 / 房贷 / 赡养老人 …）
                  − 累计其他扣除

本期应预扣预缴税额 = 累计应纳税所得额 × 预扣率 − 速算扣除数 − 累计已预扣预缴税额
（结果 ≤ 0 时按 0 计，负数不退税，留待次年汇算）
```

设计要点：

- **必须按人按年累计**，不能只算单月。所以 `payroll_item` 要能按 `employee_id + year` 汇总出「累计已发、累计已扣、累计已预缴」。
- **税率表存表不写死**：`payroll_param.payload_json` 存档位数组（`上限` / `税率` / `速算扣除数`），代码只做区间匹配。税率调整只新增版本，不改代码。
- **参数版本号随工资条落库**：`payroll_item.param_version` 记录当时用的社保 / 税率版本，未来对账能回答「这个月为什么扣这么多」。

### 7.2 入离职当月折算

```
在职天数 = min(月末, 离职日) − max(月初, 入职日) + 1
计薪天数 = 当月应出勤天数（按班次日历算，不是固定 21.75）
应发基本工资 = 月基本工资 ÷ 计薪天数 × 在职且出勤天数
```

设计要点：

- **分母用「当月实际应出勤天数」而不是 21.75**：21.75 是年平均，用在单月会在长短月产生偏差，员工一算就能发现。两种口径都要在参数里可选，默认实际天数。
- 入职日 / 离职日与薪酬批次的期间做**区间重叠判断**，重叠为 0 则不生成工资条（避免给已离职人员算空工资）。

## 八、接口契约

### 8.1 域动作接口（`/api/hrm`）

| 方法 | 路径 | 权限 | 说明 |
|---|---|---|---|
| GET/POST/PUT | `/orgs` · `/orgs/tree` · `/orgs/{id}` | `org:read` / `org:write` | 部门树（含 `orgPath`），禁止把父节点挂到自己的子树下 |
| GET/POST/PUT | `/positions` | `org:read` / `org:write` | 岗位 |
| GET | `/headcounts?period=` | `org:read` | 编制视图：`total` / `used` / `available` |
| GET/POST/PUT | `/employees` · `/employees/{id}` | `employee:read` / `employee:write` | 档案；列表默认脱敏 |
| GET | `/employees/{id}/sensitive` | `employee:read_sensitive` | 解密查看身份证 / 银行卡，**每次调用写审计** |
| POST | `/employees/{id}/onboard` `regular` `leave` `depart` `cancel` `suspend` `resume` | `employee:write` | 生命周期流转 |
| GET | `/employees/stats` | `employee:read` | 各状态 / 各部门 / 各职级人数 |
| GET/POST | `/contracts` · `/contracts/expiring?days=30` | `employee:read` / `employee:write` | 合同与到期提醒 |
| GET/POST | `/job-changes` · `/job-changes/{id}/submit` | `employee:write` | 入转调离变更单（提交后进 BPM） |
| GET | `/attendance/daily?employeeId=&from=&to=` | `attendance:read` | 日结明细 |
| POST | `/attendance/settle?date=` | `attendance:write` | 触发某日日结（幂等，可重跑） |
| GET | `/attendance/monthly?period=&orgId=` | `attendance:read` | 月度汇总 |
| POST | `/attendance/{id}/correct` | `attendance:write` | 人工修正日结，记 `manual_flag` + 原因 |
| GET/POST | `/leave-requests` · `/leave-requests/{id}/submit` `cancel` | `attendance:read` / `attendance:write` | 假勤单 |
| POST | `/leave-requests/{id}/callback` | 内部（BPM 回调） | BPM 审批结果回调，驱动态机 |
| GET | `/leave-balance?employeeId=&year=` | `attendance:read` | 年假额度与已用 |
| GET/POST/PUT/DELETE | `/shifts` · `/shifts/{id}` · `/shifts/stats` | `attendance:read` / `attendance:write` | 班次（M2 ✅；id 在路径上，与 M1 的 body 带 id 不同） |
| GET/POST/DELETE | `/schedules` · `/schedules/batch` · `/schedules/{id}` | `attendance:read` / `attendance:write` | 排班（M2 ✅；批量按部门套用） |
| GET/POST | `/punches` · `/punches/import` | `attendance:read` / `attendance:write` | 打卡流水与导入（M2 ✅；按员工+时间幂等去重） |
| POST | `/leave-requests/{id}/approve` `reject` `withdraw` | `leave:approve` | 审批三动作（M2 ✅；自审批 409） |
| POST | `/leave-balances/grant` `adjust` | `attendance:write` | 年假额度按司龄生成 / 手工调整（M2 ✅） |
| GET | `/me/attendance` · `/me/leaves` · `/me/leaves/balance` | 登录即可 | 员工自助（M2 ✅；`employeeId` 强制取 token 身份） |
| GET/POST/PUT | `/payroll/periods` | `payroll:read` / `payroll:write` | 批次建档 |
| POST | `/payroll/periods/{id}/calculate` `review` `pay` `close` `rollback` | `payroll:write` | 批次流转 |
| GET | `/payroll/periods/{id}/items` | `payroll:read` | 批次工资明细 |
| GET | `/payslips?period=` · `/payslips/me` | `payroll:read` / 登录即可 | 工资条；`/me` 只返回本人 |
| GET | `/payroll/periods/{id}/export?type=BANK\|EXCEL` | `payroll:read` | 代发文件 / 工资表导出 |
| GET/POST | `/postings` · `/candidates` · `/interviews` | `recruit:read` / `recruit:write` | 招聘三件套 |
| POST | `/candidates/{id}/offer` `accept` `decline` | `recruit:write` | Offer 与结果 |
| GET/POST | `/perf/cycles` · `/perf/cycles/{id}/goals` | `perf:read` / `perf:write` | 绩效周期与目标 |
| POST | `/perf/cycles/{id}/advance?to=` | `perf:write` | 阶段推进 / 打回 |

### 8.2 统一契约接口（`StandardApiController`）

与 OpenBiz 系其他应用保持一致，`{entity}` 取 `employees` / `orgs` / `positions` / `candidates`：

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/hrm/{entity}/list` | 分页列表（`pageNum` / `pageSize`） |
| GET | `/api/hrm/{entity}/stats` | 按状态计数（含 0 值） |
| PUT | `/api/hrm/{entity}` | 更新业务字段（`status` 只能走 transition） |
| DELETE | `/api/hrm/{entity}/{id}` | 软删（员工不允许物理删，只能离职） |
| POST | `/api/hrm/{entity}/{id}/transition?to=XXX` | 统一流转入口，非法目标态 409 |

### 8.3 错误契约

| 场景 | HTTP | 响应体示例 |
|---|---|---|
| 参数校验失败 | 400 | `{code:500,msg:"hireDate: 不能为空"}` |
| 记录不存在 | 400 | `{code:500,msg:"EMPLOYEE_NOT_FOUND: 12"}` |
| 越权（含行级越权） | 403 | `{code:500,msg:"FORBIDDEN: 缺少权限 payroll:write（当前角色：dept_manager）"}` |
| 状态机非法流转 | 409 | `{code:500,msg:"ILLEGAL_TRANSITION: RESIGNED -> PROBATION"}` |
| 业务规则冲突 | 409 | `HEADCOUNT_EXHAUSTED` / `PERIOD_CLOSED` / `SELF_REVIEW_FORBIDDEN` / `LEAVE_BALANCE_INSUFFICIENT` |
| 敏感数据解密 | 403 + 审计 | `SENSITIVE_FORBIDDEN` 同时在 `sys_oper_log` 记一条 |

## 九、权限与数据隔离

### 9.1 六个角色、14 个权限点

权限点：`org:read|write` · `employee:read|write|read_sensitive` · `attendance:read|write` · `leave:approve` · `payroll:read|write` · `recruit:read|write` · `perf:read|write`

| 角色 | 组织/档案 | 敏感字段 | 考勤 | 假勤审批 | 薪酬 | 招聘 | 绩效 |
|---|---|---|---|---|---|---|---|
| `hrm_admin` HR 专员 | 读写 | ✅ | 读写 | ✅ | 只读 | 读写 | 只读 |
| `hrm_manager` HR 主管 | 读写 | ✅ | 读写 | ✅ | 读写 | 读写 | 读写 |
| `payroll_specialist` 薪酬专员 | 只读 | ✅ | 只读 | ❌ | 读写 | ❌ | 只读 |
| `dept_manager` 部门经理 | 本部门只读 | ❌ | 本部门只读 | ✅ | ❌ | ❌ | 本部门读写 |
| `employee` 员工 | 仅本人 | 仅本人 | 仅本人 | ❌ | 仅本人工资条 | ❌ | 仅本人 |
| `admin` 超管 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

设计意图：**薪酬与人事分离**。HR 专员天天碰档案，但不该随手看全员薪资；薪酬专员的活是算钱，不该去动花名册。这样出问题时，「谁能改什么」在审计里说得清。

### 9.2 行级隔离：不只靠权限矩阵

权限矩阵管「能不能进这个功能」，行级隔离管「能看到哪些行」。两件事不能混：

- **部门经理与员工**走 `org_path` 前缀过滤：`WHERE org_path LIKE CONCAT(#{myOrgPath}, '%')`，条件在 **Mapper 层强制拼接**，不接受前端传 `orgId` 就放开。
- **员工自助**不走权限矩阵，统一走 `/me` 系列端点，`employeeId` 从 token 取，**永远不接受请求参数**——这是防止越权查别人工资条最有效的一招。
- **薪酬明细**对部门经理只返回部门汇总（人数 / 总额），不返回个人金额；个人金额只能 HR 主管与薪酬专员看。

### 9.3 职责分离（SoD）

| 约束 | 位置 | 违反结果 |
|---|---|---|
| 算薪人不能复核自己算的批次 | `PayrollService.review()` | 409 `SELF_REVIEW_FORBIDDEN` |
| 员工不能审批自己的假勤单 | `LeaveService.callback()` / BPM 侧 | 409 `SELF_APPROVAL_FORBIDDEN` |
| 员工不能修改自己的档案与考勤 | 权限矩阵 + `/me` 只读 | 403 |
| 已封账批次任何人不可改 | `PayrollService` 状态机 + 触发器兜底 | 409 `PERIOD_CLOSED` |

## 十、技术架构与工程位置

| 层 | 技术 | 职责 |
|---|---|---|
| 后端 | JDK 21 · Spring Boot 3 · RuoYi 3.9.2 薄壳 | REST、事务、状态机 |
| 底座 | `openbiz-saas-core` | 多租户 / 权限 / 审计 |
| 审批 | [BPM 应用](/instances/office/bpm) | 转正 / 调岗 / 请假 / Offer 审批 |
| 持久 | MyBatis · Druid | 全语句带 `tenant_id` |
| 前端 | Vite · Vue 3 · TypeScript · Element Plus | HR 工作台 + 员工自助双视图 |
| 存储 | MySQL 8（`openbiz_hrm`） | 8 张业务表（M1 已落）+ RuoYi 系统表 33 张 |
| 加密 | AES-GCM + HMAC-SHA256 | 身份证 / 银行卡 / 手机号 |
| 跑批 | Spring `@Scheduled` + XXL-JOB（可选） | 日结、离职到期、合同到期、年假结转 |

```
[ Vue3/TS 前端 :5191 ] ──代理──▶ [ Spring Boot :18091 ]
                                     ├── web/controller     # 域动作 + 统一契约 + 自助 /me
                                     ├── service            # 状态机 · 编制 · 算薪 · SoD
                                     ├── domain             # 5 张迁移表 Map
                                     ├── job                # 日结 / 到期 / 结转
                                     ├── sensitive          # 加解密 + 审计
                                     └── saas-core + BPM client
                                             │
                                   [ MySQL openbiz_hrm ]
```

目录结构（M1 实际；M2–M4 按同一分层继续加包）：

```
openbiz-hrm-app/
├── backend/                          # 端口 18091
│   ├── src/main/java/com/openbiz/hrm/
│   │   ├── domain/                   # HrmOrg / HrmPosition / HrmHeadcount / HrmEmployee / HrmContract
│   │   ├── dto/HrmRequests.java      # 强类型请求体 + Bean Validation
│   │   ├── mapper/                   # 7 个 Mapper 接口 + resources/mapper/hrm/*.xml
│   │   ├── service/                  # 组织 / 岗位 / 编制 / 档案 / 合同 / 导入 / 权限 / 加解密
│   │   └── web/                      # 组织、员工、合同、会话 4 个控制器 + 统一错误契约
│   ├── e2e_hrm.py / run_hrm_e2e.sh   # 70 条断言
│   └── E2E-RESULT.txt
├── frontend/                         # Vue3 + TS，modules.ts 驱动 4 个实体
├── sql/                              # 0_base（RuoYi 33 表）· 1_0（8 张业务表 + 5 角色账号）
└── README.md
```

本地起服务（三步）：

```bash
mysql -u root -p123456 < sql/openbiz_hrm_0_base.sql
mysql -u root -p123456 openbiz_hrm < sql/openbiz_hrm_1_0.sql
cd backend && mvn -o clean package -DskipTests
java -jar target/openbiz-hrm-app.jar --server.port=18091 --ruoyi.captchaEnabled=false
cd ../frontend && npm run dev        # 5191，自动代理 /api 与 /login 到 18091
bash backend/run_hrm_e2e.sh          # 70 条断言
```

> 端口实测为 **18091**、前端 dev **5191**（18090 / 5190 已被其它服务占用）；`openbiz_hrm` 为独立库，租户物理隔离。

## 十一、里程碑与验收标准

| 里程碑 | 内容 | 覆盖 | 状态 |
|---|---|---|---|
| **D0** | 本 PRD（定位 / 建模 / 状态机 / 契约 / 权限 / 验收） | 设计 100% | ✅ 本文档 |
| M1 | 组织架构 + 员工档案 + 编制 + 合同 + 敏感加密 + 花名册导入 | 约 20% | ✅ 已验证（70 条断言） |
| M2 | 班次 + 日结 + 假勤（接 BPM）+ 月度汇总 | 约 40% | ✅ 已验证（138 条断言，3 项部分完成） |
| M3 | 薪酬参数 + 批次 + 算薪 + 工资条 + 导出 | 约 50% | 📋 |
| M4 | 招聘（职位→Offer→入职）+ 绩效（目标→发布） | 约 60% | 📋 |
| M5 | 培训 / 自助 / 报表 / 移动端 | 剩余 40% | 未设计 |

### M1 验收（8 条 · 已全部通过）

| # | 验收项 | 实测 |
|---|---|---|
| 1 | 建部门树三层，`orgPath` 正确；把父节点挂到自己的子孙下 → 409 | ✅ 根 `/1/`、子 `/1/2/`、孙 `/1/2/3/`；挂子孙 409 `ORG_CANNOT_MOVE_INTO_DESCENDANT`，挂自己 409 |
| 2 | 建岗位与编制，`available = total - used` 计算正确 | ✅ total=1 → available=1；扩编 3（已占 1）→ available=2 |
| 3 | 建档成功即占编制；编制满时建档 → 409，且**员工未落库** | ✅ used 0→1；第二次 409 `HEADCOUNT_EXHAUSTED` 且员工总数前后相等 |
| 4 | 工号重复 / 身份证重复 → 409，且不产生脏数据 | ✅ `EMP_NO_DUPLICATED` / `ID_CARD_DUPLICATED`（身份证靠 HMAC 哈希唯一键） |
| 5 | 列表接口身份证脱敏为 `410***********1234`，手机号 `138****8000` | ✅ 掩码在写入时算好存 `*_mask` 列，列表从不解密 |
| 6 | 持 `employee:read_sensitive` 调 `/sensitive` 返回明文并留审计；无权限 → 403 | ✅ 超管 / 薪酬专员 200 明文；部门经理 403 且写 `DENIED`；审计表 GRANTED≥2、DENIED≥1 |
| 7 | `PENDING → PROBATION → REGULAR` 全通；`RESIGNED → PROBATION` → 409 | ✅ 全链路通过，`regular_date` 落库，离职释放编制 used→0 |
| 8 | 合同到期提醒：`expiring?days=30` 命中 30 天内到期合同 | ✅ +20 天命中、+90 天不命中；合同号重复 409 |

补充已验证的工程约束：花名册导入 3 行样本（1 正常 / 1 工号重复 / 1 缺姓名）→ 成功 1、失败 2 并给出逐行原因；非法流转（岗位 `to=BAD`、员工 `RESIGNED → PROBATION`）均 409；部门经理建组织 / 建档均 403。

### M2 验收（10 条 · 9 条通过，1 条部分）

| # | 验收项 | 实测 |
|---|---|---|
| 1 | 日结跑批生成当日记录，同一天重跑两次结果**完全一致**（幂等） | ✅ 两次跑批 `should/actual/late/early/absent/leave` 完全一致 |
| 2 | 跨天班次（22:00–06:00）日结落在上班当天，工时不串日 | ✅ 记在 `2026-11-01`（上班当天），未串到次日 |
| 3 | 迟到 / 早退 / 缺卡分钟数计算与手工核算一致 | ✅ 迟到 10min / 早退 10min / 缺卡标记正确 |
| 4 | 请假单提交后进 BPM，审批通过回调 → `APPROVED`，日结 `leave_hours` 同步增加 | ✅ `leave_hours=3.00` 同步；`callback` 与 `approve` 双入口幂等 |
| 5 | 审批驳回 → `REJECTED`，日结不变 | ✅ 驳回后日结 `leave_hours` 不变 |
| 6 | 年假额度不足时提交 → 409 `LEAVE_BALANCE_INSUFFICIENT` | ✅ 不足即 409，单据停在 `DRAFT` |
| 7 | 销假（`APPROVED → CANCELLED`）回滚已扣额度，额度恢复 | ✅ `used` 回落，`available` 恢复 |
| 8 | 人工修正日结记 `manual_flag=1` + 原因，月度汇总随之变化 | ✅ `manual_flag=1` 且下一轮跑批不覆盖 |
| 9 | 月度汇总与日结逐日累加一致 | ✅ 按人 / 按部门两条口径均与逐日累加一致 |
| 10 | 部门经理只能看到本部门（含子部门）考勤，跨部门查询 → 403 或空集 | ✅ 部门经理见子树，普通员工只见自己（`/me` 强制取 token 身份） |

补充已验证的工程约束：假勤单状态机非法边 409（`APPROVED → REJECTED`、未知目标态）；自审批 409 `SELF_APPROVAL_FORBIDDEN`；同日重叠单据 409；打卡导入同一条重复导入不翻倍；E2E 连续两轮 138 条全绿（可重复执行）。

### M3 验收（12 条）

1. 建批次 `DRAFT`；重算覆盖不产生重复行（`uk(period_id, employee_id)` 生效）
2. 应发 = 各项之和，扣减 = 各项之和，`net = gross - deduction` 断言通过
3. 社保按参数版本基数上下限截断（低于下限按基数下限缴）
4. 累计预扣个税与手工按公式核算逐人一致（含跨月累计）
5. 入职当月按在职天数折算，分母是当月应出勤天数
6. 离职当月生成最后一张工资条，次月不再生成
7. 算薪人自己复核 → 409 `SELF_REVIEW_FORBIDDEN`
8. `PAID → CLOSED` 后改工资条 → 409 `PERIOD_CLOSED`
9. 已 `PAID` 批次 `rollback` → 409，不允许退回
10. 员工 `/payslips/me` 只能拿到本人；传别人 `employeeId` 无效
11. 部门经理看到部门汇总，看不到个人金额
12. 代发文件导出字段与银行模板一致（账号 / 姓名 / 金额 / 附言）

### M4 验收（8 条）

1. 职位发布 → 筛选 → 面试 → Offer → 接受，状态逐级流转，跳级 → 409
2. 招聘人数已满再接受 Offer → 409
3. Offer 接受生成 `PENDING` 员工并占编制，且与招聘记录双向可查
4. 目标权重合计 ≠ 100 → 400
5. 绩效周期 `SELF_REVIEW → MANAGER_REVIEW → CALIBRATION` 全通，打回路径可用
6. `PUBLISHED → CLOSED` 写绩效系数，系数进入下一薪酬批次
7. 部门经理只能评本部门员工，跨部门 → 403
8. 整个 M4 链路产出 1 名可入职员工 + 1 份绩效结果，数据可反查

> 目标：M1–M3 完成后 E2E 断言不少于 **60 条**（不追求数量，追求每条都能对应一个真实会出错的场景）。

## 十二、系统边界与集成

| 协同 | 链路 | 方向 | 现状 |
|---|---|---|---|
| BPM | 请假 / 加班 / 转正 / 调岗 / Offer 审批 | HRM → BPM → 回调 | 📋 BPM 已验收，HRM 侧回调契约待写 |
| OA | 待办聚合（我的假勤 / 我的审批） | OA ← HRM | 📋 未设计集成层 |
| RuoYi 用户 | 员工与 `sys_user` 绑定、离职停用 | HRM → 事件 | 📋 只发事件，不直接改 `sys_user` |
| 企业微信 / 钉钉 | 打卡数据、工资条推送 | 外部 → HRM | 📋 打卡走导入 / 开放接口先落事实 |
| ERP | 人力成本 → 费用凭证 | HRM → ERP | 📋 ERP 应收应付都还没有，先不接 |
| 门禁（IIoT） | 闸机刷卡记录作打卡源 | IIoT → HRM | 📋 二期，IIoT 已有设备侧数据 |
| 文件服务 | 简历 / 合同 / 证明材料 | HRM → 存储 | 📋 库内只存 URL |

原则：**独立库、不共享表**；同步走 OpenAPI，异步走领域事件；`tenantId` 全程透传；**人事主数据以 HRM 为准**。

一个诚实的判断：**HRM 的集成难点不在接口，在「同一个人在两套系统里的身份怎么对齐」**。BPM 的审批人、RuoYi 的 `sys_user`、企业微信的 `userid`、HRM 的 `employee_id` 是四套 ID。设计上应尽早确定 `employee_id` 为主键、其余为映射列（`openbiz_hrm_employee` 预留 `sys_user_id` / `wx_userid`），否则做到集成阶段会到处补映射表。

## 十二·补 · 场景覆盖率评估（M1+M2 现状实测）

> 这一节回答一个具体问题：**当前系统能应对多少比例的真实 HR 业务场景？**
> 口径：按「一个中型制造企业 HR 部门的日常事务清单」拆成 30 个可独立验收的场景，逐条对照代码，**不按模块数估算**（模块多不等于覆盖深）。

### 12·补.1 逐场景对照

| # | 业务场景 | 状态 | 依据 |
|---|---|---|---|
| 1 | 部门树建 / 改 / 平移 / 删 | ✅ | 物化路径 + 环检测 409 |
| 2 | 岗位定义与启停 | ✅ | 编码 + 名称唯一 |
| 3 | 编制数与已占数管理 | ✅ | 原子占用，409 不超编 |
| 4 | 员工建档（入职） | ✅ | 自动占编制 + 写任职段 |
| 5 | 工号 / 身份证唯一性拦截 | ✅ | 哈希唯一键 + 409 |
| 6 | 身份证 / 手机号加密与脱敏 | ✅ | 三列形态实测正确 |
| 7 | 解密审计（谁看了明文） | ✅ | GRANTED / DENIED 均留痕 |
| 8 | 花名册批量导入（Excel / CSV） | ✅ | 逐行独立事务 + 失败原因 |
| 9 | 转正（PROBATION → REGULAR） | ✅ | 自动写 `regular_date` |
| 10 | 离职（→ LEAVING → RESIGNED） | ✅ | 关任职段 + 释放编制 |
| 11 | 任职历史（一人多段） | ✅ | `employment` 表 |
| 12 | 入转调离变更留痕 | ⚠️ | 留痕有；**调岗 / 调薪单据未做** |
| 13 | 劳动合同签订与到期提醒 | ✅ | `expiring?days=N` |
| 14 | 班次定义（含跨天 / 弹性） | ✅ | 跨天下班时间须早于上班 |
| 15 | 手工排班 | ✅ | 重排改班次不新增行 |
| 16 | 按部门批量排班 | ✅ | `schedules/batch` |
| 17 | 打卡数据导入（幂等） | ✅ | 重复导入不翻倍 |
| 18 | 打卡开放接口 / 企微回调 | ❌ | **未做** |
| 19 | 每日日结跑批（幂等） | ✅ | 重跑结果完全一致 |
| 20 | 迟到 / 早退 / 缺卡核算 | ✅ | 分钟数与手工核算一致 |
| 21 | 跨天班次不串日 | ✅ | 记在上班当天 |
| 22 | 请假单提交 → 审批 → 回写日结 | ✅ | `leave_hours` 同步 |
| 23 | 加班单（工 / 休 / 法定三种倍率） | ⚠️ | 单据与 `ot_hours` 回写已通；**倍率与节假日日历未做** |
| 24 | 补卡申请回写日结 | ❌ | **审批后未补打卡流水** |
| 25 | 年假额度（司龄生成 / 扣减 / 结转） | ✅ | 封顶 40h + 原子扣减 |
| 26 | 人工修正日结 | ✅ | `manual_flag=1` 不被覆盖 |
| 27 | 月度考勤汇总（按人 / 按部门 / 重算） | ✅ | 与逐日累加一致 |
| 28 | 行级隔离（经理看子树 / 员工看自己） | ✅ | `/me` 强制取 token 身份 |
| 29 | 报表导出（Excel / 银行代发文件） | ❌ | **全库零导出端点** |
| 30 | 薪酬计算与工资条 | ❌ | M3 未开工 |

### 12·补.2 覆盖率结论

| 口径 | 覆盖 | 说明 |
|---|---|---|
| **P0 范围内（组织 + 档案 + 考勤 + 假勤）** | **约 93%** | 26 项里 23 项完全可用、3 项部分可用；补齐 3 个缺口即 100% |
| **PRD 设计的 6 模块全集** | **约 40%** | M1+M2 完工，M3 薪酬 / M4 招聘绩效为 0 |
| **真实 HR 日常事务全集（含薪酬 / 招聘 / 绩效 / 导出）** | **约 55%** | 30 个场景里 23 项完全可用、2 项部分、5 项缺失 |

### 12·补.3 三句话回答「能不能应对 60% / 80%」

1. **60%：能，而且现在就已经超过了。** 按真实事务清单算已到 **55%**，补上「导出 + 补卡回写 + 加班倍率」这 3 项（M2 收尾，约 1~2 天工作量）就到 **65%+**，再把 M3 薪酬的核心链路做出来，直接到 **80%**。
2. **80%：能，但前提是必须做 M3 薪酬。** 任何一家企业的 HR 系统如果算不出工资条，就不叫 HR 系统，只能叫「考勤台账」。**M3 是从 60% 跨到 80% 的唯一门槛**，M4 招聘绩效只贡献最后几个百分点。
3. **不建议现在做 M4。** 招聘与绩效是「锦上添花」，而导出、补卡、倍率是「不做就断链」——考勤数据算出来了却导不出来发给老板，等于没算。

### 12·补.4 M2 收尾的 3 个缺口（补完即 P0 100%）

| 缺口 | 缺什么 | 建议做法 |
|---|---|---|
| **补卡不回写** | 补卡审批通过后不生成打卡流水，日结仍是缺卡 | `approve()` 中识别 `bizType=MAKEUP` → 按 `startTime` 补一条 `punch` 流水 → 触发该日重结；需补 1 条 E2E |
| **加班无倍率** | 三种倍率类型可建单，但算出的是裸时长 | 新增 `holiday_calendar` 表（工作日 / 休息日 / 法定）+ `ot_hours` 按倍率换算薪资口径；或先存倍率不参与算薪（M3 再算） |
| **零导出** | 考勤汇总、花名册都导不出 | 最小实现：月度汇总导出 CSV（`Content-Disposition`），Excel 可用 POI 复用导入那套依赖 |

## 十三、风险与已知取舍

| 风险 | 说明 | 应对 |
|---|---|---|
| **合规风险** | 个税 / 社保规则各地不同且会变，代码写死必然过期 | 参数版本化 + 只做参考实现 + 页面明示「不承诺合规」 |
| **隐私合规** | 身份证、银行卡、薪资属个人敏感信息（《个人信息保护法》） | 加密落库、最小必要、脱敏展示、解密审计、可导出可删除 |
| **数据准确性** | 薪酬算错一次就失去信任，且难以挽回 | 全链路可复算 + 封账机制 + `net = gross - deduction` 落库前断言 |
| **考勤真实性** | 代打卡无法在软件层根治 | 只做数据接入，不做生物识别；异常（异地 / 极短间隔）出预警不拦截 |
| **范围膨胀** | HRM 是最容易「再加一个模块」的系统 | 明确不做清单（见 1.3）+ 6 模块封版，新增走 M5 |
| **重复造轮子** | 自建审批 / 表单会与 BPM、OA 冲突 | 审批一律委托 BPM，HRM 不写审批引擎 |
| **无人录入** | 演示系统最大的死因是「数据不进系统」 | P0 必须做 Excel 花名册导入，让历史数据一天内进得来 |

### 三个已定的取舍

1. **先做考勤还是先做薪酬？** 先考勤。薪酬依赖考勤数据，跳过考勤直接算薪只能造假数据，验收也验不出真问题。
2. **做不做员工自助？** P0 不做完整自助端，但 `/me` 系列接口从 M2 就开始建，否则后期补会推翻权限模型。
3. **做不做导入导出？** 导入是 P0（花名册），导出是 P1（工资表 / 代发文件）。中小企业对账就靠 Excel，这不是「锦上添花」。

## 十四、相关链接

- 模块总览：[04 办公自动化](/instances/office/)
- 流程底座：[BPM 业务流程管理系统](/instances/office/bpm)
- 协同应用：[OA 办公自动化系统](/instances/office/oa)
- 平台内核：[平台内核 · OpenBiz](/instances/platform)
- 同构参考：[ERP（已验收的完整设计文档样例）](/instances/business/erp)
- 技术实践：[功能开发 › 办公自动化](/apps/office/)

---

上一级：[04 办公自动化](/instances/office/) · [实例总览](/instances/)
