<template>
  <div class="w-full h-full py-5" >
    <WujieVue class="w-full h-full rounded-2xl overflow-hidden" name="sub-app-vue" sync :url="VITE_SUB_APP_VUE"> </WujieVue>
  </div>
</template>

<script setup lang="ts">
const VITE_SUB_APP_VUE = import.meta.env.VITE_SUB_APP_VUE
</script>
