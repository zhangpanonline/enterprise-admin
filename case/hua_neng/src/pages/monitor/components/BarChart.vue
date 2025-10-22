<template>
  <view class="wraper-chart h-[180px] pt-[10px] mx-[15px] rounded-[10px]">
    <text class="text_color1 pl-[10px] text-[14px] font-800 mb-[10px]"
      >24点分时电量</text
    >
    <QiunDataCharts
      type="mount"
      :opts="opts"
      :chartData="chartData"
      :ontouch="true"
      :onmovetip="true"
      :canvas2d="true"
      v-if="chartData.series[0].data.length"
      canvasId="xEGJrHKhNpYedqOZbbwrhDqtCrAvsfUA"
    />
  </view>
</template>

<script setup lang="ts">
import QiunDataCharts from '@/uni_modules/qiun-data-charts/qiun-data-charts/qiun-data-charts.vue';
const props = defineProps(['barList']);
const chartData = computed(() => ({
  series: [
    {
      name: '',
      data: props.barList.map((value, i) => ({
        name: i + 1,
        value,
        color: '#b9daf9',
      })),
    },
  ],
}));
const opts = {
  padding: [30, 10, 25, 10],
  enableScroll: false, //开启滚动条，X轴配置里需要配置itemCount单屏幕数据点数量
  fontSize: 8, // 全局默认字体大小
  fontColor: '#666666', // 全局默认字体颜色，16进制颜色格式
  dataLabel: false, // 是否显示图表区域内数据点上方的数据文案
  legend: {
    show: false,
  },
  xAxis: {
    disableGrid: true,
    axisLine: true,
    fontSize: 8,
  },
  yAxis: {
    gridType: 'dash',
    gridColor: '#f2f2f2',
    dashLength: 4,
    fontColor: '#999',
    splitNumber: 4,
    showTitle: true,
    data: [
      {
        title: '万度',
        titleOffsetX: -20,
      },
    ],
  },
  extra: {
    tooltip: {
      bgColor: '#1a65ee',
      legendShow: false,
      gridType: 'dash',
    },
    mount: {
      type: 'bar',
      widthRatio: 0.4,
      linearType: 'custom',
      colorStop: 0.5,
      customColor: Array(24).fill('#1c66ee'),
    },
  },
};
</script>

<style lang="scss" scoped>
.wraper-chart {
  background: linear-gradient(180deg, #e9faff 0%, #ffffff 26%);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.05);
}
</style>
