<template>
    <div>
        <el-button type="primary" @click="count++">{{ count }}</el-button>
        <el-button type="primary" @click="router.go(0)">refresh</el-button>
    </div>
</template>

<script setup lang="ts">
const router = useRouter()
const count = ref(0)
</script>