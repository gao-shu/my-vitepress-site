# MySQL JOIN 查询与子查询详解

---

### ❓ 面试官：MySQL 中有哪些 JOIN 类型？`INNER JOIN`、`LEFT JOIN`、`RIGHT JOIN` 有什么区别？
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
- `INNER JOIN`（内连接）：只返回两表**都有匹配**的记录。
- `LEFT JOIN`（左连接）：返回**左表全部记录**，右表没有匹配的用 `NULL` 填充。
- `RIGHT JOIN`（右连接）：返回**右表全部记录**，左表没有匹配的用 `NULL` 填充。
- `FULL JOIN`（全外连接）：MySQL 不支持，但可以用 `LEFT JOIN UNION RIGHT JOIN` 实现。

**📝 详细对比与实战示例：**

假设有两个表：
- `users` 表：`id, name`
- `orders` 表：`id, user_id, amount`

**1. INNER JOIN（最常用）**：
```sql
SELECT u.name, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```
**结果**：只返回有订单的用户（两表都有匹配）。

**2. LEFT JOIN（常用，查主表全部数据）**：
```sql
SELECT u.name, o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```
**结果**：返回所有用户，即使没有订单的用户也会显示（订单字段为 `NULL`）。

**3. RIGHT JOIN（不常用）**：
```sql
SELECT u.name, o.amount
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
```
**结果**：返回所有订单，即使订单对应的用户不存在（用户字段为 `NULL`）。

**🌟 面试加分项（实战经验）：**
"在实际业务中，`LEFT JOIN` 用得最多。比如统计每个用户的订单总数，即使某个用户没有订单，我们也希望显示 `0`，而不是直接忽略这个用户。这时候用 `LEFT JOIN` 配合 `COUNT(o.id)` 就能完美实现。"

---

### ❓ 面试官：子查询和 JOIN 查询有什么区别？什么时候用子查询，什么时候用 JOIN？
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
子查询是**嵌套查询**，先执行内层查询，再执行外层查询；JOIN 是**表连接**，一次性关联查询。**能用 JOIN 尽量用 JOIN，性能更好**；但某些复杂场景（如 EXISTS、IN 子查询）用子查询更直观。

**📝 性能对比与使用场景：**

**场景：查询订单金额大于平均订单金额的订单**

**方式一：子查询（性能较差）**：
```sql
SELECT * FROM orders
WHERE amount > (SELECT AVG(amount) FROM orders);
```

**方式二：JOIN（性能更好，推荐）**：
```sql
SELECT o.* FROM orders o
INNER JOIN (
    SELECT AVG(amount) as avg_amount FROM orders
) t ON o.amount > t.avg_amount;
```

**🌟 什么时候必须用子查询？**
1. **EXISTS / NOT EXISTS**：判断是否存在，不关心具体值。
   ```sql
   SELECT * FROM users u
   WHERE EXISTS (
       SELECT 1 FROM orders o WHERE o.user_id = u.id
   );
   ```
2. **IN / NOT IN**：判断值是否在某个集合中。
   ```sql
   SELECT * FROM users
   WHERE id IN (SELECT user_id FROM orders WHERE amount > 1000);
   ```
3. **标量子查询**：返回单个值的子查询，可以放在 SELECT、WHERE、HAVING 中。

**🔥 性能优化建议：**
"如果子查询返回的结果集很大，建议改成 JOIN。因为子查询通常会被 MySQL 优化器转换成临时表，而 JOIN 可以直接利用索引，性能更优。"