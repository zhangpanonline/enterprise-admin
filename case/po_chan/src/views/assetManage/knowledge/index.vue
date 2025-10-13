<template>
  <div class="cus_page_header flex gap-3 items-center">
    <template v-for="(obj, key) in tabs" :key="key">
      <span
      v-if="buttonAuth[obj.id]"
      :class="{ 'cus_page_header_tag--active': active === key }"
      class="cus_page_header_tag"
      @click="active = key">{{ obj.name }}</span>
    </template>
  </div>
  <div class="bg-white h-full-14" >
    <component :is="tabs[active]['el']"></component>
  </div>
</template>

<script setup>
import Trademarks from './trademarks/Index.vue'
import Patents from './patents/Index.vue'
import Soft from './soft/Index.vue'
import Works from './works/Index.vue'
import { TAB1, TAB2, TAB3, TAB4 } from '@/constant/index.js'
const { buttonAuth } = useButtonAuth([TAB1, TAB2, TAB3, TAB4])
const tabs = reactive({
  trademarks: {
    id: TAB1,
    name: '商标',
    el: Trademarks,
  },
  patents: {
    id: TAB2,
    name: '专利',
    el: Patents,
  },
  soft: {
    id: TAB3,
    name: '软著',
    el: Soft,
  },
  works: {
    id: TAB4,
    name: '著作',
    el: Works,
  },
})
const active = ref('trademarks')
</script>
