import { useAuthStore } from '../store/useAuthStore'
import { loginByEmail } from '../api/auth.api'
import { ElMessage } from 'element-plus'

export function useLogin() {
  const loading = ref(false)
  const router = useRouter()
  const authStore = useAuthStore()

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      loading.value = true
      const user = await loginByEmail(email, password)
      authStore.setUser(user)
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
