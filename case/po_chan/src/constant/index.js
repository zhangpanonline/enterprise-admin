function getUrl(path) {
  return new URL(`/src/assets/images/${path}.svg`, import.meta.url).href
}
// 根据文件名后缀匹配图标
const ICON_FOLDER = getUrl('folder')
const ICON_PDF = getUrl('pdf')
const ICON_WORD = getUrl('word')
const ICON_EXCEL = getUrl('excel')
const ICON_IMAGE = getUrl('image')
const ICON_VIDEO = getUrl('video')
const ICON_DEFAULT = getUrl('default')
const ICON_MUSIC = getUrl('music')
const ICON_PPT = getUrl('ppt')
const ICON_RAR = getUrl('rar')
const ICON_ZIP = getUrl('zip')
export const ICON = {
  FOLDER: ICON_FOLDER,
  PDF: ICON_PDF,
  WORD: ICON_WORD,
  EXCEL: ICON_EXCEL,
  IMAGE: ICON_IMAGE,
  VIDEO: ICON_VIDEO,
  DEFAULT: ICON_DEFAULT,
  MUSIC: ICON_MUSIC,
  PPT: ICON_PPT,
  RAR: ICON_RAR,
  ZIP: ICON_ZIP,
}
// 文件后缀名转图标
export const FILE_SUFFIX = {
  'doc': 'WORD',
  'docx': 'WORD',
  'pdf': 'PDF',
  'xls': 'EXCEL',
  'xlsx': 'EXCEL',
  'csv': 'EXCEL',
  'wmv': 'VIDEO',
  'asf': 'VIDEO',
  'asx': 'VIDEO',
  'rm': 'VIDEO',
  'rmvb': 'VIDEO',
  'mp4': 'VIDEO',
  '3gp': 'VIDEO',
  'mov': 'VIDEO',
  'm4v': 'VIDEO',
  'jpg': 'IMAGE',
  'png': 'IMAGE',
  'svg': 'IMAGE',
  'webp': 'IMAGE',
  'jpeg': 'IMAGE',
  'gif': 'IMAGE',
  'cda': 'MUSIC',
  'wav': 'MUSIC',
  'mp3': 'MUSIC',
  'aif': 'MUSIC',
  'aiff': 'MUSIC',
  'mid': 'MUSIC',
  'wma': 'MUSIC',
  'ra': 'MUSIC',
  'vqf': 'MUSIC',
  'ape': 'MUSIC',
  'pptx': 'PPT',
  'pptm': 'PPT',
  'ppt': 'PPT',
  'ppa': 'PPT',
  'rar': 'RAR',
  'tar': 'RAR',
  'zip': 'ZIP',
  'gzip': 'ZIP',
  '7-zip': 'ZIP',
  'jar': 'ZIP',
}
// 文件名后缀转汉字
export const FILE_SUFFIX_NAME = {
  'doc': '文件',
  'docx': '文件',
  'pdf': '文件',
  'xls': '文件',
  'xlsx': '文件',
  'csv': '文件',
  'wmv': '视频文件',
  'asf': '视频文件',
  'asx': '视频文件',
  'rm': '视频文件',
  'rmvb': '视频文件',
  'mp4': '视频文件',
  '3gp': '视频文件',
  'mov': '视频文件',
  'm4v': '视频文件',
  'jpg': '图片',
  'png': '图片',
  'svg': '图片',
  'webp': '图片',
  'jpeg': '图片',
  'gif': '图片',
  'cda': '音频文件',
  'wav': '音频文件',
  'mp3': '音频文件',
  'aif': '音频文件',
  'aiff': '音频文件',
  'mid': '音频文件',
  'wma': '音频文件',
  'ra': '音频文件',
  'vqf': '音频文件',
  'ape': '音频文件',
  'pptx': '文件',
  'pptm': '文件',
  'ppt': '文件',
  'ppa': '文件',
  'rar': '压缩文件',
  'tar': '压缩文件',
  'zip': '压缩文件',
  'gzip': '压缩文件',
  '7-zip': '压缩文件',
  'jar': '压缩文件',
}
// 国家地区
export const COUNTRY = [
  { label: '中国', value: 1 },
  { label: '中国香港', value: 2 },
  { label: '中国澳门', value: 3 },
  { label: '中国台湾', value: 4 },
  { label: '其他国家', value: 5 },
]
// 债权性质
export const NATURE_CLAIM = [
  { label: '普通债权', value: '0' },
  { label: '税款债权', value: '1' },
  { label: '职工债权', value: '2' },
  { label: '抵押债权', value: '3' },
  { label: '质押债权', value: '4' },
  { label: '留置债权', value: '5' },
  { label: '工程款债权', value: '6' },
  { label: '其他债权', value: '7' },
]
// 案件团队里的角色
export const MANAGE = 'MANAGE' // 管理人团队
export const SUPERVISE = 'SUPERVISE' // 监督机构(法院)
export const DEBTOR = 'DEBTOR' // 债务人
export const MANAGE_HEAD = 'MANAGE_HEAD' // 管理人团队-项目负责人
export const MANAGE_MANAGER = 'MANAGE_MANAGER' // 管理人团队-项目管理员
export const MANAGE_MEMBER = 'MANAGE_MEMBER' // 管理人团队-项目成员
// localStorage
export const CASE_EDIT_AUDIT = 'CASE_EDIT_AUDIT'
export const CASE_EDIT_AUDIT_UPDATE = 'CASE_EDIT_AUDIT_UPDATE' // 值得类型：false 无更新，true 通知债权列表有更新，delete 通知债权列表有删除
export const CASE_EDIT_TABLE_KEY = 'CASE_EDIT_TABLE_KEY'
// 统一权限过来的角色
export const AUTH_LAW_CREATER = 'new_bankrupt_law_creater' // 破产-律所创建人
export const AUTH_LAW_MANAGER = 'new_bankrupt_law_manager' // 破产-律所管理员
export const AUTH_GLRCY = 'new_glrcy' // 破产管理人-成员
export const AUTH_PCDSFJG = 'new_PCDSFJG' // 监督机构（法院）
export const AUTH_PCZWR = 'new_PCZWR' // 破产债务人
export const AUTH_PCZQR = 'new_PCZQR' // 破产债权人
export const AUTH_LVXIE = 'new_LVXIE' // 破产律协
export const AUTH_THIRD_PARTY = 'new_bankrupt_third_party' // 破产-第三方
// 字典
export const DICT_STORAGE = 'DICT_STORAGE'

// 接口-破产
export const BANKRUPT_API = '/bankrupt'
// 接口-消息
export const MESSAGE_API = '/message'
// 接口-SSO
export const SSO_API = '/sso'
// 接口-auth
export const AUTH_API = '/auth'

/**
 * 从统一权限菜单里配置的按钮权限
 */
// 查看，代码中不需要使用，但在统一权限中需要配置，用来表示当前菜单是否可以查看
// export const LOOK_BUTTON = 'LOOK'
// 新增
export const CREATE_BUTTON = 'CREATE'
// 编辑
export const EDIT_BUTTON = 'EDIT'
// 导出
export const EXPORT_BUTTON = 'EXPORT'
// 导入
export const IMPORT_BUTTON = 'IMPORT'
// 删除
export const DELETE_BUTTON = 'DELETE'
// （历史）记录
export const RECORD_BUTTON = 'RECORD'
// 设置
export const SEETING_BUTTON = 'SEETING'
// 审定、审核
export const AUDIT_BUTTON = 'AUDIT'
// 案件管理——案件认领
export const ACCEPT_BUTTON = 'ACCEPT'
// 债权人列表——分配审查负责人
export const ASSIGN_BUTTON = 'ASSIGN'
// 债权人列表——通知债权人
export const NOTICE_BUTTON = 'NOTICE'
// tab1
export const TAB1 = 'TAB1'
// export const TAB1_LOOK = 'TAB1_LOOK'
export const TAB1_CREATE = 'TAB1_CREATE'
export const TAB1_EDIT = 'TAB1_EDIT'
export const TAB1_DELETE = 'TAB1_DELETE'
export const TAB1_EXPORT = 'TAB1_EXPORT'
export const TAB1_IMPORT = 'TAB1_IMPORT'
// tab2
export const TAB2 = 'TAB2'
// export const TAB2_LOOK = 'TAB2_LOOK'
export const TAB2_CREATE = 'TAB2_CREATE'
export const TAB2_EDIT = 'TAB2_EDIT'
export const TAB2_DELETE = 'TAB2_DELETE'
export const TAB2_EXPORT = 'TAB2_EXPORT'
export const TAB2_IMPORT = 'TAB2_IMPORT'
// tab3
export const TAB3 = 'TAB3'
// export const TAB3_LOOK = 'TAB3_LOOK'
export const TAB3_CREATE = 'TAB3_CREATE'
export const TAB3_EDIT = 'TAB3_EDIT'
export const TAB3_DELETE = 'TAB3_DELETE'
export const TAB3_EXPORT = 'TAB3_EXPORT'
export const TAB3_IMPORT = 'TAB3_IMPORT'
// tab4
export const TAB4 = 'TAB4'
// export const TAB4_LOOK = 'TAB4_LOOK'
export const TAB4_CREATE = 'TAB4_CREATE'
export const TAB4_EDIT = 'TAB4_EDIT'
export const TAB4_DELETE = 'TAB4_DELETE'
export const TAB4_EXPORT = 'TAB4_EXPORT'
export const TAB4_IMPORT = 'TAB4_IMPORT'
// tab5
export const TAB5 = 'TAB5'
// tab6
export const TAB6 = 'TAB6'
