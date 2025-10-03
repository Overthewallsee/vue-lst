// 根据不同的环境设置不同的基础URL
const getBaseURL = () => {
  // 优先使用环境变量配置的API基础URL
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  
  if (import.meta.env.MODE === 'development') {
    return '' // 开发环境使用相对路径，通过Vite代理
  } else if (import.meta.env.MODE === 'production') {
    return 'http://127.0.0.1:8888' // 生产环境
  }
  return ''
}

// 获取WebSocket基础URL
const getWebSocketBaseURL = () => {
  // 优先使用环境变量配置的WebSocket URL
  if (import.meta.env.VITE_WS_BASE_URL) {
    return import.meta.env.VITE_WS_BASE_URL
  }
  
  // 如果没有配置专门的WebSocket URL，则基于API基础URL生成
  const apiBaseUrl = getBaseURL()
  if (apiBaseUrl) {
    // 将http替换为ws，https替换为wss
    if (apiBaseUrl.startsWith('https://')) {
      return apiBaseUrl.replace('https://', 'wss://')
    } else if (apiBaseUrl.startsWith('http://')) {
      return apiBaseUrl.replace('http://', 'ws://')
    }
    // 如果是相对路径或其他格式，使用默认的ws协议
    return `ws://${window.location.host}${apiBaseUrl}`
  }
  
  // 默认值
  if (import.meta.env.MODE === 'development') {
    return 'ws://127.0.0.1:8888'
  } else if (import.meta.env.MODE === 'production') {
    return 'wss://127.0.0.1:8888'
  }
  
  return 'ws://127.0.0.1:8888'
}

export const API_BASE_URL = getBaseURL()
export const WS_BASE_URL = getWebSocketBaseURL()