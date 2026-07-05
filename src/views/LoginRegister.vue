<template>
  <!-- 全屏渐变背景容器 -->
  <div class="login-wrap">
    <!-- 居中弹窗卡片 -->
    <div class="login-card">
      <!-- Tab切换头部 -->
      <el-tabs v-model="activeTab" class="login-tabs" stretch>
        <el-tab-pane label="登录" name="login"></el-tab-pane>
        <el-tab-pane label="注册" name="register"></el-tab-pane>
      </el-tabs>

      <!-- 登录表单 -->
      <el-form
        v-if="activeTab === 'login'"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="80px"
        class="form-box"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix="User"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            :type="pwdVisible ? 'text' : 'password'"
            placeholder="请输入密码"
            prefix="Lock"
          >
            <template #suffix>
              <el-icon @click="pwdVisible = !pwdVisible" class="eye-icon">
                <View v-if="pwdVisible" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item class="flex-row">
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <span class="forget-pwd" @click="handleForgetPwd">忘记密码？</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="submit-btn" @click="handleLogin">登录</el-button>
        </el-form-item>

        <div class="tip-text">
          没有账号？<span class="link-text" @click="activeTab = 'register'">立即注册</span>
        </div>
      </el-form>

      <!-- 注册表单 -->
      <el-form
        v-if="activeTab === 'register'"
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="80px"
        class="form-box"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="registerForm.phone"
            placeholder="请输入11位手机号"
            prefix="Phone"
          ></el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="code">
          <div class="code-input-wrap">
            <el-input
              v-model="registerForm.code"
              placeholder="请输入验证码"
            ></el-input>
            <el-button
              :disabled="codeCount > 0"
              class="code-btn"
              @click="getCode"
            >
              {{ codeCount > 0 ? `${codeCount}s后重发` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            :type="regPwdVisible ? 'text' : 'password'"
            placeholder="6-16位数字字母组合"
            prefix="Lock"
          >
            <template #suffix>
              <el-icon @click="regPwdVisible = !regPwdVisible" class="eye-icon">
                <View v-if="regPwdVisible" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input
            v-model="registerForm.confirmPwd"
            type="password"
            placeholder="再次输入密码"
            prefix="Lock"
          ></el-input>
        </el-form-item>

        <el-form-item prop="agree">
          <el-checkbox v-model="registerForm.agree">
            我已阅读并同意<a href="javascript:;">用户服务协议</a>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="submit-btn" @click="handleRegister">注册</el-button>
        </el-form-item>

        <div class="tip-text">
          已有账号？<span class="link-text" @click="activeTab = 'login'">去登录</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
// 仅引入页面用到的图标，无ChatLine
import { User, Lock, View, Hide, Phone } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// Tab切换状态
const activeTab = ref('login')

// 登录表单
const loginFormRef = ref(null)
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})
const pwdVisible = ref(false)
const loginRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度3-20位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度6-16位', trigger: 'blur' }
  ]
})

// 登录提交
const handleLogin = () => {
  if (!loginFormRef.value) return
  loginFormRef.value.validate((valid) => {
    if (valid) {
      console.log('登录数据：', loginForm)
      ElMessage.success('登录成功')
    } else {
      ElMessage.error('请完善表单')
    }
  })
}

// 忘记密码
const handleForgetPwd = () => {
  ElMessage.info('跳转找回密码页面')
}

// 注册表单
const registerFormRef = ref(null)
const codeCount = ref(0)
const regPwdVisible = ref(false)
const registerForm = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPwd: '',
  agree: false
})

// 两次密码校验
const validatePwdRepeat = (rule, value, callback) => {
  if (value !== registerForm.password) callback(new Error('两次密码不一致'))
  else callback()
}
// 协议勾选校验
const validateAgree = (rule, value, callback) => {
  if (!value) callback(new Error('请同意用户协议'))
  else callback()
}

const registerRules = reactive({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 6, message: '验证码4~6位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码6-16位', trigger: 'blur' }
  ],
  confirmPwd: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePwdRepeat, trigger: 'blur' }
  ],
  agree: [{ validator: validateAgree, trigger: 'change' }]
})

// 获取验证码倒计时
const getCode = () => {
  if (!/^1[3-9]\d{9}$/.test(registerForm.phone)) {
    ElMessage.warning('手机号不正确')
    return
  }
  ElMessage.success('验证码已发送')
  codeCount.value = 60
  const timer = setInterval(() => {
    codeCount.value--
    if (codeCount.value <= 0) clearInterval(timer)
  }, 1000)
}

// 注册提交
const handleRegister = () => {
  if (!registerFormRef.value) return
  registerFormRef.value.validate((valid) => {
    if (valid) {
      console.log('注册数据：', registerForm)
      ElMessage.success('注册成功，请登录')
      activeTab.value = 'login'
      // 清空注册表单
      registerForm.phone = ''
      registerForm.code = ''
      registerForm.password = ''
      registerForm.confirmPwd = ''
      registerForm.agree = false
    } else {
      ElMessage.error('请完善注册信息')
    }
  })
}
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-wrap {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 440px;
  max-width: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.25);
  padding: 32px;

  .login-tabs {
    margin-bottom: 24px;
  }

  .form-box {
    .el-form-item {
      margin-bottom: 18px;
    }

    .flex-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .forget-pwd {
        color: #667eea;
        font-size: 13px;
        cursor: pointer;
      }
    }

    .eye-icon {
      cursor: pointer;
      font-size: 18px;
      color: #909399;
    }

    .code-input-wrap {
      display: flex;
      gap: 10px;
      .el-input { flex: 1; }
      .code-btn { white-space: nowrap; }
    }

    .submit-btn {
      width: 100%;
      height: 44px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border: none;
      font-size: 16px;
      border-radius: 8px;
    }

    .tip-text {
      text-align: center;
      margin-top: 16px;
      font-size: 14px;
      color: #606266;
      .link-text {
        color: #667eea;
        cursor: pointer;
        font-weight: 500;
      }
    }
  }
}

// 移动端适配
@media screen and (max-width: 576px) {
  .login-wrap { padding: 12px; }
  .login-card {
    padding: 20px;
    border-radius: 12px;
    .form-box {
      :deep(.el-form-item__label) {
        width: 70px !important;
        font-size: 13px;
      }
      .submit-btn { height: 40px; }
    }
  }
}
</style>