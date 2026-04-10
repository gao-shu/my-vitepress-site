# API 测试工具

> 所属专题：[开发工具与环境配置](/devtools/)

### 7.1 Postman（最流行）

**下载地址：**
```
https://www.postman.com/downloads/
```

**核心功能：**
- 发送 HTTP 请求（GET/POST/PUT/DELETE）
- 环境变量管理
- Collection 集合管理
- 自动化测试脚本
- Mock Server

**使用示例：**
```javascript
// Pre-request Script
pm.environment.set("token", "Bearer " + pm.variables.get("api_key"));

// Tests
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has user data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.user).to.exist;
});
```

### 7.2 Apifox（国产优秀，强烈推荐）⭐

**下载地址：**
```
https://apifox.com/
```

**特点：**
- ✅ Postman + Swagger + Mock + JMeter 四合一
- ✅ 中文界面，更符合国人习惯
- ✅ 支持 API 文档自动生成
- ✅ 团队协作功能强大
- ✅ 个人版免费

---
