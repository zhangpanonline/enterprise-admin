<template>
  <el-dialog
    class="aog-dialog-box"
    v-model="visible"
    top="30vh"
    :append-to="`#${SYSTEM_EL_ID}`"
    v-bind="$attrs"
    :show-close="false"
  >
    <div class="dialog-content">
      <slot></slot>
    </div>
    <template #header>
      <div class="dialog-header">
        <div class="title-name">{{ title }}</div>
        <div class="action-box">
          <div class="icon-box">
            <el-icon :size="$adapter_width_unit(20)"
              ><CloseBold @click="onCloseFun"
            /></el-icon>
          </div>
        </div>
      </div>
    </template>
    <template #footer v-if="showFooter">
      <div class="dialog-footer">
        <el-space wrap>
          <el-image
            class="image-box"
            :src="getFileUrl('/images/cancel-button.png')"
            @click="onCancelFun"
          ></el-image>
          <el-image
            class="image-box"
            :src="getFileUrl('/images/confirm-button.png')"
            @click="onConfirmFun"
          ></el-image>
        </el-space>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="AogDialog">
import { CloseBold } from '@element-plus/icons-vue'
import { getFileUrl } from '@/utils/fileUrl'
import { SYSTEM_EL_ID } from '@/constants'
import { $adapter_width_unit } from '@/utils/viewAdapterPlugin'

const visible = defineModel<boolean>('visible')

const emit = defineEmits(['cancel', 'confirm'])

interface PropType {
  showFooter?: boolean
  title?: string
}

withDefaults(defineProps<PropType>(), { showFooter: true })

function onCancelFun() {
  visible.value = false
  emit('cancel')
}

function onCloseFun() {
  visible.value = false
  emit('cancel')
}

function onConfirmFun() {
  emit('confirm')
}
</script>

<style lang="scss" scoped>
.dialog-header {
  display: flex;
  font-size: 16px;
  align-items: center;
  justify-content: space-between;
  padding: var(--aog-app-popup-padding-1) var(--aog-app-popup-padding);
  border-bottom: 1px solid var(--aog-app-record-border-color);

  .action-box {
    .icon-box {
      cursor: pointer;
    }
  }
}

.dialog-content {
  padding: 0 var(--aog-app-popup-padding) var(--aog-app-popup-padding-1)
    var(--aog-app-popup-padding);
}

.dialog-footer {
  padding: var(--aog-app-popup-padding-1) var(--aog-app-popup-padding);
  .image-box {
    cursor: pointer;
    width: 60px;
    height: 32px;
  }
}
</style>
