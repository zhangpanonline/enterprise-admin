// 覆盖方法使用set开头
// 更新方法使用update开头
import router from '@/router/index.js'
export const useAppStore = defineStore('app', () => {
  const userInfo = ref({})
  function setUserInfo(user) {
    userInfo.value = user
  }
  const token = ref('')
  function setToken(val) {
    token.value = val
  }
  // 统一权限
  const authorities = ref([])
  function setAuthorities(val) {
    authorities.value = val
  }
  // 菜单
  const menus = ref([])
  const caseMenu = ref([])
  // 按钮权限
  const buttonAuth = ref({})
  function setMenus(list) {
    // 获取在统一权限未配置的菜单
    const subMenus = router.options.routes[0].children.reduce((acc, cur) => {
      if (cur.meta?.parentMenu) acc[cur.meta.parentMenu] = cur.path
      return acc
    }, {})
    Object.assign(subMenus, router.options.routes.reduce((acc, cur) => {
      if (cur.meta?.parentMenu) acc[cur.meta.parentMenu] = cur.path
      return acc
    }, {}))
    list.forEach(v => {
      if (v.url === '/BANKRUPT_PLATFORM') {
        menus.value = v.children.map(v => {
          v.children = getButtonAuth(v.children, v.url)
          return v
        })
      } else if (v.url === '/BANKRUPT_CASE') {
        caseMenu.value = v.children.map(v => {
          v.children = getButtonAuth(v.children, v.url)
          return v
        })
      }
    })
    function getButtonAuth(menus, key) {
      if (Array.isArray(menus)) {
        return menus.reduce((acc, cur) => {
          if (cur.menuType === 0) {
            // 菜单
            acc.push(cur)
            cur.children = getButtonAuth(cur.children, cur.url)
          } else if (cur.menuType === 1) {
            // 按钮
            const cache = buttonAuth.value[key]
            if (cache) {
              if (!cache.includes(cur.url)) cache.push(cur.url)
            } else {
              buttonAuth.value[key] = [cur.url]
            }
            // tab（按钮）页下的按钮
            getButtonAuth(cur.children, key)

            const subKey = subMenus[key]
            if (subKey) {
              const subCache = buttonAuth.value[subKey]
              if (subCache) {
                if (!subCache.includes(cur.url)) subCache.push(cur.url)
              } else {
                buttonAuth.value[subKey] = [cur.url]
              }
              getButtonAuth(cur.children, subKey)
            }
          }
          return acc
        }, [])
      } else {
        return []
      }
    }
  }
  // 当前登录用户的案件总数
  const caseTotal = ref(0)
  function setCaseTotal(val) {
    caseTotal.value = val
  }

  // 重置
  function $reset() {
    userInfo.value = {}
    token.value = ''
    caseTotal.value = 0
    authorities.value = []
    menus.value = []
    caseMenu.value = []
    buttonAuth.value = {}
  }

  return {
    userInfo,
    setUserInfo,
    token,
    setToken,
    caseTotal,
    setCaseTotal,
    // 权限
    authorities,
    setAuthorities,
    // 菜单
    menus,
    caseMenu,
    buttonAuth,
    setMenus,
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
      { key: 'PINIA_APP', storage: localStorage, paths: ['token', 'authorities', 'userInfo'] },
      { key: 'PINIA_APP', storage: sessionStorage, paths: ['menus', 'caseTotal', 'caseMenu', 'buttonAuth'] },
    ],
  },
})

