<template>
  <div class="w-screen min-w-[1200px] h-screen bg-no-repeat  bg-cover bg-[url('/src/assets/images/log_bg.png')] flex items-center	justify-center">
    <main>
      <div class="w-[1248px] h-[648px]  pt-[90px] pl-[60px] py-10 box-border  border-info-100  bg-cover bg-[url('/src/assets/images/login_img2.png')]" >
        <div class="w-1/2 ">
          <img src="/src/assets/images/login_img.png" alt="">
          <el-form class="w-96 mt-[40px]"  :model="form" ref="formRef" size="large" label-position="top">
            <el-form-item class="login-box"  prop="account" label="用户名" :rules="[{ required: true, message: '用户名/手机号不能为空！', trigger: 'blur' }]">
              <el-input placeholder="用户名/手机号" v-model="form.account" />
            </el-form-item>
            <el-form-item class="login-box" prop="password" label="密码"  :rules="[{ required: true, message: '密码不能为空！', trigger: 'blur' }]">
              <el-input placeholder="密码" :type="showPwd ? 'text' : 'password'" v-model="form.password">
                <template #suffix>
                  <el-icon size="20" class="cursor-pointer" @click="showPwd = !showPwd" >
                    <IconMaterialSymbolsVisibilityOutlineRounded v-if="showPwd" />
                    <IconMaterialSymbolsVisibilityOffOutlineRounded v-else />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code" :rules="[{ required: true, message: '图形验证码不能为空！', trigger: 'blur' }]">
              <el-input placeholder="图形验证码" v-model="form.code">
                <template #suffix>
                  <img class="h-9 cursor-pointer" :src="imgUrl" @click="refreshImg" />
                  <el-icon size="20" class="cursor-pointer ml-5">
                    <IconEpRefresh @click="refreshImg"/>
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="rememberMe" :rules="[{ required: true, message: '必须阅读', trigger: 'blur' }]">
              <div class="flex items-center text-sm font-normal	" >
                <el-checkbox v-model="form.rememberMe" ><span class="text-sm">已阅读并同意</span></el-checkbox>
                <span class="ml-[12px] cursor-pointer	text-[#FF7D22]" @click="open('/基扎破产管理平台用户协议.pdf')">服务协议</span>
                <span class="text-[#255867]">和</span> <span class="text-[#FF7D22] cursor-pointer" @click="open('/基扎破产管理平台隐私政策.pdf')">隐私协议</span>
              </div>
            </el-form-item>
          </el-form>
          <el-button class="bt-box " type="primary" @click="onLogin" >立即登录</el-button>
        </div>
      </div>
    </main>
    <footer class="text-sm text-info text-center fixed bottom-5 w-screen" >版权所有© 2023 陕西合友网络科技有限公司&nbsp;&nbsp; 陕ICP备09013856号-1</footer>
  </div>
</template>

<script setup>
const router = useRouter()
function randomNum(len, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid = []
  radix = radix || chars.length
  if (len) {
    for (let i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random() * radix ]
    }
  } else {
    var r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('') + new Date().getTime()
}
const showPwd = ref(false)
const form = reactive({
  account: import.meta.env.VITE_MODE !== 'pro' ? '19039074049' : '',
  password: import.meta.env.VITE_MODE !== 'pro' ? '123456' : '',
  rememberMe: import.meta.env.VITE_MODE !== 'pro',
  repassword: '',
  phone: '',
  code: import.meta.env.VITE_MODE !== 'pro' ? '测试环境直接点击登录' : '',
  key: randomNum(24, 16),
})
// 刷新图形验证码
// const imgUrl = import.meta.env.VITE_API_URL + '/sso/code/captcha?key=' + form.key
const imgUrl = ref(import.meta.env.VITE_API_URL + '/sso/code/captcha?key=' + form.key)
const refreshImg = (e) => {
  form.key = randomNum(24, 16)
  imgUrl.value = import.meta.env.VITE_API_URL + '/sso/code/captcha?key=' + form.key
}
// 打开隐私政策和用户协议页面
const open = url => window.open('/bankrupt' + url)
const formRef = ref()
// 登录
const onLogin = () => {
  if (!formRef.value) return false
  formRef.value.validate((valid, fields) => {
    if (!valid) return false
    // 接口
    const params = {
      username: form.account,
      password: form.password,
      code: form.code,
      key: form.key,
    }
    loginApi(params).then(res => {
      if (res.success) {
        const appStore = useAppStore()
        const { access_token, authorities, userName } = res.data
        appStore.setAuthorities(authorities)
        appStore.setToken(access_token)
        appStore.setUserInfo({ userName })
        router.push('/')
      } else {
        refreshImg()
        ElMessage.error(res.msg)
      }
    })
  })
}
</script>
<style scoped>
.login-box>:deep(.el-form-item__label):before {
 display: none;
}
.login-box>:deep(.el-form-item__label){
   color: #255867;
   font-size: 16px;
}

.bt-box{
  width: 156px;
  height: 46px;
  font-size: 16px;
  font-weight: normal;
}
 </style>
