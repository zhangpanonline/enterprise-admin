
<template>
  <ElIcon :size="$attrs.size">
    <svg :color="$attrs.color" >
      <use :href="'#' + $attrs.name"/>
    </svg>
  </ElIcon>
</template>
