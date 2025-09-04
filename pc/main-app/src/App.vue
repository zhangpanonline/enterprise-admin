<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterLink to="/sub-app-next">sub-app-next</RouterLink>
  <RouterLink to="/sub-app-vue">sub-app-vue</RouterLink>
  <RouterView class="outline"></RouterView>
</template>

<style scoped></style>
