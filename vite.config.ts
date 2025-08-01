import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
console.log(fileURLToPath(import.meta.url))
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      // 这里要使用绝对路径
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
