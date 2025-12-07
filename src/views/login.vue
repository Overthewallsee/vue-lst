<script setup>
import { ref, computed } from 'vue'
import CryptoJS from 'crypto-js'
import { API_BASE_URL } from '@/api/config'
import { useRouter } from 'vue-router'

const isLogin = ref(true) // 控制当前是登录还是注册界面
const router = useRouter() // 添加路由实例

const form = ref({
  username: '', // 添加用户名字段
  phoneNumber: '', // 将 phone 改为 phoneNumber
  password: '',
  confirmPassword: '', // 注册时需要确认密码
  remember: true,
})

const loading = ref(false)
const touched = ref({ username: false, phoneNumber: false, password: false, confirmPassword: false })
const errorMessage = ref('')
const successMessage = ref('')

const usernameError = computed(() => {
  if (isLogin.value) return '' // 登录时不需要验证用户名
  if (!touched.value.username) return ''
  if (!form.value.username) return '请输入用户名'
  if (form.value.username.length < 3) return '用户名至少3个字符'
  if (form.value.username.length > 20) return '用户名不能超过20个字符'
  return ''
})

const phoneNumberError = computed(() => {
  if (!touched.value.phoneNumber) return ''
  if (!form.value.phoneNumber) return '请输入手机号'
  const ok = /^1[3-9]\d{9}$/.test(form.value.phoneNumber)
  return ok ? '' : '手机号格式不正确'
})

const passwordError = computed(() => {
  if (!touched.value.password) return ''
  if (!form.value.password) return '请输入密码'
  if (isLogin.value) {
    return form.value.password.length >= 6 ? '' : '密码至少 6 位'
  } else {
    // 注册时密码要求
    if (form.value.password.length < 8) return '密码至少 8 位'
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.value.password))
      return '密码需包含大小写字母和数字'
    return ''
  }
})

const confirmPasswordError = computed(() => {
  if (isLogin.value) return '' // 登录时不需要确认密码
  if (!touched.value.confirmPassword) return ''
  if (!form.value.confirmPassword) return '请确认密码'
  return form.value.password === form.value.confirmPassword ? '' : '两次输入的密码不一致'
})

const canSubmit = computed(() => {
  if (isLogin.value) {
    return (
        form.value.phoneNumber &&
        form.value.password &&
        !phoneNumberError.value &&
        !passwordError.value &&
        !loading.value
    )
  } else {
    return (
        form.value.username &&
        form.value.phoneNumber &&
        form.value.password &&
        form.value.confirmPassword &&
        !usernameError.value &&
        !phoneNumberError.value &&
        !passwordError.value &&
        !confirmPasswordError.value &&
        !loading.value
    )
  }
})

// 清除消息
function clearMessages() {
  errorMessage.value = ''
  successMessage.value = ''
}

// 切换登录/注册
function toggleForm() {
  isLogin.value = !isLogin.value
  // 切换时清除表单和错误信息
  if (isLogin.value) {
    // 切换到登录
    form.value = {
      username: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      remember: true,
    }
  } else {
    // 切换到注册，填充默认值
    form.value = {
      username: 'user' + Math.floor(Math.random() * 10000),
      phoneNumber: '138' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
      password: 'Test1234',
      confirmPassword: 'Test1234',
      remember: true,
    }
  }
  touched.value = { username: false, phoneNumber: false, password: false, confirmPassword: false }
  clearMessages()
}

// 密码加密函数
function encryptPassword(password) {
  // 使用AES加密，这里使用一个固定的密钥，实际项目中应该从环境变量获取
  const secretKey = 'LST_LOGIN_SECRET_KEY_2024'
  const encrypted = CryptoJS.AES.encrypt(password, secretKey).toString()
  return encrypted
}

async function onSubmit(e) {
  e.preventDefault()
  touched.value.username = true
  touched.value.phoneNumber = true
  touched.value.password = true
  if (!isLogin.value) {
    touched.value.confirmPassword = true
  }

  if (!canSubmit.value) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // 加密密码
    const encryptedPassword = encryptPassword(form.value.password)

    // 使用相对路径，通过Vite代理转发请求
    const endpoint = isLogin.value ? '/lst/api/auth/login' : '/lst/api/auth/register'

    const requestBody = {
      phoneNumber: form.value.phoneNumber, // 将发送给后端的字段改为 phoneNumber
      password: encryptedPassword,
      username: isLogin.value ? form.value.phoneNumber : form.value.username, // 登录时用户名默认为手机号
    }

    // 注册时添加额外字段
    if (!isLogin.value) {
      requestBody.remember = form.value.remember
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()

    if (response.ok) {
      if (isLogin.value) {
        successMessage.value = `欢迎回来：${form.value.phoneNumber}`
        // 登录成功后的处理逻辑
        console.log('登录成功:', data)

        // 如果返回了token，可以存储到localStorage
        if (data.token) {
          localStorage.setItem('token', data.token)
        }

        // 如果返回了用户信息，可以存储到localStorage
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }

        // 跳转到功能页面
        router.push('/features')
      } else {
        successMessage.value = `注册成功：${form.value.username}`
        // 如果返回了token，可以存储到localStorage
        if (data.token) {
          localStorage.setItem('token', data.token)
        }

        // 如果返回了用户信息，可以存储到localStorage
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        // 注册成功后自动跳转到功能页面
        setTimeout(() => {
          router.push('/features')
        }, 2000)
      }
    } else {
      errorMessage.value = data.message || (isLogin.value ? '登录失败，请检查手机号和密码' : '注册失败')
    }

  } catch (error) {
    console.error('请求失败:', error)
    errorMessage.value = '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="bg">
      <!-- 清新渐变背景 -->
      <div class="bg-layer fresh-gradient"></div>
      <div class="bg-layer cloud-overlay"></div>

      <!-- 自然光线效果 -->
      <div class="light-rays">
        <div class="ray ray-1"></div>
        <div class="ray ray-2"></div>
        <div class="ray ray-3"></div>
      </div>

      <!-- 简约几何元素 -->
      <div class="minimal-geometry">
        <div class="circle c1"></div>
        <div class="circle c2"></div>
        <div class="circle c3"></div>
        <div class="line l1"></div>
        <div class="line l2"></div>
      </div>

      <!-- 清新光晕 -->
      <div class="fresh-glow g1"></div>
      <div class="fresh-glow g2"></div>
      <div class="fresh-glow g3"></div>
    </div>

    <main class="container">
      <section class="panel">
        <div class="brand">
          <div class="logo">
            <span class="logo-text">LST</span>
          </div>
          <div class="meta">
            <h1>{{ isLogin ? '欢迎登录' : '欢迎注册' }}</h1>
            <p>{{ isLogin ? '使用你的账户开始高效的一天' : '创建账户以开始使用我们的服务' }}</p>
          </div>
        </div>

        <form class="form" @submit="onSubmit">
          <!-- 错误消息 -->
          <div class="message error" v-if="errorMessage">
            {{ errorMessage }}
          </div>

          <!-- 成功消息 -->
          <div class="message success" v-if="successMessage">
            {{ successMessage }}
          </div>

          <!-- 注册时需要用户名字段 -->
          <label class="field" v-if="!isLogin">
            <span>用户名</span>
            <input
                v-model.trim="form.username"
                type="text"
                placeholder="请输入用户名（3-20个字符）"
                @blur="touched.username = true"
                @input="clearMessages"
                :aria-invalid="!!usernameError"
            />
            <div class="error" v-if="usernameError">{{ usernameError }}</div>
          </label>

          <label class="field">
            <span>手机号</span>
            <input
                v-model.trim="form.phoneNumber"
                type="tel"
                placeholder="请输入11位手机号"
                @blur="touched.phoneNumber = true"
                @input="clearMessages"
                :aria-invalid="!!phoneNumberError"
            />
            <div class="error" v-if="phoneNumberError">{{ phoneNumberError }}</div>
          </label>

          <label class="field">
            <span>密码</span>
            <input
                v-model="form.password"
                type="password"
                :placeholder="isLogin ? '至少 6 位' : '至少 8 位，需包含大小写字母和数字'"
                @blur="touched.password = true"
                @input="clearMessages"
                :aria-invalid="!!passwordError"
            />
            <div class="error" v-if="passwordError">{{ passwordError }}</div>
          </label>

          <!-- 注册时需要确认密码 -->
          <label class="field" v-if="!isLogin">
            <span>确认密码</span>
            <input
                v-model="form.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                @blur="touched.confirmPassword = true"
                @input="clearMessages"
                :aria-invalid="!!confirmPasswordError"
            />
            <div class="error" v-if="confirmPasswordError">{{ confirmPasswordError }}</div>
          </label>

          <div class="row" v-if="isLogin">
            <label class="checkbox">
              <input type="checkbox" v-model="form.remember" /> 记住我
            </label>
            <a class="link" href="javascript:void(0)">忘记密码？</a>
          </div>

          <button class="btn primary lg submit" :disabled="!canSubmit">
            {{ loading ? (isLogin ? '正在登录…' : '正在注册…') : (isLogin ? '登录' : '注册') }}
          </button>

          <div class="divider"><span>或</span></div>

          <div class="social">
            <button type="button" class="btn ghost">
              <span class="ico">📧</span> {{ isLogin ? '使用邮箱魔法链接' : '使用邮箱注册' }}
            </button>
            <button type="button" class="btn ghost">
              <span class="ico">🔐</span> 企业 SSO
            </button>
          </div>
        </form>

        <p class="hint">
          {{ isLogin ? '还没有账号？' : '已有账号？' }}
          <a class="link" href="javascript:void(0)" @click="toggleForm">
            {{ isLogin ? '免费注册' : '立即登录' }}
          </a>
        </p>
      </section>

      <aside class="showcase">
        <div class="copy">
          <h2>更专注，更美观</h2>
          <p>精致的层次、柔和的霓虹、高对比排版，助你提升首屏体验。</p>
        </div>
        <div class="preview">
          <div class="card c1"></div>
          <div class="card c2"></div>
          <div class="card c3"></div>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.login-page {
  width: 100%;
  min-height: 100vh;
  position: relative;
  color: var(--text-strong);
  overflow-x: hidden;
  overflow-y: auto;
}

.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.bg-layer.fresh-gradient {
  position: absolute;
  inset: 0;
  background:
      radial-gradient(ellipse at top left, rgba(147, 197, 253, 0.15) 0%, transparent 70%),
      radial-gradient(ellipse at top right, rgba(134, 239, 172, 0.12) 0%, transparent 70%),
      radial-gradient(ellipse at bottom left, rgba(165, 243, 252, 0.08) 0%, transparent 70%),
      radial-gradient(ellipse at bottom right, rgba(254, 202, 202, 0.06) 0%, transparent 70%),
      linear-gradient(135deg,
      rgba(240, 249, 255, 0.8) 0%,
      rgba(248, 250, 252, 0.9) 25%,
      rgba(241, 245, 249, 0.85) 50%,
      rgba(248, 250, 252, 0.9) 75%,
      rgba(240, 249, 255, 0.8) 100%);
  animation: gentleBreath 25s ease-in-out infinite;
}

.bg-layer.cloud-overlay {
  position: absolute;
  inset: 0;
  background-image:
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 60%),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 60% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 40%);
  opacity: 0.8;
  animation: cloudDrift 30s ease-in-out infinite;
}

/* 自然光线效果 */
.light-rays {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ray {
  position: absolute;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: rayShine 20s ease-in-out infinite;
}

.ray.ray-1 {
  top: 10%;
  left: 20%;
  width: 200px;
  height: 2px;
  transform: rotate(15deg);
  animation-delay: 0s;
}

.ray.ray-2 {
  top: 30%;
  right: 15%;
  width: 150px;
  height: 1px;
  transform: rotate(-25deg);
  animation-delay: -7s;
}

.ray.ray-3 {
  bottom: 25%;
  left: 10%;
  width: 180px;
  height: 1.5px;
  transform: rotate(35deg);
  animation-delay: -14s;
}

/* 简约几何元素 */
.minimal-geometry {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: floatLight 15s ease-in-out infinite;
}

.circle.c1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.circle.c2 {
  width: 60px;
  height: 60px;
  top: 60%;
  right: 20%;
  animation-delay: -5s;
}

.circle.c3 {
  width: 100px;
  height: 100px;
  bottom: 30%;
  left: 5%;
  animation-delay: -10s;
}

.line {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  height: 1px;
  animation: lineGlow 12s ease-in-out infinite;
}

.line.l1 {
  top: 40%;
  left: 10%;
  width: 120px;
  transform: rotate(20deg);
  animation-delay: 0s;
}

.line.l2 {
  bottom: 40%;
  right: 10%;
  width: 100px;
  transform: rotate(-30deg);
  animation-delay: -6s;
}


/* 清新光晕 */
.fresh-glow {
  position: absolute;
  filter: blur(100px);
  opacity: 0.4;
  animation: freshPulse 18s ease-in-out infinite;
}

.fresh-glow.g1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(147, 197, 253, 0.2), transparent 70%);
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.fresh-glow.g2 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(134, 239, 172, 0.15), transparent 70%);
  bottom: -120px;
  right: -120px;
  animation-delay: -6s;
}

.fresh-glow.g3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(165, 243, 252, 0.1), transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -12s;
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
      linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 80px 80px, 80px 80px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0.9), transparent 90%);
  opacity: 0.2;
}



@keyframes gentleBreath {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.005);
  }
}

@keyframes cloudDrift {
  0%, 100% {
    transform: translateX(0px) translateY(0px);
    opacity: 0.8;
  }
  50% {
    transform: translateX(10px) translateY(-5px);
    opacity: 0.9;
  }
}

@keyframes rayShine {
  0%, 100% {
    opacity: 0.2;
    transform: scaleX(0.8);
  }
  50% {
    opacity: 0.6;
    transform: scaleX(1.2);
  }
}

@keyframes floatLight {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.1;
  }
  50% {
    transform: translateY(-15px) scale(1.1);
    opacity: 0.3;
  }
}

@keyframes lineGlow {
  0%, 100% {
    opacity: 0.2;
    transform: scaleX(0.5);
  }
  50% {
    opacity: 0.6;
    transform: scaleX(1.2);
  }
}


@keyframes freshPulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.container {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 16px;
  max-width: 1080px;
  margin: 0 auto;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

.panel {
  border: 1px solid var(--divider);
  background: var(--surface);
  border-radius: 18px;
  padding: 20px;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 8px;
}
.logo {
  width: 80px;
  height: 80px;
  display: grid;
  place-items: center;
  border-radius: 20px;
  background: linear-gradient(135deg, #8ea2ff, #9e6bff, #ff6b9d);
  color: #fff;
  font-weight: 700;
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 8px 32px rgba(142, 162, 255, 0.3),
  0 4px 16px rgba(158, 107, 255, 0.2),
  inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.logo:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 12px 40px rgba(142, 162, 255, 0.4),
  0 6px 20px rgba(158, 107, 255, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
.logo-text {
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  position: relative;
  z-index: 1;
}
.logo::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.3), transparent 60%);
  border-radius: 20px;
}
.brand h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--text-strong), #8ea2ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.brand p {
  margin: 8px 0 0;
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1.4;
}

.form { display: grid; gap: 12px; margin-top: 14px; }
.field { display: grid; gap: 8px; }
.field span { font-size: 0.95rem; color: var(--text-muted); }
.field input { height: 44px; border-radius: 12px; border: 1px solid var(--divider); background: var(--surface); padding: 0 14px; color: inherit; transition: border-color 0.2s, background-color 0.2s; }
.field input:focus { outline: none; border-color: var(--primary); background: var(--primary-soft); }
.error { color: #e5484d; font-size: 12px; }

.message {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
}

.message.error {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.message.success {
  background-color: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.row { display: grid; grid-auto-flow: column; justify-content: space-between; align-items: center; }
.checkbox { color: var(--text-muted); }
.link { color: var(--primary); text-decoration: none; }
.link:hover { text-decoration: underline; }

.btn { height: 36px; padding: 0 14px; border-radius: 10px; border: 1px solid transparent; background: transparent; color: var(--text-strong); cursor: pointer; transition: transform 0.02s, background-color 0.2s, border-color 0.2s, opacity 0.2s; }
.btn.lg { height: 44px; border-radius: 12px; font-weight: 600; }
.btn.primary { background: var(--primary); color: #fff; border-color: var(--primary); }
.btn.primary:hover { filter: brightness(1.05); }
.btn.ghost { border-color: var(--divider); background: var(--surface); }
.btn.ghost:hover { border-color: var(--text-muted); }
.submit { width: 100%; }

.divider { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px; color: var(--text-muted); margin: 6px 0; }
.divider::before, .divider::after { content: ""; height: 1px; background: var(--divider); }

.social { display: grid; gap: 10px; grid-template-columns: 1fr; }
.social .ico { margin-right: 6px; }

.hint { margin: 10px 0 0; color: var(--text-muted); }

.showcase { display: grid; gap: 12px; }
.copy h2 { margin: 0; font-size: 20px; }
.copy p { margin: 6px 0 0; color: var(--text-muted); }
.preview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.card { height: 90px; border-radius: 12px; border: 1px solid var(--divider); background: linear-gradient(135deg, rgba(100,108,255,0.18), rgba(255,177,234,0.18)); }

/* 移动端背景优化 */
@media (max-width: 768px) {
  .login-page {
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .container {
    padding: 20px 16px;
    gap: 16px;
    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .panel {
    padding: 20px;
    margin: 0;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .fresh-glow.g1 {
    width: 300px;
    height: 300px;
    top: -80px;
    left: -80px;
  }
  .fresh-glow.g2 {
    width: 250px;
    height: 250px;
    bottom: -60px;
    right: -60px;
  }
  .fresh-glow.g3 {
    width: 200px;
    height: 200px;
  }
  .grid {
    background-size: 50px 50px, 50px 50px;
    mask-image: radial-gradient(ellipse 90% 70% at 50% 50%, rgba(0,0,0,0.98), transparent 95%);
  }

  /* 移动端几何元素优化 */
  .circle.c1 { width: 50px; height: 50px; }
  .circle.c2 { width: 40px; height: 40px; }
  .circle.c3 { width: 60px; height: 60px; }

  .line.l1 { width: 60px; }
  .line.l2 { width: 50px; }


  /* 移动端光线优化 */
  .ray.ray-1 { width: 80px; height: 1px; }
  .ray.ray-2 { width: 70px; height: 0.5px; }
  .ray.ray-3 { width: 75px; height: 1px; }

  /* 移动端隐藏showcase */
  .showcase {
    display: none;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .container {
    padding: 16px 12px;
    gap: 12px;
  }

  .panel {
    padding: 16px;
    border-radius: 12px;
    max-width: 360px;
  }

  .brand h1 {
    font-size: 24px;
    margin: 0;
  }

  .brand p {
    font-size: 14px;
    margin: 8px 0 0;
  }

  .logo {
    width: 60px;
    height: 60px;
    margin-bottom: 12px;
  }

  .logo-text {
    font-size: 20px;
  }

  .form {
    gap: 8px;
    margin-top: 12px;
  }

  .field input {
    height: 40px;
    font-size: 16px;
  }

  .btn.lg {
    height: 40px;
    font-size: 16px;
  }
}

/* 平板端优化 */
@media (min-width: 769px) and (max-width: 1024px) {
  .container {
    padding: 24px 20px;
    gap: 20px;
    max-width: 600px;
  }

  .panel {
    padding: 24px;
    max-width: 500px;
  }
}

@media (min-width: 900px) {
  .container { grid-template-columns: 520px 1fr; align-items: center; gap: 20px; padding: 40px 20px; }
  .panel { padding: 24px; }
  .logo {
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
  }
  .logo-text {
    font-size: 28px;
  }
  .brand h1 { font-size: 32px; }
  .brand p { font-size: 18px; }
  .copy h2 { font-size: 24px; }
  .card { height: 120px; }

  /* 桌面端增强背景效果 */
  .bg::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
        radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.04) 0%, transparent 50%);
    animation: backgroundShift 15s ease-in-out infinite;
  }
}

@keyframes backgroundShift {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 主题变量与暗色模式（复用全局变量名称以适配） */
:host, :root, .login-page {
  --primary: #646cff;
  --primary-soft: rgba(100,108,255,0.08);
  --text-strong: #1f2330;
  --text-muted: rgba(0,0,0,0.55);
  --surface: #ffffff;
  --divider: rgba(0,0,0,0.10);
  --grid-color: rgba(0,0,0,0.06);
}

@media (prefers-color-scheme: dark) {
  :host, :root, .login-page {
    --text-strong: #f5f7ff;
    --text-muted: rgba(255,255,255,0.72);
    --surface: #161616;
    --divider: rgba(255,255,255,0.12);
    --grid-color: rgba(255,255,255,0.06);
  }
}
</style>