# 应用实例

> 规划中与已交付的软件项目实例总览 —— 与「功能开发」（技术实践）互补：这里看**项目**，那里看**方法**。

**项目状态图例**：✅ 已验证（有运行/测试证据） · 🔧 验证中/在建（代码存在，证据整理中） · 📋 规划中（尚未开始实现）

## 项目矩阵（5 大模块 × 3 个项目）

| 模块 | 项目 1 | 项目 2 | 项目 3 |
|---|---|---|---|
| [01 企业业务应用](/instances/business) | [CRM 客户关系管理系统](/instances/business/crm) | [ERP 企业资源管理系统](/instances/business/erp) | [项目管理系统](/instances/business/pms) |
| [02 工业数字化应用](/instances/industrial) | [设备资产管理系统 EAM](/instances/industrial/eam) | [生产执行管理系统 MES](/instances/industrial/mes) | [工业物联网监控系统](/instances/industrial/iiot) |
| [03 AI 应用](/instances/ai) | [AI 智能助手](/instances/ai/assistant) | [AI 知识库系统](/instances/ai/kb) | [AI 工作流与智能体平台](/instances/ai/agent-platform) |
| [04 办公自动化](/instances/office) | [OA 办公自动化系统](/instances/office/oa) | [BPM 业务流程管理系统](/instances/office/bpm) | [在线表单与数据收集系统](/instances/office/form) |
| [05 个人工具](/instances/tools) | [个人任务与时间管理系统](/instances/tools/task-time) | [个人知识库与笔记系统](/instances/tools/notes) | [开发者工具箱](/instances/tools/devtools) |

## 当前进展

- **✅ 已验证**：[ModelDesk · 本机多模态 AI 配测台](/apps/ai/modeldesk)（AI 应用方向，93 项单测通过 · v0.2.1 已发布）—— 是上表「AI 智能助手」方向第一个交付的实例
- **🔧 验证中/在建**：OpenBiz 工单系统（企业级 Java 全栈，见[功能开发 › 企业业务应用](/apps/business/)）；个人知识库与 Java Agent 示例（见[功能开发 › AI 应用](/apps/ai/)）
- **📋 规划中**：上表其余项目，各模块页内有功能规划与优先级说明

## 建设原则

- **不重复造轮子**：优先复用已有代码与组件（如工单系统扩展工序流转即覆盖 MES 核心场景），不为填满矩阵新建空壳项目
- **状态如实标注**：未开始的不伪装成进行中，进行中的不伪装成已完成
- **一个项目一个闭环**：每个项目从「可运行 → 可测试 → 有文档」再进入矩阵，完成标准见验收记录

---

上一级：[首页](/)
