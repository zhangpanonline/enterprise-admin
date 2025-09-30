<template>
  <aog-dialog
    ref="aogDialogRef"
    title="批量设置"
    v-model:visible="visible"
    :width="$adapter_width_unit(500)"
    @confirm="onConfirmFun"
    @cancel="onCancelFun"
  >
    <div class="content-box">
      <el-form
        ref="formRef"
        :model="formData"
        status-icon
        :rules="rules"
        label-width="auto"
        label-suffix=":"
      >
        <el-form-item label="申报方式" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio :value="BuySellEnum.buy">买入</el-radio>
            <el-radio :value="BuySellEnum.sell">卖出</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="申报时间" prop="times">
          <el-select
            class="select-time"
            v-model="formData.times"
            placeholder="请选择时间"
            multiple
            style="width: 100%"
            :append-to="`#${SYSTEM_EL_ID}`"
          >
            <el-option
              v-for="item in 24"
              :key="item"
              :label="`H_${(item - 1).toString().padStart(2, '0')}`"
              :value="`H_${(item - 1).toString().padStart(2, '0')}`"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申报电量" prop="electricity">
          <el-input-number
            v-model.number="formData.electricity"
            :controls="false"
            placeholder="请输入申报电量(MWh)"
            value-on-clear=""
            clearable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="申报电价" prop="price">
          <el-input-number
            v-model.number="formData.price"
            :controls="false"
            placeholder="请输入申报电价(元/MWh)"
            value-on-clear=""
            clearable
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
    </div>
  </aog-dialog>
</template>

<script setup lang="ts">
import AogDialog from '@/components/AogDialog/index.vue'
import { nextTick, ref, watch } from 'vue'
import { SYSTEM_EL_ID } from '@/constants'
import { ActionType, BuySellEnum } from '@/types/enum'
import { sendMessage } from '@/utils/chomeMessage'
import { $adapter_width_unit } from '@/utils/viewAdapterPlugin'

interface PropType {
  currenType: any
  currentDay: string
}

const props = defineProps<PropType>()

const formRef = ref()
const visible = defineModel<boolean>('visible')

const formData = ref({
  type: BuySellEnum.buy,
  times: [],
  electricity: undefined,
  price: undefined,
})

watch(
  () => visible.value,
  (val) => {
    if (val) {
      formData.value = {
        type: '1',
        times: [],
        electricity: undefined,
        price: undefined,
      }
      nextTick(() => {
        formRef.value?.resetFields()
      })
    }
  }
)

const rules = {
  type: [{ required: true, message: '请选择申报方式', trigger: 'change' }],
  times: [{ required: true, message: '请选择申报时间', trigger: 'change' }],
  electricity: [
    { required: true, message: '请输入申报电量(MWh)', trigger: 'change' },
  ],
  price: [
    { required: true, message: '请输入申报电价(元/MWh)', trigger: 'change' },
  ],
}

async function onConfirmFun() {
  if (!formRef.value) return
  formRef.value.validate((valid: any) => {
    if (valid) {
      sendMessage({
        type: ActionType.BATCH_FILLING,
        data: {
          formData: formData.value,
          seqId: props.currenType.seqId,
          date: props.currentDay,
        },
      }).then(() => {
        visible.value = false
      })
    }
  })
}

function onCancelFun() {
  // console.log('取消')
}
</script>

<style lang="scss" scoped>
.select-time {
  --aog-el-color-info: var(--aog-app-base-font-color);
}
</style>
