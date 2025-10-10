import http from '@/utils/request_1'

export function getTradeSeqInfo(params?: any) {
  return http.request({
    url: '/qctc-pm-trade-zcq-jzjz-facade/jzjz/facade/getTradeSeqInfo/4',
    method: 'get',
    params,
  })
}

export function findBuy5AndSell5(params?: any) {
  return http.request({
    url: '/qctc-pm-trade-zcq-jzjz-facade/jzjz/facade/findBuy5AndSell5',
    method: 'post',
    data: params,
  })
}
