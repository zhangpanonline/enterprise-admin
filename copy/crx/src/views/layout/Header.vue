<template>
  <div class="aog-app-header">
    <div class="aog-app-header-left">
      <div class="aog-app-header-left-logo">
        <img :src="getFileUrl('/icons/logo.png')" alt="" />
      </div>
      <div class="aog-app-header-left-title">{{ appName }}</div>
      <ul class="aog-app-header-left-category">
        <li
          class="category-item"
          :class="{ active: dataStore.currentCategory === 'market' }"
          @click="dataStore.setCurrentCategory('market')"
        >
          市场摘牌
        </li>
        <li
          class="category-item"
          :class="{ active: dataStore.currentCategory === 'centralized' }"
          @click="dataStore.setCurrentCategory('centralized')"
        >
          集中竞价
        </li>
      </ul>
    </div>
    <div class="aog-app-header-right">
      <div class="icon-box">
        <el-icon :size="$adapter_width_unit(20)"
          ><SemiSelect @click="onMinimizeFun"
        /></el-icon>
      </div>
      <div class="icon-box">
        <el-icon :size="$adapter_width_unit(20)"
          ><CloseBold @click="onCloseFun"
        /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CloseBold, SemiSelect } from '@element-plus/icons-vue'
import { getAppName } from '@/utils/app'
import { getFileUrl } from '@/utils/fileUrl'
import { $adapter_width_unit } from '@/utils/viewAdapterPlugin'
import { messageBox } from '@/utils/message'
import { useDataStore } from '@/store'
// import { ElMessageBox } from 'element-plus'
// import { SYSTEM_EL_ID } from '@/constants'

const appName = getAppName()

const dataStore = useDataStore()

const emits = defineEmits(['minimize', 'close'])

function onMinimizeFun() {
  emits('minimize')
}

function onCloseFun() {
  // closeVisible.value = true
  messageBox('温馨提示', '确定退出程序吗？', 'warning', true, '确定', '取消')
    .then(() => {
      onConfirmFun()
    })
    .catch(() => {
      onCancelFun()
    })
}

function onConfirmFun() {
  // 确定退出程序
  emits('close')
}

function onCancelFun() {
  // 取消退出程序
  // emits('minimize')
}
</script>

<style lang="scss" scoped>
li {
  list-style: none;
}
.aog-app-header {
  height: var(--aog-app-header-height);
  background-color: var(--aog-app-header-bg-color);
  border-top-left-radius: var(--aog-app-popup-border-radius);
  border-top-right-radius: var(--aog-app-popup-border-radius);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px var(--aog-app-popup-padding);

  .aog-app-header-left {
    display: flex;
    align-items: center;

    .aog-app-header-left-logo {
      width: 20px;
      height: 20px;
      img {
        width: 20px;
        height: 20px;
      }
    }

    .aog-app-header-left-title {
      margin-left: 5px;
      font-weight: 900;
      font-size: var(--aog-app-base-title-font-size);
    }
    .aog-app-header-left-category {
      margin: 0;
      margin-left: 10px;
      display: flex;
      align-items: center;
      gap: 30px;
      color: #fff;

      font-family:
        HarmonyOS Sans,
        HarmonyOS Sans;
      font-weight: 900;
      font-size: 16px;
      .category-item {
        cursor: pointer;
        &.active {
          color: rgba(51, 163, 255, 0.8);
          position: relative;
          &::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: rgba(51, 163, 255, 0.8);
          }
        }
      }
    }
  }
  .aog-app-header-right {
    display: flex;
    align-items: center;
    .icon-box {
      cursor: pointer;
      margin-left: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
