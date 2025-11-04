<template>
  <!-- <view class="w-full h-full relative"> -->
  <QiunDataCharts
    type="mount"
    :opts="opts"
    :chartData="chartData"
    :ontouch="true"
    :onmovetip="true"
    background="none"
    :canvas2d="true"
    canvasId="xEGJrHKhNpYedqOZbbwrhDqtCrAvsfUB"
    tooltipFormat="tooltipFormat"
    @getIndex="handleGetIndex"
  />
  <!-- <view class="line"> </view>
    <view
      class="w-[115px] h-[84px] bg-[#f0f0f0] rounded-[10px] flex flex-col justify-center items-start p-[10px] box-border tooltip"
    >
      <view class="text_color1 font-500 text-[14px]">多行文本1</view>
      <view class="text-[12px] flex justify-between items-center">
        <text class="text_color2 font-400">偏差电量</text>
        <text class="text_color1 font-500">+8万度</text>
      </view>
      <view class="text-[12px] flex justify-between items-center">
        <text class="text_color2 font-400">偏差率</text>
        <text class="text_color1 font-500">1.2%</text>
      </view>
    </view>
  </view> -->
</template>

<script setup lang="ts">
import QiunDataCharts from '@/uni_modules/qiun-data-charts/qiun-data-charts/qiun-data-charts.vue';
const emit = defineEmits(['getIndex']);

function handleGetIndex({ currentIndex }) {
  emit('getIndex', currentIndex.index);
}

const props = defineProps({
  type: {
    type: String,
  },
  dataList: {
    type: Array,
    default: () => [],
  },
});
const dict = {
  day: '日',
  week: '周',
  month: '月',
};

const typeName = computed(() => dict[props.type]);

const max = computed(() => Math.max(...props.dataList.map((v) => v.diffPower)));
const min = computed(() => Math.min(...props.dataList.map((v) => v.diffPower)));

const chartData = computed(() => ({
  series: [
    {
      name: '',
      data: props.dataList.map((v, i) => ({
        ...v,
        name: i + 1,
        value: v.diffPower ?? 0,
        rate: `${(v.diffRatio * 100)?.toFixed(2)}%`,
        title: `第${i + 1}${typeName.value}`,
        color: v.diffPower > 0 ? '#aee5cd' : '#f2bdb8',
      })),
    },
  ],
}));
const opts = computed(() => {
  const o = {
    padding: [10, 0, 0, 0],
    enableScroll: true, //开启滚动条，X轴配置里需要配置itemCount单屏幕数据点数量
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
      itemCount: 5, // 单屏幕数据点数量
      scrollShow: true, // 是否显示滚动条
      scrollColor: '#cccccc', // 滚动条颜色
      scrollBackgroundColor: '#f1f1f1', // 滚动条底部背景颜色
    },
    yAxis: {
      disabled: true,
      data: [
        {
          title: '万度',
          titleOffsetX: -20,
        },
      ],
      gridType: 'dash',
      gridColor: '#f2f2f2',
      dashLength: 4,
      fontColor: '#999',
      showTitle: true,
    },
    extra: {
      tooltip: {
        bgColor: '#F0F0F0',
        legendShow: false,
        gridType: 'dash',
        borderRadius: 10,
        boxPadding: 10,
        fontColor: '#333333',
        showBox: true,
      },
      mount: {
        type: 'bar',
        widthRatio: 0.4,
        barBorderCircle: true,
        linearType: 'custom',
        colorStop: 0.5,
        customColor: props.dataList.map((v) =>
          v.diffPower > 0 ? '#02ac62' : '#d72c1d',
        ),
      },
    },
  };
  const maxVal = Math.max(max.value, -min.value);
  const minVal = Math.min(-max.value, min.value);
  if (maxVal !== minVal) {
    o.yAxis.data[0]['max'] = maxVal;
    o.yAxis.data[0]['min'] = minVal;
  }
  return o;
});
</script>

<style scoped lang="scss">
// .line {
//   position: absolute;
//   top: 0;
//   bottom: 0;
//   left: 50%;
//   z-index: 1000;
//   border-right: 1px dashed #999;
//   transform: translateX(-50%);
// }
// .tooltip {
//   position: absolute;
//   top: 10%;
//   left: 50%;
// }
</style>
