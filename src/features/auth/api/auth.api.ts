import { supabase } from '@/shared/utils/supabase'

// supabase.auth.signUp({
//   email: 'zhangpan.online@outlook.com',
//   password: '12345678',
// }).then(r => {
//     console.log(r)
// })

export async function loginByEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data.user
}
