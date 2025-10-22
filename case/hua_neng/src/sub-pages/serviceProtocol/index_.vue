<route lang="json">
{
  "style": { "navigationBarTitleText": "服务协议" },
  "name": "ServiceProtocol"
}
</route>

<template>
  <web-view :src="VITE_SERVER_BASEURL + '/resources/serviceProtocol.html'" />
</template>

<script lang="ts" setup>
const VITE_SERVER_BASEURL = import.meta.env.VITE_SERVER_BASEURL;
</script>
