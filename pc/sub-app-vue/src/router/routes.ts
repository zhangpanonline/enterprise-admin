import { type RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    meta: {
      title: 'menu.home',
    },
    component: () => import('@/views/home.vue'),
  },
  {
    path: '/extension',
    name: 'extension',
    meta: {
      title: 'menu.extension',
    },
    component: () => import('@/views/extension/index.vue'),
  },
  {
    path: '/bigDataRender',
    name: 'bigDataRender',
    meta: {
      title: 'menu.bigDataRender',
    },
    component: () => import('@/views/bigDataRender/index.vue')
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      title: 'menu.systemManage',
    },
    children: [
      {
        path: '/system/users',
        name: 'systemusers',
        meta: {
          title: 'menu.userManage',
        },
        component: () => import('@/views/users/index.vue'),
      },
      {
        path: '/system/roles',
        name: 'systemroles',
        meta: {
          title: 'menu.roleManage',
        },
        component: () => import('@/views/roles/index.vue'),
      },
      {
        path: '/system/dicts',
        name: 'systemdicts',
        meta: {
          title: 'menu.dictManage',
        },
        component: () => import('@/views/dicts/index.vue'),
      },
    ],
  },
]
