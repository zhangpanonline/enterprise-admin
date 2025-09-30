import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ThemeType } from '@/types/index'
import { getFileUrl } from '@/utils/fileUrl'
/**
 * 系统主题配置
 */
export const useThemeConfigStore = defineStore('themeConfig', () => {
  //  主题配置
  const _themeConfig = ref<ThemeType>({
    // herder背景色
    aogAppHeaderBgColor: '#363840',
    // 基本背景色
    aogAppBaseBgColor: '#50535c',
    // 基本背景色1
    aogAppBaseBgColor1: '#50525c',
    // 基本字体颜色
    aogAppBaseFontColor: '#ffffff',
    // 标题字体颜色
    aogAppBaseTitleFontColor: '#ffffffcc',
    // 描述字体颜色
    aogAppBaseDescFontColor: '#ffffff99',
    // 基本字体大小
    aogAppBaseFontSize: '14px',
    // 标题字体大小
    aogAppBaseTitleFontSize: '16px',
    // 买入颜色
    aogAppBaseBuyColor: '#00c164',
    // 卖出颜色
    aogAppBaseSellColor: '#f85f34',
    // 供应字体颜色
    aogAppBaseSupplyFontColor: '#41aaff',
    // 供应背景颜色
    aogAppBaseSupplyBgColor: '#9fd4ff0f',
    // 需求字体颜色
    aogAppBaseDemandFontColor: '#ffb325',
    // 需求背景颜色
    aogAppBaseDemandBgColor: '#ffcc9f0f',
    // 最小高度
    aogAppMinHeight: '863px',
    // 最小宽度 1640
    aogAppMinWidth: '1440px',
    // 头部高度
    aogAppHeaderHeight: '52px',
    // 弹窗圆角
    aogAppPopupBorderRadius: '20px',
    // 弹窗左右内间距
    aogAppPopupPadding: '20px',
    // 弹窗上下内间距
    aogAppPopupPadding1: '15px',
    // 申报交易记录宽度
    aogAppRecordWidth: '330px',
    // 申报交易记录背景颜色
    aogAppRecordBgColor: '#3D3F46',
    // 交易记录的边框颜色
    aogAppRecordBorderColor: '#FFFFFF1A',
    // 申报交易记录标题高度
    aogAppRecordHeaderHeight: '52px',
    // 内容区域头部高度
    aogAppContentHeaderHeight: '79px',
    // 表格区域背景色
    aogAppTableContentBgColor: '#5E616C',
    // 输入框背景色
    aogAppInputBgColor: '#656772',
    // 表格区域边框颜色
    aogAppTableContentBorderColor: '#FFFFFF26',
    // 弹窗背景色
    aogAppDialogBgColor: 'var(--aog-app-record-bg-color)',
    // element-ui 样式变量 */
    aogElColorPrimary: '#33A3FF',
    aogElBgColorOverlay: '#656771',
    aogElBorderColorLight: '#FFFFFF11',
    aogElColorPrimaryLight9: 'var(--aog-el-bg-color-overlay)',
    aogElFillColorBlank: 'var(--aog-app-input-bg-color)',
    aogElBorderColor: 'var(--aog-el-fill-color-blank)',
    aogElBorderColorHover: 'var(--aog-el-color-primary)',
    aogElBorderColorLighter: '#767882',
    aogElTextColorSecondary: 'var(--aog-app-base-font-color)',
    aogElFillColorLight: '#FFFFFF03',
    aogElColorInfoLight9: '#7C7E83',
    aogElDisabledBgColor: '#7C7E83',
    aogElDisabledBorderColor: '#7C7E83',
    //  图片地址
    aogAppImageContentContainerHeaderBg: `url(${getFileUrl('/images/content-header-bg.png')})`,
    aogAppImageContentTitleBg: `url(${getFileUrl('/images/content-title-bg.png')})`,
    aogAppImageMimTitleBg: `url(${getFileUrl('/images/mim-title-bg.png')})`,
  })

  const themeConfig = computed(() => _themeConfig.value)
  const setThemeConfig = (value: ThemeType) => {
    _themeConfig.value = value
  }
  return { themeConfig, setThemeConfig }
})
