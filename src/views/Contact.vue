<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">联系我们</h1>
          <p class="text-gray-600 max-w-2xl mx-auto">
            有任何问题或合作意向？我们很乐意听到您的声音。请通过以下方式与我们联系。
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- 联系表单 -->
          <div class="bg-white p-8 rounded-xl shadow-lg">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">发送消息</h2>
            <form @submit.prevent="submitForm" class="space-y-6">
              <div>
                <label class="block text-gray-700 font-medium mb-2">姓名</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="请输入您的姓名"
                >
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">邮箱</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="请输入您的邮箱地址"
                >
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">主题</label>
                <input
                  v-model="form.subject"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="请输入消息主题"
                >
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">消息内容</label>
                <textarea
                  v-model="form.message"
                  required
                  rows="5"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  placeholder="请输入您的消息内容..."
                ></textarea>
              </div>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ isSubmitting ? '发送中...' : '发送消息' }}
              </button>
            </form>
          </div>

          <!-- 联系信息 -->
          <div class="space-y-8">
            <div class="bg-white p-6 rounded-xl shadow-lg">
              <div class="flex items-center space-x-4 mb-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span class="text-blue-600 text-xl">📧</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">电子邮箱</h3>
                  <p class="text-gray-600">contact@example.com</p>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg">
              <div class="flex items-center space-x-4 mb-4">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span class="text-green-600 text-xl">📱</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">联系电话</h3>
                  <p class="text-gray-600">+86 138 0000 0000</p>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg">
              <div class="flex items-center space-x-4 mb-4">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span class="text-purple-600 text-xl">📍</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">办公地址</h3>
                  <p class="text-gray-600">北京市朝阳区某某街道123号</p>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg">
              <h3 class="font-semibold text-gray-800 mb-4">工作时间</h3>
              <div class="space-y-2 text-gray-600">
                <p>周一至周五: 9:00 - 18:00</p>
                <p>周六: 10:00 - 16:00</p>
                <p>周日: 休息</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 成功提示 -->
        <div
          v-if="showSuccess"
          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          @click="showSuccess = false"
        >
          <div class="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-4">
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-green-600 text-2xl">✅</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">消息发送成功！</h3>
              <p class="text-gray-600 mb-6">感谢您的联系，我们会尽快回复您的消息。</p>
              <button
                @click="showSuccess = false"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const showSuccess = ref(false)

const submitForm = async () => {
  isSubmitting.value = true

  // 模拟 API 调用
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 重置表单
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }

  isSubmitting.value = false
  showSuccess.value = true
}
</script>