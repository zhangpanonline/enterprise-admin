<template>
    <div>
        {{ authStore.user }}
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/app/store/auth'
const authStore = useAuthStore()
</script>