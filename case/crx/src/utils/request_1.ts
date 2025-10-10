// src/utils/request.ts
import axios, { AxiosError } from 'axios'
import type {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosInstance,
} from 'axios'

import { ElMessage } from 'element-plus' // 使用 Element Plus 的消息提示

// 定义接口返回数据的类型
interface ResponseData<T = any> {
  code: number
  data: T
  error: boolean
  info: boolean
  msg: string
  right: boolean
  warning: boolean
}

// 扩展 AxiosRequestConfig 类型
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  //   hideLoading?: boolean; // 是否隐藏 loading
  //   hideErrorToast?: boolean; // 是否隐藏错误提示
}

class Request {
  private instance: AxiosInstance
  private readonly options: CustomAxiosRequestConfig

  constructor(options: CustomAxiosRequestConfig = {}) {
    this.options = options
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_APP_BASE_API as string, // 从环境变量获取
      timeout: 10000,
      ...this.options,
    })

    this.setupInterceptors()
  }

  // 设置拦截器
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 在发送请求之前做些什么
        const token = sessionStorage.getItem('token')

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // 添加时间戳防止缓存
        // if (config.method?.toLowerCase() === "get") {
        //   config.params = {
        //     ...config.params,
        //     _t: Date.now(),
        //   };
        // }

        // 显示 loading
        // if (!(config as CustomAxiosRequestConfig).hideLoading) {
        //   this.showLoading();
        // }

        return config
      },
      (error: AxiosError) => {
        // 对请求错误做些什么
        // this.hideLoading();
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponseData>) => {
        // this.hideLoading();
        const res = response.data

        // 根据业务状态码处理
        if (res.error) {
          // 处理业务错误
          if (res.info) {
            ElMessage.error(res.msg || '请求失败')
          }

          // 特殊状态码处理
          //   if (res.code === 401) {
          // 未授权，跳转到登录页
          // router.push('/login')
          //   }

          return Promise.reject(new Error(res.msg || 'Error'))
        }

        return res.data
      },
      (error: AxiosError) => {
        // this.hideLoading();
        // this.handleError(error);
        return Promise.reject(error)
      }
    )
  }

  // 显示 loading
  //   private showLoading() {
  // 这里可以使用你喜欢的 loading 组件
  // this.loadingInstance = ElLoading.service({ fullscreen: true })
  //   }

  // 隐藏 loading
  //   private hideLoading() {
  // this.loadingInstance?.close()
  //   }

  // 处理错误
  //   private handleError(error: AxiosError) {
  //     let message = error.message;
  //     if (error.response) {
  //       switch (error.response.status) {
  //         case 400:
  //           message = "请求错误";
  //           break;
  //         case 401:
  //           message = "未授权，请登录";
  //           // router.push('/login')
  //           break;
  //         case 403:
  //           message = "拒绝访问";
  //           break;
  //         case 404:
  //           message = `请求地址出错: ${error.config?.url}`;
  //           break;
  //         case 500:
  //           message = "服务器内部错误";
  //           break;
  //         default:
  //           message = `连接错误${error.response.status}`;
  //       }
  //     }

  //     ElMessage.error(message);
  //   }

  // 通用请求方法
  public request<T = any>(config: CustomAxiosRequestConfig): Promise<T> {
    return this.instance.request(config)
  }
}

// 创建默认实例
const request = new Request()
export default request
