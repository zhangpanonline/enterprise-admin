<template>
    <div class="w-full h-full flex overflow-hidden" >
        <Aside v-if="!isWujie" v-model:menuList="menuList" class="w-60" ></Aside>
        <div class="flex-1 flex flex-col" >
            <Header class="h-16 bg-white" :class="{ 'mr-2.5': isWujie }"></Header>
            <RouterView class="flex-1" :class="{ 'pl-0!': isWujie, 'pb-0!': isWujie }" ></RouterView>
        </div>
    </div>
</template>

<script setup lang="ts" >
import type { RouteRecordRaw } from 'vue-router'
import Aside from './Aside.vue'
import Header from './Header.vue'
import { routes } from '@/router/routes'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
const isWujie = !!window.$wujie
const menuList = ref([])

watch(locale, () => {
  menuList.value = getMenu(routes)
  window.$wujie?.bus.$emit("menu-list", menuList.value);
}, {
  immediate: true
})

function getMenu(list: Array<RouteRecordRaw>): any {
  return list.map(({ path, meta, children }) => ({
    title: t(meta?.title as string),
    path,
    children: getMenu(children || []),
  }))
}

</script>

