# Node.js 安装与版本控制（Windows）

> 目标：让你能在同一台机器上安装多个 Node 版本，并在开发时切换到指定版本。

---

## 1. 推荐工具：nvm-windows（Windows 最常用）

下载：<https://github.com/coreybutler/nvm-windows/releases>

安装完成后，建议打开新终端验证：

```bash
nvm -v
```

---

## 2. 安装常用版本

示例安装（按需改版本号）：

```bash
nvm install 23.11.1
nvm install 18.20.8
```

查看已安装版本：

```bash
nvm list
```

---

## 3. 切换版本（当前终端生效）

```bash
nvm use 23.11.1
node -v
npm -v
```

---

## 4. 与 `.nvmrc` 协作（约定版本）

你可以在项目根目录放一个 `.nvmrc`，内容是目标版本号（例如 `23.11.1`）。

但在 `nvm-windows` 下通常不会“自动读取并切换”，所以仍建议启动项目前手动执行：

```bash
nvm use 23.11.1
```

---

## 5. 快速启动开发（示例）

进入项目目录后：

```bash
cd /d E:\vitepress
nvm use 23.11.1
npm run dev
```

