<route lang="json">
{
  "layout": "tabbar",
  "style": { "navigationBarTitleText": "列表" },
  "name": "list"
}
</route>
<template>
  <view>
    <wd-cell-group
      v-for="item in list"
      :key="item.month"
      :title="item.month"
      :value="item.month_total + ' ¥'"
      border
    >
      <wd-collapse v-model="active[item.month]" accordion>
        <wd-collapse-item v-for="v in item.days" :key="v.date" :name="v.date">
          <template #title>
            <view class="flex justify-between items-center">
              <text>{{ v.date }}</text>
              <text>{{ v.total }} ¥</text>
            </view>
          </template>
          <wd-table :data="v.list" :showHeader="false">
            <wd-table-col prop="amount" label="金额">
              <template #value="{ row }"> {{ row.amount }} ¥ </template>
            </wd-table-col>
            <wd-table-col
              prop="category_level2_name"
              label="二级分类"
            ></wd-table-col>
            <wd-table-col
              prop="category_level1_name"
              label="一级分类"
            ></wd-table-col>
            <wd-table-col prop="id" label="操作">
              <template #value="{ row }">
                <wd-button type="error" size="small" @click="onDelete(row)"
                  >删除</wd-button
                >
              </template>
            </wd-table-col>
          </wd-table>
        </wd-collapse-item>
      </wd-collapse>
    </wd-cell-group>
  </view>
</template>

<script setup lang="ts">
import { getBillListApi, deleteBillApi, type Bill } from '@/apis/index';
import { useMessage, useNotify } from 'wot-design-uni';
const message = useMessage();

const active = reactive({});

const list = ref([]);

getBillList()
async function getBillList() {
  list.value = await getBillListApi();
  list.value.forEach((v) => {
    active[v.month] = v.days[0].date;
  });
}

const { showNotify } = useNotify();
const onDelete = (row: Bill) => {
  message
    .confirm({
      msg: '是否删除？',
      title: '提示',
    })
    .then(async () => {
      await deleteBillApi(row.id);
      getBillList();
      showNotify({
        type: 'success',
        message: '操作成功！',
        background: '#07c160',
        duration: 1500,
      });
    });
};
</script>

<style lang="scss" scoped>
:deep(.wd-table__content) {
  width: 100% !important;
  display: flex !important;
  justify-content: space-between !important;
  .wd-table-col {
    width: inherit !important;
    .wd-table__cell {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
