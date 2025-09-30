<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <button
          @click="goBack"
          class="mb-8 flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span class="text-xl">←</span>
          <span>返回项目列表</span>
        </button>

        <div v-if="project" class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span class="text-white text-8xl">{{ project.icon }}</span>
          </div>

          <div class="p-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ project.title }}</h1>
            <p class="text-gray-600 text-lg mb-6 leading-relaxed">{{ project.description }}</p>

            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">技术栈</h3>
              <div class="flex flex-wrap gap-3">
                <span
                  v-for="tech in project.technologies"
                  :key="tech"
                  class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-xl font-semibold text-gray-800 mb-4">项目特性</h3>
                <ul class="space-y-2">
                  <li v-for="feature in project.features" :key="feature" class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span class="text-gray-700">{{ feature }}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 class="text-xl font-semibold text-gray-800 mb-4">项目信息</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">状态:</span>
                    <span class="text-green-600 font-medium">{{ project.status }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">团队规模:</span>
                    <span class="text-gray-800">{{ project.teamSize }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">开发周期:</span>
                    <span class="text-gray-800">{{ project.duration }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-16">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">项目未找到</h2>
          <p class="text-gray-600 mb-8">抱歉，您查找的项目不存在。</p>
          <router-link
            to="/projects"
            class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            返回项目列表
          </router-link>
        </div>
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

onMounted(() => {
  const projectId = parseInt(route.params.id as string)
  project.value = projectsData.find(p => p.id === projectId) || null
})
</script>