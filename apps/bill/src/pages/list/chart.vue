<route lang="json">
{
  "layout": "tabbar",
  "style": { "navigationBarTitleText": "统计" },
  "name": "chart"
}
</route>
<template>
  <view class="content">
    <wd-card v-for="v in list" :key="v.month">
        <template #title>
            <view class="flex flex-justify-between items-center" >
                <text>{{v.month}}</text>
                <text>{{v.month_total}} ¥</text>
            </view>
        </template>
        <wd-tag v-for="item in v.categories" plain :key="item.label" round :bg-color="item.bg">{{item.label}}</wd-tag>
        <wd-cell v-for="item in v.categories" :key="item.label" :title="item.label" :value="item.value" />
    </wd-card>
  </view>
</template>

<script setup lang="ts">
import {
  getChartApi
} from '@/apis/index';

const list = ref([])

getChart()
async function getChart() {
    list.value = (await getChartApi()).map(v => ({
        ...v,
        categories: v.categories.map(v => ({ ...v, bg: randomHexColor() }))
    }))
}

function randomHexColor() {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

</script>
