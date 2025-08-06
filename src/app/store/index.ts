import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import SecureLS from 'secure-ls'
import type { App } from 'vue'

// AES加密
const ls = new SecureLS({ encodingType: 'aes' })

const pinia = createPinia()
// 注入加密持久化插件
pinia.use(createPersistedState({
  storage: import.meta.env.DEV ? localStorage : {
    getItem: key => ls.get(key),
    setItem: (key, value) => ls.set(key, value),
  }
})
)

export function setupStore(app: App) {
  app.use(pinia)
}