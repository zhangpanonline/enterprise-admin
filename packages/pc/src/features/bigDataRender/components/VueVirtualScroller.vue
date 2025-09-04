<template>
 <DynamicScroller
    :items="list"
    :min-item-size="20"
  >
    <template v-slot="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[]"
        :data-index="index"
      >
        
        <ul class="grid grid-cols-5" >
            <li>{{ item.id }}</li>
            <li>{{ item.name }}</li>
            <li>{{ item.age }}</li>
            <li>{{ item.address }}</li>
            <li>{{ item.createTime }}</li>
        </ul>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>

<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
defineProps(['list'])
</script>