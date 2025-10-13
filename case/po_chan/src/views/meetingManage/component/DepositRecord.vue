<template>
  <el-dialog v-model="visible" :close-on-click-modal="false" :close-on-press-escape="false" title="证据记录" width="70%">
    <el-tabs v-model="tabKey" @tab-click="$event => tabKey = $event.name">
      <el-tab-pane label="保全记录" name="save"></el-tab-pane>
      <el-tab-pane label="视频证据" name="video"></el-tab-pane>
      <el-tab-pane label="语音记录" name="listen"></el-tab-pane>
    </el-tabs>
    <DepositSave v-if="tabKey === 'save' && visible" :meet-id="meetId" />
    <DepositVideo v-else-if="tabKey === 'video' && visible" :meet-code="meetCode" :meet-name="meetName" />
    <DepositListen v-else-if="tabKey === 'listen' && visible" :meet-code="meetCode" />
  </el-dialog>
</template>

<script>
import DepositSave from './DepositSave.vue'
import DepositListen from './DepositListen.vue'
import DepositVideo from './DepositVideo.vue'
export default {
  components: { DepositSave, DepositListen, DepositVideo },
  data() {
    return {
      visible: false,
      tabKey: 'save',
      meetId: '',
      meetCode: '',
      meetName: '',
    }
  },
}
</script>
<style scoped>
:deep(.el-tabs__header.is-top) {
  padding: 0;
}
</style>
