<template>
  <aog-dialog
    ref="aogDialogRef"
    title="市场信息监视"
    v-model:visible="visible"
    width="calc(var(--aog-app-min-width) * 0.9)"
    top="8vh"
    :showFooter="false"
    @confirm="onConfirmFun"
    @cancel="onCancelFun"
  >
    <div class="mim-content-box">
      <el-scrollbar height="100%">
        <div class="mim-item" v-for="item in dataList" :key="item.title">
          <div class="mim-item-title">
            {{ item.title }}
          </div>
          <div class="mim-item-content-box" v-for="i in 2" :key="i">
            <div class="content-data-item-title content-data-item">
              <div></div>
              <div class="supply1-item">供应1</div>
              <div class="demand1-item">需求1</div>
            </div>
            <div class="content-data-item" v-for="j in 12" :key="i + j">
              <div class="title-item">
                H_{{ ((i - 1) * 12 + j - 1).toString().padStart(2, '0') }}
              </div>
              <div class="supply1-item">
                {{
                  getSupply1Data(
                    item,
                    ((i - 1) * 12 + j - 1).toString().padStart(2, '0')
                  )
                }}
              </div>
              <div class="demand1-item">
                {{
                  getDemand1Data(
                    item,
                    ((i - 1) * 12 + j - 1).toString().padStart(2, '0')
                  )
                }}
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </aog-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AogDialog from '@/components/AogDialog/index.vue'
import dayjs from 'dayjs'
import { sendMessage } from '@/utils/chomeMessage'
import { ActionType, TableActionEnum, TableNameEnum } from '@/types/enum'
import { useDataStore } from '@/store'

const dataStore = useDataStore()
const visible = defineModel<boolean>('visible')
interface PropType {
  currenType: any
}
const props = defineProps<PropType>()

watch(
  () => dataStore.demandSupplyBalanceList,
  () => {
    getDemandSupplyBalanceData()
  }
)

watch(
  () => visible.value,
  (val) => {
    if (val) {
      getData()
    }
  }
)

const dataList = ref<any[]>([])
const dataItem = ref<any>({})
function getData() {
  if (props.currenType.pdateList && props.currenType.pdateList.length > 0) {
    dataList.value = props.currenType.pdateList.map((item: any) => {
      return {
        title: dayjs(item.value, 'YYYYMMDD').format('MM月DD日'),
        date: item.value,
      }
    })
  }
  getDemandSupplyBalanceData()
}

function getDemandSupplyBalanceData() {
  sendMessage({
    type: ActionType.GET_TABLE_DATA,
    action: TableActionEnum.currentSeqId,
    table: TableNameEnum.demand_supply_balance,
    data: {
      seqId: props.currenType.seqId,
    },
  }).then((res) => {
    if (res.success) {
      const _map: any = {}

      res.data.forEach((item: any) => {
        if (!_map[item.date]) _map[item.date] = {}
        _map[item.date][item.hour] = item
      })
      dataItem.value = _map
    }
  })
}

function getSupply1Data(item: any, hour: string) {
  if (!item) return ' '
  if (!dataItem.value[item.date]) return ' '
  if (!dataItem.value[item.date][`H_${hour}`]) return ' '

  return dataItem.value[item.date][`H_${hour}`].supply1_price || ' '
}

function getDemand1Data(item: any, hour: string) {
  if (!item) return ' '
  if (!dataItem.value[item.date]) return ' '
  if (!dataItem.value[item.date][`H_${hour}`]) return ' '

  return dataItem.value[item.date][`H_${hour}`].demand1_price || ' '
}

function onConfirmFun() {
  console.log('确认')
}

function onCancelFun() {
  console.log('取消')
}
</script>

<style lang="scss" scoped>
.mim-content-box {
  width: 100%;
  height: calc(var(--aog-app-min-height) * 0.8);

  .mim-item {
    margin-bottom: 15px;
    .mim-item-title {
      background-image: var(--aog-app-image-mim-title-bg);
      background-size: auto;
      background-repeat: no-repeat;
      font-size: var(--aog-app-base-title-font-size);
      padding: 5px 10px;
    }
    .mim-item-content-box {
      display: grid;
      grid-template-columns: repeat(13, 1fr);
      gap: 1px;

      .content-data-item {
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: flex-end;

        .title-item,
        .supply1-item,
        .demand1-item {
          text-align: center;
          width: 100%;
          padding: 5px 0;
        }

        .supply1-item,
        .demand1-item {
          height: 31px;
        }

        .title-item {
          font-weight: 200;
          color: var(--aog-app-base-font-color);
          padding: 4px 0;
        }
        .supply1-item {
          margin: 1px 0;
          color: var(--aog-app-base-supply-font-color);
          background-color: var(--aog-app-base-supply-bg-color);
        }

        .demand1-item {
          color: var(--aog-app-base-demand-font-color);
          background-color: var(--aog-app-base-demand-bg-color);
        }
      }

      .content-data-item-title {
        .supply1-item,
        .demand1-item {
          color: var(--aog-app-base-font-color);
        }
      }
    }
  }
}
</style>
