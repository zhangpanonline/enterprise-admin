import { fileURLToPath, URL } from 'node:url'
import { normalizePath } from 'vite'
import fg from 'fast-glob'
import nodePath from 'path'
import fs from 'fs-extra'
import getEtag from 'etag'
import cors from 'cors'
// https://juejin.cn/post/7062665648760946701
import { optimize } from 'svgo'
import SVGCompiler from 'svg-baker'
const XMLNS = 'http://www.w3.org/2000/svg'
const XMLNS_LINK = 'http://www.w3.org/1999/xlink'
const VIRTUAL_NAME = 'virtual:svg-icons'

export default function vitePluginVueSvgIcons(opt = {}) {
  const iconDirs = opt.iconDirs || [fileURLToPath(new URL('../assets/images', import.meta.url))]
  const prefix = opt.prefix || ''
  const cache = new Map()
  const customDomId = opt.customDomId || '__svg__icons__dom__'
  let isBuild = false
  return {
    // 插件名称
    name: 'vite-plugin-vue-svg-icons',
    configResolved(resolvedConfig) {
      isBuild = resolvedConfig.command === 'build'
    },
    resolveId(id) {
      return id === VIRTUAL_NAME ? id : null
    },
    async load(id) {
      if (id === VIRTUAL_NAME) {
        if (isBuild) {
          const code = await createModuleCode({ iconDirs, prefix, cache, customDomId })
          return code
        } else {
          return `export default {}`
        }
      }
    },
    configureServer: ({ middlewares }) => {
      middlewares.use(cors({ origin: '*' }))
      middlewares.use(async(req, res, next) => {
        const url = normalizePath(req.url)

        const registerId = `/@id/${VIRTUAL_NAME}`
        if ([registerId].some((item) => url.endsWith(item))) {
          res.setHeader('Content-Type', 'application/javascript')
          res.setHeader('Cache-Control', 'no-cache')
          const code = await createModuleCode({ iconDirs, prefix, cache, customDomId })

          res.setHeader('Etag', getEtag(code, { weak: true }))
          res.statusCode = 200
          res.end(code)
        } else {
          next()
        }
      })
    },
  }
}

async function createModuleCode({ iconDirs, prefix, cache, customDomId }) {
  let insertHtml = ''
  for (const dir of iconDirs) {
    const svgFilsStats = fg.sync('**/*.svg', {
      cwd: dir,
      stats: true,
      absolute: true,
    })
    for (const entry of svgFilsStats) {
      const { path, stats: { mtimeMs } = {}} = entry
      const cacheStat = cache.get(path)
      let relativeName = ''
      let symbolId
      let svgSymbol
      const getSymbol = async() => {
        /**
         * path = D:/workspace/bankruptcy/src/assets/images/video.svg
         * dir = D:/workspace/bankruptcy/src/assets/images
         * relativeName = video.svg
         */
        relativeName = normalizePath(path).replace(normalizePath(dir + '/'), '')
        let dirName = ''
        let fileName = relativeName
        if (normalizePath(fileName).includes('/')) {
          const strList = fileName.split('/')
          fileName = strList.pop()
          dirName = strList.join('-')
        }
        if (prefix) {
          symbolId = dirName ? (prefix + '-' + dirName + '-' + fileName) : (prefix + '-' + fileName)
        } else {
          symbolId = dirName ? (dirName + '-' + fileName) : fileName
        }
        symbolId = symbolId.replace(nodePath.extname(symbolId), '')
        let content = fs.readFileSync(path, 'utf-8')
        const { data } = await optimize(content)
        content = data || content
        // 解决不能通过父级改变svg颜色的问题
        content = content.replace(/stroke="[a-zA-Z#0-9]*"/g, 'stroke="currentColor"')
        content = content.replace(/fill="[a-zA-Z#0-9]*"/g, 'fill="currentColor"')
        const svgSymbolSrc = await new SVGCompiler().addSymbol({
          id: symbolId,
          content,
          path,
        })
        svgSymbol = svgSymbolSrc.render()
      }
      if (cacheStat) {
        if (cacheStat.mtimeMs !== mtimeMs) {
          await getSymbol()
        } else {
          svgSymbol = cacheStat.code
          symbolId = cacheStat.symbolId
        }
      } else {
        await getSymbol()
      }

      if (svgSymbol) {
        cache.set(path, {
          mtimeMs,
          relativeName,
          code: svgSymbol,
          symbolId,
        })
      }
      insertHtml += `${svgSymbol || ''}`
    }
  }
  const xmlns = `xmlns="${XMLNS}"`
  const xmlnsLink = `xmlns:xlink="${XMLNS_LINK}"`
  const html = insertHtml
    .replace(new RegExp(xmlns, 'g'), '')
    .replace(new RegExp(xmlnsLink, 'g'), '')
  const code = `
    if (typeof window !== 'undefined') {
      function loadSvg() {
        var body = document.body;
        var svgDom = document.getElementById('${customDomId}');
        if(!svgDom) {
          svgDom = document.createElementNS('${XMLNS}', 'svg');
          svgDom.style.position = 'absolute';
          svgDom.style.width = '0';
          svgDom.style.height = '0';
          svgDom.id = '${customDomId}';
          svgDom.setAttribute('xmlns','${XMLNS}');
          svgDom.setAttribute('xmlns:link','${XMLNS_LINK}');
        }
        svgDom.innerHTML = ${JSON.stringify(html)};
        body.insertBefore(svgDom, body.lastChild);
      }
      if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSvg);
      } else {
        loadSvg()
      }
    }
  `
  return `${code}\nexport default {}`
}
