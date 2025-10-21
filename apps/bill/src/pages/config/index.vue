<route lang="json">
{
  "layout": "tabbar",
  "style": { "navigationBarTitleText": "配置" },
  "name": "config"
}
</route>
<template>
  <wd-cell title="添加一级分类" is-link to="/sub-pages/category/index?type=1" />
  <wd-cell title="添加二级分类" is-link to="/sub-pages/category/index?type=2" />
</template>

<script setup lang="ts"></script>
