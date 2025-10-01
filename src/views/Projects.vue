<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">项目展示</h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          浏览我们的项目集合，每个项目都展示了不同的技术实现和设计理念。
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div
          v-for="project in projects"
          :key="project.id"
          class="project-card group cursor-pointer"
          @click="navigateToProject(project.id)"
        >
          <div class="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
            <span class="text-white text-4xl">{{ project.icon }}</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
            {{ project.title }}
          </h3>
          <p class="text-gray-600 mb-4 line-clamp-3">{{ project.description }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tech in project.technologies"
              :key="tech"
              class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
            >
              {{ tech }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  icon: string
}

const router = useRouter()

const projects = ref<Project[]>([
  {
    id: 1,
    title: 'E-commerce 平台',
    description: '一个现代化的电商平台，支持商品管理、购物车、支付处理等完整的购物体验功能。',
    technologies: ['Vue.js', 'TypeScript', 'Node.js', 'MongoDB'],
    icon: '🛒'
  },
  {
    id: 2,
    title: '任务管理系统',
    description: '团队协作任务管理工具，提供项目管理、任务分配、进度跟踪等企业级功能。',
    technologies: ['Vue.js', 'Express', 'PostgreSQL', 'Redis'],
    icon: '✅'
  },
  {
    id: 3,
    title: '社交媒体应用',
    description: '现代化社交平台，支持实时聊天、动态发布、好友系统等社交网络核心功能。',
    technologies: ['Vue.js', 'Socket.io', 'MySQL', 'AWS'],
    icon: '📱'
  },
  {
    id: 4,
    title: '数据可视化面板',
    description: '企业级数据分析仪表板，提供丰富的图表类型和实时数据展示功能。',
    technologies: ['Vue.js', 'D3.js', 'Python', 'Docker'],
    icon: '📊'
  },
  {
    id: 5,
    title: '在线学习平台',
    description: '教育科技平台，支持视频课程、在线测试、学习进度跟踪等完整学习体验。',
    technologies: ['Vue.js', 'WebRTC', 'Firebase', 'Stripe'],
    icon: '🎓'
  },
  {
    id: 6,
    title: '内容管理系统',
    description: '灵活的CMS系统，支持多种内容类型、SEO优化、多语言等企业内容管理需求。',
    technologies: ['Vue.js', 'Nuxt.js', 'Strapi', 'GraphQL'],
    icon: '📝'
  }
])

const navigateToProject = (id: number) => {
  router.push(`/projects/${id}`)
}
</script>

<style scoped>
.project-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  transform: translateY(0);
}

.project-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-0.5rem);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>