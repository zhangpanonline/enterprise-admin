<template></template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { refreshSessionApi } from '@/api'
import { useAuthStore } from '@/stores/auth'
const router = useRouter()
const hash = window.location.hash.substring(1) // 去掉开头的 #
const params = new URLSearchParams(hash)
const refreshToken = params.get('refresh_token')
const authStore = useAuthStore()
login()
async function login() {
    const { error } = await refreshSessionApi(refreshToken as string)
    if (error) {
        window.alert(error.message)
        return false
    }
    authStore.initAuth()
    router.push('/')
}
</script>