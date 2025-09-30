<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
    <div class="container mx-auto px-4 py-16">
      <!-- 页面标题 -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">功能中心</h1>
      </div>

      <!-- 功能分类标签 -->
      <div class="flex flex-wrap justify-center gap-3 mb-12">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          class="px-6 py-2 rounded-full font-medium transition-all duration-300"
          :class="selectedCategory === category 
            ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
            : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-md'"
        >
          {{ category }}
        </button>
      </div>

      <!-- 功能卡片网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div
          v-for="feature in filteredFeatures"
          :key="feature.id"
          class="feature-card group cursor-pointer"
          @click="handleFeatureClick(feature)"
        >
          <!-- 卡片头部 -->
          <div class="card-header" :style="{ background: feature.gradient }">
            <div class="icon-container">
              <span class="feature-icon">{{ feature.icon }}</span>
            </div>
            <div class="status-badge" :class="getStatusBadgeClass(feature.status)">
              {{ feature.status }}
            </div>
          </div>
          
          <!-- 卡片内容 -->
          <div class="card-content">
            <h3 class="feature-title">
              {{ feature.title }}
            </h3>
            <p class="feature-description">
              {{ feature.description }}
            </p>
            
            <!-- 技术标签 -->
            <div class="tech-tags" v-if="feature.tags">
              <span 
                v-for="tag in feature.tags" 
                :key="tag"
                class="tech-tag"
              >
                {{ tag }}
              </span>
            </div>
            
            <!-- 卡片底部 -->
            <div class="card-footer">
              <span class="category-label">{{ feature.category }}</span>
              <div class="arrow-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- 悬停遮罩 -->
          <div class="hover-overlay"></div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        <div class="stat-card">
          <div class="stat-icon">🚀</div>
          <div class="stat-number">{{ stats.totalFeatures }}</div>
          <div class="stat-label">总功能数</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-number">{{ stats.activeFeatures }}</div>
          <div class="stat-label">可用功能</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔧</div>
          <div class="stat-number">{{ stats.developingFeatures }}</div>
          <div class="stat-label">开发中</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-number">{{ stats.comingSoon }}</div>
          <div class="stat-label">即将推出</div>
        </div>
      </div>
    </div>

    <!-- 功能详情模态框 -->
    <div
      v-if="selectedFeature"
      class="modal-overlay"
      @click="closeModal"
    >
      <div class="modal-content" @click.stop>
        <!-- 模态框头部 -->
        <div class="modal-header">
          <div 
            class="modal-icon"
            :style="{ background: selectedFeature.gradient }"
          >
            {{ selectedFeature.icon }}
          </div>
          <h3 class="modal-title">{{ selectedFeature.title }}</h3>
          <p class="modal-subtitle">{{ selectedFeature.description }}</p>
        </div>
        
        <!-- 模态框内容 -->
        <div class="modal-body">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">状态</span>
              <span class="info-value" :class="getStatusClass(selectedFeature.status)">
                {{ selectedFeature.status }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">分类</span>
              <span class="info-value">{{ selectedFeature.category }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">更新时间</span>
              <span class="info-value">{{ selectedFeature.updateTime }}</span>
            </div>
          </div>
          
          <!-- 功能特性 -->
          <div class="features-list" v-if="selectedFeature.features">
            <h4 class="features-title">主要特性</h4>
            <ul class="features-items">
              <li v-for="item in selectedFeature.features" :key="item" class="feature-item">
                <span class="feature-dot"></span>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
        
        <!-- 模态框底部 -->
        <div class="modal-footer">
          <button
            v-if="selectedFeature.status === '可用'"
            class="btn-primary"
            @click="launchFeature(selectedFeature)"
          >
            <span>立即体验</span>
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </button>
          <button class="btn-secondary" @click="closeModal">
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
  tags?: string[]
  features?: string[]
  updateTime: string
  route?: string
}

const router = useRouter()
const selectedFeature = ref<Feature | null>(null)
const selectedCategory = ref('全部')

const features: Feature[] = [
  {
    id: 1,
    title: '聊天室',
    description: '实时多人在线聊天，支持文字、表情、文件分享等多种消息类型',
    icon: '💬',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    status: '可用',
    category: '通讯工具',
    tags: ['实时通讯', 'WebSocket'],
    features: ['实时消息', '多人聊天', '表情支持', '文件分享', '消息历史'],
    updateTime: '2024-01-15',
    route: '/chat'
  },
  {
    id: 2,
    title: '文件管理',
    description: '云端文件存储与管理，支持多格式文件上传下载和在线预览',
    icon: '📁',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    status: '开发中',
    category: '工具',
    tags: ['云存储', '文件管理'],
    features: ['文件上传', '在线预览', '文件夹管理', '权限控制', '版本管理'],
    updateTime: '2024-01-10'
  },
  {
    id: 3,
    title: '任务看板',
    description: '敏捷项目管理工具，支持看板视图、甘特图和团队协作功能',
    icon: '📋',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    status: '可用',
    category: '效率工具',
    tags: ['项目管理', '团队协作'],
    features: ['看板视图', '任务分配', '进度跟踪', '团队协作', '报告生成'],
    updateTime: '2024-01-12',
    route: '/tasks'
  },
  {
    id: 4,
    title: '数据分析',
    description: '可视化数据分析面板，支持多种图表类型和实时数据展示',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    status: '可用',
    category: '数据工具',
    tags: ['数据可视化', '图表'],
    features: ['多种图表', '实时数据', '自定义面板', '数据导出', 'API集成'],
    updateTime: '2024-01-08',
    route: '/analytics'
  },
  {
    id: 5,
    title: '在线编辑器',
    description: '支持多种编程语言的在线代码编辑器，具有语法高亮和智能提示',
    icon: '💻',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    status: '开发中',
    category: '开发工具',
    tags: ['代码编辑', '语法高亮'],
    features: ['多语言支持', '语法高亮', '智能提示', '代码格式化', '主题切换'],
    updateTime: '2024-01-05'
  },
  {
    id: 6,
    title: '视频会议',
    description: '高清视频通话系统，支持屏幕共享、录制和多人会议功能',
    icon: '📹',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    status: '即将推出',
    category: '通讯工具',
    tags: ['视频通话', 'WebRTC'],
    features: ['高清视频', '屏幕共享', '会议录制', '多人会议', '聊天功能'],
    updateTime: '2024-01-03'
  },
  {
    id: 7,
    title: '日历安排',
    description: '智能日程管理系统，支持提醒、重复事件和团队日历共享',
    icon: '📅',
    gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    status: '可用',
    category: '效率工具',
    tags: ['日程管理', '提醒'],
    features: ['事件管理', '智能提醒', '重复事件', '团队共享', '日历同步'],
    updateTime: '2024-01-14',
    route: '/calendar'
  },
  {
    id: 8,
    title: '笔记本',
    description: '富文本笔记编辑器，支持markdown、多媒体内容和云端同步',
    icon: '📝',
    gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    status: '可用',
    category: '工具',
    tags: ['笔记', 'Markdown'],
    features: ['富文本编辑', 'Markdown支持', '多媒体插入', '云端同步', '标签分类'],
    updateTime: '2024-01-11',
    route: '/notes'
  },
  {
    id: 9,
    title: '图片编辑',
    description: '在线图片编辑工具，支持滤镜、裁剪、调色等专业编辑功能',
    icon: '🎨',
    gradient: 'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)',
    status: '开发中',
    category: '创意工具',
    tags: ['图片编辑', '滤镜'],
    features: ['图片裁剪', '滤镜效果', '颜色调整', '图层管理', '批量处理'],
    updateTime: '2024-01-07'
  },
  {
    id: 10,
    title: '音乐播放器',
    description: '在线音乐播放器，支持播放列表、歌词显示和音质调节',
    icon: '🎵',
    gradient: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
    status: '即将推出',
    category: '娱乐',
    tags: ['音乐播放', '歌词'],
    features: ['音乐播放', '播放列表', '歌词显示', '音质调节', '收藏功能'],
    updateTime: '2024-01-02'
  },
  {
    id: 11,
    title: '天气预报',
    description: '实时天气信息服务，提供详细的天气数据和未来预报',
    icon: '🌤️',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    status: '可用',
    category: '生活服务',
    tags: ['天气', '预报'],
    features: ['实时天气', '未来预报', '天气地图', '生活指数', '预警提醒'],
    updateTime: '2024-01-13',
    route: '/weather'
  },
  {
    id: 12,
    title: '计算器',
    description: '科学计算器工具，支持基础运算和高级数学函数计算',
    icon: '🔢',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    status: '可用',
    category: '工具',
    tags: ['计算', '数学'],
    features: ['基础运算', '科学计算', '历史记录', '单位转换', '公式存储'],
    updateTime: '2024-01-09',
    route: '/calculator'
  }
]

const categories = computed(() => {
  const cats = ['全部', ...new Set(features.map(f => f.category))]
  return cats
})

const filteredFeatures = computed(() => {
  if (selectedCategory.value === '全部') {
    return features
  }
  return features.filter(f => f.category === selectedCategory.value)
})

const stats = computed(() => ({
  totalFeatures: features.length,
  activeFeatures: features.filter(f => f.status === '可用').length,
  developingFeatures: features.filter(f => f.status === '开发中').length,
  comingSoon: features.filter(f => f.status === '即将推出').length
}))

const getStatusClass = (status: string) => {
  switch (status) {
    case '可用':
      return 'text-green-600 font-semibold'
    case '开发中':
      return 'text-yellow-600 font-semibold'
    case '即将推出':
      return 'text-blue-600 font-semibold'
    default:
      return 'text-gray-600'
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case '可用':
      return 'status-available'
    case '开发中':
      return 'status-developing'
    case '即将推出':
      return 'status-coming'
    default:
      return 'status-default'
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
    alert(`${feature.title} 功能即将推出，敬请期待！`)
  }
  closeModal()
}
</script>

<style scoped>
/* 功能卡片样式 */
.feature-card {
  @apply relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden;
  min-height: 320px;
}

.card-header {
  @apply relative h-32 flex items-center justify-center;
  position: relative;
}

.icon-container {
  @apply relative z-10;
}

.feature-icon {
  @apply text-4xl;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.status-badge {
  @apply absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full;
}

.status-available {
  @apply bg-green-500 text-white;
}

.status-developing {
  @apply bg-yellow-500 text-white;
}

.status-coming {
  @apply bg-blue-500 text-white;
}

.status-default {
  @apply bg-gray-500 text-white;
}

.card-content {
  @apply p-6 flex flex-col h-full;
}

.feature-title {
  @apply text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors;
}

.feature-description {
  @apply text-gray-600 text-sm leading-relaxed mb-4 flex-grow;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tech-tags {
  @apply flex flex-wrap gap-2 mb-4;
}

.tech-tag {
  @apply px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium;
}

.card-footer {
  @apply flex items-center justify-between mt-auto;
}

.category-label {
  @apply text-sm text-gray-500 font-medium;
}

.arrow-icon {
  @apply text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300;
}

.hover-overlay {
  @apply absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300;
}

/* 统计卡片样式 */
.stat-card {
  @apply bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1;
}

.stat-icon {
  @apply text-3xl mb-3;
}

.stat-number {
  @apply text-3xl font-bold text-gray-800 mb-2;
}

.stat-label {
  @apply text-gray-600 font-medium;
}

/* 模态框样式 */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50;
  backdrop-filter: blur(4px);
}

.modal-content {
  @apply bg-white rounded-2xl max-w-lg w-full transform transition-all;
  animation: modalSlideIn 0.3s ease-out;
}

.modal-header {
  @apply text-center p-8 pb-4;
}

.modal-icon {
  @apply w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl;
}

.modal-title {
  @apply text-2xl font-bold text-gray-800 mb-2;
}

.modal-subtitle {
  @apply text-gray-600 leading-relaxed;
}

.modal-body {
  @apply px-8 pb-4;
}

.info-grid {
  @apply grid grid-cols-1 gap-4 mb-6;
}

.info-item {
  @apply flex justify-between items-center py-2 border-b border-gray-100;
}

.info-label {
  @apply text-gray-600 font-medium;
}

.info-value {
  @apply text-gray-800 font-semibold;
}

.features-list {
  @apply mt-6;
}

.features-title {
  @apply text-lg font-semibold text-gray-800 mb-3;
}

.features-items {
  @apply space-y-2;
}

.feature-item {
  @apply flex items-center text-gray-600;
}

.feature-dot {
  @apply w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0;
}

.modal-footer {
  @apply flex space-x-3 p-8 pt-4;
}

.btn-primary {
  @apply flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center;
}

.btn-secondary {
  @apply flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors;
}

/* 动画效果 */
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 响应式优化 */
@media (max-width: 640px) {
  .feature-card {
    @apply hover:transform-none hover:translate-y-0;
    min-height: 280px;
  }
  
  .card-header {
    @apply h-24;
  }
  
  .feature-icon {
    @apply text-3xl;
  }
  
  .card-content {
    @apply p-4;
  }
  
  .feature-title {
    @apply text-lg;
  }
  
  .modal-content {
    @apply mx-4;
  }
  
  .modal-header, .modal-body, .modal-footer {
    @apply px-6;
  }
}
</style>