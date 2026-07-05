import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/ai_lst': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})