import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/caseHome/index.vue'
import Layout from '../layout/Index.vue'
import Index from '../views/Index.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // scrollBehavior(to, from, savedPosition) {
  //   // 始终滚动到顶部
  //   return { top: 0 }
  // },
  routes: [
    {
      path: '/',
      redirect: '/Index',
      component: Layout,
      children: [
        {
          path: '/Index',
          component: Index,
          meta: { parentMenu: '/caseHome' },
        },
        {
          path: '/caseHome',
          name: 'caseHome',
          meta: { title: '首页' },
          component: Home,
        },
        {
          path: '/inCaseHome',
          name: 'inCaseHome',
          meta: { title: '首页' },
          component: () => import('@/views/caseHome/proxy.vue'),
        },
        {
          path: '/bulletin',
          name: 'bulletin',
          icon: 'IconEpDelete',
          meta: { title: '公告列表' },
          component: () => import('@/views/bulletin/index.vue'),
        },
        {
          path: '/bulletin/create',
          name: 'bulletinCreate',
          meta: { title: '发布公告', parentMenu: '/bulletin' },
          component: () => import(`@/views/bulletin/create.vue`),
        },
        {
          path: '/dailyManage/daily',
          name: 'daily',
          meta: { title: '日报' },
          component: () => import(`@/views/dailyManage/daily/index.vue`),
        },
        {
          path: '/dailyManage/rollup',
          name: 'rollup',
          meta: { title: '日报汇总' },
          component: () => import('@/views/dailyManage/rollup/index.vue'),
        },
        {
          path: '/dataCenter',
          name: 'dataCenter',
          meta: { title: '数据管理' },
          component: () => import(`@/views/dataCenter/index.vue`),
        },
        {
          path: '/caseManage',
          name: 'caseManage',
          meta: { title: '案件列表' },
          component: () => import('@/views/caseManage/index.vue'),
        },
        {
          path: '/caseManage/create',
          name: 'caseManageCreate',
          meta: { title: '新增案件', parentMenu: '/caseManage' },
          component: () => import('@/views/caseManage/create.vue'),
        },
        {
          path: '/caseManage/info',
          name: 'caseManageInfo',
          meta: { title: '案件信息' },
          component: () => import('@/views/caseManage/info/index.vue'),
        },
        {
          path: '/caseManage/progress',
          name: 'caseManageProgress',
          meta: { title: '案件进度' },
          component: () => import('@/views/caseManage/progress/index.vue'),
        },
        {
          path: '/caseManage/file',
          name: 'caseManageFile',
          meta: { title: '案件资料汇总' },
          component: () => import('@/views/caseManage/file/index.vue'),
        },
        {
          path: '/caseManage/team',
          name: 'caseManageTeam',
          meta: { title: '案件团队' },
          component: () => import(`@/views/caseManage/team/index.vue`),
        },
        {
          path: '/creditorMange',
          name: 'creditorMange',
          meta: { title: '债权人管理' },
          component: () => import(`@/views/creditorMange/index.vue`),
        },
        {
          path: '/meeting',
          name: 'meeting',
          meta: { title: '债权会议管理' },
          component: () => import(`@/views/meetingManage/index.vue`),
        },
        {
          path: '/meetingManage',
          name: 'meetingManage',
          meta: { title: '会议管理', parentMenu: '/meeting' },
          component: () => import('@/views/meetingManage/manage.vue'),
        },
        {
          path: '/memo',
          name: 'memo',
          meta: { title: '跟进记录' },
          component: () => import(`@/views/memo/index.vue`),
        },
        {
          path: '/assetManage/intangible',
          name: 'assetManageIntangible',
          meta: { title: '无形资产' },
          component: () => import(`@/views/assetManage/intangible/index.vue`),
        },
        {
          path: '/assetManage/knowledge',
          name: 'assetManageKnowledge',
          meta: { title: '知识产权' },
          component: () => import(`@/views/assetManage/knowledge/index.vue`),
        },
        {
          path: '/assetManage/physical',
          name: 'assetManagePhysical',
          meta: { title: '固定资产' },
          component: () => import(`@/views/assetManage/physical/index.vue`),
        },
        {
          path: '/assetManage/goods',
          name: 'assetManageGoods',
          meta: { title: '物品管理' },
          component: () => import(`@/views/assetManage/goods/index.vue`),
        },
        {
          path: '/capitalManage/account',
          name: 'capitalManageAccount',
          meta: { title: '账户管理' },
          component: () => import(`@/views/capitalManage/account/index.vue`),
        },
        {
          path: '/capitalManage/payment',
          name: 'capitalManagePayment',
          meta: { title: '付款申请' },
          component: () => import(`@/views/capitalManage/payment/index.vue`),
        },
        {
          path: '/capitalManage/reimbursement',
          name: 'capitalManageReimbursement',
          meta: { title: '报销申请' },
          component: () => import(`@/views/capitalManage/reimbursement/index.vue`),
        },
        {
          path: '/capitalManage/chart',
          name: 'capitalManageChart',
          meta: { title: '统计汇总' },
          component: () => import(`@/views/capitalManage/chart/index.vue`),
        },
        {
          path: '/otherManage/contract',
          name: 'otherManageContract',
          meta: { title: '合同管理' },
          component: () => import(`@/views/otherManage/contract/index.vue`),
        },
        {
          path: '/otherManage/writ',
          name: 'otherManageWrit',
          meta: { title: '文书管理' },
          component: () => import(`@/views/otherManage/writ/index.vue`),
        },
        {
          path: '/otherManage/signet',
          name: 'otherManageSignet',
          meta: { title: '印章管理' },
          component: () => import(`@/views/otherManage/signet/index.vue`),
        },
        {
          path: '/otherManage/ledger',
          name: 'otherManageLedger',
          meta: { title: '账簿管理' },
          component: () => import(`@/views/otherManage/ledger/index.vue`),
        },
        {
          path: '/auditManage/submit',
          name: 'auditManageSubmit',
          meta: { title: '我的提交' },
          component: () => import(`@/views/auditManage/submit/index.vue`),
        },
        {
          path: '/auditManage/wait',
          name: 'auditManageWait',
          meta: { title: '待审核' },
          component: () => import(`@/views/auditManage/wait/index.vue`),
        },
        {
          path: '/auditManage/draft',
          name: 'auditManageDraft',
          meta: { title: '我的暂存' },
          component: () => import(`@/views/auditManage/draft/index.vue`),
        },
        {
          path: '/auditManage/reviewed',
          name: 'auditManageReviewed',
          meta: { title: '已审核' },
          component: () => import(`@/views/auditManage/reviewed/index.vue`),
        },
        {
          path: '/caseSetting/warn',
          name: 'caseSettingWarn',
          meta: { title: '提醒设置' },
          component: () => import(`@/views/caseSetting/warn/index.vue`),
        },
        {
          path: '/caseSetting/process',
          name: 'caseSettingProcess',
          meta: { title: '流程配置' },
          component: () => import(`@/views/caseSetting/process/index.vue`),
        },
        {
          path: '/caseSetting/table',
          name: 'caseSettingTable',
          meta: { title: '自定义表单' },
          component: () => import(`@/views/caseSetting/table/index.vue`),
        },
        {
          path: '/caseSetting/report',
          name: 'caseSettingReport',
          meta: { title: '申报模板' },
          component: () => import(`@/views/caseSetting/report/index.vue`),
        },
        {
          path: '/caseSetting/report',
          name: 'caseSettingReport',
          meta: { title: '申报模板' },
          component: () => import(`@/views/caseSetting/report/index.vue`),
        },
        {
          path: '/caseMessage',
          name: 'caseMessage',
          meta: { title: '案件消息' },
          component: () => import(`@/views/caseMessage/index.vue`),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/register.vue'),
    },
    {
      path: '/creditorAudit',
      name: 'creditorAudit',
      meta: { title: '债权审定', parentMenu: '/creditorMange' },
      component: () => import('@/views/creditorAudit/index.vue'),
    },
    /**
     * 适配移动端
     */
    {
      path: '/app/dataCenter',
      name: 'appDataCenter',
      meta: { title: '数据中心' },
      component: () => import(`@/views/dataCenter/index.vue`),
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('../views/404.vue'),
    },
  ],
})
if (import.meta.env.DEV) {
  router.addRoute({
    path: '/example/theme',
    name: 'example_theme',
    component: () => import('@/example/theme/index.vue'),
  })
  router.addRoute({
    path: '/example/demo',
    name: 'example_demo',
    component: () => import('@/example/demo.vue'),
  })
  router.addRoute({
    path: '/example/form',
    name: 'example_form',
    component: () => import('@/example/form/index.vue'),
  })
}

router.beforeEach((to, from, next) => {
  const appStore = useAppStore()
  const caseStore = useCaseStore()
  if (/^\/app\//.test(to.path)) {
    next()
  } else if (appStore.token) {
    if (to.name === 'login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (to.name !== 'login') {
      localStorage.clear()
      sessionStorage.clear()
      appStore.$reset()
      caseStore.$reset()
      next('/login')
    } else {
      next()
    }
  }
})

export default router

