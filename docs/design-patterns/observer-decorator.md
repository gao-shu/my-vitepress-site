# 观察者模式与装饰器模式

---

### ❓ 面试官：观察者模式（Observer Pattern）是什么？你在项目中用过吗？
*频率：🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
观察者模式定义了**一对多**的依赖关系。当一个对象（被观察者）的状态发生改变时，所有依赖它的对象（观察者）都会收到通知并自动更新。Java 中的 `java.util.Observer` 和事件监听机制就是观察者模式的典型应用。

**📝 详细原理解析：**

**1. 核心角色**：
- **Subject（被观察者）**：维护观察者列表，提供注册、删除、通知方法。
- **Observer（观察者）**：定义更新接口，收到通知时执行相应逻辑。

**2. 代码示例（简化版）**：
```java
// 被观察者
public class OrderService {
    private List<OrderObserver> observers = new ArrayList<>();
    
    public void addObserver(OrderObserver observer) {
        observers.add(observer);
    }
    
    public void createOrder(Order order) {
        // 创建订单
        System.out.println("订单创建成功");
        
        // 通知所有观察者
        for (OrderObserver observer : observers) {
            observer.onOrderCreated(order);
        }
    }
}

// 观察者接口
public interface OrderObserver {
    void onOrderCreated(Order order);
}

// 具体观察者
public class SmsObserver implements OrderObserver {
    @Override
    public void onOrderCreated(Order order) {
        System.out.println("发送短信通知");
    }
}
```

**🌟 实战应用场景（面试加分项）：**
"在 Spring 框架中，观察者模式被大量使用。比如：
- **事件机制**：`ApplicationEventPublisher` 发布事件，`@EventListener` 监听事件。
- **Spring 容器生命周期**：`ApplicationListener` 监听容器启动、关闭事件。
- **业务场景**：订单创建后，自动触发库存扣减、优惠券发放、积分增加等操作，用观察者模式实现解耦，代码非常优雅。"

---

### ❓ 面试官：装饰器模式（Decorator Pattern）是什么？它和代理模式有什么区别？
*频率：🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
装饰器模式是**在不改变原有对象的基础上，动态地给对象添加新功能**。它和代理模式的区别在于：**装饰器模式关注增强功能，代理模式关注控制访问**。

**📝 详细对比与实战：**

**1. 装饰器模式示例**：
```java
// 基础组件
public interface Coffee {
    String getDescription();
    double getCost();
}

// 具体组件
public class SimpleCoffee implements Coffee {
    @Override
    public String getDescription() { return "普通咖啡"; }
    @Override
    public double getCost() { return 10.0; }
}

// 装饰器
public abstract class CoffeeDecorator implements Coffee {
    protected Coffee coffee;
    public CoffeeDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
}

// 具体装饰器：加牛奶
public class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }
    @Override
    public String getDescription() {
        return coffee.getDescription() + ", 加牛奶";
    }
    @Override
    public double getCost() {
        return coffee.getCost() + 2.0;
    }
}

// 使用
Coffee coffee = new MilkDecorator(new SimpleCoffee());
// 结果：普通咖啡, 加牛奶，价格 12.0
```

**2. 装饰器 vs 代理模式**：
- **装饰器**：**增强功能**，可以多层嵌套（咖啡+牛奶+糖），客户端可以控制装饰过程。
- **代理**：**控制访问**，通常只有一层，客户端不知道代理的存在（透明代理）。

**🌟 实战应用（加分项）：**
"Java IO 流就是装饰器模式的经典应用。`BufferedReader` 装饰 `FileReader`，`InputStreamReader` 装饰 `InputStream`，可以灵活组合，实现功能叠加。"