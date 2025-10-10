import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useDataStore = defineStore('data', () => {
  const _typeList = ref<any[]>([])
  const _historyList = ref<any[]>([])
  const _currentDate = ref<string>('')
  const _currentType = ref<string>('')
  const _energyRatesHourlyList = ref<any[]>([])
  const _demandSupplyBalanceList = ref<any[]>([])
  const _tradingUnitData = ref<any[]>([])
  const _currentCategory = ref<'' | 'market' | 'centralized'>('market')

  const setTypeList = (list: any[]) => {
    _typeList.value = list
  }
  const setHistoryList = (list: any[]) => {
    _historyList.value = list
  }
  const setCurrentDate = (date: string) => {
    _currentDate.value = date
  }
  const setCurrentType = (type: string) => {
    _currentType.value = type
  }
  const setEnergyRatesHourlyList = (list: any[]) => {
    _energyRatesHourlyList.value = list
  }
  const setDemandSupplyBalanceList = (list: any[]) => {
    _demandSupplyBalanceList.value = list
  }
  const setTradingUnitData = (data: any[]) => {
    _tradingUnitData.value = data
  }
  const setCurrentCategory = (type: '' | 'market' | 'centralized') => {
    _currentCategory.value = type
  }

  const typeList = computed(() => _typeList.value)
  const historyList = computed(() => _historyList.value)
  const currentDate = computed(() => _currentDate.value)
  const currentType = computed(() => _currentType.value)
  const tradingUnitData = computed(() => _tradingUnitData.value)
  const energyRatesHourlyList = computed(() => _energyRatesHourlyList.value)
  const demandSupplyBalanceList = computed(() => _demandSupplyBalanceList.value)
  const currentCategory = computed(() => _currentCategory.value)

  return {
    typeList,
    historyList,
    currentDate,
    currentType,
    energyRatesHourlyList,
    demandSupplyBalanceList,
    tradingUnitData,
    currentCategory,
    setTypeList,
    setHistoryList,
    setCurrentDate,
    setCurrentType,
    setEnergyRatesHourlyList,
    setDemandSupplyBalanceList,
    setTradingUnitData,
    setCurrentCategory
  }
})
