<template>
  <div class="w-screen h-screen bg-no-repeat bg-left bg-cover bg-[url('/src/assets/images/login_bg.webp')]">
    <header class="p-5 grid items-center gap-2.5 grid-cols-[48px_1fr]" >
      <img v-if="company.logo" :src="company.logo" class="h-12" alt="logo">
      <span v-else class="h-12 w-12 bg-undertone"></span>
      <p class="text-xl text-balck font-semibold" >{{ company.name }}</p>
    </header>
    <main v-if="loginType === 'forget'" class="rounded-lg bg-undertone fixed top-1/2 translate-y-[-50%] shadow-lg shadow-info-100
      w-[250px] md:w-[300px] lg:w-[350px] xl:w-[400px] 2xl:w-[450px] 4xl:w-[500px] 5xl:w-[500px]
      right-[10%] md:right-[12%] lg:right-[14%] xl:right-[16%] 2xl:right-[18%] 4xl:right-[19%] 5xl:right-[20%]" >
      <p class="h-16 flex items-center justify-center text-black" >通过手机号找回密码</p>
      <div class="bg-white h-full rounded-lg px-5 py-10 box-border border border-info-200" >
        <el-form :model="form" size="large">
          <el-form-item>
            <el-input placeholder="手机号" v-model="form.phone" />
          </el-form-item>
          <el-form-item>
            <el-input placeholder="手机验证码" v-model="form.code">
              <template #suffix>
                <span class="text-info-200 mr-2" > | </span> <span class="text-primary" >获取验证码</span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="输入密码" v-model="form.password" />
          </el-form-item>
          <el-form-item>
            <el-input placeholder="确认密码" v-model="form.repassword" />
          </el-form-item>
        </el-form>
        <div class="text-xs" >
          已有账号？
          <span class="cursor-pointer text-primary" @click="loginType = 'pwd'" >立即登录</span>
        </div>
        <el-button size="large" class="w-full mt-5" type="primary" >修 改 密 码</el-button>
      </div>
    </main>
    <main v-else class="rounded-lg bg-undertone fixed top-1/2 translate-y-[-50%] shadow-lg shadow-info-100
      w-[250px] md:w-[300px] lg:w-[350px] xl:w-[400px] 2xl:w-[450px] 4xl:w-[500px] 5xl:w-[500px]
      right-[10%] md:right-[12%] lg:right-[14%] xl:right-[16%] 2xl:right-[18%] 4xl:right-[19%] 5xl:right-[20%]" >
      <ul class="h-16 grid grid-cols-[1fr_1fr_68px] text-black cursor-pointer" >
        <li :class="{ 'text-primary': loginType === 'pwd' }" class="h-full flex justify-center items-center" @click="loginType = 'pwd'" >账号登录</li>
        <li :class="{ 'text-primary': loginType === 'sms' }" class="h-full flex justify-center items-center" @click="loginType = 'sms'" >短信登录</li>
        <li class="bg-cover h-full " :class='[loginType === "qrcode" ? "bg-[url(/src/assets/images/login_computer.webp)]" : "bg-[url(/src/assets/images/logo.svg)]"]' @click="toggleQrcode()" ></li>
      </ul>
      <!-- 账号、短信登录 -->
      <div v-if="['pwd', 'sms'].includes(loginType)" class="bg-white h-full rounded-lg px-5 py-10 box-border border border-info-100" >
        <el-form :model="form" ref="formRef" size="large">
          <template v-if="loginType === 'pwd'" >
            <el-form-item prop="account" :rules="[{ required: true, message: '用户名/手机号不能为空！', trigger: 'blur' }]">
              <el-input placeholder="用户名/手机号" v-model="form.account" />
            </el-form-item>
            <el-form-item prop="password" :rules="[{ required: true, message: '密码不能为空！', trigger: 'blur' }]">
              <el-input placeholder="密码" v-model="form.password" />
            </el-form-item>
            <el-form-item prop="image" :rules="[{ required: true, message: '图形验证码不能为空！', trigger: 'blur' }]">
              <el-input placeholder="图形验证码" v-model="form.image">
                <template #suffix>
                  <img class="h-9 cursor-pointer" :src="imgUrl" @click="refreshImg" />
                </template>
              </el-input>
            </el-form-item>
          </template>
          <template v-else-if="loginType === 'sms'" >
            <el-form-item prop="phone" :rules="[{ required: true, message: '手机号不能为空！', trigger: 'blur' }]">
              <el-input placeholder="手机号" v-model="form.phone" />
            </el-form-item>
            <el-form-item prop="image" :rules="[{ required: true, message: '图形验证码不能为空！', trigger: 'blur' }]">
              <el-input placeholder="图形验证码" v-model="form.image">
                <template #suffix>
                  <img class="h-9 cursor-pointer" :src="imgUrl" @click="refreshImg" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code" :rules="[{ required: true, message: '手机验证码不能为空！', trigger: 'blur' }]">
              <el-input placeholder="手机验证码" v-model="form.code">
                <template #suffix>
                  <span class="text-info-200 mr-2" > | </span> <span class="text-primary" >获取验证码</span>
                </template>
              </el-input>
            </el-form-item>
          </template>
        </el-form>
        <div class="flex justify-between items-center" >
          <el-checkbox v-model="rememberMe" ><span class="text-xs">记住登录状态</span></el-checkbox>
          <span class="cursor-pointer text-primary text-xs" @click="loginType = 'forget'" >忘记密码</span>
        </div>
        <el-button size="large" class="w-full mt-5" type="primary" @click="onLogin" >登 录</el-button>
      </div>
      <!-- 扫码登录 -->
      <div class="bg-white h-full rounded-lg px-5 py-10 box-border border border-info-100 grid justify-items-center gap-5 text-xs" v-if="loginType === 'qrcode'" >
        <img class="w-4/5" :src="qrcode" alt="扫维登录" />
        <p>请使用<a class="text-primary mx-1 cursor-pointer" >APP</a>扫描二维码登录</p>
        <p>
          <span class="cursor-pointer" >密码登录</span>
          <span class="mx-2" >|</span>
          <span class="cursor-pointer" @click="loginType = 'forget'" >忘记密码</span>
        </p>
      </div>
    </main>
    <footer class="text-sm text-info text-center fixed bottom-5 w-screen" >版权所有© 2023 陕西合友网络科技有限公司&nbsp;&nbsp; 陕ICP备09013856号-1</footer>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const company = {
  logo: new URL('/src/assets/images/logo.svg', import.meta.url).href,
  name: '基扎破产案件管理后台',
}
const loginType = ref('pwd')
const preLoginType = ref('qrcode')
const toggleQrcode = () => {
  if (loginType.value === 'qrcode') {
    loginType.value = preLoginType.value
  } else {
    preLoginType.value = loginType.value
    loginType.value = 'qrcode'
  }
}
const rememberMe = ref(false)
const form = reactive({
  account: '18109292316',
  password: 'qaz@123',
  repassword: '',
  phone: '',
  code: '123',
  image: '',
})

// 刷新图形验证码
const imgUrl = import.meta.env.VITE_API_URL + '/sso/code/captcha?key=1'
const refreshImg = (e) => {
  (e.target).src = imgUrl + 1
}

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
        ElMessage.error(res.msg)
      }
    })
  })
}
</script>
