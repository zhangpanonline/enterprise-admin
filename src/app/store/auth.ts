import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)

  function setUser({ user: u, access_token, refresh_token }: { user: User, access_token: string, refresh_token: string}) {
    user.value = u
    accessToken.value = access_token
    refreshToken.value = refresh_token
  }

  return {
    user,
    accessToken,
    refreshToken,
    setUser,
  }
}, {
  persist: true,
})
