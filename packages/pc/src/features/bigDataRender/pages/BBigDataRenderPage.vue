<template>
    <div>
        <el-select v-model="type" >
            <el-option label="虚拟列表（Virtual List / Virtual Scrolling）" value="1" />
            <el-option label="分片渲染 + Worker 多线程计算" value="2" />
        </el-select>
        <div class="h-200 overflow-y-auto overflow-x-hidden mt-2 p-5 border border-indigo-50" >
            <VueVirtualScroller :list="mock()" v-if="type === '1'" />
            <DocumentFragment v-else-if="type === '2'" />
        </div>
    </div>
</template>

<script setup lang="ts">
import VueVirtualScroller from '../components/VueVirtualScroller.vue'
import DocumentFragment from '../components/DocumentFragment.vue'
const type = ref('')
import mock from '../mock'
</script>