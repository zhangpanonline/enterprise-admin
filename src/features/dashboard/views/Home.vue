<template>
    <div class=" bg-amber-50" >
        {{ authStore.user }}
        <el-button @click="onCreateTable()">Create Table</el-button>
        <el-button @click="onFetchUser()">fetch user</el-button>
    </div>
</template>

<script setup lang="ts">
import { createTableApi } from '@/edgeFunction/index.ts'
import { useAuthStore } from '@/app/store/auth'
import { supabase } from '@/shared/utils/request/supabase'
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
const onFetchUser = async () => {
    const { data, error } = await supabase.from('users').select('*')
    console.log(data, error)
}
</script>