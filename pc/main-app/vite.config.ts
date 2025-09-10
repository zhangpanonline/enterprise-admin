import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(() => {
  
  return {
    plugins: [
      vue(),
      vueJsx(),
      tailwindcss(),
      // 自动引入 Vue API、Pinia 等
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router'],
        dts: 'src/auto-imports.d.ts', // 自动生成类型文件
      }),

      // 自动注册组件（ElementPlus 等）
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts',
      }),
      // vueDevTools({
      //   componentInspector: false
      // }),
    ],
    server: {
      host: true,
      port: 1000,
      proxy: {
      },
      https: {
        key: readFileSync(fileURLToPath(new URL('key.pem', import.meta.url))),
        cert: readFileSync(fileURLToPath(new URL('cert.pem', import.meta.url))),
        passphrase: 'zhangpan',
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
