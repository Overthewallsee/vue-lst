<template>
  <div class="features-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">探索我们的功能</h1>
        <p class="page-subtitle">Discover the powerful features that make our platform stand out</p>
      </div>
    </header>

    <!-- 分类筛选 -->
    <div class="category-filter">
      <div class="filter-container">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          class="filter-btn"
          :class="{ active: selectedCategory === category }"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- 功能网格 -->
    <section class="features-grid">
      <div 
        v-for="feature in filteredFeatures" 
        :key="feature.id"
        class="feature-card"
        @click="openModal(feature)"
      >
        <div class="card-gradient" :style="{ background: feature.gradient }"></div>
        <div class="card-content">
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
          <div class="feature-meta">
            <span class="feature-category">{{ feature.category }}</span>
            <span 
              class="feature-status" 
              :class="getStatusClass(feature.status)"
            >
              {{ feature.status }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 统计信息 -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-value">{{ stats.totalFeatures }}</div>
          <div class="stat-label">总功能数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.activeFeatures }}</div>
          <div class="stat-label">可用功能</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.developingFeatures }}</div>
          <div class="stat-label">开发中</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.comingSoon }}</div>
          <div class="stat-label">即将推出</div>
        </div>
      </div>
    </section>

    <!-- 功能详情模态框 -->
    <div v-if="selectedFeature" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="modal-header">
          <div class="modal-icon" :style="{ background: selectedFeature.gradient }">
            {{ selectedFeature.icon }}
          </div>
          <h2 class="modal-title">{{ selectedFeature.title }}</h2>
          <p class="modal-description">{{ selectedFeature.description }}</p>
        </div>
        
        <div class="modal-body">
          <div class="modal-info">
            <div class="info-item">
              <span class="info-label">状态</span>
              <span 
                class="info-value" 
                :class="getStatusClass(selectedFeature.status)"
              >
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
          
          <div class="feature-details" v-if="selectedFeature.features">
            <h3 class="details-title">主要特性</h3>
            <ul class="features-list">
              <li v-for="item in selectedFeature.features" :key="item" class="feature-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="modal-footer">
          <button 
            v-if="selectedFeature.status === '可用'" 
            class="btn-primary"
            @click="launchFeature(selectedFeature)"
          >
            立即体验
          </button>
          <button 
            v-else 
            class="btn-secondary"
            @click="showComingSoon"
          >
            敬请期待
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
    route: '/features/chat'
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
    description: '富文本笔记编辑器，支持文字、多媒体内容和云端同步',
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
    title: '股票查看',
    description: '实时股票行情查看，支持全球主要股票市场数据和个性化关注列表',
    icon: '📈',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    status: '可用',
    category: '金融工具',
    tags: ['股票行情', '金融数据'],
    features: ['实时行情', '股票搜索', '自选列表', 'K线图', '财务数据'],
    updateTime: '2024-01-16',
    route: '/stocklist'
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
      return 'status-active'
    case '开发中':
      return 'status-developing'
    case '即将推出':
      return 'status-coming'
    default:
      return ''
  }
}

const openModal = (feature: Feature) => {
  selectedFeature.value = feature
}

const closeModal = () => {
  selectedFeature.value = null
}

const launchFeature = (feature: Feature) => {
  if (feature.route) {
    router.push(feature.route)
  } else {
    showComingSoon()
  }
}

const showComingSoon = () => {
  alert('功能即将推出，敬请期待！')
}
</script>

<style scoped>
.features-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  padding: 2rem 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
}

.category-filter {
  margin-bottom: 3rem;
}

.filter-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  max-width: 800px;
  margin: 0 auto;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: #555;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto 4rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card-gradient {
  height: 120px;
  position: relative;
  overflow: hidden;
}

.card-gradient::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  filter: blur(20px);
  opacity: 0.7;
  transform: scale(1.2);
}

.card-content {
  padding: 1.5rem;
  position: relative;
  z-index: 2;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
}

.feature-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.75rem;
}

.feature-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.feature-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feature-category {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.feature-status {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
}

.status-active {
  background: rgba(67, 233, 123, 0.15);
  color: #2ecc71;
}

.status-developing {
  background: rgba(241, 196, 15, 0.15);
  color: #f39c12;
}

.status-coming {
  background: rgba(52, 152, 219, 0.15);
  color: #3498db;
}

.stats-section {
  margin: 4rem 0;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.stat-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-weight: 500;
  font-size: 1rem;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.4s ease-out;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.modal-close:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-header {
  padding: 2.5rem 2rem 1.5rem;
  text-align: center;
}

.modal-icon {
  width: 70px;
  height: 70px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.modal-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #333;
  margin-bottom: 0.75rem;
}

.modal-description {
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
}

.modal-body {
  padding: 0 2rem 1.5rem;
}

.modal-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 16px;
}

.info-item {
  text-align: center;
}

.info-label {
  display: block;
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.info-value {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-active {
  color: #2ecc71;
}

.status-developing {
  color: #f39c12;
}

.status-coming {
  color: #3498db;
}

.feature-details {
  margin-top: 1.5rem;
}

.details-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.features-list {
  list-style: none;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  color: #555;
}

.feature-item svg {
  color: #2ecc71;
  margin-right: 0.75rem;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.modal-footer {
  padding: 1.5rem 2rem 2rem;
  display: flex;
  gap: 1rem;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 1rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.6);
}

.btn-secondary {
  background: #f1f3f5;
  color: #666;
}

.btn-secondary:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .features-page {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .filter-container {
    gap: 0.5rem;
  }
  
  .filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .stats-container {
    grid-template-columns: 1fr 1fr;
  }
  
  .modal-info {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .modal-header {
    padding: 2rem 1.5rem 1rem;
  }
  
  .modal-body, .modal-footer {
    padding: 0 1.5rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    margin: 1rem;
  }
}
</style>