# Python 面试 · 进阶特性

---

## 高频问法

1. 装饰器原理？能写个简单的吗？  
2. 生成器与迭代器关系？  
3. GIL 对你选型的影响？  
4. `*args` / `**kwargs` 与解包？  
5. 上下文管理器 `with` 是什么？  
6. 面向对象：继承、`super`、鸭子类型？  
7. `@staticmethod` / `@classmethod` / 实例方法？

---

## 口述参考

### 1）装饰器

本质：接收函数、返回新函数（或可调用对象）。  
常用：日志、鉴权、重试、计时。  
要点：用 `functools.wraps` 保留原函数元信息。

口述可以背结构：

```text
def deco(fn):
    def wrapper(*args, **kwargs):
        # before
        result = fn(*args, **kwargs)
        # after
        return result
    return wrapper
```

带参数的装饰器再包一层——知道有这回事即可。

### 2）生成器

实现了迭代协议；`yield` 产出值并暂停。  
对比一次返回大 list：省内存、可流水线。  
`for` 背后是迭代器协议（`__iter__` / `__next__`）。

### 3）GIL

- CPU 密集：多线程加速有限 → `multiprocessing` 或把重计算放到 Java/原生扩展。  
- IO 密集：等网络/磁盘时会释放 GIL，多线程或 asyncio 有收益。  
面试金句：**先分清瓶颈是 CPU 还是 IO。**

### 4）解包

`*` 拆序列，`**` 拆字典；拼参数、合并 dict（注意覆盖）常用。

### 5）`with`

上下文管理器：保证进入/退出（关文件、释锁、关连接）。  
`with open(...) as f` 比手写 `open/close` 更安全。

### 6）OOP 口述

- 一切皆对象；鸭子类型：「像就会用」，靠约定而非强接口（也可 Protocol/ABC）。  
- 多继承存在，实际少用钻石继承炫技。  
- `super()` 按 MRO 找父类方法。

### 7）三种方法

| 类型 | 第一个参数 | 用途 |
|------|------------|------|
| 实例方法 | self | 普通行为 |
| classmethod | cls | 工厂方法、改类级状态 |
| staticmethod | 无 | 挂在类命名空间的函数 |

---

## 追问预备

- 「协程和生成器？」→ async/await 是协程；生成器是迭代工具，别混为一谈。  
- 「类型注解？」→ 提示与工具检查用，运行时默认不强制（除非 pydantic 等）。
