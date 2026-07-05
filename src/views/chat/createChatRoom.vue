<template>
  <div class="chat-page">
    <el-dialog
      width="540px"
      v-model="dialogVisible"
      :close-on-click-modal="false"
    >
      <!-- 自定义头部：标题 + 右上角返回箭头，隐藏原生关闭X -->
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
                placeholder="简单描述房间用途/公告"
                maxlength="200"
              />
            </el-form-item>

            <el-form-item label="房间权限" prop="authType">
              <el-radio-group v-model="createForm.authType">
                <el-radio label="public">公开房间</el-radio>
                <el-radio label="private">私密房间</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="房间访问密码" prop="roomPwd" v-if="createForm.authType === 'private'">
              <el-input
                v-model="createForm.roomPwd"
                show-password
                placeholder="私密房间必须设置访问密码"
                maxlength="100"
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
                <el-checkbox label="autoClear">开启自动本地清屏，最多保存100条实时消息</el-checkbox>
                <el-checkbox label="hideDanmu">自动屏蔽进场、礼物、点赞弹幕低优先级消息</el-checkbox>
                <el-checkbox label="limitSend">开启用户发送限流，单人每秒最多发送2条消息</el-checkbox>
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
                <span class="value">{{ currentSelectRoom.name }}</span>
                <el-tag :type="currentSelectRoom.type === 'public' ? 'success' : 'warning'" size="small">
                  {{ currentSelectRoom.type === 'public' ? '公开房间' : '私密房间' }}
                </el-tag>
              </div>
              <div class="info-row">
                <span class="label">在线人数：</span>
                <span class="value">{{ currentSelectRoom.online }} 人在线</span>
              </div>
              <div class="info-row">
                <span class="label">房间公告：</span>
                <span class="value">{{ currentSelectRoom.desc }}</span>
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

// 页面加载自动打开弹窗
const dialogVisible = ref(false)
onMounted(() => {
  dialogVisible.value = true
})

const activeTab = ref('create')
// 提交加载状态，防止重复点击
const submitLoading = ref(false)

// 创建表单
const createFormRef = ref(null)
const createForm = reactive({
  roomName: '',
  desc: '',
  authType: 'public',
  roomPwd: '',
  maxUser: 100,
  optimizeList: ['autoClear', 'hideDanmu', 'limitSend']
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

// 加入表单
const joinFormRef = ref(null)
const joinForm = reactive({
  roomKey: '',
  targetRoomId: '',
  pwd: '',
  isPrivate: false
})

const currentSelectRoom = ref<{
  id: number
  name: string
  online: number
  type: 'public' | 'private'
  desc: string
} | null>(null)

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

// 模拟房间数据
const roomList = [
  { id: 1, name: '前端技术交流群', online: 68, type: 'public', desc: '分享Vue3、TS、Vite前端开发技术，禁止广告' },
  { id: 2, name: 'UI设计讨论室', online: 22, type: 'private', desc: '内部设计师交流，仅公司员工可进入' },
  { id: 3, name: '全栈开发聊天室', online: 135, type: 'public', desc: '前后端技术分享，问答互助' },
  { id: 4, name: 'Java后端学习小组', online: 96, type: 'public', desc: 'SpringBoot、微服务学习交流' },
  { id: 5, name: '产品经理私密研讨房', online: 15, type: 'private', desc: '内部需求评审，外部人员禁止加入' },
  { id: 6, name: '游戏开发交流室', online: 43, type: 'public', desc: 'Unity、Cocos游戏开发技术讨论' },
  { id: 7, name: '大数据数据分析私密群', online: 8, type: 'private', desc: '企业数据项目内部讨论，需授权密码' },
  { id: 8, name: '测试工程师交流大厅', online: 55, type: 'public', desc: '自动化测试、性能测试经验分享' },
]

// 返回 /features 路由
const goBackFeatures = () => {
  createFormRef.value?.resetFields()
  joinFormRef.value?.resetFields()
  createForm.roomPwd = ''
  joinForm.roomKey = ''
  joinForm.targetRoomId = ''
  joinForm.pwd = ''
  joinForm.isPrivate = false
  currentSelectRoom.value = null
  router.push('/features')
}

// 搜索联想
const querySearchAsync = (queryStr: string, callback: Function) => {
  let result: any[] = []
  if (queryStr) {
    result = roomList
      .filter(item => item.name.includes(queryStr))
      .map(item => ({
        value: item.name,
        id: item.id,
        online: item.online,
        type: item.type,
        desc: `${item.name} | 在线${item.online}人 | ${item.type === 'public' ? '公开' : '私密'}`
      }))
  }
  callback(result)
}

// 选中房间
const handleSelectRoom = (item: any) => {
  const target = roomList.find(r => r.id === item.id)
  if (target) {
    currentSelectRoom.value = target
    joinForm.targetRoomId = target.id
    joinForm.isPrivate = target.type === 'private'
    joinForm.pwd = ''
  }
}

// 提交表单（区分创建/加入）
const submitForm = async () => {
  if (activeTab.value === 'create') {
    createFormRef.value.validate(async (valid: boolean) => {
      if (!valid) return
      submitLoading.value = true
      try {
        // 组装后端 CreateChatRoomRequest DTO 参数
        const reqData = {
          name: createForm.roomName,
          description: createForm.desc,
          // 公开房间不传password，私密房间传密码
          password: createForm.authType === 'private' ? createForm.roomPwd : null
        }
        // 调用后端创建接口
        const res = await axios.post('/ai_lst/chatroom/create', reqData)
        console.log('创建房间返回结果：', res.data)
        ElMessage.success('聊天室创建成功！')
        dialogVisible.value = false
        // 重置表单
        createFormRef.value?.resetFields()
        createForm.roomPwd = ''
      } catch (err: any) {
        console.error('创建聊天室失败：', err)
        // 后端返回错误提示
        const msg = err.response?.data?.message || '创建聊天室请求失败，请检查后端服务'
        ElMessage.error(msg)
      } finally {
        submitLoading.value = false
      }
    })
  } else {
    joinFormRef.value.validate((valid: boolean) => {
      if (valid) {
        console.log('加入房间参数：', { roomId: joinForm.targetRoomId, pwd: joinForm.pwd })
        ElMessage.success('成功加入聊天室！')
        dialogVisible.value = false
      }
    })
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
.tip-text {
  font-size: 12px;
  color: #86909c;
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
/* 头部布局 */
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
/* 隐藏原生关闭X */
:deep(.el-dialog__headerbtn) {
  display: none !important;
}
</style>