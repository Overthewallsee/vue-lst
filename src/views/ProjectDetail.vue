<template>
  <div class="project-detail-page">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <button 
        @click="goBack"
        class="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        返回项目列表
      </button>

      <div v-if="project" class="project-detail-card">
        <img 
          v-if="project.image" 
          :src="project.image" 
          :alt="project.title"
          class="w-full h-64 object-cover"
        >
        
        <div class="p-8">
          <div class="flex flex-wrap items-center gap-4 mb-6">
            <h1 class="text-3xl font-bold text-gray-800">{{ project.title }}</h1>
            <span 
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="getStatusClass(project.status)"
            >
              {{ project.status }}
            </span>
          </div>
          
          <p class="text-gray-600 text-lg mb-8 leading-relaxed">
            {{ project.description }}
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 class="text-xl font-semibold text-gray-800 mb-4">项目详情</h2>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">开发周期</span>
                  <span class="font-medium">{{ project.duration }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">技术栈</span>
                  <span class="font-medium">{{ project.tech }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">团队规模</span>
                  <span class="font-medium">{{ project.team }}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 class="text-xl font-semibold text-gray-800 mb-4">主要功能</h2>
              <ul class="space-y-2">
                <li 
                  v-for="feature in project.features" 
                  :key="feature"
                  class="flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  {{ feature }}
                </li>
              </ul>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-4">
            <button 
              v-if="project.liveUrl"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              查看演示
            </button>
            <button 
              v-if="project.githubUrl"
              class="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              GitHub 源码
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-12">
        <div class="text-gray-400 mb-4">项目未找到</div>
        <button 
          @click="goBack"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回项目列表
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface ProjectDetail {
  id: number
  title: string
  description: string
  technologies: string[]
  icon: string
  features: string[]
  status: string
  teamSize: string
  duration: string
}

const route = useRoute()
const router = useRouter()
const project = ref<ProjectDetail | null>(null)

const projectsData: ProjectDetail[] = [
  {
    id: 1,
    title: 'E-commerce 平台',
    description: '一个现代化的电商平台，支持商品管理、购物车、支付处理等完整的购物体验功能。使用微服务架构，提供高可用性和可扩展性。',
    technologies: ['Vue.js', 'TypeScript', 'Node.js', 'MongoDB'],
    icon: '🛒',
    features: ['用户认证与授权', '商品目录管理', '购物车功能', '订单处理系统', '支付集成', '库存管理', 'SEO优化', '移动端适配'],
    status: '已完成',
    teamSize: '5人',
    duration: '6个月'
  },
  {
    id: 2,
    title: '任务管理系统',
    description: '团队协作任务管理工具，提供项目管理、任务分配、进度跟踪等企业级功能。支持敏捷开发流程和团队协作。',
    technologies: ['Vue.js', 'Express', 'PostgreSQL', 'Redis'],
    icon: '✅',
    features: ['项目管理', '任务分配', '进度跟踪', '团队协作', '文件共享', '时间记录', '报告生成', '权限管理'],
    status: '进行中',
    teamSize: '4人',
    duration: '4个月'
  },
  {
    id: 3,
    title: '社交媒体应用',
    description: '现代化社交平台，支持实时聊天、动态发布、好友系统等社交网络核心功能。采用实时通信技术提供流畅的用户体验。',
    technologies: ['Vue.js', 'Socket.io', 'MySQL', 'AWS'],
    icon: '📱',
    features: ['实时聊天', '动态发布', '好友系统', '点赞评论', '图片上传', '隐私设置', '消息推送', '内容审核'],
    status: '已完成',
    teamSize: '6人',
    duration: '8个月'
  },
  {
    id: 4,
    title: '数据可视化面板',
    description: '企业级数据分析仪表板，提供丰富的图表类型和实时数据展示功能。支持自定义仪表板和数据导出。',
    technologies: ['Vue.js', 'D3.js', 'Python', 'Docker'],
    icon: '📊',
    features: ['实时数据展示', '多种图表类型', '自定义仪表板', '数据过滤', '导出功能', 'API集成', '权限控制', '响应式设计'],
    status: '已完成',
    teamSize: '3人',
    duration: '5个月'
  },
  {
    id: 5,
    title: '在线学习平台',
    description: '教育科技平台，支持视频课程、在线测试、学习进度跟踪等完整学习体验。提供多媒体内容和互动学习工具。',
    technologies: ['Vue.js', 'WebRTC', 'Firebase', 'Stripe'],
    icon: '🎓',
    features: ['视频课程', '在线测试', '学习进度', '证书颁发', '讨论论坛', '直播功能', '支付系统', '移动应用'],
    status: '规划中',
    teamSize: '7人',
    duration: '10个月'
  },
  {
    id: 6,
    title: '内容管理系统',
    description: '灵活的CMS系统，支持多种内容类型、SEO优化、多语言等企业内容管理需求。提供直观的管理界面和强大的扩展能力。',
    technologies: ['Vue.js', 'Nuxt.js', 'Strapi', 'GraphQL'],
    icon: '📝',
    features: ['内容编辑', 'SEO优化', '多语言支持', '用户权限', '插件系统', '主题定制', '媒体管理', 'API接口'],
    status: '已完成',
    teamSize: '4人',
    duration: '7个月'
  }
]

const goBack = () => {
  router.push('/projects')
}

const getStatusClass = (status: string) => {
  switch (status) {
    case '已完成':
      return 'bg-green-100 text-green-800'
    case '进行中':
      return 'bg-yellow-100 text-yellow-800'
    case '规划中':
      return 'bg-gray-100 text-gray-800'
    default:
      return ''
  }
}

onMounted(() => {
  const projectId = parseInt(route.params.id as string)
  project.value = projectsData.find(p => p.id === projectId) || null
})
</script>

<style scoped>
.project-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  padding: 2rem 1rem;
}

.project-detail-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
</style>
