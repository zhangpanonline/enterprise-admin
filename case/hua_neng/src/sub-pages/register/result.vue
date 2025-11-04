<route lang="json">
{
  "style": { "navigationBarTitleText": "注册结果" },
  "name": "RegisterResult"
}
</route>

<template>
  <view class="flex flex-col items-center justify-center h-full px-30px">
    <wd-img
      :src="inject('STATIC_URL') + '/register_success.png'"
      height="250"
      width="80%"
    />
    <h1 class="font_tbmct text-22px font-normal color-#333333">
      您的注册申请已提交
    </h1>
    <text class="text-14px color-#666666 mt-10px">请耐心等待管理员审核！</text>
    <wd-button
      plain
      block
      size="large"
      custom-class="w-full mt-50px"
      :round="false"
      @click="handleBack()"
      >返回</wd-button
    >
  </view>
</template>

<script setup lang="ts">
const router = useRouter();
function handleBack() {
  router.back();
}
</script>
