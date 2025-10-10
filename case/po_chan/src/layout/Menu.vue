<template>
  <el-menu class="overflow-y-auto" :default-active="active" active-text-color="#ffffff" unique-opened @select="router.push" >
    <template v-for="v in menuList" :key="v.url">
      <!-- 有子菜单 -->
      <template v-if="Array.isArray(v.children) && v.children.length" >
        <el-sub-menu :index="v.url" class="overflow-hidden rounded" >
          <template #title>
            <p>
              <IconSvg v-if="v.icon" size="100" :color="active === v.url ? '#fff' : 'var(--primary-color)'" :name="v.icon"/>
              {{ v.label }}
            </p>
          </template>
          <el-menu-item v-for="sub in v.children" :key="sub.url" class="rounded mt-1 ml-2" :class="[ caseStore.isExistCase ? '!h-10.5' : '!h-16' ]" :index="sub.url">
            {{ sub.label }}
          </el-menu-item>
        </el-sub-menu>
      </template>
      <!-- 没有子菜单 -->
      <template v-else >
        <el-menu-item class="rounded mt-1" :class="[ (caseStore.isExistCase && !['/caseHome', '/inCaseHome'].includes(v.url)) ? '!h-10.5' : '!h-16' ]" :index="v.url">
          <IconSvg v-if="v.icon" size="100" :color="active === v.url ? '#fff' : 'var(--primary-color)'" :name="v.icon"/>
          <span>
            {{v.label}}
          </span>
        </el-menu-item>
        <p v-if="['/caseHome', '/inCaseHome'].includes(v.url)" class="border-b mt-1 border-info-50" ></p>
      </template>
    </template>
  </el-menu>
</template>

<script setup>
const caseStore = useCaseStore()
const appStore = useAppStore()
const { menus, caseMenu } = storeToRefs(useAppStore())
const router = useRouter()
const route = useRoute()
const active = computed(() => route?.meta?.parentMenu || route.path)
watch(() => route.path, path => {
  if (appStore.menus && appStore.menus.some(v => v.url === path)) {
    caseStore.$reset()
  }
}, {
  immediate: true,
})
let menuList = ref([])
watch(() => caseStore.isExistCase, bool => {
  if (bool) {
    menuList = caseMenu
    // 解决刷新页面按钮权限丢失问题
    caseStore.getCaseInfo(caseStore.caseInfo.projectId)
  } else {
    menuList = menus
  }
}, {
  immediate: true,
})
</script>

<style scoped>
/* :deep(.el-sub-menu__title) {
  height: 64px;
} */
.el-menu:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  padding: 0 12px;
  padding-top: 12px;
}
.el-menu-item.is-active{
  background: var(--primary-color);
  border-radius: 4px;
}
::-webkit-scrollbar {
  width: 0;
}
</style>
