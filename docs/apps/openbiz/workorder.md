# 工单系统 · OpenBiz 首个独立消费者
> 现为独立应用 `openbiz-workorder-app`（`E:/8.cangku/for-job/openbiz-workorder-app`）：独立后端（端口 18081）+ 独立前端（Vue3/TS）+ 独立数据库 `openbiz_workorder`。

> 实证：基于 OpenBiz 母仓 `openbiz-service` 域，将 `WorkOrderService` 作为 Maven 依赖直接消费，独立 Spring Boot 工程仅提供薄壳 Controller。验证「OpenBiz 多租户 + 工单状态机」可被外部工程零改造复用。

## 复用与自建

- **复用**：OpenBiz `openbiz-service` 的 WorkOrder 全生命周期状态机（`CREATED → ASSIGNED → ACCEPTED → COMPLETED / CANCELLED`）、租户隔离、幂等创建、Assignee 挂 RuoYi `sys_user`
- **自建**：独立工程的 2 个薄壳 Controller（Auth + WorkOrder）、登录、HTTP 端点暴露

## 业务闭环（E2E 已验证）

`login → create → assign → accept → complete`；已完成再取消被状态机拦截 `ILLEGAL_TRANSITION`

## 工程位置

`E:/8.cangku/for-job/openbiz-workorder-app`（含 `backend/E2E-RESULT.txt` 固化证据：登录→建单→派单→受理→完工全链路通过，非法流转被状态机拦截）

## 价值

证明「百套流水线」第 0 步可行：母仓构件 `mvn install` 后，外部工程可直接依赖消费，无需 fork 整个 OpenBiz。

---

上一级：[OpenBiz 试水实证](/apps/openbiz/)
