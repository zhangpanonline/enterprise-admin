import { type RouteRecordRaw } from 'vue-router'
import Home from '@/app/layout/index.vue' 

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/features/dashboard/views/Home.vue')
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('@/features/users/pages/UsersPage.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/auth/views/LoginPage.vue')
  },
]