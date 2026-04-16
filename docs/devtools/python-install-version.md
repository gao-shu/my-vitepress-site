# Python 安装与版本控制（Windows）

> 目标：能并存多个 Python 版本，并在开发时切换到指定版本（配合虚拟环境）。

---

## 1. 安装 Python（Windows 官方安装包）

下载：<https://www.python.org/downloads/windows/>

安装时建议勾选：

- `Add Python to PATH`

---

## 2. 使用 Python Launcher（推荐）

验证：

```bash
py -V
```

查看可用版本：

```bash
py -0p
```

运行指定版本：

```bash
py -3.11 -V
```

---

## 3. 创建虚拟环境（版本控制 + 依赖隔离的关键）

在项目目录：

```bash
py -3.11 -m venv .venv
```

激活虚拟环境：

```powershell
.venv\Scripts\activate
```

安装/升级 pip：

```bash
python -m pip install -U pip
```

---

## 4. 快速启动（示例）

```bash
cd your-project
py -3.11 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

---

## 5. 你也可以选择 pyenv-win（可选）

如果你希望更“像 nvm 那样”管理版本，可以再看 `pyenv-win`（属于进阶选项）。

