<template>
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div style="display: flex; justify-content: space-between; align-items: center; height: 4rem;">
        <!-- 左上角 Logo -->
        <div style="flex-shrink: 0; display: flex; align-items: center;">
          <div class="logo-container">
            <div class="logo">
              <span class="logo-text">LST</span>
            </div>
          </div>
        </div>
        
        <!-- 右上角 用户名和退出按钮 -->
        <div style="display: flex; align-items: center; gap: 1rem; margin-left: auto;">
          <div class="username-display">
            {{ currentUser }}
          </div>
          <button 
            @click="logout"
            class="logout-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 模拟当前用户，实际项目中应该从 store 或 API 获取
const currentUser = ref('用户123')

const router = useRouter()

// 退出登录功能
const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    // 清除用户认证信息（示例）
    // localStorage.removeItem('token')
    // 跳转到登录页
    router.push('/login')
  }
}
</script>

<style scoped>
.logo-container {
  margin: 12px 0 12px 12px;
}

.logo {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #8ea2ff, #9e6bff, #ff6b9d);
  color: #fff;
  font-weight: 700;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(142, 162, 255, 0.3),
              0 2px 8px rgba(158, 107, 255, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.logo:hover {
  transform: translateY(-1px) scale(1.05);
  box-shadow: 0 6px 20px rgba(142, 162, 255, 0.4),
              0 3px 10px rgba(158, 107, 255, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.logo-text {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
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
  border-radius: 10px;
}

/* 美化用户名显示 */
.username-display {
  display: none;
}

@media (min-width: 768px) {
  .username-display {
    display: block;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    color: white;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .username-display::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .username-display:hover::before {
    opacity: 1;
  }
}

/* 美化退出按钮 */
.logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  color: #4b5563;
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  margin-right: 12px; /* 添加右边距 */
}

.logout-button:hover {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.logout-button:hover svg {
  transform: translateX(-3px);
}

.logout-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.logout-button:hover::before {
  opacity: 1;
}
</style>