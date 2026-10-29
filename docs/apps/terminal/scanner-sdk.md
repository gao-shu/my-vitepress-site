# 扫码采集与扫描引擎对接

制造业现场，扫码是最高频的输入方式：产线报工、入库上架、拣货复核、设备点检、零件追溯，全靠扫一下。看起来只是"拿到一串码"，真做起来，光"怎么拿到"就有三条互不兼容的路，选错了后面全是补丁。

## 背景与问题

同一段业务代码，要跑在 Zebra、Honeywell、优博讯、新大陆、东大集成五六种设备上，而它们的扫描接口形态完全不同：

- **键盘模拟（HID）**：扫码枪把自己伪装成键盘，把码"打"进当前焦点输入框。零适配、什么设备都能用，但**拿不到码制**、**丢字符**、**和中文输入法打架**，快速连扫时还会串到别的控件。
- **广播 Intent**：Zebra 的 DataWedge、Honeywell 的 DataCollection 把扫描结果以广播形式发出来，能带 symbology（码制）、时间戳、长度。要额外配置 profile，不同厂商 action 名不一样。
- **厂商 SDK 直调**：直接拿 `Scanner` 对象，能控制补光、瞄准、触发模式、多码同屏。能力最全，但每家一套 API，还要处理 AAR 依赖与机型差异。

三条路各有各的坑，业务层如果直接贴着某一条写，换个机型就得重写。真正的问题不是"怎么扫码"，而是**怎么把三种来源收敛成一个稳定的内部接口**。

## 方案设计

中间加一层 `ScannerBridge`，业务只订阅统一事件，不关心码从哪来。

```
数据来源                    归一化                     消费
─────────                  ─────────                ──────────
DataWedge 广播  ─┐
DataCollection  ─┼─►  ScannerBridge  ──►  ScanEvent  ──►  业务订阅者
厂商 SDK 回调   ─┤     · 来源适配          code           （报工/入库/复核）
键盘模拟兜底    ─┘     · 去抖与幂等        symbology
                       · GS1 解析          ts / source
```

`ScanEvent` 只保留四个字段，够用且不会随设备变化：

```kotlin
data class ScanEvent(
    val code: String,        // 原始码内容
    val symbology: String?,  // 码制，键盘模拟时为 null
    val source: String,      // datawedge / honeywell / sdk / hid
    val ts: Long
)
```

设计原则三条：

1. **优先广播，退回键盘**。有 DataWedge/DataCollection 就用广播（拿得到码制），没有就退键盘模拟兜底。SDK 直调只在需要控制硬件（补光、多码、连续扫描）时才引入。
2. **去抖在桥接层做，不在业务里做**。现场最常见的 bug 是一次扫码触发两次提交，去抖逻辑散落在每个页面必然漏。
3. **码制必须往上传**。业务要靠码制区分"物料码（Code128）"和"工单二维码（QR）"，键盘模拟拿不到就得靠前缀规则补，这条规则要显式写下来，不能靠猜。

## 关键实现

**1. Zebra DataWedge 配置**

DataWedge 的关键不是代码，是 profile 配置：输出方式选 `Intent`，Intent 动作设为 `com.symbol.datawedge.api.RESULT_ACTION`，交付方式 `send via startService`，并勾选要输出的数据项。代码侧只做接收：

```kotlin
private val receiver = object : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) {
        if (intent.action != "com.symbol.datawedge.api.RESULT_ACTION") return
        val code = intent.getStringExtra("com.symbol.datawedge.data_string") ?: return
        val type = intent.getStringExtra("com.symbol.datawedge.label_type") // 如 CODE128
        bridge.emit(ScanEvent(code, type, "datawedge", System.currentTimeMillis()))
    }
}
```

Intent 输出有一个隐性代价：**跨进程广播有延迟**，高频连扫时可能乱序。产线节拍快的工位，要么改用 SDK 直调，要么在桥接层按时间戳排序。

**2. Honeywell DataCollection**

Honeywell 的默认 Intent 是 `com.honeywell.decode.intent.action.EDIT_DATA`，数据在 `data` extra 里，码制在 `charset`/`symbology` 相关字段。不同固件版本字段名有差异，接收端要做空值兜底，别直接 `getStringExtra` 后 `!!`。

**3. 键盘模拟的兜底**

没有广播能力的设备只能走 HID。做法是放一个不可见的 `EditText` 常驻焦点，靠**后缀回车**判定一次输入结束：

- 前后缀在扫描枪里配置成 `\r` 或 `\n`，两端一致，不要一边配回车一边配 Tab。
- 关掉输入法的联想与自动纠错，否则码里的字母会被"纠正"。
- 连续扫码间隔小于 200ms 时，Android 的输入事件可能合并，需要在 `afterTextChanged` 里按累计长度判断，而不是每次回调都当一条完整码。

**4. 码制与 GS1 解析**

工业物料常用 GS1-128（原 UCC/EAN-128），码里带应用标识符（AI）：`01` 商品码、`10` 批次、`17` 有效期、`21` 序列号。这类码用 FNC1 分隔，直接当字符串截取必错。判断方式：Code128 若首字符是 FNC1（ASCII 29 或 GS 字符），按 GS1 解析；否则按普通 Code128 处理。

```kotlin
fun parseGs1(raw: String): Map<String, String> {
    if (!raw.startsWith("\u001D") && !raw.startsWith("]C1")) return emptyMap()
    val body = raw.removePrefix("]C1").removePrefix("\u001D")
    // 按 AI 长度表切分，固定长度 AI（01/17）取定长，变长 AI（10/21）取到下一个 GS
}
```

**5. DPM 码与低对比度场景**

金属件、铸件用激光或点针直接打标（Direct Part Marking），表面无黑白对比，普通影像式扫描头读不出来。这类现场要注意：

- 选支持 DPM 的机型（并非所有 2D 扫描头都支持），并开启 DPM 模式。
- 打标质量比扫描头更重要：点阵密度不够、打得太浅，换什么设备都读不出。
- 补光角度比亮度关键，金属反光会让影像式失效，必要时改打标位置而不是加灯。

**6. 去抖与业务幂等**

桥接层做 300–800ms 的同码去重（按 `code` 缓存时间戳），业务层再做一次**业务幂等**：同一工单 + 同一物料 + 同一工序，重复提交返回上一次结果，不新建记录。两层都要有，只做前者挡不住用户手动重扫。

## 与后端的协作方式

扫码只是入口，真正的坑在"扫完到提交"之间：

- **本地码库缓存**：物料码、工单码的合法性校验放本地（启动时同步一份），弱网时也能即时给出"码无效"反馈，不用等接口超时。
- **提交时机**：报工类操作"扫完即提交"，复核类操作攒批提交。前者要求接口幂等，后者要求队列可恢复。
- **失败可追溯**：每次扫码记一条本地日志（码、时间、结果、失败原因），现场出问题时能直接导出，比远程猜快得多。

## 坑清单

1. 键盘模拟 + 中文输入法 = 码被替换成候选词，务必锁定英文输入。
2. DataWedge 的 profile 是**按应用绑定**的，换包名或改签名后要重新配置，升级包名不一致会突然收不到码。
3. 广播 Intent 在 Android 8+ 有后台限制，接收方必须在活跃页面注册，别放 Application 里。
4. 一次扫码触发两次：多半是同时注册了广播和 SDK 回调，两路都进了业务。
5. 码里带不可见字符（GS、回车），存库前要 trim，展示时要转义，否则前端渲染成空白。
6. 长码（>200 字符）在键盘模拟下容易截断，超过这个长度必须走广播或 SDK。
7. 连续扫描模式下没有"结束信号"，业务必须按单次事件处理，不能等回车。
8. 不同机型的扫描头景深差别很大，同一张标签有的 5cm 能读、有的要 30cm，验收要按最低配机型试。

## 选型建议

| 能力 | 什么时候必须 | 备注 |
|---|---|---|
| 广播 Intent | 需要码制区分 | Zebra/Honeywell 均支持，优博讯、新大陆多为 Intent 或广播 |
| SDK 直调 | 需要补光、多码同屏、连续扫描 | 引入 AAR，机型绑定，做适配层 |
| DPM 支持 | 金属件、铸件追溯 | 选型阶段就要确认，后期无法补 |
| 多码同屏 | 一箱多件、整托复核 | 一次成像读多个码，省重复动作 |
| WiFi 快速漫游 | 仓库边走动边扫 | 应用层仍要做提交重试与本地队列 |

结论：设备型号会一直变，接口不会。把"拿码"收敛到一个桥接层，上面无论换多少种手持机，业务代码都不用动。

---

上一级：[多端应用与现场交付](/apps/terminal/)
