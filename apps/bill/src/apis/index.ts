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
  date: string,
  total: number,
  list: Array<Bill>
}

export const getBillListApi = (): Promise<Array<BillListItem>> => request({
  url: '/rest/v1/rpc/get_records_list3',
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
