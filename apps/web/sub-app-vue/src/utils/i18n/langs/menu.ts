const menuRaw = {
  home: { zh: '首页', en: 'Home' },
  extension: { zh: '插件管理', en: 'Extension' },
  bigDataRender: { zh: '大数据渲染', en: 'Big Data Rendering' },
  systemManage: { zh: '系统管理', en: 'System Manage' },
  userManage: { zh: '用户管理', en: 'Users Manage' },
  roleManage: { zh: '角色管理', en: 'Roles Manage' },
  dictManage: { zh: '字典管理', en: 'Dicts Manage' },
  map: { zh: '地图', en: 'Map' },
  cesium: { zh: 'CesiumJS', en: 'CesiumJS' },
}

const menu: Record<'zh' | 'en', Record<string, string>> = { zh: {}, en: {} }

Object.entries(menuRaw).forEach(([key, value]) => {
  menu.zh[key] = value.zh
  menu.en[key] = value.en
})

export default menu