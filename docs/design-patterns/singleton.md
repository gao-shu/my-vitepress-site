# 单例模式与线程安全

---

### ❓ 面试官：手写一个单例模式吧？为什么要用双重检查锁（DCL）？
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
单例模式确保一个类只有一个实例。面试中最常考的是**懒汉式（双重检查锁 DCL 实现）**，因为它既做到了延迟加载节约内存，又保证了高并发下的线程安全，同时性能还很高。

**📝 详细的演进与手写实战：**

**1. 饿汉式（最简单，但浪费内存）**
类加载时就创建好了，绝对线程安全，但如果这个对象很大且一直没被用到，会浪费内存。
```java
public class Singleton {
    private static final Singleton INSTANCE = new Singleton();
    private Singleton() {} // 私有构造
    public static Singleton getInstance() { return INSTANCE; }
}
```

**2. 懒汉式（非线程安全）**
用到了再创建，但并发下可能会创建出多个实例。
```java
public class Singleton {
    private static Singleton instance;
    private Singleton() {}
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton(); // 并发时这里会出问题
        }
        return instance;
    }
}
```

**3. 懒汉式（加普通 synchronized，性能差）**
直接在方法上加锁，安全了，但每次获取实例都要排队，效率极低。

**4. 终极方案：双重检查锁（DCL，面试必写）**
```java
public class SingletonDCL {
    // 【核心点1】必须加 volatile，防止指令重排序
    private static volatile SingletonDCL instance;

    private SingletonDCL() {} // 【核心点2】私有化构造器

    public static SingletonDCL getInstance() {
        // 第一重检查：如果不为空，直接返回，避免了大部分情况下的加锁性能损耗
        if (instance == null) {
            // 只有为空时，才加锁排队
            synchronized (SingletonDCL.class) {
                // 第二重检查：抢到锁之后再查一次，防止前一个线程刚释放锁，当前线程又去 new 了一次
                if (instance == null) {
                    instance = new SingletonDCL();
                }
            }
        }
        return instance;
    }
}
```

---

### ❓ 面试官：双重检查锁（DCL）单例中，为什么要加 volatile 关键字？如果不加会怎样？
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
加 `volatile` 是为了**禁止底层 CPU 和编译器进行指令重排序**。如果不加，在高并发下，可能会导致另一个线程拿到一个“半成品（未初始化完全）”的对象，从而报 `NullPointerException`。

**📝 详细底层原理解析（高分必杀技）：**

"面试官您好，这涉及到 JVM 底层创建对象的机制。"
在 Java 中，`instance = new Singleton();` 这行代码，看似只有一步，在底层字节码层面其实分为三步：
1. **分配内存空间**（给这个新对象找块地儿）。
2. **初始化对象**（调用构造方法，把成员变量赋上初始值）。
3. **将 instance 引用指向这块内存空间**（此时 instance 就不为 null 了）。

由于 CPU 存在指令重排序优化，这三步执行的顺序可能是 `1 -> 2 -> 3`，也可能是 `1 -> 3 -> 2`。
- 如果是 `1 -> 3 -> 2`，假设线程 A 执行到了 `3`，此时 instance 已经不为 null 了，但它还没有被初始化（执行 `2`）。
- 就在这时，线程 B 进来了，执行到第一重检查 `if (instance == null)`，发现不为空，**直接就把这个半成品对象拿去用了**。调用它里面的方法时，就会直接崩溃报错。
- 加上 `volatile` 后，就强制这三步必须严格按 `1 -> 2 -> 3` 执行，彻底杜绝了这个问题。

---

### ❓ 面试官：Spring 中的 Bean 是单例的吗？它是线程安全的吗？
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
Spring 默认的 Bean 作用域（Scope）是 **Singleton（单例）**。但 Spring **并不保证单例 Bean 的线程安全**。线程安全需要开发者自己去保证。

**📝 详细展开与实战经验：**

1. **为什么 Spring 默认用单例？**
   为了提高性能，减少频繁创建和销毁对象的开销。像 Controller、Service、Dao 这种都是无状态的，没必要每次请求都新建一个。
2. **什么是无状态和有状态？**
   - **无状态**：就是 Bean 里面没有成员变量去保存数据，只有方法，大家只调用它的逻辑。这种是绝对线程安全的。
   - **有状态**：如果你的 Service 里定义了一个全局的 `private int count = 0;`，并且在方法里对它进行 `count++`。在并发请求下，这个单例 Bean 就是非线程安全的。
3. **如何解决 Spring 单例 Bean 的线程安全问题？**
   - **最佳实践**：不要在 Controller/Service 里定义可变的全局成员变量。
   - 如果非要定义，就用 `ThreadLocal` 包起来，让每个线程都有自己的副本。
   - 或者把这个 Bean 的 Scope 改为 `prototype`（多例模式），让每次请求都创建一个新对象（但极其消耗性能，极少用）。