import './assets/css/index.css'
import 'photoswipe/style.css'
import { setTheme } from './theme'
import 'virtual:svg-icons'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'

import App from './App.vue'
import router from './router'

setTheme()

const pinia = createPinia()
pinia.use(piniaPersist)

const app = createApp(App)

app.use(pinia).use(router)
app.mount('#app')

