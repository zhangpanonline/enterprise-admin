import ImageCompressor from 'compressorjs'
export default function(file, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    new ImageCompressor(file, {
      quality: 0.8,
      maxWidth: 1500,
      maxHeight: 1500,
      redressOrientation: false,

      // 压缩前回调
      beforeCompress: function(result) {
        console.log('压缩之前图片尺寸大小: ', result.size)
        console.log('mime 类型: ', result.type)
      },

      success: function(result) {
        console.log('压缩之后图片尺寸大小: ', result.size)
        console.log('mime 类型: ', result.type)
        console.log('实际压缩率： ', ((file.size - result.size) / file.size * 100).toFixed(2) + '%')
        resolve(result)
      },
      error(e) {
        reject(e)
      },
    })
  })
}
