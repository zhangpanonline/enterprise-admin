<template>
  <el-dialog v-model="visible" :close-on-click-modal="false" :close-on-press-escape="false" title="分配负责人" width="500px">
    <ul class="wrap">
      <li>
        <span>分配给</span>
        <el-popover
          placement="bottom-start"
          width="250"
          trigger="click">
          <div>
            <p>
              <el-input v-model="searchName" placeholder="请输入姓名/电话搜索" clearable @input="getManagerUser" />
            </p>
            <el-row class="overflow_y_200">
              <el-radio-group v-model="selectId">
                <el-col v-for="v in list" :key="v.id" :span="24" class="padding_col_10">
                  <el-radio :label="v.id">
                    {{ v.name }} {{ v.tel }}
                    <span style="color: #FF5222;">({{ v.count }})</span>
                  </el-radio>
                </el-col>
              </el-radio-group>
            </el-row>
          </div>
          <template #reference>
            <span style="cursor: pointer;">
              <el-icon><IconEpPlus /></el-icon>
              添加
            </span>
          </template>
        </el-popover>
      </li>
      <li>
        <span v-if="selectId" class="user">
          <span class="circle">{{ list[selectId]['name'] }}</span>
          {{ list[selectId]['name'] }}
          <i class="el-icon-close" title="移除" @click="selectId = ''"></i>
        </span>
      </li>
      <li>
        <span>
          已选择 <b>{{ total }} 债权</b>
        </span>
        <el-button type="primary" size="mini" @click="onSubmit()">分 配</el-button>
      </li>
    </ul>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      list: {},
      selectId: '',
      searchName: '',
      total: 0,
      projectId: '',
      creditorTypes: '',
    }
  },
  methods: {
    close() {
      this.visible = false
      this.selectId = ''
    },
    onSubmit() {
      this.$emit('ok', this.selectId)
    },
    // 获取管理人团队成员
    async getManagerUser() {
      try {
        const params = {
          projectId: this.projectId,
          companyId: useAppStore().userInfo.companyId,
          pageNum: 1,
          pageSize: 200,
          searchStr: this.searchName,
          creditorTypes: this.creditorTypes,
        }
        const res = await getCaseMembersByCompanyApi(params)
        if (res.success) {
          if (!res.data) return false
          this.list = res.data.records.reduce((acc, cur) => {
            const { id, phone: tel, chineseName: name, count } = cur
            acc[cur.id] = { id, tel, name, count }
            return acc
          }, {})
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
  },
}
</script>

<style scoped>
.padding_col_10 {
  padding-top: 10px;
  padding-bottom: 10px;
}
.overflow_y_200 {
  height: 200px;
  overflow-y: auto;
}
.el-dialog__body {
  padding: 12px 20px;
}
.wrap {
  display: grid;
  grid-template-rows: 50px 50px 50px;
}
.wrap li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user {
  width: 150px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #a6948033;
  border-radius: 36px;
  position: relative;
  height: 36px;
}
.circle {
  width: 36px;
  height: 36px;
  border: 1px solid #a6948033;
  border-radius: 50%;
  color: #fff;
  background: #a6948088;
  font-size: 12px;
  text-align: center;
  overflow: hidden;
  box-sizing: border-box;
  line-height: 32px;
}
.el-icon-close {
  position: absolute;
  right: 1em;
  color: #a6948088;
  cursor: pointer;
}
.el-icon-close:hover {
  color: red;
}
</style>
