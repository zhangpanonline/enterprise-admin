import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages';
import { name } from './package.json';

/**
 * 全局配置
 */
export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: name,
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
    },
  },
  tabBar: {
    color: '#666666',
    selectedColor: '#1A65EE',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    height: '65px',
    fontSize: '10px',
    iconWidth: '20px',
    spacing: '10px',
    list: [
      {
        iconPath: 'static/tabbar/home_default.png',
        selectedIconPath: 'static/tabbar/home_active.png',
        pagePath: 'pages/home/index',
        text: '首页',
      },
      {
        iconPath: 'static/tabbar/monitor_default.png',
        selectedIconPath: 'static/tabbar/monitor_active.png',
        pagePath: 'pages/monitor/index',
        text: '电量监测',
      },
      {
        iconPath: 'static/tabbar/points_default.png',
        selectedIconPath: 'static/tabbar/points_active.png',
        pagePath: 'pages/points/index',
        text: '积分中心',
      },
      {
        iconPath: 'static/tabbar/my_default.png',
        selectedIconPath: 'static/tabbar/my_active.png',
        pagePath: 'pages/my/index',
        text: '我的',
      },
    ],
  },
});
