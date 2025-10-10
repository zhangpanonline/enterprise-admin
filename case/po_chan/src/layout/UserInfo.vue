<template>
  <el-dialog
    v-model="visible"
    title="个人资料"
    width="504px"
    append-to-body
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div class="flex flex-col" v-if="userType == 1" >
      <div class="flex items-center" >
        <img v-if="userInfo.userPhotoPath" class="w-16 h-16 rounded-full mr-6" :src="userInfo.userPhotoPath" alt="">
        <el-avatar v-else  class=" mr-6"  :size="64" style="background-color: var(--primary-color-400);">
          <span  class="text-white text-[12px] " >{{ userInfo.fullName.slice(0, 1) }}</span>
        </el-avatar>
         <div>
           <HuaweiObsUpload
            :limit="1"
            sub-type="fileImg"
            @returnFileList="returnFileList">
            <el-button  type="primary">上传头像</el-button>
          </HuaweiObsUpload>
         </div>
      </div>
      <el-form
        ref="formRef"
        :model="ruleForm"
        label-width="130px"
        class="mt-2"
        label-position="top"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="姓名" prop="nickname">
              <el-input size="large" v-model="ruleForm.nickname"  />
            </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="userSex">
              <el-input size="large" v-model="ruleForm.userSex"  />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input size="large" v-model="ruleForm.phone"  disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input size="large" v-model="ruleForm.email"  />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="身份证号" prop="idCardNo">
              <el-input size="large" v-model="ruleForm.idCardNo"  />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="contactAddress">
              <el-input size="large" v-model="ruleForm.contactAddress"  />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div  class="dialog-footer">
        <el-button size='large' type="primary" @click="upUser">提交</el-button >
        <el-button size='large' type="primary" @click="visible = false">关闭</el-button >
      </div>
    </div>
    <div v-else>
      <el-form
        ref="formRef"
        :model="ruleForm"
        label-width="130px"
        label-position="top"
        :rules="comRules"
      >
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="当前密码" prop="oldpasss">
              <el-input size="large" v-model="ruleForm.oldpasss"  />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="新密码" prop="password">
              <el-input size="large" v-model="ruleForm.password"  />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="确认新密码" prop="checkPass">
              <el-input size="large" v-model="ruleForm.checkPass"  />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div  class="dialog-footer">
        <el-button size='large' type="primary" @click="upPass">保存</el-button >
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  userType: {
    type: Number,
    default: 1,
  },
})
const { userInfo } = storeToRefs(useAppStore())
const appStore = useAppStore()
const router = useRouter()

const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const ruleForm = reactive({
  nickname: userInfo.value.nickname,
  userSex:  userInfo.value.userSex,
  phone:  userInfo.value.phone,
  email:  userInfo.value.email,
  idCardNo:  userInfo.value.idCardNo,
  contactAddress: userInfo.value.contactAddress,
  password:''
})
const upUser = async () => {
  const params = {
    nickname: ruleForm.nickname,
    email: ruleForm.email,
    userSex: ruleForm.userSex,
    idCardNo: ruleForm.idCardNo,
    contactAddress: ruleForm.contactAddress,
    userPhotoPath: ruleForm.userPhotoPath,
    id:userInfo.value.id
  }
  const res = await saveUser(params)
  if (res.success) {
    ElMessage.success(res.msg)
    getUserInfoApi({ token: appStore.token, loginName: appStore.userInfo.userName }).then(res => {
    if (res.success) {
      appStore.setUserInfo(res.data)
    } else {
      ElMessage.error(res.msg)
    }
    }).catch(error => {
      console.error(error)
      ElMessage.error(error.message)
    })
    // appStore.setUserInfo({ userName })
    visible.value = false
  } else {
    ElMessage.error(res.msg)
  }
}
const formRef = ref()
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请先输入第一次密码'))
  } else if (value !== ruleForm.password) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}
const testPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value.length < 6 || value.length > 18) {
    callback(new Error('请输入6-18位,包括字母+数字+特殊字符中的至少2种'))
  } else {
    // let pPattern = /^.*(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{6,16}/
    let pPattern = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,18}$/
    // let order = 0 // 顺序
    if (pPattern.test(value)) {
      callback()
    } else {
      callback(new Error('请输入6-18位,包括字母+数字+特殊字符中的至少2种'))
    }
  }
}

const comRules = {
  checkPass: [{ required: true,validator: validatePass2, trigger: 'blur' }],
  password:[{ required: true,validator: testPassword, trigger: 'blur' }],
  oldpasss:[{ required: true, message: '密码不能为空！', trigger: 'blur' }]
}


const upPass = () => {
  if (!formRef.value) return false

  formRef.value.validate(async (valid, fields) => {
    if (!valid) return false
    const params = {
      userId: userInfo.value.id,
      oldPwd: ruleForm.oldpasss,
     password: ruleForm.password,
    }
    const res = await updatePwd(params)
    if (res.success) {
      ElMessage.success(res.msg)
      localStorage.clear()
      sessionStorage.clear()
      appStore.setToken(null)
      router.push('/login')

    } else {
      ElMessage.error(res.msg)

    }

  })

}

const returnFileList = (val) =>{
  console.log(val)
  console.log(val.length)
  var index = val.length - 1
  ruleForm.userPhotoPath = val[index].url
}

// 关闭弹框
const handleClose = done => {
  done()
}
</script>
