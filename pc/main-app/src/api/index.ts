import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export const loginByEmailApi = ({ email, password, captchaToken }: any) => supabase.auth.signInWithPassword({ email, password, options: { captchaToken } })

export const signOutApi = () => supabase.auth.signOut()