import db from '@/utils/dexie'
import { stopPollingDeclarationData } from './data'
import {
  clearCurrentBMETType,
  clearCurrentListenType,
  clearCurrentLoadDate,
  clearCurrentTabIdList,
  clearCurrentType,
  clearMinimizeTabIdList,
  clearToken,
  getCurrentTabIdList,
  removeCurrentTabIdList,
  removeMinimizeTabIdList,
  setCurrentBMETType,
  setCurrentListenType,
  setIsLoadData,
  setMinimizeTabIdList,
} from '@/utils/chomeStorage'
import { sendMessageToTab } from '@/utils/chomeMessage'
import { ActionType, TableStatusEnum } from '@/types/enum'
import dayjs from 'dayjs'

export async function initClearData() {
  clearCurrentTabIdList()
  clearMinimizeTabIdList()
  setIsLoadData(false)
  db.system_info.clear()
  db.declaration_history.clear()
  energyRatesHourlyStatus()
}

/**
 * 清楚数据
 * @param tabId
 */
export function deleteDataByTabId(tabId: number) {
  db.system_info.delete(tabId)
}

export function transactionTypesClear() {
  // 删除旧数据
  // db.demand_supply_balance.clear()
  // db.transaction_types.clear()
}

export async function clearTypeData(
  typeList: any[],
  tradingUnitData: any[],
  isChangeSystemDate: boolean
) {
  const seqIds = typeList.map((item) => item.seqId)
  const tradeUnitIds = tradingUnitData.map((item) => item.tradeUnitId)

  await db.user_form_data.where('seqId').noneOf(seqIds).delete()

  // 判断日期 删除与当前日期不一致的数据
  if (isChangeSystemDate) {
    await db.transaction_types.clear()
    await db.demand_supply_balance.clear()
    await db.energy_rates_hourly.clear()
    await db.declaration_history.clear()
  } else {
    await db.transaction_types.where('seqId').noneOf(seqIds).delete()
    // 清空旧需求供应数据数据
    await db.demand_supply_balance.where('seqId').noneOf(seqIds).delete()
    // 清空旧表格数据
    await db.energy_rates_hourly.where('seqId').noneOf(seqIds).delete()
    await db.energy_rates_hourly
      .where('tradeUnitId')
      .noneOf(tradeUnitIds)
      .delete()
    await db.declaration_history.where('seqId').noneOf(seqIds).delete()
    await db.declaration_history
      .where('date')
      .notEqual(dayjs().format('YYYY-MM-DD'))
      .delete()
  }
}

/**
 * token 过期
 */
export async function handleTokenExpiration(_request?: any) {
  // 处理token过期
  // 如果存在轮询 则停止
  stopPollingDeclarationData()
  // 删除token
  clearToken()
  // 通知页面
  // sendMessageToTab<unknown>(tabId, {
  //   action: ActionType.SHOW_MESSAGE,
  //   data: {
  //     type: MessageType.TOKEN_EXPIRATION,
  //   },
  // })

  getCompatibleTabs().then((ids) => {
    ids.forEach((id) => {
      sendMessageToTab<unknown>(id, {
        action: ActionType.SHOW_MESSAGE,
        type: ActionType.TOKEN_EXPIRATION,
        data: {
          title: '认证失败',
          message: '登录已过期，请重新登录',
          type: 'waring',
          showCancelButton: true,
          confirmButtonText: '重新登录',
          cancelButtonText: '关闭应用',
        },
      }).catch(() => {})
    })
  })
}

/**
 * 停止运行
 */
export async function handleStopRun(request: any) {
  if (request.data.tabId) {
    await removeTabId(request.data.tabId)
  }
}

export async function removeTabId(tabId: number) {
  const list = await removeCurrentTabIdList(tabId)
  const minimizeList = await removeMinimizeTabIdList(tabId)

  // 清楚缓存
  deleteDataByTabId(tabId)

  if (list.length === 0 && minimizeList.length === 0) {
    // 如果存在轮询 则停止
    stopPollingDeclarationData()
    // 删除token
    clearToken()
    // setCurrentListenType setCurrentBMETType
    setCurrentListenType([])
    setCurrentBMETType([])
    setIsLoadData(false)
    clearCurrentType()
    clearCurrentBMETType()
    clearCurrentListenType()
    clearCurrentLoadDate()
    // await db.system_info.clear()
    energyRatesHourlyStatus()
  }
}

export async function handleMinimize(request: any) {
  removeCurrentTabIdList(request.data.tabId)
  setMinimizeTabIdList(request.data.tabId)
}
/**
 * 获取当前激活的页面
 * @returns
 */
export function getCompatibleTabs(): Promise<number[]> {
  return new Promise((resolve) => {
    getCurrentTabIdList().then((list) => {
      resolve(list)
    })

    // 从manifest中获取content_scripts匹配的所有URL模式
    // const manifest = chrome.runtime.getManifest()
    // const matches = manifest.content_scripts?.[0]?.matches || ['<all_urls>']
    // chrome.tabs.query({}, (allTabs) => {
    //   // 过滤出符合匹配规则的标签页
    //   const compatibleTabs = allTabs.filter((tab) => {
    //     const url = tab.url // 可能为 undefined
    //     if (!url) return false
    //     return matches.some((pattern) => {
    //       try {
    //         return new URLPattern(pattern).test(url)
    //       } catch {
    //         // 简单匹配逻辑，适用于大多数情况
    //         const regex = new RegExp(
    //           pattern
    //             .replace(/\./g, '\\.')
    //             .replace(/\*/g, '.*')
    //             .replace(/^\/\//, '*://')
    //             .replace(/^https?:\/\//, '*://')
    //             .replace(/^file:\/\//, 'file:///*')
    //         )
    //         return regex.test(url)
    //       }
    //     })
    //   })
    //   resolve(compatibleTabs)
    // })
  })
}

export async function energyRatesHourlyStatus() {
  const list = await db.energy_rates_hourly.toArray()
  list.forEach((item) => {
    if (item.status == TableStatusEnum.UM) {
      db.energy_rates_hourly.update(item.erhId, {
        status: '',
      })
    }
  })
}
