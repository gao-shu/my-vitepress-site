# Python · 01 语言基础

> **这不是从零开始的 Python 教程**，而是给 **已有 Java 经验** 的人用的快速迁移 + 长期速查。  
> 目标：能马上读懂、改掉日常脚本与小服务里的基础写法。  
> 动态类型代价、GIL、asyncio → [02 核心能力](./02-core.md)；FastAPI 等 → [03 框架与生态](./03-frameworks.md)。

---

## 01 变量与类型

```java
// Java
String name = "Meng";
int age = 30;
var city = "Luoyang";          // 局部类型推断
final int MAX = 100;           // 常量
String empty = null;
int n = Integer.parseInt("42");
```

```python
# Python
name: str = "Meng"             # 注解可选，运行时不强制
age = 30                       # 动态类型，赋值即绑定
city = "Luoyang"               # 类型推断靠工具（IDE / pyright）
MAX = 100                      # 约定全大写；无 final 关键字
empty = None                   # 不是 null
n = int("42")                  # 类型转换：int / str / float / bool
```

| Java | Python |
|------|--------|
| `String` | `str` |
| `int` / `Integer` | `int`（任意精度） |
| `boolean` / `Boolean` | `bool`（`True` / `False`） |
| `double` | `float` |
| `null` | `None` |
| `final` | 无语言级常量；模块级全大写约定 |

---

## 02 字符串

```java
String s = "hi " + name;
String f = String.format("hi %s", name);
String multi = """
    line1
    line2
    """;                       // Java 15+ text block
```

```python
s = "hi " + name
f = f"hi {name}"               # 首选
# 或 "hi {}".format(name) / "%s" % name（少用）
multi = """line1
line2"""
# 或 multi = "line1\nline2"
```

日常够用：`len(s)`、`s.strip()`、`s.split(",")`、`s.startswith(...)`、`"," .join(list)`。  
不要背几十个 API；缺了再查。

---

## 03 数组与集合

| Java | Python | 注意 |
|------|--------|------|
| `List` | `list` | 有序可变；字面量 `[1, 2]` |
| `Map` | `dict` | 字面量 `{"a": 1}`；key 须可哈希 |
| `Set` | `set` | `{1, 2}`；空集合必须 `set()`（`{}` 是空 dict） |
| 数组 `T[]` | 一般用 `list` | 定长数值阵偶用 `array` / numpy（非基础必学） |

```java
List<String> list = new ArrayList<>();
list.add("a");
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
Set<String> set = new HashSet<>();
```

```python
lst = ["a"]
lst.append("b")
mp = {"a": 1}
mp["b"] = 2
st = {"a", "b"}
```

**不等价处：** Python `list` 可混类型；Java 泛型在编译期约束。`dict` 保持插入序（3.7+），不要当成并发安全结构。

---

## 04 条件与循环

```java
if (x > 0) { ... } else if (x == 0) { ... } else { ... }
switch (x) { case 1 -> ...; default -> ...; }
for (int i = 0; i < n; i++) { ... }
for (String s : list) { ... }
while (ok) { ... }
```

```python
if x > 0:
    ...
elif x == 0:
    ...
else:
    ...

# 3.10+ 结构化匹配（简单枚举可用；复杂别硬上）
match x:
    case 1:
        ...
    case _:
        ...

for i in range(n):
    ...
for s in lst:
    ...
while ok:
    ...
# break / continue 语义与 Java 相同
```

运算符：`&&`→`and`，`||`→`or`，`!`→`not`。  
相等比较日常用 `==`；身份用 `is`（尤其 `is None`）。

---

## 05 函数

```java
int add(int a, int b) { return a + b; }
```

```python
def add(a: int, b: int = 0) -> int:
    return a + b

def sum_all(*args: int) -> int:      # 可变参数
    return sum(args)

add2 = lambda x, y: x + y            # 仅极短表达式
nums = [1, 2, 3]
list(map(lambda x: x * 2, nums))     # 或 [x * 2 for x in nums]
```

| 点 | Python |
|----|--------|
| 定义 | `def` |
| 默认参数 | 支持；**禁止** `def f(a=[])` 可变默认 |
| 可变参数 | `*args` / `**kwargs` |
| 匿名函数 | `lambda`（能力弱于 Java 多语句 lambda 写法） |
| 函数作参数 | 一等公民，直接传 |

> 装饰器、生成器、闭包陷阱 → 放到 **02 核心能力**，此处不展开。

---

## 06 类与对象

只保留最小用法；继承 / 多态 / 元类 → **02**。

```java
public class User {
  private String name;
  public User(String name) { this.name = name; }
  public String getName() { return name; }
}
```

```python
class User:
    def __init__(self, name: str):
        self.name = name

    def get_name(self) -> str:
        return self.name

u = User("Meng")
```

- 实例方法第一个参数必须是 `self`  
- 字段在 `__init__` 里挂到 `self` 即可  
- 无 `public/private` 关键字；`_name` 约定内部，`__name` 名称改写（少用）

---

## 07 模块与依赖

| Java | Python |
|------|--------|
| `package` / `import` | `import x` / `from x import y` |
| Maven / Gradle | `pip` + 需求文件（`requirements.txt`）或 `uv` / `poetry` |
| classpath | **venv** 虚拟环境（一项目一环境） |

```python
# 同目录 / 包内
from pathlib import Path
import json
```

目标：看懂真实项目里「哪个文件是入口、依赖装在哪」。完整工程化 → [04 工程实践](./04-engineering.md)。

---

## 08 Java → Python 语法速查

| Java | Python |
|------|--------|
| `System.out.println(x)` | `print(x)` |
| `null` | `None` |
| `true` / `false` | `True` / `False` |
| `List` | `list` |
| `Map` | `dict` |
| `Set` | `set` |
| `&&` / `\|\|` / `!` | `and` / `or` / `not` |
| `for (int i=0;i<n;i++)` | `for i in range(n):` |
| `for (T x : list)` | `for x in list:` |
| `String.format("%s", a)` | `f"{a}"` |
| `list.add(x)` | `list.append(x)` |
| `map.put(k,v)` | `map[k] = v` |
| `map.get(k)` | `map.get(k)` 或 `map[k]`（缺 key 抛错） |
| `new User()` | `User()` |
| `this` | `self` |
| `final int X = 1` | `X = 1`（约定） |
| `Integer.parseInt(s)` | `int(s)` |
| `equals` | `==`（字符串直接比） |
| `a == b`（引用） | `a is b` |
| 文件末不分号 | 缩进定块，无 `;` |

下一篇（先别提前学完）：[02 核心能力](./02-core.md)
