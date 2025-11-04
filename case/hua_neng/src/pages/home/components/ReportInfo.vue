<template>
  <view class="report-info rounded-[10px] position-relative p-[15px]">
    <!-- 填报信息 -->
    <view class="relative index-10">
      <view class="font-400 font-[18px] text-white font_tbmct mb-[15px]"
        >填报信息
        <view
          v-if="userStore.user.fillMethod === '0' && info?.status !== '-1'"
          @click="openCalenar()"
          class="h-[24px] top-0 bg_color2 rounded-l-[20px] position-absolute right-[-15px] text-primary px-[10px] leading-[24px] text-[14px] font-500 text-right"
          >选择相似日电量 <wd-icon name="arrow-right" size="14px"></wd-icon
        ></view>
      </view>
      <!-- 填报周期 -->
      <view
        class="flex justify-between items-center gap-[13px] whitespace-nowrap mb-[15px]"
      >
        <view class="h-[45px] flex flex-col justify-between">
          <text class="text-[14px] text-white">
            {{
              props.info.dateType === RunType.DAY
                ? props.info.dayDesc
                : dict[props.info.dateType]
            }}
          </text>
          <text class="text-[12px] text-white/70">填报周期</text>
        </view>
        <view class="bg-[#e9e9e9]/30 w-[1px] h-[36px]"></view>
        <view class="h-[45px] flex flex-col justify-between">
          <text class="text-[14px] text-white">{{
            getRunDay(info?.runDay)
          }}</text>
          <text class="text-[12px] text-white/70">运行日</text>
        </view>
        <view class="bg-[#e9e9e9]/30 w-[1px] h-[36px]"></view>
        <view class="h-[45px] flex flex-col justify-between">
          <text class="text-[14px] text-white">{{ info?.stopTime }}</text>
          <text class="text-[12px] text-white/70">填报截止时间</text>
        </view>
      </view>
      <!-- 24点分时电量 -->
      <view
        v-if="userStore.user.fillMethod === '1' && info?.status !== '-1'"
        class="pt-[15px] mb-[15px] border-t-[1px] border-t-solid border-[#e9e9e9]/30 z-10 position-relative"
      >
        <text class="text-[14px] font-800 text-white">24点分时电量</text>
        <text
          @click="openCalenar()"
          class="h-[24px] ml-[10px] leading-[24px] px-[8px] rounded-[6px] bg_color2 font-500 text-primary text-[14px] float-right"
          >相似日电量导入</text
        >
        <text
          @click="upload()"
          class="h-[24px] ml-[10px] leading-[24px] px-[8px] rounded-[6px] bg_color2 font-500 text-primary text-[14px] float-right"
          >本地导入</text
        >
      </view>
      <!-- 当前填报总电量 -->
      <view
        v-if="userStore.user.fillMethod === '1'"
        class="flex justify-between items-center w-full z-10 position-relative"
      >
        <view>
          <text class="text-[12px] font-500 text-white/70"
            >当前填报总电量：</text
          >
          <text class="text-[14px] font-800 text-white">{{ total24H }}</text>
        </view>
        <view class="text-[12px] font-500 text-white/80 leading-[20px]">
          单位：万度
        </view>
      </view>
      <!-- 按24小时填报 -->
      <swiper
        v-if="userStore.user.fillMethod === '1'"
        class="mt-[15px] h-[220px]"
        circular
        :indicator-dots="true"
        easing-function="linear"
        indicator-color="#FFFFFF80"
        skip-hidden-item-layout
        indicator-active-color="#FFFFFF"
      >
        <swiper-item
          class="grid grid-cols-3 gap-[10px] grid-rows-[repeat(4,40px)]"
        >
          <wd-input
            v-for="(v, i) in data2.list1"
            :key="i"
            v-model="v.value"
            placeholder-class="text-white/50! font-[15px] font-100"
            placeholder="请输入"
            type="digit"
            :disabled="info?.status === '-1'"
            @input="
              ($event) =>
                nextTick(() => (data2.list1[i]['value'] = toNum($event.value)))
            "
            :custom-class="
              [
                v.value ? 'bg-white/40!' : 'bg-white/30!',
                'position-relative!',
                'z-10!',
                'after:bg-transparent!',
                'color-primary!',
                'border-1',
                'border-solid',
                'border-[#DADADA]/40',
                'rounded-[8px]',
                'h-[40px]!',
                'pr-[5px]!',
                'py-[10px]!',
                'box-border!',
                'flex',
                'items-center',
              ].toString()
            "
            custom-input-class="text-[18px] font-800! text-white!"
          >
            <template #prefix>
              <text
                class="text-white font-500 text-[15px] border-1 border-r-solid border-[#dadada] px-[8px]"
                >{{ i + 1 }}</text
              >
            </template>
          </wd-input>
        </swiper-item>
        <swiper-item
          class="grid grid-cols-3 gap-[10px] grid-rows-[repeat(4,40px)]"
        >
          <wd-input
            v-for="(v, i) in data2.list2"
            :key="i"
            v-model="v.value"
            placeholder-class="text-white/50! font-[15px] font-100"
            placeholder="请输入"
            type="digit"
            :disabled="info?.status === '-1'"
            custom-class="bg-white/30! after:bg-transparent! color-primary! border-1 border-solid border-[#DADADA]/40 rounded-[8px] h-[40px]! pr-[5px]! py-[10px]! box-border! flex items-center"
            custom-input-class="text-[18px] font-800! text-white!"
            @input="
              ($event) =>
                nextTick(() => (data2.list2[i]['value'] = toNum($event.value)))
            "
          >
            <template #prefix>
              <text
                class="text-white font-500 text-[15px] border-1 border-r-solid border-[#dadada] px-[8px]"
                >{{ i + 13 }}</text
              >
            </template>
          </wd-input>
        </swiper-item>
      </swiper>
      <!-- 日填报 -->
      <view
        v-if="userStore.user.fillMethod === '0'"
        class="z-10 position-relative flex justify-between items-center box-border whitespace-nowrap bg-white/30 border-1 border-solid border-[rgba(218,218,218,0.4)] h-[66px] px-[10px] rounded-[8px] my-[15px]"
      >
        <text class="text-white text-[15px] font-500">填报电量</text>
        <wd-input
          v-model="data1"
          placeholder-class="text-white/60! font-100"
          placeholder="请输入电量"
          type="digit"
          :disabled="info?.status === '-1'"
          custom-class="bg-transparent! after:bg-transparent! color-primary! mx-[20px]"
          custom-input-class="text-[26px] font-800! text-white! text-shadow-[0_4px_8px_#1a6bee]!"
          @input="($event) => nextTick(() => (data1 = toNum($event.value)))"
        >
          <template v-if="info?.status === '1'" #suffix>
            <wd-icon name="edit-outline" size="16px" color="#fff"></wd-icon>
          </template>
        </wd-input>
        <text class="text-white/80 text-[15px] font-500 whitespace-nowrap"
          >万度</text
        >
      </view>
      <!-- 填报时间 -->
      <view
        v-if="info?.status !== '0'"
        class="flex justify-between items-center w-full mb-[15px]"
      >
        <text class="text-[12px] font-500 text-white/70">填报时间</text>
        <text class="text-[14px] font-800 text-white">{{
          info.reportTime || '-'
        }}</text>
      </view>
      <view
        v-if="info?.status !== '0'"
        class="flex justify-between items-center w-full"
      >
        <text class="text-[12px] font-500 text-white/70">填报人</text>
        <text class="text-[14px] font-800 text-white">{{
          reportUser || '-'
        }}</text>
      </view>
      <!-- 提交按钮 -->
      <wd-button
        v-if="userStore.user.fillMethod === '0' && info?.status !== '-1'"
        block
        size="large"
        :round="false"
        custom-class="mt-[15px] bg-white! text-primary! font-500! text-4!"
        @click="handleSubmit"
        >提交</wd-button
      >
      <view
        v-if="userStore.user.fillMethod === '1' && info?.status !== '-1'"
        class="flex gap-[10px] items-center mt-[15px]"
      >
        <wd-button
          plain
          size="large"
          custom-class="bg-transparent! font-500! text-4! text-white!"
          :round="false"
          @click="onreset()"
          >重置</wd-button
        >
        <wd-button
          plain
          size="large"
          :round="false"
          custom-class="bg-white! text-primary! font-500! text-4! flex-1!"
          @click="handleSubmit"
          >提交</wd-button
        >
      </view>
    </view>
  </view>
  <ExportCalenar
    ref="calenarRef"
    @confirm="data1 = $event"
    @confirm24="
      ($event) => {
        data2.list1 = $event.slice(0, 12).map((value) => ({ value }));
        data2.list2 = $event.slice(12, 24).map((value) => ({ value }));
      }
    "
  ></ExportCalenar>
  <wd-toast />
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { getPowerDetailApi, postAddPowerApi, dict } from '@/apis/home';
import { useToast } from 'wot-design-uni';
import { RunType, type Schema } from '@/apis/home';
import ExportCalenar from './ExportCalenar.vue';
import { useUserStore } from '@/store';
import { useUpload } from 'wot-design-uni';
const { startUpload, chooseFile } = useUpload();
defineOptions({
  options: {
    styleIsolation: 'shared',
  },
});

const props = defineProps<{ info: Schema }>();

onMounted(() => {
  nextTick(() => {
    props.info.reportId !== 'null' && getPowerDetail(props.info.reportId);
  });
});

// 根据 userStore.user.fillMethod 来确定是24时电量还是总电量，0是总电量，1是24时电量
const userStore = useUserStore();
const token = useUserStore().token;

const calenarRef = ref(null);

const reportUser = ref('');

const data1 = ref();
const srcData2 = {
  list1: [
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
  ],
  list2: [
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
  ],
};
const data2 = reactive({
  list1: [
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
  ],
  list2: [
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
    { value: null },
  ],
});
const total24H = computed(() => {
  const rate = 10000;
  const per12h = data2.list1.reduce((pre, cur) => pre + rate * cur.value, 0);
  const next12h = data2.list2.reduce((pre, cur) => pre + rate * cur.value, 0);
  return ((per12h + next12h) / rate).toFixed(4);
});

const router = useRouter();
const toast = useToast();
// 提交
async function handleSubmit() {
  const params = {
    settingId: props.info.settingId,
    deptId: userStore.user.deptId,
    runDate: props.info.runDay,
    fillUserId: userStore.user.userId,
  };
  if (userStore.user.fillMethod === '0') {
    if (!data1.value) {
      toast.warning('请输入电量');
      return;
    }
    const res = await postAddPowerApi({ ...params, totalPower: data1.value });
    if (res.code === 200) {
      toast.success('操作成功');
      setTimeout(() => {
        router.back();
      }, 500);
    }
  } else {
    if (
      data2.list1.some((item) => ['', undefined, null].includes(item.value)) ||
      data2.list2.some((item) => ['', undefined, null].includes(item.value))
    ) {
      toast.warning('请输入24小时电量');
      return;
    }
    const hours = {
      time01: data2.list1[0].value,
      time02: data2.list1[1].value,
      time03: data2.list1[2].value,
      time04: data2.list1[3].value,
      time05: data2.list1[4].value,
      time06: data2.list1[5].value,
      time07: data2.list1[6].value,
      time08: data2.list1[7].value,
      time09: data2.list1[8].value,
      time10: data2.list1[9].value,
      time11: data2.list1[10].value,
      time12: data2.list1[11].value,
      time13: data2.list2[0].value,
      time14: data2.list2[1].value,
      time15: data2.list2[2].value,
      time16: data2.list2[3].value,
      time17: data2.list2[4].value,
      time18: data2.list2[5].value,
      time19: data2.list2[6].value,
      time20: data2.list2[7].value,
      time21: data2.list2[8].value,
      time22: data2.list2[9].value,
      time23: data2.list2[10].value,
      time24: data2.list2[11].value,
    };
    const res = await postAddPowerApi({ ...params, ...hours });
    if (res.code === 200) {
      toast.success('操作成功');
      setTimeout(() => {
        router.back();
      }, 500);
    }
  }
}

function onreset() {
  data2.list1 = JSON.parse(JSON.stringify(srcData2.list1));
  data2.list2 = JSON.parse(JSON.stringify(srcData2.list2));
}

// 运行日
function getRunDay(str) {
  if (!str || str.length < 11) return str;
  const arr = str.replace(' 至 ', '-').split('-');
  return `${arr[1]}-${arr[2]}至${arr[4]}-${arr[5]}`;
}

// 打开日历弹框 type: 'week' | 'month'
async function openCalenar() {
  calenarRef.value.params.settingId = props.info.settingId;
  calenarRef.value.params.deptId = userStore.user.deptId;
  calenarRef.value.params.type = props.info.dateType;
  calenarRef.value.is24H = userStore.user.fillMethod === '1';
  calenarRef.value.calenarType = { WEEK: 'week', MONTH: 'month', DAY: 'day' }[
    props.info.dateType
  ];
  if (props.info.dateType === 'DAY' && userStore.user.fillMethod === '1') {
    calenarRef.value.nativeType = 'week';
  }
  calenarRef.value.visible = true;
  calenarRef.value.getSimilarPower(true);
}

// 获取详情
async function getPowerDetail(id) {
  const res = await getPowerDetailApi({ id });
  if (res.code === 200) {
    reportUser.value = res.data.fillUser;
    if (userStore.user.fillMethod === '0') {
      data1.value = res.data.totalPower;
    } else {
      data2.list1[0].value = res.data.time01;
      data2.list1[1].value = res.data.time02;
      data2.list1[2].value = res.data.time03;
      data2.list1[3].value = res.data.time04;
      data2.list1[4].value = res.data.time05;
      data2.list1[5].value = res.data.time06;
      data2.list1[6].value = res.data.time07;
      data2.list1[7].value = res.data.time08;
      data2.list1[8].value = res.data.time09;
      data2.list1[9].value = res.data.time10;
      data2.list1[10].value = res.data.time11;
      data2.list1[11].value = res.data.time12;

      data2.list2[0].value = res.data.time13;
      data2.list2[1].value = res.data.time14;
      data2.list2[2].value = res.data.time15;
      data2.list2[3].value = res.data.time16;
      data2.list2[4].value = res.data.time17;
      data2.list2[5].value = res.data.time18;
      data2.list2[6].value = res.data.time19;
      data2.list2[7].value = res.data.time20;
      data2.list2[8].value = res.data.time21;
      data2.list2[9].value = res.data.time22;
      data2.list2[10].value = res.data.time23;
      data2.list2[11].value = res.data.time24;

      srcData2.list1[0].value = res.data.time01;
      srcData2.list1[1].value = res.data.time02;
      srcData2.list1[2].value = res.data.time03;
      srcData2.list1[3].value = res.data.time04;
      srcData2.list1[4].value = res.data.time05;
      srcData2.list1[5].value = res.data.time06;
      srcData2.list1[6].value = res.data.time07;
      srcData2.list1[7].value = res.data.time08;
      srcData2.list1[8].value = res.data.time09;
      srcData2.list1[9].value = res.data.time10;
      srcData2.list1[10].value = res.data.time11;
      srcData2.list1[11].value = res.data.time12;

      srcData2.list2[0].value = res.data.time13;
      srcData2.list2[1].value = res.data.time14;
      srcData2.list2[2].value = res.data.time15;
      srcData2.list2[3].value = res.data.time16;
      srcData2.list2[4].value = res.data.time17;
      srcData2.list2[5].value = res.data.time18;
      srcData2.list2[6].value = res.data.time19;
      srcData2.list2[7].value = res.data.time20;
      srcData2.list2[8].value = res.data.time21;
      srcData2.list2[9].value = res.data.time22;
      srcData2.list2[10].value = res.data.time23;
      srcData2.list2[11].value = res.data.time24;
    }
  }
}

// 本地导入
async function upload() {
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
    onSuccess(resp) {
      const res = JSON.parse(resp.data);
      if (res.code === 200) {
        data2.list1[0].value = res.data.time01;
        data2.list1[1].value = res.data.time02;
        data2.list1[2].value = res.data.time03;
        data2.list1[3].value = res.data.time04;
        data2.list1[4].value = res.data.time05;
        data2.list1[5].value = res.data.time06;
        data2.list1[6].value = res.data.time07;
        data2.list1[7].value = res.data.time08;
        data2.list1[8].value = res.data.time09;
        data2.list1[9].value = res.data.time10;
        data2.list1[10].value = res.data.time11;
        data2.list1[11].value = res.data.time12;

        data2.list2[0].value = res.data.time13;
        data2.list2[1].value = res.data.time14;
        data2.list2[2].value = res.data.time15;
        data2.list2[3].value = res.data.time16;
        data2.list2[4].value = res.data.time17;
        data2.list2[5].value = res.data.time18;
        data2.list2[6].value = res.data.time19;
        data2.list2[7].value = res.data.time20;
        data2.list2[8].value = res.data.time21;
        data2.list2[9].value = res.data.time22;
        data2.list2[10].value = res.data.time23;
        data2.list2[11].value = res.data.time24;
        uni.showToast({
          title: res.msg,
          icon: 'none',
        });
      } else {
        uni.showToast({
          title: res.msg || '后台解析失败！',
          icon: 'none',
        });
      }
    },
    onError(err) {
      console.log('上传失败', err);
      uni.showToast({
        title: '上传失败',
        icon: 'none',
      });
    },
  });
}

// 使用正则实现对字符串的匹配，不能为负数、不能有多个小数点、不能有字母
function toNum(val) {
  if (['null', 'undefined', ''].includes(val)) {
    return null;
  }
  return val.match(/\d+\.?\d*/)[0];
}
</script>

<style lang="scss" scoped>
.report-info {
  background: linear-gradient(180deg, #1a65ee 0%, #1a88ee 100%);
}
// 指示器位置
:deep(.uni-swiper-dots-horizontal) {
  bottom: -20px !important;
}
:deep(.wd-upload__preview) {
  display: none;
}
</style>
