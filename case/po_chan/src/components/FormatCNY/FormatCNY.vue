<template>
  <el-input v-model="data" v-bind="$attrs" placeholder="请输入金额（¥）" @focus="focus($event)" @blur="blur($event)">
    <template v-if="slots.prefix" #prefix >
      <slot name="prefix" ></slot>
    </template>
    <template v-if="slots.suffix" #suffix >
      <slot name="suffix" ></slot>
    </template>
    <template v-if="slots.prepend" #prepend >
      <slot name="prepend" ></slot>
    </template>
    <template v-if="slots.append" #append >
      <slot name="append" ></slot>
    </template>
  </el-input>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const { formatCNY } = useFormatMoney()
const data = ref(0)
const slots = useSlots()
watch(
  () => props.modelValue,
  newVal => {
    data.value = formatCNY(newVal)
  },
  {
    immediate: true,
  }
)
function focus(e) {
  let val = e.target.value
  if (val.startsWith('¥')) {
    val = val.slice(1).replaceAll(',', '')
  }
  data.value = /[^(0|\.)]/g.test(val) ? val : ''
}
function blur(e) {
  let val = e.target.value
  val = val.replace(/[a-z,A-Z]/g, '')
  if (val === null || val === undefined || val === '') {
    val = ''
  } else {
    val = Number.parseFloat(val)
  }
  emit('update:modelValue', val)
}
</script>
