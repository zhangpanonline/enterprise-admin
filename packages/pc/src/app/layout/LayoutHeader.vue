<template>
    <div class="flex items-center justify-end px-5 border-b border-gray-200" >
        <el-button @click="loginOut" size="small" >退出登录</el-button>
    </div>
</template>

<script lang="ts" setup>
import { useLoginOut } from '@/features/auth/hooks/useLoginOut'

const { loginOut } = useLoginOut()

</script>