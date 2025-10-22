<!-- 使用 type="home" 属性设置首页 -->
<route type="home" lang="json">
{
  "layout": "tabbar",
  "style": { "navigationBarTitleText": "首页", "navigationStyle": "custom" },
  "name": "home"
}
</route>

<template>
  <view class="home text_color1 pt-safe">
    <view class="h-48 home-header bg-cover overflow-hidden position-relative">
      <wd-img
        :src="inject('STATIC_URL') + '/home_header.png'"
        width="100%"
        height="100%"
        mode="widthFix"
      />
      <view
        class="h-42px text-4 bg_color2 position-absolute bottom-0 left-20px right-20px border-rounded-t-10px border-1px border-t-solid border-white font-800 pl-4 leading-[42px]"
      >
        {{ userStore?.user?.dept?.deptName || '-' }}
      </view>
    </view>
    <view
      class="bg_color1 home-content px-[15px] pt-[15px] box-border overflow-y-auto"
    >
      <HomeCard
        v-for="v in list"
        :key="v.runDay + v.dateType"
        v-bind="{ ...v, desc: v.dayDesc }"
        @jumpTo="handleJumpTo(v)"
      ></HomeCard>
      <wd-divider
        color="#ccc"
        :hairline="false"
        dashed
        custom-class="p-none! m-none!"
        >没有更多了</wd-divider
      >
      <wd-gap height="15px" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { getPowerListApi, Schema } from '@/apis/home';
import HomeCard from './components/HomeCard.vue';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/store';
const router = useRouter();
const userStore = useUserStore();

onShareAppMessage(() => ({
  title: '电量管理助手',
  path: '/pages/home/index',
}));

onShow(() => {
  getPowerList();
});

const list = ref<Array<Schema>>([]);

async function getPowerList() {
  const res = await getPowerListApi();
  if (res.code === 200) {
    list.value = res.data;
  }
}

function handleJumpTo(v) {
  router.push({
    path: '/pages/home/report',
    query: { ...v },
  });
}
</script>

<style lang="scss" scoped>
.home {
  .home-header {
    background-repeat: no-repeat;
    background-size: cover;
  }
  /* #ifdef H5 */
  .home-content {
    height: calc(100vh - 270px);
  }
  /* #endif */
  /* #ifdef MP-WEIXIN */
  .home-content {
    height: calc(100vh - 192px);
  }
  /* #endif */
}
</style>
