<template>
  <div class="chat-room">
    <!-- 房间号输入模态框 -->
    <div v-if="showRoomModal" class="modal-overlay">
      <div class="room-modal">
        <div class="modal-header">
          <h2 class="modal-title">加入聊天室</h2>
          <p class="modal-description">请输入房间号进入聊天室</p>
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
          
          <div class="room-actions">
            <button 
              @click="joinRoom"
              :disabled="!roomId.trim()"
              class="join-button"
            >
              进入房间
            </button>
            <button 
              @click="goToFeatures"
              class="cancel-button"
            >
              取消
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
          <div class="online-users">
            <span class="online-indicator"></span>
            <span class="online-count">{{ onlineUsers.length }} 人在线</span>
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
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 房间号相关状态
const showRoomModal = ref(true)
const roomId = ref('')
const roomError = ref('')
const currentRoomId = ref('')

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
  name: '你',
  color: getRandomColor()
})

// 在线用户列表
const onlineUsers = ref<User[]>([
  { id: 'user-1', name: 'Alice', color: '#FF6B6B' },
  { id: 'user-2', name: 'Bob', color: '#4ECDC4' },
  { id: 'user-3', name: 'Charlie', color: '#45B7D1' },
  { id: 'user-4', name: 'Diana', color: '#96CEB4' },
  { id: 'user-5', name: 'Eve', color: '#FFEAA7' },
  currentUser // 添加当前用户
])

// 消息列表
const messages = ref<Message[]>([
  {
    id: 'msg-1',
    userId: 'user-1',
    userName: 'Alice',
    userColor: '#FF6B6B',
    content: '大家好！欢迎来到聊天室！',
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: 'msg-2',
    userId: 'user-2',
    userName: 'Bob',
    userColor: '#4ECDC4',
    content: '这个聊天室界面设计得真不错！',
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: 'msg-3',
    userId: 'user-3',
    userName: 'Charlie',
    userColor: '#45B7D1',
    content: '是的，简洁又美观，使用起来很舒服',
    timestamp: new Date(Date.now() - 180000)
  }
])

// 新消息输入
const newMessage = ref('')

// 消息容器引用
const messagesContainer = ref<HTMLElement | null>(null)

// 加入房间
const joinRoom = () => {
  if (!roomId.value.trim()) {
    roomError.value = '请输入房间号'
    return
  }
  
  // 简单验证房间号格式（这里可以添加更复杂的验证逻辑）
  if (roomId.value.length < 3) {
    roomError.value = '房间号至少需要3个字符'
    return
  }
  
  // 设置当前房间号
  currentRoomId.value = roomId.value
  showRoomModal.value = false
  
  // 重置错误信息
  roomError.value = ''
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
}

.room-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: modalSlideIn 0.4s ease-out;
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
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.join-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.6);
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
  overflow: hidden;
  max-width: 1200px;
  margin: 0 auto;
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
  
  .header-left {
    width: 100%;
    justify-content: space-between;
  }
  
  .message {
    max-width: 90%;
  }
  
  .room-modal {
    margin: 1rem;
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
}
</style>