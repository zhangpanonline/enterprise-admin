<template>
  <div class="w-screen h-screen box-border bg-[#f0f5f9]">
    <RouterView class="flex-1"></RouterView>
  </div>
</template>

<script lang="ts" setup >
import { useI18n } from 'vue-i18n'
import WujieVue from 'wujie-vue3'
const { locale } = useI18n()

WujieVue.bus.$on('language', (language: string) => {
  locale.value = language
})
</script>