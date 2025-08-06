import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  function setUser(newUser: User | null) {
    user.value = newUser
  }

  return {
    user,
    setUser
  }
})
