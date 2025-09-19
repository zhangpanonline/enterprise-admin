// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 1002,
    host: '0.0.0.0',
    https: {
      key: readFileSync(fileURLToPath(new URL('../key.pem', import.meta.url))).toString(),
      cert: readFileSync(fileURLToPath(new URL('../cert.pem', import.meta.url))).toString(),
      passphrase: 'zhangpan',
    },
  }
})
