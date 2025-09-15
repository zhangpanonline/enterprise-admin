<template>
    <div class="w-full h-full flex overflow-hidden" >
        <Aside v-if="!isWujie" :menuList="menuList" class="w-60" ></Aside>
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
const isWujie = !!window.$wujie
const menuList = getMenu(routes)
function getMenu(list: Array<RouteRecordRaw>): any {
  return list.map(({ path, meta, children }) => ({
    title: meta?.title,
    path,
    children: getMenu(children || []),
  }))
}
window.$wujie?.bus.$emit("menu-list", menuList);

</script>

