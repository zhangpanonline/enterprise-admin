import { createApp, type App as AppType } from 'vue'
import '@/styles/index.css'
import App from '@/App.vue'
import { setupRouter } from './router'
import { setupStore } from './store'
import { setupPlugins } from './plugins'

const app: AppType = createApp(App)

setupStore(app)
setupRouter(app)
setupPlugins(app)

app.mount('#app')
