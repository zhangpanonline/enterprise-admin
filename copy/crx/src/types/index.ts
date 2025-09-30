/**
 * 获取token的cookie类型
 */
export interface TokenCookieType {
  token: string
  UKeyInfo: string
}

export interface TabMessage {
  action: string // 表示需要执行的动作
  data?: any // 转递的数据
  type?: string
}

export interface SendMessageType {
  type: string // 表示需要执行的动作
  action?: string
  table?: string
  data?: any // 转递的数据
}

export interface ResponseData<T = any> {
  code: number
  data: T
  error: boolean
  info: boolean
  msg: string
  right: boolean
  warning: boolean
}

/**
 * 插件通信的数据类型
 */
export interface MessageResponse<T = any> {
  /** 是否成功 */
  success: boolean
  /**数据 */
  data?: T
  message?: string
}

export interface ThemeType {
  /** herder背景色 */
  aogAppHeaderBgColor: string
  /** 基本背景色 */
  aogAppBaseBgColor: string
  /** 基本背景色1 */
  aogAppBaseBgColor1: string
  /** 基本买入色 */
  aogAppBaseBuyColor: string
  /** 基本卖出色 */
  aogAppBaseSellColor: string
  /** 基本供应色 */
  aogAppBaseSupplyFontColor: string
  /** 基本供应背景色 */
  aogAppBaseSupplyBgColor: string
  /** 基本需求色 */
  aogAppBaseDemandFontColor: string
  /** 基本需求背景色 */
  aogAppBaseDemandBgColor: string
  /** 基本字体色 */
  aogAppBaseFontColor: string
  /** 基本字体大小 */
  aogAppBaseFontSize: string
  /** 基本标题色 */
  aogAppBaseTitleFontColor: string
  /** 基本描述色 */
  aogAppBaseDescFontColor: string
  /** 基本标题大小 */
  aogAppBaseTitleFontSize: string
  /** 系统最小高度 */
  aogAppMinHeight: string
  /** 系统最小宽度 */
  aogAppMinWidth: string
  /** 系统头部高度 */
  aogAppHeaderHeight: string
  /** 系统弹窗圆角 */
  aogAppPopupBorderRadius: string
  /** 系统弹窗左右内间距 */
  aogAppPopupPadding: string
  /** 系统弹窗上下内间距 */
  aogAppPopupPadding1: string
  /** 系统申报交易记录 */
  aogAppRecordWidth: string
  /** 系统交易记录背景颜色 */
  aogAppRecordBgColor: string
  /** 系统交易记录边框颜色 */
  aogAppRecordBorderColor: string
  /** 系统交易记录标题高度 */
  aogAppRecordHeaderHeight: string
  /** 系统内容区域头部高度 */
  aogAppContentHeaderHeight: string
  /** 系统表格区域背景颜色 */
  aogAppTableContentBgColor: string
  /** 系统表格区域边框颜色 */
  aogAppTableContentBorderColor: string
  /** 输入框背景颜色 */
  aogAppInputBgColor: string
  /** element-ui 样式变量 */
  aogElColorPrimary: string
  /** 弹窗背景颜色 */
  aogAppDialogBgColor: string
  // 弹出框背景颜色
  aogElBgColorOverlay: string
  aogElBorderColorLight: string
  aogElColorPrimaryLight9: string
  aogElFillColorBlank: string
  aogElBorderColor: string
  aogElBorderColorHover: string
  aogElBorderColorLighter: string
  aogElTextColorSecondary: string
  aogElFillColorLight: string
  aogElColorInfoLight9: string
  aogElDisabledBgColor: string
  aogElDisabledBorderColor: string

  aogAppImageMimTitleBg: string
  aogAppImageContentTitleBg: string
  aogAppImageContentContainerHeaderBg: string
}

// 主线程与 Offscreen 通信消息类型
export type MainToOffscreenMessage =
  | { type: 'START_POLLING' }
  | { type: 'STOP_POLLING' }
  | { type: 'STATUS_CHECK' }

export type OffscreenToMainMessage =
  | { type: 'POLLING_DATA'; data: unknown; timestamp: number }
  | { type: 'STATUS'; status: 'RUNNING' | 'STOPPED' }
  | { type: 'ERROR'; error: string }
