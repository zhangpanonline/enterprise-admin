<template>
    <div class="w-full h-full flex overflow-hidden" >
        <Aside class="w-60" ></Aside>
        <div class="flex-1 flex flex-col" >
            <Header class="h-16 bg-white" ></Header>
            <RouterView class="flex-1" ></RouterView>
        </div>
    </div>
</template>

<script setup lang="ts" >
import Aside from './Aside.vue'
import Header from './Header.vue'
</script>

