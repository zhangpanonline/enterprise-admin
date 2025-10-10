import {
  MANAGE,
  SUPERVISE,
  DEBTOR,
  MANAGE_HEAD,
  MANAGE_MANAGER,
  MANAGE_MEMBER,
  CASE_EDIT_TABLE_KEY
} from '@/constant'
// 覆盖方法使用set开头
// 更新方法使用update开头
export const useCaseStore = defineStore('caseStore', () => {
  // 当前是否选择了案件，即 caseInfo 里是否有值
  const isExistCase = ref(false)
  // 选择的案件信息
  const caseInfo = ref({})
  // 案件角色
  const caseRole = ref({ org: '', member: '' })
  // 获取案件所有信息
  async function getCaseInfo(projectId) {
    if (!projectId) return projectId
    // 这里必须立即有值，否则在案件信息页面，会因没有projectId而报错
    caseInfo.value.projectId = projectId
    try {
      getCaseMenu(projectId)
      getCaseRole(projectId)
      const res = await getCaseDetailApi(projectId)
      if (res.success) {
        Object.assign(caseInfo.value, res.data)
        const { status, edit, createUser } = res.data
        // 进行中的案件，根据后台返回的权限字段 edit 来判断案件信息是否可修改。
        // 如果 createUser 不存在，也是可以编辑的, 并且只能看到 案件信息 菜单，进行认领
        caseInfo.value['isEdit'] = status === '2' && (edit || !createUser)
        isExistCase.value = true
      } else {
        console.error(res)
        ElMessage.error(res.msg)
      }
    } catch (error) {
      console.error(error)
      ElMessage.error(error.message)
    }
  }
  async function getCaseRole(projectId) {
    try {
      // 三方id：
      // 破产-管理人团队:3fda4fd73fb14834b26076c1af439b60
      // 破产-监督机构（法院）:70f896f117154daa82a308fcb6cc617b
      // 破产-债务人:b8a12fdd6cbe412cb9759770f490e823

      // 管理人团队角色id：
      // 项目负责人:026e9230d385485d84c14c4a8f1a9124
      // 项目管理员:91c5a6802dae4aa0aae96b40d12815c8
      // 项目成员:aa9ace3cc7294a50a62ba70341aa11e1
      const role = {
        '3fda4fd73fb14834b26076c1af439b60': MANAGE, // 管理人团队
        '70f896f117154daa82a308fcb6cc617b': SUPERVISE, // 监督机构(法院)
        'b8a12fdd6cbe412cb9759770f490e823': DEBTOR, // 债务人
        '026e9230d385485d84c14c4a8f1a9124': MANAGE_HEAD, // 管理人团队-项目负责人
        '91c5a6802dae4aa0aae96b40d12815c8': MANAGE_MANAGER, // 管理人团队-项目管理员
        'aa9ace3cc7294a50a62ba70341aa11e1': MANAGE_MEMBER, // 管理人团队-项目成员
      }
      const appStore = useAppStore()
      const res = await permissionsRoleApi({ projectId, userId: appStore.userInfo.userId })
      if (res.success) {
        const { companyType, roleId } = res.data || {}
        caseRole.value.org = role[companyType]
        caseRole.value.member = role[roleId]
      } else {
        console.error(res)
        ElMessage.error(res.msg)
      }
    } catch (error) {
      console.error(error)
      ElMessage.error(error.message)
    }
  }
  // 获取案件菜单
  async function getCaseMenu(projectId) {
    try {
      const appStore = useAppStore()
      const res = await getCaseMenuApi({ projectId, userId: appStore.userInfo.userId })
      if (res.success) {
        appStore.setMenus([res.data])
      } else {
        console.error(res)
        ElMessage.error(res.msg)
      }
    } catch (error) {
      console.error(error)
      ElMessage.error(error.message)
    }
  }

  // 重置
  function $reset() {
    isExistCase.value = false
    caseInfo.value = {}
    caseRole.value.org = ''
    caseRole.value.member = ''
    sessionStorage.clear(CASE_EDIT_TABLE_KEY)
  }

  return {
    isExistCase,
    caseInfo,
    getCaseInfo,
    caseRole,
    $reset,
  }
}, {
  persist: {
    // 是否开启缓存
    enabled: true,
    // 不配置strategies则表示缓存所有
    strategies: [
      // key：缓存时用到的key
      // storage: 缓存方式 localStorage 或 sesstionStorage
      // paths: 要缓存哪些字段
      { key: 'PINIA_CASE_INFO', storage: sessionStorage, paths: ['caseInfo', 'caseRole', 'isExistCase'] },
    ],
  },
})
