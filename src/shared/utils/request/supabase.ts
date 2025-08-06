import axios from 'axios'

export const supabaseAxios = axios.create({
    baseURL: `${import.meta.env.VITE_SUPABASE_URL}/auth/v1`,
    headers: {
        'apikey': import.meta.env.VITE_SUPABASE_KEY,
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
supabaseAxios.interceptors.request.use(config => {
    // TODO token
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    console.log('请求拦截：', config)
    return config
}, error => Promise.reject(error))

// 响应拦截器
supabaseAxios.interceptors.response.use(response => {
    console.log('响应拦截：', response)
    const res = response.data
    // TODO
    return res
}, error => {
    const msg = error?.response?.data?.message || error?.message || '请求错误'
    ElMessage.error(msg)
    return Promise.reject(error)
})