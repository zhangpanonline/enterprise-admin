import { useAuthStore } from '@/app/store/auth'
import { loginByEmail } from '../api/auth.api'

export function useLogin() {
  const loading = ref(false)
  const router = useRouter()
  const authStore = useAuthStore()

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      loading.value = true
      const { data: { user, access_token, refresh_token } } = await loginByEmail(email, password)
      authStore.setUser({ user, access_token, refresh_token })
      ElMessage.success('登录成功')
      router.push('/dashboard')
    } catch (e: any) {
      ElMessage.error(e.message || '登录失败')
    } finally {
      loading.value = false
    }
  }

  return {
    login,
    loading
  }
}
