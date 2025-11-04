<route lang="json">
{
  "style": { "navigationBarTitleText": "登录", "navigationStyle": "custom" },
  "name": "Login"
}
</route>
<template>
  <view class="content pt-26">
    <view class="flex items-center justify-center">
      <wd-img
        :src="inject('STATIC_URL') + '/login_logo.png'"
        width="52"
        height="41"
      ></wd-img>
      <h1 class="text-8 text_color1 fw-400">电量管理助手</h1>
    </view>
    <view class="px-7 mt-14">
      <wd-input type="text" v-model="form.username" placeholder="请输入账号">
        <template #prefix>
          <text class="sn-simple-icons:opsgenie text_color3 text-4"></text>
        </template>
      </wd-input>
      <wd-input
        custom-class="mt-5"
        type="text"
        v-model="form.password"
        placeholder="请输入密码"
        show-password
      >
        <template #prefix>
          <text class="sn-ic:baseline-lock text_color3 text-4"></text>
        </template>
      </wd-input>
      <text class="float-right mt-3 text_color2 text-3" @click="forgetPassword"
        >忘记密码？</text
      >
    </view>
    <view class="mt-14 px-7">
      <wd-button
        block
        size="large"
        custom-class="button-shadow"
        :round="false"
        @click="handleLogin"
        >登录</wd-button
      >
      <wd-button
        block
        plain
        :round="false"
        size="large"
        custom-class="mt-5!"
        @click="handleRegister()"
        >注册</wd-button
      >
    </view>
    <!-- #ifdef MP-WEIXIN -->
    <wd-button
      type="text"
      custom-class="position-fixed! bottom-116px! w-full! weight-500! !text-4 text-center! color-primary!"
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumberCode"
      >手机号快捷登录</wd-button
    >
    <!-- #endif -->

    <!-- #ifdef H5 -->
    <wd-button
      type="text"
      custom-class="position-fixed! bottom-116px! w-full! weight-500! text-4! text-center! color-primary!"
      @click="getPhoneNumberCode"
      >手机号快捷登录</wd-button
    >
    <!-- #endif -->

    <view
      class="position-fixed bottom-50px w-full text-16px text_color3 text-center weight-500"
    >
      <wd-radio-group v-model="form.agree" shape="dot" inline>
        <wd-radio :value="true">
          我已阅读并同意<text
            class="text-primary"
            @click="handleAgreement('/sub-pages/serviceProtocol/index')"
            >《用户许可使用协议》</text
          ><text
            class="color-primary"
            @click="handleAgreement('/sub-pages/privacyProtocol/index')"
            >《隐私协议》</text
          >
        </wd-radio>
      </wd-radio-group>
    </view>
  </view>
  <wd-popup
    v-model="showPopup"
    custom-class="w-250px p-15px! position-relative border-rd-8px overflow-initial!"
  >
    <wd-img
      :src="inject('STATIC_URL') + '/login_audit.png'"
      custom-class="size-58px position-absolute! top--29px left-50% translate-x--50%"
    ></wd-img>
    <view class="text-primary text-4 weight-800 text-center pb-15px pt-35px"
      >审核中</view
    >
    <view class="text_color1 text-3 weight-500 pb-20px"
      >您的注册信息正在审核中，请等待 或联系管理员进行催办。</view
    >
    <wd-button
      @click="showPopup = false"
      :round="false"
      block
      plain
      size="large"
      >知道了</wd-button
    >
  </wd-popup>
</template>

<script setup lang="ts">
import { useMessage } from 'wot-design-uni';
import { loginApi } from '@/sub-pages/apis/login';
import { getUserInfoApi } from '@/sub-pages/apis/user';
import { useUserStore } from '@/store';
defineOptions({
  options: {
    styleIsolation: 'shared',
  },
});

onShareAppMessage(() => ({
  title: '电量管理助手',
  path: '/sub-pages/login/index',
}));

const form = reactive({
  username: import.meta.env.DEV ? '13468933464' : '',
  password: import.meta.env.DEV ? 'Dx0@1234' : '',
  agree: import.meta.env.DEV,
});

const showPopup = ref(false);

const router = useRouter();

const userStore = useUserStore();

// 登录
async function handleLogin() {
  if (!form.username) {
    return uni.showToast({ title: '请输入账号', icon: 'none' });
  }
  if (!form.password) {
    return uni.showToast({ title: '请输入密码', icon: 'none' });
  }
  if (!form.agree) {
    return uni.showToast({ title: '请同意用户协议', icon: 'none' });
  }
  const res = await loginApi(form);
  if (res.code === 200) {
    userStore.setToken(res.token);
    if (userStore.token) {
      const res = await getUserInfoApi();
      if (res.code === 200) {
        userStore.setUser(res.user);
        uni.switchTab({
          url: '/pages/home/index',
        });
      }
    }
  }
  // 审核中提示，目前是后端返回500状态码，进行提示，所以这里暂时用不到
  // showPopup.value = true;
}

// 跳转注册页
function handleRegister(phone = '') {
  router.push({
    path: '/sub-pages/register/index',
    query: { phone },
  });
}

// 获取手机号快捷登录，获取CODE
function getPhoneNumberCode(e: any) {
  // e = {
  //   code: "14b636115b1e9e6c1b6a68355af6002e7b940c415201f4677f8d7b1bee98e14a"
  //   encryptedData: "rtAR9lOjn2uu+9hVQDcwmPMI6atxOMJO5JnLIBTNR0OQ9+kXnjKuhkpgw3H+C5zDYr5rIz5t+v3YrnUAxnsrg2TPE40RIH9NUInWTCxiu4mmGbdauuS4yQaoYEnUMDtW8M9TTcyeKdQfXx0KRHJj8zrtOgwPYntL18zWG/LGYbIjvz+nHQ7N1kNHO+eAvhg9NVTE78NKPV8TFhgSVfQ9sQ=="
  //   errMsg: "getPhoneNumber:ok"
  //   iv: "lpehHnYPw/u1depIZP6OpA=="
  // }
  // console.log(e);
  // showPopup.value = true;
  code2Phone('code');
}

// 通过code置换手机号
function code2Phone(code: string) {
  // uni.request({
  //   url: 'https://api.weixin.qq.com/sns/jscode2session',
  //   data: {
  //     appid: 'wx4f0c5c8e4d8f8d8f', // 替换成自己的appid
  //     secret: 'c0e7d7f8a9b0c1d2e3f4g5h6i7j8k9l0', // 替换成自己的secret
  //     js_code: code,
  //     grant_type: 'authorization_code'
  //   },
  //   success: function (res) {
  //     console.log(res.data);
  //     // 这里可以获取到openid和session_key
  //     // 可以根据openid和session_key进行后续操作，比如获取用户信息等
  //   }
  // });
  handleRegister('12345678901');
}

function handleAgreement(path: string) {
  router.push({
    path,
  });
}

const message = useMessage();
// 忘记密码
function forgetPassword() {
  message.alert('联系管理员重置密码').then((res) => {
    console.log(res);
    if (res.action === 'confirm') {
      uni.makePhoneCall({
        phoneNumber: '0771-2208171',
      });
    }
  });
}
</script>

<style lang="scss" scoped>
h1 {
  font-family: TaoBaoMaiCaiTi;
}
:deep(.wd-input) {
  display: flex;
  align-items: center;
  height: 45px;
  padding: 0 10px;
  background: #f7f7f7 !important;
  border-radius: 8px;
}
:deep(.wd-input__icon) {
  background: transparent !important;
}
// 移除wot-design-uni 输入框下边框
:deep(.wd-input::after, .wd-input.is-not-empty:not(.is-disabled)::after) {
  background: none !important;
}

:deep(.button-shadow) {
  box-shadow:
    0 3px 1px -2px rgb(0 0 0 / 20%),
    0 2px 2px 0 rgb(0 0 0 / 14%),
    0 1px 5px 0 rgb(0 0 0 / 12%);
}
</style>
