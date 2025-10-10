<template>
  <div class="w-screen h-screen bg-no-repeat  bg-cover bg-[url('/src/assets/images/log_bg.png')] flex items-center	justify-center">

    <main>

      <div  class=" w-[1248px] h-[648px]  pt-[90px] pl-[60px] py-10 box-border  border-info-100  bg-cover bg-[url('/src/assets/images/login_img2.png')]" >
        <div class="w-1/2">
            <img src="/src/assets/images/login_img.png" alt="">

        <el-form class="w-96 mt-[40px]"  :model="form" ref="formRef" size="large" label-position="top">
            <el-form-item prop="account" label="用户名" :rules="[{ required: true, message: '用户名/手机号不能为空！', trigger: 'blur' }]">
              <el-input placeholder="用户名/手机号" v-model="form.account" />
            </el-form-item>
            <el-form-item prop="password" label="密码"  :rules="[{ required: true, message: '密码不能为空！', trigger: 'blur' }]">
              <el-input placeholder="密码" v-model="form.password" />
            </el-form-item>
            <el-form-item prop="rememberMe" :rules="[{ required: true, message: '必须阅读', trigger: 'blur' }]">
              <div class="flex items-center text-base" >
              <el-checkbox v-model="form.rememberMe" ><span class="text-xs">已阅读并同意</span></el-checkbox>
               <span class="ml-[12px] cursor-pointer	text-[#FF7D22]">服务协议</span>和<span class="text-[#FF7D22] cursor-pointer	">隐私协议</span>
              </div>
            </el-form-item>
        </el-form>
        <el-button size="large" class="w-36 text-base	" type="primary" @click="onLogin" >立即注册</el-button>
      </div>

      </div>

    </main>
    <!-- <footer class="text-sm text-info text-center fixed bottom-5 w-screen" >版权所有© 2023 陕西合友网络科技有限公司&nbsp;&nbsp; 陕ICP备09013856号-1</footer> -->
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const form = reactive({
  account: '18109292316',
  password: 'qaz@123',
  rememberMe: import.meta.env.VITE_MODE !== 'pro',
  repassword: '',
  phone: '',
  code: '123',
  image: '',
})

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
