<template>


    <div class="text-red-500" >home</div>
    <div class="text-primary" >home</div>
    <el-button type="primary" @click="handleTheme" >切换颜色</el-button>
</template>

<script lang="ts" setup>
import { setTheme, getTheme } from '@/theme';
const handleTheme = () => {
    const theme = getTheme()
    theme.colors.primary = theme.colors.primary === '#67c23a' ? '#409eff' : '#67c23a'
    setTheme(theme)
}
</script>