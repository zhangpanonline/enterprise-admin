import { request, ResponseType } from '@/utils/request';

export interface Category1 {
  id: string,
  name: string
}
export interface Category2 {
  id: string,
  name: string,
  level1_id: Category1['id']
}

export interface CategoryTree extends Array<Category1 & { category_level2: Category1 }> {}

export interface Bill {
  id: string,
  date: string,
  amount: number,
  category_id: Category2['id'],
  user_id: string,
  category_level1_name?: string,
  category_level1_name2: string,
}

export interface BillListItem {
  month: string,
  month_total: number,
  days: Array<{
    date: string,
    total: number,
    list: Array<Bill>
  }>
}

export interface Chart {
    month: string,
    total: number,
    categories: Array<{
        category_level1: string,
        category_level1_name: string,
        total: number
    }>
}

export const getBillListApi = (): Promise<Array<BillListItem>> => request({
  url: '/rest/v1/rpc/get_records_list4',
  method: 'GET'
})

export const getChartApi = (): Promise<Array<Chart>> => request({
  url: '/rest/v1/rpc/get_records_monthly_by_level2',
  method: 'GET'
})

export const deleteBillApi = (id: string) => request({
  url: `/rest/v1/records?id=eq.${id}`,
  method: 'DELETE'
})

export const getCategoryTreeApi = () => request({
  url: `/rest/v1/rpc/get_category_tree`,
  method: 'GET'
})

export const createBillApi = (bill: Pick<Bill, 'date'|'amount'|'category_id'>) => request({
  url: `/rest/v1/records`,
  method: 'POST',
  data: JSON.stringify(bill)
})

export const createLevel1Api = (o: { name: string }) => request({
    url: `/rest/v1/category_level1`,
    method: 'POST',
    data: JSON.stringify(o)
})

export const createLevel2Api = (o: { name: string, level1_id: string }) => request({
    url: `/rest/v1/category_level2`,
    method: 'POST',
    data: JSON.stringify(o)
})

export const createDinnerApi = (o: { type: number, date: string }) => request({
    url: `/rest/v1/dinner`,
    method: 'POST',
    data: JSON.stringify(o)
})

export const getDinnerApi = () => request({
    url: `/rest/v1/dinner`,
    method: 'GET',
})
