<template>
  <wd-popup
    v-model="visible"
    custom-class="rounded-t-[10px]"
    position="bottom"
    :close-on-click-modal="false"
    :safe-area-inset-bottom="true"
  >
    <view class="m-[15px] flex justify-between items-center">
      <text class="text-[18px] font_tbmct text_color1 font-400"
        >选择相似日电量</text
      >
      <text class="text-[15px] text-[#999999] font-500" @click="visible = false"
        >关闭</text
      >
    </view>
    <view>
      <view class="px-[15px]">
        <wu-calendar
          ref="calendar"
          :insert="true"
          :showMonth="false"
          :itemHeight="calenarType === 'day' ? 50 : 39"
          color="#1A65EEFF"
          :useToday="false"
          :selected="selectedCalendar"
          :type="nativeType"
          :todayDefaultStyle="false"
          :customType="calenarType"
          :weekList="weekList"
          :selectedWeek="selectedWeek"
          :selectedMonth="selectedMonth"
          :monthList="monthList"
          :first-day-of-week="1"
          @monthSwitch="monthSwitch"
          @change="calendarChange"
        ></wu-calendar>
        <wd-button
          v-if="!is24H"
          size="large"
          block
          :round="false"
          :disabled="!selectedVal"
          custom-class="my-[15px]"
          @click="onConfirm"
          >确认选择</wd-button
        >
      </view>
      <view v-if="is24H" class="bg-[#f0f0f0] px-[15px] mt-[10px]">
        <view class="py-[15px] grid grid-cols-4 gap-[10px]">
          <view
            class="bg-white box-border px-[4px] rounded-[8px] h-[40px] flex justify-start items-center"
            v-for="(v, i) in selected24Val"
            :key="i"
          >
            <text
              class="font-500 text-[15px] text-center w-[25px] inline-block text_color3 border-r border-r-solid border-r-[#DADADAFF]"
              >{{ i + 1 }}</text
            >
            <text
              class="text_color2 font-500 inline-block pl-[4px] flex-1 text-4"
              >{{ v ?? '-' }}</text
            >
          </view>
        </view>
        <wd-button
          size="large"
          block
          :round="false"
          :disabled="!selected24Val.every((v) => !!v)"
          custom-class="my-[15px]"
          @click="onConfirm"
          >确认导入</wd-button
        >
      </view>
    </view>
  </wd-popup>
</template>

<script setup lang="ts">
// @ts-ignore
import WuCalendar from '@/uni_modules/wu-calendar/components/wu-calendar/wu-calendar';
import { getSimilarPowerApi } from '@/apis/home';
import dayjs from 'dayjs';

defineOptions({
  options: {
    styleIsolation: 'shared',
  },
});

const calendar = ref(null);

const emit = defineEmits(['confirm', 'confirm24']);

const visible = ref(false);
const calenarType = ref<'month' | 'week' | 'day'>('day');
const nativeType = ref<'month' | 'week'>('month');
const is24H = ref(false);

const params = {
  settingId: '',
  deptId: '',
  type: '',
  date: dayjs().format('YYYY-MM-DD'),
};

const selectedCalendar = ref([]);

const selectedVal = ref('');
const selected24Val = ref(Array(24).fill(null));

const selectedWeek = ref('');
const weekList = ref([]);
const selectedMonth = ref<string>('');
const monthList = ref([]);

function calendarChange(e: any) {
  nextTick(() => {
    if (calenarType.value === 'day') {
      if (is24H.value) {
        selected24Val.value = e.extraInfo.list || Array(24).fill(null);
      } else {
        selectedVal.value = e.extraInfo.info;
      }
    } else if (calenarType.value === 'week') {
      selectedWeek.value = e.id;
      if (is24H.value) {
        selected24Val.value = e.list || Array(24).fill(null);
      } else {
        selectedVal.value = e.value;
      }
    } else if (calenarType.value === 'month') {
      selectedMonth.value = e.id;
      if (is24H.value) {
        selected24Val.value = e.list || Array(24).fill(null);
      } else {
        selectedVal.value = e.value;
      }
    }
  });
}

function monthSwitch({ fullDate }) {
  if (fullDate === dayjs(params.date).format('YYYY-MM')) return;
  params.date = fullDate + '-01';
  selected24Val.value = Array(24).fill(null);
  selectedVal.value = '';
  getSimilarPower();
}

async function getSimilarPower(setDefault = false) {
  selectedCalendar.value.length = 0;
  weekList.value.length = 0;
  monthList.value.length = 0;
  const res = await getSimilarPowerApi(params);
  if (calenarType.value === 'day') {
    for (let date in res.data) {
      const o = res.data[date];
      if (o) {
        selectedCalendar.value.push({
          date,
          info: is24H.value ? get24HTotal(o) : o.totalPower,
          infoColor: '#666666',
          list: [
            o.time01,
            o.time02,
            o.time03,
            o.time04,
            o.time05,
            o.time06,
            o.time07,
            o.time08,
            o.time09,
            o.time10,
            o.time11,
            o.time12,
            o.time13,
            o.time14,
            o.time15,
            o.time16,
            o.time17,
            o.time18,
            o.time19,
            o.time20,
            o.time21,
            o.time22,
            o.time23,
            o.time24,
          ],
        });
      } else {
        selectedCalendar.value.push({
          date,
          info: '',
          infoColor: '#666666',
        });
      }
    }
    if (setDefault) {
      calendar.value.gotoDate(dayjs().subtract(1, 'day').toDate());
    }
  } else if (calenarType.value === 'week') {
    for (let week in res.data) {
      const o = res.data[week];
      if (o) {
        weekList.value.push({
          id: week,
          info: week,
          value: is24H.value ? get24HTotal(o) : o.totalPower,
          start: o.start.slice(5),
          end: o.end.slice(5),
          style: {
            fontWeight: 550,
            fontSize: '14px',
            height: '18px',
          },
          list: [
            o.time01,
            o.time02,
            o.time03,
            o.time04,
            o.time05,
            o.time06,
            o.time07,
            o.time08,
            o.time09,
            o.time10,
            o.time11,
            o.time12,
            o.time13,
            o.time14,
            o.time15,
            o.time16,
            o.time17,
            o.time18,
            o.time19,
            o.time20,
            o.time21,
            o.time22,
            o.time23,
            o.time24,
          ],
        });
      } else {
        weekList.value.push({
          id: week,
          info: week,
          value: '-',
          start: '',
          end: '',
          style: {
            fontWeight: 550,
            fontSize: '14px',
            height: '18px',
          },
        });
      }
    }
  } else if (calenarType.value === 'month') {
    const list = Object.values(res.data);
    for (let idx = 0; idx < list.length; idx++) {
      const o = list[idx] as any;
      const month = {
        0: '一月',
        1: '二月',
        2: '三月',
        3: '四月',
        4: '五月',
        5: '六月',
        6: '七月',
        7: '八月',
        8: '九月',
        9: '十月',
        10: '十一月',
        11: '十二月',
      }[idx];
      if (o) {
        monthList.value.push({
          id: month,
          info: month,
          value: is24H.value ? get24HTotal(o) : o.totalPower,
          style: {
            fontWeight: 550,
            fontSize: '14px',
            height: '18px',
          },
          list: [
            o.time01,
            o.time02,
            o.time03,
            o.time04,
            o.time05,
            o.time06,
            o.time07,
            o.time08,
            o.time09,
            o.time10,
            o.time11,
            o.time12,
            o.time13,
            o.time14,
            o.time15,
            o.time16,
            o.time17,
            o.time18,
            o.time19,
            o.time20,
            o.time21,
            o.time22,
            o.time23,
            o.time24,
          ],
        });
      } else {
        monthList.value.push({
          id: month,
          info: month,
          value: '-',
          style: {
            fontWeight: 550,
            fontSize: '14px',
            height: '18px',
          },
        });
      }
    }
  }
}

function get24HTotal(o) {
  const rate = 10000;
  const list = [
    o.time01,
    o.time02,
    o.time03,
    o.time04,
    o.time05,
    o.time06,
    o.time07,
    o.time08,
    o.time09,
    o.time10,
    o.time11,
    o.time12,
    o.time13,
    o.time14,
    o.time15,
    o.time16,
    o.time17,
    o.time18,
    o.time19,
    o.time20,
    o.time21,
    o.time22,
    o.time23,
    o.time24,
  ];
  const total = list.reduce((pre, cur) => pre + rate * cur, 0);
  return (total / rate).toFixed(0);
}

function onConfirm() {
  if (is24H.value) {
    emit('confirm24', selected24Val.value);
  } else {
    emit('confirm', selectedVal.value);
  }
  visible.value = false;
}

defineExpose({
  visible,
  calendar,
  nativeType,
  calenarType,
  params,
  is24H,
  getSimilarPower,
});
</script>

<style scoped lang="scss">
:deep(.wu-calendar__content) {
  background-color: transparent !important;
}
:deep(.wu-calendar__header) {
  border: none !important;
}
:deep(.wu-calendar__header-text) {
  font-weight: 800;
}
:deep(.wu-calendar__weeks-day) {
  border: none;
}
:deep(.wu-calendar__backtoday) {
  display: none !important;
}
</style>
