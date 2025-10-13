<template>
  <div class="upload-component">
    <div v-if="subType === 'file'">
      <el-upload
        v-if="!disabled && isLimit"
        :show-file-list="false"
        :on-exceed="handleExceed"
        :before-upload="beforeAvatarUpload"
        :http-request="fileUpload"
        action="string"
      >
        <slot>
          <el-button size="mini" type="primary">上传</el-button>
        </slot>
      </el-upload>

      <ul v-if="fileList.length >0 && showFileList" class="file-list-upload clear">
        <li v-for="(item,index) in fileList" :key="index">
          <el-tooltip :content="item.name" class="item" effect="dark" placement="top">
            <p class="file-name">{{ index+1 }}、{{ item.name }}</p>
          </el-tooltip>

          <div class="file-div">查看
            <span class="file-pre">
              <el-progress :percentage="item.percentage" :status="item.status"></el-progress>
            </span>
            <span>
              <el-icon v-show="item.percentage < 100" class="cancel-upload icon-btn" title="取消上传" @click="cancelUpload(index)">
                取消上传
              </el-icon>
            </span>
            <span>
              <el-icon v-if="!isShow && item.percentage == 100" class="icon-btn" title="删除" @click="handleRemove(index)">
                <IconEpDelete />
              </el-icon>
              <el-icon v-if="isShow" class="icon-btn" title="下载" @click="fileDownload(item)">
                <IconEpDownload />
              </el-icon>
              <el-icon v-if="tempType === 'tempFile' && !isShow" class="icon-btn" title="下载" @click="fileDownload(item)">
                <IconEpDownload />
              </el-icon>
            </span>
            <span v-if="useType && item.percentage == 100">
              <el-icon class="icon-btn" title="查看" @click="handleLook(item)">
                <IconEpView />
              </el-icon>
            </span>
          </div>
        </li>
      </ul>
      <span v-if="disabled && !fileList.length">无</span>
    </div>
    <div v-if="subType === 'fileList'">
      <el-upload
        v-if="!disabled && isLimit"
        :show-file-list="false"
        :on-exceed="handleExceed"
        :before-upload="beforeAvatarUpload"
        :http-request="fileUpload"
        action="string"
      >
      <slot>
          <el-button size="mini" type="primary">上传</el-button>
        </slot>
      </el-upload>

      <ul v-if="fileList.length >0" class="file-list-upload clear">
        <li v-for="(item,index) in fileList" :key="index">
          <el-tooltip :content="item.name" class="item" effect="dark" placement="top">
            <p
              class="file-name"
            >{{ index+1 }}、{{ item.name }} {{ item.size }} {{ item.createTime }} {{ item.userName }}</p>
          </el-tooltip>
          <div class="file-div">
            <span class="file-pre">
              <el-progress :percentage="item.percentage" :status="item.status"></el-progress>
            </span>
            <span>
              <el-icon v-show="item.percentage < 100" class="icon-btn" title="取消上传" @click="cancelUpload(index)">
                <IconEpUpload />取消上传
              </el-icon>
            </span>
            <span>
              <el-icon v-if="!isShow && item.percentage == 100" class="icon-btn" title="删除" @click="handleRemove(index)">
                <IconEpDelete />
              </el-icon>
              <el-icon v-if="isShow" class="icon-btn" title="下载" @click="fileDownload(item)">
                <IconEpDownload />
              </el-icon>
              <el-icon v-if="tempType === 'tempFile' && !isShow" class="icon-btn" title="下载" @click="fileDownload(item)">
                <IconEpDownload />
              </el-icon>
            </span>
            <span v-if="useType && item.percentage == 100">
              <el-icon class="icon-btn" title="查看" @click="handleLook(item)">
                <IconEpView />
              </el-icon>
            </span>
          </div>
        </li>
      </ul>
      <span v-if="disabled && !fileList.length">无</span>
    </div>
    <div v-if="subType === 'card'">
      <!-- multiple -->
      <el-upload
        ref="pictureCard"
        :before-upload="beforeAvatarUpload"
        :http-request="fileUpload"
        :on-exceed="handleExceed"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemoveImg"
        :file-list="fileList"
        :disabled="disabled"
        :class="{noplus:noPlus}"
        action="#"
        list-type="picture-card"
      >
        <el-icon>
          <IconEpPlus />
        </el-icon>
      </el-upload>

      <el-dialog
        v-model="visible"
        :append-to-body="true"
        :modal-append-to-body="false"
        :destroy-on-close="true"
        title="预览"
        class="view-dia"
      >
        <div style="margin-bottom: 10px;font-size: 12px;">{{ checkPic.fileName }}</div>
        <img :src="imageUrl1" style="height: 400px;" alt />
        <template #footer>
          <span class="dialog-footer text-right">
            <el-button size="mini" type="primary" @click="imgDownload()">下 载</el-button>
            <el-button size="mini" type="primary" @click.native="closeVisible">关 闭</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div v-if="subType === 'behalf'">
      <el-upload
        :before-upload="beforeAvatarUpload"
        :http-request="fileUpload"
        :show-file-list="false"
        :disabled="disabled"
        action="#"
        list-type="picture-card"
        style="display: inline-block;"
        class="avatar-uploader"
      >
        <img v-if="imageUrl1" :src="imageUrl1" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon" >
          <IconEpPlus />
        </el-icon>
      </el-upload>
    </div>
    <div v-if="subType === 'fileImg'">
      <el-upload
        :show-file-list="false"
        :on-exceed="handleExceed"
        :before-upload="beforeAvatarUpload"
        :http-request="fileUpload"
        action="string"
      >
        <slot>
          <el-button size="mini" type="primary">上传</el-button>
        </slot>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { dateFormatNoTimes } from './libs/tools'
import { useAppStore } from '@/stores/app.js'
import { mapState } from 'pinia'
import {
  accessKey,
  bucketName,
  endPoint,
  secretKey,
  videoBucketName
} from './libs/obsData.js'
import obsFileDownload from './obsDownload'
import compressionImage from './libs/imageCompressor'
export default {
  name: '',
  props: {
    inner: {
      type: Boolean,
      default: false,
    },
    limit: {
      // 数量
      type: Number,
      default: null,
    },
    fileSize: {
      // 大小
      type: Number,
      default: () => 25,
      required: false, // 声明参数可选
    },
    size: {
      type: Object,
      default: () => ({
        width: 1000,
        height: 1000,
      }),
      required: false, // 声明参数可选
    },
    extension: {
      // 上传附件类型
      type: Array,
      default: () => [],
    },
    // 要排除上传的附件类型
    excludeExtension: {
      // 上传附件类型
      type: Array,
      default: () => [],
    },
    inFileList: {
      // 回显附件列表
      type: Array,
      default: () => [],
    },
    subType: {
      // 上传展示方式  file为list  card 为图片card
      type: String,
      default: 'file',
    },
    disabled: {
      // 是否禁用上传
      type: Boolean,
      default: false,
    },
    showFileList: {
      // 是否展示list列表
      type: Boolean,
      default: true,
    },
    uploadType: {
      // 组件的类型
      type: String,
      default: '',
    },
    routeType: {
      // 组件的类型
      type: String,
      default: '',
    },
    systemType: {
      type: String,
      default: 'question',
    },
    widgetDisable: {
      type: Boolean,
      default: false,
    },
    tempType: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    useType: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: null,
    },
    noPlus: {
      type: Boolean,
      default: false,
    },
    ssr: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(useAppStore, ['userInfo']),
    companyId() {
      return this.userInfo.companyId
    },
  },
  data() {
    return {
      fileList: [], // 文件列表 obj
      dataList: [], // 文件列表 file
      returnList: [], // 返回的文件列表
      cancelList: [], // 取消上传的文件列表
      obsClient: null,
      visible: false,
      isLimit: true,
      imageUrl1: '',
      dayTime: dateFormatNoTimes(new Date()),
      isShow: false,
      downFiles: [],
      uploadDisabled: false,
      changePicData: {},
      checkPic: {},
      newInFileList: [],
    }
  },
  watch: {
    inFileList: {
      immediate: true,
      deep: true,
      handler: function(newVal, oldVal) {
        this.newInFileList = newVal
        for (let i = 0; i < this.newInFileList.length; i++) {
          if (
            this.newInFileList[i] == '' ||
            typeof this.newInFileList[i] === 'undefined'
          ) {
            this.newInFileList.splice(i, 1)
            i = i - 1
          }
        }
        for (let i = 0; i < this.fileList.length; i++) {
          if (this.fileList == '' || typeof this.fileList[i] === 'undefined') {
            this.fileList.splice(i, 1)
            i = i - 1
          }
        }
        if (this.newInFileList.length) {
          const newList = this.getArrDifSameValue(this.fileList, this.newInFileList)
          const newLista = this.getArrDifSameValue(
            this.fileList,
            this.newInFileList
          )
          if (newList.length) {
            for (let i = 0; i < newList.length; i++) {
              newList[i].status = 'success'
              newList[i].percentage = 100
              newList[i].name = newList[i].fileName
              if (this.subType === 'card') {
                // newList[i].url = import.meta.env.VITE_OBS_URL + newList[i].filePath
                // newList[i].url = 'fddffds.jpg'
                newList[i].url = import.meta.env.VITE_OBS_URL + newList[i].filePath + '?x-image-process=image/resize,m_lfit,h_108,w_108'
              }
            }
            this.fileList = this.fileList.concat(newList)
            this.returnList = this.returnList.concat(newLista)
            // this.fileList = this.getArrDif(this.fileList)
          }
        } else {
          this.fileList = []
          this.returnList = []
        }
        if (this.limit) {
          for (var i = 0; i < this.fileList.length; i++) {
            if (
              this.fileList[i] === '' ||
              typeof this.fileList[i] === 'undefined'
            ) {
              this.fileList.splice(i, 1)
              i = i - 1
            }
          }
          if (this.fileList.length < this.limit) {
            this.isLimit = true
          } else {
            this.isLimit = false
          }
        } else {
          this.isLimit = true
        }
      },
    },

    widgetDisable: function() {
      this.isShow = this.widgetDisable
    },
    imageUrl: {
      deep: true,
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.imageUrl1 = import.meta.env.VITE_OBS_URL + newVal
        } else {
          this.imageUrl1 = ''
        }
      },
      immediate: true,
    },
  },

  mounted() {
    // 创建ObsClient实例
    this.obsClient = new ObsClient({
      access_key_id: accessKey,
      secret_access_key: secretKey,
      server: endPoint,
      timeout: 1 * 10000,
    })
    if (this.imageUrl) {
      this.imageUrl1 = import.meta.env.VITE_OBS_URL + this.imageUrl
    } else {
      this.imageUrl1 = ''
    }

    if (this.newInFileList.length) {
      const newList = this.getArrDifSameValue(this.fileList, this.newInFileList)

      if (newList.length) {
        for (var i = 0; i < newList.length; i++) {
          newList[i].status = 'success'
          newList[i].percentage = 100
          newList[i].name = newList[i].fileName
          if (this.subType === 'card') {
            newList[i].newPath = import.meta.env.VITE_OBS_URL + newList[i].filePath
            newList[i].url = import.meta.env.VITE_OBS_URL + newList[i].filePath + '?x-image-process=image/resize,m_lfit,h_108,w_108'
          }
        }

        this.fileList = this.fileList.concat(newList)
        this.returnList = this.returnList.concat(newList)
      }
    } else {
      // this.fileList = []
      // this.returnList = []
    }

    this.isShow = this.widgetDisable
  },
  updated() {},
  methods: {
    generateUUID() {
      var d = new Date().getTime()
      if (window.performance && typeof window.performance.now === 'function') {
        d += performance.now() // use high-precision timer if available
      }
      var uuid = 'xxxxxxxy-yxxx-8xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function(c) {
          var r = (d + Math.random() * 16) % 16 | 0
          d = Math.floor(d / 16)
          return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
        }
      )
      return uuid
    },

    obsUpload(file, preview) {
      const _this = this
      const fileObj = file
      fileObj.status = 'uploading'
      fileObj.percentage = 0
      fileObj.cp = {}
      fileObj.hook = ''
      this.dataList.push(file)
      this.fileList.push({
        name: file.name,
        uid: file.uid,
        status: null,
        percentage: file.percentage,
        cp: file.cp,
        hook: file.hook,
        cancel: false,
      })
      let testmsg = String(file.name).substring(
        String(file.name).lastIndexOf('.') + 1
      )
      testmsg = testmsg.toLowerCase()
      const objectKey = _this.companyId + '\/' + this.systemType + '\/' + (_this.routeType ? (_this.routeType + '\/') : '') + _this.dayTime + '\/' + this.generateUUID() + '.' + testmsg // 文件的uuid
      const id = this.generateUUID().replace(/-/g, '')
      _this.obsClient
        .uploadFile({
          Bucket: this.ssr ? videoBucketName : bucketName,
          Key: objectKey,
          Metadata: {
            property: 'property-value',
          },
          SourceFile: fileObj,
          // PartSize: 1 * 1024,
          TaskNum: 3,
          Metadata: {
            originfilename: escape(file.name),
          },
          // 获取上传进度的回调函数
          ProgressCallback: function(transferredAmount, totalAmount) {
            _this.progressCallback.call(
              _this,
              fileObj,
              transferredAmount,
              totalAmount
            )
          },
          // 获取上传事件的回调函数
          EventCallback: function(eventType, eventParam, eventResult) {
            // 处理事件响应
          },
          // 获取断点续传控制参数的回调函数
          ResumeCallback: function(resumeHook, uploadCheckpoint) {
            // 获取取消断点续传上传任务控制参数
            fileObj.hook = resumeHook
            // 存储断点续传记录对象
            fileObj.cp = uploadCheckpoint
          },
        })
        .then(function(result) {
          if (result.CommonMsg.Status < 300) {
            _this.successSetFile(result, fileObj, id) // 成功后执行
          } else {
            //  _this.errSetFile(fileObj,fileObj.cp)
          }
        })
        .catch(function(err) {
          console.error(err)
          //  _this.errSetFile(fileObj,fileObj.cp)
        })
      // });
    },
    progressCallback(fileObj, transferredAmount, totalAmount) {
      const _this = this
      if (fileObj.amount && transferredAmount) {
        const speed =
          (transferredAmount - fileObj.amount) / 1048576 >= 1
            ? ((transferredAmount - fileObj.amount) / 1048576).toFixed(2) + 'MB'
            : ((transferredAmount - fileObj.amount) / 1024).toFixed(2) + 'KB'

        fileObj.speed = speed // 上传速度
      }
      fileObj.amount = transferredAmount // 已上传的字节数(用于计算上传速度)
      fileObj.percent = Math.floor((transferredAmount * 100) / totalAmount)
      fileObj.percentage = Math.floor((transferredAmount * 100) / totalAmount)
      this.$emit('getPercent', fileObj.percent)
      this.$emit('startUp')
      _this.fileList.filter(item => {
        if (item.uid == fileObj.uid) {
          item.percentage = fileObj.percentage
          item.speed = fileObj.speed
          item.status = fileObj.percentage == 100 ? 'success' : null
        }
      })
      // this.statusSet(fileObj, Math.floor((transferredAmount * 100.0) / totalAmount), objectKey); //  // 将文件上传状态改为进度条
    },

    /**
     * err报错（手动暂停、取消）后执行
     * @param {file} file 文件
     * @param {Object} fileObj 本条上传文件相关的信息
     */
    errType(file, fileObj) {
      const _this = this
      if (fileObj.cancelManually) {
        // 用于判断是手动暂停的
        fileObj.errSetFileArguments = [file, fileObj]
      } else {
        // 如果不是手动暂停的则自动重新执行
        fileObj.errNumber ? (fileObj.errNumber += 1) : (fileObj.errNumber = 1)
        if (fileObj.errNumber > 50) return this.statusSet(fileObj, 'error') // 重新执行次数过多后将状态改为失败
        _this.errSetFile(file, fileObj) // 自动重新执行
      }
    },

    /**
     * 报错（手动暂停、取消）后重新执行
     * @param {Object} file 文件(fileList中errSetFileArguments)
     * @param {Object} fileObj fileList中对应参数(fileList中errSetFileArguments)
     */
    errSetFile(file, fileObj) {
      const _this = this
      // 删除手动运行判断
      fileObj.errSetFile = false
      // _this.getObsClient(accessKey, secretKey, endPoint)
      _this.obsClient.uploadFile(
        {
          UploadCheckpoint: fileObj.cp,
          // 获取上传进度的回调函数
          ProgressCallback: function(transferredAmount, totalAmount) {
            _this.progressCallback.call(
              _this,
              fileObj,
              transferredAmount,
              totalAmount
            )
          },
          EventCallback: function(eventType, eventParam, eventResult) {
            // 处理事件响应
          },
          ResumeCallback: function(resumeHook, uploadCheckpoint) {
            // 获取取消断点续传上传任务控制参数
            fileObj.hook = resumeHook
            // 存储断点续传记录对象
            fileObj.cp = uploadCheckpoint
          },
        },
        function(err, result) {
          if (err) {
            _this.errType.call(_this, file, fileObj)
          } else {
            if (result.CommonMsg.Status < 300) {
              const key = result.InterfaceResult.Key
              _this.successSetFile(result, fileObj, id) // 成功后执行
            } else {
              _this.statusSet(fileObj, 'error') //  // 将文件上传状态改为失败
            }
          }
        }
      )
    },
    // 成功之后
    successSetFile(result, fileObj, id) {
      let fd = {
        fileList: [],
        index: null,
      }
      var result = {
        fileName: fileObj.name,
        filePath: fileObj.cp.key,
        bucket: fileObj.cp.bucket,
        uid: fileObj.uid,
        endPoint: endPoint,
        id: id,
        fileSize: fileObj.size,
        // playTime: videoPlayTime(import.meta.env.VITE_OBS_URL + fileObj.cp.key)
      }
      if (this.subType === 'behalf') {
        this.imageUrl1 = import.meta.env.VITE_OBS_URL + result.filePath
      } else {
        this.returnList.push({
          fileName: fileObj.name,
          filePath: fileObj.cp.key,
          bucket: fileObj.cp.bucket,
          uid: fileObj.uid,
          endPoint: endPoint,
          url: import.meta.env.VITE_OBS_URL + fileObj.cp.key + '?x-image-process=image/resize,m_lfit,h_108,w_108',
          id: id,
          fileSize: fileObj.size,
          // playTime: videoPlayTime(import.meta.env.VITE_OBS_URL + fileObj.cp.key)
        })
        // 先去掉不含有id属性的的图片
        // for (var i = 0; i < this.fileList.length; i++) {
        //   if (!this.fileList[i].id) {
        //     this.fileList.splice(i, 1);
        //   }
        // }
        this.fileList.push({
          fileName: fileObj.name,
          name: fileObj.name,
          filePath: fileObj.cp.key,
          bucket: fileObj.cp.bucket,
          uid: fileObj.uid,
          endPoint: endPoint,
          url: import.meta.env.VITE_OBS_URL + fileObj.cp.key + '?x-image-process=image/resize,m_lfit,h_108,w_108',
          percentage: 100,
          status: 'success',
          id: id,
          fileSize: fileObj.size,
          // playTime: videoPlayTime(import.meta.env.VITE_OBS_URL + fileObj.cp.key)
        })

        if (this.subType === 'card') {
          const returnList = JSON.parse(JSON.stringify(this.returnList))
          returnList.forEach(el => {
            el.percentage = 100
            el.status = 'success'
          })
          this.fileList = returnList
        } else {
          this.fileList = this.getArrAllDif(this.fileList)
          this.fileList = this.getArrDif(this.fileList)
        }

        // }
      }

      // if (this.fileList.length === this.returnList.length) {
      //     // this.$emit('returnFileList', this.returnList)
      //     console.log(this.returnList)
      //     this.$emit('returnFileList', this.returnList)

      // }

      // let fd = new FormData();
      // fd.append("fileList", this.fileList);
      // fd.append("index", this.index);
      fd = {
        fileList: this.fileList,
        index: this.index,
      }
      this.$emit('returnFileList', this.fileList)
      this.$emit('returnFile', result)
      this.$emit('returnSafeFiles', fd)
      if (this.limit) {
        for (var i = 0; i < this.fileList.length; i++) {
          if (
            this.fileList[i] === '' ||
            typeof this.fileList[i] === 'undefined'
          ) {
            this.fileList.splice(i, 1)
            i = i - 1
          }
        }
        if (
          this.fileList.length == this.limit ||
          this.fileList.length > this.limit
        ) {
          this.isLimit = false
        }
      }
    },
    // 解决上传多个文件冲突
    getArrAllDif(arr) {
      const newArr = JSON.parse(JSON.stringify(arr))
      for (var i = 0; i < arr.length; i++) {
        for (var k = 0; k < newArr.length; k++) {
          if (arr[i].uid === newArr[k].uid && !arr[i].id) {
            arr[i].id = newArr[k].id
            arr[i].url = newArr[k].url
            arr[i].fileSize = newArr[k].fileSize
            arr[i].filePath = newArr[k].filePath
            arr[i].fileName = newArr[k].name
            arr[i].endPoint = newArr[k].endPoint
            arr[i].bucket = newArr[k].bucket
          }
        }
      }
      return arr
    },
    /**
     * 暂停上传
     * @param {Object} item fileList-item
     */
    pauseUpload(it, type) {
      this.fileList.filter(item => {
        if (item.uid == it.uid) {
          item.cancel = true // 用于判断文件暂停 显示继续按钮
        }
      })
      this.dataList.filter(item => {
        if (item.uid == it.uid) {
          item.cancel = true // 用于判断文件暂停 显示继续按钮

          item.cancelManually = true // 用于判断是手动暂停的
          item.hook.cancel()
          this.statusSet(item, 'pause') // 将文件上传状态改为暂停
        }
      })
    },
    /**
     * 继续上传
     * @param {Object} item fileList-item
     */
    continueUpload(it) {
      this.dataList.filter(item => {
        if (item.uid == it.uid) {
          this.errSetFile(...item.errSetFileArguments)
        }
      })
      this.fileList.filter(item => {
        if (item.uid == it.uid) {
          item.cancel = false // 用于判断文件暂停 隐藏继续按钮
        }
      })
    },
    // 成功、失败回调函数
    statusSet(fileObj, type, objectKey) {
      const _this = this

      this.obsClient.uploadFile(
        {
          Bucket: this.ssr ? videoBucketName : bucketName,

          Key: objectKey,
          Metadata: {
            property: 'property-value',
          },
          SourceFile: fileObj,
          PartSize: 1 * 1024,
          TaskNum: 3,
          // 获取上传进度的回调函数
          ProgressCallback: function(transferredAmount, totalAmount) {
            _this.progressCallback.call(
              _this,
              fileObj,
              transferredAmount,
              totalAmount
            )
          },
          // 获取上传事件的回调函数
          EventCallback: function(eventType, eventParam, eventResult) {
            // 处理事件响应
          },
          // 获取断点续传控制参数的回调函数
          ResumeCallback: function(resumeHook, uploadCheckpoint) {
            // 获取取消断点续传上传任务控制参数
            fileObj.hook = resumeHook
            // 存储断点续传记录对象
            fileObj.cp = uploadCheckpoint
          },
        },
        function(err, result) {
          if (err) {
            if (fileObj.cancelManually) {
              // true: 手动暂停的
              fileObj.errSetFileArguments = [file, fileObj] // 用户点击继续时执行所需要的参数[文件，本条上传文件相关的信息]
            } else {
            }
          }
        }
      )
    },
    upload(e) {
      for (const v of e.target.files) {
        this.obsUpload(v)
      }
    },
    fileUpload(item) {
      // 如果是图片进行需要进行压缩
      const sufFix = item.file.name
        .substring(item.file.name.lastIndexOf('.') + 1)
        .toLowerCase()
      if (['jpg', 'png', 'gif', 'jpeg', 'bmp', 'svg'].indexOf(sufFix) > -1) {
        let isSize = false
        if (this.fileSize) {
          isSize = item.file.size / 1024 / 1024 > this.fileSize
        } else {
          isSize = item.file.size / 1024 / 1024 > 25
        }
        if (isSize) {
          // 对超过大小的文件进行压缩处理
          compressionImage(item.file)
            .then(res => {
              this.obsUpload(res)
            })
            .catch(e => {
              ElMessage.error('压缩图片报错')
            })
        } else {
          this.obsUpload(item.file)
        }
      } else {
        this.obsUpload(item.file)
      }
    },
    handleRemove(index) {
      // this.cancelUpload(index)
      const obj = this.fileList[index]
      this.returnList.forEach((el, inx) => {
        // 返回数据删除已删除obj
        if (this.returnList[inx].uid == obj.uid) {
          this.returnList.splice(inx, 1)
        }
      })
      this.dataList.forEach((el, inx) => {
        // 附件数据删除已删除附件
        if (this.dataList[inx].uid == obj.uid) {
          this.dataList.splice(inx, 1)
        }
      })
      this.fileList.splice(index, 1) // 列表数据删除已删除obj
      this.$emit('returnFileList', this.fileList)
      this.$emit('removeFile', obj)

      if (this.limit) {
        for (var i = 0; i < this.fileList.length; i++) {
          if (
            this.fileList[i] === '' ||
            typeof this.fileList[i] === 'undefined'
          ) {
            this.fileList.splice(i, 1)
            i = i - 1
          }
        }
        if (this.fileList.length < this.limit) {
          this.isLimit = true
        }
      }
    },
    cancelUpload(index) {
      this.cancelList.push(this.fileList[index])
      this.dataList.filter(item => {
        if (item.uid == this.fileList[index].uid) {
          item.cancelManually = true // 用于判断是手动暂停的
          item.hook.cancel()
        }
      })
      this.fileList.splice(index, 1)
    },

    uploadOk() {
      this.$emit('returnFileList', this.returnList)
      this.returnList = []
      this.fileList = []
      this.dataList = []
      // this.$root.$emit("showUpload", false);
    },
    resetForm() {
      this.returnList = []
      this.fileList = []
      this.dataList = []
      // this.inner = false
      // this.$root.$emit("showUpload", false);
    },
    beforeAvatarUpload(file) {
      if (Array.isArray(this.excludeExtension) && this.excludeExtension.length > 0) {
        let fileTypes = ''
        for (var i = 0; i < this.excludeExtension.length; i++) {
          fileTypes += this.excludeExtension[i] + '/'
        }
        fileTypes = fileTypes.substring(0, fileTypes.length - 1)
        let fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
        fileType = fileType.toLowerCase()
        let isSize = true
        let isPic = true
        const availableType = !this.excludeExtension.includes(fileType)

        isPic =
          ['jpg', 'png', 'gif', 'jpeg', 'bmp', 'svg'].indexOf(fileType) > -1

        if (this.fileSize) {
          isSize = file.size / 1024 / 1024 < this.fileSize
        }
        if (!availableType) {
          ElMessage.error(`上传格式不正确，不能为 ${fileTypes}格式！！`)
        }
        if (!isSize && isPic) {
          // 如果超过大小限制则 进行压缩
          ElMessage.info(
            `上传文件大小超过 ${this.fileSize}M！！将进行压缩处理！`
          )
        }
        return availableType
      } else {
        let fileTypes = ''
        for (var i = 0; i < this.extension.length; i++) {
          fileTypes += this.extension[i] + '/'
        }
        fileTypes = fileTypes.substring(0, fileTypes.length - 1)
        let fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
        fileType = fileType.toLowerCase()
        let availableType = true
        let isSize = true
        let isPic = true
        if (this.extension.length) {
          availableType = this.extension.indexOf(fileType) > -1
        }
        isPic =
          ['jpg', 'png', 'gif', 'jpeg', 'bmp', 'svg'].indexOf(fileType) > -1
        if (this.fileSize) {
          isSize = file.size / 1024 / 1024 < this.fileSize
        }
        if (!availableType) {
          ElMessage.error(`上传格式不正确，只能为 ${fileTypes}格式！！`)
        }
        if (!isSize && isPic) {
          // 如果超过大小限制则 进行压缩
          ElMessage.info(
            `上传文件大小超过 ${this.fileSize}M！！将进行压缩处理！`
          )
        }
        return availableType
      }
    },
    handleRemoveImg(file, fileList) {
      if (file && file.status === 'success') {
        this.fileList.splice(this.fileList.indexOf(file), 1) // 列表数据删除已删除obj
        this.returnList.splice(this.returnList.indexOf(file), 1) // 列表数据删除已删除obj
        this.dataList.splice(this.dataList.indexOf(file), 1) // 列表数据删除已删除obj
        this.$emit('returnFileList', fileList)
        this.$emit('removeFile', file)
      }

      // this.$emit('returnFileList', this.returnList)
    },
    handlePictureCardPreview(file) {
      this.checkPic = file
      this.changePicData = file
      this.imageUrl1 = import.meta.env.VITE_OBS_URL + file.filePath
      this.visible = true
    },
    closeVisible() {
      this.visible = false
    },
    handleExceed(files, fileList) {
      ElMessage.warning(
        `共选择了 ${files.length +
          fileList.length} 个文件，超出上传总数量限制，请联系管理员！`
      )
    },
    getArrDif(arr) {
      var obj = {}
      arr = arr.reduce(function(item, next) {
        obj[next.uid] ? '' : (obj[next.uid] = true && item.push(next))
        return item
      }, [])
      return arr
    },
    getArrDifSameValue(arr1, arr2) {
      arr1 = this.getArrDif(arr1)
      arr2 = this.getArrDif(arr2)
      arr2 = arr2.filter(item => {
        const arrlist = arr1.map(v => v.uid)
        return !arrlist.includes(item.uid)
      })
      return arr2
    },
    imgDownload() {
      obsFileDownload(this.changePicData.filePath, this.changePicData.fileName)
    },
    fileDownload(file) {
      // let files = {}
      // let fileName = file.fileName.substring(0, file.fileName.lastIndexOf("."))
      // let fileExe = file.fileName.substring(file.fileName.lastIndexOf(".") + 1)

      // if (fileName && fileName.length > 4) {
      //     fileName = fileName.substring(0, 4) + ' ··· ';
      // }
      // files.fileName = fileName + '.' + fileExe
      // files.code = this.generateUUID().replace(/-/g, '')
      // this.downFiles.unshift(files)
      // sessionStorage.setItem('downFiles', JSON.stringify(this.downFiles))

      // timer = setInterval(() => {

      //     this.downFiles = JSON.parse(sessionStorage.getItem('downFiles')) || []
      //     timerNum++

      //     if (!this.downFiles.length) {
      //         clearInterval(timer)
      //         sessionStorage.removeItem('downFiles')
      //         timerNum = 0
      //         if (this.$store.state.downFilesInner) {
      //             this.$store.commit("SET_DOWNFILESINNER");
      //         }
      //     }
      //     if (!timerNum) {
      //         clearInterval(timer)

      //     }
      //     console.log(timerNum)

      // }, 20)
      // if (!this.$store.state.downFilesInner) {
      //     this.$store.commit("SET_DOWNFILESINNER");
      // }

      obsFileDownload(file.filePath, file.fileName)
    },
    handleLook(file) {
      this.$emit('lookFile', file)
    },
  },
}
</script>
<style scoped>
.file-name {
  overflow: hidden;
  width: 100%;
  font-size: 12px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cancel-upload {
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: red;
}
.delete-upload {
  cursor: pointer;
}
.height-center {
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
}
.clear::after {
  content: "";
  display: block;
  clear: both;
}
.clear {
  zoom: 1;
}
.upload-component {
  width: 100%;
}
.upload-component :deep(.el-upload-list__item) {
  transition: none !important;
}
.upload-component :deep(.el-list-leave-active) {
  transition: none;
}
.upload-component :deep(.el-list-leave-to) {
  transition: none;
}
.file-list-upload li {
  position: relative;
  float: left;
  margin-top: 5px;
  padding-right: 15px;
  width: 50%;
  font-size: 14px;
  border-radius: 4px;
  color: #606266;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  line-height: 1.8;
  box-sizing: border-box;
}
.file-div {
  display: inline-block;
  width: 90%;
}
.file-pre {
  display: inline-block;
  width: 70%;
}
.avatar-uploader .el-upload {
  position: relative;
  overflow: hidden;
  border: 1px dashed #D9D9D9;
  border-radius: 6px;
  cursor: pointer;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  width: 110px;
  height: 110px;
  font-size: 28px;
  text-align: center;
  color: #8C939D;
  line-height: 120px;
}
.avatar {
  display: block;
  width: 120px;
  height: 120px;
}
.view-dia :deep(.el-dialog__body) {
  text-align: center;
}
.icon-btn {
  margin-right: 8px;
  cursor: pointer;
}
.noplus :deep(.el-upload--picture-card) {
  display: none !important;
}
</style>
