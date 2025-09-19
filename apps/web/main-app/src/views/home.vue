<template>
  <div class="w-screen h-screen box-border pl-5 flex gap-2.5">
    <!-- 左侧菜单 -->
    <div class="w-[269px] bg-white rounded-2xl shadow py-5 my-5 flex flex-col justify-between">
      <!-- 应用切换 -->
      <div class="relative w-full pr-2.5 inline-block text-left mb-1">
        <div
          class="showMicroBtn relative flex py-3 pl-5 pr-2.5 cursor-pointer items-center gap-5 justify-between w-full font-medium text-gray-700 z-0 before:absolute before:inset-0 before:from-gray-900/6 before:to-gray-900/9 before:bg-linear-to-r before:scale-x-0 before:origin-left before:transition-transform before:duration-500 hover:before:scale-x-100 before:z-[-1] before:rounded-r-full"
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
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 -translate-y-5"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-5"
        >
          <div
            v-if="showMicroApp"
            ref="microListRef"
            class="absolute left-1/2 right-1 mt-2 z-1 bg-white rounded-md shadow-lg border border-gray-200"
          >
            <RouterLink
              v-for="({ path, icon }, key) in microList"
              :key="key"
              :to="path"
              @click="((activeMicro = key), (showMicroApp = false))"
            >
              <p
                class="relative px-4 py-2 text-md text-gray-700 flex items-center z-0 mb-0.5 before:absolute before:inset-0 before:bg-gray-100 before:scale-x-0 before:origin-left before:transition-transform before:duration-500 hover:before:scale-x-100 before:z-[-1] before:rounded-r-full"
              >
                <span class="flex-1 text-center">{{ key }}</span>
                <img :src="icon" class="w-4 h-4" />
              </p>
            </RouterLink>
          </div>
        </Transition>
      </div>

      <!-- 菜单 -->
      <ul class="flex-1 overflow-y-auto pr-2.5">
        <li v-for="(v, idx) in menuList[activeMicro]" :key="v.title">
          <!-- 一级菜单 -->
          <div
            @click="toggleMenu(idx, v)"
            :class="`mb-1 relative flex py-3 pl-5 pr-2.5 cursor-pointer items-center gap-5 justify-between w-full font-medium text-gray-700 z-0 before:absolute before:inset-0 ${colorList[idx].start} ${colorList[idx].end} before:bg-linear-to-l ${activePath === v.path ? 'before:scale-x-100' : 'before:scale-x-0'} before:origin-left before:transition-transform before:duration-500 hover:before:scale-x-100 before:z-[-1] before:rounded-r-full`"
          >
            {{ v.title }}
            <svg
              v-if="v.children?.length"
              t="1757921870240"
              :class="openIndex === idx ? `rotate-180` : `rotate-0`"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5877"
              width="24"
              height="24"
            >
              <path
                d="M512.726547 675.318646c-8.063653 0-15.790638-3.245927-21.435195-9.006118L231.175103 400.906809c-11.603269-11.837606-11.410887-30.840402 0.427742-42.442648 11.837606-11.601222 30.841426-11.410887 42.442648 0.427742l238.681054 243.534596L751.407602 358.891903c11.601222-11.839653 30.602995-12.033058 42.442648-0.427742 11.839653 11.603269 12.031011 30.605042 0.427742 42.442648L534.161742 666.312528C528.517185 672.072719 520.791224 675.318646 512.726547 675.318646z"
                fill="#9f9fa9"
                p-id="5878"
              ></path>
            </svg>
          </div>
          <!-- 二级菜单 -->
          <div
            :ref="setSubmenuRef"
            :data-index="idx"
            :style="{ height: openIndex === idx ? submenuHeights[idx] + 'px' : '0px' }"
            class="overflow-hidden transition-[height] duration-300 ease-in-out"
          >
            <p
              v-for="(sub, subIdx) in v.children"
              :key="sub.title"
              :class="`mb-1 relative flex py-3 pl-5 pr-2.5 cursor-pointer items-center gap-5 justify-start w-full font-medium text-gray-700 z-0 before:absolute before:inset-0 ${colorList[idx + subIdx].start} ${colorList[idx + subIdx].end} before:bg-linear-to-l ${activePath === sub.path ? 'before:scale-x-100' : 'before:scale-x-0'} before:origin-left before:transition-transform before:duration-500 hover:before:scale-x-100 before:z-[-1] before:rounded-r-full`"
              @click="jumpTo(sub.path)"
            >
              <span :class="`w-1.5 h-1.5 rounded-full ${colorList[idx + subIdx].dot}`"></span>
              {{ sub.title }}
            </p>
          </div>
        </li>
      </ul>
      <div
        class="relative flex hover:bg-gray-100 py-3 text-sm pl-5 pr-2.5 cursor-pointer items-center justify-between w-full font-medium text-gray-700 z-0"
        @click="showSystem = !showSystem"
      >
        <img
          class="w-5 h-5 rounded-full"
          v-if="authStore.user.user_metadata.avatar_url"
          :src="authStore.user.user_metadata.avatar_url"
        />
        <p class="showSystem flex-1 text-center">{{ authStore.user.email }}</p>
        <Transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-5"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-5"
        >
          <div
            v-if="showSystem"
            ref="systemRef"
            class="absolute right-0 bottom-full mb-1 bg-white rounded-md shadow-lg border border-gray-200"
          >
            <p
              class="relative px-4 py-2 text-md text-gray-700 flex items-center z-0 mb-0.5 hover:bg-gray-100"
              @click="handleSignOut()"
            >
              <span class="flex-1 text-center">{{ t('login.logout') }}</span>
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
import wujieVue3 from 'wujie-vue3'
import { signOutApi } from '@/api'
import { onClickOutside } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const authStore = useAuthStore()
const showMicroApp = ref(false)
const showSystem = ref(false)
const refreshHref = decodeURIComponent(window.location.href)
const activePath = ref(refreshHref.split('=')[1])

const colorList = [
  {
    start: 'before:from-red-500/10',
    end: 'before:from-red-500/30',
    dot: 'bg-red-500',
  },
  {
    start: 'before:from-orange-500/10',
    end: 'before:from-orange-500/30',
    dot: 'bg-orange-500',
  },
  {
    start: 'before:from-amber-500/10',
    end: 'before:from-amber-500/30',
    dot: 'bg-amber-500',
  },
  {
    start: 'before:from-yellow-500/10',
    end: 'before:from-yellow-500/30',
    dot: 'bg-yellow-500',
  },
  {
    start: 'before:from-lime-500/10',
    end: 'before:from-lime-500/30',
    dot: 'bg-lime-500',
  },
  {
    start: 'before:from-green-500/10',
    end: 'before:from-green-500/30',
    dot: 'bg-green-500',
  },
  {
    start: 'before:from-emerald-500/10',
    end: 'before:from-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  {
    start: 'before:from-teal-500/10',
    end: 'before:from-teal-500/30',
    dot: 'bg-teal-500',
  },
  {
    start: 'before:from-cyan-500/10',
    end: 'before:from-cyan-500/30',
    dot: 'bg-cyan-500',
  },
  {
    start: 'before:from-sky-500/10',
    end: 'before:from-sky-500/30',
    dot: 'bg-sky-500',
  },
  {
    start: 'before:from-blue-500/10',
    end: 'before:from-blue-500/30',
    dot: 'bg-blue-500',
  },
  {
    start: 'before:from-indigo-500/10',
    end: 'before:from-indigo-500/30',
    dot: 'bg-indigo-500',
  },
  {
    start: 'before:from-violet-500/10',
    end: 'before:from-violet-500/30',
    dot: 'bg-violet-500',
  },
  {
    start: 'before:from-purple-500/10',
    end: 'before:from-purple-500/30',
    dot: 'bg-purple-500',
  },
  {
    start: 'before:from-fuchisa-500/10',
    end: 'before:from-fuchisa-500/30',
    dot: 'bg-fuchisa-500',
  },
  {
    start: 'before:from-pink-500/10',
    end: 'before:from-pink-500/30',
    dot: 'bg-pink-500',
  },
  {
    start: 'before:from-rose-500/10',
    end: 'before:from-rose-500/30',
    dot: 'bg-rose-500',
  },
  {
    start: 'before:from-slate-500/10',
    end: 'before:from-slate-500/30',
    dot: 'bg-slate-500',
  },
  {
    start: 'before:from-gray-500/10',
    end: 'before:from-gray-500/30',
    dot: 'bg-gray-500',
  },
]

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
refreshHref.includes(microList.vue.path) && (activeMicro.value = 'vue')
refreshHref.includes(microList.next.path) && (activeMicro.value = 'next')
refreshHref.includes(microList.nuxt.path) && (activeMicro.value = 'nuxt')

type Menu = {
  title: string
  path: string
  children?: Array<Menu>
}
const menuList = reactive({
  vue: [] as Array<Menu>,
  next: [] as Array<Menu>,
  nuxt: [] as Array<Menu>,
})
wujieVue3.bus.$on('menu-list', (list: Array<Menu>) => {
  menuList[activeMicro.value] = list
})
const handleSignOut = async () => {
  const { error } = await signOutApi()
  if (!error) {
    authStore.clear()
    router.push('/login')
  } else {
    window.alert(error.message)
  }
}

const jumpTo = (path: string) => {
  wujieVue3.bus.$emit('navigate', path)
  activePath.value = path
}

// 当前展开的菜单索引
const openIndex = ref(-1)

// 存储每个 submenu 的高度
const submenuHeights = ref<number[]>([])
// 存储每个 submenu 的 DOM 引用
const submenuRefs = ref<(HTMLElement | ComponentPublicInstance | null)[]>([])

const setSubmenuRef = (el: any) => {
  if (el) {
    const idx = Number(el.dataset.index)
    submenuRefs.value[idx] = el
    submenuHeights.value[idx] = el.scrollHeight
  }
}

const toggleMenu = (idx: number, o: Menu) => {
  if (o.children?.length) {
    if (openIndex.value === idx) {
      openIndex.value = -1
    } else {
      openIndex.value = idx
      nextTick(() => {
        submenuHeights.value[idx] = submenuRefs.value[idx]?.scrollHeight || 0
      })
    }
  } else {
    jumpTo(o.path)
  }
}
</script>
