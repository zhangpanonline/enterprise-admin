<template>
  <div class="popup-box">
    <el-dialog
      v-model="visible"
      :modal="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :show-close="false"
      :lock-scroll="true"
      :draggable="true"
      v-loading="loading"
      element-loading-text="数据正在加载中..."
      top="calc((100vh - var(--aog-app-min-height)) / 2)"
    >
      <template #header>
        <Header @minimize="onMinimizeFun" @close="onCloseFun" />
      </template>
      <div class="content-box">
        <div class="loading-box" v-if="loading">
          <div class="loading-item">
            <div class="svg-box">
              <el-icon :size="30"><Loading /></el-icon>
            </div>
            <div class="text-box">数据正在加载中...</div>
          </div>
        </div>
        <Main v-else />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// import { ref } from "vue";
// findBuy5AndSell5
import { useSystemStore } from '@/store'
import { computed } from 'vue'
import Header from '@/views/layout/Header.vue'
import Main from '@/views/layout/Main.vue'
import { Loading } from '@element-plus/icons-vue'
import { sendMessageToContentScriptByMinimize, stopRun } from '@/utils/stop'

const systemStore = useSystemStore()

const loading = computed(() => systemStore.loading)

// const dataList = ref<any[]>([]);
// const lists = ref<any[]>([]);
const visible = computed({
  get: () => {
    return systemStore.activate
  },
  set: (val) => {
    systemStore.setActivate(val)
  },
})

function onMinimizeFun() {
  close()
  sendMessageToContentScriptByMinimize()
}
function onCloseFun() {
  // 停止所有实时监测 然后推出插件
  close()
  stopRun()
}

function close() {
  visible.value = false
}
</script>

<style lang="scss" scoped>
.popup-box {
  ::v-deep(.aog-el-dialog) {
    padding: 0;
    border-radius: var(--aog-app-popup-border-radius);
    width: var(--aog-app-min-width);
    margin: var(--aog-el-dialog-margin-top) auto;
  }

  ::v-deep(.aog-el-dialog__header) {
    padding-bottom: 0;
  }

  .content-box {
    .loading-box {
      height: calc(var(--aog-app-min-height) - var(--aog-app-header-height));
      width: 100%;
      display: flex;
      align-content: center;
      justify-content: center;
      .loading-item {
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        .text-box {
          margin-top: 10px;
          font-size: 16px;
        }
        .svg-box {
          animation: spin 2s linear infinite; /* 持续旋转动画 */
        }
      }
    }
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
