/**
 * @description 正则校验
 * @example
 * useValidate()// 返回所有的 .*RegExp 和 .*Valid，例如：
 * {
 *  phoneRegExp,
 *  phoneValid,
 *  emailRegExp,
 *  emailValid,
 *  ...
 * }
 */
export default function useValidate() {
  const telPhoneRegExp = /^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/
  const phoneRegExp = /^1[345789]\d{9}$/
  const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const creditCodeRegExp = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/
  const idCardRegExp = /^[1-9]\d{5}(18|19|([23]d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  const bankRegExp = /^([1-9]{1})(\d{15}|\d{18})$/
  const regExp = {
    // 联系方式（座机号或11位手机号）
    telPhoneRegExp,
    telphoneValid(rule, value, callback) {
      if (value && !telPhoneRegExp.test(value)) {
        callback(new Error('请输入正确的联系方式,座机号码格式为XXXX-XXXXXXX 或 XXX-XXXXXXXX！'))
      } else {
        callback()
      }
    },
    // 11位手机号
    phoneRegExp,
    phoneValid(rule, value, callback) {
      if (value && !phoneRegExp.test(value)) {
        callback(new Error('请输入正确的手机号！'))
      } else {
        callback()
      }
    },
    // 邮箱
    emailRegExp,
    emailValid(rule, value, callback) {
      if (value && !emailRegExp.test(value)) {
        callback(new Error('请输入正确的邮箱号码！'))
      } else {
        callback()
      }
    },
    // 信用代码
    creditCodeRegExp,
    creditCodeValid(rule, value, callback) {
      if (value && !creditCodeRegExp.test(value)) {
        callback(new Error('请输入正确的统一社会信用代码！'))
      } else {
        callback()
      }
    },
    // 18位身份证号
    idCardRegExp,
    idCardValid(rule, value, callback) {
      if (value && !idCardRegExp.test(value)) {
        callback(new Error('请输入正确的身份证号码！'))
      } else {
        callback()
      }
    },
    // 银行卡
    bankRegExp,
    bankValid(rule, value, callback) {
      if (value && !bankRegExp.test(value)) {
        callback(new Error('请输入正确的银行卡号码！'))
      } else {
        callback()
      }
    },
  }
  return regExp
}
