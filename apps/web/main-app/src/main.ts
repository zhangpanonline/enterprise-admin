import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'
import '@/assets/index.css'
import i18n from '@/utils/i18n'

import WujieVue from 'wujie-vue3'

const { bus, setupApp, preloadApp, destroyApp } = WujieVue

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(WujieVue)
app.use(i18n)

app.mount('#app')

useAuthStore().initAuth()

