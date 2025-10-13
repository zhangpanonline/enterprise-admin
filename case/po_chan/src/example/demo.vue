<template>
  <div></div>
</template>

<script setup >
fetch('https://api.zhushucloud.net/auth/user/getUserIdByJuUserId',
  { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
    'userid': '1713747997575335936',
    'plat': '2',
  }) }).then(res => res.json()).then(res => {
  console.log(res, '@@')
})
</script>

<style scoped>
:deep(.el-loading-mask .el-loading-spinner .el-loading-text) {
  color: #fff !important;
}
</style>
