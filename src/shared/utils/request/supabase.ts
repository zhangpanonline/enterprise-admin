import axios from 'axios'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

export const supabaseAxios = axios.create({
    baseURL: `${import.meta.env.VITE_SUPABASE_URL}/auth/v1`,
    headers: {
        'apikey': import.meta.env.VITE_SUPABASE_KEY,
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
supabaseAxios.interceptors.request.use(config => {
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
supabaseAxios.interceptors.response.use(response => {
    console.log('响应拦截：', response)
    const res = response.data
    // TODO
    return res
}, error => {
    console.log('响应拦截错误：', error)
    const msg = error?.response?.data?.msg || error?.message || '请求错误'
    ElMessage.error(msg)
    return Promise.reject(error)
})