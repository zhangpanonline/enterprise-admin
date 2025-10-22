<route lang="json">
{
  "style": {
    "navigationBarTitleText": "账号认证",
    "navigationBarBackgroundColor": "#FFFFFF"
  },
  "name": "accountConfirm"
}
</route>
<template>
  <view class="content p-[15px] box-border bg-[#F4F4F4] min-h-[100vh]">
    <wd-form ref="formRef" :model="model" errorType="toast">
      <view class="text-[14px] text_color1 font-800 mb-[5px]">真实姓名</view>
      <wd-input
        prop="name"
        clearable
        v-model="model.name"
        placeholder="请输入真实姓名"
        :rules="[{ required: true, message: '请输入真实姓名' }]"
      />
      <view class="text-[14px] text_color1 font-800 mb-[5px]">公司名称</view>
      <wd-input
        prop="companyName"
        clearable
        v-model="model.companyName"
        placeholder="请输入公司名称"
        :rules="[{ required: true, message: '请输入公司名称' }]"
      />
      <view class="text-[14px] text_color1 font-800 mb-[5px]">企业编码</view>
      <wd-input
        prop="elecAccount"
        clearable
        v-model="model.elecAccount"
        placeholder="请输入企业编码"
        :rules="[{ required: true, message: '请输入企业编码' }]"
      />
      <view class="footer">
        <wd-button block :round="false" custom-class="h-[44px]!" @click="submit"
          >确认修改</wd-button
        >
      </view>
    </wd-form>
  </view>
</template>

<script setup lang="ts">
import { postReCertificationApi } from '@/apis/my';
import { useUserStore } from '@/store';
const userStore = useUserStore();
const router = useRouter();
const model = ref<{
  name: string;
  companyName: string;
  elecAccount: string;
}>({
  name: '',
  companyName: '',
  elecAccount: '',
});

const formRef = ref(null);
function submit() {
  formRef.value.validate().then((valid) => {
    if (!valid.valid) return false;
    postReCertificationApi({
      ...model.value,
      userId: userStore.user.userId,
    }).then((res) => {
      if (res.code === 200) {
        uni.showToast({
          title: '修改成功',
          icon: 'success',
        });
        userStore.clearUser();
        if (!userStore.token) {
          router.push('/sub-pages/login/index');
        }
      }
    });
  });
}
</script>
<style lang="scss" scoped>
:deep(.wd-input) {
  box-sizing: border-box;
  height: 45px;
  padding: 0 15px;
  margin-bottom: 15px;
  border-radius: 8px 8px 8px 8px;
}
:deep(.wd-input::after) {
  height: 0px !important;
}
:deep(.wd-input__value) {
  display: flex;
  align-items: center;
  height: 45px;
}
</style>
