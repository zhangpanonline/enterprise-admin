<template>
   <el-badge class="ml-3 mr-1 mt-1" :value="contNum" :max="99" :hidden="contType">
      <el-icon size="20" class="cursor-pointer"  @click="getMes">
      <IconEpBell/>
     </el-icon>
  </el-badge>
  <el-drawer
    modal-class="!bg-transparent"
    id="drawerTop"
    v-model="drawer"
    :with-header="false"
    :size="340"
    append-to-body
    :modal="true"
    :before-close="handleClose"
  >
  <div>
      <div class="h-15 bg-[#F5F9FB] py-3.5	px-5 flex items-center justify-between">
        <div>
          <div class="px-3 py-1 bg-white">系统消息</div>
        </div>
        <el-icon class="text-[#255867] text-[20px]	cursor-pointer" @click="handleClose">
          <IconEpClose />
        </el-icon>
      </div>
    <div class="relative w-[115px] mx-4 mt-4" >
        <el-date-picker
            ref="start"
            class="timeIcon"
            v-model="time"
            type="date"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
            @change="fetchData"
            >
          </el-date-picker>
          <div class="cursor-pointer absolute right-0 top-1.5 text-[#999999]"  @click="handleOpen">
            <el-icon >
            <IconEpArrowDown/>
          </el-icon>
          </div>
    </div>
</div>

   <div class="p-4 overflow-hidden flex-1">
       <ul v-infinite-scroll="load" :infinite-scroll-disabled="disabled" class="h-full" style="overflow: auto">
          <li v-for="(item,index) in messageList" :key="index" class="grid grid-cols-[36px_1fr] gap-5 items-center mb-4 cursor-pointer" @click='goMessageList(item)'>
              <div class="h-9 bg-[url('/src/assets/images/mesicon.png')] bg-no-repeat relative
                 after:content-[''] after:w-2 after:h-2 after:rounded-full after:top-0 after:right-0 after:bg-danger"
                :class="{ 'after:absolute': !item.read }" >
              </div>
              <div>
                  <div class="text-sm	text-[#333333]">{{ item.content }}</div>
                  <div class="text-xs	text-[#999999]">{{ item.createTime }}</div>
              </div>
          </li>
        </ul>
   </div>
   <div class="h-15 border-t border-info-50 flex items-center px-5">
     <div class="border border-primary flex items-center text-primary px-2 py-1 rounded	text-xs cursor-pointer" @click="setMes"><img class="mr-1" src="/src/assets/images/mesicon2.png" alt=""> 一键已读</div>
   </div>
</el-drawer>

</template>
<script setup>
import { MQTT_SERVICE, ACCOUNT, PASSWORD, VirtualHost } from '@/plugins/mqtt.js'
import Stomp from 'stompjs'
const appStore = useAppStore()
const caseStore = useCaseStore()
const router = useRouter()

const options = reactive({
  vhost: VirtualHost, // rabbitmq的vhost
  incoming: 8000, // 心跳包时间，（须大于0，且小于10000，因为服务器可能默认10秒没心跳就会断开）
  outgoing: 8000, // 心跳包时间，（须大于0，且小于10000，因为服务器可能默认10秒没心跳就会断开）
  account: ACCOUNT, // rabbitmq的账户
  pwd: PASSWORD, // rabbitmq的密码
  server: MQTT_SERVICE, // ws://rabbitmq的ip:rabbitmq的web-stomp的端口/ws
})
var client = null
const connect = () => {
  const mqUrl = options.server // 连接地址
  var ws = new WebSocket(mqUrl) // 创建
  ws.onclose = close => {
    console.log('webSocket关闭', close) // 关闭回调
  }
  ws.onerror = error => {
    console.log('webSocket异常', error) // 异常回调
  }
  ws.onopen = success => {
    console.log('webSocket连接成功', success) // 成功回调
  }
  client = Stomp.over(ws)
  client.heartbeat.incoming = options.incoming
  client.heartbeat.outgoing = options.outgoing
  // 开始连接
  client.connect(
    options.account, // 用户名
    options.pwd, // 密码
    onSuccessConnectRabbitmq, // 连接成功时回调
    onErrorConnectRabbitmq, // 失败时回调
    options.vhost
  )
}
const onSuccessConnectRabbitmq = () => {
  console.log('stomp 连接成功！')
  // 直接在连接成功的时候就订阅监听user.audit.queue队列 user.audit.queue是rabbitmq里创建的queue名称
  doSubscribe(appStore.userInfo.id)
}
const onErrorConnectRabbitmq = (errorMsg) => {
  console.error(`stomp 断开连接，正在准备重新连接...`, errorMsg)
  connect(options)
}
const drawer = ref(false)
const time = ref()
const getMes = () => {
  drawer.value = true
  getList()
}
const start = ref()
const handleOpen = () => {
  start.value.handleOpen()
}
const contNum = ref(0)
const contType = ref(true)
const getMesNum = async() => {
  const params = {
    sysCode: 'BANKRUPT',
    type: 'IN_MAIL_MESSAGE',
    userId: appStore.userInfo.id,
  }
  const res = await getAllCountBySysCode(params)
  if (res.success) {
    if (res.data > 0) {
      contType.value = false
    }
    contNum.value = res.data
  }
}
var currentSubscribe
const doSubscribe = (queueName) => {
  currentSubscribe = client.subscribe(queueName, function(messages) {
    const contNmuber = Number(messages.body)
    if (contNmuber > 0) {
      contType.value = false
      contNum.value = contNmuber
    }
  }, { 'auto-delete': 'true' })
}
const doUnSubscribe = () => {
  // currentSubscribe.unsubscribe()
  // 关闭连接
  destroyConnection()
}
const destroyConnection = () => {
  client.disconnect(() => {
    console.log('已关闭rabbitmq连接')
  })
}
const count = ref(1)
const load = () => {
  loading.value = true

  setTimeout(() => {
    count.value++
    getList()
  }, 2000)
}
const handleClose = () => {
  drawer.value = false
  count.value = 1
  messageList.value = []
  time.value = ''
}
const messageList = ref([])
const loading = ref(false)
const noMore = ref(false)
const disabled = computed(() => {
  return loading.value || noMore.value
})
const startTime = ref('')
const endTime = ref('')
const fetchData = (val) => {
  console.log(val)
  console.log(time.value)
  startTime.value = time.value + ' 00:00:00'
  endTime.value = time.value + ' 23:59:59'
  count.value = 1
  messageList.value = []
  getList()
}
// 获取列表
const getList = async() => {
  const params = {
    sysCode: 'BANKRUPT',
    pageSize: 10,
    pageNumber: count.value,
    noticeType: 'SYSTEM_NOTICE',
    type: 'IN_MAIL_MESSAGE',
    userId: appStore.userInfo.id,
    startTime: startTime.value,
    endTime: endTime.value,
  }
  const res = await getUserPushLog(params)
  if (res.success) {
    loading.value = false
    if (res.data.length !== 0) {
      contType.value = true
      contNum.value = 0
      messageList.value = messageList.value.concat(res.data)
      // var ids = res.data.map((item, index) => {
      //   return item.id
      // })
      // setbatchRead(ids)
    } else {
      noMore.value = true
    }
  }
}
const caseInfo = reactive({})

// 跳转消息列表
const goMessageList = async (item) => {
  setbatchRead([item.id])
  const data = JSON.parse(item.extras.replaceAll('"[', '[').replaceAll(']"', ']'))
  // const data = JSON.parse(item.extras)
  const res = await getCaseHome(data.projectId)
  if (res.success) {
    Object.assign(caseInfo, res.data)
    caseStore.getCaseInfo(caseInfo.projectId)
    handleClose()
    router.push({ path: '/caseMessage' })

  } else {
    ElMessage.error({ message: res.msg, showClose: false })
  }

 }

// 批量更新已读未读状态
const setbatchRead = async(ids) => {
  const params = {
    msgIds: ids,
    userId: appStore.userInfo.id,
  }
  const res = await batchRead(params)
}
// 全部已读
const setMes = async() => {
  const params = {
    code: 'BANKRUPT',
    read: false,
    type: 'IN_MAIL_MESSAGE',
    userId: appStore.userInfo.id,
  }
  const res = await BathReadBySysCode(params)
}
onBeforeUnmount(() => {
  destroyConnection()
})
onMounted(() => {
  connect()
  getMesNum()
})
</script>
<style >

#drawerTop>.el-drawer.ltr, .el-drawer.rtl {
    height:  calc(100vh - 60px) !important;;
    top: 60px;
}
#drawerTop>.el-drawer__body{
   padding: 0;
   display: flex;
   flex-direction: column;
}

.timeIcon>.el-input__wrapper>.el-input__prefix{
  display: none ;
}
.timeIcon>.el-input__wrapper>.el-input__suffix{
  display: none ;
}
.timeIcon>.el-input__wrapper>.el-input__inner{
   color: #999999;
  font-size: 14px;
}
.timeIcon>.el-input__wrapper{
  box-shadow:none;
  background: rgba(255, 255, 255, 0);

}
 </style>
