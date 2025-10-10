<!--  -->
<template>
  <el-dialog
    v-model="fileVisible"
    :close-on-click-modal="!fileVisible"
    :close-on-press-escape="!fileVisible"
    :before-close="handleClose"
    title="记录详情"
    width="60%"
    class="fileVisible"
    top="15vh"
  >
    <el-form ref="ruleForm" label-width="130px" class="demo-ruleForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="登记人：" prop="userName">
            {{ details.userName }}
          </el-form-item></el-col
        >
        <el-col :span="12">
          <el-form-item label="登记时间：" prop="userName">
            {{details. createTime }}
          </el-form-item></el-col
        >
        <el-col :span="12">
          <el-form-item label="案件阶段" prop="casePhase">{{
            details.dictLabel
          }}</el-form-item></el-col
        >
        <el-col :span="12">
          <el-form-item label="案件状态：" prop="caseStatus">
            {{ details.caseStatus == 2 ? "审理中" : "已结案" }}</el-form-item
          ></el-col
        >
        <el-col :span="24">
          <el-row>
            <el-col :span="8" v-if="details.showWarn">
              <el-form-item label="提醒内容：" prop="sendContent">
                {{ details.sendContent }}
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="details.showWarn">
              <el-form-item label="提醒时间：" prop="sendDate">
                {{ timestampToTime(details.sendDate) }}</el-form-item
              >
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="24">
          <el-form-item label="跟进详细记录：" prop="recordDetails">
            {{ details.recordDetails }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件：" prop="userName">
            <ul class="fileBox">
              <li
                v-for="(item, index) in details.files"
                :key="index"
                @click="handleDownload(item)"
              >
                {{ item.fileName }}

                <i class="el-icon-download"></i>
              </li>
            </ul>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div></div>

    <div slot="footer" class="dialog-footer text-right">
      <el-button size="small" @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import fileDownload from '@/components/HuaweiObsUpload/obsDownload.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      fileVisible: true,
    }
  },
  props: {
    details: {
      type: Object,
      default: () => {},
    },
  },
  // 监听属性 类似于data概念
  computed: {

  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    handleClose() {
      this.$emit('setclose')
    },
    handleDownload(val) {
      fileDownload(val.filePath, val.fileName)
    },

    timestampToTime(timestamp) {
      // 时间戳为10位需*1000，时间戳为13位不需乘1000
      var date = new Date()
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '

      return Y + M + D
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeUnmount() {}, // 生命周期 - 销毁之前
  unmounted() {}, // 生命周期 - 销毁完成
  activated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style  scoped>

  li {
    cursor: pointer;
  }
    i {
      margin-left: 8px;
    }
</style>
