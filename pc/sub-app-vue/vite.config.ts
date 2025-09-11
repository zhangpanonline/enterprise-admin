import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    tailwindcss(),
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
