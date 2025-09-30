import { SYSTEM_EL_ID } from '@/constants'
import { useThemeConfigStore } from '@/store'
import { kebabCase } from 'lodash-es'
import { $adapter_width_unit } from './viewAdapterPlugin'

export function initTheme() {
  const themeConfigStore = useThemeConfigStore()
  const theme = themeConfigStore.themeConfig
  const aog_app_el = document.getElementById(SYSTEM_EL_ID)
  if (theme && aog_app_el) {
    for (const key in theme) {
      const _theme = theme as any
      let value = _theme[key]
      if (value.endsWith('px')) {
        const __value = value.replace('px', '')

        value = $adapter_width_unit(__value)
      }
      aog_app_el.style.setProperty(`--${kebabCase(key)}`, value)
    }
  }
}
