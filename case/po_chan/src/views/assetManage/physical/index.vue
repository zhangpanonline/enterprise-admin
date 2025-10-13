<template>
  <div class="cus_page_header flex gap-3 items-center">
    <template v-for="(obj, key) in tabs" :key="key">
      <span
        v-if="buttonAuth[obj.id]"
        :class="{ 'cus_page_header_tag--active': active === key }"
        class="cus_page_header_tag"
        @click="active = key">{{ obj.name }}
      </span>
    </template>
  </div>
  <div class="bg-white h-full-15" >
    <component :is="tabs[active]['el']"></component>
  </div>
</template>

<script setup>
import Fixed from './fixed/Index.vue'
import Vehicles from './vehicles/Index.vue'
import Estate from './estate/Index.vue'
import { TAB1, TAB2, TAB3 } from '@/constant/index.js'
const { buttonAuth } = useButtonAuth([TAB1, TAB2, TAB3])
const tabs = reactive({
  fixed: {
    id: TAB1,
    name: '固定资产',
    el: Fixed,
  },
  vehicles: {
    id: TAB2,
    name: '车辆',
    el: Vehicles,
  },
  estate: {
    id: TAB3,
    name: '不动产',
    el: Estate,
  },
})
const active = ref('fixed')
</script>
