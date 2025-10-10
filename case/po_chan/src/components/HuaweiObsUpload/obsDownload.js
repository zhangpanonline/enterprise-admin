import {
  accessKey,
  bucketName,
  endPoint,
  secretKey,
  videoBucketName
} from './libs/obsData.js'

function getObsClient(accessKey, secretKey, endPoint) {
  // eslint-disable-next-line no-undef
  var obsClient = new ObsClient({
    access_key_id: accessKey,
    secret_access_key: secretKey,
    server: endPoint,
    timeout: 1 * 1000,
  })
  return obsClient
}

function fileDown(data, fileName, cb) {
  const blob = new Blob([data], {
    type: 'application/text/xml',
  })

  const filename = fileName
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename)
    cb && cb()
  } else {
    // let testmsg = val.fileName.substring(val.fileName.lastIndexOf(".") + 1);
    // testmsg = testmsg.toLowerCase()

    const blobURL = window.URL.createObjectURL(blob)
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', filename)
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobURL)
    cb && cb()
  }
}

function generateUUID() {
  var d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now() // use high-precision timer if available
  }
  var uuid = 'xxxxxxxy-yxxx-8xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

var timer = null
var timerNum = 0
var downFiles = []

const fileDownload = (url, fName, type, cb) => {
  const files = {}
  let fileName = fName.substring(0, fName.lastIndexOf('.'))
  const fileExe = fName.substring(fName.lastIndexOf('.') + 1)

  if (fileName && fileName.length > 4) {
    fileName = fileName.substring(0, 4) + ' ··· '
  }
  files.fileName = fileName + '.' + fileExe
  files.code = generateUUID().replace(/-/g, '')
  downFiles.unshift(files)
  sessionStorage.setItem('downFiles', JSON.stringify(downFiles))

  if (timer) {
    clearInterval(timer)
    timer = null
    timerNum = 0
  }
  timer = setInterval(() => {
    downFiles = JSON.parse(sessionStorage.getItem('downFiles')) || []
    timerNum++
    if (!downFiles || !downFiles.length) {
      clearInterval(timer)
      timer = null
      sessionStorage.removeItem('downFiles')
      timerNum = 0
    }

    if (timerNum === 0 || timerNum === 1800000) {
      clearInterval(timer)
      timer = null
    }

    console.log(timerNum)
  }, 20)

  getObsClient(accessKey, secretKey, endPoint)
    .getObject({
      Bucket: type ? videoBucketName : bucketName,
      Key: url,
      SaveByType: 'arraybuffer',
    })
    .then(function(result) {
      if (result.CommonMsg.Status < 300) {
        if (files && files.code) {
          console.log('下载完成，开始合成', files)
          console.log(result)
          const downFiles = JSON.parse(sessionStorage.getItem('downFiles'))
          downFiles.forEach((ele, i) => {
            if (ele.code === files.code) {
              downFiles.splice(i, 1)
            }
          })
          sessionStorage.setItem('downFiles', JSON.stringify(downFiles))
        }

        fileDown(result.InterfaceResult.Content, fName, cb)
      } else {
        console.log('Message-->' + result.CommonMsg.Message)
      }
    })
    .catch(function(err) {
      console.error('下载失败！', err)
    })
}

export default fileDownload

/**
 * 使用方法
 *  import fileDownload from "@/utils/obsDownload";
 *   fileDownload(url, fileName,bucketName)
 *  fileDownload('xx/xx/xxx.jpg', '11.jpg'，'zscloud')
 */
