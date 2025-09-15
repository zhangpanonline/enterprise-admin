<template>
  <div class="w-full h-full box-border bg-[#f0f5f9]">
    <RouterView></RouterView>
  </div>
</template>


<script setup lang="ts" >
const router = useRouter()
window.$wujie?.bus.$on("navigate", (path: string) => {
  router.push(path)
});

</script>