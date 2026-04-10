# Session、Cookie 与跨域问题

---

### ❓ 面试官：Session 和 Cookie 的区别是什么？它们是如何配合实现用户登录状态的？
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
- **Cookie**：存储在**客户端浏览器**的小文本文件，每次请求会自动携带。
- **Session**：存储在**服务器端**的用户会话数据，通过 SessionID 来标识。

**📝 详细工作原理：**

**1. Cookie 的特点**：
- 存储在浏览器中，有大小限制（通常 4KB）。
- 可以设置过期时间（`Expires` 或 `Max-Age`）。
- 每次 HTTP 请求，浏览器会自动在请求头中携带 Cookie。
- **安全性**：可以被客户端修改，不安全。

**2. Session 的特点**：
- 存储在服务器内存或 Redis 中。
- 通过 `JSESSIONID`（Java）或自定义的 SessionID 来标识。
- SessionID 通常存储在 Cookie 中（也可以放在 URL 参数中，但不安全）。
- **安全性**：数据在服务器端，相对安全。

**3. 登录流程（Cookie + Session 配合）**：
```
1. 用户输入账号密码，提交登录请求
2. 服务器验证通过，在服务器端创建一个 Session，存储用户信息
3. 服务器将 SessionID 写入响应头的 Set-Cookie，返回给浏览器
4. 浏览器保存这个 Cookie（包含 SessionID）
5. 后续请求，浏览器自动在请求头中携带这个 Cookie
6. 服务器根据 SessionID 从 Session 中取出用户信息，判断是否登录
```

**🌟 面试加分项（实战优化）：**
"在分布式系统中，Session 不能存在单机内存里（因为用户可能访问不同的服务器）。我们通常把 Session 存在 Redis 中，实现**分布式 Session**。这样无论用户访问哪台服务器，都能拿到相同的 Session 数据。"

---

### ❓ 面试官：什么是跨域问题？如何解决跨域？CORS 的原理是什么？
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
跨域是浏览器的**同源策略**限制。当前端（`http://localhost:8080`）调用后端 API（`http://api.example.com`）时，如果协议、域名、端口任一不同，浏览器就会阻止请求。解决跨域的方法有：**CORS（跨域资源共享）**、**JSONP**、**Nginx 反向代理**。

**📝 详细解决方案：**

**1. CORS（最常用，推荐）**：
CORS 是 W3C 标准，通过服务器设置响应头来允许跨域。

**后端配置（SpringBoot）**：
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:8080")  // 允许的前端域名
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*")
                        .allowCredentials(true);  // 允许携带 Cookie
            }
        };
    }
}
```

**CORS 工作原理**：
- 浏览器发送**预检请求（OPTIONS）**，询问服务器是否允许跨域。
- 服务器返回响应头：`Access-Control-Allow-Origin: http://localhost:8080`。
- 浏览器检查通过后，才发送真正的请求。

**2. Nginx 反向代理（生产环境常用）**：
```nginx
server {
    listen 80;
    server_name api.example.com;
    
    location /api {
        proxy_pass http://backend-server:8080;  # 转发到后端
    }
}
```
前端访问 `http://api.example.com/api`，Nginx 转发到后端，因为前端和 Nginx 同域，所以没有跨域问题。

**3. JSONP（已过时，了解即可）**：
利用 `<script>` 标签不受同源策略限制的特性，通过回调函数获取数据。

**🌟 面试加分项：**
"在实际项目中，我们通常用 Nginx 反向代理解决跨域，因为这样前端代码不需要任何改动，且可以统一处理请求转发、负载均衡、SSL 证书等。"