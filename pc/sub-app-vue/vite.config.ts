import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    tailwindcss(),
    // 自动引入 Vue API、Pinia 等
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.d.ts', // 自动生成类型文件
      dirs: [
        "./src/api/index.ts"
      ]
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
    port: 1003,
    host: true,
    https: {
      key: readFileSync(fileURLToPath(new URL('../key.pem', import.meta.url))),
      cert: readFileSync(fileURLToPath(new URL('../cert.pem', import.meta.url))),
      passphrase: 'zhangpan',
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
