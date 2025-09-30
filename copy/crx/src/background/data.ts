/**
 * @Author: zhangrui zhangrui@glhz.team
 * @Date: 2025-07-01 17:06:39
 * @Description: 获取数据
 */

import {
  buyBatchHuangCard,
  findTradeUnit,
  getTradeSeqInfo,
  sellBatchHuangCard,
} from '@/api'
import {
  TransactionTypeEnum,
  ActionType,
  TableActionEnum,
  TableNameEnum,
  TableStatusEnum,
  ControlPollingEnum,
  BuySellEnum,
} from '@/types/enum'
import type {
  EnergyRatesHourly,
  TransactionType,
  DeclarationHistory,
} from '@/utils/dexie'
import dayjs from 'dayjs'
import db from '@/utils/dexie'
import {
  getCurrentBMETType,
  getSystemCurrentDate,
  getCurrentListenType,
  getCurrentLoadDate,
  getCurrentType,
  getIsLoadData,
  getUKeyInfo,
  removeCurrentTabIdList,
  setCurrentBMETType,
  setCurrentListenType,
  setCurrentLoadDate,
  setCurrentTabIdList,
  setCurrentType,
  setIsLoadData,
  setSystemCurrentDate,
} from '@/utils/chomeStorage'
import offscreenController from './offscreenController'
import { sendMessageToTab } from '@/utils/chomeMessage'
import { CURRENT_LOAD_DATE, CURRENT_TYPE } from '@/constants'
import {
  clearTypeData,
  getCompatibleTabs,
  handleTokenExpiration,
  // transactionTypesClear,
} from './clearData'

import { v4 as uuidv4 } from 'uuid'
import { getDsbId, getRrhId } from '@/utils/app'

/**
 * 插件启动获取最新数据
 */
export async function getInitData(tab: chrome.tabs.Tab) {
  try {
    // 保存当前选项卡的id
    setCurrentTabIdList(tab.id!)
    const isLoadData = await getIsLoadData()
    let currentDate = ''
    let currentType: number | undefined
    let tradingUnitData: any[] = []
    let isChangeSystemDate: boolean = false
    if (!isLoadData) {
      // 获取交易分类
      const list = await getTradeSeqInfo().catch((err) => {
        if (err.status && err.status === 401) {
          handleTokenExpiration()
        }
        if (err.code == 'ERR_NETWORK') {
          // 断网 网络连接错误
          console.log('网络连接错误', err)
        }
        throw new Error('获取交易分类失败')
      })
      if (list && list.length > 0) {
        // transactionTypesClear()
        const systemCurrentDate = dayjs().format('YYYY-MM-DD')
        const oldDate = await getSystemCurrentDate()
        if (systemCurrentDate != oldDate) {
          setSystemCurrentDate(systemCurrentDate)
          isChangeSystemDate = true
        }
        // 处理交易分类数据
        const typeList = handleTradeSeqInfo(list)
        // 请求获取交易单元的数据
        tradingUnitData = await getTradingUnitData(typeList[0].seqId)
        // 清空之前的旧数据
        await clearTypeData(typeList, tradingUnitData, isChangeSystemDate)
        // 保存分类数据
        await db.transaction_types.bulkPut(typeList)
        // 指定当前的选中的日期
        const typeData = await db.transaction_types.toArray()

        let currentDate = ''
        let currentType: number | string = ''
        if (typeData && typeData.length > 0) {
          const item = typeData[0]
          currentType = item.seqId
          if (item.pdateList && item.pdateList.length > 0) {
            currentDate = item.pdateList[0].value
          } else {
            currentDate = dayjs(item.endDate, 'YYYY-MM-DD').format('YYYYMM')
          }
        }
        // 保存当前激活的日期
        setCurrentLoadDate(currentDate)
        setCurrentType(currentType)
        // 根据分类数据初始化 用户填报表(每时刻的电量电价)
        const userList = await initUserReport(typeList, tradingUnitData)
        // 保存数据
        await db.energy_rates_hourly.bulkPut(userList)

        // 获取需求和供应数据
        startPollingDeclarationData()
        setIsLoadData(true)
      } else {
        setIsLoadData(false)
        removeCurrentTabIdList(tab.id!)
      }
    } else {
      currentDate = await getCurrentLoadDate()
      currentType = await getCurrentType()
      tradingUnitData = await db.trading_unit_data.toArray()

      db.system_info.put({
        id: tab.id!,
        tabId: tab.id!,
        value: JSON.stringify({
          [CURRENT_LOAD_DATE]: currentDate,
          [CURRENT_TYPE]: currentType,
        }),
      })
    }

    // 获取当前历史数据
    // const historyList = await getCurrentDeclarationHistory()
    // console.log('historyList', historyList)
    // const energyRatesHourly = await getCurrentEnergyRatesHourly(
    //   currentType as any,
    //   currentDate
    // )

    // const demandSupplyBalance = await getCurrentDemandSupplyBalance(
    //   currentType as any,
    //   currentDate
    // )
    const typeData = await db.transaction_types.toArray()

    sendMessageToTab(tab.id!, {
      action: ActionType.INIT_DATA_REQUEST_SUCCESS,
      data: {
        typeList: typeData,
        tabId: tab.id,
        // historyList,
        currentDate,
        currentType,
        tradingUnitData: tradingUnitData,
        // energyRatesHourly,
        // demandSupplyBalance,
      },
    })
  } catch (error: any) {
    if (error.status && error.status === 401) {
      handleTokenExpiration()
    }
  }
}

async function getTradingUnitData(seqId: any) {
  // 请求获取交易单元的数据
  db.trading_unit_data.clear()
  return new Promise<any[]>((resolve) => {
    findTradeUnit({
      seqId: seqId,
    })
      .then((res: any) => {
        db.trading_unit_data.bulkPut(res)
        resolve(res)
      })
      .catch((err) => {
        if (err.status && err.status === 401) {
          handleTokenExpiration()
        }
        if (err.code == 'ERR_NETWORK') {
          // 断网 网络连接错误
          console.log('网络连接错误', err)
        }
        resolve([])
      })
  })
}

function handleTradeSeqInfo(list: any[]) {
  const currentDay = dayjs()
  const currentDayList = list
    .filter(
      (item) => !dayjs(item.endDate, 'YYYY-MM-DD').isBefore(currentDay, 'day')
    )
    .filter(
      (item) => !item.seqName.startsWith(`${dayjs().format('YYYY年')}年度`)
    )
  //  分类整理
  /**
   * DUDT: 直接交易
   * DMDET: 直接电量多日交易
   * BMET: 代购多日交易
   */
  const typeList: TransactionType[] = []

  currentDayList.forEach((item) => {
    for (const key in TransactionTypeEnum) {
      const type: any = (TransactionTypeEnum as any)[key]
      if (item.seqName.includes(type.contain)) {
        const _index = typeList.findIndex(
          (item) => item.transactionType === type.value
        )
        if (_index > -1) {
          const typeItem = typeList[_index]

          const dateOld = dayjs(typeItem.endDate, 'YYYY-MM-DD')
          const dateNew = dayjs(item.endDate, 'YYYY-MM-DD')

          if (dateOld.isBefore(dateNew)) {
            // 删除旧的
            typeList.splice(_index, 1)
            // 添加新的
            typeList.push(createType(item, type.value))
          }
        } else {
          typeList.push(createType(item, type.value))
        }
      }
    }
  })

  //  过滤 取最新的

  return typeList
}

function createType(item: any, transactionType: string) {
  return {
    seqName: item.seqName,
    seqId: item.seqId,
    endDate: item.endDate,
    startDate: item.startDate,
    pdateList: item.pdateList,
    transactionType: transactionType,
    aogDate: dayjs(item.endDate, 'YYYY-MM-DD').format('YYYYMM'),
  }
}

/**
 * 生成用户填报数据
 * @param list
 */
async function initUserReport(list: any[], tradingUnitData: any[]) {
  const userList: EnergyRatesHourly[] = []
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item.pdateList && item.pdateList.length > 0) {
      for (let j = 0; j < item.pdateList.length; j++) {
        const pdate = item.pdateList[j]
        const list = await createUserData(
          item,
          pdate.value,
          '1',
          tradingUnitData
        )
        userList.push(...list)
      }
    } else {
      const list = await createUserData(
        item,
        item.aogDate,
        '2',
        tradingUnitData
      )
      userList.push(...list)
    }
  }
  return Promise.resolve(userList)
}

async function createUserData(
  item: any,
  date: string,
  type: string = '1',
  tradingUnitData: any[]
): Promise<EnergyRatesHourly[]> {
  const list: EnergyRatesHourly[] = []

  for (let i = 0; i < 24; i++) {
    const code =
      type == '1'
        ? `D${date}_H${i.toString().padStart(2, '0')}`
        : `H_${i.toString().padStart(2, '0')}`

    for (let j = 0; j < tradingUnitData.length; j++) {
      const tradingUnit = tradingUnitData[j]
      const id = getRrhId(code, item.seqId, tradingUnit.tradeUnitId)
      const dsbId = getDsbId(code, item.seqId)
      const has = await db.energy_rates_hourly.get(id)
      if (!has) {
        list.push({
          erhId: id,
          seqId: item.seqId,
          dsbId: dsbId,
          tradeUnitId: tradingUnit.tradeUnitId,
          tradeUnitName: tradingUnit.tradeUnitName,
          code,
          hour: `H_${i.toString().padStart(2, '0')}`,
          date: date,
        })
      }
    }
  }

  return Promise.resolve(list)
}

export async function getCurrentDeclarationHistory(
  date?: string
): Promise<DeclarationHistory[]> {
  const _date = date || dayjs().format('YYYY-MM-DD')
  const list = await db.declaration_history
    .where('date')
    .equals(_date)
    .toArray()
  return list
}

export function startPollingDeclarationData() {
  console.log('开始运行')

  offscreenController.startPolling()
}

export function stopPollingDeclarationData() {
  offscreenController.stopPolling()
}

export async function getTableFormData(request: any) {
  // 获取表格数据
  const tableData = await getEnergyRatesHourly(request)
  // 获取当前类型的表单数据
  const formData = await getFormDataBySedId(request.data.seqId)
  const demandSupplyBalance = await getCurrentDemandSupplyBalance(
    request.data.seqId,
    request.data.date
  )
  // 保存当前的seqId
  setCurrentType(request.data.seqId)
  return Promise.resolve({
    tableData,
    formData,
    demandSupplyData: demandSupplyBalance,
  })
}

export async function getTableData(request: any) {
  switch (request.table) {
    case TableNameEnum.transaction_types:
      return getTransactionTypes(request)
    case TableNameEnum.demand_supply_balance:
      return getDemandSupplyBalance(request)
    case TableNameEnum.energy_rates_hourly:
      return getEnergyRatesHourly(request)
    case TableNameEnum.declaration_history:
      return getDeclarationHistory(request)
    case TableNameEnum.user_form_data:
      return getUserFormData(request)
    default:
      return null
  }
}

export async function getUserFormData(request: any) {
  console.log(request)
}

export async function getDeclarationHistory(request: any) {
  switch (request.action) {
    case TableActionEnum.all:
      return db.declaration_history.toArray()
    case TableActionEnum.current:
      return getCurrentDeclarationHistory(request.data.date)
    default:
      break
  }
}

export async function getTransactionTypes(request: any) {
  switch (request.action) {
    case TableActionEnum.all:
      return getAllTransactionTypes()
    default:
      break
  }
}

export async function getDemandSupplyBalance(request: any) {
  switch (request.action) {
    case TableActionEnum.all:
      return db.demand_supply_balance.toArray()
    case TableActionEnum.current:
      return getCurrentDemandSupplyBalance(
        request.data.seqId,
        request.data.date
      )
    case TableActionEnum.currentSeqId:
      return getCurrentDemandSupplyBalanceBySeqId(request.data.seqId)
    default:
      break
  }
}

export async function getEnergyRatesHourly(request: any) {
  switch (request.action) {
    case TableActionEnum.all:
      return db.energy_rates_hourly.toArray()
    case TableActionEnum.current:
      // 先保存数据
      db.system_info.put({
        id: request.data.tabId,
        tabId: request.data.tabId,
        value: JSON.stringify({
          [CURRENT_LOAD_DATE]: request.data.date,
          [CURRENT_TYPE]: request.data.seqId,
        }),
      })
      return getCurrentEnergyRatesHourly(
        request.data.seqId,
        request.data.tradingUnitId,
        request.data.date
      )
    default:
      break
  }
}

export async function getCurrentTabDemandSupplyData(tabId: number) {
  const data = await db.system_info.where('tabId').equals(tabId).first()
  if (data && data.value) {
    const value = JSON.parse(data.value)
    return getCurrentDemandSupplyBalance(
      value[CURRENT_TYPE],
      value[CURRENT_LOAD_DATE]
    )
  }

  return Promise.resolve([])
}

/**
 * @returns 查询所有的交易类型
 */
export async function getAllTransactionTypes() {
  return db.transaction_types.toArray()
}

export async function getCurrentDemandSupplyBalance(
  seqId: string,
  date?: string
) {
  if (date) {
    return db.demand_supply_balance
      .where('[seqId+date]')
      .equals([seqId, date])
      .toArray()
  } else {
    return db.demand_supply_balance.where('seqId').equals(seqId).toArray()
  }
}

export async function getCurrentDemandSupplyBalanceBySeqId(seqId: string) {
  return db.demand_supply_balance.where('seqId').equals(seqId).toArray()
}

export async function getCurrentEnergyRatesHourly(
  seqId: string,
  tradingUnitId: string,
  date?: string
) {
  if (date) {
    return db.energy_rates_hourly
      .where('[seqId+date+tradeUnitId]')
      .equals([seqId, date, tradingUnitId])
      .toArray()
  } else {
    return db.energy_rates_hourly
      .where('[seqId+tradeUnitId]')
      .equals([seqId, tradingUnitId])
      .toArray()
  }
}

export async function getFormDataBySedId(seqId: any) {
  const data = await db.user_form_data.where('seqId').equals(seqId).first()
  if (data && data.value) {
    return Promise.resolve(data.value)
  }
  return Promise.resolve(null)
}

export async function saveTableData(request: any) {
  if (request.data.seqId && request.data.value) {
    await db.user_form_data
      .put({
        seqId: request.data.seqId,
        value: request.data.value,
      })
      .catch((error) => {
        console.error(error)
      })
  }
  return Promise.resolve('保存成功')
}

/**
 * 保存表格数据
 * @param request
 * @returns
 */
export async function saveTableDataByKey(request: any) {
  if (request.data.erhId && request.data.key) {
    await db.energy_rates_hourly.update(request.data.erhId, {
      [request.data.key]: request.data.value,
    })
  }

  const keys = ['price', 'electricity', 'type']
  if (keys.includes(request.data.key)) {
    const data = await db.energy_rates_hourly.get(request.data.erhId)
    if (data) {
      const listenTypes = await getCurrentListenType()
      if (
        listenTypes.includes(data!.seqId) &&
        data.price &&
        data.type &&
        data.electricity
      ) {
        await db.energy_rates_hourly.update(data.erhId, {
          status: TableStatusEnum.UM,
        })
        // 告诉插件更新数据
        sendMessageToTabByGetTableList()
      }
    }
  }

  return Promise.resolve('保存成功')
}

/**
 * 点击开始
 * @param request
 */
export async function handleStartType(request: any) {
  if (request.data.transactionType == TransactionTypeEnum.BMET.value) {
    // 批量申报 按照时间批量申报
    handleStartBatchDeclare(request.data)
    return Promise.resolve('启用成功')
  }
  const listenTypes = await getCurrentListenType()
  if (!listenTypes.includes(request.data.seqId)) {
    listenTypes.push(request.data.seqId)
    setCurrentListenType(listenTypes)
  }
  if (request.data.transactionType != TransactionTypeEnum.BMET.value) {
    // 修改table的状态
    updateTableStatus(request.data, ControlPollingEnum.start)
  }
  return Promise.resolve('启用成功')
}
/**
 * 点击结束
 * @param request
 */
export async function handleStopType(request: any) {
  if (request.data.transactionType == TransactionTypeEnum.BMET.value) {
    // 批量申报 结束按照时间批量申报
    handleStopBatchDeclare(request.data)
    return Promise.resolve('停止成功')
  }
  const listenTypes = await getCurrentListenType()

  if (listenTypes.includes(request.data.seqId)) {
    listenTypes.splice(listenTypes.indexOf(request.data.seqId), 1)
    setCurrentListenType(listenTypes)
  }
  if (request.data.transactionType != TransactionTypeEnum.BMET.value) {
    // 修改table的状态
    updateTableStatus(request.data, ControlPollingEnum.stop)
  }
  return Promise.resolve('停止成功')
}

export async function updateTableStatus(data: any, status: string) {
  if (status == ControlPollingEnum.stop) {
    const list = await db.energy_rates_hourly
      .where('seqId')
      .equals(data.seqId)
      .and((data) => {
        return Boolean(
          data.status == TableStatusEnum.UM ||
            data.status == TableStatusEnum.PENDING
        )
      })
      .toArray()
    db.energy_rates_hourly.bulkUpdate(
      list.map((item) => ({
        key: item.erhId,
        changes: {
          status: '',
        },
      }))
    )
  }
  if (status == ControlPollingEnum.start) {
    const list = await db.energy_rates_hourly
      .where('seqId')
      .equals(data.seqId)
      .and((data) => {
        return Boolean(
          data.status != TableStatusEnum.COM &&
            data.status != TableStatusEnum.DEC &&
            data.type &&
            data.electricity &&
            data.price
        )
      })
      .toArray()

    db.energy_rates_hourly.bulkUpdate(
      list.map((item) => ({
        key: item.erhId,
        changes: {
          status: TableStatusEnum.UM,
        },
      }))
    )
  }
  // --- 保存历史记录
  db.declaration_history.add({
    seqId: data.seqId,
    date: dayjs().format('YYYY-MM-DD'),
    dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    action_type_name: data.seqName,
    action_status: status,
  })
  // 告诉插件更新数据
  sendMessageToTabByGetTableList()
}

/**
 * 开始批量申报
 * @param data
 */
async function handleStartBatchDeclare(data: any) {
  const listenTypes = await getCurrentBMETType()
  if (!listenTypes.includes(data.seqId)) {
    // 获取当前的批量申报时间
    const formData = await db.user_form_data.get(data.seqId)
    if (formData && formData.value) {
      const declarationTime = JSON.parse(formData.value).declarationTime
      if (declarationTime) {
        const _dateTime = dayjs().format('YYYY-MM-DD') + ' ' + declarationTime
        // 设置倒计时
        chrome.alarms.create(data.seqId.toString(), {
          when: dayjs(_dateTime, 'YYYY-MM-DD HH:mm:ss').valueOf(),
        })
        listenTypes.push(data.seqId)
        setCurrentBMETType(listenTypes)
        // --- 保存历史记录
        db.declaration_history.add({
          seqId: data.seqId,
          date: dayjs().format('YYYY-MM-DD'),
          dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          action_type_name: data.seqName,
          action_status: ControlPollingEnum.start,
        })
        // 告诉插件更新数据
        sendMessageToTabByGetTableList()

        return true
      }
    }
  }
  throw new Error('启动失败')
}

/**
 * 停止批量申报
 * @param data
 */
async function handleStopBatchDeclare(data: any) {
  const listenTypes = await getCurrentBMETType()
  if (listenTypes.includes(data.seqId)) {
    listenTypes.splice(listenTypes.indexOf(data.seqId), 1)
    setCurrentBMETType(listenTypes)
    // --- 保存历史记录
    db.declaration_history.add({
      seqId: data.seqId,
      date: dayjs().format('YYYY-MM-DD'),
      dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      action_type_name: data.seqName,
      action_status: ControlPollingEnum.stop,
    })
    // 结束倒计时
    chrome.alarms.clear(data.seqId.toString())
  }
}

chrome.alarms.onAlarm.addListener((alarm) => {
  // 执行批量申报逻辑
  // console.log(`闹钟 "${alarm.name}" 已触发`)
  if (!alarm.name) return
  const seqId = parseInt(alarm.name)

  handleBatchDeclare(seqId)
})

async function handleBatchDeclare(seqId: number) {
  const userList = await db.energy_rates_hourly
    .where('seqId')
    .equals(seqId)
    .filter(
      (item) =>
        item.type !== undefined &&
        item.type !== null &&
        item.electricity !== undefined &&
        item.electricity !== null &&
        item.price !== undefined &&
        item.price !== null
    )
    .toArray() // toArray() 将结果转换为数组
  // 过滤为 买入 和 卖出 的申报数据
  const buy_epvos: any[] = []
  const sell_epvos: any[] = []
  const tradeUnitObj: any = {}

  userList.forEach((item) => {
    const obj = {
      code: item.code,
      energy: item.electricity,
      price: item.price,
      fdPrice: item.fdPrice || '',
      pdPrice: item.pdPrice || '',
      gdPrice: item.gdPrice || '',
      tradeUnitId: item.tradeUnitId,
    }
    tradeUnitObj[item.tradeUnitId] = item.tradeUnitName

    if (item.type === BuySellEnum.buy) {
      buy_epvos.push(obj)
    } else if (item.type === BuySellEnum.sell) {
      sell_epvos.push(obj)
    }
  })

  // 按照交易单元 分类数据
  const buy_tradeUnit_map = new Map<string, any[]>()
  const sell_tradeUnit_map = new Map<string, any[]>()

  buy_epvos.forEach((item) => {
    const key = item.tradeUnitId
    if (!buy_tradeUnit_map.has(key)) {
      buy_tradeUnit_map.set(key, [])
    }
    delete item.tradeUnitId
    buy_tradeUnit_map.get(key)!.push(item)
  })

  sell_epvos.forEach((item) => {
    const key = item.tradeUnitId
    if (!sell_tradeUnit_map.has(key)) {
      sell_tradeUnit_map.set(key, [])
    }
    delete item.tradeUnitId
    sell_tradeUnit_map.get(key)!.push(item)
  })

  const uKeyInfo = await getUKeyInfo()
  // 封装请求参数
  const promises: Promise<any>[] = []

  const success_map = new Map<string, string[]>()
  const fail_map = new Map<string, string[]>()

  buy_tradeUnit_map.forEach((epvos, tradeUnitId) => {
    const params = {
      seqId: seqId,
      tradeUnitId: tradeUnitId,
      epvos: epvos,
      type: '1',
      codeMonth: '',
      declareCode: uuidv4(),
      batchType: 1,
      appUsrCertNO: uKeyInfo.AppUsrCertNO,
      subjectCN: uKeyInfo.subjectCN,
      subjectO: uKeyInfo.subjectO,
    }

    const promise = new Promise((resolve) => {
      buyBatchHuangCard(params)
        .then((res) => {
          if (!success_map.has(tradeUnitId)) {
            success_map.set(tradeUnitId, [])
          }
          success_map.get(tradeUnitId)?.push(...epvos.map((item) => item.code))
          resolve(res)
        })
        .catch((err) => {
          if (!fail_map.has(tradeUnitId)) {
            fail_map.set(tradeUnitId, [])
          }
          fail_map.get(tradeUnitId)?.push(...epvos.map((item) => item.code))
          resolve(err)
        })
      // if (!success_map.has(tradeUnitId)) {
      //   success_map.set(tradeUnitId, [])
      // }
      // success_map.get(tradeUnitId)?.push(...epvos.map((item) => item.code))
      // resolve(params)
    })

    promises.push(promise)
  })

  sell_tradeUnit_map.forEach((epvos, tradeUnitId) => {
    const params = {
      seqId: seqId,
      tradeUnitId: tradeUnitId,
      epvos: epvos,
      type: '1',
      codeMonth: '',
      declareCode: uuidv4(),
      batchType: 1,
      appUsrCertNO: uKeyInfo.AppUsrCertNO,
      subjectCN: uKeyInfo.subjectCN,
      subjectO: uKeyInfo.subjectO,
    }

    const promise = new Promise((resolve) => {
      sellBatchHuangCard(params)
        .then((res) => {
          if (!success_map.has(tradeUnitId)) {
            success_map.set(tradeUnitId, [])
          }
          success_map.get(tradeUnitId)?.push(...epvos.map((item) => item.code))
          resolve(res)
        })
        .catch((err) => {
          if (!fail_map.has(tradeUnitId)) {
            fail_map.set(tradeUnitId, [])
          }
          fail_map.get(tradeUnitId)?.push(...epvos.map((item) => item.code))
          resolve(err)
        })
      // if (!fail_map.has(tradeUnitId)) {
      //   fail_map.set(tradeUnitId, [])
      // }
      // fail_map.get(tradeUnitId)?.push(...epvos.map((item) => item.code))
      // resolve(params)
    })

    promises.push(promise)
  })

  // 等待所有的请求完成
  await Promise.all(promises)
  const result =
    '批量申报完成, 成功：' +
    (Array.from(success_map.entries())
      .map(
        ([tradeUnitId, codes]) =>
          `${tradeUnitObj[tradeUnitId]}：${codes.join(', ')}`
      )
      .join('；') || '无') +
    '；失败：' +
    (Array.from(fail_map.entries())
      .map(
        ([tradeUnitId, codes]) =>
          `${tradeUnitObj[tradeUnitId]}：${codes.join(', ')}`
      )
      .join('；') || '无')
  // 保存申报历史记录
  db.declaration_history.add({
    seqId: seqId,
    date: dayjs().format('YYYY-MM-DD'),
    dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    status: TableStatusEnum.DEC, // 申报
    result: result,
  })

  // 清空正在监听的数据
  const listenTypes = await getCurrentBMETType()
  listenTypes.splice(listenTypes.indexOf(seqId), 1)
  await setCurrentBMETType(listenTypes)
  // 通知插件更新数据
  sendMessageToTabByGetTableList()
}

/**
 * 去申报数据
 * @param request
 */
export async function handleGoToDeclare(request: any) {
  if (!request.data || !request.data.erhId) return
  // 申报成功 往table的result塞数据

  // 获取id
  const data = await db.energy_rates_hourly.get(request.data.erhId)
  if (!data) return
  const uKeyInfo = await getUKeyInfo()
  // 请求接口开始申报

  const params = {
    seqId: data.seqId,
    tradeUnitId: data.tradeUnitId,
    epvos: [
      {
        code: data.code,
        energy: data.electricity,
        price: request.data.price || data.price,
        fdPrice: '',
        pdPrice: '',
        gdPrice: '',
      },
    ],
    type: '1',
    codeMonth: '',
    declareCode: uuidv4(),
    batchType: 0,
    appUsrCertNO: uKeyInfo.AppUsrCertNO,
    subjectCN: uKeyInfo.subjectCN,
    subjectO: uKeyInfo.subjectO,
  }

  let api: any
  // 买入
  if (data.type == BuySellEnum.buy) {
    api = buyBatchHuangCard
  }
  // 卖出
  if (data.type == BuySellEnum.sell) {
    api = sellBatchHuangCard
  }
  const history_result = `${data.tradeUnitName} ${data.code} `
  api(params)
    .then(async (_res: any) => {
      const result = getTableResult(data, params)
      db.declaration_history.add({
        seqId: data.seqId,
        date: dayjs().format('YYYY-MM-DD'),
        dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        code: data.code,
        type: data.type,
        status: TableStatusEnum.DEC, // 申报
        tradeUnitId: data.tradeUnitId,
        tradeUnitName: data.tradeUnitName,
        result: history_result + result,
      })

      await db.energy_rates_hourly.update(request.data.erhId, {
        electricity: undefined,
        price: undefined,
        type: '', // 申报成功后 清空 电量 电价 以及申报类型
        status: TableStatusEnum.DEC,
        transactionDateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        transactionResult: result,
      })
      // 通知插件更新数据
      sendMessageToTabByGetTableList()
    })
    .catch(async (errData: any) => {
      db.declaration_history.add({
        seqId: data.seqId,
        date: dayjs().format('YYYY-MM-DD'),
        dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        code: data.code,
        type: data.type,
        status: TableStatusEnum.DEC, // 申报
        result: history_result + (errData.msg || '申报失败'),
        tradeUnitId: data.tradeUnitId,
        tradeUnitName: data.tradeUnitName,
      })

      await db.energy_rates_hourly.update(request.data.erhId, {
        status: TableStatusEnum.ERROR,
        transactionDateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        transactionResult: errData.msg || '申报失败',
      })
      // 通知插件更新数据
      sendMessageToTabByGetTableList()
    })
    .finally(() => {})
}

/**
 * 告诉插件更新列表数据
 */
export function sendMessageToTabByGetTableList() {
  getCompatibleTabs().then((ids) => {
    ids.forEach((id) => {
      sendMessageToTab<unknown>(id!, {
        action: ActionType.GET_TABLE_LIST,
        data: {
          type: 'table/history',
        },
      }).catch(() => {})
    })
  })
}

export async function handleBatchFilling(request: any) {
  if (!request.data.seqId || !request.data.date) throw new Error('参数错误')
  const formData = request.data.formData
  if (!formData) throw new Error('参数错误')
  await db.energy_rates_hourly
    .where('[seqId+date]')
    .equals([request.data.seqId, request.data.date])
    .filter((item) => formData.times.includes(item.hour)) // 再筛选 hour
    .modify({
      electricity: formData.electricity,
      price: formData.price,
      type: formData.type,
    }) // 批量更新
  // 通知插件更新数据
  sendMessageToTabByGetTableList()
  return Promise.resolve('更新成功')
}

function getTableResult(data: any, params: any) {
  return `申报${data.type == BuySellEnum.buy ? '买入' : '卖出'}电量：${params.epvos[0].energy}，电价：${params.epvos[0].price}`
}
