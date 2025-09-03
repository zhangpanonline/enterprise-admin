<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterLink to="/app1">app1</RouterLink>
  <RouterLink to="/app2">app2</RouterLink>
  <RouterView class="outline"></RouterView>
</template>

<style scoped></style>
