# Java 异常处理与 IO 流

## 本模块面试重点

- **异常体系与最佳实践**：区分 `Error` / `Exception`、运行时异常 vs 检查异常，知道项目里自定义业务异常的常见做法。
- **统一异常处理思路**：理解为什么不能到处乱写 `try-catch`，而是要通过全局异常处理器（如 Spring 的 `@ControllerAdvice`）统一兜底。
- **IO 使用规范**：BIO/NIO 基本概念（了解即可）、`try-with-resources` 正确关闭资源、避免文件 IO 导致的资源泄露。

---

### ❓ 面试官：Java 中的异常体系是怎样的？`Error` 和 `Exception` 有什么区别？
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
Java 的异常体系分为两大类：`Error`（错误，程序无法处理，如内存溢出）和 `Exception`（异常，程序可以捕获处理）。`Exception` 又分为 `RuntimeException`（运行时异常，非检查异常）和其他 `Exception`（检查异常，必须处理）。

**📝 详细分类与处理：**

1. **Error（错误）**：
   - 代表 JVM 层面的严重问题，程序无法恢复。
   - 典型例子：`OutOfMemoryError`（内存溢出）、`StackOverflowError`（栈溢出）。
   - **处理方式**：无法捕获，只能通过优化代码和 JVM 参数来避免。

2. **Exception（异常）**：
   - **检查异常（Checked Exception）**：编译期必须处理，否则编译不通过。
     - 典型例子：`IOException`（文件读写）、`SQLException`（数据库操作）。
     - **处理方式**：必须用 `try-catch` 捕获，或者在方法签名上用 `throws` 声明抛出。
   - **运行时异常（RuntimeException，非检查异常）**：编译期不强制处理。
     - 典型例子：`NullPointerException`、`ArrayIndexOutOfBoundsException`、`ClassCastException`。
     - **处理方式**：可以选择捕获，也可以不捕获（但程序会崩溃）。

**🌟 面试加分项（最佳实践）：**
"在实际开发中，我们通常遵循一个原则：**能用运行时异常就用运行时异常**。因为检查异常会强制调用方处理，导致代码里到处都是 `try-catch`，影响代码可读性。比如我们自定义业务异常时，通常继承 `RuntimeException`，而不是 `Exception`。"

---

### ❓ 面试官：`try-catch-finally` 的执行顺序是怎样的？`finally` 中的代码一定会执行吗？
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
`finally` 块中的代码**几乎总是会执行**，除非在 `try` 或 `catch` 中调用了 `System.exit(0)` 强制退出 JVM，或者线程被杀死。

**📝 详细执行流程：**

```java
try {
    // 1. 先执行 try 块
    int result = 10 / 0;
} catch (ArithmeticException e) {
    // 2. 如果 try 块抛出异常，执行 catch 块
    System.out.println("捕获到异常");
} finally {
    // 3. 无论是否有异常，finally 都会执行
    System.out.println("finally 执行");
}
```

**🔥 经典陷阱题（面试常考）：**
```java
public int test() {
    try {
        return 1;
    } catch (Exception e) {
        return 2;
    } finally {
        return 3;  // 最终返回什么？
    }
}
```
**答案：返回 3**。因为 `finally` 会在 `return` 之前执行，如果 `finally` 里也有 `return`，会覆盖掉 `try` 或 `catch` 中的返回值。

**🌟 实战应用场景：**
`finally` 通常用来**释放资源**，比如关闭文件流、数据库连接、网络连接等。即使业务代码抛异常了，资源也能被正确释放，避免资源泄漏。

---

### ❓ 面试官：`String`、`StringBuilder` 和 `StringBuffer` 的区别是什么？什么时候用哪个？
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
- `String`：**不可变**（immutable），每次拼接都会创建新对象，性能最差但线程安全。
- `StringBuilder`：**可变**，线程不安全，性能最高。
- `StringBuffer`：**可变**，线程安全（方法都加了 `synchronized`），性能比 `StringBuilder` 略低。

**📝 详细原理解析：**

1. **String 为什么不可变？**
   - `String` 类内部用 `final char[]` 存储字符，且没有提供修改这个数组的方法。
   - 每次 `str += "abc"` 操作，实际上会创建一个新的 `String` 对象，原来的对象变成垃圾等待回收。
   - **性能问题**：在循环中大量拼接字符串，会产生大量临时对象，导致频繁 GC。

2. **StringBuilder vs StringBuffer：**
   - 两者底层都是可变的字符数组，可以动态扩容。
   - `StringBuffer` 的所有方法都加了 `synchronized` 锁，保证多线程安全，但性能有损耗。
   - `StringBuilder` 没有锁，单线程环境下性能更高。

**🌟 使用场景建议：**
- **少量字符串拼接**：直接用 `+` 或 `String.concat()`，代码简洁。
- **循环中大量拼接**：必须用 `StringBuilder`（单线程）或 `StringBuffer`（多线程）。
- **字符串常量**：直接用 `String`，JVM 会做字符串常量池优化。

---

### ❓ 面试官：Java 中的 IO 流分为哪几类？`BIO`、`NIO`、`AIO` 有什么区别？
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
IO 流按流向分为**输入流（InputStream/Reader）**和**输出流（OutputStream/Writer）**；按数据类型分为**字节流**和**字符流**。`BIO`、`NIO`、`AIO` 是三种不同的 IO 模型。

**📝 详细分类：**

1. **字节流 vs 字符流**：
   - **字节流**：`InputStream`、`OutputStream`，处理二进制数据（图片、视频、文件）。
   - **字符流**：`Reader`、`Writer`，处理文本数据，内部会自动处理字符编码。

2. **三种 IO 模型对比**：
   - **BIO（Blocking IO，阻塞 IO）**：传统 IO，一个线程处理一个连接，线程阻塞等待数据。
   - **NIO（Non-blocking IO，非阻塞 IO）**：一个线程可以处理多个连接，通过 `Selector` 轮询事件。
   - **AIO（Asynchronous IO，异步 IO）**：基于事件回调，数据准备好后操作系统主动通知应用。

**🌟 实战应用（加分项）：**
"在 SpringBoot 项目中，我们通常使用 `Files.readAllLines()` 或 `Files.copy()` 等 NIO.2 的工具类来操作文件，比传统 BIO 更高效。在高并发网络编程中（如 Netty 框架），NIO 模型可以大幅提升服务器吞吐量，一个线程可以处理成千上万个连接。"