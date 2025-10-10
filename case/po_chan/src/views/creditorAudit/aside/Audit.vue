<template>
  <div class="box">
    <header class="box_title">申报金额</header>
    <div class="box_content">
      <ul class="box_content_list">
        <li>
          <span class="label">申报金额总额(元)</span>
          <span class="number">{{ formatCNY(info.total) }}</span>
        </li>
        <li>
          <span class="label">认定金额总额(元)</span>
          <span class="number">{{ formatCNY(info.confirmTotal) }}</span>
        </li>
        <li>
          <span class="label">暂缓金额(元)</span>
          <span class="number">{{ formatCNY(info.respiteTotal) }}</span>
        </li>
        <li>
          <span class="label">不予认定金额(元)</span>
          <span class="number">{{ formatCNY(info.noConfirmTotal) }}</span>
        </li>
      </ul>
      <p v-if="creditor.canReviewer" :class="[ [7, 2, 9].includes(Number(creditor.status)) ? 'box_content_btn--active' : 'box_content_btn--disabled', 'box_content_btn' ]" @click="onAudit">审查认定</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      required: true,
    },
    creditor: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { formatCNY } = useFormatMoney()
    return { formatCNY }
  },
  methods: {
    onAudit() {
      if ([7, 2, 9].includes(Number(this.creditor.status))) {
        this.$emit('ok')
      } else {
        ElMessage.warning({ message: '请通过形查后再进行审查认定操作！' })
      }
    },
  },
}
</script>

<style scoped>
.box {
  height: 100%;
  overflow-y: auto;
  font-size: 14px;
}
.box_title {
  color: #999;
  padding-bottom: 1.5em;
}
.box_content {
  border: 1px solid #ededed88;
  box-shadow: 0 0 5px #ededed;
  border-radius: 6px;
}
.box_content_list {
  border-bottom: 1px solid #ededed88;
  padding: 12px 20px;
}
.box_content_list li {
  display: flex;
  justify-content: space-between;
  line-height: 2.5em;
}
.box_content_list li .label {
  color: #999;
}
.box_content_list li .number {
  color: #333;
}
.box_content_btn {
  height: 3.5em;
  line-height: 3.5em;
  text-align: center;
  color: #a69480;
}
.box_content_btn--active {
  background-color: #a69480;
  color: #fff;
  cursor: pointer;
}
.box_content_btn--active:hover {
  font-weight: bolder;
  background-color: #b8a999;
}
.box_content_btn--disabled {
  background: #ededed44;
  cursor: not-allowed;
}
</style>
