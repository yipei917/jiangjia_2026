## 木材智能切割优化 Demo

一个基于 **FastAPI** 的后端和 **Vite + React** 前端的木材智能切割优化小 demo，用于根据产品规则和木材缺陷数据计算价值最大化的切割方案，并在前端可视化展开图和切割结果。

### 后端依赖（Python）

使用 `pip` 安装：

```bash
pip install -r requirements.txt
```

### 前端依赖（Node）

在 `frontend` 目录下使用 `npm` 安装：

```bash
cd frontend

# 第一次在新环境启动前端前，建议先清理后重新安装依赖
rm -rf node_modules package-lock.json
npm install
```