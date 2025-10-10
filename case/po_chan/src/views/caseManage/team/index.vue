<template>
  <div style="overflow: auto; height: 100%" class="all-con">
    <div class="bg-white h-15 leading-15 font-bold text-base px-5 border-b-8 border-b-undertone flex justify-between items-center">
      {{ $route.meta.title }}
    </div>
    <el-row class="h-full-15">
      <el-col
        v-show="hasTree === 1"
        style="
          width: 300px;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          border-right: 2px solid #255867;
          flex: inherit;
        "
      >
        <div class="template-title">
          <p
            :class="allClick ? 'template-color' : ''"
            class="template-p"
            @click="resetComListData"
          >
            全部
          </p>
        </div>
        <div class="accordion">
          <div style="font-size: 14px">
            <el-tree
              v-if="!treeLoad"
              ref="elTree"
              :data="treeDate"
              :expand-on-click-node="false"
              node-key="id"
              accordion
              default-expand-all
              @current-change="clickTreeData"
            >
              <template #default="{ node, data }">
                <div
                  :class="treeStep.UUID === data.UUID ? 'stepColor' : ''"
                  class="custom-tree-node"
                >
                  <span
                    :title="node.label"
                    class="font"
                    style="width: 95%; display: inline-block"
                    >{{ node.label }}</span
                  >
                </div>
              </template>
            </el-tree>
            <div
              v-if="treeLoad"
              style="text-align: center; margin: 30px 0; font-size: 26px"
            >
            <IconEpLoading/>
            </div>
          </div>
        </div>
      </el-col>
      <div class="open-close-div" @click="handleOpen">
        <span style="">
          <el-icon v-show="hasTree !== 1"><IconEpCaretRight/></el-icon>
          <el-icon v-show="hasTree === 1"> <IconEpCaretLeft/></el-icon>

        </span>
      </div>
      <el-col
        :class="hasTree !== 1 ? 'con-right-open' : ''"
        class="con-right"
        style="height: 100%; overflow-y: auto; overflow-x: hidden"
      >
        <!--文档列表-->
        <template v-if="isCompany">
          <div>
            <div class="overview-title">
              <el-row>
              <el-col :span='6'>
                <span>企业名称：</span>
                <el-input
                  v-model="searchData.companyName"
                  size="small"
                  autosize
                  clearable
                  style="width: auto"
                  @input="getComListData(1)"
                ></el-input></el-col>
                <el-col :span="6">
                <el-button
                  v-if="buttonAuth[CREATE_BUTTON]"
                  type="primary"
                  size="small"
                  @click="handleAddCom()"
                  >添加企业
                  </el-button>
                  </el-col>
              </el-row>
            </div>
            <Table :data="comTableData" :columns="comList" @fetchData="handleCurrentChange" @sizeChange="comTableData.pageSize = $event; getComListData(1)"  >
              <template #caozuo="scope">
                <div class="flex gap-2">
                  <span v-if="scope.row.createUser == userId" class="text-primary cursor-pointer "  @click="handleEditCom(scope.row)"> 编辑</span>
                  <span class="text-primary cursor-pointer "  @click="handleAdd(scope.row)"> 添加人员</span>
                  <span class="text-warning cursor-pointer " @click="handleDelCom(scope.row)">删除</span>
                </div>
              </template>
            </Table>
          </div>
        </template>
        <template v-else>
          <div>
            <el-row class="overview-title">
              <el-col :span="6">
                <span>姓名：</span>
                <el-input
                  v-model="searchUserData.chineseName"
                  size="small"
                  clearable
                  style="width: 150px"
                ></el-input>
              </el-col>
              <el-col :span="6">
                <span>手机号码：</span>
                <el-input
                  v-model="searchUserData.phone"
                  size="small"
                  clearable
                  style="width: 150px"
                ></el-input>
              </el-col>

              <span>
                <el-button type="primary" size="small" @click="getpeopleData(1)"
                  >查询</el-button
                >
                <el-button
                  v-if="buttonAuth[CREATE_BUTTON]"
                  type="primary"
                  size="small"
                  @click="handleAddUser()"
                  >添加用户</el-button
                >
              </span>
            </el-row>
            <!-- <p style="font-size: 12px; color: red; margin: 10px">
              * 未实名认证人员，请前往手机APP端实名认证！
            </p> -->

            <el-table
              :data="userTableData"
              style="width: 100%"
              :header-cell-style="headerCellStyle" :row-style="rowStyle"
            >
              <el-table-column
                :resizable="false"
                type="index"
                width="65"
                label="序号"
              ></el-table-column>

              <el-table-column
                :resizable="false"
                :show-overflow-tooltip="true"
                width="150"
                label="姓名"
              >
                <template v-slot="scope">
                  <div class="flex">
                    <img :src="scope.row.path" class="img-1" alt="" />
                    <span
                      style="
                        vertical-align: text-bottom;
                        color: #255867;
                        cursor: pointer;
                        display: inline-block;
                        max-width: 100px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                      "
                      @click="handleEditUser(scope.row, 1)"
                      >{{ scope.row.chineseName }}</span
                    >
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :resizable="false"
                :show-overflow-tooltip="true"
                prop="phone"
                label="手机号"
              ></el-table-column>
              <el-table-column
                :resizable="false"
                :show-overflow-tooltip="true"
                label="性别"
              >
                <template v-slot="scope">
                  <div>
                    {{
                      scope.row.sex === '1'
                        ? '女'
                        : scope.row.sex === '0'
                        ? '男'
                        : ''
                    }}
                  </div>
                </template>
              </el-table-column>
              <template v-for="(item, index) of peopleList">
                <el-table-column
                  v-if="
                    treeStep.parentId === '3fda4fd73fb14834b26076c1af439b60' &&
                    item.key === 'roleName'
                  "
                  :key="index"
                  :prop="item.key"
                  :label="item.label"
                  :show-overflow-tooltip="true"
                >
                </el-table-column>
              </template>

              <el-table-column
              v-if="buttonAuth[EDIT_BUTTON]"
                :resizable="false"
                label="操作"
                width="320px"
              >
                <template v-slot="scope">
                  <div class="flex gap-2">
                  <span class="text-primary cursor-pointer "  @click="handleEditUser(scope.row,2)"> 编辑</span>
                </div>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
             class="h-15 justify-end"
              v-show="userTotal > 0"
              :current-page="searchUserData.pageNum"
              :page-size="searchUserData.pageSize"
              :total="userTotal"
              background
              prev-text="上一页"
              next-text="下一页"
              layout="total, prev, pager, next, jumper"
              @current-change="handleUserChange"
            >
            </el-pagination>
          </div>
        </template>
      </el-col>
    </el-row>
    <!-- 企业 -->
    <el-dialog
      :title="diaTitle"
      v-model="innerVisible"
      :close-on-click-modal="!innerVisible"
      :close-on-press-escape="!innerVisible"
      width="50%"
      class="comVisible-dia"
      top="15vh"
    >
      <el-row>
        <el-col :span="16">
          <span>企业名称：</span>
          <el-input
            v-model="searchAdd.companyName"
            size="small"
            clearable
            placeholder="请输入企业名称"
            style="width: auto"
          ></el-input>
          <el-button
            :disabled="!searchAdd.companyName"
            type="primary"
            size="small"
            style="margin-left: 15px"
            @click="handleSearchCom(1)"
            >查询</el-button
          >
        </el-col>
        <el-col v-if="buttonAuth[CREATE_BUTTON]" :span="2" class="right">
          <el-button type="primary" size="small" @click="handleNewCom()"
            >增加企业</el-button
          >
        </el-col>
      </el-row>

      <el-table
        :data="addTableData"
        size="small"
        stripe
        border
        style="width: 100%; margin-top: 15px; min-height: 250px"
        @selection-change="addComList"
      >
        <el-table-column
          :resizable="false"
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          type="index"
          width="55"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          :show-overflow-tooltip="true"
          prop="companyName"
          label="企业名称"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          :show-overflow-tooltip="true"
          prop="socialCreditCode"
          label="统一代码"
        ></el-table-column>
        <el-table-column :resizable="false" label="企业所属">
          <template v-slot="scope">
            <div>
              <el-select
                v-model="scope.row.companyType"
                :disabled="(scope.row.companyType ? true : false) && isAddCom"
                size="small"
                clearable
                style="width: auto"
                placeholder=""
              >
                <el-option
                  v-for="(item, key) in companyTypes"
                  :value="item.id"
                  :label="item.dictLabel"
                  :key="key"
                ></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          :show-overflow-tooltip="true"
          prop="address"
          label="企业地址"
        ></el-table-column>
      </el-table>

      <el-pagination
        v-show="addTotal > 0"
        :current-page="searchAdd.pageNum"
        :page-size="searchAdd.pageSize"
        :total="addTotal"
        background
        prev-text="上一页"
        next-text="下一页"
        layout="total, prev, pager, next, jumper"
        @current-change="handleAddChange"
      >
      </el-pagination>

      <el-dialog
        :title="diaTitle"
        v-model="comVisible"
        :close-on-click-modal="!comVisible"
        :close-on-press-escape="!comVisible"
        width="750px"
        append-to-body
        top="15vh"
      >
        <el-form
          ref="comForm"
          :model="comForm"
          :rules="comRules"
          label-width="100px"
          size="small"
        >
          <el-form-item label="企业名称：" prop="companyName">
            <el-input v-model="comForm.companyName"></el-input>
          </el-form-item>
          <el-form-item label="统一代码：" prop="socialCreditCode">
            <el-input v-model="comForm.socialCreditCode"></el-input>
          </el-form-item>
          <el-form-item label="企业地址：" prop="companyAddress">
            <el-input v-model="comForm.companyAddress"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="companyPhone">
            <el-input v-model="comForm.companyPhone"></el-input>
          </el-form-item>
        </el-form>
        <div  class="dialog-footer text-right">
          <el-button size="small" @click="comVisible = false">取 消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleAddData('comForm')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <div  class="dialog-footer text-right">
        <el-button size="small" @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleComData"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 用户 -->
    <el-dialog
      :title="diaTitle"
      v-model="userVisible"
      :modal-append-to-body="false"
      :close-on-click-modal="!userVisible"
      :close-on-press-escape="!userVisible"
      width="50%"
      min-width="800"
      class="userVisible-dia"
      top="15vh"
    >
      <div
        class="transfer"
        style="
          overflow: hidden;
          display: flex;
          flex-direction: row;
        "
      >
        <div style="width: 40%; min-width: 200px">
          <div>
            <div>
              备选人员：<span style="float: right"
                >{{ leftCheckedLen }}/{{ memberTotal }}</span
              >
            </div>
            <el-input
              v-model="memberSearchData.userName"
              class="el-transfer-panel__filter "
              style="width: 150px"
              size="small"
              clearable
              @input="leftChange()"
              @mouseenter.native="inputHover = true"
              @mouseleave.native="inputHover = false"
            >
            </el-input>
            <el-checkbox-group
              v-infinite-scroll="loadLeft"
              v-model="leftChecked"
              class="el-transfer-panel__list"
            >
              <el-checkbox
                v-for="item in memberFilter"
                :label="item.key"
                :key="item.userId"
                class="el-transfer-panel__item"
                @change="changeCheck()"
              >
                <span :option="item.key"
                  >{{ item.label }} <span class="check-phone">{{ item.phone }}</span>
                </span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div
          class="el-transfer__buttons"
          style="text-align: center; margin: auto 0"
        >
          <el-button
            :disabled="rightChecked.length === 0"
            type="small"
            @click.native="addToLeft"
          >
            <el-icon><IconEpArrowLeft/></el-icon>
            <span>到左边</span>
          </el-button>
          <el-button
            style="margin: 20px 0px 0px;"
            :disabled="leftChecked.length === 0"
            type="small"
            @click.native="addToRight"
          >
            <span>到右边</span>
            <el-icon style="margin-left: 5px"><IconEpArrowRight/></el-icon>
          </el-button>
        </div>
        <div style="width: 40%; min-width: 200px">
          <div>
            <div style="margin-bottom: 40px">
              已选人员：<span style="float: right"
                >{{ rightCheckedLen }}/{{ memberCkTotal }}</span
              >
            </div>

            <el-checkbox-group
              v-model="rightChecked"
              class="el-transfer-panel__list"
            >
              <el-checkbox
                v-for="item in memberList"
                :label="item.key"
                :disabled="item.disabled"
                :key="item.userId"
                class="el-transfer-panel__item"
                @change="changeCheck()"
              >
                <span :option="item.key"
                  >{{ item.label + (item.disabled ? '（负责人）' : '') }}
                  <span class="check-phone">{{ item.phone }}</span>
                </span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>

      <el-dialog
        :title="diaTitle"
        v-model="userInVisible"
        :close-on-click-modal="!userInVisible"
        :close-on-press-escape="!userInVisible"
        width="750px"
        append-to-body
        destroy-on-close
        top="15vh"
      >
        <el-form
          ref="userForm"
          :model="userForm"
          :rules="userRules"
          label-width="100px"
          size="small"
        >
          <el-form-item label="人员姓名：" prop="chineseName">
            <el-input v-model="userForm.chineseName"></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model="userForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-radio v-model="userForm.sex" label="0">男</el-radio>
            <el-radio v-model="userForm.sex" label="1">女</el-radio>
          </el-form-item>
        </el-form>
        <div  class="dialog-footer text-right">
          <el-button size="small" @click.native="closeAddUser">取 消</el-button>
          <el-button
            type="primary"
            size="small"
            @click.native="handleAddUserData('userForm')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <div class="dialog-footer text-right">
        <el-button
          v-if="
            (isAdd &&
              checkData.companyType &&
              checkData.companyType != 'e0fdb68073184da9ba23798a00bb245d') ||
            (isAdd && !checkData.companyType)
          "
          type="primary"
          plain
          size="small"
          @click="handleNewPeople()"
          >新增人员</el-button
        >

        <el-button
          :disabled="!memberListDis"
          type="primary"
          size="small"
          @click="getSelectMember()"
          >确 定</el-button
        >
        <el-button size="small" @click="userVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑公司 -->
    <el-dialog
      :title="diaTitle"
      v-model="comEditVisible"
      :close-on-click-modal="!comEditVisible"
      :close-on-press-escape="!comEditVisible"
      width="750px"
      append-to-body
      top="15vh"
    >
      <el-form
        ref="comForm"
        :model="comForm"
        :rules="comRules"
        label-width="100px"
        size="small"
      >
        <el-form-item label="企业名称：" prop="companyName">
          <el-input v-model="comForm.companyName"></el-input>
        </el-form-item>
        <el-form-item label="统一代码：" prop="socialCreditCode">
          <el-input v-model="comForm.socialCreditCode"></el-input>
        </el-form-item>
        <el-form-item label="企业地址：" prop="address">
          <el-input v-model="comForm.address"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="companyPhone">
          <el-input v-model="comForm.companyPhone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer text-right">
        <el-button size="small" @click="comEditVisible = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="handleEditComData('comForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 岗位编辑 -->
    <el-dialog
      :title="diaTitle"
      v-model="postEditVisible"
      :close-on-click-modal="!postEditVisible"
      :close-on-press-escape="!postEditVisible"
      width="750px"
      min-height="500"
      append-to-body
      top="15vh"
    >
      <el-checkbox-group v-model="projectRoles" class="postEditVisible">
        <el-checkbox
          v-for="(item, key) in roleLists"
          :key="key"
          :label="item.id"
          >{{ item.roleName }}</el-checkbox
        >
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer text-right">
        <el-button size="small" @click="postEditVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" size="small" @click="handleEditPost"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 用户编辑 -->
    <el-dialog
      :title="diaTitle"
      v-model="userEditVisible"
      :close-on-click-modal="!userEditVisible"
      :close-on-press-escape="!userEditVisible"
      width="750px"
      append-to-body
      top="15vh"
    >
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="userRules"
        :disabled="userDisabled"
        label-width="100px"
        size="small"
      >
        <el-form-item label="人员姓名：" prop="chineseName">
          <el-input v-model="userForm.chineseName"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>

        <el-form-item label="性别：" prop="sex">
          <el-radio v-model="userForm.sex" label="0">男</el-radio>
          <el-radio v-model="userForm.sex" label="1">女</el-radio>
        </el-form-item>

        <el-form-item
          v-if="
            treeStep.id === '3fda4fd73fb14834b26076c1af439b60' ||
            treeStep.parentId === '3fda4fd73fb14834b26076c1af439b60'
          "
          label="职位："
          prop="roleIds"
          class="postEditVisibles"
        >
          <el-select
            v-model="userForm.roleIds"
            :disabled="isDisabledRole(userForm.roleIds)"
            style="width: 100%"
            @change="changeRoleIds()"
          >
            <el-option
              v-for="v in roleLists"
              :disabled="v.disabled"
              :key="v.id"
              :value="v.id"
              :label="v.roleName"
            ></el-option>
          </el-select>
          <i style="position: absolute; top: 0; left: -65px; color: red">*</i>
        </el-form-item>
        <el-form-item
          v-if="
            treeStep.id === '3fda4fd73fb14834b26076c1af439b60' ||
            treeStep.parentId === '3fda4fd73fb14834b26076c1af439b60'
          "
          label="申报类型："
          prop="creditorTypes"
        >
          <el-checkbox-group v-model="userForm.creditorTypes">
            <el-checkbox label="d041727271c04dacb0a30e1b2249a662"
              >个人</el-checkbox
            >
            <el-checkbox label="f2ec849da47d407ebb4201db8a59039e"
              >企业</el-checkbox
            >
            <el-checkbox label="d388331d86c14674bde67935c6cd4609"
              >职工</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          v-if="
            treeStep.id === '3fda4fd73fb14834b26076c1af439b60' ||
            treeStep.parentId === '3fda4fd73fb14834b26076c1af439b60'
          "
          label="权限："
          prop="filePermission"
        >
          <el-checkbox-group v-model="userForm.filePermission">
            <el-checkbox :label="1">下载</el-checkbox>
            <el-checkbox :label="2">删除</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div v-if="!userDisabled"  class="dialog-footer text-right">
        <el-button size="small" @click="userEditVisible = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="handleEditUserData('userForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      v-model="inviteVisible"
      :close-on-click-modal="!inviteVisible"
      :close-on-press-escape="!inviteVisible"
      title="邀请人员"
      width="30%"
      append-to-body
      top="15vh"
    >
      <div class="inv-box">
        <div class="inv-left">
          <p class="inv-p">分享链接（7天后过期）</p>
          <el-input
            v-model="inviteData.shareUrl"
            :title="inviteData.shareUrl"
            disabled
            size="small"
          ></el-input>
          <el-button
            type="primary"
            style="float: right; margin-top: 25px"
            size="small"
            @click="handleCopy()"
            >复制链接</el-button
          >
        </div>
        <div class="inv-right">
          <img :src="inviteData.urlCode" alt="" />
          <p class="inv-p-r">微信扫码即可邀请人员加入</p>
          <el-button
            type="primary"
            style="margin-top: 14px"
            size="small"
            @click="handleDownqr()"
            >下载二维码</el-button
          >
        </div>
      </div>
      <span slot="footer" class="dialog-footer text-right">
        <el-button type="primary" size="small" @click="handleInvite()"
          >重新生成</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import obsFileDownload from '@/components/HuaweiObsUpload/obsDownload.js'
import { EDIT_BUTTON, CREATE_BUTTON } from '@/constant'
var BANKRUPT_001 = null
export default {
  setup() {
    // 当前案件主要信息
    const { caseInfo } = storeToRefs(useCaseStore())
    const appStore = useAppStore()
    const userPhoto = new URL('/src/assets/images/portrait.png', import.meta.url).href
    const { telphoneValid, phoneValid, creditCodeValid } = useValidate()
    const comRules = {
      companyName: [
        {
          required: true,
          message: '请输入企业名称名称',
          trigger: 'blur',
        },
        {
          max: 50,
          message: '长度最多 50 个字符',
          trigger: 'blur',
        },
      ],

      socialCreditCode: [
        {
          required: true,
          message: '请输入统一代码',
          trigger: 'blur',
        },
        {
          validator: creditCodeValid,
          trigger: 'blur',
        },
      ],
      companyAddress: [
        {
          required: true,
          message: '请输入企业地址',
          trigger: 'blur',
        },
      ],
      address: [
        {
          required: true,
          message: '请输入企业地址',
          trigger: 'blur',
        },
      ],
      companyPhone: [
        {
          validator: telphoneValid,
          trigger: 'blur',
        },
      ],
    }
    const userRules = {
      chineseName: [
        {
          required: true,
          message: '请输入人员姓名',
          trigger: 'blur',
        },
        {
          max: 20,
          message: '长度最多 20 个字符',
          trigger: 'blur',
        },
      ],
      arrivalDate: [
        {
          required: true,
          message: '请选择到岗日期',
          trigger: 'blur',
        },
      ],
      // roleIds: [{
      //     required: true,

      //     type: 'array',
      //     message: "请选择岗位",
      //     trigger: ['change', 'blur']
      // }],
      phone: [
        {
          required: true,
          message: '请填写手机号码',
          trigger: 'blur',
        },
        {
          validator: phoneValid,
          trigger: 'blur',
        },
      ],
      sex: [
        {
          required: true,
          message: '请选择性别',
          trigger: ['blur', 'change'],
        },
      ],
      creditorTypes: [
        {
          required: true,
          trigger: ['blur', 'change'],
          message: '请选择申报类型',
        },
      ],
    }
    const { buttonAuth } = useButtonAuth([EDIT_BUTTON, CREATE_BUTTON], caseInfo.value.isEdit)
    return { appStore, comRules, userRules, userPhoto, caseInfo, buttonAuth, EDIT_BUTTON, CREATE_BUTTON }
  },
  data() {
    return {
      hasTree: 1,
      url_YW: '',
      companyId: this.appStore.userInfo.companyId,
      userId: this.appStore.userInfo.userId,
      allClick: true,
      tableData: [],
      companyTypes: [],
      userTableData: [],
      userTotal: 0,
      comTableData: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
        loading: true,
      },
      treeDate: [], // tree 数据
      treeStep: {},
      projectTypes: [],
      companyType: '',
      searchData: {
        pageNum: 1,
        pageSize: 10,
      },
      searchUserData: {
        pageNum: 1,
        pageSize: 10,
      },
      isCompany: true,
      selectDate: null,
      total: 0,
      treeLoad: true,
      comList: [
        // 列表头
        { type: 'index', label: '序号', width: '55' },

        {
          prop: 'companyName',
          label: '企业名称',
        },
        {
          prop: 'socialCreditCode',
          label: '统一代码',
        },
        {
          prop: 'dictLabel',
          label: '企业所属',
        },
        {
          prop: 'address',
          label: '企业地址',
        },
        { prop: 'caozuo', label: '操作', fixed: 'right' },

      ],
      peopleList: [
        // 列表头
        {
          key: 'roleName',
          label: '职位',
        },
        {
          key: 'companyTypeName',
          label: '人员归属',
        },
        // {
        //   key: 'identifyStatusName',
        //   label: '是否实人认证'
        // },
        // {
        //   key: 'arrivalDate',
        //   label: '到岗时间'
        // },
        // {
        //   key: 'statusName',
        //   label: '状态'
        // },
        // {
        //   key: 'companyName',
        //   label: '单位名称'
        // }
      ],
      innerVisible: false,
      comForm: {},
      comEditVisible: false,
      comVisible: false,

      addTableData: [],
      selectAddTable: [],
      searchAdd: {
        companyName: '',
        pageNum: 1,
        pageSize: 10,
      },
      addTotal: 0,
      diaTitle: '',
      userForm: {
        arrivalDate: '',
        roleIds: [],
      },
      userInVisible: false,
      userVisible: false,

      postEditVisible: false,
      projectRoles: [],
      roleLists: [],

      userEditVisible: false,
      userDisabled: false,
      // --------
      memberCkTotal: 0,
      memberData: [], // 项目人员数据源
      memberList: [], // 项目人员已选择的数据
      memberSearchData: {
        // 项目人员查询条件
        pageNum: 1,
        pageSize: 100,
        userName: '',
      },
      memberTotal: 0,
      memberPage: 0,
      leftChecked: [], // 左侧选中的
      leftCheckedLen: 0, // 左侧选中的数量
      leftMoveIndex: 0, // 左侧向右侧移动的位置
      rightMoveIndex: 0, // 左侧向右侧移动的位置
      rightChecked: [], // 右侧选中的
      rightCheckedLen: 0,
      fristMemberData: [], // 第一部分项目人员数据源
      memberListDis: false,

      projectType: '',
      checkData: {},
      addTableVisible: false,
      newData: {
        userId: this.appStore.userInfo.userId,
        userName: this.appStore.userInfo.userName,
      },
      userCompanyId: this.appStore.userInfo.companyId,
      checkComData: {},
      isAddCom: false,
      dialogVisible: false,
      disabledBtn: false,
      isAdd: true,
      inviteVisible: false,
      inviteData: {},
      isDirector: false,
    }
  },
  computed: {
    // 从所有项目人员数据里过滤掉已选择的数据
    memberFilter() {
      const keys = this.memberList.map((v) => v.key)
      return this.memberData.filter((v) => !keys.includes(v.key))
    },
  },
  watch: {
    id: function() {
      this.getTreeData()
      this.getComListData(1)
      this.projectType = this.caseInfo.projectType
    },

    leftChecked(val, oldVal) {
      if (val && val.length > 0) {
        this.leftCheckedLen = val.length
      }
    },
    rightChecked(val, oldVal) {
      if (val && val.length > 0) {
        this.rightCheckedLen = val.length
      }
    },
    userVisible() {
      if (!this.userVisible) {
        this.memberList = []
        this.memberData = []
        this.memberSearchData.userName = ''
        this.rightChecked = []
        this.leftChecked = []
        this.rightCheckedLen = 0
        this.leftCheckedLen = 0
      }
    },
  },
  mounted() {
    this.id = this.caseInfo.projectId
    this.newData.projectId = this.caseInfo.projectId
    this.newData.companyId = this.caseInfo.companyId
    this.projectType = this.caseInfo.projectType
    this.getTreeData()
    this.getComListData(1)
    this.getCompanyType()
    this.getCompanyTypes()
  },
  methods: {
    changeCheck() {
      this.rightCheckedLen = this.rightChecked.length
      this.leftCheckedLen = this.leftChecked.length
    },
    handleAddUser() {
      this.userVisible = true
      this.diaTitle = '添加人员'
      this.getMeberData()
      this.getCompanyMember()
    },
    // 添加人员 —— 查询人员列表
    async  getMeberData() {
      this.memberList = []
      this.memberListDis = false
      let companyType = ''
      let companyId = ''
      if (this.isCompany) {
        companyType = this.checkData.companyType
        companyId = this.checkData.id
      } else {
        companyType = this.treeStep.parentId
        companyId = this.treeStep.id
      }
      const response = await getUserNoPage({
        projectId: this.id,
        companyType: companyType,
        companyId: companyId,
      })

      if (response.success) {
        const items = response.data
        items.forEach((el) => {
          this.memberList.push({
            key: el.userId,
            label: el.userName,
            phone: el.phone,
            // 案件负责人不可以移除
            disabled: el.roleIds === BANKRUPT_001,
          })
        })
        this.memberListDis = true
        this.memberCkTotal = this.memberList.length
        if (this.memberList.length > 0) {
          sessionStorage.setItem('memberId', this.memberList[0].key)
        }
      } else {
        this.memberListDis = true
      }
    },
    loadLeft() {
      if (this.memberPage > this.memberSearchData.pageNum) {
        this.memberSearchData.pageNum += 1
        this.getCompanyMember()
      }
    },
    addToLeft() {
      this.memberList.forEach((item, index) => {
        if (item.key === this.rightChecked[this.rightChecked.length - 1]) {
          this.rightMoveIndex = index
        }
      })
      this.memberList = this.memberList.filter(
        (item) => this.rightChecked.indexOf(item.key) === -1
      )
      this.getMemberPerson(this.rightChecked, 2, this.memberData)
      this.rightChecked = []
      this.changeCheck()
    },
    addToRight() {
      this.memberData.forEach((item, index) => {
        if (item.key === this.leftChecked[this.leftChecked.length - 1]) {
          this.leftMoveIndex = index
        }
      })
      this.memberData = this.memberData.filter(
        (item) => this.leftChecked.indexOf(item.key) === -1
      )
      this.getMemberPerson(this.leftChecked, 1, this.memberList)
      this.leftChecked = []
      this.changeCheck()
    },
    leftChange() {
      this.memberSearchData.pageNum = 1
      this.memberData = []
      this.getCompanyMember()
    },

    array_diff(a, b) {
      for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
          if (a[j] === b[i]) {
            a.splice(j, 1)
            j = j - 1
          }
        }
      }
      return a
    },
    async getMemberPerson(val, type, data) {
      // 分页获取企业成员
      let user = []
      const hasMemer = []
      const hasVal = data.filter((item) => val.indexOf(item.key) > -1)
      hasVal.forEach((el) => {
        hasMemer.push(el.key)
      })
      user = this.array_diff(val, hasMemer)
      const response = await getFindUserList(user)
      if (response.success) {
        const items = response.data
        if (type === 1) {
          if (items && items.length > 0) {
            items.forEach((el) => {
              this.memberList.push({
                key: el.userId,
                label: el.userName ? el.userName : el.username,
                phone: el.phone,
              })
            })
          }
          this.memberCkTotal = this.memberList.length
            ? this.memberList.length
            : 0
          this.leftChecked = []
        } else {
          if (items && items.length > 0) {
            items.forEach((el) => {
              this.memberData.push({
                key: el.userId,
                label: el.userName ? el.userName : el.username,
                phone: el.phone,
              })
            })
          }
          this.memberCkTotal = this.memberList.length
            ? this.memberList.length
            : 0
          this.rightChecked = []
        }
      } else {
        ElMessage.error(response.msg)
      }
    },
    async getCompanyMember() {
      // 获取企业人员
      if (this.isCompany) {
        this.memberSearchData.companyId = this.checkData.id
      } else {
        this.memberSearchData.companyId = this.treeStep.id
      }
      const response = await getCompanyUser(this.memberSearchData)
      if (response.success) {
        const companyMember = response.data.records
        this.memberTotal = response.data.total
        this.memberPage = response.data.pages
        companyMember.forEach((item) => {
          this.memberData.push({
            key: item.userId,
            label: item.chineseName,
            phone: item.phone,
          })
        })
      } else {
        ElMessage.error(response.msg)
      }
    },
    async getProjectMember() {
      // 获取项目人员
      this.memberList = []
      const response = await getProjectMembers(this.searchData)
      if (response.success) {
        this.tableData = response.data.records
        this.total = response.data.total
        this.tableData.forEach((item) => {
          this.memberList.push({
            key: item.userId,
            label: item.userName,
            phone: item.phone,
          })
        })
        if (this.memberList.length > 0) {
          sessionStorage.setItem('memberId', this.memberList[0].key)
        }
      } else {
        ElMessage.error(response.msg)
      }
    },
    async getSelectMember() {
      this.memberListDis = false
      // 获取选择的项目成员
      this.member = []

      this.memberList.forEach((m) => {
        this.member.push({
          id: m.key,
          type: 2,
        })
      })
      let ssid = ''
      let companyType = ''
      if (this.isCompany) {
        ssid = this.checkData.id
        companyType = this.checkData.companyType
      } else {
        ssid = this.treeStep.id
        companyType = this.treeStep.parentId
      }
      const response = await getSaveMembers({
        createUser: this.appStore.userInfo.userId,
        companyId: ssid,
        projectId: this.id,
        companyType: companyType,
        member: this.member,
      })
      if (response.success) {
        ElMessage.success('操作成功！')
        sessionStorage.setItem('memberId', this.member[0])
        this.userVisible = false
        if (!this.isCompany) {
          this.getpeopleData(1)
        }
      } else {
        ElMessage.error(response.msg)
      }
    },

    // 获取树结构
    async getTreeData() {
      const response = await getTreeCompanyApi(
        this.caseInfo.projectId
      )
      if (response.success) {
        this.treeLoad = false
        this.treeDate = response.data
      } else {
        ElMessage.error(response.msg)
      }
    },
    // 查询公司所属方
    async getCompanyType() {
      const res = await getDictApi({ code: 'bankrupt_type' })
      if (res.success) {
        this.companyTypes = res.data
      }
    },
    resetComListData() {
      this.allClick = true
      this.isCompany = true
      this.isAddCom = false
      this.isAdd = true
      this.checkData = {}
      this.searchData = {
        pageNum: 1,
        pageSize: 10,
      }
      this.treeStep = {}
      this.getComListData(1)
    },
    async getComListData(val) {
      try {
        if (val) {
          this.searchData.pageNum = 1
          this.comTableData.pageNum = 1
        }
        this.searchData.projectId = this.id
        this.comTableData.loading = true
        this.searchData.pageSize = this.comTableData.pageSize
        this.comTableData.pageNum = this.searchData.pageNum
        const response = await getCompanyByThreeApi(this.searchData)
        if (response.success) {
          this.comTableData.list = response.data.records
          this.comTableData.total = response.data.total
        } else {
          ElMessage.error(response.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error({ message: error.message, showClose: false })
      } finally {
        this.comTableData.loading = false
      }
    },
    // 添加企业-企业列表查询
    async  handleSearchCom(val) {
      if (val) {
        this.searchAdd.pageNum = 1
      }
      const response = await getCompanylistApi(this.searchAdd)
      if (response.success) {
        this.addTableVisible = true
        this.addTableData = response.data.records
        this.addTableData.forEach((el) => {
          el.companyType = this.treeStep.id ? this.treeStep.id : ''
        })
        this.addTotal = response.data.total
      } else {
        ElMessage.error(response.msg)
      }
    },
    handleAddChange(val) {
      this.searchAdd.pageNum = val
      this.handleSearchCom()
    },
    handleCurrentChange(val) {
      this.searchData.pageNum = val
      this.getComListData()
    },

    clickTreeData(data) {
      this.allClick = false
      this.isAddCom = true
      this.treeStep = data
      this.checkData = {}
      this.memberSearchData.pageNum = 1
      this.searchData = {
        pageNum: 1,
        pageSize: 10,
      }
      this.searchUserData = {
        pageNum: 1,
        pageSize: 10,
      }
      if (data.level === 1) {
        this.isCompany = true
        this.searchData.companyType = data.id
        if (data.id === 'e0fdb68073184da9ba23798a00bb245d') {
          this.isAdd = false
        } else {
          this.isAdd = true
        }
        this.getComListData(1)
      } else if (data.level === 2) {
        this.isCompany = false
        if (data.parentId === 'e0fdb68073184da9ba23798a00bb245d') {
          this.isAdd = false
        } else {
          this.isAdd = true
        }
        this.getpeopleData(1)
      }
    },
    isDisabledRole(id) {
      const res = this.roleLists.find((v) => v.id === id)
      if (!res) return false
      return res.roleCode === 'BANKRUPT_001'
    },
    async getCompanyTypes() {
      this.roleLists = []
      const response = await getFindAllMemberRole({
        projectType: this.caseInfo.projectType,
      })

      if (response.success) {
        this.roleLists = response.data.map((v) => {
          if (v.roleCode === 'BANKRUPT_001') {
            BANKRUPT_001 = v.id
            return { ...v, disabled: true }
          } else {
            return { ...v, disabled: false }
          }
        })
      }
    },
    async getpeopleData(val) {
      if (val) {
        this.searchUserData.pageNum = 1
      }
      this.searchUserData.projectId = this.id
      this.searchUserData.companyType = this.treeStep.parentId
      this.searchUserData.companyId = this.treeStep.id
      const response = await getCaseManagerApi(this.searchUserData)
      if (response.success) {
        this.userTableData = response.data.records
        this.userTableData.forEach((el) => {
          if (el.userPhotoPath) {
            el.path =
                  el.userPhotoPath.search('https') === -1
                    ? import.meta.env.VITE_OBS_URL + el.userPhotoPath
                    : el.userPhotoPath
          } else {
            el.path = this.userPhoto
          }
        })
        this.userTotal = response.data.total
      } else {
        ElMessage.error(response.msg)
      }
    },
    handleUserChange(val) {
      this.searchUserData.pageNum = val
      this.getpeopleData()
    },
    handleAddCom() {
      this.innerVisible = true
      this.diaTitle = '添加企业'
      this.searchAdd.companyName = ''
      this.addTableData = []
      this.addTotal = 0
      this.addTableVisible = false
      this.getCompanyType()
    },

    async handleComData() {
      let flag = false
      if (this.selectAddTable.length) {
        this.selectAddTable.forEach(function(el, index) {
          if (!el.companyType) {
            flag = true
          }
        })
        if (flag) {
          ElMessage.error('请为相关企业选择企业所属！')
        } else {
          const sendArr = []
          this.selectAddTable.forEach((el) => {
            sendArr.push({
              id: el.id,
              companyType: el.companyType,
            })
          })
          const response = await setAddCompany({
            projectId: this.id,
            companyList: sendArr,
          })
          if (response.success) {
            this.innerVisible = false
            this.getTreeData()
            this.resetComListData()
          } else {
            ElMessage.error(response.msg)
          }
        }
      } else {
        ElMessage.error('请选择企业！')
      }
    },
    addComList(val) {
      this.selectAddTable = val
    },
    async handleAddData(formName) {
      this.comForm.userId = this.userId
      this.comForm.sysCode = '2'
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const res = await saveCompany(this.comForm)
          if (res.success) {
            this.comVisible = false
            ElMessage({
              type: 'success',
              message: '新增成功',
            })
            this.$refs.comForm.resetFields()
            this.addTableData = []
            this.addTotal = 0
            this.searchAdd.companyName = ''
          } else {
            ElMessage.error(res.msg)
          }
        } else {
          return false
        }
      })
    },
    handleNewCom() {
      this.comVisible = true
      this.diaTitle = '添加企业'
      this.comForm = {}
      if (this.$refs.comForm) {
        this.$refs.comForm.resetFields()
      }
    },
    async handleEditCom(val) {
      this.diaTitle = '编辑企业'
      const res = await setSystemCompany(val.id)
      if (res.success) {
        this.comEditVisible = true
        this.comForm = res.data
        this.checkComData = this.comForm
      }
    },
    async handleDelCom(val) {
      ElMessageBox.confirm('确认删除该公司吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async() => {
        const res = await setDelectCompany({
          companyType: val.companyType,
          projectId: this.id,
          companyId: val.id,
        })
        if (res.success) {
          this.comVisible = false
          ElMessage({
            type: 'success',
            message: '删除成功!',
          })
          this.getTreeData()
          this.resetComListData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    },
    handleAdd(val) {
      this.userVisible = true
      this.diaTitle = '添加人员'
      this.checkData = val
      this.getMeberData()
      this.getCompanyMember()
    },
    async handleEditComData(formName) {
      this.comForm.userId = this.userId
      this.comForm.sysCode = '2'
      this.comForm.companyCode = this.checkComData.companyCode
      this.comForm.coLevel = this.checkComData.coLevel
      this.comForm.companyAddress = this.comForm.address
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const res = await saveCompany(this.comForm)
          if (res.success) {
            ElMessage({
              type: 'success',
              message: '操作成功!',
            })
            this.comEditVisible = false
            this.$refs.comForm.resetFields()
            this.getComListData()
          } else {
            ElMessage.error(res.msg)
          }
        } else {
          return false
        }
      })
    },
    async handleAddUserData(formName) {
      if (this.isCompany) {
        this.userForm.companyId = this.checkData.id
        this.userForm.companyType = this.checkData.companyType
      } else {
        this.userForm.companyId = this.treeStep.id
        this.userForm.companyType = this.treeStep.parentId
      }
      this.$refs[formName].validate(async(valid) => {
        this.disabledBtn = true
        if (valid) {
          const res = await addPersonToAuth(this.userForm)
          if (res.success) {
            this.userInVisible = false
            ElMessage({
              type: 'success',
              message: '新增成功!',
            })
            // 此处新增人员

            this.memberData = []
            this.getCompanyMember()
          } else {
            ElMessage.error(res.msg)
          }
        } else {
          return false
        }
        this.disabledBtn = false
      })
    },
    handleNewPeople() {
      this.userInVisible = true
      this.diaTitle = '新增人员'
      this.userForm = {
        roleIds: [],
      }
    },
    handlePeopleData() {
      this.userVisible = false
    },
    async handlePost(val) {
      this.postEditVisible = true
      this.diaTitle = '岗位编辑'
      this.checkData = val
      const res = await setFindRoleByMemberId(val.id)
      if (res.success) {
        this.projectRoles = res.data
      }
    },
    async handleEditPost() {
      const roleData = {
        companyId: this.checkData.companyId,
        projectId: this.id,
        roleIds: this.projectRoles,
        userId: this.checkData.id,
      }
      const response = await saveMembersRole(roleData)
      if (response.success) {
        ElMessage({
          type: 'success',
          message: '修改成功!',
        })
        this.postEditVisible = false
        this.getpeopleData()
      } else {
        ElMessage.error(response.msg)
      }
    },

    async handleEditUser(val, type) {
      if (type === 2) {
        this.diaTitle = '用户编辑'
        this.userDisabled = false
      } else {
        this.diaTitle = '用户查看'
        this.userDisabled = true
      }
      const res = await saveMemberRole({
        id: val.id,
        projectType: this.projectType,
        companyType: this.treeStep.parentId,
      })
      if (res.success) {
        const { user, bankruptManager } = res.data
        this.userForm = user
        this.userForm.roleIds = res.data.roleList[0]
        this.userForm.arrivalDate = res.data.arrivalDate
        if (bankruptManager) {
          if (bankruptManager.filePermission == 3) {
            // this.$set(this.userForm, 'filePermission', [1, 2])
            this.userForm.filePermission = [1, 2]
          } else if (bankruptManager.filePermission == 0) {
            // this.$set(this.userForm, 'filePermission', [])
            this.userForm.filePermission = []
          } else {
            // this.$set(this.userForm, 'filePermission', [
            //   bankruptManager.filePermission,
            // ])
            this.userForm.filePermission = [
              bankruptManager.filePermission,
            ]
          }
          if (bankruptManager.creditorTypes) {
            // this.$set(
            //   this.userForm,
            //   'creditorTypes',
            //   bankruptManager.creditorTypes.split(',')
            // )
            this.userForm.creditorTypes = bankruptManager.creditorTypes.split(',')
          } else {
            // this.$set(this.userForm, 'creditorTypes', [])
            this.userForm.creditorTypes = []
          }
        } else {
          // this.$set(this.userForm, 'filePermission', [])
          // this.$set(this.userForm, 'creditorTypes', [])
          this.userForm.filePermission = []
          this.userForm.creditorTypes = []
        }
      }
      this.userEditVisible = true
      this.checkData = val
    },
    changeRoleIds() {
      this.$forceUpdate()
    },
    async handleJob(val) {
      ElMessageBox.confirm(
        '请确认该员工是否已经调离该项目，如果点击【确定】提交后，该用户将从当前项目的项目成员中删除!',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(async() => {
        const res = await saveTransfer({
          projectId: this.id,
          companyId: val.companyId,
          companyType: this.treeStep.parentId,
          userId: val.userId,
        })
        if (res.success) {
          ElMessage({
            type: 'success',
            message: '调离成功!',
          })
          this.getpeopleData()
        } else {
          ElMessage.error(res.data)
        }
      })
    },
    async handleLeave(val) {
      ElMessageBox.confirm(
        '请确认该员工是否已经离职，如果点击【确定】提交后，将从该用户参与的所有项目中删除项目成员并从公司中删除该用户。',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'msgbox',
        }
      ).then(async() => {
        const res = await saveDimission({
          userId: val.userId,
          projectId: this.id,
          companyType: this.treeStep.parentId,
        })
        if (res.success) {
          ElMessage({
            type: 'success',
            message: '离职成功!',
          })
          this.getpeopleData()
        } else {
          ElMessage.error(res.data)
        }
      })
    },
    async handleEditUserData(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.userEditVisible = false
          setTimeout(async() => {
            this.userForm.memberId = this.checkData.id
            this.userForm.projectId = this.id
            this.userForm.roleIds = [this.userForm.roleIds]
            const form = JSON.parse(JSON.stringify(this.userForm))
            form.creditorTypes = form.creditorTypes.toString()
            if (form.filePermission.length === 2) {
              form.filePermission = 3
            } else if (form.filePermission.length === 1) {
              form.filePermission = form.filePermission[0]
            } else {
              form.filePermission = 0
            }
            const res = await savePersonAndProjectMember(form)
            if (res.success) {
              ElMessage({
                type: 'success',
                message: '操作成功!',
              })
              this.getpeopleData()
            }
          }, 100)
        } else {
          return false
        }
      })
    },

    closeAddUser() {
      this.userInVisible = false
      this.$forceUpdate()
    },
    opneYW(val) {
      this.url_YW =
        this.$basePath +
        '/tim/#/login?userId=' +
        this.userId +
        '&chatWith=' +
        val.userId

      sessionStorage.setItem('chatUrl', this.url_YW)
      sessionStorage.setItem('chatWith', val.userId)
      this.$store.commit('SET_CHATINNER')
    },
    handledialogratesDetails() {
      this.dialogVisible = false
    },
    handleOpen() {
      this.hasTree = this.hasTree === 1 ? 2 : 1
    },
    async handleInvite(type) {
      if (type) {
        this.inviteVisible = true
      }
      const res = await saveGetLink({
        projectId: this.newData.projectId,
        companyId: this.appStore.userInfo.companyId,
        userId: this.appStore.userInfo.userId,
      })
      if (res.success) {
        this.inviteData = res.data
        this.inviteData.urlCode =
              import.meta.env.VITE_OBS_URL + this.inviteData.qrcodeUrl
      }
    },
    handleCopy() {
      const oInput = document.createElement('input')
      oInput.value = this.inviteData.shareUrl
      document.body.appendChild(oInput)
      oInput.select()
      oInput.remove()
      ElMessage({
        message: '复制成功',
        type: 'success',
      })
    },
    handleDownqr() {
      obsFileDownload(this.inviteData.qrcodeUrl, '邀请码.png')
    },
    headerCellStyle() {
      return { background: 'var(--primary-color-100)' }
    },
    rowStyle({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return { background: 'var(--primary-color-100)' }
      }
    },
  },
}
</script>

<style scoped>
.all-con {
  height: 100%;
  box-sizing: border-box;
}

.el-col:last-child {
  border: 0;
}

.overview-title {
  background-color: #f0f0f2;
  line-height: 60px;
  color: #255867;
  padding: 0 25px;
  box-sizing: border-box;
  font-size: 14px;
}

.template-title {
  height: 40px;
  border-bottom: 1px solid #e6e6e6;
  line-height: 40px;
  font-size: 14px;
}

.template-title span {
  display: inline-block;
  width: 32%;
  text-align: center;
  cursor: pointer;
}

.template-title button {
  display: inline-block;
  width: 40%;
  cursor: pointer;
}

.m-t {
  color: #333;
}

.main-template,
.stepColor {
  color: #255867;
}

.template-p {
  padding: 0 25px;
  height: 40px;
  border-bottom: 1px solid #e6e6e6;
  line-height: 40px;
  font-size: 14px;
}

.template-color {
  color: #255867;
}

:deep(.el-transfer-panel__list) {

     margin: 0;
    padding: 6px 0;
    list-style: none;
    height: 246px;
    overflow: auto;
    box-sizing: border-box;
}
:deep(.el-transfer-panel__list) > label {
  width: 80%;
}
:deep(.el-transfer-panel__list) > .check-phone {
  padding-right: 20px;
  float: right;
}

:deep(.el-transfer-panel__item) {
  margin-right: 0;
}

.userVisible-sever {
  width: 100%;
  height: 100%;
  background: #ddd;
  z-index: 99999;
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0.2;
  font-size: 50px;
  color: #000;
}

.userVisible-sever i {
  position: absolute;
  left: 50%;
  top: 50%;
}

:deep(.el-message-box) {
  width: 40% !important;
}

.userVisible-dia {
  min-width: 800px !important;
  overflow-x: auto;
}
.userVisible-dia > :deep(.el-dialog) {
  min-width: 800px !important;
  overflow-x: auto;
}
.comVisible-dia {
  min-width: 800px !important;
  overflow-x: auto;
}
.comVisible > :deep(.el-dialog) {
  min-width: 800px !important;
  overflow-x: auto;
}

.postEditVisible > :deep(.el-checkbox) {
  margin-bottom: 15px;
  width: 25%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.postEditVisibles > label {
  line-height: 22px;
}

.mainMsg > :deep(.el-dialog__body) {
  height: 550px !important;
  padding: 0;
}
.mainMsg > :deep(.el-dialog__footer) {
  border-top: 1px solid #ccc;
}

.inv-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.inv-left {
  height: 200px;
  width: 50%;
}

.inv-right {
  height: 200px;
  width: 50%;
  text-align: center;
}
.inv-right > img {
  margin-top: 14px;
  width: 90px;
  height: 90px;
}
.inv-p {
  font-size: 12px;
  color: #333;
  margin: 57px 0 12px;
}

.inv-p-r {
  font-size: 12px;
  color: #333;
}

.img-1 {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ddd;
  vertical-align: text-bottom;
  margin-right: 5px;
}

.open-close-div {
  display: inline-block;
  width: 15px;
  height: 100%;
  font-size: 14px;
  position: relative;
  background: #f7f7f8;
  float: left;
  cursor: pointer;
}

.open-close-div span {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 15px;
  height: 30px;
}

.open-close-div span i {
  margin-top: 8px;
}

.open-close-div:hover span {
  background: #b8a999;
}
.con-right {
  width: -webkit-calc(100% - 315px) !important;
  width: -moz-calc(100% -315px) !important;
  width: calc(100% - 315px) !important;
  box-sizing: border-box;
  flex: 1;
}
.el-transfer-panel__filter {
    text-align: center;
    margin: 15px;
    box-sizing: border-box;
    display: block;
    width: auto;
}
.el-transfer-panel__filter :deep(.el-input__inner) {
    height: 32px;
    width: 100%;
    font-size: 12px;
    display: inline-block;
    box-sizing: border-box;
    padding-right: 10px;
    padding-left: 10px;
}
.el-transfer-panel__filter :deep(.el-input__wrapper) {
    height: 32px;
    width: 100%;
    border-radius: 16px;
}
.el-transfer__buttons {
    display: inline-block;
    vertical-align: middle;
    padding: 0 30px;
}
</style>
