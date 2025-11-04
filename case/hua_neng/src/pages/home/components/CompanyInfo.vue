<template>
  <view
    class="company-info h-[92px] rounded-[10px] p-[15px]! box-border flex flex-col justify-between"
  >
    <text class="font-800! text-4 text_color1">{{
      useUserStore()?.user?.dept?.deptName || '-'
    }}</text>
    <wd-divider
      color="#e6e6e6"
      :hairline="false"
      dashed
      custom-class="p-none! m-none!"
    ></wd-divider>
    <view class="text-[12px] font-500 h-[20px] leading-[20px]">
      <text class="bg-primary inline-block px-[10px] text-white rounded-l-[4px]"
        >剩余填报时间</text
      >
      <wd-count-down
        custom-class="bg-primary/15 inline-block px-[10px] rounded-r-[4px]"
        :time="new Date(stopTime).getTime() - new Date().getTime()"
      >
        <template #default="{ current }">
          <text class="text-primary">
            <text v-if="current.days">{{ current.days }} 天 </text>
            <text
              >{{
                current.hours.toFixed().length > 1
                  ? current.hours
                  : '0' + current.hours
              }}
              时
            </text>
            <text
              >{{
                current.minutes.toFixed().length > 1
                  ? current.minutes
                  : '0' + current.minutes
              }}
              分
            </text>
            <text
              >{{
                current.seconds.toFixed().length > 1
                  ? current.seconds
                  : '0' + current.seconds
              }}
              秒
            </text></text
          >
        </template>
      </wd-count-down>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store';
defineOptions({
  virtualHost: true,
  styleIsolation: 'shared',
});
interface Props {
  stopTime: string;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.company-info {
  background: linear-gradient(180deg, #e9faff 0%, #ffffff 26%);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.05);
}
</style>
