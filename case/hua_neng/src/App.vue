<script setup lang="ts">
import { useUserStore } from '@/store';
onLaunch(() => {
  console.log('App Launch');
  uni.loadFontFace({
    global: true,
    family: 'TaoBaoMaiCaiTi',
    desc: {
      style: 'normal',
      weight: 'normal',
      variant: 'normal',
    },
    source:
      'url("' +
      import.meta.env.VITE_STATIC_URL +
      '/TaoBaoMaiCaiTi-Regular.woff")',
    success() {
      console.log(
        '字体文件加载成功',
        import.meta.env.VITE_STATIC_URL + '/TaoBaoMaiCaiTi-Regular.woff',
      );
    },
  });
});
onShow(() => {
  console.log('App Show');
  const userStore = useUserStore();
  console.log(userStore.token, 'APP.vue');
  if (!userStore.token) {
    uni.reLaunch({ url: '/sub-pages/login/index.vue' });
  }
});
onHide(() => {
  console.log('App Hide');
});
</script>
