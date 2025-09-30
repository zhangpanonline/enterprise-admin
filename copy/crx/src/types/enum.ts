// src/types/enum.ts

// ActionTypeEnum 替换为常量对象 + 类型
export const ActionType = {
  SHOW_POPUP: 'SHOW_POPUP', // 首次打开
  CLOSE_POPUP: 'CLOSE_POPUP', // 最小化
  STOP_POPUP: 'STOP_POPUP', // 彻底关闭
  RESTORE_POPUP: 'RESTORE_POPUP', // 恢复
  INIT_DATA_REQUEST_SUCCESS: 'INIT_DATA_REQUEST_SUCCESS', // 数据加载完成
  GET_TABLE_DATA: 'GET_TABLE_DATA', // 获取表格数据
  SAVE_TABLE_DATA_BY_KEY: 'SAVE_TABLE_DATA_BY_KEY', // 保存表格填写的数据
  GET_TABLE_FORM_DATA: 'GET_TABLE_FORM_DATA', // 获取表单数据
  SAVE_TABLE_FORM_DATA: 'SAVE_TABLE_FORM_DATA', // 保存表单数据
  GET_START_TYPES: 'GET_START_TYPES', // 获取当前启动监听的id
  START_TYPE: 'START_TYPE', // 启动监听
  STOP_TYPE: 'STOP_TYPE', // 停止监听
  CONTROL_POLLING: 'CONTROL_POLLING', // 接口控制轮询
  UPDATE_DEMAND_SUPPLY: 'UPDATE_DEMAND_SUPPLY', // 需求和供应数据请求完成
  TOKEN_EXPIRATION: 'TOKEN_EXPIRATION', // token过期
  SHOW_MESSAGE: 'SHOW_MESSAGE', // 告知页面展示消息
  GET_TABLE_LIST: 'GET_TABLE_LIST', // 获取表格列表数据
  BATCH_FILLING: 'BATCH_FILLING', // 批量填写 电价 电量
  REFRESH_TYPE_DATA: 'REFRESH_TYPE_DATA', // 刷新类型数据
  UPDATE_TABLE_DATA: 'UPDATE_TABLE_DATA', // 更新表格数据
  REQUEST_PROXY: 'REQUEST_PROXY', // 后台接口转发到前台进行请求
  OFF_SCREEN_REQUEST_PROXY: 'OFF_SCREEN_REQUEST_PROXY', // offscreen接口转发到后台,后台再转发前台请求
} as const

export type ActionTypeEnum = (typeof ActionType)[keyof typeof ActionType]

export const MessageType = {
  // 需求供应数据更新成功
  DEMAND_SUPPLY_REQUEST_SUCCESS: 'DEMAND_SUPPLY_REQUEST_SUCCESS',
  GO_TO_DECLARE: 'GO_TO_DECLARE',
  UPDATE_TYPE_DATA: 'UPDATE_TYPE_DATA',
} as const

export type MessageTypeEnum = (typeof MessageType)[keyof typeof MessageType]

/**
 * 交易类型枚举
 */
export const TransactionTypeEnum = {
  DUDT: {
    value: 'DUDT',
    contain: '直接交易',
  },
  DMDET: {
    value: 'DMDET',
    contain: '直接电量多日交易',
  },
  BMET: {
    value: 'BMET',
    contain: '代购多日交易',
  },
}

export const BuySellEnum = {
  buy: '1', // 买
  sell: '2', // 卖
}

export const ControlPollingEnum = {
  start: 'start',
  stop: 'stop',
}

export const TableNameEnum = {
  system_info: 'system_info',
  transaction_types: 'transaction_types',
  energy_rates_hourly: 'energy_rates_hourly',
  demand_supply_balance: 'demand_supply_balance',
  declaration_history: 'declaration_history',
  user_form_data: 'user_form_data',
  trading_unit_data: 'trading_unit_data', // 交易单元数据
}

export const TableActionEnum = {
  all: 'all',
  current: 'current',
  currentSeqId: 'currentSeqId',
}

/**
 * Under monitoring

declare

deal
 */

export const TableStatusEnum = {
  /**检测中 */
  UM: 'UM',
  // 正在去申报
  PENDING: 'PENDING',
  /**申报 */
  DEC: 'DEC',
  /** 成交 */
  COM: 'COM',
  // 申报失败
  ERROR: 'ERROR',
}
