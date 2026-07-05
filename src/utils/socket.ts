let socket: WebSocket | null = null
let reconnectTimer: number | null = null
let heartbeatTimer: number | null = null
const heartbeatInterval = 5000
const reconnectDelay = 3000

// 消息回调缓存
const messageCallbacks: ((data: any) => void)[] = []

// 建立连接
export function connectSocket(roomId: number) {
  // 关闭旧连接
  disconnectSocket()
  // 后端ws地址，本地8080
  const wsUrl = `ws://localhost:8080/ai_lst/ws/chat?roomId=${roomId}`
  socket = new WebSocket(wsUrl)

  // 连接成功
  socket.onopen = () => {
    console.log('WebSocket 连接成功，房间ID：', roomId)
    startHeartbeat()
  }

  // 接收后端推送消息
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    // 执行所有订阅回调
    messageCallbacks.forEach(cb => cb(data))
  }

  // 连接关闭
  socket.onclose = () => {
    clearHeartbeat()
    // 自动重连
    reconnectTimer = window.setTimeout(() => {
      connectSocket(roomId)
    }, reconnectDelay)
  }

  // 连接错误
  socket.onerror = (err) => {
    console.error('WebSocket 连接异常', err)
  }
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

// 关闭连接
export function disconnectSocket() {
  if (reconnectTimer) clearTimeout(reconnectTimer)
  clearHeartbeat()
  if (socket) {
    socket.close()
    socket = null
  }
  messageCallbacks.length = 0
}

// 心跳保活
function startHeartbeat() {
  heartbeatTimer = window.setInterval(() => {
    socket?.send(JSON.stringify({ type: 'heartbeat' }))
  }, heartbeatInterval)
}

function clearHeartbeat() {
  if (heartbeatTimer) clearInterval(heartbeatTimer)
}