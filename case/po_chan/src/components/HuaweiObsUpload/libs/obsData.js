const isPro = import.meta.env.VITE_MODE === 'pro'

export const accessKey = 'EFUFMP6CKAQ9INBIV7XA'
export const bucketName = isPro ? 'zscloud' : 'zscloud-test'
export const videoBucketName = isPro ? 'srs-video' : 'srs-video-test'
export const endPoint = 'obs.cn-east-3.myhuaweicloud.com'
export const lookEndPoint = isPro ? 'zhushucloud.com' : 'zhushucloud.net'
export const secretKey = 'xYhrrerfo2KriH8WQvWUcjmJJC7nSD0Rn9oXaTWx'
