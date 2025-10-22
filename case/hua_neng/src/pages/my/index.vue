<!--
 * @Author: qiru
 * @Date： 2025-06-10 09:53:51
 * @Description: 我的页面
 -->
<route lang="json">
{
  "style": {
    "navigationBarTitleText": "",
    "navigationBarBackgroundColor": "#ebebeb"
  },
  "name": "myIndex"
}
</route>
<template>
  <view class="content min-h-[100vh]">
    <wd-card custom-class="overflow-hidden">
      <view class="flex justify-between p-[15px]">
        <view class="flex">
          <view
            class="w-[68px] h-[68px] rounded-[10px] border-1 border-solid avatar-bg relative"
          >
            <wd-img
              :src="userStore.user.avatar || avatarUrl"
              width="68px"
              height="68px"
              radius="10px"
            />
          </view>
          <view class="ml-[11px] text_color1">
            <view class="text-[16px] font-800 mt-[9px] mb-[10px]">{{
              userStore.user.nickName || '-'
            }}</view>
            <view class="text-[14px]">{{ userStore.user.phonenumber }}</view>
          </view>
        </view>
        <!-- <view class="mt-[9px]" @click="showToast">编辑</view> -->
      </view>
      <view
        class="company-name h-[50px] leading-[50px] pl-[15px] text-[14px] font-500 text_color1"
        >{{ userStore.user.dept.deptName }}</view
      >
    </wd-card>
    <wd-card custom-class="mt-[15px]">
      <view class="flex p-[15px]!">
        <view class="w-[33.3%] text-center" @click="handleJumpToAccount()">
          <wd-img
            :src="inject('STATIC_URL') + '/certification.png'"
            width="36px"
            height="36px"
            custom-class="mb-[10px]"
          />
          <view class="text_color1 text-[15px] font-500">账号认证</view>
        </view>
        <view class="w-[33.3%] text-center" @click="handleJumpTo()">
          <view class="line">
            <wd-img
              :src="inject('STATIC_URL') + '/password.png'"
              width="36px"
              height="36px"
              custom-class="mb-[10px]"
            />
          </view>
          <view class="text_color1 text-[15px] font-500">修改密码</view>
        </view>
        <view class="w-[33.3%] text-center" @click="handleJumpTopPoints()">
          <wd-img
            :src="inject('STATIC_URL') + '/Integral.png'"
            width="36px"
            height="36px"
            custom-class="mb-[10px]"
          />
          <view class="text_color1 text-[15px] font-500">积分兑换</view>
        </view>
      </view>
    </wd-card>
    <wd-card custom-class="mt15 overflow-hidden">
      <wd-cell-group border>
        <wd-cell
          title="服务协议"
          is-link
          @click="router.push('/sub-pages/serviceProtocol/index')"
        >
          <template #icon>
            <wd-img
              :src="inject('STATIC_URL') + '/icon-service.png'"
              width="18px"
              height="18px"
              custom-class="mr-[10px]"
            />
          </template>
        </wd-cell>
        <wd-cell
          title="隐私协议"
          is-link
          @click="router.push('/sub-pages/privacyProtocol/index')"
        >
          <template #icon>
            <wd-img
              :src="inject('STATIC_URL') + '/icon-agreement.png'"
              width="20px"
              height="20px"
              custom-class="mr-[10px]"
            />
          </template>
        </wd-cell>
        <wd-cell title="联系我们" is-link @click="callManager">
          <template #icon>
            <wd-img
              :src="inject('STATIC_URL') + '/icon-contactUs.png'"
              width="18px"
              height="18px"
              custom-class="mr-[10px]"
            />
          </template>
        </wd-cell>
        <wd-cell vertical>
          <wd-button block custom-class="logoutBtn" @click="handleLogout"
            >退出登录</wd-button
          >
        </wd-cell>
      </wd-cell-group>
    </wd-card>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store';

onShareAppMessage(() => ({
  title: '电量管理助手',
  path: '/pages/my/index',
}));

const userStore = useUserStore();
const router = useRouter();
const avatarUrl = ref('');
uni.getUserInfo({
  success: (res) => {
    avatarUrl.value = res.userInfo.avatarUrl;
  },
});
// 修改密码
const handleJumpTo = () => {
  router.push('/pages/my/password');
};
// 账号认证
const handleJumpToAccount = () => {
  router.push('/pages/my/accountConfirm');
};
// 积分兑换
const handleJumpTopPoints = () => {
  router.push('/pages/points/pointsRedemption');
};
// 退出登录
const handleLogout = () => {
  userStore.clearUser();
  if (!userStore.token) {
    router.push('/sub-pages/login/index');
  }
};

const callManager = () => {
  uni.makePhoneCall({
    phoneNumber: '0771-2208171', //仅为示例，并非真实的电话号码
  });
};
</script>
<style lang="scss" scoped>
.content {
  background-color: #ebebeb;
}
:deep(.wd-card) {
  padding: 0px !important;
}
:deep(.wd-cell__left) {
  display: flex;
  align-items: center;
}
:deep(.wd-cell) {
  padding-right: 15px !important;
}
:deep(.wd-cell__wrapper) {
  box-sizing: border-box;
  padding: 15px 0 !important;
  padding-right: 0px !important;
}
:deep(.wd-cell__wrapper.is-vertical .wd-cell__right) {
  margin-top: 0px !important;
}
:deep(.logoutBtn) {
  height: 44px !important;
  font-size: 16px !important;
  color: #333333 !important;
  background: #ffffff !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 8px 8px 8px 8px !important;
}
.avatar-bg {
  border-color: #c4f2ff;
}
.company-name {
  background: linear-gradient(180deg, #e9faff 0%, #ffffff 100%);
}
.line {
  border-right: 1px solid #f2f2f2;
  border-left: 1px solid #f2f2f2;
}
</style>
