<template>
  <div class="w-screen h-screen bg-undertone overflow-hidden">
    <el-container class="h-full overflow-hidden" >
      <Header></Header>
      <div class="pt-15 w-screen h-full overflow-hidden grid grid-cols-[200px_1fr]">
        <Menu ></Menu>
        <el-container class="h-full overflow-hidden" >
          <main class="h-full-8 p-5 overflow-hidden relative" >
            <RouterView class="bg-white h-full" ></RouterView>
          </main>
          <el-footer class="!h-8 text-xs text-right text-black-300 leading-8 bg-white" >
            <span class="mr-5">Copyright ©2020 筑术云 版权所有</span>
            <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank" >陕ICP备19022882号</a>
          </el-footer>
        </el-container>
      </div>
    </el-container>
  </div>
</template>

<script setup>
import Header from '@/layout/Header.vue'
import Menu from '@/layout/Menu.vue'
const loadingInstance = ElLoading.service({ text: '正在请求用户信息，请稍等...', background: 'rgba(0, 0, 0, 0.3)' })
const appStore = useAppStore()
getUserInfoApi({ token: appStore.token, loginName: appStore.userInfo.userName }).then(res => {
  if (res.success) {
    appStore.setUserInfo(res.data)
    // 获取菜单
    getMenuApi({ sysCode: 'BANKRUPT_SYSTEM', state: 1, userId: res.data.userId }).then(res => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        appStore.setMenus(res.data[0].children)
      }
    })
    // 获取当前用户名下有多少个案件
    getCaseTotalApi().then(res => {
      appStore.setCaseTotal(res.data)
    })
  } else {
    ElMessage.error(res.msg)
  }
}).catch(error => {
  console.error(error)
  ElMessage.error(error.message)
}).finally(() => {
  loadingInstance.close()
})
</script>
