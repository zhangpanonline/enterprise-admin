import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/index.css'

import WujieVue from 'wujie-vue3'

const { bus, setupApp, preloadApp, destroyApp } = WujieVue

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(WujieVue)

app.mount('#app')
