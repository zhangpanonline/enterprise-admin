<template>
    <div class="w-full h-full border flex flex-col" >
        <LayoutHeader class="h-15" />
        <div class="flex-1 flex" >
            <LayoutMenu class="w-50" />
            <RouterView class="flex-1" />
        </div>
    </div>
</template>

<script lang="ts" setup >
import LayoutHeader from './LayoutHeader.vue'
import LayoutMenu from './LayoutMenu.vue'
</script>
