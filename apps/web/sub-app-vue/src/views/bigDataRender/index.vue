<template>
  <div class="p-2.5 flex flex-col gap-2.5">
    <header class="h-16 bg-white flex items-center px-5">
        <el-button-group>
            <el-button :type="type === '1' ? 'primary' : 'default'" @click="type = '1'" >虚拟列表（Virtual List / Virtual Scrolling）</el-button>
            <el-button :type="type === '2' ? 'primary' : 'default'" @click="type = '2'" >分片渲染 + Worker 多线程计算</el-button>
        </el-button-group>
    </header>
    <div class="bg-white h-190 overflow-y-auto overflow-x-hidden p-5">
      <VueVirtualScroller :list="mock()" v-if="type === '1'" />
      <DocumentFragment v-else-if="type === '2'" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import VueVirtualScroller from './components/VueVirtualScroller.vue'
import DocumentFragment from './components/DocumentFragment.vue'
const type = ref('1')
import mock from './mock'
</script>
