# 对外 API 接口设计与开发实战

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
```javascript
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

```python
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
