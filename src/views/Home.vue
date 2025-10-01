<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-gray-800 mb-6 animate-fade-in">
          欢迎来到 Vue Router 应用
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          这是一个展示 Vue 3 + Vue Router 功能的现代化单页应用程序，
          具有响应式设计和流畅的用户体验。
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div class="feature-card">
          <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl mb-4">
            🚀
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">现代化路由</h3>
          <p class="text-gray-600">
            使用 Vue Router 4 实现客户端路由，支持动态路由和嵌套路由功能。
          </p>
        </div>

        <div class="feature-card">
          <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl mb-4">
            📱
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">响应式设计</h3>
          <p class="text-gray-600">
            完全响应式的设计，在桌面、平板和移动设备上都有出色的用户体验。
          </p>
        </div>

        <div class="feature-card">
          <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl mb-4">
            ⚡
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">高性能</h3>
          <p class="text-gray-600">
            基于 Vite 构建，提供快速的开发体验和优化的生产构建。
          </p>
        </div>
      </div>

      <div class="text-center mt-16">
        <router-link
          to="/projects"
          class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          查看项目展示
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feature-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  transform: translateY(0);
}

.feature-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-0.25rem);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}
</style>