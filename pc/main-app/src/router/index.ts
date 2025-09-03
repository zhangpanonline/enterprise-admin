import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/sub-app-vue',
    },
    {
      path: '/sub-app-vue',
      name: 'subAppVue',
      component: () => import('@/views/sub-app-vue.vue'),
    }
  ],
})

export default router
