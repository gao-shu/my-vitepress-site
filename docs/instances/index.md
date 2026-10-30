# 应用实例

> 规划中与已交付的软件项目实例总览 —— 与「功能开发」（技术实践）互补：这里看**项目**，那里看**方法**。

**项目状态图例**：✅ 已验证（有运行/测试证据） · 🔧 验证中/在建（代码存在，证据整理中） · 📋 规划中（尚未开始实现）

## 项目矩阵（覆盖 01–04，05 暂无实例）

| 分类 | 实例 |
|---|---|
| [01 AI 智能应用](/instances/ai/) | [通用脚手架](/instances/ai/scaffold) · [AI 智能助手](/instances/ai/assistant) · [AI 知识库系统](/instances/ai/kb) · [AI 工作流与智能体平台](/instances/ai/agent-platform) · [Python AI 套件](/instances/ai/suite-py) |
| [02 工业数字化应用](/instances/industrial/) | [WMS 仓储管理系统](/instances/industrial/wms) · [MES 生产执行管理系统](/instances/industrial/mes) · [IIoT 工业物联网监控系统](/instances/industrial/iiot) |
| [03 企业业务应用](/instances/business/) | [平台内核](/instances/platform) · [CRM](/instances/business/crm) · [ERP](/instances/business/erp) · [PMS](/instances/business/pms) · [OA](/instances/office/oa) · [BPM](/instances/office/bpm) · [HRM](/instances/office/hrm) |
| [04 效率与自动化工具](/instances/tools/) | [个人任务与时间管理](/instances/tools/task-time) · [个人知识库与笔记](/instances/tools/notes) · [开发者工具箱](/instances/tools/devtools) |

## 当前进展

- **✅ 已验证**：
  - [ModelDesk · 本机多模态 AI 配测台](/apps/ai/modeldesk)（AI 应用方向，93 项单测通过 · v0.2.1 已发布）—— 是上表「AI 智能助手」方向第一个交付的实例
  - **01 AI 应用模块三个项目全部交付**（`E:\8.cangku\for-job\` 下 `ai-assistant` / `ai-knowledge-base` / `ai-agent-platform`）：共 630 个单元测试 + 39 项 E2E 检查全部通过，各含可执行 jar、前端工程与完整文档，详见各项目页
- **🔧 验证中/在建**：OpenBiz 工单系统（企业级 Java 全栈，见[功能开发 › 企业业务应用](/apps/business/)）；个人知识库与 Java Agent 示例（见[功能开发 › AI 应用](/apps/ai/)）
- **📋 规划中**：上表其余项目，各模块页内有功能规划与优先级说明

## 建设原则

- **不重复造轮子**：优先复用已有代码与组件（如工单系统扩展工序流转即覆盖 MES 核心场景），不为填满矩阵新建空壳项目
- **状态如实标注**：未开始的不伪装成进行中，进行中的不伪装成已完成
- **一个项目一个闭环**：每个项目从「可运行 → 可测试 → 有文档」再进入矩阵，完成标准见验收记录

---

上一级：[首页](/)
