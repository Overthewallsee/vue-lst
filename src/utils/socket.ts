import { Client } from '@stomp/stompjs'

let stompClient: Client | null = null
let reconnectTimer: number | null = null
const reconnectDelay = 3000

// 消息回调缓存
const messageCallbacks: ((data: any) => void)[] = []

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const getWebSocketUrl = () => {
  if (import.meta.env.DEV) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}/ai_lst/ws`
  }

  const configuredBaseUrl = import.meta.env.VITE_WS_BASE_URL?.trim()
  if (configuredBaseUrl) {
    const normalizedBaseUrl = configuredBaseUrl.replace(/\/$/, '')
    if (normalizedBaseUrl.endsWith('/ws') || normalizedBaseUrl.endsWith('/websocket')) {
      return normalizedBaseUrl
    }
    return `${normalizedBaseUrl}/ai_lst/ws`
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}/ai_lst/ws`
}

// 建立 STOMP 连接
export function connectSocket(roomId: number) {
  disconnectSocket()

  const wsUrl = getWebSocketUrl()
  stompClient = new Client({
    brokerURL: "http://localhost:8080/ai_lst/ws",
    connectHeaders: getAuthHeaders(),
    heartbeatIncoming: 20000,
    heartbeatOutgoing: 20000,
    reconnectDelay,
    debug: () => {},
    onConnect: () => {
      console.log('STOMP 连接成功，房间ID：', roomId)
      // 动态房间主题 /topic/room-1001
      // const topic = `/topic/room-${roomId}`
      stompClient?.subscribe("/topic/public", (frame) => {
        const data = JSON.parse(frame.body)
        messageCallbacks.forEach(cb => cb(data))
      })
      stompClient?.subscribe('/user/queue/private', (frame) => {
        const data = JSON.parse(frame.body)
        messageCallbacks.forEach(cb => cb(data))
      })
    },
    onStompError: (frame) => {
      console.error('STOMP 错误：', frame.headers['message'], frame.body)
    },
    onWebSocketError: (event) => {
      console.error('WebSocket 错误：', event)
    }
  })

  stompClient.activate()
}

// 订阅消息回调
export function onMessageReceive(cb: (data: any) => void) {
  messageCallbacks.push(cb)
}

// 取消订阅
export function offMessageReceive(cb: (data: any) => void) {
  const index = messageCallbacks.indexOf(cb)
  if (index > -1) messageCallbacks.splice(index, 1)
}

// 发送 STOMP 消息
export function sendSocketMessage(payload: any) {
  if (!stompClient || !stompClient.active) return false
  if (payload?.type === '2') {
    stompClient.publish({
      destination: '/app/broadcast',
      body: JSON.stringify(payload)
    })
  } else if (payload?.type === '1') {
    stompClient.publish({
      destination: '/app/private',
      body: JSON.stringify(payload)
    })
  }
  return true
}

// 关闭连接
export function disconnectSocket() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (stompClient) {
    stompClient.deactivate()
    stompClient = null
  }
}

