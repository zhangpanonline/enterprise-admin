/**
 * @description 人民币取千位符
 * @example
 * const { formatCNY, yuanToWanyuan, money } = useFormatMoney(1000, 2)
 * money 为ref类型
 * console.log(money.value) // '¥1,000.00'
 * console.log(formatCNY(1000, 2)) // '¥1,000.00'
 * 将数字缩小1000倍，例如元转为万元
 * console.log(formatCNY(yuanToWanyuan(100000))) // '¥10.00'
 */
function formatCNY(num, precision = 2) {
  let val = unref(num)
  if (String(val) === 'NaN') return '-'
  if ([null, undefined, ''].includes(val)) return 0
  const type = typeof val
  if (type === 'string') {
    val = val.replace(/[a-z,A-Z]/g, '')
    if (val) {
      val = Number.parseFloat(val)
      val = Number(val).toFixed(precision)
      val = '¥' + String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } else {
      val = ''
    }
    return val
  } else if (type === 'number') {
    val = Number(val).toFixed(precision)
    val = '¥' + String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return val
  }
}
// 将纯数字元转为万元
function yuanToWanyuan(num) {
  const money = unref(num)
  function round(number, precision) {
    return Math.round(+number + 'e' + precision) / Math.pow(10, precision)
  }
  const total = Number(money)
  if (typeof total !== 'number') return money
  return round(total / 10000, 2)
}

// 数字金额大写转换(可以处理整数,小数,负数)
function dealBigMoney(n) {
  if (Number.isNaN()) return '-'
  if (['', null, undefined].includes(n)) return '零元整'
  var fraction = ['角', '分']
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
  var head = n < 0 ? '欠' : ''
  n = Math.abs(n)

  var s = ''

  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)

  for (let i = 0; i < unit[0].length && n > 0; i++) {
    var p = ''
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')
}

export default function useFormatMoney(num, precision = 2) {
  const money = ref(formatCNY(num, precision))
  return {
    formatCNY, yuanToWanyuan, dealBigMoney, bigMoney: ref(dealBigMoney(money.value)), money,
  }
}
