import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home.vue'),
    },
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
    }
  ],
})

export default router
