<route lang="json">
{
  "style": { "navigationBarTitleText": "注册" },
  "name": "Register"
}
</route>
<template>
  <view class="p-30px pb-20 text-14px text_color1">
    <h1 class="text-22px line-height-9 font_tbmct font-normal">
      请填写以下信息完成注册
    </h1>
    <text class="color-#666666"
      >注册信息提交后，需要管理员审核，请耐心等待！</text
    >
    <wd-form ref="formRef" :model="form" errorType="toast">
      <wd-cell-group title="用户名">
        <wd-input
          prop="userName"
          clearable
          v-model="form.userName"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
        />
      </wd-cell-group>
      <wd-cell-group title="真实姓名">
        <wd-input
          prop="name"
          clearable
          v-model="form.name"
          placeholder="请输入真实姓名"
          :rules="[{ required: true, message: '请输入真实姓名' }]"
        />
      </wd-cell-group>
      <wd-cell-group title=" ">
        <template #title>
          <text
            >公司名称<text class="text-12px text_color2">
              （请准确填写公司全称）</text
            >
          </text>
        </template>
        <wd-input
          prop="companyName"
          clearable
          v-model="form.companyName"
          placeholder="请准确填写公司全称"
          :rules="[{ required: true, message: '请输入公司全称' }]"
        />
      </wd-cell-group>
      <wd-cell-group title="企业编码">
        <wd-input
          prop="elecAccount"
          clearable
          v-model="form.elecAccount"
          placeholder="请输入交易平台企业编码"
          :rules="[{ required: true, message: '请输入企业编码' }]"
        />
      </wd-cell-group>
      <wd-cell-group v-if="!phone" title="联系电话">
        <wd-input
          prop="phone"
          clearable
          type="number"
          v-model="form.phone"
          placeholder="请输入联系电话"
          :rules="[
            { required: true, message: '请输入联系电话' },
            {
              message: '请输入正确的联系电话',
              validator(val) {
                return /^(1[3-9]\d{9}|0\d{2,3}-?\d{7,8})$/.test(val);
              },
            },
          ]"
        />
      </wd-cell-group>
      <wd-cell-group title=" ">
        <template #title>
          <text
            >登录密码
            <text class="text-12px text_color2">
              （密码必须包含大小写字母.数字和特殊字符）</text
            >
          </text>
        </template>
        <wd-input
          prop="loginPassword"
          clearable
          v-model="form.loginPassword"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
        />
      </wd-cell-group>
      <wd-cell-group title="确认密码">
        <wd-input
          prop="secondPassword"
          clearable
          v-model="form.secondPassword"
          placeholder="请输入确认密码"
          :rules="[{ required: true, message: '请输入确认密码' }]"
        />
      </wd-cell-group>
      <view
        class="position-fixed bottom-0 left-0 right-0 px-30px py-20px bg-white z-36"
      >
        <wd-button
          type="primary"
          size="large"
          @click="handleSubmit()"
          block
          :round="false"
          custom-class="button-shadow"
          >注册</wd-button
        >
      </view>
    </wd-form>
  </view>
  <wd-gap safe-area-bottom></wd-gap>
</template>

<script setup lang="ts">
import { registerApi, RegisterParams } from '@/sub-pages/apis/login';
const router = useRouter();
const formRef = shallowRef(null);
const phone = ref('');
const form: RegisterParams = reactive({
  userName: '',
  name: '',
  companyName: '',
  elecAccount: '',
  phone: '',
  loginPassword: '',
  secondPassword: '',
});
onLoad((o: { phone: string }) => {
  phone.value = o.phone;
});

function handleSubmit() {
  formRef.value.validate().then(async (r) => {
    if (r.valid) {
      const res = await registerApi(form);
      if (res.code === 200) {
        router.replace({ path: '/sub-pages/register/result' });
      }
    }
  });
}
</script>

<style lang="scss" scoped>
:deep(.wd-cell-group__title) {
  padding: 15px 0 5px !important;
  font-size: 14px !important;
  font-weight: 800 !important;
  color: #333 !important;
}
:deep(.wd-input) {
  display: flex;
  align-items: center;
  height: 45px;
  padding: 0 10px;
  background: #f7f7f7 !important;
  border-radius: 8px;
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
