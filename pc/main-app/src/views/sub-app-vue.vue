<template>
  <div class="w-full h-full overflow-x-auto overflow-y-auto" >
    <WujieVue width="100%" height="100%" name="sub-app-vue" sync :url="VITE_SUB_APP_VUE"> </WujieVue>
  </div>
</template>

<script setup lang="ts">
const VITE_SUB_APP_VUE = import.meta.env.VITE_SUB_APP_VUE
</script>
