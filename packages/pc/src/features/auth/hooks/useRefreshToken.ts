import { useAuthStore } from '@/app/store/auth'
import { refreshAccessToken } from '@/features/auth/api/auth.api'


export async function useRefreshToken(): Promise<{ access_token: string, refresh_token: string } | null> {
    const authStore = useAuthStore()
    if (!authStore.refreshToken) {
        return null
    }
    try {
        const { data: { access_token, refresh_token, user } } = await refreshAccessToken(authStore.refreshToken)
        authStore.setUser({ access_token, refresh_token, user })
        return {
            access_token, refresh_token
        }
    } catch (error) {
        ElMessage.error('Token refresh failed：' + error)
        authStore.$reset()
        return null
    }
}
