# MySQL 常用函数与分组聚合

---

### ❓ 面试官：MySQL 中有哪些常用的聚合函数？`GROUP BY` 和 `HAVING` 的区别是什么？
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
常用聚合函数：`COUNT()`、`SUM()`、`AVG()`、`MAX()`、`MIN()`。`GROUP BY` 用于分组，`HAVING` 用于对**分组后的结果**进行过滤（类似 `WHERE`，但 `WHERE` 是对分组前的行进行过滤）。

**📝 详细使用场景：**

**1. 聚合函数示例**：
```sql
-- 统计订单总数
SELECT COUNT(*) FROM orders;

-- 计算订单总金额
SELECT SUM(amount) FROM orders;

-- 计算平均订单金额
SELECT AVG(amount) FROM orders;

-- 找出最大和最小订单金额
SELECT MAX(amount), MIN(amount) FROM orders;
```

**2. GROUP BY 分组查询**：
```sql
-- 统计每个用户的订单总数和总金额
SELECT user_id, COUNT(*) as order_count, SUM(amount) as total_amount
FROM orders
GROUP BY user_id;
```

**3. HAVING vs WHERE 的区别（核心考点）**：
```sql
-- WHERE：在分组前过滤（不能用聚合函数）
SELECT user_id, SUM(amount) as total
FROM orders
WHERE amount > 100  -- 先过滤掉金额 <= 100 的订单
GROUP BY user_id;

-- HAVING：在分组后过滤（必须用聚合函数）
SELECT user_id, SUM(amount) as total
FROM orders
GROUP BY user_id
HAVING SUM(amount) > 1000;  -- 只显示总金额 > 1000 的用户
```

**🌟 执行顺序（面试常考）**：
SQL 的执行顺序是：`FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`。

---

### ❓ 面试官：MySQL 中有哪些常用的字符串函数和日期函数？
*频率：🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
字符串函数用于处理文本数据（如拼接、截取、替换），日期函数用于处理时间数据（如格式化、计算差值）。

**📝 常用函数速查：**

**1. 字符串函数**：
```sql
-- 拼接字符串
SELECT CONCAT('Hello', ' ', 'World');  -- 结果：Hello World

-- 截取字符串
SELECT SUBSTRING('Hello World', 1, 5);  -- 结果：Hello（从第1个字符开始，截取5个）

-- 替换字符串
SELECT REPLACE('Hello World', 'World', 'Java');  -- 结果：Hello Java

-- 转大写/小写
SELECT UPPER('hello'), LOWER('WORLD');  -- 结果：HELLO, world

-- 去除空格
SELECT TRIM('  Hello  ');  -- 结果：Hello
```

**2. 日期函数**：
```sql
-- 获取当前日期时间
SELECT NOW();  -- 2024-01-15 10:30:00
SELECT CURDATE();  -- 2024-01-15
SELECT CURTIME();  -- 10:30:00

-- 日期格式化
SELECT DATE_FORMAT(NOW(), '%Y-%m-%d');  -- 2024-01-15

-- 日期计算
SELECT DATE_ADD(NOW(), INTERVAL 7 DAY);  -- 7天后
SELECT DATE_SUB(NOW(), INTERVAL 1 MONTH);  -- 1个月前

-- 日期差值
SELECT DATEDIFF('2024-01-20', '2024-01-15');  -- 结果：5（天数差）
```

**🌟 实战应用场景：**
"在统计报表中，我们经常用 `DATE_FORMAT(create_time, '%Y-%m')` 来按月份分组统计订单量。用 `DATEDIFF(NOW(), create_time)` 来计算订单创建了多少天，用于判断是否需要自动取消未支付订单。"