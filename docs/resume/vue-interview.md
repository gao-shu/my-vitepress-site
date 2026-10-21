# Vue 面试基础：高频题库（偏初级～中级）

> 这个模块帮我快速过一遍 **最常见的 Vue 面试题**，不卷源码，重点是会用 + 讲得清楚。  
> 建议：先把「基础 8 题」练到能口述 2～3 分钟，再按模块补后面的题。  
> 当前约 **55 题**：A～F 夯实基础，G～K 补指令/API/路由/工程/场景对比。

---

## 一、题库总表

### A. 基础必会（原 8 题）

1. Vue 的响应式原理大概是怎么实现的？（2.x / 3.x）
2. `v-if` 和 `v-show` 有什么区别？实际开发怎么选？
3. `computed` 和 `watch` 有什么区别？分别适合什么场景？
4. 父子组件是如何通信的？常见几种方式？
5. `v-model` 本质是什么？在组件里怎么自定义 `v-model`？
6. 在列表渲染中为什么一定要加 `key`？用索引当 key 有什么问题？
7. axios 请求一般放在哪一层？怎么统一处理错误、loading、token？
8. 前端路由的 hash 模式 和 history 模式 有什么区别？配合后端要注意什么？

### B. 生命周期与 Composition API

9. Vue 2 / Vue 3 常见生命周期钩子有哪些？分别在什么时机用？
10. Options API 和 Composition API 有什么区别？你更倾向哪个？
11. `ref`、`reactive`、`toRefs` 分别干什么？什么时候用哪个？
12. `watch` 和 `watchEffect` 有什么区别？
13. 什么是 composable（组合式函数）？举一个你写过的例子？

### C. 组件进阶

14. 插槽（slot）有哪几种？作用域插槽解决什么问题？
15. `keep-alive` 是干什么的？缓存后怎么触发刷新？
16. `nextTick` 是干什么的？什么场景必须用？
17. 动态组件 `<component :is="...">` 怎么用？和路由切换有什么关系？
18. `provide / inject` 适合什么场景？有什么注意点？

### D. 路由与状态管理

19. Vue Router 导航守卫有哪些？登录鉴权一般怎么做？
20. 路由懒加载怎么写？有什么好处？
21. Pinia 和 Vuex 有什么区别？为什么现在更推荐 Pinia？
22. Pinia 里 state / getters / actions 怎么分工？

### E. 工程实践与性能

23. Vue 项目里跨域一般怎么处理？
24. 首屏慢、列表卡顿，你一般会从哪些方向优化？
25. 为什么不建议在模板里写复杂表达式？和 computed 的关系？
26. `v-for` 和 `v-if` 为什么不建议写在同一个元素上？
27. 样式穿透 / scoped 是什么意思？子组件样式怎么改？

### F. Vue 2 → 3 与常见追问

28. Vue 3 相对 Vue 2，你觉得最重要的变化有哪些？
29. Vue 2 里为什么不能直接给对象加新属性？`$set` 是干什么的？
30. 虚拟 DOM 是什么？diff 大概在解决什么问题？（口述级）

### G. 模板语法与指令

31. 常见事件修饰符有哪些？`.stop` / `.prevent` / `.once` 怎么用？
32. `v-bind` 绑 class / style 有哪几种写法？
33. `v-html` 有什么风险？什么时候能用、什么时候不能用？
34. 自定义指令适合什么场景？和组件有什么区别？
35. `Teleport` 是干什么的？弹窗、抽屉一般怎么用？

### H. Composition API 深入

36. `<script setup>` 里 `defineProps` / `defineEmits` / `defineExpose` / `defineModel` 分别干什么？
37. `shallowRef` / `shallowReactive` / `markRaw` / `toRaw` 分别解决什么问题？
38. `watch` 的 `deep`、`immediate`、`flush` 分别什么时候开？
39. 模板 ref（`ref="xxx"`）在 Composition API 里怎么拿 DOM / 子组件实例？
40. `computed` 可以写成 getter/setter 吗？适合什么场景？

### I. 路由与状态进阶

41. 动态路由参数变化时，组件不销毁重建怎么办？（同一路由不同 id）
42. `params` 和 `query` 有什么区别？刷新后还能不能用？
43. 嵌套路由、命名视图大概怎么用？
44. Pinia 里为什么常用 `storeToRefs`？直接解构会怎样？
45. 路由 `meta` 一般放什么？和菜单、权限怎么配合？

### J. 工程与排查

46. 环境变量（`.env`）在 Vite 项目里怎么用？哪些能暴露给前端？
47. 组件按需引入 / 自动导入一般怎么做？（如 Element Plus）
48. 请求如何取消？搜索框防抖一般怎么做？
49. Vue 里常见内存泄漏有哪些？怎么避免？
50. 线上白屏 / 报错你一般怎么排查？

### K. 场景题与对比

51. Vue 和 React 你怎么对比？（全栈/转栈常问）
52. 什么是 MVVM？和 MVC 有什么关系？（口述级）
53. 大表单、弹窗里表格，你怎么避免卡顿和状态错乱？
54. 按钮级权限、菜单权限前端一般怎么做？
55. mixin 有什么问题？为什么 Composition 更推荐？

---

## 二、示例答案（简版）

### A. 基础必会

#### 1. Vue 的响应式原理大概是怎么实现的？

**简短版本（适合初级面试）：**

- Vue 2.x 主要是通过 `Object.defineProperty` 监听数据的 `get/set`，在 `set` 的时候触发视图更新。
- Vue 3.x 则是用 `Proxy` 做数据劫持，可以完美监听新增/删除属性、数组下标等问题，弥补了 2.x 的一些缺陷。

**可以顺带提一句：**

- 模板里用到的数据，会在依赖收集阶段记录下来，数据变更时，只有依赖了它的那部分组件会重新渲染，而不是整棵树全部刷新。

---

#### 2. `v-if` 和 `v-show` 有什么区别？怎么选？

- **`v-if`**：条件为 `false` 时，**组件/DOM 直接不会渲染** 或被销毁；为 `true` 时才真正创建。适合**很少切换**的场景，比如权限控制、大模块的按需渲染。
- **`v-show`**：始终会渲染到 DOM，只是通过 `display: none` 控制显示/隐藏。适合**频繁切换**的场景，比如 tab 切换、小弹窗。

一句话记忆：**“频繁切换用 v-show，偶尔切换用 v-if”**。

---

#### 3. `computed` 和 `watch` 有什么区别？

- **`computed`（计算属性）**：
  - 依赖其它响应式数据，**有缓存**。
  - 只有当依赖的数据发生变化时才会重新计算。
  - 适合从已有数据中 **派生出新数据**（比如：全名、过滤后的列表）。

- **`watch`（侦听器）**：
  - 监听某个数据的变化，**在变化时执行副作用逻辑**。
  - 适合处理异步请求、手动控制逻辑（例如根据输入框内容去搜索接口）。

一句话区分：**“需要一个新值用 computed，要在值变化时做事用 watch”**。

---

#### 4. 父子组件如何通信？（最常用的几种）

- 父传子：通过 **`props`** 传值。
- 子通知父：通过 **`$emit` 触发自定义事件**，父组件在模板上监听。
- 兄弟组件/跨多层：可以用 **全局事件总线 / Vuex / Pinia / provide/inject** 等方式（初级面试会提到名字即可）。

> 面试时可以举一个简单例子：父组件把列表数据传给子组件展示，子组件点击“删除”按钮，通过 `$emit('delete', id)` 通知父组件真正去删数据。

---

#### 5. `v-model` 本质是什么？组件里怎么自定义？

- 在原生表单元素上，`v-model` 大概相当于：
  ```html
  <input :value="msg" @input="msg = $event.target.value" />
  ```
- 在组件上，Vue 3 里等价于：
  ```vue
  <Child v-model="value" />
  <!-- 等价于 -->
  <Child :modelValue="value" @update:modelValue="value = $event" />
  ```
- 自定义组件想支持 `v-model`，只需要：
  - 接收一个 `modelValue` 的 `prop`。
  - 在内部通过 `emit('update:modelValue', newVal)` 往外抛。

---

#### 6. 为啥列表渲染一定要加 `key`？索引用作 key 有什么问题？

- `key` 的主要作用是 **帮助虚拟 DOM 更准确地复用元素**。
- 如果不加 `key` 或用索引当 key，在**插入/删除中间某一项时**，可能会导致：
  - 复用错误的 DOM 节点。
  - 比如输入框错位、动画异常、组件内部状态混乱。
- 通常建议用 **唯一业务 id 作为 key**。

---

#### 7. axios 一般怎么用？放在哪一层？

- 一般会抽一层 **统一的请求封装**：
  - 统一设置 baseURL、超时时间。
  - 请求拦截里加上 token。
  - 响应拦截统一处理错误提示、登录失效跳转等。
- 页面或组件里只调用 **封装好的 API 函数**，例如：
  ```ts
  import { getUserList } from '@/api/user'
  const list = await getUserList()
  ```

> 面试时可以简单描述你项目里的封装结构，哪怕是自己练手项目也可以讲清楚“为什么要这么封、怎么封”的思路。

---

#### 8. 前端路由 hash 模式 vs history 模式 有什么区别？

- **hash 模式**：URL 里带 `#`，如 `/#/home`，后端只会看到 `/#` 前面的部分；刷新不会 404，部署最简单。
- **history 模式**：URL 更干净，如 `/home`，需要后端配合 **把所有路径都返回同一个 `index.html`**，否则刷新会 404。

对于面试官常问的“你们项目用的什么模式、为什么”，可以回答：

- 管理后台项目一般会选 history 模式，URL 更好看，但需要 nginx 做 `try_files` 配置。
- 如果是纯静态托管环境、后端配合不好，hash 模式更省事。

---

### B. 生命周期与 Composition API

#### 9. 生命周期钩子分别在什么时机用？

常见口述版（Vue 3）：

| 钩子 | 典型用途 |
|------|----------|
| `setup` / `beforeCreate`～`created` | 初始化数据、读 props（Options 里 created 发请求也常见） |
| `onMounted` / `mounted` | **需要 DOM** 时：图表初始化、获取元素宽高、第三方插件 |
| `onUpdated` / `updated` | DOM 更新后做测量（少用，小心死循环） |
| `onBeforeUnmount` / `beforeUnmount` | 清定时器、取消请求、解绑事件、销毁图表实例 |

一句话：**“要 DOM 用 mounted；要清理用 beforeUnmount。”**

---

#### 10. Options API vs Composition API？

- **Options**：`data / methods / computed / watch` 分块写，新人友好，小组件够用。
- **Composition**：按**业务逻辑聚合**（比如「搜索相关」的状态和函数放一起），大组件、逻辑复用更清晰；配合 TypeScript 更顺手。
- 复用：Options 靠 mixin（容易冲突）；Composition 用 **composable 函数** 更干净。

面试可以答：小页面 Options 也行；复杂业务和 TS 项目更倾向 Composition + `<script setup>`。

---

#### 11. `ref` / `reactive` / `toRefs`？

- **`ref`**：包任意类型；模板自动解包，JS 里用 `.value`。基础类型、单值首选。
- **`reactive`**：包对象；直接改属性即可，但**整体重新赋值会丢响应式**。
- **`toRefs`**：把 reactive 对象拆成一堆 ref，方便解构还不丢响应式。

实用建议：多数场景 `ref` 就够；对象也可以 `ref({...})`，赋值时 `obj.value = newObj`。

---

#### 12. `watch` vs `watchEffect`？

- **`watch`**：明确指定依赖源，可拿 old/new，默认懒执行（除非 `immediate: true`）。适合「某个值变了再做事」。
- **`watchEffect`**：自动收集回调里用到的响应式依赖，一上来就执行一次。适合「依赖一变就同步副作用」，但依赖不直观时难排查。

---

#### 13. 什么是 composable？

把一段可复用的状态 + 逻辑抽成函数，通常以 `useXxx` 命名，例如 `useRequest`、`useTable`、`usePermission`。

口述例子：

> 我写过 `usePagination`：里面有 `page`、`pageSize`、`total`，以及 `onPageChange`；列表页直接调用，翻页逻辑不用每个页面复制一份。

---

### C. 组件进阶

#### 14. 插槽有哪几种？

- **默认插槽**：父组件往子组件「预留坑位」塞内容。
- **具名插槽**：多个坑位，用 `#header` / `#footer` 之类区分。
- **作用域插槽**：子组件把内部数据传给父组件的插槽内容用（表格列自定义最常见）。

一句话：**“父传内容给子用普通/具名插槽；子把数据交还给父定制 UI，用作用域插槽。”**

---

#### 15. `keep-alive` 干什么？

缓存动态组件或路由组件的实例，切换回来时**保留状态**（滚动位置、表单填写等），避免反复销毁重建。

注意：

- 配合 `include` / `exclude` / `max` 控制缓存范围。
- 被缓存的组件会多两个钩子：`onActivated` / `onDeactivated`（进入缓存、离开缓存）。
- 需要「返回仍刷新数据」时，可在 `onActivated` 里重新请求。

---

#### 16. `nextTick` 干什么？

Vue 更新 DOM 是**异步批量**的。改完数据后立刻读 DOM，往往还是旧的；包在 `nextTick` 里等本轮更新完成后再读。

常见场景：输入后自动聚焦、拿到更新后的列表高度、滚动到底部。

---

#### 17. 动态组件怎么用？

```vue
<component :is="currentTab" />
```

`currentTab` 可以是组件名或组件对象。常和 `keep-alive` 一起做 Tab。  
和路由的区别：路由切换是页面级；动态组件更偏同一页内局部切换。

---

#### 18. `provide / inject`？

祖先组件 `provide` 数据，任意深层子孙 `inject`，避免层层 props。

适合：主题、当前用户、表单上下文等「跨多层且相对稳定」的依赖。  
注意：不是全局状态管理；复杂共享状态仍更适合 Pinia。响应式要 ensure 提供的是 ref/reactive。

---

### D. 路由与状态管理

#### 19. 导航守卫与登录鉴权？

常见分层：

- **全局前置守卫** `router.beforeEach`：统一判断 token、重定向登录页。
- **路由独享守卫** `beforeEnter`：个别页面特殊校验。
- **组件内守卫**：较少用，了解即可。

典型流程：没有 token → 跳 `/login` 并带上 `redirect`；登录成功后再跳回原页面。权限码可放在路由 `meta` 里。

---

#### 20. 路由懒加载？

```ts
component: () => import('@/views/UserList.vue')
```

好处：按路由拆 chunk，首屏只加载当前页相关代码，减小初始包体积。

---

#### 21. Pinia vs Vuex？

- Pinia API 更简单：没有 mutations，直接改 state 或在 actions 里改。
- TypeScript 支持更好，模块天然拆分，体积更小。
- Vue 3 项目基本都推荐 Pinia；老项目可能还在 Vuex。

---

#### 22. Pinia 怎么分工？

- **state**：状态数据  
- **getters**：派生数据（类似 computed）  
- **actions**：同步/异步业务（请求、改多个字段）

组件里：读 state/getters，调用 actions；不要在很多组件里复制同一套请求+赋值逻辑。

---

### E. 工程实践与性能

#### 23. 跨域怎么处理？

开发环境：Vite / Vue CLI 配 **devServer proxy**，把 `/api` 代理到后端。  
生产环境：同域部署或 Nginx 反向代理；或后端开 CORS。  
面试别只说「浏览器跨域」，要说到**谁来解、开发/生产分别怎么解**。

---

#### 24. 性能优化你一般怎么答？

按层次说，别堆名词：

1. **加载**：路由懒加载、组件异步、图片懒加载、gzip/CDN、减少首屏请求。  
2. **渲染**：`v-show`/`v-if` 选对、长列表虚拟滚动、合理 `key`、大列表分页。  
3. **更新**：能用 computed 别在模板里算重逻辑；避免无意义的深层 watch；及时销毁定时器。  
4. **状态**：别把所有东西塞进全局 store。

结合自己项目举 1～2 个真实点最加分。

---

#### 25. 模板里为什么少写复杂逻辑？

模板应保持可读；复杂过滤、拼装、计算放 **computed / methods**。  
computed 有缓存，多次引用不会重复算；模板里直接写一长串既难看又难测。

---

#### 26. 为什么不建议 `v-for` 和 `v-if` 同元素？

同一节点上，`v-if` 优先级高于 `v-for`（Vue 3），容易造成「用循环变量却取不到」或意图不清。  
做法：用 computed 先过滤列表，再 `v-for`；或外层 `template` 包一层。

---

#### 27. scoped 与样式穿透？

`scoped` 给选择器加唯一属性，样式默认只作用于当前组件，避免污染。  
要改子组件内部样式时，用 `:deep(.child-class)`（Vue 3）做有限度的穿透；能改 props/插槽结构优先，少依赖穿透。

---

### F. Vue 2 → 3 与常见追问

#### 28. Vue 3 相对 Vue 2 的重要变化？

口述几条就够：

- 响应式换成 Proxy  
- Composition API / `<script setup>`  
- 多根节点 Fragment、Teleport、Suspense  
- Tree-shaking 更好，包体积更友好  
- 生态：Vue Router 4、Pinia 成为主流

---

#### 29. Vue 2 为什么不能直接加新属性？`$set`？

因为 `Object.defineProperty` 在初始化时就定好了属性，**后来新增的 key 侦测不到**。  
要用 `Vue.set` / `this.$set`，或一开始就把字段声明好。  
Vue 3 的 Proxy 基本没这个问题——这也是常考对比点。

---

#### 30. 虚拟 DOM / diff（口述级）？

- 虚拟 DOM：用 JS 对象描述真实 DOM，改数据先算新树，再和旧树对比，最后只改真正变化的节点。  
- diff：同层比较、靠 `key` 识别节点身份，减少不必要的 DOM 操作。  

初级面试说到「减少直接操作 DOM、按 key 复用」即可，不必背源码细节。

---

### G. 模板语法与指令

#### 31. 事件修饰符？

常用：

- `.stop`：阻止冒泡（相当于 `event.stopPropagation()`）
- `.prevent`：阻止默认行为（如表单提交刷新）
- `.once`：只触发一次
- `.self`：只有事件从元素自身触发才处理（不处理子元素冒泡上来的）
- `.capture`：捕获阶段监听

口述例子：弹窗遮罩点击关闭用 `@click.self`；链接跳转前校验用 `@click.prevent`。

---

#### 32. class / style 绑定写法？

- class：字符串、对象 `{ active: isActive }`、数组，可混用。
- style：对象 `{ color: 'red', fontSize: '14px' }` 或数组合并多段样式。

对象写法最常见：状态驱动样式，比手动拼 class 字符串更清晰。

---

#### 33. `v-html` 的风险？

会把字符串当 HTML 插入，**存在 XSS 风险**。  
用户输入、评论、富文本若不经过消毒，恶意脚本可能执行。

原则：能用文本插值 `{{ }}` 就别用 `v-html`；必须用时走后端/前端消毒（如 DOMPurify），且只信任可控来源。

---

#### 34. 自定义指令？

适合「直接操作 DOM」且不想为小事包一层组件的场景：自动聚焦、权限隐藏元素、拖拽、点击外部关闭。

和组件区别：组件偏 UI/结构复用；指令偏对已有元素附加行为。Vue 3 钩子名变成 `mounted` / `updated` / `unmounted`（和生命周期对齐）。

---

#### 35. `Teleport`？

把组件模板的一部分「传送」到 DOM 的其它位置（常到 `body`），同时逻辑仍在当前组件树里。

典型：Modal、Drawer、全屏 Loading——避免被父级 `overflow: hidden` / `z-index` 裁切或层级错乱。

```vue
<Teleport to="body">
  <div class="modal">...</div>
</Teleport>
```

---

### H. Composition API 深入

#### 36. `defineProps` / `defineEmits` / `defineExpose` / `defineModel`？

都是 `<script setup>` 编译宏，不用 import：

- **`defineProps`**：声明 props（可带类型/默认值）
- **`defineEmits`**：声明可触发的事件，方便校验和 TS 提示
- **`defineExpose`**：显式暴露给父组件通过 ref 调用的方法/属性（setup 默认不暴露）
- **`defineModel`**（Vue 3.4+）：更省事地写组件 `v-model`，少写 props + emit 样板

一句话：前两个管输入输出约定；expose 管「父组件能调什么」；defineModel 简化双向绑定。

---

#### 37. `shallowRef` / `shallowReactive` / `markRaw` / `toRaw`？

- **`shallowRef`**：只追踪 `.value` 的替换，不深代理内部属性；大对象/第三方实例常用。
- **`shallowReactive`**：只把第一层做成响应式。
- **`markRaw`**：标记对象永不做成响应式（如 ECharts 实例、大型配置），省性能、防意外代理。
- **`toRaw`**：拿到响应式代理背后的原始对象（少用，调试或交给不吃 Proxy 的库时）。

面试加分：图表、地图、编辑器实例一般 `markRaw` 或放 `shallowRef`，别整棵树深代理。

---

#### 38. `watch` 的 `deep` / `immediate` / `flush`？

- **`deep`**：深监听对象内部变化；大对象有成本，能听具体字段就别整对象 deep。
- **`immediate`**：立刻执行一次，适合「一进来就按当前值拉数据」。
- **`flush: 'post'`**：等 DOM 更新后再跑，读更新后的 DOM 时用（和 nextTick 场景接近）。

默认 `flush: 'pre'`（组件更新前）。

---

#### 39. 模板 ref 怎么拿？

```vue
<script setup>
import { ref, onMounted } from 'vue'
const box = ref(null)
const child = ref(null)
onMounted(() => {
  box.value // DOM 元素
  child.value?.someMethod() // 子组件 expose 的方法
})
</script>
<template>
  <div ref="box" />
  <ChildRef ref="child" />
</template>
```

注意：`ref` 在挂载前是 `null`，要在 `onMounted` 或之后用；子组件若用 script setup，必须 `defineExpose` 才调得到。

---

#### 40. computed 的 getter/setter？

可以：

```ts
const fullName = computed({
  get: () => first.value + ' ' + last.value,
  set: (val) => { /* 拆开写回 first/last */ }
})
```

适合「展示是拼出来的，编辑时要拆回去」的表单项；大多数计算属性只读 getter 就够。

---

### I. 路由与状态进阶

#### 41. 同一路由参数变了组件不重建？

例如 `/user/1` → `/user/2`，默认复用同一组件实例，`onMounted` 不会再跑。

做法：

- `watch(() => route.params.id, load)` 里重新请求；或
- `<router-view :key="$route.fullPath" />` 强制不同参数换实例（简单但可能丢状态、多开销）。

面试说清「复用是默认行为，要自己 watch 参数」最加分。

---

#### 42. `params` vs `query`？

- **`params`**：路径的一部分，如 `/user/:id` → `/user/1`，要在路由里声明；用 `name` + params 跳转更稳。
- **`query`**：`?keyword=vue&page=1`，刷新、分享都还在，适合筛选、分页、搜索。

经验：能放 query 的过滤条件优先 query；资源 id 放 params。

---

#### 43. 嵌套路由 / 命名视图？

- **嵌套**：父路由有 `<router-view>`，子路由渲染在父布局里（后台：侧栏布局 + 内容区最常见）。
- **命名视图**：一个路由配多个 `components: { default, sidebar }`，页面对应多个 `<router-view name="sidebar">`。

初级能讲清嵌套布局即可；命名视图知道「一页多出口」就行。

---

#### 44. 为什么用 `storeToRefs`？

Pinia store 直接解构会**丢掉响应式**。  
`storeToRefs(store)` 把 state/getters 转成 ref，解构后仍响应式；**actions 不用包**，直接 `const { fetchList } = store` 即可。

---

#### 45. 路由 `meta`？

常放：`title`、`requiresAuth`、`roles` / `perms`、`keepAlive`、是否显示在菜单、图标等。

守卫里读 `to.meta.requiresAuth`；菜单根据路由表 + 权限码过滤生成。配置集中，比散落在组件里好维护。

---

### J. 工程与排查

#### 46. Vite 环境变量？

- 文件：`.env`、`.env.development`、`.env.production`
- 只有以 **`VITE_`** 开头的才会暴露给客户端代码
- 代码里：`import.meta.env.VITE_API_BASE`

注意：别把密钥写进 `VITE_` 变量——前端打包后谁都能看到。密钥只放服务端。

---

#### 47. 组件按需引入？

全量引入 Element Plus 等会让包变大。常见做法：

- 手动按需 `import { ElButton } from 'element-plus'`
- 或用 `unplugin-vue-components` + `unplugin-auto-import` 自动按需

面试提到「按需 + 自动导入插件」即可，说明你关心包体积。

---

#### 48. 取消请求 / 搜索防抖？

- 取消：axios 用 `AbortController`（或旧版 CancelToken）；路由切换、重复搜索时 abort 上一次，避免乱序回写。
- 防抖：输入框 `watch` + `lodash.debounce` / 自写定时器，300～500ms 后再请求。

一句话：**防抖减次数，abort 防竞态**。

---

#### 49. 常见内存泄漏？

- 定时器、`addEventListener`、WebSocket、第三方图表未在 `onBeforeUnmount` 清理
- 全局事件总线订阅未 off
- 闭包持有大对象/组件实例

习惯：申请了资源就成对写销毁；图表实例 `dispose()`。

---

#### 50. 白屏 / 报错怎么排查？

口述步骤：

1. 打开控制台看报错栈、网络是否 404（尤其 history 模式刷新、资源路径）
2. 看是路由配错、权限重定向死循环，还是某个组件抛错
3. 生产可配错误监控（如 Sentry）+ `app.config.errorHandler`
4. 本地用 Vue DevTools 看组件树和 Pinia 状态

别只说「清缓存」；要有「看报错 → 定位组件/接口 → 再修」的路径。

---

### K. 场景题与对比

#### 51. Vue vs React？（口述级）

可对比三点即可：

| 维度 | Vue | React |
|------|-----|-------|
| 模板 | 单文件模板 + 指令，上手快 | JSX，灵活，学习曲线另一套 |
| 更新 | 响应式自动追踪依赖 | 默认函数组件 + state，常配合 memo |
| 生态 | Vue Router / Pinia 官方味更统一 | React Router / 状态库选择更多 |

态度：都能做中后台；团队栈、招聘、已有项目决定用哪个，别贬低另一方。

---

#### 52. MVVM？

- **Model**：数据
- **View**：视图
- **ViewModel**：把数据和视图粘起来（Vue 实例/组件就是这层）

数据变 → 视图更新；视图输入 → 数据变。和传统 MVC 比，前端少了很多手动 DOM 操作。说到「数据驱动视图」就够。

---

#### 53. 大表单 / 弹窗表格怎么稳？

- 表单：字段多就拆子组件或步进；校验用规则对象；能分步提交就别一次绑几百字段。
- 弹窗：关闭销毁用 `destroy-on-close` / `v-if`，避免残留校验状态；打开时再赋初始值。
- 表格：分页、虚拟滚动；选中行用 id 存，别死绑行下标；大数据别一次塞进响应式再整表渲染。

---

#### 54. 按钮 / 菜单权限？

- **菜单**：登录后拿权限码，过滤路由表再 `addRoute` 或前端过滤显示。
- **按钮**：自定义指令 `v-permission="'user:del'"` 或封装权限组件，没有码就移除/禁用节点。
- **底线**：前端隐藏只是体验；接口必须鉴权，否则改请求照样调通。

---

#### 55. mixin 的问题？为什么更推 Composition？

mixin 痛点：来源不清、同名 option 合并冲突、类型推断差、逻辑碎片难追。

Composition / composable：函数显式导入，依赖一目了然，TS 友好，按功能聚合。Vue 3 官方也更推荐这条路。

---

## 三、追问预备（短答）

- **「data 为什么是函数？」** → 组件复用时每个实例一份独立数据，避免引用共享。  
- **「props 能直接改吗？」** → 单向数据流，不要改；要改就 emit 或用本地 data/computed 承接。  
- **「created 和 mounted 发请求选哪个？」** → 不依赖 DOM 用 created/setup；要操作 DOM 用 mounted。  
- **「SPA 怎么做权限？」** → 路由守卫 + 菜单/按钮按权限码控制；接口仍要后端鉴权。  
- **「Vuex mutation 必须同步？」** → 是，方便调试时间旅行；异步放 action。（Pinia 已弱化这套）  
- **「为什么用 Vite？」** → 开发启动快、HMR 快；生产用 Rollup 打包。  
- **「`$attrs` / `inheritAttrs`？」** → 父传下来但没声明成 props 的属性/事件；设 `inheritAttrs: false` 可手动绑到内层 input 等。  
- **「过滤器 filter 呢？」** → Vue 2 有，Vue 3 移除；改用 computed / 方法。  
- **「`v-model` 多个？」** → Vue 3 支持 `v-model:title` 这种具名，本质是不同 prop + `update:xxx`。  
- **「异步组件？」** → `defineAsyncComponent(() => import(...))`，可配 loading/error；路由懒加载是同类思路。  
- **「Suspense？」** → 配合异步 setup/异步组件展示 fallback；了解即可，很多项目仍手写 loading。  
- **「为何少用 `$parent` / 事件总线？」** → 耦合重、难维护；优先 props/emit、Pinia、provide/inject。

---

## 四、怎么练

1. 先闭卷把 **A 组 8 题** 各讲 2 分钟。  
2. 再按 B→F 夯实，然后补 **G～K**（指令、setup 宏、路由坑、工程排查最常被追问）。  
3. 每天 3～5 题，每题能举**自己项目**里的例子。  
4. 对每个概念准备一句「是什么」+ 一句「我项目里怎么用」+ 一句「有什么坑」。
