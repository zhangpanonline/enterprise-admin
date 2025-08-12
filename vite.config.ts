import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(() => {
  // rocess.cwd() 返回当前node进程的启动目录
  const env = loadEnv('', process.cwd())
  return {
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
    server: {
      port: 8888,
      proxy: {
        // env.VITE_SUPABASE_URL = https://smmexdymolziqxyrvctw.supabase.co
        '/api': {
          target: env.VITE_SUPABASE_URL,
          changeOrigin: true,
          rewrite: path => {
            const _path = path.replace(/^\/api/, '')
            console.log('======================================================')
            console.log("请求地址：", env.VITE_SUPABASE_URL + _path)
            return _path
          }
        }
      }
    },
    resolve: {
      alias: {
        // 这里要使用绝对路径
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
