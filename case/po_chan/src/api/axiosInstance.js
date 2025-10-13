import axios from 'axios'
import { useAppStore } from '@/stores/app.js'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// 取消请求
const controller = new AbortController()

// 添加请求拦截器
instance.interceptors.request.use(function(config) {
  const appStore = useAppStore()
  if (appStore.token) config.headers['Authorization'] = 'Bearer ' + appStore.token
  // 在发送请求之前做些什么
  return {
    ...config,
    signal: controller.signal,
  }
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function(response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  if (response.status === 200) {
    return response.data
  } else {
    return Promise.reject({ data: response.data, message: response.data.data.msg })
  }
}, function(error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if (error?.response?.data?.code === 401) {
    controller.abort()
    ElMessageBox({
      type: 'warning',
      title: '登录已失效',
      message: '请重新登录！',
      showClose: false,
      showCancelButton: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      autofocus: false,
      callback() {
        const appStore = useAppStore()
        appStore.setToken(null)
        location.href = location.origin + location.pathname + '#/login'
      },
    })
  } else {
    return Promise.reject(error)
  }
})

export default instance
