import PhotoSwipe from 'photoswipe'
import obsDownload from '@/components/HuaweiObsUpload/obsDownload.js'
const VITE_OBS_URL = import.meta.env.VITE_OBS_URL
// 图片预览
// list 为对象格式的数组
// 对象属性
// url 图片地址
// name 图片名称
var photoSwipe = null
const options = {
  showHideAnimationType: 'none',
  index: 0,
  dataSource: [],
  source: [],
}
function handleDataSource(dataSource) {
  if (Array.isArray(dataSource) && dataSource.length > 0) {
    return dataSource.map(v => ({
      html: `
        <div class="w-full h-full flex justify-center items-center relative" >
          <img src="${v.url}" alt="${v.name}" class="w-3/5 mx-auto" />
          <svg id="previewDownload" class="absolute top-4.5 right-12.5 cursor-pointer font-black text-[#dbdbdb]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024"><path fill="currentColor" d="M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64zm384-253.696l236.288-236.352l45.248 45.248L508.8 704L192 387.2l45.248-45.248L480 584.704V128h64v450.304z"/></svg>
        </div>
      `,
    }))
  } else {
    return []
  }
}
export default function usePreviewImage(dataSource) {
  options.dataSource = handleDataSource(dataSource)
  options.source = dataSource
  function onPreviewImage(index = 0, newDataSource) {
    if (photoSwipe) {
      photoSwipe.destroy()
      photoSwipe = null
    }
    options.index = index
    if (Array.isArray(newDataSource) && newDataSource.length > 0) {
      options.dataSource = handleDataSource(newDataSource)
      options.source = newDataSource
    }
    photoSwipe = new PhotoSwipe(options)
    photoSwipe.on('contentActivate', ({ content }) => {
      content.element.querySelector('#previewDownload').onclick = function() {
        const ind = content.instance.currIndex
        const { url, name } = options.source[ind]
        obsDownload(url.replace(VITE_OBS_URL, ''), name)
      }
    })
    photoSwipe.init()
  }
  onUnmounted(() => {
    if (photoSwipe) {
      photoSwipe.destroy()
      photoSwipe = null
    }
  })
  return { onPreviewImage }
}
