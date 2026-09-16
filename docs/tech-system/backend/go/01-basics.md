# Go · 01 语言基础

> **这不是从零开始的 Go 教程**，而是给 **已有 Java 经验** 的人用的快速迁移 + 长期速查。  
> 目标：能读开源小服务、改小工具、看懂基础语法。  
> Goroutine / Channel → [02 核心能力](./02-core.md)；Gin 等 → [03 框架与生态](./03-frameworks.md)。

---

## 01 变量与类型

```java
String name = "Meng";
int age = 30;
var city = "Luoyang";
final int MAX = 100;
String empty = null;
int n = Integer.parseInt("42");
```

```go
var name string = "Meng"
age := 30                    // 短声明，函数内最常用（类型推断）
const MAX = 100              // 常量
var empty *string = nil      // 指针 / slice / map / interface 的零值常为 nil
// 非指针 string 的零值是 ""，不是 nil
n, err := strconv.Atoi("42")
_ = err
```

| Java | Go |
|------|----|
| `String` | `string` |
| `int` / `Integer` | `int`（还分 `int32`/`int64`，按需） |
| `boolean` | `bool` |
| `double` | `float64`（常用） |
| `null` | `nil`（仅引用类型）；值类型有 **零值** |
| `final` | `const`（编译期常量） |

---

## 02 字符串

```java
String s = "hi " + name;
String f = String.format("hi %s", name);
```

```go
s := "hi " + name
f := fmt.Sprintf("hi %s", name)
// 原始字符串（可多行）
multi := `line1
line2`
```

常用：`len(s)`（**字节数**，不是 rune 数）、`strings.Contains` / `Split` / `Join`、`strings.Builder` 大量拼接。  
按字符遍历用 `for _, r := range s`。

---

## 03 数组与集合

| Java | Go | 注意 |
|------|-----|------|
| `List` | **slice** `[]T` | 真正日常容器；`array` `[n]T` 定长少直接当业务列表 |
| `Map` | `map[K]V` | 引用类型；读不存在的 key 得零值 |
| `Set` | **无内建 Set** | 常用 `map[T]struct{}` 模拟 |

```java
List<String> list = new ArrayList<>();
list.add("a");
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
```

```go
list := []string{"a"}
list = append(list, "b")

m := map[string]int{"a": 1}
m["b"] = 2
v, ok := m["a"]          // 双返回值判断是否存在
_ = v; _ = ok

set := map[string]struct{}{}
set["a"] = struct{}{}
_, exists := set["a"]
_ = exists
```

**不等价处：** slice 有 `len/cap`，底层数组可共享（截取后改元素会牵连）；`append` 可能分配新底层数组。并发写 map 会直接 fatal——基础阶段单 goroutine 用即可（并发 → 02）。

---

## 04 条件与循环

```java
if (x > 0) { ... } else { ... }
switch (x) { case 1: ...; default: ...; }
for (int i = 0; i < n; i++) { ... }
for (String s : list) { ... }
while (ok) { ... }
```

```go
if x > 0 {
    ...
} else if x == 0 {
    ...
} else {
    ...
}

// if 可带短语句
if v, err := strconv.Atoi(s); err == nil {
    _ = v
}

switch x {
case 1:
    ...
default:
    ...
}

for i := 0; i < n; i++ { ... }     // 传统 for
for i, s := range list { _ = i; _ = s }
for ok { ... }                       // while 用 for 条件
for { ... }                          // 无限循环
// break / continue 同语义；还有 break label
```

Go **没有** `while` 关键字。逻辑运算仍是 `&&` `||` `!`（不是 Python 的 and/or）。

---

## 05 函数

```java
int add(int a, int b) { return a + b; }
```

```go
func add(a, b int) int {
    return a + b
}

// 多返回值（日常标配）
func div(a, b int) (int, error) {
    if b == 0 {
        return 0, fmt.Errorf("div by zero")
    }
    return a / b, nil
}

// 可变参数
func sum(nums ...int) int {
    t := 0
    for _, n := range nums {
        t += n
    }
    return t
}

// 函数值 / 匿名函数
var op func(int, int) int = add
_ = op
fn := func(x int) int { return x * 2 }
_ = fn(3)
```

| 点 | Go |
|----|-----|
| 定义 | `func` |
| 默认参数 | **不支持** |
| 可变参数 | `...T` |
| 匿名函数 | 支持 |
| 函数作参数 | 支持 |

> 方法接收者、接口隐式实现 → **02 / 06 边界**；这里函数先按包级函数掌握。

---

## 06 类与对象

**Go 没有 Java 式 `class`。** 不要硬套继承树。

```text
Java class  →  Go struct + 方法（receiver）
```

```java
public class User {
  private String name;
  public User(String name) { this.name = name; }
  public String getName() { return name; }
}
```

```go
type User struct {
    Name string
}

func NewUser(name string) *User {
    return &User{Name: name}
}

func (u *User) GetName() string {
    return u.Name
}

u := NewUser("Meng")
```

- 导出：字段/方法 **首字母大写** 才是 public  
- 无继承；复用靠组合嵌套 struct  
- interface、多态式设计 → **02 核心能力**

---

## 07 模块与依赖

| Java | Go |
|------|-----|
| `package` / `import` | `package` / `import` |
| Maven | **`go mod`**（`go.mod` / `go.sum`） |
| `com.foo.bar` 路径 | 模块路径 + 目录；导出靠大小写 |

```go
import (
    "fmt"
    "strconv"
    "example.com/myapp/internal/user"
)
```

看懂：`go.mod` 里的 module 名、`internal/` 不可被外部模块导入。完整工程化 → [04 工程实践](./04-engineering.md)。

---

## 08 Java → Go 语法速查

| Java | Go |
|------|-----|
| `System.out.println(x)` | `fmt.Println(x)` |
| `null` | `nil`（引用类型） |
| `List` | `[]T`（slice） |
| `Map` | `map[K]V` |
| `Set` | `map[T]struct{}` |
| `&&` `\|\|` `!` | 同符号 |
| `for (int i=0;i<n;i++)` | `for i := 0; i < n; i++` |
| `for (T x : list)` | `for _, x := range list` |
| `String.format` | `fmt.Sprintf` |
| `list.add(x)` | `list = append(list, x)` |
| `map.put(k,v)` | `m[k] = v` |
| `map.containsKey` | `v, ok := m[k]` |
| `new User()` | `&User{}` / `NewUser()` |
| `this` | 接收者名（常 `u` / `s`） |
| `throws` / 异常 | `(T, error)` 多返回值 |
| `package` 可见性 | 首字母大小写 |
| `final` | `const` / 不导出字段 |
| 分号 | 通常省略（自动插入） |
| `while` | `for cond { }` |

下一篇：[02 核心能力](./02-core.md)
