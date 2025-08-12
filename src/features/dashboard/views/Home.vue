<template>
    <div class=" bg-amber-50" >
        {{ authStore.user }}
        <el-button @click="onFetchUser()">fetch user</el-button>
    </div>
</template>

<script setup lang="ts">
import { callEdgeFunctionApi } from '@/edgeFunction/index.ts'
import { useAuthStore } from '@/app/store/auth'
const authStore = useAuthStore()

const onFetchUser = async () => {
    const rea = await callEdgeFunctionApi({ name: 'get_users_list', page: 1, perPage: 10})
    console.log(rea)
}
</script>