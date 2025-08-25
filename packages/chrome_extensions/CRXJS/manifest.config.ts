import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    48: 'public/logo.png',
  },
  homepage_url: pkg.homepage,
  action: {
    default_icon: {
      48: 'public/logo.png',
    },
    default_popup: 'src/popup/index.html',
  },
  permissions: [
    'sidePanel',
    'contentSettings',
    'storage',
    // 允许监听请求
    'webRequest',
    'system.cpu',
    'notifications'
  ],
  host_permissions: ["https://*/*", "http://*/*"], // 允许访问的网站
  content_scripts: [{
    js: ['src/content/main.tsx'],
    matches: ['https://*/*'],
  }],
  side_panel: {
    default_path: 'src/sidepanel/index.html',
  },
  /**
   * 扩展的 后台逻辑运行环境，主要负责 长生命周期 的任务，比如：
   *    监听浏览器事件（标签切换、安装扩展、网络请求…）
   *    统一管理状态（比如存储用户登录信息、缓存数据）
   *    和 content_scripts、popup、options 页面进行消息通信
   *    调用需要扩展权限的 API（如 chrome.tabs, chrome.runtime, chrome.notifications 等）
   * 
   * content_scripts 在网页里运行，负责 操作 DOM、采集数据、与页面交互
   * background 在扩展后台运行，负责 全局逻辑、状态管理、权限 API、通信
   * Popup / Options 是用户界面，交互入口
   * 可以理解为：前端（content_scripts） + 后端（background） + UI（popup/options）
   * 
   * background 是 Service Worker事件驱动，非持久化
   *    不会常驻内存，只在有事件时唤醒（比如收到消息、点击插件图标）
   *    类似 Cloudflare Worker / Node.js 事件循环模型
   *    不能直接访问 DOM（因为它不运行在网页里）
   *    适合处理扩展级别的业务逻辑。
   */
  background: {
    "service_worker": "src/service-worker/index.ts",
    "type": "module"
  },
})
