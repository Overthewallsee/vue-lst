// 根据不同的环境设置不同的基础URL
const getBaseURL = () => {
  if (import.meta.env.MODE === 'development') {
    return '' // 开发环境使用相对路径，通过Vite代理
  } else if (import.meta.env.MODE === 'production') {
    return 'http://127.0.0.1:8888' // 生产环境
  }
  return ''
}

export const API_BASE_URL = getBaseURL()