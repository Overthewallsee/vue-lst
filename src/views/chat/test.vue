<template>
  <div class="chat-container">
    <h2>当前用户: <span>{{ currentUser }}</span></h2>
    <div class="control-bar">
      <button @click="connect" :disabled="connected">连接</button>
      <button @click="disconnect" :disabled="!connected">断开</button>
      <span class="status" :class="{ online: connected }">
        {{ connected ? '已连接' : '未连接' }}
      </span>
    </div>

    <!-- 广播 -->
    <div class="section">
      <h3>📢 广播消息</h3>
      <input v-model.trim="broadcastInput" placeholder="输入广播内容" @keyup.enter="sendBroadcast" />
      <button @click="sendBroadcast" :disabled="!connected">发送广播</button>
      <ul>
        <li v-for="(msg, index) in broadcastMessages" :key="index">{{ msg }}</li>
      </ul>
    </div>

    <!-- 点对点 -->
    <div class="section">
      <h3>✉️ 点对点消息</h3>
      接收者: <input v-model.trim="privateReceiver" placeholder="用户名 (例如 admin)" />
      <input v-model.trim="privateInput" placeholder="输入私信内容" @keyup.enter="sendPrivate" />
      <button @click="sendPrivate" :disabled="!connected">发送私信</button>
      <ul>
        <li v-for="(msg, index) in privateMessages" :key="index">{{ msg }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { Client } from '@stomp/stompjs'

// ---------- 用户信息 ----------
const currentUser = ref('user') // 实际可从 store 或 cookie 获取

// ---------- 状态 ----------
const connected = ref(false)
const broadcastInput = ref('')
const privateReceiver = ref('')
const privateInput = ref('')
const broadcastMessages = ref([])
const privateMessages = ref([])

let stompClient = null

// ---------- 工具函数：获取 token ----------
function getToken() {
  return localStorage.getItem('jwtToken') || ''
}

// ---------- 创建 STOMP 客户端 ----------
function createClient() {
  return new Client({
    brokerURL: 'ws://localhost:8080/ws',
    reconnectDelay: 5000,
    debug: (msg) => console.log('[STOMP]', msg),

    // 动态请求头：每次连接前从 localStorage 读取 token
    beforeConnect: () => {
      const token = getToken()
      stompClient.connectHeaders = {
        Authorization: token ? `Bearer ${token}` : ''
      }
    },

    onConnect: () => {
      connected.value = true
      addBroadcastMessage('🎉 连接成功！')

      // 订阅广播频道
      stompClient.subscribe('/topic/public', (message) => {
        const msg = JSON.parse(message.body)
        addBroadcastMessage(`${msg.sender || '未知'} 说: ${msg.content}`)
      })

      // 订阅个人私信队列
      stompClient.subscribe('/user/queue/private', (message) => {
        const msg = JSON.parse(message.body)
        addPrivateMessage(`🔒 ${msg.sender} 对你说: ${msg.content}`)
      })
    },

    onDisconnect: () => {
      connected.value = false
      addBroadcastMessage('🔌 连接已断开')
    },

    onStompError: (frame) => {
      console.error('STOMP Error:', frame.headers['message'], frame.body)
    }
  })
}

// ---------- 连接/断开 ----------
function connect() {
  if (!stompClient) {
    stompClient = createClient()
  }
  stompClient.activate()
}

function disconnect() {
  stompClient?.deactivate()
}

// ---------- 发送消息 ----------
function sendBroadcast() {
  const content = broadcastInput.value
  if (!content) return
  stompClient.publish({
    destination: '/app/broadcast',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ content })
  })
  broadcastInput.value = ''
}

function sendPrivate() {
  const receiver = privateReceiver.value
  const content = privateInput.value
  if (!receiver || !content) return alert('请填写接收者和消息内容')
  stompClient.publish({
    destination: '/app/private',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ receiver, content })
  })
  privateInput.value = ''
}

// ---------- UI 辅助 ----------
function addBroadcastMessage(text) {
  broadcastMessages.value.unshift(text)
}
function addPrivateMessage(text) {
  privateMessages.value.unshift(text)
}

// ---------- 组件卸载时断开连接 ----------
onUnmounted(() => {
  stompClient?.deactivate()
})
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 20px auto;
  font-family: Arial;
}
.control-bar {
  margin: 10px 0;
}
.status {
  margin-left: 20px;
  color: gray;
}
.status.online {
  color: green;
}
.section {
  margin: 20px 0;
}
input {
  padding: 6px;
  margin-right: 5px;
}
button {
  padding: 6px 12px;
  margin-right: 5px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  background: #f0f0f0;
  margin: 3px 0;
  padding: 6px;
  border-radius: 4px;
}
</style>