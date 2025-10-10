<template>
  <div class="flex h-screen">
        <div class="w-2/5 p-20  bg-cover bg-[url('/src/assets/images/loginBg.png')] flex flex-col	justify-between">
          <div class="flex">
            <img src="/src/assets/images/banklog.png" alt="">
            <img class="ml-3" src="/src/assets/images/banklog1.png" alt="">
          </div>
          <div class="text-white ">
            <div class="text-xl	leading-[48px]">“人民法院受理破产申请后，管理人对破产申请受理前成立而债务人和对方当事人均未履行完毕的合同有权决定解除或者继续履行，并通知对方当事人。”</div>
            <div class="mt-6">《破产法》第18条</div>
          </div>
        </div>
        <div class="w-3/5 flex flex-col	 justify-center items-center " >
          <div class="w-96 h-2/4">
            <el-form v-if="loginType == 'test'" :model="form" ref="formRef" size="large" :rules="comRules" label-position="top">
              <div class="text-[#333333] text-[32px]">欢迎来到基扎破产案件管理</div>
              <el-form-item class="login-box mt-[40px]"  prop="account" label="手机号" >
                <el-input placeholder="用户名/手机号" v-model="form.account" />
              </el-form-item>
              <el-form-item prop="rememberMe" >
                <div class="flex items-center text-sm font-normal	justify-between	w-full" >
                  <el-checkbox v-model="form.rememberMe" ><span class="text-sm">记住账号</span></el-checkbox>
                  <span class="text-[#FF7D22] cursor-pointer" @click="setLoginType('fpwd')">忘记密码</span>
                </div>
              </el-form-item>
              <el-button class="bt-box w-full" type="primary" @click="onLogin(1)" >登录或注册</el-button>
              <div class="mt-5">
                <span class="text-[#70ABB9]">登录即代表您已阅读并同意</span>
                <span class="ml-[8px] cursor-pointer	text-[#255867]" @click="open('/基扎破产管理平台用户协议.pdf')">服务协议</span>
                <span class="text-[#70ABB9]">和</span><span class="text-[#255867] cursor-pointer" @click="open('/基扎破产管理平台隐私政策.pdf')">隐私协议</span>
              </div>
              <el-divider >或</el-divider>
              <div class="flex  justify-center	mt-3">
                <img @click="setLoginType('tme')" class="cursor-pointer" src="/src/assets/images/phone.png" alt="">
                <img class="ml-12 cursor-pointer" src="/src/assets/images/qrCode.png" alt="">
              </div>
          </el-form>
          <el-form v-else-if="loginType == 'verification'" :model="form" ref="formRef" size="large" label-position="top">
             <div class="text-[#333333] text-[32px] flex items-center"><img class="mr-3 cursor-pointer" @click="blackH" src="/src/assets/images/back.png" alt="">{{verifyTitle}}</div>
             <div class="w-44 h-10 bg-[#E5F1F4] text-[#255867] flex items-center justify-center rounded-lg	mt-10">
                <el-icon  class="mr-1">
                    <IconEpAvatar/>
                </el-icon> {{ form.account }}</div>
              <el-form-item prop="code"  class="login-box mt-8" label="图形验证">
              <el-input placeholder="图形验证码" v-model="form.code">
                <template #suffix>
                  <img class="h-9 cursor-pointer" :src="imgUrl" @click="refreshImg" />
                  <el-icon size="20" class="cursor-pointer ml-5">
                    <IconEpRefresh @click="refreshImg"/>
                  </el-icon>
                </template>
              </el-input>
              <div class="errBox">{{ codeTitle1 }} </div>
            </el-form-item>

              <el-form-item class="mt-1 login-box" prop="smsCode"  label="短信验证" >
                <el-input placeholder="短信验证码" v-model="form.smsCode" >
                  <template #suffix >
                    <div v-if="!timerType" class='bg-[#E5F1F4] h-8 leading-8 px-4 rounded-lg cursor-pointer text-[#255867]' @click="codeS">获取短信验证码</div>
                    <span class="text-info-200 mr-2" v-else>{{ countdown}}s</span>
                  </template>
                </el-input>
              <div class="errBox">{{ codeTitle2 }} </div>

            </el-form-item>
            <div v-if="!verifType" class="text-right text-[#255867] mb-5" > <span class="cursor-pointer" @click="blackH">返回登录</span> </div>
            <div  v-else class="text-[#BBBBBB] my-5 flex items-center" ><img class="mr-2 w-3" src="/src/assets/images/testIco.gif" alt=""> 验证中</div>
            <el-button class="bt-box w-full" type="primary" @click="resigte" >{{verifyBtName}}</el-button>
          </el-form>
          <el-form v-else-if="loginType == 'register'" :model="form" ref="formRef" :rules="comRules" size="large" label-position="top">
             <div class="text-[#333333] text-[32px] flex items-center"><img class="mr-3 cursor-pointer" @click="blackH" src="/src/assets/images/back.png" alt="">{{veriftCode == 'fpwd' ? '设置新密码' :"设置密码"}}</div>
             <div class="w-44 h-10 bg-[#E5F1F4] text-[#255867] flex items-center justify-center rounded-lg	mt-10">
                <el-icon  class="mr-1">
                    <IconEpAvatar/>
                </el-icon> {{ form.account }}</div>
            <el-form-item class="login-box mt-10" prop="password" label="输入新密码" >
              <el-input placeholder="密码6-18位，字母+数字+特殊字符中的至少2种" :type="showPwd ? 'text' : 'password'" v-model="form.password">
                <template #suffix>
                  <el-icon size="20" class="cursor-pointer" @click="showPwd = !showPwd" >
                    <IconMaterialSymbolsVisibilityOutlineRounded v-if="showPwd" />
                    <IconMaterialSymbolsVisibilityOffOutlineRounded v-else />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item class="login-box" prop="checkPass" label="再次输入新密码" >
              <el-input placeholder="密码6-18位，字母+数字+特殊字符中的至少2种" :type="showPwd1 ? 'text' : 'password'" v-model="form.checkPass">
                <template #suffix>
                  <el-icon size="20" class="cursor-pointer" @click="showPwd1 = !showPwd1" >
                    <IconMaterialSymbolsVisibilityOutlineRounded v-if="showPwd1" />
                    <IconMaterialSymbolsVisibilityOffOutlineRounded v-else />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-button class="bt-box w-full" type="primary" @click="saveRegister" >确认</el-button>
          </el-form>
          <el-form v-else-if="loginType == 'pwd'" :model="form" ref="formRef" :rules="comRules" size="large" label-position="top">
            <div class="text-[#333333] text-[32px] flex items-center"><img class="mr-3 cursor-pointer" @click="blackH" src="/src/assets/images/back.png" alt="">欢迎回来</div>
            <div class="w-44 h-10 bg-[#E5F1F4] text-[#255867] flex items-center justify-center rounded-lg	mt-10">
              <el-icon class="mr-1">
                <IconEpAvatar/>
              </el-icon>
              {{ form.account }}
            </div>
            <el-form-item class="login-box mt-10" prop="password1" label="输入密码"  :rules="[{ required: true, message: '密码不能为空！', trigger: 'blur' }]">
              <el-input placeholder="密码6-16位，区分大小写" :type="showPwd ? 'text' : 'password'" v-model="form.password1">
                <template #suffix>
                  <el-icon size="20" class="cursor-pointer" @click="showPwd = !showPwd" >
                    <IconMaterialSymbolsVisibilityOutlineRounded v-if="showPwd" />
                    <IconMaterialSymbolsVisibilityOffOutlineRounded v-else />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code"  class="login-box" label="验证" >
              <el-input placeholder="图形验证码" v-model="form.code">
                <template #suffix>
                  <img class="h-9 cursor-pointer" :src="imgUrl" @click="refreshImg" />
                  <el-icon size="20" class="cursor-pointer ml-5">
                    <IconEpRefresh @click="refreshImg"/>
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <div class="flex justify-between mb-5">
               <span class="text-[#255867] cursor-pointer" @click="setLoginType('verification')">短信验证码登录</span>
               <span class="text-[#FF7D22] cursor-pointer" @click="setLoginType('fpwd')">忘记密码</span>
            </div>
            <el-button class="bt-box w-full" type="primary" @click="onLogin(3)" >确认</el-button>
            <el-divider >或</el-divider>
              <div class="flex  justify-center	mt-3">
                <img @click="setLoginType('tme')" class="cursor-pointer" src="/src/assets/images/phone.png" alt="">
                <img class="ml-12 cursor-pointer" src="/src/assets/images/qrCode.png" alt="">
              </div>
          </el-form>
          <el-form v-else-if="loginType == 'tme'" :model="form" ref="formRef" size="large" :rules="comRules" label-position="top">
            <div class="text-[#333333] text-[32px] flex items-center"><img class="mr-3 cursor-pointer" @click="blackH" src="/src/assets/images/back.png" alt="">短信验证码登录</div>
              <el-form-item class="login-box mt-[40px]"  prop="account" label="手机号" >
                <el-input placeholder="用户名/手机号" v-model="form.account" />
              </el-form-item>
              <el-button class="bt-box w-full mt-5" type="primary" @click="setLoginType('verification')" >立即登录</el-button>
          </el-form>
        </div>

      </div>
  </div>

</template>

<script setup>
const loginType = ref('test')

const router = useRouter()
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请先输入第一次密码'))
  } else if (value !== form.password) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}
const phoneRegExp = /^1[345789]\d{9}$/
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机号'))
  } else {
    if (form.account !== '') {
      if (value && !phoneRegExp.test(value)) {
        callback(new Error('请输入正确的手机号！'))
      } else {
        callback()
      }
    }
    callback()
  }
}

const testCodVerify = async(rule, value, callback) => {
  if (value === '') {
    callback(new Error('图形验证码不能为空！'))
  } else {
    if (loginType.value === 'pwd') {
      callback()
    } else {
      const params = {
        key1: form.key,
        code1: form.code,
      }
      const res = await codeCheckApi(params)
      if (res.success) {
        callback()
      } else {
        callback(new Error('验证码不正确'))
      }
    }
  }
}
const testPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value.length < 6 || value.length > 18) {
    callback(new Error('请输入6-18位,包括字母+数字+特殊字符中的至少2种'))
  } else {
    // let pPattern = /^.*(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{6,16}/
    const pPattern = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,18}$/
    // let order = 0 // 顺序
    console.log(pPattern.test(value), 99)
    if (pPattern.test(value)) {
      callback()
    } else {
      callback(new Error('请输入6-18位,包括字母+数字+特殊字符中的至少2种'))
    }
  }
}
const comRules = {
  account: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  code: [{ validator: testCodVerify, trigger: 'blur' }],
  password: [{ validator: testPassword, trigger: 'blur' }],
}

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
const showPwd1 = ref(false)
const form = reactive({
  //  19039074049
  account: '13400000465',
  password: '123456',
  password1: '123456',
  rememberMe: true,
  repassword: '',
  phone: '',
  smsCode: '',
  code: '',
  key: randomNum(24, 16),
})
if (localStorage.getItem('loginInfo')) {
  form.rememberMe = true
  form.account = localStorage.getItem('loginInfo')
} else {
  form.rememberMe = false
}
// 刷新图形验证码
const imgUrl = computed(() => {
  if (loginType.value === 'pwd') {
    return import.meta.env.VITE_API_URL + '/sso/code/captcha?key=' + form.key
  } else {
    return import.meta.env.VITE_API_URL + '/sso/code/phone/captcha?key1=' + form.key
  }
})
const refreshImg = () => {
  form.key = randomNum(24, 16)
}
// 打开隐私政策和用户协议页面
const open = url => window.open('/bankrupt' + url)
// 返回验证页面
const blackH = () => {
  loginType.value = 'test'
  codeTitle1.value = ''
  codeTitle2.value = ''
  form.password1 = ''
}
// 设置倒计时
const countdown = ref(60)
const timerType = ref(false)
const templateCode = ref()

const testCodeCheck = async() => {
  return new Promise(async reslove => {
    const params = {
      key1: form.key,
      code1: form.code,
      _: form.kye,
    }
    const res = await codeCheckApi(params)
    reslove(res)
  })
}
const codeTitle1 = ref('')
const codeTitle2 = ref('')
async function codeS() {
  if (!form.code) {
    codeTitle1.value = '图形验证码不能为空!'
    return
  }
  codeTitle1.value = ''
  const res = await testCodeCheck()
  if (!res.success) {
    codeTitle1.value = '验证码不正确'
  } else {
    codeTitle1.value = ''
    const params = {
      phone: form.account,
      templateId: templateCode.value,
    }
    getSms(params).then(res => {
      if (res.success) {
        countdown.value = 60
        timerType.value = true
        const auth_timer = setInterval(() => {
          // 定时器设置每秒递减
          countdown.value-- // 递减时间
          if (countdown.value <= 0) {
            timerType.value = false // 60s时间结束还原v-show状态并清除定时器
            clearInterval(auth_timer)
          }
        }, 1000)
      } else {
        ElMessage.error(res.msg)
      }
    }).catch((err) => {
      ElMessage.error(err.response.data.message)
    })
  }
}
// 验证中状态
const verifType = ref(false)
const resigte = () => {
  if (!form.smsCode) {
    codeTitle2.value = '验证码不能为空！'
    return
  }
  const params = {
    phone: form.account,
    code: form.smsCode,
    templateId: templateCode.value,
  }
  verifType.value = true
  getIstrue(params).then((res) => {
    if (res.success) {
      if (veriftCode.value == 'vloin') {
        onLogin(2)
      } else {
        loginType.value = 'register'
      }
      verifType.value = false
    }
  }).catch((err) => {
    codeTitle2.value = err.response.data.message
    verifType.value = false
  })
}
const verifyTitle = ref()
const verifyBtName = ref()
// 判断验证后跳转  rego 注册  fpwd 忘记密码  vloin 验证码登录
const veriftCode = ref()
const setLoginType = (type) => {
  // 忘记密码
  if (type === 'fpwd') {
    loginType.value = 'verification'
    verifyTitle.value = '输入验证码'
    verifyBtName.value = '确认'
    veriftCode.value = 'fpwd'
    templateCode.value = '5'
    // 验证码登录
  } else if (type === 'tme') {
    loginType.value = 'tme'
    veriftCode.value = 'vloin'
    verifyTitle.value = '输入验证码'
    verifyBtName.value = '确认'
    templateCode.value = '3'
  } else if (type === 'verification') {
    templateCode.value = '3'
    veriftCode.value = 'vloin'
    verifyTitle.value = '输入验证码'
    verifyBtName.value = '确认'
    loginType.value = 'verification'
  }
}

// 注册
const saveRegister = () => {
  formRef.value.validate((valid, fields) => {
    if (!valid) return false
    // 忘记密码
    if (veriftCode.value == 'fpwd') {
      const params = {
        userName: form.account,
        password: form.password,
      }
      updatePwdForAdmin(params).then((res) => {
        if (res.success) {
          ElMessage.success('修改成功')
          form.password = ''
          form.code = ''
          loginType.value = 'pwd'
        }
      })
    } else {
      // 注册
      const params = {
        phone: form.account,
        password: form.password,
      }
      setRegister(params).then((res) => {
        if (res.success) {
          ElMessage.success('注册成功')
          loginType.value = 'pwd'
        }
      }).catch((err) => {
        ElMessage.error(err.response.data.message)
      })
    }
  })
}
const formRef = ref()
// 登录
const onLogin = (type) => {
  if (!formRef.value) return false
  formRef.value.validate((valid, fields) => {
    if (!valid) return false
    if (type == 1) {
      if (form.rememberMe) {
        localStorage.setItem('loginInfo', form.account)
      } else {
        localStorage.setItem('loginInfo', '')
      }
      const params = {
        userName: form.account,
      }
      checkUser(params).then(res => {
        if (res.success) {
          if (res.data.length > 0) {
            // 手机号码存在
            loginType.value = 'pwd'
          } else {
            // 不存在注册
            loginType.value = 'verification'
            verifyTitle.value = '欢迎加入基扎破产管理'
            verifyBtName.value = '立即注册'
            templateCode.value = '4'
          }
        } else {
          ElMessage.error(res.msg)
        }
      })
    } else if (type == 2) {
      // 验证码登录
      const params = {
        userphone: form.account,
        code1: form.code,
        key1: form.key,
        pcode: form.smsCode,
      }
      phoneLogin(params).then(res => {
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
    } else {
      // 账号密码登录
      const params = {
        username: form.account,
        password: form.password1,
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
    }
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
:deep(.el-input__wrapper){
   padding-right: 6px;
}
.bt-box{
  height: 48px;
  font-size: 16px;
  font-weight: normal;
}
:deep(.el-divider__text){
   color: #9E9E9E;
}
.errBox{
  color: var(--el-color-danger);
    font-size: 12px;
    line-height: 1;
    padding-top: 2px;
    position: absolute;
    top: 100%;
    left: 0;
}
 </style>
