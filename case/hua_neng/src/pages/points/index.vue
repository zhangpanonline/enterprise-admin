<!--
 * @Author: qiru
 * @Date： 2025-06-10 09:54:22
 * @Description: 积分中心
 -->
<route lang="json">
{
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "",
    "navigationBarBackgroundColor": "#1A65EE"
  },
  "name": "points"
}
</route>

<template>
  <view class="content relative p-[20px] pt-[0px]">
    <view class="flex justify-between items-center">
      <view>
        <view class="text-[22px] text_color1 font_tbmct font-[400]"
          >我的积分</view
        >
        <view
          class="text-[26px] text_color1 font-bold font-['PingFang SC, PingFang SC'] mt-[5px]"
          >{{ totalScore }}</view
        >
      </view>
      <view
        class="w-[80px] h-[30px] lh-[30px] text-center bg-white rounded-[8px] text-[15px] text-[#1A65EE] font-[500]"
        @click="handleJumpTo()"
      >
        积分兑换
      </view>
    </view>
    <view class="relative">
      <view
        class="relative rounded-[8px] p-x-[15px] p-y-[5px] box-border z-10 w-[100%] h-[100%]"
      >
        <view class="absolute left-[0px] top-[2px] w-[100%] h-[82px]">
          <wd-img
            :src="inject('STATIC_URL') + '/bg-title.png'"
            width="100%"
            height="120%"
            custom-class="top"
          />
        </view>
        <view
          class="relative font_tbmct font-[400] text-[18px] text_color1 mt-[25px]"
          >积分明细</view
        >
        <view
          class="relative flex justify-between items-center text-[#666666] mt-[10px] p-b-[10px] border-b border-b-solid border-b-[#E7ECF3]"
        >
          <view class="text-[14px]">累计积分{{ myTotalScore }}</view>
          <view class="text-[14px] flex items-center" @click="openDatePicker()">
            <text>{{ dateTime }}</text>
            <wd-icon
              name="caret-down-small"
              size="30px"
              color="#A7A7A7"
            ></wd-icon>
          </view>
        </view>
      </view>
      <view class="bg-white relative p-[15px] rounded-b-[8px]">
        <view class="flex">
          <view
            class="w-[50px] h-[24px] lh-[24px] rounded-[6px] bg-[#F0F0F0] text-[15px] text-[#666666] font-500 pl-[10px] pr-[10px] text-center mr-[10px] mb-[10px]"
            v-for="item in categoryList"
            :key="item.id"
            :class="{ active: currentCategory == item.id }"
            @click="
              currentCategory = item.id;
              getPointsList();
            "
            >{{ item.label }}</view
          >
        </view>
        <wd-cell-group border>
          <wd-cell vertical v-for="(item, idx) in tableList" :key="idx">
            <template #title>
              <view class="flex justify-between w-full">
                <view class="text_color1 text-[15px]">{{ item.purpose }}</view>
                <view
                  class="text-[16px] font-[800]"
                  :class="{
                    'text-[#1A65EE]': item.type === Dict.income,
                    'text-[#333333]': item.type === Dict.expenses,
                  }"
                  >{{ item.score }}</view
                >
              </view>
              <view
                class="flex justify-between w-full text-[12px] text_color1 font-[400] mt-[5px]"
              >
                <view>{{ item.creatTime }}</view>
                <view>积分：{{ item.residueScore }}</view>
              </view>
            </template>
          </wd-cell>
        </wd-cell-group>
        <wd-status-tip
          custom-class="mt-20!"
          v-if="tableList.length === 0 && loading === 'finished'"
          image="search"
          image-size="250"
          tip="暂无内容"
        />
      </view>
      <wd-divider
        color="#ccc"
        :hairline="false"
        dashed
        v-if="loading === 'finished' && tableList.length > 0"
        custom-class="p-none! m-none!"
        >没有更多了</wd-divider
      >
    </view>

    <date-picker
      v-if="showPicker"
      v-model:showDatePicker="showPicker"
      v-model:dateTime="dateTime"
    ></date-picker>
  </view>
</template>

<script setup lang="ts">
import { getPointsListApi, getPointsTotalApi, Point } from '@/apis/points';
import DatePicker from './components/datePicker.vue';
import dayjs from 'dayjs';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/store';

onShareAppMessage(() => ({
  title: '电量管理助手',
  path: '/pages/points/index',
}));

const userStore = useUserStore();
const router = useRouter();
const PAGE_SIZE = 10;
let pageNum = 1;
const dateTime = ref(dayjs().format('YYYY-MM'));
const loading = ref<'loading' | 'more' | 'finished'>('loading');
const totalScore = ref(0);
const myTotalScore = ref(0);

onShow(() => {
  pageNum = 1;
  dateTime.value = dayjs().format('YYYY-MM');
  getPointsList();
  getPointsTotal();
});

onReachBottom(() => {
  pageNum += 1;
  getPointsList();
});

watch(
  () => dateTime.value,
  () => {
    getPointsList();
  },
);

const handleJumpTo = () => {
  router.push({
    path: '/pages/points/pointsRedemption',
  });
};

const currentCategory = ref(null);
enum Dict {
  income = '1', // 收入
  expenses = '0', // 支出
}
const categoryList = [
  {
    id: null,
    label: '全部',
  },
  {
    id: Dict.income,
    label: '收入',
  },
  {
    id: Dict.expenses,
    label: '支出',
  },
];
const tableList = ref<Point[]>([]);

async function getPointsList() {
  loading.value = 'loading';
  tableList.value.length = 0;
  let start = '',
    end = '';
  if (dateTime.value.length > 7) {
    start = dateTime.value.split('~')[0];
    end = dateTime.value.split('~')[1];
  } else {
    start = `${dateTime.value}-01`;
    end = `${dateTime.value}-${dayjs(dateTime.value).daysInMonth()}`;
  }
  const res = await getPointsListApi({
    userId: userStore.user.userId,
    type: currentCategory.value,
    start,
    end,
    pageNum,
    pageSize: PAGE_SIZE,
  });
  if (res.code === 200) {
    tableList.value = res.rows;
    myTotalScore.value = res.othInfo.totalScore;
    if (res.total <= pageNum * PAGE_SIZE) {
      loading.value = 'finished';
    } else {
      loading.value = 'more';
    }
  }
}

async function getPointsTotal() {
  const res = await getPointsTotalApi({
    userId: userStore.user.userId,
  });
  if (res.code === 200) {
    totalScore.value = res.data.totalScore;
  }
}

const showPicker = ref(false);
function openDatePicker() {
  showPicker.value = true;
}

onHide(() => {
  showPicker.value = false;
});
</script>

<style scoped lang="scss">
.content {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a65ee 0%, #ffffff 22%, #f0f0f0 100%);
}
:deep(.wd-cell) {
  padding: 0px !important;
}
:deep(.wd-cell__wrapper) {
  padding-right: 0px !important;
}
:deep(.wd-cell__right) {
  display: none;
}
.active {
  color: #ffffff;
  background: #1a65ee;
}
.top {
  // backdrop-filter: blur(5px);
}
:deep(.wd-tabs__nav-item) {
  flex: none !important;
  width: 100px !important;
}
:deep(.wd-tabs__line) {
  width: 80px !important;
  height: 1px !important;
}
:deep(.wd-tabs__container) {
  border-bottom: 1px solid rgba(236, 236, 236, 0.5);
}
</style>
