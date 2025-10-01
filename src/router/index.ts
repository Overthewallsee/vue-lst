import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Projects from '../views/Projects.vue'
import ProjectDetail from '../views/ProjectDetail.vue'
import NotFound from '../views/NotFound.vue'
import login from '../views/login.vue'
import Features from '../views/Features.vue'
import ChatRoom from '../views/ChatRoom.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: '首页'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/features',
      name: 'Features',
      component: Features,
      meta: {
        title: '功能中心'
      }
    },
    {
      path: '/features/chat',
      name: 'ChatRoom',
      component: ChatRoom,
      meta: {
        title: '聊天室'
      }
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: {
        title: '关于我们'
      }
    },
    {
      path: '/projects',
      name: 'Projects',
      component: Projects,
      meta: {
        title: '项目展示'
      }
    },
    {
      path: '/projects/:id',
      name: 'ProjectDetail',
      component: ProjectDetail,
      meta: {
        title: '项目详情'
      }
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
      meta: {
        title: '联系我们'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: '页面未找到'
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  // 动态设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Vue Router App`
  }
  next()
})

export default router