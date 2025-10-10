<template>
  <div class="table-content-box">
    <div
      class="days-select-box"
      v-if="currenType.transactionType != TransactionTypeEnum.DUDT.value"
    >
      <div class="day-item-box">
        <div
          class="day-item"
          :class="currentDay == day.value ? 'select-day' : ''"
          v-for="day in currenType.pdateList"
          :key="day.value"
          @click="selectDay(day)"
        >
          {{ dayjs(day.value, 'YYYYMMDD').format('D') }}日
        </div>
      </div>
    </div>
    <div class="table-herder-actions-describe">
      <div class="table-herder-actions">
        <el-form :inline="true" :model="formData" label-suffix=":">
          <el-form-item
            label="买入触发价格"
            v-if="currenType.transactionType != TransactionTypeEnum.BMET.value"
          >
            <el-input-number
              v-model="formData.buyingThreshold"
              placeholder="买入触发价格"
              :controls="false"
              :value-on-clear="null"
              clearable
              :min="0"
              @blur="formSave"
              style="width: 100px"
            />
          </el-form-item>
          <el-form-item
            label="卖出触发价格"
            v-if="currenType.transactionType != TransactionTypeEnum.BMET.value"
          >
            <el-input-number
              v-model="formData.sellingThreshold"
              placeholder="卖出触发价格"
              :controls="false"
              :value-on-clear="null"
              clearable
              :min="0"
              style="width: 100px"
              @blur="formSave"
            />
          </el-form-item>
          <el-form-item
            label="申报时间"
            v-if="currenType.transactionType == TransactionTypeEnum.BMET.value"
          >
            <el-time-picker
              v-model="formData.declarationTime"
              placeholder="申报时间"
              value-format="HH:mm:ss"
              format="HH:mm:ss"
              :teleported="false"
              :disabled="isStart"
              @change="formSave"
              style="width: 120px"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="tradingUnitId"
              placeholder="请选择交易单元"
              style="width: 200px"
              @change="tradingUnitChange"
              :append-to="`#${SYSTEM_EL_ID}`"
            >
              <el-option
                :label="tradingUnit.tradeUnitName"
                :value="tradingUnit.tradeUnitId"
                v-for="tradingUnit in dataStore.tradingUnitData"
                :key="tradingUnit.tradeUnitId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <img
              class="batch-declaration-button"
              :src="getFileUrl('/images/button-batch-declaration.png')"
              @click="batchDeclaration"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="table-herder-describe">
        <div class="describe-box" v-for="item in describes" :key="item.title">
          <div class="img-box">
            <img :src="item.imgSrc" alt="" />
          </div>
          <div class="title-box">{{ item.title }}</div>
        </div>
      </div>
    </div>
    <div class="table-content-data-box">
      <el-table
        ref="tableRef"
        :data="tableData"
        style="width: 100%"
        :height="tableHeight"
        row-key="erhId"
        :row-class-name="tableRowClassName"
        :cell-class-name="tableCellClassName"
        :header-cell-class-name="tableHeaderCellClassName"
      >
        <el-table-column
          prop="code"
          label="时段"
          align="center"
          :width="$adapter_width(140)"
        />
        <el-table-column prop="electricity" label="电量(MWh)" align="center">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.electricity"
              placeholder="电量"
              :controls="false"
              value-on-clear=""
              clearable
              style="width: 100%"
              @blur="tableRowChange(scope.row, 'electricity')"
            />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="电价(元/MWh)" align="center">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.price"
              placeholder="电价"
              :controls="false"
              value-on-clear=""
              clearable
              style="width: 100%"
              @blur="tableRowChange(scope.row, 'price')"
            />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="申报方式" align="center">
          <template #default="scope">
            <el-select
              v-model="scope.row.type"
              placeholder="申报方式"
              style="width: 100%"
              :append-to="`#${SYSTEM_EL_ID}`"
              clearable
              @change="tableRowChange(scope.row, 'type')"
            >
              <el-option label="买入" :value="BuySellEnum.buy" />
              <el-option label="卖出" :value="BuySellEnum.sell" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="supply1" label="供应1" align="center" />
        <el-table-column prop="demand1" label="需求1" align="center" />
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          :width="$adapter_width(60)"
          v-if="currenType.transactionType != TransactionTypeEnum.BMET.value"
        >
          <template #default="scope">
            <div class="status-box">
              <!-- 正在检测 -->
              <div
                class="table-detection-box status-icon-box"
                v-if="
                  scope.row.status == TableStatusEnum.UM ||
                  scope.row.status == TableStatusEnum.PENDING
                "
              >
                <img :src="getFileUrl('/images/table-detection.png')" />
              </div>
              <!-- 已申报 -->
              <div
                class="table-declare-box status-icon-box"
                v-if="scope.row.status == TableStatusEnum.DEC"
              >
                <img :src="getFileUrl('/images/table-declare.png')" />
              </div>
              <!-- 已成交 -->
              <div
                class="table-deal-box status-icon-box"
                v-if="scope.row.status == TableStatusEnum.COM"
              >
                <img :src="getFileUrl('/images/table-deal.png')" />
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="planElectricity"
          label="计划电量(MWh)"
          align="center"
          width="140"
          v-if="currenType.transactionType != TransactionTypeEnum.BMET.value"
        >
          <template #default="scope">
            <el-input-number
              v-model="scope.row.planElectricity"
              placeholder="计划电量"
              :controls="false"
              value-on-clear=""
              clearable
              style="width: 100%"
              @blur="tableRowChange(scope.row, 'planElectricity')"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="remainElectricity"
          label="剩余电量(MWh)"
          align="center"
          v-if="currenType.transactionType != TransactionTypeEnum.BMET.value"
        /> -->
        <el-table-column
          prop="result"
          label="交易结果"
          show-overflow-tooltip
          align="left"
          v-if="currenType.transactionType != TransactionTypeEnum.BMET.value"
        >
          <template #default="scope">
            <!-- 申报 -->
            <!-- <div class="result-table-column-box"> -->
            <template
              v-if="
                scope.row.status == TableStatusEnum.DEC ||
                scope.row.status == TableStatusEnum.ERROR
              "
              >{{ scope.row.transactionResult }}</template
            >
            <template v-else> {{ scope.row.dealResult }}</template>
            <!-- </div> -->
          </template>
        </el-table-column>
      </el-table>
      <batch-filling
        v-model:visible="batchFillVisible"
        :currenType="currenType"
        :currentDay="currentDay"
      />
    </div>
  </div>
</template>

<script setup lang="ts" name="TableContent">
import { getFileUrl } from '@/utils/fileUrl'
import { computed, ref, watch } from 'vue'
import { SYSTEM_EL_ID } from '@/constants'
import BatchFilling from './BatchFilling.vue'
import {
  ActionType,
  TableActionEnum,
  TransactionTypeEnum,
  BuySellEnum,
  TableStatusEnum,
} from '@/types/enum'
import dayjs from 'dayjs'
import { sendMessage } from '@/utils/chomeMessage'
import { useSystemStore, useDataStore } from '@/store'
import { cloneDeep, isEqual } from 'lodash-es'
import { $adapter_width_unit, $adapter_width } from '@/utils/viewAdapterPlugin'

interface PropType {
  currenType: any
  isStart: boolean
}

const systemStore = useSystemStore()
const dataStore = useDataStore()

const tableRef = ref<any>(null)

const batchFillVisible = ref(false)

const props = withDefaults(defineProps<PropType>(), {})

const currentDay = ref('')

const tradingUnitId = ref('')

watch(
  () => props.currenType,
  (newVal, oldVal) => {
    if (newVal) {
      if (oldVal && newVal.seqId != oldVal.seqId) {
        tradingUnitId.value = dataStore.tradingUnitData[0]?.tradeUnitId || ''
        if (newVal.pdateList && newVal.pdateList.length > 0) {
          currentDay.value = newVal.pdateList[0].value
        } else {
          currentDay.value = newVal.aogDate
        }
      } else {
        tradingUnitId.value =
          tradingUnitId.value || dataStore.tradingUnitData[0]?.tradeUnitId || ''

        if (!currentDay.value) {
          if (newVal.pdateList && newVal.pdateList.length > 0) {
            currentDay.value = newVal.pdateList[0].value
          } else {
            currentDay.value = newVal.aogDate
          }
        }
      }

      getTableData()
    }
  },
  {
    immediate: true,
  }
)

watch(
  () => dataStore.demandSupplyBalanceList,
  (data) => {
    setDemandSupplyData(data)
  }
)

watch(
  () => systemStore.updateList,
  () => {
    getTableData()
  }
)

const formData = ref<{
  buyingThreshold?: number
  sellingThreshold?: number
  declarationTime?: ''
}>({
  // 买入触发价格
  buyingThreshold: undefined,
  // 卖出触发价格
  sellingThreshold: undefined,
  declarationTime: '',
})

const tableData = ref<any[]>([])

function selectDay(data: any) {
  currentDay.value = data.value
  tradingUnitId.value =
    tradingUnitId.value || dataStore.tradingUnitData[0]?.tradeUnitId || ''
  // 重新获取数据
  getTableData()
}

function tradingUnitChange() {
  getTableData()
}

function getTableData() {
  sendMessage({
    type: ActionType.GET_TABLE_FORM_DATA,
    action: TableActionEnum.current,
    data: {
      seqId: props.currenType.seqId,
      date: currentDay.value,
      tradingUnitId: tradingUnitId.value,
      tabId: systemStore.tabId,
    },
  }).then((res) => {
    // 获取请求数据

    if (res && res.success) {
      tableData.value = res.data.tableData

      const _formData = res.data.formData ? JSON.parse(res.data.formData) : {}
      if (props.currenType.transactionType == TransactionTypeEnum.BMET.value) {
        formData.value = {
          declarationTime: _formData.declarationTime || '',
        }
      } else {
        formData.value = {
          buyingThreshold: _formData?.buyingThreshold,
          sellingThreshold: _formData?.sellingThreshold,
        }
      }
      if (res.data.demandSupplyData) {
        setDemandSupplyData(res.data.demandSupplyData)
      }
    }
  })
}

function setDemandSupplyData(data: any) {
  const _tableData = cloneDeep(tableData.value)
  _tableData.forEach((item: any) => {
    const demandSupplyData = data.find(
      (dataItem: any) => dataItem.code == item.code
    )
    if (demandSupplyData) {
      item.supply1 = demandSupplyData.supply1_price
      item.demand1 = demandSupplyData.demand1_price
    }
  })
  //  如果数据没有变化，则不更新
  if (isEqual(_tableData, tableData.value)) {
    return
  }

  tableData.value = _tableData
}

const tableHeight = computed(() => {
  if (props.currenType.transactionType == TransactionTypeEnum.DUDT.value) {
    return `calc(var(--aog-app-min-height) - var(--aog-app-header-height) - ${$adapter_width_unit(180)})`
  } else {
    return `calc(var(--aog-app-min-height) - var(--aog-app-header-height) - ${$adapter_width_unit(236)})`
  }
})

const describes = [
  {
    imgSrc: getFileUrl('/images/describe-detection.png'),
    title: '监测中',
  },
  {
    imgSrc: getFileUrl('/images/describe-declare.png'),
    title: '申报',
  },
  {
    imgSrc: getFileUrl('/images/describe-deal.png'),
    title: '成交',
  },
]

function tableRowClassName({ row }: any) {
  if (row.type == '1') {
    return 'buy-row'
  } else if (row.type == '2') {
    return 'sell-row'
  }
  return 'default-row'
}

function tableCellClassName({ columnIndex }: any) {
  if (columnIndex === 0) {
    return 'cell-time'
  }
  return handleCellClassName(columnIndex)
}

function tableHeaderCellClassName({ columnIndex }: any) {
  if (columnIndex === 0) {
    return 'header-cell-time'
  }
  return handleCellClassName(columnIndex)
}

function handleCellClassName(columnIndex: any) {
  if (columnIndex == 4) {
    return 'cell-supply1 border-right'
  }

  if (columnIndex == 5) {
    if (props.currenType.transactionType != TransactionTypeEnum.BMET.value) {
      return 'cell-demand1 border-right'
    }
    return 'cell-demand1'
  }

  if (columnIndex < 8) {
    return 'border-right'
  }
}

function formSave() {
  let data = null
  if (props.currenType.transactionType == TransactionTypeEnum.BMET.value) {
    data = {
      declarationTime: formData.value.declarationTime,
    }
  } else {
    data = {
      buyingThreshold: formData.value.buyingThreshold,
      sellingThreshold: formData.value.sellingThreshold,
    }
  }

  sendMessage({
    type: ActionType.SAVE_TABLE_FORM_DATA,
    data: {
      seqId: props.currenType.seqId,
      value: JSON.stringify(data),
      tabId: systemStore.tabId,
    },
  }).catch(() => {})
}

/**
 * 保存表格数据
 * @param row
 */
function tableRowChange(row: any, key: string) {
  sendMessage({
    type: ActionType.SAVE_TABLE_DATA_BY_KEY,
    data: {
      erhId: row.erhId,
      value: row[key],
      key,
    },
  }).catch(() => {})
}

function batchDeclaration() {
  batchFillVisible.value = true
}

/**
 * 获取申报时间
 */
function getDeclarationTime() {
  return formData.value.declarationTime
}

defineExpose({
  getDeclarationTime,
  getTableData,
})
</script>

<style lang="scss" scoped>
.table-content-box {
  width: 100%;
  height: 100%;
  padding-top: var(--aog-app-popup-padding);
  display: flex;
  flex-flow: column;

  .table-content-data-box,
  .days-select-box,
  .table-herder-actions-describe {
    padding: 0 var(--aog-app-popup-padding) var(--aog-app-popup-padding)
      var(--aog-app-popup-padding);
  }

  .days-select-box {
    .day-item-box {
      background-color: var(--aog-app-record-border-color);

      border-radius: 10px;
      display: flex;
      .day-item {
        height: 36px;
        line-height: 36px;
        margin-left: 30px;
        font-weight: 500;
        font-size: var(--aog-app-base-title-font-size);
        cursor: pointer;
        transition: all 0.3s;
      }
      .select-day {
        color: var(--aog-el-color-primary);
        position: relative;

        &::before {
          position: absolute;
          content: '';
          width: 100%;
          height: 2px;
          background-color: var(--aog-el-color-primary);
          bottom: 0;
        }
      }
    }
  }
  .table-herder-actions-describe {
    display: flex;
    align-items: center;

    .table-herder-actions {
      flex: 1;

      ::v-deep(.aog-el-form-item) {
        margin-bottom: 0;
      }
      .batch-declaration-button {
        cursor: pointer;
        width: 76px;
        height: 32px;
      }
    }
    .table-herder-describe {
      display: flex;
      align-items: center;
      .describe-box {
        display: flex;
        align-items: center;
        margin-left: 20px;

        .img-box {
          display: flex;
          align-items: center;
          img {
            width: 14px;
            height: 14px;
          }
        }

        .title-box {
          margin-left: 6px;
          color: var(--aog-app-base-title-font-color);
        }
      }
    }
  }
  .table-content-data-box {
    flex: 1;
    --aog-el-bg-color: var(--aog-app-table-content-bg-color);
    --aog-el-fill-color-blank: var(--aog-app-table-content-bg-color);
    --aog-el-table-border-color: var(--aog-app-table-content-border-color);
    --aog-el-table-border: var(--aog-app-table-content-border-color);

    .status-box {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .status-icon-box {
      width: 20px;
      height: 20px;
    }

    .table-detection-box {
      animation: spin 2s linear infinite;
    }

    // .result-table-column-box {
    //   font-size: 12px;
    //   font-weight: 300;
    //   line-height: 14px;
    // }

    ::v-deep(.aog-el-table) {
      border-radius: 10px;
      border: 1px solid var(--aog-app-table-content-border-color);
    }
    ::v-deep(.aog-el-table__inner-wrapper::before) {
      height: 0;
    }
    ::v-deep(.aog-el-input__inner) {
      font-weight: 500;
    }
    ::v-deep(.buy-row) {
      color: var(--aog-app-base-buy-color);
      --aog-el-text-color-regular: var(--aog-app-base-buy-color);
      --aog-el-fill-color-blank: var(--aog-app-input-bg-color);
      font-weight: 500;
    }
    ::v-deep(.sell-row) {
      color: var(--aog-app-base-sell-color);
      --aog-el-text-color-regular: var(--aog-app-base-sell-color);
      --aog-el-fill-color-blank: var(--aog-app-input-bg-color);
      font-weight: 500;
    }
    ::v-deep(.default-row) {
      --aog-el-fill-color-blank: var(--aog-app-input-bg-color);
      font-weight: 500;
    }

    ::v-deep(.cell-time) {
      background-color: var(--aog-el-bg-color-overlay);
      font-weight: 500;
      color: var(--aog-app-base-font-color);
    }

    ::v-deep(.header-cell-time) {
      border-top-right-radius: 10px;
      background-color: var(--aog-el-bg-color-overlay);
    }

    ::v-deep(.cell-supply1) {
      background-color: var(--aog-app-base-supply-bg-color);
      color: var(--aog-app-base-supply-font-color);
    }

    ::v-deep(.cell-demand1) {
      background-color: var(--aog-app-base-demand-bg-color);
      color: var(--aog-app-base-demand-font-color);
    }

    ::v-deep(.border-right) {
      border-right: 1px solid var(--aog-app-table-content-border-color);
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
