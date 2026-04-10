# SQL 高频题：会写会讲即可【初/中级】

---

> 说明：多数远程/线上面试不会让你“纸上手写 SQL”，但经常会以这几种方式考察：
> - 给一个需求，让你在在线编辑器/共享文档里写 SQL
> - 让你口述思路：为什么用 JOIN / 子查询 / 分组聚合
> - 追问：这条 SQL 可能走哪个索引、怎么优化
>
> 所以这篇的目标是：**遇到常见题型能写出来，并能讲清楚思路**。

### ❓ 面试官：请手写一条 SQL，查询出每个部门工资最高的员工信息。
*频率：🔥🔥🔥🔥🔥*

**💡 核心考点：**
子查询、分组聚合（GROUP BY）与 IN 的联合使用，或者使用窗口函数（Window Function）。

**📝 表结构假设：**
`employee` 表包含：`id`, `name`, `salary`, `department_id`。

**方案 1：使用 GROUP BY + 子查询（适用于所有 MySQL 版本）**
先按部门分组查出每个部门的最高工资，然后再去原表里匹配部门和工资。
```sql
SELECT e.id, e.name, e.salary, e.department_id
FROM employee e
WHERE (e.department_id, e.salary) IN (
    -- 子查询：查出每个部门的最大工资
    SELECT department_id, MAX(salary)
    FROM employee
    GROUP BY department_id
);
```

**方案 2：使用窗口函数（适用于 MySQL 8.0+，强烈推荐，能体现现代 SQL 能力）**
使用 `RANK()` 或 `DENSE_RANK()` 窗口函数，按部门分组并在部门内按工资降序打排号，最后取排名第一的。
```sql
SELECT id, name, salary, department_id
FROM (
    SELECT *,
           RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rnk
    FROM employee
) temp
WHERE temp.rnk = 1;
```

**🌟 面试加分项：**
如果面试官问："如果有两个人并列第一怎么办？"
你可以回答："使用方案1的 IN，或者方案2中的 `RANK()` / `DENSE_RANK()` 都会把并列第一的人全部查出来。如果强制只保留一个，可以在方案 2 中把 `RANK()` 换成 `ROW_NUMBER()`，它会强行为并列的数据分配 1 和 2。"

---

### ❓ 面试官：查询没有选修过"张三"老师任何一门课的学生信息？（经典学生选课表问题）
*频率：🔥🔥🔥🔥*

**💡 核心考点：**
多表联查（JOIN）与 `NOT IN` 或 `NOT EXISTS`。

**📝 表结构假设：**
`student` (sid, sname)
`teacher` (tid, tname)
`course` (cid, cname, tid)
`score` (sid, cid, score)

**解答思路（逆向思维）：**
正向查"没选过"很难，我们先正向查出**"选修过张三老师课的学生 ID"**，然后用 `NOT IN` 排除他们。

```sql
SELECT * FROM student
WHERE sid NOT IN (
    -- 第三步：查出选了这些课程的学生 ID
    SELECT sc.sid FROM score sc
    WHERE sc.cid IN (
        -- 第二步：查出张三教的所有课程 ID
        SELECT c.cid FROM course c
        JOIN teacher t ON c.tid = t.tid
        WHERE t.tname = '张三'
    )
);
```

**🌟 面试加分项：**
面试官可能会追问 `IN` 和 `EXISTS` 的区别。你可以回答：
"如果外部表（本题的 student 表）很大，而子查询结果集较小，用 `IN` 效率更好；如果外部表小，子查询表大，用 `EXISTS` 效率更好。不过在现代版本的 MySQL 中，优化器会自动将 `IN` 转换为 `EXISTS` 或者通过 `JOIN` 优化，两者的性能差距已经很小了。"

---

### ❓ 面试官：请写一个 SQL，查询出表中出现重复记录的所有数据？
*频率：🔥🔥🔥🔥*

**💡 核心考点：**
`GROUP BY` 与 `HAVING` 的结合。`WHERE` 是分组前的过滤，`HAVING` 是分组后的过滤。

**📝 表结构假设：**
`user` 表包含：`id`, `email`, `name`。我们需要找出 `email` 重复的数据。

**查询有哪些邮箱重复了：**
```sql
SELECT email, COUNT(*) as count
FROM user
GROUP BY email
HAVING count > 1;
```

**查询重复邮箱的完整信息：**
```sql
SELECT * FROM user
WHERE email IN (
    SELECT email
    FROM user
    GROUP BY email
    HAVING COUNT(*) > 1
);
```

**如果要删除重复数据，只保留 ID 最小的一条？（非常经典）**
```sql
DELETE u1 FROM user u1
JOIN user u2 
ON u1.email = u2.email 
AND u1.id > u2.id;
```
*(这段 SQL 的精妙之处在于自连接：只要 u1 找到了一个和自己 email 相同但 id 比自己小的 u2，u1 就会被删除)*

---

### ❓ 面试官：行列转换问题（经典的成绩单）
*频率：🔥🔥🔥*

**💡 核心考点：**
`SUM(CASE WHEN ... THEN ... END)` 或 `IF` 聚合。

**📝 表结构假设：**
原始数据（score_table）：
| 姓名 | 学科 | 分数 |
|------|------|------|
| 张三 | 语文 | 80   |
| 张三 | 数学 | 90   |
| 李四 | 语文 | 85   |

**要求转换为：**
| 姓名 | 语文 | 数学 |
|------|------|------|
| 张三 | 80   | 90   |
| 李四 | 85   | 0    |

**解答：**
```sql
SELECT 
    姓名,
    SUM(CASE WHEN 学科 = '语文' THEN 分数 ELSE 0 END) AS '语文',
    SUM(CASE WHEN 学科 = '数学' THEN 分数 ELSE 0 END) AS '数学'
FROM score_table
GROUP BY 姓名;
```

**🌟 面试加分项：**
"行转列的关键是使用 `GROUP BY` 把同一个人的多条记录压缩成一条，然后使用 `CASE WHEN` 配合聚合函数（`SUM` 或 `MAX` 都可以）将纵向的值推到横向的列上去。如果要处理的学科是动态的、不确定的，原生 SQL 很难处理，通常我会建议在 Java 代码层用 `Map` 或 `Stream API` 去完成这种动态的行列转换，而不是死磕 SQL。"

---

### ❓ 面试官：什么是 LEFT JOIN、RIGHT JOIN、INNER JOIN 的区别？
*频率：🔥🔥🔥*

**💡 一句话总结：**
- **INNER JOIN（内连接）**：只返回两张表中关联字段能匹配上的数据交集。
- **LEFT JOIN（左连接）**：无论右表有没有匹配，**左表的所有数据都会返回**。如果右表没匹配上，右表的字段全部显示为 NULL。
- **RIGHT JOIN（右连接）**：和左连接反过来，保留右表所有数据。

**🌟 面试加分项（常考坑点）：**
面试官常问："我在 `LEFT JOIN` 的 `ON` 条件里写限制，和在 `WHERE` 里写限制，有区别吗？"
**答：有本质区别！**
- `ON` 条件是在连接生成临时表时起作用的。因为是左连接，即使 `ON` 后面的条件不满足，左表的数据**依然会保留返回**。
- `WHERE` 条件是在临时表完全生成后，再对整个结果集进行过滤。如果不满足 `WHERE`，整行数据（包括左表的部分）都会被无情剔除！

**举例**：
```sql
-- 会返回所有左表数据，哪怕 b.status 不等于 1
SELECT * FROM a LEFT JOIN b ON a.id = b.a_id AND b.status = 1;

-- 如果没有匹配上 b.status=1，这行数据会被过滤掉（相当于退化成了 INNER JOIN）
SELECT * FROM a LEFT JOIN b ON a.id = b.a_id WHERE b.status = 1;
```