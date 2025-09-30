<template>
  <div class="main">
    <template v-if="dataStore.currentCategory === ''">
      <div @click="dataStore.setCurrentCategory('market')">市场挂牌</div>
      <div @click="dataStore.setCurrentCategory('centralized')">集中竞价</div>
    </template>
    <MarketListing v-if="dataStore.currentCategory === 'market'" />
    <CentralizedBidding v-if="dataStore.currentCategory === 'centralized'" />
  </div>
</template>

<script setup lang="ts">
import MarketListing from '@/views/marketListing/index.vue'
import CentralizedBidding from '@/views/ContentContainer/index.vue'
import { useDataStore } from '@/store'
const dataStore = useDataStore()

</script>

<style lang="scss" scoped>
.main {
  width: var(--aog-app-min-width);
  height: var(--aog-app-min-height);
}
</style>
