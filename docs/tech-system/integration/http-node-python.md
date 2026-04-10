# HTTP 跨语言协作：Node.js ↔ Python（微服务/网关常见形态）

## 这属于「数据通信」吗？

**广义上算**：你在做**不同进程、不同语言服务之间的数据交换**，数据以 HTTP 报文（常为 JSON）为载体。

更精确一点可以这样说：

| 说法 | 说明 |
|------|------|
| **应用层通信** | 基于 TCP 之上的 HTTP/REST，与「计算机网络」课里的链路层不是同一层，但仍是标准的数据传输手段。 |
| **系统集成** | 常见于「网关 / BFF（Node）+ 算法或推理服务（Python）」拆分：Node 管连接与业务编排，Python 管 CV、OCR、模型推理等。 |
| **和工控 Modbus 的区别** | HTTP 面向 **Web/微服务**；Modbus 面向 **PLC/传感器**。协议栈、时序要求和排错方式都不同。 |

下面用你的场景做抽象：**一端提供 REST 接口，另一端用 HTTP 客户端调用**，并标出生产里最容易踩的坑。

---

## 典型拓扑（和你贴的代码一致）

```
浏览器/设备 ──▶ Node（Express，例如 :8000）──HTTP──▶ Python（FastAPI/uvicorn，例如 :8001）
                    │
                    └── 读本地图片路径、转 JPEG Base64、调 OCR、再下发前端/WebSocket 等
```

- **Python**：专注「短命、无状态」的能力接口，例如 `/status` 暴露进程信息、健康检查。
- **Node**：对外统一入口（上传、鉴权、推送、与前端 WebSocket 等），内部再 `axios` 调 Python 或其他服务。

---

## Python：提供只读状态接口（FastAPI + Uvicorn）

```python
import psutil
from fastapi import FastAPI

app = FastAPI()


@app.get("/status")
async def status():
    pid = psutil.Process().pid
    return {"pid": pid}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8001)
```

**要点**：

- 生产环境建议用 `host="0.0.0.0"` 仅当需要被**同机以外**访问；本机互调用 `127.0.0.1` 即可。
- `/status` 适合给 Node 做**探活**（配合超时与重试），不要误当成安全边界——内网仍需防火墙/鉴权。

---

## Node：作为客户端轮询 Python（axios）

```javascript
import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'http://127.0.0.1:8001',
  timeout: 3000,
});

export async function queryStatus() {
  const res = await httpClient.get('/status', { timeout: 2000 });
  return res.data.pid;
}
```

**要点**：

- **`baseURL` 不要写死**：用环境变量（如 `process.env.PY_SERVICE_URL`），否则换机/容器必挂。
- **超时必配**：算法服务卡住时，Node 不能无限占用事件循环等待。

---

## Node：接收 JSON，读磁盘图片再处理（Express）

下面是一个**语义等价、但可正确结束响应**的写法（你原代码里 `if (!sys_running) { return }` 容易 **既不 `res.send` 也不 `next`**，客户端会一直等）。

```javascript
import express from 'express';
import bodyParser from 'body-parser';
import sharp from 'sharp';
import fs from 'fs';

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));

app.get('/hello', (_req, res) => {
  res.send('hi');
});

app.post('/image', async (req, res) => {
  if (!globalThis.sys_running) {
    return res.status(503).json({ error: 'service stopped' });
  }

  try {
    const imagePath = req.body.image;
    if (!imagePath || typeof imagePath !== 'string') {
      return res.status(400).json({ error: 'missing image path' });
    }
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'file not found' });
    }

    const buffer = await sharp(imagePath).jpeg({ quality: 80 }).toBuffer();
    const imageBase64 = buffer.toString('base64');
    // Data URL 中间不能有多余空格，否则前端/部分库解析失败
    const dataUrl = `data:image/jpeg;base64,${imageBase64}`;

    // TODO: sendImage(dataUrl)、await ocrImage(imagePath)、sendOcrResult(...)
    return res.status(200).json({ ok: true, dataUrl });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.listen(8000, () => console.log('listening on 8000'));
```

**要点**：

1. **每条分支都要结束响应**：`return res.xxx(...)`。
2. **JSON 里传「服务器本地路径」**只适合可信内网；跨机器应传 **URL、对象存储 key** 或 **multipart 文件本体**。
3. **Base64 Data URL**：格式是 `data:image/jpeg;base64,<payload>`，**不能**写成 `data: image / jpeg; base64, ...` 这种带空格的样式。

---

## Python：用 requests 回调 Node（客户端）

```python
import requests

url = "http://127.0.0.1:8000/image"

def send_image(image_path: str) -> None:
    try:
        r = requests.post(url, json={"image": image_path}, timeout=2)
        r.raise_for_status()
        print("[info] success", url)
    except requests.RequestException as e:
        print("[error]", e)
```

若传递**真实照片文件**而非路径字符串，应改用 **`files=` multipart**，避免服务端根本读不到客户端磁盘路径。

---

## 和「数据通信」课的关系（一句话）

你做的是 **TCP 上的 HTTP 应用协议交换业务数据**；若团队说「数据通信模块」，通常把这类归在 **服务间通信 / API 集成**，与 **工控总线（Modbus）** 并列，而不混成一种协议。

---

## 延伸阅读（站内）

- [跨语言调用：方式选型与常见实现](/tech-system/integration/cross-language-interop) — gRPC、消息队列、FFI 等与 HTTP 的对比
- [物联网项目学习路线（设备接入与上报）](/tech-system/backend/iot-project) — 常用 HTTP/MQTT 等与设备云对接。
- [Node.js 技术栈](/tech-system/backend/nodejs-stack)
- [Python 技术栈](/tech-system/backend/python-stack)
