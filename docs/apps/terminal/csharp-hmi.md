# C# 上位机界面开发

## 背景与问题

产线旁的上位机（HMI）程序，典型任务是：连 PLC/扫码枪/电子秤/打印机，把数据显示出来、把指令发下去，再把结果回传 MES。写 Java/Web 的人转 C# 做这类程序，最先撞上的是三堵墙：

- **UI 线程与数据刷新的矛盾**：通信线程每 100ms 来一批数据，直接更新控件要么卡界面，要么跨线程异常。刷新频率和控件数量必须算账，不能无脑全刷。
- **通信链路不可控**：串口被拔、网口被交换机重启、设备断电重连，异常处理写不好，程序跑一周必挂一次。
- **与业务系统对接的边界**：上位机既要实时（毫秒级采集）又要走业务（HTTP 调 MES），两套节奏混在一起，界面和接口互相拖累。

WinForms 还是 WPF、数据怎么绑定、日志放哪，选错一个后面全是补丁。

## 方案设计

**选型：WinForms 还是 WPF**

| 维度 | WinForms | WPF |
|------|----------|-----|
| 学习成本 | 低，拖控件即所见 | XAML + 绑定 + 命令，有坡度 |
| 绘制能力 | GDI，复杂画面吃力 | 矢量绘制、动画、模板，适合组态画面 |
| 数据绑定 | 手写赋值或简单 Binding | Binding + INotifyPropertyChanged，天然契合高频刷新 |

经验做法：**简单表单/调试工具用 WinForms（出活快），需要流程图、动画、多画面切换的组态界面直接上 WPF**，不要在 WinForms 里手绘组态图。新项目默认 WPF + MVVM，存量 WinForms 不推倒重写。

**整体结构**：

```
WPF 视图（Xaml，只展示与输入） ↔ ViewModel（绑定/命令，界面状态）
  ↓
服务层：采集服务（串口/网口）、业务对接服务（HTTP）、报警服务
  ↓
通信层（SerialPort / TCP，含断线重连） → 设备（PLC、扫码枪、电子秤）
```

**关键原则**：通信在后台线程/异步任务里跑，UI 只订阅「值变了」的事件；数据刷新按周期批量合并（如 200ms 刷一帧），不是每个报文刷一次；与 MES 的对接走独立 HTTP 服务类，失败进重试队列，不阻塞采集；日志分级落文件，通信原始报文可开关采集，出问题能回放。

## 关键实现

**1. 串口通信与断线重连（后台线程 + 事件）**

```csharp
public class SerialLink
{
    private SerialPort _port;
    public event Action<string> DataReceived;
    public event Action<bool> LinkChanged;
    public void Open(string portName, int baud)
    {
        _port = new SerialPort(portName, baud, Parity.None, 8, StopBits.One) { ReadTimeout = 500 };
        _port.DataReceived += (_, _) =>
        {
            try { DataReceived?.Invoke(_port.ReadLine()); }
            catch (TimeoutException) { /* 无数据，忽略 */ }
            catch (Exception ex)
            {
                LinkChanged?.Invoke(false);
                TryReconnect(ex);   // 指数退避重连，最多间隔 30s
            }
        };
        _port.Open();
        LinkChanged?.Invoke(true);
    }
}
```

网口用 `TcpClient` + `async` 循环读，断开后退避重连；**所有重连逻辑集中在链路层**，业务层只感知 `LinkChanged` 事件来置界面状态灯。

**2. 实时数据刷新（合并 + 节流）**

采集线程只写共享的「最新值缓冲」，UI 用 `DispatcherTimer`（WPF，200~500ms）读缓冲统一刷新；或用 `INotifyPropertyChanged` + `Binding`，但高频字段（如实时重量）要合并通知，避免每秒几百次重绘：

```csharp
public class TagBuffer : INotifyPropertyChanged
{
    private readonly Dictionary<string, string> _values = new();
    public void Write(string tag, string val) => _values[tag] = val;
    public void Flush()  // 定时器里调用一次，统一通知
        => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("Item"));
}
```

经验阈值：单画面绑定项控制在百级以内，状态色变化用少量 Tag 触发，不要整表重绑。

**3. 与业务系统对接**

- 上位机作为 HTTP 客户端调 MES 的「报工/完工/查询」接口，封装成 `MesClient` 类，统一超时、token、序列化；实时数据与业务数据**分线程**：采集线程不发 HTTP，业务调用走 `Task.Run` + 队列；
- 回传失败进本地队列（SQLite/文件），按重试策略补发，附幂等键防重复报工；设备侧的单据号/流水号由上位机生成（时间戳 + 机器号），不依赖 MES 在线分配。

**4. 异常与日志**

- 分级：`Debug`（原始报文，可开关）、`Info`（上下线、报工结果）、`Warn`（重试）、`Error`（异常堆栈）；用 `Serilog` 滚动文件按天切分，保留 30 天；
- 全局兜底：`DispatcherUnhandledException` 记日志后决定是否退出——**现场程序宁可弹窗提示重启，也不要静默假死**；界面保留「通信状态、最后报文时间、重试队列长度」三个诊断位，运维不连远程桌面也能判断卡在哪。

## 落地效果（示意）

| 维度 | 常见症状（无设计时） | 本方案落地后（示意） |
|------|----------------------|----------------------|
| 界面刷新 | 数据一多就卡、偶发跨线程异常 | 节流批量刷新，界面稳定 |
| 链路异常 | 拔线后需重启程序 | 自动重连，状态灯提示 |
| 与 MES 对接 | 接口超时卡住采集 | 独立队列补发，幂等去重 |
| 排障 | 「昨天好好的」无从查起 | 分级日志 + 报文回放 |

稳定性提升最终要看平均无故障运行时长，需在现场统计连续运行天数来验证。

## 小结

上位机开发的核心是**把三种节奏分开**：设备采集的毫秒级节奏、界面刷新的秒级节奏、业务回传的事务级节奏，各自独立线程/队列，用事件和缓冲衔接。选型上 WPF + MVVM 适合中长期维护的组态界面，WinForms 留给小工具；通信层做好重连与状态事件，日志做到报文可回放——这三块做扎实，程序才能在产线上「放着不管」地跑。
