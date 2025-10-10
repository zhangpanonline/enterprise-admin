<template>
  <el-config-provider namespace="aog-el" :locale="zhCn" :zIndex="8000">
    <!-- 弹窗主内容 -->
    <Popup />
  </el-config-provider>
</template>

<script setup lang="ts">
import Popup from './popup/index.vue'
import { initListeners } from '@/content/eventListener'
import { initTheme } from '@/utils/theme'
import { zhCn } from 'element-plus/es/locales'

// 监听插件系统消息
initListeners()
initTheme()

console.log('插件启动.......')
</script>

<style></style>
