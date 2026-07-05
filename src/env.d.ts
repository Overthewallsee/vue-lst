/// <reference types="vite/client" />

// 识别样式文件，消除 css 导入类型报错
declare module '*.css'
declare module '*.scss'
declare module '*.less'

// 识别vue文件
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}