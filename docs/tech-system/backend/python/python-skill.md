# Python 技能模块 - 3-5 天速成实战指南

> 🎯 **定位**：不是成为 Python 工程师，而是**"会用 Python 的 AI 全栈工程师"**
> 
> 💡 **核心理念**：Python 你不用学会，只需要用得明白 + 用得起来

## 一、学习目标（先定清楚）

### ❌ 你不是要：
- 学完整 Python 体系
- 做 Python 工程师
- 深入理解底层原理

### ✅ 你要的是：
- **能用 Python 帮你做 AI + 工具 + 提效**
- 3-5 天搞定基础
- 后面直接能辅助做项目

## 二、总学习策略（核心原则）

```
只学用得到的
不会就查 / 问
不死磕语法
直接上手跑代码
```

## 三、3 天速成清单（最推荐）

### ✅ Day 1：基础语法（够用即可）

#### 🎯 目标：
能看懂 + 会改代码

#### 必学内容（只学这些）

```python
# 变量
name = "test"

# 数字 / 字符串
age = 18

# 条件
if age > 10:
    print("ok")

# 循环
for i in range(3):
    print(i)

# 列表
arr = [1, 2, 3]

# 字典（重点）
user = {"name": "张三"}
print(user["name"])
```

#### ✅ 达标标准：
你能：
- 看懂这些代码
- 改变量不报错

就可以了（不要多学）

---

### ✅ Day 2：函数 + 模块 + 环境

####  目标：
能写结构化代码 + 会跑项目

#### 必学内容：

```python
# 函数
def say_hi(name):
    return "hi " + name

print(say_hi("张三"))
```

#### 📦 学会这两个命令（必须！）

```bash
pip install openai
python main.py
```

#### 📁 简单文件操作（了解）

```python
with open("a.txt", "w") as f:
    f.write("hello")
```

#### ✅ 达标标准：
你能：
- 写一个函数
- 安装库
- 跑一个 Python 文件

---

### ✅ Day 3（核心）：AI 调用（重点中的重点）

#### 🎯 目标：
**你正式进入 AI 开发门槛**

#### 必学内容（直接用）

```python
from openai import OpenAI

client = OpenAI(api_key="你的 key")

res = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "帮我写一段探店文案"}
    ]
)

print(res.choices[0].message.content)
```

#### 🔥 你要练的不是代码，是这个：

改这个

```python
"帮我写一段探店文案"
```

换成：
- 商品介绍
- 数据分析
- 自动回复

#### ✅ 达标标准：
你能：
- 改 prompt
- 拿到结果
- 输出内容

---

### ✅ Day 4（可选但很建议）：做一个小工具

####  做这个项目：
**AI 探店文案生成器（最适合你）**

输入：
```text
店名：老王烧烤
特点：便宜 好吃
```

输出：
一段完整小红书文案

#### 👉 你会得到：
- 一个"真实能用"的工具
- 可以写进简历

## 四、后续长期清单（只补这 3 块）

学完 3 天之后，你不要乱学，只补👇

### 1️⃣ API 调用（重点）
- AI 接口
- HTTP 请求（requests）

### 2️⃣ 数据处理（够用）

```python
import json
import pandas as pd
```

用来处理数据、导出表格

### 3️⃣ 自动化脚本
- 批量处理
- 简单爬虫（可选）

## 五、这些你不要学（至少现在别碰）

很重要👇

### 🚫 不要碰：
- Django（重）
- 深度 Flask（够用即可）
- asyncio（复杂）
- 复杂面向对象

否则你会：**陷入"学很久但没用"的坑**

## 六、你后面正确的使用姿势

### 💡 标准流程：

```
遇到需求
→ 让 ChatGPT 写 Python 代码
→ 你运行
→ 小改
→ 完成
```

### 🔥 举个例子

你说：
> "帮我写个脚本，把 Excel 数据整理一下"

我直接给你代码

你只需要：
- 复制 → 改路径 → 运行

## 七、实战项目推荐

### 项目 1：AI 探店文案生成器

```python
from openai import OpenAI

def generate_store_copy(store_name: str, features: str) -> str:
    """生成探店文案"""
    client = OpenAI(api_key="your_api_key")
    
    prompt = f"""
    请为以下店铺生成一段小红书风格的探店文案：
    店名：{store_name}
    特点：{features}
    
    要求：
    - 风格活泼有趣
    - 包含 emoji 表情
    - 字数控制在 150 字以内
    """
    
    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return res.choices[0].message.content

# 使用示例
copy = generate_store_copy("老王烧烤", "便宜 好吃")
print(copy)
```

### 项目 2：AI 自动数据分析工具

```python
import pandas as pd
from openai import OpenAI

def analyze_data(file_path: str) -> dict:
    """分析 Excel 数据"""
    # 读取数据
    df = pd.read_excel(file_path)
    
    # 基础统计
    summary = {
        "总行数": len(df),
        "总列数": len(df.columns),
        "列名": df.columns.tolist(),
        "数值统计": df.describe().to_dict()
    }
    
    return summary

# 使用示例
result = analyze_data("sales_data.xlsx")
print(result)
```

### 项目 3：批量文件处理脚本

```python
import os
import shutil

def batch_rename_files(folder_path: str, prefix: str):
    """批量重命名文件"""
    for i, filename in enumerate(os.listdir(folder_path)):
        old_path = os.path.join(folder_path, filename)
        new_name = f"{prefix}_{i+1}{os.path.splitext(filename)[1]}"
        new_path = os.path.join(folder_path, new_name)
        os.rename(old_path, new_path)
        print(f"重命名：{filename} -> {new_name}")

# 使用示例
batch_rename_files("./photos", "trip")
```

## 八、你这样学的结果

一周后你会：

✅ 能调用 AI
✅ 能写小工具
✅ 能辅助主业（Java + React）
✅ 能做副业尝试

## 九、最终定位（帮你定死）

### 👉 你不是：
❌ Python 工程师

###  你是：
**"会用 Python 的 AI 全栈工程师"**

## 十、快速参考清单

### 必会命令
```bash
# 安装包
pip install <package_name>

# 运行脚本
python <script.py>

# 查看已安装包
pip list

# 卸载包
pip uninstall <package_name>
```

### 必会库
```python
# 基础库（内置）
import os          # 文件操作
import json        # JSON 处理
import requests    # HTTP 请求

# 第三方库（需安装）
import pandas as pd    # 数据处理
from openai import OpenAI  # AI 调用
```

### 常见错误解决
```python
# ModuleNotFoundError: No module named 'xxx'
# 解决：pip install xxx

# SyntaxError: invalid syntax
# 解决：检查语法，注意缩进和冒号

# IndentationError: unexpected indent
# 解决：Python 对缩进敏感，统一用 4 个空格
```

## 总结

> **Python 你不用学会，只需要用得明白 + 用得起来**

记住这个核心原则，3-5 天掌握基础，然后直接进入实战，用项目驱动学习，用 AI 辅助开发，成为真正的**"会用 Python 的 AI 全栈工程师"**。

---

**下一步实战选择**：
-  AI 探店文案生成器（完全贴合副业）
- 📊 AI 自动数据分析工具（贴合开发方向）

选一个直接开做！
