import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {  // 用与vite代理访问后台解决跨域问题
    proxy: {
      '/lst/api': {
        target: 'http://127.0.0.1:8899',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lst\/api/, '/lst/api')
      },
      '/ai_lst': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/ws': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        ws: true
      }
    }
  }
})