<template>
  <div class="h-full overflow-hidden" >
    <IntangibleAsset :caseInfo="caseInfo" v-if="'intangibleAsset' === active" @back="active = ''" />
    <IntellectualProperty :caseInfo="caseInfo" v-else-if="'intellectualProperty' === active" @back="active = ''" />
    <ul v-else class="h-full p-5 box-border overflow-y-auto grid gap-5 grid-cols-7" >
      <li class="shadow h-25 rounded text-center leading-25 text-lg cursor-pointer text-white" :style="{ 'background': colors[i % 3] }" v-for="(v, i) in list" :key="v.id" @click="active = v.id" >{{ v.name }}</li>
    </ul>
  </div>
</template>

<script setup>
import IntangibleAsset from './intangibleAsset/index.vue'
import IntellectualProperty from './intellectualProperty/index.vue'
const { caseInfo } = defineProps({
  caseInfo: {
    type: Object,
    required: true,
  },
})
// 激活的卡片
const active = ref('')
const colors = ['#ff983f', '#FF6600', '#F18F01']
const list = [
  { id: 'intangibleAsset', name: '无形资产' },
  { id: 'intellectualProperty', name: '知识产权' },
]
</script>
