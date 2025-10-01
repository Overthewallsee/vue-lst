<template>
  <div class="chat-room">
    <!-- 选择操作模态框 -->
    <div v-if="showActionModal" class="modal-overlay">
      <div class="room-modal">
        <div class="modal-header">
          <h2 class="modal-title">聊天室</h2>
          <p class="modal-description">请选择您要进行的操作</p>
        </div>
        
        <div class="modal-body">
          <div class="action-buttons">
            <button @click="handleCreateClick" class="action-button create-button">
              <span class="button-icon">➕</span>
              <span class="button-text">创建聊天室</span>
            </button>
            <button @click="handleJoinClick" class="action-button join-button">
              <span class="button-icon">🚪</span>
              <span class="button-text">加入聊天室</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建聊天室表单 -->
    <div v-else-if="showCreateForm" class="modal-overlay">
      <div class="room-modal">
        <div class="modal-header">
          <h2 class="modal-title">创建聊天室</h2>
          <p class="modal-description">请输入聊天室信息</p>
        </div>
        
        <div class="modal-body">
          <div class="input-group">
            <label for="create-room-id" class="input-label">房间号</label>
            <input
              id="create-room-id"
              v-model="newRoomId"
              type="text"
              placeholder="请输入房间号"
              class="room-input"
              @keyup.enter="createRoom"
            />
            <div v-if="createRoomError" class="error-message">{{ createRoomError }}</div>
          </div>
          
          <div class="input-group">
            <label for="create-room-password" class="input-label">房间密码</label>
            <input
              id="create-room-password"
              v-model="newRoomPassword"
              type="password"
              placeholder="请输入房间密码"
              class="room-input"
              @keyup.enter="createRoom"
            />
          </div>
          
          <div class="input-group">
            <label for="confirm-password" class="input-label">确认密码</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              placeholder="请再次输入房间密码"
              class="room-input"
              @keyup.enter="createRoom"
            />
            <div v-if="createPasswordError" class="error-message">{{ createPasswordError }}</div>
          </div>
          
          <div class="room-actions">
            <button 
              @click="createRoom"
              :disabled="!newRoomId.trim() || !newRoomPassword.trim() || !confirmPassword.trim()"
              class="join-button"
            >
              创建房间
            </button>
            <button 
              @click="backToAction"
              class="cancel-button"
            >
              返回
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 加入聊天室表单 -->
    <div v-else-if="showJoinForm" class="modal-overlay">
      <div class="room-modal">
        <div class="modal-header">
          <h2 class="modal-title">加入聊天室</h2>
          <p class="modal-description">请输入房间号和密码进入聊天室</p>
        </div>
        
        <div class="modal-body">
          <div class="input-group">
            <label for="room-id" class="input-label">房间号</label>
            <input
              id="room-id"
              v-model="roomId"
              type="text"
              placeholder="请输入房间号"
              class="room-input"
              @keyup.enter="joinRoom"
            />
            <div v-if="roomError" class="error-message">{{ roomError }}</div>
          </div>
          
          <div class="input-group">
            <label for="room-password" class="input-label">房间密码</label>
            <input
              id="room-password"
              v-model="roomPassword"
              type="password"
              placeholder="请输入房间密码"
              class="room-input"
              @keyup.enter="joinRoom"
            />
            <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
          </div>
          
          <div class="room-actions">
            <button 
              @click="joinRoom"
              :disabled="!roomId.trim() || !roomPassword.trim()"
              class="join-button"
            >
              进入房间
            </button>
            <button 
              @click="backToAction"
              class="cancel-button"
            >
              返回
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 聊天室主界面 -->
    <div v-else>
      <!-- 页面头部 -->
      <header class="chat-header">
        <div class="header-content">
          <div class="header-left">
            <button @click="goToFeatures" class="back-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <h1 class="header-title">💬 聊天室 - {{ currentRoomId }}</h1>
          </div>
          <div class="header-right">
            <button @click="exitChatRoom" class="exit-button">
              退出聊天室
            </button>
            <div class="online-users">
              <span class="online-indicator"></span>
              <span class="online-count">{{ onlineUsers.length }} 人在线</span>
            </div>
          </div>
        </div>
      </header>

      <!-- 主要内容区域 -->
      <div class="chat-container">
        <!-- 用户列表 -->
        <aside class="users-panel">
          <h2 class="panel-title">在线用户</h2>
          <ul class="users-list">
            <li 
              v-for="user in onlineUsers" 
              :key="user.id"
              class="user-item"
              :class="{ 'current-user': user.id === currentUser.id }"
            >
              <div class="user-avatar" :style="{ backgroundColor: user.color }">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <span class="user-name">{{ user.name }}</span>
              <span v-if="user.id === currentUser.id" class="you-tag">你</span>
            </li>
          </ul>
        </aside>

        <!-- 聊天区域 -->
        <main class="chat-main">
          <!-- 消息显示区域 -->
          <div class="messages-container" ref="messagesContainer">
            <div 
              v-for="message in messages" 
              :key="message.id"
              class="message"
              :class="{ 'own-message': message.userId === currentUser.id }"
            >
              <div class="message-header">
                <div class="user-info">
                  <div class="user-avatar small" :style="{ backgroundColor: message.userColor }">
                    {{ message.userName.charAt(0).toUpperCase() }}
                  </div>
                  <span class="user-name">{{ message.userName }}</span>
                </div>
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              </div>
              <div class="message-content">
                {{ message.content }}
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="input-area">
            <div class="input-container">
              <input
                v-model="newMessage"
                type="text"
                placeholder="输入消息..."
                @keyup.enter="sendMessage"
                class="message-input"
                maxlength="500"
              />
              <button 
                @click="sendMessage"
                :disabled="!newMessage.trim()"
                class="send-button"
              >
                发送
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { getUserName } from '@/utils/user.js'

const router = useRouter()

// 页面状态控制
const showActionModal = ref(true) // 显示选择操作界面
const showCreateForm = ref(false) // 显示创建房间表单
const showJoinForm = ref(false) // 显示加入房间表单

// 创建房间相关状态
const newRoomId = ref('')
const newRoomPassword = ref('')
const confirmPassword = ref('')
const createRoomError = ref('')
const createPasswordError = ref('')

// 加入房间相关状态
const roomId = ref('')
const roomPassword = ref('')
const roomError = ref('')
const passwordError = ref('')
const currentRoomId = ref('')

// WebSocket连接
const websocket = ref<WebSocket | null>(null)
const heartbeatInterval = ref<number | null>(null)

// 用户类型定义
interface User {
  id: string
  name: string
  color: string
}

// 消息类型定义
interface Message {
  id: string
  userId: string
  userName: string
  userColor: string
  content: string
  timestamp: Date
}

// 当前用户
const currentUser = reactive<User>({
  id: 'user-' + Math.random().toString(36).substr(2, 9),
  name: getUserName(), // 使用真实用户名
  color: getRandomColor()
})

// 在线用户列表
const onlineUsers = ref<User[]>([
  currentUser // 添加当前用户
])

// 消息列表
const messages = ref<Message[]>([])

// 新消息输入
const newMessage = ref('')

// 消息容器引用
const messagesContainer = ref<HTMLElement | null>(null)

// 处理创建聊天室点击事件
const handleCreateClick = () => {
  showActionModal.value = false
  showCreateForm.value = true
  showJoinForm.value = false
}

// 处理加入聊天室点击事件
const handleJoinClick = () => {
  showActionModal.value = false
  showCreateForm.value = false
  showJoinForm.value = true
}

// 返回选择操作界面
const backToAction = () => {
  showCreateForm.value = false
  showJoinForm.value = false
  showActionModal.value = true
  
  // 清空表单数据
  newRoomId.value = ''
  newRoomPassword.value = ''
  confirmPassword.value = ''
  roomId.value = ''
  roomPassword.value = ''
  
  // 清空错误信息
  createRoomError.value = ''
  createPasswordError.value = ''
  roomError.value = ''
  passwordError.value = ''
}

// 创建房间
const createRoom = async () => {
  // 重置错误信息
  createRoomError.value = ''
  createPasswordError.value = ''
  
  if (!newRoomId.value.trim()) {
    createRoomError.value = '请输入房间号'
    return
  }
  
  if (!newRoomPassword.value.trim()) {
    createPasswordError.value = '请输入房间密码'
    return
  }
  
  if (newRoomPassword.value !== confirmPassword.value) {
    createPasswordError.value = '两次输入的密码不一致'
    return
  }
  
  // 简单验证房间号格式
  if (newRoomId.value.length < 3) {
    createRoomError.value = '房间号至少需要3个字符'
    return
  }
  
  // 简单验证密码格式
  if (newRoomPassword.value.length < 4) {
    createPasswordError.value = '房间密码至少需要4个字符'
    return
  }
  
  // 注释掉实际的后端请求，直接模拟成功
  /*
  try {
    // 获取用户token
    const token = localStorage.getItem('token')
    
    // 发送创建房间请求
    const response = await fetch('/lst/api/chat/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        username: currentUser.name,
        roomId: newRoomId.value,
        password: newRoomPassword.value
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      // 创建成功，进入聊天室
      currentRoomId.value = newRoomId.value
      showCreateForm.value = false
      
      // 连接到WebSocket
      connectWebSocket(newRoomId.value)
    } else {
      // 根据错误类型显示相应的错误信息
      if (data.error === 'ROOM_EXISTS') {
        createRoomError.value = '房间号已存在'
      } else {
        createRoomError.value = data.message || '创建房间失败'
      }
    }
  } catch (error) {
    console.error('创建房间请求失败:', error)
    createRoomError.value = '网络错误，请稍后重试'
  }
  */
  
  // 默认模拟成功
  currentRoomId.value = newRoomId.value
  showCreateForm.value = false
  connectWebSocket(newRoomId.value)
}

// 加入房间
const joinRoom = async () => {
  // 重置错误信息
  roomError.value = ''
  passwordError.value = ''
  
  if (!roomId.value.trim()) {
    roomError.value = '请输入房间号'
    return
  }
  
  if (!roomPassword.value.trim()) {
    passwordError.value = '请输入房间密码'
    return
  }
  
  // 简单验证房间号格式
  if (roomId.value.length < 3) {
    roomError.value = '房间号至少需要3个字符'
    return
  }
  
  // 简单验证密码格式
  if (roomPassword.value.length < 4) {
    passwordError.value = '房间密码至少需要4个字符'
    return
  }
  
  // 注释掉实际的后端请求，直接模拟成功
  /*
  try {
    // 获取用户token
    const token = localStorage.getItem('token')
    
    // 发送加入房间请求
    const response = await fetch('/lst/api/chat/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        username: currentUser.name,
        roomId: roomId.value,
        password: roomPassword.value
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      // 设置当前房间号
      currentRoomId.value = roomId.value
      showJoinForm.value = false
      
      // 连接到WebSocket
      connectWebSocket(roomId.value)
    } else {
      // 根据错误类型显示相应的错误信息
      if (data.error === 'INVALID_PASSWORD') {
        passwordError.value = '房间密码错误'
      } else if (data.error === 'ROOM_NOT_FOUND') {
        roomError.value = '房间不存在'
      } else {
        roomError.value = data.message || '加入房间失败'
      }
    }
  } catch (error) {
    console.error('加入房间请求失败:', error)
    roomError.value = '网络错误，请稍后重试'
  }
  */
  
  // 默认模拟成功
  currentRoomId.value = roomId.value
  showJoinForm.value = false
  connectWebSocket(roomId.value)
}

// 连接WebSocket
const connectWebSocket = (roomId: string) => {
  // 这里应该连接到真实的WebSocket服务器
  // 为了演示，我们使用模拟的WebSocket连接
  console.log(`连接到聊天室 ${roomId}`)
  
  // 清空消息列表
  messages.value = []
  
  // 添加欢迎消息
  setTimeout(() => {
    messages.value.push({
      id: 'welcome-' + Date.now(),
      userId: 'system',
      userName: '系统',
      userColor: '#999999',
      content: `欢迎加入聊天室 ${roomId}！`,
      timestamp: new Date()
    })
  }, 500)
  
  // 启动心跳机制（模拟）
  heartbeatInterval.value = window.setInterval(() => {
    // 模拟心跳
    console.log('心跳包发送...')
  }, 30000)
}

// 发送消息
const sendMessage = () => {
  if (!newMessage.value.trim()) return

  const message: Message = {
    id: 'msg-' + Date.now(),
    userId: currentUser.id,
    userName: currentUser.name,
    userColor: currentUser.color,
    content: newMessage.value,
    timestamp: new Date()
  }

  messages.value.push(message)
  newMessage.value = ''
  
  // 滚动到最新消息
  scrollToBottom()
}

// 格式化时间
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 获取随机颜色
function getRandomColor() {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 返回功能中心
const goToFeatures = () => {
  router.push('/features')
}

// 退出聊天室
const exitChatRoom = () => {
  if (confirm('确定要退出当前聊天室吗？')) {
    // 断开WebSocket连接
    if (websocket.value) {
      websocket.value.close()
      websocket.value = null
    }
    
    // 清除心跳定时器
    if (heartbeatInterval.value) {
      clearInterval(heartbeatInterval.value)
      heartbeatInterval.value = null
    }
    
    // 重置聊天室状态
    currentRoomId.value = ''
    showActionModal.value = true
    messages.value = []
  }
}

// 组件卸载前清理资源
onBeforeUnmount(() => {
  if (heartbeatInterval.value) {
    clearInterval(heartbeatInterval.value)
  }
})

// 组件挂载时滚动到底部
onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-room {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 房间号模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(5px);
  overflow-y: auto; /* 添加垂直滚动条 */
}

.room-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: modalSlideIn 0.4s ease-out;
  margin: auto; /* 确保在小屏幕上居中 */
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 2rem 2rem 1rem;
  text-align: center;
}

.modal-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #333;
  margin-bottom: 0.5rem;
}

.modal-description {
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
}

.modal-body {
  padding: 1rem 2rem 2rem;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
  border-radius: 16px;
  border: 2px solid #e1e5e9;
  background: #f8f9fa;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.create-button:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, #eef2ff, #e0e7ff);
}

.join-button:hover {
  border-color: #45B7D1;
  background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
}

.button-icon {
  font-size: 1.5rem;
}

/* 输入组 */
.input-group {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: left;
}

.room-input {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #e1e5e9;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.room-input:focus {
  border-color: #667eea;
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  text-align: left;
}

.room-actions {
  display: flex;
  gap: 1rem;
}

.join-button, .cancel-button {
  flex: 1;
  padding: 1rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.join-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: black; /* 将字体颜色改为黑色 */
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.join-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.6);
  color: black; /* 悬停时保持黑色字体 */
}

.join-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.cancel-button {
  background: #f1f3f5;
  color: #666;
}

.cancel-button:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

/* 页面头部 */
.chat-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  background: rgba(102, 126, 234, 0.1);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #667eea;
}

.back-button:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateX(-2px);
}

.exit-button {
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.exit-button:hover {
  background: #ff5252;
  transform: translateY(-2px);
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.online-users {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.online-indicator {
  width: 10px;
  height: 10px;
  background-color: #4CAF50;
  border-radius: 50%;
}

.online-count {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

/* 主容器 */
.chat-container {
  display: flex;
  flex: 1;
  overflow: auto;
  max-width: 1200px;
  margin: 1.5rem auto 0; /* 添加顶部边距 */
  width: 100%;
  padding: 0 1rem;
  gap: 1rem;
}

/* 用户面板 */
.users-panel {
  width: 250px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow-y: auto;
}

.panel-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.users-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s ease;
}

.user-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

.user-item.current-user {
  background: rgba(102, 126, 234, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin-right: 0.75rem;
}

.user-avatar.small {
  width: 28px;
  height: 28px;
  font-size: 0.8rem;
}

.user-name {
  flex: 1;
  font-weight: 500;
  color: #333;
}

.you-tag {
  background: #667eea;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
}

/* 聊天主区域 */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
}

/* 消息容器 */
.messages-container {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.message {
  background: rgba(248, 249, 250, 0.8);
  border-radius: 18px;
  padding: 1rem 1.2rem;
  max-width: 80%;
  align-self: flex-start;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.03);
  animation: fadeIn 0.3s ease;
}

.message.own-message {
  align-self: flex-end;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.8;
}

.message-content {
  line-height: 1.5;
  word-wrap: break-word;
}

/* 输入区域 */
.input-area {
  padding: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.9);
}

.input-container {
  display: flex;
  gap: 0.75rem;
}

.message-input {
  flex: 1;
  padding: 0.9rem 1.2rem;
  border-radius: 50px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background: rgba(255, 255, 255, 0.9);
}

.message-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.send-button {
  padding: 0.9rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-container {
    flex-direction: column;
  }
  
  .users-panel {
    width: 100%;
    max-height: 200px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-left, .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .message {
    max-width: 90%;
  }
  
  .room-modal {
    margin: 1rem;
  }
  
  .action-buttons {
    gap: 0.8rem;
  }
  
  .action-button {
    padding: 1rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .chat-header {
    padding: 1rem;
  }
  
  .users-panel, .chat-main {
    border-radius: 12px;
  }
  
  .messages-container {
    padding: 1rem;
  }
  
  .message {
    padding: 0.8rem 1rem;
  }
  
  .input-container {
    flex-direction: column;
  }
  
  .send-button {
    padding: 0.9rem;
  }
  
  .room-actions {
    flex-direction: column;
  }
  
  .exit-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>
