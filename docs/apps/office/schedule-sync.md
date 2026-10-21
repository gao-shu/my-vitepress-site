# 日程与会议自动化

## 背景与问题

中小企业上了飞书/企微/钉钉之后，日历能力其实已经够用，但"会前会后"这一段还是手工的：

- **日程孤岛**：销售在企业日历、交付在 Google/Outlook、项目里程碑在任务系统，谁也看不到谁的忙闲，约个会来回三五条消息。
- **预约靠吼**："明天下午有空吗"刷屏，会议室谁先占谁得，冲突了现场再协调。
- **提醒不到位**：默认提醒只有一条，重要评审会前没人进会议链接。
- **纪要不落地**：会开完，纪要躺在个人文档里，任务没人领，下周复盘找不到上次结论。
- **会与任务脱节**：会上定的 action item 靠人抄进任务系统，抄漏是常态。

自动化要解决的不是"日历本身"，而是**围绕日程的这条链路**：同步 → 预约 → 提醒 → 纪要 → 任务闭环。

## 方案设计

链路设计：

```
各端日历（飞书/企微/Outlook）
        │ 增量同步（webhook 变更订阅 + 定时全量对账）
        ▼
  统一日程中心（归一化事件模型，标注来源）
   ├─► 忙闲查询 / 会议室自动推荐
   ├─► 会议预约（自动生成日程 + 会议链接）
   ├─► 分级提醒（T-24h / T-1h / T-10m）
   └─► 会后流程（纪要分发 → action item 转任务）
```

核心决策：

1. **同步用"订阅 + 对账"双保险**。日历平台支持变更订阅（如飞书日历事件订阅）时优先用推送；同时每天夜里做一次增量拉取对账，防止订阅漏事件。
2. **归一化事件模型**：`{event_id, source, organizer, start, end, attendees, room, external_id}`，`external_id` 记录各端原始 ID，回写时用它定位，避免重复创建。
3. **写操作走"单一写入方"**。预约只从一个入口发出，防止多端并发创建同一场会产生重复日程；冲突检测（忙闲 + 会议室占用）放在创建之前。
4. **提醒分级**，重要会议（评审、客户会）走多级提醒 + 点名主持人，普通例会只走默认提醒。

## 关键实现

**1. 增量同步与对账**

```python
# 变更订阅回调
@calendar_event_callback
def on_event_changed(ev):
    # ev.op in: create / update / delete
    with idempotency(ev.event_id + ev.seq):   # 幂等，防止重复投递
        upsert_local_event(normalize(ev))

# 每日对账：拉近 7 天变更，与本地比对
def daily_reconcile():
    remote = fetch_events(updated_after=now() - timedelta(days=7))
    for r in remote:
        local = find_by_external_id(r.external_id)
        if local is None:
            insert(normalize(r))
        elif local.hash != r.hash:
            update(local, r)
    # 本地存在但远端已删的，标记失效
```

**2. 忙闲查询 + 会议室推荐**

```python
def find_slot(attendees, duration_min, days_ahead=3):
    busy = merge_busy(load_busy(u, days_ahead) for u in attendees)  # 合并忙闲
    for slot in working_hour_slots(days_ahead, duration_min):
        if all(conflicts_with(slot, b) is None for b in busy):
            return slot
    return None

def book_room(slot, headcount):
    rooms = query_rooms(fits=headcount, free=slot)
    return pick(rooms)  # 按楼层/设备偏好排序取第一个
```

**3. 分级提醒**

```yaml
# 会议提醒规则
default:  [T-10m]
important:            # 评审、客户会议标记 important
  - { at: T-24h, to: organizer, channel: im }
  - { at: T-1h,  to: attendees, channel: im }
  - { at: T-10m, to: attendees, channel: im + 短信 }
```

提醒任务本质是延迟队列：日程创建/变更时**重算并重挂**提醒（日程被改期，旧提醒必须撤掉——直接改期不清理旧任务是最常见的重复提醒来源）。

**4. 纪要分发与任务联动**

```python
@meeting_ended
def post_meeting(meeting):
    # 1) 纪要归档：上传到固定知识库目录，按 日期-主题 命名
    url = wiki.upload(meeting.notes, path=f"会议纪要/{meeting.date}-{meeting.title}")
    # 2) 通知与会人，附纪要链接
    im.send_card(meeting.attendees, digest_card(meeting, url))
    # 3) 从纪要中提取 action item（AI 提取 + 人工确认），创建任务
    for item in extract_actions(meeting.notes):
        task_system.create(
            title=item.title, assignee=item.owner,
            due=item.due, source=f"meeting:{meeting.id}",
        )
```

action item 转任务保留 `source` 字段做回链，任务详情里能跳回会议纪要；同时**必须有人工确认**这步——AI 抽错责任人比不抽更麻烦。

## 落地效果

- 跨端日程归一后，约会出现"先查系统再问人"的转变，来回确认消息明显减少；会议室冲突在创建时就被拦下，不再到现场才发现。
- 重要会议的多级提醒让迟到/忘会情况减少，会前材料准备时间也更可控。
- 会后纪要自动归档到统一位置，复盘时检索不再依赖个人翻聊天记录。
- action item 半自动入任务系统后，"会上说的没人跟"的情况收敛——每个任务都能回链到来源会议。

以上为方案跑通后的典型表现，具体收益与团队会议密度相关。

## 小结

日程自动化的关键不在日历 API 本身，而在**链路完整性**：同步要订阅加对账，写入要单一入口防重复，提醒要分级且改期后清理旧任务，纪要和任务要形成闭环回链。把"会前预约—会中提醒—会后落地"串成一条流水线，日历才真正从"看时间的地方"变成"驱动协作的入口"。
