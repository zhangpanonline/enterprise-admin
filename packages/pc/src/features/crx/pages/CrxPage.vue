<template>
    <div>
        <h1>{{ crx }}</h1>
    <hr/>
    <h2>{{ authStore.accessToken }}</h2>
    <el-button type="primary" @click="loginCrx()" >登录插件</el-button>
    </div>
</template>

<script lang="ts" setup>
// import { supabase } from '@/shared/utils/request'
import { useRefreshToken } from '@/features/auth/hooks/useRefreshToken'
import { setCrxCode } from '../api/crx.api'
const crx = ref()
import { useAuthStore } from '@/app/store/auth'
import { dayjs } from 'element-plus'

const authStore = useAuthStore()
async function loginCrx() {
    crx.value = crypto.randomUUID()
    const {access_token, refresh_token} = await useRefreshToken() as {access_token: string, refresh_token: string}
    // const a = await supabase.auth.signOut()
    // console.log(a, '!!!!!!!!')
    // const res = await supabase.auth.setSession({
    //     access_token,
    //     refresh_token
    // }
    // )
    // console.log(res, '@@@@@@@@')
    const expires_at = dayjs(Date.now() + 1000 * 60 * 1).format('YYYY-MM-DD HH:mm:ss')
    await setCrxCode({ code: crx.value, access_token, refresh_token, expires_at })
    const status = await window.crxzp.login(crx.value)
    if (status === 'success') {
        ElMessage.success('登录成功')
    } else {
        ElMessage.error('status')
    }
}
</script>