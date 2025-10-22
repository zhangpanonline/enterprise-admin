<template>
  <view class="p-[15px] bg-white rounded-[10px]">
    <text class="font_tbmct text_color1 text-[18px] font-400"
      >积分奖励规则</text
    >
    <view class="text_color1 text-[14px] mt-[15px] flex flex-col gap-[10px]">
      <view class="flex-row-between font-500 text_color2">
        <text>偏差率(%)</text>
        <text>奖励积分</text>
      </view>
      <wd-divider
        color="#e6e6e6"
        :hairline="false"
        dashed
        custom-class="p-none! m-none!"
      ></wd-divider>
      <view v-for="v in list" :key="v.rate" class="flex-row-between">
        <text class="font-500">{{ v.rate }}</text>
        <text class="font-800">{{ v.point }}</text>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { getScoreSettingApi } from '@/apis/home';
defineOptions({
  virtualHost: true,
  styleIsolation: 'shared',
});
const props = defineProps<{ settingId: number }>();
const list = ref([]);

onMounted(async () => {
  const res = await getScoreSettingApi({ settingId: props.settingId });
  if (res.code === 200) {
    list.value = res.data.map((v) => ({
      rate: `${v.start}-${v.end}`,
      point: v.score,
    }));
  }
});
</script>

<style lang="scss" scoped>
.flex-row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
