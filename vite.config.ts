import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
console.log(fileURLToPath(import.meta.url))
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // 自动引入 Vue API、Pinia 等
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: [
        'vue',
        'vue-router',
      ],
      dts: 'src/auto-imports.d.ts', // 自动生成类型文件
    }),

    // 自动注册组件（ElementPlus 等）
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      // 这里要使用绝对路径
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
