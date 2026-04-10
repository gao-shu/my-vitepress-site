# 工厂模式与策略模式实战

---

### ❓ 面试官：你在项目中用过工厂模式吗？它解决了什么问题？
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
工厂模式的核心作用是**解耦**，把对象的**创建过程**和**使用过程**分开。它把复杂的创建逻辑封装起来，让调用方只需要“点菜”，不需要知道菜是怎么做的。

**📝 面试高分实战场景：**

"面试官您好，在我们之前的短信发送模块中我就用到了工厂模式。"

- **背景**：我们的系统不仅要接入阿里云短信，还要接入腾讯云短信和极光短信。
- **没用模式的烂代码**：在 Service 里写了一堆 `if-else`。
  ```java
  if ("aliyun".equals(type)) {
      AliyunSms sender = new AliyunSms("appKey1", "secret1");
      sender.send(phone, msg);
  } else if ("tencent".equals(type)) {
      TencentSms sender = new TencentSms("appKey2"); // 不同的构造参数
      sender.send(phone, msg);
  }
  ```
  这样做的坏处是：每次新增一家短信服务商，都要去改核心业务代码，严重违反了**开闭原则（对扩展开放，对修改关闭）**。

- **用工厂模式改造**：
  1. 定义一个统一的接口 `SmsSender`，包含 `send()` 方法。
  2. 写一个 `SmsFactory` 工厂类，提供一个 `getSender(String type)` 方法。
  3. 工厂类里面负责根据 type 帮你 `new` 出来具体的短信发送对象，并把复杂的鉴权密钥都塞好。
  4. 业务代码里就变成了一行：`SmsFactory.getSender(type).send(phone, msg);`，极其清爽。

---

### ❓ 面试官：那如果是非常复杂的、几十个条件的 if-else，你通常怎么优化？（策略模式的使用场景）
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
遇到成片的 `if-else` 或 `switch-case`，首选的重构利器就是 **策略模式（Strategy Pattern）**。如果有对象创建的需求，通常会结合**工厂模式**一起使用。

**📝 详细的“策略+工厂”重构套路（背熟这个套路）：**

**场景**：外卖系统的支付环节。用户可以选择微信支付、支付宝支付、银联支付、苹果支付。不同的支付渠道，底层的查单、退款、加密逻辑完全不同。

**传统做法的痛点**：在 `PayService` 里写了几百行的 `if-else`，一旦某一个支付渠道的接口变了，改代码很容易把其他渠道的逻辑搞崩。

**重构四步曲（高分剧本）：**

1. **定义策略接口（抽象）**
   定义一个 `PaymentStrategy` 接口，里面有 `pay()` 核心方法。
2. **编写具体的策略实现类**
   写 `WechatPayStrategy`、`AliPayStrategy` 等去实现那个接口，各自把复杂的支付逻辑封装在自己类里。互不干扰。
3. **结合工厂模式去管理策略（关键点）**
   "面试官，纯粹的策略模式依然需要 `if-else` 去决定用哪个策略类。为了彻底消灭它，我们会用一个**工厂类 + Map 缓存**。"
   - 在项目启动时，把所有的策略实现类塞进一个 `Map<String, PaymentStrategy>` 里。Key 是支付类型（如 "WECHAT"），Value 是对应的策略实现类对象。
   - 这在 SpringBoot 里极其好实现，只需利用 `@Autowired` 注入一个 Map 即可，Spring 会自动把所有实现了该接口的 Bean 放进去。
4. **业务层极致清爽的调用**
   ```java
   // 业务逻辑只需根据前端传来的 payType，从 Map 里拿出对应的策略直接执行
   PaymentStrategy strategy = strategyMap.get(request.getPayType());
   if (strategy == null) {
       throw new BusinessException("不支持的支付方式");
   }
   strategy.pay(order);
   ```

**🌟 加分项总结：**
"通过这种设计，未来如果要新增一种『数字人民币支付』，我只需要新建一个类实现 `PaymentStrategy` 接口，加上 `@Component` 注解即可。**原有核心业务代码一行都不需要改**，完美符合开闭原则！"