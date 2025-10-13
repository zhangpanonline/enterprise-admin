<template>
  <div class="meeting">
    <!-- 面包屑 -->
    <p class="meeting__breadcrumb">
      <span class="meeting__breadcrumb-item" @click="goBack(-2)">案件列表</span>
      <i class="el-icon-arrow-right"></i>
      <el-icon><IconEpArrowRight /></el-icon>
      <span class="meeting__breadcrumb-item" @click="goBack(-1)">债权会议管理</span>
      <el-icon><IconEpArrowRight /></el-icon>
      <span>{{ tab[tabKey] }}</span>
    </p>
    <!-- 头部 -->
    <ul class="meeting__header">
      <li style="display: flex; align-items: center;">
        <span style="font-size: small; cursor: pointer;" @click="goBack(-1)"><i class="el-icon-arrow-left"></i>返回</span>
        <span style="padding-left: 1em; font-size: 18px;">{{ title }}</span>
        <el-popover
          placement="bottom-start"
          trigger="click"
          width="176">
          <template #reference>
            <el-button v-if="row.signQrcodeFilePath" style="margin-left: 20px;" size="mini" type="primary">
              <el-icon style="margin-right: 10px;" ><IconEpFullScreen /> </el-icon> 扫码签到
            </el-button>
          </template>
          <figure>
            <img :src="getObsUrl(row.signQrcodeFilePath)" />
            <figcaption style="text-align: center;cursor: pointer; text-decoration: underline;" @click="downQrcode(row.signQrcodeFilePath)" >
              <el-icon style="margin-right: 10px;" ><IconEpDownload /> </el-icon>
              下载
            </figcaption>
          </figure>
        </el-popover>
      </li>
      <li v-if="!isSave">
        <span v-if="showStart" class="meeting__start" @click="onStart()">
          <el-icon style="margin-right: 10px;" ><IconEpVideoCamera /> </el-icon>
          开始会议
        </span>
        <el-button size="mini" type="primary" @click="onInvite()">
          <el-icon style="margin-right: 10px;" ><IconEpPosition /> </el-icon>
          邀请
        </el-button>
        <el-button size="mini" type="primary" @click="archive()">
          <el-icon style="margin-right: 10px;" ><IconEpLock /> </el-icon>
          保存
        </el-button>
        <el-button v-if="buttonAuth[SEETING_BUTTON]" size="mini" type="primary" @click="onSetting()">
          <el-icon style="margin-right: 10px;" ><IconEpSetting /> </el-icon>
          设置
        </el-button>
      </li>
    </ul>
    <!-- tab -->
    <el-tabs v-model="tabKey" @tab-click="$event => tabKey = $event.name">
      <el-tab-pane v-if="buttonAuth[TAB1]" :label="tab.info" name="info">
        <Info v-if="tabKey === 'info'" :case-info="caseInfo" :row="row" :is-save="isSave" />
      </el-tab-pane>
      <el-tab-pane v-if="buttonAuth[TAB2]" :label="tab.vote" name="vote">
        <Vote v-if="tabKey === 'vote'" :row="row" :is-save="isSave" />
      </el-tab-pane>
      <el-tab-pane v-if="buttonAuth[TAB3]" :label="tab.file" name="file">
        <File v-if="tabKey === 'file'" :row="row" :is-save="isSave" />
      </el-tab-pane>
      <el-tab-pane v-if="buttonAuth[TAB4]" :label="tab.deposit" name="deposit">
        <Deposit v-if="tabKey === 'deposit'" :row="row" :is-save="isSave" />
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="dialogTitle" v-model="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px">
      <div v-if="dialogTitle === '邀请参会人员'" class="meeting__invite">
        <p class="meeting__tips">会议链接</p>
        <p class="meeting__copy" @click="openMeet()">{{ link }}</p>
        <p class="meeting__tips">点击链接即可轻松进入会议；会议结束后，会自动生成新的会议链接</p>
        <el-button class="meeting_button" size="mini" type="primary" @click="copyLink(link, $event)">
          <el-icon style="margin-right: 10px;" ><IconEpCopyDocument /> </el-icon>
          复制链接
        </el-button>
      </div>
      <div v-if="dialogTitle === '编辑会议'">
        <el-form ref="subFormRef" :model="form" :rules="rules" inline size="mini">
          <el-form-item label="会议名称" prop="meetName">
            <!-- 默认显示案件名称 + 第一次债权人会议，可自定义修改内容长度50字 -->
            <el-input v-model="form.meetName" style="width: 350px;" />
          </el-form-item>
          <el-form-item label="会议时间" prop="meetTime">
            <el-date-picker v-model="form.meetTime" :picker-options="{ disabledDate: firstMeetingDateDisabled }" style="width: 350px;" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
          <el-form-item label="普通债权" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio label="1">小额债权</el-radio>
              <el-radio label="2">大额债权</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.type === '1'" label="债权上限" prop="max">
            <FormatCNY v-model="form.max" />
          </el-form-item>
          <el-form-item v-if="form.type === '2'" label="债权下限" prop="min">
            <FormatCNY v-model="form.min" />
          </el-form-item>
        </el-form>
        <div style="display: flex; justify-content: flex-end;">
          <el-button :loading="loading" size="mini" type="primary" @click="onSave()">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Info from './Info.vue'
import Deposit from './Deposit.vue'
import File from './File.vue'
import Vote from './Vote.vue'
import obsFileDownload from '@/components/HuaweiObsUpload/obsDownload.js'
import { CASE_EDIT_TABLE_KEY, TAB1, TAB2, TAB3, TAB4, SEETING_BUTTON } from '@/constant'
import Clipboard from 'clipboard'
export default {
  setup() {
    const route = useRoute()
    function copyLink(text, event) {
      const options = {
        text: () => text,
      }
      const clipboard = new Clipboard(event.target, options)
      clipboard.on('success', () => {
        ElMessage({
          message: '复制成功！',
          type: 'success',
          duration: 1500,
        })
        clipboard.destroy()
        this.visible = false
      })
      clipboard.on('error', () => {
        ElMessage({
          message: '复制失败！',
          type: 'error',
        })
        clipboard.destroy()
      })
      clipboard.onClick(event)
    }
    function getObsUrl(path) {
      return import.meta.env.VITE_OBS_URL + path
    }
    const { buttonAuth } = useButtonAuth([TAB1, TAB2, TAB3, TAB4, SEETING_BUTTON])
    return { route, copyLink, getObsUrl, buttonAuth, TAB1, TAB2, TAB3, TAB4, SEETING_BUTTON }
  },
  components: {
    Info,
    Deposit,
    File,
    Vote,
  },
  data() {
    return {
      tab: {
        info: '会议签到',
        vote: '会议表决',
        file: '会议文件',
        deposit: '会议存证',
      },
      tabKey: 'info',
      visible: false,
      dialogTitle: '', // (邀请参会人员, 编辑会议)
      link: '',
      form: {
        meetName: '',
        meetTime: '',
        type: '',
        min: '',
        max: '',
      },
      rules: {
        meetName: [{ required: true, message: '会议名称不能为空！' }],
        meetTime: [{ required: true, message: '会议时间不能为空！' }],
      },
      loading: false,
      caseInfo: {},
      row: {},
      title: '',
    }
  },
  computed: {
    // 当前会议是否已保存
    isSave() {
      return Number(this.row.sealSave) === 1
    },
    // 显示开始会议按钮
    showStart() {
      return [0, 2].includes(Number(this.row.status))
    },
  },
  created() {
    const { case: info, row } = this.route.query
    this.caseInfo = JSON.parse(info)
    this.row = JSON.parse(row)
    this.link = import.meta.env.VITE_MEETING_URL + this.row.meetCode
    this.title = `${this.row.meetName} ${this.row.meetTime}`
  },
  methods: {
    downQrcode(url) {
      obsFileDownload(url, '签到二维码.png')
    },
    goBack(num) {
      if (num !== -1) {
        window.localStorage.setItem(CASE_EDIT_TABLE_KEY, '')
      }
      this.$router.go(num)
    },
    firstMeetingDateDisabled(date) {
      const cur = Date.now() - 24 * 3600 * 1000
      const start = new Date(date).getTime()
      return start < cur
    },
    openMeet() {
      window.open(this.link)
    },
    onInvite() {
      this.dialogTitle = '邀请参会人员'
      this.visible = true
    },
    archive() {
      const _this = this
      ElMessageBox.confirm('会议数据保存后，会议信息将全部锁定，无法进行任何变更，改操作不可逆，请谨慎操作！', '保存会议数据', {
        type: 'warning',
        showCancelButton: false,
        async beforeClose(action, vm, done) {
          if (action === 'confirm') {
            var loadingInstance = null
            try {
              loadingInstance = _this.$loading({
                fullscreen: true,
                text: '会议信息保存中，请稍等......',
                spinner: 'loading-animation',
              })
              const res = await meetModifyApi({ ..._this.row, sealSave: 1 })
              if (res.success) {
                ElMessage.success('操作成功！')
                _this.row.sealSave = 1
                done()
              } else {
                ElMessage.error(res.msg)
              }
            } catch (error) {
              console.error(error)
              ElMessage.error(error.message)
            } finally {
              _this.$nextTick(() => {
                loadingInstance.close()
              })
            }
          } else {
            done()
          }
        },
      })
    },
    // 开始会议
    async onStart() {
      var loadingInstance = null
      try {
        loadingInstance = ElLoading.service({
          fullscreen: true,
          text: '会议开启中，请稍等......',
          spinner: 'loading-animation',
        })
        const res = await meetStartApi(this.row.id)
        if (res.success) {
          window.open(res.data)
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      } finally {
        this.$nextTick(() => {
          loadingInstance.close()
        })
      }
    },
    onSetting() {
      this.dialogTitle = '编辑会议'
      this.visible = true
      this.form.meetName = this.row.meetName
      this.form.meetTime = this.row.meetTime
      this.form.type = ''
      this.form.min = null
      this.form.max = null
    },
    async onSave() {
      const validate = await this.$refs.subFormRef.validate()
      if (!validate) return false
      try {
        this.loading = true
        const res = await meetModifyApi({ ...this.form, projectId: this.caseInfo.projectId, id: this.row.id })
        if (res.success) {
          ElMessage.success('操作成功！')
          this.row.meetName = this.form.meetName
          this.row.meetTime = this.form.meetTime
          this.title = `${this.row.meetName} ${this.row.meetTime}`
          this.visible = false
        } else {
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style  scoped>
:deep(.el-dialog__body) {
  padding-bottom: 20px;
  padding-top: 20px;
}
.meeting {
  position: relative;
  width: 100%;
  height: 100%;
}
.meeting__breadcrumb {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #999;
  position: absolute;
  left: 0;
  top: -30px;
}
.meeting__breadcrumb-item:hover {
  cursor: pointer;
  color: #333;
}
.meeting__header {
  margin-top: 20px;
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 23px;
  padding-right: 25px;
  box-sizing: border-box;
  border-bottom: 1px solid #e6e6e6;
}
.meeting__start {
  background-color: #ff7303;
  color: #fff;
  border-radius: 4px;
  display: inline-block;
  padding: 12px 20px;
  cursor: pointer;
  margin-right: 10px;
}
.meeting__start:hover {
  background-color: #f88526;
}
.el-tabs {
  height: calc(100% - 60px);
}
.el-tabs :deep(.el-tabs__content) {
  height: calc(100% - 70px);
}
.el-tab-pane {
  height: 100%;
}

.meeting__invite .meeting__tips {
  line-height: 2.5em;
  color: #999;
}
.meeting__copy {
  background-color: #f1f1f1;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
}
.meeting__copy:hover {
  color: #a69480;
}
.meeting_button {
  float: right;
  margin-top: 10px;
}
.meeting__invite::after {
  content: '';
  display: block;
  clear: both;
}
:deep(.el-tabs__header) {
  padding: 0 20px;
}
</style>
