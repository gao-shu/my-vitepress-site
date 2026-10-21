# 审批与待办自动化

## 背景与问题

审批系统的悖论是：**流程本身已经电子化了，但"催办"和"知会"还停留在原始状态**。常见痛点：

- 审批发起了，审批人不知道，半天后才看到，业务方干着急。
- 一个人一天散落 5 个待办，分散在审批、任务、邮件三处，漏办没人兜底。
- 审批通过了，下游系统（ERP、台账、排期表）要人工再录一遍。
- 无人处理的单子堆到超时，出事了才回头查，谁压的单已经说不清。

这些都不是"审批引擎"的问题，而是审批**外围**的问题：触发、聚合、回写、催办、兜底。这篇讲的就是这一圈自动化怎么搭，以飞书审批为主要参照（企微、钉钉思路一致，API 名字不同）。

## 方案设计

围绕审批生命周期挂五个自动化点：

```
发起 ──► 审批中 ──► 通过/驳回 ──► 归档
 │          │           │
 ├─①触发通知 ├─④超时催办  ├─③状态回写（下游系统）
 │          │
 └─②待办聚合推送（每日汇总，覆盖所有渠道）
                │
                └─⑤异常兜底：回调丢失时的对账任务
```

设计原则：

1. **事件驱动为主，轮询对账为辅**。审批状态变更靠事件订阅（`approval_instance` 相关事件）推送；另起一个定时对账任务，把事件漏推的单子捞回来。只靠一条腿必然出事。
2. **待办聚合而非逐条推送**。单条审批事件即时通知（审批人要快），但普通关注人收的是"每日待办摘要"，避免消息轰炸。
3. **回写必须幂等**。下游系统按审批单号做幂等键，重复回写不产生副作用。
4. **兜底靠对账**。定时任务扫描"审批中超过 N 小时且状态未同步"的单子，主动拉取最新状态修正。

## 关键实现

**1. 审批事件订阅与即时通知**

```java
// 事件回调：审批实例状态变更
@EventHandler(event = "approval_instance")
public void onApprovalChanged(ApprovalEvent ev) {
    String instanceCode = ev.getInstanceCode();
    // 幂等：同一状态只处理一次
    if (!dedupStore.tryAcquire(instanceCode + ":" + ev.getStatus())) {
        return;
    }
    switch (ev.getStatus()) {
        case "APPROVED" -> {
            notifyInitiator(ev, "已通过");
            downStreamWriteBack(ev);   // ③ 状态回写
        }
        case "REJECTED" -> notifyInitiator(ev, "被驳回");
        case "PENDING"  -> notifyApprover(ev); // ① 提醒审批人
    }
}
```

**2. 待办聚合推送（每日摘要）**

```python
# 每天 9:30 汇总每个人的未处理事项
def push_daily_digest():
    todos = fetch_pending_todos()  # 来自审批、任务、工单多个系统
    by_user = group_by(todos, key="assignee_open_id")
    for open_id, items in by_user.items():
        if not items:
            continue
        card = render_digest_card(items)   # 一张卡片列出全部待办
        feishu.send_card(open_id, card)
```

聚合的关键是**统一的待办模型**：`{来源系统, 单号, 标题, 截止时间, 处理链接}`。各系统先映射到这个模型，推送层就不用关心来源差异。

**3. 状态回写（幂等）**

```java
public void downStreamWriteBack(ApprovalEvent ev) {
    // 幂等键：审批单号 + 状态
    String idemKey = ev.getInstanceCode() + ":" + ev.getStatus();
    erpClient.syncStatus(ev.getBizOrderId(), ev.getStatus(), idemKey);
    // 下游按 idemKey 去重，重复调用直接返回成功
}
```

**4. 超时催办**

```python
# 定时任务：每小时扫描
def nudge_overdue():
    for inst in query_pending(hours_gt=24):
        elapsed_hours = hours_since(inst.create_time)
        level = "提醒" if elapsed_hours < 48 else "升级"
        send_nudge(inst.approver_id, inst, level)
        if elapsed_hours >= 72:
            notify_approvers_manager(inst)  # 升级给上级
```

催办要有梯度：24 小时提醒 → 48 小时加强 → 72 小时抄送上级，而不是无脑重复发同一条。

**5. 异常兜底（对账）**

```python
def reconcile():
    # 审批中超过 6 小时但本地状态未更新的单子，主动拉取
    for inst in query_stale_sync(hours_gt=6):
        remote = feishu.get_approval_instance(inst.instance_code)
        if remote.status != inst.local_status:
            handle_status_change(inst, remote.status)  # 走与事件相同的处理逻辑
```

注意兜底处理要**复用事件处理链路**，否则两条路径会写出两套行为，日后必然分叉。

## 落地效果

- 审批人基本实现"事件即达"，从发起提醒到处理的间隔显著缩短；普通同事不再被逐条审批消息打扰，改为每天一封摘要。
- 下游系统免去手工二次录入，回写幂等后未再出现重复入单。
- 超时催办上线后，长期压单的情况大幅减少，管理侧能直接看到"谁的单子积压"。
- 对账任务实际触发频率通常很低（说明事件链路较稳），但它存在与否决定了系统的下限——即使某次回调全部丢失，也能在几个小时内自动修正。

具体时长与数量依团队规模和审批量而定，此处不列具体生产数字。

## 小结

审批自动化不在审批引擎里，而在它周围：**①即时触发让人快处理，②聚合推送让人不漏事，③幂等回写让数据不错，④分级催办让流程不卡，⑤对账兜底让链路不失**。五件事都不难，难的是意识到"只订阅事件不做对账"不可靠。先把回写幂等和对账这两条数据一致性的底线守住，再谈体验优化。
