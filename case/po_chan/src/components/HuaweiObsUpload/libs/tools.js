/**
 * @description 获取年/月/日
 * @export
 * @param {*} time
 * @returns
 */
export function dateFormatNoTimes(time) {
  var date = new Date(time)
  var year = date.getFullYear()
  var month =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  // var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  // var minutes =
  //   date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  // var seconds =
  //   date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return year + '/' + month + '/' + day
}
/**
 * @description 视频资料算播放时长
 * @export
 * @param {*} url
 * @returns
 */
export function videoPlayTime(url) {
  let fileType = url.substring(url.lastIndexOf('.') + 1)
  fileType = fileType.toLowerCase()
  const availableType = ['mp4', 'avi', 'mpeg', 'mpg', 'dat', '3gp', 'flv'].indexOf(fileType) > -1
  if (!availableType) return ''
  return new Promise(reslove => {
    let video = document.createElement('video')
    video.preload = 'metadata'
    video.src = url
    video.onloadedmetadata = () => {
      reslove(parseInt((video.duration * 1000).toString(), 10))
      video = null
    }
  })
}
