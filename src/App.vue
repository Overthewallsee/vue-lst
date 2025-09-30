<script setup>
import { ref, nextTick, onMounted, computed } from 'vue'

// 聊天数据
const messages = ref([])
const currentMessage = ref('')
const username = ref('')
const isJoined = ref(false)
const onlineUsers = ref(['Alice', 'Bob', 'Charlie', 'Diana'])
const messagesContainer = ref(null)

// 用户颜色映射
const userColors = ref({})
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']

// 获取用户颜色
const getUserColor = (user) => {
  if (!userColors.value[user]) {
    const colorIndex = Object.keys(userColors.value).length % colors.length
    userColors.value[user] = colors[colorIndex]
  }
  return userColors.value[user]
}

// 模拟消息数据
const initMessages = () => {
  messages.value = [
    { id: 1, user: 'Alice', message: '大家好！欢迎来到聊天室 👋', time: '10:30', type: 'message' },
    { id: 2, user: 'Bob', message: '这个聊天室界面真不错！', time: '10:32', type: 'message' },
    { id: 3, user: 'Charlie', message: '同意，很简洁美观', time: '10:33', type: 'message' },
    { id: 4, user: 'Diana', message: '有人想一起讨论前端技术吗？', time: '10:35', type: 'message' }
  ]
}

// 加入聊天室
const joinChat = () => {
  if (username.value.trim()) {
    isJoined.value = true
    // 添加加入消息
    messages.value.push({
      id: Date.now(),
      user: username.value,
      message: `${username.value} 加入了聊天室`,
      time: getCurrentTime(),
      type: 'system'
    })
    // 添加到在线用户
    if (!onlineUsers.value.includes(username.value)) {
      onlineUsers.value.push(username.value)
    }
    scrollToBottom()
  }
}

// 发送消息
const sendMessage = () => {
  if (currentMessage.value.trim() && username.value) {
    const newMessage = {
      id: Date.now(),
      user: username.value,
      message: currentMessage.value.trim(),
      time: getCurrentTime(),
      type: 'message'
    }
    messages.value.push(newMessage)
    currentMessage.value = ''
    scrollToBottom()
  }
}

// 获取当前时间
const getCurrentTime = () => {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 处理回车发送
const handleKeyPress = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// 模拟其他用户发送消息
const simulateMessages = () => {
  const users = ['Alice', 'Bob', 'Charlie', 'Diana']
  const sampleMessages = [
    '这个功能很棒！',
    '我也觉得界面设计得很好',
    '有人在吗？',
    '今天天气不错呢',
    '大家都在忙什么？',
    '这个项目进展如何？',
    '周末愉快！',
    '学习前端真有趣'
  ]
  
  setInterval(() => {
    if (Math.random() > 0.7 && isJoined.value) {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)]
      
      if (randomUser !== username.value) {
        messages.value.push({
          id: Date.now(),
          user: randomUser,
          message: randomMessage,
          time: getCurrentTime(),
          type: 'message'
        })
        scrollToBottom()
      }
    }
  }, 8000)
}

// 计算属性：当前用户的消息
const isMyMessage = (user) => {
  return user === username.value
}

onMounted(() => {
  initMessages()
  simulateMessages()
})
</script>

<template>
  <div class="chat-app">
    <!-- 登录界面 -->
    <div v-if="!isJoined" class="login-screen">
      <div class="login-card">
        <div class="logo">
          <div class="logo-icon">💬</div>
          <h1>聊天室</h1>
          <p>加入我们的社区，开始愉快的聊天吧</p>
        </div>
        
        <form @submit.prevent="joinChat" class="login-form">
          <div class="input-group">
            <input
              v-model="username"
              type="text"
              placeholder="请输入你的昵称"
              maxlength="20"
              required
            />
          </div>
          <button type="submit" class="join-btn">
            <span>加入聊天室</span>
            <span class="arrow">→</span>
          </button>
        </form>
        
        <div class="online-preview">
          <p>当前在线用户：</p>
          <div class="user-avatars">
            <div 
              v-for="user in onlineUsers.slice(0, 4)" 
              :key="user"
              class="avatar"
              :style="{ backgroundColor: getUserColor(user) }"
            >
              {{ user.charAt(0).toUpperCase() }}
            </div>
            <div v-if="onlineUsers.length > 4" class="avatar more">
              +{{ onlineUsers.length - 4 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 聊天界面 -->
    <div v-else class="chat-screen">
      <!-- 头部 -->
      <header class="chat-header">
        <div class="header-left">
          <div class="room-info">
            <h2>💬 聊天室</h2>
            <span class="online-count">{{ onlineUsers.length }} 人在线</span>
          </div>
        </div>
        <div class="header-right">
          <button class="header-btn" @click="isJoined = false">
            <span>退出</span>
          </button>
        </div>
      </header>

      <div class="chat-body">
        <!-- 侧边栏 -->
        <aside class="sidebar">
          <div class="sidebar-section">
            <h3>在线用户</h3>
            <div class="user-list">
              <div 
                v-for="user in onlineUsers" 
                :key="user"
                class="user-item"
                :class="{ 'current-user': user === username }"
              >
                <div 
                  class="user-avatar"
                  :style="{ backgroundColor: getUserColor(user) }"
                >
                  {{ user.charAt(0).toUpperCase() }}
                </div>
                <span class="user-name">{{ user }}</span>
                <span v-if="user === username" class="you-tag">你</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- 主聊天区域 -->
        <main class="chat-main">
          <!-- 消息列表 -->
          <div class="messages-container" ref="messagesContainer">
            <div class="messages-list">
              <div 
                v-for="message in messages" 
                :key="message.id"
                class="message-wrapper"
                :class="{ 
                  'my-message': isMyMessage(message.user),
                  'system-message': message.type === 'system'
                }"
              >
                <div v-if="message.type === 'system'" class="system-msg">
                  {{ message.message }}
                </div>
                <div v-else class="message-bubble">
                  <div class="message-header">
                    <div 
                      class="message-avatar"
                      :style="{ backgroundColor: getUserColor(message.user) }"
                    >
                      {{ message.user.charAt(0).toUpperCase() }}
                    </div>
                    <div class="message-info">
                      <span class="message-user">{{ message.user }}</span>
                      <span class="message-time">{{ message.time }}</span>
                    </div>
                  </div>
                  <div class="message-content">
                    {{ message.message }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="input-area">
            <div class="input-container">
              <textarea
                v-model="currentMessage"
                placeholder="输入消息... (Enter 发送，Shift+Enter 换行)"
                @keydown="handleKeyPress"
                rows="1"
                maxlength="500"
              ></textarea>
              <button 
                @click="sendMessage" 
                class="send-btn"
                :disabled="!currentMessage.trim()"
              >
                <span class="send-icon">📤</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-app {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
}

/* 登录界面 */
.login-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.logo {
  margin-bottom: 32px;
}

.logo-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.logo h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
}

.logo p {
  margin: 0;
  color: #718096;
  font-size: 16px;
}

.login-form {
  margin-bottom: 32px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.join-btn {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.join-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.online-preview {
  text-align: left;
}

.online-preview p {
  margin: 0 0 12px 0;
  color: #718096;
  font-size: 14px;
}

.user-avatars {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.avatar.more {
  background: #cbd5e0;
  color: #4a5568;
}

/* 聊天界面 */
.chat-screen {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7fafc;
}

.chat-header {
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.room-info h2 {
  margin: 0;
  font-size: 20px;
  color: #2d3748;
}

.online-count {
  color: #68d391;
  font-size: 14px;
  font-weight: 500;
}

.header-btn {
  padding: 8px 16px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-btn:hover {
  background: #edf2f7;
}

.chat-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 侧边栏 */
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 20px;
  overflow-y: auto;
}

.sidebar-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #2d3748;
  font-weight: 600;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.user-item:hover {
  background: #f7fafc;
}

.user-item.current-user {
  background: #ebf8ff;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.user-name {
  flex: 1;
  font-size: 14px;
  color: #2d3748;
}

.you-tag {
  background: #667eea;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

/* 主聊天区域 */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f7fafc;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
}

.message-wrapper.my-message {
  align-items: flex-end;
}

.message-wrapper.my-message .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-wrapper.my-message .message-bubble .message-info {
  color: rgba(255, 255, 255, 0.8);
}

.system-message {
  align-items: center;
}

.system-msg {
  background: #edf2f7;
  color: #4a5568;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  text-align: center;
}

.message-bubble {
  background: white;
  border-radius: 16px;
  padding: 16px;
  max-width: 70%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.message-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.message-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.message-user {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.message-time {
  font-size: 12px;
  color: #718096;
}

.message-content {
  font-size: 15px;
  line-height: 1.5;
  color: #2d3748;
  word-wrap: break-word;
}

.my-message .message-content {
  color: white;
}

/* 输入区域 */
.input-area {
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 20px;
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-container textarea {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  transition: all 0.2s ease;
}

.input-container textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.send-btn {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-icon {
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  
  .login-card {
    padding: 32px 24px;
    margin: 16px;
  }
  
  .message-bubble {
    max-width: 85%;
  }
  
  .chat-header {
    padding: 12px 16px;
  }
  
  .messages-container {
    padding: 16px;
  }
  
  .input-area {
    padding: 16px;
  }
}

/* 滚动条样式 */
.messages-container::-webkit-scrollbar,
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track,
.sidebar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb,
.sidebar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover,
.sidebar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>