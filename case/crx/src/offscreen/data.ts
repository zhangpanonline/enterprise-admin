// import { findBuy5AndSell5 } from '@/api'

import { findBuy5AndSell5, findMarketCountInfo, findResultFd } from '@/api'
import {
  ActionType,
  BuySellEnum,
  MessageType,
  TableStatusEnum,
  TransactionTypeEnum,
} from '@/types/enum'
import {
  getCurrentListenType,
  // getCurrentLoadDate,
  getCurrentType,
} from '@/utils/chomeStorage'
// 需求供应
const REQUEST_INTERVAL = 1000 * 10

let setTimeoutId: NodeJS.Timeout | null = null

import { throttle } from 'lodash-es'

import { CURRENT_LOAD_DATE, CURRENT_TYPE } from '@/constants'

import db from '@/utils/dexie'
import { getRrhId } from '@/utils/app'
import dayjs from 'dayjs'

export async function requestDemandSupplyData(offscreen?: any) {
  if (setTimeoutId) clearTimeout(setTimeoutId)
  if (offscreen && !offscreen.isRunning) return
  // 获取当前需要请求需求和相应的数据
  // const date = await getCurrentLoadDate()
  // 首次默认打开渲染需要渲染的类型
  const currentType = await getCurrentType()
  if (!currentType) return
  // 用户点击启动后 保存的监听
  const listenTypes = await getCurrentListenType()

  const systemInfoList = await db.system_info
    .filter((info) => info.tabId != null)
    .toArray()

  // const systemList = systemInfoList.filter((info) => {
  //   if (!info.value) return false
  //   const value = JSON.parse(info.value)
  //   return value[CURRENT_LOAD_DATE] && value[CURRENT_LISTEN_TYPE]
  // })
  //   findBuy5AndSell5()

  // 获取需要请求的数据
  const getParamList: any[] = []
  if (systemInfoList.length > 0) {
    // 如果用户点击的 类型和日期 不在启动监听的id中 则单独获取请求的数据

    for (let i = 0; i < systemInfoList.length; i++) {
      const info = systemInfoList[i]
      if (!info.value) continue
      const value = JSON.parse(info.value)

      if (!listenTypes.includes(value[CURRENT_TYPE])) {
        if (value[CURRENT_LOAD_DATE] && value[CURRENT_TYPE]) {
          // const list = await db.energy_rates_hourly
          //   .where('[seqId+date]')
          //   .equals([value[CURRENT_TYPE], value[CURRENT_LOAD_DATE]])
          //   .toArray()
          const list = await db.energy_rates_hourly
            .where('seqId')
            .equals(value[CURRENT_TYPE])
            .toArray()
          list.forEach((item) => {
            if (!getParamList.find((param) => param.dsbId === item.dsbId)) {
              getParamList.push(item)
            }
          })
        }
      }
    }
  } else {
    if (!listenTypes.includes(currentType)) {
      // const list = await db.energy_rates_hourly
      //   .where('[seqId+date]')
      //   .equals([currentType, date])
      //   .toArray()
      const list = await db.energy_rates_hourly
        .where('seqId')
        .equals(currentType)
        .toArray()
      list.forEach((item) => {
        if (!getParamList.find((param) => param.dsbId === item.dsbId)) {
          getParamList.push(item)
        }
      })
    }
  }
  // 用户点击的start 按钮后 需要请求数据
  for (let i = 0; i < listenTypes.length; i++) {
    const seqId = listenTypes[i]
    const list = await db.energy_rates_hourly
      .where('seqId')
      .equals(seqId)
      .toArray()
    list.forEach((item) => {
      if (!getParamList.find((param) => param.dsbId === item.dsbId)) {
        getParamList.push(item)
      }
    })
  }

  // 需要请求的列表
  const paramListPromise: any[] = []
  getParamList.forEach((item) => {
    const promise = new Promise((resolve) => {
      findBuy5AndSell5({
        code: item.code,
        seqId: item.seqId,
      })
        .then((res: any) => {
          const demand_supply_data = {
            dsbId: item.dsbId,
            demand1_price: '', //需求1
            demand1_dumpenergy: '', // 需求1
            supply1_price: '', // 供应1
            supply1_dumpenergy: '', // 供应1
            date: item.date,
            code: item.code,
            seqId: item.seqId,
            hour: item.hour,
          }
          if (res.buy5AndSell5) {
            const demand1 = res.buy5AndSell5.find(
              (data: any) => data.type === '需求1'
            )
            const supply1 = res.buy5AndSell5.find(
              (data: any) => data.type === '供应1'
            )
            demand_supply_data.demand1_price = demand1.PRICE
            demand_supply_data.demand1_dumpenergy = demand1.DUMPENERGY
            demand_supply_data.supply1_price = supply1.PRICE
            demand_supply_data.supply1_dumpenergy = supply1.DUMPENERGY
          }

          // 处理用户是否存在需要申报的数据
          handleDemandSupplyData(demand_supply_data).finally(() => {
            // 保存数据
            db.demand_supply_balance.put(demand_supply_data).finally(() => {
              resolve(res)
            })
          })
        })
        .catch((err) => {
          if (err.status && err.status === 401) {
            throttleStop()
          }
          if (err.code == 'ERR_NETWORK') {
            // 断网 网络连接错误
            console.log('网络连接错误', err)
          }
          resolve(err)
        })
    })
    paramListPromise.push(promise)
  })

  // const demand_supply_list: any[] = []
  const result_values = await Promise.all(paramListPromise)
  if (result_values) {
    chrome.runtime.sendMessage({
      type: MessageType.DEMAND_SUPPLY_REQUEST_SUCCESS,
      data: 'success',
    })
  }

  setTimeoutId = setTimeout(() => {
    offscreen && requestDemandSupplyData(offscreen)
  }, REQUEST_INTERVAL)
  // 递归请求下一次

  // result_values.forEach((item, index) => {
  // const demand_supply_data = {
  //   dsbId: getParamList[index].erhId,
  //   demand1_price: '', //需求1
  //   demand1_dumpenergy: '', //需求1
  //   supply1_price: '', // 供应1
  //   supply1_dumpenergy: '', // 供应1
  //   date: getParamList[index].date,
  //   code: getParamList[index].code,
  //   seqId: getParamList[index].seqId,
  // }
  //   if (item.buy5AndSell5) {
  //     const demand1 = item.buy5AndSell5.find(
  //       (data: any) => data.type === '需求1'
  //     )
  //     const supply1 = item.buy5AndSell5.find(
  //       (data: any) => data.type === '供应1'
  //     )
  //     demand_supply_data.demand1_price = demand1.PRICE
  //     demand_supply_data.demand1_dumpenergy = demand1.DUMPENERGY
  //     demand_supply_data.supply1_price = supply1.PRICE
  //     demand_supply_data.supply1_dumpenergy = supply1.DUMPENERGY
  //   }
  //   demand_supply_list.push(demand_supply_data)
  // })

  // db.demand_supply_balance.bulkPut(demand_supply_list).then(() => {
  //   // 保存成功
  //   chrome.runtime.sendMessage({
  //     type: MessageType.DEMAND_SUPPLY_REQUEST_SUCCESS,
  //     data: 'success',
  //   })
  // })
}

async function handleDemandSupplyData(item: any) {
  // 获取用户填写的数据
  const user_list = await db.energy_rates_hourly
    .where('[seqId+code]')
    .equals([item.seqId, item.code])
    .toArray()

  for (let i = 0; i < user_list.length; i++) {
    const user_data = user_list[i]
    if (!user_data || !user_data.status) continue
    if (user_data.status != TableStatusEnum.UM) continue
    // 正在检测中的数据
    const from_data = await db.user_form_data.get(item.seqId)
    // 买入触发价格
    let buyingThreshold = 0
    // 卖出触发价格
    let sellingThreshold = 0
    if (from_data) {
      const value = JSON.parse(from_data.value)
      buyingThreshold = value.buyingThreshold || 0
      sellingThreshold = value.sellingThreshold || 0
    }
    if (!user_data.price || !user_data.electricity) continue
    if (user_data.type == BuySellEnum.buy) {
      // 买入 用户填入的电价跟供应的电价相比 如果供应1电价<(用户填报的电价 + 买入触发价格) 则进行申报 交易
      // 买入逻辑
      const buyPrice = Number(
        (Number(user_data.price) + Number(buyingThreshold)).toFixed(4)
      )
      if (Number(item.supply1_price) < buyPrice) {
        // 表示正要去申报
        await db.energy_rates_hourly.update(user_data.erhId, {
          seqId: user_data.seqId,
          date: user_data.date,
          status: TableStatusEnum.PENDING,
        })

        // 去申报
        goToDeclare(user_data.erhId, buyPrice)
      }
    }
    // 卖出 用户填入的电价跟供应的电价相比 如果需求1电价 > (用户填报的电价 - 卖出触发价格) 则进行申报 交易
    if (user_data.type == BuySellEnum.sell) {
      const sellPrice = Number(
        (Number(user_data.price) - Number(sellingThreshold)).toFixed(4)
      )
      // 卖出逻辑
      if (Number(item.demand1_price) > sellPrice) {
        // 表示正要去申报
        await db.energy_rates_hourly.update(user_data.erhId, {
          seqId: user_data.seqId,
          date: user_data.date,
          status: TableStatusEnum.PENDING,
        })
        // 去申报
        goToDeclare(user_data.erhId, sellPrice)
      }
    }
  }
}

/**
 * 告诉后台去申报
 * @param erhId
 * @param price
 */
function goToDeclare(erhId: string, price: number) {
  chrome.runtime
    .sendMessage({
      type: MessageType.GO_TO_DECLARE,
      data: {
        erhId,
        price,
      },
    })
    .then()
    .catch()
}

const throttleStop = throttle(stop, 10000)

function stop() {
  chrome.runtime
    .sendMessage({
      type: ActionType.TOKEN_EXPIRATION,
    })
    .then(() => {})
    .catch(() => {})
}

/**
 * 请求获取当前申报量 和 成交结果
 */
export async function requestVolumeData() {
  const types = await db.transaction_types.toArray()
  // 处理成交结果
  handleDealResult(types)
  for (let i = 0; i < types.length; i++) {
    const type = types[i]
    const datas: any = await findMarketCountInfo({
      seqId: type.seqId,
    }).catch(() => {
      // if (err.status && err.status === 401) {
      //   throttleStop()
      //   return Promise.reject(err)
      // }
    })
    if (type.transactionType == TransactionTypeEnum.DUDT.value) {
      // 直接交易
      const tradingElectricity = datas.reduce((total: any, item: any) => {
        return total + Number(item.myDealEnergy || '0')
      }, 0)

      await db.transaction_types.update(type.seqId, {
        ...type,
        aogTradingElectricity: tradingElectricity.toFixed(3),
      })
    } else {
      for (let j = 0; j < type.pdateList.length; j++) {
        const pdate = type.pdateList[j]
        const list = datas.filter((item: any) =>
          item.jydm.includes(pdate.value.toString())
        )
        const tradingElectricity = list.reduce((total: any, item: any) => {
          return total + Number(item.myDealEnergy || '0')
        }, 0)
        pdate['aogTradingElectricity'] = tradingElectricity.toFixed(3)
      }
      await db.transaction_types.update(type.seqId, {
        ...type,
      })
    }
  }

  // 通知插件更新数据
  chrome.runtime
    .sendMessage({
      type: MessageType.UPDATE_TYPE_DATA,
    })
    .then(() => {})
    .catch(() => {})
}

/**
 * 处理成交结果
 */
export async function handleDealResult(types: any[]) {
  const queryTypeList = types.filter(
    (item) => item.transactionType != TransactionTypeEnum.BMET.value
  )
  for (let i = 0; i < queryTypeList.length; i++) {
    const typeItem = queryTypeList[i]
    const list = await findResultFd({
      seqId: typeItem.seqId,
    })
    const resultMap = new Map<string, any>();
    (list as any).forEach((item: any) => {
      const erhId = getRrhId(item.code, typeItem.seqId, item.jydyId)
      if (resultMap.has(erhId)) {
        const result = resultMap.get(erhId)
        result.count++
        result.sumEnergy = Number(
          (result.sumEnergy + Number(item.energy)).toFixed(4)
        )
        result.sumPrice = Number(
          (result.sumPrice + Number(item.price)).toFixed(4)
        )
        result.buyType = item.buyType
        result.energy = item.energy
        result.price = item.price

        const matchTime = dayjs(item.matchTime, 'YYYY-MM-DD HH:mm:ss')

        if (matchTime.isAfter(result.dateTime)) {
          result.dateTime = matchTime
        }
        resultMap.set(erhId, result)
      } else {
        resultMap.set(erhId, {
          count: 1,
          sumEnergy: Number(item.energy),
          sumPrice: Number(item.price),
          dateTime: dayjs(item.matchTime, 'YYYY-MM-DD HH:mm:ss'),
          buyType: item.buyType,
          energy: item.energy,
          price: item.price,
        })
      }
    })
    const resultList = Array.from(resultMap.entries()).map(([key, value]) => ({
      key,
      ...value,
    }))
    for (let j = 0; j < resultList.length; j++) {
      const resultItem = resultList[j]
      const erhData = await db.energy_rates_hourly.get(resultItem.key)
      if (!erhData) continue
      let updateData: any = {
        dealSumElectricity: resultItem.sumEnergy,
        dealAvgPrice: Number(
          (resultItem.sumPrice / resultItem.count).toFixed(4)
        ),
        dealDateTime: resultItem.dateTime.format('YYYY-MM-DD HH:mm:ss'),
        dealCount: resultItem.count,
        dealElectricity: resultItem.energy,
        dealPrice: resultItem.price,
        dealResult: getDealResult(resultItem, erhData),
      }
      if (
        erhData.status == TableStatusEnum.DEC &&
        erhData.transactionDateTime
      ) {
        // 筛选出已申报的数据
        // 如果申报的时间晚于成交时间 则表示申报的结果已成交
        const transactionDateTime = dayjs(
          erhData.transactionDateTime,
          'YYYY-MM-DD HH:mm:ss'
        )
        // 成功申报
        if (resultItem.dateTime.isAfter(transactionDateTime)) {
          updateData = {
            ...updateData,
            status: TableStatusEnum.COM,
          }
          const history_result = `${erhData.tradeUnitName} ${erhData.code} `
          // 更新日志
          await db.declaration_history.add({
            seqId: erhData.seqId as number,
            code: erhData.code,
            dateTime: updateData.dealDateTime,
            date: resultItem.dateTime.format('YYYY-MM-DD'),
            type: erhData.type,
            status: TableStatusEnum.COM,
            tradeUnitId: erhData.tradeUnitId,
            tradeUnitName: erhData.tradeUnitName,
            result: history_result + updateData.dealResult,
          })
        }
      }
      await db.energy_rates_hourly.update(erhData.erhId, updateData)
    }
  }

  // 通知插件更新数据
  chrome.runtime
    .sendMessage({
      type: ActionType.UPDATE_TABLE_DATA,
      data: {},
    })
    .then()
    .catch()
}

function getDealResult(resultItem: any, erhDate: any) {
  return `已成交${resultItem.count}次，${resultItem.buyType}电量：${resultItem.sumEnergy}，电价：${Number((resultItem.sumPrice / resultItem.count).toFixed(4))}。本次成交电量${resultItem.energy}，电价${resultItem.price}。${erhDate.planElectricity && Number(erhDate.planElectricity) ? getRemainEnergy(resultItem.sumEnergy, erhDate.planElectricity) : ''}`
}

function getRemainEnergy(sumEnergy: number, planElectricity: number) {
  let remainEnergy = ''
  if (Number(planElectricity) > 0) {
    remainEnergy = (Number(planElectricity) - Number(sumEnergy)).toFixed(4)
  } else {
    remainEnergy = (Number(sumEnergy) - Number(planElectricity)).toFixed(4)
  }
  return `剩余电量：${remainEnergy}`
}
