// src/db/index.ts
import Dexie from 'dexie'
import { TableNameEnum } from '@/types/enum'

export interface SystemInfo {
  id: number | string
  value: any
  tabId?: number
}

export interface TransactionType {
  seqId: number
  transactionType: string
  aogDate: string
  [key: string]: any
}

export interface EnergyRatesHourly {
  erhId: string
  dsbId: string
  seqId: number
  date: string
  tradeUnitId: string // 交易单元ID
  type?: string // 1表示
  status?: string
  electricity?: number
  price?: number
  hour?: string
  transactionDateTime?: string // 申报时间
  transactionElectricity?: number // 申报电量
  transactionPrice?: number // 申报电价
  transactionResult?: string // 申报结果
  dealElectricity?: string // 成交电量
  dealPrice?: string // 成交电价
  dealDateTime?: string // 成交时间
  dealCount?: number // 成交次数
  dealResult?: string // 成交结果
  planElectricity?: number // 计划电量
  remainElectricity?: number // 剩余电量
  code: string
  [key: string]: any
}

export interface DemandSupplyBalance {
  dsbId: string
  seqId: number
  code: string
  date: string
  demand1_price: string //需求1电价
  demand1_dumpenergy: string //需求1电量
  supply1_price: string //供应1电价
  supply1_dumpenergy: string //供应1电量
  hour?: string
  [key: string]: any
}

export interface TradingUnit {
  tradeUnitId: string
  tradeUnitName: string
  propType: string
  propId: string
  propName: string
  groupName: string
  [key: string]: any
}

/**
 * 用户配置数据
 */
export interface UserFormData {
  seqId: number | string
  value: any
}

export interface DeclarationHistory {
  id?: number
  dateTime: string // 时间
  date: string
  seqId: number
  code?: string // 交易code
  result?: string // 结果
  type?: string // 类型 买入 卖出
  status?: string // 状态 申报 或者成交
  action_status?: string //   启动 停止
  action_type_name?: string
  tradeUnitId?: string
  tradeUnitName?: string
  [key: string]: any
}

class MyDatabase extends Dexie {
  public system_info!: Dexie.Table<SystemInfo, number | string>
  /** 交易类型表 */
  public transaction_types!: Dexie.Table<TransactionType, number>
  /** 用户填报表(每时刻的电量电价) */
  public energy_rates_hourly!: Dexie.Table<EnergyRatesHourly, string>
  /** 交易中心的需求1 供应1 数据  */
  public demand_supply_balance!: Dexie.Table<DemandSupplyBalance, string>
  /** 申报历史表 */
  public declaration_history!: Dexie.Table<DeclarationHistory, number>

  public user_form_data!: Dexie.Table<UserFormData, number>
  // 交易单元
  public trading_unit_data!: Dexie.Table<TradingUnit, string>

  constructor() {
    super('AogAppDB') // 数据库名称
    this.version(1).stores({
      [TableNameEnum.system_info]: 'id, id, tabId',
      [TableNameEnum.transaction_types]: 'seqId, seqId', // 定义表结构
      [TableNameEnum.energy_rates_hourly]:
        'erhId, erhId, [seqId+date], seqId, hour, [seqId+code], tradeUnitId, [seqId+date+tradeUnitId], [seqId+tradeUnitId]', // 定义表结构
      [TableNameEnum.demand_supply_balance]:
        'dsbId, dsbId, [seqId+date], seqId, hour, tradeUnitId', // 定义表结构
      [TableNameEnum.declaration_history]: '++id, id, date, dateTime, seqId', // 定义表结构
      [TableNameEnum.user_form_data]: 'seqId, seqId',
      [TableNameEnum.trading_unit_data]: 'tradeUnitId, tradeUnitId', // 交易单元数据
    })
  }
}

// 导出单例
const db = new MyDatabase()
export default db
