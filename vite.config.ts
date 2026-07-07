import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
   // 解决 sockjs global 未定义
  define: {
    global: 'window'
  },
  server: {
    proxy: {
      '/ai_lst': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/ai_lst/ws': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true
      }
    }
  }
})