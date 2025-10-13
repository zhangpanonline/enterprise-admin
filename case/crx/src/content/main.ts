import './createContainer'
import { createApp } from 'vue'
import App from '@/views/App.vue'
import ElementPlus from 'element-plus'
import pinia from '@/store'
import { SYSTEM_EL_ID } from '@/constants'
import '@/styles/index.scss'

const app = createApp(App)
app.use(ElementPlus)
app.use(pinia)
app.mount(`#${SYSTEM_EL_ID}`)
