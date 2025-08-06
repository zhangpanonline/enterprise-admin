import axios from 'axios'

const request = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
})

// 请求拦截器
request.interceptors.request.use(config => {
    // TODO token
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, error => Promise.reject(error))

// 响应拦截器
request.interceptors.response.use(response => {
    const res = response.data
    // TODO
    return res
}, error => {
    const msg = error?.response?.data?.message || error?.message || '请求错误'
    ElMessage.error(msg)
    return Promise.reject(error)
})

export default request