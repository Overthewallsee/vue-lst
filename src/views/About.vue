<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-center text-gray-800 mb-12">关于我们</h1>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-800">我们的使命</h2>
            <p class="text-gray-600 leading-relaxed">
              我们致力于创建现代化的 Web 应用程序，使用最新的技术栈为用户提供卓越的数字体验。
              通过 Vue.js 生态系统，我们构建快速、可维护且用户友好的应用程序。
            </p>
            <p class="text-gray-600 leading-relaxed">
              这个项目展示了如何使用 Vue 3、TypeScript 和 Vue Router 创建一个功能完整的单页应用程序，
              包含现代化的设计原则和最佳实践。
            </p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-lg">
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