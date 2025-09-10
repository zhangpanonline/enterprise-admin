import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/sub-app-vue',
      component: () => import('@/views/home.vue'),
      children: [
        {
          path: '/sub-app-next',
          name: 'subAppNext',
          component: () => import('@/views/sub-app-next.vue'),
        },
        {
          path: '/sub-app-nuxt',
          name: 'subAppNuxt',
          component: () => import('@/views/sub-app-nuxt.vue'),
        },
        {
          path: '/sub-app-vue',
          name: 'subAppVue',
          component: () => import('@/views/sub-app-vue.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login.vue'),
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
  if (to.name !== 'login' && !authStore.access_token) {
    return { name: 'login' }
  }
  if (to.name === 'login' && authStore.access_token) {
    return {
      name: 'home',
    }
  }
})

export default router
