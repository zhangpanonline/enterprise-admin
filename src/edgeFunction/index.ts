import { http } from '@/shared/utils/request'
// import { supabase } from '@/shared/utils/request/supabase'
// export const callEdgeFunctionApi = (name: string) => supabase.functions.invoke(name)

export const callEdgeFunctionApi = ({ name, ...params }: { name: string, [key: string]: any}) => http.post('/functions/v1/'+ name, params)

