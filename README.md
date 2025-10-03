# Vue Login Project

这是一个基于Vue 3的登录项目。

## 环境配置

项目支持通过环境变量配置API和WebSocket连接地址：

- `VITE_API_BASE_URL`: API基础URL
- `VITE_WS_BASE_URL`: WebSocket基础URL（可选，如果不配置会基于API_BASE_URL自动生成）

可以创建以下环境配置文件：
- `.env`: 默认环境配置
- `.env.development`: 开发环境配置
- `.env.production`: 生产环境配置

参考 `.env.example` 文件创建相应的环境配置文件。