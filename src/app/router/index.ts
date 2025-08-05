import { type App } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw, type Router } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/auth/views/LoginPage.vue')
  },
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes
})

export function setupRouter(app: App) {
  app.use(router)
}
