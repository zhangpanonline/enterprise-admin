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
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue'
    },
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#5474f2',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    height: '50px',
    fontSize: '10px',
    iconWidth: '24px',
    spacing: '3px',
    list: [
      {
        iconPath: '/static/tabbar/home_default.png',
        selectedIconPath: '/static/tabbar/home_active.png',
        pagePath: 'pages/home/index',
        text: '首页',
      },
      {
        iconPath: '/static/tabbar/my_default.png',
        selectedIconPath: '/static/tabbar/my_active.png',
        pagePath: 'pages/list/index',
        text: '账单',
      },
      {
        iconPath: '/static/tabbar/my_default.png',
        selectedIconPath: '/static/tabbar/my_active.png',
        pagePath: 'pages/chart/index',
        text: '晚餐',
      },
      {
        iconPath: '/static/tabbar/my_default.png',
        selectedIconPath: '/static/tabbar/my_active.png',
        pagePath: 'pages/config/index',
        text: '配置',
      },
    ],
  },
});
