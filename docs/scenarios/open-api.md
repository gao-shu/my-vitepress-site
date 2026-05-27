# 对外 API 接口设计与开发实战

---

## 一、第三方接口身份认证方案详解

### ❓ 面试官：第三方接口对接时，身份认证有哪些实现方式？你们用的是什么方案？
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
常见的身份认证方案有 **5 种**：**AppKey/AppSecret 签名**、**OAuth 2.0**、**JWT Token**、**API Key**、**双向 SSL 证书**。我们根据场景选择：**内部系统对接用 AppKey 签名，开放平台用 OAuth 2.0，移动端用 JWT，高安全场景用双向 SSL**。

**📝 5 种主流认证方案对比：**

| 方案 | 安全性 | 复杂度 | 适用场景 | 优点 | 缺点 |
|------|--------|--------|---------|------|------|
| **AppKey + AppSecret 签名** | ⭐⭐⭐⭐ | 中 | B2B 系统对接、内部系统集成 | 实现简单、防篡改、防重放 | 需要管理密钥、客户端需实现签名逻辑 |
| **OAuth 2.0** | ⭐⭐⭐⭐⭐ | 高 | 开放平台、第三方登录 | 标准化、权限细粒度、用户授权 | 实现复杂、需要授权服务器 |
| **JWT Token** | ⭐⭐⭐⭐ | 低 | 移动端 APP、单页应用 | 无状态、跨域友好、自包含信息 | Token 无法主动失效、体积较大 |
| **API Key** | ⭐⭐ | 极低 | 公开 API、低安全要求 | 最简单、易于调试 | 明文传输、易泄露、无防重放 |
| **双向 SSL 证书** | ⭐⭐⭐⭐⭐ | 极高 | 金融、政务等高安全场景 | 最高安全性、双向认证 | 配置复杂、证书管理成本高 |

---

### 方案 1：AppKey + AppSecret 签名（最常用）

**适用场景**：B2B 系统对接、企业内部系统集成、合作伙伴 API。

**核心原理**：
1. 服务端为每个第三方应用分配 `AppKey`（公开）和 `AppSecret`（保密）
2. 客户端使用 `AppSecret` 对请求参数进行签名
3. 服务端用同样的算法重新计算签名并比对
4. 通过时间戳 + 随机数防止重放攻击

**完整实现流程**：

```
┌─────────────┐                              ┌──────────────┐
│   客户端     │                              │   服务端      │
└──────┬──────┘                              └──────┬───────┘
       │                                            │
       │  1. 准备请求参数                            │
       │  2. 生成 timestamp + nonce                 │
       │  3. 使用 AppSecret 签名                     │
       │  4. 发起 HTTP 请求                          │
       │  (app_key, timestamp, nonce, sign, params) │
       │ ─────────────────────────────────────────► │
       │                                            │ 5. 验证 AppKey
       │                                            │ 6. 检查时间戳
       │                                            │ 7. 检查 nonce
       │                                            │ 8. 重新计算签名
       │                                            │ 9. 比对签名
       │                                            │
       │  10. 返回业务数据                           │
       │ ◄───────────────────────────────────────── │
```

**技术实现要点**：

1. **签名算法选择**：
   - **MD5**：速度快，适合一般场景
   - **SHA256**：更安全，推荐用于敏感数据
   - **HMAC-SHA256**：最安全，防止长度扩展攻击

2. **防重放攻击三重保障**：
   - **时间戳校验**：允许 ±5 分钟误差
   - **nonce 唯一性**：存入 Redis，5 分钟过期
   - **HTTPS 传输**：防止中间人窃听

3. **密钥管理**：
   - `AppSecret` 必须加密存储（BCrypt）
   - 支持密钥轮换（新旧密钥同时有效 24 小时）
   - 提供密钥重置功能

**代码示例**：见下文"开放平台完整架构设计"中的身份认证机制部分

**优势**：
- ✅ 实现相对简单，双方都能快速接入
- ✅ 防篡改：签名保证参数完整性
- ✅ 防重放：时间戳 + nonce 双重保护
- ✅ 无需额外基础设施（如 OAuth Server）

**劣势**：
- ⚠️ 需要客户端实现签名逻辑
- ⚠️ 密钥泄露后需要立即更换
- ⚠️ 不支持用户级别的细粒度权限控制

---

### 方案 2：OAuth 2.0 授权码模式（开放平台首选）

**适用场景**：开放平台、第三方登录、需要用户授权的场景。

**核心原理**：
通过授权码（Authorization Code）间接获取访问令牌（Access Token），避免将用户凭证直接暴露给第三方应用。

**完整授权流程**：

```
步骤 1：用户同意授权
┌────────┐         ┌──────────────┐         ┌──────────┐
│ 用户    │         │ 第三方应用    │         │ 授权服务器 │
└───┬────┘         └──────┬───────┘         └────┬─────┘
    │                      │                      │
    │  1. 点击"授权"        │                      │
    │ ───────────────────► │                      │
    │                      │  2. 重定向到授权页面   │
    │                      │ ───────────────────► │
    │  3. 显示授权确认页面   │                      │
    │ ◄────────────────────────────────────────── │
    │  4. 用户确认授权       │                      │
    │ ──────────────────────────────────────────► │
    │                      │  5. 返回授权码 code    │
    │                      │ ◄─────────────────── │
    │                      │                      │
    │                      │  6. 用 code 换取 token│
    │                      │ ───────────────────► │
    │                      │  7. 返回 access_token│
    │                      │ ◄─────────────────── │
    │                      │                      │
    │                      │  8. 携带 token 调用 API│
    │                      │ ───────────────────► │
    │                      │  9. 返回业务数据      │
    │                      │ ◄─────────────────── │
```

**技术实现**：

```java
// 1. 授权端点
@GetMapping("/oauth/authorize")
public String authorize(
    @RequestParam String client_id,
    @RequestParam String redirect_uri,
    @RequestParam String scope,
    HttpSession session) {
    
    // 验证 client_id
    OAuthClient client = oauthClientMapper.selectByClientId(client_id);
    if (client == null) {
        return "error:invalid_client";
    }
    
    // 保存授权请求到 session
    session.setAttribute("oauth_request", new OAuthRequest(client_id, redirect_uri, scope));
    
    // 如果用户未登录，跳转到登录页
    if (session.getAttribute("user") == null) {
        return "redirect:/login?from=oauth";
    }
    
    // 显示授权确认页面
    return "oauth/authorize_confirm";
}

// 2. 用户确认授权后，生成授权码
@PostMapping("/oauth/confirm")
public String confirmAuthorization(@RequestParam boolean approved, HttpSession session) {
    OAuthRequest request = (OAuthRequest) session.getAttribute("oauth_request");
    
    if (!approved) {
        return "redirect:" + request.getRedirectUri() + "?error=access_denied";
    }
    
    // 生成授权码（有效期 10 分钟）
    String code = UUID.randomUUID().toString();
    redisTemplate.opsForValue().set("oauth:code:" + code, 
        JSON.toJSONString(request), 10, TimeUnit.MINUTES);
    
    // 重定向回第三方应用，带上授权码
    return "redirect:" + request.getRedirectUri() + "?code=" + code;
}

// 3. 用授权码换取 Access Token
@PostMapping("/oauth/token")
public ResponseEntity<Map<String, Object>> getToken(
    @RequestParam String grant_type,
    @RequestParam String code,
    @RequestParam String client_id,
    @RequestParam String client_secret) {
    
    // 验证客户端凭证
    OAuthClient client = oauthClientMapper.selectByClientId(client_id);
    if (client == null || !client.getClientSecret().equals(client_secret)) {
        return ResponseEntity.status(401).body(Map.of("error", "invalid_client"));
    }
    
    // 验证授权码
    String codeData = redisTemplate.opsForValue().get("oauth:code:" + code);
    if (codeData == null) {
        return ResponseEntity.badRequest().body(Map.of("error", "invalid_grant"));
    }
    
    // 删除已使用的授权码（一次性）
    redisTemplate.delete("oauth:code:" + code);
    
    // 生成 Access Token（有效期 2 小时）
    String accessToken = generateAccessToken(client_id);
    String refreshToken = generateRefreshToken(client_id);
    
    // 存入 Redis
    Map<String, Object> tokenInfo = Map.of(
        "client_id", client_id,
        "scope", JSON.parseObject(codeData).getString("scope"),
        "create_time", System.currentTimeMillis()
    );
    redisTemplate.opsForValue().set("oauth:token:" + accessToken, 
        JSON.toJSONString(tokenInfo), 2, TimeUnit.HOURS);
    
    // 返回 Token
    Map<String, Object> response = new HashMap<>();
    response.put("access_token", accessToken);
    response.put("refresh_token", refreshToken);
    response.put("expires_in", 7200);
    response.put("token_type", "Bearer");
    
    return ResponseEntity.ok(response);
}

// 4. Token 验证拦截器
@Component
public class OAuthTokenInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(401);
            response.getWriter().write("{\"error\":\"unauthorized\"}");
            return false;
        }
        
        String token = authHeader.substring(7);
        String tokenInfo = redisTemplate.opsForValue().get("oauth:token:" + token);
        
        if (tokenInfo == null) {
            response.setStatus(401);
            response.getWriter().write("{\"error\":\"invalid_token\"}");
            return false;
        }
        
        // 将客户端信息放入请求上下文
        OAuthContext.setClient(JSON.parseObject(tokenInfo, OAuthClient.class));
        return true;
    }
}
```

**优势**：
- ✅ 标准化协议，生态系统成熟
- ✅ 用户授权，无需共享密码
- ✅ 支持细粒度权限控制（scope）
- ✅ Access Token 短期有效，降低泄露风险
- ✅ 支持 Refresh Token 刷新机制

**劣势**：
- ⚠️ 实现复杂，需要授权服务器
- ⚠️ 交互流程多，用户体验稍差
- ⚠️ 不适合机器对机器（M2M）场景

---

### 方案 3：JWT Token（移动端/SPA 首选）

**适用场景**：移动端 APP、单页应用（SPA）、微服务间调用。

**核心原理**：
JWT（JSON Web Token）是自包含的令牌，包含用户信息和签名，服务端无需存储即可验证。

**JWT 结构**：
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.    ← Header（算法 + 类型）
eyJ1c2VyX2lkIjoxMjMsInJvbGUiOiJhZG1pbiJ9.  ← Payload（用户信息）
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature（签名）
```

**技术实现**：

```java
@Component
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration:7200000}")  // 默认 2 小时
    private Long expiration;
    
    /**
     * 生成 JWT Token
     */
    public String generateToken(Long userId, String username, List<String> roles) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("username", username)
                .claim("roles", roles)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }
    
    /**
     * 验证并解析 Token
     */
    public Claims validateToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            throw new BusinessException(401, "Token 无效或已过期");
        }
    }
    
    /**
     * 从 Token 中获取用户 ID
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = validateToken(token);
        return Long.parseLong(claims.getSubject());
    }
}

// Token 验证拦截器
@Component
public class JwtAuthInterceptor implements HandlerInterceptor {
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = resolveToken(request);
        
        if (token == null) {
            response.setStatus(401);
            response.getWriter().write("{\"error\":\"missing_token\"}");
            return false;
        }
        
        try {
            Claims claims = tokenProvider.validateToken(token);
            
            // 将用户信息放入请求上下文
            UserContext.setUserId(Long.parseLong(claims.getSubject()));
            UserContext.setUsername(claims.get("username", String.class));
            
            return true;
        } catch (BusinessException e) {
            response.setStatus(401);
            response.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
            return false;
        }
    }
    
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

**前端调用示例**：
```javascript
// 登录获取 Token
async function login(username, password) {
  const response = await axios.post('/api/auth/login', {
    username,
    password
  });
  
  const token = response.data.access_token;
  
  // 存储到 localStorage
  localStorage.setItem('token', token);
  
  // 设置 Axios 默认请求头
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// 后续请求自动携带 Token
axios.get('/api/orders').then(response => {
  console.log(response.data);
});
```

**优势**：
- ✅ 无状态：服务端无需存储 Session
- ✅ 跨域友好：适合前后端分离架构
- ✅ 性能好：减少数据库查询
- ✅ 可扩展：Payload 可携带自定义信息
- ✅ 移动端友好：不需要 Cookie

**劣势**：
- ⚠️ Token 无法主动失效（除非加入黑名单机制）
- ⚠️ Token 体积较大（相比 Session ID）
- ⚠️ 一旦签发，有效期内一直有效
- ⚠️ 需要妥善保护 Secret Key

**解决方案：Token 黑名单机制**
```java
// 登出时将 Token 加入黑名单
@PostMapping("/auth/logout")
public Result<Void> logout(@RequestHeader("Authorization") String authHeader) {
    String token = authHeader.substring(7);
    
    // 解析 Token 获取过期时间
    Claims claims = tokenProvider.validateToken(token);
    long expirationTime = claims.getExpiration().getTime();
    long ttl = expirationTime - System.currentTimeMillis();
    
    if (ttl > 0) {
        // 将 Token 加入 Redis 黑名单，TTL 为剩余有效期
        redisTemplate.opsForValue().set("blacklist:" + token, "1", ttl, TimeUnit.MILLISECONDS);
    }
    
    return Result.success(null);
}

// 验证 Token 时检查黑名单
public Claims validateToken(String token) {
    // 检查是否在黑名单中
    if (Boolean.TRUE.equals(redisTemplate.hasKey("blacklist:" + token))) {
        throw new BusinessException(401, "Token 已失效");
    }
    
    // 正常验证逻辑...
}
```

---

### 方案 4：API Key（最简单）

**适用场景**：公开 API、低安全要求、快速原型开发。

**核心原理**：
在请求头或查询参数中携带固定的 API Key，服务端验证 Key 的有效性。

**技术实现**：

```java
@Component
public class ApiKeyInterceptor implements HandlerInterceptor {
    
    @Autowired
    private ApiKeyMapper apiKeyMapper;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 从请求头获取 API Key
        String apiKey = request.getHeader("X-API-Key");
        
        if (apiKey == null || apiKey.isEmpty()) {
            response.setStatus(401);
            response.getWriter().write("{\"error\":\"missing_api_key\"}");
            return false;
        }
        
        // 验证 API Key
        ApiKey key = apiKeyMapper.selectByKey(apiKey);
        if (key == null || key.getStatus() == 0) {
            response.setStatus(401);
            response.getWriter().write("{\"error\":\"invalid_api_key\"}");
            return false;
        }
        
        // 记录调用日志
        apiKeyMapper.incrementUsage(key.getId());
        
        return true;
    }
}
```

**调用示例**：
```bash
curl -H "X-API-Key: your_api_key_here" \
     https://api.example.com/v1/data
```

**优势**：
- ✅ 实现极其简单
- ✅ 易于调试和测试
- ✅ 适合低频调用的公开 API

**劣势**：
- ⚠️ 明文传输，易被截获（必须使用 HTTPS）
- ⚠️ 无防重放机制
- ⚠️ 密钥泄露后难以追溯
- ⚠️ 安全性最低

---

### 方案 5：双向 SSL 证书（最高安全级别）

**适用场景**：金融机构、政务系统、企业内部高安全要求的核心系统。

**核心原理**：
客户端和服务端都持有数字证书，建立 HTTPS 连接时互相验证对方证书的真实性。

**配置步骤**：

1. **生成证书**
```bash
# 生成服务端证书
keytool -genkeypair -alias server -keyalg RSA -keysize 2048 \
  -keystore server.keystore -validity 3650

# 生成客户端证书
keytool -genkeypair -alias client -keyalg RSA -keysize 2048 \
  -keystore client.keystore -validity 3650

# 导出客户端公钥
keytool -exportcert -alias client -file client.cer \
  -keystore client.keystore

# 将客户端公钥导入到服务端信任库
keytool -importcert -alias client -file client.cer \
  -keystore server.truststore
```

2. **Spring Boot 配置**
```yaml
server:
  ssl:
    enabled: true
    key-store: classpath:server.keystore
    key-store-password: changeit
    key-store-type: JKS
    trust-store: classpath:server.truststore
    trust-store-password: changeit
    client-auth: need  # 强制客户端提供证书
```

3. **客户端配置**
```java
// 使用 RestTemplate 配置双向 SSL
@Bean
public RestTemplate restTemplate() throws Exception {
    // 加载客户端证书
    KeyStore keyStore = KeyStore.getInstance("JKS");
    keyStore.load(new FileInputStream("client.keystore"), "changeit".toCharArray());
    
    // 加载服务端公钥
    KeyStore trustStore = KeyStore.getInstance("JKS");
    trustStore.load(new FileInputStream("client.truststore"), "changeit".toCharArray());
    
    SSLContext sslContext = SSLContexts.custom()
        .loadKeyMaterial(keyStore, "changeit".toCharArray())
        .loadTrustMaterial(trustStore, null)
        .build();
    
    CloseableHttpClient httpClient = HttpClients.custom()
        .setSSLContext(sslContext)
        .build();
    
    HttpComponentsClientHttpRequestFactory factory = 
        new HttpComponentsClientHttpRequestFactory(httpClient);
    
    return new RestTemplate(factory);
}
```

**优势**：
- ✅ 最高安全性，双向身份验证
- ✅ 防止中间人攻击
- ✅ 证书吊销机制（CRL/OCSP）

**劣势**：
- ⚠️ 配置复杂，运维成本高
- ⚠️ 证书管理繁琐（颁发、更新、吊销）
- ⚠️ 性能开销较大（SSL 握手）
- ⚠️ 不适合大规模开放场景

---

### 方案选型建议

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| **B2B 系统对接** | AppKey + AppSecret | 平衡安全性和复杂度，业界标准 |
| **开放平台（第三方开发者）** | OAuth 2.0 | 标准化、用户授权、生态成熟 |
| **移动端 APP** | JWT Token | 无状态、跨域友好、性能好 |
| **内部微服务调用** | JWT / mTLS | 根据安全要求选择 |
| **公开 API（低安全）** | API Key | 最简单，快速接入 |
| **金融/政务核心系统** | 双向 SSL | 最高安全级别 |

---

## 二、开放平台完整架构设计

---

### ❓ 面试官：你们公司需要开放 API 给第三方合作伙伴调用（比如让其他系统查询订单、同步库存），如何设计一套安全、稳定、易用的开放平台？【中高级】
*频率：🔥🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
开放 API 的核心是 **"身份认证 + 权限控制 + 流量限制 + 数据签名 + 版本管理"**。不能简单地把内部接口暴露出去，必须构建独立的网关层来做安全防护和流量治理。

**📝 完整架构设计方案：**

#### 1. 身份认证机制（AppKey + AppSecret）

**核心思路**：每个第三方应用分配唯一的 `AppKey`（公开）和 `AppSecret`（保密），通过签名算法验证请求合法性。

```java
// 第三方应用注册表
CREATE TABLE open_api_app (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    app_name VARCHAR(128) COMMENT '应用名称',
    app_key VARCHAR(64) NOT NULL UNIQUE COMMENT '应用公钥',
    app_secret VARCHAR(128) NOT NULL COMMENT '应用私钥（加密存储）',
    status TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
    rate_limit INT DEFAULT 1000 COMMENT '每秒请求限制',
    expire_date DATE COMMENT '授权到期时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入示例
INSERT INTO open_api_app VALUES 
(1, '某某ERP系统', 'ak_202401010001', '$2a$10$xxx_encrypted_secret', 1, 1000, '2025-12-31');
```

**签名算法实现**：
```java
@Component
public class ApiSignatureService {
    
    /**
     * 生成签名
     * 签名规则：MD5(AppSecret + timestamp + nonce + sorted_params)
     */
    public String generateSignature(String appSecret, long timestamp, String nonce, Map<String, String> params) {
        // 1. 参数按 key 排序
        TreeMap<String, String> sortedParams = new TreeMap<>(params);
        
        // 2. 拼接签名字符串
        StringBuilder signStr = new StringBuilder(appSecret);
        signStr.append(timestamp);
        signStr.append(nonce);
        
        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            signStr.append(entry.getKey()).append(entry.getValue());
        }
        
        // 3. MD5 加密
        return DigestUtils.md5Hex(signStr.toString());
    }
    
    /**
     * 验证签名
     */
    public boolean verifySignature(String appKey, String signature, long timestamp, 
                                   String nonce, Map<String, String> params) {
        // 1. 根据 appKey 查询 appSecret
        OpenApiApp app = appMapper.selectByAppKey(appKey);
        if (app == null || app.getStatus() == 0) {
            return false;
        }
        
        // 2. 检查时间戳有效期（防止重放攻击，允许 5 分钟误差）
        long currentTime = System.currentTimeMillis();
        if (Math.abs(currentTime - timestamp) > 5 * 60 * 1000) {
            throw new BusinessException("请求已过期");
        }
        
        // 3. 检查 nonce 是否已使用（防重放，存入 Redis 设置 5 分钟过期）
        String nonceKey = "api:nonce:" + nonce;
        Boolean exists = redisTemplate.hasKey(nonceKey);
        if (Boolean.TRUE.equals(exists)) {
            throw new BusinessException("重复的请求");
        }
        redisTemplate.opsForValue().set(nonceKey, "1", 5, TimeUnit.MINUTES);
        
        // 4. 重新计算签名并比对
        String expectedSign = generateSignature(app.getAppSecret(), timestamp, nonce, params);
        return expectedSign.equals(signature);
    }
}
```

**客户端调用示例**：
``javascript
// 前端/第三方系统调用示例
const axios = require('axios');
const crypto = require('crypto');

function callOpenApi(endpoint, params) {
    const appKey = 'ak_202401010001';
    const appSecret = 'your_app_secret';
    const timestamp = Date.now();
    const nonce = Math.random().toString(36).substring(2, 15);
    
    // 生成签名
    const sortedParams = Object.keys(params).sort().reduce((obj, key) => {
        obj[key] = params[key];
        return obj;
    }, {});
    
    let signStr = appSecret + timestamp + nonce;
    for (let key in sortedParams) {
        signStr += key + sortedParams[key];
    }
    const signature = crypto.createHash('md5').update(signStr).digest('hex');
    
    // 发起请求
    return axios.get(`https://api.yourcompany.com${endpoint}`, {
        params: {
            ...params,
            app_key: appKey,
            timestamp: timestamp,
            nonce: nonce,
            sign: signature
        }
    });
}

// 调用示例：查询订单
callOpenApi('/api/v1/orders/query', {
    order_no: 'ORD20240101001',
    page: 1,
    page_size: 20
});
```

---

#### 2. 限流与熔断保护

**为什么需要限流**：防止某个第三方应用疯狂调用接口，拖垮整个系统。

**基于 Redis 的滑动窗口限流**：
```java
@Component
public class ApiRateLimiter {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    /**
     * 检查是否超过限流阈值
     * @param appKey 应用标识
     * @param limit 每秒最大请求数
     * @return true-允许通过 false-拒绝请求
     */
    public boolean tryAcquire(String appKey, int limit) {
        String key = "api:rate:" + appKey;
        long currentTime = System.currentTimeMillis();
        long windowStart = currentTime - 1000; // 1秒窗口
        
        // 使用 ZSET 实现滑动窗口
        redisTemplate.opsForZSet().removeRangeByScore(key, 0, windowStart);
        
        Long count = redisTemplate.opsForZSet().count(key, windowStart, currentTime);
        
        if (count != null && count >= limit) {
            return false; // 超过限流
        }
        
        // 记录本次请求
        redisTemplate.opsForZSet().add(key, String.valueOf(currentTime), currentTime);
        redisTemplate.expire(key, 2, TimeUnit.SECONDS); // 2秒后自动清理
        
        return true;
    }
}

// 拦截器中使用
@Component
public class ApiAuthInterceptor implements HandlerInterceptor {
    
    @Autowired
    private ApiSignatureService signatureService;
    
    @Autowired
    private ApiRateLimiter rateLimiter;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1. 提取参数
        String appKey = request.getParameter("app_key");
        String signature = request.getParameter("sign");
        String timestamp = request.getParameter("timestamp");
        String nonce = request.getParameter("nonce");
        
        // 2. 验证签名
        Map<String, String> params = extractParams(request);
        if (!signatureService.verifySignature(appKey, signature, Long.parseLong(timestamp), nonce, params)) {
            responseError(response, 401, "签名验证失败");
            return false;
        }
        
        // 3. 限流检查
        OpenApiApp app = appMapper.selectByAppKey(appKey);
        if (!rateLimiter.tryAcquire(appKey, app.getRateLimit())) {
            responseError(response, 429, "请求过于频繁，请稍后再试");
            return false;
        }
        
        // 4. 将 app 信息放入请求上下文，供后续业务使用
        ApiContextHolder.setApp(app);
        
        return true;
    }
}
```

---

#### 3. 接口版本管理

**问题**：随着业务发展，API 接口可能需要升级（比如增加字段、改变返回结构），但不能影响正在使用的老版本。

**解决方案**：URL 路径版本号 + 向后兼容策略

```
https://api.yourcompany.com/api/v1/orders/query    # 第一版
https://api.yourcompany.com/api/v2/orders/query    # 第二版（新增字段）
https://api.yourcompany.com/api/v3/orders/query    # 第三版（废弃旧字段）
```

**Controller 层实现**：
```java
@RestController
@RequestMapping("/api/v1")
public class OrderApiControllerV1 {
    
    @GetMapping("/orders/query")
    public ApiResponse<OrderVO> queryOrder(@RequestParam String orderNo) {
        Order order = orderService.getByOrderNo(orderNo);
        
        // V1 版本只返回基础字段
        OrderVO vo = new OrderVO();
        vo.setOrderNo(order.getOrderNo());
        vo.setAmount(order.getAmount());
        vo.setStatus(order.getStatus());
        // 注意：V1 不返回 create_time、pay_time 等新字段
        
        return ApiResponse.success(vo);
    }
}

@RestController
@RequestMapping("/api/v2")
public class OrderApiControllerV2 {
    
    @GetMapping("/orders/query")
    public ApiResponse<OrderVOV2> queryOrder(@RequestParam String orderNo) {
        Order order = orderService.getByOrderNo(orderNo);
        
        // V2 版本返回完整字段
        OrderVOV2 vo = new OrderVOV2();
        vo.setOrderNo(order.getOrderNo());
        vo.setAmount(order.getAmount());
        vo.setStatus(order.getStatus());
        vo.setCreateTime(order.getCreateTime());      // 新增
        vo.setPayTime(order.getPayTime());            // 新增
        vo.setCustomerInfo(buildCustomerInfo(order)); // 新增嵌套对象
        
        return ApiResponse.success(vo);
    }
}
```

**版本升级策略**：
1. **v1 → v2**：新增字段，不影响老用户（向后兼容）
2. **v2 → v3**：废弃某些字段，但保留 6 个月过渡期
3. **公告机制**：提前 3 个月邮件通知所有开发者即将废弃的版本
4. **监控统计**：定期查看各版本的使用量，确认可以下线旧版本

---

#### 4. 统一响应格式与错误码

**标准化响应体**：
```java
@Data
public class ApiResponse<T> {
    private Integer code;        // 业务状态码
    private String message;      // 提示信息
    private T data;              // 业务数据
    private Long timestamp;      // 响应时间戳
    private String requestId;    // 请求追踪ID（用于排查问题）
    
    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("success");
        response.setData(data);
        response.setTimestamp(System.currentTimeMillis());
        response.setRequestId(MDC.get("requestId"));
        return response;
    }
    
    public static <T> ApiResponse<T> error(Integer code, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(code);
        response.setMessage(message);
        response.setTimestamp(System.currentTimeMillis());
        response.setRequestId(MDC.get("requestId"));
        return response;
    }
}
```

**错误码规范**：
```java
public enum ApiErrorCode {
    SUCCESS(200, "成功"),
    
    // 认证相关 4000-4099
    INVALID_APP_KEY(4001, "无效的 AppKey"),
    SIGNATURE_ERROR(4002, "签名验证失败"),
    REQUEST_EXPIRED(4003, "请求已过期"),
    DUPLICATE_NONCE(4004, "重复的请求"),
    
    // 限流相关 4100-4199
    RATE_LIMIT_EXCEEDED(429, "请求过于频繁"),
    
    // 业务相关 5000-5999
    ORDER_NOT_FOUND(5001, "订单不存在"),
    PARAM_INVALID(5002, "参数校验失败"),
    PERMISSION_DENIED(5003, "无权访问该资源"),
    
    // 系统异常 6000-6999
    SYSTEM_ERROR(6000, "系统繁忙，请稍后再试");
    
    private final Integer code;
    private final String message;
    
    ApiErrorCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
```

**实际响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "order_no": "ORD20240101001",
    "amount": 299.00,
    "status": "PAID"
  },
  "timestamp": 1704067200000,
  "request_id": "req_abc123def456"
}
```

---

#### 5. 日志记录与监控告警

**关键指标监控**：
```java
@Aspect
@Component
@Slf4j
public class ApiLogAspect {
    
    @Autowired
    private MetricsService metricsService;
    
    @Around("@annotation(ApiEndpoint)")
    public Object recordApiCall(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String apiPath = getApiPath(joinPoint);
        String appKey = getCurrentAppKey();
        
        try {
            Object result = joinPoint.proceed();
            
            // 记录成功日志
            long duration = System.currentTimeMillis() - startTime;
            log.info("API调用成功 | appKey={} | path={} | duration={}ms", 
                     appKey, apiPath, duration);
            
            // 上报监控指标
            metricsService.recordSuccess(apiPath, duration);
            
            return result;
            
        } catch (Exception e) {
            // 记录异常日志
            log.error("API调用失败 | appKey={} | path={}", appKey, apiPath, e);
            metricsService.recordFailure(apiPath);
            throw e;
        }
    }
}
```

**告警规则**：
- 单个接口错误率 > 5% → 发送钉钉/企业微信告警
- 单个应用 QPS 突增 10 倍 → 疑似被攻击，触发限流
- 平均响应时间 > 2s → 检查数据库慢查询
- 签名验证失败次数 > 100 次/小时 → 可能有恶意扫描

---

### ❓ 面试官：如果第三方调用你的 API 时，网络不稳定导致超时或失败，你如何保证数据的最终一致性？比如扣库存接口。【中级】
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
采用 **"幂等性设计 + 异步补偿 + 对账机制"** 三重保障。不能依赖单次调用成功，而要设计成"可重试、可追溯、可对账"的健壮系统。

**📝 具体实现方案：**

#### 方案一：接口幂等性（核心！）

**问题**：第三方调用扣库存接口，第一次请求超时了（实际已成功），第三方又重试了一次，导致库存扣了两次。

**解决**：要求每次请求携带唯一的 `biz_no`（业务流水号），服务端根据 biz_no 做去重。

```sql
-- 业务流水号表（唯一索引保证幂等）
CREATE TABLE api_idempotent_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    biz_no VARCHAR(64) NOT NULL UNIQUE COMMENT '业务流水号',
    app_key VARCHAR(64) NOT NULL COMMENT '调用方标识',
    api_path VARCHAR(128) NOT NULL COMMENT '接口路径',
    request_params TEXT COMMENT '请求参数快照',
    response_result TEXT COMMENT '响应结果',
    status TINYINT COMMENT '0处理中 1成功 2失败',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_app_biz (app_key, biz_no)
);
```

**服务端实现**：
```java
@Service
public class InventoryApiService {
    
    @Transactional
    public ApiResponse deductStock(String bizNo, String appKey, Long skuId, Integer quantity) {
        // 1. 检查是否已处理过（幂等性校验）
        ApiIdempotentRecord record = idempotentMapper.selectByBizNo(bizNo);
        if (record != null) {
            // 已经处理过，直接返回之前的结果
            if (record.getStatus() == 1) {
                return ApiResponse.success(JSON.parseObject(record.getResponseResult()));
            } else if (record.getStatus() == 2) {
                return ApiResponse.error(5001, "业务处理失败，请检查参数");
            }
        }
        
        // 2. 插入幂等记录（状态=处理中）
        record = new ApiIdempotentRecord();
        record.setBizNo(bizNo);
        record.setAppKey(appKey);
        record.setStatus(0);
        idempotentMapper.insert(record);
        
        try {
            // 3. 执行业务逻辑
            boolean success = inventoryService.deduct(skuId, quantity);
            
            if (!success) {
                // 更新为失败状态
                record.setStatus(2);
                idempotentMapper.updateById(record);
                return ApiResponse.error(5002, "库存不足");
            }
            
            // 4. 更新为成功状态
            record.setStatus(1);
            record.setResponseResult("{\"success\":true,\"remaining_stock\":100}");
            idempotentMapper.updateById(record);
            
            return ApiResponse.success(Map.of("remaining_stock", 100));
            
        } catch (Exception e) {
            // 5. 异常回滚
            record.setStatus(2);
            idempotentMapper.updateById(record);
            throw e;
        }
    }
}
```

**客户端调用示例**：
```javascript
// 生成唯一业务流水号
const bizNo = `DEDUCT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// 第一次调用（可能超时）
try {
    await callOpenApi('/api/v1/inventory/deduct', {
        biz_no: bizNo,  // 关键：携带唯一流水号
        sku_id: 1001,
        quantity: 5
    });
} catch (error) {
    // 超时或失败，用同一个 biz_no 重试
    console.log('重试中...');
    await callOpenApi('/api/v1/inventory/deduct', {
        biz_no: bizNo,  // 相同的流水号
        sku_id: 1001,
        quantity: 5
    });
}
```

---

#### 方案二：异步补偿与对账

**场景**：即使有幂等性，也可能出现极端情况（比如数据库主从延迟导致查询不到幂等记录）。

**补偿机制**：
```java
@Component
public class ApiReconciliationJob {
    
    /**
     * 每小时执行一次对账任务
     */
    @Scheduled(cron = "0 0 * * * ?")
    public void reconcile() {
        log.info("开始执行 API 对账任务");
        
        // 1. 获取最近 1 小时内所有成功的扣库存记录
        List<ApiIdempotentRecord> records = idempotentMapper.selectRecentSuccessRecords(1);
        
        for (ApiIdempotentRecord record : records) {
            // 2. 解析请求参数
            DeductRequest request = JSON.parseObject(record.getRequestParams(), DeductRequest.class);
            
            // 3. 查询实际库存变动日志
            StockChangeLog changeLog = stockLogMapper.selectByBizNo(record.getBizNo());
            
            if (changeLog == null) {
                // 4. 发现不一致：幂等记录显示成功，但没有库存变动日志
                log.error("对账异常 | bizNo={} | 尝试补偿", record.getBizNo());
                
                // 5. 触发补偿逻辑（重新扣库存或人工介入）
                compensationService.compensate(record);
            }
        }
        
        log.info("API 对账任务完成");
    }
}
```

---

### ❓ 面试官：如何设计 API 文档，让第三方开发者能快速上手？你们用过 Swagger/OpenAPI 吗？
*频率：🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
使用 **Swagger/OpenAPI 3.0** 自动生成在线文档，配合 **Postman Collection** 提供一键导入的测试用例，再加上 **SDK 示例代码**（Java/Python/Node.js）。

**📝 实施步骤：**

#### 1. Swagger 注解标注
```java
@RestController
@RequestMapping("/api/v1")
@Tag(name = "订单查询接口", description = "提供给第三方系统查询订单信息")
public class OrderApiControllerV1 {
    
    @Operation(summary = "查询订单详情", description = "根据订单号查询订单详细信息")
    @Parameters({
        @Parameter(name = "order_no", description = "订单号", required = true, example = "ORD20240101001"),
        @Parameter(name = "app_key", description = "应用公钥", required = true),
        @Parameter(name = "timestamp", description = "时间戳", required = true),
        @Parameter(name = "nonce", description = "随机字符串", required = true),
        @Parameter(name = "sign", description = "签名", required = true)
    })
    @ApiResponse(responseCode = "200", description = "查询成功")
    @ApiResponse(responseCode = "401", description = "签名验证失败")
    @ApiResponse(responseCode = "429", description = "请求过于频繁")
    @GetMapping("/orders/query")
    public ApiResponse<OrderVO> queryOrder(@RequestParam String orderNo) {
        // ...
    }
}
```

#### 2. 提供 Postman Collection
导出完整的 Postman 集合文件，包含：
- 所有接口的预配置请求
- 环境变量模板（AppKey、AppSecret）
- 自动签名脚本（Pre-request Script）

```javascript
// Postman Pre-request Script 自动生成签名
const appKey = pm.environment.get("app_key");
const appSecret = pm.environment.get("app_secret");
const timestamp = Date.now();
const nonce = Math.random().toString(36).substring(2, 15);

// 获取所有查询参数
const params = {};
pm.request.url.query.each(param => {
    if (!['app_key', 'timestamp', 'nonce', 'sign'].includes(param.key)) {
        params[param.key] = param.value;
    }
});

// 生成签名
const sortedKeys = Object.keys(params).sort();
let signStr = appSecret + timestamp + nonce;
sortedKeys.forEach(key => {
    signStr += key + params[key];
});
const signature = CryptoJS.MD5(signStr).toString();

// 设置环境变量
pm.environment.set("timestamp", timestamp);
pm.environment.set("nonce", nonce);
pm.environment.set("sign", signature);
```

#### 3. SDK 示例代码
提供主流语言的 SDK 封装，降低接入成本：

``python
# Python SDK 示例
from yourcompany_sdk import OpenApiClient

client = OpenApiClient(
    app_key="ak_xxx",
    app_secret="secret_xxx",
    base_url="https://api.yourcompany.com"
)

# 查询订单
order = client.orders.query(order_no="ORD20240101001")
print(order.amount)

# 扣库存
result = client.inventory.deduct(sku_id=1001, quantity=5)
print(result.remaining_stock)
```

---

### ❓ 面试官：如果你们的 API 需要支持 Webhook 回调（比如订单支付成功后通知第三方系统），如何保证回调的可靠性？
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
采用 **"异步队列 + 重试机制 + 签名验证 + 手动补发"** 的组合方案。不能同步调用第三方接口，否则会阻塞主流程。

**📝 实现方案：**

```java
@Component
public class WebhookService {
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    /**
     * 触发 Webhook 回调
     */
    public void triggerWebhook(String eventType, String bizData, String callbackUrl) {
        // 1. 构造回调消息
        WebhookMessage message = new WebhookMessage();
        message.setEventType(eventType);
        message.setBizData(bizData);
        message.setCallbackUrl(callbackUrl);
        message.setRetryCount(0);
        message.setMaxRetry(5);
        message.setCreateTime(System.currentTimeMillis());
        
        // 2. 发送到延迟队列（立即执行第一次）
        rabbitTemplate.convertAndSend("webhook.exchange", "webhook.routing", message);
        
        // 3. 记录回调日志
        webhookLogMapper.insert(new WebhookLog(message));
    }
}

// 消费者处理
@Component
@RabbitListener(queues = "webhook.queue")
public class WebhookConsumer {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @RabbitHandler
    public void handle(WebhookMessage message) {
        try {
            // 1. 构造签名
            String signature = generateSignature(message);
            
            // 2. 发起 HTTP POST 请求
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Webhook-Signature", signature);
            
            HttpEntity<String> entity = new HttpEntity<>(
                JSON.toJSONString(message), headers
            );
            
            ResponseEntity<String> response = restTemplate.postForEntity(
                message.getCallbackUrl(), entity, String.class
            );
            
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Webhook 回调成功 | url={}", message.getCallbackUrl());
                updateWebhookLogStatus(message, "SUCCESS");
            } else {
                throw new RuntimeException("HTTP " + response.getStatusCode());
            }
            
        } catch (Exception e) {
            log.error("Webhook 回调失败 | url={}", message.getCallbackUrl(), e);
            
            // 3. 重试逻辑
            if (message.getRetryCount() < message.getMaxRetry()) {
                message.setRetryCount(message.getRetryCount() + 1);
                
                // 指数退避重试：1s, 2s, 4s, 8s, 16s
                long delay = (long) Math.pow(2, message.getRetryCount()) * 1000;
                
                rabbitTemplate.convertAndSend(
                    "webhook.delay.exchange", 
                    "webhook.delay.routing", 
                    message,
                    msg -> {
                        msg.getMessageProperties().setDelay((int) delay);
                        return msg;
                    }
                );
                
                updateWebhookLogStatus(message, "RETRYING");
            } else {
                // 4. 达到最大重试次数，标记为失败，等待人工补发
                updateWebhookLogStatus(message, "FAILED");
                alertService.sendAlert("Webhook 回调最终失败", message);
            }
        }
    }
}
```

**管理后台提供"手动补发"功能**：
- 查看所有失败的 Webhook 记录
- 一键重新触发回调
- 查看每次回调的请求/响应详情（便于排查问题）

---

## 三、调用第三方接口的关键考虑因素

### ❓ 面试官：你们的系统需要调用外部第三方接口（如短信服务、支付网关、物流查询等），需要考虑哪些方面来保证稳定性和安全性？【中高级】
*频率：🔥🔥🔥🔥*

**💡 一句话总结（先抛结论）：**
调用第三方接口需要从 **超时控制、重试机制、熔断降级、幂等性保证、安全认证、监控告警、异步解耦** 7 个方面进行设计，确保外部依赖故障不影响核心业务。

**📝 7 大关键考虑因素：**

---

#### 1. 超时控制（Timeout）

**问题**：第三方接口响应慢或无响应，导致你的系统线程池耗尽、请求堆积。

**解决方案**：设置合理的连接超时和读取超时

```java
@Configuration
public class HttpClientConfig {
    
    @Bean
    public RestTemplate restTemplate() {
        // 配置 HTTP 客户端
        HttpComponentsClientHttpRequestFactory factory = 
            new HttpComponentsClientHttpRequestFactory();
        
        // 连接超时：3 秒（建立 TCP 连接的时间）
        factory.setConnectTimeout(3000);
        
        // 读取超时：5 秒（等待响应数据的时间）
        factory.setReadTimeout(5000);
        
        // 连接池配置
        PoolingHttpClientConnectionManager connectionManager = 
            new PoolingHttpClientConnectionManager();
        connectionManager.setMaxTotal(200);           // 最大连接数
        connectionManager.setDefaultMaxPerRoute(50);  // 每个路由最大连接数
        
        CloseableHttpClient httpClient = HttpClients.custom()
            .setConnectionManager(connectionManager)
            .build();
        
        factory.setHttpClient(httpClient);
        
        return new RestTemplate(factory);
    }
}

// 使用示例
@Service
public class SmsService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public void sendSms(String phone, String code) {
        try {
            // 调用第三方短信接口
            SmsRequest request = new SmsRequest(phone, code);
            SmsResponse response = restTemplate.postForObject(
                "https://api.sms-provider.com/send",
                request,
                SmsResponse.class
            );
            
            if (!response.isSuccess()) {
                throw new BusinessException("短信发送失败：" + response.getMessage());
            }
            
        } catch (ResourceAccessException e) {
            // 超时异常
            log.error("短信接口调用超时 | phone={}", phone, e);
            throw new BusinessException("短信服务暂时不可用，请稍后重试");
        }
    }
}
```

**超时时间设置建议**：
- **连接超时**：3-5 秒（网络正常时很快建立连接）
- **读取超时**：根据第三方 SLA 设定，一般 5-10 秒
- **重要接口**：设置更短的超时，快速失败
- **非核心接口**：可以适当延长，但不要超过 30 秒

---

#### 2. 重试机制（Retry）

**问题**：网络抖动、第三方服务瞬时故障导致偶尔失败。

**解决方案**：指数退避重试 + 最大重试次数限制

```java
@Service
public class RetryableThirdPartyService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    private static final int MAX_RETRY = 3;  // 最大重试次数
    
    /**
     * 带重试的第三方接口调用
     */
    public <T> T callWithRetry(Supplier<T> apiCall, String apiName) {
        Exception lastException = null;
        
        for (int attempt = 1; attempt <= MAX_RETRY; attempt++) {
            try {
                T result = apiCall.get();
                
                if (attempt > 1) {
                    log.info("{} 第 {} 次重试成功", apiName, attempt);
                }
                
                return result;
                
            } catch (Exception e) {
                lastException = e;
                log.warn("{} 第 {} 次调用失败: {}", apiName, attempt, e.getMessage());
                
                if (attempt < MAX_RETRY) {
                    // 指数退避：1s, 2s, 4s
                    long delay = (long) Math.pow(2, attempt - 1) * 1000;
                    try {
                        Thread.sleep(delay);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new BusinessException("重试被中断");
                    }
                }
            }
        }
        
        throw new BusinessException(
            String.format("%s 调用失败，已重试 %d 次", apiName, MAX_RETRY),
            lastException
        );
    }
    
    // 使用示例
    public LogisticsInfo queryLogistics(String trackingNo) {
        return callWithRetry(() -> {
            return restTemplate.getForObject(
                "https://api.logistics.com/query?no=" + trackingNo,
                LogisticsInfo.class
            );
        }, "物流查询接口");
    }
}
```

**Spring Retry 简化实现**：

```java
// 1. 引入依赖
// <dependency>
//     <groupId>org.springframework.retry</groupId>
//     <artifactId>spring-retry</artifactId>
// </dependency>

// 2. 启用重试
@EnableRetry
@SpringBootApplication
public class Application { ... }

// 3. 使用注解
@Service
public class PaymentService {
    
    @Retryable(
        value = {ResourceAccessException.class},  // 哪些异常触发重试
        maxAttempts = 3,                           // 最大重试次数
        backoff = @Backoff(delay = 1000, multiplier = 2)  // 退避策略
    )
    public PaymentResult chargePayment(Order order) {
        return restTemplate.postForObject(
            "https://api.payment.com/charge",
            order,
            PaymentResult.class
        );
    }
    
    @Recover
    public PaymentResult recover(ResourceAccessException e, Order order) {
        log.error("支付接口调用最终失败 | orderId={}", order.getId(), e);
        throw new BusinessException("支付服务暂时不可用，请稍后重试");
    }
}
```

**重试原则**：
- ✅ **仅对幂等接口重试**：GET 查询、POST 创建（有唯一键防重）
- ❌ **不对非幂等接口重试**：POST 扣款、PUT 更新（可能重复执行）
- ✅ **指数退避**：避免短时间内频繁重试加重对方负担
- ✅ **限制最大重试次数**：防止无限重试

---

#### 3. 熔断降级（Circuit Breaker）

**问题**：第三方服务持续故障，如果不熔断会导致你的系统资源耗尽、雪崩。

**解决方案**：使用 Resilience4j 实现熔断器

```java
// 1. 引入依赖
// <dependency>
//     <groupId>io.github.resilience4j</groupId>
//     <artifactId>resilience4j-spring-boot2</artifactId>
// </dependency>

// 2. 配置熔断器
resilience4j.circuitbreaker:
  instances:
    paymentService:
      slidingWindowSize: 10          # 滑动窗口大小
      failureRateThreshold: 50       # 失败率阈值（50%）
      waitDurationInOpenState: 30s   # 熔断后等待时间
      permittedNumberOfCallsInHalfOpenState: 5  # 半开状态允许通过的请求数

// 3. 使用熔断器
@Service
public class PaymentService {
    
    @CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
    public PaymentResult chargePayment(Order order) {
        return restTemplate.postForObject(
            "https://api.payment.com/charge",
            order,
            PaymentResult.class
        );
    }
    
    // 降级方法
    public PaymentResult paymentFallback(Order order, Exception e) {
        log.error("支付服务熔断降级 | orderId={}", order.getId(), e);
        
        // 返回默认值或提示用户稍后重试
        PaymentResult result = new PaymentResult();
        result.setSuccess(false);
        result.setMessage("支付服务暂时不可用，请稍后重试");
        return result;
    }
}
```

**熔断器状态机**：

```
初始状态：CLOSED（关闭）
  ↓ 失败率达到阈值
打开状态：OPEN（熔断）
  ↓ 等待一段时间后
半开状态：HALF_OPEN（试探）
  ↓ 如果成功 → CLOSED
  ↓ 如果失败 → OPEN
```

**降级策略**：
1. **返回缓存数据**：如汇率、配置信息
2. **返回默认值**：如推荐列表为空
3. **排队等待**：如订单进入队列，稍后处理
4. **友好提示**：告知用户服务暂时不可用

---

#### 4. 幂等性保证（Idempotency）

**问题**：网络超时导致你不确定请求是否成功，重试可能造成重复扣款、重复创建订单。

**解决方案**：使用幂等令牌（Idempotency Key）

```java
/**
 * 支付服务 - 幂等性保证
 */
@Service
public class IdempotentPaymentService {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    /**
     * 带幂等性的支付接口
     */
    public PaymentResult chargePayment(PaymentRequest request) {
        // 1. 生成或使用客户端提供的幂等令牌
        String idempotencyKey = request.getIdempotencyKey();
        if (idempotencyKey == null) {
            idempotencyKey = generateIdempotencyKey(request);
        }
        
        String redisKey = "payment:idempotent:" + idempotencyKey;
        
        // 2. 尝试获取分布式锁（防止并发重复提交）
        Boolean locked = redisTemplate.opsForValue().setIfAbsent(
            redisKey, 
            "PROCESSING", 
            5, TimeUnit.MINUTES
        );
        
        if (Boolean.FALSE.equals(locked)) {
            // 3. 检查是否已有结果
            String existingResult = redisTemplate.opsForValue().get(redisKey);
            if (existingResult != null && !existingResult.equals("PROCESSING")) {
                // 返回之前的结果
                return JSON.parseObject(existingResult, PaymentResult.class);
            } else {
                throw new BusinessException("请求正在处理中，请勿重复提交");
            }
        }
        
        try {
            // 4. 调用第三方支付接口
            PaymentResult result = doChargePayment(request);
            
            // 5. 保存结果（24 小时过期）
            redisTemplate.opsForValue().set(
                redisKey, 
                JSON.toJSONString(result), 
                24, TimeUnit.HOURS
            );
            
            return result;
            
        } catch (Exception e) {
            // 6. 异常时删除锁，允许重试
            redisTemplate.delete(redisKey);
            throw e;
        }
    }
    
    private PaymentResult doChargePayment(PaymentRequest request) {
        // 实际调用第三方支付接口
        return restTemplate.postForObject(
            "https://api.payment.com/charge",
            request,
            PaymentResult.class
        );
    }
}
```

**前端生成幂等令牌**：

```javascript
// 生成唯一的幂等令牌
function generateIdempotencyKey() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// 发起支付请求
async function chargePayment(orderId, amount) {
  const idempotencyKey = generateIdempotencyKey();
  
  try {
    const result = await api.post('/api/payment/charge', {
      orderId,
      amount,
      idempotencyKey  // 携带幂等令牌
    });
    
    return result.data;
  } catch (error) {
    // 如果是超时，可以安全重试（使用相同的 idempotencyKey）
    if (error.code === 'ECONNABORTED') {
      console.log('支付请求超时，使用相同幂等令牌重试');
      return chargePayment(orderId, amount);  // 重试
    }
    throw error;
  }
}
```

**幂等性适用场景**：
- ✅ 支付扣款
- ✅ 订单创建
- ✅ 库存扣减
- ✅ 积分增减

---

#### 5. 安全认证（Security）

**问题**：调用第三方接口时需要身份认证，密钥泄露会导致安全风险。

**解决方案**：密钥加密存储 + HTTPS + 签名验证

```java
@Service
public class SecureThirdPartyService {
    
    @Value("${third-party.api-key}")
    private String apiKey;  // 从配置文件读取，不要硬编码
    
    @Value("${third-party.api-secret}")
    private String apiSecret;
    
    /**
     * 调用需要签名的第三方接口
     */
    public ThirdPartyResponse callSecureApi(ThirdPartyRequest request) {
        // 1. 生成签名
        String timestamp = String.valueOf(System.currentTimeMillis());
        String nonce = UUID.randomUUID().toString();
        String signature = generateSignature(request, timestamp, nonce);
        
        // 2. 构造请求头
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-API-Key", apiKey);
        headers.set("X-Timestamp", timestamp);
        headers.set("X-Nonce", nonce);
        headers.set("X-Signature", signature);
        
        // 3. 发起 HTTPS 请求
        HttpEntity<ThirdPartyRequest> entity = new HttpEntity<>(request, headers);
        
        return restTemplate.postForObject(
            "https://api.third-party.com/secure-endpoint",
            entity,
            ThirdPartyResponse.class
        );
    }
    
    /**
     * 生成签名（HMAC-SHA256）
     */
    private String generateSignature(ThirdPartyRequest request, String timestamp, String nonce) {
        String data = JSON.toJSONString(request) + timestamp + nonce;
        
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(apiSecret.getBytes(), "HmacSHA256"));
            byte[] hash = mac.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("签名生成失败", e);
        }
    }
}
```

**密钥管理最佳实践**：
1. **不要硬编码**：密钥放在配置文件或环境变量中
2. **加密存储**：生产环境使用 Vault、AWS Secrets Manager 等密钥管理服务
3. **定期轮换**：每 3-6 个月更换一次密钥
4. **最小权限**：只申请必要的 API 权限
5. **HTTPS 传输**：所有第三方接口调用必须使用 HTTPS

---

#### 6. 监控告警（Monitoring & Alerting）

**问题**：第三方接口故障时无法及时发现，影响业务。

**解决方案**：记录调用日志 + 关键指标监控 + 告警

```java
@Aspect
@Component
@Slf4j
public class ThirdPartyApiMonitor {
    
    @Autowired
    private MetricsService metricsService;
    
    /**
     * 拦截所有第三方接口调用
     */
    @Around("@annotation(MonitorThirdPartyApi)")
    public Object monitorThirdPartyApi(ProceedingJoinPoint joinPoint) throws Throwable {
        String apiName = getApiName(joinPoint);
        long startTime = System.currentTimeMillis();
        
        try {
            // 执行方法
            Object result = joinPoint.proceed();
            
            // 记录成功指标
            long duration = System.currentTimeMillis() - startTime;
            metricsService.recordSuccess(apiName, duration);
            
            log.info("第三方接口调用成功 | api={} | duration={}ms", apiName, duration);
            
            return result;
            
        } catch (Exception e) {
            // 记录失败指标
            long duration = System.currentTimeMillis() - startTime;
            metricsService.recordFailure(apiName, duration, e.getMessage());
            
            log.error("第三方接口调用失败 | api={} | duration={}ms", apiName, duration, e);
            
            throw e;
        }
    }
    
    private String getApiName(ProceedingJoinPoint joinPoint) {
        MonitorThirdPartyApi annotation = ((MethodSignature) joinPoint.getSignature())
            .getMethod().getAnnotation(MonitorThirdPartyApi.class);
        return annotation.value();
    }
}

// 自定义注解
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface MonitorThirdPartyApi {
    String value();  // API 名称
}

// 使用示例
@Service
public class PaymentService {
    
    @MonitorThirdPartyApi("payment.charge")
    public PaymentResult chargePayment(Order order) {
        // ...
    }
    
    @MonitorThirdPartyApi("logistics.query")
    public LogisticsInfo queryLogistics(String trackingNo) {
        // ...
    }
}
```

**监控指标**：
- **调用量**：QPS、每日调用次数
- **成功率**：成功/失败比例
- **响应时间**：P50、P95、P99
- **错误类型**：超时、网络错误、业务错误

**告警规则**：
- 成功率 < 95% → 钉钉/企业微信告警
- P95 响应时间 > 3 秒 → 检查第三方服务状态
- 连续 5 次失败 → 立即通知开发人员
- 熔断器打开 → 通知运维人员

---

#### 7. 异步解耦（Async Decoupling）

**问题**：同步调用第三方接口阻塞主流程，影响用户体验。

**解决方案**：消息队列异步处理 + 最终一致性

```java
/**
 * 订单服务 - 异步调用第三方接口
 */
@Service
public class AsyncOrderService {
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    /**
     * 创建订单（同步返回）
     */
    @Transactional
    public Order createOrder(OrderCreateRequest request) {
        // 1. 创建订单（本地事务）
        Order order = orderMapper.insert(request);
        
        // 2. 发送消息到队列（异步处理第三方接口调用）
        OrderCreatedEvent event = new OrderCreatedEvent();
        event.setOrderId(order.getId());
        event.setCustomerId(request.getCustomerId());
        event.setAmount(request.getAmount());
        
        rabbitTemplate.convertAndSend(
            "order.created.exchange",
            "order.created.routing",
            event
        );
        
        // 3. 立即返回订单号
        return order;
    }
}

/**
 * 订单事件消费者 - 异步调用第三方接口
 */
@Component
@Slf4j
public class OrderEventHandler {
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private SmsService smsService;
    
    @RabbitListener(queues = "order.created.queue")
    public void handleOrderCreated(OrderCreatedEvent event) {
        try {
            // 1. 调用支付接口（异步）
            PaymentResult paymentResult = paymentService.chargePayment(event.getOrderId());
            
            if (paymentResult.isSuccess()) {
                // 2. 支付成功，发送短信通知
                smsService.sendSms(event.getCustomerId(), "支付成功");
                
                // 3. 更新订单状态
                orderService.updateStatus(event.getOrderId(), OrderStatus.PAID);
            } else {
                // 支付失败，标记订单
                orderService.updateStatus(event.getOrderId(), OrderStatus.PAYMENT_FAILED);
            }
            
        } catch (Exception e) {
            log.error("处理订单创建事件失败 | orderId={}", event.getOrderId(), e);
            
            // 消息重试（由 RabbitMQ 自动处理）
            throw e;
        }
    }
}
```

**异步解耦的优势**：
- ✅ **提升响应速度**：主流程不等待第三方接口
- ✅ **提高可用性**：第三方故障不影响核心业务
- ✅ **削峰填谷**：消息队列缓冲流量高峰
- ✅ **易于扩展**：新增第三方接口只需增加消费者

**注意事项**：
- ⚠️ **最终一致性**：异步处理可能导致短暂不一致
- ⚠️ **消息可靠性**：确保消息不丢失（持久化、ACK 机制）
- ⚠️ **幂等性**：消费者必须支持幂等处理

---

### 📊 综合设计方案

**完整的第三方接口调用架构**：

```
┌─────────────┐
│  业务代码    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  熔断器          │ ← Resilience4j CircuitBreaker
│  (快速失败)      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  重试机制        │ ← Spring Retry / 自定义重试
│  (指数退避)      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  超时控制        │ ← RestTemplate Timeout
│  (3s + 5s)       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  幂等性保证      │ ← Redis 分布式锁
│  (防重复提交)    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  安全认证        │ ← HTTPS + 签名
│  (密钥管理)      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  第三方接口      │
└─────────────────┘
       │
       ▼
┌─────────────────┐
│  监控告警        │ ← Prometheus + Grafana
│  (实时监测)      │
└─────────────────┘
```

**选型建议**：

| 场景 | 推荐方案 |
|------|---------|
| **核心业务接口**（支付、下单） | 熔断 + 重试 + 幂等 + 监控 |
| **非核心接口**（短信、邮件） | 异步解耦 + 重试 |
| **查询类接口**（物流、汇率） | 缓存 + 超时控制 |
| **高频调用接口** | 连接池 + 限流 |

**最佳实践总结**：
1. ✅ **永远设置超时**：避免线程池耗尽
2. ✅ **合理重试**：指数退避 + 最大次数限制
3. ✅ **熔断保护**：防止雪崩效应
4. ✅ **幂等设计**：保证重复调用安全
5. ✅ **安全认证**：HTTPS + 签名 + 密钥管理
6. ✅ **监控告警**：及时发现问题
7. ✅ **异步解耦**：提升系统可用性

---

