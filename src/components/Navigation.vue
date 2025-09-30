<template>
  <nav class="bg-white shadow-lg sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link
          to="/"
          class="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
        >
          Vue Router App
        </router-link>

        <!-- 桌面端导航 -->
        <div class="hidden md:flex space-x-8">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ 'active': isActive(item.path) }"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- 移动端菜单按钮 -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded-lg"
        >
          <div class="w-6 h-6 flex flex-col justify-center items-center">
            <span
              class="bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm"
              :class="{ 'rotate-45 translate-y-1': isMobileMenuOpen, 'mb-1': !isMobileMenuOpen }"
            ></span>
            <span
              class="bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm"
              :class="{ 'opacity-0': isMobileMenuOpen, 'mb-1': !isMobileMenuOpen }"
            ></span>
            <span
              class="bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm"
              :class="{ '-rotate-45 -translate-y-1': isMobileMenuOpen }"
            ></span>
          </div>
        </button>
      </div>

      <!-- 移动端导航菜单 -->
      <div
        class="md:hidden transition-all duration-300 ease-in-out overflow-hidden"
        :class="{ 'max-h-64 opacity-100': isMobileMenuOpen, 'max-h-0 opacity-0': !isMobileMenuOpen }"
      >
        <div class="py-4 space-y-2">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            @click="closeMobileMenu"
            class="mobile-nav-link"
            :class="{ 'active-mobile': isActive(item.path) }"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

interface NavigationItem {
  name: string
  path: string
}

const route = useRoute()
const isMobileMenuOpen = ref(false)

const navigationItems: NavigationItem[] = [
  { name: '首页', path: '/' },
  { name: '功能中心', path: '/features' },
  { name: '关于', path: '/about' },
  { name: '项目', path: '/projects' },
  { name: '联系', path: '/contact' }
]

const isActive = (path: string): boolean => {
  if (path === '/') {
    return route.path === path
  }
  return route.path.startsWith(path)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// 点击外部关闭菜单
const handleClickOutside = (event: Event) => {
  const nav = document.querySelector('nav')
  if (nav && !nav.contains(event.target as Node)) {
    isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.nav-link {
  @apply text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 pb-1 border-b-2 border-transparent hover:border-blue-600;
}

.nav-link.active {
  @apply text-blue-600 border-blue-600;
}

.mobile-nav-link {
  @apply block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-200;
}

.mobile-nav-link.active-mobile {
  @apply text-blue-600 bg-blue-50;
}
</style>