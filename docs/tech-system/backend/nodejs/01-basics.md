# TypeScript · 01 语言基础

> **这不是从零开始的 TS/JS 教程**，而是给 **已有 Java 经验** 的人用的快速迁移 + 长期速查。  
> 这里的语言是 **TypeScript**；跑在 **Node.js**（或浏览器 / Electron）上。  
> 事件循环、Node 运行时细节 → [02 核心能力](./02-core.md)；Express / Nest → [03 框架与生态](./03-frameworks.md)。

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

```ts
let name: string = "Meng";
const age = 30;                 // 优先 const；需要再赋再用 let
const MAX = 100;
let empty: string | null = null;
let maybe: string | undefined;  // 未赋值常见为 undefined
const n = Number.parseInt("42", 10);
// 或 const n = Number("42")
```

| Java | TypeScript |
|------|------------|
| `String` | `string` |
| `int` / `Integer` | `number`（无 int/float 分立） |
| `boolean` | `boolean` |
| `null` | `null` **和** `undefined`（两套空） |
| `final` / 不可变局部 | `const` |
| `var`（Java 10+） | `let` + 类型推断 |

打开 `strict`；少用 `any`。外部 JSON 先当 `unknown` 再收窄（进阶 → 02）。

---

## 02 字符串

```java
String s = "hi " + name;
String f = String.format("hi %s", name);
String multi = """
    line1
    line2
    """;
```

```ts
const s = "hi " + name;
const f = `hi ${name}`;          // template literal（首选）
const multi = `line1
line2`;
```

常用：`s.length`、`s.trim()`、`s.split(",")`、`s.includes(...)`、`arr.join(",")`。

---

## 03 数组与集合

| Java | TypeScript | 注意 |
|------|------------|------|
| `List` | `Array` / `T[]` | 字面量 `[1, 2]` |
| `Map` | **对象** `{ [k: string]: V }` 或 `Map` | 普通业务 DTO 多用对象；需要非字符串 key / 插入序 API 再用 `Map` |
| `Set` | `Set` | `new Set([1,2])` |

```java
List<String> list = new ArrayList<>();
list.add("a");
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
Set<String> set = new HashSet<>();
```

```ts
const list: string[] = ["a"];
list.push("b");

const map: Record<string, number> = { a: 1 };
map.b = 2;
// 或 const map = new Map<string, number>([["a", 1]]);

const set = new Set<string>(["a", "b"]);
set.add("c");
```

**不等价处：** JS 数组可稀疏、可混类型（TS 用泛型约束）；对象 key 基本是 string/symbol。不要把 `Map` 与普通对象当成完全同一回事。

---

## 04 条件与循环

```java
if (x > 0) { ... } else { ... }
switch (x) { case 1: ...; default: ...; }
for (int i = 0; i < n; i++) { ... }
for (String s : list) { ... }
while (ok) { ... }
```

```ts
if (x > 0) {
  ...
} else if (x === 0) {
  ...
} else {
  ...
}

switch (x) {
  case 1:
    ...
    break;
  default:
    ...
}

for (let i = 0; i < n; i++) { ... }
for (const s of list) { ... }       // 推荐
list.forEach((s) => { ... });
while (ok) { ... }
// break / continue 同语义
```

比较：日常用 `===` / `!==`，少用 `==`（会类型转换）。  
`&&` `||` `!` 与 Java 同形；还有 `??`（空值合并）、`?.`（可选链）。

---

## 05 函数

```java
int add(int a, int b) { return a + b; }
```

```ts
function add(a: number, b: number = 0): number {
  return a + b;
}

function sumAll(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

const add2 = (x: number, y: number) => x + y;

function apply(n: number, fn: (x: number) => number) {
  return fn(n);
}
```

| 点 | TypeScript |
|----|------------|
| 定义 | `function` / 箭头函数 |
| 默认参数 | 支持 |
| 可变参数 | `...rest` |
| 匿名函数 | 箭头函数为主 |
| 函数作参数 | 一等公民 |

> `async/await`、高阶中间件心智 → **02**；此处先会同步函数签名即可。

---

## 06 类与对象

基础够用；继承体系、抽象类、高级类型 → **02**。

```java
public class User {
  private String name;
  public User(String name) { this.name = name; }
  public String getName() { return name; }
}
```

```ts
class User {
  constructor(private name: string) {}

  getName(): string {
    return this.name;
  }
}

const u = new User("Meng");
```

日常后端更多用 **interface + 字面量对象** 描述 DTO，而不是处处 `class`：

```ts
interface UserDto {
  name: string;
  age: number;
}

const dto: UserDto = { name: "Meng", age: 30 };
```

---

## 07 模块与依赖

| Java | TypeScript（Node） |
|------|---------------------|
| `package` / `import` | `import` / `export` |
| Maven | **npm** / pnpm / yarn（`package.json`） |
| jar | 编译到 `dist/` 的 JS |

```ts
import fs from "node:fs";
import { add } from "./math.js";   // 视项目 ESM/CJS 约定
export function hello() { ... }
```

目标：看懂 `package.json` 依赖与 `import` 从哪来。完整工程化、ESM/CJS 深坑 → [04 工程实践](./04-engineering.md)。

---

## 08 Java → TypeScript 语法速查

| Java | TypeScript |
|------|------------|
| `System.out.println(x)` | `console.log(x)` |
| `null` | `null` / `undefined` |
| `List` | `T[]` / `Array<T>` |
| `Map` | `Record<K,V>` / `Map` |
| `Set` | `Set` |
| `&&` `\|\|` `!` | 同符号 |
| `==`（值） | `===` |
| `for (int i=0;i<n;i++)` | `for (let i=0;i<n;i++)` |
| `for (T x : list)` | `for (const x of list)` |
| `String.format` | `` `hi ${name}` `` |
| `list.add(x)` | `list.push(x)` |
| `map.put(k,v)` | `obj[k]=v` / `map.set` |
| `new User()` | `new User()` |
| `this` | `this`（箭头函数小心绑定） |
| `final` 局部 | `const` |
| `Integer.parseInt` | `Number.parseInt(s, 10)` |
| `package` | `import` / `export` |
| 分号 | 可选（项目统一即可） |
| `Optional` | `T \| null` / `T \| undefined` |

下一篇：[02 核心能力](./02-core.md)
