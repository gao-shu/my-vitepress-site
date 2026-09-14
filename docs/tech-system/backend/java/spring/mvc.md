# Web（MVC）与接口层

- 就是 HTTP 接入层：路由、参数、返回、异常  
- 和前端约定好 REST / 错误码，比纠结「是不是纯 REST」重要  
- 统一异常处理、校验（Validation）是交付质量的分水岭  

## 判断

接口层要薄、错误要统一；业务规则沉到服务层，别堆在 Controller。

下一篇：[事务](./transaction.md)  
