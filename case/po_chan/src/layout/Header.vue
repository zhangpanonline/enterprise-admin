<template>
  <header class="backdrop-blur backdrop-filter firefox:bg-opacity-30 h-15 w-screen p-5 fixed z-10 bg-white flex justify-between items-center shadow hover:shadow-md shadow-info-100">
    <div class="flex items-center">
      <img  src="/src/assets/images/logo.png" class="w-6 h-6" alt="logo">
      <p class="ml-3 font-semibold text-[15px]" >基扎破产案件管理后台</p>
    </div>
    <div class="flex items-center" >
      <h1 class="mr-10 text-sm" >
        <span>{{ getTime() }}</span>
        <span class="text-primary" >您当前参与进行中的案件有</span>
        <span class="text-warning mx-1" >{{ appStore.caseTotal }}</span>
        <span class="text-primary" >件</span>
      </h1>
      <span class="flex items-center gap-0.5">
        <el-avatar  :size="24" style="background-color: var(--primary-color-400);">
          <span v-if="appStore.userInfo.fullName" class="text-white text-[12px]" >{{ appStore.userInfo.fullName.slice(0, 1) }}</span>
        </el-avatar>
        <el-popover placement="bottom" popper-style="border-radius:8px"  :width="274" trigger="hover">
          <template #reference>
            <div class="flex items-center cursor-pointer">
              <span class="ml-2 text-sm" v-if="appStore.userInfo.fullName">{{ appStore.userInfo.fullName }}</span>
              <img class="ml-2" src="/src/assets/images/drop.png" alt="">
            </div>
          </template>
          <div class="p-2">
            <div class="h-[88px] bg-[#F5F9FB] flex p-3">
                <img class="w-16 h-16 rounded-full mr-3" :src="appStore.userInfo.userPhotoPath" alt="">
                <div class="flex flex-col justify-between">
                    <div class="text-[18px] text-[#333333] font-bold	">{{ appStore.userInfo.fullName }}</div>
                    <div class="text-sm	text-[#9E9E9E]">{{appStore.userInfo.contactAddress}}</div>
                </div>
            </div>
            <div class="flex justify-between mt-6">
                <div @click="getUser(1)" class="flex flex-col items-center text-sm text-[#333333] cursor-pointer"><img class="mb-2" src="/src/assets/images/personal1.png" alt="">个人设置</div>
                <div @click="getName" class="flex flex-col items-center text-sm text-[#333333] cursor-pointer"><img class="mb-2" src="/src/assets/images/personal2.png" alt="">实名认证</div>
                <div @click="getUser(2)" class="flex flex-col items-center text-sm text-[#333333] cursor-pointer"><img class="mb-2" src="/src/assets/images/personal3.png" alt="">修改密码</div>
            </div>
          </div>
        </el-popover>
        <RabbitInmail />
        <img class="ml-2 cursor-pointer" @click="logout" src="/src/assets/images/exit.png" alt="" />
      </span>
    </div>
  </header>
  <UserInfo v-model="showUserInfo" :title="userTitle" :userType="userType"/>
</template>

<script setup>
import RabbitInmail from './RabbitInmail.vue'
import UserInfo from './UserInfo.vue'

const showUserInfo = ref(false)
const router = useRouter()
const appStore = useAppStore()
const caseStore = useCaseStore()
const userTitle = ref('个人资料')
const userType = ref()
const getUser = (type) => {
  if (type === 1) {
    userTitle.value = '个人资料'
  } else {
    userTitle.value = '修改密码'
  }
  showUserInfo.value = true
  userType.value = type
}
const getName = () => {
  ElMessage.error('功能开发中')
}
const logout = () => {
  localStorage.clear()
  sessionStorage.clear()
  appStore.$reset()
  caseStore.$reset()
  router.replace('/login')
}
const getTime = () => {
  const now = new Date()
  const hour = now.getHours()
  if (hour < 6) {
    return '凌晨好！'
  } else if (hour < 9) {
    return '早上好！'
  } else if (hour < 12) {
    return '上午好！'
  } else if (hour < 14) {
    return '中午好！'
  } else if (hour < 17) {
    return '下午好！'
  } else if (hour < 19) {
    return '傍晚好！'
  } else if (hour < 22) {
    return '晚上好！'
  } else {
    return '您该休息啦！'
  }
}
</script>
