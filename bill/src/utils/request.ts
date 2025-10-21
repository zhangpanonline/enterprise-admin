import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import { createUniAppAxiosAdapter } from '@uni-helper/axios-adapter';
import { useUserStore } from '@/store';

const {
  VITE_SERVER_BASEURL: baseURL,
  VITE_REQUEST_TIMEOUT,
  VITE_CONTENT_TYPE,
  VITE_SUCCESS_CODE,
  VITE_SHOW_LOADING,
  VITE_SHOW_ERROR,
  VITE_RESPONSE_CODE_KEY,
  VITE_RESPONSE_MSG_KEY,
  VITE_TOKEN_KEY,
  VITE_API_KEY
} = import.meta.env;

const timeout = JSON.parse(VITE_REQUEST_TIMEOUT);
const code = VITE_RESPONSE_CODE_KEY;
const msg = VITE_RESPONSE_MSG_KEY;
const tokenKey = VITE_TOKEN_KEY;
const showErr = JSON.parse(VITE_SHOW_ERROR);
const showLoading = JSON.parse(VITE_SHOW_LOADING);
export interface ResponseType<T = any> {
  code: number;
  message: string;
  data: T;
}

let requestNum = 0;

interface IRequestConfig extends AxiosRequestConfig {
  loading?: boolean;
  showError?: boolean;
}

const addLoading = () => {
  requestNum++;
  if (requestNum === 1 && showLoading) {
    uni.showLoading({
      title: '加载中...',
    });
  }
};
const removeLoading = () => {
  requestNum--;
  if (requestNum === 0) {
    uni.hideLoading();
  }
};

const debounceTokenCancel = new Map();

export const request = (config?: IRequestConfig): any => {
  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': VITE_CONTENT_TYPE,
    },
    ...config,
    adapter: createUniAppAxiosAdapter(),
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config: IRequestConfig): any => {
      // 根据自己的项目进行修改参数
      const token = useUserStore().token;
      // 设置token
      if (token) config.headers![tokenKey] = token;
      config.headers!['Apikey'] = VITE_API_KEY;
      const { loading = showLoading } = config;
      if (loading) addLoading();
      const requestTokenKey = `${config.method}_${config.url}`;
      const cancelToken = debounceTokenCancel.get(requestTokenKey);
      if (cancelToken) cancelToken();
      return new Promise((resolve) => {
        const timer = setTimeout(() => {
          clearTimeout(timer);
          resolve(config);
        }, 800);
        debounceTokenCancel.set(requestTokenKey, () => {
          clearTimeout(timer);
          resolve(new Error('请勿重复请求'));
        });
      });
    },
    (error) => {
      // do something with request error
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */
    (response: AxiosResponse) => {
      const res = response.data;
      const { loading = showLoading, showError = showErr } = response.config as IRequestConfig;
      if (loading) removeLoading();
      if ([200, 201].includes(response.status)) {
        return res
      } else {
        uni.showToast({
          title: '请求失败！',
          duration: 2000,
        });
      }
      console.log(response, 'response')
      // 请求出错处理
      // if (res[code] === -1) {
      //   uni.showToast({
      //     title: '服务器异常',
      //     duration: 2000,
      //   });

      //   return Promise.reject(res);
      // }
      // if (JSON.parse(VITE_SUCCESS_CODE).indexOf(res[code]) !== -1) {
        // return res;
      // } else {
      //   // 业务错误处理, 根据自己的业务状态码调整
      //   if (showError) handleNetworkError(res[code], res[msg]);
      //   else return Promise.reject(res);
      // }
    },
    (error) => {
      removeLoading();
      // 是否显示错误信息提示 默认显示 关闭时需要在接口调用处自行处理
      if (showErr) {
        handleNetworkError(error.response.data.code, error.response.data.message);
      } else return Promise.reject(error);
    },
  );
  return instance.request(config!);
};

const handleNetworkError = (status: string, message: string) => {
  console.log(status, message)
  let errMessage = '未知错误';
  if (status) {
    switch (status) {
      case 'PGRST100':
        errMessage = message;
        break;
      default:
        errMessage = message || `其他连接错误 --${status}`;
    }
  } else {
    errMessage = message || `无法连接到服务器！`;
  }
  uni.showModal({
    title: status,
    content: message,
    showCancel: false
  })
};
