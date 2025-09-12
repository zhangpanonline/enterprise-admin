<template>
  <div class="w-full h-full overflow-x-auto overflow-y-auto" >

    <WujieVue width="100%" height="100%" name="sub-app-nuxt" sync :url="VITE_SUB_APP_NUXT"> </WujieVue>
    <button class="bg-red-500" @click="onClick">主应用传递给子应用</button>
  </div>
</template>

<script setup lang="ts">
const VITE_SUB_APP_NUXT = import.meta.env.VITE_SUB_APP_NUXT
import wujie from 'wujie-vue3'
const onClick = () => {
  wujie.bus.$emit('main', 'hello sub1')
}
</script>
