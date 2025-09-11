<template>
  <div class="w-screen h-screen box-border pl-5 flex gap-5">
    <!-- 左侧菜单 -->
    <div class="w-[269px] bg-white rounded-2xl shadow py-5 my-5 flex flex-col justify-between">
      <!-- 应用切换 -->
      <div class="relative w-full pr-2.5 inline-block text-left">
        <div
          class="showMicroBtn relative flex py-3 pl-5 pr-2.5 cursor-pointer items-center gap-5 justify-between w-full font-medium text-gray-700 z-0 before:absolute before:inset-0 before:from-gray-900/6 before:to-gray-900/9 before:bg-linear-to-r before:scale-x-0 before:origin-left before:transition-transform before:duration-400 hover:before:scale-x-100 before:z-[-1] before:rounded-r-full"
          @click="showMicroApp = !showMicroApp"
        >
          <img :src="microList[activeMicro].icon" class="w-5 h-5" />
          <p class="flex-1">{{ activeMicro }}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#9f9fa9"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
            />
          </svg>
        </div>
        <Transition
          enter-active-class="transition-all duration-400 ease-out"
          enter-from-class="opacity-0 -translate-y-5"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-5"
        >
          <div
            v-if="showMicroApp"
            ref="microListRef"
            class="absolute left-1/2 right-1 mt-2 bg-white rounded-md shadow-lg border border-gray-200"
          >
            <RouterLink
              v-for="({ path, icon }, key) in microList"
              :key="key"
              :to="path"
              @click="activeMicro = key"
            >
              <p
                class="relative px-4 py-2 text-md text-gray-700 flex items-center z-0 mb-0.5 before:absolute before:inset-0 before:bg-gray-100 before:scale-x-0 before:origin-left before:transition-transform before:duration-400 hover:before:scale-x-100 before:z-[-1] before:rounded-r-full"
              >
                <span class="flex-1 text-center">{{ key }}</span>
                <img :src="icon" class="w-4 h-4" />
              </p>
            </RouterLink>
          </div>
        </Transition>
      </div>

      <!-- 菜单 -->
      <ul class="flex-1 overflow-y-auto"></ul>

      <div
        class="relative flex hover:bg-gray-100 py-3 text-sm pl-5 pr-2.5 cursor-pointer items-center justify-between w-full font-medium text-gray-700 z-0"
        @click="showSystem = !showSystem"
      >
        <img class="w-5 h-5 rounded-full" v-if="authStore.user.user_metadata.avatar_url" :src="authStore.user.user_metadata.avatar_url" />
        <p class="showSystem flex-1 text-center">{{ authStore.user.email }}</p>
        <Transition
          enter-active-class="transition-all duration-400 ease-out"
          enter-from-class="opacity-0 translate-y-5"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-5"
        >
          <div
            v-if="showSystem"
            ref="systemRef"
            class="absolute left-1/3 right-0 bottom-full mb-1 bg-white rounded-md shadow-lg border border-gray-200"
          >
              <p
                class="relative px-4 py-2 text-md text-gray-700 flex items-center z-0 mb-0.5 hover:bg-gray-100"  @click="handleSignOut()"
              >
                <span class="flex-1 text-center">退出登录</span>
              </p>
          </div>
        </Transition>
      </div>
    </div>
    <!-- 子应用 -->
    <RouterView class="flex-1"></RouterView>
  </div>
</template>

<script setup lang="ts">
import { signOutApi } from '@/api'
import { onClickOutside } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const router = useRouter()
const authStore = useAuthStore()
const showMicroApp = ref(false)
const showSystem = ref(false)

const microList = {
  vue: {
    path: '/sub-app-vue',
    icon: 'https://vercel.com/api/v0/deployments/dpl_A6VTumhp3WTYmWYVxyxbbTYCLQGS/favicon?project=main-app&readyState=READY&teamId=team_ssIRefcwQEBAr07w4bHFSFQP',
  },
  next: {
    path: '/sub-app-next',
    icon: 'https://vercel.com/api/v0/deployments/dpl_9cxdvBhZp77CMPEQf963u7CfAmN5/favicon?project=sub-app-next&readyState=READY&teamId=team_ssIRefcwQEBAr07w4bHFSFQP',
  },
  nuxt: {
    path: '/sub-app-nuxt',
    icon: 'https://github.com/nuxt.png',
  },
}
const microListRef = useTemplateRef<HTMLElement>('microListRef')
const systemRef = useTemplateRef<HTMLElement>('systemRef')
onClickOutside(microListRef, () => (showMicroApp.value = false), {
  ignore: ['.showMicroBtn'],
})
onClickOutside(systemRef, () => (showSystem.value = false), {
  ignore: ['.showSystem'],
})
const activeMicro = ref<keyof typeof microList>('vue')
const menuList = [{}]

const handleSignOut = async () => {
  const { error } = await signOutApi()
  if (!error) {
    authStore.clear()
    router.push('/login')
  } else {
    window.alert(error.message)
  }
}
</script>
