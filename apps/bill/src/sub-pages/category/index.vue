<route lang="json">
{
  "style": { "navigationBarTitleText": "" },
  "name": "Detail"
}
</route>
<template>
  <view class="page px-5 flex flex-col justify-center gap-10">
    <wd-form :model="form">
        <wd-form-item v-if="!isOneLevel" label="一级分类" label-width="60px">
          <uni-data-picker
            :localdata="category"
            :map="{ text: 'name', value: 'id' }"
            :inputBorder="false"
            popup-title="请选择一级分类"
            v-model="form.level1_id"
          ></uni-data-picker>
        </wd-form-item>
      <wd-input
        label-width="60px"
        label="分类名称"
        prop="amount"
        v-model="form.name"
        placeholder="请输入"
      >
      </wd-input>
    </wd-form>
    <wd-button type="primary" size="large" @click="handleSubmit" block
      >提交</wd-button
    >
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useNotify } from 'wot-design-uni';
import {
  getCategoryTreeApi,
  createLevel1Api,
  createLevel2Api
} from '@/apis/index';

onLoad(async (options) => {
  uni.setNavigationBarTitle({ title: options.type === '1' ? '一级分类' : '二级分类' })
  isOneLevel.value = options.type === '1'
  category.value = (await getCategoryTreeApi()).map(({ id, name }) => ({ id, name }))
})

const isOneLevel = ref(false)
const category = ref([]);
const form = reactive({
    name: '',
    level1_id: null
})

const { showNotify } = useNotify();
const handleSubmit = async () => {
    await (isOneLevel.value ? createLevel1Api({ name: form.name }) : createLevel2Api(form))
    showNotify({ type: 'success', message: '操作成功！', background: '#07c160', duration: 1500 });
    uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.page {
  height: calc(100vh - 94px);
}
:deep(.input-value.input-value-border) {
  height: 24px !important;
  border: none !important;
  padding: 0 !important;
  .selected-area.placeholder {
    color: var(--wot-input-placeholder-color, #bfbfbf) !important;
    font-size: var(--wot-cell-value-fs, 14px) !important;
  }
}
</style>