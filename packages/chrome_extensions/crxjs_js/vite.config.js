import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.config.js'

export default defineConfig({
  plugins: [
    crx({ manifest }),
  ],
  server: {
    port: 3000,
    cors: {
      origin: [
        /chrome-extension:\/\//,
      ],
    },
  },
})
