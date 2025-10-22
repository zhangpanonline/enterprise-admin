<!--
 * @Author: qiru
 * @Date： 2025-06-11 09:09:17
 * @Description: 自定义时间选择
 -->

<template>
  <wd-popup
    :modelValue="props.showDatePicker"
    position="bottom"
    @close="handleClose"
    closable
  >
    <wd-tabs v-model="tab" ref="tabsRef">
      <wd-tab
        v-for="item in tabs"
        :key="item.id"
        :title="`${item.label}`"
        :name="item.label"
      >
        <wd-datetime-picker-view
          type="year-month"
          v-model="yearMonthValue"
          label="年月"
          v-if="tab == '月份选择'"
        />
        <view class="p-[20px] box-border" v-if="tab == '自定义时间'">
          <view class="text-[14px] text-[#666666] mb-[20px]">交易时间</view>
          <wd-radio-group
            v-model="quickOption"
            shape="button"
            @change="changeRadio"
          >
            <wd-radio :value="1">近3月</wd-radio>
            <wd-radio :value="2">近半年</wd-radio>
            <wd-radio :value="3">近一年</wd-radio>
          </wd-radio-group>
          <view
            class="text-[14px] text-[#666666] mt-[20px] mb-[20px] flex justify-between items-center"
          >
            <text>自定义</text>
            <wd-icon name="delete1" size="18px" @click="deleteDate()"></wd-icon>
          </view>
          <DateRangePicker
            ref="childRef"
            :child-prop="quickOption"
            @update-parent="handleUpdate"
          />
        </view>
        <view class="p-x-[15px]">
          <wd-button
            block
            :round="false"
            custom-class="h-[44px]! mb-[20px]!"
            @click="save()"
            >确定</wd-button
          >
        </view>
      </wd-tab>
    </wd-tabs>
  </wd-popup>
</template>

<script setup lang="ts">
import DateRangePicker from './dateRangePicker.vue';
import dayjs from 'dayjs';
const props = defineProps({
  showDatePicker: {
    type: Boolean,
    default: false,
  },
  dateTime: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:showDatePicker', 'update:dateTime']);
const tab = ref('月份选择');
const tabs = ref([
  {
    id: 1,
    label: '月份选择',
  },
  {
    id: 2,
    label: '自定义时间',
  },
]);
const yearMonthValue = ref<number>(Date.now());
const quickOption = ref<number | ''>();

function handleClose() {
  emit('update:showDatePicker', false);
}
function save() {
  if (tab.value == '月份选择') {
    emit('update:dateTime', dayjs(yearMonthValue.value).format('YYYY-MM'));
    handleClose();
  }
  if (tab.value == '自定义时间') {
    // console.log(childRef.value[1].startDate);
    // console.log(childRef.value[1].endDate);
    if (!childRef.value[1].startDate) {
      // 开始时间不能为空
      uni.showToast({
        title: '开始时间不能为空！',
        duration: 1500,
        icon: 'none',
      });
      return;
    }
    if (!childRef.value[1].endDate) {
      // 结束时间不能为空
      uni.showToast({
        title: '结束时间不能为空！',
        duration: 1500,
        icon: 'none',
      });
      return;
    }
    emit(
      'update:dateTime',
      childRef.value[1].startDate + '~' + childRef.value[1].endDate,
    );
    handleClose();
  }
}
const childRef = ref(null);

// 清空开始时间及结束时间选择
function deleteDate() {
  childRef.value.forEach((ele) => {
    ele?.resetAll();
  });
  quickOption.value = '';
}

// 快捷选项
function changeRadio({ value }) {
  if (value == 1) {
    // 近3月
    childRef.value[1].startDate = dayjs()
      .subtract(3, 'month')
      .format('YYYY-MM-DD');
    childRef.value[1].startDateValue = dayjs().subtract(3, 'month');
  }
  if (value == 2) {
    // 近半年
    childRef.value[1].startDate = dayjs()
      .subtract(6, 'month')
      .format('YYYY-MM-DD');
    childRef.value[1].startDateValue = dayjs().subtract(6, 'month');
  }
  if (value == 3) {
    // 近一年
    childRef.value[1].startDate = dayjs()
      .subtract(12, 'month')
      .format('YYYY-MM-DD');
    childRef.value[1].startDateValue = dayjs().subtract(12, 'month');
  }
  childRef.value[1].endDate = dayjs().format('YYYY-MM-DD');
  childRef.value[1].endDateValue = dayjs();
  childRef.value[1].startFlag = false;
  childRef.value[1].endFlag = false;
}
// 自定义时间便清空快捷选项
const handleUpdate = () => {
  quickOption.value = '';
};

onMounted(() => {
  yearMonthValue.value = dayjs(props.dateTime, 'YYYY-MM').valueOf();
});
</script>

<style scoped lang="scss">
:deep(.wd-tabs__nav-item) {
  flex: none !important;
  width: 100px !important;
}
:deep(.wd-tabs__line) {
  width: 80px !important;
  height: 1px !important;
}
</style>
