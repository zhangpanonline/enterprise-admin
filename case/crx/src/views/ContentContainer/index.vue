<template>
  <div class="content-container-box">
    <div class="content-container-header">
      <div class="content-container-header-title">
        <div class="content-container-name">交易窗口</div>
        <div class="select-info-box">
          <div
            class="select-box"
            :style="{
              flex:
                currenType.transactionType == TransactionTypeEnum.DUDT.value
                  ? undefined
                  : '1',
            }"
          >
            <el-dropdown
              @command="onCommandFun"
              placement="bottom-start"
              :teleported="false"
            >
              <span class="el-dropdown-link">
                {{ currenType.seqName }}
                <el-icon class="el-icon--right"> <CaretBottom /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in dataStore.typeList"
                    :key="item.seqId"
                    :command="item.seqId"
                    :data="item"
                  >
                    {{ item.seqName }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="info-box">
            <div class="info-title">已成交电量:</div>
            <div
              class="info-content"
              v-if="
                currenType.transactionType == TransactionTypeEnum.DUDT.value
              "
            >
              <span class="content-sub-title">{{ today_deal_qe.title }}</span>
              <span class="content-value">{{ today_deal_qe.value }}</span>
            </div>
            <template v-else>
              <div
                class="info-content"
                v-for="item in many_days_deal_qe"
                :key="item.title"
              >
                <span class="content-sub-title">{{ item.title }}</span>
                <span class="content-value">{{ item.value }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="actions-box">
        <el-space wrap>
          <div
            class="market-information-monitoring-button"
            v-if="currenType.transactionType != TransactionTypeEnum.DUDT.value"
          >
            <!-- 市场信息监视 -->
            <img
              @click="onMarketInfoMonitoringFun"
              :src="
                getFileUrl('/images/button-market-information-monitoring.png')
              "
            />
          </div>
          <div class="stop-start-button">
            <!-- 停止 -->
            <img
              @click="onStopFun"
              v-if="isStart"
              :src="getFileUrl('/images/button-stop.png')"
            />
            <!-- 开始 -->
            <img
              v-else
              @click="onStartFun"
              :src="getFileUrl('/images/button-start.png')"
            />
          </div>
        </el-space>
      </div>
    </div>
    <div class="content-container-main">
      <table-content
        ref="tableContentRef"
        :currenType="currenType"
        :isStart="isStart"
      />
    </div>
    <market-information-monitoring
      ref="marketInformationMonitoringRef"
      v-model:visible="marketInformationMonitoringVisible"
      :currenType="currenType"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { getFileUrl } from '@/utils/fileUrl'
import { CaretBottom } from '@element-plus/icons-vue'
import TableContent from './TableContent.vue'
import MarketInformationMonitoring from './MarketInformationMonitoring.vue'
import { useDataStore, useSystemStore } from '@/store'
import { ActionType, TransactionTypeEnum } from '@/types/enum'
import { sendMessage } from '@/utils/chomeMessage'
import { dayjs, ElMessage } from 'element-plus'

const dataStore = useDataStore()
const systemStore = useSystemStore()
const tableContentRef = ref()

const marketInformationMonitoringVisible = ref(false)

const today_deal_qe = ref({
  title: '今日',
  value: '',
})

const many_days_deal_qe = ref<any>([])

const currenType = ref<any>(
  dataStore.typeList.length > 0 ? dataStore.typeList[0] : ''
)

watch(
  () => currenType.value,
  (newValue) => {
    if (newValue) {
      handleDealQe()
      nextTick(() => {
        getIsStart()
      })
    }
  },
  {
    immediate: true,
  }
)

watch(
  () => dataStore.typeList,
  () => {
    currenType.value = dataStore.typeList.find(
      (item) => item.seqId === currenType.value.seqId
    )
    handleDealQe()
    getIsStart()
  }
)

watch(
  () => systemStore.updateList,
  () => {
    getIsStart()
  }
)

const isStart = ref(false)

function onCommandFun(command: string) {
  currenType.value = dataStore.typeList.find((item) => item.seqId === command)
}

function onStopFun() {
  sendMessage({
    type: ActionType.STOP_TYPE,
    data: {
      ...currenType.value,
    },
  }).then((res) => {
    isStart.value = false
    // 获取请求数据
    console.log('已停止', res)
  })
}

function onStartFun() {
  //  代购多日交易
  if (currenType.value.transactionType === TransactionTypeEnum.BMET.value) {
    const time = tableContentRef.value?.getDeclarationTime()
    if (!time) {
      ElMessage.error('请选择申报时间')
      return
    }
    const _dateTime = dayjs().format('YYYY-MM-DD') + ' ' + time
    //
    const dateTime = dayjs(_dateTime, 'YYYY-MM-DD HH:mm:ss')
    if (dayjs().isAfter(dateTime)) {
      ElMessage.error('请选择正确的申报时间')
      return
    }
  }

  sendMessage({
    type: ActionType.START_TYPE,
    data: {
      ...currenType.value,
    },
  }).then((res) => {
    // 获取请求数据
    isStart.value = true
    console.log('已启动', res)
  })
}

function onMarketInfoMonitoringFun() {
  marketInformationMonitoringVisible.value = true
}

function getIsStart() {
  sendMessage({
    type: ActionType.GET_START_TYPES,
  }).then((res) => {
    // 获取请求数据
    if (res.data && res.data.length > 0) {
      isStart.value = res.data.includes(currenType.value.seqId)
    } else {
      isStart.value = false
    }
  })
}

/**
 * 处理成交电量
 */
function handleDealQe() {
  if (currenType.value.transactionType == TransactionTypeEnum.DUDT.value) {
    today_deal_qe.value.value =
      currenType.value?.aogTradingElectricity?.toString() || '-'
    many_days_deal_qe.value = []
  } else {
    const list: any[] = []
    currenType.value.pdateList.forEach((item: any) => {
      list.push({
        value: item?.aogTradingElectricity?.toString() || '-',
        title: dayjs(item.value, 'YYYYMMDD').format('DD日'),
      })
    })
    many_days_deal_qe.value = list
    today_deal_qe.value.value = ''
  }
}

// const contentContainerHeaderBg = `url(${getFileUrl('/images/content-header-bg.png')})`
// const contentTitleBg = `url(${getFileUrl('/images/content-title-bg.png')})`
</script>

<style lang="scss" scoped>
.content-container-box {
  width: 100%;
  height: 100%;
  .content-container-header {
    width: 100%;
    background-color: var(--aog-app-base-bg-color-1);
    background-image: var(--aog-app-image-content-container-header-bg);
    background-repeat: no-repeat;
    background-size: cover;
    height: var(--aog-app-content-header-height);
    padding: 0 var(--aog-app-popup-padding);
    display: flex;
    align-items: center;
    border-radius: 10px 10px 0px 0px;
    border-bottom: 1px solid var(--aog-app-base-border-color);

    .content-container-header-title {
      height: 100%;
      flex: 1;
      display: flex;
      justify-content: center;
      flex-flow: column;
      position: relative;
      z-index: 2;
      &::before {
        content: '';
        position: absolute;
        height: 60px;
        width: 92px;
        right: 20px;
        bottom: 0;
        background-image: var(--aog-app-image-content-title-bg);
        background-repeat: no-repeat;
        background-size: cover;
        z-index: 1;
      }

      .content-container-name {
        font-weight: 500;
        color: var(--aog-app-base-title-font-color);
        z-index: 2;
      }
      .select-info-box {
        z-index: 2;
        width: 100%;
        display: flex;
        align-items: center;
        .select-box {
          max-width: 60%;
          display: flex;
          align-items: center;
          .el-dropdown-link {
            font-size: 18px;
            cursor: pointer;
            font-weight: 800;
            color: var(--aog-el-color-primary);
            display: flex;
            align-items: center;
          }
        }
        .info-box {
          margin-left: 20px;
          background: linear-gradient(
            90deg,
            rgba(51, 163, 255, 0) 0%,
            rgba(51, 163, 255, 0.15) 50%,
            rgba(51, 163, 255, 0) 100%
          );
          border-radius: 0px 0px 0px 0px;
          border: 1px solid;
          border-image: radial-gradient(
              circle,
              rgba(51, 163, 255, 0.5),
              rgba(51, 163, 255, 0)
            )
            1 1;

          display: flex;
          align-items: center;

          .info-title {
            margin-right: 10px;
          }

          .info-content {
            padding-right: 20px;
            display: flex;

            .content-sub-title {
              margin-right: 4px;
              color: var(--aog-app-base-title-font-color);
            }
            .content-value {
              color: var(--aog-app-base-font-color);
            }
          }
        }
      }
    }
    .actions-box {
      img {
        cursor: pointer;
        background: rgba(255, 255, 255, 0.1);
        box-shadow:
          -1px 3px 6px 0px rgba(0, 0, 0, 0.08),
          -3px 11px 11px 0px rgba(0, 0, 0, 0.07),
          -7px 24px 15px 0px rgba(0, 0, 0, 0.04),
          -13px 43px 18px 0px rgba(0, 0, 0, 0.01),
          -20px 68px 20px 0px rgba(0, 0, 0, 0);
        border-radius: 8px 8px 8px 8px;
        // border: 1px solid;
      }
      .market-information-monitoring-button {
        width: 154px;
        height: 40px;
        object-fit: cover;
        img {
          width: 154px;
          height: 40px;
        }
      }
      .stop-start-button {
        width: 90px;
        height: 40px;
        object-fit: cover;
        img {
          width: 90px;
          height: 40px;
        }
      }
    }
  }
  .content-container-main {
    width: 100%;
    height: calc(100% - var(--aog-app-content-header-height));
  }
}
</style>
