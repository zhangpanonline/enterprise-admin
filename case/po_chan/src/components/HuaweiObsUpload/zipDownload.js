// 传入参数：文件名称，与文件路径

import { accessKey, bucketName, endPoint, secretKey } from './libs/obsData.js'
import 'file-saver'
import JSZip from 'jszip'
function getObsClient(accessKey, secretKey, endPoint) {
  var obsClient = new ObsClient({
    access_key_id: accessKey,
    secret_access_key: secretKey,
    server: endPoint,
    timeout: 1 * 1000,
  })
  return obsClient
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
var zipTimer = null
var timerNum = 0
var fileSize = 0
var fileSizeAll = 0
function fileDownload(url, fName) {
  return new Promise((resolve, reject) => {
    getObsClient(accessKey, secretKey, endPoint)
      .getObject({
        Bucket: bucketName,
        Key: url,
        SaveByType: 'arraybuffer',
      })
      .then(function(result) {
        if (result.CommonMsg.Status < 300) {
          fileSize -= 1
          resolve(result.InterfaceResult.Content)
        } else {
          resolve('')
        }
      })
      .catch(function(err) {
        console.error(err)
      })
  })
}

function getMultiZip(blobs, fileNameList, resultFileNameList) {
  var zip = new JSZip()
  for (var i = 0; i < blobs.length; i++) {
    zip.file(resultFileNameList[i], blobs[i], { binary: true })
  }
  if (blobs.length === fileNameList.length) {
    zip
      .generateAsync({
        type: 'blob',
        compression: 'DEFLATE', // STORE：默认不压缩 DEFLATE：需要压缩
        compressionOptions: {
          level: 9,
        },
      })
      .then(function(content) {
        // eslint-disable-next-line
        saveAs(content, '压缩文件.zip')
      })
  }
}
const zipDownload = files => {
  var blobs = []
  var fileNameList = []
  var downFiles = []
  fileSize = files.length

  downFiles = JSON.parse(sessionStorage.getItem('downFiles')) || []

  downFiles.unshift({ fileName: '压缩文件.zip', code: generateUUID() })
  sessionStorage.setItem('downFiles', JSON.stringify(downFiles))
  fileSizeAll = 0
  downFiles.forEach(el => {
    if (el.fileName.indexOf('压缩文件')) {
      fileSizeAll += 1
    }
  })
  for (var i = 0; i < files.length; i++) {
    // 添加匿名函数解决异步问题
    (function(i) {
      blobs.push(fileDownload(files[i].filePath, files[i].fileName))
      fileNameList.push(files[i].fileName)
    })(i)
  }

  if (timer) {
    clearInterval(timer)
    timer = null
    timerNum = 0
    clearInterval(zipTimer)
    zipTimer = null
  }
  timer = setInterval(() => {
    downFiles = JSON.parse(sessionStorage.getItem('downFiles')) || []
    timerNum++
    sessionStorage.setItem('downFiles', JSON.stringify(downFiles))
    if (!downFiles || !downFiles.length) {
      clearInterval(timer)
      timer = null
      clearInterval(zipTimer)
      zipTimer = null
      sessionStorage.removeItem('downFiles')
      sessionStorage.removeItem('fileSizeAll')

      timerNum = 0
    }

    if (timerNum === 0 || timerNum === 1800000) {
      clearInterval(timer)
      timer = null
      clearInterval(zipTimer)
      zipTimer = null
    }

    console.log(timerNum)
  }, 20)
  zipTimer = setInterval(() => {
    console.log(fileSize)

    if (fileSize === 0) {
      const downFiles = JSON.parse(sessionStorage.getItem('downFiles'))
      if (downFiles && downFiles.length) {
        console.log(downFiles)
        downFiles.forEach((ele, i) => {
          if (ele.fileName.indexOf('压缩文件') > -1) {
            downFiles.splice(ele.fileName.indexOf('压缩文件'), 1)
          }
        })
      }
      console.log(downFiles)

      if (fileSizeAll > 0) {
        fileSizeAll -= 1
      } else {
        clearInterval(zipTimer)
        zipTimer = null
        clearInterval(timer)
        timer = null
        sessionStorage.removeItem('downFiles')
        sessionStorage.removeItem('fileSizeAll')
        timerNum = 0
      }

      if (downFiles && downFiles.length) {
        sessionStorage.setItem('downFiles', JSON.stringify(downFiles))
      } else {
        clearInterval(zipTimer)
        zipTimer = null
        clearInterval(timer)
        timer = null
        sessionStorage.removeItem('downFiles')
        sessionStorage.removeItem('downFiles')
        timerNum = 0
        // store.commit("SET_DOWNFILESINNER");
      }
    }
  }, 20)
  getMultiZip(blobs, fileNameList, fileNameList)
}
export default zipDownload

// 使用 zipDownload(fileList)
// filePath 为文件下载路径  fileName 为文件名称
