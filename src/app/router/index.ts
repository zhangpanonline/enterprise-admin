import { type App } from 'vue'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { useAuthStore } from '@/app/store/auth'
import { routes } from './routes'


const router: Router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.name !== 'Login' && !authStore.accessToken) {
    return { name: 'Login' }
  }
  if (to.name === 'Login' && authStore.accessToken) {
    return {
      name: 'Home'
    }
  }
})

export function setupRouter(app: App) {
  app.use(router)
}
