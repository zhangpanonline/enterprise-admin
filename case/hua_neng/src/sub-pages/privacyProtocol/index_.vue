<route lang="json">
{
  "style": { "navigationBarTitleText": "隐私协议" },
  "name": "PrivacyProtocol"
}
</route>

<template>
  <web-view :src="VITE_SERVER_BASEURL + '/resources/privacyProtocol.html'" />
</template>

<script lang="ts" setup>
const VITE_SERVER_BASEURL = import.meta.env.VITE_SERVER_BASEURL;
</script>
