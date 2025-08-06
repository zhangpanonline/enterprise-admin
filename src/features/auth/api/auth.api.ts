import { supabaseAxios } from '@/shared/utils/request/supabase'
// import type { User } from '@supabase/supabase-js'

// supabase.auth.signUp({
//   email: 'zhangpan.online@outlook.com',
//   password: '12345678',
// }).then(r => {
//     console.log(r)
// })

export const loginByEmail = (email: string, password: string) => supabaseAxios.post('/token?grant_type=password', {
    email,
    password,
  })