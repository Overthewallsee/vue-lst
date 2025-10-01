<template>
  <div class="about-page">
    <div class="max-w-6xl mx-auto px-4 py-12">
      <!-- 页面标题 -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">关于我们</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          了解我们的团队、使命和愿景，探索我们如何通过技术创新为用户创造价值。
        </p>
      </div>

      <!-- 团队介绍 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div class="space-y-6">
          <h2 class="text-2xl font-semibold text-gray-800">我们的故事</h2>
          <p class="text-gray-600 leading-relaxed">
            我们是一支充满激情和创造力的团队，致力于通过技术创新解决现实世界的问题。
            自成立以来，我们始终坚持以用户为中心的设计理念，不断追求卓越的产品体验。
          </p>
          <p class="text-gray-600 leading-relaxed">
            我们的团队由经验丰富的开发者、设计师和产品经理组成，每个人都对技术充满热情，
            并且致力于打造能够真正改善人们生活的优秀产品。
          </p>
          <div class="about-card">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">技术栈</h3>
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <span class="w-3 h-3 bg-green-500 rounded-full"></span>
                <span class="text-gray-700">Vue.js 3 (Composition API)</span>
              </div>
              <div class="flex items-center space-x-3">
                <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span class="text-gray-700">TypeScript</span>
              </div>
              <div class="flex items-center space-x-3">
                <span class="w-3 h-3 bg-purple-500 rounded-full"></span>
                <span class="text-gray-700">Vue Router 4</span>
              </div>
              <div class="flex items-center space-x-3">
                <span class="w-3 h-3 bg-orange-500 rounded-full"></span>
                <span class="text-gray-700">Vite</span>
              </div>
              <div class="flex items-center space-x-3">
                <span class="w-3 h-3 bg-teal-500 rounded-full"></span>
                <span class="text-gray-700">Tailwind CSS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  padding: 2rem 1rem;
}

.about-card {
  background-color: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>