const loginRaw = {
  title: { zh: '登录', en: 'Login' },
  noaccount: { zh: '没有账号？', en: "noaccount?" },
  noCreate: { zh: '不能注册', en: 'no create' },
  email: { zh: '邮件地址', en: 'email' },
  password: { zh: '密码', en: 'password' },
  forgetPassword: { zh: '忘记密码？不能找回', en: 'Forget Password?' },
  orLogin: { zh: '账号密码登录', en: 'OR' },
  logout: { zh: '退出登录', en: 'Logout' }
}

const login: Record<'zh' | 'en', Record<string, string>> = { zh: {}, en: {} }

Object.entries(loginRaw).forEach(([key, value]) => {
  login.zh[key] = value.zh
  login.en[key] = value.en
})

export default login