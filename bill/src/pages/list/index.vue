<route lang="json">
{
  "layout": "tabbar",
  "style": { "navigationBarTitleText": "账单" },
  "name": "list"
}
</route>
<template>
  <view>
    <wd-tabs v-model="tab">
         <wd-tab title="列表" name="list">
            <List v-if="tab === 'list'" />
        </wd-tab>
        <wd-tab title="图表" name="chart">
            <Chart />
        </wd-tab>
    </wd-tabs>
  </view>
</template>

<script setup lang="ts">
import List from './list.vue'
import Chart from './chart.vue'
const tab = ref('list')

</script>

<style lang="scss" scoped>
:deep(.wd-table__content) {
  width: 100% !important;
  display: flex !important;
  justify-content: space-between !important;
  .wd-table-col {
    width: inherit !important;
    .wd-table__cell {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
