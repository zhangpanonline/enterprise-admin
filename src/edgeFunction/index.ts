import { http } from '@/shared/utils/request'


export const createTableApi = (name: string) => http.post('/functions/v1/create_table', {
  name
})