import { supabaseAxios } from '@/shared/utils/request/supabase'
// import type { User } from '@supabase/supabase-js'

// supabase.auth.signUp({
//   email: 'zhangpan.online@outlook.com',
//   password: '12345678',
// }).then(r => {
//     console.log(r)
// })

export async function loginByEmail(email: string, password: string) {
  const res = await supabaseAxios.post('/token?grant_type=password', {
    email,
    password,
  })

  return res
}
