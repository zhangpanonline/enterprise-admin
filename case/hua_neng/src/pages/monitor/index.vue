<route lang="json">
{
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "",
    "navigationBarBackgroundColor": "#1A65EE"
  },
  "name": "monitor"
}
</route>

<template>
  <view class="monitor bg_color3">
    <view class="wraper-calendar p-[20px] pt-0">
      <h1 class="mb-[15px] font_tbmct font-400 text-[22px] text_color1">
        {{ userStore?.user?.dept?.deptName || '-' }}
      </h1>
      <MonitorCalenar
        ref="monitorCalenarRef"
        v-model:dateType="tabType"
        v-model:dataObj="dataObj"
        :dataList="dataList"
        @change-month="paramsDate = $event + '-01'"
      />
    </view>
    <wd-gap height="15px"></wd-gap>
    <BarChart
      v-if="userStore.user.fillMethod === '1' && barList.length"
      :barList="barList"
    />
    <wd-gap v-if="userStore.user.fillMethod === '1'" height="15px"></wd-gap>
    <MonitorCard :dataObj="dataObj"></MonitorCard>
    <wd-gap height="15px"></wd-gap>
  </view>
</template>

<script setup lang="ts">
import { getPowerMonitApi } from '@/apis/monitor';
import { getPowerDetailApi } from '@/apis/home';
import BarChart from './components/BarChart.vue';
import MonitorCard from './components/MonitorCard.vue';
import MonitorCalenar from './components/MonitorCalenar/index.vue';
import { useUserStore } from '@/store';
import dayjs from 'dayjs';

onShareAppMessage(() => ({
  title: '电量管理助手',
  path: '/pages/monitor/index',
}));

const userStore = useUserStore();
const monitorCalenarRef = ref(null);

const dataList = ref([]);
const dataObj = ref({});
const barList = ref([]);
const paramsDate = ref(dayjs().format('YYYY-MM-DD'));

enum DateType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

const tabType = ref(DateType.DAY);

watch([tabType, paramsDate], fetchData);
watch(
  () => dataObj.value,
  () => {
    fetch24hData(dataObj.value.reportId);
  },
  {
    deep: true,
  },
);
onShow(fetchData);

async function fetchData() {
  dataList.value = [];
  barList.value = [];
  const params = {
    dateType: { day: 'DAY', week: 'WEEK', month: 'MONTH' }[tabType.value],
    date: paramsDate.value,
    deptId: userStore.user.deptId,
    userId: userStore.user.userId,
  };
  const res = await getPowerMonitApi(params);
  if (res.code !== 200) return;
  // for (let k in res.data) {
  //   res.data[k].diffPower = res.data[k].diffPower ?? 0;
  //   res.data[k].diffRatio = res.data[k].diffRatio ?? 0;
  //   res.data[k].realPower = res.data[k].realPower ?? 0;
  //   res.data[k].reportPower = res.data[k].reportPower ?? 0;
  // }
  if (tabType.value === DateType.DAY) {
    for (let k in res.data) {
      const o = (res.data as unknown)[k];
      o.date = k;
      o.info = o.diffPower?.toFixed(2);
      o.topInfo = o.realPower?.toFixed(2);
      o.topInfoColor = '#888';
      o.infoBgColor = o.info < 0 ? '#D72A1B33' : '#00AC6133';
      o.infoColor = o.info < 0 ? '#D72A1BFF' : '#00AC61FF';
      dataList.value.push(o);
    }
    dataObj.value = dataList.value[new Date().getDate() - 1];
    // monitorCalenarRef.value?.selectDay(
    //   paramsDate.value.slice(0, 8) + new Date().getDate(),
    // );
  } else if (tabType.value === DateType.WEEK) {
    let id = 0;
    const arr = [];
    for (let k in res.data) {
      const o = (res.data as unknown)[k];
      const range = o.dateDesc.split('-');
      o.id = o.reportId ?? id++;
      o.info = k;
      o.value = o.diffPower?.toFixed(2);
      o.value2 = o.realPower?.toFixed(2);
      o.start = `${range[0]}-${range[1]}`;
      o.end = `${range[2]}-${range[3]}`;
      o.style = {
        color: o.diffPower < 0 ? '#D72A1B' : '#00AC61',
        background: o.diffPower < 0 ? '#D72A1B33' : '#00AC6133',
      };
      dataList.value.push(o);
      arr.push(`${range[0]}${range[1]}`);
    }
    let idx = 0;
    const date = dayjs().format('MMDD');
    for (let val of arr) {
      if (date >= val) {
        idx++;
      } else {
        break;
      }
    }
    monitorCalenarRef.value?.calendarChange(dataList.value[--idx]);
  } else if (tabType.value === DateType.MONTH) {
    const curMonth = new Date().getMonth();
    let id = 0;
    for (let k in res.data) {
      const o = (res.data as unknown)[k];
      o.id = k ?? id++;
      o.info = k;
      o.value = o.diffPower?.toFixed(2);
      o.value2 = o.realPower?.toFixed(2);
      o.style = {
        color: o.diffPower < 0 ? '#D72A1B' : '#00AC61',
        background: o.diffPower < 0 ? '#D72A1B33' : '#00AC6133',
      };
      dataList.value.push(o);
    }
    monitorCalenarRef.value?.calendarChange(dataList.value[curMonth]);
  }
}

async function fetch24hData(id) {
  barList.value = [];
  if (!id) return;
  const res = await getPowerDetailApi({ id });
  if (res.code === 200) {
    barList.value.push(res.data.time01);
    barList.value.push(res.data.time02);
    barList.value.push(res.data.time03);
    barList.value.push(res.data.time04);
    barList.value.push(res.data.time05);
    barList.value.push(res.data.time06);
    barList.value.push(res.data.time07);
    barList.value.push(res.data.time08);
    barList.value.push(res.data.time09);
    barList.value.push(res.data.time10);
    barList.value.push(res.data.time11);
    barList.value.push(res.data.time12);
    barList.value.push(res.data.time13);
    barList.value.push(res.data.time14);
    barList.value.push(res.data.time15);
    barList.value.push(res.data.time16);
    barList.value.push(res.data.time17);
    barList.value.push(res.data.time18);
    barList.value.push(res.data.time19);
    barList.value.push(res.data.time20);
    barList.value.push(res.data.time21);
    barList.value.push(res.data.time22);
    barList.value.push(res.data.time23);
    barList.value.push(res.data.time24);
  }
}
</script>

<style lang="scss" scoped>
.monitor {
  height: 100vh;
  overflow: auto;
  .wraper-calendar {
    background: linear-gradient(179deg, #1a65ee 0%, #ffffff 49%);
  }
}
</style>
