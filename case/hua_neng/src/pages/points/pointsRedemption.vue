<!--
 * @Author: qiru
 * @Date： 2025-06-10 14:25:38
 * @Description: 积分兑换
 -->
<route lang="json">
{
  "style": {
    "navigationBarTitleText": "积分兑换",
    "navigationBarBackgroundColor": "#FFFFFF"
  },
  "name": "myIndex"
}
</route>
<template>
  <view class="content p-[15px] box-border bg-[#F4F4F4] min-h-[100vh]">
    <view
      class="relative w-[100%] h-[131px] rounded-[10px] p-[15px] box-border"
    >
      <view class="absolute left-[0px] top-[0px] w-[100%]">
        <wd-img
          :src="inject('STATIC_URL') + '/bg-exchange.png'"
          width="345px"
          height="131px"
        />
      </view>
      <view
        class="absolute rounded-l-[20px] h-[29px] lh-[29px] bg-white/20 text-[#ffffff] text-[14px] p-x-[11px] right-[0px] top-[10px]"
        >已兑换0元</view
      >
      <view class="relative text-[14px] text-[#ffffff] font-[500]">
        当前积分
      </view>
      <view class="relative flex items-center mt-[5px]">
        <view class="w-[26px] h-[26px] mr-[5px]">
          <wd-img
            :src="inject('STATIC_URL') + '/bg-integral.png'"
            width="100%"
            height="100%"
          />
        </view>
        <view class="text-[26px] font-[800] text-[#ffffff]">{{
          totalScore
        }}</view>
      </view>
      <view class="relative flex items-center justify-between mt-[15px]">
        <view class="text-[16px] text-[#ffffff] font-[500]">
          最高可兑换{{ totalScore }}元
        </view>
        <view
          class="bg-white color-primary rounded-[8px] h-[30px] lh-[30px] p-x-[10px] box-border text-[15px]"
          @click="handleConfirm"
          >全部兑换</view
        >
      </view>
    </view>
    <view class="bg-white p-[15px] pt-0 box-border mt-[15px] rounded-[10px]">
      <view
        class="flex items-center justify-between h-[50px] text_color1 border-b border-b-solid border-b-[#E6E6E6]"
      >
        <text class="text-[18px] font_tbmct">部分兑换</text>
        <text class="text-[14px]">兑换现金至微信余额</text>
      </view>
      <view class="flex flex-wrap justify-between">
        <view
          class="item h-[93px] mt-[15px] rounded-[10px] border border-solid border-[#E8E8E8] text-[12px] text-[#666666] font-[400] flex flex-col justify-center items-center mr-[10px]"
          v-for="(item, index) in dataList"
          :key="item.id"
          :class="{ active: currentPoint == item.id }"
          @click="currentPoint = item.id"
        >
          <view
            ><text class="text-[26px] text_color1 font-[800]">{{
              item.money
            }}</text
            ><text>元</text></view
          >
          <text class="mt-[10px]">{{ item.point }}积分兑换</text>
        </view>
      </view>
      <view class="mt-[30px]">
        <wd-button
          block
          :round="false"
          custom-class="h-[44px]!"
          @click="handleConfirm"
          >确认兑换</wd-button
        >
      </view>
      <view
        v-if="expireTime"
        class="h-[41px] lh-[41px] bg-[#FFF2E4] mt-[10px] text-[#666666] text-[14px] pl-[10px] box-border rounded-[10px] overflow-hidden text-ellipsis text-nowrap"
        >提示：{{ expireTime }}前未兑换的积分将清零！</view
      >
    </view>
  </view>
</template>

<script setup lang="ts">
import { getPointsTotalApi, getPointsExpireTimeApi } from '@/apis/points';
import { useUserStore } from '@/store';
import dayjs from 'dayjs';

const userStore = useUserStore();
const totalScore = ref<number | string>('-');
const expireTime = ref<string>('');

const currentPoint = ref('1');
const dataList = ref<any[]>([
  {
    id: '1',
    money: '10',
    point: '100',
  },
  {
    id: '2',
    money: '20',
    point: '200',
  },
  {
    id: '3',
    money: '50',
    point: '500',
  },
  {
    id: '4',
    money: '100',
    point: '1000',
  },
]);

getPointsTotal();
async function getPointsTotal() {
  const res = await getPointsTotalApi({
    userId: userStore.user.userId,
  });
  if (res.code === 200) {
    totalScore.value = res.data.totalScore;
  }
  const ress = (await getPointsExpireTimeApi({
    userId: userStore.user.userId,
  })) as any;
  if (res.code === 200) {
    expireTime.value = dayjs(ress.msg).format('YYYY年MM月DD日');
  }
}

function handleConfirm() {
  uni.showToast({
    title: '当前功能正在开发中...',
    icon: 'none',
  });
}
</script>
<style lang="scss" scoped>
:deep(.wd-img) {
  width: 100% !important;
}
.item {
  width: calc(50% - 7px);
}
.item:nth-child(2n) {
  margin-right: 0px;
}
.active {
  border-color: #1a65ee;
  text {
    color: #1a65ee;
  }
}
</style>
