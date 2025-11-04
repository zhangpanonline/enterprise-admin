<template>
  <view
    class="wraper h-[113px] w-full rounded-[10px] mb-[15px] position-relative"
  >
    <!-- 左上角 -->
    <view class="position-absolute">
      <wd-img
        :src="
          inject('STATIC_URL') +
          (dateType === RunType.DAY
            ? '/home_card_long.png'
            : '/home_card_short.png')
        "
        :width="dateType === RunType.DAY ? '68px' : '36px'"
        height="38px"
      ></wd-img>
      <text
        v-if="dateType === RunType.DAY"
        class="position-absolute top-[4px] left-[30px] text-white text-[14px]"
        >{{ desc }}</text
      >
      <text
        class="position-absolute top-[5px] left-[10px] text-white font_tbmct text-[14px]"
        >{{ dict[dateType] }}</text
      >
    </view>
    <!-- 填报时间 -->
    <text
      class="position-absolute top-[5px] right-[10px] text_color2 text-[12px]"
    >
      填报截止时间：{{ stopTime }}
    </text>
    <!-- 运行日 -->
    <view class="pt-[45px] text_color1 text-[15px] px-[15px]">
      <text>运行日：</text>
      <text class="weight-[500]">{{ runDay }}</text>
    </view>
    <!-- 填报电量、按钮 -->
    <view class="position-absolute left-[15px] bottom-[15px] flex items-center">
      <text
        class="w-[80px] h-[20px] inline-block rounded-[4px] text-center text-[12px] text-primary bg-primary bg-op-15 mr-[10px] leading-[20px]"
        >{{ !!reportPower ? '已填报电量' : '未填报' }}</text
      >
      <text class="text-primary text-4 weight-[800]"
        >{{ reportPower ?? '-' }}万度</text
      >
    </view>
    <wd-button
      custom-class="position-absolute! right-[10px] bottom-[10px] button-edit"
      :round="false"
      :plain="status === '1' || status === '-1'"
      type="primary"
      size="small"
      @click="handleJumpTo()"
      >{{
        status === '0' ? '去填报' : status === '1' ? '编辑' : '查看'
      }}</wd-button
    >
  </view>
</template>

<script setup lang="ts">
import { RunType, Schema, dict } from '@/apis/home';
defineOptions({
  virtualHost: true,
  styleIsolation: 'shared',
});
defineProps<Schema & { desc: string }>();

const emits = defineEmits<{
  (e: 'jumpTo'): void;
}>();

const handleJumpTo = () => {
  emits('jumpTo');
};
</script>

<style scoped lang="scss">
.wraper {
  background: linear-gradient(180deg, #e9faff 0%, #ffffff 26%);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.05);
}
:deep(.wd-button.is-plain) {
  border: 1px solid rgba(26, 101, 238, 0.5);
}
</style>
