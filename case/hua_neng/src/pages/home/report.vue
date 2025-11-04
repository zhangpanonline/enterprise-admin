<route lang="json">
{
  "style": { "navigationBarTitleText": "电量填报" },
  "name": "homeReport"
}
</route>

<template>
  <view class="home-report bg_color3 px-[15px]! overflow-auto">
    <wd-gap height="15px"></wd-gap>
    <CompanyInfo v-if="info" :stopTime="info?.stopTime"></CompanyInfo>
    <wd-gap height="15px"></wd-gap>
    <ReportInfo v-if="info" :info="info"></ReportInfo>
    <wd-gap height="15px"></wd-gap>
    <PointsInfo v-if="info" :settingId="info?.settingId"></PointsInfo>
    <wd-gap height="15px"></wd-gap>
  </view>
</template>

<script setup lang="ts">
import { Schema } from '@/apis/home';
import CompanyInfo from './components/CompanyInfo.vue';
import ReportInfo from './components/ReportInfo.vue';
import PointsInfo from './components/PointsInfo.vue';

const info = ref<Schema>(null);

onLoad((option: Schema) => {
  info.value = option;
});
</script>

<style lang="scss" scoped>
.home-report {
  height: calc(100vh - 44px);
}
</style>
