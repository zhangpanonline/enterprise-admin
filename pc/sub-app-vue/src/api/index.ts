import { createClient, type SignInWithOAuthCredentials } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)

export const loginByEmailApi = ({ email, password, captchaToken }: any) => supabase.auth.signInWithPassword({ email, password, options: { captchaToken } })

export const signOutApi = () => supabase.auth.signOut()

export const signInWithOAuthApi = (data: SignInWithOAuthCredentials) => supabase.auth.signInWithOAuth(data)

export const refreshSessionApi = (refresh_token: string) => supabase.auth.refreshSession({ refresh_token })
