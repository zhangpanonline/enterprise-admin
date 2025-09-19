import { http } from '@/shared/utils/request'
import { type AxiosRequestConfig } from 'axios'
// import { supabase } from '@/shared/utils/request/supabase'
// export const callEdgeFunctionApi = (name: string) => supabase.functions.invoke(name)

interface Request<T = any> extends AxiosRequestConfig {
    function_name: string,
    body: T
}

export const callEdgeFunctionApi = ({ function_name, ...body }: { function_name: string, [key: string]: any }) => http.post('/functions/v1/'+ function_name, body)

// export const callEdgeFunctionApi = <T>({ function_name, method = 'POST', ...request }: Request<T>) => http({
//     url: '/functions/v1/' + function_name,
//     method,
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     ...request
// })

