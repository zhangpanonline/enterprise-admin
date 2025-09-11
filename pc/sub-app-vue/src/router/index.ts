import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // redirect: '/sub-app-vue',
      component: () => import('@/views/home.vue'),
      children: [

      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login.vue'),
    },
    {
      path: '/authcallback',
      name: 'authCallback',
      meta: {
        requiresAuth: false
      },
      component: () => import('@/views/auth-callback.vue'),
    },
    {
      path: '/:pathMatch(.*)',
      name: 'notFound',
      component: () => import('@/views/notFound.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore() as any
  if (to.meta.requiresAuth === false) {
    return true
  }
  if (to.name !== 'login' && !authStore.access_token) {
    return { name: 'login' }
  }
  if (to.name === 'login' && authStore.access_token) {
    return { name: 'home' }
  }
  return true
})

export default router
