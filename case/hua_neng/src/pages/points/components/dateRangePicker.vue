<!--
 * @Author: qiru
 * @Date： 2025-06-11 14:00:41
 * @Description: description
 -->

<template>
  <view>
    <view class="flex items-center">
      <view
        class="w-[200px] h-[40px] lh-[40px] border-b border-b-[#E6E6E6] border-b-solid text-center"
        @click="selectStart"
        :class="{ active: startFlag }"
        >{{ startDate || '开始时间' }}</view
      >
      <text class="ml-[20px] mr-[20px]">至</text>
      <view
        class="w-[200px] h-[40px] lh-[40px] border-b border-b-[#E6E6E6] border-b-solid text-center"
        @click="selectEnd"
        :class="{ active: endFlag }"
        >{{ endDate || '结束时间' }}</view
      >
    </view>
    <wd-datetime-picker-view
      v-if="!endFlag"
      type="date"
      v-model="startDateValue"
      @change="toggleStartDate"
    />
    <wd-datetime-picker-view
      v-if="endFlag"
      type="date"
      v-model="endDateValue"
      @change="toggleEndDate"
    />
  </view>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
const startDate = ref(dayjs().format('YYYY-MM-DD'));
const startDateValue = ref(dayjs(startDate.value, 'YYYY-MM-DD').valueOf());
const startFlag = ref(true);

const endDate = ref('');
const endDateValue = ref(dayjs(endDate.value, 'YYYY-MM-DD').valueOf());
const endFlag = ref(false);
const emit = defineEmits(['update-parent']);

function toggleStartDate({ value }) {
  startDate.value = dayjs(value).format('YYYY-MM-DD');
}
function toggleEndDate({ value }) {
  endDate.value = dayjs(value).format('YYYY-MM-DD');
}
// 点击开始时间选框
function selectStart() {
  startFlag.value = true;
  endFlag.value = false;
  emit('update-parent');
  if (!startDate.value) {
    startDate.value = dayjs().format('YYYY-MM-DD');
    startDateValue.value = dayjs(startDate.value, 'YYYY-MM-DD').valueOf();
  }
}
// 点击结束时间选框
function selectEnd() {
  endFlag.value = true;
  startFlag.value = false;
  emit('update-parent');
  if (!endDate.value) {
    endDate.value = dayjs().format('YYYY-MM-DD');
    endDateValue.value = dayjs(endDate.value, 'YYYY-MM-DD').valueOf();
  }
}
// 暴露一个重置所有值的方法
const resetAll = () => {
  startDate.value = '';
  endDate.value = '';
};
// 暴露方法给父组件
defineExpose({
  resetAll,
  startDate,
  endDate,
  startFlag,
  endFlag,
  startDateValue,
  endDateValue,
});
</script>

<style scoped lang="scss">
:deep(.wd-input) {
  text-align: center !important;
}
.active {
  color: #1a65ee;
  border-bottom-color: #1a65ee;
}
</style>
