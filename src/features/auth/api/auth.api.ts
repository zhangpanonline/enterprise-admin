import { http } from '@/shared/utils/request'
import type { User } from '@supabase/supabase-js'

export interface Session {
  provider_token?: string | null
  access_token: string
  expires_in?: number
  expires_at?: number
  refresh_token: string
  token_type: string
  user: User
}

// supabase.auth.signUp({
//   email: 'zhangpan.online@outlook.com',
//   password: '12345678',
// }).then(r => {
//     console.log(r)
// })

// 登录
export const loginByEmail = (email: string, password: string) => http.post<Session>('/auth/v1/token?grant_type=password', {
  email,
  password,
})

// 刷新token
export const refreshAccessToken = (refreshToken: string) => http.post<Session>('/auth/v1/token?grant_type=refresh_token', {
  refresh_token: refreshToken,
})
