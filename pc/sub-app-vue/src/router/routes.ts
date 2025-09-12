import { type RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页',
    },
    component: () => import('@/views/home.vue'),
  },
  {
    path: '/system',
    name: 'system',
    meta: {
        title: '系统管理'
    },
    children: [
        {
            path: '/system/users',
            name: 'systemusers',
            meta: {
                title: '用户管理'
            },
            component: () => import('@/views/users/index.vue')
        },
        {
            path: '/system/roles',
                        name: 'systemroles',
            meta: {
                title: '角色管理'
            },
            component: () => import('@/views/roles/index.vue')
        },
        {
            path: '/system/dicts',
                        name: 'systemdicts',
            meta: {
                title: '字典管理'
            },
            component: () => import('@/views/dicts/index.vue')
        },
    ]
},
  //   {
  //     path: '/bigDataRender',
  //     name: 'BigDataRender',
  //     meta: {
  //       title: '大数据渲染'
  //     },
  //     component: () => import('@/features/bigDataRender/pages/BBigDataRenderPage.vue')
  //   },
  //   {
  //     path: '/crx',
  //     name: 'Crx',
  //     meta: {
  //       title: '插件管理'
  //     },
  //     component: () => import('@/features/crx/pages/CrxPage.vue')
  //   },
]
