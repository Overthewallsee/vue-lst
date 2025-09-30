<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <div class="container mx-auto px-4 py-16">
      <!-- 页面标题 -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">功能中心</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          探索我们提供的各种功能和服务，点击任意功能块开始体验
        </p>
      </div>

      <!-- 功能网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <div
          v-for="feature in features"
          :key="feature.id"
          class="feature-card group cursor-pointer"
          @click="handleFeatureClick(feature)"
        >
          <!-- 图标区域 -->
          <div class="feature-icon" :style="{ background: feature.gradient }">
            <span class="text-3xl">{{ feature.icon }}</span>
          </div>
          
          <!-- 内容区域 -->
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ feature.description }}
            </p>
            
            <!-- 状态标签 -->
            <div class="flex items-center justify-between">
              <span 
                class="px-2 py-1 text-xs rounded-full font-medium"
                :class="getStatusClass(feature.status)"
              >
                {{ feature.status }}
              </span>
              <div class="text-gray-400 group-hover:text-blue-500 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- 悬停效果 -->
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600 mb-2">{{ stats.totalFeatures }}</div>
          <div class="text-gray-600">总功能数</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-green-600 mb-2">{{ stats.activeFeatures }}</div>
          <div class="text-gray-600">可用功能</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-purple-600 mb-2">{{ stats.comingSoon }}</div>
          <div class="text-gray-600">即将推出</div>
        </div>
      </div>
    </div>

    <!-- 功能详情模态框 -->
    <div
      v-if="selectedFeature"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-2xl p-8 max-w-md w-full transform transition-all"
        @click.stop
      >
        <div class="text-center mb-6">
          <div 
            class="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl"
            :style="{ background: selectedFeature.gradient }"
          >
            {{ selectedFeature.icon }}
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ selectedFeature.title }}</h3>
          <p class="text-gray-600">{{ selectedFeature.description }}</p>
        </div>
        
        <div class="space-y-4 mb-6">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">状态:</span>
            <span 
              class="px-3 py-1 text-sm rounded-full font-medium"
              :class="getStatusClass(selectedFeature.status)"
            >
              {{ selectedFeature.status }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">分类:</span>
            <span class="text-gray-800 font-medium">{{ selectedFeature.category }}</span>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button
            v-if="selectedFeature.status === '可用'"
            class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            @click="launchFeature(selectedFeature)"
          >
            立即体验
          </button>
          <button
            class="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            @click="closeModal"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Feature {
  id: number
  title: string
  description: string
  icon: string
  gradient: string
  status: '可用' | '开发中' | '即将推出'
  category: string
  route?: string
}

const router = useRouter()
const selectedFeature = ref<Feature | null>(null)

const features: Feature[] = [
  {
    id: 1,
    title: '聊天室',
    description: '实时多人在线聊天，支持文字、表情等多种消息类型',
    icon: '💬',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    status: '开发中',
    category: '通讯工具',
    route: '/chat'
  },
  {
    id: 2,
    title: '文件管理',
    description: '云端文件存储与管理，支持多格式文件上传下载',
    icon: '📁',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    status: '即将推出',
    category: '工具'
  },
  {
    id: 3,
    title: '任务看板',
    description: '项目任务管理，支持看板视图和团队协作',
    icon: '📋',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    status: '可用',
    category: '效率工具',
    route: '/tasks'
  },
  {
    id: 4,
    title: '数据分析',
    description: '可视化数据分析面板，支持多种图表类型',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    status: '可用',
    category: '数据工具',
    route: '/analytics'
  },
  {
    id: 5,
    title: '在线编辑器',
    description: '支持多种编程语言的在线代码编辑器',
    icon: '💻',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    status: '开发中',
    category: '开发工具'
  },
  {
    id: 6,
    title: '视频会议',
    description: '高清视频通话，支持屏幕共享和录制功能',
    icon: '📹',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    status: '即将推出',
    category: '通讯工具'
  },
  {
    id: 7,
    title: '日历安排',
    description: '智能日程管理，支持提醒和团队日历共享',
    icon: '📅',
    gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    status: '可用',
    category: '效率工具',
    route: '/calendar'
  },
  {
    id: 8,
    title: '笔记本',
    description: '富文本笔记编辑，支持markdown和多媒体内容',
    icon: '📝',
    gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    status: '可用',
    category: '工具',
    route: '/notes'
  },
  {
    id: 9,
    title: '图片编辑',
    description: '在线图片编辑工具，支持滤镜、裁剪等功能',
    icon: '🎨',
    gradient: 'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)',
    status: '开发中',
    category: '创意工具'
  },
  {
    id: 10,
    title: '音乐播放器',
    description: '在线音乐播放，支持播放列表和歌词显示',
    icon: '🎵',
    gradient: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
    status: '即将推出',
    category: '娱乐'
  },
  {
    id: 11,
    title: '天气预报',
    description: '实时天气信息和未来一周天气预报',
    icon: '🌤️',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    status: '可用',
    category: '生活服务',
    route: '/weather'
  },
  {
    id: 12,
    title: '计算器',
    description: '科学计算器，支持基础运算和高级数学函数',
    icon: '🔢',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    status: '可用',
    category: '工具',
    route: '/calculator'
  }
]

const stats = computed(() => ({
  totalFeatures: features.length,
  activeFeatures: features.filter(f => f.status === '可用').length,
  comingSoon: features.filter(f => f.status === '即将推出').length
}))

const getStatusClass = (status: string) => {
  switch (status) {
    case '可用':
      return 'bg-green-100 text-green-700'
    case '开发中':
      return 'bg-yellow-100 text-yellow-700'
    case '即将推出':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const handleFeatureClick = (feature: Feature) => {
  selectedFeature.value = feature
}

const closeModal = () => {
  selectedFeature.value = null
}

const launchFeature = (feature: Feature) => {
  if (feature.route) {
    router.push(feature.route)
  } else {
    // 如果没有路由，显示提示
    alert(`${feature.title} 功能即将推出，敬请期待！`)
  }
  closeModal()
}
</script>

<style scoped>
.feature-card {
  @apply relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden;
}

.feature-icon {
  @apply w-full h-32 flex items-center justify-center text-white;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 响应式优化 */
@media (max-width: 640px) {
  .feature-card {
    @apply hover:transform-none hover:translate-y-0;
  }
}
</style>