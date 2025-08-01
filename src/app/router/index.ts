// src/app/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/features/dashboard/pages/Home.vue')
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
