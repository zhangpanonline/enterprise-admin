import { type RouteRecordRaw } from 'vue-router'
import Home from '@/app/layout/index.vue' 

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        meta: {
          title: '首页'
        },
        component: () => import('@/features/dashboard/views/Home.vue')
      },
      {
        path: '/bigDataRender',
        name: 'BigDataRender',
        meta: {
          title: '大数据渲染'
        },
        component: () => import('@/features/bigDataRender/pages/BBigDataRenderPage.vue')
      },
      {
        path: '/crx',
        name: 'Crx',
        meta: {
          title: '插件管理'
        },
        component: () => import('@/features/crx/pages/CrxPage.vue')
      },
      {
        path: '/users',
        name: 'Users',
        meta: {
          title: '用户管理'
        },
        component: () => import('@/features/users/pages/UsersPage.vue')
      },
      {
        path: '/roles',
        name: 'Roles',
        meta: {
          title: '角色管理'
        },
        component: () => import('@/features/roles/pages/RolesPage.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/auth/views/LoginPage.vue')
  },
]