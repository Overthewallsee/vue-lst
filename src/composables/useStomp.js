import { ref } from 'vue'
import SockJS from 'sockjs-client'
import { Stomp } from 'stompjs'

export function useStomp() {
  // 连接实例
  let stompClient = null
  // 连接状态
  const connected = ref(false)
  // 消息列表
  const messageList = ref([])

  /**
   * 建立连接
   * @param wsUrl 后端ws地址 本地示例：http://127.0.0.1:8080/ws
   */
  function connect(wsUrl) {
    // 1. 创建SockJS实例（兼容低版本浏览器）
    const socket = new SockJS(wsUrl)
    // 2. 包装Stomp
    stompClient = Stomp.over(socket)
    // 关闭控制台日志（可选，调试可注释）
    stompClient.debug = () => {}

    // 3. 发起连接
    stompClient.connect(
      // headers 可携带token认证
      { token: '你的登录token' },
      // 连接成功回调
      () => {
        connected.value = true
        console.log('STOMP连接成功')

        // ========== 订阅广播频道 /topic/chat 群聊 ==========
        stompClient.subscribe('/topic/chat', (res) => {
          const msg = JSON.parse(res.body)
          messageList.value.push(msg)
        })

        // ========== 订阅个人点对点消息 /user/queue/private 私聊 ==========
        stompClient.subscribe('/user/queue/private', (res) => {
          const privateMsg = JSON.parse(res.body)
          messageList.value.push({ ...privateMsg, type: 'private' })
        })
      },
      // 连接失败/断开回调
      (err) => {
        connected.value = false
        console.error('STOMP连接失败', err)
        // 自动重连 3秒后重试
        setTimeout(() => connect(wsUrl), 3000)
      }
    )
  }

  /**
   * 发送消息到后端 /app/chat
   * @param msgObj 消息对象 {from, content}
   */
  function sendMessage(msgObj) {
    if (!stompClient || !connected.value) {
      alert('未连接服务器')
      return
    }
    stompClient.send(
      '/app/chat', // 后端@MessageMapping对应地址
      {}, // headers
      JSON.stringify(msgObj)
    )
  }

  /**
   * 断开连接
   */
  function disconnect() {
    if (stompClient) {
      stompClient.disconnect(() => {
        connected.value = false
        console.log('STOMP已断开')
      })
    }
  }

  return {
    connected,
    messageList,
    connect,
    sendMessage,
    disconnect
  }
}