<template>
  <div class="chat-page-wrap">
    <!-- 三栏聊天主界面 -->
    <div class="chat-container">
      <!-- 左侧群组列表 -->
      <div class="chat-sidebar-left">
        <div class="sidebar-title">聊天室列表</div>
        <div class="group-search">
          <el-input v-model="groupSearchKey" placeholder="搜索群组" clearable size="small" />
        </div>
        <div v-if="groupLoading" class="loading-tip">加载聊天室列表...</div>
        <div
          class="group-item"
          v-for="group in filterGroupList"
          :key="group.id"
          @click="switchGroup(group)"
          :class="{ active: currentGroup?.id === group.id }"
        >
          <div class="group-top">
            <span class="group-name">{{ group.name }}</span>
            <div class="tag-wrap">
              <el-icon v-if="group.type === 'private'" class="lock-icon" size="12">
                <Lock />
              </el-icon>
              <el-tag :type="group.type === 'public' ? 'primary' : 'warning'" size="small">
                {{ group.type === 'public' ? '公开' : '私密' }}
              </el-tag>
              <span class="unread-badge" v-if="group.unread > 0">{{ group.unread }}</span>
            </div>
          </div>
          <div class="group-desc">{{ group.description }}</div>
          <div class="group-online">在线：{{ group.online }} / {{ group.maxUser }} 人</div>
        </div>
      </div>

      <!-- 中间聊天区域 -->
      <div class="chat-main">
        <div class="chat-header">
          <span class="chat-title">{{ currentGroup?.name || '请选择聊天室' }}</span>
          <el-button text type="primary" @click="goBackFeatures">返回功能页</el-button>
        </div>
        <div class="message-wrap" ref="messageScrollRef" @scroll="handleScroll">
          <div v-if="loadingGroup" class="loading-tip">加载历史消息中...</div>
          <div class="message-item" v-for="msg in messageList" :key="msg.id" :class="{ self: msg.isSelf }">
            <div class="msg-avatar">{{ msg.username?.slice(0, 1) || '我' }}</div>
            <div class="msg-content-wrap">
              <div class="msg-user">
                {{ msg.username }}
                <span class="msg-time">{{ msg.time }}</span>
              </div>
              <div class="msg-text">
                {{ msg.content }}
                <div class="msg-fail-wrap" v-if="msg.sendFail">
                  <el-text type="danger">发送失败</el-text>
                  <el-button link type="primary" size="small" @click="reSendMsg(msg)">重试</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="new-message-tip" v-if="isUserScrollUp && newMsgTipShow" @click="scrollToBottom">
            有新消息，点击查看
          </div>
        </div>
        <div class="send-area">
          <el-input
            v-model="sendText"
            type="textarea"
            autosize :min-rows="2" :max-rows="5"
            placeholder="输入消息，Ctrl+Enter快速发送"
            @keydown="handleKeyDown"
            clearable
          />
          <div class="send-btn-wrap">
            <span class="tip-desc">Enter换行 | Ctrl+Enter发送</span>
            <el-button type="primary" @click="sendMessage" :loading="submitLoading" :disabled="!sendText.trim() || !currentGroup">
              发送消息
            </el-button>
          </div>
        </div>
      </div>

      <!-- 右侧成员列表 -->
      <div class="chat-sidebar-right" v-if="currentGroup">
        <div class="sidebar-title">群成员（{{ memberList.length }}）</div>
        <el-input v-model="memberSearchKey" placeholder="搜索成员" clearable size="small" class="member-search" />
        <div v-if="memberLoading" class="loading-tip">加载成员...</div>
        <div class="member-online-title">在线成员</div>
        <div class="member-item" v-for="member in onlineMemberList" :key="member.id">
          <el-icon class="status-dot online" :color="'#00c48c'">
            <CirclePlus />
          </el-icon>
          <span class="member-name">{{ member.username }}</span>
          <span class="member-tag admin" v-if="member.isAdmin">管理员</span>
        </div>
        <div class="member-offline-title">离线成员</div>
        <div class="member-item" v-for="member in offlineMemberList" :key="member.id">
          <el-icon class="status-dot offline" :color="'#c0c4cc'">
            <CirclePlus />
          </el-icon>
          <span class="member-name">{{ member.username }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onUnmounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { CirclePlus, Lock } from '@element-plus/icons-vue'
import axios from 'axios'
import { connectSocket, disconnectSocket, onMessageReceive, offMessageReceive, sendSocketMessage } from '../../utils/socket'

const router = useRouter()
const route = useRoute()

// DOM 滚动容器
const messageScrollRef = ref<HTMLDivElement | null>(null)
const isUserScrollUp = ref(false)
const newMsgTipShow = ref(false)

// 全局加载状态
const groupLoading = ref(false)
const loadingGroup = ref(false)
const memberLoading = ref(false)
const submitLoading = ref(false)

// 搜索关键字
const groupSearchKey = ref('')
const memberSearchKey = ref('')
const sendText = ref('')

// 缓存上次房间ID
const lastSelectGroupId = ref<number | null>(null)

// 当前选中房间对象
const currentGroup = ref<{
  id: number
  name: string
  description: string
  online: number
  maxUser: number
  type: 'public' | 'private'
  unread: number
} | null>(null)

// 全部聊天室列表（严格保证数组）
const groupList = ref<any[]>([])
const filterGroupList = computed(() => {
  // 前置数组判断，彻底修复 filter is not a function
  if (!Array.isArray(groupList.value)) return []
  if (!groupSearchKey.value) return groupList.value
  return groupList.value.filter(g => g?.name?.includes(groupSearchKey.value))
})

// 成员数据
const originMemberList = ref<any[]>([])
const filterMemberList = computed(() => {
  if (!Array.isArray(originMemberList.value)) return []
  if (!memberSearchKey.value) return originMemberList.value
  return originMemberList.value.filter(m => m?.username?.includes(memberSearchKey.value))
})
const onlineMemberList = computed(() => filterMemberList.value.filter(m => m?.online === true))
const offlineMemberList = computed(() => filterMemberList.value.filter(m => m?.online !== true))
const memberList = computed(() => filterMemberList.value)

// 聊天消息列表
const messageList = ref<any[]>([])

// WebSocket 实时消息回调
const handleSocketMessage = (data: any) => {
  if (!currentGroup.value || data?.roomId !== currentGroup.value.id) return
  messageList.value.push(data)
}

// 页面初始化
onMounted(async () => {
  await loadAllRoomList()
  onMessageReceive(handleSocketMessage)

  const queryRoomId = Number(route.query.roomId)
  if (queryRoomId && !currentGroup.value) {
    const target = groupList.value.find(g => g?.id === queryRoomId || String(g?.id) === String(route.query.roomId))
    if (target) {
      switchGroup(target)
    }
  }
})

// 页面销毁：关闭WS连接、取消订阅
onUnmounted(() => {
  offMessageReceive(handleSocketMessage)
  disconnectSocket()
})
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`
})

const normalizeGroup = (item: any) => ({
  id: item.id ?? item.roomId ?? item.room_id ?? item.roomID ?? 0,
  name: item.name ?? item.roomName ?? item.room_name ?? item.title ?? '聊天室',
  description: item.description ?? item.desc ?? item.roomDesc ?? item.notice ?? item.announcement ?? '',
  online: item.online ?? item.onlineCount ?? item.currentOnline ?? item.userCount ?? item.memberCount ?? 0,
  maxUser: item.maxUser ?? item.maxUsers ?? item.max_user ?? item.capacity ?? item.limit ?? 0,
  type: item.type ?? (item.private || item.isPrivate ? 'private' : 'public'),
  unread: item.unread ?? item.unreadCount ?? 0
})

// 1. 加载全部聊天室列表 【修复数组兜底】
const loadAllRoomList = async () => {
  groupLoading.value = true
  try {
    const res = await axios.get('/ai_lst/chatroom/list', { headers: getAuthHeaders() })
    const rawData = res.data
    const list = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.data)
      ? rawData.data
      : []
    groupList.value = list.map(normalizeGroup)
  } catch (err) {
    ElMessage.error('加载聊天室列表失败')
  } finally {
    groupLoading.value = false
  }
}

// 2. 切换聊天室，加载成员+历史消息，重连WS
const switchGroup = async (group: any) => {
  // 拦截空对象
  if (!group?.id) return
  loadingGroup.value = true
  memberLoading.value = true
  currentGroup.value = group
  lastSelectGroupId.value = group.id
  // 清空旧数据
  messageList.value = []
  originMemberList.value = []
  isUserScrollUp.value = false
  newMsgTipShow.value = false
  sendText.value = ''

  // 断开旧WS，新建当前房间连接
  disconnectSocket()
  connectSocket(group.id)

  try {
    const [memberRes, msgRes] = await Promise.all([
      axios.get(`/ai_lst/chatroom/${group.id}/members`, { headers: getAuthHeaders() }),
      { data: []}
    ])
    // 双重兜底空数组
    originMemberList.value = Array.isArray(memberRes.data) ? memberRes.data : []
    messageList.value = Array.isArray(msgRes.data) ? msgRes.data : []
  } catch (err) {
    ElMessage.error('加载房间数据失败')
  } finally {
    loadingGroup.value = false
    memberLoading.value = false
  }

  nextTick(() => {
    if (messageScrollRef.value) messageScrollRef.value.scrollTop = messageScrollRef.value.scrollHeight
  })
}

// 监听消息列表变化，自动滚动
watch(messageList, () => {
  nextTick(() => {
    if (!messageScrollRef.value) return
    if (!isUserScrollUp.value) {
      messageScrollRef.value.scrollTop = messageScrollRef.value.scrollHeight
    } else {
      newMsgTipShow.value = true
    }
  })
}, { deep: true })

// 滚动监听
const handleScroll = (e: Event) => {
  const dom = e.target as HTMLDivElement
  const diff = dom.scrollHeight - dom.scrollTop - dom.clientHeight
  isUserScrollUp.value = diff > 80
  if (diff <= 80) newMsgTipShow.value = false
}

// 一键滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messageScrollRef.value) {
      messageScrollRef.value.scrollTop = messageScrollRef.value.scrollHeight
      isUserScrollUp.value = false
      newMsgTipShow.value = false
    }
  })
}

// 快捷键 Ctrl+Enter 发送消息
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault()
    sendMessage()
  }
}

// 发送聊天消息接口
const sendMessage = () => {
  if (!currentGroup.value) {
    ElMessage.warning('请先选择聊天室')
    return
  }
  const text = sendText.value.trim()
  if (!text) return
  submitLoading.value = true
  try {
    const success = sendSocketMessage({
      roomId: currentGroup.value.id,
      content: text
    })
    if (!success) {
      ElMessage.error('实时连接未就绪，请稍后重试')
      return
    }
    sendText.value = ''
  } catch (err) {
    ElMessage.error('消息发送失败，请重试')
    console.error('STOMP发送失败：', err)
  } finally {
    submitLoading.value = false
  }
}

// 重发失败消息
const reSendMsg = (msg: any) => {
  sendText.value = msg.content
}

// 返回功能页路由跳转
const goBackFeatures = () => {
  currentGroup.value = null
  disconnectSocket()
  router.push('/features')
}
</script>

<style scoped>
/* 全局滚动条美化 */
:deep(::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}
:deep(::-webkit-scrollbar-thumb) {
  background: rgba(0, 127, 255, 0.25);
  border-radius: 3px;
}
:deep(::-webkit-scrollbar-track) {
  background: transparent;
}

/* 三栏布局容器 */
.chat-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 60px);
  background: #f2f6fc;
  color: #1e293b;
  font-size: 14px;
}

/* 左侧群组栏 */
.chat-sidebar-left {
  width: 260px;
  min-width: 220px;
  background: #ffffff;
  border-right: 1px solid #d0dceb;
  padding: 16px;
  overflow-y: auto;
}
.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #0055aa;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5eaf3;
}
.group-search {
  margin-bottom: 12px;
}
.loading-tip {
  text-align: center;
  padding: 10px 0;
  font-size: 12px;
  color: #909399;
}
.group-item {
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  background: #f7faff;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}
.group-item:hover {
  background: #e8f3ff;
  transform: scale(1.01);
}
.group-item.active {
  background: #d6eaff;
  border: 1px solid #007fff;
  box-shadow: 0 0 0 1px #007fff40, 0 0 8px rgba(0, 127, 255, 0.12);
}
.group-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}
.tag-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}
.lock-icon {
  color: #e6a23c;
}
.group-name {
  font-weight: 500;
  font-size: 14px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.group-desc {
  font-size: 12px;
  color: #606a78;
  margin: 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.group-online {
  font-size: 12px;
  color: #007fff;
}
.unread-badge {
  width: 16px;
  height: 16px;
  background: #f56c6c;
  color: #fff;
  border-radius: 50%;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

/* 中间聊天面板 */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  min-width: 400px;
}
.chat-header {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #d0dceb;
}
.chat-title {
  font-size: 16px;
  font-weight: 600;
  color: #004080;
}
.message-wrap {
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
  background: #f8fbff;
}
.new-message-tip {
  position: sticky;
  bottom: 10px;
  width: fit-content;
  margin: 0 auto;
  padding: 4px 12px;
  background: #007fff;
  color: #fff;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  z-index: 10;
}
.message-item {
  display: flex;
  margin-bottom: 16px;
  transition: all 0.2s;
}
.message-item.self {
  flex-direction: row-reverse;
}
.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #007fff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-right: 10px;
  flex-shrink: 0;
  border: 1px solid rgba(0, 127, 255, 0.2);
}
.message-item.self .msg-avatar {
  margin-left: 10px;
  margin-right: 0;
  background: #00c48c;
  border-color: rgba(0, 196, 140, 0.2);
}
.msg-content-wrap {
  max-width: 60%;
}
.msg-user {
  font-size: 12px;
  color: #606a78;
  margin-bottom: 4px;
}
.msg-time {
  margin-left: 8px;
  color: #a0a8b8;
}
.msg-text {
  padding: 8px 12px;
  border-radius: 8px;
  background: #e6f0ff;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-all;
}
.message-item.self .msg-text {
  background: #d1f0eb;
}
.msg-fail-wrap {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.send-area {
  padding: 12px 20px;
  border-top: 1px solid #d0dceb;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.send-btn-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tip-desc {
  font-size: 12px;
  color: #909399;
}

/* 右侧成员栏 */
.chat-sidebar-right {
  width: 240px;
  min-width: 200px;
  background: #ffffff;
  border-left: 1px solid #d0dceb;
  padding: 16px;
  overflow-y: auto;
}
.member-search {
  margin-bottom: 12px;
}
.member-online-title, .member-offline-title {
  font-size: 13px;
  color: #64748b;
  margin: 10px 0 6px;
}
.member-item {
  display: flex;
  align-items: center;
  margin: 8px 0;
  font-size: 14px;
}
.status-dot {
  font-size: 10px;
  margin-right: 8px;
  transform: scale(0.7);
}
/* 隐藏CirclePlus内部加号，只保留圆圈 */
.status-dot :deep(path:nth-child(2)) {
  display: none;
}
.member-name {
  flex: 1;
}
.member-tag {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
}
.member-tag.admin {
  background: #ffe6cc;
  color: #e67700;
}
</style>