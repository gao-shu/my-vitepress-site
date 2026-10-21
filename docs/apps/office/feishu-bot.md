# 飞书机器人开发实践

## 背景与问题

中小企业上飞书，第一诉求通常不是"再造一个 OA"，而是把散落在群里的信息收拢起来：工单状态变了要@人、审批通过了要通知发起人、日报要机器人准时发。这些需求最后都会落到同一个东西上——飞书机器人。

真正动手之后，踩坑主要集中在四个地方：

1. **自建应用 vs 商店应用没分清**：内部用就该走自建应用，别去折腾商店应用的上架审核。
2. **事件订阅的验证逻辑写不对**：URL 验证（challenge 校验）是第一关，很多人卡在加密模式（Encrypt Key）上。
3. **权限开少了**：能收消息不代表能发卡片，能发消息不代表能读通讯录，每次漏权限都要回后台改配置等生效。
4. **消息卡片交互是异步的**：按钮点了之后走回调，很多从传统 Web 转过来的人会下意识去找"同步返回"，找不到。

所以这篇按一条真实落地的链路来讲：建应用 → 订事件 → 验签鉴权 → 收发消息 → 卡片交互 → 常见坑清单。

## 方案设计

整体链路分四层：

```
飞书开放平台（事件/回调）
        │  HTTPS 回调
        ▼
  回调接入层（验签、解密、challenge 应答、幂等去重）
        │
        ▼
  业务处理层（消息路由、指令分发、审批事件处理）
        │
        ▼
  出口层（调用开放 API 发文本/卡片，tenant_access_token 缓存）
```

关键设计决策：

- **事件订阅用"长连接"模式优先**。飞书支持 WebSocket 长连接接收事件（SDK 里 `ws.Client`），内网开发机不用公网回调地址，省掉内网穿透这一步；生产环境有固定出口 IP 时再视情况切回 webhook。
- **回调只做"接收 + 快速返回"**。飞书对回调响应有时延要求，业务逻辑一律丢队列异步处理，处理完再调 API 回消息。
- **幂等靠 event_id**。同一个事件飞书可能重推，用 `event_id` 落库去重，比什么都管用。
- **token 必须缓存**。`tenant_access_token` 有效期约 2 小时，每次请求都去取会撞限流，本地缓存 + 过期前刷新是标配。

## 关键实现

**1. URL 验证与验签（webhook 模式）**

```go
// 飞书事件回调：处理 URL 验证 challenge
type CallbackReq struct {
    Challenge string `json:"challenge"`
    Token     string `json:"token"`
    Type      string `json:"type"`
    Encrypt   string `json:"encrypt"` // 加密模式下才有
}

func HandleCallback(c *gin.Context) {
    var req CallbackReq
    c.BindJSON(&req)
    if req.Type == "url_verification" {
        c.JSON(200, gin.H{"challenge": req.Challenge})
        return
    }
    // 加密模式：AES-256-CBC 解密 Encrypt 字段
    plain := aesDecrypt(req.Encrypt, encryptKey)
    event := parseEvent(plain)
    if !dedup(event.EventID) { // 幂等
        return
    }
    go handleEvent(event) // 异步处理，尽快返回 200
    c.Status(200)
}
```

**2. 发消息：token 缓存 + 重试**

```go
var tokenCache sync.Map // key: app_id, value: {token, expireAt}

func sendText(receiveID, text string) error {
    token, err := getTenantToken() // 缓存命中则直接用
    if err != nil {
        return err
    }
    body := map[string]any{
        "receive_id": receiveID,
        "msg_type":   "text",
        "content":    `{"text":"` + text + `"}`,
    }
    // POST /open-apis/im/v1/messages?receive_id_type=open_id
    // 429 时按指数退避重试（最多 3 次）
    return postWithRetry(msgURL, token, body, 3)
}
```

**3. 卡片交互回调**

按钮点击后飞书发回 `card.action.trigger` 事件，处理函数更新卡片状态再回写：

```go
func HandleCardAction(c *gin.Context) {
    var act CardAction
    c.BindJSON(&act)
    go func() {
        ok := processAction(act.Action.Value)
        // 调 PATCH /open-apis/im/v1/messages/{message_id} 更新卡片
        updateCard(act.OpenMessageID, renderCard(ok))
    }()
    // 同步返回 {"toast": {"type":"success","content":"已处理"}}
    c.JSON(200, gin.H{"toast": gin.H{"type": "info", "content": "处理中"}})
}
```

**4. 权限清单（申请前先对表）**

| 场景 | 所需权限（scope） |
|------|------------------|
| 机器人主动发消息 | `im:message:send_as_bot` |
| 接收群 @ 消息 | `im:message.group_at_msg:readonly` |
| 读单聊消息 | `im:message.p2p_msg:readonly` |
| 获取用户 open_id | `contact:user.base:readonly` |
| 审批事件订阅 | `approval` 相关事件 + 对应读权限 |

权限改完不是立即生效，等 1～2 分钟再测，别急着怀疑代码。

## 落地效果

- 内部工单类消息全部收进机器人：状态变更自动推到对应负责人，不再靠人在群里吼。
- 群里 @ 机器人查数据成为常用入口，常见问题不用再翻表。
- 卡片审批（同意/驳回按钮）替代了"打开后台—找到单—点处理"三步，处理动作明显变短。
- 事件幂等 + 异步处理上线后，未再出现"飞书重推导致重复处理"的问题。

以上是方案上线后的典型表现，具体效果因团队使用强度而异。

## 小结

飞书机器人本身不复杂，难点在**工程细节**：验签解密、事件幂等、token 缓存、异步回调、权限对表。把这五件事在开发第一天就定下来，后面加功能（更多事件、更多卡片）就是在既有骨架上填肉，而不是推倒重来。自建应用 + 长连接订阅这条路线，对内网开发和中小企业最省事，建议作为默认选择。
