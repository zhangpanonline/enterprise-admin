<route lang="json">
{
  "layout": "tabbar",
  "style": { "navigationBarTitleText": "" },
  "name": "chart"
}
</route>
<template>
  <view class="p-5">
    <wu-calendar
      :insert="true"
      :selected="list"
      disabledChoice
      :todayDefaultStyle="false"
      color="#34d19d"
    ></wu-calendar>
    <wd-button
      type="primary"
      custom-class="mt-10"
      size="large"
      block
      @click="show = true"
      >添加数据</wd-button
    >
    <wd-popup
      v-model="show"
      :safe-area-inset-bottom="true"
      position="bottom"
      custom-style="height: 200px; padding: 20px;"
      @close="handleClose"
    >
      <view class="size-5 font-600 text-center leading-none w-full"
        >添加数据</view
      >
      <wd-calendar v-model="form.date" label-width="120px" label="日期选择" />
      <wd-picker
        :columns="columns"
        label-width="120px"
        label="晚餐"
        v-model="form.type"
      />
      <wd-button
        type="primary"
        custom-class="mt-10"
        size="large"
        block
        @click="onSubmit"
        >提交</wd-button
      >
    </wd-popup>
  </view>
</template>

<script setup lang="ts">
import { createDinnerApi, getDinnerApi } from '@/apis/index';
import wuCalendar from '@/uni_modules/wu-calendar/components/wu-calendar/wu-calendar.vue';
import { onShow } from '@dcloudio/uni-app';
import { useNotify } from 'wot-design-uni';

const show = ref(false);
const columns = [
  { label: '减肥', value: 1 },
  { label: '正常', value: 2 },
  { label: '全饱', value: 3 },
];

const list = ref([]);

const form = reactive({
  type: 1, // 1 没吃，2 七分饱，3 全饱
  date: new Date(),
});

onShow(getDinner);

const typeColor = {
    1: 'green',
    2: '#f0883a',
    3: 'red'
}

async function getDinner() {
  const res = await getDinnerApi();

  list.value = res.map(({ type, date }) => ({
    date,
    badge: true,
    badgeColor: typeColor[type],
    badgePosition: 'bottom-center',
    badgeSize: '14px',
  }))
}

const { showNotify } = useNotify();
async function onSubmit() {
  const date = new Date(form.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  await createDinnerApi({ ...form, date: `${year}-${month}-${day}` });
  showNotify({
    type: 'success',
    message: '操作成功！',
    background: '#07c160',
    duration: 1500,
  });
  form.type = 1
  form.date = new Date()
  show.value = false
  getDinner();
}

const handleClose = () => {
  form.type = 1;
  form.date = new Date();
};
</script>
