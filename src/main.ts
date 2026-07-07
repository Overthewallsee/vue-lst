(window as any).global = window;
import { createApp } from 'vue'
import App from './App.vue'
// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 路由
import router from './router'

const app = createApp(App)

// 注册ElementPlus
app.use(ElementPlus)
// 全局注册所有Element图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册路由
app.use(router)

app.mount('#app')