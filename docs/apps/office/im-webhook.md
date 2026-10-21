# 企微/钉钉消息推送与 Webhook

## 背景与问题

中小企业IM三件套——飞书、企微、钉钉——里，企微和钉钉的对外推送是运维和业务最常提的需求：监控告警进群、审批提醒到人、订单状态通知客户。但两家的接口形态差别不小，混着用很容易踩坑：

- **群机器人 Webhook** 最简单：拿到一个 URL 就能发，但只能发到固定群、没有交互、没有权限概念，URL 泄露等于群被轰炸。
- **应用消息** 才能发给指定人（企微 `touser`、钉钉 `userid`），但要走企业内部应用、建应用、拿 token、处理 `secret` 加密。
- **签名校验** 两家算法不同：企微机器人 Webhook 用 timestamp+secret 做 SHA256 拼接，钉钉自定义机器人要 `timestamp\nsecret` 做 HMAC-SHA256 再 Base64，还要求加签串中的换行符原样保留——很多人栽在转义上。
- **限流与重发** 没有统一答案：Webhook 通常 20 条/分钟量级，应用消息有 token 级限流，被限流后是丢还是重发、重发几次，需要自己定策略。

这篇按"能跑起来的最小方案"来讲：先分清两条通道，再把验签、限流、重发、模板四件事讲透。

## 方案设计

先明确选型规则：

| 维度 | 群机器人 Webhook | 应用消息 |
|------|------------------|----------|
| 发给谁 | 固定群 | 指定用户/部门/标签 |
| 交互 | 无 | 可跳转、可回调 |
| 鉴权 | URL + 签名 | access_token + secret |
| 适用 | 告警群、广播 | 个人通知、待办提醒 |

推荐的统一架构：

```
业务系统
   │  统一通知接口 notify(user/group, template, params)
   ▼
通知网关（选通道、渲染模板、限流、重试、记录发送日志）
   ├─► 企微 webhook / 企微应用消息
   └─► 钉钉 webhook / 钉钉工作通知
```

核心思想：**业务代码永远只调一个接口**，通道差异、验签、限流全部沉到通知网关。今天只用企微，明天加钉钉，业务侧零改动。

## 关键实现

**1. 企微群机器人 Webhook（带加签）**

```python
import hashlib, time, hmac, base64, requests

def wecom_group_send(webhook_url, secret, content):
    ts = str(int(time.time() * 1000))
    # 待签串：timestamp + "\n" + secret
    string_to_sign = f"{ts}\n{secret}"
    hmac_code = hmac.new(secret.encode(), string_to_sign.encode(), hashlib.sha256).digest()
    sign = base64.b64encode(hmac_code).decode()
    url = f"{webhook_url}&timestamp={ts}&sign={quote(sign)}"
    resp = requests.post(url, json={
        "msgtype": "text",
        "text": {"content": content},
    }, timeout=5)
    return resp.json()
```

钉钉自定义机器人思路相同，但签名字段名是 `sign`，且待签串同样要求**字面换行** `timestamp + "\n" + secret`——用 Python 三引号或 `"{}\n{}"` 都行，千万别写成转义后的 `\\n`（这是最高频的验签失败原因）。

**2. 应用消息：token 管理**

```python
class TokenManager:
    def __init__(self, corp_id, secret):
        self.corp_id, self.secret = corp_id, secret
        self.token, self.expire_at = None, 0

    def get(self):
        if time.time() > self.expire_at - 60:  # 提前 60s 刷新
            r = requests.get("https://qyapi.weixin.qq.com/cgi-bin/gettoken",
                             params={"corpid": self.corp_id, "secret": self.secret})
            data = r.json()
            if data.get("errcode") != 0:
                raise RuntimeError(f"gettoken fail: {data}")
            self.token, self.expire_at = data["access_token"], time.time() + data["expires_in"]
        return self.token
```

企微 `expires_in` 约 7200 秒，钉钉 `expires_in` 约 7200 秒，逻辑一致。刷新时要考虑**并发击穿**：多实例同时刷新会撞限流，用分布式锁或本地缓存 + 随机提前量。

**3. 限流与重发**

通知网关里放一个令牌桶（按通道维度），超限的消息进入本地延迟队列：

```python
async def send_with_retry(channel, payload, max_retry=3):
    delay = 1.0
    for attempt in range(max_retry + 1):
        await limiter.acquire(channel)          # 桶空则等待，天然限流
        code, msg = await do_send(channel, payload)
        if code == 0:
            return True
        if code in RETRYABLE:                    # 限流/网络类错误才重试
            await asyncio.sleep(delay + random.random())
            delay *= 2                           # 指数退避
        else:
            log_drop(channel, payload, msg)      # 非重试类：记录并丢弃
            return False
    return False
```

两个原则：**只有可重试错误才重发**（参数错误、无权限重发一百次也没用）；**重发带上幂等键**，避免"其实发成功了但超时"导致的重复轰炸。

**4. 模板消息设计**

不要让业务方拼 JSON 字符串。定义统一模板：

```yaml
# templates/order_paid.yaml
title: "订单已支付"
channels: [wecom_app, dingtalk_work]
body: |
  订单号：{order_id}
  金额：{amount} 元
  客户：{customer}
action_url: "https://erp.example.com/orders/{order_id}"
```

渲染层负责把 `action_url` 翻译成企微的 `btn_txt`/`url` 或钉钉的 `actionCard`。文本告警（监控场景）保留纯 text 通道，不用强套模板。

## 落地效果

- 监控告警、订单通知、审批提醒统一从一个通知网关出去，业务侧只看到一个 `notify()` 调用，新增 IM 通道时业务代码无需改动。
- 验签和限流下沉后，"群里突然收不到消息"类问题基本收敛为网关发送日志里的明确条目（限流排队、token 过期、验签失败各自可见）。
- 指数退避 + 幂等键上线后，网络抖动期间的通知丢失和重复发送都明显减少。

实际吞吐与到达率取决于消息量与通道配额，建议上线前用压测确认限流参数。

## 小结

企微/钉钉推送的工程要点可以归为四条：**通道选型先想清楚（webhook 还是应用消息）、验签细节逐字对（换行符是重灾区）、限流重发要有策略（可重试才重发、重发要幂等）、模板统一收口（业务不拼 JSON）**。把这四条沉到一个通知网关里，IM 推送就从"到处散落的 HTTP 调用"变成一个可观测、可演进的基础能力。
