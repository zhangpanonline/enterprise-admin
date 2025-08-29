<template>
    <el-menu default-active="/" router>
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/crx">插件管理</el-menu-item>
        <el-sub-menu index="system">
            <template #title>系统管理</template>
            <el-menu-item index="/users">用户管理</el-menu-item>
            <el-menu-item index="/roles">角色管理</el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<script lang="ts" setup>
</script>