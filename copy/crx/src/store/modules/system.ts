import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSystemStore = defineStore('system', () => {
  //  当前应用是不是被激活
  const _activate = ref(false)
  const _loading = ref(false)
  const _tabId = ref()
  const _update = ref(0)

  const activate = computed(() => _activate.value)
  const loading = computed(() => _loading.value)
  const tabId = computed(() => _tabId.value)
  const updateList = computed(() => _update.value)
  const setActivate = (value: boolean) => {
    _activate.value = value
  }
  const setLoading = (value: boolean) => {
    _loading.value = value
  }

  const setTabId = (value: number) => {
    _tabId.value = value
  }
  const setUpdateList = () => {
    _update.value++
  }

  const clearUpdateList = () => {
    _update.value = 0
  }

  return {
    activate,
    setActivate,
    loading,
    setLoading,
    tabId,
    setTabId,
    updateList,
    setUpdateList,
    clearUpdateList,
  }
})
