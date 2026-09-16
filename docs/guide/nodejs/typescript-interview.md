# TypeScript 面试

---

## 高频问法

1. 为什么项目要上 TypeScript？  
2. `interface` vs `type`？  
3. `any` / `unknown` / `never`？  
4. 联合类型、类型守卫？  
5. 泛型解决什么问题？  
6. 枚举和字面量联合？  
7. `tsconfig` 里你关心哪些选项？  
8. 如何和 Vue/Java 后端接口对齐类型？

---

## 口述参考

### 1）为什么用 TS

编译期发现错误、重构安全、接口即文档、协作成本低。  
代价：要写类型、有时要与不完备的 `.d.ts` 斗争——业务项目通常值得。

### 2）interface vs type

描述对象两者都行。  
`type` 擅长联合、交叉、映射；`interface` 可声明合并。  
团队统一即可，面试别教条。

### 3）any / unknown / never

- `any`：关闭检查，能不用就不用  
- `unknown`：安全的「未知」，用前要收窄  
- `never`：不该有值的分支（穷尽检查）

### 4）联合与守卫

`string | number`；用 `typeof` / `in` / 自定义谓词收窄。  
处理后端「成功 | 失败」结果类型很常见。

### 5）泛型

组件/函数保留类型信息：`function first<T>(arr: T[]): T`。  
Axios 封装 `request<T>()` 返回 `Promise<T>` 是好例子。

### 6）枚举

可用 `enum`，也可用 `as const` + 字面量联合（更轻）。  
知道两种都能做「有限集合」即可。

### 7）tsconfig 常提

- `strict`（或逐步开 `strictNullChecks`）  
- `module` / `moduleResolution`  
- `paths` 别名  
- `skipLibCheck` 有时用于加速，但别当忽略一切错误的借口  

### 8）与后端对齐

- 后端 OpenAPI → 生成 TS 类型；或手写 DTO 与 Java VO 字段对齐  
- 日期、枚举、可空字段最容易不一致——联调清单里要写明  

---

## 追问预备

- 「类型擦除？」→ TS 编译后运行时无类型，别指望靠类型做运行时校验；运行时用 zod 等或手写校验。  
- 「装饰器？」→ 知道实验性/用于 Nest 等；Electron+Vue 项目未必用到。
