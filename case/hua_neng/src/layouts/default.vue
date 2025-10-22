<template>
  <wd-config-provider theme="light" :theme-vars="themeVars">
    <view class="defaul-app-layout">
      <slot />
      <wd-toast />
      <wd-message-box />
      <wd-notify />
    </view>
  </wd-config-provider>
</template>

<script setup lang="ts">
import type { ConfigProviderThemeVars } from 'wot-design-uni';
const themeVars: ConfigProviderThemeVars = {
  colorTheme: '#1a65ee',
  buttonMediumRadius: '8px',
  buttonLargeRadius: '8px',
  buttonSmallRadius: '8px',
};
</script>
