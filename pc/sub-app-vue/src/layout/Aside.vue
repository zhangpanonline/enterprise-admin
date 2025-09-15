<template>
  <div class="bg-white flex flex-col">
    <div class="h-16 flex justify-between px-5 items-center cursor-pointer" @click="router.push('/')" >
      <img src="https://vercel.com/api/v0/deployments/dpl_A6VTumhp3WTYmWYVxyxbbTYCLQGS/favicon?project=main-app&readyState=READY&teamId=team_ssIRefcwQEBAr07w4bHFSFQP" />
      <p class="flex-1 text-center text-gray-600 text-shadow-md" >SUB-APP-VUE</p>
    </div>
    <el-menu
      class="flex-1"
      :default-active="defaultActive"
      router
    >
      <template v-for="v in menuList" :key="v.path">
        <template v-if="v.children.length">
          <el-sub-menu :index="v.path">
            <template #title>
              <span>{{ v.title }}</span>
            </template>
            <el-menu-item v-for="item in v.children" :key="item.path" :index="item.path">{{
              item.title
            }}</el-menu-item>
          </el-sub-menu>
        </template>
        <el-menu-item v-else :index="v.path">
          <span>{{ v.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
    <div
        class="w-full h-14 flex items-center border-t px-5 border-t-gray-100 box-border border-gray-300 border-r cursor-pointer"
    >
      <img
        class="w-6 h-6 rounded-full"
        v-if="authStore.user.user_metadata.avatar_url"
        :src="authStore.user.user_metadata.avatar_url"
      />
      <el-dropdown
        placement="top-end"
        @command="handleCommand"
        class="flex-1"
      >
        <p class="text-center w-full focus-visible:outline-0">
          {{ authStore.user.email?.split('@')[0] }}
        </p>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { signOutApi } from '@/api'
import { useAuthStore } from '@/stores/auth'

defineProps(['menuList'])

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const defaultActive = route.path

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    const { error } = await signOutApi()
    if (!error) {
      authStore.clear()
      router.push('/login')
    } else {
      window.alert(error.message)
    }
  }
}


</script>
