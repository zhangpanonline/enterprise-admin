<template>
  <div class="market">
    <div class="header">
      <el-form :inline="true" :model="formData" label-suffix=":">
        <el-form-item label="窗口名称">
          <el-select
            v-model="formData.seqId"
            placeholder="请选择窗口名称"
            style="width: 200px"
            filterable
          >
            <el-option
              v-for="v in options.seqId"
              :key="v.value"
              :label="v.label"
              :value="v.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="交易单元">
          <el-select
            v-model="formData.unitId"
            placeholder="请选择交易单元"
            style="width: 200px"
            filterable
          >
            <el-option
              v-for="v in options.unitId"
              :key="v.value"
              :label="v.label"
              :value="v.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="report-time">
        <el-form-item label="交易申报时间：">
          <span>{{ formData.sbTime || '-' }}</span>
        </el-form-item>
      </div>
    </div>
    <div
      :class="{ 'content-bg': true, show: formData.curType !== 'waiting' }"
    ></div>
    <div :class="{ content: true, [formData.curType]: true }">
      <template v-if="formData.curType === 'waiting'">
        <figure>
          <img :src="getFileUrl('/images/market/market.png')" alt="摘牌电量" />
          <figcaption>摘牌电量</figcaption>
        </figure>
        <div class="input">
          <el-input v-model="formData.myDlxz" placeholder="请输入电量">
            <template #suffix>兆瓦时</template>
          </el-input>
        </div>
        <img
          class="btn"
          @click="((formData.curType = 'running'), polling())"
          :src="getFileUrl('/images/market/btn-start.png')"
          alt="开始实时监测"
        />
      </template>
      <template v-else>
        <img
          class="img"
          :src="getFileUrl('/images/market/market.png')"
          alt="摘牌电量"
        />
        <p v-if="formData.curType === 'running'" class="content-title">
          监测中...
        </p>
        <p v-if="formData.curType === 'finishing'" class="content-title">
          摘牌中...
        </p>
        <p v-if="formData.curType === 'success'" class="content-title success">
          摘牌成功
        </p>
        <p v-if="formData.curType === 'fail'" class="content-title fail">
          摘牌失败
        </p>
        <div class="content-wrapper">
          <p class="content-wrapper-title">摘牌电量</p>
          <div
            v-if="['running', 'finishing'].includes(formData.curType)"
            class="content-wrapper-input"
          >
            <el-input v-model="formData.myDlxz" placeholder="请输入电量">
              <template #suffix>兆瓦时</template>
            </el-input>
          </div>
          <div
            v-if="formData.curType === 'success'"
            class="content-wrapper-success"
          >
            {{ formData.myDlxz || 111 }}<span class="unit">兆瓦时</span>
          </div>
          <div v-if="formData.curType === 'fail'" class="content-wrapper-fail">
            {{ formData.myDlxz || '-' }}<span class="unit">兆瓦时</span>
          </div>
          <ul class="content-wrapper-result">
            <li>
              <span class="label"> 合约电量: </span>
              <span class="value"
                >{{ formData.dumpEnergy || '-'
                }}<span v-if="formData.dumpEnergy" class="unit">MWh</span></span
              >
            </li>
            <li>
              <span class="label"> 合约电价: </span>
              <span class="value"
                >{{ formData.price || '-'
                }}<span v-if="formData.price" class="unit">元/MWh</span></span
              >
            </li>
          </ul>
        </div>
        <img
          v-if="['running', 'finishing'].includes(formData.curType)"
          class="btn"
          @click="formData.curType = 'waiting'"
          :src="getFileUrl('/images/market/btn-stop.png')"
          alt="停止监测"
        />
        <img
          v-if="['success', 'fail'].includes(formData.curType)"
          class="btn"
          @click="formData.curType = 'waiting'"
          :src="getFileUrl('/images/market/btn-back.png')"
          alt="返回"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onUnmounted, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
// import { getUKeyInfo } from '@/utils/chomeStorage'
import { getFileUrl } from '@/utils/fileUrl'
import { ElMessage } from 'element-plus'
let timer: NodeJS.Timeout

// 等待开始监测、监测中、摘牌中、摘牌成功、摘牌失败
type TradeType = 'waiting' | 'running' | 'finishing' | 'success' | 'fail'

const formData = reactive({
  seqId: '',
  unitId: '',
  dumpEnergy: '',
  price: '',
  sbTime: '',
  myDlxz: '',
  reqId: '',
  planId: '',
  tradeUnitId: '',
  curType: 'waiting' as TradeType,
})
const tradeCode = computed(() => {
  return options.seqId.find((v) => v.value === formData.seqId)?.tradeCode || ''
})

const BASE_URL = import.meta.env.VITE_APP_BASE_API

type Option = {
  seqId: Array<{ label: string; value: string; tradeCode: string }>
  unitId: Array<{ label: string; value: string }>
}
const options = reactive<Option>({
  seqId: [],
  unitId: [],
})

watch([() => formData.seqId, () => formData.unitId], () => {
  clearTimeout(timer)
  formData.curType = 'waiting'
  formData.myDlxz = ''
  formData.dumpEnergy = ''
  formData.price = ''
  getSbTime()
  getOverview()
})

onUnmounted(() => {
  clearTimeout(timer)
})

init()
async function init() {
  await getWindowList()
  await getTradeUnitList()
}
// 窗口选项
async function getWindowList() {
  const res = await request(
    `${BASE_URL}/qctc-pm-trade-zcq-scgp/tradeScgp/getTradeWindowInfo`
  )
  if (Array.isArray(res.data?.seqVoList)) {
    const demo = {
      seqId: 1531,
      seqName: '2025年8月周市场绿色电力交易（第五周）',
      energyType: 3,
      priceType: 4,
      jypzid: '7',
      tradeCode: '0218',
      mr: '买入(+)',
      mc: '卖出(-)',
      dgJypz: '0',
      jyfdbsId: '1',
      year: 2025,
      jyzqId: '3',
      gxsgd: false,
    }
    options.seqId = res.data.seqVoList.map((v: typeof demo) => ({
      label: v.seqName,
      value: v.seqId,
      tradeCode: v.tradeCode,
    }))
    if (options.seqId.length) {
      formData.seqId = options.seqId[0].value
      getSbTime()
    }
  }
}
// 交易单元选项
async function getTradeUnitList() {
  const res = await request(
    `${BASE_URL}/qctc-pm-trade-zcq-scgp/tradeScgp/getTradeUnit`
  )
  if (Array.isArray(res.data)) {
    const demo = {
      unitid: 'SD0111',
      unitname: '华能广西能源销售有限责任公司',
      abbrname: null,
      uname: null,
      plantid: null,
      basetype: null,
      apptype: null,
      maxcapacity: null,
      mincapacity: null,
      maxqcapa: null,
      maxqcapain: null,
      begintime: null,
      endtime: null,
      state: null,
      fddyid: null,
    }
    options.unitId = res.data.map((v: typeof demo) => ({
      label: v.unitname,
      value: v.unitid,
    }))
    if (options.unitId.length) {
      formData.unitId = options.unitId[0].value
    }
  }
}
// 申报时间
async function getSbTime() {
  if (!formData.seqId) return
  const res = await request(
    `${BASE_URL}/qctc-pm-trade-zcq-scgp/tradeScgp/getSeqBaseInfo`,
    {
      body: JSON.stringify({
        seqBaseArc: {
          seqId: formData.seqId,
        },
      }),
    }
  )
  if (res.code === 0) {
    formData.sbTime = res.data.sbTime
  }
}

// 轮询请求
async function polling() {
  if (!formData.seqId || !formData.unitId || formData.curType !== 'running')
    return
  clearTimeout(timer)
  await findAllBuyData()
  timer = setTimeout(() => {
    polling()
  }, 1000)
}

async function findAllBuyData() {
  const res = await request(
    `${BASE_URL}/qctc-pm-trade-zcq-scgp/tradeScgp/findAllBuyData`,
    {
      body: JSON.stringify({
        page: { totalSize: 1, currentPage: 1, pageSize: 1 },
        requestInfo: {
          seqId: formData.seqId,
          tradeCode: tradeCode.value,
          tradeUnitId: formData.unitId,
        },
        priceBegin: '',
        priceEnd: '',
        dumpEnergyBegin: '',
        dumpEnergyEnd: '',
        sortCode: '0',
        sortType: 'd',
      }),
    }
  )
  if (
    Array.isArray(res.data?.datalist) &&
    res.data.datalist[0]?.jysbScgpRequestInfo
  ) {
    const { dumpEnergy, price, reqId, planId, tradeUnitId } =
      res.data.datalist[0].jysbScgpRequestInfo
    formData.dumpEnergy = dumpEnergy
    formData.price = price
    formData.reqId = reqId
    formData.planId = planId
    formData.tradeUnitId = tradeUnitId
    // 开始摘牌
    formData.curType = 'finishing'
    dump()
  }
}

// 可交易上限/摘牌电量
async function getOverview() {
  if (!formData.seqId || !formData.unitId) return
  const res = await request(
    `${BASE_URL}/qctc-pm-trade-zcq-scgp/tradeScgp/gx/overview`,
    {
      body: JSON.stringify({
        seqId: formData.seqId,
        unitId: formData.unitId,
      }),
    }
  )
  if (res.code === 0) {
    formData.myDlxz = res.data?.myDlxz
  }
}

// 摘牌
async function dump() {
  // const uKeyInfo = await getUKeyInfo()
  // tradeUnitId
  // reqId
  const res = await request(
    `${BASE_URL}/qctc-pm-trade-zcq-scgp/tradeScgp/gx/saveScgpResultInfo`,
    {
      body: JSON.stringify({
        requestInfo: {
          seqId: formData.seqId,
          tradeCode: tradeCode.value,
          energy: formData.myDlxz,

          tradeUnitId: formData.unitId,
          price: formData.price,
          reqId: formData.reqId,
          // planId: formData.planId,
          planId: '',
        },
        // appUsrCertNO: uKeyInfo.AppUsrCertNO,
        // subjectCN: uKeyInfo.subjectCN,
        // subjectO: uKeyInfo.subjectO,
        appUsrCertNO: JSON.parse(sessionStorage.getItem('UKeyInfo') as string)['AppUsrCertNO'],
        subjectCN: JSON.parse(sessionStorage.getItem('UKeyInfo') as string).subjectCN,
        subjectO: JSON.parse(sessionStorage.getItem('UKeyInfo') as string).subjectO,
        declareCode: uuidv4(),
      }),
    }
  )
  // TODO: 摘牌结果处理
  console.log('摘牌结果', res)
  localStorage.setItem('摘牌结果', JSON.stringify(res))
  if (res.code === 0) {
    formData.curType = 'success'
    ElMessage.success(res.msg)
  } else {
    ElMessage.error(res.msg)
    formData.curType = 'fail'
  }
}

// 请求封装
async function request<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultOptions: RequestInit = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  }
  const config: RequestInit = {
    ...defaultOptions,
    ...options,
  }

  const res = await fetch(url, config)
  return res.json()
}
</script>

<style lang="scss" scoped>
:deep(.aog-el-form-item) {
  margin-bottom: 0;
}
:deep(.aog-el-input) {
  width: 100%;
  height: 100%;
}
:deep(.aog-el-input__inner) {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 400;
  font-size: 26px;
  color: #b9b9b9;
}
:deep(.aog-el-input__suffix-inner) {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 400;
  font-size: 20px;
  color: #ffffff98;
}
:deep(.aog-el-input__wrapper:hover) {
  box-shadow: none;
}
:deep(.aog-el-input__wrapper.is-focus) {
  box-shadow: none;
}
.market {
  width: var(--aog-app-min-width);
  height: var(--aog-app-min-height);
  position: relative;
  .header {
    height: var(--aog-app-content-header-height);
    padding: 0 var(--aog-app-popup-padding);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--aog-app-base-bg-color-1);
    background-image: var(--aog-app-image-content-container-header-bg);
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 10px 10px 0px 0px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    .report-time {
      background: linear-gradient(
        90deg,
        rgba(51, 163, 255, 0) 0%,
        rgba(51, 163, 255, 0.15) 50%,
        rgba(51, 163, 255, 0) 100%
      );
      border-radius: 0px 0px 0px 0px;
      border: 1px solid;
      border-image: radial-gradient(
          circle,
          rgba(51, 163, 255, 0.5),
          rgba(51, 163, 255, 0)
        )
        1 1;
    }
  }
  .content-bg {
    position: absolute;
    width: 576px;
    height: 576px;
    border-radius: 50%;
    left: 432px;
    top: 182px;
    background: linear-gradient(
      225deg,
      rgba(44, 129, 198, 1) 0%,
      rgba(101, 161, 103, 1) 100%
    );
    box-sizing: border-box;
    padding: 13px;
    animation: spin 1s linear infinite;
    opacity: 0;
    transition: none;
    &.show {
      opacity: 1;
      transition: opacity 0.3s ease 0.1s;
    }
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
  .content {
    position: absolute;
    background: #5e606c;
    height: 555px;
    margin-top: 114px;
    margin-left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: width 0.3s ease;
    &.waiting {
      justify-content: space-around;
      width: 938px;
      border-radius: 20px;
      figure {
        margin: 0;
        img {
          width: 103px;
          height: 106px;
          display: block;
          margin: 0 auto;
        }
        figcaption {
          font-family:
            PingFang SC,
            PingFang SC;
          font-weight: 800;
          font-size: 36px;
          color: #33a3ff;
        }
      }
      .input {
        height: 76px;
        width: 485px;
        border-radius: 14px;
        overflow: hidden;
      }
      .btn {
        width: 178px;
        height: 100px;
        cursor: pointer;
      }
    }
    &.running,
    &.finishing,
    &.success,
    &.fail {
      .img {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 103px;
        height: 106px;
      }
      padding: 45px 35px 30px 35px;
      box-sizing: border-box;
      width: 555px;
      border-radius: 50%;
      justify-content: space-between;
      .content-title {
        font-family:
          PingFang SC,
          PingFang SC;
        font-weight: 800;
        font-size: 28px;
        color: #ffffff;
        &.success {
          color: #27c942;
        }
        &.fail {
          color: #ec3434;
        }
      }
      .content-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        width: 100%;
        .content-wrapper-title {
          font-family:
            PingFang SC,
            PingFang SC;
          font-weight: 800;
          font-size: 36px;
          color: #33a3ff;
        }
        .content-wrapper-input {
          height: 76px;
          width: 485px;
          border-radius: 14px;
          overflow: hidden;
          margin-top: 30px;
          margin-bottom: 24px;
        }
        .content-wrapper-success {
          margin-top: 24px;
          margin-bottom: 30px;
          font-family:
            PingFang SC,
            PingFang SC;
          font-weight: 800;
          font-size: 36px;
          color: #ffffff;
          letter-spacing: 2px;
          .unit {
            font-family:
              PingFang SC,
              PingFang SC;
            font-weight: 400;
            font-size: 20px;
            line-height: 53px;
            color: #ffffff;
          }
        }
        .content-wrapper-fail {
          margin-top: 24px;
          margin-bottom: 30px;
          font-family:
            PingFang SC,
            PingFang SC;
          font-weight: 800;
          font-size: 36px;
          color: #ffffff;
          letter-spacing: 2px;
          .unit {
            font-family:
              PingFang SC,
              PingFang SC;
            font-weight: 400;
            font-size: 20px;
            color: #ffffff;
            line-height: 53px;
          }
        }
        .content-wrapper-result {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          .label {
            font-family:
              PingFang SC,
              PingFang SC;
            font-weight: 400;
            font-size: 18px;
            color: rgba(255, 255, 255, 0.7);
          }
          .value {
            font-family:
              PingFang SC,
              PingFang SC;
            font-weight: 400;
            font-size: 18px;
            color: rgba(255, 255, 255, 1);
            .uint {
              font-size: 14px;
            }
          }
        }
      }
      .btn {
        width: 178px;
        height: 100px;
        cursor: pointer;
      }
    }
  }
}
</style>
