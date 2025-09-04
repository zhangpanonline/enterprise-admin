import axios, { type AxiosRequestConfig, type CreateAxiosDefaults } from 'axios'
import { useAuthStore } from '@/app/store/auth'
import { useRefreshToken } from '@/features/auth/hooks/useRefreshToken'
export * from './supabase'

let loadingInstance: ReturnType<typeof ElLoading.service> | null = null

// 请求config
// type RequestConfig = AxiosRequestConfig | {
//     loading?: boolean
// }

// 请求缓存
const cacheMap = new Map<string, any>()

export const http = axios.create({
    baseURL: import.meta.env.DEV ? '/api' : `${import.meta.env.VITE_SUPABASE_URL}`,
    headers: {
        'apikey': import.meta.env.VITE_SUPABASE_KEY,
        'Content-Type': 'application/json',
    },
})

// 请求拦截器
http.interceptors.request.use((config) => {
    console.log('↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓')
    console.log('请求地址：', import.meta.env.VITE_SUPABASE_URL + config.url)
    // const { loading = true } = config.headers
    loadingInstance = ElLoading.service({
        lock: true,
        text: 'Loading...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    const { accessToken } = useAuthStore()
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    console.log('请求拦截：', config)

    // 设置缓存的唯一标识
    const key = getRequestKey(config)
    // 请求缓存处理
    if (config.method === 'get' && cacheMap.has(key)) {
        config.adapter = () => {
            return Promise.resolve(cacheMap.get(key))
        }
    }
    return config
}, error => {
    console.log('请求拦截错误：', error)
    return Promise.reject(error)
})

// 响应拦截器
http.interceptors.response.use(response => {
    loadingInstance?.close()
    console.log('响应拦截：', response)
    const key = getRequestKey(response.config)
    // 缓存响应
    if (response.config.method === 'get') {
        cacheMap.set(key, response)
    }
    return response
}, async error => {
    loadingInstance?.close()
    console.log('响应拦截错误：', error)
    if (error?.response?.data?.code === "PGRST303" || error?.response?.data?.code === 401) {
        const res = await useRefreshToken()
        console.log('刷新token:', res)
        error.response.config.headers.Authorization = `Bearer ${res}`
        return http(error?.response.config)
    } else {
        const msg = error?.response?.data?.message || error?.response?.statusText || error?.message || '请求错误'
        await ElMessageBox.confirm(
            msg,
            error?.response?.status || 'Error',
            {
                confirmButtonText: 'OK',
                showCancelButton: false,
                type: 'error',
            }
        )
        return Promise.reject(error)
    }
})

// 生成唯一key (方法 + url + body)
function getRequestKey(config: AxiosRequestConfig) {
    return `${config.method}-${config.url}-${JSON.stringify(config.params)}-${JSON.stringify(config.data)}`
}

// 状态码
const statusCode = {
    200: '查询成功',
    201: '创建成功',
    204: '删除成功'
}