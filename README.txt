木材智能切割优化 Demo
====================

这是一个基于 FastAPI 后端 和 Vite + React 前端 的木材智能切割优化小 Demo。

功能：根据产品规则和木材缺陷数据，计算价值最大化的切割方案，并在前端展示展开图和切割结果。

----------------------------------------
一、后端依赖（Python）
----------------------------------------

1. 安装 Python 依赖（在项目根目录执行）：

   pip install -r requirements.txt


----------------------------------------
二、前端依赖（Node）
----------------------------------------

1. 进入前端目录：

   cd frontend

2. 第一次在新环境启动前端前，建议先清理后重新安装依赖：

   - Linux / macOS / Git Bash：
     rm -rf node_modules package-lock.json

   - Windows（PowerShell）：
     Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue

   - Windows（CMD 命令提示符）：
     if exist node_modules rmdir /s /q node_modules
     if exist package-lock.json del package-lock.json

   然后执行：
   npm install

3. 启动前端开发服务器：

   npm run dev

