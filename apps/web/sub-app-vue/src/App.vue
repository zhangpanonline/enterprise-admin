<template>
  <div class="w-full h-full box-border bg-[#f0f5f9]">
    <RouterView></RouterView>
  </div>
</template>


<script setup lang="ts" >
import { useI18n } from 'vue-i18n'
const { locale: language } = useI18n()
const router = useRouter()
window.$wujie?.bus.$on("navigate", (path: string) => {
  router.push(path)
});
window.$wujie?.bus.$on("language", (local: string) => {
  language.value = local
});


</script>