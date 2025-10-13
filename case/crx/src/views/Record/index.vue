<template>
  <div class="record-box">
    <div class="record-header-box">
      <div class="record-header-left">交易申报记录</div>
    </div>
    <div class="record-content-box">
      <el-scrollbar height="100%">
        <div
          class="record-content-item"
          v-for="item in recordList"
          :key="item.id"
        >
          <template v-if="item.action_status">
            <!-- 点击开始 -->
            <div class="record-content-item-title">{{ item.dateTime }}</div>
            <div class="record-content-item-content">
              {{
                item.action_status == ControlPollingEnum.start ? '开始' : '停止'
              }}
              - {{ item.action_type_name }}
            </div>
          </template>
          <template v-if="item.result">
            <!-- 申报 -->
            <div class="record-content-item-title">{{ item.dateTime }}</div>
            <div class="record-content-item-content">
              {{ item.result }}
            </div>
          </template>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSystemStore } from '@/store'
import {
  ActionType,
  ControlPollingEnum,
  TableActionEnum,
  TableNameEnum,
  // TableStatusEnum,
} from '@/types/enum'
import { sendMessage } from '@/utils/chomeMessage'
import dayjs from 'dayjs'
import { ref, watch } from 'vue'
const systemStore = useSystemStore()
const recordList = ref<any[]>([])

watch(
  () => systemStore.updateList,
  () => {
    getTableData()
  },
  { immediate: true }
)

function getTableData() {
  sendMessage({
    type: ActionType.GET_TABLE_DATA,
    action: TableActionEnum.current,
    table: TableNameEnum.declaration_history,
    data: {
      date: dayjs().format('YYYY-MM-DD'),
    },
  }).then((res) => {
    if (res.success) {
      recordList.value = res.data
    }
  })
}
</script>

<style lang="scss" scoped>
.record-box {
  width: 100%;
  height: 100%;
  background-color: var(--aog-app-record-bg-color);
  border-top-right-radius: calc(var(--aog-app-popup-border-radius) / 2);
  border-top: 1px solid var(--aog-app-record-border-color);

  .record-header-box {
    height: var(--aog-app-record-header-height);
    border-bottom: 1px solid var(--aog-app-record-border-color);
    padding: 0 var(--aog-app-popup-padding);
    font-weight: 800;
    font-size: var(--aog-app-base-title-font-size);
    display: flex;
    align-items: center;
  }
  .record-content-box {
    padding: var(--aog-app-popup-padding) 10px var(--aog-app-popup-padding)
      var(--aog-app-popup-padding);
    height: calc(100% - var(--aog-app-record-header-height));
    .record-content-item {
      font-size: var(--aog-app-base-font-size);
      padding-bottom: var(--aog-app-popup-padding-1);
      .record-content-item-title {
        color: var(--aog-app-base-desc-font-color);
      }
      .record-content-item-content {
        color: var(--aog-app-base-title-font-color);
      }
    }
  }
}
</style>
