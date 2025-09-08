<template>
  <div class="main-app w-screen h-screen box-border p-5 flex gap-5">
    <!-- 左侧菜单 -->
    <div class="w-[269px] bg-white rounded-2xl shadow py-5">
      <!-- 应用切换 -->
      <div class="relative w-full pr-2.5 inline-block text-left">
        <div
          class="flex py-3 pl-5 pr-2.5 cursor-pointer rounded-r-2xl items-center gap-5 justify-between w-full font-medium text-gray-700 
          hover:bg-size-[100%_100%] from-gray-50 to-gray-100 bg-linear-to-r bg-size-[0%_100%] hover:transition-[background_size] ease-linear"
          @click="showMicroApp = !showMicroApp"
        >
          <img :src="microList[activeMicro].icon" class="w-5 h-5" />
          <p class="flex-1">{{ activeMicro }}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
            />
          </svg>
        </div>
        <div
          v-if="showMicroApp"
          class="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
        >
          <div class="py-1">
            <a
              href="#"
              class="block block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
              role="menuitem"
            >
              <span class="flex flex-col">
                <span> Stripe </span>
              </span>
            </a>
            <a
              href="#"
              class="block block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
              role="menuitem"
            >
              <span class="flex flex-col">
                <span> Mastercard </span>
              </span>
            </a>
            <a
              href="#"
              class="block block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
              role="menuitem"
            >
              <span class="flex flex-col">
                <span> Paypal </span>
              </span>
            </a>
          </div>
        </div>
      </div>

      <!-- 菜单 -->
      <ul></ul>
    </div>
    <!-- 子应用 -->
    <RouterView class="flex-1"></RouterView>
  </div>
</template>

<script setup lang="ts">
const showMicroApp = ref(false)
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
const activeMicro = 'vue'
</script>

<style lang="css" scoped>
.main-app {
  background-color: #f0f5f9;
}
</style>
