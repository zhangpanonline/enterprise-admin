<template>
    <div>
        {{ authStore.user }}
        <el-button @click="onCreateTable()">Create Table</el-button>
    </div>
</template>

<script setup lang="ts">
import { createTableApi } from '@/edgeFunction/index.ts'
import { useAuthStore } from '@/app/store/auth'
const authStore = useAuthStore()
    // const loadingInstance = ElLoading.service({
    //     fullscreen: true,
    //     lock: true,
    //     text: '加载中...',
    //     background: 'rgba(0, 0, 0, 0.7)'
    // })

const onCreateTable = async () => {
    const rea = await createTableApi('sys_demo')
    console.log(rea)
}
</script>