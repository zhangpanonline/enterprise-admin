<!--
 * @Author: qiru
 * @Date： 2025-06-11 10:38:22
 * @Description: 修改密码
 -->
<route lang="json">
{
  "style": {
    "navigationBarTitleText": "修改密码",
    "navigationBarBackgroundColor": "#FFFFFF"
  },
  "name": "password"
}
</route>
<template>
  <view class="content p-[15px] box-border bg-[#F4F4F4] min-h-[100vh]">
    <wd-form ref="formRef" :model="model" errorType="toast">
      <view class="text-[14px] text_color1 font-800 mb-[5px]">旧密码</view>
      <wd-input
        prop="oldPassword"
        show-password
        clearable
        v-model="model.oldPassword"
        placeholder="请输入旧密码"
        :rules="[{ required: true, message: '请输入旧密码' }]"
      />
      <view class="text-[14px] text_color1 font-800 mb-[5px]">新密码</view>
      <wd-input
        prop="password"
        show-password
        clearable
        v-model="model.password"
        placeholder="密码必须包含大小写字母.数字和特殊字符"
        :rules="[{ required: true, message: '请输入新密码' }]"
      />
      <view class="text-[14px] text_color1 font-800 mb-[5px]">确认密码</view>
      <wd-input
        prop="confirmPassword"
        show-password
        clearable
        v-model="model.confirmPassword"
        placeholder="请再次输入密码"
        :rules="[{ required: true, message: '请输入确认密码' }]"
      />
      <view class="mt-[5px] mb-[30px] text-[15px] font-400 text-[#666666]"
        >忘记旧密码？<text class="font-bold" @click="callManager"
          >联系管理员</text
        ></view
      >
      <view class="footer">
        <wd-button block :round="false" custom-class="h-[44px]!" @click="submit"
          >确认修改</wd-button
        >
      </view>
    </wd-form>
  </view>
</template>

<script setup lang="ts">
import { putResetPwdApi } from '@/apis/my';
import { useUserStore } from '@/store';
const userStore = useUserStore();
const router = useRouter();
const model = ref<{
  oldPassword: string;
  password: string;
  confirmPassword: string;
}>({
  oldPassword: '',
  password: '',
  confirmPassword: '',
});

const formRef = ref();
function submit() {
  formRef.value.validate().then((res) => {
    if (!res.valid) return;
    if (model.value.password !== model.value.confirmPassword) {
      uni.showToast({
        title: '两次密码输入不一致',
        icon: 'none',
      });
      return;
    }
    const params = { ...model.value, userId: userStore.user.id };
    putResetPwdApi(params).then((res) => {
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

const callManager = () => {
  uni.makePhoneCall({
    phoneNumber: '0771-2208171',
  });
};
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
