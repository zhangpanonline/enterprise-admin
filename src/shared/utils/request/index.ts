import axios, { type AxiosRequestConfig, type CreateAxiosDefaults } from 'axios'
import { useAuthStore } from '@/app/store/auth'
// import { useRefreshToken } from '@/features/auth/hooks/useRefreshToken'

let loadingInstance: ReturnType<typeof ElLoading.service> | null = null

// 请求config
// type RequestConfig = AxiosRequestConfig | {
//     loading?: boolean
// }

export const http = axios.create({
    baseURL: import.meta.env.DEV ? '/api' : `${import.meta.env.VITE_SUPABASE_URL}`,
    headers: {
        'apikey': import.meta.env.VITE_SUPABASE_KEY,
        'Content-Type': 'application/json',
    },
})

// 请求拦截器
http.interceptors.request.use((config) => {
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
    return config
}, error => {
    console.log('请求拦截错误：', error)
    return Promise.reject(error)
})

// 响应拦截器
http.interceptors.response.use(response => {
    loadingInstance?.close()
    console.log('响应拦截：', response)
    // const res = response.data
    // TODO token过期处理
    // useRefreshToken()
    return response
}, error => {
    loadingInstance?.close()
    console.log('响应拦截错误：', error)
    const msg = error?.response?.data?.msg || error?.message || '请求错误'
    ElMessage.error(msg)
    return Promise.reject(error)
})