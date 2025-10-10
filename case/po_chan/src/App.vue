<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.js'
</script>

<template>
  <!-- https://element-plus.org/zh-CN/component/config-provider.html -->
  <el-config-provider :button="{ autoInsertSpace: true }" :message="{ max: 1 }" :locale="zhCn">
    <RouterView />
  </el-config-provider>
</template>
