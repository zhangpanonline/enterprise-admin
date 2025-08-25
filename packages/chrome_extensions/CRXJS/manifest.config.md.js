import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  // 清单文件版本
  manifest_version: 3,
  // 插件名称
  name: 'CRXJS from scratch',
  // 插件版本
  version: '1.0.0',
  icons: {
    "16": "images/icon1-16.png",
    "32": "images/icon1-32.png",
    "48": "images/icon1-48.png",
    "128": "images/icon1-128.png"
  },
  action: {
    // 默认图标
    default_icon: {
      "16": "images/icon2-16.png",
      "32": "images/icon2-32.png",
      "48": "images/icon2-48.png",
      "128": "images/icon2-128.png"
    },
    default_title: 'hahaha', // 鼠标悬停时显示的文本
    // Popup 不能直接访问网页 DOM，但可以和 background、content_scripts 通信
    default_popup: 'popup/index.html', // 点击图标时弹出的页面
  },
  /**
   * 注入的脚本运行在 网页 DOM 中，可以直接操作页面元素
   * 但它不能直接访问网页里的 JS 全局变量（因为它运行在“隔离环境”里，叫 isolated world）
   * 如果要和页面的 JS 交互，需要用 window.postMessage 或者注入 <script> 标签
   * 
   * Content script 默认继承扩展的权限，但受 matches 限制
   * 可以访问的API：https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts#capabilities
   * 
   * 可以通过 chrome.runtime.sendMessage 或 chrome.runtime.onMessage 与后台（background）通信。
   */
  content_scripts: [
    {
      matches: ['*://*/*'], // 用来匹配需要注入的页面 URL，支持通配符，格式：<scheme>://<host>/<path>
      // exclude_matches: [], // 排除的页面
      js: ['content.js'], // 注入的 JS 文件
      // css: ['content.css'], // 注入的 CSS 文件
      run_at: "document_start", // 决定脚本注入的时机：document_start => 在文档开始加载时注入（DOM 未生成前）,document_end => 在 DOM 加载完成后注入, document_idle => 在 DOM 加载完成后，延迟到页面空闲时注入
      all_frames: false, // 是否在页面的所有 frame / iframe 里注入，默认只在顶层 frame 注入，默认为 false
      match_about_blank: false, // 是否注入到 about:blank 或 data: URL 的 iframe 中，默认为 false
    }
  ],
  options_ui: {
    page: "options.html",
    open_in_tab: true   // true = 在新标签页打开，false = 在弹窗里打开（默认）
  },
  homepage_url: "https://github.com/crxjs/vite-plugin",
  // update_url: '' // 自动更新扩展时，需要指定一个 URL，用来获取扩展的最新版本。私发 / 企业扩展才需要这个字段。
  permissions: ['storage', 'contextMenus' /** 右键菜单 */, 'notifications' /** 桌面通知 */, 
    // 允许监听请求
    'webRequest',
    // 允许同步阻塞并修改请求
    // 'webRequestBlocking'
    'notifications'
  ],
  host_permissions: ["https://*/*", "http://*/*"],
  chrome_url_overrides: {
    newtab: 'index.html'
  }
})
