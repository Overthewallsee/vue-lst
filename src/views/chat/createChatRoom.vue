<template>
  <div class="chat-page-wrap">
    <!-- 创建/加入聊天室弹窗 -->
    <el-dialog
      width="540px"
      v-model="dialogVisible"
      :close-on-click-modal="false"
    >
      <template #header>
        <div class="dialog-header-wrap">
          <span class="dialog-title">{{ activeTab === 'create' ? '创建聊天室' : '加入聊天室' }}</span>
          <el-icon @click="goBackFeatures" class="back-icon">
            <ArrowLeft />
          </el-icon>
        </div>
      </template>

      <el-tabs v-model="activeTab" type="card" class="mt-0">
        <!-- 创建聊天室 Tab -->
        <el-tab-pane label="创建聊天室" name="create">
          <el-form
            ref="createFormRef"
            :model="createForm"
            label-width="110px"
            :rules="createRules"
          >
            <el-form-item label="房间名称" prop="roomName">
              <el-input v-model="createForm.roomName" placeholder="请输入聊天室名称" maxlength="50" />
            </el-form-item>

            <el-form-item label="房间简介" prop="desc">
              <el-input
                v-model="createForm.desc"
                type="textarea"
                :rows="3"
                maxlength="200"
                placeholder="简单描述房间用途/公告"
              />
            </el-form-item>

            <el-form-item label="房间权限" prop="authType">
              <el-radio-group v-model="createForm.authType">
                <el-radio value="public" label="公开房间" />
                <el-radio value="private" label="私密房间" />
              </el-radio-group>
            </el-form-item>

            <el-form-item label="房间访问密码" prop="roomPwd" v-if="createForm.authType === 'private'">
              <el-input
                v-model="createForm.roomPwd"
                show-password
                maxlength="100"
                placeholder="私密房间必须设置访问密码"
              />
            </el-form-item>

            <el-form-item label="最大在线人数" prop="maxUser">
              <el-select v-model="createForm.maxUser" placeholder="选择人数上限">
                <el-option label="50人" :value="50" />
                <el-option label="100人" :value="100" />
                <el-option label="200人" :value="200" />
                <el-option label="500人" :value="500" />
              </el-select>
            </el-form-item>

            <el-divider content-position="left">消息防堆积优化配置</el-divider>
            <el-form-item label="性能配置">
              <el-checkbox-group v-model="createForm.optimizeList">
                <el-checkbox value="autoClear" label="开启自动本地清屏，最多保存100条实时消息" />
                <el-checkbox value="hideDanmu" label="自动屏蔽进场、礼物、弹幕低优先级消息" />
                <el-checkbox value="limitSend" label="开启用户发送限流，单人每秒最多发送2条消息" />
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 加入聊天室 Tab -->
        <el-tab-pane label="加入聊天室" name="join">
          <el-form
            ref="joinFormRef"
            :model="joinForm"
            label-width="110px"
            :rules="joinRules"
          >
            <el-form-item label="搜索房间" prop="roomKey">
              <el-autocomplete
                v-model="joinForm.roomKey"
                :fetch-suggestions="querySearchAsync"
                placeholder="输入房间名称搜索"
                @select="handleSelectRoom"
                clearable
              />
            </el-form-item>

            <div class="room-info-card" v-if="currentSelectRoom">
              <div class="info-title">选中房间信息</div>
              <div class="info-row">
                <span class="label">房间名称：</span>
                <span class="value">{{ currentSelectRoom?.name }}</span>
                <el-tag
                  :type="currentSelectRoom.type === 'public' ? 'success' : 'warning'"
                  size="small"
                >
                  {{ currentSelectRoom.type === 'public' ? '公开房间' : '私密房间' }}
                </el-tag>
              </div>
              <div class="info-row">
                <span class="label">在线人数：</span>
                <span class="value">{{ currentSelectRoom?.online }} 人在线</span>
              </div>
              <div class="info-row">
                <span class="label">房间公告：</span>
                <span class="value">{{ currentSelectRoom?.description || '无公告' }}</span>
              </div>
            </div>

            <el-form-item label="房间密码" prop="pwd" v-if="joinForm.isPrivate" class="mt-3">
              <el-input
                v-model="joinForm.pwd"
                show-password
                placeholder="该房间为私密房间，请输入访问密码"
              />
            </el-form-item>

            <div class="tip-text mt-3">房间消息过载时将自动开启降噪清屏，保障页面流畅</div>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="goBackFeatures">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">
            {{ activeTab === 'create' ? '创建聊天室' : '加入聊天室' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import axios from 'axios'

const router = useRouter()
const dialogVisible = ref(true)
const activeTab = ref('create')
const submitLoading = ref(false)
const groupList = ref<any[]>([])
const currentSelectRoom = ref<any | null>(null)
const createFormRef = ref<any>(null)
const joinFormRef = ref<any>(null)

const createForm = reactive({
  roomName: '',
  desc: '',
  authType: 'public',
  roomPwd: '',
  maxUser: 100,
  optimizeList: ['autoClear', 'hideDanmu', 'limitSend']
})

const joinForm = reactive({
  roomKey: '',
  targetRoomId: '',
  pwd: '',
  isPrivate: false
})

const createRules = reactive({
  roomName: [{ required: true, message: '请输入房间名称', trigger: 'blur' }],
  authType: [{ required: true, message: '请选择房间权限', trigger: 'change' }],
  maxUser: [{ required: true, message: '请选择人数上限', trigger: 'change' }],
  roomPwd: [
    {
      required: true,
      trigger: 'blur',
      validator: (_rule: any, value: string, callback: Function) => {
        if (createForm.authType === 'private' && !value) {
          callback(new Error('私密房间必须设置访问密码'))
        } else callback()
      }
    }
  ]
})

const joinRules = reactive({
  roomKey: [{ required: true, message: '请搜索并选择目标房间', trigger: 'blur' }],
  pwd: [
    {
      required: true,
      trigger: 'blur',
      validator: (_rule: any, value: string, callback: Function) => {
        if (joinForm.isPrivate && !value) {
          callback(new Error('该房间为私密房间，必须填写访问密码'))
        } else callback()
      }
    }
  ]
})

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`
})

const loadAllRoomList = async () => {
  try {
    const res = await axios.get('/ai_lst/chatroom/list', {
      headers: getAuthHeaders()
    })
    const rawData = res.data
    groupList.value = Array.isArray(rawData) ? rawData : []
  } catch (err) {
    ElMessage.error('加载聊天室列表失败')
  }
}

onMounted(() => {
  loadAllRoomList()
})

const querySearchAsync = (queryStr: string, callback: Function) => {
  const result = Array.isArray(groupList.value)
    ? groupList.value
        .filter(item => item?.name?.includes(queryStr))
        .map(item => ({ value: item.name, id: item.id }))
    : []
  callback(result)
}

const handleSelectRoom = (item: any) => {
  const target = groupList.value.find((r: any) => r.id === item.id)
  if (target) {
    currentSelectRoom.value = target
    joinForm.targetRoomId = target.id
    joinForm.isPrivate = target.type === 'private'
    joinForm.pwd = ''
  }
}

const submitForm = async () => {
  submitLoading.value = true
  try {
    if (activeTab.value === 'create') {
      const valid = await createFormRef.value.validate()
      if (!valid) return

      const reqBody = {
        name: createForm.roomName,
        description: createForm.desc,
        password: createForm.authType === 'private' ? createForm.roomPwd : null
      }
      const res = await axios.post('/ai_lst/chatroom/create', reqBody, {
        headers: getAuthHeaders()
      })
      ElMessage.success('聊天室创建成功！')
      createFormRef.value.resetFields()
      createForm.roomPwd = ''
      const newRoom = res.data?.data ?? res.data ?? null
      const roomId = newRoom?.id
      router.push({ name: 'Chat', query: { roomId } })
    } else {
      const valid = await joinFormRef.value.validate()
      if (!valid) return
      if (!currentSelectRoom.value) {
        ElMessage.warning('请先选择一个房间')
        return
      }

      const reqBody = {
        roomId: currentSelectRoom.value.id,
        password: joinForm.pwd || null
      }
      await axios.post('/ai_lst/chatroom/join', reqBody, { headers: getAuthHeaders() })

      ElMessage.success('成功加入聊天室！')
      const joinRoomId = currentSelectRoom.value.id
      joinFormRef.value.resetFields()
      currentSelectRoom.value = null
      router.push({ name: 'Chat', query: { roomId: joinRoomId } })
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.message || '操作失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

const goBackFeatures = () => {
  router.push('/features')
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
.tip-text {
  font-size: 12px;
  color: #909399;
}
:deep(.el-tabs__header) {
  margin-bottom: 16px;
}
.mt-3 {
  margin-top: 12px;
}
.room-info-card {
  background-color: #f5f7fa;
  border-radius: 6px;
  padding: 12px 16px;
  margin-top: 8px;
}
.info-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  color: #303133;
}
.info-row {
  display: flex;
  align-items: center;
  margin: 6px 0;
  font-size: 13px;
}
.label {
  width: 80px;
  color: #606266;
}
.value {
  flex: 1;
  color: #303133;
}
.el-tag {
  margin-left: 8px;
}
.dialog-header-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.dialog-title {
  font-size: 16px;
  font-weight: 600;
}
.back-icon {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
}
.back-icon:hover {
  color: #409eff;
}
:deep(.el-dialog__headerbtn) {
  display: none !important;
}
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

</style>