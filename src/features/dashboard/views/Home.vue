<template>
    <div>
        {{ authStore.user }}
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/features/auth/store/useAuthStore'
const authStore = useAuthStore()
</script>