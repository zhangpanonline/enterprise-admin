<template>
    <div>
        {{ authStore.user }}
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/app/store/auth'
const authStore = useAuthStore()
    const loadingInstance = ElLoading.service({
        fullscreen: true,
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
</script>