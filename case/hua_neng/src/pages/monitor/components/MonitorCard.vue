<template>
  <view class="wraper-card">
    <view class="h-[93px] position-relative mb-[10px]">
      <img
        :src="inject('STATIC_URL') + '/monitor_card.png'"
        class="w-full h-full"
      />
      <view
        class="w-full h-full flex justify-between items-center position-absolute top-0 right-0"
      >
        <view class="flex-1 pl-[70px] box-border">
          <view
            ><text class="text-[20px] text-white font-800">{{
              dataObj?.reportPower?.toFixed(2) ?? '-'
            }}</text
            ><text class="text-white/80 text-[12px]">万度</text></view
          >
          <text class="font-500 text-[14px] text-white/80">填报电量</text>
        </view>
        <view class="flex-1 pl-[75px] box-border">
          <view
            ><text class="text-[20px] text-white font-800">{{
              dataObj?.realPower?.toFixed(2) ?? '-'
            }}</text
            ><text class="text-white/80 text-[12px]">万度</text></view
          >
          <text class="font-500 text-[14px] text-white/80">实际电量</text>
        </view>
      </view>
    </view>
    <view class="h-[24px] ml-[10px] position-relative">
      <wd-img
        :src="inject('STATIC_URL') + '/monitor_bar.png'"
        width="140px"
        height="24px"
      ></wd-img>
      <view
        class="text_color1 flex justify-start pl-[15px] box-border gap-[5px] items-center position-absolute top-0 left-0 w-[140px] h-[24px]"
      >
        <view class="flex items-center">
          <wd-img
            :src="inject('STATIC_URL') + '/monitor_star.png'"
            width="18px"
            height="18px"
          ></wd-img>
          <text class="font-500 text-[12px] leading-[24px]">奖励积分</text>
        </view>
        <text class="font-800 text-[14px] leading-[24px]">{{
          dataObj?.score ?? '-'
        }}</text>
      </view>
    </view>
    <view
      class="card-rate mx-[10px] gap-0 flex items-center justify-between px-[10px]"
    >
      <view>
        <text class="text_color2 mr-[10px]">偏差电量</text>
        <text class="text_color1"
          >{{ dataObj?.diffPower?.toFixed(2) ?? '-' }}万度</text
        >
      </view>
      <view>
        <text class="text_color2 mr-[10px]">偏差率</text>
        <text class="text_color1"
          >{{ (dataObj?.diffRatio * 100)?.toFixed(2) ?? '-' }}%</text
        >
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineOptions({
  virtualHost: true,
  styleIsolation: 'shared',
});
const props = defineProps({
  dataObj: Object,
});
</script>

<style lang="scss" scoped>
.wraper-card {
  height: 177px;
  margin: 0 15px;
  background: #ffffff;
  border-radius: 10px;
  .card-rate {
    height: 45px;
    font-size: 15px;
    font-weight: 500;
    background: linear-gradient(180deg, #e9faff 0%, #ffffff 100%);
    border-radius: 0px 10px 10px 10px;
  }
}
</style>
