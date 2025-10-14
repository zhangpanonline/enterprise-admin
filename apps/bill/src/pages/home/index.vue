<!-- 使用 type="home" 属性设置首页 -->
<route type="home" lang="json">
{
  "layout": "tabbar",
  "style": { "navigationBarTitleText": "首页" },
  "name": "home"
}
</route>

<template>
  <view class="page px-5 flex flex-col justify-center gap-10">
    <wd-form :model="form">
      <wd-input
        label-width="60px"
        label="金额"
        prop="amount"
        v-model="form.amount"
        type="digit"
        placeholder="请输入金额"
      >
        <template #suffix>¥</template>
      </wd-input>
      <wd-calendar v-model="form.date" label-width="60px" label="日期选择" />
      <wd-form-item label="分类" label-width="60px">
        <uni-data-picker
          :localdata="category"
          :map="{ text: 'name', value: 'id', children: 'category_level2' }"
          :inputBorder="false"
          popup-title="请选择班级"
          v-model="form.category_id"
        ></uni-data-picker>
      </wd-form-item>
    </wd-form>
    <wd-button type="primary" size="large" @click="handleSubmit" block
      >提交</wd-button
    >
  </view>
</template>

<script setup lang="ts">
import {
  getCategoryTreeApi,
  createBillApi,
  type Bill,
  CategoryTree,
} from '@/apis/index';
import { onShow } from '@dcloudio/uni-app';
import { useNotify } from 'wot-design-uni';
import uniDataPicker from '@/components/uni-data-picker/uni-data-picker.vue';

const category = ref([]);
const form = reactive({
  date: new Date(),
  amount: null,
  category_id: '4d774d11-e121-4d05-a4b4-447c1ce9bf67',
});

onShow(getCategoryTree)
async function getCategoryTree() {
  category.value = await getCategoryTreeApi();
}

const { showNotify } = useNotify();
const handleSubmit = async () => {
  const date = new Date(form.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  await createBillApi({ ...form, date: `${year}-${month}-${day}` });
  form.amount = null;
  showNotify({ type: 'success', message: '操作成功！', background: '#07c160', duration: 1500 });
};
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
