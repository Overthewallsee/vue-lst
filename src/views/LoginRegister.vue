<template>
  <div class="login-container">
    <!-- 登录注册卡片 -->
    <div class="login-card">
      <div class="logo-box">
        <h2>AI系统平台</h2>
      </div>
      <!-- Tab切换 -->
      <el-tabs v-model="activeTab" class="login-tabs">
        <!-- 登录表单 -->
        <el-tab-pane label="登录" name="login">
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-width="0"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                prefix-icon="User"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                placeholder="请输入密码"
                prefix-icon="Lock"
                :type="pwdVisible ? 'text' : 'password'"
              >
                <template #suffix>
                  <el-icon @click="pwdVisible = !pwdVisible">
                    <View v-if="pwdVisible" />
                    <Hide v-else />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <div class="form-row">
              <el-checkbox v-model="remember">记住账号</el-checkbox>
              <span class="forget-pwd">忘记密码？</span>
            </div>
            <el-form-item>
              <el-button
                type="primary"
                class="submit-btn"
                :loading="loginLoading"
                @click="handleLogin"
              >
                登录
              </el-button>
            </el-form-item>
            <div class="tip-text">
              没有账号？
              <span class="link-text" @click="activeTab = 'register'">立即注册</span>
            </div>
          </el-form>
        </el-tab-pane>

        <!-- 注册表单 -->
        <el-tab-pane label="注册" name="register">
          <el-form
            ref="regFormRef"
            :model="regForm"
            :rules="regRules"
            label-width="0"
          >
            <el-form-item prop="username">
              <el-input v-model="regForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item prop="nickname">
              <el-input v-model="regForm.nickname" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item prop="email">
              <el-input v-model="regForm.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item prop="phone">
              <el-input v-model="regForm.phone" placeholder="请输入手机号" prefix-icon="Phone" />
            </el-form-item>
            <el-form-item prop="code">
              <el-input v-model="regForm.code" placeholder="请输入验证码">
                <template #suffix>
                  <el-button
                    text
                    type="primary"
                    :disabled="countDown > 0"
                    @click="getCode"
                  >
                    {{ countDown > 0 ? `${countDown}s` : '获取验证码' }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="regForm.password" placeholder="设置密码" prefix-icon="Lock" type="password" />
            </el-form-item>
            <el-form-item prop="confirmPwd">
              <el-input v-model="regForm.confirmPwd" placeholder="确认密码" prefix-icon="Lock" type="password" />
            </el-form-item>
            <el-form-item prop="agree">
              <el-checkbox v-model="regForm.agree">
                我已阅读并同意
                <span class="link-text">《用户协议》</span>与
                <span class="link-text">《隐私政策》</span>
              </el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="submit-btn"
                :loading="registerLoading"
                @click="handleRegister"
              >
                注册
              </el-button>
            </el-form-item>
            <div class="tip-text">
              已有账号？
              <span class="link-text" @click="activeTab = 'login'">去登录</span>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { User, Lock, View, Hide, Phone } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// Tab标识
const activeTab = ref('login')
// 密码显隐
const pwdVisible = ref(false)
// 登录加载状态
const loginLoading = ref(false)
// 验证码倒计时
const countDown = ref(0)
const registerLoading = ref(false)
let timer = null

// ====================== 登录表单 ======================
const loginFormRef = ref(null)
const loginForm = reactive({
  username: localStorage.getItem('username') || '',
  password: ''
})
const remember = ref(!!localStorage.getItem('username'))

// 登录校验规则
const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 登录接口请求
const handleLogin = async () => {
  await loginFormRef.value.validate(async valid => {
    if (!valid) return
    loginLoading.value = true
    try {
      // POST 请求，入参对应后端 LoginRequest DTO
      const res = await axios.post('/ai_lst/user/login', {
        username: loginForm.username,
        password: loginForm.password
      })
      // 成功逻辑
      if (res.data.code === 200) {
        ElMessage.success('登录成功')
        // 存储token
        localStorage.setItem('token', res.data.data.token)
        // 记住账号
        if (remember.value) {
          localStorage.setItem('username', loginForm.username)
        } else {
          localStorage.removeItem('username')
        }
        // 此处可写路由跳转逻辑
        router.push('/features')
      } else {
        ElMessage.error(res.data.msg || '登录失败')
      }
    } catch (err) {
      ElMessage.error('网络异常，请检查服务地址')
      console.error('登录接口错误：', err)
    } finally {
      loginLoading.value = false
    }
  })
}

// ====================== 注册表单 ======================
const regFormRef = ref(null)
const regForm = reactive({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  code: '',
  password: '',
  confirmPwd: '',
  agree: false
})
// 注册校验规则
const regRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度6-16位', trigger: 'blur' }
  ],
  confirmPwd: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        if (value !== regForm.password) callback(new Error('两次密码不一致'))
        else callback()
      }, trigger: 'blur' }
  ],
  agree: [{ required: true, message: '请勾选同意协议', trigger: 'change' }]
}

// 注册接口请求
const handleRegister = async () => {
  await regFormRef.value.validate(async valid => {
    if (!valid) return
    registerLoading.value = true
    try {
      const payload = {
        username: regForm.username.trim(),
        password: regForm.password,
        nickname: regForm.nickname.trim(),
        phone: regForm.phone,
        email: regForm.email.trim()
      }

      const res = await axios.post('/ai_lst/user/register', payload)
      const success = res.data?.code === 200 || res.data?.code === 201 || res.data?.success === true

      if (success) {
        ElMessage.success(res.data?.msg || '注册成功')
        regFormRef.value.resetFields()
        activeTab.value = 'login'
      } else {
        ElMessage.error(res.data?.msg || '注册失败')
      }
    } catch (err) {
      ElMessage.error('网络异常，请检查服务地址')
      console.error('注册接口错误：', err)
    } finally {
      registerLoading.value = false
    }
  })
}

// 获取验证码倒计时
const getCode = () => {
  if (countDown.value > 0) return
  countDown.value = 60
  timer = setInterval(() => {
    countDown.value--
    if (countDown.value <= 0) clearInterval(timer)
  }, 1000)
  ElMessage.success('验证码已发送')
}
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, white 0%, #ffffff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-card {
  width: 420px;
  background: #fff;
  border-radius: 16px;
  padding: 36px 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}
.logo-box {
  text-align: center;
  margin-bottom: 24px;
}
.logo-box h2 {
  margin: 0;
  color: #333;
  font-weight: 600;
}
.login-tabs {
  --el-tabs-header-height: 40px;
}
.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0 16px;
  font-size: 14px;
}
.forget-pwd {
  color: #409eff;
  cursor: pointer;
}
.submit-btn {
  width: 100%;
  height: 44px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border: none;
  font-size: 16px;
}
.tip-text {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #666;
}
.link-text {
  color: #667eea;
  cursor: pointer;
}
@media screen and (max-width: 480px) {
  .login-card {
    width: 90%;
    padding: 24px 20px;
  }
}
</style>