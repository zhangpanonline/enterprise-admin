<template>
  <view class="h-[42px] w-full flex items-center gap-[10px]">
    <!-- 日、周、月切换 -->
    <view
      class="flex items-center p-[5px] box-border gap-[5px] h-full text-center rounded-[10px] text-4 font-500 text_color2 flex-1 bg-white/40 border-1 border-solid border-white/20"
    >
      <text
        v-for="type in dateTypeList"
        :key="type"
        :class="[
          'flex-1',
          dateType === type
            ? 'text_color1 flex-1 bg-white h-[32px] rounded-[6px] leading-[32px]'
            : 'text_color2',
        ]"
        @click="((dataType = DataType.CALENDAR), (dateType = type))"
        >{{ dict[type] }}</text
      >
    </view>
    <!-- 图表、日历切换图标 -->
    <wd-img
      @click="
        dataType =
          dataType === DataType.CALENDAR ? DataType.CHART : DataType.CALENDAR
      "
      :src="
        inject('STATIC_URL') +
        (dataType === DataType.CALENDAR
          ? '/monitor_chart.png'
          : '/monitor_calendar.png')
      "
      width="42px"
      height="42px"
    ></wd-img>
  </view>
  <view class="wraper-calendar">
    <wu-calendar
      ref="calendarRef"
      :insert="true"
      :itemHeight="dateType === DateType.DAY ? 65 : 38"
      color="#1A65EEFF"
      :customType="dateType"
      :selected="dataList"
      :weekList="dataList"
      :selectedWeek="selectedWeek"
      :selectedMonth="selectedMonth"
      :showMonth="false"
      :monthList="dataList"
      :todayDefaultStyle="false"
      :useDefaultSlot="dataType === DataType.CHART"
      @change="calendarChange"
      @monthSwitch="handleMonthSwitch"
    >
      <view v-if="dataType === DataType.CHART" class="h-[200px]">
        <BarChart :type="dateType" :dataList="dataList" @getIndex="getIndex" />
      </view>
    </wu-calendar>
  </view>
</template>

<script setup lang="ts">
// @ts-ignore
import WuCalendar from '@/uni_modules/wu-calendar/components/wu-calendar/wu-calendar';
import dayjs from 'dayjs';
import BarChart from './BarChart.vue';

defineOptions({
  options: {
    styleIsolation: 'shared',
  },
});

const emit = defineEmits(['changeMonth']);

const props = defineProps({
  dataList: {
    type: Array,
    default: () => [],
  },
});

enum DataType {
  CHART = 'chart',
  CALENDAR = 'calendar',
}
const dataType = ref<DataType>(DataType.CALENDAR);

onHide(() => {
  dataType.value = DataType.CALENDAR;
});

enum DateType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

const dict: Readonly<Record<DateType, string>> = {
  day: '日',
  week: '周',
  month: '月',
};

const calendarRef = ref(null);
const dateType = defineModel<DateType>('dateType');
const dataObj = defineModel('dataObj');
const dateTypeList = Object.values(DateType);

const selectedWeek = ref<string>('');
const selectedMonth = ref<string>('');

// onMounted(() => {
//   if (dateType.value === DateType.DAY) {
//     calendarRef.value.gotoDate(dayjs(dayjs().format('YYYY-MM-DD')).toDate());
//   }
// });

// 选择日历
const calendarChange = (e) => {
  if (dateType.value === DateType.WEEK) {
    selectedWeek.value = String(e.id);
    dataObj.value = e;
  } else if (dateType.value === DateType.MONTH) {
    selectedMonth.value = e.id;
    dataObj.value = e;
  } else if (dateType.value === DateType.DAY) {
    dataObj.value = e.extraInfo;
  }
};

const getIndex = (idx) => {
  const e = props.dataList[idx];
  if (dateType.value === DateType.WEEK) {
    selectedWeek.value = String(e.id);
    dataObj.value = e;
  } else if (dateType.value === DateType.MONTH) {
    selectedMonth.value = e.id;
    dataObj.value = e;
  } else if (dateType.value === DateType.DAY) {
    dataObj.value = e;
  }
};
// 切换月份
function handleMonthSwitch(e) {
  emit('changeMonth', e.fullDate);
  // TODO 这样写不行
  // if (dateType.value === DateType.DAY) {
  //   nextTick(() => {
  //     calendarRef.value.gotoDate(dayjs(e.fullDate + '-01').toDate());
  //   });
  // }
}

function selectDay(date) {
  nextTick(() => {
    calendarRef.value.gotoDate(dayjs(date).toDate());
  });
}

defineExpose({
  calendarChange,
  selectDay,
});
</script>

<style scoped lang="scss">
:deep(.wu-calendar__content) {
  background-color: transparent !important;
}
:deep(.wu-calendar__header) {
  border: none;
}
:deep(.wu-calendar__header-text) {
  font-weight: 800;
}
:deep(.wu-calendar__backtoday) {
  display: none;
}
</style>
