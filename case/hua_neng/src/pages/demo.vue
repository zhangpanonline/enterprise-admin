<!--
 * @Author: qiru
 * @Date： 2025-06-10 09:53:51
 * @Description: 我的页面
 -->
<route lang="json">
{
  "style": {
    "navigationBarTitleText": "测试",
    "navigationBarBackgroundColor": "#ebebeb"
  },
  "name": "demo"
}
</route>
<template>
  <view class="content min-h-[100vh]">
    <wd-button @click="onTap">123</wd-button>
  </view>
</template>

<script setup lang="ts">
import { useUpload } from 'wot-design-uni';
const { startUpload, abort, chooseFile, UPLOAD_STATUS } = useUpload();
import { postUploadExcelApi } from '@/apis/home';
import { useUserStore } from '@/store';
const token = useUserStore().token;

async function onTap() {
  const files = await chooseFile({
    accept: 'file',
    multiple: false,
    maxCount: 1,
    sourceType: ['album'],
    extension: ['.xls', '.xlsx'],
  });
  const file = {
    uid: Date.now(),
    name: 'file',
    url: files[0].path,
    size: files[0].size,
    type: 'file',
  };
  startUpload(file, {
    action: import.meta.env.VITE_SERVER_BASEURL + '/power/report/app/fileParse',
    header: {
      Authorization: `Bearer ${token}`,
    },
    onSuccess(res) {
      console.log('上传成功', JSON.parse(res.data));
    },
    onError(err) {
      console.log('上传失败', err);
    },
  });
}
</script>
