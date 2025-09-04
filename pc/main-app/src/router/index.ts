import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/sub-app-next',
    },
    {
      path: '/sub-app-next',
      name: 'subAppNext',
      component: () => import('@/views/sub-app-next.vue'),
    },
    {
      path: '/sub-app-vue',
      name: 'subAppVue',
      component: () => import('@/views/sub-app-vue.vue'),
    }
  ],
})

export default router
