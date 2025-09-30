import http from '@/utils/request'
import { sendMessageToTab, sendMessage } from '@/utils/chomeMessage'
import { getCurrentTabIdList } from '@/utils/chomeStorage'
import { ActionType } from '@/types/enum'

/**
 * 获取交易类型列表
 * @param params
 * @returns
 */
export function getTradeSeqInfo(params?: any) {
  return http.request({
    url: '/qctc-pm-trade-zcq-jzjz-facade/jzjz/facade/getTradeSeqInfo/4',
    method: 'get',
    params,
  })
}
/**
 * 获取需求和供应数据
 * @param params
 * @returns
 */
export async function findBuy5AndSell5(params?: any) {
  return await sendMessage({
    type: ActionType.OFF_SCREEN_REQUEST_PROXY,
    data: {
      action: ActionType.REQUEST_PROXY,
      data: {
        url: '/qctc-pm-trade-zcq-jzjz-facade/jzjz/facade/findBuy5AndSell5',
        method: 'post',
        data: params,
      }
    }
  })
  // return http.request({
  //   url: '/qctc-pm-trade-zcq-jzjz-facade/jzjz/facade/findBuy5AndSell5',
  //   method: 'post',
  //   data: params,
  // })
}

/**
 * 申报 卖出
 */
export async function sellBatchHuangCard(params?: any) {
  const tabIds = await getCurrentTabIdList()
  return await sendMessageToTab(tabIds[0], {
    action: ActionType.REQUEST_PROXY,
    data: {
      url: '/qctc-pm-trade-zcq-jzjz-facade/jzjz/sell/batchHuangCard',
      method: 'post',
      data: params,
    },
  })
  // return http.request({
  //   url: '/qctc-pm-trade-zcq-jzjz-facade/jzjz/sell/batchHuangCard',
  //   method: 'post',
  //   data: params,
  // })
}

/**
 * 申报 买入
 * @param params
 * @returns
 */
export async function buyBatchHuangCard(params?: any) {
  const tabIds = await getCurrentTabIdList()
  return await sendMessageToTab(tabIds[0], {
    action: ActionType.REQUEST_PROXY,
    data: {
      url: '/qctc-pm-trade-zcq-jzjz-facade/jzjz/buy/batchHuangCard',
      method: 'post',
      data: params,
    },
  })
  // return http.request({
  //   url: '/qctc-pm-trade-zcq-jzjz-facade/jzjz/buy/batchHuangCard',
  //   method: 'post',
  //   data: params,
  // })
}
/**
 * 获取交易单元
 * @param params
 * @returns
 */
export async function findTradeUnit(params?: any) {
  const tabIds = await getCurrentTabIdList()
  return await sendMessageToTab(tabIds[0], {
    action: ActionType.REQUEST_PROXY,
    data: {
      url: '/qctc-pm-trade-zcq-jzjz-facade/jzjz/facade/findTradeUnit',
      method: 'post',
      data: params,
    },
  })
  // return http.request({
  //   url: '/qctc-pm-trade-zcq-jzjz-facade/jzjz/facade/findTradeUnit',
  //   method: 'post',
  //   data: params,
  // })
}

/**
 * 获取当前账号的交易量
 * @param params
 * @returns
 */
export async function findMarketCountInfo(params?: any) {
  return await sendMessage({
    type: ActionType.OFF_SCREEN_REQUEST_PROXY,
    data: {
      action: ActionType.REQUEST_PROXY,
      data: {
        url: '/qctc-pm-trade-zcq-jzjz-facade/jzjz/facade/findMarketCountInfo',
        method: 'post',
        data: params,
      }
    }
  })
  // return http.request({
  //   url: '/qctc-pm-trade-zcq-jzjz-facade/jzjz/facade/findMarketCountInfo',
  //   method: 'post',
  //   data: params,
  // })
}
/**
 * 获取成交结果
 * @param params
 * @returns
 */
export async function findResultFd(params?: any) {
  return await sendMessage({
    type: ActionType.OFF_SCREEN_REQUEST_PROXY,
    data: {
      action: ActionType.REQUEST_PROXY,
      data: {
        url: '/qctc-pm-trade-zcq-jzjz-facade/jzjz/facade/findResultFd',
        method: 'post',
        data: params,
      }
    }
  })
  // return http.request({
  //   url: '/qctc-pm-trade-zcq-jzjz-facade/jzjz/facade/findResultFd',
  //   method: 'post',
  //   data: params,
  // })
}
